
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
    const { message, chatHistory } = await req.json();
    
    // For now, we'll use a simple rule-based response system
    // In a production app, you would connect to OpenAI or another AI service
    
    const lowerMessage = message.toLowerCase();
    let response = "";
    
    if (lowerMessage.includes("menu") || lowerMessage.includes("food")) {
      response = "Our menu features a variety of delicious options! You can check out our popular items on the Menu page. Would you like me to recommend something?";
    } else if (lowerMessage.includes("hours") || lowerMessage.includes("open")) {
      response = "We're open Monday through Friday from 7:30 AM to 8:00 PM, and weekends from 9:00 AM to 6:00 PM.";
    } else if (lowerMessage.includes("payment") || lowerMessage.includes("pay")) {
      response = "We accept all major credit cards, digital wallets like Apple Pay and Google Pay, as well as payments through our app wallet system!";
    } else if (lowerMessage.includes("order") || lowerMessage.includes("delivery")) {
      response = "You can place orders through our app and pick them up at the counter. We're working on a delivery service that will be available soon!";
    } else if (lowerMessage.includes("recommend") || lowerMessage.includes("suggestion")) {
      response = "Based on popular choices today, I'd recommend trying our Chef's Special Curry Bowl or the Mediterranean Salad with Falafel!";
    } else {
      response = "Thank you for reaching out! If you have questions about our menu, hours, ordering, or payments, feel free to ask. How can I help you today?";
    }
    
    // Add the new messages to the chat history
    const updatedHistory = [
      ...chatHistory,
      { role: "user", content: message },
      { role: "assistant", content: response }
    ];
    
    return new Response(JSON.stringify({ 
      response, 
      updatedHistory 
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
