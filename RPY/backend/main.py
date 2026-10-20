from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np 
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
import io
import uvicorn
from fastapi.responses import JSONResponse
import base64


app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get('/')
def initial():
    return {
        "detail":"hello welcome to the first pyhton code fromm the backend!"
    }

def validate_csv(file: UploadFile):
    """Helper function to validate CSV files"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted")
    
    contents = file.file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="File is empty")
    
    try:
        df = pd.read_csv(io.BytesIO(contents))
        if df.empty:
            raise HTTPException(status_code=400, detail="CSV file contains no data")
        return df
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading CSV: {str(e)}")

@app.post("/analyze/")
async def analyze_file(file: UploadFile = File(...)):
    try:
        # Read and validate file
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="File is empty")
            
        df = pd.read_csv(io.BytesIO(contents))
        
        # Basic Summary
        summary = df.describe().to_dict()
        print(summary)

        # Create visualization - handle empty data case
        plt.figure(figsize=(8, 4))
        
        if len(df.columns) > 0:
            # Use the first column that has numeric data
            numeric_cols = df.select_dtypes(include=['number']).columns
            if len(numeric_cols) > 0:
                df[numeric_cols[0]].plot(kind='hist', title='Data Distribution')
            else:
                # Fallback for non-numeric data
                df.iloc[:, 0].value_counts().plot(kind='bar', title='Value Counts')
        else:
            raise HTTPException(status_code=400, detail="No data columns found")
        
        # Convert plot to base64
        buf = io.BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight', dpi=100)
        buf.seek(0)
        graph_base64 = base64.b64encode(buf.read()).decode("utf-8")
        buf.close()
        plt.close()

        return {
            "summary": summary,
            "graph": graph_base64  # Ensure this is always returned
        }
        
    except pd.errors.EmptyDataError:
        raise HTTPException(status_code=400, detail="The file is empty or corrupt")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        df = validate_csv(file)
        
        # Simple prediction example
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        
        if len(numeric_cols) < 2:
            raise HTTPException(
                status_code=400,
                detail="Need at least 2 numeric columns for prediction"
            )
        
        X = df[numeric_cols[0]].values.reshape(-1, 1)
        y = df[numeric_cols[1]].values
        
        model = LinearRegression()
        model.fit(X, y)
        predictions = model.predict(X).tolist()
        
        return {
            "predictions": predictions,
            "coefficients": model.coef_.tolist(),
            "intercept": float(model.intercept_)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




if __name__ == '__main__':
    uvicorn.run(app,host='127.0.0.1',port=9000)