'use client';

import { useEffect, useRef, useState } from 'react';

export function useMounted() {
  const [isMounted, setIsMounted] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      // eslint-disable-next-line -- useMounted is a standard SSR hydration guard; setState in effect is intentional here.
      setIsMounted(true);
    }
  }, []);

  return isMounted;
}
