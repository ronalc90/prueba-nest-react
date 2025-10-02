import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../services/courseService';
import { DiversityGauge } from '../components/DiversityGauge';
import { CourseModal } from '../components/CourseModal';
import { StudentList } from '../components/StudentList';
import { AddStudentForm } from '../components/AddStudentForm';
import { Spinner } from '../components/Spinner';
import { ErrorAlert } from '../components/ErrorAlert';
import type { CreateCourseDto, CreateStudentDto } from '../types';

export const CoursePage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingStudentId, setDeletingStudentId] = useState<number | null>(
    null
  );

  // Query para obtener el curso
  const {
    data: course,
    isLoading,
    error: courseError,
  } = useQuery({
    queryKey: ['course'],
    queryFn: courseService.getCourse,
    retry: false,
  });

  // Mutation para crear curso
  const createCourseMutation = useMutation({
    mutationFn: courseService.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course'] });
      setIsModalOpen(false);
      setError(null);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Error al crear el curso');
    },
  });

  // Mutation para actualizar curso
  const updateCourseMutation = useMutation({
    mutationFn: courseService.updateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course'] });
      setIsModalOpen(false);
      setError(null);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Error al actualizar el curso');
    },
  });

  // Mutation para eliminar curso
  const deleteCourseMutation = useMutation({
    mutationFn: courseService.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course'] });
      setError(null);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Error al eliminar el curso');
    },
  });

  // Mutation para agregar estudiante
  const addStudentMutation = useMutation({
    mutationFn: courseService.addStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course'] });
      setError(null);
    },
    onError: (err: any) => {
      setError(
        err.response?.data?.message || 'Error al agregar el estudiante'
      );
    },
  });

  // Mutation para eliminar estudiante
  const deleteStudentMutation = useMutation({
    mutationFn: courseService.deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course'] });
      setDeletingStudentId(null);
      setError(null);
    },
    onError: (err: any) => {
      setError(
        err.response?.data?.message || 'Error al eliminar el estudiante'
      );
      setDeletingStudentId(null);
    },
  });

  const handleCourseSubmit = (data: CreateCourseDto) => {
    if (course) {
      updateCourseMutation.mutate(data);
    } else {
      createCourseMutation.mutate(data);
    }
  };

  const handleDeleteCourse = () => {
    if (confirm('¿Estás seguro de eliminar el curso y todos sus estudiantes?')) {
      deleteCourseMutation.mutate();
    }
  };

  const handleAddStudent = (data: CreateStudentDto) => {
    addStudentMutation.mutate(data);
  };

  const handleDeleteStudent = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este estudiante?')) {
      setDeletingStudentId(id);
      deleteStudentMutation.mutate(id);
    }
  };

  // Calcular dominios únicos para el gauge
  const uniqueDomains =
    course?.students
      ? new Set(
          course.students.map((s) => s.email.substring(s.email.indexOf('@')))
        ).size
      : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Sistema de Gestión de Curso
        </h1>

        {error && (
          <ErrorAlert message={error} onClose={() => setError(null)} />
        )}

        {!course && !courseError ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">
              No hay ningún curso creado. Crea uno para comenzar.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Crear Curso
            </button>
          </div>
        ) : courseError ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">No hay ningún curso disponible.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Crear Curso
            </button>
          </div>
        ) : (
          course && (
            <>
              {/* Información del Curso */}
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      {course.name}
                    </h2>
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    <p className="text-sm text-gray-500">
                      Cupo máximo: {course.maxStudents} estudiantes
                    </p>
                    <p className="text-sm text-gray-500">
                      Inscritos: {course.students.length} estudiantes
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={handleDeleteCourse}
                      disabled={deleteCourseMutation.isPending}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300"
                    >
                      {deleteCourseMutation.isPending
                        ? 'Eliminando...'
                        : 'Eliminar'}
                    </button>
                  </div>
                </div>

                {/* Gauge de Diversidad */}
                <div className="flex justify-center py-8">
                  <DiversityGauge
                    percentage={course.diversityIndex}
                    uniqueDomains={uniqueDomains}
                    totalStudents={course.students.length}
                  />
                </div>
              </div>

              {/* Formulario para Agregar Estudiante */}
              <div className="mb-8">
                <AddStudentForm
                  onSubmit={handleAddStudent}
                  isLoading={addStudentMutation.isPending}
                />
              </div>

              {/* Lista de Estudiantes */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  Estudiantes Inscritos ({course.students.length})
                </h3>
                <StudentList
                  students={course.students}
                  onDelete={handleDeleteStudent}
                  isDeleting={deletingStudentId}
                />
              </div>
            </>
          )
        )}

        {/* Modal para Crear/Editar Curso */}
        <CourseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCourseSubmit}
          course={course}
          isLoading={
            createCourseMutation.isPending || updateCourseMutation.isPending
          }
        />
      </div>
    </div>
  );
};
