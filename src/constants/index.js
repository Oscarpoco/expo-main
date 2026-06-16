export const TASK_STATUSES = [
  { id: 'pending', label: 'Pending', color: '#f59e0b' },
  { id: 'in-progress', label: 'In Progress', color: '#2d6a4f' },
  { id: 'completed', label: 'Completed', color: '#10b981' },
];

export const PRIORITIES = [
  { id: 'low', label: 'Low', color: '#6b7280' },
  { id: 'medium', label: 'Medium', color: '#f59e0b' },
  { id: 'high', label: 'High', color: '#ef4444' },
];

export function getStatusLabel(statusId) {
  return TASK_STATUSES.find((s) => s.id === statusId)?.label ?? statusId;
}

export function getStatusColor(statusId) {
  return TASK_STATUSES.find((s) => s.id === statusId)?.color ?? '#6b7280';
}

export function getPriorityLabel(priorityId) {
  return PRIORITIES.find((p) => p.id === priorityId)?.label ?? priorityId;
}
