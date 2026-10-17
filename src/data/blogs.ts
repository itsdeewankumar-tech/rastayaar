import localBusImg from "@/assets/local-bus-karachi.webp";
import redBusImg from "@/assets/red-bus-new.jpg";
import evBusImg from "@/assets/ev-white-bus.jpg";

export type BlogSection = { heading: string; paragraphs: string[]; bullets?: string[] };
export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  image: string;
  imageAlt: string;
  intro: string;
  sections: BlogSection[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-plan-a-bus-trip-in-karachi",
    title: "How to Plan a Bus Trip in Karachi",
    excerpt: "A practical checklist for finding a route, checking stops, estimating your fare, and preparing for the journey.",
    category: "Travel Tips",
    readTime: "4 min read",
    publishedAt: "October 2026",
    image: localBusImg,
    imageAlt: "A colourful traditional Karachi local bus",
    intro: "Karachi is a large city, and the best bus option can depend on your starting point, destination, time, and how far you can walk. A little planning can make your trip easier.",
    sections: [
      { heading: "1. Start with your exact areas", paragraphs: ["Write down a clear starting point and destination. A neighbourhood name, major road, market, hospital, university, or well-known landmark can help you narrow down the options."] },
      { heading: "2. Check the route and its stops", paragraphs: ["Before boarding, compare the route's listed stops with your journey. Check that the bus passes near your destination and identify a useful stop for getting off.", "Route information can change. Confirm the service and stopping point locally with the conductor or transport staff when needed."] },
      { heading: "3. Compare transport options", paragraphs: ["Local buses and coaches, Red Bus services, electric buses, and BRT lines serve different corridors. If more than one option works, compare the route, transfers, walking distance, and expected travel time."] },
      { heading: "4. Prepare for the ride", bullets: ["Keep some small cash available where fares are paid onboard.", "Allow extra time for traffic and connections.", "Confirm the fare and destination before boarding.", "Keep your phone and valuables secure in crowded areas."] },
      { heading: "Use RastaYaar to get started", paragraphs: ["Use RastaYaar's route search, area pages, and fare guide to explore available information before you leave. Treat estimated fares and route details as a guide and verify important details locally."] },
    ],
  },
  {
    slug: "local-bus-coach-or-brt-which-should-you-choose",
    title: "Local Bus, Coach or BRT: Which Should You Choose?",
    excerpt: "Understand the differences between Karachi's local buses, coaches, and bus rapid transit when comparing your options.",
    category: "Bus Guides",
    readTime: "5 min read",
    publishedAt: "October 2026",
    image: redBusImg,
    imageAlt: "A red public transport bus in Karachi",
    intro: "There is no single best bus for every journey. The most useful choice is the service that connects your starting point and destination with the fewest inconvenient transfers.",
    sections: [
      { heading: "Local buses and coaches", paragraphs: ["Local buses and coaches can cover many neighbourhood streets and everyday destinations. Their routes and stopping patterns vary, so check the route details and ask locally if you are unsure where to board or get off."] },
      { heading: "Red Bus and electric bus services", paragraphs: ["Public bus services, including Red Bus and electric buses, operate on specific corridors. They may be useful when their stops line up with your trip. Check the latest service information before travelling."] },
      { heading: "BRT services", paragraphs: ["Bus rapid transit can be useful for trips along its corridors. You may need to walk to a station or connect with another service at either end of your journey."] },
      { heading: "Compare your whole journey", bullets: ["Does the route pass near both ends of your trip?", "Will you need to change buses?", "How much walking is involved?", "What is the current fare, and how reliable is the information?", "Are service timings suitable for your travel time?"] },
      { heading: "The simple rule", paragraphs: ["Compare the complete journey rather than choosing a bus type by name alone. Use RastaYaar to explore routes, then confirm current stops, fares, and operating details with the service provider or staff."] },
    ],
  },
  {
    slug: "smart-ways-to-manage-your-daily-commute",
    title: "Smart Ways to Manage Your Daily Commute",
    excerpt: "Small habits that can help students, workers, and regular riders make public transport journeys less stressful.",
    category: "Commuter Advice",
    readTime: "3 min read",
    publishedAt: "October 2026",
    image: evBusImg,
    imageAlt: "An electric public transport bus",
    intro: "A daily commute is easier when you know your options and have a backup. These simple habits can help you prepare for regular trips around Karachi.",
    sections: [
      { heading: "Save your usual route", paragraphs: ["Keep the route name, important stops, and a nearby alternative handy. This can save time when you need to check your journey again."] },
      { heading: "Leave a time buffer", paragraphs: ["Traffic, weather, crowds, and connections can affect a journey. If you have a class, shift, or appointment, avoid planning around the very latest possible arrival."] },
      { heading: "Keep a backup option", paragraphs: ["Identify another route or service that can get you close to your destination. A backup is especially useful if a route is delayed or its stopping pattern is different than expected."] },
      { heading: "Track the cost of your commute", paragraphs: ["Estimate the cost of both directions and any transfers. Check fares periodically because estimates and service charges can change."] },
      { heading: "Travel prepared", bullets: ["Keep your phone charged and your route details accessible.", "Carry water when appropriate and plan for hot weather.", "Stay aware of your surroundings and belongings.", "Ask transport staff when route information is unclear."] },
    ],
  },
];

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
