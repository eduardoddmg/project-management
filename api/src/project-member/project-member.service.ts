import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectMemberDto } from './dto/create-project-member.dto';
import { UpdateProjectMemberDto } from './dto/update-project-member.dto';
import { ProjectMember } from './entities/project-member.entity';
import { Project } from 'src/project/entities/project.entity';

@Injectable()
export class ProjectMemberService {
  constructor(
    @InjectRepository(ProjectMember)
    private projectMemberRepository: Repository<ProjectMember>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(createProjectMemberDto: CreateProjectMemberDto): Promise<ProjectMember> {
    const { projectId, name, email, role } = createProjectMemberDto;

    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found.`);
    }

    let projectMember = await this.projectMemberRepository.findOne({ where: { email } });

    if (!projectMember) {
      // If the ProjectMember does not exist, create a new one.
      projectMember = this.projectMemberRepository.create({
        name,
        email,
        role,
      });
      await this.projectMemberRepository.save(projectMember);
    } else {
      // If the ProjectMember already exists, check if they are already associated with this project.
      const existingAssociation = await this.projectMemberRepository.findOne({
        where: { id: projectMember.id, projects: { id: projectId } },
        relations: ['projects'],
      });

      if (existingAssociation) {
        if (role && existingAssociation.role !== role) {
          existingAssociation.role = role;
          return this.projectMemberRepository.save(existingAssociation);
        }
        throw new ConflictException(`ProjectMember with email ${email} is already a member of project ${projectId}.`);
      }
    }

    // After ensuring `projectMember` exists (either created or found),
    // we need to fetch it again with its `projects` relation to avoid stale data
    // and correctly push the new project.
    // We can be sure `projectMember` is not null here.
    const currentProjectMember = await this.projectMemberRepository.findOne({
      where: { id: projectMember.id }, // Use the ID from the `projectMember` that was just found or created
      relations: ['projects'],
    });

    // **Solution to the 'possibly null' error:**
    // Add a null check here, even though in this specific logic it might seem redundant,
    // TypeScript requires it because `findOne` *can* theoretically return null.
    if (!currentProjectMember) {
        throw new NotFoundException(`Failed to retrieve ProjectMember after creation/lookup.`);
    }

    // Ensure the projects array is initialized before pushing
    if (!currentProjectMember.projects) {
      currentProjectMember.projects = [];
    }

    currentProjectMember.projects.push(project);
    // You might want to decide if the `role` passed in `createProjectMemberDto`
    // should update the *main* role of the ProjectMember or just apply to this specific project.
    // Given the previous setup, it seems the role is a property of the ProjectMember itself.
    // If a member can have different roles across different projects, you'd need a through-entity
    // for the ManyToMany relationship (e.g., ProjectProjectMember with a 'role' column).
    // For now, we assume `role` updates the ProjectMember's primary role.
    if (role) { // Only update role if it was provided in the DTO
      currentProjectMember.role = role;
    }


    return this.projectMemberRepository.save(currentProjectMember);
  }

  async findAll(): Promise<ProjectMember[]> {
    return this.projectMemberRepository.find({ relations: ['projects'] });
  }

  async findOne(id: number): Promise<ProjectMember> {
    const projectMember = await this.projectMemberRepository.findOne({
      where: { id },
      relations: ['projects'],
    });
    if (!projectMember) {
      throw new NotFoundException(`ProjectMember with ID ${id} not found.`);
    }
    return projectMember;
  }

  async update(id: number, updateProjectMemberDto: UpdateProjectMemberDto): Promise<ProjectMember> {
    const projectMember = await this.projectMemberRepository.findOne({ where: { id } });
    if (!projectMember) {
      throw new NotFoundException(`ProjectMember with ID ${id} not found.`);
    }

    // Atualiza apenas os campos fornecidos no DTO
    Object.assign(projectMember, updateProjectMemberDto);

    return this.projectMemberRepository.save(projectMember);
  }

  async remove(id: number): Promise<void> {
    const result = await this.projectMemberRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`ProjectMember with ID ${id} not found.`);
    }
  }

  /**
   * Remove um membro de um projeto específico.
   * Não exclui o ProjectMember da tabela, apenas a associação.
   */
  async removeMemberFromProject(projectId: number, memberId: number): Promise<void> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['projectMembers'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found.`);
    }

    // Filtra o membro a ser removido da lista de projectMembers do projeto
    const initialMemberCount = project.projectMembers.length;
    project.projectMembers = project.projectMembers.filter(member => member.id !== memberId);

    if (project.projectMembers.length === initialMemberCount) {
      throw new NotFoundException(`ProjectMember ${memberId} is not associated with Project ${projectId}.`);
    }

    await this.projectRepository.save(project);
    console.log(`ProjectMember ${memberId} removed from Project ${projectId}.`);
  }
}