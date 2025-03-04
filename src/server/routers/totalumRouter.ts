import express from 'express';
import { controllerFunc } from '../controllers/totalumController';

const totalumRouter = express.Router();

totalumRouter.post('/', controllerFunc);

export default totalumRouter;
