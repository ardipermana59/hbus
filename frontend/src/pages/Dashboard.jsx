import { useState, useEffect } from 'react';
import { tasksAPI } from '../api/tasks';
import Layout from '../components/Layout';
import { formatDate } from '../utils/formatters';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [incompleteTasks, setIncompleteTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashboardResponse, tasksResponse] = await Promise.all([
          tasksAPI.getDashboard(),
          tasksAPI.getAll({ status: '' }),
        ]);

        if (isMounted) {
          setDashboardData(dashboardResponse.data);

          const incomplete = tasksResponse.data
            .filter(task => task.status !== 'Selesai')
            .sort((a, b) => {
              if (a.status === 'Sedang Dikerjakan' && b.status !== 'Sedang Dikerjakan') return -1;
              if (a.status !== 'Sedang Dikerjakan' && b.status === 'Sedang Dikerjakan') return 1;

              const dateA = a.end_date ? new Date(a.end_date) : new Date('9999-12-31');
              const dateB = b.end_date ? new Date(b.end_date) : new Date('9999-12-31');
              return dateA - dateB;
            });

          setIncompleteTasks(incomplete);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Gagal memuat data dashboard');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const getTaskCountByStatus = (status) => {
    if (!dashboardData?.tasks_by_status) return 0;
    const found = dashboardData.tasks_by_status.find(item => item.status === status);
    return found ? parseInt(found.count) : 0;
  };

  const getTotalTasks = () => {
    if (!dashboardData?.tasks_by_status) return 0;
    return dashboardData.tasks_by_status.reduce((sum, item) => sum + parseInt(item.count), 0);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="text-sm font-medium text-gray-600">Total Tasks</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              {getTotalTasks()}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-500">
            <div className="text-sm font-medium text-gray-600">Belum Dimulai</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              {getTaskCountByStatus('Belum Dimulai')}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="text-sm font-medium text-gray-600">Sedang Dikerjakan</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              {getTaskCountByStatus('Sedang Dikerjakan')}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="text-sm font-medium text-gray-600">Selesai</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              {getTaskCountByStatus('Selesai')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dashboardData?.most_active_user && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Most Active User</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold text-gray-900">
                    {dashboardData.most_active_user.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {dashboardData.most_active_user.log_count} aktivitas
                  </p>
                </div>
                <div className="text-4xl">👑</div>
              </div>
            </div>
          )}

          {dashboardData?.tasks_by_user && dashboardData.tasks_by_user.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tasks by User</h2>
              <div className="space-y-3">
                {dashboardData.tasks_by_user.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{user.name}</span>
                    <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      {user.task_count} tasks
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {incompleteTasks.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Task Belum Selesai ({incompleteTasks.length})
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Diurutkan berdasarkan prioritas dan deadline
              </p>
            </div>
            <div className="divide-y divide-gray-200">
              {incompleteTasks.map((task) => (
                <div key={task.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                      <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500">
                        <span>
                          {task.assigned_to_name ? (
                            <>
                              <span className="font-medium">Assigned to:</span> {task.assigned_to_name}
                            </>
                          ) : (
                            'Unassigned'
                          )}
                        </span>
                        {task.end_date && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span>
                              <span className="font-medium">Deadline:</span> {formatDate(task.end_date)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <span
                      className={`ml-4 flex-shrink-0 px-3 py-1 text-xs font-medium rounded-full border ${
                        task.status === 'Sedang Dikerjakan'
                          ? 'bg-blue-100 text-blue-700 border-blue-300'
                          : 'bg-gray-100 text-gray-700 border-gray-300'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {dashboardData?.recent_in_progress_tasks && dashboardData.recent_in_progress_tasks.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent In Progress Tasks
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {dashboardData.recent_in_progress_tasks.map((task) => (
                <div key={task.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                      )}
                      <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500">
                        <span>
                          {task.assigned_to_name ? (
                            <>
                              <span className="font-medium">Assigned to:</span> {task.assigned_to_name}
                            </>
                          ) : (
                            'Unassigned'
                          )}
                        </span>
                        {task.end_date && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span>
                              <span className="font-medium">Deadline:</span> {formatDate(task.end_date)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="ml-4 flex-shrink-0 px-3 py-1 text-xs font-medium rounded-full border bg-blue-100 text-blue-700 border-blue-300">
                      In Progress
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {incompleteTasks.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 mb-2">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500">Semua task sudah selesai!</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
