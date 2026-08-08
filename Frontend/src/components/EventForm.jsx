import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import TimePicker12h from './TimePicker12h';
import { formatTo12Hour, formatTo24Hour } from '../utils/timeUtils';

export default function EventForm({ onGenerate, loading }) {
  const { isLoggedIn } = useAuth();

  const [formData, setFormData] = useState({
    eventType: '',
    guests: '',
    location: '',
    date: '',
    time: '05:00 PM', // Default 12-hour formatted selection
    budget: '',
    description: '',
    aiModel: 'basic'
  });

  const [errors, setErrors] = useState({});

  // If user logs out while Advanced was selected, revert back to basic
  useEffect(() => {
    if (!isLoggedIn && formData.aiModel === 'advanced') {
      setFormData((prev) => ({ ...prev, aiModel: 'basic' }));
    }
  }, [isLoggedIn, formData.aiModel]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    // Prevent selecting 'advanced' if unauthenticated
    if (id === 'aiModel' && value === 'advanced' && !isLoggedIn) {
      return;
    }

    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleTimeChange = (newTime12h) => {
    setFormData((prev) => ({ ...prev, time: newTime12h }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.eventType.trim()) newErrors.eventType = 'Event type is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.date) newErrors.date = 'Date is required';
    
    const guestsNum = parseInt(formData.guests, 10);
    if (!formData.guests || isNaN(guestsNum) || guestsNum <= 0) {
      newErrors.guests = 'Please enter a valid guest count (> 0)';
    }

    const budgetNum = parseFloat(formData.budget);
    if (!formData.budget || isNaN(budgetNum) || budgetNum <= 0) {
      newErrors.budget = 'Please enter a valid budget (> 0)';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Frontend safety check: force 'basic' if user is not logged in
      const sanitizedModel = (!isLoggedIn && formData.aiModel === 'advanced') 
        ? 'basic' 
        : formData.aiModel;

      const submissionPayload = {
        ...formData,
        aiModel: sanitizedModel,
        time: formatTo24Hour(formData.time), // 24h format for backend API payload
        formattedTime12h: formatTo12Hour(formData.time) // 12h format for UI display
      };

      onGenerate(submissionPayload);
    }
  };

  const charCount = formData.description.length;
  const isOverLimit = charCount > 500;

  return (
    <div className="relative z-10 w-full max-w-[600px] bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1),0_2px_4px_-2px_rgb(0_0_0/0.1)] p-lg md:p-[32px]">
      {/* Header */}
      <div className="text-center mb-xl">
        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-sm font-bold">
          Plan Your Event
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Fill in the details and let AI build your plan.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-md">
        {/* Event Type */}
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="eventType">
            Event Type
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-outline">category</span>
            </div>
            <input
              id="eventType"
              type="text"
              value={formData.eventType}
              onChange={handleChange}
              placeholder="e.g., Birthday, Corporate Retreat"
              className={`w-full pl-[48px] pr-md py-md bg-transparent border rounded-lg font-body-lg text-on-surface placeholder:text-outline focus:border-primary focus:ring-[3px] focus:ring-primary/20 focus:outline-none transition-all duration-200 ${
                errors.eventType ? 'border-error' : 'border-outline-variant'
              }`}
            />
          </div>
          {errors.eventType && <span className="text-error text-code-sm">{errors.eventType}</span>}
        </div>

        {/* Guests & Location Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {/* Guests */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="guests">
              Number of Guests
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline">group</span>
              </div>
              <input
                id="guests"
                type="number"
                min="1"
                value={formData.guests}
                onChange={handleChange}
                placeholder="50"
                className={`w-full pl-[48px] pr-md py-md bg-transparent border rounded-lg font-body-lg text-on-surface placeholder:text-outline focus:border-primary focus:ring-[3px] focus:ring-primary/20 focus:outline-none transition-all duration-200 ${
                  errors.guests ? 'border-error' : 'border-outline-variant'
                }`}
              />
            </div>
            {errors.guests && <span className="text-error text-code-sm">{errors.guests}</span>}
          </div>

          {/* Location */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="location">
              Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline">location_on</span>
              </div>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="City or Venue Name"
                className={`w-full pl-[48px] pr-md py-md bg-transparent border rounded-lg font-body-lg text-on-surface placeholder:text-outline focus:border-primary focus:ring-[3px] focus:ring-primary/20 focus:outline-none transition-all duration-200 ${
                  errors.location ? 'border-error' : 'border-outline-variant'
                }`}
              />
            </div>
            {errors.location && <span className="text-error text-code-sm">{errors.location}</span>}
          </div>
        </div>

        {/* Date & 12-Hour Time Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {/* Date */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="date">
              Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none z-10">
                <span className="material-symbols-outlined text-outline">calendar_today</span>
              </div>
              <input
                id="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full pl-[48px] pr-md py-md bg-transparent border rounded-lg font-body-lg text-on-surface focus:border-primary focus:ring-[3px] focus:ring-primary/20 focus:outline-none transition-all duration-200 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full ${
                  errors.date ? 'border-error' : 'border-outline-variant'
                }`}
              />
            </div>
            {errors.date && <span className="text-error text-code-sm">{errors.date}</span>}
          </div>

          {/* Interactive 12-Hour Time Selector */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Start Time (12-Hour)
            </label>
            <TimePicker12h value={formData.time} onChange={handleTimeChange} />
          </div>
        </div>

        {/* Budget */}
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="budget">
            Estimated Budget
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none">
              <span className="font-body-lg text-outline">₹</span>
            </div>
            <input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={handleChange}
              placeholder="40000"
              className={`w-full pl-[48px] pr-md py-md bg-transparent border rounded-lg font-body-lg text-on-surface placeholder:text-outline focus:border-primary focus:ring-[3px] focus:ring-primary/20 focus:outline-none transition-all duration-200 ${
                errors.budget ? 'border-error' : 'border-outline-variant'
              }`}
            />
          </div>
          {errors.budget && <span className="text-error text-code-sm">{errors.budget}</span>}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-xs mt-sm">
          <div className="flex justify-between items-end">
            <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="description">
              Event Description
            </label>
            <span className={`font-code-sm text-code-sm ${isOverLimit ? 'text-error font-semibold' : 'text-outline'}`}>
              {charCount}/500
            </span>
          </div>
          <textarea
            id="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the main goals, themes, or any specific requirements for this event..."
            className={`w-full p-md bg-transparent border rounded-lg font-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-[3px] focus:ring-primary/20 focus:outline-none transition-all duration-200 resize-y min-h-[120px] ${
              errors.description ? 'border-error' : 'border-outline-variant'
            }`}
          />
          {errors.description && <span className="text-error text-code-sm">{errors.description}</span>}
        </div>

        {/* AI Model Selection - Gated by Login State */}
        <div className="flex flex-col gap-xs mt-sm bg-surface-container-low p-md rounded-lg border border-outline-variant/50">
          <div className="flex items-center justify-between">
            <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider flex items-center gap-sm" htmlFor="aiModel">
              <span className="material-symbols-outlined text-secondary">psychology</span>
              Processing Engine
            </label>
            {!isLoggedIn && (
              <span className="font-code-sm text-code-sm text-outline flex items-center gap-xs">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                Login to unlock Advanced
              </span>
            )}
          </div>

          <select
            id="aiModel"
            value={formData.aiModel}
            onChange={handleChange}
            className="w-full p-md bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-on-surface focus:border-primary focus:ring-[3px] focus:ring-primary/20 focus:outline-none transition-all duration-200 appearance-none cursor-pointer mt-sm"
          >
            <option value="basic">Basic (Fast Generation)</option>
            <option value="advanced" disabled={!isLoggedIn}>
              {isLoggedIn 
                ? 'Advanced (Deep Analysis & Context)' 
                : 'Advanced (Deep Analysis & Context) [Login to unlock]'}
            </option>
          </select>
          
          <p className="font-code-sm text-code-sm text-outline mt-xs">
            {isLoggedIn
              ? 'Basic is ideal for standard timelines. Advanced considers complex vendor logistics.'
              : 'Basic is ideal for standard timelines. Login to unlock Advanced processing with deep vendor analysis.'}
          </p>
        </div>

        {/* Primary CTA */}
        <button
          type="submit"
          disabled={loading}
          className="mt-lg w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-[16px] px-lg rounded-lg shadow-sm hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)] transition-all duration-200 flex items-center justify-center gap-sm group disabled:opacity-70 cursor-pointer"
        >
          <span>{loading ? 'Generating Event Plan...' : 'Generate Event Plan'}</span>
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-200">
            {loading ? 'sync' : 'auto_awesome'}
          </span>
        </button>
      </form>
    </div>
  );
}
