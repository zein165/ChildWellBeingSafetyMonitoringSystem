export interface User {
  id: string;
  username: string;
  role: UserRole;
}

export const UserRole = {
  PARENT: 'Parent',
  CHILD: 'Child',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
