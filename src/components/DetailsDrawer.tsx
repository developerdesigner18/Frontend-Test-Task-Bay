import { useEffect, useRef } from 'react';
import { X, Building2, Calendar, TrendingUp, DollarSign, Tag } from 'lucide-react';
import { Application } from '../types';
import { formatDueDate, formatCurrency } from '../utils/dateHelpers';

interface DetailsDrawerProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkSubmitted: (id: string) => void;
}

export function DetailsDrawer({ application, isOpen, onClose, onMarkSubmitted }: DetailsDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && drawerRef.current) {
      const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTab = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
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
        }
      };

      document.addEventListener('keydown', handleTab);
      firstElement?.focus();

      return () => document.removeEventListener('keydown', handleTab);
    }
  }, [isOpen]);

  if (!isOpen || !application) return null;

  const statusColors = {
    Draft: 'bg-slate-100 text-slate-700',
    Ready: 'bg-blue-100 text-blue-700',
    Submitted: 'bg-purple-100 text-purple-700',
    Awarded: 'bg-green-100 text-green-700',
    Lost: 'bg-red-100 text-red-700',
  };

  const stages = [
    { name: 'Draft', status: application.status, order: 1 },
    { name: 'Ready', status: application.status, order: 2 },
    { name: 'Submitted', status: application.status, order: 3 },
    {
      name: application.status === 'Awarded' ? 'Awarded' : application.status === 'Lost' ? 'Lost' : 'Awarded/Lost',
      status: application.status,
      order: 4,
    },
  ];

  const currentStageOrder = stages.findIndex((s) => s.name === application.status) + 1;

  const canMarkSubmitted = application.status === 'Draft' || application.status === 'Ready';

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div
        ref={drawerRef}
        className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white shadow-xl z-50 overflow-y-auto animate-slide-in-right"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
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
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{application.title}</h3>
            <span className={`inline-block px-3 py-1 text-sm font-medium rounded ${statusColors[application.status]}`}>
              {application.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <Building2 className="w-5 h-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-xs text-slate-600">Agency</p>
                <p className="text-sm font-medium text-slate-900">{application.agency}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="w-5 h-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-xs text-slate-600">Due Date</p>
                <p className="text-sm font-medium text-slate-900">{formatDueDate(application.dueDate)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <DollarSign className="w-5 h-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-xs text-slate-600">Ceiling</p>
                <p className="text-sm font-medium text-slate-900">{formatCurrency(application.ceiling)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <TrendingUp className="w-5 h-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-xs text-slate-600">Fit Score</p>
                <p className="text-sm font-medium text-slate-900">{application.fitScore}/100</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-600 mb-1">NAICS Code</p>
            <span className="inline-block px-2 py-1 bg-slate-100 text-slate-700 text-sm rounded border border-slate-300">
              {application.naics}
            </span>
          </div>

          <div>
            <p className="text-xs text-slate-600 mb-2">Set-Aside</p>
            <div className="flex flex-wrap gap-2">
              {application.setAside.map((setAside) => (
                <span
                  key={setAside}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded border border-blue-300"
                >
                  {setAside}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-600 mb-1">Vehicle</p>
            <p className="text-sm font-medium text-slate-900">{application.vehicle}</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-600">Progress</p>
              <p className="text-sm font-semibold text-slate-900">{application.percentComplete}%</p>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${application.percentComplete}%` }}
              ></div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-900 mb-3">Stage Timeline</p>
            <div className="relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200"></div>
              <div className="space-y-4">
                {stages.map((stage, index) => {
                  const isActive = index + 1 === currentStageOrder;
                  const isCompleted = index + 1 < currentStageOrder;
                  const isFinalStage = stage.name.includes('/');

                  return (
                    <div key={index} className="relative flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 ${
                          isActive
                            ? 'bg-blue-500 border-blue-500'
                            : isCompleted
                              ? 'bg-green-500 border-green-500'
                              : 'bg-white border-slate-300'
                        }`}
                      >
                        <span
                          className={`text-sm font-semibold ${
                            isActive || isCompleted ? 'text-white' : 'text-slate-400'
                          }`}
                        >
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            isActive || isCompleted ? 'text-slate-900' : 'text-slate-500'
                          }`}
                        >
                          {stage.name}
                        </p>
                        {isActive && (
                          <p className="text-xs text-slate-600">Current stage</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-slate-500" />
              <p className="text-xs text-slate-600">Keywords</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {application.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {canMarkSubmitted && (
            <button
              onClick={() => {
                onMarkSubmitted(application.id);
                onClose();
              }}
              className="w-full px-4 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Mark as Submitted
            </button>
          )}
        </div>
      </div>
    </>
  );
}
