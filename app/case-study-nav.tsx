'use client';
import { useEffect, useRef, useState } from 'react';

export type Stage = { id: string; label: string };

export default function CaseStudyNav({ stages }: { stages: Stage[] }) {
  const [active, setActive] = useState(0);
  const [fill, setFill] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const els = stages
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const mid = window.innerHeight * 0.4;
        let idx = 0;
        els.forEach((el, i) => {
          if (el.getBoundingClientRect().top <= mid) idx = i;
        });
        setActive(idx);
        const firstTop = els[0].getBoundingClientRect().top + window.scrollY;
        const lastTop =
          els[els.length - 1].getBoundingClientRect().top + window.scrollY;
        const total = lastTop - firstTop;
        const passed = window.scrollY + mid - firstTop;
        const pct = total > 0 ? Math.max(0, Math.min(1, passed / total)) : 0;
        setFill(pct);
        ticking.current = false;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [stages]);

  return (
    <nav className="stage-nav" aria-label="Case study progress">
      <div className="stage-track">
        <i style={{ width: `${fill * 100}%` }} />
      </div>
      <ol>
        {stages.map((s, i) => (
          <li
            key={s.id}
            className={i === active ? 'is-active' : i < active ? 'is-done' : ''}
          >
            <a href={`#${s.id}`}>
              <b>{String(i + 1).padStart(2, '0')}</b>
              <span>{s.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
