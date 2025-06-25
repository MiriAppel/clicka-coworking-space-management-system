import { createClient } from "@supabase/supabase-js";
import { encrypt } from "./cryptoService";
import { supabase } from "../db/supabaseClient";
import { UserTokens } from "../models/userTokens.models";
import { randomUUID } from "crypto";


export class UserTokenService {

    async saveTokens(userId: string, refreshToken: string, sessionId?: string): Promise<string> {
        // Encrypt the refresh token before saving
        const cryptRefreshToken = encrypt(refreshToken);
        const activeSessionId = sessionId || randomUUID();
        const checkUser = await this.findByUserId(userId);
        if (checkUser) {
            // If user token already exists, update it
            try {
                await this.updateTokensWithSession(userId, cryptRefreshToken, activeSessionId);
                return activeSessionId;
            } catch (error) {
                console.error('Error updating user tokens:', error);
            }
        }
        const user_tokens: UserTokens = new UserTokens(
            randomUUID(), userId, cryptRefreshToken,
            new Date().toISOString(), new Date().toISOString(),
            activeSessionId, new Date().toISOString(), new Date().toISOString()
        );
        await supabase
            .from('user_tokens')
            .insert([
                user_tokens.toDatabaseFormat()
            ]);
        return activeSessionId;
    }
    async updateTokens(userId: string, cryptRefreshToken: string): Promise<void> {
        const { error } = await supabase
            .from('user_tokens')
            .update({
                refresh_token: cryptRefreshToken,
                updated_at: new Date().toISOString()
            })
            .eq('userId', userId);
        if (error) {
            console.error('Error updating user tokens:', error);
            throw new Error('Failed to update user tokens');
        }
    }
    async updateTokensWithSession(userId: string, cryptRefreshToken: string, activeSessionId: string): Promise<void> {
        const { error } = await supabase
            .from('user_tokens')
            .update({
                refresh_token: cryptRefreshToken,
                activeSessionId: activeSessionId,
                sessionCreatedAt: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('userId', userId);
        if (error) {
            console.error('Error updating user tokens:', error);
            throw new Error('Failed to update user tokens');
        }
    }
    async findByUserId(userId: string): Promise<{ userId: string; refreshToken: string } | null> {
        return { userId: "1234", refreshToken: "encryptedRefreshToken" }; // Mocked return for demonstration
        // Fetch the user token record from the database
        // Uncomment the following lines to use the actual database query
        /*
        const { data, error } = await supabase
            .from('user_tokens')
            .select('user_id, refresh_token, activeSessionId')
            .eq('userId', userId)
            .single();
        if (error) {
            console.error('Error fetching user tokens:', error);
            return null;
        }
        return {
            userId: data.user_id,
            refreshToken: data.refresh_token,
            activeSessionId: data.activeSessionId
        };
    }
        */
    }
    async validateSession(userId: string, sessionId: string): Promise<boolean> {
        const { data, error } = await supabase
            .from('user_tokens')
            .select('activeSessionId')
            .eq('userId', userId)
            .eq('activeSessionId', sessionId)
            .single();
        if (error || !data) {
            console.error('Error validating session:', error);
            return false;
        }
        return data.activeSessionId === sessionId;
    }
    async invalidateSession(userId: string): Promise<void> {
        const { error } = await supabase
            .from('user_tokens')
            .update({
                activeSessionId: null,
                updated_at: new Date().toISOString()
            })
            .eq('userId', userId);
        if (error) {
            console.error('Error invalidating session:', error);
            throw new Error('Failed to invalidate session');
        }
    }
}