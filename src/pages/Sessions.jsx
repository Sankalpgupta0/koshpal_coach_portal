import { useState, useEffect } from 'react';
import { Clock, Calendar, Mail, MessageSquare, Star } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import EndSessionModal from '../components/EndSessionModal';
import SessionDetailsModal from '../components/SessionDetailsModal';
import { getMyConsultations } from '../api';

// Helper for date-fns replacement
const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

const formatDateTime = (date, options) => {
    return new Date(date).toLocaleString('en-US', options);
};

// Mock data for sessions
// const mockSessions = {
//     todayLive: [
//         {
//             id: 5,
//             clientName: 'Sarah Johnson',
//             role: 'Product Manager',
//             company: 'TechCorp',
//             startTime: '10:00 AM',
//             endTime: '10:45 AM',
//             duration: '45 min',
//             avatar: 'SJ',
//             isLive: true,
//             countdown: '0:03',
//         },
//         {
//             id: 6,
//             clientName: 'Sarah Johnson',
//             role: 'Product Manager',
//             company: 'TechCorp',
//             startTime: '10:00 AM',
//             endTime: '10:45 AM',
//             duration: '45 min',
//             avatar: 'SJ',
//             isLive: false,
//         },
//         {
//             id: 7,
//             clientName: 'Sarah Johnson',
//             role: 'Product Manager',
//             company: 'TechCorp',
//             startTime: '10:00 AM',
//             endTime: '10:45 AM',
//             duration: '45 min',
//             avatar: 'SJ',
//             isLive: false,
//         },
//     ],
// };

