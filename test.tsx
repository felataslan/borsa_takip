import { useEffect, useState } from 'react';

export function Test() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const init = () => setMounted(true);
    init();
  }, []);

  return null;
}
