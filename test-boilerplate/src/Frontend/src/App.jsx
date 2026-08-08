import React, { useState } from 'react';
import Header from './components/Header';
import EventForm from './components/EventForm';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './hooks/useAuth';
import { MOCK_EVENT_DATA } from './mockData';

// Toggle between mock data mode and live FastAPI backend
const USE_MOCK_DATA = true; // flip to false once backend is ready

function MainContent() {
  const [eventData, setEventData] = useState(null);
  
  // Separate loading and error states for form & chat
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);
  
  const [chatMessages, setChatMessages] = useState([]);

  // Generate event plan handler
  const handleGenerate = async (formData) => {
    setFormLoading(true);
    setFormError(null);

    if (USE_MOCK_DATA) {
      try {
        // Simulated network delay to test loading state
        await new Promise((resolve) => setTimeout(resolve, 800));

        const generatedMockPlan = {
          id: 1,
          event_type: formData.eventType || MOCK_EVENT_DATA.event_type,
          date: formData.date || MOCK_EVENT_DATA.date,
          location: formData.location || MOCK_EVENT_DATA.location,
          guests: parseInt(formData.guests, 10) || MOCK_EVENT_DATA.guests,
          budget: parseFloat(formData.budget) || MOCK_EVENT_DATA.budget,
          invitation_image_url: MOCK_EVENT_DATA.invitation_image_url,
          plan: {
            ...MOCK_EVENT_DATA.plan,
            theme: {
              ...MOCK_EVENT_DATA.plan.theme,
              concept: formData.description 
                ? `Custom Theme: "${formData.description.slice(0, 60)}..."` 
                : MOCK_EVENT_DATA.plan.theme.concept
            }
          }
        };

        setEventData(generatedMockPlan);
        setChatMessages([
          {
            id: 1,
            role: 'ai',
            text: `I've generated the plan for ${generatedMockPlan.event_type} in ${generatedMockPlan.location}! How would you like to customize it?`
          }
        ]);
      } catch (err) {
        setFormError('Failed to generate mock event plan.');
        console.error(err);
      } finally {
        setFormLoading(false);
      }
    } else {
      // Live FastAPI fetch call
      try {
        const payload = {
          event_type: formData.eventType,
          guests: parseInt(formData.guests, 10),
          location: formData.location,
          budget: parseFloat(formData.budget),
          date: formData.date,
          start_time: formData.time,
          description: formData.description,
          model: formData.aiModel
        };

        const response = await fetch('http://localhost:8000/events/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Server returned status ${response.status}`);
        }

        const data = await response.json();
        setEventData(data);

        setChatMessages([
          {
            id: 1,
            role: 'ai',
            text: `I've generated your initial plan for ${data.event_type || 'your event'}. Feel free to ask for any modifications!`
          }
        ]);
      } catch (err) {
        setFormError(`Backend Connection Failed: ${err.message}. Ensure FastAPI server is running on port 8000.`);
        console.error('FastAPI fetch error:', err);
      } finally {
        setFormLoading(false);
      }
    }
  };

  // Chat send handler
  const handleChatSend = async (messageText) => {
    if (!messageText.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', text: messageText };
    setChatMessages((prev) => [...prev, userMsg]);
    
    setChatLoading(true);
    setChatError(null);

    if (USE_MOCK_DATA) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 600));

        // Simulated plan update in mock mode
        const isBudgetQuery = messageText.toLowerCase().includes('catering') || messageText.toLowerCase().includes('budget');

        if (isBudgetQuery && eventData?.plan?.budget) {
          setEventData((prev) => ({
            ...prev,
            plan: {
              ...prev.plan,
              budget: {
                ...prev.plan.budget,
                catering: 12000,
                activities: 6000
              }
            }
          }));

          setChatMessages((prev) => [
            ...prev,
            { id: Date.now() + 1, role: 'system_action', text: 'Reallocated ₹3,000 from Catering to Activities' },
            { id: Date.now() + 2, role: 'ai', text: 'I updated the budget breakdown to allocate more funds toward activities!' }
          ]);
        } else {
          setChatMessages((prev) => [
            ...prev,
            { id: Date.now() + 1, role: 'ai', text: `Updated plan for "${messageText}". What else would you like to modify?` }
          ]);
        }
      } catch (err) {
        setChatError('Error processing mock chat update.');
        console.error(err);
      } finally {
        setChatLoading(false);
      }
    } else {
      // Live FastAPI chat call
      try {
        const eventId = eventData?.id || 1;
        const response = await fetch(`http://localhost:8000/events/${eventId}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: messageText })
        });

        if (!response.ok) {
          throw new Error(`Server returned status ${response.status}`);
        }

        const data = await response.json();
        
        // Full response object replaces eventData entirely
        if (data.plan || data.event_type) {
          setEventData(data);
        }

        const aiExplanation = data.explanation || data.reply || 'Updated your event plan based on your request.';

        setChatMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, role: 'ai', text: aiExplanation }
        ]);
      } catch (err) {
        setChatError(`Chat Failed: ${err.message}`);
        console.error('FastAPI chat error:', err);
      } finally {
        setChatLoading(false);
      }
    }
  };

  const handleReset = () => {
    setEventData(null);
    setChatMessages([]);
    setFormError(null);
    setChatError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface font-body-md">
      <Header hasPlan={!!eventData} onNewEvent={handleReset} />

      <main className={`flex-grow flex ${!eventData ? 'items-center justify-center pt-[100px] pb-xxl px-md md:px-gutter' : 'pt-[90px]'}`}>
        {!eventData ? (
          <div className="flex flex-col items-center gap-md w-full max-w-[600px]">
            {formError && (
              <div className="w-full bg-error-container border border-error text-on-error-container p-md rounded-lg text-body-md shadow-sm flex items-center justify-between">
                <span>[Warning] {formError}</span>
                <button onClick={() => setFormError(null)} className="font-bold text-lg cursor-pointer">&times;</button>
              </div>
            )}
            
            {/* Subtle decorative background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 mix-blend-multiply">
              <div className="absolute -top-64 -right-64 w-[800px] h-[800px] bg-secondary-container rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -bottom-64 -left-64 w-[600px] h-[600px] bg-primary-container rounded-full blur-3xl opacity-20"></div>
            </div>

            <EventForm onGenerate={handleGenerate} loading={formLoading} />
          </div>
        ) : (
          <Dashboard
            eventData={eventData}
            chatMessages={chatMessages}
            onSendMessage={handleChatSend}
            chatLoading={chatLoading}
            chatError={chatError}
          />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
