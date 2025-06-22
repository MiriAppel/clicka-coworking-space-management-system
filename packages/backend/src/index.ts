import dotenv from 'dotenv';
dotenv.config();
<<<<<<< HEAD
console.log('SUPABASE_URL at supabaseClient:', process.env.SUPABASE_URL);
=======

>>>>>>> origin/main
import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
