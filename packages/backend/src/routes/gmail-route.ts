import { Router } from 'express';
import { list, get, send } from '../controllers/gmail-controller';

const router = Router();

router.get('/gmail/v1/users/:userId/messages', list);
router.get('/gmail/v1/users/:userId/messages/:messageId', get);
router.post('/gmail/v1/users/:userId/messages/send', send);

export default router;
