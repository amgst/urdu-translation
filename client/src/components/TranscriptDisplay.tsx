import { useEffect, useRef } from "react";

interface TranscriptDisplayProps {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
}

export function TranscriptDisplay({ transcript, interimTranscript, isListening }: TranscriptDisplayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript, interimTranscript]);

  const hasContent = transcript.trim() || interimTranscript.trim();

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 h-[80vh] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-gray-100 flex items-center space-x-2">
          <i className="fas fa-file-alt text-emerald-500"></i>
          <span>Live Transcript</span>
        </h3>
        <div className="flex items-center space-x-2">
          {isListening && (
            <>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Listening</span>
            </>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto" ref={scrollRef}>
        {hasContent ? (
          <div className="p-4 space-y-3 font-urdu text-lg leading-relaxed">
            {transcript && (
              <p className="text-gray-100 text-right" dir="rtl">
                {transcript}
              </p>
            )}
            {interimTranscript && (
              <p className="text-gray-400 text-base text-right" dir="rtl">
                <em>[Interim result]</em> {interimTranscript}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <i className="fas fa-microphone-slash text-4xl mb-3 opacity-50"></i>
            <p className="text-center">Start speaking to see your transcript here</p>
            <p className="text-sm text-center mt-1">Press the microphone button to begin</p>
          </div>
        )}
      </div>
    </div>
  );
}
