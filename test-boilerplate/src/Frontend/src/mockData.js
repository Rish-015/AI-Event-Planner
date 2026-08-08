export const MOCK_EVENT_DATA = {
  id: 1,
  event_type: "Birthday",
  date: "2026-08-25",
  location: "Chennai, Anna Nagar",
  guests: 50,
  budget: 40000,
  invitation_image_url: "https://placehold.co/500x700",
  plan: {
    schedule: [
      { time: "5:00 PM", activity: "Venue setup" },
      { time: "6:00 PM", activity: "Guest arrival" },
      { time: "6:40 PM", activity: "Welcome & activity" },
      { time: "7:30 PM", activity: "Dinner" },
      { time: "9:15 PM", activity: "Cake cutting" },
      { time: "10:00 PM", activity: "Closing" }
    ],
    budget: { 
      venue: 10000, 
      catering: 15000, 
      decoration: 6000, 
      cake: 3000, 
      activities: 3000, 
      contingency: 3000, 
      total: 40000 
    },
    checklist: [
      { task: "Book venue", due_date: "2026-08-10", status: "pending", priority: "High" },
      { task: "Confirm catering", due_date: "2026-08-15", status: "pending", priority: "High" },
      { task: "Order cake", due_date: "2026-08-22", status: "pending", priority: "Medium" },
      { task: "Send invitations", due_date: "2026-08-18", status: "pending", priority: "Medium" }
    ],
    theme: {
      concept: "Minimalist pastel outdoor birthday theme",
      colors: ["#F6D6D6", "#FCEADE", "#D9E4DD", "#C9CBA3"],
      activity_ideas: ["Photo booth", "Live music", "Lawn games"]
    }
  }
};
