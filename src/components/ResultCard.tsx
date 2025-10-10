import { Application } from '../types';
import { formatDueDate, formatCurrency, getDaysUntil } from '../utils/dateHelpers';
import { Building2, Calendar, TrendingUp } from 'lucide-react';

interface ResultCardProps {
  application: Application;
  onClick: () => void;
  highlightKeywords: string[];
}

export function ResultCard({ application, onClick, highlightKeywords }: ResultCardProps) {
  const statusColors = {
    Draft: 'bg-slate-100 text-slate-700 border-slate-300',
    Ready: 'bg-blue-100 text-blue-700 border-blue-300',
    Submitted: 'bg-purple-100 text-purple-700 border-purple-300',
    Awarded: 'bg-green-100 text-green-700 border-green-300',
    Lost: 'bg-red-100 text-red-700 border-red-300',
  };

  const setAsideColors: Record<string, string> = {
    '8(a)': 'bg-amber-100 text-amber-700 border-amber-300',
    WOSB: 'bg-pink-100 text-pink-700 border-pink-300',
    SB: 'bg-blue-100 text-blue-700 border-blue-300',
    SDVOSB: 'bg-green-100 text-green-700 border-green-300',
    VOSB: 'bg-teal-100 text-teal-700 border-teal-300',
    HUBZone: 'bg-purple-100 text-purple-700 border-purple-300',
  };

  const getFitScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  const highlightText = (text: string) => {
    if (highlightKeywords.length === 0) return text;

    let highlightedText = text;
    highlightKeywords.forEach((keyword) => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
    });

    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  const daysUntil = getDaysUntil(application.dueDate);
  const isUrgent = daysUntil >= 0 && daysUntil <= 7;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View details for ${application.title}`}
    >
      <h3 className="text-lg font-semibold text-slate-900 mb-3 leading-tight">
        {highlightText(application.title)}
      </h3>

      <div className="flex items-center gap-3 mb-3 text-sm text-slate-600">
        <div className="flex items-center gap-1">
          <Building2 className="w-4 h-4" />
          <span>{application.agency}</span>
        </div>
        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded border border-slate-300">
          {application.naics}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {application.setAside.map((setAside) => (
          <span
            key={setAside}
            className={`px-2 py-1 text-xs rounded border ${setAsideColors[setAside] || 'bg-slate-100 text-slate-700 border-slate-300'}`}
          >
            {setAside}
          </span>
        ))}
      </div>

      <div className={`flex items-center gap-1 mb-3 text-sm ${isUrgent ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
        <Calendar className="w-4 h-4" />
        <span>{formatDueDate(application.dueDate)}</span>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
          <span>Progress</span>
          <span className="font-medium">{application.percentComplete}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${application.percentComplete}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded border ${statusColors[application.status]}`}
          >
            {application.status}
          </span>
          <span className="text-sm font-semibold text-slate-900">
            {formatCurrency(application.ceiling)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4 text-slate-500" />
          <span className={`text-sm font-bold ${getFitScoreColor(application.fitScore)}`}>
            {application.fitScore}
          </span>
          <span className="text-xs text-slate-500">/100</span>
        </div>
      </div>
    </div>
  );
}
