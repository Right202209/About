import { createContext, useContext } from 'react';
import WindowControls from '../WindowControls';

/* Apps with a unified toolbar (Safari, Music, Notes…) draw the traffic lights themselves. */
export const WindowChromeContext = createContext(null);

export function TrafficLights() {
  const chrome = useContext(WindowChromeContext);
  if (!chrome) return null;
  return <WindowControls {...chrome} />;
}
