# Voice-to-Text Desktop App

A cross-platform desktop application built with Tauri and React that provides real-time voice-to-text transcription using Deepgram's speech recognition API.

## Features

- 🎤 **Push-to-Talk Voice Input** - Hold a button to record your voice
- 🔊 **Microphone Access** - Handles system permissions and captures high-quality audio
- ⚡ **Real-Time Transcription** - Streams audio to Deepgram for accurate transcription
- 📝 **Text Display & Management** - View transcribed text with copy and clear functionality
- 🎨 **Modern UI** - Clean, intuitive interface with visual feedback
- 🛡️ **Error Handling** - Graceful handling of network issues, API errors, and permission denials

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Rust](https://www.rust-lang.org/tools/install) (latest stable version)
- [Deepgram API Key](https://console.deepgram.com/) - Sign up for a free account to get your API key

## Setup Instructions

### 1. Clone or Download the Project

```bash
cd Subspace_assignment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Deepgram API Key

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Deepgram API key:
   ```
   VITE_DEEPGRAM_API_KEY=your_actual_api_key_here
   ```

   You can get your API key from the [Deepgram Console](https://console.deepgram.com/).

### 4. Run the Development Server

```bash
npm run tauri dev
```

This will:
- Start the Vite development server
- Build the Tauri application
- Launch the desktop app window

### 5. Build for Production

To create a production build:

```bash
npm run tauri build
```

The built application will be in `src-tauri/target/release/` (or `src-tauri/target/release/bundle/` for installers).

## How to Use

1. **Launch the Application** - Run `npm run tauri dev` or launch the built executable
2. **Allow Microphone Access** - When prompted, allow the application to access your microphone
3. **Record Audio** - Click and hold the "Hold to Record" button
4. **View Transcription** - Release the button to stop recording and see the transcribed text
5. **Manage Text** - Use the "Copy" button to copy text to clipboard or "Clear" to reset

## Architecture

### Project Structure

```
.
├── src/                    # React frontend source
│   ├── components/         # React components
│   │   └── VoiceRecorder.tsx  # Main voice recording component
│   ├── services/          # API services
│   │   └── deepgram.ts    # Deepgram API integration
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── src-tauri/             # Tauri backend (Rust)
│   ├── src/
│   │   └── main.rs        # Tauri entry point
│   └── Cargo.toml         # Rust dependencies
├── package.json           # Node.js dependencies
└── README.md             # This file
```

### Key Components

#### VoiceRecorder Component
- Handles microphone access and audio recording
- Manages recording state and user interactions
- Displays transcribed text and error messages
- Provides copy and clear functionality

#### Deepgram Service
- Encapsulates Deepgram API integration
- Converts audio blobs to the required format
- Handles API requests and response parsing
- Provides error handling for API failures

### Technical Decisions

1. **Audio Format**: Uses `audio/webm;codecs=opus` for recording, which provides good quality and compression
2. **Recording Method**: MediaRecorder API for browser-based audio capture
3. **API Integration**: RESTful API calls to Deepgram (can be upgraded to WebSocket for real-time streaming)
4. **State Management**: React hooks for local state management (sufficient for this use case)
5. **Error Handling**: Try-catch blocks with user-friendly error messages

## Known Limitations

1. **API Key Security**: The API key is currently stored in the frontend environment variable. For production, consider using a backend proxy.
2. **Real-Time Streaming**: Currently uses batch transcription. Real-time streaming via WebSocket can be implemented for lower latency.
3. **Audio Format Support**: Currently optimized for WebM format. Additional format support can be added.
4. **Offline Support**: Requires internet connection for transcription. No offline capabilities.

## Troubleshooting

### Microphone Not Working
- Ensure you've granted microphone permissions to the application
- Check your system's privacy settings
- Try refreshing the application

### API Errors
- Verify your Deepgram API key is correct in the `.env` file
- Check your internet connection
- Ensure you have sufficient Deepgram credits/quota

### Build Issues
- Make sure Rust is properly installed: `rustc --version`
- Ensure Node.js version is 18 or higher: `node --version`
- Try cleaning and rebuilding: `npm run tauri clean` then `npm run tauri dev`

## Development Notes

- The app uses Vite for fast development and building
- Tauri provides native desktop capabilities with minimal overhead
- React is used for the UI layer with TypeScript for type safety
- Audio is captured using the Web Audio API through MediaRecorder

## Future Enhancements

- [ ] Real-time streaming transcription via WebSocket
- [ ] Multiple language support
- [ ] Audio playback of recorded segments
- [ ] Export transcriptions to files
- [ ] Keyboard shortcuts for recording
- [ ] Audio visualization during recording
- [ ] Backend proxy for API key security

## License

This project is created for educational/assignment purposes.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Deepgram's [documentation](https://developers.deepgram.com/)
3. Check Tauri's [documentation](https://tauri.app/)

---

**Built with ❤️ using Tauri, React, and Deepgram**


