import { useState, useEffect } from "react";
import "./App.css";
import beepSound from "./assets/beep.mp3"; // Add beep sound file in assets folder

function App() {
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [time, setTime] = useState(focusTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // @ts-ignore
    let timer: NodeJS.Timeout;
    if (isRunning && time > 0) {
      timer = setInterval(() => setTime((prev) => prev - 1), 1000);
    } else if (isRunning && time === 0) {
      playBeep();
      if (isBreak) {
        resetTimer(); // Reset to focus time
      } else {
        startBreak(); // Start break when focus ends
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, time]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  
  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTime(focusTime * 60);
  };

  const startBreak = () => {
    setIsRunning(true);
    setIsBreak(true);
    setTime(breakTime * 60);
  };

  const playBeep = () => {
    const audio = new Audio(beepSound);
    audio.play();
  };

  const updateFocusTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Number(e.target.value));
    setFocusTime(value);
    setTime(value * 60);
  };

  const updateBreakTime = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        {/* <h2 className={isBreak ? "break-text" : "work-text"}>
          {isBreak ? "Break Time" : "Work Time"}
        </h2> */}
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
