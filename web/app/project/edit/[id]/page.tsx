'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAxios, api } from '@/hooks/use-axios';
import { toast } from 'sonner';
import { AutoBreadcrumb } from '@/components/ui/breadcrumb';
import { ProjectForm, projectFormSchema } from '@/components/project/form'; // Import the new component and schema
import { z } from 'zod';
import { Title } from '@/components/ui/title';
import { Container } from '@/components/ui/container';

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, request, loading } = useAxios<{ id: string; name: string }>();

  useEffect(() => {
    if (id) {
      request({ url: `/project/${id}`, method: 'GET' });
    }
  }, [id, request]);

  async function handleSubmit(values: z.infer<typeof projectFormSchema>) {
    const response = await api.patch(`/project/${id}`, values);

    if (response?.status === 200) {
      router.push('/project');
      toast.success('Projeto editado com sucesso!');
    } else {
      toast.error('Não foi possível editar');
    }
  }

  if (loading || !data) return <p className="p-4">Carregando projeto...</p>;

  return (
    <Container>
      <AutoBreadcrumb
        items={[
          { label: 'Projetos', href: '/project' },
          {
            label: 'Editar projeto',
            href: '',
          },
        ]}
      />
      <Title>Editar Projeto</Title>

      <ProjectForm
        defaultValues={{ name: data.name }}
        onSubmit={handleSubmit}
        submitButtonText="Salvar alterações"
      />
    </Container>
  );
}
