import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../entities/course.entity';
import { Student } from '../entities/student.entity';
import { CourseService } from '../services/course.service';
import { CourseController } from '../controllers/course.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Student])],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
