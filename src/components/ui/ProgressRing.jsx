import { useEffect, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

export default function ProgressRing({
  value = 0,
  size = 160,
  strokeWidth = 12,
  label,
  sublabel,
  color = 'var(--color-emerald-500)',
  trackColor = 'var(--color-surface-200)',
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [display, setDisplay] = useState(0);
  const progress = useMotionValue(0);

  useEffect(() => {
    const controls = animate(progress, value, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, progress]);

  const offset = circumference - (display / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="font-[var(--font-display)] text-3xl font-bold text-navy-900">{display}%</span>
        {label ? <span className="mt-0.5 text-xs font-medium text-navy-400">{label}</span> : null}
        {sublabel ? <span className="text-[11px] text-navy-300">{sublabel}</span> : null}
      </div>
    </div>
  );
}
