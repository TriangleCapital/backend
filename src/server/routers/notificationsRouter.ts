import express from 'express';
import { sendEmailController } from '../controllers/notificationsController';

const notificationsRouter = express.Router();

notificationsRouter.post('/send-email', sendEmailController);

export default notificationsRouter;