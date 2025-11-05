'use client';
import { useEffect, useRef, useState } from 'react';

const useStickyCta = (rootMargin = '0px 0px -20% 0px') => {
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { rootMargin, threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ctaRef, showSticky };
};

export default useStickyCta;
