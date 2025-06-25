// controllers/translation.controller.ts
import { Request, Response } from 'express';
import { translationService } from '../services/translation.service';
import type{ ID } from 'shared-types';

export const translationController = {

  getByLang: async (req: Request, res: Response) => {
    try {
      const lang = req.params.lang;
      const data = await translationService.getByLang(lang);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  getByKey: async (req: Request, res: Response) => {
    try {
      const key = req.params.key;
      const data = await translationService.getByKey(key);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const newItem = await translationService.createWithTranslations(req.body);
      return res.status(201).json(newItem);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  createTranslation: async (req: Request, res: Response) => {
    try {
      const { key, text, en } = req.body;
      if (!key || !text || !en) {
        res.status(400).json({ error: 'Missing key, value or lang' });
        return;
      }

      const result = await translationService.createWithTranslations({ key, text, lang: en });
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}