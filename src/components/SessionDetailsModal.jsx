import { useState } from 'react';
import { X, Calendar, Clock, Star, MessageSquare, CircleCheckBig } from 'lucide-react';

export default function SessionDetailsModal({ isOpen, onClose, session }) {
    const [isEditingSummary, setIsEditingSummary] = useState(false);
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [summary, setSummary] = useState('Discussed team communication strategies and upcoming leadership challenges.');
    const [coachNotes, setCoachNotes] = useState('Discussed team communication strategies and upcoming leadership challenges.');

    if (!isOpen || !session) return null;

    const handleSaveSummary = () => {
        setIsEditingSummary(false);
        console.log('Summary saved:', summary);
    };

    const handleSaveNotes = () => {
        setIsEditingNotes(false);
        console.log('Notes saved:', coachNotes);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-[768px] rounded-[12px] shadow-xl overflow-hidden"
                style={{ backgroundColor: 'var(--color-bg-card)' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center px-4 sm:px-6 min-h-[105px] py-4 border-b" style={{ borderColor: 'var(--color-border-primary)' }}>
                    <div className="flex items-start justify-between w-full">
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div
                                className="w-[56px] h-[56px] rounded-full flex items-center justify-center bg-[#EFF1F8] text-[#334EAC] font-['Plus_Jakarta_Sans'] text-[18px] leading-[28px] font-normal tracking-normal"
                            >
                                {session.avatar}
                            </div>
                            <div>
                                <h2 className="font-['Outfit'] text-[20px] leading-[28px] font-normal tracking-normal text-[#333333]">
                                    {session.clientName}
                                </h2>
                                <p className="font-['Plus_Jakarta_Sans'] text-[14px] leading-[20px] font-normal tracking-[0.14px] text-[#808080]">
                                    {session.role} • {session.company}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg hover:opacity-80 transition-all"
                            style={{ color: 'var(--color-text-secondary)' }}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {/* Session Info Grid */}
                    <div className="min-h-[164px]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Scheduled */}
                            <div className='gap-3'>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-[32px] w-[32px] rounded-[12px] flex items-center justify-center bg-[#F5F5F5]">
                                        <Calendar className="w-4 h-4 text-[#808080]" />
                                    </div>
                                    <div>
                                        <span className="text-label font-['Plus_Jakarta_Sans'] text-[14px] leading-[20px] font-medium tracking-[0.12px] text-[#666666]">
                                            Scheduled
                                        </span>
                                        <p className="text-body-md font-['Plus_Jakarta_Sans'] text-[14px] leading-[20px] font-medium tracking-[0.14px] text-[#333333]">
                                            Sunday, December 28, 2025 at 10:00 AM
                                        </p>
                                    </div>
                                </div>

                            </div>

                            {/* Status */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-[32px] w-[32px] rounded-[12px] flex items-center justify-center bg-[#F5F5F5]">
                                        <CircleCheckBig className="w-4 h-4 text-[#808080]" />
                                    </div>
                                    <div>
                                        <div className="text-label font-['Plus_Jakarta_Sans'] text-[14px] leading-[20px] font-medium tracking-[0.12px] text-[#666666] mb-[3px]">
                                            Status
                                        </div>
                                        <div
                                            className="inline-block px-2 py-[2px] rounded-[14px] h-[22px] border border-[#348958] font-['Plus_Jakarta_Sans'] text-[12px] leading-[16px] font-medium tracking-normal text-[#348958]"
                                        >
                                            COMPLETED
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Duration */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-[32px] w-[32px] rounded-[12px] flex items-center justify-center bg-[#F5F5F5]">
                                        <Clock className="w-4 h-4 text-[#808080]" />
                                    </div>
                                    <div>
                                        <span className="text-label font-['Plus_Jakarta_Sans'] text-[14px] leading-[20px] font-medium tracking-[0.12px] text-[#666666]">
                                            Duration
                                        </span>
                                        <p className="text-body-md font-['Plus_Jakarta_Sans'] text-[14px] leading-[20px] font-medium tracking-[0.14px] text-[#333333]">
                                            {session.duration || '45m'}
                                        </p>
                                    </div>
                                </div>

                            </div>

                            {/* Client Rating */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-[32px] w-[32px] rounded-[12px] flex items-center justify-center bg-[#F5F5F5]">
                                        <Star className="w-4 h-4 fill-current text-[#EB8A14]" />
                                    </div>
                                    <div>
                                        <span className="text-label font-['Plus_Jakarta_Sans'] text-[14px] leading-[20px] font-medium tracking-[0.12px] text-[#666666]">
                                            Client Rating
                                        </span>
                                        <p className="text-body-md font-['Plus_Jakarta_Sans'] text-[14px] leading-[20px] font-medium tracking-[0.14px] text-[#333333]">
                                            {session.rating}/5.0
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Topics Covered */}
                    <div className="space-y-2">
                        <h3 className="font-jakarta text-sm leading-6 font-semibold text-black-light">
                            Topics Covered
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {session.topicsCovered && session.topicsCovered.length > 0 ? (
                                session.topicsCovered.map((topic, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 rounded-full px-2 py-1 rounded-[22px] border-[1px] border-[#334EAC] font-jakarta text-xs leading-4 font-medium text-primary-primary"
                                    >
                                        {topic}
                                    </span>
                                ))
                            ) : (
                                <span className="text-body-sm text-[#808080]">No topics covered</span>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-jakarta text-sm leading-6 font-semibold text-black-light">
                                Summary
                            </h3>
                            {!isEditingSummary && (
                                <button
                                    onClick={() => setIsEditingSummary(true)}
                                    className="px-3 h-[32px] rounded-[10px] border border-[#E0E0E0] text-body-md  text-[#333333] font-plusJakarta font-normal text-[14px] tracking-[0px] bg-[#FAFAFA]"
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                        {isEditingSummary ? (
                            <div className="space-y-2">
                                <textarea
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-[10px] rounded-[6px] border text-body-md transition-all focus:outline-none focus:ring-2 resize-none bg-[#F3F3F5]"
                                />
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => setIsEditingSummary(false)}
                                        className="px-3 py-1.5 rounded-lg text-body-sm font-medium transition-all hover:opacity-80"
                                        style={{
                                            backgroundColor: 'transparent',
                                            color: 'var(--color-text-secondary)',
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveSummary}
                                        className="px-3 py-1.5 rounded-lg text-body-sm font-medium transition-all hover:opacity-90"
                                        style={{
                                            backgroundColor: 'var(--color-primary)',
                                            color: 'var(--color-text-inverse)',
                                        }}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="p-4 rounded-lg text-body-md"
                                style={{
                                    backgroundColor: 'var(--color-bg-secondary)',
                                    color: 'var(--color-text-primary)',
                                }}
                            >
                                {summary}
                            </div>
                        )}
                    </div>

                    {/* Client Feedback */}
                    <div className="space-y-2">
                        <h3 className="font-jakarta text-sm leading-6 font-semibold text-black-light">
                            Client Feedback
                        </h3>
                        <div
                            className="p-4 border border-[#EAEAEA] rounded-[12px] space-y-3">
                            <div className="flex items-center gap-1">
                                <span className="font-jakarta text-sm leading-[21px] font-medium tracking-normal text-[#334EAC]">
                                    Rating:
                                </span>
                                <div className="flex items-center gap-0.5 ml-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className="w-4 h-4 fill-current"
                                            style={{ color: star <= session.rating ? '#f59e0b' : '#d1d5db' }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="font-jakarta text-sm leading-[21px] font-normal tracking-normal text-grey-darkest">
                                "Excellent session! Really helped me understand my leadership blind spots. The practical frameworks were immediately actionable."
                            </p>
                        </div>
                    </div>

                    {/* Coach Notes */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-jakarta text-sm leading-6 font-semibold text-black-light">
                                Coach Notes
                            </h3>
                            {!isEditingNotes && (
                                <button
                                    onClick={() => setIsEditingNotes(true)}
                                    className="px-3 h-[32px] rounded-[10px] border border-[#E0E0E0] text-body-md  text-[#333333] font-plusJakarta font-normal text-[14px] tracking-[0px] bg-[#FAFAFA]">
                                    Edit notes
                                </button>
                            )}
                        </div>
                        {isEditingNotes ? (
                            <div className="space-y-2">
                                <textarea
                                    value={coachNotes}
                                    onChange={(e) => setCoachNotes(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-[10px] pb-[23px] bg-[#F3F3F5] rounded-lg border text-body-md transition-all focus:outline-none focus:ring-2 resize-none"
                                    style={{
                                        backgroundColor: 'var(--color-input-bg)',
                                        borderColor: 'var(--color-border-secondary)',
                                        color: 'var(--color-text-primary)',
                                    }}
                                />
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => setIsEditingNotes(false)}
                                        className="px-3 py-1.5 rounded-lg text-body-sm font-medium transition-all hover:opacity-80"
                                        style={{
                                            backgroundColor: 'transparent',
                                            color: 'var(--color-text-secondary)',
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveNotes}
                                        className="px-3 py-1.5 rounded-lg text-body-sm font-medium transition-all hover:opacity-90"
                                        style={{
                                            backgroundColor: 'var(--color-primary)',
                                            color: 'var(--color-text-inverse)',
                                        }}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="p-4 rounded-lg text-body-md"
                                style={{
                                    backgroundColor: 'var(--color-bg-secondary)',
                                    color: 'var(--color-text-primary)',
                                }}
                            >
                                {coachNotes}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div
                    className="px-4 sm:px-6 min-h-[85px] py-4 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
                    style={{ borderColor: 'var(--color-border-primary)' }}
                >
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-body-md font-medium border border-[#E0E0E0] rounded-[10px] h-[36px] order-2 sm:order-1"
                    >
                        Close
                    </button>

                    <button
                        className="flex items-center justify-center gap-2 px-4 py-2 border-[#E0E0E0] rounded-[10px] border text-body-md font-medium transition-all hover:opacity-80 bg-[#FAFAFA] order-1 sm:order-2"
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span>Message</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
