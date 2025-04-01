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
    
    // Get historical sales data from analytics
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('analytics_daily')
      .select('*')
      .order('date', { ascending: true });
      
    if (analyticsError) {
      throw analyticsError;
    }
    
    // Get recent orders to analyze patterns
    const { data: recentOrders, error: ordersError } = await supabase
      .from('orders')
      .select('id, created_at, total_amount, status')
      .order('created_at', { ascending: false })
      .limit(100);
      
    if (ordersError) {
      throw ordersError;
    }
    
    // Get menu items to analyze popularity
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select('*');
      
    if (menuError) {
      throw menuError;
    }
    
    // Generate sales predictions
    const predictions = generateSalesPredictions(analyticsData, recentOrders, menuItems);
    
    return new Response(
      JSON.stringify(predictions),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error("Error generating sales predictions:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate sales predictions" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});

// Helper function to generate sales predictions
function generateSalesPredictions(analyticsData: any[], recentOrders: any[], menuItems: any[]) {
  // In a real AI system, this would use more sophisticated statistical models
  // For demonstration, we'll use a simple moving average and trend analysis
  
  const today = new Date();
  
  // Generate daily sales for the last 30 days (use real data if available)
  const dailySales = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - (29 - i));
    
    // Find analytics data for this date if it exists
    const analyticsForDate = analyticsData.find(data => 
      new Date(data.date).toDateString() === date.toDateString()
    );
    
    // Otherwise compute from orders or use a random value within reasonable range
    const salesValue = analyticsForDate 
      ? analyticsForDate.total_sales
      : Math.floor(Math.random() * 5000) + 3000; // Random value between 3000-8000 if no data
      
    dailySales.push({
      date: date.toISOString().split('T')[0],
      value: salesValue,
      isActual: !!analyticsForDate
    });
  }
  
  // Simple moving average for trend detection
  const movingAvgWindow = 7;
  const movingAverages = [];
  for (let i = movingAvgWindow - 1; i < dailySales.length; i++) {
    const window = dailySales.slice(i - (movingAvgWindow - 1), i + 1);
    const sum = window.reduce((acc, day) => acc + day.value, 0);
    const avg = sum / movingAvgWindow;
    movingAverages.push({
      date: dailySales[i].date,
      value: avg
    });
  }
  
  // Calculate basic trend for projection
  const trend = movingAverages.length > 1 
    ? (movingAverages[movingAverages.length - 1].value - movingAverages[0].value) / movingAverages.length
    : 0;
  
  // Project for next 14 days
  const futureSales = [];
  let lastValue = dailySales[dailySales.length - 1].value;
  
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Apply trend and some randomness
    lastValue = lastValue + trend + (Math.random() * 500 - 250);
    
    // Add day-of-week patterns
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Weekends have 20% less sales
      lastValue = lastValue * 0.8;
    } else if (dayOfWeek === 5) {
      // Fridays have 10% more sales
      lastValue = lastValue * 1.1;
    }
    
    futureSales.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(500, Math.round(lastValue)), // Ensure no negative or extremely low values
      isActual: false
    });
  }
  
  // Analyze top-selling items
  const topSellingItems = getTopSellingItems(analyticsData, menuItems);
  
  // Generate recommendations
  const recommendations = generateRecommendations(dailySales, futureSales, topSellingItems, trend);
  
  return {
    historicalSales: dailySales,
    salesForecast: futureSales,
    topSellingItems: topSellingItems,
    salesTrend: trend > 0 ? "positive" : trend < 0 ? "negative" : "stable",
    trendPercentage: trend !== 0 ? (trend / dailySales[0].value * 100).toFixed(2) : "0",
    recommendations: recommendations
  };
}

// Helper function to identify top-selling items
function getTopSellingItems(analyticsData: any[], menuItems: any[]) {
  // Combine all top selling items from analytics
  const allTopItems: Record<string, number> = {};
  
  analyticsData.forEach(day => {
    if (day.top_selling_items && Array.isArray(day.top_selling_items)) {
      day.top_selling_items.forEach((item: any) => {
        if (!allTopItems[item.id]) {
          allTopItems[item.id] = 0;
        }
        allTopItems[item.id] += item.quantity || 1;
      });
    }
  });
  
  // Convert to array and sort by quantity
  const topItems = Object.entries(allTopItems)
    .map(([id, quantity]) => {
      const menuItem = menuItems.find(item => item.id === id);
      return {
        id,
        name: menuItem ? menuItem.name : 'Unknown Item',
        quantity,
        revenue: menuItem ? menuItem.price * quantity : 0,
        category: menuItem ? menuItem.category : 'unknown'
      };
    })
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5); // Get top 5
    
  return topItems;
}

// Helper function to generate business recommendations
function generateRecommendations(historicalSales: any[], futureSales: any[], topItems: any[], trend: number) {
  const recommendations = [];
  
  // Trend-based recommendations
  if (trend > 0) {
    recommendations.push({
      type: "positive",
      title: "Sales Trending Upward",
      description: "Sales are trending upward. Consider increasing inventory for popular items to meet demand."
    });
  } else if (trend < 0) {
    recommendations.push({
      type: "negative",
      title: "Sales Trending Downward",
      description: "Sales are trending downward. Consider promotions or specials to increase customer traffic."
    });
  }
  
  // Recommendations based on top-selling items
  if (topItems.length > 0) {
    recommendations.push({
      type: "insight",
      title: "Menu Optimization",
      description: `Focus on your top sellers: ${topItems.slice(0, 3).map(item => item.name).join(', ')}. Consider featuring these items prominently.`
    });
  }
  
  // Day of week patterns
  const weekdayAvg = historicalSales.filter((_, i) => i % 7 !== 0 && i % 7 !== 6).reduce((sum, day) => sum + day.value, 0) / 
                   historicalSales.filter((_, i) => i % 7 !== 0 && i % 7 !== 6).length;
  const weekendAvg = historicalSales.filter((_, i) => i % 7 === 0 || i % 7 === 6).reduce((sum, day) => sum + day.value, 0) /
                   historicalSales.filter((_, i) => i % 7 === 0 || i % 7 === 6).length;
                   
  if (weekendAvg < weekdayAvg * 0.7) {
    recommendations.push({
      type: "insight",
      title: "Weekend Performance",
      description: "Weekend sales are significantly lower than weekdays. Consider special weekend promotions or adjusted hours."
    });
  }
  
  // Add more sophisticated recommendations as needed
  
  return recommendations;
}
