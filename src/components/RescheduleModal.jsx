import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Clock, Calendar, Check, Video } from 'lucide-react';

export default function RescheduleModal({ session, isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date(2025, 9, 1)); // October 2025
  const [notes, setNotes] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedDate(null);
      setSelectedTime(null);
      setNotes('');
    }
  }, [isOpen]);

  if (!isOpen || !session || !mounted) return null;

  // Extract AM/PM from startTime
  const period = session.startTime.includes('AM') ? 'AM' : 'PM';
  
  // Determine badge styling based on status
  const badgeClass = session.badge === 'Confirmed' 
    ? 'bg-[var(--color-info-bg)] text-[var(--color-secondary)]' 
    : 'bg-grey-lightest text-grey-dark';

  // Available time slots
  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM'];

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    // Previous month days
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }
    return days;
  };

  const handlePrevMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1));
  };

  const formatDate = (date) => {
    if (!date) return '';
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(2025, 9, date).toLocaleDateString('en-US', options);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleReschedule = () => {
    // Handle reschedule logic here
    setCurrentStep(3);
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setNotes('');
    onClose();
  };

  const days = getDaysInMonth(selectedMonth);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonthName = monthNames[selectedMonth.getMonth()];
  const currentYear = selectedMonth.getFullYear();

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ backgroundColor: 'transparent' }}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: 'var(--color-overlay)' }}
        onClick={handleClose}
      ></div>
      
      {/* Modal */}
      <div className="relative rounded-2xl shadow-xl max-w-2xl overflow-hidden p-6 space-y-6" style={{ backgroundColor: 'var(--color-bg-primary)', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div className="">
          <div className="flex items-center justify-between">
            <h2 className="font-outfit font-medium text-[20px] leading-[22px]">
              {currentStep === 3 ? 'Session Confirmation' : 'Reschedule Session'}
            </h2>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div
                    className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-sm font-jakarta font-600 ${
                      step === currentStep
                        ? 'bg-[#17A2B8] text-white-darkest'
                        : step < currentStep
                        ? 'bg-[#17A2B8] text-white-darkest'
                        : 'bg-[#E3F2FD] text-[#64B5F6]'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-8 h-0.5 ${
                      step < currentStep ? 'bg-[#17A2B8]' : 'bg-[#E3F2FD]'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <button
            onClick={handleClose}
            className=" w-9 h-9 p-2 hover:bg-grey-lightest rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-black-dark" />
          </button>
          </div>
        </div>

        {/* Step 1: Date & Time Selection */}
        {currentStep === 1 && (
          <div className="space-y-4">
            {/* Session Info */}
            <div className="flex items-start gap-3 flex-1 h-[44px]">
            {/* Avatar */}
              <div className="w-10 h-10 bg-[#EFF1F8] text-[#334EAC] rounded-full flex items-center justify-center font-jakarta font-normal text-base leading-6 flex-shrink-0">
                {period}
              </div>
              {/* Name and Session Type */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-outfit font-normal text-base ">{session.clientName}</h3>
                  <span className={`${badgeClass} rounded-[37px] border px-[8px] py-[2px] text-xs font-jakarta font-300 whitespace-nowrap`}>
                    {session.badge}
                  </span>
                </div>
                <p className="font-outfit font-normal text-sm leading-5 text-[#334EAC]">{session.sessionType}</p>
              </div>
            </div>

            {/* Date & Time Selection */}
            <div>
              <h3 className="font-outfit font-medium text-base leading-6 mb-[10px]">Select date & time</h3>
              <div className="flex gap-6">
                {/* Calendar */}
                <div className=" space-y-[10px]">
                  <label className="font-outfit font-medium text-base leading-6 text-sm text-black-dark ">Date</label>
                  <div className="border border-grey-lightest rounded-lg p-3 w-[250px]">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={handlePrevMonth} className="p-1 hover:bg-grey-lightest rounded">
                        <ChevronLeft className="w-5 h-5 text-grey-dark" />
                      </button>
                      <span className="font-jakarta font-600 text-black-dark">
                        {currentMonthName} {currentYear}
                      </span>
                      <button onClick={handleNextMonth} className="p-1 hover:bg-grey-lightest rounded">
                        <ChevronRight className="w-5 h-5 text-grey-dark" />
                      </button>
                    </div>
                    
                    {/* Days of Week */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                        <div key={day} className="text-center text-xs font-jakarta font-600 text-grey-dark py-1">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {days.map((item, idx) => {
                        const isPast = item.isCurrentMonth && item.day < 17;
                        const isSelected = item.isCurrentMonth && item.day === selectedDate;
                        const isAvailable = item.isCurrentMonth && item.day >= 17;
                        
                        return (
                          <button
                            key={idx}
                            onClick={() => item.isCurrentMonth && item.day >= 17 && setSelectedDate(item.day)}
                            disabled={!isAvailable}
                            className={`w-8 h-8 rounded text-sm font-jakarta ${
                              !item.isCurrentMonth || isPast
                                ? 'text-grey-light cursor-not-allowed'
                                : isSelected
                                ? 'bg-primary-primary text-white-darkest'
                                : isAvailable
                                ? 'text-black-dark hover:bg-grey-lightest'
                                : ''
                            }`}
                          >
                            {item.day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Time Slots */}
                <div className="w-full">
                  <label className="block font-jakarta text-sm leading-5 mb-3">Available Time Slots</label>
                  <div className="space-y-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`w-[173px] h-[50px] flex items-center justify-between px-4 py-3 rounded-[12px] border-[1px] transition-colors ${
                          selectedTime === time
                            ? 'border-[#334EAC] bg-[#EFF6FF] text-[#334EAC]'
                            : 'border-grey-lightest hover:border-grey-light'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span className="font-jakarta font-normal text-base leading-6 ">{time}</span>
                        </div>
                        {selectedTime === time && (
                          <Check className="w-5 h-5 text-primary-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Review & Confirm */}
        {currentStep === 2 && (
          <div className="space-y-4">
            {/* Advisor Info */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-secondary-lightest text-secondary-primary rounded-full flex items-center justify-center font-jakarta font-600 text-sm flex-shrink-0">
                RK
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 ">
                  <h3 className="font-outfit font-normal text-base leading-6">Rajesh Kumar</h3>
                  <span className="bg-[#17A2B8]/[0.125] text-secondary-primary px-3 py-1 rounded-full text-xs font-jakarta font-400">
                    Available
                  </span>
                </div>
                <span className="bg-[#17A2B8] text-white-darkest px-2 py-1 rounded-[6px] font-plus text-[9px] leading-[13.33px] tracking-normal">
                  CA, CFP
                </span>
              </div>
            </div>

            {/* Review Section */}
            <div>
              <h3 className="font-jakarta font-semibold text-base leading-6 mb-3">Review & Confirm</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-[16px] p-4 h-[77px] bg-[#EFF1F8]">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-[#262626]" />
                    <span className="font-jakarta font-bold text-[11px] leading-[16.5px] uppercase text-[#262626]">Date</span>
                  </div>
                  <p className="font-outfit font-medium text-sm leading-[21px] text-[#334EAC]">
                    {selectedDate ? formatDate(selectedDate) : 'Select a date'}
                  </p>
                </div>
                <div className="rounded-[16px] p-4 h-[77px] bg-[#EFF1F8]">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-[#262626]" />
                    <span className="font-jakarta font-bold text-[11px] leading-[16.5px] uppercase text-[#262626]">Time</span>
                  </div>
                  <p className="font-outfit font-medium text-sm leading-[21px] text-[#334EAC]">
                    {selectedTime ? (() => {
                      const [time, period] = selectedTime.split(' ');
                      const [hour, minute] = time.split(':');
                      const hourNum = parseInt(hour);
                      const nextHour = hourNum === 12 ? 1 : hourNum + 1;
                      const nextPeriod = hourNum === 11 ? (period === 'AM' ? 'PM' : 'AM') : period;
                      return `${selectedTime} - ${nextHour}:${minute} ${nextPeriod}`;
                    })() : 'Select a time'}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className='space-y-3'>
              <h3 className="font-plus font-semibold text-[16px] leading-[20px] tracking-normal ">Add Notes (Optional)</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any internal notes about this session..."
                className="bg-[#F3F3F5] w-full h-[60px] px-3 py-2 border border-[#00000000] rounded-[10px] font-plus font-normal text-[14px] leading-[20px] tracking-normal focus:outline-none focus:ring-2 focus:ring-primary-primary focus:border-transparent"
                rows={4}
              />
            </div>

            {/* Confirmation Box */}
            <div className="bg-[#EFF6FF] rounded-[12px] p-3">
              <div className="flex items-center gap-1">
                <Check className="w-5 h-5 text-primary-primary" />
                <span className="font-plus font-normal text-[14px] leading-[20px] tracking-normal text-[#334EAC]">
                  Calendar invite will be sent to both participant and advisor
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-5 h-5 text-primary-primary" />
                <span className="font-plus font-normal text-[14px] leading-[20px] tracking-normal text-[#334EAC]">
                  Google Meet link will be automatically generated
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        
        {currentStep === 3 && (
          <div className="">
            <div 
              className="rounded-[18px] px-12 text-center relative overflow-hidden h-[244px]"
              style={{
                background: 'linear-gradient(135deg,#334EAC 0%, #17A2B8 50%, #67A682 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div className="w-24 h-24 rounded-full border-8 border-white flex items-center justify-center -mt-1 bg-[linear-gradient(135deg,#67A682_0%,#17A2B8_100%)]">
                <Check className="w-12 h-12 text-white-darkest" style={{ strokeWidth: 4 }} />
              </div>
              <h3 className="font-outfit font-bold text-[24px] leading-[24px] tracking-[-0.5px] text-center text-white-darkest mb-2">
                Session Rescheduled Successfully!
              </h3>
              <p className="font-plus font-normal text-[13px] leading-[24px] tracking-normal text-center text-white-darkest">
                Your financial Session is confirmed
              </p>
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex items-center justify-between gap-3">
          {currentStep === 1 && (
            <>
              <button
                onClick={handleClose}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2 border border-grey-lightest rounded-lg font-jakarta font-600 text-sm text-grey-dark hover:bg-grey-lightest transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleNext}
                disabled={!selectedDate || !selectedTime}
                className="flex-1 px-6 py-2 bg-primary-primary text-white-darkest rounded-lg font-jakarta font-600 text-sm hover:bg-primary-darkest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </>
          )}
          {currentStep === 2 && (
            <>
              <button
                onClick={() => setCurrentStep(1)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2 border border-grey-lightest rounded-lg font-jakarta font-600 text-sm text-grey-dark hover:bg-grey-lightest transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-primary-primary text-white-darkest rounded-lg font-jakarta font-600 text-sm hover:bg-primary-darkest transition-colors"
              >
                <Video className="w-4 h-4" />
                Reschedule
              </button>
            </>
          )}
          {currentStep === 3 && (
            <>
              <button
                onClick={() => {
                  handleClose();
                  // Optionally reopen reschedule modal
                }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2 border border-grey-lightest rounded-lg font-jakarta font-600 text-sm text-grey-dark hover:bg-grey-lightest transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Reschedule
              </button>
              <button
                onClick={handleClose}
                className="flex-1 px-6 py-2 bg-primary-primary text-white-darkest rounded-lg font-jakarta font-600 text-sm hover:bg-primary-darkest transition-colors"
              >
                View Details
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
