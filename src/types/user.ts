export interface User {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'employee' | 'new_hire';
  avatar: string;
  department: string;
  joinDate: string;
  level: number;
  points: number;
  badges: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}