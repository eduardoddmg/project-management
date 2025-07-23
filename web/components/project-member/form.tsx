'use client';

import { z } from 'zod';
import { DynamicForm, FormFieldConfig } from '@/components/ui/dynamic-form'; // Assumindo que DynamicForm é um componente genérico de formulário

// Esquema Zod para validação do formulário de membro de projeto
export const projectMemberFormSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  email: z.string().email('E-mail inválido.').min(1, 'O e-mail é obrigatório.'),
  role: z.string().optional(), // Role é opcional
});

// Props para o componente ProjectMemberForm
interface ProjectMemberFormProps {
  defaultValues: z.infer<typeof projectMemberFormSchema>;
  onSubmit: (values: z.infer<typeof projectMemberFormSchema>) => void;
  submitButtonText: string;
}

/**
 * Componente de formulário reutilizável para criar ou editar membros de projeto.
 * Utiliza o DynamicForm para renderizar campos baseados em uma configuração.
 */
export function ProjectMemberForm({
  defaultValues,
  onSubmit,
  submitButtonText,
}: ProjectMemberFormProps) {
  // Configuração dos campos do formulário
  const formFields: FormFieldConfig[] = [
    {
      name: 'name',
      label: 'Nome do Membro',
      type: 'input',
      placeholder: 'Digite o nome do membro...',
    },
    {
      name: 'email',
      label: 'E-mail do Membro',
      type: 'input',
      placeholder: 'Digite o e-mail do membro...',
    },
    {
      name: 'role',
      label: 'Função no Projeto (Opcional)',
      type: 'input',
      placeholder: 'Ex: Desenvolvedor, Gerente, QA...',
    },
  ];

  return (
    <DynamicForm
      formSchema={projectMemberFormSchema}
      formFields={formFields}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      submitButtonText={submitButtonText}
    />
  );
}
