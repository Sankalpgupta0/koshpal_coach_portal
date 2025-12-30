import React, { useState, useMemo, useEffect } from 'react';
import { Clock, Trash2, Calendar, Plus, Save, Menu, X, Eye, EyeOff } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { createSlots, getMySlots, deleteSlot, saveWeeklyAvailability, getWeeklySchedule } from '../api';


export default function Availability() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Generate time options (00:00 to 23:00 in 1-hour intervals)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      const h = hour.toString().padStart(2, '0');
      times.push(`${h}:00`);
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  // Format time for display (HH:MM to HH:MM format)
  const formatTime = (time) => {
    return time;
  };

  // Calculate duration in hours (must be exactly 1 hour per slot)
  const calculateDuration = (start, end) => {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const diff = endMinutes - startMinutes;
    return diff / 60; // Return hours
  };

  // Helper function to convert time string to minutes
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Helper function to convert minutes to time string
  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Convert time to IST for display (all times are now standardized to IST)
  const convertToIST = (timeString) => {
    // Times from backend are already in IST format, so return as-is
    return timeString;
  };

  // Helper component for rendering slot rows
  const SlotRow = ({ slot, slotIndex, day, timeOptions, formatTime, calculateDuration, updateSlotTime, deleteExistingSlot, removeSlot, convertToIST }) => {
    const duration = calculateDuration(slot.start, slot.end);
    const isExistingSlot = slot.id && slot.status;

    return (
      <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: 'var(--color-bg-card)' }}>
        <div className="flex items-center gap-2 h-[36px] flex-1">
          {/* Start Time */}
          {slot.status === 'BOOKED' ? (
            <div
              className="px-2 sm:px-3 w-[100px] sm:w-[128px] border rounded-[10px] font-jakarta text-xs sm:text-sm flex items-center"
              style={{
                backgroundColor: 'var(--color-grey-lightest)',
                color: 'var(--color-text-secondary)',
                borderColor: 'transparent'
              }}
            >
              {convertToIST(slot.start)}
            </div>
          ) : (
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
          )}

          <span className="font-jakarta" style={{ color: 'var(--color-text-tertiary)' }}>to</span>

          {/* End Time */}
          {slot.status === 'BOOKED' ? (
            <div
              className="px-2 sm:px-3 w-[100px] sm:w-[128px] border rounded-[10px] font-jakarta text-xs sm:text-sm flex items-center"
              style={{
                backgroundColor: 'var(--color-grey-lightest)',
                color: 'var(--color-text-secondary)',
                borderColor: 'transparent'
              }}
            >
              {convertToIST(slot.end)}
            </div>
          ) : (
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
          )}

          {/* Duration */}
          <span className="font-jakarta font-medium text-xs py-[2px] px-2 border rounded-[10px] whitespace-nowrap" style={{
            backgroundColor: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            borderColor: 'transparent'
          }}>
            {duration}h
          </span>

          {/* Status Indicator for existing slots */}
          {isExistingSlot && (
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${slot.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                slot.status === 'BOOKED' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
              }`}>
              {slot.status}
            </span>
          )}

          {/* Delete Button */}
          <button
            onClick={() => isExistingSlot ? deleteExistingSlot(slot.id) : removeSlot(day, slotIndex)}
            disabled={slot.status === 'BOOKED'}
            className="p-2 transition-all rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: slot.status === 'BOOKED' ? 'var(--color-text-secondary)' : 'var(--color-error)' }}
            title={slot.status === 'BOOKED' ? 'Cannot delete booked slots' : (isExistingSlot ? 'Delete from all future dates' : 'Remove from schedule')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Initialize default schedule
  const initializeSchedule = () => {
    return {
      Monday: { enabled: false, slots: [] },
      Tuesday: { enabled: false, slots: [] },
      Wednesday: { enabled: false, slots: [] },
      Thursday: { enabled: false, slots: [] },
      Friday: { enabled: false, slots: [] },
      Saturday: { enabled: false, slots: [] },
      Sunday: { enabled: false, slots: [] },
    };
  };

  const [schedule, setSchedule] = useState(initializeSchedule);
  const [timezone, setTimezone] = useState('Asia/Kolkata'); // Always IST
  const [sessionDuration, setSessionDuration] = useState('45');
  const [recurringSchedule, setRecurringSchedule] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookedSlots, setShowBookedSlots] = useState(true);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Load existing slots on mount
  useEffect(() => {
    loadExistingSlots();
  }, []);

  const loadExistingSlots = async () => {
    try {
      setLoading(true);
      const weeklySchedule = await getWeeklySchedule(4); // Load 4 weeks of data

      // Convert weekly schedule to local schedule format
      const newSchedule = { ...initializeSchedule() };

      Object.entries(weeklySchedule).forEach(([weekday, slots]) => {
        // Map uppercase weekday to capitalized (e.g., 'MONDAY' -> 'Monday')
        const capitalizedWeekday = weekday.charAt(0) + weekday.slice(1).toLowerCase();
        if (slots && slots.length > 0) {
          newSchedule[capitalizedWeekday].enabled = true;
          // Group slots by time and keep the first occurrence with status
          const timeGroups = {};
          slots.forEach(slot => {
            const timeKey = `${slot.start}-${slot.end}`;
            if (!timeGroups[timeKey]) {
              timeGroups[timeKey] = {
                start: slot.start,
                end: slot.end,
                id: slot.id,
                status: slot.status,
              };
            }
          });
          newSchedule[capitalizedWeekday].slots = Object.values(timeGroups);
        }
      });

      setSchedule(newSchedule);
    } catch (err) {
      console.error('Error loading slots:', err);
      setError('Failed to load existing availability. Please refresh the page.');
    } finally {
      setLoading(false);
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
        slots: [...prev[day].slots, { start: '09:00', end: '10:00' }]
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

  const deleteExistingSlot = async (slotId) => {
    try {
      await deleteSlot(slotId);
      // Reload slots to reflect the deletion
      await loadExistingSlots();
      setPublishMessage('Slot deleted successfully!');
      setTimeout(() => setPublishMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting slot:', err);
      setPublishMessage('Error deleting slot. Please try again.');
      setTimeout(() => setPublishMessage(''), 3000);
    }
  };

  const updateSlotTime = (day, slotIndex, field, value) => {
    setSchedule(prev => {
      const updatedSlots = prev[day].slots.map((slot, index) => {
        if (index === slotIndex) {
          const updatedSlot = { ...slot, [field]: value };

          // Validate time constraints
          const startMinutes = timeToMinutes(updatedSlot.start);
          const endMinutes = timeToMinutes(updatedSlot.end);

          // Ensure start time is before end time
          if (startMinutes >= endMinutes) {
            // If invalid, adjust the end time to be 1 hour after start
            if (field === 'start') {
              updatedSlot.end = minutesToTime(startMinutes + 60);
            } else {
              // If changing end time to be before start, set it to start + 1 hour
              updatedSlot.end = minutesToTime(startMinutes + 60);
            }
          }

          // Ensure exactly 1 hour duration
          const duration = endMinutes - startMinutes;
          if (duration !== 60) {
            if (field === 'start') {
              updatedSlot.end = minutesToTime(startMinutes + 60);
            } else if (field === 'end') {
              updatedSlot.start = minutesToTime(endMinutes - 60);
            }
          }

          return updatedSlot;
        }
        return slot;
      });

      return {
        ...prev,
        [day]: {
          ...prev[day],
          slots: updatedSlots
        }
      };
    });
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

      switch (preset) {
        case 'morning':
          newSchedule[day].slots = [
            { start: '08:00', end: '09:00' },
            { start: '09:00', end: '10:00' },
            { start: '10:00', end: '11:00' },
            { start: '11:00', end: '12:00' }
          ];
          break;
        case 'afternoon':
          newSchedule[day].slots = [
            { start: '13:00', end: '14:00' },
            { start: '14:00', end: '15:00' },
            { start: '15:00', end: '16:00' },
            { start: '16:00', end: '17:00' }
          ];
          break;
        case 'evening':
          newSchedule[day].slots = [
            { start: '17:00', end: '18:00' },
            { start: '18:00', end: '19:00' },
            { start: '19:00', end: '20:00' },
            { start: '20:00', end: '21:00' }
          ];
          break;
        case 'fullday':
          newSchedule[day].slots = [
            { start: '09:00', end: '10:00' },
            { start: '10:00', end: '11:00' },
            { start: '11:00', end: '12:00' },
            { start: '13:00', end: '14:00' },
            { start: '14:00', end: '15:00' },
            { start: '15:00', end: '16:00' },
            { start: '16:00', end: '17:00' }
          ];
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

      // Convert local schedule format to API format
      const weeklySchedule = {};
      daysOfWeek.forEach(day => {
        if (schedule[day].enabled && schedule[day].slots.length > 0) {
          weeklySchedule[day.toUpperCase()] = schedule[day].slots.map(slot => ({
            start: slot.start,
            end: slot.end,
          }));
        }
      });

      // Create normalized payload
      const payload = {
        slotDurationMinutes: 60, // Fixed to 1 hour slots
        weeksToGenerate: 4, // Generate 4 weeks ahead
        weeklySchedule,
      };

      const result = await saveWeeklyAvailability(payload);

      setPublishMessage(`Availability saved successfully! Generated ${result.slotsGenerated} slots for ${result.weeksGenerated} weeks.`);

      // Reload slots to reflect changes
      await loadExistingSlots();

      setTimeout(() => setPublishMessage(''), 5000);

    } catch (err) {
      console.error('Error publishing availability:', err);
      const errorMessage = err.response?.data?.message || 'Error saving availability. Please try again.';
      setPublishMessage(errorMessage);
      setTimeout(() => setPublishMessage(''), 5000);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
          } ${isSidebarOpen ? 'lg:blur-0 blur-[2px]' : ''}`}
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      >

        <Header
          title="Availability"
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 p-4 overflow-y-auto sm:p-6">
          <div className="mx-auto space-y-6 max-w-7xl">
            <div className='space-y-8 lg:px-4 sm:px-0'>
              {/* Header */}
              <p className="text-body-md" style={{ color: 'var(--color-text-secondary)' }}>
                Manage your weekly availability. Koshpal may schedule sessions within these windows.
              </p>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-b-2 rounded-full animate-spin" style={{ borderColor: 'var(--color-primary)' }}></div>
                  <span className="ml-3" style={{ color: 'var(--color-text-secondary)' }}>Loading availability...</span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="p-4 border rounded-lg" style={{
                  backgroundColor: 'var(--color-error-light)',
                  borderColor: 'var(--color-error)',
                  color: 'var(--color-error)'
                }}>
                  <div className="flex items-center justify-between">
                    <span>{error}</span>
                    <button
                      onClick={() => {
                        setError('');
                        loadExistingSlots();
                      }}
                      className="px-3 py-1 text-sm rounded hover:opacity-80"
                      style={{ backgroundColor: 'var(--color-error)', color: 'white' }}
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col h-full lg:flex-row">
                {/* Main Content */}
                <div className="flex-1 order-2 overflow-x-hidden overflow-y-auto lg:order-1 scrollbar-hide">
                  <div className="space-y-8">

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
                      <div className="flex items-center justify-between">
                        <h4 className="text-h4" style={{ color: 'var(--color-text-primary)' }}>Weekly Schedule</h4>
                        <div className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded">
                          Times in IST (Indian Standard Time)
                        </div>
                      </div>
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
                              <div className="space-y-4">
                                {/* Available Slots Section */}
                                {(() => {
                                  const availableSlots = schedule[day].slots.filter(slot => !slot.status || slot.status === 'AVAILABLE' || slot.status === 'CANCELLED');
                                  const bookedSlots = schedule[day].slots.filter(slot => slot.status === 'BOOKED');

                                  return (
                                    <>
                                      {/* Available Slots */}
                                      {availableSlots.length > 0 && (
                                        <div className="space-y-2">
                                          <h4 className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                                            Available Slots ({availableSlots.length})
                                          </h4>
                                          <div className="space-y-2">
                                            {availableSlots.map((slot, originalIndex) => {
                                              // Find the original index in the full array
                                              const slotIndex = schedule[day].slots.findIndex(s => s === slot);
                                              return (
                                                <SlotRow
                                                  key={slotIndex}
                                                  slot={slot}
                                                  slotIndex={slotIndex}
                                                  day={day}
                                                  timeOptions={timeOptions}
                                                  formatTime={formatTime}
                                                  calculateDuration={calculateDuration}
                                                  updateSlotTime={updateSlotTime}
                                                  deleteExistingSlot={deleteExistingSlot}
                                                  removeSlot={removeSlot}
                                                  convertToIST={convertToIST}
                                                />
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}

                                      {/* Booked Slots Section */}
                                      {bookedSlots.length > 0 && (
                                        <div className="space-y-2">
                                          <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                                              Booked Appointments ({bookedSlots.length})
                                            </h4>
                                            <button
                                              onClick={() => setShowBookedSlots(!showBookedSlots)}
                                              className="flex items-center gap-1 px-2 py-1 text-xs transition-all border rounded hover:opacity-80"
                                              style={{
                                                backgroundColor: 'var(--color-bg-secondary)',
                                                color: 'var(--color-text-secondary)',
                                                borderColor: 'var(--color-border-secondary)'
                                              }}
                                              title={showBookedSlots ? 'Hide booked appointments' : 'Show booked appointments'}
                                            >
                                              {showBookedSlots ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                              <span>{showBookedSlots ? 'Hide' : 'Show'}</span>
                                            </button>
                                          </div>
                                          {showBookedSlots && (
                                            <div className="space-y-2">
                                              {bookedSlots.map((slot, originalIndex) => {
                                                // Find the original index in the full array
                                                const slotIndex = schedule[day].slots.findIndex(s => s === slot);
                                                return (
                                                  <SlotRow
                                                    key={slotIndex}
                                                    slot={slot}
                                                    slotIndex={slotIndex}
                                                    day={day}
                                                    timeOptions={timeOptions}
                                                    formatTime={formatTime}
                                                    calculateDuration={calculateDuration}
                                                    updateSlotTime={updateSlotTime}
                                                    deleteExistingSlot={deleteExistingSlot}
                                                    removeSlot={removeSlot}
                                                    convertToIST={convertToIST}
                                                  />
                                                );
                                              })}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </>
                                  );
                                })()}
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
                  <div className="rounded-[12px] p-3 mb-6 sm:mb-6" style={{ backgroundColor: 'var(--color-info-bg)' }}>
                    <p className="text-body-sm" style={{ color: 'var(--color-text-primary)' }}>
                      Koshpal may schedule sessions within your available windows. You'll be notified before any session is confirmed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
