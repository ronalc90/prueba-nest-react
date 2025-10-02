import { useState } from 'react';
import type { CreateStudentDto } from '../types';

interface AddStudentFormProps {
  onSubmit: (data: CreateStudentDto) => void;
  isLoading?: boolean;
}

export const AddStudentForm = ({ onSubmit, isLoading }: AddStudentFormProps) => {
  const [formData, setFormData] = useState<CreateStudentDto>({
    name: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Limpiar el formulario
    setFormData({ name: '', email: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Agregar Estudiante</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nombre
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300"
        disabled={isLoading}
      >
        {isLoading ? 'Agregando...' : 'Agregar Estudiante'}
      </button>
    </form>
  );
};
