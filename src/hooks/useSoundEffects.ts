import { useCallback, useRef, useState, useEffect } from 'react';

const SOUNDS = {
  coin: 'https://assets.mixkit.co/active_storage/sfx/2001/2001-preview.mp3',
  cashRegister: 'https://assets.mixkit.co/active_storage/sfx/2058/2058-preview.mp3',
  ching: 'https://assets.mixkit.co/active_storage/sfx/888/888-preview.mp3',
  correct: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', // Success/correct answer
  incorrect: 'https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3', // Wrong/buzzer
  streak: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3', // Achievement/level up
  quizComplete: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Victory fanfare
};

type SoundType = keyof typeof SOUNDS;

export const useSoundEffects = () => {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('soundEnabled') !== 'false';
    }
    return true;
  });
  
  const audioRefs = useRef<Record<SoundType, HTMLAudioElement | null>>({
    coin: null,
    cashRegister: null,
    ching: null,
    correct: null,
    incorrect: null,
    streak: null,
    quizComplete: null,
  });

  useEffect(() => {
    // Preload sounds
    Object.entries(SOUNDS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.volume = 0.3;
      audio.preload = 'auto';
      audioRefs.current[key as SoundType] = audio;
    });

    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('soundEnabled', enabled.toString());
  }, [enabled]);

  const play = useCallback((sound: SoundType = 'coin') => {
    if (!enabled) return;
    
    const audio = audioRefs.current[sound];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }, [enabled]);

  const toggle = useCallback(() => {
    setEnabled(prev => !prev);
  }, []);

  return { play, enabled, toggle };
};
