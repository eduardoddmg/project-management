import { Project } from 'src/project/entities/project.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class ProjectMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // O nome do membro

  @Column({ unique: true }) // Um e-mail pode ser único para identificar o membro
  email: string;

  @Column({ nullable: true })
  role?: string; // A função do membro dentro de CADA projeto

  @ManyToMany(() => Project, project => project.projectMembers)
  @JoinTable() // Esta é a entidade que possui a tabela de junção
  projects: Project[];
}