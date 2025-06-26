import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  const { data, error } = await supabase.from('leads').select().limit(1);
  console.log(data, error);
}

testSupabase();
