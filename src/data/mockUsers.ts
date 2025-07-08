import { User } from '../types/user';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@pulsehub.com',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    department: 'Engineering',
    joinDate: '2022-01-15',
    level: 8,
    points: 2450,
    badges: ['Team Leader', 'Innovation Champion', 'Mentor']
  },
  {
    id: '2',
    name: 'Alex Chen',
    email: 'alex.chen@pulsehub.com',
    role: 'employee',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    department: 'Engineering',
    joinDate: '2023-03-10',
    level: 5,
    points: 1680,
    badges: ['Code Warrior', 'Problem Solver']
  },
  {
    id: '3',
    name: 'Jordan Smith',
    email: 'jordan.smith@pulsehub.com',
    role: 'new_hire',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    department: 'Marketing',
    joinDate: '2024-06-01',
    level: 1,
    points: 120,
    badges: ['Welcome Aboard']
  }
];

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getUserByRole = (role: User['role']): User | undefined => {
  return mockUsers.find(user => user.role === role);
};