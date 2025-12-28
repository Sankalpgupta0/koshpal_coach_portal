import React, { useState, useMemo, useEffect } from 'react';
import { Clock, Trash2, Calendar, Plus, Save } from 'lucide-react';
import { createSlots, getMySlots } from '../api';


export default function Availability() {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Generate time options (00:00 to 23:30 in 30-min intervals)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const h = hour.toString().padStart(2, '0');
        const m = minute.toString().padStart(2, '0');
        times.push(`${h}:${m}`);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  // Format time for display (HH:MM to HH:MM format)
  const formatTime = (time) => {
    return time;
  };

  // Calculate duration in hours
  const calculateDuration = (start, end) => {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const diff = endMinutes - startMinutes;
    const hours = diff / 60;
    return hours;
  };

  // Initialize default schedule
  const initializeSchedule = () => {
    return {
      Monday: { enabled: true, slots: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }] },
      Tuesday: { enabled: true, slots: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }] },
      Wednesday: { enabled: true, slots: [{ start: '09:00', end: '12:00' }] },
      Thursday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
      Friday: { enabled: true, slots: [{ start: '09:00', end: '15:00' }] },
      Saturday: { enabled: false, slots: [] },
      Sunday: { enabled: false, slots: [] },
    };
  };

  const [schedule, setSchedule] = useState(initializeSchedule);
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [sessionDuration, setSessionDuration] = useState('45');
  const [recurringSchedule, setRecurringSchedule] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState('');

  // Load existing slots on mount
  useEffect(() => {
    loadExistingSlots();
  }, []);

  const loadExistingSlots = async () => {
    try {
      const slots = await getMySlots();
      // TODO: Convert slots to schedule format if needed
      console.log('Existing slots:', slots);
    } catch (err) {
      console.error('Error loading slots:', err);
    }
  };

  const toggleDay = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
        slots: !prev[day].enabled ? prev[day].slots : []
      }
    }));
  };

  const addSlot = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, { start: '09:00', end: '17:00' }]
      }
    }));
  };

  const removeSlot = (day, slotIndex) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, index) => index !== slotIndex)
      }
    }));
  };

  const updateSlotTime = (day, slotIndex, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot, index) => 
          index === slotIndex ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  // Quick presets
  const applyPreset = (preset) => {
    const newSchedule = { ...initializeSchedule() };
    
    daysOfWeek.forEach(day => {
      if (day === 'Saturday' || day === 'Sunday') {
        newSchedule[day] = { enabled: false, slots: [] };
        return;
      }
      
      newSchedule[day] = { enabled: true, slots: [] };
      
      switch(preset) {
        case 'morning':
          newSchedule[day].slots = [{ start: '08:00', end: '12:00' }];
          break;
        case 'afternoon':
          newSchedule[day].slots = [{ start: '13:00', end: '17:00' }];
          break;
        case 'evening':
          newSchedule[day].slots = [{ start: '17:00', end: '21:00' }];
          break;
        case 'fullday':
          newSchedule[day].slots = [{ start: '09:00', end: '17:00' }];
          break;
      }
    });
    
    setSchedule(newSchedule);
  };

  // Calculate summary
  const summary = useMemo(() => {
    let activeDays = 0;
    let totalSlots = 0;
    let totalHours = 0;

    daysOfWeek.forEach(day => {
      if (schedule[day].enabled) {
        activeDays++;
        totalSlots += schedule[day].slots.length;
        schedule[day].slots.forEach(slot => {
          totalHours += calculateDuration(slot.start, slot.end);
        });
      }
    });

    return {
      activeDays,
      totalSlots,
      totalHours: Math.round(totalHours * 10) / 10
    };
  }, [schedule]);

  const handlePublish = async () => {
    try {
      setPublishing(true);
      setPublishMessage('');

      // Get next 7 days starting from today
      const today = new Date();
      const publishPromises = [];

      for (let i = 0; i < 7; i++) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + i);
        const dateStr = targetDate.toISOString().split('T')[0];
        const dayName = daysOfWeek[targetDate.getDay() === 0 ? 6 : targetDate.getDay() - 1];

        // Check if this day is enabled in schedule
        if (schedule[dayName]?.enabled && schedule[dayName].slots.length > 0) {
          const timeSlots = schedule[dayName].slots.map(slot => ({
            startTime: slot.start,
            endTime: slot.end,
          }));

          publishPromises.push(
            createSlots(dateStr, timeSlots).catch(err => {
              console.error(`Error creating slots for ${dateStr}:`, err);
              return null;
            })
          );
        }
      }

      await Promise.all(publishPromises);
      setPublishMessage('Availability published successfully for the next 7 days!');
      
      // Reload slots
      await loadExistingSlots();

      setTimeout(() => setPublishMessage(''), 5000);

    } catch (err) {
      console.error('Error publishing availability:', err);
      setPublishMessage('Error publishing availability. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className='space-y-8 lg:px-4 sm:px-0'>
       {/* Header */}
          <div className='h-auto sm:h-[66px] space-y-1'>
            <h1 className="text-h1" style={{ color: 'var(--color-text-primary)' }}>
              Set Availability
            </h1>
            <p className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>
              Manage your weekly availability. Koshpal may schedule sessions within these windows.
            </p>
          </div>
    <div className="flex flex-col h-full lg:flex-row">
      {/* Main Content */}
      <div className="flex-1 order-2 overflow-x-hidden overflow-y-auto lg:order-1 scrollbar-hide">
        <div className="space-y-8 ">

          {/* Quick Presets */}
          <div className="p-4 space-y-4 border sm:p-6 rounded-xl" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)' }}>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              <h2 className="text-h4" style={{ color: 'var(--color-text-primary)' }}>Quick Presets</h2>
            </div>
            <div className="flex flex-wrap gap-2 h-auto sm:h-[42px]">
              <button
                onClick={() => applyPreset('morning')}
                className="flex items-center gap-2 h-[36px] px-3 sm:px-4 py-2 rounded-[10px] border font-jakarta font-medium text-[14px] leading-[20px] tracking-normal hover:opacity-80 transition-all text-sm"
                style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', borderColor: 'var(--color-border-primary)' }}
              >
                <span className="hidden sm:inline">Morning (8-12)</span>
                <span className="sm:hidden">Morning</span>
              </button>
              <button
                onClick={() => applyPreset('afternoon')}
                className="flex items-center gap-2 h-[36px] px-3 sm:px-4 py-2 rounded-[10px] border font-jakarta font-medium text-[14px] leading-[20px] tracking-normal hover:opacity-80 transition-all text-sm"
                style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', borderColor: 'var(--color-border-primary)' }}
              >
                <span className="hidden sm:inline">Afternoon (1-5)</span>
                <span className="sm:hidden">Afternoon</span>
              </button>
              <button
                onClick={() => applyPreset('evening')}
                className="flex items-center gap-2 h-[36px] px-3 sm:px-4 py-2 rounded-[10px] border font-jakarta font-medium text-[14px] leading-[20px] tracking-normal hover:opacity-80 transition-all text-sm"
                style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', borderColor: 'var(--color-border-primary)' }}
              >
                <span className="hidden sm:inline">Evening (5-9)</span>
                <span className="sm:hidden">Evening</span>
              </button>
              <button
                onClick={() => applyPreset('fullday')}
                className="flex items-center gap-2 h-[36px] px-3 sm:px-4 py-2 rounded-[10px] border font-jakarta font-medium text-[14px] leading-[20px] tracking-normal hover:opacity-80 transition-all text-sm"
                style={{ backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', borderColor: 'var(--color-border-primary)' }}
              >
                <span className="hidden sm:inline">Full Day (9-5)</span>
                <span className="sm:hidden">Full Day</span>
              </button>
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="space-y-6 px-3 sm:px-4 sm:px-6 py-6 rounded-[16px] border" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)' }}>
            <h4 className="text-h4" style={{ color: 'var(--color-text-primary)' }}>Weekly Schedule</h4>
            <div className="space-y-3">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="p-2 sm:p-3 sm:p-[17px] border rounded-[12px]"
                  style={{ borderColor: 'var(--color-border-primary)' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 h-[32px]">
                      {/* Toggle Switch */}
                      <button
                        onClick={() => toggleDay(day)}
                        className={`relative inline-flex h-[18px] w-[32px] items-center rounded-full transition-colors`}
                        style={{ backgroundColor: schedule[day].enabled ? 'var(--color-primary)' : 'var(--color-grey-light)' }}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full transition-transform`}
                          style={{ 
                            backgroundColor: 'var(--color-bg-card)',
                            transform: schedule[day].enabled ? 'translateX(15px)' : 'translateX(1px)'
                          }}
                        />
                      </button>
                      <span className={`text-body-md font-medium`} style={{ 
                        color: schedule[day].enabled ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'
                      }}>
                        {day}
                      </span>
                    </div>
                    <button
                      onClick={() => addSlot(day)}
                      disabled={!schedule[day].enabled}
                      className="flex items-center gap-2 px-2.5 py-1.5 font-jakarta font-500 text-sm rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      <Plus className="w-4 h-4" />
                      Add Slot
                    </button>
                  </div>

                  {/* Time Slots */}
                  {schedule[day].enabled && schedule[day].slots.length > 0 && (
                    <div className="space-y-3">
                      {schedule[day].slots.map((slot, slotIndex) => {
                        const duration = calculateDuration(slot.start, slot.end);
                        return (
                          <div
                            key={slotIndex}
                            className="flex items-center gap-2 rounded-lg"
                          >
                            <div className="flex items-center gap-2 h-[36px] flex-1">
                              {/* Start Time */}
                              <select
                                value={slot.start}
                                onChange={(e) => updateSlotTime(day, slotIndex, 'start', e.target.value)}
                                className="px-2 sm:px-3 w-[100px] sm:w-[128px] border rounded-[10px] font-jakarta text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-primary focus:border-transparent"
                                style={{ 
                                  backgroundColor: 'var(--color-bg-secondary)', 
                                  color: 'var(--color-text-primary)',
                                  borderColor: 'transparent'
                                }}
                              >
                                {timeOptions.map((time) => (
                                  <option key={time} value={time}>
                                    {formatTime(time)}
                                  </option>
                                ))}
                              </select>
                              
                              <span className="font-jakarta" style={{ color: 'var(--color-text-tertiary)' }}>to</span>
                              
                              {/* End Time */}
                              <select
                                value={slot.end}
                                onChange={(e) => updateSlotTime(day, slotIndex, 'end', e.target.value)}
                                className="px-2 sm:px-3 w-[100px] sm:w-[128px] border rounded-[10px] font-jakarta text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-primary focus:border-transparent"
                                style={{ 
                                  backgroundColor: 'var(--color-bg-secondary)', 
                                  color: 'var(--color-text-primary)',
                                  borderColor: 'transparent'
                                }}
                              >
                                
                                {timeOptions.map((time) => (
                                  <option key={time} value={time}>
                                    {formatTime(time)}
                                  </option>
                                ))}
                              </select>
                              
                              {/* Duration */}
                              <span className="font-jakarta font-medium text-xs py-[2px] px-2 border rounded-[10px] whitespace-nowrap" style={{ 
                                backgroundColor: 'var(--color-bg-secondary)', 
                                color: 'var(--color-text-primary)',
                                borderColor: 'transparent'
                              }}>
                                {duration}h
                              </span>

                              {/* Delete Button */}
                              <button
                                onClick={() => removeSlot(day, slotIndex)}
                                className="p-2 transition-all rounded-lg hover:opacity-80"
                                style={{ color: 'var(--color-error)' }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="order-1 w-full px-4 mb-6 space-y-6 overflow-y-auto lg:order-2 lg:w-80 sm:px-6 lg:px-4 lg:mb-0">
        {/* Publish Button */}
        <button
          onClick={handlePublish}
          disabled={publishing}
          className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-outfit font-medium text-sm leading-5 tracking-normal hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}
        >
          {publishing ? (
            <>
              <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span className="hidden sm:inline">Publish availability</span>
              <span className="sm:hidden">Publish</span>
            </>
          )}
        </button>

        {/* Success/Error Message */}
        {publishMessage && (
          <div 
            className="p-3 text-sm rounded-lg"
            style={{ 
              backgroundColor: publishMessage.includes('Error') ? 'var(--color-error-light)' : 'var(--color-success-light)',
              color: publishMessage.includes('Error') ? 'var(--color-error)' : 'var(--color-success)'
            }}
          >
            {publishMessage}
          </div>
        )}

        {/* Settings */}
        <div className="space-y-4">
          {/* <h3 className="text-lg font-outfit font-600 text-black-dark">Settings</h3> */}
          
          {/* Timezone */}
          {/* <div>
            <label className="block mb-2 text-sm font-jakarta font-600 text-black-dark">
              Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-2 text-sm border rounded-lg border-grey-lightest font-jakarta text-black-dark bg-white-darkest focus:outline-none focus:ring-2 focus:ring-primary-primary focus:border-transparent"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
            </select>
          </div> */}

          {/* Session Duration */}
          {/* <div>
            <label className="block mb-2 text-sm font-jakarta font-600 text-black-dark">
              Preferred Session Duration
            </label>
            <select
              value={sessionDuration}
              onChange={(e) => setSessionDuration(e.target.value)}
              className="w-full px-4 py-2 text-sm border rounded-lg border-grey-lightest font-jakarta text-black-dark bg-white-darkest focus:outline-none focus:ring-2 focus:ring-primary-primary focus:border-transparent"
            >
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
            </select>
          </div> */}

          {/* Recurring Schedule */}
          {/* <div className="flex items-center justify-between">
            <label className="text-sm font-jakarta font-600 text-black-dark">
              Apply this schedule weekly
            </label>
            <button>Toggle</button>
          </div> */}
        </div>

        {/* Summary */}
        <div className="px-4 pt-4 pb-4 space-y-5 border rounded-2xl rounded-xl" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-primary)' }}>
          <h3 className="text-h4" style={{ color: 'var(--color-text-primary)' }}>Summary</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>Active Days:</span>
              <span className="text-sm font-jakarta font-600" style={{ color: 'var(--color-secondary)' }}>{summary.activeDays}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>Total Slots:</span>
              <span className="text-sm font-jakarta font-600" style={{ color: 'var(--color-secondary)' }}>{summary.totalSlots}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>Hours/Week:</span>
              <span className="text-sm font-jakarta font-600" style={{ color: 'var(--color-secondary)' }}>~{summary.totalHours}h</span>
            </div>
          </div>
        </div>

        {/* Info Message */}
        <div className="rounded-[12px] p-3 mb-6 sm:mb-6" style={{ backgroundColor: 'rgba(23, 162, 184, 0.125)' }}>
          <p className="text-body-sm" style={{ color: 'var(--color-text-primary)' }}>
            Koshpal may schedule sessions within your available windows. You'll be notified before any session is confirmed.
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
