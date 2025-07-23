// project.entity.ts
import { ProjectMember } from 'src/project-member/entities/project-member.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Relação Many-to-Many com ProjectMember
  @ManyToMany(() => ProjectMember, projectMember => projectMember.projects, {
    onDelete: 'CASCADE'
  })
  projectMembers: ProjectMember[];
}