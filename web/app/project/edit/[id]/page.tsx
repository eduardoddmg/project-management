'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAxios, api } from '@/hooks/use-axios';
import { toast } from 'sonner';
import { AutoBreadcrumb } from '@/components/ui/breadcrumb';
import { ProjectForm, projectFormSchema } from '@/components/project/form'; // Import the new component and schema
import { z } from 'zod';

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, request, loading } = useAxios<{ id: string; name: string }>();

  // Fetch project data when the component mounts or ID changes
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
    <div className="container mx-auto py-10">
      <AutoBreadcrumb
        items={[
          { label: 'Projetos', href: '/project' },
          {
            label: 'Editar projeto',
            href: '',
          },
        ]}
      />
      <h1 className="text-2xl font-bold mb-6">Editar Projeto</h1>

      <ProjectForm
        defaultValues={{ name: data.name }}
        onSubmit={handleSubmit}
        submitButtonText="Salvar alterações"
      />
    </div>
  );
}
