
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  vegetarian: boolean;
  calories?: number;
}

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
    
    const { message, chatHistory } = await req.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ 
          error: "Message is required" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }
    
    console.log("Processing message:", message);
    
    // Get menu items for context
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select('id, name, description, price, category, vegetarian, calories');
      
    if (menuError) {
      console.error("Error fetching menu items:", menuError);
    }
    
    // Format menu items as context information
    const menuContext = menuItems ? formatMenuForContext(menuItems) : "";
    
    // Process the message based on the content
    let response = "";
    
    // Check for food recommendation requests
    if (message.toLowerCase().includes("recommend") || 
        message.toLowerCase().includes("suggestion") ||
        message.toLowerCase().includes("what should i")) {
      
      // Extract any dietary preferences
      const isVegetarian = message.toLowerCase().includes("vegetarian") || message.toLowerCase().includes("veg");
      const isDiabetic = message.toLowerCase().includes("diabetes") || message.toLowerCase().includes("diabetic");
      const isLowCalorie = message.toLowerCase().includes("low calorie") || message.toLowerCase().includes("diet");
      
      response = generateRecommendation(menuItems, isVegetarian, isDiabetic, isLowCalorie);
    }
    // Check for order intent
    else if (message.toLowerCase().includes("order") || 
             message.toLowerCase().includes("want") || 
             message.toLowerCase().includes("get") || 
             message.toLowerCase().includes("add to cart")) {
      
      // Find menu item in the message
      const menuItemsLower = menuItems?.map(item => ({
        ...item,
        nameLower: item.name.toLowerCase()
      })) || [];
      
      let foundItem = null;
      for (const item of menuItemsLower) {
        if (message.toLowerCase().includes(item.nameLower)) {
          foundItem = menuItems?.find(m => m.id === item.id);
          break;
        }
      }
      
      if (foundItem) {
        response = `I can help you add ${foundItem.name} to your cart. It costs ₹${foundItem.price}. Just tap the "Add to Cart" button on the menu page, or I can add it directly for you if you click the button below.`;
      } else {
        response = `I'd be happy to help you order. Please let me know which specific item from our menu you'd like to order.`;
      }
    }
    // General questions about the cafeteria
    else if (message.toLowerCase().includes("hour") || message.toLowerCase().includes("time") || message.toLowerCase().includes("open")) {
      response = "The cafeteria is open from 7:30 AM to 9:30 PM every day of the week.";
    }
    else if (message.toLowerCase().includes("payment") || message.toLowerCase().includes("pay")) {
      response = "We accept multiple payment methods including campus wallet, UPI, credit/debit cards, and cash. The wallet is the fastest way to pay!";
    }
    else if (message.toLowerCase().includes("wallet") || message.toLowerCase().includes("balance")) {
      response = "You can check your wallet balance and add funds on the Wallet page. It's the most convenient way to pay for your orders.";
    }
    else if (message.toLowerCase().includes("special") || message.toLowerCase().includes("today")) {
      response = "Today's specials include our chef's special Masala Dosa for breakfast and Paneer Butter Masala for lunch. Both are highly recommended!";
    }
    else {
      // Default response
      response = "I'm your cafeteria assistant! I can help with menu recommendations, placing orders, checking hours, or answering questions about our services. How can I assist you today?";
    }
    
    console.log("Generated response:", response);
    
    return new Response(
      JSON.stringify({ 
        response: response,
        actionable: message.toLowerCase().includes("order") || message.toLowerCase().includes("add to cart")
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error("Error processing message:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to process message" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});

// Helper function to format menu items for context
function formatMenuForContext(menuItems: MenuItem[]): string {
  return menuItems.map(item => 
    `${item.name}: ${item.description}. Price: ₹${item.price}. Category: ${item.category}. ${item.vegetarian ? 'Vegetarian' : 'Non-vegetarian'}. ${item.calories ? `${item.calories} calories.` : ''}`
  ).join('\n');
}

// Helper function to generate food recommendations
function generateRecommendation(menuItems: MenuItem[] | null, isVegetarian: boolean, isDiabetic: boolean, isLowCalorie: boolean): string {
  if (!menuItems || menuItems.length === 0) {
    return "I'm sorry, I can't provide recommendations right now. Please check our menu page.";
  }
  
  let filteredItems = [...menuItems];
  
  // Apply filters based on preferences
  if (isVegetarian) {
    filteredItems = filteredItems.filter(item => item.vegetarian);
  }
  
  if (isDiabetic) {
    // Filter for diabetic-friendly items (lower carbs, typically)
    filteredItems = filteredItems.filter(item => 
      !item.name.toLowerCase().includes("sweet") && 
      !item.name.toLowerCase().includes("dessert") &&
      !item.name.toLowerCase().includes("sugar") &&
      !item.name.toLowerCase().includes("jamun") &&
      item.category !== 'desserts'
    );
  }
  
  if (isLowCalorie && filteredItems.some(item => item.calories)) {
    // Sort by calories if available
    filteredItems.sort((a, b) => (a.calories || 1000) - (b.calories || 1000));
    // Take lowest calorie items
    filteredItems = filteredItems.slice(0, Math.min(3, filteredItems.length));
  }
  
  if (filteredItems.length === 0) {
    return "I couldn't find menu items matching your specific dietary requirements. Please check with our cafeteria staff for customized options.";
  }
  
  // Randomly select up to 3 items to recommend
  const recommended = filteredItems
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.min(3, filteredItems.length));
  
  let response = "Based on your preferences, I recommend:";
  
  recommended.forEach(item => {
    response += `\n• ${item.name}: ${item.description}. ₹${item.price}${item.calories ? ` (${item.calories} calories)` : ''}`;
  });
  
  return response;
}
