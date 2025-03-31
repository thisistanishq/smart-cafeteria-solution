
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: MenuCategory;
  veg: boolean;
  rating?: number;
  status: 'available' | 'out_of_stock' | 'coming_soon' | 'unavailable';
  preparation_time?: number;
  prepTime?: number;
  calories?: number;
  tags?: string[];
  totalOrders?: number;
  vegetarian?: boolean;
  bestSeller?: boolean;
  ingredients?: string[];
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
  | 'bread'
  | 'snacks';

export interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  imageUrl?: string;
  specialInstructions?: string;
}

export type OrderItem = CartItem;

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  completedAt?: string;
  estimatedReadyTime?: string;
  specialInstructions?: string;
  razorpayPaymentId?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled' | 'confirmed';
export type PaymentStatus = 'pending' | 'paid' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'wallet' | 'card' | 'upi' | 'cash' | 'other';

export type UserRole = 'student' | 'staff' | 'cafeteria_staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  walletBalance: number;
  phone?: string;
  profileImageUrl?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'credit' | 'debit' | 'refund' | 'deposit' | 'payment' | 'withdrawal';
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  description?: string;
  reference?: string;
  referenceId?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  threshold: number;
  thresholdLevel?: number;
  costPerUnit: number;
  cost?: number;
  supplier?: string;
  lastRestocked?: string;
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
  createdAt: string;
}

export interface AIRecommendation {
  type: 'inventory' | 'menu' | 'pricing' | 'marketing';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  data?: any;
}

export interface SalesAnalytics {
  period: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
  topSellingItems: {
    itemId: string;
    name: string;
    quantity: number;
    revenue: number;
  }[];
}
