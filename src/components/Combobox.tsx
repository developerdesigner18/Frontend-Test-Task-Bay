import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface ComboboxProps {
  label: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function Combobox({ label, options, value, onChange, placeholder }: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const removeChip = (option: string) => {
    onChange(value.filter((v) => v !== option));
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <div
          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm flex items-center justify-between cursor-pointer"
          onClick={() => {
            setIsOpen(true);
            inputRef.current?.focus();
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={value.length > 0 ? `${value.length} selected` : placeholder || 'Search agencies...'}
            className="flex-1 outline-none text-sm text-slate-600 placeholder:text-slate-400"
            role="combobox"
            aria-expanded={isOpen}
            aria-controls="combobox-options"
            aria-label={label}
            aria-autocomplete="list"
          />
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        {isOpen && (
          <div
            id="combobox-options"
            className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-60 overflow-auto"
            role="listbox"
          >
            {filteredOptions.length > 0 ? (
              <div className="py-1">
                {filteredOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => toggleOption(option)}
                    className={`px-3 py-2 cursor-pointer hover:bg-slate-50 flex items-center gap-3 ${
                      value.includes(option) ? 'bg-blue-50' : ''
                    }`}
                    role="option"
                    aria-selected={value.includes(option)}
                  >
                    <input
                      type="checkbox"
                      checked={value.includes(option)}
                      onChange={() => {}}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      tabIndex={-1}
                    />
                    <span className="text-sm text-slate-700">{option}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-3 py-2 text-sm text-slate-500">No agencies found</div>
            )}
          </div>
        )}
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-md"
            >
              {item}
              <button
                type="button"
                onClick={() => removeChip(item)}
                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${item}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
