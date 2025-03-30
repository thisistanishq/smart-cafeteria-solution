
import { Order } from '@/types';

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    customerId: 'user-1',
    customerName: 'John Student',
    items: [
      {
        itemId: 'item-1',
        name: 'Masala Dosa',
        quantity: 2,
        price: 60,
        total: 120
      },
      {
        itemId: 'item-11',
        name: 'Filter Coffee',
        quantity: 1,
        price: 30,
        total: 30
      }
    ],
    totalAmount: 150,
    status: 'completed',
    createdAt: '2023-07-10T08:30:00Z',
    estimatedReadyTime: '2023-07-10T08:45:00Z',
    completedAt: '2023-07-10T08:50:00Z',
    paymentMethod: 'wallet',
    paymentStatus: 'completed'
  },
  {
    id: 'order-2',
    customerId: 'user-2',
    customerName: 'Jane Staff',
    items: [
      {
        itemId: 'item-4',
        name: 'South Indian Thali',
        quantity: 1,
        price: 120,
        total: 120
      }
    ],
    totalAmount: 120,
    status: 'preparing',
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(), // 10 minutes ago
    estimatedReadyTime: new Date(Date.now() + 5 * 60000).toISOString(), // 5 minutes from now
    paymentMethod: 'upi',
    paymentStatus: 'completed'
  },
  {
    id: 'order-3',
    customerId: 'user-1',
    customerName: 'John Student',
    items: [
      {
        itemId: 'item-9',
        name: 'Medu Vada',
        quantity: 2,
        price: 45,
        total: 90
      },
      {
        itemId: 'item-12',
        name: 'Tender Coconut Water',
        quantity: 1,
        price: 40,
        total: 40
      }
    ],
    totalAmount: 130,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 2 * 60000).toISOString(), // 2 minutes ago
    estimatedReadyTime: new Date(Date.now() + 13 * 60000).toISOString(), // 13 minutes from now
    paymentMethod: 'card',
    paymentStatus: 'completed'
  }
];
