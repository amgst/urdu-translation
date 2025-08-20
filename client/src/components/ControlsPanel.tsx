interface ControlsPanelProps {
  onClearTranscript: () => void;
  geminiEnabled: boolean;
  onGeminiToggle: (enabled: boolean) => void;
  geminiApiKeyAvailable: boolean;
}

export function ControlsPanel({ 
  onClearTranscript, 
  geminiEnabled, 
  onGeminiToggle, 
  geminiApiKeyAvailable 
}: ControlsPanelProps) {
  return (
    <div className="mb-6">
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Left Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={onClearTranscript}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
              <i className="fas fa-trash-alt"></i>
              <span>Clear Transcript</span>
            </button>
            
            <div className="text-sm text-gray-400 bg-gray-700 px-3 py-2 rounded-lg">
              Language: Urdu (ur-PK)
            </div>
          </div>

          {/* Right Controls - Gemini Toggle */}
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={geminiEnabled}
                onChange={(e) => onGeminiToggle(e.target.checked)}
                disabled={!geminiApiKeyAvailable}
              />
              <div className="relative">
                <div className={`w-10 h-6 rounded-full shadow-inner transition-colors ${
                  geminiEnabled ? 'bg-emerald-600' : 'bg-gray-600'
                } ${!geminiApiKeyAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <div className={`absolute w-4 h-4 bg-white rounded-full shadow top-1 transition-transform duration-200 ease-in-out transform ${
                    geminiEnabled ? 'translate-x-5' : 'translate-x-1'
                  }`}></div>
                </div>
              </div>
              <span className={`text-sm ${geminiApiKeyAvailable ? 'text-gray-300' : 'text-gray-500'}`}>
                Gemini AI Correction
                {!geminiApiKeyAvailable && ' (API key required)'}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
