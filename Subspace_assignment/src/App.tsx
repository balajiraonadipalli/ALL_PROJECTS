import { useState, useRef, useEffect } from "react";
import "./App.css";
import VoiceRecorder from "./components/VoiceRecorder";

function App() {
  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Voice to Text</h1>
        <p className="subtitle">Press and hold to record your voice</p>
        <VoiceRecorder />
      </div>
    </div>
  );
}

export default App;


