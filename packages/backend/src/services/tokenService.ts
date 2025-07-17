import { Request, Response } from 'express';
import { LoginResponse } from "shared-types"
import { UserTokenService } from './userTokenService';
import { generateJwtToken, verifyJwtToken } from './authService';
import { decrypt } from './cryptoService';
import { refreshAccessToken } from './googleAuthService';
import { UserService } from './user.service';

const userTokenService = new UserTokenService();
export const setAuthCookie = (res: Response<LoginResponse | { error: string }>, token: string, sessionId?: string): void => {
    res.cookie('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 8 * 60 * 60 * 1000, // 8 שעות
    });
    console.log('setAuthCookie', sessionId);
    if (sessionId) {
        res.cookie('sessionId', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 8 * 60 * 60 * 1000, // 8 שעות
        });
    }
};
export const setRefreshCookie = (res: Response, refreshToken: string): void => {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ימים
    });
};

export const clearAuthCookie = (res: Response): void => {
    res.clearCookie('session', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.clearCookie('sessionId', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
};
// Function to get the current user ID from the session cookie
export const getUserFromCookie = (req: Request): { userId: string; email: string; googleId: string } | null => {
    const sessionToken = req.cookies.session;
    const sessionId = req.cookies.sessionId;
    if (!sessionToken || !sessionId) return null;
    try {
        const payload = verifyJwtToken(sessionToken);
        const userId = payload.userId;
        const isValidSession = userTokenService.validateSession(userId, sessionId);
        if (!isValidSession) {
            return null;
        }
        return {
            userId,
            email: payload.email,
            googleId: payload.googleId
        };
    } catch (error) {
        console.error('Error verifying JWT token:', error);
        return null;
    }

};

export const refreshUserToken = async (sessionToken: string, sessionId: string): Promise<string> => {
    const payload = verifyJwtToken(sessionToken);

    const userId: string = payload.userId;
    const isValidSession = await userTokenService.validateSession(userId, sessionId);
    if (!isValidSession) {
        throw new Error('INVALID_SESSION');
    }
    const UserTokenRecord = await userTokenService.findByUserId(userId);
    //if userTokenRecord is null, then the user is not logged in
    if (!UserTokenRecord)
        throw new Error('TOKEN_NOT_FOUND');
    await userTokenService.getAccessTokenByUserId(userId);
    const newJwt = generateJwtToken({
        userId,
        email: payload.email,
        googleId: payload.googleId,
        role: payload.role
    });
    return newJwt;
}

export const saveUserTokens = async (userId: string, refreshToken: string, access_token: string, sessionId?: string): Promise<void> => {
    const userTokenService = new UserTokenService();
    await userTokenService.saveTokens(userId, refreshToken, access_token, sessionId);

}
export const logoutUser = async (userId: string, res: Response): Promise<void> => {
    await userTokenService.invalidateSession(userId);
    clearAuthCookie(res);
};
export const saveSessionId= async (userId: string, sessionId: string): Promise<void> => {
    await userTokenService.saveSessionId(userId, sessionId);
}