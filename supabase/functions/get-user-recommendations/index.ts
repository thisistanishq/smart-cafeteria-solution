
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    // Get user's order history
    const { data: orderHistory, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('customer_id', userId);
      
    if (orderError) throw new Error(orderError.message);
    
    // Get all menu items
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select('*');
      
    if (menuError) throw new Error(menuError.message);
    
    // Simple recommendation engine based on what the user has ordered before
    // In a production app, you'd use a more sophisticated algorithm
    
    // Extract all ordered item IDs
    let orderedItemIds: string[] = [];
    let orderedCategories: string[] = [];
    
    orderHistory?.forEach(order => {
      order.order_items?.forEach((item: any) => {
        orderedItemIds.push(item.menu_item_id);
        
        // Find the menu item to get its category
        const menuItem = menuItems?.find(mi => mi.id === item.menu_item_id);
        if (menuItem?.category) {
          orderedCategories.push(menuItem.category);
        }
      });
    });
    
    // Count occurrences of each category
    const categoryCounts: Record<string, number> = {};
    orderedCategories.forEach(category => {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    // Find the most ordered category
    let favoriteCategory = '';
    let maxCount = 0;
    
    Object.entries(categoryCounts).forEach(([category, count]) => {
      if (count > maxCount) {
        maxCount = count;
        favoriteCategory = category;
      }
    });
    
    // Recommend items from the user's favorite category that they haven't tried yet
    const recommendations = menuItems
      ?.filter(item => item.category === favoriteCategory && !orderedItemIds.includes(item.id))
      .slice(0, 3);
    
    // If we don't have enough recommendations, add some popular items
    if (!recommendations || recommendations.length < 3) {
      const popularItems = menuItems
        ?.filter(item => item.is_popular && !orderedItemIds.includes(item.id) && 
                        (!recommendations || !recommendations.some(r => r.id === item.id)))
        .slice(0, 3 - (recommendations?.length || 0));
        
      return new Response(JSON.stringify({ 
        recommendations: [...(recommendations || []), ...(popularItems || [])],
        favoriteCategory
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      recommendations,
      favoriteCategory
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
