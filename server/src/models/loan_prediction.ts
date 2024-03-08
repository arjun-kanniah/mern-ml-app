import { Schema, model, Document } from 'mongoose';

export interface ILoanPredictionHistory extends Document {
    user: Schema.Types.ObjectId;
    Gender: string;
    Married: string;
    Dependents: string;
    Education: string;
    Self_Employed: string;
    ApplicantIncome: number;
    CoapplicantIncome: number;
    LoanAmount: number;
    Loan_Amount_Term: number;
    Credit_History: string;
    Property_Area: string,
    prediction: string;  // Assuming result is a string, adjust the type accordingly
    createdAt: Date;
}

const LoanpredictionHistorySchema = new Schema<ILoanPredictionHistory>({
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    Gender: { type: String, required: true },
    Married: { type: String, required: true },
    Dependents: { type: String, required: true },
    Education: { type: String, required: true },
    Self_Employed: { type: String, required: true },
    ApplicantIncome: { type: Number, required: true },
    CoapplicantIncome: { type: Number, required: true },
    LoanAmount: { type: Number, required: true },
    Loan_Amount_Term: { type: Number, required: true },
    Credit_History: { type: String, required: true },
    Property_Area: { type: String, required: true },
    prediction: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export const LoanPredictionHistoryModel = model<ILoanPredictionHistory>('loanpredictions', LoanpredictionHistorySchema);
