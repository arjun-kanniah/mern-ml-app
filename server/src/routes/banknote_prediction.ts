import { Router, Response, Request  } from 'express';
import { BanknotePredictionHistoryModel } from '../models/banknote_prediction';
import { verifyToken } from './users'; // Import verifyToken from users.ts
import { RequestWithUser } from '../types';

const router = Router();

// Route to store prediction history, now protected with verifyToken middleware
router.post('/store', verifyToken, async (req: RequestWithUser, res: Response) => {
    // Extract user ID from the token payload instead of req.body
    const userId = req.user?.id; // Use optional chaining to safely access user.id
    const { variance, skewness, curtosis, entropy, prediction } = req.body;
    const banknotePredictionHistory = new BanknotePredictionHistoryModel({
        user: userId, // Use userId from the token
        variance,
        skewness,
        curtosis,
        entropy,
        prediction
    });

    try {
        await banknotePredictionHistory.save();
        res.status(201).json(banknotePredictionHistory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to get prediction history for the logged-in user, also protected
router.get('/history', verifyToken, async (req: RequestWithUser, res: Response) => {
    const userId = req.user?.id; // Use optional chaining to safely access user.id
    try {
        const history = await BanknotePredictionHistoryModel.find({ user: userId }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to delete a prediction history record for the logged-in user
router.delete('/delete/:id', verifyToken, async (req: RequestWithUser, res: Response) => {
    const userId = req.user?.id;
    const predictionId = req.params.id;

    try {
        const prediction = await BanknotePredictionHistoryModel.findOne({ _id: predictionId, user: userId });
        if (!prediction) {
            return res.status(404).json({ message: 'Prediction record not found or not authorized to delete' });
        }

        await BanknotePredictionHistoryModel.findOneAndDelete({ _id: predictionId, user: userId });
        res.status(200).json({ message: 'Prediction record deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export {router as banknotePredictionRouter};