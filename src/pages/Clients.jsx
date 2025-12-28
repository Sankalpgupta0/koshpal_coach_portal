import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import PageHeader from "../components/PageHeader";
import ClientCard from "../components/ClientCard";
import { getMyConsultations } from "../api";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.log("consultation", consultation);
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

          console.log("nextSession", nextSession);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 rounded-full border-t-transparent animate-spin" 
                 style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}></div>
            <p style={{ color: 'var(--color-text-secondary)' }}>Loading clients...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="flex items-center justify-center py-20">
          <div className="p-6 text-center rounded-lg" style={{ backgroundColor: 'var(--color-bg-card)' }}>
            <p style={{ color: 'var(--color-error)' }}>{error}</p>
            <button 
              onClick={fetchClients}
              className="px-6 py-2 mt-4 rounded-lg"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <PageHeader />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clients.length === 0 ? (
          <div className="py-20 text-center col-span-full">
            <p style={{ color: 'var(--color-text-secondary)' }}>No clients found</p>
          </div>
        ) : (
          clients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))
        )}
      </div>
    </div>
  );
}

