import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { tasksAPI } from '../api/tasks';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import { TASK_STATUS_OPTIONS } from '../utils/constants';
import { formatInputDate } from '../utils/formatters';

export default function TaskForm({ task, users, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Belum Dimulai',
    assigned_to: '',
    start_date: '',
    end_date: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Belum Dimulai',
        assigned_to: task.assigned_to || '',
        start_date: formatInputDate(task.start_date),
        end_date: formatInputDate(task.end_date),
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    const submitData = {
      ...formData,
      assigned_to: formData.assigned_to ? parseInt(formData.assigned_to) : null,
    };

    try {
      if (task) {
        await tasksAPI.update(task.id, submitData);
        toast.success('Task berhasil diupdate');
      } else {
        await tasksAPI.create(submitData);
        toast.success('Task berhasil ditambahkan');
      }
      onSuccess();
    } catch (err) {
      const response = err.response?.data;

      if (response?.errors && Array.isArray(response.errors)) {
        const errors = {};
        response.errors.forEach(error => {
          errors[error.field] = error.message;
        });
        setFieldErrors(errors);
        setError(response.message || 'Terdapat kesalahan pada form');
        toast.error('Terdapat kesalahan pada form. Periksa input Anda.');
      } else {
        const errorMsg = response?.message || 'Gagal menyimpan task';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const userOptions = [
    { value: '', label: 'Tidak ada' },
    ...users.map((user) => ({ value: user.id, label: user.name })),
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
          {Object.keys(fieldErrors).length > 0 && (
            <ul className="mt-2 ml-4 list-disc text-sm">
              {Object.values(fieldErrors).map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={fieldErrors.title}
        placeholder="Masukkan judul task"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Masukkan deskripsi task (opsional)"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Select
        label="Status"
        name="status"
        value={formData.status}
        onChange={handleChange}
        options={TASK_STATUS_OPTIONS}
      />

      <Select
        label="Assigned To"
        name="assigned_to"
        value={formData.assigned_to}
        onChange={handleChange}
        options={userOptions}
      />

      <Input
        label="Start Date"
        type="date"
        name="start_date"
        value={formData.start_date}
        onChange={handleChange}
        required
      />

      <Input
        label="End Date"
        type="date"
        name="end_date"
        value={formData.end_date}
        onChange={handleChange}
        required
      />

      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? 'Saving...' : task ? 'Update' : 'Create'}
        </Button>
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
