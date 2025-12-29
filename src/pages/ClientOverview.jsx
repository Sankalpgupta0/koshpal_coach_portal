import React, { useState, useEffect } from 'react';
import { Search, X, Video, Calendar, TrendingUp, Clock, ChevronRight, Bell, ArrowLeft, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';


export default function ClientOverview() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const handleBackToClients = () => {
    navigate('/clients');
  };

  const clientData = {
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
  const engagementData = [
    { month: 'May', sessions: 3 },
    { month: 'Jun', sessions: 5 },
    { month: 'Jul', sessions: 1 },
    { month: 'Aug', sessions: 4 },
    { month: 'Sep', sessions: 5 },
    { month: 'Oct', sessions: 2 }
  ];
  const sessionData = [
    {
      id: 1,
      date: 'Nov 10',
      time: '09:00 AM',
      type: 'group Session',
      duration: '60 minutes',
      status: 'scheduled',
      rating: null,
      message: null
    },
    {
      id: 2,
      date: 'Nov 8',
      time: '09:00 AM',
      type: 'group Session',
      duration: '60 minutes',
      status: 'completed',
      rating: '4.0',
      message: 'Good progress on career goals. Discussed transition strategy.'
    },
    {
      id: 3,
      date: 'Nov 15',
      time: '03:30 PM',
      type: 'group Session',
      duration: '60 minutes',
      status: 'scheduled',
      rating: null,
      message: null
    },
    {
      id: 4,
      date: 'Oct 15',
      time: '11:00 AM',
      type: '1-on-1 Session',
      duration: '45 minutes',
      status: 'completed',
      rating: '4.5',
      message: 'Excellent session. Client showed great improvement.'
    }
  ];

  const tabs = [
    { id: 'Overview', label: 'Overview' },
    { id: 'Sessions', label: 'Sessions' },
    { id: 'Notes', label: `Notes (1)` },
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
            {/* Header */}
      <div className="py-3 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 h-10">
            <button 
              onClick={handleBackToClients}
              className="hover:opacity-80 rounded-lg transition-all h-8 w-8 sm:h-6 sm:w-6 flex items-center justify-center"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              <ArrowLeft className="w-[7.78px] h-[12.73px]" />
            </button>
            <h1 className="text-h3" style={{ color: 'var(--color-text-primary)' }}>
              Overview
            </h1>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Search Bar */}
            <div className="relative rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.08)] flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <input
                placeholder="Search"
                className="w-full sm:w-48 lg:w-64 pl-9 pr-9 py-2 text-sm border rounded-full focus:ring-2 focus:ring-[#5AB9C9] outline-none"
              />
              <X className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 cursor-pointer" />
            </div>
              
              {/* Join Session Button */}
              <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-jakarta font-medium text-sm hover:opacity-90 transition-all" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}>
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">Join Session</span>
                <span className="sm:hidden">Join</span>
              </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="">
        {/* Client Information Section */}
        <div className="rounded-[12px] border-[0.8px] p-4 sm:p-6 mb-6 mx-4 sm:mx-6" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)' }}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-7">
            <div className="flex items-start gap-4">
              {/* Client Avatar */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-lightest rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-outfit font-medium text-xl sm:text-[24px] text-primary-primary">
                  {clientData.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              
              {/* Client Details */}
              <div className="min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <h2 className="font-outfit font-medium text-base leading-6 tracking-normal truncate">
                    {clientData.name}
                  </h2>
                  <span className="px-2 py-1 font-plus font-semibold text-[10px] leading-[13.33px] tracking-normal rounded-[6px] inline-flex items-center flex-shrink-0" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-text-inverse)' }}>
                    {clientData.company}
                  </span>
                </div>
                <p className="font-plus font-normal text-sm leading-6 tracking-normal text-grey-mid">
                  {clientData.role}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                  <span className="font-plus font-medium text-sm text-[#334EAC]">
                    {clientData.totalSessions} sessions completed
                  </span>
                  <span className="hidden sm:inline w-1 h-1 bg-grey-mid rounded-full"></span>
                  <span className="font-plus font-medium text-sm text-[#334EAC]">
                    {clientData.scheduledSessions} Scheduled
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-col sm:flex-row gap-2 mt-6 h-auto sm:h-[48px] bg-[#F9F9F9] rounded-xl p-1 shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-auto sm:h-[37px] flex-1 flex items-center justify-center gap-2 py-2 px-2 sm:py-1 rounded-[8px] transition-colors text-xs sm:text-sm ${
                  activeTab === tab.id
                    ? 'bg-[#334EAC] text-white-darkest shadow-[0px_6px_14px_rgba(0,0,0,0.17)] font-sans font-normal leading-5 tracking-normal'
                    : 'font-arial font-normal hover:bg-grey-lightest'
                }`}
              >
                <span className="truncate">{tab.label}</span>
                {tab.id === 'Sessions' && <span className="bg-[#17A2B8] text-white-darkest font-plus font-semibold text-[10px] w-[18px] h-[18px] px-1 rounded-full flex-shrink-0">1</span>}
                {tab.id === 'Notes' && <span className="bg-[#17A2B8] text-white-darkest font-plus font-semibold text-[10px] w-[18px] h-[18px] px-1 rounded-full flex-shrink-0">10</span>}
                {tab.id === 'Messages' && <span className="bg-[#17A2B8] text-white-darkest font-plus font-semibold text-[10px] w-[18px] h-[18px] px-1 rounded-full flex-shrink-0">3</span>}
              </button>
            ))}
          </div>

            {/* Overview Content */}
            {activeTab === 'Overview' && (
            <div className="space-y-6 mt-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {/* Total Sessions Card */}
                    <div className="bg-white-darkest rounded-xl border border-grey-lightest p-4 sm:p-6 flex flex-col justify-between min-h-[140px] sm:h-[177px]">
                        <h3 className="font-plus font-normal text-sm leading-[14px] tracking-normal text-[#808080]">
                        Total Sessions
                        </h3>
                        <div>
                            <p className="font-plus font-semibold text-2xl sm:text-[32px] leading-7 sm:leading-[48px] tracking-normal text-[#333333]">
                            {clientData.totalSessions}
                            </p>
                            <p className="font-plus font-normal text-sm leading-5 tracking-[0.14px] text-[#999999]">
                            {clientData.totalSessions} completed
                            </p>
                        </div>
                    </div>

                    {/* Engagement Card */}
                    <div className="bg-white-darkest rounded-xl border border-grey-lightest p-4 sm:p-6 flex flex-col justify-between min-h-[140px] sm:h-[177px]">
                        <h3 className="font-plus font-normal text-sm leading-[14px] tracking-normal text-[#808080]">
                        Engagement
                        </h3>
                        <div>
                            <p className="font-plus font-semibold text-2xl sm:text-[32px] leading-7 sm:leading-[48px] tracking-normal text-[#333333]">
                            {clientData.engagement}
                            </p>
                            <p className="font-plus font-normal text-sm leading-5 tracking-[0.14px] text-[#999999]">
                            Last session: {clientData.lastSession}
                            </p>
                        </div>
                    </div>

                    {/* Upcoming Session Card */}
                    <div className="bg-white-darkest rounded-xl border border-grey-lightest p-4 sm:p-6 flex flex-col justify-between min-h-[140px] sm:h-[177px]">
                        <h3 className="font-plus font-normal text-sm leading-[14px] tracking-normal text-[#808080]">
                        Upcoming Session
                        </h3>
                        <div>
                            <p className="font-plus font-semibold text-2xl sm:text-[32px] leading-7 sm:leading-[48px] tracking-normal text-[#333333]">
                            {clientData.upcomingSession.date}
                            </p>
                            <p className="font-plus font-normal text-sm leading-5 tracking-[0.14px] text-[#999999]">
                            {clientData.upcomingSession.time}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Engagement Trend */}
                <div className="bg-white-darkest rounded-xl border border-grey-lightest p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-4 sm:mb-6">
                        <TrendingUp className="w-5 h-5 text-[#4CAF50]" />
                        <h3 className="font-outfit font-medium text-base sm:text-[18px] leading-5 sm:leading-[27px] text-[#333333]">
                            Engagement Trend
                        </h3>
                    </div>
                    <div className="flex items-end justify-between h-32 sm:h-48 px-2">
                        {engagementData.map((data, index) => (
                            <div key={data.month} className="flex flex-col items-center flex-1 mx-0.5">
                                <div
                                    className="w-full bg-[#4E986D] rounded-t-lg flex items-center justify-center text-white-darkest font-jakarta font-medium text-xs"
                                    style={{ height: `${data.sessions * 20}px` }}
                                >
                                    {data.sessions > 0 && data.sessions}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-grey-mid font-jakarta">
                        <span>{engagementData[0].month}</span>
                        <span>{engagementData[engagementData.length - 1].month}</span>
                    </div>
                </div>
            </div>
            )}



             {/* Session History Content */}
        {activeTab === 'Sessions' && (
          <div className="mt-6 space-y-6 bg-white-darkest rounded-lg border border-grey-lightest p-4 sm:p-6 mx-4 sm:mx-6">
            <h3 className="font-plus font-normal text-base leading-4 tracking-normal text-[#333333]">Session History</h3>
            
            {/* Session Cards */}
            <div className="space-y-3">
              {sessionData.map((session) => (
                <div key={session.id} className="bg-white-darkest rounded-lg border border-grey-lightest p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="text-center w-[80px] sm:w-[96px] h-[40px] sm:h-[43px] flex-shrink-0">
                        <p className="font-plus font-normal text-sm leading-[21px] tracking-normal text-[#333333]">{session.date}</p>
                        <p className="font-plus font-normal text-xs leading-[18px] tracking-normal text-grey-mid">{session.time}</p>
                      </div>
                      <div className="hidden sm:block w-px h-12 bg-grey-lightest"></div>
                      <div className="flex flex-col justify-center flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <p className="font-jakarta text-sm font-medium text-[#333333] truncate">{session.type}</p>
                          <span className={`w-[75px] lg:w-auto px-2 py-[2px] font-plus font-medium text-xs leading-4 tracking-normal rounded-[10px] inline-flex items-center ${
                            session.status === 'scheduled' 
                              ? 'bg-[#E0F7FA] text-[#00BCD4]' 
                              : 'bg-[#E6F0EA] text-[#348958]'
                          }`}>
                            {session.status}
                          </span>
                        </div>
                        <p className="font-plus font-normal text-sm leading-6 tracking-normal text-grey-mid">{session.duration}</p>
                        {session.message && (
                          <p className="font-sans font-normal italic text-sm leading-6 tracking-normal text-grey-mid mt-1 line-clamp-2">"{session.message}"</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {session.status === 'scheduled' ? (
                        <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary-primary text-white-darkest rounded-lg font-jakarta font-medium text-sm hover:bg-primary-darkest transition-colors">
                          <Video className="w-4 h-4" />
                          <span className="hidden sm:inline">Join</span>
                        </button>
                      ) : (
                        <span className="text-[#EB8A14] text-sm font-medium">{session.rating} ★</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


         {activeTab === 'Notes' && (
          <div className="space-y-6 pt-6 mx-4 sm:mx-6">
            {/* Add New Note Section */}
            <div className="bg-white-darkest rounded-xl border border-grey-lightest p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),_0_1px_3px_0_rgba(0,0,0,0.1)]">
              <h3 className="font-jakarta font-normal text-base leading-4 tracking-normal">Add New Note</h3>
              <textarea
                className="w-full bg-[#F5F5F5] p-3 sm:p-4 h-[64px] sm:h-auto border-[0.8px] border-[#00000000] rounded-lg font-jakarta font-normal text-sm leading-5 text-[#333333] resize-none focus:outline-none focus:ring-2 focus:ring-primary-primary focus:border-transparent"
                rows="3"
                placeholder="Write your private coaching notes here... (These are only visible to you and will be anonymized in exports)"
              ></textarea>
              <div className="flex justify-end mt-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#334EAC] text-white-darkest font-jakarta text-sm font-medium rounded-lg hover:bg-[#2a3d8a] transition-colors">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.3333 5.33331V12.6666C13.3333 13.0202 13.1894 13.3594 12.9393 13.6095C12.6892 13.8596 12.35 14 11.9967 14H4.00333C3.64999 14 3.31081 13.8596 3.0607 13.6095C2.81059 13.3594 2.66666 13.0202 2.66666 12.6666V3.33331C2.66666 2.97969 2.81059 2.64051 3.0607 2.3904C3.31081 2.14029 3.64999 2 4.00333 2H10L13.3333 5.33331Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 7.33331V10.6666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.66666 9.33331H9.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="hidden sm:inline">Save Note</span>
                  <span className="sm:hidden">Save</span>
                </button>
              </div>
            </div>

            {/* Previous Notes Section */}
            <div className="space-y-4 bg-white-darkest rounded-xl border border-grey-lightest p-4 sm:p-6 shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),_0_1px_3px_0_rgba(0,0,0,0.1)]">
              <h3 className="font-outfit font-semibold text-base sm:text-[18px] leading-5 sm:leading-[18px] tracking-[0.18px] text-[#333333]">Previous Notes</h3>
              
              {/* Note Card */}
              <div className="bg-[#F5F5F5] rounded-xl border border-[0.8px] border-[#00000000] p-3 sm:p-4 space-y-2">
                <p className="font-jakarta text-sm text-[#333333] line-clamp-3">
                  Working on leadership transition. Confident and making good progress.
                </p>
                <p className="font-jakarta text-xs text-grey-mid">
                  Oct 20, 2025, 11:00 AM
                </p>
              </div>
            </div>
          </div>
        )}

        </div>

        

       

       

        {activeTab === 'Messages' && (
          <div className="bg-white-darkest rounded-xl border border-grey-lightest p-4 sm:p-6 mx-4 sm:mx-6">
            <p className="font-jakarta text-grey-mid">Messages content will be displayed here.</p>
          </div>
        )}
      </div>
          </div>
        </main>
      </div>
    </div>
  );
}
