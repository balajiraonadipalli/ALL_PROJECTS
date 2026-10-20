# Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required Node.js packages including React, Tauri, and Vite.

## Step 2: Get Deepgram API Key

1. Go to [https://console.deepgram.com/](https://console.deepgram.com/)
2. Sign up for a free account (if you don't have one)
3. Navigate to API Keys section
4. Create a new API key or copy an existing one

## Step 3: Configure Environment

1. Create a `.env` file in the root directory:
   ```bash
   # On Windows PowerShell
   New-Item .env
   
   # On Linux/Mac
   touch .env
   ```

2. Add your Deepgram API key to the `.env` file:
   ```
   VITE_DEEPGRAM_API_KEY=your_actual_api_key_here
   ```

   Replace `your_actual_api_key_here` with your actual Deepgram API key.

## Step 4: Run the Application

```bash
npm run tauri dev
```

This will:
- Install Rust dependencies (first time only, may take a few minutes)
- Start the development server
- Build and launch the desktop app

## Troubleshooting

### Rust Not Installed
If you get an error about Rust, install it from: https://www.rust-lang.org/tools/install

### Port Already in Use
If port 1420 is already in use, you can change it in `vite.config.ts`

### API Key Issues
Make sure:
- The `.env` file is in the root directory (same level as `package.json`)
- The variable name is exactly `VITE_DEEPGRAM_API_KEY`
- There are no spaces around the `=` sign
- You restart the dev server after adding the API key

## Building for Production

```bash
npm run tauri build
```

The built application will be in `src-tauri/target/release/bundle/`


