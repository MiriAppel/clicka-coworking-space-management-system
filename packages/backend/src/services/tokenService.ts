import { Request, Response } from 'express';
import { LoginResponse } from "../../../../types/auth"
import { UserTokenService } from './userTokenService';
import { verifySession } from '../middlewares/authMiddleware';
import jwt from 'jsonwebtoken';
import { generateJwtToken, verifyJwtToken } from './authService';
import { decrypt } from './cryptoService';
import { refreshAccessToken } from '../auth/googleApiClient';

const userTokenService = new UserTokenService();
export const setAuthCookie = (res: Response<LoginResponse | { error: string }>, token: string): void => {
    res.cookie('session', token, {
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
};

export const refreshUserToken = async (sessionToken: string): Promise<string> => {
    const payload = verifyJwtToken(sessionToken);

    const userId: string = payload.userId;

    // שליפת refresh token
    //need to access DB to get the refresh token
    // const record = await userTokensService.findByUserId(userId);
    const UserTokenRecord = await userTokenService.findByUserId(userId);
    //------------------------------------------------------------------
    if (!UserTokenRecord?.refreshToken)
        throw new Error('TOKEN_NOT_FOUND');

    const refreshToken = decrypt(UserTokenRecord.refreshToken);
    const tokens = await refreshAccessToken(refreshToken);

    const newJwt = generateJwtToken({
        userId,
        email: payload.email,
        googleId: payload.googleId
    });
    return newJwt;
}

export const saveUserTokens = async (userId: string, accessToken: string, refreshToken: string): Promise<void> => {
    const userTokenService = new UserTokenService();
    await userTokenService.saveTokens(userId, accessToken, refreshToken);

}