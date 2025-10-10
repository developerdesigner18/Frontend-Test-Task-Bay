import { useState, useMemo, useEffect, useCallback } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { FilterProvider, useFilters } from './context/FilterContext';
import { ParameterPanel } from './components/ParameterPanel';
import { ResultsList } from './components/ResultsList';
import { DetailsDrawer } from './components/DetailsDrawer';
import { ProgressDashboard } from './components/ProgressDashboard';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { Toast } from './components/Toast';
import { Application } from './types';
import { filterApplications } from './utils/filterApplications';
import { useURLSync } from './hooks/useURLSync';
import { Menu, X } from 'lucide-react';
import applicationsData from './data/applications.json';

function AppContent() {
  const { filters, setFilters, isLoading } = useFilters();
  const [applications, setApplications] = useState<Application[]>(applicationsData as Application[]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { updateURL } = useURLSync(filters, setFilters);

  useEffect(() => {
    updateURL(filters);
  }, [filters]);

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

  const filteredApplications = useMemo(() => {
    return filterApplications(applications, filters);
  }, [applications, filters]);

  const handleSelectApplication = useCallback((app: Application) => {
    setSelectedApplication(app);
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedApplication(null), 300);
  }, []);

  const handleMarkSubmitted = useCallback((id: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? { ...app, status: 'Submitted' as const, percentComplete: 100 }
          : app
      )
    );
    setToast({ message: 'Marked as Submitted', type: 'info' });
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'info') => {
    setToast({ message, type });
  }, []);

  const handleApplyFilters = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-500 text-white px-4 py-2 rounded-md z-50"
      >
        Skip to content
      </a>

      <div className="flex h-screen">
        {/* Admin Panel Sidebar - Light Theme */}
        <aside className="bg-white border-r border-slate-200 text-slate-800 w-80 flex-shrink-0 h-screen fixed left-0 top-0 overflow-hidden shadow-sm">
          <div className="p-6 flex flex-col h-full">
            {/* Title */}
            <div className="mb-6 text-center border-b border-slate-100 pb-4">
              <h1 className="text-xl font-bold text-slate-800">GSA Opportunity Finder</h1>
              <p className="text-sm text-slate-500 mt-1">
                Search and manage opportunities
              </p>
            </div>
            
            {/* Filter Panel */}
            <div className="flex-grow overflow-auto pr-2">
              <ParameterPanel onApply={handleApplyFilters} onShowToast={showToast} />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="ml-80 flex-1 flex flex-col">
          <header className="bg-white border-b border-slate-200 sticky top-0 z-30 w-full shadow-sm">
            <div className="px-6 py-3 flex items-center justify-between w-full">
              <div className="flex items-center">
                <img src="/logo.png" alt="GSA Logo" className="h-10 mr-4" />
                <h2 className="text-lg font-semibold text-slate-800">Dashboard</h2>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-slate-700" />
                ) : (
                  <Menu className="w-6 h-6 text-slate-700" />
                )}
              </button>
            </div>
          </header>

          <ProgressDashboard applications={filteredApplications} />

          <main id="main-content" className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              {isLoading ? (
                <LoadingSkeleton />
              ) : (
                <ResultsList
                  applications={filteredApplications}
                  onSelectApplication={handleSelectApplication}
                  highlightKeywords={filters.keywords}
                />
              )}
            </div>
          </main>
        </div>
        
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-slate-800 z-40 overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <img src="/logo.png" alt="GSA Logo" className="h-10" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-white"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <ParameterPanel onApply={handleApplyFilters} onShowToast={showToast} />
            </div>
          </div>
        )}
      </div>

      <DetailsDrawer
        application={selectedApplication}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onMarkSubmitted={handleMarkSubmitted}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <FilterProvider>
        <AppContent />
      </FilterProvider>
    </BrowserRouter>
  );
}

export default App;
