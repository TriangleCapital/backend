import express from 'express';
import { completedChatbotController, getManychatFlows, receiveManychatInteraction } from '../controllers/manychatController';

const manychatRouter = express.Router();

manychatRouter.post('/handle-interaction', receiveManychatInteraction);
manychatRouter.post('/handle-completed-chatbot', completedChatbotController);
manychatRouter.get('/flows', getManychatFlows);

export default manychatRouter;
