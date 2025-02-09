import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import HealthCheck from '../components/HealthCheck';
import { useEffect, useState } from 'react';

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [mounted, setMounted] = useState(false);

  // Handle hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate random positions for the lights
  const lights = [...Array(90)].map((_, i) => ({
    id: i,
    position: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 6 + Math.random() * 4,
    direction: i % 3,
    startPosition: Math.random() * 100
  }));

  if (!mounted) {
    return null; // Prevent hydration issues
  }

  return (
    <SessionProvider session={session} refetchInterval={0}>
      <HealthCheck />
      <div className="circuit-background">
        <div className="circuit-grid" />
        {lights.map((light) => {
          // Calculate position based on direction
          const style = {
            animationDelay: `${light.delay}s`,
            '--duration': `${light.duration}s`
          };

          if (light.direction === 1) { // Vertical movement
            style.left = `${light.startPosition}%`;
            style.top = '-4px';
          } else { // Horizontal movement (both directions)
            style.top = `${light.startPosition}%`;
          }

          return (
            <div
              key={light.id}
              className="circuit-light"
              data-direction={light.direction}
              style={style}
            />
          );
        })}
      </div>
      <Component {...pageProps} />
      <Toaster />
    </SessionProvider>
  );
} 