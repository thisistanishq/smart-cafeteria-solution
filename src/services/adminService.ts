
import { supabase } from '@/integrations/supabase/client';

// Admin Dashboard Services
export const adminDashboardService = {
  // Get AI recommendations from the database
  async getAIRecommendations() {
    const { data, error } = await supabase
      .from('ai_recommendations')
      .select('*')
      .order('priority', { ascending: true });
    
    return { data, error };
  },
  
  // Get all users with role information
  async getAllUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    return { data, error };
  },
  
  // Add a new cafeteria staff member
  async addCafeteriaStaff(name: string, email: string, password: string) {
    const { data, error } = await supabase.functions.invoke('add-cafeteria-staff', {
      body: { name, email, password }
    });
    
    return { data, error };
  },
  
  // Update user role (admin only)
  async updateUserRole(userId: string, role: string) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);
    
    return { data, error };
  },
  
  // Get low stock alerts
  async getLowStockAlerts() {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .in('status', ['low', 'very_low', 'out_of_stock'])
      .order('status', { ascending: true });
    
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
      .insert([{
        ...wasteData,
        recorded_by: (await supabase.auth.getUser()).data.user?.id
      }])
      .select();
    
    return { data, error };
  },
  
  // Get waste reports
  async getWasteReports() {
    const { data, error } = await supabase
      .from('waste_reports')
      .select('*')
      .order('day', { ascending: false })
      .limit(10);
    
    return { data, error };
  },
  
  // Get sales summary
  async getSalesSummary() {
    const { data, error } = await supabase
      .from('sales_summary')
      .select('*')
      .order('day', { ascending: false })
      .limit(7);
    
    return { data, error };
  }
};
