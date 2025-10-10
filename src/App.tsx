import { useState, useMemo, useCallback, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { Application, Filters } from './types';
import { FilterProvider } from './context/FilterContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useURLSync } from './hooks/useURLSync';
import { filterApplications } from './utils/filterApplications';
import { ParameterPanel } from './components/ParameterPanel';
import { ResultsList } from './components/ResultsList';
import { DetailsDrawer } from './components/DetailsDrawer';
import { ProgressDashboard } from './components/ProgressDashboard';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { Toast } from './components/Toast';
import applicationsData from './data/applications.json';

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'info';
}

function AppContent() {
  const [applications, setApplications] = useLocalStorage<Application[]>(
    'gsa_applications',
    applicationsData as Application[]
  );
  const [filters, setFilters] = useState<Filters>({
    naics: '',
    setAside: [],
    vehicle: '',
    agency: [],
    periodQuick: '',
    periodStart: '',
    periodEnd: '',
    ceilingMin: '',
    ceilingMax: '',
    keywords: [],
  });
  const [appliedFilters, setAppliedFilters] = useState<Filters>(filters);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [preset, setPreset] = useLocalStorage<Filters | null>('gsa_preset', null);

  const { updateURL } = useURLSync(filters, setFilters);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.toString()) {
      const urlFilters: Filters = {
        naics: params.get('naics') || '',
        setAside: params.get('setAside')?.split(',').filter(Boolean) || [],
        vehicle: params.get('vehicle') || '',
        agency: params.get('agency')?.split(',').filter(Boolean) || [],
        periodQuick: params.get('periodQuick') || '',
        periodStart: params.get('periodStart') || '',
        periodEnd: params.get('periodEnd') || '',
        ceilingMin: params.get('ceilingMin') || '',
        ceilingMax: params.get('ceilingMax') || '',
        keywords: params.get('keywords')?.split(',').filter(Boolean) || [],
      };
      setFilters(urlFilters);
      setAppliedFilters(urlFilters);
    }
  }, []);

  const filteredApplications = useMemo(() => {
    return filterApplications(applications, appliedFilters);
  }, [applications, appliedFilters]);

  const handleApplyFilters = useCallback(() => {
    setIsLoading(true);
    updateURL(filters);
    setTimeout(() => {
      setAppliedFilters(filters);
      setIsLoading(false);
    }, 500);
  }, [filters, updateURL]);

  const handleResetFilters = useCallback(() => {
    const emptyFilters: Filters = {
      naics: '',
      setAside: [],
      vehicle: '',
      agency: [],
      periodQuick: '',
      periodStart: '',
      periodEnd: '',
      ceilingMin: '',
      ceilingMax: '',
      keywords: [],
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    updateURL(emptyFilters);
  }, [updateURL]);

  const handleSavePreset = useCallback(() => {
    setPreset(filters);
    addToast('Preset saved successfully!', 'success');
  }, [filters, setPreset]);

  const handleLoadPreset = useCallback(() => {
    if (preset) {
      setFilters(preset);
      setAppliedFilters(preset);
      updateURL(preset);
      addToast('Preset loaded', 'info');
    }
  }, [preset, updateURL]);

  const handleMarkSubmitted = useCallback((app: Application) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === app.id
          ? { ...a, status: 'Submitted' as const, percentComplete: 100 }
          : a
      )
    );
    addToast('Marked as Submitted', 'info');
  }, [setApplications]);

  const addToast = (message: string, type: 'success' | 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const keywordInput = document.getElementById('keywords');
        keywordInput?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="GSA Opportunity Logo" className="w-20 h-20" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">GSA Opportunity</h1>
              <p className="text-sm text-slate-600">Search and manage government contract opportunities</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden lg:block w-80 flex-shrink-0 h-[calc(100vh-64px)] sticky top-16">
          <ParameterPanel
            filters={filters}
            onFiltersChange={setFilters}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
            onSavePreset={handleSavePreset}
            onLoadPreset={handleLoadPreset}
            hasPreset={preset !== null}
            isLoading={isLoading}
          />
        </aside>

        <div className="flex-1">
          <ProgressDashboard applications={filteredApplications} />
          
          <main className="overflow-y-auto p-6">
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <ResultsList
                applications={filteredApplications}
                onSelectApplication={setSelectedApplication}
                highlightKeywords={appliedFilters.keywords}
              />
            )}
          </main>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
        <details className="bg-white">
          <summary className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-center">
            Show Filters
          </summary>
          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            <ParameterPanel
              filters={filters}
              onFiltersChange={setFilters}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
              onSavePreset={handleSavePreset}
              onLoadPreset={handleLoadPreset}
              hasPreset={preset !== null}
              isLoading={isLoading}
            />
          </div>
        </details>
      </div>

      <DetailsDrawer
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onMarkSubmitted={handleMarkSubmitted}
      />

      <div className="fixed top-20 right-6 z-50 space-y-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <FilterProvider>
      <AppContent />
    </FilterProvider>
  );
}

export default App;