export default function Sessions() {
    const [activeTab, setActiveTab] = useState('bookedToday');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved === 'true';
    });
    const [isEndSessionModalOpen, setIsEndSessionModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [isSessionDetailsModalOpen, setIsSessionDetailsModalOpen] = useState(false);

    // Dynamic sessions state
    const [dynamicSessions, setDynamicSessions] = useState({
        bookedToday: [],
        upcoming: [],
        history: [],
        todayLive: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabs, setTabs] = useState([
        { id: 'bookedToday', label: 'Booked today', count: 0 },
        { id: 'upcoming', label: 'Upcoming', count: 0 },
        { id: 'todayLive', label: 'Today/ Live', count: 0 },
        { id: 'history', label: 'History', count: 0 },
    ]);

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', String(isSidebarCollapsed));
    }, [isSidebarCollapsed]);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            setError(null);

            // 1. Fetch data for tabs
            const [allData, upcomingData, pastData] = await Promise.all([
                getMyConsultations(), // For "Booked Today" and "Today/Live"
                getMyConsultations('upcoming'),
                getMyConsultations('past')
            ]);

            const today = new Date();

            // 2. Filter "Booked Today" and "Today/Live" on frontend
            const bookedToday = allData.filter(c => {
                const bookedAt = c.booking?.bookedAt ? new Date(c.booking.bookedAt) : null;
                return bookedAt && isSameDay(bookedAt, today);
            });

            const todaySessions = allData.filter(c => {
                const startTime = c.startTime ? new Date(c.startTime) : null;
                return startTime && isSameDay(startTime, today);
            });

            // 3. Update state
            const newDynamicSessions = {
                bookedToday: mapApiToUI(bookedToday),
                upcoming: mapApiToUI(upcomingData),
                history: mapApiToUI(pastData),
                todayLive: mapApiToUI(todaySessions)
            };

            setDynamicSessions(newDynamicSessions);

            // 4. Update tab counts
            setTabs(prev => prev.map(tab => {
                const count = newDynamicSessions[tab.id]?.length || 0;
                return { ...tab, count };
            }));

        } catch (err) {
            console.error('Error fetching sessions:', err);
            setError('Failed to load sessions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const mapApiToUI = (apiData) => {
        return apiData.map(c => {
            const start = new Date(c.startTime);
            const end = new Date(c.endTime);

            return {
                id: c.id,
                clientName: c.booking?.employee?.fullName || 'Unknown',
                role: 'Employee', // Default role if not in API
                company: c.booking?.employee?.company || 'N/A',
                date: start.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }),
                startTime: start.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
                endTime: end.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
                duration: `${Math.round((end - start) / (1000 * 60))} min`,
                avatar: '', // Handled by initials helper
                rating: c.rating || null,
                topicsCovered: [], // Placeholder if not in API
                meetingLink: c.booking?.meetingLink
            };
        });
    };

    const handleReschedule = (session) => {
        console.log('Reschedule session:', session);
    };

    const handleMessage = (session) => {
        console.log('Message client:', session);
    };

    const handleJoinSession = (session) => {
        if (session.meetingLink) {
            window.open(session.meetingLink, '_blank');
        } else {
            console.log('No meeting link available');
        }
    };

    const handleEndSession = (session) => {
        setSelectedSession(session);
        setIsEndSessionModalOpen(true);
    };

    const currentSessions = dynamicSessions[activeTab] || [];

    // Helper function to get initials from name
    const getInitials = (name) => {
        if (!name) return '';
        const names = name.trim().split(' ');
        if (names.length === 1) {
            return names[0].charAt(0).toUpperCase();
        }
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    // Render Today/Live sessions with special layout
    const renderTodayLiveSession = (session, index) => {
        if (session.isLive) {
            // Live session - special card at top
            // return (
            //     <div
            //         key={session.id}
            //         className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-5 py-4 rounded-[12px] border border-[#EAEAEA] mb-4 bg-white gap-4"
            //     >
            //         {/* Left Section - Avatar and Client Info */}
            //         <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
            //             <div className="flex items-center gap-4">
            //                 {/* Avatar */}
            //                 <div
            //                     className="w-12 h-12 rounded-full flex items-center justify-center font-plusJakarta font-medium text-[20px] leading-[24px] tracking-[0px] border-[2px] border-[#348958]"
            //                     style={{
            //                         backgroundColor: 'var(--color-primary-lightest)',
            //                         color: 'var(--color-primary)',
            //                     }}
            //                 >
            //                     {getInitials(session.clientName)}
            //                 </div>

            //                 {/* Client Details with LIVE badge */}
            //                 <div>
            //                     <div className="flex items-center gap-2 mb-0.5">
            //                         <h3 className="font-plusJakarta font-normal text-[14px] leading-[20px] tracking-[0.14px]" style={{ color: 'var(--color-text-primary)' }}>
            //                             {session.clientName}
            //                         </h3>
            //                         <span className="px-[10px] py-[2px] h-[22px] rounded-[16px] text-[10px] font-plusJakarta font-semibold bg-[#348958] text-white-darkest opacity-[0.8921]">
            //                             LIVE
            //                         </span>
            //                     </div>
            //                     <p className="font-plusJakarta font-normal text-[14px] leading-[20px] tracking-[0.14px] text-[#808080]">
            //                         {session.role} • {session.company}
            //                     </p>
            //                 </div>
            //             </div>
            //             {/* Middle Section - Time */}
            //             <div className="flex items-center gap-2 rounded-[10px] border-[0.8px] border-[#0000000F] h-[39px] px-[10px] w-fit">
            //                 <Clock className="w-4 h-4 text-[#334EAC]" />
            //                 <span className="font-plusJakarta font-normal text-[14px] leading-[20px] text-[#1A1A1A]">
            //                     Dec 31, 10:00 AM
            //                 </span>
            //             </div>
            //         </div>

            //         {/* Right Section - Countdown and End Session Button */}
            //         <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            //             {/* Countdown Timer with green dot */}
            //             <div className="flex items-center gap-2 px-3 h-[31px] rounded-[22px] border border-[#348958] bg-white">
            //                 <div className="w-2 h-2 font-consolas font-bold text-[14px] leading-[16px] rounded-full bg-[#348958]"></div>
            //                 <span className="font-consolas font-bold text-[14px] leading-[16px] text-[#348958]">
            //                     {session.countdown}
            //                 </span>
            //             </div>

            //             {/* End Session Button */}
            //             <button
            //                 onClick={() => handleEndSession(session)}
            //                 className="px-4 py-2 min-h-[40px] rounded-[8px] font-plusJakarta font-semibold text-[14px] leading-[20px] transition-all hover:opacity-90 whitespace-nowrap"
            //                 style={{
            //                     backgroundColor: 'var(--color-primary)',
            //                     color: 'var(--color-text-inverse)',
            //                 }}
            //             >
            //                 End Session
            //             </button>
            //         </div>
            //     </div>
            // );
        } else {
            // Upcoming session in timeline format
            return (
                <div
                    key={session.id}
                    className="flex px-[17px] py-[14px] rounded-[12px] border border-[#EAEAEA] mb-4"
                    style={{ borderColor: 'var(--color-border-primary)' }}
                >


                    {/* Session Card */}
                    <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">

                        {/* Left Section - Avatar and Client Info */}
                        <div className="flex gap-4">

                            {/* Time Column */}
                            {/* Desktop Time Section */}
                            <div className="hidden sm:flex flex-col items-center min-w-[60px] sm:min-w-[80px] ">
                                <div className="font-jakarta font-500 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{session.startTime}</div>
                                <div className="w-1 h-6 rounded-[3px] my-2" style={{ backgroundColor: 'var(--color-border-primary)' }}></div>
                                <div className="font-jakarta font-500 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{session.endTime}</div>
                            </div>

                            {/* Avatar */}
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center font-plusJakarta font-medium text-[20px] leading-[24px] tracking-[0px]"
                                style={{
                                    backgroundColor: 'var(--color-primary-lightest)',
                                    color: 'var(--color-primary)',
                                }}
                            >
                                {getInitials(session.clientName)}
                            </div>

                            {/* Client Details */}
                            <div>
                                <h3 className="font-plusJakarta font-normal text-[14px] leading-[20px] tracking-[0.14px]"
                                    style={{ color: 'var(--color-text-primary)' }}
                                >
                                    {session.clientName}
                                </h3>
                                <p className="font-plusJakarta font-normal text-[14px] leading-[20px] tracking-[0.14px] text-[#808080]">
                                    {session.role} • {session.company}
                                </p>

                                {/* Duration Badge */}
                                <div className="inline-flex items-center border border-[#FCC178] px-2 py-1 mt-2 text-xs font-jakarta font-600 rounded-md gap-1 bg-[#FEF9ED] text-[#EB8A14]" >
                                    <Clock className='h-3 w-3 text-[#EB8A14]' /> <p>{session.duration}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 sm:ml-6 w-full sm:w-auto">
                            <button
                                onClick={() => handleJoinSession(session)}
                                className="px-4 py-2 rounded-lg text-body-sm font-semibold transition-all hover:opacity-90 whitespace-nowrap"
                                style={{
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'var(--color-text-inverse)',
                                }}
                            >
                                Join Session
                            </button>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleReschedule(session)}
                                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-body-sm font-medium transition-all hover:opacity-80 flex-1 sm:flex-initial whitespace-nowrap"
                                    style={{
                                        backgroundColor: 'transparent',
                                        borderColor: 'var(--color-border-secondary)',
                                        color: 'var(--color-text-primary)',
                                    }}
                                >
                                    <Calendar className="w-4 h-4" />
                                    <span>Reschedule</span>
                                </button>

                                <button
                                    onClick={() => handleMessage(session)}
                                    className="p-2 rounded-lg border transition-all hover:opacity-80"
                                    style={{
                                        backgroundColor: 'transparent',
                                        borderColor: 'var(--color-border-secondary)',
                                        color: 'var(--color-text-primary)',
                                    }}
                                >
                                    <MessageSquare className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    // Render regular sessions (Booked today, Upcoming, History)
    const renderRegularSession = (session) => {
        // Check if this is a history session
        const isHistory = activeTab === 'history';

        return (
            <div
                key={session.id}
                className="flex flex-col rounded-[12px] border border-[#EAEAEA] sm:flex-row sm:items-center justify-between min-h-[48px] py-4 px-4 sm:px-5 mb-6 gap-4"
            >
                <div className='flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto'>
                    {/* Left Section - Rating (History only) + Avatar and Client Info */}
                    <div className={`flex items-center gap-3 sm:gap-5 ${isHistory ? 'sm:w-[380px]' : 'sm:w-[280px]'}`}>
                        {/* Rating for History */}
                        {isHistory && session.rating && (
                            <div
                                className="flex items-center gap-2 rounded-[10px] border-[2px] border-[#348958] px-[14px] py-[4px] pl-[10px] bg-[#E6F0EA]"
                            >
                                <Star
                                    className="w-5 h-5 fill-current text-[#EB8A14]"
                                />
                                <span className="font-plusJakarta font-semibold text-[18px] leading-[27px] tracking-[0px] text-[#348958]">
                                    {session.rating}/5
                                </span>
                            </div>
                        )}

                        {/* Avatar */}
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center font-plusJakarta font-medium text-[20px] leading-[24px] tracking-[0px] flex-shrink-0"
                            style={{
                                backgroundColor: 'var(--color-primary-lightest)',
                                color: 'var(--color-primary)',
                            }}
                        >
                            {getInitials(session.clientName)}
                        </div>

                        {/* Client Details */}
                        <div className="flex-1">
                            <h3
                                className="font-plusJakarta font-normal text-[14px] leading-[20px] tracking-[0.14px]"
                                style={{ color: 'var(--color-text-primary)' }}
                            >
                                {session.clientName}
                            </h3>
                            <p className="font-plusJakarta font-normal text-[14px] leading-[20px] tracking-[0.14px] text-[#808080]">
                                {session.role} • {session.company}
                            </p>
                        </div>
                    </div>

                    {/* Middle Section - Date/Time */}
                    <div className="flex items-center gap-2 rounded-[10px] border-[0.8px] border-[#0000000F] h-[39px] px-[10px] w-fit whitespace-nowrap">
                        {isHistory ? (
                            // Date and duration for history
                            <>
                                <Clock className="w-4 h-4 text-[#334EAC] flex-shrink-0" />
                                <span className="text-body-md whitespace-nowrap" style={{ color: 'var(--color-text-primary)' }}>
                                    {session.date}
                                </span>
                                {session.duration && (
                                    <span
                                        className="px-3 py-1 text-body-sm font-medium ml-2 bg-[#FEF9ED] border border-[#FCC178] rounded-[6px] text-[#EB8A14] whitespace-nowrap"
                                    >
                                        {session.duration}
                                    </span>
                                )}
                            </>
                        ) : (
                            // Regular date/time display
                            <>
                                <Clock className="w-4 h-4 text-[#334EAC] flex-shrink-0" />
                                <span className="text-body-md whitespace-nowrap" style={{ color: 'var(--color-text-primary)' }}>
                                    {session.date}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Right Section - Action Buttons */}
                <div className="flex items-center gap-2 sm:gap-3 sm:ml-6 w-full sm:w-auto">
                    {isHistory ? (
                        // View Details button for history
                        <button
                            onClick={() => {
                                setSelectedSession(session);
                                setIsSessionDetailsModalOpen(true);
                            }}
                            className="px-4 py-2 rounded-lg border text-body-sm font-medium transition-all hover:opacity-80 w-full sm:w-auto whitespace-nowrap"
                            style={{
                                backgroundColor: 'transparent',
                                borderColor: 'var(--color-border-secondary)',
                                color: 'var(--color-text-primary)',
                            }}
                        >
                            View details
                        </button>
                    ) : (
                        // Reschedule and Message buttons for other tabs
                        <>
                            <button
                                onClick={() => handleReschedule(session)}
                                className="flex items-center justify-center gap-2 px-4 py-2 min-h-[36px] rounded-[8px] border border-[#999999] font-plusJakarta font-semibold text-[12px] leading-[20px] tracking-[0px] text-[#666666] flex-1 sm:flex-initial sm:min-w-[133px] whitespace-nowrap"
                            >
                                <Calendar className="w-4 h-4 text-[#666666]" />
                                <span>Reschedule</span>
                            </button>

                            <button
                                onClick={() => handleMessage(session)}
                                className="flex items-center justify-center gap-2 px-4 min-h-[36px] py-2 rounded-[8px] border border-[#999999] font-plusJakarta font-semibold text-[12px] leading-[20px] tracking-[0px] text-[#666666] flex-1 sm:flex-initial sm:min-w-[117px] whitespace-nowrap"
                            >
                                <Mail className="w-4 h-4 text-[#666666]" />
                                <span>Message</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            <div
                className={`flex-1 flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
                    } ${isSidebarOpen ? 'lg:blur-0 blur-[2px]' : ''}`}
                style={{ backgroundColor: 'var(--color-bg-secondary)' }}
            >
                <Header title="Sessions" onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 p-4 overflow-y-auto sm:p-6">
                    <div className="mx-auto max-w-7xl">
                        {/* Description */}
                        <div className="mb-6">
                            <p className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>
                                Manage your weekly availability. Koshpal may schedule sessions within these windows.
                            </p>
                        </div>

                        <div className="rounded-[12px] px-[20px] py-[20px]" style=
                            {{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)' }}>
                            {/* Tabs */}
                            <div className="flex items-center gap-2 sm:gap-6 mb-6 min-h-[48px] w-full overflow-x-auto">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center justify-center min-h-[37px] gap-2 px-3 sm:px-2 py-1 rounded-lg text-body-md font-medium transition-all whitespace-nowrap flex-1 sm:w-full
                                             ${activeTab === tab.id ? '' : 'hover:opacity-80'
                                            }`}
                                        style={{
                                            backgroundColor:
                                                activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
                                            color:
                                                activeTab === tab.id
                                                    ? 'var(--color-text-inverse)'
                                                    : 'var(--color-text-primary)',
                                        }}
                                    >
                                        <span className="text-xs sm:text-sm">{tab.label}</span>
                                        <span
                                            className="w-[18px] h-[18px] px-2 py-[2px] flex items-center justify-center rounded-full font-semibold text-[10px] font-plusJakarta flex-shrink-0"
                                            style={{
                                                backgroundColor: '#ef4444',
                                                color: '#ffffff',
                                            }}
                                        >
                                            {tab.count}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Sessions List */}
                            <div className="gap-y-6">
                                {loading ? (
                                    <div className="flex items-center justify-center py-20">
                                        <div className="text-center">
                                            <div className="w-16 h-16 mx-auto mb-4 border-4 rounded-full border-t-transparent animate-spin"
                                                style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}></div>
                                            <p style={{ color: 'var(--color-text-secondary)' }}>Loading sessions...</p>
                                        </div>
                                    </div>
                                ) : error ? (
                                    <div className="flex items-center justify-center py-20">
                                        <div className="p-6 text-center rounded-lg" style={{ backgroundColor: 'var(--color-bg-card)' }}>
                                            <p style={{ color: 'var(--color-error)' }}>{error}</p>
                                            <button
                                                onClick={fetchSessions}
                                                className="px-6 py-2 mt-4 rounded-lg"
                                                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    </div>
                                ) : currentSessions.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <p className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>
                                            No sessions found in this category.
                                        </p>
                                    </div>
                                ) : (
                                    currentSessions.map((session, index) =>
                                        activeTab === 'todayLive'
                                            ? renderTodayLiveSession(session, index)
                                            : renderRegularSession(session)
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>


            <EndSessionModal
                isOpen={isEndSessionModalOpen}
                onClose={() => setIsEndSessionModalOpen(false)}
                session={selectedSession}
            />

            <SessionDetailsModal
                isOpen={isSessionDetailsModalOpen}
                onClose={() => setIsSessionDetailsModalOpen(false)}
                session={selectedSession}
            />
        </div>
    );
}
