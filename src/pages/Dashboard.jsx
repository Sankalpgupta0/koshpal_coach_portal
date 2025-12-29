import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import SessionCard from '../components/SessionCard';
import SessionModal from '../components/SessionModal';
import RescheduleModal from '../components/RescheduleModal';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Calendar, DollarSign, Star, Menu } from 'lucide-react';
import { getMyConsultations, getConsultationStats } from '../api';

export default function Dashboard() {
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rescheduleSession, setRescheduleSession] = useState(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch today's consultations
      const allConsultations = await getMyConsultations('upcoming');
      
      // Fetch statistics
      const statsData = await getConsultationStats();
      setStats(statsData);

      // Filter today's sessions
      const today = new Date().toISOString().split('T')[0];
      const todaySessions = allConsultations.filter(consultation => {
        const sessionDate = new Date(consultation.slot.date).toISOString().split('T')[0];
        return sessionDate === today;
      });

      // Format sessions for display
      const formattedSessions = todaySessions.map(consultation => ({
        id: consultation.id,
        startTime: formatTime(consultation.slot.startTime),
        endTime: formatTime(consultation.slot.endTime),
        clientName: `${consultation.employee.profile.firstName} ${consultation.employee.profile.lastName}`,
        sessionType: consultation.employee.company.name,
        badge: consultation.status === 'CONFIRMED' ? 'Confirmed' : 'Tentative',
        isVirtual: true,
        duration: calculateDuration(consultation.slot.startTime, consultation.slot.endTime),
        meetingLink: consultation.meetingLink,
      }));

      setSessions(formattedSessions);

      // Get upcoming sessions (next 7 days, excluding today)
      const upcomingFiltered = allConsultations
        .filter(consultation => {
          const sessionDate = new Date(consultation.slot.date);
          const todayDate = new Date(today);
          return sessionDate > todayDate;
        })
        .slice(0, 3)
        .map(consultation => ({
          id: consultation.id,
          name: `${consultation.employee.profile.firstName} ${consultation.employee.profile.lastName}`,
          date: formatDate(consultation.slot.startTime),
        }));

      setUpcomingSessions(upcomingFiltered);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffMins = Math.round(diffMs / 60000);
    return `${diffMins} min`;
  };

  const handleJoinSession = (session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  const handleReschedule = (session) => {
    setRescheduleSession(session);
    setIsRescheduleModalOpen(true);
  };

  const handleCloseRescheduleModal = () => {
    setIsRescheduleModalOpen(false);
    setRescheduleSession(null);
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.email?.split('@')[0] || 'Coach';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 rounded-full border-t-transparent animate-spin" 
               style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}></div>
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-6 text-center rounded-lg" style={{ backgroundColor: 'var(--color-bg-card)' }}>
          <p style={{ color: 'var(--color-error)' }}>{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-6 py-2 mt-4 rounded-lg"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
          title="Dashboard" 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />

        <main className="flex-1 p-4 overflow-y-auto sm:p-6">
          <div className="mx-auto space-y-6 max-w-7xl">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p style={{ color: 'var(--color-error)' }}>{error}</p>
                <button
                  onClick={fetchDashboardData}
                  className="mt-4 px-4 py-2 rounded-lg"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <div className="w-full max-w-full space-y-6">
                  {/* Welcome Section */}
                  <div>
                    <h1 className="text-h1" style={{ color: 'var(--color-text-primary)' }}>
                      Welcome back, {userName}!
                    </h1>
                    <p className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>
                      {sessions.length} session{sessions.length !== 1 ? 's' : ''} scheduled for today
                    </p>
                  </div>

        {/* Stats Grid - Responsive grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-5">
          <StatCard
            icon={<Calendar />}
            label="Today's Sessions"
            value={sessions.length.toString()}
            subtext="Upcoming"
          />
          <StatCard
            icon={<DollarSign />}
            label="Earnings (MTD)"
            value={stats?.thisMonthStats?.consultations ? `₹${(stats.thisMonthStats.consultations * 3500).toLocaleString()}` : '₹0'}
            subtext={`${stats?.thisMonthStats?.consultations || 0} sessions completed`}
          />
          <StatCard
            icon={<Star />}
            label="Avg Rating"
            value={stats?.averageRating?.toFixed(1) || '0.0'}
            subtext={
              <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(stats?.averageRating || 0) ? 'fill-current' : ''}`}
                      style={{ color: i < Math.round(stats?.averageRating || 0) ? 'var(--color-warning)' : 'var(--color-grey-lightest)' }}
                    />
                  ))}
              </div>
            }
          />
        </div>

        {/* Main Layout - Schedule then Upcoming */}
        <div className="w-full space-y-8">
          {/* Today's Schedule */}
          <div 
            className="p-4 space-y-6 border rounded-2xl sm:p-5" 
            style={{ 
              backgroundColor: 'var(--color-bg-card)', 
              borderColor: 'var(--color-border-primary)' 
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-h4" style={{ color: 'var(--color-text-primary)' }}>
                  Today's Schedule
                </h2>
                <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Saturday, October 11, 2025
                </p>
              </div>
              <span 
                className="px-3 py-1 border rounded-full text-label"
                style={{ 
                  backgroundColor: 'var(--color-primary-lightest)', 
                  borderColor: 'var(--color-border-primary)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                {sessions.length} session{sessions.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto md:max-h-none md:overflow-visible">
              {sessions.length === 0 ? (
                <div className="py-8 text-center">
                  <p style={{ color: 'var(--color-text-secondary)' }}>No sessions scheduled for today</p>
                </div>
              ) : (
                sessions.map((session, idx) => (
                  <SessionCard 
                    key={session.id || idx} 
                    {...session}
                    onJoinSession={() => handleJoinSession(session)}
                    onReschedule={() => handleReschedule(session)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Upcoming This Week - Full Width Below */}
          <div 
            className="gap-4 p-4 border rounded-2xl sm:p-6"
            style={{ 
              backgroundColor: 'var(--color-bg-card)', 
              borderColor: 'var(--color-border-primary)' 
            }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between h-8">
                <h2 className="text-h4" style={{ color: 'var(--color-text-primary)' }}>
                  Upcoming This Week
                </h2>
                <a href="#" className="text-label hover:underline" style={{ color: 'var(--color-primary)' }}>
                  View All
                </a>
              </div>

              <div className="space-y-3">
                {upcomingSessions.length === 0 ? (
                  <div className="py-4 text-center">
                    <p style={{ color: 'var(--color-text-secondary)' }}>No upcoming sessions</p>
                  </div>
                ) : (
                  upcomingSessions.map((session, idx) => (
                    <div
                      key={session.id || idx}
                      className="flex items-center justify-between px-4 py-3 transition-colors rounded-lg"
                      style={{ 
                        backgroundColor: 'var(--color-bg-secondary)',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-subtitle" style={{ color: 'var(--color-text-primary)' }}>
                          {session.name}
                        </h4>
                        <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          {session.date}
                        </p>
                      </div>
                      <button 
                        className="h-8 px-3 ml-3 transition-all border rounded-lg text-button hover:opacity-80"
                        style={{ 
                          backgroundColor: 'var(--color-bg-tertiary)', 
                          borderColor: 'var(--color-border-primary)',
                          color: 'var(--color-text-primary)'
                        }}
                      >
                        View
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
              </>
            )}
          </div>
        </main>
      </div>
      <SessionModal
        session={selectedSession}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Reschedule Modal */}
      <RescheduleModal
        session={rescheduleSession}
        isOpen={isRescheduleModalOpen}
        onClose={handleCloseRescheduleModal}
      />
    </div>
  );
}
