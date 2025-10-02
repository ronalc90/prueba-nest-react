import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { Course } from './course.entity';

@Entity('students')
@Index(['courseId']) // Índice para optimizar búsquedas por curso
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  courseId: number;

  @ManyToOne(() => Course, (course) => course.students, {
    onDelete: 'CASCADE',
  })
  course: Course;
}
