'use client';

import { useEffect, useCallback, useState } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAxios } from '@/hooks/use-axios'; // Assuming useAxios handles 'api' for direct calls

type Project = {
  id: string;
  name: string;
};

type ProjectListProps = {
  onAddProject: () => void;
  onEditProject: (projectId: string) => void;
  // New prop to trigger a refresh
  refreshTrigger: number;
};

export function ProjectList({ onAddProject, onEditProject, refreshTrigger }: ProjectListProps) {
  const { data, loading, request } = useAxios<Project[] | null>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Function to load the project list
  const fetchProjects = useCallback(() => {
    request({ url: '/project', method: 'GET' });
  }, [request]);

  // Load data on mount and whenever refreshTrigger changes
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects, refreshTrigger]); // Add refreshTrigger as a dependency

  // Function to handle project deletion
  const handleDeleteConfirmation = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (projectToDelete) {
      const response = await request({
        url: `/project/${projectToDelete.id}`,
        method: 'DELETE',
      });

      if (response?.status === 200 || response?.status === 204) {
        toast.success('Projeto removido com sucesso!');
        fetchProjects(); // Re-fetch after successful deletion
      } else {
        toast.error('Não foi possível remover o projeto.');
      }
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'name',
      header: 'NOME',
    },
    {
      id: 'actions',
      header: 'AÇÕES',
      cell: ({ row }) => {
        const project = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                {/* Note: If /project/[id] is a separate page, this link is fine.
                    If you intend to show details in a dialog, you'd adjust this. */}
                <Link href={`/project/${project.id}`}>
                  <span>🔍 Ver Detalhes</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditProject(project.id)}>
                <span>✏️ Editar</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteConfirmation(project)}
              >
                🗑️ Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lista de Projetos</h1>
        <Button onClick={onAddProject}>Adicionar Projeto</Button>
      </div>

      <DataTable columns={columns} data={data || []} loading={loading} />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Você tem certeza?</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. Isso removerá permanentemente o
              projeto &quot;{projectToDelete?.name}&quot; e todos os seus dados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}