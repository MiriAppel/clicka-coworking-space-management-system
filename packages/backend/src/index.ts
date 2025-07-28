import app from './app';
import cron from 'node-cron';
import { renewGoogleWebhook } from './services/googleCalendarSync.service';
import dotenv from 'dotenv';
dotenv.config(); 

console.log('SUPABASE_URL at supabaseClient:', process.env.SUPABASE_URL);
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY);

dotenv.config();
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY);
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

console.log('process.env.GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open your browser and go to http://localhost:${PORT}`);
});


// '0 3 * * 0'תריץ כל שבוע (יום ראשון ב-03:00)
// cron.schedule('* * * * *', async () => {
//   await renewGoogleWebhook();
// });