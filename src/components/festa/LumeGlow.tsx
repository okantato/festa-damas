import { useEffect, useRef } from 'react';

export function LumeGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const node = glowRef.current;
      if (!node) return;
      node.style.setProperty('--lume-x', `${event.clientX}px`);
      node.style.setProperty('--lume-y', `${event.clientY}px`);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return <div ref={glowRef} className="lume-glow" aria-hidden="true" />;
}
