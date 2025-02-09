import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react';
import SupabaseSessionProvider from '../components/SupabaseSessionProvider';

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  // Generate random positions for the lights
  const lights = [...Array(90)].map((_, i) => ({
    id: i,
    position: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 6 + Math.random() * 4,
    direction: i % 3,
    startPosition: Math.random() * 100 // New property for varied starting positions
  }));

  return (
    <SessionProvider session={session}>
      <SupabaseSessionProvider>
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
      </SupabaseSessionProvider>
    </SessionProvider>
  );
} 