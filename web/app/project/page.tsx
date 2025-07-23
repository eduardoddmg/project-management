'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';

import { AutoBreadcrumb } from '@/components/ui/breadcrumb';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAxios, api } from '@/hooks/use-axios';
import { ProjectForm, projectFormSchema } from '@/components/project/form';
import { ProjectList } from '@/components/project/list'; // Corrected import path

type Project = {
  id: string;
  name: string;
};

export default function ProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // New state to trigger refresh

  const {
    data: projectToEdit,
    loading: loadingProjectToEdit,
    request: fetchProjectToEdit,
  } = useAxios<Project>();

  // Function to trigger refresh in ProjectList
  const triggerListRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  // Check URL params for edit/add dialog state
  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      setIsAddEditDialogOpen(true);
    } else if (searchParams.get('action') === 'edit' && searchParams.get('id')) {
      const id = searchParams.get('id');
      setEditingProjectId(id);
      setIsEditDialogOpen(true);
      fetchProjectToEdit({ url: `/project/${id}`, method: 'GET' });
    }
  }, [searchParams, fetchProjectToEdit]);

  // --- Add Project Handlers ---
  const handleOpenAddDialog = () => {
    setIsAddEditDialogOpen(true);
    router.push('/project?action=add');
  };

  const handleCloseAddDialog = () => {
    setIsAddEditDialogOpen(false);
    router.push('/project'); // Clear URL parameter
  };

  async function handleAddSubmit(values: z.infer<typeof projectFormSchema>) {
    const response = await api.post('/project', values);

    if (response?.status === 201) {
      toast.success('Projeto adicionado com sucesso!');
      handleCloseAddDialog();
      triggerListRefresh(); // Trigger refresh after adding
    } else {
      toast.error('Não foi possível adicionar o projeto.');
    }
  }

  // --- Edit Project Handlers ---
  const handleOpenEditDialog = (id: string) => {
    setEditingProjectId(id);
    setIsEditDialogOpen(true);
    router.push(`/project?action=edit&id=${id}`);
    fetchProjectToEdit({ url: `/project/${id}`, method: 'GET' });
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingProjectId(null);
    router.push('/project'); // Clear URL parameters
  };

  async function handleEditSubmit(values: z.infer<typeof projectFormSchema>) {
    if (!editingProjectId) return;

    const response = await api.patch(`/project/${editingProjectId}`, values);

    if (response?.status === 200) {
      toast.success('Projeto editado com sucesso!');
      handleCloseEditDialog();
      triggerListRefresh(); // Trigger refresh after editing
    } else {
      toast.error('Não foi possível editar o projeto.');
    }
  }

  return (
    <div className="container mx-auto py-10">
      <AutoBreadcrumb items={[{ label: 'Projetos', href: '/project' }]} />

      <ProjectList
        onAddProject={handleOpenAddDialog}
        onEditProject={handleOpenEditDialog}
        refreshTrigger={refreshKey} // Pass the refreshKey
      />

      {/* Add Project Dialog */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={handleCloseAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Projeto</DialogTitle>
          </DialogHeader>
          <ProjectForm
            defaultValues={{ name: '' }}
            onSubmit={handleAddSubmit}
            submitButtonText="Adicionar Projeto"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleCloseEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Projeto</DialogTitle>
          </DialogHeader>
          {loadingProjectToEdit ? (
            <p>Carregando dados do projeto...</p>
          ) : projectToEdit ? (
            <ProjectForm
              defaultValues={{ name: projectToEdit.name }}
              onSubmit={handleEditSubmit}
              submitButtonText="Salvar Alterações"
            />
          ) : (
            <p>Não foi possível carregar o projeto para edição.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}