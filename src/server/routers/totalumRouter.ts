import express from 'express';
import {
  createEvaluationForm,
  createMrfPdfForm,
  getMrfPdf,
  processExcelLeads,
  sendMessageToGroupMembers,
  sendMessageToOkupas,
  updateDocumentViewedNumber,
  uploadExcelRealties,
} from '../controllers/totalumController';
import multer from 'multer';

const totalumRouter = express.Router();

const upload = multer({ limits: { fileSize: 25000000 }, dest: 'uploads/' });

totalumRouter.get('/', (req, res) => res.send('Working Totalum endpoint!'));

totalumRouter.post('/excel-leads', upload.any(), processExcelLeads);
totalumRouter.post('/excel-realties', uploadExcelRealties);

totalumRouter.post('/evaluation-form', createEvaluationForm);
totalumRouter.post('/mrf-pdf-form', createMrfPdfForm);
totalumRouter.get('/mrf-pdf', getMrfPdf);
totalumRouter.post('/update-document-viewed-number', updateDocumentViewedNumber);

totalumRouter.post('/message-okupas', sendMessageToOkupas);
totalumRouter.post('/send-message-to-group-members', sendMessageToGroupMembers);

export default totalumRouter;
