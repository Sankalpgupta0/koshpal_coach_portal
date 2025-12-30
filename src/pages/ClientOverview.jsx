import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Video, Calendar, TrendingUp, Clock, ChevronRight, Bell, ArrowLeft, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { getMyConsultations } from '../api';


export default function ClientOverview() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });
  const [hoveredBar, setHoveredBar] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const client = location.state?.client;

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Fetch consultations for the client
  useEffect(() => {
    if (client) {
      fetchClientConsultations();
    }
  }, [client]);

  const fetchClientConsultations = async () => {
    try {
      setLoading(true);
      const allConsultations = await getMyConsultations();
      const clientConsultations = allConsultations.filter(c => c.booking?.employee?.id === client.id);
      console.log(allConsultations);
      setConsultations(clientConsultations);
    } catch (error) {
      console.error('Error fetching client consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if no client data
  useEffect(() => {
    if (!client) {
      navigate('/clients');
    }
    // console.log(client);
  }, [client, navigate]);

  const handleBackToClients = () => {
    navigate('/clients');
  };

  // Use client data if available, otherwise fallback
  const clientData = useMemo(() => {
    // Try to get company from consultations data first
    const companyFromConsultations = consultations.find(c => c.booking?.employee?.company)?.booking.employee.company;

    return client ? {
      name: client.name,
      role: client.role || 'Employee',
      company: companyFromConsultations || client.plan || 'N/A',
      totalSessions: consultations.length,
      completedSessions: consultations.filter(c => c.status === 'COMPLETED').length,
      scheduledSessions: consultations.filter(c => c.status === 'CONFIRMED').length,
      engagement: 'Active', // Placeholder
      lastSession: client.lastSession,
      upcomingSession: client.nextSession ? {
        date: client.nextSession,
        time: '10:20 AM' // Placeholder
      } : null
    } : {
      name: 'Harsh Kumar',
      role: 'Marketing Manager',
      company: 'Tech Solutions Pvt Ltd',
      totalSessions: 12,
      completedSessions: 12,
      scheduledSessions: 2,
      engagement: 'Active',
      lastSession: 'Oct 20',
      upcomingSession: {
        date: '12 May',
        time: '10:20 AM'
      }
    };
  }, [client, consultations]);

  // Log client data for debugging
  // console.log('Client data:', clientData);
  // console.log('Consultations:', consultations);
  // Generate engagement data from consultations
  const engagementData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const sessionsByMonth = {};

    // Initialize prev 3, current, and next 2 months
    const now = new Date();
    for (let i = -3; i <= 2; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      sessionsByMonth[monthKey] = {
        month: monthNames[date.getMonth()],
        year: date.getFullYear(),
        sessions: 0,
        fullDate: date,
        isCurrentMonth: i === 0
      };
    }

    // Count sessions per month
    consultations.forEach(consultation => {
      const date = new Date(consultation.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (sessionsByMonth[monthKey]) {
        sessionsByMonth[monthKey].sessions += 1;
      }
    });

    return Object.values(sessionsByMonth).sort((a, b) => a.fullDate - b.fullDate);
  }, [consultations]);

  const sessionData = useMemo(() => consultations.map(consultation => (
    console.log(consultation),
    {
    id: consultation.id,
    date: new Date(consultation.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    time: new Date(consultation.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    type: 'Session', // Placeholder
    duration: `${Math.round((new Date(consultation.endTime) - new Date(consultation.startTime)) / (1000 * 60))} minutes`,
    status: (() => {
      const now = new Date();
      const startTime = new Date(consultation.startTime);
      const endTime = new Date(consultation.endTime);
      
      // If consultation has started and not yet ended, it's in progress
      if (startTime <= now && endTime > now && consultation.booking?.status === 'CONFIRMED') {
        return 'scheduled';
      }
      
      // If consultation has ended, show as completed regardless of booking status
      if (endTime <= now) {
        return 'completed';
      }
      
      // Otherwise use booking status
      return consultation.booking?.status === 'CONFIRMED' ? 'scheduled' : 
             consultation.booking?.status === 'COMPLETED' ? 'completed' : 
             (consultation.booking?.status || 'unknown').toLowerCase();
    })(),
    rating: consultation.rating || null,
    message: consultation.notes || null
  })), [consultations]);

  const tabs = [
    { id: 'Overview', label: 'Overview' },
    { id: 'Sessions', label: 'Sessions' },
    { id: 'Notes', label: `Notes (0)` },
    { id: 'Messages', label: 'Messages' }
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        } ${isSidebarOpen ? 'lg:blur-0 blur-[2px]' : ''}`}
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      >
        
        <Header 
          title="Client Overview" 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />

        <main className="flex-1 p-4 overflow-y-auto sm:p-6">
          <div className="mx-auto space-y-6 max-w-7xl">

      {/* Main Content */}
      <div className="">
        {/* Client Information Section */}
        <div className="rounded-[12px] border-[0.8px] p-4 sm:p-6 mb-6 mx-4 sm:mx-6" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)' }}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between pb-7">
            <div className="flex items-start gap-4">
              {/* Client Avatar */}
              <div className="flex items-center justify-center flex-shrink-0 rounded-full w-14 h-14 sm:w-16 sm:h-16" style={{ backgroundColor: 'var(--color-primary-light)' }}>
                <span className="font-outfit font-medium text-xl sm:text-[24px]" style={{ color: 'var(--color-primary)' }}>
                  {clientData.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              
              {/* Client Details */}
              <div className="min-w-0">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <h2 className="font-medium leading-6 tracking-normal truncate font-outfit" style={{ color: 'var(--color-text-primary)' }}>
                    {clientData.name}
                  </h2>
                  <span className="px-2 py-1 font-plus font-semibold text-[10px] leading-[13.33px] tracking-normal rounded-[6px] inline-flex items-center flex-shrink-0" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-text-inverse)' }}>
                    {clientData.company}
                  </span>
                </div>
                <p className="text-sm font-normal leading-6 tracking-normal font-plus" style={{ color: 'var(--color-text-secondary)' }}>
                  {clientData.role}
                </p>
                <div className="flex flex-col gap-1 mt-1 sm:flex-row sm:items-center sm:gap-2">
                  <span className="text-sm font-medium font-plus" style={{ color: 'var(--color-primary)' }}>
                    {clientData.totalSessions} sessions completed
                  </span>
                  <span className="hidden w-1 h-1 rounded-full sm:inline" style={{ backgroundColor: 'var(--color-text-secondary)' }}></span>
                  <span className="text-sm font-medium font-plus" style={{ color: 'var(--color-primary)' }}>
                    {clientData.scheduledSessions} Scheduled
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-col sm:flex-row gap-2 mt-6 h-auto sm:h-[48px] rounded-xl p-1" style={{ backgroundColor: 'var(--color-bg-tertiary)', boxShadow: 'var(--shadow-lg)' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-auto sm:h-[37px] flex-1 flex items-center justify-center gap-2 py-2 px-2 sm:py-1 rounded-[8px] transition-colors text-xs sm:text-sm ${
                  activeTab === tab.id
                    ? 'font-sans font-normal leading-5 tracking-normal'
                    : 'font-arial font-normal hover:opacity-80'
                }`}
                style={{
                  backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--color-text-inverse)' : 'var(--color-text-primary)'
                }}
              >
                <span className="truncate">{tab.label}</span>
                {tab.id === 'Sessions' && <span className="font-plus font-semibold text-[10px] w-[18px] h-[18px] px-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-text-inverse)' }}>{consultations.length}</span>}
                {tab.id === 'Notes' && <span className="font-plus font-semibold text-[10px] w-[18px] h-[18px] px-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-text-inverse)' }}>0</span>}
                {tab.id === 'Messages' && <span className="font-plus font-semibold text-[10px] w-[18px] h-[18px] px-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-text-inverse)' }}>0</span>}
              </button>
            ))}
          </div>

            {/* Overview Content */}
            {activeTab === 'Overview' && (
            <div className="mt-4 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                    {/* Total Sessions Card */}
                    <div className="rounded-xl border p-4 sm:p-6 flex flex-col justify-between min-h-[140px] sm:h-[177px]" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)' }}>
                        <h3 className="font-plus font-normal text-sm leading-[14px] tracking-normal" style={{ color: 'var(--color-text-secondary)' }}>
                        Total Sessions
                        </h3>
                        <div>
                            <p className="font-plus font-semibold text-2xl sm:text-[32px] leading-7 sm:leading-[48px] tracking-normal" style={{ color: 'var(--color-text-primary)' }}>
                            {clientData.totalSessions}
                            </p>
                            <p className="font-plus font-normal text-sm leading-5 tracking-[0.14px]" style={{ color: 'var(--color-text-secondary)' }}>
                            {clientData.totalSessions} completed
                            </p>
                        </div>
                    </div>

                    {/* Engagement Card */}
                    <div className="rounded-xl border p-4 sm:p-6 flex flex-col justify-between min-h-[140px] sm:h-[177px]" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)' }}>
                        <h3 className="font-plus font-normal text-sm leading-[14px] tracking-normal" style={{ color: 'var(--color-text-secondary)' }}>
                        Engagement
                        </h3>
                        <div>
                            <p className="font-plus font-semibold text-2xl sm:text-[32px] leading-7 sm:leading-[48px] tracking-normal" style={{ color: 'var(--color-text-primary)' }}>
                            {clientData.engagement}
                            </p>
                            <p className="font-plus font-normal text-sm leading-5 tracking-[0.14px]" style={{ color: 'var(--color-text-secondary)' }}>
                            Last session: {clientData.lastSession}
                            </p>
                        </div>
                    </div>

                    {/* Upcoming Session Card */}
                    <div className="rounded-xl border p-4 sm:p-6 flex flex-col justify-between min-h-[140px] sm:h-[177px]" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)' }}>
                        <h3 className="font-plus font-normal text-sm leading-[14px] tracking-normal" style={{ color: 'var(--color-text-secondary)' }}>
                        Upcoming Session
                        </h3>
                        <div>
                            <p className="font-plus font-semibold text-2xl sm:text-[32px] leading-7 sm:leading-[48px] tracking-normal" style={{ color: 'var(--color-text-primary)' }}>
                            {clientData.upcomingSession.date}
                            </p>
                            <p className="font-plus font-normal text-sm leading-5 tracking-[0.14px]" style={{ color: 'var(--color-text-secondary)' }}>
                            {clientData.upcomingSession.time}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Engagement Trend */}
                <div className="p-4 border rounded-xl sm:p-6" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)' }}>
                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                        <TrendingUp className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
                        <h3 className="font-outfit font-medium text-base sm:text-[18px] leading-5 sm:leading-[27px]" style={{ color: 'var(--color-text-primary)' }}>
                            Engagement Trend
                        </h3>
                    </div>
                    <div className="relative flex items-end justify-between h-32 px-2 sm:h-48">
                        {(() => {
                            const maxSessions = Math.max(...engagementData.map(d => d.sessions), 1);
                            const maxHeight = 120; // pixels
                            const scaleFactor = maxHeight / maxSessions;

                            return engagementData.map((data, index) => (
                                <div key={`${data.month}-${data.year}-${index}`} className="flex flex-col items-center flex-1 mx-0.5 relative">
                                    <div
                                        className={`w-full rounded-t-lg flex items-end justify-center font-jakarta font-medium text-xs transition-all duration-200 cursor-pointer ${
                                            data.isCurrentMonth ? 'opacity-90' : ''
                                        } ${hoveredBar === index ? 'opacity-80' : ''}`}
                                        style={{ 
                                            height: `${Math.max(data.sessions * scaleFactor, 4)}px`,
                                            backgroundColor: data.isCurrentMonth ? 'var(--color-secondary)' : 'var(--color-success)',
                                            color: 'var(--color-text-inverse)'
                                        }}
                                        onMouseEnter={() => setHoveredBar(index)}
                                        onMouseLeave={() => setHoveredBar(null)}
                                    >
                                        {data.sessions > 0 && (
                                            <span className="mb-1 text-xs font-semibold">
                                                {data.sessions}
                                            </span>
                                        )}
                                    </div>
                                    {/* Hover tooltip */}
                                    {hoveredBar === index && (
                                        <div className="absolute z-10 px-2 py-1 text-xs font-medium transform -translate-x-1/2 rounded -top-8 left-1/2 whitespace-nowrap" style={{ backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border-primary)' }}>
                                            {data.sessions} session{data.sessions !== 1 ? 's' : ''} in {data.month} {data.year}
                                        </div>
                                    )}
                                </div>
                            ));
                        })()}
                    </div>
                    <div className="flex justify-between px-2 mt-2 text-xs font-jakarta" style={{ color: 'var(--color-text-secondary)' }}>
                        {engagementData.map((data) => (
                            <span key={`${data.month}-${data.year}`} className="flex-1 text-center">
                                {data.month}{data.year !== new Date().getFullYear() ? ` ${data.year}` : ''}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            )}



             {/* Session History Content */}
        {activeTab === 'Sessions' && (
          <div className="p-4 mx-4 mt-6 space-y-6 border rounded-lg sm:p-6 sm:mx-6" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)' }}>
            <h3 className="text-base font-normal leading-4 tracking-normal font-plus" style={{ color: 'var(--color-text-primary)' }}>Session History</h3>
            
            {/* Session Cards */}
            <div className="space-y-3">
              {sessionData.map((session) => (
                <div key={session.id} className="p-3 border rounded-lg sm:p-4" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)' }}>
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-4 sm:items-center">
                      <div className="text-center w-[80px] sm:w-[96px] h-[40px] sm:h-[43px] flex-shrink-0">
                        <p className="font-plus font-normal text-sm leading-[21px] tracking-normal" style={{ color: 'var(--color-text-primary)' }}>{session.date}</p>
                        <p className="font-plus font-normal text-xs leading-[18px] tracking-normal" style={{ color: 'var(--color-text-secondary)' }}>{session.time}</p>
                      </div>
                      <div className="hidden w-px h-12 sm:block" style={{ backgroundColor: 'var(--color-border-primary)' }}></div>
                      <div className="flex flex-col justify-center flex-1 min-w-0">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                          <p className="text-sm font-medium truncate font-jakarta" style={{ color: 'var(--color-text-primary)' }}>{session.type}</p>
                          <span className={`w-[75px] lg:w-auto px-2 py-[2px] font-plus font-medium text-xs leading-4 tracking-normal rounded-[10px] inline-flex items-center ${
                            session.status === 'scheduled'
                              ? ''
                              : ''
                          }`} style={{
                            backgroundColor: session.status === 'scheduled' ? 'var(--color-info)' : 'var(--color-success)',
                            color: 'var(--color-text-inverse)',
                            opacity: 0.9
                          }}>
                            {session.status}
                          </span>
                        </div>
                        <p className="text-sm font-normal leading-6 tracking-normal font-plus" style={{ color: 'var(--color-text-secondary)' }}>{session.duration}</p>
                        {session.message && (
                          <p className="mt-1 font-sans text-sm italic font-normal leading-6 tracking-normal line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>{"\"" + session.message + "\""}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center flex-shrink-0 gap-1">
                      {session.status === 'scheduled' ? (
                        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-lg sm:px-4 font-jakarta hover:opacity-90" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}>
                          <Video className="w-4 h-4" />
                          <span className="hidden sm:inline">Join</span>
                        </button>
                      ) : (
                        <span className="text-sm font-medium" style={{ color: 'var(--color-warning)' }}>{session.rating} ★</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


         {activeTab === 'Notes' && (
          <div className="pt-6 mx-4 space-y-6 sm:mx-6">
            <div className="p-4 border bg-[var(--color-bg-primary)] rounded-xl border-[var(--color-border)] sm:p-6">
              <p className="font-jakarta text-[var(--color-text-secondary)]">This feature is for phase 2</p>
            </div>
          </div>
        )}

        </div>

        

       

       

        {activeTab === 'Messages' && (
          <div className="p-4 mx-4 border bg-[var(--color-bg-primary)] rounded-xl border-[var(--color-border)] sm:p-6 sm:mx-6">
            <p className="font-jakarta text-[var(--color-text-secondary)]">This feature is for phase 2</p>
          </div>
        )}
      </div>
          </div>
        </main>
      </div>
    </div>
  );
}
