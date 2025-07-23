import { IsNumber, IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateProjectMemberDto {
  @IsNumber()
  @IsNotEmpty()
  projectId: number; // O ID do projeto ao qual o membro será adicionado

  @IsNotEmpty()
  @IsString()
  name: string; // O nome do novo membro

  @IsNotEmpty()
  @IsEmail()
  email: string; // O e-mail do novo membro (será único)

  @IsOptional()
  @IsString()
  role?: string; // Função do membro no projeto (opcional)
}