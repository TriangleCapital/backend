import express from 'express';
import {
  createEvaluationForm,
  createMrfPdfForm,
  getMrfPdf,
  processExcelLeads,
  uploadExcelRoyalties,
  uploadSolviaRoyalties,
} from '../controllers/totalumController';
import multer from 'multer';

const totalumRouter = express.Router();

const upload = multer({ limits: { fileSize: 25000000 }, dest: 'uploads/' });

totalumRouter.get('/', (req, res) => res.send('Working Totalum endpoint!'));

totalumRouter.post('/excel-leads', upload.any(), processExcelLeads);
totalumRouter.post('/excel-realties', uploadExcelRoyalties);
totalumRouter.get('/solvia-realties/:postalCode', uploadSolviaRoyalties);
totalumRouter.post('/evaluation-form', createEvaluationForm);
totalumRouter.post('/mrf-pdf-form', createMrfPdfForm);
totalumRouter.get('/mrf-pdf', getMrfPdf);

export default totalumRouter;
