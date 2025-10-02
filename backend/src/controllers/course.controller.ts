import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CourseService } from '../services/course.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { CreateStudentDto } from '../dto/create-student.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    return await this.courseService.createCourse(createCourseDto);
  }

  @Get()
  async getCourse() {
    return await this.courseService.getCourse();
  }

  @Patch()
  async updateCourse(@Body() updateCourseDto: UpdateCourseDto) {
    return await this.courseService.updateCourse(updateCourseDto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCourse() {
    await this.courseService.deleteCourse();
  }

  @Post('students')
  @HttpCode(HttpStatus.CREATED)
  async addStudent(@Body() createStudentDto: CreateStudentDto) {
    return await this.courseService.addStudent(createStudentDto);
  }

  @Get('students')
  async getStudents() {
    return await this.courseService.getStudents();
  }

  @Delete('students/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteStudent(@Param('id', ParseIntPipe) id: number) {
    await this.courseService.deleteStudent(id);
  }
}
