import express from 'express'
import emailRouter from './routes/email.routes.js';
import cors from 'cors';

const app = express();

app.use(cors());

app.use(express.json());

app.use(emailRouter);

export default app;