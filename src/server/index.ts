import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import { generalError, notFoundError } from '../errors/generalError';
import scriptRouter from './routers/scriptRouter';
import totalumRouter from './routers/totalumRouter';
import notificationsRouter from './routers/notificationsRouter';
import manychatRouter from './routers/manychatRouter';
import banksRouter from './routers/banksRouter';

const app = express();

const server = app.listen(3000, () => {});

server.timeout = 600000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: 'too many requests sent by this ip, please try again later',
});

app.use(limiter);
app.use(hpp());
app.use(cors({ origin: '*' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://trusted.cdn.com'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/', (req, res) => res.send('Working!'));

app.use('/totalum', totalumRouter);
app.use('/banks', banksRouter);
app.use('/manychat', manychatRouter);
app.use('/notifications', notificationsRouter);
app.use('/script', scriptRouter);

app.use(notFoundError);
app.use(generalError);

export default app;
