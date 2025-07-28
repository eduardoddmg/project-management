'use client';

import { z } from 'zod';
import { DynamicForm, FormFieldConfig } from '@/components/ui/dynamic-form';

export const formSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
});

interface FormProps {
  defaultValues: z.infer<typeof formSchema>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  submitButtonText: string;
}

export function ProjectForm({
  defaultValues,
  onSubmit,
  submitButtonText,
}: FormProps) {
  const formFields: FormFieldConfig[] = [
    {
      name: 'name',
      label: 'Nome do projeto',
      type: 'input',
      placeholder: 'Digite o nome do projeto...',
    },
  ];

  return (
    <DynamicForm
      formSchema={formSchema}
      formFields={formFields}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      submitButtonText={submitButtonText}
    />
  );
}
