import { Schema, model, Document } from 'mongoose';

export interface IBanknotePredictionHistory extends Document {
    user: Schema.Types.ObjectId;
    variance: number;
    skewness: number;
    curtosis: number;
    entropy: number;
    prediction: string;  // Assuming result is a string, adjust the type accordingly
    createdAt: Date;
}

const BanknotepredictionHistorySchema = new Schema<IBanknotePredictionHistory>({
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    variance: { type: Number, required: true },
    skewness: { type: Number, required: true },
    curtosis: { type: Number, required: true },
    entropy: { type: Number, required: true },
    prediction: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export const BanknotePredictionHistoryModel = model<IBanknotePredictionHistory>('banknotepredictions', BanknotepredictionHistorySchema);
