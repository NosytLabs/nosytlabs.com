import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Globe,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

interface InteractiveCalendarProps {
  selectedDate?: string;
  selectedTime?: string;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  timezone?: string;
  className?: string;
  businessHours?: {
    start: string;
    end: string;
    days: number[]; // 0 = Sunday, 1 = Monday, etc.
  };
  blockedDates?: string[];
  minDate?: Date;
  maxDate?: Date;
}

interface TimeSlot {
  time: string;
  available: boolean;
  loading?: boolean;
  popular?: boolean;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Generate time slots based on business hours
const generateTimeSlots = (
  businessHours: { start: string; end: string } = { start: '09:00', end: '17:00' }
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const [startHour, startMinute] = businessHours.start.split(':').map(Number);
  const [endHour, endMinute] = businessHours.end.split(':').map(Number);
  
  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;
  
  // Generate 30-minute slots
  for (let time = startTime; time < endTime; time += 30) {
    const hour = Math.floor(time / 60);
    const minute = time % 60;
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    // Mark popular time slots (10 AM - 2 PM)
    const isPopular = hour >= 10 && hour < 14;
    
    slots.push({
      time: timeString,
      available: Math.random() > 0.3, // Simulate availability
      popular: isPopular,
    });
  }
  
  return slots;
};

// Format time for display
const formatTime = (time: string): string => {
  const [hour, minute] = time.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
};

// Check if date is weekend
const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

// Check if date is today
const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Check if date is in the past
const isPastDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

export const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  timezone = 'UTC',
  className = '',
  businessHours = { start: '09:00', end: '17:00', days: [1, 2, 3, 4, 5] },
  blockedDates = [],
  minDate = new Date(),
  maxDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [view, setView] = useState<'calendar' | 'time'>('calendar');

  // Generate time slots when component mounts or business hours change
  useEffect(() => {
    const slots = generateTimeSlots(businessHours);
    setTimeSlots(slots);
  }, [businessHours]);

