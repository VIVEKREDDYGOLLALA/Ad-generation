import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ CRITICAL: Supabase environment variables are missing!');
  console.error('   SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
  process.exit(1);
}

// Validate Supabase URL format
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  console.error('❌ CRITICAL: Invalid Supabase URL format!');
  console.error('   Expected: https://your-project.supabase.co');
  console.error('   Got:', supabaseUrl);
  process.exit(1);
}

// Validate service key format (should be a long string)
if (supabaseServiceKey.length < 100) {
  console.error('❌ CRITICAL: Invalid Supabase service key!');
  console.error('   Service key should be a long string from Supabase dashboard');
  process.exit(1);
}

console.log('✅ Supabase configuration validated successfully');

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test Supabase connection
export async function testSupabaseConnection() {
  try {
    // Test basic connection without requiring auth
    const { data, error } = await supabase.from('ads').select('count').limit(1);
    
    if (error && error.code === '42P01') {
      // Table doesn't exist - this is expected for new setups
      console.log('⚠️ Supabase connected but tables not created yet');
      console.log('   This is normal for new setups. Run the database setup first.');
      return true; // Connection is working, just need tables
    }
    
    if (error && error.code === 'PGRST116') {
      // No rows returned - this is fine for a health check
      console.log('✅ Supabase connection test successful (no data, but connection works)');
      return true;
    }
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection test successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error.message);
    return false;
  }
}
