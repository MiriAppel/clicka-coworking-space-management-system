import { Request, Response } from 'express';
import { LoginResponse } from "shared-types"
import { UserTokenService } from './userTokenService';
import { generateJwtToken, verifyJwtToken } from './authService';
import { decrypt } from './cryptoService';
import { refreshAccessToken } from './googleAuthService';

const userTokenService = new UserTokenService();
export const setAuthCookie = (res: Response<LoginResponse | { error: string }>, token: string, sessionId: string): void => {
    res.cookie('session', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 8 * 60 * 60 * 1000, // 8 שעות
    });
    console.log('setAuthCookie', sessionId);
    res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 8 * 60 * 60 * 1000, // 8 שעות
    });
};

export const clearAuthCookie = (res: Response): void => {
    res.clearCookie('session', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });
    res.clearCookie('sessionId', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });
};
export const getUserFromCookie = (req: Request): string | null => {
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
        return userId;
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
    // שליפת refresh token
    //need to access DB to get the refresh token
    // const record = await userTokensService.findByUserId(userId);
    const UserTokenRecord = await userTokenService.findByUserId(userId);
    //------------------------------------------------------------------
    //if userTokenRecord is null, then the user is not logged in
    if (!UserTokenRecord)
        throw new Error('TOKEN_NOT_FOUND');
    await userTokenService.getAccessTokenByUserId(userId);
    const newJwt = generateJwtToken({
        userId,
        email: payload.email,
        googleId: payload.googleId
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