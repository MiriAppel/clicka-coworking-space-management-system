import express from 'express';
import { getLeads } from '../controllers/lead.controller';

const router = express.Router();

router.get('/', getLeads);

export default router;