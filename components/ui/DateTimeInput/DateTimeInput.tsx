import React from 'react';
import { DateTimeInputProps } from './types';

export const DateTimeInput: React.FC<DateTimeInputProps> = ({
  value,
  onChange,
  title,
  placeholder = "Select date and time",
  disabled = false,
  error,
  className = "",
  min,
  max
}) => {
  // Convert Unix timestamp to datetime-local format
  const timestampToDateTimeLocal = (timestamp: string): string => {
    if (!timestamp || timestamp === '0') return '';
    try {
      const date = new Date(parseInt(timestamp) * 1000);
      return date.toISOString().slice(0, 16);
    } catch {
      return '';
    }
  };

  // Convert datetime-local format to Unix timestamp
  const dateTimeLocalToTimestamp = (dateTime: string): string => {
    if (!dateTime) return '0';
    try {
      const date = new Date(dateTime);
      return Math.floor(date.getTime() / 1000).toString();
    } catch {
      return '0';
    }
  };

  const handleDateTimeChange = (dateTime: string) => {
    const timestamp = dateTimeLocalToTimestamp(dateTime);
    onChange(timestamp);
  };

  const currentDateTime = timestampToDateTimeLocal(value);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="block text-text-secondary text-sm font-medium">
          {title}
        </label>
      </div>

      {/* Input */}
      <div className="relative">
        <input
          type="datetime-local"
          value={currentDateTime}
          onChange={(e) => handleDateTimeChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          className={`
            w-full bg-dark-surface border rounded-lg px-4 py-3 
            text-white placeholder-text-secondary 
            focus:outline-none transition-colors
            [&::-webkit-calendar-picker-indicator]:filter-none
            [&::-webkit-calendar-picker-indicator]:opacity-100
            [&::-webkit-calendar-picker-indicator]:brightness-0
            [&::-webkit-calendar-picker-indicator]:saturate-100
            [&::-webkit-calendar-picker-indicator]:invert-[1]
            [&::-webkit-calendar-picker-indicator]:sepia-[1]
            [&::-webkit-calendar-picker-indicator]:saturate-[5000%]
            [&::-webkit-calendar-picker-indicator]:hue-rotate-[315deg]
            [&::-webkit-calendar-picker-indicator]:brightness-[1.1]
            [&::-webkit-calendar-picker-indicator]:contrast-[1]
            ${error 
              ? 'border-red-400 focus:border-red-400' 
              : 'border-gray-600 focus:border-accent-orange'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
      </div>

      {/* Helper Text */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-secondary">
          Unix timestamp: {value || '0'}
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-400 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};