export default function CalendarHeader() {
  return (
    <div className="rounded-2xl min-h-[80px] sm:h-[101px] p-4 sm:p-5 mb-6 shadow-sm border" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)' }}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-h2" style={{ color: 'var(--color-text-primary)' }}>Calendar</h1>
          <p className="font-jakarta font-medium text-[12px] leading-[20px] tracking-[0px]" style={{ color: 'var(--color-primary)' }}>
            Manage your schedule and consultations
          </p>
        </div>
      </div>
    </div>
  );
}
