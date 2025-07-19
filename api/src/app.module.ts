import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './project/project.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ProjectModule,
    TypeOrmModule.forRoot({
      type: 'sqlite', // Specify the database type
      database: 'database.sqlite', // The file where your database will be stored
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Path to your entity files
      synchronize: true, // Automatically synchronize database schema (use ONLY for development!)
      logging: ['query', 'error'], // Enable logging for queries and errors
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
