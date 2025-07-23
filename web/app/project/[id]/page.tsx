// app/project/[id]/page.tsx
'use client';

import { useAxios, api } from "@/hooks/use-axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { AutoBreadcrumb } from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProjectMemberList } from '@/components/project-member/list'; // Import the new list component
import { ProjectMemberForm, projectMemberFormSchema } from '@/components/project-member/form'; // Import form and schema
import { z } from "zod";

// Definição de tipo para ProjectMember (deve ser consistente em todos os arquivos)
type ProjectMember = {
    id: number;
    name: string;
    email: string;
    role?: string;
};

// Definição de tipo para Project
type Project = {
    id: number;
    name: string;
    projectMembers: ProjectMember[];
};

const Page = () => {
    const { id } = useParams(); // Project ID from URL
    const router = useRouter();
    const searchParams = useSearchParams(); // To handle dialog states via URL params

    // Fetch project data (including its members)
    const { data: projectData, request, loading, error } = useAxios<Project>();
    const [activeTab, setActiveTab] = useState('content'); // State for active tab

    // State for Project Member Dialogs
    const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
    const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false);
    const [editingMemberId, setEditingMemberId] = useState<number | null>(null);

    // Fetch details of the member being edited
    const {
      data: memberToEdit,
      loading: loadingMemberToEdit,
      request: fetchMemberToEdit
    } = useAxios<ProjectMember>();

    // Function to load the project data (which includes members)
    const fetchProjectData = useCallback(() => {
        if (id) {
            request({ url: `/project/${id}`, method: 'GET' });
        }
    }, [id, request]);

    // Effect to fetch project data on component mount or ID change
    useEffect(() => {
        fetchProjectData();
    }, [fetchProjectData]);

    // Effect to handle URL parameters for member dialogs
    useEffect(() => {
      const action = searchParams.get('memberAction');
      const memberId = searchParams.get('memberId');

      if (action === 'add') {
        setIsAddMemberDialogOpen(true);
      } else if (action === 'edit' && memberId) {
        setEditingMemberId(Number(memberId));
        setIsEditMemberDialogOpen(true);
        fetchMemberToEdit({ url: `/project-member/${memberId}`, method: 'GET' });
      } else {
        setIsAddMemberDialogOpen(false);
        setIsEditMemberDialogOpen(false);
        setEditingMemberId(null);
      }
    }, [searchParams, fetchMemberToEdit]);


    // --- Project Member Dialog Handlers ---

    const handleOpenAddMemberDialog = (projectId: number) => {
      setIsAddMemberDialogOpen(true);
      // You might want to pass the project ID to the add form if it's needed there
      router.push(`/project/${projectId}?memberAction=add`);
    };

    const handleCloseAddMemberDialog = () => {
      setIsAddMemberDialogOpen(false);
      router.push(`/project/${id}`); // Clear URL param
    };

    const handleOpenEditMemberDialog = (memberId: number) => {
      setEditingMemberId(memberId);
      setIsEditMemberDialogOpen(true);
      router.push(`/project/${id}?memberAction=edit&memberId=${memberId}`);
    };

    const handleCloseEditMemberDialog = () => {
      setIsEditMemberDialogOpen(false);
      setEditingMemberId(null);
      router.push(`/project/${id}`); // Clear URL params
    };

    // --- Submit handlers for ProjectMemberForm ---

    async function handleAddMemberSubmit(values: z.infer<typeof projectMemberFormSchema>) {
      if (!projectData?.id) {
        toast.error('Erro: ID do projeto não disponível.');
        return;
      }
      try {
        // Assuming your API endpoint to add a member to a project is something like:
        // POST /project/:projectId/members with member details in body
        // OR POST /project-member with member details, and then associate
        // If it's creating a new member and associating them immediately:
        const response = await api.post(`/project-member`, {
          ...values,
          projectId: projectData.id // Ensure projectId is sent if your backend needs it to create the association
        });

        if (response.status === 201) {
          toast.success('Membro adicionado ao projeto com sucesso!');
          handleCloseAddMemberDialog();
          fetchProjectData(); // Refresh project data to show new member
        } else {
          toast.error('Não foi possível adicionar o membro ao projeto.');
        }
      } catch (err: any) {
        console.error('Erro ao adicionar membro:', err);
        toast.error(err.response?.data?.message || 'Erro ao adicionar membro ao projeto.');
      }
    }

    async function handleEditMemberSubmit(values: z.infer<typeof projectMemberFormSchema>) {
      if (!editingMemberId) {
        toast.error('Erro: ID do membro para edição não disponível.');
        return;
      }
      try {
        // Assuming your API endpoint to update a project member is PATCH /project-member/:id
        const response = await api.patch(`/project-member/${editingMemberId}`, values);

        if (response.status === 200) {
          toast.success('Membro editado com sucesso!');
          handleCloseEditMemberDialog();
          fetchProjectData(); // Refresh project data to show updated member info
        } else {
          toast.error('Não foi possível editar o membro.');
        }
      } catch (err: any) {
        console.error('Erro ao editar membro:', err);
        toast.error(err.response?.data?.message || 'Erro ao editar membro.');
      }
    }

    if (loading) {
        return <div className="container mx-auto py-10">Carregando projeto...</div>;
    }

    if (error) {
        return <div className="container mx-auto py-10 text-red-500">Erro ao carregar projeto: {error.message || 'Erro desconhecido'}</div>;
    }

    if (!projectData) {
        return <div className="container mx-auto py-10">Projeto não encontrado.</div>;
    }

    // Breadcrumb items
    const breadcrumbItems = [
        { label: 'Projetos', href: '/project' },
        { label: projectData.name, href: `/project/${projectData.id}` },
    ];

    return (
        <div className="container mx-auto py-10">
            <AutoBreadcrumb items={breadcrumbItems} />

            <h1 className="text-3xl font-bold mb-6">{projectData.name}</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="content">Conteúdo do Projeto</TabsTrigger>
                    <TabsTrigger value="members">Membros do Projeto</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalhes do Projeto</CardTitle>
                            <CardDescription>Informações gerais sobre o projeto.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p><strong>ID:</strong> {projectData.id}</p>
                            <p><strong>Nome:</strong> {projectData.name}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="members" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Membros do Projeto</CardTitle>
                            <CardDescription>Lista de todos os membros associados a este projeto.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <ProjectMemberList
                                projectId={projectData.id}
                                projectMembers={projectData.projectMembers || []}
                                loading={loading}
                                onRefreshMembers={fetchProjectData} // Callback para recarregar os dados do projeto pai
                                onAddMember={handleOpenAddMemberDialog} // Passa a função para abrir o dialog de adicionar
                                onEditMember={handleOpenEditMemberDialog} // Passa a função para abrir o dialog de editar
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Dialog para Adicionar Membro */}
            <Dialog open={isAddMemberDialogOpen} onOpenChange={handleCloseAddMemberDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Membro ao Projeto</DialogTitle>
                </DialogHeader>
                <ProjectMemberForm
                  defaultValues={{ name: '', email: '', role: '' }}
                  onSubmit={handleAddMemberSubmit}
                  submitButtonText="Adicionar Membro"
                />
              </DialogContent>
            </Dialog>

            {/* Dialog para Editar Membro */}
            <Dialog open={isEditMemberDialogOpen} onOpenChange={handleCloseEditMemberDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Membro do Projeto</DialogTitle>
                </DialogHeader>
                {loadingMemberToEdit ? (
                  <p>Carregando dados do membro...</p>
                ) : memberToEdit ? (
                  <ProjectMemberForm
                    defaultValues={{ name: memberToEdit.name, email: memberToEdit.email, role: memberToEdit.role }}
                    onSubmit={handleEditMemberSubmit}
                    submitButtonText="Salvar Alterações"
                  />
                ) : (
                  <p>Não foi possível carregar o membro para edição.</p>
                )}
              </DialogContent>
            </Dialog>
        </div>
    );
};

export default Page;