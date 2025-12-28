import React from 'react';

export default function StatCard({ icon, label, value, subtext }) {
  return (
    <div className="rounded-2xl border shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-[179px] p-6" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)' }}>
      
        <div className="flex">
          <span className="text-base" style={{ color: 'var(--color-text-secondary)' }}>{icon}</span>
          <h3 className="font-jakarta font-500 text-sm pl-[8px]" style={{ color: 'var(--color-text-secondary)' }}>{label}</h3>
        </div>
        <div className="space-y-1">
          <p className="text-4xl font-outfit font-700 leading-none" style={{ color: 'var(--color-text-primary)' }}>{value}</p>
           {subtext && (
          <div className="font-jakarta text-sm" style={{ color: 'var(--color-text-secondary)' }}>{subtext}</div>
        )}
        </div>
    </div>
  );
}
