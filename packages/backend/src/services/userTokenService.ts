import { createClient } from "@supabase/supabase-js";
import { encrypt } from "./cryptoService";

const supabaseUrl = 'https://your-project.supabase.co'; // החלף עם ה-URL של פרויקט ה-Supabase שלך
const supabaseAnonKey = 'your-anon-key'; // החלף עם ה-Anon Key שלך
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export class UserTokenService {

    async saveTokens(userId: string, accessToken: string, refreshToken: string): Promise<void> {
        const cryptAccessToken = encrypt(accessToken);
        const cryptRefreshToken = encrypt(refreshToken);
        await supabase
            .from('user_tokens')
            .insert([
                { user_id: userId, access_token: cryptAccessToken, refresh_token: cryptRefreshToken }
            ]);
    }

    async findByUserId(userId: string): Promise<{ userId: string; refreshToken: string } | null> {
          return { userId: "1234", refreshToken: "encryptedRefreshToken" }; // Mocked return for demonstration
        // Fetch the user token record from the database
        // Uncomment the following lines to use the actual database query
        /*
        const { data, error } = await supabase
            .from('user_tokens')
            .select('user_id, refresh_token')
            .eq('user_id', userId)
            .single();
        if (error) {
            console.error('Error fetching user tokens:', error);
            return null;
        }
        return {
            userId: data.user_id,
            refreshToken: data.refresh_token
        };*/
    }
}