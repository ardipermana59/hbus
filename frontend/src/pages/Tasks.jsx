import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { tasksAPI } from '../api/tasks';
import { usersAPI } from '../api/users';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import TaskDetail from '../components/TaskDetail';
import { TASK_STATUS, STATUS_COLORS } from '../utils/constants';
import { formatDate } from '../utils/formatters';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({ status: '', assigned_to: '' });

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getAll(filters);
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleCreate = () => {
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleView = async (task) => {
    try {
      const response = await tasksAPI.getById(task.id);
      setSelectedTask(response.data);
      setIsDetailOpen(true);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Gagal memuat detail task';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus task ini?')) return;

    try {
      await tasksAPI.delete(id);
      toast.success('Task berhasil dihapus');
      fetchTasks();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Gagal menghapus task';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <Button onClick={handleCreate}>Tambah Task</Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Semua Status</option>
                <option value={TASK_STATUS.NOT_STARTED}>Belum Dimulai</option>
                <option value={TASK_STATUS.IN_PROGRESS}>Sedang Dikerjakan</option>
                <option value={TASK_STATUS.COMPLETED}>Selesai</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned To
              </label>
              <select
                name="assigned_to"
                value={filters.assigned_to}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Semua User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            Tidak ada task ditemukan
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{task.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {task.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full border ${
                          STATUS_COLORS[task.status]
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {task.assigned_to_name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>{formatDate(task.start_date)}</div>
                      <div>{formatDate(task.end_date)}</div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleView(task)}
                      >
                        Detail
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(task)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(task.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title={selectedTask ? 'Edit Task' : 'Tambah Task'}
        >
          <TaskForm
            task={selectedTask}
            users={users}
            onSuccess={() => {
              setIsFormOpen(false);
              fetchTasks();
            }}
            onCancel={() => setIsFormOpen(false)}
          />
        </Modal>

        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title="Detail Task"
        >
          <TaskDetail task={selectedTask} />
        </Modal>
      </div>
    </Layout>
  );
}
