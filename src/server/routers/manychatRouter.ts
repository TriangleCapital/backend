import express from 'express';
import { completedChatbotController, receiveManychatInteraction } from '../controllers/manychatController';

const manychatRouter = express.Router();

manychatRouter.post('/handle-interaction', receiveManychatInteraction);
manychatRouter.post('/handle-completed-chatbot', completedChatbotController);

export default manychatRouter;
