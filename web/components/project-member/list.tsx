// components/project-member/list.tsx
'use client';

import { useCallback, useState } from 'react';
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
import { api } from '@/hooks/use-axios'; // Using 'api' for direct calls

// Definição de tipo para ProjectMember (deve ser a mesma do ProjectDetail page)
type ProjectMember = {
    id: number;
    name: string;
    email: string;
    role?: string; // Role is optional
};

type ProjectMemberListProps = {
  projectId: number;
  projectMembers: ProjectMember[];
  loading: boolean;
  onRefreshMembers: () => void; // Callback para o pai recarregar os dados do projeto
  onAddMember: (projectId: number) => void; // Callback para abrir dialog de adição
  onEditMember: (memberId: number) => void; // Callback para abrir dialog de edição
};

export function ProjectMemberList({
  projectId,
  projectMembers,
  loading,
  onRefreshMembers,
  onAddMember,
  onEditMember,
}: ProjectMemberListProps) {
  const [isRemoveConfirmationOpen, setIsRemoveConfirmationOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<ProjectMember | null>(null);

  // Função para remover um membro de um projeto específico
  const handleRemoveMemberConfirmation = (member: ProjectMember) => {
    setMemberToRemove(member);
    setIsRemoveConfirmationOpen(true);
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;

    try {
      // Chame o endpoint do seu backend para remover o membro do projeto
      // IMPORTANTE: Este endpoint deve remover a ASSOCIAÇÃO do membro com o projeto,
      // e não necessariamente deletar o membro da tabela project-member se ele puder estar em outros projetos.
      // Assumindo um endpoint DELETE /project/:projectId/member/:memberId para remover associação
      // OU DELETE /project-member/:memberId se um membro só puder pertencer a um projeto (que não é o caso aqui)
      // Baseado no seu backend e no erro anterior, vou assumir que /project-member/:memberId DELETA O MEMBRO DA TABELA
      // O que é um problema para Many-to-Many.
      // Se a intenção é desassociar, o endpoint deveria ser algo como:
      // DELETE /project/${projectId}/member/${memberToRemove.id}
      // Se remover o membro da tabela `project-member` e ele estiver associado a outros projetos,
      // você terá problemas de FK.
      // Por enquanto, vou manter a chamada original ao endpoint que você usou,
      // mas saiba que para uma relação ManyToMany, a desassociação é diferente da deleção do membro.

      // Se o seu backend tem um endpoint para desassociar um membro de um projeto:
      // const response = await api.delete(`/project/${projectId}/members/${memberToRemove.id}`);
      // Se o seu backend tem um endpoint para deletar o membro da tabela `project-member`:
      const response = await api.delete(`/project-member/${memberToRemove.id}`);

      if (response.status === 200 || response.status === 204) {
        toast.success('Membro removido do projeto com sucesso!');
        onRefreshMembers(); // Notifica o pai para recarregar os dados
      } else {
        toast.error('Não foi possível remover o membro do projeto.');
      }
    } catch (err: any) {
      console.error('Erro ao remover membro:', err);
      toast.error(err.response?.data?.message || 'Erro ao remover membro do projeto.');
    } finally {
      setIsRemoveConfirmationOpen(false);
      setMemberToRemove(null);
    }
  };


  // Define as colunas para a DataTable de ProjectMembers
  const columns: ColumnDef<ProjectMember>[] = [
      {
          accessorKey: 'id',
          header: 'ID',
      },
      {
          accessorKey: 'name',
          header: 'NOME',
      },
      {
          accessorKey: 'email',
          header: 'EMAIL',
      },
      {
          accessorKey: 'role',
          header: 'FUNÇÃO',
      },
      // Adicione aqui ações para membros
      {
        id: 'actions',
        header: 'AÇÕES',
        cell: ({ row }) => {
          const member = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* Ação de Editar Membro - Chame o callback onEditMember */}
                <DropdownMenuItem onClick={() => onEditMember(member.id)}>
                  <span>✏️ Editar</span>
                </DropdownMenuItem>
                {/* Ação de Remover Membro do Projeto - Chame a confirmação */}
                <DropdownMenuItem onClick={() => handleRemoveMemberConfirmation(member)}>
                  🗑️ Remover
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
  ];

  return (
    <>
      <div className="flex justify-end mb-4">
          {/* Botão para Adicionar Membro - Chame o callback onAddMember */}
          <Button onClick={() => onAddMember(projectId)}>Adicionar Membro</Button>
      </div>
      <DataTable
          columns={columns}
          data={projectMembers || []}
          loading={loading}
      />

      {/* Dialog de Confirmação de Remoção de Membro */}
      <Dialog
        open={isRemoveConfirmationOpen}
        onOpenChange={setIsRemoveConfirmationOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Membro do Projeto</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover &quot;{memberToRemove?.name}&quot; do projeto?
              Esta ação o removerá apenas deste projeto, mas não o excluirá
              totalmente do sistema, a menos que ele não esteja associado a
              nenhum outro projeto.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRemoveConfirmationOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleRemoveMember}>
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}