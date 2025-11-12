import React, { useState, useMemo } from 'react';
import { Search, Calendar, Tag, Clock, Droplet, Filter, X, ArrowUp, ArrowDown, LucideIcon } from 'lucide-react';

// --- TYPE DEFINITIONS ---

type SortKey = 'date' | 'time' | 'context' | 'level' | 'label';
type SortDirection = 'ascending' | 'descending';

interface Reading {
  id: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  context: string;
  level: number;
  unit: string;
  label: string;
}

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

interface FilterOptionProps {
  icon: LucideIcon;
  title: string;
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
}

interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

interface SortIconProps {
    columnKey: SortKey;
}

// --- MOCK DATA (Typed as Reading[]) ---
const MOCK_READINGS: Reading[] = [
  { id: 1, date: '2025-11-10', time: '07:30', context: 'Fasting', level: 98, unit: 'mg/dL', label: 'Optimal' },
  { id: 2, date: '2025-11-10', time: '08:45', context: 'After Breakfast', level: 135, unit: 'mg/dL', label: 'Controlled' },
  { id: 3, date: '2025-11-10', time: '13:30', context: '2 Hours Post Lunch', level: 155, unit: 'mg/dL', label: 'Medium' },
  { id: 4, date: '2025-11-10', time: '19:00', context: 'Before Dinner', level: 110, unit: 'mg/dL', label: 'Optimal' },
  { id: 5, date: '2025-11-09', time: '07:40', context: 'Fasting', level: 105, unit: 'mg/dL', label: 'Controlled' },
  { id: 6, date: '2025-11-09', time: '14:00', context: '2 Hours Post Lunch', level: 188, unit: 'mg/dL', label: 'High' },
  { id: 7, date: '2025-11-08', time: '21:30', context: 'Bedtime', level: 122, unit: 'mg/dL', label: 'Controlled' },
  { id: 8, date: '2025-11-07', time: '07:35', context: 'Fasting', level: 160, unit: 'mg/dL', label: 'High' },
  { id: 9, date: '2025-11-07', time: '09:00', context: 'After Breakfast', level: 140, unit: 'mg/dL', label: 'Controlled' },
  { id: 10, date: '2025-11-06', time: '18:30', context: 'Before Dinner', level: 85, unit: 'mg/dL', label: 'Low' },
];

const ALL_CONTEXTS: string[] = ['Fasting', 'After Breakfast', '2 Hours Post Lunch', 'Before Dinner', 'Bedtime'];
const ALL_LABELS: string[] = ['Optimal', 'Controlled', 'Medium', 'High', 'Low'];

const getLabelColor = (label: string): string => {
  switch (label) {
    case 'Optimal': return 'bg-green-100 text-green-700 ring-green-500/10';
    case 'Controlled': return 'bg-blue-100 text-blue-700 ring-blue-500/10';
    case 'Medium': return 'bg-yellow-100 text-yellow-700 ring-yellow-500/10';
    case 'High': return 'bg-red-100 text-red-700 ring-red-500/10';
    case 'Low': return 'bg-indigo-100 text-indigo-700 ring-indigo-500/10';
    default: return 'bg-gray-100 text-gray-700 ring-gray-500/10';
  }
};

const FilterOption: React.FC<FilterOptionProps> = ({ icon: Icon, title, options, selected, onToggle }) => (
  <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100">
    <div className="flex items-center space-x-2 mb-3">
      <Icon className="w-5 h-5 text-indigo-500" />
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
      {options.map((option) => (
        <label key={option} className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => onToggle(option)}
            className="form-checkbox h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <span className="ml-2 text-sm text-gray-700">{option}</span>
        </label>
      ))}
    </div>
  </div>
);

const DateInput: React.FC<DateInputProps> = ({ label, value, onChange }) => (
    <div className="flex flex-col">
        <label htmlFor={label} className="text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-indigo-500" />
            {label}
        </label>
        <input
            id={label}
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
        />
    </div>
);


