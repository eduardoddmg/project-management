export type ActionType = 'edit' | 'delete' | 'custom';

export interface ActionItem {
  type: ActionType;
  label: string;
  icon?: React.ElementType;
  link?: string;
  onClick?: (id: string) => void;
}

import React from 'react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog';
import { Button } from './button';
import { MoreHorizontal } from 'lucide-react';

interface ActionDropdownProps {
  itemId: string;
  itemName: string;
  actions: ActionItem[];
}

export const ActionDropdown: React.FC<ActionDropdownProps> = ({
  itemId,
  itemName,
  actions,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <MoreHorizontal className="h-4 w-4" />{' '}
          {/* Adicione classes de tamanho ao ícone */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action, index) => {
          // Renderiza o ícone se ele existir
          const IconComponent = action.icon; // Pega a referência do componente do ícone

          if (action.type === 'edit' || action.type === 'custom') {
            return (
              <DropdownMenuItem key={index} asChild>
                {action.link ? (
                  <Link href={action.link} className="flex items-center gap-2">
                    {' '}
                    {/* Adicione flex para alinhar ícone e texto */}
                    {IconComponent && (
                      <IconComponent className="h-4 w-4" />
                    )}{' '}
                    {/* Renderiza o componente do ícone */}
                    {action.label}
                  </Link>
                ) : (
                  <span
                    onClick={() => action.onClick && action.onClick(itemId)}
                    className="flex items-center gap-2"
                  >
                    {IconComponent && <IconComponent className="h-4 w-4" />}{' '}
                    {/* Renderiza o componente do ícone */}
                    {action.label}
                  </span>
                )}
              </DropdownMenuItem>
            );
          } else if (action.type === 'delete') {
            return (
              <AlertDialog key={index}>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="flex items-center gap-2"
                  >
                    {IconComponent && <IconComponent className="h-4 w-4" />}{' '}
                    {/* Renderiza o componente do ícone */}
                    {action.label}
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso excluirá
                      permanentemente o item **{itemName}**.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => action.onClick && action.onClick(itemId)}
                    >
                      {action.label}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            );
          }
          return null;
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
