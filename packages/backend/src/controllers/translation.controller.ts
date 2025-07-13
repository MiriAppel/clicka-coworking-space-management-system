import { Request, Response } from 'express';
import { translationService } from '../services/translation.service';

export const translationController = {

  create: async (req: Request, res: Response) => {
    try {
      const newItem = await translationService.createWithTranslations(req.body);
      return res.status(201).json(newItem);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
}
