
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
    // Fix: Use a custom function or hardcoded categories instead of directly querying
    // Since there's no categories table, we'll return predefined categories
    const categories = [
      'breakfast',
      'lunch',
      'dinner',
      'snacks',
      'beverages',
      'desserts'
    ];
    return { data: categories, error: null };
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
    // Fix: Use proper type casting for the status
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status: status as any, 
        ...additionalData 
      })
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

// New AI service for smart recommendations
export const aiService = {
  // Get AI recommendations for users based on order history
  async getUserRecommendations(userId: string) {
    const { data, error } = await supabase.functions.invoke('get-user-recommendations', {
      body: { userId }
    });
    return { data, error };
  },
  
  // Get AI recommendations for inventory management
  async getInventoryRecommendations() {
    const { data, error } = await supabase.functions.invoke('get-inventory-recommendations');
    return { data, error };
  },
  
  // Get sales predictions based on historical data
  async getSalesPredictions() {
    const { data, error } = await supabase.functions.invoke('get-sales-predictions');
    return { data, error };
  },

  // Process chat message with AI
  async processChatMessage(message: string, chatHistory: Array<{role: string, content: string}>) {
    const { data, error } = await supabase.functions.invoke('process-chat-message', {
      body: { message, chatHistory }
    });
    return { data, error };
  }
};

// New Razorpay service
export const razorpayService = {
  // Create a Razorpay order
  async createOrder(amount: number) {
    const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
      body: { amount }
    });
    return { data, error };
  },
  
  // Verify a Razorpay payment
  async verifyPayment(paymentId: string, orderId: string, signature: string) {
    const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
      body: { paymentId, orderId, signature }
    });
    return { data, error };
  }
};

// New Staff Management service
export const staffService = {
  // Add a new cafeteria staff member (admin only)
  async addCafeteriaStaff(name: string, email: string, password: string) {
    const { data, error } = await supabase.functions.invoke('add-cafeteria-staff', {
      body: { 
        name, 
        email, 
        password 
      }
    });
    return { data, error };
  },
  
  // Get all cafeteria staff (admin only)
  async getAllStaff() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'cafeteria_staff');
    return { data, error };
  }
};

// New Admin Dashboard service
export const adminService = {
  // Get daily analytics
  async getDailyAnalytics(date?: string) {
    const today = date || new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('analytics_daily')
      .select('*')
      .eq('date', today)
      .single();
    
    return { data, error };
  },
  
  // Get waste tracking data
  async getWasteData(fromDate?: string, toDate?: string) {
    let query = supabase
      .from('waste_tracking')
      .select('*')
      .order('recorded_at', { ascending: false });
    
    if (fromDate) {
      query = query.gte('recorded_at', fromDate);
    }
    
    if (toDate) {
      query = query.lte('recorded_at', toDate);
    }
    
    const { data, error } = await query;
    return { data, error };
  },
  
  // Track food waste
  async trackWaste(wasteData: {
    item_name: string;
    quantity: number;
    cost: number;
    reason: string;
    item_id?: string;
  }) {
    const { data, error } = await supabase
      .from('waste_tracking')
      .insert([wasteData])
      .select();
    
    return { data, error };
  },
  
  // Get low stock alerts
  async getLowStockAlerts() {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .lte('quantity', supabase.raw('threshold'))
      .order('quantity', { ascending: true });
    
    return { data, error };
  },
  
  // Get sales by date range
  async getSalesByDateRange(fromDate: string, toDate: string) {
    const { data, error } = await supabase
      .from('analytics_daily')
      .select('*')
      .gte('date', fromDate)
      .lte('date', toDate)
      .order('date', { ascending: false });
    
    return { data, error };
  }
};
