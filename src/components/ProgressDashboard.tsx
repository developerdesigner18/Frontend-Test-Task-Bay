import { useMemo } from 'react';
import { Application, StatusCount } from '../types';
import { FileText, CheckCircle, Send, Award, XCircle } from 'lucide-react';

interface ProgressDashboardProps {
  applications: Application[];
}

export function ProgressDashboard({ applications }: ProgressDashboardProps) {
  const statusCounts = useMemo<StatusCount>(() => {
    const counts: StatusCount = {
      Draft: 0,
      Ready: 0,
      Submitted: 0,
      Awarded: 0,
      Lost: 0,
    };

    applications.forEach((app) => {
      counts[app.status]++;
    });

    return counts;
  }, [applications]);

  const avgProgress = useMemo(() => {
    if (applications.length === 0) return 0;
    const total = applications.reduce((sum, app) => sum + app.percentComplete, 0);
    return Math.round(total / applications.length);
  }, [applications]);

  const total = applications.length;

  const chartData = useMemo(() => {
    if (total === 0) return [];

    return [
      { status: 'Draft', count: statusCounts.Draft, color: '#64748b', percentage: (statusCounts.Draft / total) * 100 },
      { status: 'Ready', count: statusCounts.Ready, color: '#3b82f6', percentage: (statusCounts.Ready / total) * 100 },
      { status: 'Submitted', count: statusCounts.Submitted, color: '#8b5cf6', percentage: (statusCounts.Submitted / total) * 100 },
      { status: 'Awarded', count: statusCounts.Awarded, color: '#10b981', percentage: (statusCounts.Awarded / total) * 100 },
      { status: 'Lost', count: statusCounts.Lost, color: '#ef4444', percentage: (statusCounts.Lost / total) * 100 },
    ];
  }, [statusCounts, total]);

  const donutSegments = useMemo(() => {
    let currentAngle = -90;
    const radius = 40;
    const centerX = 50;
    const centerY = 50;

    return chartData.map((data) => {
      const angle = (data.percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      currentAngle = endAngle;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      return {
        path,
        color: data.color,
        status: data.status,
        count: data.count,
      };
    });
  }, [chartData]);

  return (
    <div className="bg-white border-b border-slate-200 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-medium text-slate-600">Draft</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{statusCounts.Draft}</div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">Ready</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">{statusCounts.Ready}</div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Send className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-600">Submitted</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">{statusCounts.Submitted}</div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-600">Awarded</span>
            </div>
            <div className="text-2xl font-bold text-green-900">{statusCounts.Awarded}</div>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-red-600">Lost</span>
            </div>
            <div className="text-2xl font-bold text-red-900">{statusCounts.Lost}</div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex flex-col h-full justify-between">
              <span className="text-xs font-medium text-slate-600 mb-2">Avg. Complete</span>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${avgProgress}%` }}
                  ></div>
                </div>
                <span className="text-lg font-bold text-slate-900">{avgProgress}%</span>
              </div>
            </div>
          </div>
        </div>

        {total > 0 && (
          <div className="mt-4 flex justify-center">
            <div className="flex items-center gap-4">
              <svg width="100" height="100" viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="20" />
                {donutSegments.map((segment, index) => (
                  <path
                    key={index}
                    d={segment.path}
                    fill={segment.color}
                    className="transition-all"
                  />
                ))}
                <circle cx="50" cy="50" r="25" fill="white" />
              </svg>
              <div className="text-sm">
                {chartData.map((data) => (
                  data.count > 0 && (
                    <div key={data.status} className="flex items-center gap-2 mb-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: data.color }}
                      ></div>
                      <span className="text-slate-700">
                        {data.status}: {data.count} ({Math.round(data.percentage)}%)
                      </span>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
