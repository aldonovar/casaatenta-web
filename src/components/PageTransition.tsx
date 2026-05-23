import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const transitionRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // 1. Reset curtain position on mount
      gsap.set(curtainRef.current, { opacity: 1, display: 'flex' });

      // 2. Animate curtain fading away and content entering
      gsap.timeline()
        .to(curtainRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
        })
        .set(curtainRef.current, { display: 'none' })
        .fromTo(transitionRef.current, 
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        );
    });

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <div className="relative w-full">
      {/* Animated slide curtain */}
      <div 
        ref={curtainRef} 
        className="fixed inset-0 z-50 bg-brand-dark flex flex-col items-center justify-center pointer-events-none hidden"
      >
        <div className="w-[1px] h-12 bg-brand-gold/30 mb-4" />
        <span className="text-[9px] font-mono tracking-[0.35em] text-brand-gold uppercase">
          CΛSΛ ΛTENTΛ
        </span>
      </div>

      <div ref={transitionRef} className="w-full">
        {children}
      </div>
    </div>
  );
};
