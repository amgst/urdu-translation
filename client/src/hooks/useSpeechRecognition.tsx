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
  const shouldRestartRef = useRef(false);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastResultTimestampRef = useRef(0);
  const processedResultsRef = useRef(new Set<string>());

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
        setInterimTranscript('');
        // Auto-restart if we should be listening
        if (shouldRestartRef.current && !error) {
          restartTimeoutRef.current = setTimeout(() => {
            try {
              recognition.start();
            } catch (err) {
              console.log('Recognition restart failed:', err);
              setIsListening(false);
              shouldRestartRef.current = false;
            }
          }, 100); // Short delay before restarting
        } else {
          setIsListening(false);
          shouldRestartRef.current = false;
        }
      };

      recognition.onerror = (event: any) => {
        setError(getErrorMessage(event.error));
        setIsListening(false);
        shouldRestartRef.current = false;
        
        // Clear any pending restart
        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = null;
        }
      };

      recognition.onresult = (event: any) => {
        let interimText = '';
        let finalText = '';

        // Build the complete text from ALL results (this is how Web Speech API works)
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          const resultText = result[0].transcript;

          if (result.isFinal) {
            finalText += resultText;
          } else {
            interimText += resultText;
          }
        }

        // Update our state with the complete text from this session
        finalTranscriptRef.current = finalText;
        setTranscript(finalText);
        setInterimTranscript(interimText);
      };
    }

    return () => {
      shouldRestartRef.current = false;
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setError(null);
      shouldRestartRef.current = true;
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.log('Failed to start recognition:', err);
        setError('Failed to start speech recognition');
        shouldRestartRef.current = false;
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    shouldRestartRef.current = false;
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
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
