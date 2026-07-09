import { useEffect, useMemo, useState } from 'react';

const CLOCK_REFRESH_MS = 20000;
const CLOCK_LOCALE = 'en-US';
const CLOCK_FORMAT = { weekday: 'short', hour: '2-digit', minute: '2-digit' };

export default function useMenuClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), CLOCK_REFRESH_MS);
    return () => clearInterval(timer);
  }, []);

  return useMemo(
    () => new Intl.DateTimeFormat(CLOCK_LOCALE, CLOCK_FORMAT).format(now),
    [now]
  );
}
