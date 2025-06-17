import { Router } from 'express';
import { send, list } from '../controllers/gmail-controller';

const router = Router();

router.post('/gmail/v1/users/me/messages/send', send);
router.get('/gmail/v1/users/me/messages', list);

export default router;
