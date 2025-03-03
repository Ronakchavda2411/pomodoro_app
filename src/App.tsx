import { useState, useEffect } from "react";
import "./App.css";
import beepSound from "./assets/beep.mp3";

function App() {
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [time, setTime] = useState(focusTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [pausedTimeRemaining, setPausedTimeRemaining] = useState(null);

  useEffect(() => {
    let timerID;
    
    if (isRunning) {
      // Record the current timestamp when starting
      const now = Date.now();
      setStartTime(now);
      
      timerID = setInterval(() => {
        const currentTime = Date.now();
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
        const newTimeRemaining = pausedTimeRemaining !== null 
          ? pausedTimeRemaining - elapsedSeconds 
          : time - elapsedSeconds;
        
        if (newTimeRemaining <= 0) {
          clearInterval(timerID);
          setTime(0);
          playBeep();
          
          if (isBreak) {
            resetTimer();
          } else {
            startBreak();
          }
        } else {
          setTime(newTimeRemaining);
        }
      }, 100); // Update more frequently for better accuracy
    }
    
    return () => {
      if (timerID) clearInterval(timerID);
    };
  }, [isRunning, startTime, pausedTimeRemaining]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const startTimer = () => {
    setPausedTimeRemaining(time);
    setIsRunning(true);
  };
  
  const pauseTimer = () => {
    setPausedTimeRemaining(time);
    setIsRunning(false);
  };
  
  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setPausedTimeRemaining(null);
    setTime(focusTime * 60);
  };

  const startBreak = () => {
    setIsBreak(true);
    setPausedTimeRemaining(breakTime * 60);
    setTime(breakTime * 60);
    setIsRunning(true);
  };

  const playBeep = () => {
    const audio = new Audio(beepSound);
    audio.play();
  };

  const updateFocusTime = (e) => {
    const value = Math.max(1, Number(e.target.value));
    setFocusTime(value);
    if (!isRunning && !isBreak) {
      setTime(value * 60);
      setPausedTimeRemaining(null);
    }
  };

  const updateBreakTime = (e) => {
    setBreakTime(Math.max(1, Number(e.target.value)));
  };

  return (
    <div className="app">
      <button className="menu-btn" onClick={() => setShowMenu(!showMenu)}>
        ⚙️
      </button>
      
      {showMenu && (
        <div className="menu">
          <h3>Settings</h3>
          <label>Focus Time (min):</label>
          <input type="number" value={focusTime} onChange={updateFocusTime} min="1" />
          <label>Break Time (min):</label>
          <input type="number" value={breakTime} onChange={updateBreakTime} min="1" />
        </div>
      )}

      <div className="card">
        <h1>Pomodoro Timer</h1>
        <h2 className={isBreak ? "break-text" : "work-text"}>
          {isBreak ? "Break Time" : "Work Time"}
        </h2>
        <h1 className="timer">{formatTime(time)}</h1>
        
        <div className="buttons">
          {!isRunning ? (
            <button className="start-btn" onClick={startTimer}>Start</button>
          ) : (
            <button className="pause-btn" onClick={pauseTimer}>Pause</button>
          )}
          <button className="reset-btn" onClick={resetTimer}>Reset</button>
          <button className="break-btn" onClick={startBreak}>Short Break</button>
        </div>
      </div>
    </div>
  );
}

export default App;