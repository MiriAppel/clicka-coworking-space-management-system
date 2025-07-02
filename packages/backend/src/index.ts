import dotenv from 'dotenv';

dotenv.config(); 
console.log('SUPABASE_URL at supabaseClient:', process.env.SUPABASE_URL);

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});


import app from './app';
console.log('process.env.GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);


const PORT = process.env.PORT || 3001;
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open your browser and go to http://localhost:${PORT}`);
});

