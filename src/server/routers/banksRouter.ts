import express from 'express';
import { downloadExtendedSolviaExcelJob, getAllSolviaRealties, getExtendedSolviaExcelJobStatus, startExtendedSolviaExcelJob } from '../controllers/banksController';

const banksRouter = express.Router();

banksRouter.post('/solvia/realties', getAllSolviaRealties);

banksRouter.post('/solvia/realties/excel', startExtendedSolviaExcelJob);

banksRouter.get('/solvia/realties/excel/:id/status', getExtendedSolviaExcelJobStatus);

banksRouter.get('/solvia/realties/excel/:id/download', downloadExtendedSolviaExcelJob);

export default banksRouter;
