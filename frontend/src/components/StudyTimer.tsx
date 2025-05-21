import React, { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Coffee, Settings, Timer } from "lucide-react";
import { useStudyContext } from "./context/StudyContext";

interface StudyTimerProps {
  onSessionComplete: (duration: number) => void;
}

const MOTIVATIONAL_QUOTES = [
  "Stay focused, stay sharp!",
  "Every minute counts.",
  "Small steps, big results.",
  "Discipline is the bridge to success.",
  "You're closer than you think!",
];

const PRESETS = [
  { label: "Pomodoro", study: 25, break: 5 },
  { label: "Short", study: 15, break: 3 },
  { label: "Long", study: 50, break: 10 },
];

const StudyTimer: React.FC<StudyTimerProps> = ({ onSessionComplete }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [timerMode, setTimerMode] = useState<"study" | "break">("study");
  const [studyTime, setStudyTime] = useState(25 * 60); // 25 minutes in seconds
  const [breakTime, setBreakTime] = useState(5 * 60); // 5 minutes in seconds
  const [showSettings, setShowSettings] = useState(false);
  const [sessionLog, setSessionLog] = useState<
    { mode: string; duration: number; time: string }[]
  >([]);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const { addSession, subjects } = useStudyContext();

  // Sound notification
  const playSound = () => {
    const audio = new Audio(
      "https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5b2.mp3"
    );
    audio.play();
  };

  // Vibration notification
  const vibrate = () => {
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  };

  // Reset timer based on mode
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setSeconds(timerMode === "study" ? studyTime : breakTime);
  }, [timerMode, studyTime, breakTime]);

  // Initialize timer with study time
  useEffect(() => {
    resetTimer();
  }, [resetTimer]);

  // Timer logic
  useEffect(() => {
    let interval: number | undefined;
    if (isRunning) {
      interval = window.setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            setIsRunning(false);
            playSound();
            vibrate();
            setSessionLog((log) => [
              ...log,
              {
                mode: timerMode,
                duration: timerMode === "study" ? studyTime : breakTime,
                time: new Date().toLocaleTimeString(),
              },
            ]);
            setQuoteIdx((idx) => (idx + 1) % MOTIVATIONAL_QUOTES.length);
            // If study session ended, record the duration
            if (timerMode === "study") {
              onSessionComplete(studyTime);
              addSession({
                id: `session-${Date.now()}`,
                subjectId: subjects[0] ? subjects[0].id : "timer-generic",
                chapterId: "timer-generic-chapter",
                date: new Date().toISOString(),
                duration: studyTime,
                completed: true,
                mood: "focused",
                notes: "Timer Session",
              });
              setTimerMode("break");
              return breakTime;
            } else {
              setTimerMode("study");
              return studyTime;
            }
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerMode, studyTime, breakTime, onSessionComplete]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate progress percentage
  const calculateProgress = (): number => {
    const totalTime = timerMode === "study" ? studyTime : breakTime;
    return ((totalTime - seconds) / totalTime) * 100;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a192f] p-4">
      {/* Header Card */}
      <div className="glass-card border-neon-blue shadow-neon max-w-xl w-full mx-auto mb-8 p-8 flex flex-col items-center">
        <div className="mb-2 animate-pulse">
          <Timer
            size={40}
            className="text-blue-400 drop-shadow-[0_0_16px_rgba(59,130,246,0.7)]"
          />
        </div>
        <h2 className="text-3xl font-bold text-white drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] mb-1 text-center">
          Study Timer
        </h2>
        <p className="text-blue-200 text-lg font-medium drop-shadow mb-2 text-center min-h-[24px]">
          {MOTIVATIONAL_QUOTES[quoteIdx]}
        </p>
      </div>
      {/* Presets Card */}
      <div className="glass-card border-neon-blue shadow-neon max-w-md w-full mx-auto mb-8 p-4 flex justify-center gap-3">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => {
              setStudyTime(preset.study * 60);
              setBreakTime(preset.break * 60);
              setTimerMode("study");
              setIsRunning(false);
              setSeconds(preset.study * 60);
            }}
            className="px-4 py-2 rounded-xl bg-blue-900/40 border border-blue-500/30 text-blue-200 hover:bg-blue-700/40 hover:text-white transition-all duration-200 font-semibold shadow focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            {preset.label}
          </button>
        ))}
      </div>
      {/* Timer Card */}
      <div className="glass-card border-neon-blue shadow-neon max-w-md w-full mx-auto mb-8 p-8 flex flex-col items-center">
        <div className="relative w-56 h-56 mb-4">
          {/* Progress circle background */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#334155"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={timerMode === "study" ? "#60a5fa" : "#38bdf8"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="282.7"
              strokeDashoffset={282.7 - (282.7 * calculateProgress()) / 100}
              transform="rotate(-90 50 50)"
              className="transition-all duration-1000 ease-in-out drop-shadow-[0_0_16px_rgba(59,130,246,0.7)] animate-pulse"
            />
          </svg>
          {/* Time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-extrabold text-white drop-shadow-[0_0_12px_rgba(59,130,246,0.7)] tracking-widest">
              {formatTime(seconds)}
            </span>
            <span className="text-base text-blue-300 mt-1 capitalize tracking-wide">
              {timerMode} mode
            </span>
          </div>
        </div>
        {/* Controls Card */}
        <div className="glass-card border-neon-blue shadow-neon flex justify-center space-x-4 p-4 mt-2">
          <button
            title={isRunning ? "Pause" : "Start"}
            onClick={() => setIsRunning(!isRunning)}
            className={`p-4 rounded-full shadow-lg transition-colors border border-blue-500/20 text-2xl font-bold focus:ring-2 focus:ring-blue-400 focus:outline-none ${
              isRunning
                ? "bg-red-900/60 text-red-400 hover:bg-red-900/80"
                : "bg-green-900/60 text-green-400 hover:bg-green-900/80"
            }`}
          >
            {isRunning ? <Pause size={28} /> : <Play size={28} />}
          </button>
          <button
            title="Reset"
            onClick={resetTimer}
            className="p-4 rounded-full bg-gray-900/60 text-blue-300 border border-blue-500/20 hover:bg-gray-900/80 transition-colors shadow-lg text-2xl font-bold focus:ring-2 focus:ring-blue-400 focus:outline-none"
            disabled={isRunning}
          >
            <RotateCcw size={28} />
          </button>
          <button
            title={
              timerMode === "study" ? "Switch to Break" : "Switch to Study"
            }
            onClick={() => {
              setTimerMode(timerMode === "study" ? "break" : "study");
              setIsRunning(false);
              setSeconds(timerMode === "study" ? breakTime : studyTime);
            }}
            className="p-4 rounded-full bg-blue-900/60 text-blue-300 border border-blue-500/20 hover:bg-blue-900/80 transition-colors shadow-lg text-2xl font-bold focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            {timerMode === "study" ? <Coffee size={28} /> : <Play size={28} />}
          </button>
          <button
            title="Settings"
            onClick={() => setShowSettings(!showSettings)}
            className="p-4 rounded-full bg-gray-800/70 text-blue-300 border border-blue-500/20 hover:bg-blue-900/80 transition-colors shadow-lg text-2xl font-bold focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <Settings size={28} />
          </button>
        </div>
      </div>
      {/* Settings Panel */}
      {showSettings && (
        <div className="glass-card border-neon-blue shadow-neon max-w-md w-full mx-auto mb-8 p-6">
          <h4 className="text-lg font-medium text-blue-200 mb-3">
            Timer Settings
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-blue-300 mb-1">
                Study Time (min)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={studyTime / 60}
                onChange={(e) => setStudyTime(parseInt(e.target.value) * 60)}
                className="w-full rounded-md bg-gray-900/70 border border-blue-500/20 text-white focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-blue-300 mb-1">
                Break Time (min)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={breakTime / 60}
                onChange={(e) => setBreakTime(parseInt(e.target.value) * 60)}
                className="w-full rounded-md bg-gray-900/70 border border-blue-500/20 text-white focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}
      {/* Session Log */}
      <div className="glass-card border-neon-blue shadow-neon max-w-md w-full mx-auto mt-4 p-6">
        <h4 className="text-blue-200 font-semibold mb-2">Session Log</h4>
        <ul className="space-y-1 max-h-32 overflow-y-auto pr-2">
          {sessionLog.length === 0 && (
            <li className="text-blue-400 text-sm">No sessions yet.</li>
          )}
          {sessionLog.map((log, idx) => (
            <li
              key={idx}
              className="text-blue-300 text-sm flex justify-between"
            >
              <span className="capitalize">{log.mode}</span>
              <span>{formatTime(log.duration)}</span>
              <span className="text-xs text-blue-500">{log.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudyTimer;
