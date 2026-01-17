import { createContext, useContext, ReactNode } from 'react';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface SoundContextType {
  play: (sound?: 'coin' | 'cashRegister' | 'ching' | 'correct' | 'incorrect' | 'streak' | 'quizComplete') => void;
  enabled: boolean;
  toggle: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const soundEffects = useSoundEffects();
  
  return (
    <SoundContext.Provider value={soundEffects}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
