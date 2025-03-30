
import { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Student',
    email: 'student@example.com',
    role: 'student',
    walletBalance: 500,
    profileImageUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 'user-2',
    name: 'Jane Staff',
    email: 'staff@example.com',
    role: 'staff',
    walletBalance: 1000,
    profileImageUrl: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: 'user-3',
    name: 'Cafe Manager',
    email: 'cafe@example.com',
    role: 'cafeteria_staff',
    walletBalance: 0,
    profileImageUrl: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: 'user-4',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    walletBalance: 0,
    profileImageUrl: 'https://randomuser.me/api/portraits/women/4.jpg'
  }
];
