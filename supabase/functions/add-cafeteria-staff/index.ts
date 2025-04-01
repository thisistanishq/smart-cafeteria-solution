
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
    // Create Supabase client with admin privileges
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }
    
    // Verify the requesting user is an admin
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid authorization');
    }
    
    // Check if user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (adminError || adminData.role !== 'admin') {
      throw new Error('Only administrators can add cafeteria staff');
    }
    
    // Get request body
    const { name, email, password, role } = await req.json();
    
    if (!name || !email || !password) {
      throw new Error('Missing required fields');
    }
    
    if (role !== 'cafeteria_staff' && role !== 'admin') {
      throw new Error('Invalid role specified');
    }
    
    // Create the new user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role },
    });
    
    if (createError) {
      throw createError;
    }
    
    // Don't need to manually insert to profiles table since we have a trigger
    // that automatically creates a profile when a user is created
    
    // Return the new user data (without sensitive info)
    return new Response(
      JSON.stringify({ 
        id: newUser.user.id,
        email: newUser.user.email,
        name: name,
        role: role,
        message: `${role === 'admin' ? 'Admin' : 'Cafeteria staff'} user created successfully` 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error("Error creating cafeteria staff:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create cafeteria staff" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
});
