import React, { useEffect, useRef } from 'react';
import './libraryLetterAtmosphere.css';

type LibraryLettersProps = { alphabet: 'arabic' | 'english' };

/** Decorative-only layer. Does not intercept any catalog or reader interactions. */
export default function LibraryLetterAtmosphere({ alphabet }: LibraryLettersProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    const draw = () => {
      frame = 0;
      layer.style.setProperty('--letters-x', x.toFixed(1) + 'px');
      layer.style.setProperty('--letters-y', y.toFixed(1) + 'px');
    };
    const handlePointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      x = ((event.clientX / window.innerWidth) - .5) * 22;
      y = ((event.clientY / window.innerHeight) - .5) * 19;
      if (!frame) frame = requestAnimationFrame(draw);
    };
    window.addEventListener('pointermove', handlePointer, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointer);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const letters = alphabet === 'arabic'
    ? ['أ', 'ب', 'ج', 'د', 'ر', 'س', 'ع', 'ف', 'ق', 'ك', 'م', 'ن', 'و', 'ي']
    : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'L', 'M', 'R', 'S', 'W', 'Z'];

  return <div ref={layerRef} aria-hidden="true" className="efips-library-letters">
    {letters.map((letter, index) => <span key={index} className={'efips-library-letter efips-library-letter-'+(index+1)}>
      <span>{letter}</span>
    </span>)}
  </div>;
}
