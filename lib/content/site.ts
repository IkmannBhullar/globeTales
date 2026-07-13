export const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "AI Planner", href: "/planner" },
  { label: "Scrapbooks", href: "/scrapbooks" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "About", href: "/about" }
] as const;

export const floatingDestinations = [
  { label: "Kyoto Tea Trails", stat: "8 days" },
  { label: "Amalfi Slow Escape", stat: "5 nights" },
  { label: "Marrakech Design Hunt", stat: "4 cities" },
  { label: "Iceland Aurora Loop", stat: "7 stops" }
] as const;

export const testimonials = [
  {
    name: "Nina Brooks",
    role: "Creative Strategist",
    quote:
      "The planner felt like a travel editor, not a search engine. I got a trip that actually matched how I like to move through a city."
  },
  {
    name: "Jules Ortega",
    role: "Family Traveler",
    quote:
      "We used GlobeTales to balance museums, playground time, and meals our kids would actually enjoy. It saved a huge amount of back-and-forth."
  },
  {
    name: "Aria Patel",
    role: "Travel Photographer",
    quote:
      "The scrapbook layout made my trip notes feel valuable instead of buried in my camera roll."
  }
] as const;

export const plannerActions = [
  "Make it cheaper",
  "Make it more relaxing",
  "Add more attractions",
  "Add hidden gems",
  "Add restaurant recommendations"
] as const;
