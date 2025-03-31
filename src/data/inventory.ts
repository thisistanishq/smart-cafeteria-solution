
import { InventoryItem } from '@/types';

export const mockInventory: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Rice',
    category: 'Grains',
    quantity: 25,
    unit: 'kg',
    thresholdLevel: 5,
    cost: 60,
    supplier: 'Local Farmers Co-op',
    lastRestocked: '2023-07-01T10:00:00Z'
  },
  {
    id: 'inv-2',
    name: 'Urad Dal',
    category: 'Lentils',
    quantity: 10,
    unit: 'kg',
    thresholdLevel: 2,
    cost: 120,
    supplier: 'Organic Pulses Ltd',
    lastRestocked: '2023-07-02T14:00:00Z'
  },
  {
    id: 'inv-3',
    name: 'Potatoes',
    category: 'Vegetables',
    quantity: 15,
    unit: 'kg',
    thresholdLevel: 3,
    cost: 40,
    supplier: 'Fresh Veggies Market',
    lastRestocked: '2023-07-05T09:30:00Z'
  },
  {
    id: 'inv-4',
    name: 'Coconut',
    category: 'Fruits',
    quantity: 30,
    unit: 'pieces',
    thresholdLevel: 5,
    cost: 25,
    supplier: 'Tropical Fruits Inc',
    lastRestocked: '2023-07-03T11:00:00Z'
  },
  {
    id: 'inv-5',
    name: 'Coffee Powder',
    category: 'Beverages',
    quantity: 5,
    unit: 'kg',
    thresholdLevel: 1,
    cost: 450,
    supplier: 'South Indian Coffee Co',
    lastRestocked: '2023-06-28T15:30:00Z'
  },
  {
    id: 'inv-6',
    name: 'Chicken',
    category: 'Meat',
    quantity: 8,
    unit: 'kg',
    thresholdLevel: 2,
    cost: 320,
    supplier: 'Fresh Poultry Farm',
    lastRestocked: '2023-07-04T08:00:00Z'
  },
  {
    id: 'inv-7',
    name: 'Basmati Rice',
    category: 'Grains',
    quantity: 12,
    unit: 'kg',
    thresholdLevel: 3,
    cost: 180,
    supplier: 'Premium Grains Ltd',
    lastRestocked: '2023-07-01T12:30:00Z'
  },
  {
    id: 'inv-8',
    name: 'Ghee',
    category: 'Dairy',
    quantity: 4,
    unit: 'liter',
    thresholdLevel: 1,
    cost: 650,
    supplier: 'Traditional Dairy Products',
    lastRestocked: '2023-06-30T14:00:00Z'
  },
  {
    id: 'inv-9',
    name: 'Tomatoes',
    category: 'Vegetables',
    quantity: 7,
    unit: 'kg',
    thresholdLevel: 2,
    cost: 60,
    supplier: 'Fresh Veggies Market',
    lastRestocked: '2023-07-05T09:30:00Z'
  },
  {
    id: 'inv-10',
    name: 'South Indian Spice Mix',
    category: 'Spices',
    quantity: 3,
    unit: 'kg',
    thresholdLevel: 1,
    cost: 850,
    supplier: 'Traditional Spices Co',
    lastRestocked: '2023-06-25T10:00:00Z'
  }
];
