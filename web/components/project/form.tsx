'use client';

import { z } from 'zod';
import { DynamicForm, FormFieldConfig } from '@/components/ui/dynamic-form';

// Define the Zod schema for project validation
export const projectFormSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
});

// Define the props for the ProjectForm component
interface ProjectFormProps {
  defaultValues: z.infer<typeof projectFormSchema>;
  onSubmit: (values: z.infer<typeof projectFormSchema>) => void;
  submitButtonText: string;
}

export function ProjectForm({
  defaultValues,
  onSubmit,
  submitButtonText,
}: ProjectFormProps) {
  // Define the form field configuration
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
      formSchema={projectFormSchema}
      formFields={formFields}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      submitButtonText={submitButtonText}
    />
  );
}
