import express from 'express';
import multer from 'multer';
import {
  downloadExtendedSolviaExcelJob,
  getAllSolviaRealties,
  getExtendedSolviaExcelJobStatus,
  processExcelRealties,
  startExtendedSolviaExcelJob,
} from '../controllers/banksController';

const banksRouter = express.Router();

const upload = multer({ limits: { fileSize: 25000000 }, dest: 'uploads/' });

banksRouter.post('/solvia/realties', getAllSolviaRealties);

banksRouter.post('/solvia/realties/excel', startExtendedSolviaExcelJob);

banksRouter.get('/solvia/realties/excel/:id/status', getExtendedSolviaExcelJobStatus);

banksRouter.get('/solvia/realties/excel/:id/download', downloadExtendedSolviaExcelJob);

banksRouter.post('/solvia/realties/excel/upload', upload.any(), processExcelRealties);

export default banksRouter;
