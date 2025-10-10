import { Building2, Calendar, DollarSign } from 'lucide-react';
import { Application } from '../types';
import { formatDate, getDaysUntil, formatCurrency } from '../utils/dateHelpers';

interface ResultCardProps {
  application: Application;
  onClick: () => void;
  highlightKeywords: string[];
}

export function ResultCard({ application, onClick, highlightKeywords }: ResultCardProps) {
  const daysUntil = getDaysUntil(application.dueDate);
  const formattedDate = formatDate(application.dueDate);

  const statusColors = {
    Draft: 'bg-slate-100 text-slate-700',
    Ready: 'bg-blue-100 text-blue-700',
    Submitted: 'bg-purple-100 text-purple-700',
    Awarded: 'bg-green-100 text-green-700',
    Lost: 'bg-red-100 text-red-700',
  };

  const fitScoreColor =
    application.fitScore >= 80
      ? 'text-green-600'
      : application.fitScore >= 70
      ? 'text-amber-600'
      : 'text-red-600';

  const highlightText = (text: string) => {
    if (highlightKeywords.length === 0) return text;

    let result = text;
    highlightKeywords.forEach((keyword) => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      result = result.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
    });
    return result;
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <div className="space-y-3">
        <h3
          className="text-lg font-semibold text-slate-900 leading-snug"
          dangerouslySetInnerHTML={{ __html: highlightText(application.title) }}
        />

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Building2 className="w-4 h-4" />
          <span>{application.agency}</span>
          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">
            {application.naics}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {application.setAside.map((setAside) => (
            <span
              key={setAside}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium"
            >
              {setAside}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>
              Due in {daysUntil} days ({formattedDate})
            </span>
          </div>
          <span className={`px-2 py-1 text-xs rounded-md font-medium ${statusColors[application.status]}`}>
            {application.status}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Progress</span>
            <span className="font-medium">{application.percentComplete}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${application.percentComplete}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-semibold text-slate-900">
              {formatCurrency(application.ceiling)}
            </span>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-600">Fit Score</div>
            <div className={`text-lg font-bold ${fitScoreColor}`}>
              {application.fitScore}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
