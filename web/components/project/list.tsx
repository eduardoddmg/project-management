import Link from 'next/link';
import { Button } from '../ui/button';
import { DataTable } from '../ui/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAxios } from '@/hooks/use-axios';
import { useCallback, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';

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

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Ações</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/project/edit/${project.id}`}>
                  <span>✏️ Editar</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(project.id)}>
                🗑️ Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return <DataTable columns={columns} data={data || []} loading={loading} />;
};
