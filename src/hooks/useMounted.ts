'use client';

import { useState, useEffect } from 'react';

export function useMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setIsMounted(true);
  }, []);

  return isMounted;
}
