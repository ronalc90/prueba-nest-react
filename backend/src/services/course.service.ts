import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../entities/course.entity';
import { Student } from '../entities/student.entity';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { CreateStudentDto } from '../dto/create-student.dto';

@Injectable()
export class CourseService {
  private diversityIndexCache: number | null = null;

  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    const existingCourse = await this.courseRepository.findOne({
      where: {},
    });

    if (existingCourse) {
      throw new BadRequestException('Ya existe un curso en el sistema');
    }

    const course = this.courseRepository.create(createCourseDto);
    return await this.courseRepository.save(course);
  }

  async getCourse(): Promise<Course & { diversityIndex: number }> {
    const course = await this.courseRepository.findOne({
      where: {},
      relations: ['students'],
    });

    if (!course) {
      throw new NotFoundException('No se encontró ningún curso');
    }

    // Si el caché está disponible, lo usamos
    if (this.diversityIndexCache !== null) {
      return {
        ...course,
        diversityIndex: this.diversityIndexCache,
      };
    }

    // Si no hay caché, calculamos y cacheamos
    const diversityIndex = this.calculateDiversityIndex(course.students);
    this.diversityIndexCache = diversityIndex;

    return {
      ...course,
      diversityIndex,
    };
  }

  async updateCourse(updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: {},
      relations: ['students'],
    });

    if (!course) {
      throw new NotFoundException('No se encontró ningún curso');
    }

    // Validar que el nuevo maxStudents no sea menor al número actual de estudiantes
    if (
      updateCourseDto.maxStudents &&
      updateCourseDto.maxStudents < course.students.length
    ) {
      throw new BadRequestException(
        `No se puede reducir el cupo máximo a ${updateCourseDto.maxStudents} porque ya hay ${course.students.length} estudiantes inscritos`,
      );
    }

    Object.assign(course, updateCourseDto);
    return await this.courseRepository.save(course);
  }

  async deleteCourse(): Promise<void> {
    const course = await this.courseRepository.findOne({ where: {} });

    if (!course) {
      throw new NotFoundException('No se encontró ningún curso');
    }

    await this.courseRepository.remove(course);
    this.invalidateCache();
  }

  async addStudent(createStudentDto: CreateStudentDto): Promise<Student> {
    const course = await this.courseRepository.findOne({
      where: {},
      relations: ['students'],
    });

    if (!course) {
      throw new NotFoundException('No se encontró ningún curso');
    }

    if (course.students.length >= course.maxStudents) {
      throw new BadRequestException('El curso ha alcanzado el cupo máximo');
    }

    const student = this.studentRepository.create({
      ...createStudentDto,
      courseId: course.id,
    });

    const savedStudent = await this.studentRepository.save(student);
    this.invalidateCache();
    return savedStudent;
  }

  async getStudents(): Promise<Student[]> {
    const course = await this.courseRepository.findOne({
      where: {},
      relations: ['students'],
    });

    if (!course) {
      throw new NotFoundException('No se encontró ningún curso');
    }

    return course.students;
  }

  async deleteStudent(id: number): Promise<void> {
    const student = await this.studentRepository.findOne({ where: { id } });

    if (!student) {
      throw new NotFoundException('No se encontró el estudiante');
    }

    await this.studentRepository.remove(student);
    this.invalidateCache();
  }

  private calculateDiversityIndex(students: Student[]): number {
    if (students.length === 0) {
      return 0;
    }

    const domains = students.map((student) => {
      const email = student.email;
      const domain = email.substring(email.indexOf('@'));
      return domain;
    });

    const uniqueDomains = new Set(domains);
    const diversityIndex = (uniqueDomains.size / students.length) * 100;

    return Math.round(diversityIndex * 100) / 100; // Redondear a 2 decimales
  }

  private invalidateCache(): void {
    this.diversityIndexCache = null;
  }
}