export default function App(): JSX.Element {
  // State for Filters - explicit types added
  const [startDate, setStartDate] = useState<string>(MOCK_READINGS[MOCK_READINGS.length - 1].date);
  const [endDate, setEndDate] = useState<string>(MOCK_READINGS[0].date);
  const [selectedContexts, setSelectedContexts] = useState<string[]>(ALL_CONTEXTS);
  const [selectedLabels, setSelectedLabels] = useState<string[]>(ALL_LABELS);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(true);

  // State for Sorting - explicit type added
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'descending' });

  // Filter Toggles
  const toggleContext = (context: string): void => {
    setSelectedContexts(prev =>
      prev.includes(context) ? prev.filter(c => c !== context) : [...prev, context]
    );
  };

  const toggleLabel = (label: string): void => {
    setSelectedLabels(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const clearAllFilters = (): void => {
    setStartDate(MOCK_READINGS[MOCK_READINGS.length - 1].date);
    setEndDate(MOCK_READINGS[0].date);
    setSelectedContexts(ALL_CONTEXTS);
    setSelectedLabels(ALL_LABELS);
    setSearchTerm('');
    setSortConfig({ key: 'date', direction: 'descending' });
  };


  // Filtering and Sorting Logic
  const filteredAndSortedData: Reading[] = useMemo(() => {
    let filteredData: Reading[] = MOCK_READINGS.filter(reading => {
      const readingDate = new Date(reading.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Date Range Filter
      const passesDate = readingDate >= start && readingDate <= end;
      
      // Context Filter
      const passesContext = selectedContexts.includes(reading.context);

      // Label Filter
      const passesLabel = selectedLabels.includes(reading.label);

      // Search Term Filter
      const passesSearch = searchTerm === '' ||
        reading.context.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reading.level.toString().includes(searchTerm) ||
        reading.label.toLowerCase().includes(searchTerm.toLowerCase());
        
      return passesDate && passesContext && passesLabel && passesSearch;
    });

    // Sorting Logic
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        // Ensure key is a valid property of Reading
        const key = sortConfig.key as keyof Reading; 
        
        let aValue: string | number = a[key] as any;
        let bValue: string | number = b[key] as any;
        
        // Custom sort for level (number)
        if (key === 'level') {
            aValue = a.level;
            bValue = b.level;
        } else if (typeof aValue === 'string') {
          // Handle string comparison for date, time, context, label
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  }, [startDate, endDate, selectedContexts, selectedLabels, searchTerm, sortConfig]);

  // Handle Sort Request
  const requestSort = (key: SortKey): void => {
    let direction: SortDirection = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
      // Third click reverts to default (date descending)
      setSortConfig({ key: 'date', direction: 'descending' });
      return;
    }
    setSortConfig({ key, direction });
  };

  const SortIcon: React.FC<SortIconProps> = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
        return <ArrowUp className="w-3 h-3 text-gray-400 group-hover:text-indigo-500 opacity-50 transition" />;
    }
    return sortConfig.direction === 'ascending' ? (
      <ArrowUp className="w-3 h-3 text-indigo-600" />
    ) : (
      <ArrowDown className="w-3 h-3 text-indigo-600" />
    );
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 flex items-center">
          <Droplet className="w-8 h-8 mr-3 text-indigo-600" />
          Blood Sugar Reading History
        </h1>
        <p className="text-gray-500 mt-1">Review, filter, and analyze your historical glucose data.</p>
      </header>

      {/* Filter and Controls */}
      <section className="mb-6">
        <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="sm:hidden w-full flex items-center justify-center p-3 mb-4 font-semibold text-white bg-indigo-600 rounded-xl shadow-md hover:bg-indigo-700 transition duration-200"
        >
            <Filter className="w-5 h-5 mr-2" />
            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
        </button>

        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isFilterOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 sm:max-h-full sm:opacity-100'}`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <DateInput label="Start Date" value={startDate} onChange={setStartDate} />
                <DateInput label="End Date" value={endDate} onChange={setEndDate} />

                <FilterOption
                    icon={Clock}
                    title="Time of Day (Context)"
                    options={ALL_CONTEXTS}
                    selected={selectedContexts}
                    onToggle={toggleContext}
                />

                <FilterOption
                    icon={Tag}
                    title="Label (Category)"
                    options={ALL_LABELS}
                    selected={selectedLabels}
                    onToggle={toggleLabel}
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                {/* Search Input */}
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by level, context, or label..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                    />
                </div>

                {/* Clear Filters Button */}
                <button
                    onClick={clearAllFilters}
                    className="flex items-center justify-center px-4 py-3 sm:py-0 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150"
                >
                    <X className="w-4 h-4 mr-1" />
                    Clear Filters
                </button>
            </div>
        </div>
      </section>

      {/* Results Table */}
      <section className="bg-white rounded-xl shadow-2xl overflow-hidden ring-1 ring-gray-200/50">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
                Showing {filteredAndSortedData.length} Readings
            </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {/* Header Cell Component for Sorting */}
                {['S.No', 'date', 'time', 'context', 'level', 'label'].map(key => {
                    const labelMap: { [key: string]: string } = {
                        'S.No': 'S.No', 'date': 'Date', 'time': 'Time', 'context': 'Time of Day', 'level': 'Sugar Level', 'label': 'Label'
                    };
                    // Only date, time, context, level, label are sortable keys
                    const columnKey: SortKey | null = key === 'S.No' ? null : key as SortKey;
                    const isClickable = columnKey !== null;

                    return (
                        <th 
                            key={key} 
                            scope="col" 
                            className={`px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider ${isClickable ? 'cursor-pointer group hover:bg-gray-200 transition duration-150' : ''}`}
                            onClick={isClickable ? () => requestSort(columnKey as SortKey) : undefined}
                        >
                            <span className="flex items-center whitespace-nowrap">
                                {labelMap[key]}
                                {isClickable && columnKey && <span className="ml-1"><SortIcon columnKey={columnKey} /></span>}
                            </span>
                        </th>
                    );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedData.length > 0 ? (
                filteredAndSortedData.map((reading, index) => (
                  <tr key={reading.id} className="hover:bg-indigo-50 transition duration-150">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className="flex items-center"><Calendar className="w-3 h-3 mr-1 text-indigo-400" />{reading.date}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1 text-indigo-400" />{reading.time}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{reading.context}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-base font-bold text-indigo-700">
                        {reading.level} <span className="text-sm font-normal text-indigo-500">{reading.unit}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${getLabelColor(reading.label)}`}
                      >
                        {reading.label}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-500 text-lg">
                    <Filter className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                    No readings match the current filters. Try adjusting your date range or removing some options.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="mt-8 text-center text-sm text-gray-400">
          <p>Mock data visualization. Data persistence requires a database connection (e.g., Firestore or Vercel Postgres).</p>
      </footer>
    </div>
  );
}