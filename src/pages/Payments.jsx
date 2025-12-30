import { FileText, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import PaymentStatCard from "../components/PaymentStatCard";
import InvoiceRow from "../components/InvoiceRow";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { getPaymentStats, getInvoices } from "../api";

export default function Payments() {
  const [stats, setStats] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch payment stats
      const statsData = await getPaymentStats();
      
      // Format stats for display
      const formattedStats = [
        {
          label: "Total Earnings",
          value: `₹ ${(statsData.totalEarnings / 1000).toFixed(0)}k`,
          subText: `+${statsData.percentageChange || 0}% this month`,
          subColor: statsData.percentageChange > 0 ? "text-green-600" : "text-red-600",
        },
        {
          label: "Pending",
          value: `₹ ${(statsData.pendingAmount / 1000).toFixed(0)}k`,
        },
        {
          label: "This Month",
          value: statsData.thisMonthSessions?.toString() || "0",
          subText: "Sessions",
          subColor: "text-gray-500",
        },
        {
          label: "Avg Rate",
          value: `₹ ${((statsData.averageRate || 3500) / 1000).toFixed(1)}k`,
          subText: "Per hour",
          subColor: "text-gray-500",
        },
      ];
      
      setStats(formattedStats);

      // Fetch invoices
      const invoiceData = await getInvoices({ limit: 10 });
      
      // Format invoices for display
      const formattedInvoices = invoiceData.map(invoice => ({
        id: invoice.invoiceNumber || invoice.id,
        client: invoice.clientName,
        amount: (invoice.amount / 100).toLocaleString(),
        status: invoice.status === 'PAID' ? 'Paid' : 'Pending',
      }));
      
      setInvoices(formattedInvoices);

    } catch (err) {
      console.error('Error fetching payment data:', err);
      setError('Failed to load payment data. Please try again.');

      // Clear any partial data
      setStats([]);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 rounded-full border-t-transparent animate-spin" 
                 style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}></div>
            <p style={{ color: 'var(--color-text-secondary)' }}>Loading payments...</p>
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
          title="Payments" 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />

        <main className="flex-1 p-4 overflow-y-auto sm:p-6">
          <div className="mx-auto space-y-6 max-w-7xl">
            {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Track your earnings and manage invoices
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 text-sm transition-all rounded-lg hover:opacity-90" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}>
          <FileText size={16} />
          Create Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <PaymentStatCard key={i} {...stat} />
        ))}
      </div>

      {/* Recent Invoices */}
      <div className="border rounded-xl" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--color-border-primary)' }}>
          <h2 className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            Recent Invoices
          </h2>
        </div>

        <div className="px-5">
          {invoices.map((invoice, i) => (
            <InvoiceRow key={i} invoice={invoice} />
          ))}
        </div>
      </div>
          </div>
        </main>
      </div>
    </div>
  );
}
