import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Video, Copy } from 'lucide-react';

export default function SessionModal({ session, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !session || !mounted) return null;

  // Extract AM/PM from startTime
  const period = session.startTime.includes('AM') ? 'AM' : 'PM';
  
  // Determine badge styling based on status
  const badgeClass = session.badge === 'Confirmed' 
    ? ' bg-[#17A2B8]/[0.125] text-secondary-primary' 
    : 'bg-grey-lightest text-grey-dark';

  // Generate meeting link (in real app, this would come from the session data)
  const meetingLink = 'https://meet.google.com/abc-defg-hij';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert duration from "45 min" to "45 minutes"
  const durationText = session.duration?.replace('min', 'minutes') || session.duration;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4" style={{ backgroundColor: 'transparent' }}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md mx-4 overflow-hidden" style={{ backgroundColor: 'var(--color-bg-card)' }}>
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 ">
          <div className="flex items-start gap-3 flex-1 h-[44px]">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-jakarta font-normal text-base leading-6 flex-shrink-0" style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-primary)' }}>
              {period}
            </div>
            
            {/* Name and Session Type */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-outfit font-normal text-base" style={{ color: 'var(--color-text-primary)' }}>{session.clientName}</h3>
                <span className={`${badgeClass} rounded-[37px] border px-[8px] py-[2px] text-xs font-jakarta font-300 whitespace-nowrap`}>
                  {session.badge}
                </span>
              </div>
              <p className="font-outfit font-normal text-sm leading-5" style={{ color: 'var(--color-primary)' }}>{session.sessionType}</p>
            </div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors flex-shrink-0 ml-2"
            style={{ color: 'var(--color-text-primary)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 space-y-4 sm:space-y-6 ">
          {/* Meeting Link */}
          <div className='p-3 sm:p-4 rounded-[10px]' style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
            <label className="block font-jakarta font-600 text-sm mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Meeting Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={meetingLink}
                readOnly
                className="flex-1 px-4 py-3 border rounded-lg font-jakarta text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ backgroundColor: 'var(--color-input-bg)', borderColor: 'var(--color-input-border)', color: 'var(--color-input-text)' }}
              />
              <button
                onClick={handleCopyLink}
                className="p-3 border rounded-lg transition-colors flex-shrink-0"
                style={{ borderColor: 'var(--color-border-primary)', backgroundColor: 'var(--color-bg-card)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-card)'}
                title="Copy link"
              >
                <Copy className="w-5 h-5" style={{ color: copied ? 'var(--color-primary)' : 'var(--color-text-secondary)' }} />
              </button>
            </div>
            {copied && (
              <p className="text-xs font-jakarta mt-1" style={{ color: 'var(--color-primary)' }}>Link copied!</p>
            )}
          </div>

          {/* Session Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-jakarta font-normal text-base mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                Start Time
              </label>
              <p className="font-jakarta text-sm" style={{ color: 'var(--color-text-primary)' }}>{session.startTime}</p>
            </div>
            <div>
              <label className="block font-jakarta font-normal text-base mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                Duration
              </label>
              <p className="font-jakarta text-sm" style={{ color: 'var(--color-text-primary)' }}>{durationText}</p>
            </div>
          </div>
        </div>

        {/* Footer - Join Button */}
        <div className="p-4 sm:p-6 ">
          <button
            onClick={() => {
              // In real app, this would navigate to the meeting or open in new tab
              window.open(meetingLink, '_blank');
            }}
            className="w-full px-6 py-3 rounded-lg font-jakarta font-600 text-sm transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}
          >
            <Video className="w-5 h-5" />
            Join Session
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

