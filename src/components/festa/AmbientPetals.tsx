import { useMemo } from 'react';

const PETALS = [
  { left: '4%', size: 12, duration: 9, delay: 0, ruby: false },
  { left: '12%', size: 8, duration: 12, delay: 2, ruby: true },
  { left: '22%', size: 15, duration: 8, delay: 1, ruby: false },
  { left: '31%', size: 10, duration: 11, delay: 4, ruby: true },
  { left: '41%', size: 13, duration: 9.5, delay: 0.6, ruby: false },
  { left: '52%', size: 7, duration: 13, delay: 3.4, ruby: true },
  { left: '61%', size: 14, duration: 8.5, delay: 1.5, ruby: false },
  { left: '70%', size: 9, duration: 12, delay: 5, ruby: true },
  { left: '80%', size: 12, duration: 10, delay: 2.5, ruby: false },
  { left: '88%', size: 8, duration: 14, delay: 0.8, ruby: true },
  { left: '95%', size: 11, duration: 9.2, delay: 3, ruby: false },
];

export function AmbientPetals() {
  const petals = useMemo(() => PETALS, []);

  return (
    <div className="petals-layer" aria-hidden="true">
      {petals.map((petal, index) => (
        <span
          key={`${petal.left}-${index}`}
          className={petal.ruby ? 'petal petal-ruby' : 'petal'}
          style={{
            left: petal.left,
            width: `${petal.size}px`,
            height: `${petal.size * 1.35}px`,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
