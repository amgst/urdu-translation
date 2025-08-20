import { useState, useCallback } from 'react';

interface GeminiCorrectionHook {
  correctedText: string;
  isProcessing: boolean;
  correctText: (text: string) => Promise<void>;
  error: string | null;
}

export function useGeminiCorrection(): GeminiCorrectionHook {
  const [correctedText, setCorrectedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const correctText = useCallback(async (text: string) => {
    if (!text.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/correct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCorrectedText(data.correctedText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to correct text');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    correctedText,
    isProcessing,
    correctText,
    error
  };
}
