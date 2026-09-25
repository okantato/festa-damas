const PETALS = [
  { left: '8%', size: 9, duration: 6.5, delay: 0.2 },
  { left: '19%', size: 12, duration: 8.2, delay: 1.4 },
  { left: '33%', size: 8, duration: 7.1, delay: 0.8 },
  { left: '47%', size: 11, duration: 9.2, delay: 2.2 },
  { left: '61%', size: 7, duration: 6.8, delay: 1.1 },
  { left: '74%', size: 10, duration: 8.8, delay: 2.8 },
  { left: '88%', size: 13, duration: 7.6, delay: 0.4 },
];

export function PetalsFall() {
  return (
    <div className="rsvp-petals" aria-hidden="true">
      {PETALS.map((petal, index) => (
        <span
          key={`${petal.left}-${index}`}
          className="petal"
          style={{
            left: petal.left,
            width: `${petal.size}px`,
            height: `${petal.size * 1.3}px`,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
