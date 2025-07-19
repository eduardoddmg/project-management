'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { z } from 'zod';
import { useAxios } from '@/hooks/use-axios';
import { DynamicForm, FormFieldConfig } from '@/components/ui/dynamic-form';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
});

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, request, loading } = useAxios<{ id: string; name: string }>();

  // Buscar os dados do projeto
  useEffect(() => {
    if (id) {
      request({ url: `http://localhost:3000/project/${id}`, method: 'GET' });
    }
  }, [id, request]);

  const formFields: FormFieldConfig[] = [
    {
      name: 'name',
      label: 'Nome do projeto',
      type: 'input',
      placeholder: 'Digite o novo nome...',
    },
  ];

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    const response = await request({
      url: `http://localhost:3000/project/${id}`,
      method: 'PATCH',
      data: values,
    });

    if (response?.status === 200) {
      router.push('/project'); // ou atualize com router.refresh()
      toast.success('Projeto editado com sucesso!');
    } else {
      toast.error('Não foi possível editar');
    }
  }

  if (loading || !data) return <p className="p-4">Carregando projeto...</p>;

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-card rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">Editar Projeto</h1>

      <DynamicForm
        formSchema={formSchema}
        formFields={formFields}
        defaultValues={{ name: data.name }}
        onSubmit={handleSubmit}
        submitButtonText="Salvar alterações"
      />
    </div>
  );
}
