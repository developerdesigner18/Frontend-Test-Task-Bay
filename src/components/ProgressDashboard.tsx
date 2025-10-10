import { useMemo } from 'react';
import { FileText, CheckCircle, Send, Award, XCircle } from 'lucide-react';
import { Application } from '../types';

interface ProgressDashboardProps {
  applications: Application[];
}

export function ProgressDashboard({ applications }: ProgressDashboardProps) {
  const stats = useMemo(() => {
    const draft = applications.filter((app) => app.status === 'Draft').length;
    const ready = applications.filter((app) => app.status === 'Ready').length;
    const submitted = applications.filter((app) => app.status === 'Submitted').length;
    const awarded = applications.filter((app) => app.status === 'Awarded').length;
    const lost = applications.filter((app) => app.status === 'Lost').length;

    const avgProgress = applications.length > 0
      ? applications.reduce((sum, app) => sum + app.percentComplete, 0) / applications.length
      : 0;

    return { draft, ready, submitted, awarded, lost, avgProgress };
  }, [applications]);

  const chartData = useMemo(() => {
    const total = applications.length || 1;
    return [
      { status: 'Draft', count: stats.draft, color: '#94a3b8', percentage: (stats.draft / total) * 100 },
      { status: 'Ready', count: stats.ready, color: '#3b82f6', percentage: (stats.ready / total) * 100 },
      { status: 'Submitted', count: stats.submitted, color: '#8b5cf6', percentage: (stats.submitted / total) * 100 },
      { status: 'Awarded', count: stats.awarded, color: '#10b981', percentage: (stats.awarded / total) * 100 },
      { status: 'Lost', count: stats.lost, color: '#ef4444', percentage: (stats.lost / total) * 100 },
    ];
  }, [applications.length, stats]);

  let cumulativePercentage = 0;

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-4 w-full">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <FileText className="w-5 h-5 text-slate-600" />
              <div>
                <div className="text-2xl font-semibold text-slate-900">{stats.draft}</div>
                <div className="text-xs text-slate-600">Draft</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-2xl font-semibold text-blue-900">{stats.ready}</div>
                <div className="text-xs text-blue-700">Ready</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Send className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-2xl font-semibold text-purple-900">{stats.submitted}</div>
                <div className="text-xs text-purple-700">Submitted</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Award className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-semibold text-green-900">{stats.awarded}</div>
                <div className="text-xs text-green-700">Awarded</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
              <div>
                <div className="text-2xl font-semibold text-red-900">{stats.lost}</div>
                <div className="text-xs text-red-700">Lost</div>
              </div>
            </div>
          </div>

          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-4">
              <svg width="80" height="80" viewBox="0 0 80 80" className="transform -rotate-90">
                {chartData.map((item, index) => {
                  const radius = 30;
                  const circumference = 2 * Math.PI * radius;
                  const offset = (cumulativePercentage / 100) * circumference;
                  const dashArray = (item.percentage / 100) * circumference;
                  cumulativePercentage += item.percentage;

                  return (
                    <circle
                      key={item.status}
                      cx="40"
                      cy="40"
                      r={radius}
                      fill="none"
                      stroke={item.color}
                      strokeWidth="10"
                      strokeDasharray={`${dashArray} ${circumference}`}
                      strokeDashoffset={-offset}
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>
              <div>
                <div className="text-sm font-medium text-slate-700">Status</div>
                <div className="text-sm text-slate-600">Distribution</div>
              </div>
            </div>

            <div className="min-w-[160px]">
              <div className="text-sm font-medium text-slate-700 mb-2">
                Avg. Complete: {stats.avgProgress.toFixed(0)}%
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats.avgProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
