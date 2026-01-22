import { useState } from 'react';
import { X, Clock, Tag, Eye, EyeOff, MessageSquare } from 'lucide-react';

export default function EndSessionModal({ isOpen, onClose, session }) {
    const [topics, setTopics] = useState([]);
    const [topicInput, setTopicInput] = useState('');
    const [summary, setSummary] = useState('');
    const [privateNotes, setPrivateNotes] = useState('');

    if (!isOpen || !session) return null;

    const handleAddTopic = () => {
        if (topicInput.trim() && topics.length < 5) {
            setTopics([...topics, topicInput.trim()]);
            setTopicInput('');
        }
    };

    const handleRemoveTopic = (index) => {
        setTopics(topics.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTopic();
        }
    };

    const handleSave = () => {
        console.log('Session ended:', {
            session,
            topics,
            summary,
            privateNotes,
        });
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-[623px] rounded-2xl shadow-xl overflow-hidden"
                style={{ backgroundColor: 'var(--color-bg-card)' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 sm:p-6 border-b min-h-[105px]">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-h4 font-semibold mb-1">
                                End session with {session.clientName}
                            </h2>
                            <p className="text-body-sm">
                                Stops timer and opens session summary.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg hover:opacity-80 transition-all"
                            style={{ color: 'var(--color-text-secondary)' }}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {/* Session Duration */}
                    <div className="py-[10px] px-[16px] h-[56px] rounded-[10px] border border-[#334EAC] bg-[#EFF1F8]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-[#334EAC]" />
                                <span className="text-subtitle font-medium text-[#334EAC]" >
                                    Session Duration
                                </span>
                            </div>
                            <span className="text-h4 font-semibold text-[#334EAC]">
                                50 min
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Start and End Time */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="font-plusJakarta font-medium text-[14px] leading-[14px] tracking-[0px] text-[#333333]">
                                    Start time
                                </label>
                                <div
                                    className="px-3 py-[10px] rounded-[6px] text-body-md bg-[#F3F3F5] text-[#666666] font-plusJakarta font-normal text-[14px] leading-[14px] tracking-[0px]" >
                                    11:00 AM
                                </div>
                            </div>
                            <div>
                                <label className="font-plusJakarta font-medium text-[14px] leading-[14px] tracking-[0px] text-[#333333]">
                                    End time
                                </label>
                                <div
                                    className="px-3 py-[10px] rounded-[6px] text-body-md bg-[#F3F3F5] text-[#666666] font-plusJakarta font-normal text-[14px] leading-[14px] tracking-[0px]">
                                    11:50 AM
                                </div>
                            </div>
                        </div>

                        {/* Topics Covered */}
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Tag className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                                <label className="font-plusJakarta font-medium text-[14px] leading-[14px] tracking-[0px] text-[#333333]">
                                    Topics covered
                                </label>
                            </div>



                            {/* Add Topic Input */}
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    value={topicInput}
                                    onChange={(e) => setTopicInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Add topic and press enter"
                                    disabled={topics.length >= 5}
                                    className="flex-1 px-4 py-2.5 px-3 py-[10px] rounded-[6px] text-body-md bg-[#F3F3F5] text-[#666666] font-plusJakarta font-normal text-[14px] leading-[14px] tracking-[0px] border-0 placeholder:text-[#B3B3B3] text-black-mid"
                                />
                                <button
                                    onClick={handleAddTopic}
                                    disabled={!topicInput.trim() || topics.length >= 5}
                                    className="px-3 h-[36px] rounded-[10px] border border-[#E0E0E0] text-body-md bg-[#F3F3F5] text-[#333333] font-plusJakarta font-normal text-[14px] tracking-[0px] w-full sm:w-auto">
                                    Add
                                </button>
                            </div>
                            <p className="text-caption mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                                Add up to 5 topics
                            </p>

                            {/* Topics List */}
                            {topics.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {topics.map((topic, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-body-sm"
                                            style={{
                                                backgroundColor: 'var(--color-primary-lightest)',
                                                color: 'var(--color-primary)',
                                            }}
                                        >
                                            <span>{topic}</span>
                                            <button
                                                onClick={() => handleRemoveTopic(index)}
                                                className="hover:opacity-70 transition-all"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Summary */}
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Eye className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                                <label className="font-plusJakarta font-medium text-[14px] leading-[14px] tracking-[0px] text-[#333333]">
                                    Summary
                                </label>
                            </div>
                            <textarea
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                placeholder="Brief summary shared with employee"
                                rows={3}
                                className="w-full px-3 py-[10px] rounded-[6px] text-body-md bg-[#F3F3F5] text-[#666666] font-plusJakarta font-normal text-[14px] leading-[14px] tracking-[0px] placeholder:text-[#B3B3B3] text-black-mid border-0" />
                            <p className="text-caption mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                                This will be visible to employee
                            </p>

                        </div>

                        {/* Private Notes */}
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <EyeOff className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                                <label className="font-plusJakarta font-medium text-[14px] leading-[14px] tracking-[0px] text-[#333333]">
                                    Private notes
                                </label>
                            </div>
                            <textarea
                                value={privateNotes}
                                onChange={(e) => setPrivateNotes(e.target.value)}
                                placeholder="Your private observations and notes"
                                rows={3}
                                className="w-full px-3 py-[10px] rounded-[6px] text-body-md bg-[#F3F3F5] text-[#666666] font-plusJakarta font-normal text-[14px] leading-[14px] tracking-[0px] placeholder:text-[#B3B3B3] text-black-mid border-0"
                            />
                            <p className="text-caption mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                                These notes are private and not shared with the client
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 sm:px-6 min-h-[85px] py-4 border-t border-[#EAEAEA] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FAFAFA]">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-body-md font-medium border border-[#E0E0E0] rounded-[10px] h-[36px] order-3 sm:order-1">
                        Close
                    </button>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 order-1 sm:order-2">
                        <button
                            className="flex items-center justify-center gap-2 px-4 py-2 border-[#E0E0E0] rounded-[10px] border text-body-md font-medium transition-all hover:opacity-80 bg-[#FAFAFA]"
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span>Message</span>
                        </button>

                        <button
                            onClick={handleSave}
                            className="px-4 py-2 rounded-[10px] text-body-md font-semibold transition-all hover:opacity-90"
                            style={{
                                backgroundColor: 'var(--color-primary)',
                                color: 'var(--color-text-inverse)',
                            }}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
