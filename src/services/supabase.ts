
import { supabase } from '@/integrations/supabase/client';
import type { User, MenuItem, Order, OrderItem, InventoryItem, Transaction } from '@/types';

// Authentication services
export const authService = {
  // Sign up a new user
  async signUp(email: string, password: string, userData: { name: string, role: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  // Sign in a user
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get the current session
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  },

  // Get the current user
  async getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};

// Profile services
export const profileService = {
  // Get user profile
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  // Update user profile
  async updateProfile(userId: string, profile: Partial<User>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', userId);
    return { data, error };
  },

  // Get all profiles (admin only)
  async getAllProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    return { data, error };
  }
};

// Menu services
export const menuService = {
  // Get all menu items
  async getAllMenuItems() {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*');
    return { data, error };
  },

  // Get menu item by id
  async getMenuItem(id: string) {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  // Add a menu item
  async addMenuItem(item: Omit<MenuItem, 'id'>) {
    const { data, error } = await supabase
      .from('menu_items')
      .insert([item])
      .select();
    return { data, error };
  },

  // Update a menu item
  async updateMenuItem(id: string, item: Partial<MenuItem>) {
    const { data, error } = await supabase
      .from('menu_items')
      .update(item)
      .eq('id', id);
    return { data, error };
  },

  // Get all categories
  async getAllCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    return { data, error };
  }
};

// Order services
export const orderService = {
  // Get user orders
  async getUserOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Get all orders (staff only)
  async getAllOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Get order by id
  async getOrder(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();
    return { data, error };
  },

  // Create a new order
  async createOrder(order: any, orderItems: any[]) {
    // Start a transaction
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();

    if (orderError) return { data: null, error: orderError };

    // Add order items with the order id
    const itemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: orderData.id
    }));

    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsWithOrderId)
      .select();

    return { 
      data: { order: orderData, items: itemsData }, 
      error: itemsError 
    };
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: string, additionalData = {}) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, ...additionalData })
      .eq('id', orderId);
    return { data, error };
  }
};

// Wallet services
export const walletService = {
  // Get user transactions
  async getUserTransactions(userId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Add funds to wallet
  async addFunds(userId: string, amount: number, description: string) {
    // First update the wallet balance
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('wallet_balance')
      .eq('id', userId)
      .single();

    if (userError) return { data: null, error: userError };

    const { data: updateData, error: updateError } = await supabase
      .from('profiles')
      .update({ wallet_balance: userData.wallet_balance + amount })
      .eq('id', userId);

    if (updateError) return { data: null, error: updateError };

    // Then create a transaction record
    const { data: transactionData, error: transactionError } = await supabase
      .from('transactions')
      .insert([{
        user_id: userId,
        amount,
        type: 'deposit',
        status: 'completed',
        description
      }])
      .select();

    return { data: transactionData, error: transactionError };
  },

  // Make a payment from wallet
  async makePayment(userId: string, amount: number, description: string, referenceId?: string) {
    // First update the wallet balance
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('wallet_balance')
      .eq('id', userId)
      .single();

    if (userError) return { data: null, error: userError };

    if (userData.wallet_balance < amount) {
      return { data: null, error: { message: 'Insufficient balance' } };
    }

    const { data: updateData, error: updateError } = await supabase
      .from('profiles')
      .update({ wallet_balance: userData.wallet_balance - amount })
      .eq('id', userId);

    if (updateError) return { data: null, error: updateError };

    // Then create a transaction record
    const { data: transactionData, error: transactionError } = await supabase
      .from('transactions')
      .insert([{
        user_id: userId,
        amount,
        type: 'payment',
        status: 'completed',
        description,
        reference_id: referenceId
      }])
      .select();

    return { data: transactionData, error: transactionError };
  }
};

// Inventory services
export const inventoryService = {
  // Get all inventory items
  async getAllInventory() {
    const { data, error } = await supabase
      .from('inventory')
      .select('*');
    return { data, error };
  },

  // Add new inventory item
  async addInventoryItem(item: Omit<InventoryItem, 'id'>) {
    // Fixed: ensure we're passing a single item and correctly mapping property names
    const { data, error } = await supabase
      .from('inventory')
      .insert({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        threshold: item.thresholdLevel,
        cost_per_unit: item.cost,
      })
      .select();
    return { data, error };
  },

  // Update inventory item
  async updateInventoryItem(id: string, updates: Partial<InventoryItem>) {
    // Ensure we're correctly mapping properties when updating
    const dbUpdates: any = {};
    
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.quantity !== undefined) dbUpdates.quantity = updates.quantity;
    if (updates.unit !== undefined) dbUpdates.unit = updates.unit;
    if (updates.thresholdLevel !== undefined) dbUpdates.threshold = updates.thresholdLevel;
    if (updates.cost !== undefined) dbUpdates.cost_per_unit = updates.cost;
    
    const { data, error } = await supabase
      .from('inventory')
      .update(dbUpdates)
      .eq('id', id);
    return { data, error };
  }
};
