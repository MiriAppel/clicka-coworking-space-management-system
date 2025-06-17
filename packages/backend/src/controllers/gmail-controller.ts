import { Request, Response } from 'express';
import { sendEmail ,listEmails} from '../services/gmail-service';
import { SendEmailRequest } from '../../../../types/google';

export async function send(req: Request, res: Response) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  const body: SendEmailRequest = req.body;
  try {
    const result = await sendEmail('me', body, token);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
export async function list(req: Request, res: Response) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const result = await listEmails('me', token);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}