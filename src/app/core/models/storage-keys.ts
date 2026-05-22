export const STORAGE_KEYS = {
  users: 'users',
  currentUser: 'currentUser',
  tasksPrefix: 'tasks-',
} as const;

export function tasksKey(email: string): string {
  return `${STORAGE_KEYS.tasksPrefix}${email}`;
}
