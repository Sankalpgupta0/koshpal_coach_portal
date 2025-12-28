import { Download } from "lucide-react";

export default function InvoiceRow({ invoice }) {
  const getStatusStyle = (status) => {
    if (status === 'Paid') {
      return { backgroundColor: 'rgba(128, 181, 151, 0.2)', color: 'var(--color-success)' };
    }
    return { backgroundColor: 'rgba(245, 160, 56, 0.2)', color: 'var(--color-warning)' };
  };

  return (
    <div className="flex items-center justify-between py-4 border-b last:border-b-0" style={{ borderColor: 'var(--color-border-primary)' }}>
      {/* Left */}
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
          {invoice.id}
        </p>
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          {invoice.client}
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
          ₹ {invoice.amount}
        </p>

        <span
          className="text-xs px-2 py-1 rounded-full"
          style={getStatusStyle(invoice.status)}
        >
          {invoice.status}
        </span>

        <button className="hover:opacity-80 transition-all" style={{ color: 'var(--color-text-secondary)' }}>
          <Download size={16} />
        </button>
      </div>
    </div>
  );
}
