import { Router } from 'express';
import { postEmail, getListEmails } from '../controllers/gmail-controller';

const router = Router();

router.post('/v1/users/me/messages/send', postEmail);
router.get('/v1/users/me/messages', getListEmails);

export default router;
