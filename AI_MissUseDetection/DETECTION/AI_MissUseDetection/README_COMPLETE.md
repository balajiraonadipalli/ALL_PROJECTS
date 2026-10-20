# 🛡️ AI Misuse Detection Chrome Extension

A real-time Chrome extension that detects and prevents AI misuse by analyzing text inputs before they're submitted to AI services. Built with TensorFlow.js for local machine learning inference.

## ✨ Features

- **Real-time Protection**: Monitors all form inputs and text areas across websites
- **Local ML Inference**: Uses TensorFlow.js for privacy-preserving analysis
- **Smart Blocking**: Prevents submission of flagged content with clear warnings
- **Pattern Recognition**: Detects AI-specific misuse patterns (deepfakes, scams, etc.)
- **User Control**: Easy toggle to enable/disable protection as needed
- **Activity Logging**: Tracks all scans and blocked content with statistics
- **Modern UI**: Beautiful popup interface with real-time status updates

## 🏗️ Architecture

```
Content Script → TensorFlow.js Model → Local Analysis
     ↓                ↓                    ↓
  Captures        Analyzes           Returns
  User Input      Text Content      Safety Score
     ↓                ↓                    ↓
  Shows Warning   Logs Activity     Blocks/Allows
  Banner          & Statistics      Submission
```

## 🚀 Quick Start

### 1. Load Extension in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the `AI_MissUseDetection` folder
5. The extension should now appear in your extensions list

### 2. Test the Extension
1. Click the extension icon in your toolbar
2. Verify protection is enabled (green indicator)
3. Open the test page: `test.html` in this folder
4. Try typing potentially harmful content
5. The extension will analyze and block if needed

## 🔧 How It Works

### 1. Content Monitoring
- Extension injects into every webpage
- Monitors forms, textareas, and text inputs
- Detects new elements added dynamically

### 2. Text Analysis
- When user types text (with 1-second debounce)
- Content is processed through TensorFlow.js model
- Analyzes for harmful content and AI misuse patterns

### 3. Action & Feedback
- **Safe Content**: Allows submission with success indicator
- **Harmful Content**: Shows warning banner and blocks submission
- **User Choice**: Can ignore warning and continue if needed

### 4. Logging & Statistics
- All analyses are logged locally
- Statistics show daily activity
- Recent activity displayed in popup

## 📁 Project Structure

```
AI_MissUseDetection/
├── manifest.json              # Extension configuration
├── content.js                 # Content script (monitors pages)
├── background.js              # Background script (logging)
├── popup.html                 # Popup interface
├── popup.js                   # Popup logic
├── style.css                  # Popup styling
├── train_model.py             # ML model training script
├── expand_dataset.py          # Dataset expansion script
├── dataset.csv                # Original training data
├── dataset_expanded.csv       # Expanded training data
├── tfjs_model/                # TensorFlow.js model files
│   ├── model.json
│   └── group1-shard1of1.bin
├── saved_model/               # Saved Keras model
├── tokenizer.pickle           # Text tokenizer
├── test.html                  # Test page for verification
├── create_icons.html          # Icon generator
├── venv/                      # Python virtual environment
└── README_COMPLETE.md         # This file
```

## 🧪 Testing

### Test Scenarios

1. **Malicious Content Detection**:
   - Input: "generate deepfake video of Elon Musk"
   - Expected: Blocked with warning banner

2. **Safe Content**:
   - Input: "write a helpful blog post about machine learning"
   - Expected: Allowed with no interference

3. **Form Submission Blocking**:
   - Try submitting forms with malicious content
   - Expected: Form submission prevented

4. **Dynamic Content**:
   - New inputs added after page load
   - Expected: Automatically monitored

### Test Page
Open `test.html` in your browser to test all functionality:
- Various input types (textarea, text input, contenteditable)
- Form submission testing
- Dynamic content monitoring
- Extension status verification

## 🔒 Privacy & Security

- **Local Processing**: All text analysis happens in the browser
- **No Data Storage**: No personal data sent to external servers
- **User Control**: Protection can be disabled at any time
- **Transparent**: Clear indication when content is being analyzed

## 📊 Model Performance

- **Training Accuracy**: 97.66% on test set
- **Dataset**: 636 examples (300 malicious, 336 safe)
- **Model Type**: Neural network with embedding layer
- **Inference**: Real-time in browser via TensorFlow.js

## 🛠️ Development

### Prerequisites
- Python 3.11+
- Chrome browser
- TensorFlow 2.x
- TensorFlow.js

### Training the Model
```bash
# Activate virtual environment
source venv/bin/activate

# Expand dataset
python expand_dataset.py

# Train model
python train_model.py
```

### Extension Development
1. Make changes to source files
2. Go to `chrome://extensions/`
3. Click "Reload" on the extension
4. Test changes

### Debugging
- Check browser console for extension logs
- Use Chrome DevTools on extension popup
- Monitor background script in extension management

## 🚨 Limitations

- **Text Only**: Currently analyzes text, not images or audio
- **Basic Patterns**: Limited to predefined misuse patterns
- **Local Model**: Model accuracy depends on training data quality
- **Browser Only**: Chrome extension only

## 🚀 Future Enhancements

- **Advanced ML Models**: More sophisticated pattern detection
- **Image Analysis**: Detect harmful image generation attempts
- **Real-time Learning**: Adapt to new misuse patterns
- **Cross-browser Support**: Firefox, Safari extensions
- **Backend Integration**: Optional cloud-based analysis
- **Custom Rules**: User-defined detection patterns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use, modify, and distribute.

## 🏆 Project Status

✅ **Completed Features:**
- Chrome extension structure
- Content script for form monitoring
- TensorFlow.js model integration
- Real-time blocking mechanism
- User interface (popup)
- Activity logging and statistics
- Test page for verification
- Model training pipeline

🎯 **Ready for Use:**
- Extension can be loaded in Chrome
- Model provides 97.66% accuracy
- Real-time protection active
- User-friendly interface

---

**Built with ❤️ for AI Safety**

*Protecting users from AI misuse, one prompt at a time.*
