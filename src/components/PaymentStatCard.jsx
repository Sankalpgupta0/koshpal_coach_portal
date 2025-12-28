export default function PaymentStatCard({ label, value, subText, subColor }) {
  const getSubTextColor = () => {
    if (subColor === 'text-green-600') return 'var(--color-success)';
    return 'var(--color-text-secondary)';
  };

  return (
    <div className="border rounded-xl p-4" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)' }}>
      <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>{label}</p>
      <p className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>{value}</p>

      {subText && (
        <p className="text-xs mt-1" style={{ color: getSubTextColor() }}>
          {subText}
        </p>
      )}
    </div>
  );
}
