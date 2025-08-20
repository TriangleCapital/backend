import express from 'express';
import { getAllSolviaRealties } from '../controllers/banksController';

const banksRouter = express.Router();

banksRouter.get('/solvia/realties/:postalCode', getAllSolviaRealties);

export default banksRouter;
