import { Module } from '@nestjs/common';
import { ProjectMemberService } from './project-member.service';
import { ProjectMemberController } from './project-member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectMember } from './entities/project-member.entity';
import { Project } from 'src/project/entities/project.entity';

@Module({
  controllers: [ProjectMemberController],
  providers: [ProjectMemberService],
  exports: [ProjectMemberService],
    imports: [TypeOrmModule.forFeature([ProjectMember]), TypeOrmModule.forFeature([Project])],
  
})
export class ProjectMemberModule {}
