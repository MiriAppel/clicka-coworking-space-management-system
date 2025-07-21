import { Router } from 'express';
import { postEmail, getListEmails } from '../controllers/gmail-controller';

const routerEmail = Router();


routerEmail.post('/v1/users/me/messages/send', postEmail);
routerEmail.get('/v1/users/me/messages', getListEmails);

export default routerEmail;
