import { Request, Response } from 'express';
import {
  listMessages,
  getMessage,
  sendMessage
} from '../services/gmail-service';

export async function list(req: Request, res: Response) {
  const token = req.headers.authorization?.split(' ')[1];
  const userId = req.params.userId;

  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const messages = await listMessages(userId, token);
    res.status(200).json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function get(req: Request, res: Response) {
  const token = req.headers.authorization?.split(' ')[1];
  const { userId, messageId } = req.params;

  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const message = await getMessage(userId, messageId, token);
    res.status(200).json(message);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function send(req: Request, res: Response) {
  const token = req.headers.authorization?.split(' ')[1];
  const userId = req.params.userId;
  const { raw } = req.body;

  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const result = await sendMessage(userId, raw, token);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
