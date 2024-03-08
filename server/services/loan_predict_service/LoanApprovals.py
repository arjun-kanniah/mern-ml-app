from pydantic import BaseModel

# 2. Class which describes Loan Approval parameters
class LoanApproval(BaseModel):
    Gender: str 
    Married: str 
    Dependents: str 
    Education: str
    Self_Employed: str
    ApplicantIncome: float
    CoapplicantIncome: float
    LoanAmount: float
    Loan_Amount_Term: float
    Credit_History: str
    Property_Area: str
