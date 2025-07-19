'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AutoBreadcrumb } from '@/components/ui/breadcrumb';
import { useAxios } from '@/hooks/use-axios';
import { ProjectForm, projectFormSchema } from '@/components/project/form'; // Import the new component and schema
import { z } from 'zod';

export default function AddProjectPage() {
  const { request } = useAxios<{
    id: number;
    name: string;
  }>();

  const router = useRouter();

  // Handle form submission for creating a new project
  async function handleFormSubmit(values: z.infer<typeof projectFormSchema>) {
    const response = await request({
      url: '/project',
      method: 'POST',
      data: values,
    });

    if (response) {
      console.log('Projeto criado:', response.data);
      toast.success('Projeto adicionado com sucesso');
      router.push('/project');
    } else {
      toast.error('Não foi possível adicionar o projeto');
    }
  }

  return (
    <div className="container mx-auto py-10 ">
      <AutoBreadcrumb
        items={[
          { label: 'Projetos', href: '/project' },
          {
            label: 'Adicionar projeto',
            href: '',
          },
        ]}
      />
      <h1 className="text-2xl font-bold mb-6">Adicionar projeto</h1>
      <ProjectForm
        defaultValues={{ name: '' }} // Default empty value for new project
        onSubmit={handleFormSubmit}
        submitButtonText="Adicionar projeto"
      />
    </div>
  );
}
