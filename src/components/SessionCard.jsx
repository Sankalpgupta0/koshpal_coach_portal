import React from 'react';
import { Video, Clock } from 'lucide-react';
export default function SessionCard({ startTime, endTime, clientName, sessionType, badge, isVirtual, duration, onJoinSession, onReschedule }) {
  // Extract AM/PM from startTime
  const period = startTime.includes('AM') ? 'AM' : 'PM';
  
  // Determine badge styling based on status
  const getBadgeStyle = () => {
    if (badge === 'Confirmed') {
      return { backgroundColor: 'var(--color-info-bg)', color: 'var(--color-secondary)' };
    }
    return { backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' };
  };

  return (
    <div className="rounded-[10px] py-3 sm:py-[14px] px-3 sm:px-[17px] border hover:shadow-md transition-shadow" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)' }}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
        {/* AM/PM Badge - Center on mobile, left on desktop */}
        <div className="flex sm:hidden flex-col items-center">
          <div className="rounded-full flex items-center w-10 h-10" style={{ backgroundColor: 'var(--color-primary-lightest)' }}>
            <span className="rounded-full w-10 h-10 flex items-center justify-center text-xs font-jakarta font-600" style={{ backgroundColor: 'var(--color-primary-lightest)', color: 'var(--color-primary)' }}>
              {period}
            </span>
          </div>
          {/* Time - Horizontal below circle on mobile */}
          <div className="flex items-center gap-2 mt-2">
            <div className="font-jakarta font-500 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{startTime}</div>
            <div className="w-1 h-4 rounded-[3px]" style={{ backgroundColor: 'var(--color-border-primary)' }}></div>
            <div className="font-jakarta font-500 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{endTime}</div>
          </div>
        </div>

        {/* Desktop Time Section */}
        <div className="hidden sm:flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
          <div className="font-jakarta font-500 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{startTime}</div>
          <div className="w-1 h-6 rounded-[3px] my-2" style={{ backgroundColor: 'var(--color-border-primary)' }}></div>
          <div className="font-jakarta font-500 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{endTime}</div>
        </div>

        {/* Desktop AM/PM Badge */}
        <div className="hidden sm:flex rounded-full flex items-start w-10 h-10" style={{ backgroundColor: 'var(--color-primary-lightest)' }}>
          <span className="rounded-full w-10 h-10 flex items-center justify-center text-xs font-jakarta font-600" style={{ backgroundColor: 'var(--color-primary-lightest)', color: 'var(--color-primary)' }}>
            {period}
          </span>
        </div>

        {/* Session Details - Center on mobile, left on desktop */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
            <h4 className="font-outfit font-400 text-base" style={{ color: 'var(--color-text-primary)' }}>{clientName}</h4>
            <span className="rounded-[37px] border px-[8px] py-[2px] text-xs font-jakarta font-400 whitespace-nowrap" style={getBadgeStyle()}>
              {badge}
            </span>
          </div>
          <p className="font-outfit font-normal text-sm leading-5 tracking-normal" style={{ color: 'var(--color-primary)' }}>{sessionType}</p>

          {/* Meta Tags - Center on mobile, left on desktop */}
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-[10px]">
            {isVirtual && (
              <div className="inline-flex items-center border px-2 py-1 text-xs font-jakarta font-600 rounded-md gap-1" style={{ borderColor: 'var(--color-secondary)', color: 'var(--color-secondary)', backgroundColor: 'var(--color-info-bg)' }}>
                <Video className='h-3 w-3 ' /> <p>Virtual</p>
              </div>
            )}
            {duration && (
              <div className="inline-flex items-center border px-2 py-1 text-xs font-jakarta font-600 rounded-md gap-1" style={{ borderColor: 'var(--color-warning)', color: 'var(--color-warning)', backgroundColor: 'var(--color-warning-bg)' }}>
                <Clock className='h-3 w-3 ' /> <p>{duration}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Full width on mobile, horizontal on desktop */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button 
            onClick={onJoinSession}
            className="w-full sm:w-auto px-3 sm:px-5 py-2 rounded-[8px] font-jakarta font-600 font-semibold text-xs leading-5 transition-all whitespace-nowrap tracking-normal hover:opacity-90" 
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}
          >
            Join Session
          </button>
          <button 
            onClick={onReschedule}
            className="w-full sm:w-auto border px-3 sm:px-5 py-2 rounded-[8px] font-jakarta font-600 font-semibold text-xs transition-all whitespace-nowrap flex items-center justify-center sm:justify-start gap-1.5 tracking-normal hover:opacity-80"
            style={{ borderColor: 'var(--color-border-primary)', backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-secondary)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Reschedule
          </button>
        </div>
      </div>
    </div>
  );
}
