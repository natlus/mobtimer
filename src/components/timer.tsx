"use client";

import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  TimerIcon,
} from "lucide-react";
import { atom, useAtom } from "jotai";

const TIME = 15;

type Props = {
  participants: string[];
};

type Timer = {
  participant: string;
  time: number;
};

const presetTimes = [10, 15, 20, 30, 60] as const;
const defaultTime = 15;

export const activeParticipantAtom = atom<string | null>(null);
export const timerAtom = atom(defaultTime * 60);

export function Timer({ participants }: Props) {
  const [timer, setTimer] = useAtom(timerAtom);
  const [activeParticipant, setActiveParticipant] = useAtom(
    activeParticipantAtom
  );
  const [running, setRunning] = useState(false);
  const [showTimeOptions, setShowTimeOptions] = useState(false);
  const [presetTime, setPresetTime] =
    useState<(typeof presetTimes)[number]>(defaultTime);
  const tick = useRef<any>();

  useEffect(() => {
    setActiveParticipant(participants[0]);
  }, []);

  useEffect(() => {
    setRunning(false);
    setTimer(presetTime * 60);
  }, [presetTime]);

  useEffect(() => {
    if (running) {
      tick.current = setInterval(() => {
        setTimer((state) => state - 1);
      }, 1000);
    }

    return () => clearInterval(tick.current);
  }, [running]);

  useEffect(() => {
    if (timer <= -0.9) {
      setRunning(false);
      setTimer(presetTime * 60);
      stepBetweenParticipants(1);
    }
  }, [timer]);

  function stepBetweenParticipants(step: 1 | -1) {
    const currentIndex = participants.findIndex((p) => p === activeParticipant);
    const maxIndex = participants.length - 1;

    function getIndex(index: number) {
      if (step > 0 && index + 1 <= maxIndex) return index + 1;
      if (step < 0 && index - 1 >= 0) return index - 1;
      if (step < 0 && index - 1 <= 0) return maxIndex;
      return 0;
    }

    const index = getIndex(currentIndex);

    setActiveParticipant(participants[index]);
  }

  const iconProps = {
    size: 24,
  };

  const itemStyle =
    "bg-slate-950 p-4 text-white hover:bg-slate-900 flex items-center justify-center";

  if (!participants.length) return null;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="grid grid-cols-[100px_1fr_1fr_1fr_1fr] [&>*:first-child]:rounded-l [&>*:last-child]:rounded-r w-full">
        <div
          className={`${itemStyle} flex items-center text-xl hover:bg-slate-950 text-left justify-start`}
        >
          {readableTime(timer)}
        </div>
        <button
          onClick={() => setRunning((state) => !state)}
          className={itemStyle}
        >
          {running ? <Pause {...iconProps} /> : <Play {...iconProps} />}
        </button>

        <button
          onClick={() => stepBetweenParticipants(-1)}
          className={itemStyle}
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => stepBetweenParticipants(1)}
          className={itemStyle}
        >
          <ChevronRight />
        </button>
        <button
          className={itemStyle}
          onClick={() => setShowTimeOptions(!showTimeOptions)}
        >
          <TimerIcon />
        </button>
      </div>
      {showTimeOptions && (
        <div className="grid grid-cols-5 [&>*:first-child]:rounded-l [&>*:last-child]:rounded-r self-start w-full border-t-slate-900 border-t-2">
          {presetTimes.map((time) => {
            const active = time === presetTime ? "bg-slate-900" : "";

            return (
              <button
                key={time}
                className={`${itemStyle} py-6 ${active}`}
                onClick={() => setPresetTime(time)}
              >
                {time}m
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function readableTime(s: number) {
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins || ""}:${secs < 10 ? "0" : ""}${secs}`;
}
