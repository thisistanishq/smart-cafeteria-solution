
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const { message, chatHistory } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'No message provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Here we would normally call an actual AI service like OpenAI
    // But for now, we'll implement a rules-based approach
    
    const lowerMsg = message.toLowerCase();
    let response = '';
    
    // Check for food order intents
    if (lowerMsg.includes('order') || lowerMsg.includes('get') || lowerMsg.includes('want')) {
      if (lowerMsg.includes('dosa') || lowerMsg.includes('masala dosa')) {
        response = "I can add Masala Dosa to your cart. Would you like me to do that for you?";
      } else if (lowerMsg.includes('idli') || lowerMsg.includes('idly')) {
        response = "I'd be happy to add Idli Sambar to your cart. Should I proceed?";
      } else if (lowerMsg.includes('coffee')) {
        response = "Our Filter Coffee is very popular. I can add it to your cart if you'd like?";
      } else {
        response = "What specific food items would you like to order? We have South Indian specialties like Dosa, Idli, and more.";
      }
    }
    
    // Check for dietary restrictions
    else if (lowerMsg.includes('diabetes') || lowerMsg.includes('diabetic')) {
      response = "For people with diabetes, I recommend lower carb options like Rasam, Vegetable Curry without rice, or small portions of Idli. These items have a lower glycemic index.";
    }
    
    // Check for recommendations
    else if (lowerMsg.includes('recommend') || lowerMsg.includes('suggestion') || lowerMsg.includes('popular')) {
      response = "Based on our most popular items, I recommend Masala Dosa, Hyderabadi Biryani, and Filter Coffee. These are customer favorites!";
    }
    
    // Check for vegetarian options
    else if (lowerMsg.includes('vegetarian') || lowerMsg.includes('veg')) {
      response = "We have many vegetarian options! Our Masala Dosa, Idli Sambar, and Pongal are excellent vegetarian choices that are very popular.";
    }
    
    // Check for spicy food
    else if (lowerMsg.includes('spicy')) {
      response = "If you enjoy spicy food, try our Chettinad Chicken Curry, Bisi Bele Bath, or our spicy Masala Dosa. These are known for their vibrant flavors and heat!";
    }
    
    // Default response
    else {
      response = "I can help you find food items, make recommendations based on dietary preferences, or answer questions about our menu. Is there something specific you're looking for?";
    }

    return new Response(
      JSON.stringify({ message: response }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing chat:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process message' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
