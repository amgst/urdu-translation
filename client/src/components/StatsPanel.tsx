interface StatsPanelProps {
  wordCount: number;
  duration: string;
  correctionsCount: number;
}

export function StatsPanel({ wordCount, duration, correctionsCount }: StatsPanelProps) {
  // Simple accuracy calculation based on word count and corrections
  const accuracy = wordCount > 0 ? Math.max(85, Math.min(98, 100 - (correctionsCount / wordCount) * 10)) : 0;

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center space-x-2">
        <i className="fas fa-chart-bar text-emerald-500"></i>
        <span>Session Statistics</span>
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-500">{wordCount}</div>
          <div className="text-sm text-gray-400">Words</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-500">{duration}</div>
          <div className="text-sm text-gray-400">Duration</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-500">{accuracy.toFixed(0)}%</div>
          <div className="text-sm text-gray-400">Accuracy</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-500">{correctionsCount}</div>
          <div className="text-sm text-gray-400">AI Corrections</div>
        </div>
      </div>
    </div>
  );
}
