import { useEffect, useState } from 'react';

const CLOCK_REFRESH_MS = 15000;
const CLOCK_FORMAT = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' };

export default function useMenuClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), CLOCK_REFRESH_MS);
    return () => clearInterval(timer);
  }, []);
  return { now, label: new Intl.DateTimeFormat('en-US', CLOCK_FORMAT).format(now).replace(/,/g, '') };
}
