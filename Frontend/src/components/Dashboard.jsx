import React from 'react';
import InvitationCard from './InvitationCard';
import ScheduleBlock from './ScheduleBlock';
import BudgetBlock from './BudgetBlock';
import ChecklistBlock from './ChecklistBlock';
import ThemeActivitiesBlock from './ThemeActivitiesBlock';
import ChatPanel from './ChatPanel';

export default function Dashboard({ eventData, chatMessages, onSendMessage, chatLoading, chatError }) {
  if (!eventData) return null;

  const eventType = eventData.event_type || eventData.title || "Event Plan";
  const dateStr = eventData.date || "2026-08-25";
  const locationStr = eventData.location || "Location TBD";
  const guestsNum = eventData.guests || 50;
  
  const rawBudget = eventData.budget || 40000;
  const formattedBudget = typeof rawBudget === 'number' 
    ? `₹${rawBudget.toLocaleString('en-IN')}` 
    : rawBudget;

  const plan = eventData.plan || {};
  const initialLetter = eventType.charAt(0).toUpperCase();

  return (
    <div className="max-w-container-max mx-auto w-full px-md md:px-lg pb-xxl flex flex-col gap-lg">
      {/* 2-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-lg">
        {/* Left Column (65%): Exportable Plan Results */}
        <div id="plan-export-section" className="w-full lg:w-[65%] flex flex-col gap-lg bg-surface p-2 rounded-xl">
          {/* Event Summary Strip */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm flex flex-wrap lg:flex-nowrap gap-md items-center justify-between text-body-md">
            <div className="flex items-center gap-sm min-w-max">
              <div className="w-10 h-10 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary font-bold text-lg">
                {initialLetter}
              </div>
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">{eventType}</h2>
                <p className="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">AI Event Plan</p>
              </div>
            </div>

            <div className="hidden lg:block w-px h-10 bg-outline-variant"></div>

            <div className="flex flex-1 flex-wrap gap-x-lg gap-y-md">
              <div className="flex flex-col">
                <span className="text-on-surface-variant font-label-md text-label-md">Date</span>
                <span className="font-bold flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px] text-outline">calendar_today</span> {dateStr}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-on-surface-variant font-label-md text-label-md">Location</span>
                <span className="font-bold flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px] text-outline">location_on</span> {locationStr}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-on-surface-variant font-label-md text-label-md">Guests</span>
                <span className="font-bold flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px] text-outline">group</span> {guestsNum} Guests
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-on-surface-variant font-label-md text-label-md">Est. Budget</span>
                <span className="font-bold text-secondary flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px]">payments</span> {formattedBudget}
                </span>
              </div>
            </div>
          </section>

          {/* Sub-Blocks */}
          <InvitationCard 
            invitationUrl={eventData.invitation_image_url || eventData.invitation?.imageUrl} 
            themeConcept={plan.theme?.concept || eventData.invitation?.description} 
            invitationText={eventData.invitation_text}
          />
          <ScheduleBlock schedule={plan.schedule} />
          <BudgetBlock budgetData={plan.budget || eventData.budgetData} />
          <ChecklistBlock checklist={plan.checklist} />
          <ThemeActivitiesBlock themeData={plan.theme} />
        </div>

        {/* Right Column (35%): Persistent AI Chat Panel */}
        <div className="w-full lg:w-[35%] relative">
          <ChatPanel 
            chatMessages={chatMessages} 
            onSendMessage={onSendMessage} 
            chatLoading={chatLoading}
            chatError={chatError}
          />
        </div>
      </div>
    </div>
  );
}
