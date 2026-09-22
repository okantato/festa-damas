import React, { useState, useEffect } from 'react';
import { Hourglass } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isPast: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="bg-[#201f21]/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-xl border border-[#eac34a]/25 flex flex-col items-center gap-3 relative overflow-hidden">
      {/* Subtle gold glow behind timer */}
      <div className="absolute inset-0 bg-radial from-[#eac34a]/5 to-transparent pointer-events-none" />

      <div className="flex items-center gap-1.5 text-[#eac34a] relative z-10">
        <Hourglass className="w-4 h-4 animate-spin [animation-duration:8s]" />
        <span className="font-semibold text-xs tracking-wider uppercase text-[#eac34a]">
          Contagem Regressiva para a Grande Noite
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2.5 w-full text-center relative z-10">
        <div className="bg-[#1c1b1d] p-2.5 sm:p-3 rounded-xl border border-[#4a454d]/30 shadow-inner">
          <span className="block font-['Syne'] font-bold text-2xl sm:text-3xl text-[#eac34a]">
            {pad(timeLeft.days)}
          </span>
          <span className="block text-[10px] sm:text-xs text-[#ccc4ce] tracking-wider uppercase mt-0.5">
            Dias
          </span>
        </div>

        <div className="bg-[#1c1b1d] p-2.5 sm:p-3 rounded-xl border border-[#4a454d]/30 shadow-inner">
          <span className="block font-['Syne'] font-bold text-2xl sm:text-3xl text-[#eac34a]">
            {pad(timeLeft.hours)}
          </span>
          <span className="block text-[10px] sm:text-xs text-[#ccc4ce] tracking-wider uppercase mt-0.5">
            Horas
          </span>
        </div>

        <div className="bg-[#1c1b1d] p-2.5 sm:p-3 rounded-xl border border-[#4a454d]/30 shadow-inner">
          <span className="block font-['Syne'] font-bold text-2xl sm:text-3xl text-[#eac34a]">
            {pad(timeLeft.minutes)}
          </span>
          <span className="block text-[10px] sm:text-xs text-[#ccc4ce] tracking-wider uppercase mt-0.5">
            Min
          </span>
        </div>

        <div className="bg-[#1c1b1d] p-2.5 sm:p-3 rounded-xl border border-[#4a454d]/30 shadow-inner">
          <span className="block font-['Syne'] font-bold text-2xl sm:text-3xl text-[#eac34a]">
            {pad(timeLeft.seconds)}
          </span>
          <span className="block text-[10px] sm:text-xs text-[#ccc4ce] tracking-wider uppercase mt-0.5">
            Seg
          </span>
        </div>
      </div>
    </div>
  );
};
