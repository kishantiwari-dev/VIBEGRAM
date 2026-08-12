import React, { useEffect, useState } from 'react';

export function LockAnimation({ status }) {
  const [errorPhase, setErrorPhase] = useState('none');

  useEffect(() => {
    if (status === 'error') {
      setErrorPhase('key-enter');

      const t1 = setTimeout(() => setErrorPhase('key-turn'), 350);
      const t2 = setTimeout(() => setErrorPhase('key-fall'), 750);
      const t3 = setTimeout(() => setErrorPhase('bin-swallow'), 1150);
      const t4 = setTimeout(() => setErrorPhase('none'), 1800);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    } else {
      setErrorPhase('none');
    }
  }, [status]);

  return (
    <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center select-none pointer-events-none my-3">
      <svg
        viewBox="0 0 160 160"
        className="w-full h-full drop-shadow-lg"
        style={{ overflow: 'visible' }}
      >
        {/* SHACKLE (Hairline 2px Stroke) */}
        <path
          d="M 54,78 V 46 C 54,32 65,22 80,22 C 95,22 106,32 106,46 V 78"
          fill="none"
          stroke={status === 'success' ? '#9f1239' : '#d4d4d8'}
          strokeWidth="2.2"
          strokeLinecap="round"
          style={{ transformOrigin: '106px 78px' }}
          className={status === 'success' ? 'animate-shackle-open' : ''}
        />

        {/* LOCK BODY */}
        <rect
          x="40"
          y="72"
          width="80"
          height="68"
          rx="10"
          fill="#18181b"
          stroke={
            status === 'success'
              ? '#9f1239'
              : status === 'error'
              ? '#f43f5e'
              : '#3f3f46'
          }
          strokeWidth="1.8"
        />

        {/* KEYHOLE (Minimal circle + slot) */}
        <circle
          cx="80"
          cy="104"
          r="7"
          fill={status === 'success' ? '#9f1239' : '#27272a'}
          stroke={status === 'success' ? '#fda4af' : '#71717a'}
          strokeWidth="1.2"
        />
        <path
          d="M 77,106 L 83,106 L 84,118 L 76,118 Z"
          fill={status === 'success' ? '#9f1239' : '#27272a'}
        />

        {/* SUCCESS CONFIRMATION DOT */}
        {status === 'success' && (
          <circle cx="80" cy="104" r="2.5" fill="#ffffff" />
        )}

        {/* MINIMAL PHYSICAL KEY (Enters & Tumbles on Error) */}
        {errorPhase !== 'none' && (
          <g
            style={{ transformOrigin: '80px 104px' }}
            className={
              errorPhase === 'key-enter'
                ? 'animate-key-entry'
                : errorPhase === 'key-turn'
                ? 'animate-key-fail'
                : 'animate-key-fall'
            }
          >
            <circle cx="102" cy="104" r="6" fill="none" stroke="#f4f4f5" strokeWidth="1.8" />
            <path
              d="M 96 104 L 78 104 M 82 104 V 109 M 86 104 V 108"
              stroke="#f4f4f5"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* MINIMAL TRASH BIN / RECEPTACLE (Appears on Error) */}
        {(errorPhase === 'key-fall' || errorPhase === 'bin-swallow') && (
          <g className="transition-opacity duration-300">
            {/* Bin Body */}
            <rect x="66" y="142" width="28" height="24" rx="4" fill="#18181b" stroke="#71717a" strokeWidth="1.4" />
            <line x1="74" y1="147" x2="74" y2="160" stroke="#3f3f46" strokeWidth="1.2" />
            <line x1="80" y1="147" x2="80" y2="160" stroke="#3f3f46" strokeWidth="1.2" />
            <line x1="86" y1="147" x2="86" y2="160" stroke="#3f3f46" strokeWidth="1.2" />

            {/* Bin Lid (Opens during key fall, snaps closed when key enters) */}
            <line
              x1="62"
              y1="142"
              x2="98"
              y2="142"
              stroke="#a1a1aa"
              strokeWidth="1.8"
              strokeLinecap="round"
              style={{ transformOrigin: '97px 142px' }}
              className={errorPhase === 'bin-swallow' ? 'animate-lid-snap' : ''}
              transform={errorPhase === 'key-fall' ? 'rotate(-40)' : 'rotate(0)'}
            />
          </g>
        )}
      </svg>
    </div>
  );
}
