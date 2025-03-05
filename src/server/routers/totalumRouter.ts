import express from 'express';
import { processExcelLeads, sendEmailController, updateLeadByPhoneNumber } from '../controllers/totalumController';
import multer from 'multer';

const totalumRouter = express.Router();

const upload = multer({ limits: { fileSize: 25000000 }, dest: 'uploads/' });

totalumRouter.get('/', (req, res) => res.send('Working Totalum endpoint!'));

totalumRouter.post('/excel-leads', upload.any(), processExcelLeads);
totalumRouter.post('/update-lead-by-phone', updateLeadByPhoneNumber);

totalumRouter.post('/send-email', sendEmailController);

export default totalumRouter;
