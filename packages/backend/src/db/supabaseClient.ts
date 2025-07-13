import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
// // טוען את משתני הסביבה מקובץ .env
dotenv.config();
// dotenv.config({
//   path: path.resolve(__dirname, '../../.env'),
// });
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY);

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
  
);
