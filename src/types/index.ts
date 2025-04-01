
// User types
export type UserRole = 'student' | 'staff' | 'cafeteria_staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  walletBalance: number;
  profileImageUrl?: string;
}

// Menu and food item types
export type MenuCategory = 
  | 'breakfast' 
  | 'lunch' 
  | 'dinner' 
  | 'snacks' 
  | 'beverages' 
  | 'desserts';

export type ItemStatus = 'available' | 'unavailable' | 'low_stock';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  imageUrl: string;
  ingredients: string[];
  status: ItemStatus;
  prepTime: number; // in minutes
  calories?: number;
  tags?: string[];
  rating?: number;
  totalOrders?: number;
}

// Order types
export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'ready' 
  | 'completed' 
  | 'cancelled';

export type PaymentMethod = 
  | 'wallet' 
  | 'upi' 
  | 'card' 
  | 'cash';

export type PaymentStatus = 
  | 'pending' 
  | 'completed' 
  | 'failed';

export interface OrderItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  estimatedReadyTime: string;
  completedAt?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  specialInstructions?: string;
}

// Inventory types
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  thresholdLevel: number;
  cost: number;
  supplier: string;
  lastRestocked: string;
}

// Analytics types
export interface SalesData {
  date: string;
  total: number;
  itemsSold: number;
}

export interface WasteData {
  date: string;
  amount: number;
  reason: string;
  foodItems: {
    name: string;
    quantity: number;
  }[];
}

// Wallet/Transaction types
export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'payment';
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  description: string;
  reference?: string;
}
