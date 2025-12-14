import { useEffect, useState } from 'react';

interface MoneyParticle {
  id: number;
  emoji: string;
  left: number;
  delay: number;
  duration: number;
}

interface MoneyRainProps {
  active?: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
}

const MONEY_EMOJIS = ['💵', '💰', '💎', '🪙', '💸'];

const MoneyRain = ({ active = true, intensity = 'medium' }: MoneyRainProps) => {
  const [particles, setParticles] = useState<MoneyParticle[]>([]);

  const particleCount = {
    light: 10,
    medium: 20,
    heavy: 35,
  }[intensity];

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const newParticles: MoneyParticle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      emoji: MONEY_EMOJIS[Math.floor(Math.random() * MONEY_EMOJIS.length)],
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
    }));
    
    setParticles(newParticles);
  }, [active, particleCount]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute text-2xl md:text-3xl animate-money-fall opacity-70"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        >
          {particle.emoji}
        </div>
      ))}
    </div>
  );
};

export default MoneyRain;
