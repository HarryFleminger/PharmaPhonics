import { useState, useEffect, useCallback, useRef } from 'react';
import { SpeechSpeed } from '../types/medication';

export interface UseSpeechSynthesisReturn {
  isSupported: boolean;
  ukVoices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoiceByName: (name: string) => void;
  speakingId: string | null;
  speed: SpeechSpeed;
  toggleSpeed: () => void;
  speak: (id: string, text: string) => void;
  stop: () => void;
}

/**
 * Normalizes a BCP-47 language tag (e.g. "en_GB" -> "en-gb") and checks
 * whether it strictly represents British English (en-GB).
 */
function isBritishEnglishVoice(voice: SpeechSynthesisVoice): boolean {
  const normalizedLang = voice.lang.replace('_', '-').toLowerCase();
  return (
    normalizedLang === 'en-gb' ||
    normalizedLang.startsWith('en-gb-') ||
    voice.name.toLowerCase().includes('uk english') ||
    voice.name.toLowerCase().includes('british') ||
    voice.name.toLowerCase().includes('great britain')
  );
}

/**
 * Ranks en-GB voices so natural/premium British voices (Daniel, Sonia, Libby, Google UK, Martha)
 * are selected by default when multiple en-GB voices exist on the device.
 */
function rankUkVoice(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase();
  let score = 0;
  if (voice.localService) score += 2;
  if (name.includes('natural') || name.includes('enhanced') || name.includes('premium')) score += 5;
  if (name.includes('daniel') || name.includes('martha') || name.includes('arthur')) score += 4;
  if (name.includes('google uk english')) score += 4;
  if (name.includes('sonia') || name.includes('libby') || name.includes('ryan')) score += 4;
  if (voice.default) score += 1;
  return score;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [ukVoices, setUkVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [speed, setSpeed] = useState<SpeechSpeed>(1.0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const loadVoices = useCallback(() => {
    if (!isSupported) return;

    const allVoices = window.speechSynthesis.getVoices();
    if (!allVoices.length) return;

    // Strictly filter to en-GB (British English) voices for accurate UK clinical pronunciation
    const filteredUkVoices = allVoices
      .filter(isBritishEnglishVoice)
      .sort((a, b) => rankUkVoice(b) - rankUkVoice(a));

    setUkVoices(filteredUkVoices);

    setSelectedVoice((prev) => {
      if (prev && filteredUkVoices.some((v) => v.name === prev.name)) {
        return prev;
      }
      return filteredUkVoices[0] ?? null;
    });
  }, [isSupported]);

  useEffect(() => {
    if (!isSupported) return;

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      window.speechSynthesis.cancel();
    };
  }, [isSupported, loadVoices]);

  const setSelectedVoiceByName = useCallback(
    (name: string) => {
      const found = ukVoices.find((v) => v.name === name) ?? null;
      if (found) {
        setSelectedVoice(found);
      }
    },
    [ukVoices]
  );

  const toggleSpeed = useCallback(() => {
    setSpeed((prev) => (prev === 1.0 ? 0.75 : 1.0));
  }, []);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setSpeakingId(null);
  }, [isSupported]);

  const speak = useCallback(
    (id: string, text: string) => {
      if (!isSupported) return;

      // If clicking the currently playing medication, stop playback
      if (speakingId === id && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      // Strictly enforce British English locale
      utterance.lang = 'en-GB';
      utterance.rate = speed;
      utterance.pitch = 1.0;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        setSpeakingId(id);
      };

      utterance.onend = () => {
        setSpeakingId((current) => (current === id ? null : current));
      };

      utterance.onerror = () => {
        setSpeakingId((current) => (current === id ? null : current));
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, selectedVoice, speakingId, speed]
  );

  return {
    isSupported,
    ukVoices,
    selectedVoice,
    setSelectedVoiceByName,
    speakingId,
    speed,
    toggleSpeed,
    speak,
    stop,
  };
}
