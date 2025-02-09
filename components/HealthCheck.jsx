import { useEffect, useState } from 'react';

export default function HealthCheck() {
  const [health, setHealth] = useState('checking');

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(() => setHealth('healthy'))
      .catch(() => setHealth('unhealthy'));
  }, []);

  return null; // This component doesn't render anything
} 