import { ID, LoginResponse, User } from "shared-types";
import { getGoogleUserInfo, getTokens } from "./googleAuthService";
import jwt from "jsonwebtoken";
import { saveUserTokens } from "./tokenService";
import { randomUUID } from "crypto";
import { UserService } from "./user.service";
import { sendEmail } from "./gmail-service";
import { EmailTemplateService } from "./emailTemplate.service";
import { link } from "fs";

export const sendVerificationEmail = async (
  link: string,
  email: string,
  id: ID,
  token: any,
): Promise<void> => {
  const emailService = new EmailTemplateService();

  const emailPromises: Promise<any>[] = [];

  function encodeSubject(subject: string): string {
    return `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;
  }

  const sendEmailToCustomer = async () => {
    try {
      const template = await emailService.getTemplateByName(
        "אימות מייל",
      );

      if (!template) {
        console.warn("email template not found");
        return;
      }
      const renderedHtml = await emailService.renderTemplate(
        template.bodyHtml,
        {
          "link": link,
        },
      );

      await sendEmail(
        "me",
        {
          to: [email],
          subject: encodeSubject("אימות מייל"),
          body: renderedHtml,
          isHtml: true,
        },
        token,
      );
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  await sendEmailToCustomer();
};

export const generateJwtToken = (
  payload: { userId: string; email: string; googleId: string },
): string => {
  return jwt.sign(
    {
      userId: payload.userId,
      email: payload.email,
      googleId: payload.googleId,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "8h" }, // 8 hours
  );
};

export const verifyJwtToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: string;
    email: string;
    googleId: string;
  };
};

export const exchangeCodeAndFetchUser = async (
  code: string,
): Promise<LoginResponse> => {
  try {
    const tokens = await getTokens(code);
    if (!tokens.access_token) {
      throw new Error("No access token received from Google");
    }
    console.log('Tokens received from Google:', tokens);
    const userInfo = await getGoogleUserInfo(tokens.access_token);
    console.log(userInfo);

    //need to check if the user have permission to login
    const userService = new UserService();
    if (!userInfo.id) {
      throw new Error("Google ID is missing for the user");
    }
    let checkUser = await userService.loginByGoogleId(userInfo.id);
    if (checkUser == null) {
      //need to check if the user in the system but doesnt have googleId yet
      try {
        checkUser = await userService.getUserByEmail(userInfo.email);
        if (checkUser == null) {
          console.log("user not found by email:", userInfo.email);

          throw new Error("User not found");
        }
        await userService.updateGoogleIdUser(
          checkUser.id ?? userInfo.id,
          userInfo.id,
        );
      } catch (error: any) {
        throw error;
      }
    }
    const user: User = {
      id: checkUser.id,
      email: checkUser.email,
      firstName: checkUser.firstName,
      lastName: checkUser.lastName,
      role: checkUser.role,
      googleId: userInfo.id, // Google user ID
      lastLogin: new Date().toISOString(),
      active: true,
      createdAt: checkUser.createdAt,
      updatedAt: checkUser.updatedAt,
    };
    //---------------------------------------------------
    const newSessionId = randomUUID();
    console.log("in exchange code and fetch user, newSessionId:", newSessionId);

    await saveUserTokens(
      checkUser.id ?? userInfo.id,
      tokens.refresh_token ?? "",
      tokens.access_token,
      newSessionId,
    );

    console.log("Access Token:", tokens.access_token);
    console.log("Refresh Token:", tokens.refresh_token);
    const jwtToken = generateJwtToken({
      userId: checkUser.id ?? userInfo.id,
      email: user.email,
      googleId: user.googleId!,
    });
    return {
      user,
      token: jwtToken,

      sessionId: newSessionId,
       googleAccessToken: tokens.access_token,
       //googleAccessToken: tokens.access_token,
      // refreshToken: tokens.refresh_token!, // Optional, if you want to store it
      expiresAt: tokens.expires_at,
    };
  } catch (error: any) {
    //console.error('error in exchange code and fetch user', error);
    throw error;
  }
};
