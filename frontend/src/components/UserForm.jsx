import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { usersAPI } from '../api/users';
import Input from './Input';
import Select from './Select';
import Button from './Button';

const ROLE_OPTIONS = [
  { value: 'member', label: 'Member' },
  { value: 'manager', label: 'Manager' },
];

export default function UserForm({ user, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        role: user.role || 'member',
      });
    }
  }, [user]);

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

    const submitData = { ...formData };
    if (user && !submitData.password) {
      delete submitData.password;
    }

    try {
      if (user) {
        await usersAPI.update(user.id, submitData);
        toast.success('User berhasil diupdate');
      } else {
        await usersAPI.create(submitData);
        toast.success('User berhasil ditambahkan');
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
        const errorMsg = response?.message || 'Gagal menyimpan user';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

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
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={fieldErrors.name}
        placeholder="Masukkan nama lengkap"
        required
      />

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={fieldErrors.email}
        placeholder="email@example.com"
        required
      />

      <Input
        label={user ? 'Password (kosongkan jika tidak ingin mengubah)' : 'Password'}
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={fieldErrors.password}
        placeholder={user ? 'Kosongkan jika tidak diubah' : 'Minimal 6 karakter'}
        required={!user}
      />

      <Select
        label="Role"
        name="role"
        value={formData.role}
        onChange={handleChange}
        options={ROLE_OPTIONS}
      />

      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? 'Saving...' : user ? 'Update' : 'Create'}
        </Button>
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
