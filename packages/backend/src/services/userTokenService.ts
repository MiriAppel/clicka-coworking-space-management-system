import { createClient } from "@supabase/supabase-js";
import { decrypt, encrypt } from "./cryptoService";
import { supabase } from "../db/supabaseClient";
import { UserTokens } from "../models/userTokens.models";
import { randomUUID } from "crypto";
import { User } from "shared-types";
import { refreshAccessToken } from "./googleAuthService";


export class UserTokenService {

    async saveTokens(userId: string, refreshToken: string, access_token: string, sessionId?: string): Promise<string> {
        // Encrypt the refresh token before saving
        const cryptRefreshToken = encrypt(refreshToken);
        const cryptAccessToken = encrypt(access_token);
        const activeSessionId = sessionId || randomUUID();
        const checkUser = await this.findByUserId(userId);
        if (checkUser) {
            // If user token already exists, update it
            try {
                await this.updateTokensWithSession(userId, cryptAccessToken, activeSessionId);
                return activeSessionId;
            } catch (error) {
                console.error('Error updating user tokens:', error);
            }
        }
        else {
            const user_tokens: UserTokens = new UserTokens(
                randomUUID(), userId,cryptAccessToken,new Date(Date.now()+60*60*1000).toISOString(), cryptRefreshToken,
                new Date().toISOString(), new Date().toISOString(),
                activeSessionId, new Date().toISOString(), new Date().toISOString()
            );
            await supabase
                .from('user_tokens')
                .insert([
                    user_tokens.toDatabaseFormat()
                ]);
        }
        return activeSessionId;
    }
    async updateTokens(userId: string, cryptAccessToken: string): Promise<void> {
        const { error } = await supabase
            .from('user_tokens')
            .update({
                access_token:cryptAccessToken,
                access_token_expiry:new Date(Date.now()+60*60*1000).toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('userId', userId);
        if (error) {
            console.error('Error updating user tokens:', error);
            throw new Error('Failed to update user tokens');
        }
    }
    async updateTokensWithSession(userId: string, cryptAccessToken: string, activeSessionId: string): Promise<void> {

        const { error } = await supabase
            .from('user_tokens')
            .update({
                access_token:cryptAccessToken,
                access_token_expiry:new Date(Date.now()+60*60*1000).toISOString(),
                activeSessionId: activeSessionId,
                // sessionCreatedAt: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('userId', userId);
        if (error) {
            console.error('Error updating user tokens:', error);
            throw new Error('Failed to update user tokens');
        }
    }
    async findByUserId(userId: string): Promise<UserTokens | null> {
        return {
            userId: "1234",accessToken:"1244dcvbnm,",accessTokenExpiry:new Date(Date.now()+60*60*1000).toISOString(),
             refreshToken: "encryptedRefreshToken", activeSessionId: 'asdfff',
            createdAt: new Date().toString(), updatedAt: new Date().toString()
        } as UserTokens
    }; // Mocked return for demonstration
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
        if(!data)
        return null;
    return {
        userId: data.user_id,
        refreshToken: data.refresh_token,
        activeSessionId: data.activeSessionId
    };
}
    */

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
    async checkIfExpiredAccessToken(userId: string): Promise<boolean> {
        const { data, error } = await supabase
            .from('user_tokens')
            .select('accessTokenExpiry')
            .eq('userId', userId)
            .single();
        if (error) {
            console.error('Error fetching user tokens:', error);
            return false;
        }
        if (!data || !data.accessTokenExpiry) {
            console.warn('accessTokenExpiry is missing');
            return true; // If there is no value, consider it expired
        }
        const now = new Date();
        const expiryDate = new Date(data.accessTokenExpiry);
        return now >= expiryDate;
    }
    async getAccessTokenByUserId(userId: string): Promise<string | null> {
        if(await this.checkIfExpiredAccessToken(userId)){
            //if access token is expired, we need to refresh it
            const refreshToken :string=await this.getRefreshTokenByUserId(userId) ;
            const data= await refreshAccessToken(refreshToken)
            this.updateTokens(userId,encrypt(data.access_token));
            return data.access_token;
        }
        const { data, error } = await supabase
            .from('user_tokens')
            .select('accessToken')
            .eq('userId', userId)
            .single();
        if (error) {
            console.error('Error fetching user tokens:', error);
            return null;
        }
        return data.accessToken;
    }
    async getRefreshTokenByUserId(userId: string): Promise<string> {
        const { data, error } = await supabase
            .from('user_tokens')
            .select('refreshToken')
            .eq('userId', userId)
            .single();
        if (error) {
            console.error('Error fetching user tokens:', error);
        }
        return decrypt(data?.refreshToken);
    }
}
