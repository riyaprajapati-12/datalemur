
import { useState, useEffect } from 'react';
import { FaStopwatch, FaPlay, FaPause, FaSyncAlt } from "react-icons/fa";

const Stopwatch = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    // Main container with a subtle background change when running
    <div className={`flex items-center gap-2 p-1.5 border rounded-full transition-colors duration-300 ${isRunning ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-300'}`}>
      
      {/* Timer Display */}
      <div className="flex items-center gap-2 px-3">
        <FaStopwatch className={`${isRunning ? 'text-blue-600' : 'text-gray-500'}`} />
        <span className={`text-xl font-mono font-semibold ${isRunning ? 'text-gray-800' : 'text-gray-600'}`}>
          {formatTime(seconds)}
        </span>
      </div>
      
      {/* Control Buttons */}
      <div className="flex items-center gap-1">
        <button 
          onClick={handleStartStop} 
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          title={isRunning ? "Pause" : "Start"}
        >
          {isRunning ? <FaPause /> : <FaPlay />}
        </button>
        <button 
          onClick={handleReset} 
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          title="Reset"
        >
          <FaSyncAlt />
        </button>
      </div>
    </div>
  );
};

export default Stopwatch;