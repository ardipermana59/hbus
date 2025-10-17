import { STATUS_COLORS } from '../utils/constants';
import { formatDate, formatDateTime } from '../utils/formatters';

export default function TaskDetail({ task }) {
  if (!task) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
        <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full border ${STATUS_COLORS[task.status]}`}>
          {task.status}
        </span>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700">Description</h4>
        <p className="mt-1 text-sm text-gray-900">{task.description || '-'}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700">Assigned To</h4>
          <p className="mt-1 text-sm text-gray-900">{task.assigned_to_name || '-'}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700">Created By</h4>
          <p className="mt-1 text-sm text-gray-900">{task.created_by_name || '-'}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700">Start Date</h4>
          <p className="mt-1 text-sm text-gray-900">{formatDate(task.start_date)}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700">End Date</h4>
          <p className="mt-1 text-sm text-gray-900">{formatDate(task.end_date)}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700">Created At</h4>
          <p className="mt-1 text-sm text-gray-900">{formatDateTime(task.created_at)}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700">Updated At</h4>
          <p className="mt-1 text-sm text-gray-900">{formatDateTime(task.updated_at)}</p>
        </div>
      </div>

      {task.logs && task.logs.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Activity Logs</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {task.logs.map((log, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{log.action}</p>
                    <p className="text-xs text-gray-500 mt-1">by {log.user_name}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDateTime(log.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
