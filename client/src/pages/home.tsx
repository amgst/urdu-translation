import { useState, useEffect } from "react";
import { TranscriptDisplay } from "@/components/TranscriptDisplay";
import { ControlsPanel } from "@/components/ControlsPanel";
import { GeminiPanel } from "@/components/GeminiPanel";
import { StatsPanel } from "@/components/StatsPanel";
import { MobileControls } from "@/components/MobileControls";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useGeminiCorrection } from "@/hooks/useGeminiCorrection";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [geminiEnabled, setGeminiEnabled] = useState(false);
  const [geminiApiKeyAvailable, setGeminiApiKeyAvailable] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const { toast } = useToast();

  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    clearTranscript,
    error: speechError,
    isSupported
  } = useSpeechRecognition();

  const {
    correctedText,
    isProcessing,
    correctText,
    error: geminiError
  } = useGeminiCorrection();

  // Check if Gemini API key is available
  useEffect(() => {
    fetch('/api/gemini/status')
      .then(res => res.json())
      .then(data => setGeminiApiKeyAvailable(data.available))
      .catch(() => setGeminiApiKeyAvailable(false));
  }, []);

  // Show errors as toasts
  useEffect(() => {
    if (speechError) {
      toast({
        variant: "destructive",
        title: "Speech Recognition Error",
        description: speechError,
      });
    }
  }, [speechError, toast]);

  useEffect(() => {
    if (geminiError) {
      toast({
        variant: "destructive",
        title: "AI Correction Error",
        description: geminiError,
      });
    }
  }, [geminiError, toast]);

  // Auto-send to Gemini when user stops speaking
  useEffect(() => {
    if (!isListening && transcript && geminiEnabled && geminiApiKeyAvailable) {
      const timer = setTimeout(() => {
        correctText(transcript);
      }, 1500); // Wait 1.5 seconds after stopping

      return () => clearTimeout(timer);
    }
  }, [isListening, transcript, geminiEnabled, geminiApiKeyAvailable, correctText]);

  const handleToggleRecording = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleClearTranscript = () => {
    if (transcript.trim()) {
      if (confirm("Are you sure you want to clear the transcript?")) {
        clearTranscript();
      }
    }
  };

  const handleExportTranscript = () => {
    if (transcript.trim()) {
      const element = document.createElement('a');
      const file = new Blob([transcript], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `urdu-transcript-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  // Calculate statistics
  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;
  const durationMinutes = Math.floor((Date.now() - sessionStartTime) / 60000);
  const durationSeconds = Math.floor(((Date.now() - sessionStartTime) % 60000) / 1000);
  const durationFormatted = `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;

  if (!isSupported) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Browser Not Supported</h1>
          <p className="text-gray-400">
            Your browser doesn't support the Web Speech API. Please use a modern browser like Chrome, Firefox, or Safari.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      {/* Main Content Area */}
      <main className="flex-1 w-full px-4 py-6 pb-32">
        
        {/* Simple Controls */}
        <div className="mb-6 flex justify-between items-center">
          {/* Clear Button */}
          <button 
            onClick={handleClearTranscript}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
            <i className="fas fa-trash-alt"></i>
            <span>Clear</span>
          </button>

          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${isListening ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`}></div>
            <span className="text-sm text-gray-400">
              {isListening ? 'Listening' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Transcript Display Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <TranscriptDisplay
              transcript={transcript}
              interimTranscript={interimTranscript}
              isListening={isListening}
            />
          </div>

          {geminiEnabled && geminiApiKeyAvailable && (
            <div className="lg:col-span-1">
              <GeminiPanel
                correctedText={correctedText}
                isProcessing={isProcessing}
              />
            </div>
          )}
        </div>

      </main>

      {/* Fixed Bottom Controls for Mobile */}
      <MobileControls
        isListening={isListening}
        onToggleRecording={handleToggleRecording}
        onExportTranscript={handleExportTranscript}
        hasTranscript={!!transcript.trim()}
      />
    </div>
  );
}
