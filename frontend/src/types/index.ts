export interface Student {
  id: number;
  name: string;
  email: string;
  courseId: number;
}

export interface Course {
  id: number;
  name: string;
  description: string;
  maxStudents: number;
  students: Student[];
  diversityIndex: number;
}

export interface CreateCourseDto {
  name: string;
  description: string;
  maxStudents: number;
}

export interface UpdateCourseDto {
  name?: string;
  description?: string;
  maxStudents?: number;
}

export interface CreateStudentDto {
  name: string;
  email: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
}
