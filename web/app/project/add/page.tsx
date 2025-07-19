'use client';

import { z } from 'zod';
import { DynamicForm, FormFieldConfig } from '@/components/ui/dynamic-form';
import { useAxios } from '@/hooks/use-axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AutoBreadcrumb } from '@/components/ui/breadcrumb';

export default function HomePage() {
  const { request } = useAxios<{
    id: number;
    name: string;
  }>();

  const router = useRouter();

  // 1. Defina o esquema de validação com Zod
  const formSchema = z.object({
    name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  });

  // 2. Defina a configuração dos campos do formulário
  const formFields: FormFieldConfig[] = [
    {
      name: 'name',
      label: 'Nome do projeto',
      type: 'input',
      placeholder: 'Seu nome aqui...',
    },
  ];

  // 3. Defina os valores padrão (podem vir de uma API, por exemplo)
  const defaultValues = {
    name: '',
  };

  // 4. Crie a função para lidar com o envio do formulário
  // 5. Submit do formulário
  async function handleFormSubmit(values: z.infer<typeof formSchema>) {
    const response = await request({
      url: '/project',
      method: 'POST',
      data: values,
    });

    if (response) {
      console.log('Projeto criado:', response.data);
      toast.success('Projeto addicionado com sucesso');
      router.push('/project');
    } else {
      toast.error('Não foi possível adicionar o projeto');
    }
  }

  return (
    <div className="w-full bg-card p-8 ">
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
      <DynamicForm
        formSchema={formSchema}
        formFields={formFields}
        onSubmit={handleFormSubmit}
        defaultValues={defaultValues}
        submitButtonText="Enviar"
      />
    </div>
  );
}
