import express from 'express';
import {
  createEvaluationForm,
  createMrfPdfForm,
  get7ReglasNegociacionPdf,
  getGroupMembersChatIds,
  getMrfPdf,
  processExcelLeads,
  sendMessageToChatIds,
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
totalumRouter.get('/7-reglas-negociacion-pdf', get7ReglasNegociacionPdf);

totalumRouter.post('/message-okupas', sendMessageToOkupas);
totalumRouter.post('/send-message-to-group-members', sendMessageToGroupMembers);
totalumRouter.post('/send-message-to-chat-ids', sendMessageToChatIds);
totalumRouter.get('/group-members-chat-ids', getGroupMembersChatIds);

export default totalumRouter;
