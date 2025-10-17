export const TASK_STATUS = {
  NOT_STARTED: 'Belum Dimulai',
  IN_PROGRESS: 'Sedang Dikerjakan',
  COMPLETED: 'Selesai',
};

export const USER_ROLES = {
  MANAGER: 'manager',
  MEMBER: 'member',
};

export const TASK_STATUS_OPTIONS = [
  { value: TASK_STATUS.NOT_STARTED, label: 'Belum Dimulai' },
  { value: TASK_STATUS.IN_PROGRESS, label: 'Sedang Dikerjakan' },
  { value: TASK_STATUS.COMPLETED, label: 'Selesai' },
];

export const STATUS_COLORS = {
  [TASK_STATUS.NOT_STARTED]: 'bg-gray-100 text-gray-700 border-gray-300',
  [TASK_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-700 border-blue-300',
  [TASK_STATUS.COMPLETED]: 'bg-green-100 text-green-700 border-green-300',
};
