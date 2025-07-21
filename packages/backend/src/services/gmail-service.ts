import { google } from "googleapis";
import { ID } from "shared-types";
import { SendEmailRequest } from "shared-types/google";
import { UserTokenService } from "./userTokenService";
import { EmailTemplateService } from "./emailTemplate.service";
import { customerService } from "./customer.service";

export const sendEmailToConfrim = async (email: string | undefined, id: ID) => {
  const userTokenService = new UserTokenService();
  const emailService = new EmailTemplateService();
  const customerservice = new customerService();
  const token = await userTokenService.getSystemAccessToken();
  const template = await emailService.getTemplateByName("אימות מייל");
  const customer = await customerservice.getById(id);

  if (!token)
    throw console.log("the token worng" ,token);
    
  if (!template) {
    console.warn("email template not found", template);
    return;
  }
  const renderedHtml = await emailService.renderTemplate(
    template.bodyHtml,
    {
      "name": customer.name,
      "link": `http://localhost:3001/api/customers/confirm-email/${id}/${email}`
    },
  );

  await sendEmail(
    "me",
    {
      to: [email ?? ""],
      subject: template.subject,
      body: renderedHtml,
      isHtml: true,
    },
    token,
  );
};

function getAuth(token: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: token });
  return auth;
}
function encodeSubject(subject: string): string {
  return `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;
}
function encodeMessage(request: SendEmailRequest): string {
  const boundary = "__BOUNDARY__";
  const headers = [
    `From: me`,
    `To: ${request.to.join(", ")}`,
    request.cc?.length ? `Cc: ${request.cc.join(", ")}` : "",
    request.bcc?.length ? `Bcc: ${request.bcc.join(", ")}` : "",
    `Subject: ${encodeSubject(request.subject)}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
  ].filter(Boolean).join("\n");
  const bodyPlain = request.isHtml ? "" : request.body;
  const bodyHtml = request.isHtml ? request.body : "";
  const message = [
    headers,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "",
    bodyPlain,
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "",
    bodyHtml,
    `--${boundary}--`,
  ].join("\n");
  return Buffer.from(message).toString("base64").replace(/\+/g, "-").replace(
    /\//g,
    "_",
  ).replace(/=+$/, "");
}

//   customer: { email: string; name: string; emailVerificationId: string },
//   token: string, // הוספת פרמטר טוקן
// ) => {
//   const emailService = new EmailTemplateService();

//   const verificationLink =
//     `https://localhost:3001/api/auth/confirm-email?id=${customer.emailVerificationId}`;

//   const template = await emailService.getTemplateByName("אימות מייל");
//   if (!template) {
//     console.warn("Email template not found");
//     return;
//   }

//   const html = await emailService.renderTemplate(template.bodyHtml, {
//     "שם": customer.name,
//     "קישור_אימות": verificationLink,
//   });

//   await sendEmail(
//     "me",
//     {
//       to: [customer.email],
//       subject: "אימות מייל - אנא אמת את המייל שלך",
//       body: html,
//       isHtml: true,
//     },
//     token, // פה מעבירים את הטוקן
//   );
// };

export async function sendEmail(
  userId: string,
  request: SendEmailRequest,
  token: string,
) {
  const gmail = google.gmail({ version: "v1", auth: getAuth(token) });
  const raw = encodeMessage(request);
  const res = await gmail.users.messages.send({ userId, requestBody: { raw } });
  return res.data;
}
export async function listEmails(
  userId: string,
  token: string,
  options?: {
    maxResults?: number;
    q?: string;
    labelIds?: string[];
    pageToken?: string;
  },
) {
  const gmail = google.gmail({ version: "v1", auth: getAuth(token) });
  let listRes;
  try {
    listRes = await gmail.users.messages.list({
      userId,
      maxResults: options?.maxResults,
      q: options?.q,
      labelIds: options?.labelIds,
      pageToken: options?.pageToken,
    });
  } catch (error) {
    return [{ error: "Failed to fetch message list", details: error }];
  }
  const messages = listRes.data?.messages;
  if (!messages || messages.length === 0) return [];
  const detailed = await Promise.all(
    messages.map(async (msg) => {
      try {
        const full = await gmail.users.messages.get({
          userId,
          id: msg.id!,
          format: "metadata",
        });
        return {
          id: msg.id,
          snippet: full.data.snippet,
          headers: full.data.payload?.headers,
        };
      } catch (err) {
        return {
          error: `Failed to fetch message ${msg.id}`,
          details: err instanceof Error ? err.message : err,
        };
      }
    }),
  );
  return detailed;
}
