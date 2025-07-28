import { DataTable } from '../ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useAxios } from '@/hooks/use-axios';
import { useCallback, useEffect } from 'react';
import { ActionDropdown, ActionItem } from '../ui/action-dropdown';
import { Pen, Trash } from 'lucide-react';

type Project = {
  id: string;
  name: string;
};

export const ProjectList = () => {
  const { data, loading, request } = useAxios<Project[] | null>();

  const fetchProjects = useCallback(() => {
    request({ url: '/project', method: 'GET' });
  }, [request]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (id: string) => {
    const response = await request({
      url: `/project/${id}`,
      method: 'DELETE',
    });

    if (response?.status === 200 || response?.status === 204) {
      fetchProjects();
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

        const projectActions: ActionItem[] = [
          {
            type: 'edit',
            label: 'Editar',
            icon: Pen,
            link: `/project/edit/${project.id}`,
          },
          {
            type: 'delete',
            label: 'Excluir',
            icon: Trash,
            onClick: handleDelete, // Passa a referência da função
          },
        ];

        return (
          <ActionDropdown
            itemId={project.id}
            itemName={project.name}
            actions={projectActions}
          />
        );
      },
    },
  ];

  return <DataTable columns={columns} data={data || []} loading={loading} />;
};
