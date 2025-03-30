
import { Transaction } from '@/types';

export const mockTransactions: Transaction[] = [
  {
    id: 'txn-1',
    userId: 'user-1',
    amount: 500,
    type: 'deposit',
    status: 'completed',
    createdAt: '2023-07-01T09:30:00Z',
    description: 'Initial wallet funding'
  },
  {
    id: 'txn-2',
    userId: 'user-1',
    amount: 150,
    type: 'payment',
    status: 'completed',
    createdAt: '2023-07-10T08:30:00Z',
    description: 'Payment for order #1'
  },
  {
    id: 'txn-3',
    userId: 'user-2',
    amount: 1000,
    type: 'deposit',
    status: 'completed',
    createdAt: '2023-06-30T14:00:00Z',
    description: 'Initial wallet funding'
  },
  {
    id: 'txn-4',
    userId: 'user-1',
    amount: 200,
    type: 'deposit',
    status: 'completed',
    createdAt: '2023-07-15T10:45:00Z',
    description: 'Wallet top-up'
  }
];
