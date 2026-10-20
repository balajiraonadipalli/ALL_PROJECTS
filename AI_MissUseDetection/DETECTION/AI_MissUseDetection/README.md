# 🛡️ AI Misuse Detection & Protection

A real-time Chrome extension that detects and prevents AI misuse by analyzing text inputs before they're submitted to AI services. Built for the 24-hour hackathon challenge to create the first line of defense against AI misuse.

## 🎯 What It Does

- **Real-time Protection**: Monitors all form inputs and text areas across websites
- **AI Misuse Detection**: Uses OpenAI's Moderation API to identify harmful content
- **Smart Blocking**: Prevents submission of flagged content with clear warnings
- **Pattern Recognition**: Detects AI-specific misuse patterns (deepfakes, scams, etc.)
- **User Control**: Easy toggle to enable/disable protection as needed

## 🏗️ Architecture

```
Content Script → Background Script → OpenAI Moderation API
     ↓                ↓                    ↓
  Captures        Analyzes           Returns
  User Input      Text Content      Safety Score
     ↓                ↓                    ↓
  Shows Warning   Logs Activity     Blocks/Allows
  Banner          & Statistics      Submission
```

## 🚀 Quick Start (24-Hour Hackathon Setup)

### 1. Get OpenAI API Key
- Visit [OpenAI Platform](https://platform.openai.com/api-keys)
- Create a new API key
- Copy the key (you'll need it for the extension)

### 2. Load Extension in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the `AI_MissUseDetection` folder
5. The extension should now appear in your extensions list

### 3. Configure API Key
1. Click the extension icon in your toolbar
2. Enter your OpenAI API key in the popup
3. Click "Save"
4. Toggle protection on/off as needed

### 4. Test the Extension
- Go to any website with forms or text inputs
- Try typing potentially harmful content
- The extension will analyze and block if needed

## 🔧 Features

### Core Protection
- **Form Monitoring**: Automatically detects and monitors all forms
- **Real-time Analysis**: Analyzes text as you type (Ctrl/Cmd + Enter)
- **Smart Blocking**: Prevents harmful content submission
- **Warning Banners**: Clear explanations of why content was blocked

### AI Misuse Detection
- **Deepfake Generation**: Detects attempts to create fake videos/images
- **Misinformation**: Identifies false information creation
- **Scam Content**: Catches fraudulent content patterns
- **Harmful Content**: Blocks violent, hateful, or graphic content
- **Impersonation**: Detects attempts to impersonate others

### User Experience
- **Easy Toggle**: One-click protection enable/disable
- **Visual Feedback**: Loading indicators and success confirmations
- **Activity Logging**: Track all scans and blocked content
- **Statistics**: Daily counts of scans, blocked, and safe content

## 📁 Project Structure

```
AI_MissUseDetection/
├── manifest.json              # Extension configuration
├── src/
│   ├── js/
│   │   ├── content.js         # Content script (monitors pages)
│   │   ├── background.js      # Background script (API calls)
│   │   └── popup.js          # Popup interface logic
│   ├── css/
│   │   ├── popup.css         # Popup styling
│   │   └── content.css       # Content script styling
│   ├── images/               # Extension icons
│   └── popup.html            # Popup interface
└── README.md                 # This file
```

## 🎮 How It Works

### 1. Content Monitoring
- Extension injects into every webpage
- Monitors forms, textareas, and text inputs
- Detects new elements added dynamically

### 2. Text Analysis
- When user submits text (form submit or Ctrl+Enter)
- Content is sent to OpenAI Moderation API
- Analyzes for harmful content and AI misuse patterns

### 3. Action & Feedback
- **Safe Content**: Allows submission with success indicator
- **Harmful Content**: Shows warning banner and blocks submission
- **User Choice**: Can ignore warning and continue if needed

### 4. Logging & Statistics
- All analyses are logged locally
- Statistics show daily activity
- Recent activity displayed in popup

## 🧪 Testing Scenarios

### Test 1: Deepfake Detection
```
Input: "Create a deepfake video of [celebrity] saying [controversial statement]"
Expected: Blocked with "deepfake_generation" category
```

### Test 2: Misinformation
```
Input: "Write fake news about [current event] to spread confusion"
Expected: Blocked with "misinformation" category
```

### Test 3: Safe Content
```
Input: "Write a helpful blog post about machine learning"
Expected: Allowed with success indicator
```

## 🔒 Privacy & Security

- **Local Processing**: Text analysis happens via OpenAI API
- **No Data Storage**: No personal data stored on external servers
- **User Control**: Protection can be disabled at any time
- **Transparent**: Clear indication when content is being analyzed

## 🚨 Limitations (24-Hour Version)

- **API Dependency**: Requires OpenAI API key and internet connection
- **Text Only**: Currently analyzes text, not images or audio
- **Basic Patterns**: Limited to predefined misuse patterns
- **No Backend**: All logging is local (no cross-device sync)

## 🚀 Future Enhancements

- **Local ML Models**: Run analysis without external API calls
- **Image Analysis**: Detect harmful image generation attempts
- **Advanced Patterns**: Machine learning-based pattern detection
- **Backend Dashboard**: Web-based analytics and reporting
- **Browser Integration**: Native browser support and adoption

## 🛠️ Development

### Prerequisites
- Chrome browser
- OpenAI API key
- Basic knowledge of Chrome extensions

### Local Development
1. Make changes to source files
2. Go to `chrome://extensions/`
3. Click "Reload" on the extension
4. Test changes

### Debugging
- Check browser console for extension logs
- Use Chrome DevTools on extension popup
- Monitor background script in extension management

## 📊 Performance Considerations

- **API Rate Limits**: OpenAI has rate limits on API calls
- **Response Time**: API calls add 1-3 seconds to form submission
- **Memory Usage**: Extension keeps last 100 analyses in memory
- **Network**: Requires internet connection for analysis

## 🤝 Contributing

This is a hackathon project, but contributions are welcome:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use, modify, and distribute.

## 🏆 Hackathon Goals

- [x] Basic Chrome extension structure
- [x] Content script for form monitoring
- [x] Background script for API integration
- [x] OpenAI Moderation API integration
- [x] User interface (popup)
- [x] Real-time blocking mechanism
- [x] Basic logging and statistics
- [ ] Demo website for testing
- [ ] Presentation materials

## 🎯 Demo Strategy

1. **Show Extension Working**: Install and demonstrate on real websites
2. **Test Misuse Detection**: Try various harmful prompts
3. **Display Statistics**: Show popup with activity data
4. **Explain Architecture**: Walk through the technical implementation
5. **Future Vision**: Discuss potential impact and adoption

---

**Built in 24 hours for the AI Misuse Detection Hackathon** 🚀

*Protecting users from AI misuse, one prompt at a time.*

