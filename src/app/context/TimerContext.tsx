import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";

interface TimerContextType {
  focusMinutes: number;
  setFocusMinutes: (minutes: number) => void;
  isActive: boolean;
  timeRemaining: number;
  startTimer: () => void;
  stopTimer: () => void;
  browserLocked: boolean;
  setBrowserLocked: (locked: boolean) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const playSuccessChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const playNote = (frequency: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine'; // Smooth cosmic sound
      osc.frequency.setValueAtTime(frequency, startTime);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.15, startTime + duration * 0.1); // Ease in
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Fade out
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    // Cosmic arpeggio chord (C major ascending)
    playNote(523.25, now, 0.6); // C5
    playNote(659.25, now + 0.15, 0.8); // E5
    playNote(783.99, now + 0.3, 1.5); // G5 (resonant)
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};

export function TimerProvider({ children }: { children: ReactNode }) {
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(focusMinutes * 60);
  const [browserLocked, setBrowserLocked] = useState(false);
  const endTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      setTimeRemaining(focusMinutes * 60);
      endTimeRef.current = null;
    }
  }, [focusMinutes, isActive]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && endTimeRef.current) {
      timer = setInterval(() => {
        const now = Date.now();
        const diff = Math.max(0, Math.ceil((endTimeRef.current! - now) / 1000));
        
        if (diff <= 0) {
          setIsActive(false);
          playSuccessChime();
          // Save focus session automatically when timer reaches 0
          fetch('/api/focus', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ minutes: focusMinutes })
          })
          .then(res => res.json())
          .then(() => import("sonner").then(({ toast }) => toast.success("Focus Complete! A new celestial body was forged in the Cosmos.")))
          .catch(console.error);
          
          setTimeRemaining(0);
          endTimeRef.current = null;
          clearInterval(timer);
        } else {
          setTimeRemaining(diff);
        }
      }, 500); // Tick faster to ensure smooth UI and precision
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, focusMinutes]);

  const startTimer = () => {
    setIsActive(true);
    endTimeRef.current = Date.now() + focusMinutes * 60 * 1000;
    setTimeRemaining(focusMinutes * 60);
  };

  const stopTimer = () => {
    setIsActive(false);
    endTimeRef.current = null;
    setTimeRemaining(focusMinutes * 60);
  };

  return (
    <TimerContext.Provider
      value={{
        focusMinutes,
        setFocusMinutes,
        isActive,
        timeRemaining,
        startTimer,
        stopTimer,
        browserLocked,
        setBrowserLocked
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
}