  // Simulate loading availability when date changes
  useEffect(() => {
    if (selectedDate && view === 'time') {
      setLoadingAvailability(true);
      const timer = setTimeout(() => {
        // Simulate API call to check availability
        setTimeSlots(prev => prev.map(slot => ({
          ...slot,
          available: Math.random() > 0.3,
          loading: false,
        })));
        setLoadingAvailability(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [selectedDate, view]);

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: Date[] = [];
    const current = new Date(startDate);
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [currentMonth]);

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    if (isPastDate(date) || !businessHours.days.includes(date.getDay())) {
      return;
    }
    
    const dateString = date.toISOString().split('T')[0];
    if (blockedDates.includes(dateString)) {
      return;
    }
    
    onDateSelect(dateString);
    setView('time');
  };

  const handleTimeClick = (time: string) => {
    const slot = timeSlots.find(s => s.time === time);
    if (slot?.available) {
      onTimeSelect(time);
    }
  };

  const handleBackToCalendar = () => {
    setView('calendar');
  };

  const isDateSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return date.toISOString().split('T')[0] === selectedDate;
  };

  const isDateAvailable = (date: Date): boolean => {
    if (isPastDate(date)) return false;
    if (!businessHours.days.includes(date.getDay())) return false;
    if (blockedDates.includes(date.toISOString().split('T')[0])) return false;
    if (date < minDate || date > maxDate) return false;
    return true;
  };

  const getDateStatus = (date: Date): 'available' | 'unavailable' | 'selected' | 'today' => {
    if (isDateSelected(date)) return 'selected';
    if (isToday(date) && isDateAvailable(date)) return 'today';
    if (isDateAvailable(date)) return 'available';
    return 'unavailable';
  };

  const renderCalendarView = () => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousMonth}
            className="p-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextMonth}
            className="p-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Timezone Display */}
      {timezone && (
        <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
          <Globe className="w-4 h-4" />
          <span>Times shown in {timezone}</span>
        </div>
      )}

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-text-secondary">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const status = getDateStatus(date);
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
          
          return (
            <motion.button
              key={index}
              type="button"
              onClick={() => handleDateClick(date)}
              disabled={status === 'unavailable'}
              className={cn(
                'p-3 text-sm rounded-lg transition-all duration-200 relative',
                {
                  'text-text-muted': !isCurrentMonth,
                  'text-text-primary hover:bg-surface-secondary': isCurrentMonth && status === 'available',
                  'bg-primary text-white shadow-lg': status === 'selected',
                  'bg-primary/10 text-primary border-2 border-primary': status === 'today',
                  'text-text-muted cursor-not-allowed': status === 'unavailable',
                  'hover:scale-105': status !== 'unavailable',
                }
              )}
              whileHover={status !== 'unavailable' ? { scale: 1.05 } : {}}
              whileTap={status !== 'unavailable' ? { scale: 0.95 } : {}}
            >
              {date.getDate()}
              
              {/* Availability indicator */}
              {isCurrentMonth && status === 'available' && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full" />
              )}
              
              {/* Weekend indicator */}
              {isCurrentMonth && isWeekend(date) && status !== 'unavailable' && (
                <div className="absolute top-1 right-1 w-1 h-1 bg-orange-400 rounded-full" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs text-text-secondary mt-4">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-orange-400 rounded-full" />
          <span>Weekend</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-text-muted rounded-full" />
          <span>Unavailable</span>
        </div>
      </div>
    </motion.div>
  );

  const renderTimeView = () => {
    const selectedDateObj = selectedDate ? new Date(selectedDate) : null;
    const formattedDate = selectedDateObj
      ? selectedDateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '';

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="space-y-4"
      >
        {/* Time Selection Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Select Time</h3>
              <p className="text-sm text-text-secondary">{formattedDate}</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToCalendar}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Calendar
          </Button>
        </div>

        {/* Loading State */}
        {loadingAvailability && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-text-secondary">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Checking availability...</span>
            </div>
          </div>
        )}

        {/* Time Slots Grid */}
        {!loadingAvailability && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {timeSlots.map((slot) => {
              const isSelected = selectedTime === slot.time;
              
              return (
                <motion.button
                  key={slot.time}
                  type="button"
                  onClick={() => handleTimeClick(slot.time)}
                  disabled={!slot.available}
                  className={cn(
                    'p-3 rounded-lg border-2 transition-all duration-200 relative',
                    {
                      'border-primary bg-primary text-white shadow-lg': isSelected,
                      'border-border-muted hover:border-primary hover:bg-primary/5 text-text-primary': !isSelected && slot.available,
                      'border-border-muted bg-surface-muted text-text-muted cursor-not-allowed': !slot.available,
                    }
                  )}
                  whileHover={slot.available ? { scale: 1.02 } : {}}
                  whileTap={slot.available ? { scale: 0.98 } : {}}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-medium">{formatTime(slot.time)}</span>
                    
                    {slot.popular && slot.available && !isSelected && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        Popular
                      </Badge>
                    )}
                    
                    {!slot.available && (
                      <span className="text-xs text-text-muted">Unavailable</span>
                    )}
                  </div>
                  
                  {/* Status Icons */}
                  {isSelected && (
                    <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-white bg-primary rounded-full" />
                  )}
                  
                  {!slot.available && (
                    <AlertCircle className="absolute -top-1 -right-1 w-4 h-4 text-error-500 bg-white rounded-full" />
                  )}
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Time Selection Summary */}
        {selectedTime && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-text-primary">
                  Selected: {formattedDate} at {formatTime(selectedTime)}
                </p>
                <p className="text-sm text-text-secondary">
                  {timezone && `Time shown in ${timezone}`}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Available Times Summary */}
        {!loadingAvailability && (
          <div className="mt-4 text-center text-sm text-text-secondary">
            {timeSlots.filter(slot => slot.available).length} of {timeSlots.length} time slots available
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className={cn('bg-white rounded-lg border border-border-muted p-6', className)}>
      <AnimatePresence mode="wait">
        {view === 'calendar' ? renderCalendarView() : renderTimeView()}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveCalendar;