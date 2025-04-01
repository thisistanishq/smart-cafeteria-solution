
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://awhcadgkskienzlmrsoj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3aGNhZGdrc2tpZW56bG1yc29qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NjU1NjEsImV4cCI6MjA1OTA0MTU2MX0.e3PF0zYIu6T6yOAESgiSRc61eKY8J4aefycnEzDqxac";

// Initialize the Supabase client with persistence options
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
