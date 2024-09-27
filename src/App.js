import React, { useEffect, useState } from "react";
import "./App.css";
import Inputtimer from "./Inputtimer";
import ShowTimer from "./ShowTimer";

function App() {
  // States to manage whether the timer has started and whether it's paused
  const [isStart, setIsStart] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // States to manage hours, minutes, and seconds
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // State to store the interval ID for clearInterval to stop the timer
  const [timerId, setTimerId] = useState(0);

  // Function to handle the 'Start' button logic
  const handleStart = () => {
    // Validating time input: all values should be non-negative, and at least one should be greater than 0
    if (hours < 0 || minutes < 0 || seconds <= 0) {
      alert("Please enter a valid time");
      return;
    } else {
      setIsStart(true); // Mark timer as started
    }
  };

  // Function to resume the timer after being paused
  const handleResume = () => {
    setIsPaused(false); // Set paused state to false
    runTimer(seconds, minutes, hours); // Continue running the timer
  };

  // Function to pause the timer
  const handlePause = () => {
    setIsPaused(true); // Set paused state to true
    clearInterval(timerId); // Stop the interval using the stored interval ID
  };

  // Function to reset the timer to its initial state
  const handleReset = () => {
    setIsStart(false); // Set timer state to not started
    resetTimer(); // Call helper function to reset values
  };

  // Helper function to reset hours, minutes, and seconds, and clear the interval
  const resetTimer = () => {
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    clearInterval(timerId); // Clear the interval to stop the countdown
  };

  // Function to handle input changes for hours, minutes, and seconds
  const handleInput = (e) => {
    const { id, value } = e.target;
    const parsedValue = parseInt(value);

    // Update the state based on the input field ID
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

  // Function to run the timer and decrement the time appropriately
  const runTimer = (sec, min, hr) => {
    if (sec > 0) {
      // Decrement seconds if seconds > 0
      setSeconds(sec - 1);
    } else if (sec === 0 && min > 0) {
      // If seconds are 0 and minutes > 0, decrement minutes and reset seconds to 59
      setMinutes(min - 1);
      setSeconds(59);
    } else if (min === 0 && hr > 0) {
      // If minutes are 0 and hours > 0, decrement hours and reset minutes and seconds to 59
      setHours(hr - 1);
      setMinutes(59);
      setSeconds(59);
    }

    // When the timer reaches 0 for hours, minutes, and seconds, reset the timer and notify the user
    if (sec === 0 && min === 0 && hr === 0) {
      handleReset();
      alert("Timer is finished");
      clearInterval(timerId); // Stop the interval as the countdown has finished
    }
  };

  // useEffect to manage the timer logic when dependencies change
  useEffect(() => {
    let tid; // Declare a variable to store the interval ID

    if (isStart) {
      // If the timer is started and not paused
      tid = setInterval(() => {
        runTimer(seconds, minutes, hours); // Call the countdown function every second
      }, 1000); // Interval of 1000ms (1 second)

      setTimerId(tid); // Store the interval ID in state to clear it later

      /*
       * Explanation: After starting the interval with setInterval,
       * the execution immediately moves on to the next line, where we
       * store the interval ID using setTimerId(tid). This happens
       * synchronously, but the interval keeps running in the background
       * and triggers the function every second.
       */
    }

    // Cleanup function to clear the interval when dependencies change or the component unmounts
    return () => {
      clearInterval(tid); // Clear the interval when the effect is cleaned up (e.g., when dependencies change)
    };

    /*
     * The useEffect cleanup function is executed whenever the component
     * re-renders due to changes in the dependencies (isStart, hours, minutes, seconds).
     * The cleanup ensures the previous interval is cleared before a new one is created,
     * preventing multiple intervals from running simultaneously.
     */
  }, [isStart, hours, minutes, seconds]); // Dependencies: when any of these change, the effect re-runs

  return (
    <div className="App">
      <h1>Countdown Timer</h1>

      {/* If timer has not started, show input fields */}
      {!isStart && (
        <Inputtimer handleInput={handleInput} handleStart={handleStart} />
      )}

      {/* If timer has started, show the countdown */}
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
