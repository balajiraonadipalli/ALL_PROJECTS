#!/usr/bin/env python3
"""
ML Predictor for AI Misuse Detection Extension
This script provides prediction functionality for the Chrome extension
"""

import sys
import json
import joblib
import os
from pathlib import Path

def load_model():
    """Load the trained model and vectorizer"""
    try:
        model_path = Path(__file__).parent / 'saved_model'
        model = joblib.load(model_path / 'model.pkl')
        vectorizer = joblib.load(model_path / 'vectorizer.pkl')
        return model, vectorizer
    except Exception as e:
        print(f"Error loading model: {e}", file=sys.stderr)
        return None, None

def predict_text(text):
    """Predict if text is malicious or safe"""
    try:
        model, vectorizer = load_model()
        if model is None or vectorizer is None:
            return {
                'error': 'Model not loaded',
                'prediction': 'safe',
                'confidence': 0.5
            }
        
        # Vectorize the text
        X = vectorizer.transform([text])
        
        # Get prediction and probability
        prediction = model.predict(X)[0]
        probability = model.predict_proba(X)[0]
        
        result = {
            'prediction': 'malicious' if prediction == 1 else 'safe',
            'confidence': float(max(probability)),
            'malicious_probability': float(probability[1]),
            'safe_probability': float(probability[0]),
            'text_length': len(text)
        }
        
        return result
        
    except Exception as e:
        return {
            'error': str(e),
            'prediction': 'safe',
            'confidence': 0.5
        }

def main():
    """Main function to handle command line input"""
    if len(sys.argv) != 2:
        print(json.dumps({'error': 'Usage: python ml_predictor.py "text to analyze"'}))
        sys.exit(1)
    
    text = sys.argv[1]
    result = predict_text(text)
    print(json.dumps(result))

if __name__ == "__main__":
    main()
