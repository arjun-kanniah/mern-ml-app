import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import {userRouter} from './routes/users'
import {banknotePredictionRouter} from './routes/banknote_prediction';
import {loanPredictionRouter} from './routes/loan_prediction';

require('dotenv').config({ path: './config/.env' });

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use('/user', userRouter);
app.use('/banknote', banknotePredictionRouter);
app.use('/loan', loanPredictionRouter);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));