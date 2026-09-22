import React from 'react';

interface FallingPetalsProps {
  enabled: boolean;
}

export const FallingPetals: React.FC<FallingPetalsProps> = ({ enabled }) => {
  if (!enabled) return null;

  const petals = [
    { left: '6%', size: 13, dur: 7.2, delay: 0.2, ruby: false },
    { left: '18%', size: 10, dur: 9.5, delay: 2.1, ruby: true },
    { left: '32%', size: 15, dur: 6.8, delay: 1.0, ruby: false },
    { left: '46%', size: 11, dur: 8.4, delay: 3.5, ruby: true },
    { left: '62%', size: 9, dur: 11.0, delay: 4.2, ruby: false },
    { left: '74%', size: 14, dur: 7.9, delay: 1.8, ruby: true },
    { left: '88%', size: 12, dur: 10.2, delay: 5.0, ruby: false },
    { left: '94%', size: 8, dur: 8.8, delay: 0.8, ruby: true },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {petals.map((p, idx) => (
        <div
          key={idx}
          className={p.ruby ? 'petal-ruby' : 'petal'}
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size * 1.3}px`,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};
