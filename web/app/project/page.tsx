'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AutoBreadcrumb } from '@/components/ui/breadcrumb';
import { ProjectList } from '@/components/project/list';

const Page = () => {
  return (
    <div className="container mx-auto py-10">
      <AutoBreadcrumb items={[{ label: 'Projetos', href: '/project' }]} />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lista de Projetos</h1>
        <Link href="/project/add">
          <Button>Adicionar</Button>
        </Link>
      </div>
      <ProjectList />
    </div>
  );
};

export default Page;
