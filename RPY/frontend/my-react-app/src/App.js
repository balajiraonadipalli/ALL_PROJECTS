import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAnalysis(null);
    setPredictions(null);
    setError(null);
  };

  const handleAnalysis = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8000/analyze/", 
        formData, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setAnalysis(response.data);
      setPredictions(null);
    } catch (error) {
      console.error("Error:", error);
      setError(error.response?.data?.detail || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrediction = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }
  
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.post(
        "http://localhost:8000/predict/", 
        formData, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPredictions({
        values: response.data.predictions,
        modelInfo: {
          coefficients: response.data.coefficients,
          intercept: response.data.intercept
        }
      });
      setAnalysis(null);
    } catch (error) {
      console.error("Error:", error);
      setError(error.response?.data?.detail || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>File Analysis and Prediction API</h2>
      
      <div style={{ margin: "20px 0" }}>
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept=".csv"
          style={{ marginBottom: "10px" }}
        />
        <div>
          <button 
            onClick={handleAnalysis} 
            disabled={!file || isLoading}
            style={{ marginRight: "10px" }}
          >
            {isLoading ? "Processing..." : "Analyze File"}
          </button>
          <button 
            onClick={handlePrediction} 
            disabled={!file || isLoading}
          >
            {isLoading ? "Processing..." : "Predict File"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ color: "red", margin: "20px 0" }}>
          Error: {error}
        </div>
      )}

{analysis && (
  <div>
    <h3>Analysis Summary</h3>
    <pre>{JSON.stringify(analysis.summary, null, 2)}</pre>
    
    <h3>Generated Graph</h3>
    {analysis.graph ? (
      <img 
        src={`data:image/png;base64,${analysis.graph}`} 
        alt="Analysis Graph"
        style={{ maxWidth: '100%', border: '1px solid #ddd' }}
      />
    ) : (
      <p>No graph data available</p>
    )}
  </div>
)}

      {predictions && (
        <div style={{ marginTop: "20px" }}>
          <h3>Predictions</h3>
          <pre style={{ 
            background: "#f5f5f5", 
            padding: "15px", 
            borderRadius: "5px",
            overflowX: "auto"
          }}>
            {JSON.stringify(predictions, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;