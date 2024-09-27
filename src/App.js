import React, { useEffect, useState } from "react";
import "./App.css";
import Inputtimer from "./Inputtimer";
import ShowTimer from "./ShowTimer";

function App() {
  const [isStart, setIsStart] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timerId, setTimerId] = useState(0);

  const handleStart = () => {
    if (hours < 0 || minutes < 0 || seconds <= 0) {
      alert("Please enter a valid time");
      return;
    } else {
      setIsStart(true);
    }
  };

  const handleResume = () => {
    setIsPaused(false);
    runTimer(seconds, minutes, hours);
  };

  const handlePause = () => {
    setIsPaused(true);
    clearInterval(timerId);
  };

  const handleReset = () => {
    setIsStart(false);
    resetTimer();
  };

  const resetTimer = () => {
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    clearInterval(timerId);
  };

  const handleInput = (e) => {
    const { id, value } = e.target;
    const parsedValue = parseInt(value);

    if (id === "hours") {
      setHours(parsedValue);
    }
    if (id === "minutes") {
      setMinutes(parsedValue);
    }
    if (id === "seconds") {
      setSeconds(parsedValue);
    }
  };

  const runTimer = (sec, min, hr) => {
    if (sec > 0) {
      setSeconds(sec - 1);
    } else if (sec === 0 && min > 0) {
      setMinutes(min - 1);
      setSeconds(59);
    } else if (min === 0 && hr > 0) {
      setHours(hr - 1);
      setMinutes(59);
      setSeconds(59);
    }

    if (sec === 0 && min === 0 && hr === 0) {
      handleReset();
      alert("Timer is finished");
      clearInterval(timerId);
    }
  };

  // Include runTimer in the dependencies
  useEffect(() => {
    let tid;

    if (isStart && !isPaused) {
      // Check if timer is started and not paused
      tid = setInterval(() => {
        runTimer(seconds, minutes, hours);
      }, 1000);
      setTimerId(tid);
    }

    return () => {
      clearInterval(tid);
    };
  }, [isStart, hours, minutes, seconds, isPaused, runTimer]); // Added runTimer to the dependencies

  return (
    <div className="App">
      <h1>Countdown Timer</h1>
      {!isStart && (
        <Inputtimer handleInput={handleInput} handleStart={handleStart} />
      )}
      {isStart && (
        <ShowTimer
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          isPaused={isPaused}
          handleResume={handleResume}
          handlePause={handlePause}
          handleReset={handleReset}
        />
      )}
    </div>
  );
}

export default App;
