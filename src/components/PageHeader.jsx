import { Search, X, LayoutGrid, List } from "lucide-react";
import { useState } from "react";

export default function PageHeader() {
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'

  return (
    <div className="rounded-2xl min-h-[80px] sm:h-[101px] p-4 sm:p-5 mb-6 shadow-sm border" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)' }}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-h2" style={{ color: 'var(--color-text-primary)' }}>Clients</h1>
          <p className="font-jakarta font-medium text-[12px] leading-[20px] tracking-[0px]" style={{ color: 'var(--color-primary)' }}>6 clients</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-stretch w-full gap-3 sm:flex-row sm:items-center sm:gap-4 sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 rounded-full shadow-sm sm:flex-initial">
            <Search className="absolute left-3 top-2.5 w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} />
            <input
              placeholder="Search"
              className="w-full py-2 text-sm border rounded-full outline-none sm:w-48 lg:w-64 pl-9 pr-9 focus:ring-2"
              style={{ backgroundColor: 'var(--color-input-bg)', borderColor: 'var(--color-input-border)', color: 'var(--color-input-text)' }}
            />
            <X className="absolute right-3 top-2.5 w-4 h-4 cursor-pointer" style={{ color: 'var(--color-text-tertiary)' }} />
          </div>

          {/* Dropdown */}
          <select className="w-full px-3 py-2 pr-8 text-sm border rounded-lg shadow-sm appearance-none sm:px-4 sm:pr-10 focus:outline-none focus:ring-2 sm:w-auto" style={{ backgroundColor: 'var(--color-input-bg)', borderColor: 'var(--color-input-border)', color: 'var(--color-input-text)' }}>
            <option>All Engagement</option>
          </select>

          {/* View toggles */}
          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
            <button 
              onClick={() => setViewMode('grid')}
              className="p-1.5 sm:p-2 rounded-md transition-all"
              style={viewMode === 'grid' ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' } : { color: 'var(--color-text-secondary)' }}
            >
              <LayoutGrid size={14} className="sm:w-4 sm:h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className="p-1.5 sm:p-2 rounded-md transition-all"
              style={viewMode === 'list' ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' } : { color: 'var(--color-text-secondary)' }}
            >
              <List size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
