
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get inventory items
    const { data: inventoryData, error: inventoryError } = await supabase
      .from('inventory')
      .select('*');
      
    if (inventoryError) {
      throw inventoryError;
    }
    
    // Get recent orders to analyze consumption patterns
    const { data: recentOrders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        id,
        created_at,
        order_items (
          item_id,
          quantity
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50);
      
    if (ordersError) {
      throw ordersError;
    }
    
    // Get menu items to cross-reference with inventory
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select('id, name, ingredients');
      
    if (menuError) {
      throw menuError;
    }
    
    // Process data to generate recommendations
    const lowStockItems = inventoryData.filter(item => 
      item.quantity <= item.threshold * 1.2
    ).map(item => ({
      id: item.id,
      name: item.name,
      currentQuantity: item.quantity,
      threshold: item.threshold,
      unit: item.unit,
      urgency: item.quantity <= item.threshold ? 'critical' : 'warning',
      recommendation: `Restock ${item.name} soon. Current level: ${item.quantity} ${item.unit} (threshold: ${item.threshold} ${item.unit})`
    }));
    
    // Generate consumption rate analysis
    const consumptionRates = calculateConsumptionRates(inventoryData, recentOrders, menuItems);
    
    // Generate waste reduction recommendations
    const wasteRecommendations = generateWasteRecommendations(inventoryData, consumptionRates);
    
    // Combine all recommendations
    const recommendations = {
      lowStockAlerts: lowStockItems,
      consumptionAnalysis: consumptionRates,
      wasteReduction: wasteRecommendations
    };
    
    return new Response(
      JSON.stringify(recommendations),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error("Error generating inventory recommendations:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate recommendations" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});

// Helper function to calculate consumption rates
function calculateConsumptionRates(inventory: any[], orders: any[], menuItems: any[]) {
  // This is a simplified implementation - a real one would do more sophisticated analysis
  
  const ingredientUsage: Record<string, number> = {};
  
  // Calculate how many times each ingredient was used
  orders.forEach(order => {
    if (order.order_items && order.order_items.length > 0) {
      order.order_items.forEach((orderItem: any) => {
        const menuItem = menuItems.find(item => item.id === orderItem.item_id);
        if (menuItem && menuItem.ingredients) {
          menuItem.ingredients.forEach((ingredient: string) => {
            if (!ingredientUsage[ingredient]) {
              ingredientUsage[ingredient] = 0;
            }
            ingredientUsage[ingredient] += orderItem.quantity;
          });
        }
      });
    }
  });
  
  // Match usage to inventory items
  return inventory.map(item => {
    const usageRate = ingredientUsage[item.name] || 0;
    const daysUntilEmpty = usageRate > 0 ? Math.round(item.quantity / (usageRate / 7)) : 999;
    
    return {
      id: item.id,
      name: item.name,
      estimatedDailyUsage: usageRate / 7, // Convert to daily rate assuming orders are from the last week
      daysUntilReorder: daysUntilEmpty,
      recommendation: daysUntilEmpty < 14 
        ? `Based on current usage, ${item.name} will need reordering in approximately ${daysUntilEmpty} days.`
        : `Sufficient ${item.name} stock for current demand.`
    };
  });
}

// Helper function to generate waste reduction recommendations
function generateWasteRecommendations(inventory: any[], consumptionRates: any[]) {
  // Identify items with low consumption and high stock
  const potentialWasteItems = consumptionRates
    .filter(item => item.estimatedDailyUsage < 0.5 && item.daysUntilReorder > 30)
    .map(item => {
      const inventoryItem = inventory.find(invItem => invItem.id === item.id);
      return {
        id: item.id,
        name: item.name,
        currentStock: inventoryItem ? inventoryItem.quantity : 0,
        estimatedDailyUsage: item.estimatedDailyUsage,
        recommendation: `Consider reducing order quantity for ${item.name}. Current stock will last ${item.daysUntilReorder} days at current usage.`
      };
    });
    
  return potentialWasteItems;
}
