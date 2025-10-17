import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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

    try {
      await login(formData);
      toast.success('Login berhasil! Selamat datang.');
      navigate('/dashboard');
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
        const errorMsg = response?.message || 'Login gagal. Silakan coba lagi.';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Team Task Tracker
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Login untuk melanjutkan
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={fieldErrors.email}
              placeholder="Masukkan email Anda"
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={fieldErrors.password}
              placeholder="Masukkan password"
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
