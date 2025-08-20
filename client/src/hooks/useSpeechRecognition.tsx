import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
  error: string | null;
  isSupported: boolean;
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef('');

  // Check for browser support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ur-PK';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.onerror = (event: any) => {
        setError(getErrorMessage(event.error));
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        let interimText = '';
        let finalText = finalTranscriptRef.current;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const resultText = result[0].transcript;

          if (result.isFinal) {
            // Only add if this text isn't already in our final transcript
            if (!finalText.includes(resultText.trim())) {
              finalText += (finalText ? ' ' : '') + resultText;
            }
          } else {
            interimText += resultText;
          }
        }

        finalTranscriptRef.current = finalText;
        setTranscript(finalText);
        setInterimTranscript(interimText);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setError(null);
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    finalTranscriptRef.current = '';
  }, []);

  const getErrorMessage = (errorType: string): string => {
    switch (errorType) {
      case 'not-allowed':
        return 'Microphone access denied. Please allow microphone permissions and reload the page.';
      case 'no-speech':
        return 'No speech was detected. Please try speaking louder.';
      case 'audio-capture':
        return 'No microphone was found. Please ensure a microphone is connected.';
      case 'network':
        return 'Network error occurred. Please check your internet connection.';
      default:
        return `Speech recognition error: ${errorType}`;
    }
  };

  return {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    clearTranscript,
    error,
    isSupported
  };
}
