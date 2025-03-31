
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: MenuCategory;
  veg: boolean;
  rating?: number;
  status?: 'available' | 'out_of_stock' | 'coming_soon';
  preparation_time?: number;
  calories?: number;
  tags?: string[];
  totalOrders?: number;
}

export type MenuCategory = 
  | 'breakfast' 
  | 'lunch' 
  | 'dinner' 
  | 'dessert' 
  | 'beverage' 
  | 'appetizer' 
  | 'main_course' 
  | 'curry' 
  | 'rice' 
  | 'bread';

export interface CartItemType {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  imageUrl?: string;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail?: string;
  items: CartItemType[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  completedAt?: Date;
  estimatedReadyTime?: Date;
  specialInstructions?: string;
  razorpayPaymentId?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'wallet' | 'card' | 'upi' | 'cash' | 'other';

export type UserRole = 'student' | 'staff' | 'cafeteria_staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  walletBalance: number;
  phone?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'credit' | 'debit' | 'refund';
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  description?: string;
  referenceId?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  threshold: number;
  costPerUnit: number;
}

export interface WasteLog {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  wasteType: 'expired' | 'damaged' | 'excess' | 'other';
  reason?: string;
  recordedBy?: string;
  createdAt: Date;
}
