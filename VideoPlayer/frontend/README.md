-> Video Watch Progress Tracker - React App

Overview:

This React application tracks a user's video watching progress by recording time intervals when the video is played. It calculates total watched time, displays progress as a percentage, and persists data between sessions using localStorage.

Features:

Progress Tracking: Records start and end times of watched segments
Interval Merging: Combines overlapping or adjacent watched intervals
Persistent Storage: Saves progress to localStorage and restores on reload
Visual Feedback: Shows progress bar and numerical statistics
Auto-Resume: Continues playback from last watched position

 Technical Implementation

Core Functionality
1.Interval Tracking:
   Records [startTime, endTime] pairs when video is played
   Merges overlapping/adjacent intervals for accurate calculation

2. Progress Calculation:
   javascript
   const totalWatchedTime = intervals.reduce((total, [start, end]) => total + (end - start), 0);
   const percentageWatched = (totalWatchedTime / duration) * 100;

3. Persistent Storage:
   Saves intervals and last playback position to localStorage
   Handles tab visibility changes and page unload events

Key Components
ReactPlayer: Handles video playback
mergeIntervals(): Cleans up watched intervals data
useEffect hooks: Manage side effects and persistence

For the SetUP and installation & Usage

Installation
-> Library required for the 
npm install react-player 

Running the App
-> TO Run the App in the terminal
npm start

How It Works
1. Playback starts -> Records start time
2. Playback pauses -> Saves interval to storage
3. Page reload -> Restores progress automatically
4. Progress updates in real-time

Data Structure
WatchInterval = [number, number]; // [startTimeInSeconds, endTimeInSeconds]


Future Enhancements
Cloud sync for progress across devices
Multiple videos support
Detailed watching analytics
User authentication for personalized tracking

Note 

Replace `video.mp4` with your actual video file in the `videos` directory.