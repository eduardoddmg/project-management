import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // Importe para injetar o repositório
import { Repository } from 'typeorm'; // Importe o tipo Repository
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity'; // Assumindo que você tem uma entidade Project

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) // Injeta o repositório da entidade Project
    private projectRepository: Repository<Project>, // Propriedade para acessar os métodos do TypeORM
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    // Cria uma nova instância da entidade Project a partir do DTO
    const newProject = this.projectRepository.create(createProjectDto);
    // Salva a nova instância no banco de dados e retorna o projeto salvo
    return this.projectRepository.save(newProject);
  }

  async findAll(): Promise<Project[]> {
    // Busca todos os projetos no banco de dados
    return this.projectRepository.find({
      relations: ['projectMembers'], // Inclui a relação com projectMembers, se necessário
    });
  }

  async findOne(id: number): Promise<Project> {
    // Busca um projeto pelo ID. O `where` é crucial para especificar a condição.
    const project = await this.projectRepository.findOne({ where: { id }, relations: ['projectMembers'] });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }
    return project;
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    // Primeiro, verifica se o projeto existe
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }

    // Atualiza as propriedades do projeto existente com as do DTO
    // O `Object.assign` é uma forma de fazer isso, ou você pode iterar sobre as propriedades do DTO
    Object.assign(project, updateProjectDto);

    // Salva as alterações no banco de dados
    return this.projectRepository.save(project);

    // Alternativamente, para atualização direta sem buscar primeiro (menos flexível para validações pré-save):
    // await this.projectRepository.update(id, updateProjectDto);
    // return this.projectRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    // Opcional: verificar se o projeto existe antes de tentar remover
    const result = await this.projectRepository.delete(id);
    if (result.affected === 0) {
      // Se 0 linhas foram afetadas, o projeto não foi encontrado
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }
  }
}
