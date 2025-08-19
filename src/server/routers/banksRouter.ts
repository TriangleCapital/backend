import express from 'express';
import { uploadSolviaRoyalties } from '../controllers/banksController';

const banksRouter = express.Router();

banksRouter.get('/solvia/realties/:postalCode', uploadSolviaRoyalties);

export default banksRouter;