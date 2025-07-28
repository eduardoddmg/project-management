'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AutoBreadcrumb } from '@/components/ui/breadcrumb';
import { ProjectList } from '@/components/project/list';
import { Title } from '@/components/ui/title';
import { Container } from '@/components/ui/container';

const Page = () => {
  return (
    <Container>
      <AutoBreadcrumb items={[{ label: 'Projetos', href: '/project' }]} />
      <div className="flex justify-between items-center mb-4">
        <Title>Lista de Projetos</Title>
        <Link href="/project/add">
          <Button>Adicionar</Button>
        </Link>
      </div>
      <ProjectList />
    </Container>
  );
};

export default Page;
