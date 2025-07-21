import { validateSendEmailInput } from "../utils/validateSendEmailInput";
import { validateListEmailQuery } from "../utils/validateListEmailQuery";
import { NextFunction, Request, Response } from "express";
import { listEmails, sendEmail } from "../services/gmail-service";
import { SendEmailRequest } from "../../../shared-types/google";
import { UserTokenService } from "../services/userTokenService";

export async function postEmail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userTokenService = new UserTokenService();

  const token = await userTokenService.getSystemAccessToken();
  if (!token) return next({ status: 401, message: "Missing token" });
  const body: SendEmailRequest = req.body;
  try {
    validateSendEmailInput(body); // ← פה נכנסת הולידציה
    const result = await sendEmail("me", body, token);
    res.status(200).json(result);
  } catch (err: any) {
    if (!err.status) err.status = 500;
    next(err);
  }
}

export async function getListEmails(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next({ status: 401, message: "Missing token" });
  try {
    validateListEmailQuery(req);
    const { maxResults, q, labelIds, pageToken } = req.query;
    const options = {
      maxResults: maxResults ? Number(maxResults) : undefined,
      q: q as string | undefined,
      labelIds: labelIds
        ? Array.isArray(labelIds) ? labelIds as string[] : [labelIds as string]
        : undefined,
      pageToken: pageToken as string | undefined,
    };
    const result = await listEmails("me", token, options);
    res.status(200).json(result);
  } catch (err: any) {
    if (!err.status) err.status = 500;
    next(err);
  }
}
