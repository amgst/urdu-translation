interface MobileControlsProps {
  isListening: boolean;
  onToggleRecording: () => void;
  onExportTranscript: () => void;
  hasTranscript: boolean;
}

export function MobileControls({ 
  isListening, 
  onToggleRecording, 
  onExportTranscript, 
  hasTranscript 
}: MobileControlsProps) {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center space-x-4">
        
        {/* Main Microphone Button */}
        <button 
          onClick={onToggleRecording}
          className={`w-16 h-16 text-white rounded-full shadow-2xl transition-all duration-200 flex items-center justify-center relative group ${
            isListening 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-emerald-600 hover:bg-emerald-700'
          }`}>
          
          {/* Icon */}
          <i className={`text-2xl ${
            isListening ? 'fas fa-stop' : 'fas fa-microphone'
          }`}></i>
          
          {/* Pulse Animation Ring */}
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-25"></div>
          )}
          
          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            <span>
              {isListening ? 'Click to stop listening' : 'Click to start listening'}
            </span>
          </div>
        </button>

        {/* Secondary Action Button */}
        <button 
          onClick={onExportTranscript}
          disabled={!hasTranscript}
          className={`w-12 h-12 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center ${
            hasTranscript 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}>
          <i className="fas fa-download"></i>
        </button>
      </div>
    </div>
  );
}
