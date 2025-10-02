import { useMemo } from 'react';
import type { Student } from '../types';

interface StudentListProps {
  students: Student[];
  onDelete: (id: number) => void;
  isDeleting?: number | null;
}

export const StudentList = ({
  students,
  onDelete,
  isDeleting,
}: StudentListProps) => {
  // Optimización con useMemo para evitar renders innecesarios
  const studentItems = useMemo(() => {
    return students.map((student) => (
      <div
        key={student.id}
        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div>
          <p className="font-semibold text-gray-800">{student.name}</p>
          <p className="text-sm text-gray-600">{student.email}</p>
        </div>
        <button
          onClick={() => onDelete(student.id)}
          disabled={isDeleting === student.id}
          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-red-300 transition-colors"
        >
          {isDeleting === student.id ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    ));
  }, [students, onDelete, isDeleting]);

  if (students.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay estudiantes inscritos
      </div>
    );
  }

  return <div className="space-y-3">{studentItems}</div>;
};
