// // controllers/translation.controller.ts
// import { Request, Response } from 'express';
// import { translationService } from '../services/translation';
// import type{ ID } from 'shared-types';

// export const translationController = {
//   getAll: async (req: Request, res: Response) => {
//     try {
//       const data = await translationService.getAll();
//       res.json(data);
//     } catch (error: any) {
//       res.status(500).json({ error: error.message });
//     }
//   },

//   getById: async (req: Request, res: Response) => {
//     try {
//       const id = req.params.id as ID;
//       const data = await translationService.getById(id);
//       res.json(data);
//     } catch (error: any) {
//       res.status(404).json({ error: error.message });
//     }
//   },

//   // getByLang: async (req: Request, res: Response) => {
//   //   try {
//   //     const lang = req.params.lang;
//   //     const data = await translationService.getByLang(lang);
//   //     res.json(data);
//   //   } catch (error: any) {
//   //     res.status(500).json({ error: error.message });
//   //   }
//   // },

//   getByKey: async (req: Request, res: Response) => {
//     try {
//       const key = req.params.key;
//       const data = await translationService.getByKey(key);
//       res.json(data);
//     } catch (error: any) {
//       res.status(500).json({ error: error.message });
//     }
//   },

//   create: async (req: Request, res: Response) => {
//     try {
//       const newItem = await translationService.post(req.body);
//       return res.status(201).json(newItem);
//     } catch (error: any) {
//       res.status(400).json({ error: error.message });
//     }
//   },

//   createTranslation: async (req: Request, res: Response) => {
//       console.log("📥 got POST /api/translate");
//     try {
//       const { key, text, lang } = req.body;
//       if (!key || !text || !lang) {
//         res.status(400).json({ error: 'Missing key, value or lang' });
//         return;
//       }

//       const result = await translationService.createWithTranslations({ key, text, lang });
//       res.status(201).json(result);
//     } catch (error: any) {
//       res.status(500).json({ error: error.message });
//     }
//   },

//   update: async (req: Request, res: Response) => {
//     try {
//       const id = req.params.id as ID;
//       const updated = await translationService.patch(req.body, id);
//       res.json(updated);
//     } catch (error: any) {
//       res.status(400).json({ error: error.message });
//     }
//   },

//   remove: async (req: Request, res: Response) => {
//     try {
//       const id = req.params.id as ID;
//       await translationService.delete(id);
//       res.status(204).send();
//     } catch (error: any) {
//       res.status(400).json({ error: error.message });
//     }
//   }
// };
