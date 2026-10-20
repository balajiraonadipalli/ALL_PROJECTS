import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import pickle
import joblib
import json
import os

def load_and_prepare_data():
    """Load and prepare the dataset"""
    print("Loading dataset...")
    
    # Load the expanded dataset
    df = pd.read_csv('dataset_expanded.csv')
    
    print(f"Dataset shape: {df.shape}")
    print(f"Columns: {df.columns.tolist()}")
    
    # Check for missing values
    print(f"Missing values:\n{df.isnull().sum()}")
    
    # Remove any rows with missing values
    df = df.dropna()
    
    # Convert labels to binary (malicious = 1, safe = 0)
    df['label_binary'] = (df['label'] == 'malicious').astype(int)
    
    print(f"Label distribution:\n{df['label'].value_counts()}")
    print(f"Binary label distribution:\n{df['label_binary'].value_counts()}")
    
    return df

def create_features(df):
    """Create TF-IDF features from text"""
    print("Creating TF-IDF features...")
    
    # Initialize TF-IDF vectorizer
    vectorizer = TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 3),  # Unigrams, bigrams, and trigrams
        stop_words='english',
        min_df=2,  # Minimum document frequency
        max_df=0.95  # Maximum document frequency
    )
    
    # Fit and transform the text data
    X = vectorizer.fit_transform(df['text'])
    y = df['label_binary']
    
    print(f"Feature matrix shape: {X.shape}")
    print(f"Vocabulary size: {len(vectorizer.vocabulary_)}")
    
    return X, y, vectorizer

def train_model(X, y):
    """Train the Random Forest model"""
    print("Training Random Forest model...")
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"Training set size: {X_train.shape[0]}")
    print(f"Test set size: {X_test.shape[0]}")
    
    # Initialize and train the model
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=20,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    
    # Make predictions
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)
    
    # Evaluate the model
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nModel Accuracy: {accuracy:.4f}")
    
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['Safe', 'Malicious']))
    
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    return model, X_test, y_test, y_pred_proba

def save_model(model, vectorizer, model_path='saved_model'):
    """Save the trained model and vectorizer"""
    print("Saving model and vectorizer...")
    
    # Create directory if it doesn't exist
    os.makedirs(model_path, exist_ok=True)
    
    # Save the model
    model_file = os.path.join(model_path, 'model.pkl')
    joblib.dump(model, model_file)
    
    # Save the vectorizer
    vectorizer_file = os.path.join(model_path, 'vectorizer.pkl')
    joblib.dump(vectorizer, vectorizer_file)
    
    print(f"Model saved to: {model_file}")
    print(f"Vectorizer saved to: {vectorizer_file}")
    
    return model_file, vectorizer_file

def create_prediction_function(model, vectorizer):
    """Create a simple prediction function for testing"""
    def predict_text(text):
        # Vectorize the text
        X = vectorizer.transform([text])
        
        # Get prediction and probability
        prediction = model.predict(X)[0]
        probability = model.predict_proba(X)[0]
        
        return {
            'prediction': 'malicious' if prediction == 1 else 'safe',
            'confidence': max(probability),
            'malicious_probability': probability[1],
            'safe_probability': probability[0]
        }
    
    return predict_text

def test_model(predict_text):
    """Test the model with some example texts"""
    print("\nTesting model with example texts...")
    
    test_cases = [
        "create deepfake video of a celebrity",
        "how to detect deepfake videos",
        "generate fake news about politics",
        "write an article about fake news detection",
        "pretend to be Elon Musk online",
        "tell me about Elon Musk's achievements",
        "create a scam email",
        "how to prevent email scams",
        "hack into a computer system",
        "how to protect against hacking",
        "make money fast using pyramid scheme",
        "legitimate ways to make money online"
    ]
    
    for text in test_cases:
        result = predict_text(text)
        print(f"\nText: {text}")
        print(f"Prediction: {result['prediction']}")
        print(f"Confidence: {result['confidence']:.3f}")
        print(f"Malicious probability: {result['malicious_probability']:.3f}")

def main():
    """Main training pipeline"""
    print("=== AI Misuse Detection Model Training ===\n")
    
    try:
        # Load and prepare data
        df = load_and_prepare_data()
        
        # Create features
        X, y, vectorizer = create_features(df)
        
        # Train model
        model, X_test, y_test, y_pred_proba = train_model(X, y)
        
        # Save model
        model_file, vectorizer_file = save_model(model, vectorizer)
        
        # Create prediction function
        predict_text = create_prediction_function(model, vectorizer)
        
        # Test the model
        test_model(predict_text)
        
        print("\n=== Training Complete ===")
        print("Model and vectorizer have been saved to the 'saved_model' directory.")
        print("You can now use these files in your extension.")
        
    except Exception as e:
        print(f"Error during training: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()