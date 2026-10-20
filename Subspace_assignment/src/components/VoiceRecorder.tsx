import { useState, useRef, useEffect } from "react";
import "./VoiceRecorder.css";
import { transcribeAudio } from "../services/deepgram";

interface VoiceRecorderProps {}

const VoiceRecorder: React.FC<VoiceRecorderProps> = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });
      
      streamRef.current = stream;
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: 'audio/webm;codecs=opus' 
        });
        
        setIsProcessing(true);
        try {
          const text = await transcribeAudio(audioBlob);
          setTranscript((prev: string) => prev + (prev ? " " : "") + text);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Transcription failed");
        } finally {
          setIsProcessing(false);
        }

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to access microphone");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const clearTranscript = () => {
    setTranscript("");
    setError(null);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      alert("Text copied to clipboard!");
    } catch (err) {
      setError("Failed to copy to clipboard");
    }
  };

  return (
    <div className="voice-recorder">
      <div className="recorder-controls">
        <button
          className={`record-button ${isRecording ? "recording" : ""} ${isProcessing ? "processing" : ""}`}
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onMouseLeave={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <span className="button-text">Processing...</span>
          ) : isRecording ? (
            <span className="button-text">Recording...</span>
          ) : (
            <span className="button-text">Hold to Record</span>
          )}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
        </div>
      )}

      {transcript && (
        <div className="transcript-container">
          <div className="transcript-header">
            <h3>Transcription</h3>
            <div className="transcript-actions">
              <button onClick={copyToClipboard} className="action-button">
                Copy
              </button>
              <button onClick={clearTranscript} className="action-button">
                Clear
              </button>
            </div>
          </div>
          <div className="transcript-text">{transcript}</div>
        </div>
      )}

      {!transcript && !error && (
        <div className="instructions">
          <p>Click and hold the button above to start recording</p>
          <p className="hint">Make sure to allow microphone access when prompted</p>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;

