interface GeminiPanelProps {
  correctedText: string;
  isProcessing: boolean;
}

export function GeminiPanel({ correctedText, isProcessing }: GeminiPanelProps) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 h-96 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-gray-100 flex items-center space-x-2">
          <i className="fas fa-robot text-blue-500"></i>
          <span>AI Correction</span>
        </h3>
        {isProcessing && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
            <span className="text-xs text-gray-400">Processing...</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {correctedText ? (
          <div className="space-y-3 font-urdu text-lg leading-relaxed">
            <div className="bg-gray-700 rounded-lg p-3 border-l-4 border-blue-500">
              <p className="text-gray-100 text-right" dir="rtl">
                {correctedText}
              </p>
              <p className="text-xs text-blue-400 mt-2">Grammar corrected</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <i className="fas fa-brain text-4xl mb-3 opacity-50"></i>
            <p className="text-center">AI corrections will appear here</p>
            <p className="text-sm text-center mt-1">Enable Gemini AI to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
