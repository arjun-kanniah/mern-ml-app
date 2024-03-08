# 1. Library imports
import uvicorn
from fastapi import FastAPI, HTTPException
from LoanApprovals import LoanApproval
import numpy as np
import pickle
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

# 2. Create the app object
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Load the trained model
pickle_in = open("classifier.pkl","rb")
classifier = pickle.load(pickle_in)

# Conversion function
def convert_input_data(data):
    conversion_dict = {
        'Gender': {'Male': 1, 'Female': 0},
        'Married': {'No': 0, 'Yes': 1},
        'Dependents': {'None': 0, 'One': 1, 'Two': 2, 'More than 2': 3},
        'Education': {'Graduate': 1, 'Not Graduate': 0},
        'Self_Employed': {'No': 0, 'Yes': 1},
        'Credit_History': {'Good': 1, 'Bad': 0}, 
        'Property_Area': {'Rural': 0, 'Semiurban': 1, 'Urban': 2}     
    }

    for key in conversion_dict:
        if key in data:
            data[key] = conversion_dict[key].get(data[key], data[key])

    return data

@app.get('/')
def index():
    return {'message': 'Loan Prediction API'}

@app.post('/predict')
async def predict_loan_approval(request_data: LoanApproval):
    try:
        # Convert input data
        converted_data = convert_input_data(request_data.dict())

        df = pd.DataFrame([converted_data])

        # Reorder the columns based on how the model was trained
        df = df[['Gender', 'Married', 'Dependents', 'Education', 'Self_Employed', 'ApplicantIncome',
                 'CoapplicantIncome', 'LoanAmount', 'Loan_Amount_Term', 'Credit_History', 'Property_Area']]

        # Make a prediction
        prediction = classifier.predict(df)

        # Translate prediction to human-readable form
        prediction_text = "Loan Approved" if prediction[0] == 1 else "Loan Not Approved"
        
        return {'prediction': prediction_text}

    except Exception as e:
        # Log the exception or raise an HTTPException with details
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=8010)
