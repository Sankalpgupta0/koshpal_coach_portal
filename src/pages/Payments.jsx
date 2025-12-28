import { FileText } from "lucide-react";
import { useState, useEffect } from "react";
import PaymentStatCard from "../components/PaymentStatCard";
import InvoiceRow from "../components/InvoiceRow";
import { getPaymentStats, getInvoices } from "../api";

export default function Payments() {
  const [stats, setStats] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      
      // Fallback to mock data on error
      setStats([
        {
          label: "Total Earnings",
          value: "₹ 120k",
          subText: "+15% this month",
          subColor: "text-green-600",
        },
        {
          label: "Pending",
          value: "₹ 12k",
        },
        {
          label: "This Month",
          value: "18",
          subText: "Sessions",
          subColor: "text-gray-500",
        },
        {
          label: "Avg Rate",
          value: "₹ 3.5k",
          subText: "Per hour",
          subColor: "text-gray-500",
        },
      ]);
      
      setInvoices([
        {
          id: "INV-001",
          client: "Harsh Kumar",
          amount: "7,000",
          status: "Paid",
        },
        {
          id: "INV-002",
          client: "Sneha Desai",
          amount: "3,500",
          status: "Pending",
        },
        {
          id: "INV-003",
          client: "Priya Mehta",
          amount: "3,500",
          status: "Paid",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" 
                 style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}></div>
            <p style={{ color: 'var(--color-text-secondary)' }}>Loading payments...</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Payments & Invoices
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Track your earnings and manage invoices
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-all" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}>
          <FileText size={16} />
          Create Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
  );
}
