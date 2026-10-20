import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import Video from "./videos/video.mp4";
import "./App.css";

function App() {
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(0);
  const [watchIntervals, setWatchIntervals] = useState([]);
  const playerRef = useRef(null);

  // this function is going to Merge overlapping or adjacent intervals
  const mergeIntervals = (intervals) => {
    if (intervals.length < 2) return intervals;
    intervals.sort((a, b) => a[0] - b[0]);
    const merged = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
      const last = merged[merged.length - 1];
      if (intervals[i][0] <= last[1]) {
        last[1] = Math.max(last[1], intervals[i][1]);
      } else {
        merged.push(intervals[i]);
      }
    }
    return merged;
  };

  //here we are going to  Save progress
  const saveProgress = () => {
    const currentTime = playerRef.current?.getCurrentTime() || 0;
    if (startTime !== null && currentTime > startTime) {
      const newIntervals = mergeIntervals([...watchIntervals, [startTime, currentTime]]);
      setWatchIntervals(newIntervals);
      localStorage.setItem('watchIntervals', JSON.stringify(newIntervals));
      localStorage.setItem('lastWatchedTime', currentTime.toString());
    }
  };
//on video start playing
  const handleStart = () => {
    const currentTime = playerRef.current?.getCurrentTime() || 0;
    setStartTime(currentTime);
  };
//On video paused
  const handlePause = () => {
    saveProgress();
  };
//setting the duration
  const handleDuration = (duration) => {
    setDuration(duration);
  };

  // Calculate total watched time
  const totalWatchedTime = watchIntervals.reduce((total, [start, end]) => total + (end - start), 0);
  const percentageWatched = duration > 0 ? Math.min(100, (totalWatchedTime / duration) * 100) : 0;

  // Load saved data on mount
  useEffect(() => {
    const savedIntervals = localStorage.getItem('watchIntervals');
    const savedTime = localStorage.getItem('lastWatchedTime');
    if (savedIntervals) {
      try {
        setWatchIntervals(JSON.parse(savedIntervals));
      } catch (e) {
        console.error("Failed to parse saved intervals", e);
      }
    }
    if (savedTime && playerRef.current) {
      const time = parseFloat(savedTime);
      if (!isNaN(time)) {
        setTimeout(() => {
          playerRef.current.seekTo(time, 'seconds');
        }, 1000);
      }
    }
  }, []);

  // Saving the  progress on unload or tab hide
  useEffect(() => {
    const handleUnload = () => saveProgress();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') saveProgress();
    };

    window.addEventListener('beforeunload', handleUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [startTime, watchIntervals]);

  return (
    <div className='container'>
      <ReactPlayer
        ref={playerRef}
        url={Video}
        controls
        onPlay={handleStart}
        onPause={handlePause}
        onDuration={handleDuration}
      />

      <div className="progress-container">
        <h3>Total Watched: {totalWatchedTime.toFixed(2)} seconds</h3>
        <h3>Percentage Watched: {percentageWatched.toFixed(2)}%</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${percentageWatched}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default App;
