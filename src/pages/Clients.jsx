import React, { useState, useEffect } from "react";
import { Search, Menu } from "lucide-react";
import PageHeader from "../components/PageHeader";
import ClientCard from "../components/ClientCard";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { getMyConsultations } from "../api";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'upcoming', 'completed'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all consultations
      const consultations = await getMyConsultations();

      // Extract unique clients from consultations
      const clientsMap = new Map();
      
      consultations.forEach(consultation => {
        // Check if consultation has booking and employee data
        if (!consultation.booking || !consultation.booking.employee || !consultation.booking.employee.id) {
          return; // Skip this consultation if employee data is missing
        }

        const employeeId = consultation.booking.employee.id;
        
        if (!clientsMap.has(employeeId)) {
          // Get last completed/past session (consultation that has ended)
          const lastSession = consultations
            .filter(c => c.booking?.employee?.id === employeeId && 
                         c.booking?.status !== 'CANCELLED' && 
                         new Date(c.endTime) < new Date())
            .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
          
          // Get next upcoming session (confirmed and in the future)
          const nextSession = consultations
            .filter(c => c.booking?.employee?.id === employeeId && 
                         c.booking?.status === 'CONFIRMED' && 
                         new Date(c.startTime) > new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

          clientsMap.set(employeeId, {
            id: employeeId,
            name: consultation.booking.employee.fullName?.trim() || 'Unknown',
            // role: consultation.booking.employee.profile?.position || 'Employee',
            // location: consultation.booking.employee.profile?.department || 'N/A',
            lastSession: lastSession ? formatDate(lastSession.date) : 'N/A',
            nextSession: nextSession ? formatDate(nextSession.date) : 'N/A',
            // plan: consultation.booking.employee.company?.name || 'N/A',
          });
        }
      });

      setClients(Array.from(clientsMap.values()));

    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Failed to load clients. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Filter clients based on search term and status
  useEffect(() => {
    let filtered = clients;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => {
        if (statusFilter === 'upcoming') {
          return client.nextSession !== null;
        } else if (statusFilter === 'completed') {
          return client.nextSession === null;
        }
        return true;
      });
    }

    setFilteredClients(filtered);
  }, [clients, searchTerm, statusFilter]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  if (loading) {
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
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-4 rounded-full border-t-transparent animate-spin" 
                   style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}></div>
              <p style={{ color: 'var(--color-text-secondary)' }}>Loading clients...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
          <div className="flex items-center justify-center py-20">
            <div className="p-6 text-center rounded-lg" style={{ backgroundColor: 'var(--color-bg-card)' }}>
              <p style={{ color: 'var(--color-error)' }}>{error}</p>
              <button 
                onClick={fetchClients}
                className="px-6 py-2 mt-4 rounded-lg"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}
              >
                Try Again
              </button>
            </div>
          </div>
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
          title="Clients" 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />

        <main className="flex-1 p-4 overflow-y-auto sm:p-6">
          <div className="mx-auto space-y-6 max-w-7xl">
            <PageHeader />

      {/* Search and Filter Controls */}
      <div className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                borderColor: 'var(--color-border-secondary)',
                color: 'var(--color-text-primary)'
              }}
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'all' ? 'ring-2' : ''
              }`}
              style={{
                backgroundColor: statusFilter === 'all' ? 'var(--color-primary)' : 'var(--color-bg-card)',
                color: statusFilter === 'all' ? 'var(--color-text-inverse)' : 'var(--color-text-primary)',
                borderColor: 'var(--color-border-secondary)',
                ringColor: 'var(--color-primary)'
              }}
            >
              All Clients
            </button>
            <button
              onClick={() => setStatusFilter('upcoming')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'upcoming' ? 'ring-2' : ''
              }`}
              style={{
                backgroundColor: statusFilter === 'upcoming' ? 'var(--color-primary)' : 'var(--color-bg-card)',
                color: statusFilter === 'upcoming' ? 'var(--color-text-inverse)' : 'var(--color-text-primary)',
                borderColor: 'var(--color-border-secondary)',
                ringColor: 'var(--color-primary)'
              }}
            >
              Upcoming Sessions
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'completed' ? 'ring-2' : ''
              }`}
              style={{
                backgroundColor: statusFilter === 'completed' ? 'var(--color-primary)' : 'var(--color-bg-card)',
                color: statusFilter === 'completed' ? 'var(--color-text-inverse)' : 'var(--color-text-primary)',
                borderColor: 'var(--color-border-secondary)',
                ringColor: 'var(--color-primary)'
              }}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClients.length === 0 ? (
          <div className="py-20 text-center col-span-full">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              {clients.length === 0 ? 'No clients found' : 'No clients match your search criteria'}
            </p>
          </div>
        ) : (
          filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))
        )}
      </div>
          </div>
        </main>
      </div>
    </div>
  );
}

