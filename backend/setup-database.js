import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.error('Please create a .env file with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up database tables...');
    
    // Create ads table
    console.log('1. Creating ads table...');
    const { error: adsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.ads (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          product_name TEXT NOT NULL,
          product_description TEXT NOT NULL,
          duration INTEGER NOT NULL,
          final_video_url TEXT,
          final_video_duration INTEGER,
          status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
          total_cost_estimate DECIMAL(10,4) DEFAULT 0.00
        );
      `
    });
    
    if (adsError) {
      console.log('⚠️ Ads table creation (might already exist):', adsError.message);
    } else {
      console.log('✅ Ads table created successfully');
    }
    
    // Create indexes
    console.log('2. Creating indexes...');
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS ads_user_id_idx ON public.ads(user_id);
        CREATE INDEX IF NOT EXISTS ads_status_idx ON public.ads(status);
        CREATE INDEX IF NOT EXISTS ads_created_at_idx ON public.ads(created_at);
      `
    });
    
    if (indexError) {
      console.log('⚠️ Index creation (might already exist):', indexError.message);
    } else {
      console.log('✅ Indexes created successfully');
    }
    
    // Enable RLS
    console.log('3. Enabling Row Level Security...');
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
      `
    });
    
    if (rlsError) {
      console.log('⚠️ RLS enable (might already be enabled):', rlsError.message);
    } else {
      console.log('✅ RLS enabled successfully');
    }
    
    // Create RLS policies
    console.log('4. Creating RLS policies...');
    const { error: policyError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Users can only see their own ads
        DROP POLICY IF EXISTS "Users can view own ads" ON public.ads;
        CREATE POLICY "Users can view own ads" ON public.ads
          FOR SELECT USING (auth.uid() = user_id);
        
        DROP POLICY IF EXISTS "Users can insert own ads" ON public.ads;
        CREATE POLICY "Users can insert own ads" ON public.ads
          FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        DROP POLICY IF EXISTS "Users can update own ads" ON public.ads;
        CREATE POLICY "Users can update own ads" ON public.ads
          FOR UPDATE USING (auth.uid() = user_id);
        
        DROP POLICY IF EXISTS "Users can delete own ads" ON public.ads;
        CREATE POLICY "Users can delete own ads" ON public.ads
          FOR DELETE USING (auth.uid() = user_id);
      `
    });
    
    if (policyError) {
      console.log('⚠️ Policy creation (might already exist):', policyError.message);
    } else {
      console.log('✅ RLS policies created successfully');
    }
    
    console.log('🎉 Database setup completed successfully!');
    console.log('You can now run the health check and it should pass.');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('You may need to run the SQL manually in your Supabase dashboard:');
    console.error('1. Go to your Supabase project dashboard');
    console.error('2. Click on "SQL Editor"');
    console.error('3. Copy and paste the contents of db.sql');
    console.error('4. Run the SQL commands');
  }
}

setupDatabase();
