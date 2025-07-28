'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AutoBreadcrumb } from '@/components/ui/breadcrumb';
import { useAxios } from '@/hooks/use-axios';
import { ProjectForm, projectFormSchema } from '@/components/project/form'; // Import the new component and schema
import { z } from 'zod';
import { Title } from '@/components/ui/title';
import { Container } from '@/components/ui/container';

export default function AddProjectPage() {
  const { request } = useAxios<{
    id: number;
    name: string;
  }>();

  const router = useRouter();

  async function handleFormSubmit(values: z.infer<typeof projectFormSchema>) {
    const response = await request({
      url: '/project',
      method: 'POST',
      data: values,
    });

    if (response) {
      toast.success('Projeto adicionado com sucesso');
      router.push('/project');
    } else {
      toast.error('Não foi possível adicionar o projeto');
    }
  }

  return (
    <Container>
      <AutoBreadcrumb
        items={[
          { label: 'Projetos', href: '/project' },
          {
            label: 'Adicionar projeto',
            href: '',
          },
        ]}
      />
      <Title>Adicionar projeto</Title>
      <ProjectForm
        defaultValues={{ name: '' }} // Default empty value for new project
        onSubmit={handleFormSubmit}
        submitButtonText="Adicionar projeto"
      />
    </Container>
  );
}
