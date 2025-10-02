import apiClient from '../lib/axios';
import type {
  Course,
  CreateCourseDto,
  UpdateCourseDto,
  Student,
  CreateStudentDto,
} from '../types';

export const courseService = {
  // Course endpoints
  async createCourse(data: CreateCourseDto): Promise<Course> {
    const response = await apiClient.post<Course>('/course', data);
    return response.data;
  },

  async getCourse(): Promise<Course> {
    const response = await apiClient.get<Course>('/course');
    return response.data;
  },

  async updateCourse(data: UpdateCourseDto): Promise<Course> {
    const response = await apiClient.patch<Course>('/course', data);
    return response.data;
  },

  async deleteCourse(): Promise<void> {
    await apiClient.delete('/course');
  },

  // Student endpoints
  async addStudent(data: CreateStudentDto): Promise<Student> {
    const response = await apiClient.post<Student>('/course/students', data);
    return response.data;
  },

  async getStudents(): Promise<Student[]> {
    const response = await apiClient.get<Student[]>('/course/students');
    return response.data;
  },

  async deleteStudent(id: number): Promise<void> {
    await apiClient.delete(`/course/students/${id}`);
  },
};
