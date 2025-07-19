'use client';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useAxios } from '@/hooks/use-axios';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { useEffect, useCallback } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { AutoBreadcrumb } from '@/components/ui/breadcrumb';

type Project = {
  id: string;
  name: string;
};

const Page = () => {
  const { data, loading, request } = useAxios<Project[] | null>();

  // Função para carregar a lista
  const fetchProjects = useCallback(() => {
    request({ url: '/project', method: 'GET' });
  }, [request]);

  // Carregar os dados ao montar
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Função para deletar um projeto e atualizar a lista
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

  return (
    <div className="container mx-auto py-10">
      <AutoBreadcrumb items={[{ label: 'Projetos', href: '/project' }]} />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lista de Projetos</h1>
        <Link href="/project/add">
          <Button>Adicionar</Button>
        </Link>
      </div>

      <DataTable columns={columns} data={data || []} loading={loading} />
    </div>
  );
};

export default Page;
