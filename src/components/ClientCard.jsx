import { Mail, MapPin, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ClientCard({ client }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate('/client-overview');
  };

  return (
    <div className="rounded-2xl p-3 sm:p-4 shadow-md space-y-3 sm:space-y-4" style={{ backgroundColor: 'var(--color-bg-card)' }}>
      {/* Top */}
      <div className="flex justify-between items-start ">
        <div className="flex gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-jakarta font-normal text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] tracking-[0px]" style={{ backgroundColor: 'var(--color-primary-lightest)', color: 'var(--color-primary)' }}>
            RK
          </div>

          <div className="space-y-2">
            <p className="font-outfit font-medium text-[15px] sm:text-[17px] leading-[20px] sm:leading-[22.1px] tracking-normal" style={{ color: 'var(--color-text-primary)' }}>{client.name}</p>

            <div className="space-y-1">
                <div className="flex items-center gap-1 font-jakarta font-normal text-[11px] leading-[16.5px] tracking-normal" style={{ color: 'var(--color-text-secondary)' }}>
              <TrendingUp size={12} style={{ color: 'var(--color-primary)' }} />
              {client.role}
            </div>

            <div className="flex items-center gap-1 font-jakarta font-normal text-[11px] leading-[16.5px] tracking-normal" style={{ color: 'var(--color-text-secondary)' }}>
              <MapPin size={12} style={{ color: 'var(--color-primary)' }} />
              {client.location}
            </div>
            </div>
          </div>
        </div>

        <span className="px-2 py-1 rounded-[6px] font-jakarta font-semibold text-[9px] sm:text-[10px] tracking-normal" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-text-inverse)' }}>
          {client.plan}
        </span>
      </div>

      {/* Sessions */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span style={{ color: 'var(--color-text-secondary)' }}>Last Session</span>
          <span style={{ color: 'var(--color-text-primary)' }}>{client.lastSession}</span>
        </div>

        <div className="flex justify-between">
          <span style={{ color: 'var(--color-text-secondary)' }}>Next Session</span>
          <span className="font-medium" style={{ color: 'var(--color-primary)' }}>
            {client.nextSession}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 sm:gap-3">
        <button className="flex items-center justify-center gap-2 flex-1 border rounded-lg py-2 text-xs sm:text-sm hover:opacity-80 transition-all" style={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border-primary)', color: 'var(--color-text-primary)' }}>
          <Mail size={16} />
          Message
        </button>

        <button 
          onClick={handleViewDetails}
          className="flex-1 rounded-lg py-2 text-xs sm:text-sm hover:opacity-90 transition-all" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}
        >
          View details
        </button>
      </div>
    </div>
  );
}
