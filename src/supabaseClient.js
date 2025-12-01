// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Your actual project URL + anon key
const supabaseUrl = 'https://erxefdffqbjqznloamps.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyeGVmZGZmcWJqcXpubG9hbXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MTEzMjMsImV4cCI6MjA4MDE4NzMyM30.axTF0Yj5O9porabsodIIgc8p26i5p0V2BOgHQiavN34';

export const supabase = createClient(supabaseUrl, supabaseKey);
