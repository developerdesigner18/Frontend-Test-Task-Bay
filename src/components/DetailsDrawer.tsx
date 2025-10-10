import { useEffect, useRef } from 'react';
import { X, Building2, Calendar, DollarSign, FileText, CheckCircle, Send, Award, XCircle } from 'lucide-react';
import { Application } from '../types';
import { formatDate, getDaysUntil, formatCurrency } from '../utils/dateHelpers';

interface DetailsDrawerProps {
  application: Application | null;
  onClose: () => void;
  onMarkSubmitted: (app: Application) => void;
}

const stages = [
  { status: 'Draft', icon: FileText, color: 'slate' },
  { status: 'Ready', icon: CheckCircle, color: 'blue' },
  { status: 'Submitted', icon: Send, color: 'purple' },
  { status: 'Awarded', icon: Award, color: 'green' },
  { status: 'Lost', icon: XCircle, color: 'red' },
];

export function DetailsDrawer({ application, onClose, onMarkSubmitted }: DetailsDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!application) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const focusableElements = drawerRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0] as HTMLElement;
    const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);
    };
  }, [application, onClose]);

  if (!application) return null;

  const daysUntil = getDaysUntil(application.dueDate);
  const formattedDate = formatDate(application.dueDate);

  const currentStageIndex = stages.findIndex((stage) => stage.status === application.status);
  const isAwarded = application.status === 'Awarded';
  const isLost = application.status === 'Lost';
  const canMarkSubmitted = application.status === 'Draft' || application.status === 'Ready';

  const statusColors = {
    Draft: 'bg-slate-100 text-slate-700',
    Ready: 'bg-blue-100 text-blue-700',
    Submitted: 'bg-purple-100 text-purple-700',
    Awarded: 'bg-green-100 text-green-700',
    Lost: 'bg-red-100 text-red-700',
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={drawerRef}
        className="fixed right-0 top-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto animate-slide-in-right"
        role="dialog"
        aria-labelledby="drawer-title"
        aria-modal="true"
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 id="drawer-title" className="text-xl font-semibold text-slate-900">
            Opportunity Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">{application.title}</h3>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-600">
                <Building2 className="w-4 h-4" />
                <span className="text-sm">{application.agency}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  Due in {daysUntil} days ({formattedDate})
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-semibold">{formatCurrency(application.ceiling)}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded font-medium">
                {application.naics}
              </span>
              <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded font-medium">
                {application.vehicle}
              </span>
              <span className={`px-2 py-1 text-xs rounded font-medium ${statusColors[application.status]}`}>
                {application.status}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {application.setAside.map((setAside) => (
                <span
                  key={setAside}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium"
                >
                  {setAside}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h4 className="text-sm font-semibold text-slate-900 mb-4">Stage Timeline</h4>
            <div className="space-y-4">
              {stages.slice(0, 3).map((stage, index) => {
                const Icon = stage.icon;
                const isActive = index <= currentStageIndex;
                const isCurrent = index === currentStageIndex && !isAwarded && !isLost;

                return (
                  <div key={stage.status} className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isActive
                          ? `bg-${stage.color}-100`
                          : 'bg-slate-100'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isActive
                            ? `text-${stage.color}-600`
                            : 'text-slate-400'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${isCurrent ? 'text-slate-900' : 'text-slate-600'}`}>
                        {stage.status}
                      </div>
                      {isCurrent && (
                        <div className="text-xs text-slate-500">Current stage</div>
                      )}
                    </div>
                    {isActive && (
                      <CheckCircle className={`w-5 h-5 text-${stage.color}-600`} />
                    )}
                  </div>
                );
              })}

              {(isAwarded || isLost) && (
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isAwarded ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    {isAwarded ? (
                      <Award className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">
                      {application.status}
                    </div>
                    <div className="text-xs text-slate-500">Final status</div>
                  </div>
                  <CheckCircle className={`w-5 h-5 ${isAwarded ? 'text-green-600' : 'text-red-600'}`} />
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Progress</h4>
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Completion</span>
              <span className="font-medium">{application.percentComplete}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${application.percentComplete}%` }}
              />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Fit Score</h4>
            <div className="flex items-center gap-3">
              <div
                className={`text-4xl font-bold ${
                  application.fitScore >= 80
                    ? 'text-green-600'
                    : application.fitScore >= 70
                    ? 'text-amber-600'
                    : 'text-red-600'
                }`}
              >
                {application.fitScore}
              </div>
              <div className="text-slate-600 text-sm">out of 100</div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {application.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-md"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {canMarkSubmitted && (
            <div className="border-t border-slate-200 pt-6">
              <button
                onClick={() => {
                  onMarkSubmitted(application);
                  onClose();
                }}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
              >
                Mark as Submitted
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
