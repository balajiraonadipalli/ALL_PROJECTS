/**
 * Deepgram API integration for speech-to-text transcription
 * 
 * This service handles audio transcription using Deepgram's API.
 * You'll need to set your Deepgram API key in the environment variable.
 */

const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY || "";
const DEEPGRAM_API_URL = "https://api.deepgram.com/v1/listen";

/**
 * Converts audio blob to a format suitable for Deepgram API
 */
async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}

/**
 * Transcribes audio using Deepgram API
 * @param audioBlob - The audio blob to transcribe
 * @returns The transcribed text
 */
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  if (!DEEPGRAM_API_KEY) {
    throw new Error(
      "Deepgram API key not found. Please set VITE_DEEPGRAM_API_KEY in your .env file."
    );
  }

  try {
    const audioBuffer = await blobToArrayBuffer(audioBlob);
    
    const response = await fetch(DEEPGRAM_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Token ${DEEPGRAM_API_KEY}`,
        "Content-Type": "audio/webm",
      },
      body: audioBuffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Deepgram API error: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    
    // Extract transcript from Deepgram response
    if (data.results && data.results.channels && data.results.channels[0]) {
      const alternatives = data.results.channels[0].alternatives;
      if (alternatives && alternatives[0]) {
        return alternatives[0].transcript || "";
      }
    }

    throw new Error("No transcript found in Deepgram response");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to transcribe audio");
  }
}


