import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { getMyConsultations, getConsultationStats } from '../api';

export default function Calendar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  });

  // State for consultations and stats
  const [consultations, setConsultations] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    past: 0,
    upcoming: 0,
    thisMonth: 0,
    confirmed: 0,
    cancelled: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch consultations and stats for the current week
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [consultationsData, statsData] = await Promise.all([
          getMyConsultations(), // Get all consultations
          getConsultationStats()
        ]);
        
        // Filter consultations for the current week
        const weekEnd = new Date(currentWeekStart);
        weekEnd.setDate(currentWeekStart.getDate() + 7);
        
        const weekConsultations = consultationsData.filter(consultation => {
          const slotDate = new Date(consultation.date);
          return slotDate >= currentWeekStart && slotDate < weekEnd;
        });
        
        setConsultations(weekConsultations);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching consultation data:', error);
        // If unauthorized, the user might need to log in again
        if (error.response?.status === 401) {
          console.log('User not authenticated, redirecting to login');
          // You might want to redirect to login here
        }
      } finally {
        setLoading(false);
      }
    };

    // Since authentication uses httpOnly cookies, we don't need to check for localStorage token
    fetchData();
  }, [currentWeekStart]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Calculate this week's count from filtered consultations
  const thisWeekCount = consultations.filter(c => 
    c.booking?.status === 'CONFIRMED' || c.booking?.status === 'COMPLETED'
  ).length;

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
          title="Calendar" 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />

        <main className="flex-1 p-4 overflow-y-auto sm:p-6">
          <div className="mx-auto space-y-6 max-w-7xl">

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {/* This Week */}
              <div 
                className="p-4 rounded-xl"
                style={{ 
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border-primary)'
                }}
              >
                <div className="mb-1 text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  {loading ? '...' : thisWeekCount}
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  This Week
                </div>
              </div>

              {/* This Month */}
              <div 
                className="p-4 rounded-xl"
                style={{ 
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border-primary)'
                }}
              >
                <div className="mb-1 text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  {loading ? '...' : stats.thisMonth}
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  This Month
                </div>
              </div>

              {/* Upcoming */}
              <div 
                className="p-4 rounded-xl"
                style={{ 
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border-primary)'
                }}
              >
                <div className="mb-1 text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  {loading ? '...' : stats.upcoming}
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Upcoming
                </div>
              </div>

              {/* Confirmed */}
              <div 
                className="p-4 rounded-xl"
                style={{ 
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border-primary)'
                }}
              >
                <div className="mb-1 text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  {loading ? '...' : stats.confirmed}
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Confirmed
                </div>
              </div>
            </div>

            {/* Calendar Section */}
            <div 
              className="overflow-hidden rounded-xl"
              style={{ 
                backgroundColor: 'var(--color-bg-card)',
                border: '1px solid var(--color-border-primary)'
              }}
            >
              {/* Calendar Header with Navigation */}
              <div 
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: 'var(--color-border-primary)' }}
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const newWeekStart = new Date(currentWeekStart);
                      newWeekStart.setDate(currentWeekStart.getDate() - 7);
                      setCurrentWeekStart(newWeekStart);
                    }}
                    className="p-1.5 rounded hover:bg-opacity-80 transition-colors"
                    style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
                  >
                    <ChevronLeft className="w-4 h-4" style={{ color: 'var(--color-text-primary)' }} />
                  </button>
                  <button
                    onClick={() => {
                      const today = new Date();
                      const dayOfWeek = today.getDay();
                      const startOfWeek = new Date(today);
                      startOfWeek.setDate(today.getDate() - dayOfWeek);
                      startOfWeek.setHours(0, 0, 0, 0);
                      setCurrentWeekStart(startOfWeek);
                    }}
                    className="px-3 py-1.5 rounded text-sm font-medium"
                    style={{ 
                      backgroundColor: 'var(--color-bg-tertiary)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => {
                      const newWeekStart = new Date(currentWeekStart);
                      newWeekStart.setDate(currentWeekStart.getDate() + 7);
                      setCurrentWeekStart(newWeekStart);
                    }}
                    className="p-1.5 rounded hover:bg-opacity-80 transition-colors"
                    style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
                  >
                    <ChevronRight className="w-4 h-4" style={{ color: 'var(--color-text-primary)' }} />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Week Days Header */}
                  <div 
                    className="grid grid-cols-8 border-b"
                    style={{ borderColor: 'var(--color-border-primary)' }}
                  >
                    <div className="p-3"></div>
                    {Array.from({ length: 7 }, (_, i) => {
                      const date = new Date(currentWeekStart);
                      date.setDate(currentWeekStart.getDate() + i);
                      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                      const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      const isToday = date.toDateString() === new Date().toDateString();
                      
                      return (
                        <div 
                          key={i}
                          className="p-3 text-sm font-medium text-center"
                          style={{ color: isToday ? 'var(--color-primary)' : 'var(--color-text-primary)' }}
                        >
                          {dayName}, {monthDay}
                        </div>
                      );
                    })}
                  </div>

                  {/* Time Slots */}
                  <div className="relative">
                    {['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'].map((timeSlot, timeIndex) => (
                      <div 
                        key={timeIndex}
                        className="grid grid-cols-8 border-b"
                        style={{ borderColor: 'var(--color-border-primary)' }}
                      >
                        {/* Time Label */}
                        <div 
                          className="p-3 text-sm font-medium border-r"
                          style={{ 
                            color: 'var(--color-text-secondary)',
                            borderColor: 'var(--color-border-primary)'
                          }}
                        >
                          {timeSlot}
                        </div>
                        
                        {/* Day Cells */}
                        {Array.from({ length: 7 }, (_, dayIndex) => {
                          const cellDate = new Date(currentWeekStart);
                          cellDate.setDate(currentWeekStart.getDate() + dayIndex);
                          const isToday = cellDate.toDateString() === new Date().toDateString();
                          
                          // Find consultations for this day and time slot
                          const cellConsultations = consultations.filter(consultation => {
                            const slotDate = new Date(consultation.date);
                            const startTime = new Date(consultation.startTime);
                            const hour = startTime.getHours();
                            const period = hour >= 12 ? 'PM' : 'AM';
                            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                            const consultationTimeSlot = `${displayHour} ${period}`;
                            
                            return slotDate.toDateString() === cellDate.toDateString() && 
                                   consultationTimeSlot === timeSlot;
                          });
                          
                          return (
                            <div 
                              key={dayIndex}
                              className="relative p-1 border-r min-h-[60px]"
                              style={{ 
                                borderColor: 'var(--color-border-primary)',
                                backgroundColor: isToday ? 'var(--color-calendar-today-bg)' : 'transparent'
                              }}
                            >
                              {/* Consultations */}
                              {cellConsultations.map(consultation => {
                                const statusColor = consultation.booking?.status === 'CONFIRMED' 
                                  ? { bg: 'var(--color-calendar-confirmed-bg)', border: 'var(--color-calendar-confirmed-border)', text: 'var(--color-calendar-confirmed-text)' }
                                  : consultation.booking?.status === 'COMPLETED'
                                  ? { bg: 'var(--color-calendar-completed-bg)', border: 'var(--color-calendar-completed-border)', text: 'var(--color-calendar-completed-text)' }
                                  : { bg: 'var(--color-calendar-pending-bg)', border: 'var(--color-calendar-pending-border)', text: 'var(--color-calendar-pending-text)' };
                                
                                return (
                                  <div 
                                    key={consultation.id}
                                    className="p-2 mb-1 text-xs rounded"
                                    style={{ 
                                      backgroundColor: statusColor.bg,
                                      border: `1px solid ${statusColor.border}`
                                    }}
                                  >
                                    <div className="flex items-center gap-1 mb-0.5">
                                      <CalendarIcon className="w-3 h-3" style={{ color: statusColor.text }} />
                                      <span className="font-semibold" style={{ color: statusColor.text }}>
                                        {consultation.booking?.employee?.fullName || 'Client'}
                                      </span>
                                    </div>
                                    <div className="text-xs" style={{ color: statusColor.text }}>
                                      {consultation.booking?.status || 'N/A'}
                                    </div>
                                    {consultation.booking?.meetingLink && (
                                      <a 
                                        href={consultation.booking.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block mt-1 text-xs underline"
                                        style={{ color: statusColor.text }}
                                      >
                                        Join Meeting
                                      </a>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
