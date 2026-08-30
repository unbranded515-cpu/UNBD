import type { Review } from "./types";

// Sample reviews so the inbox is populated on first run. In Phase 2 these are
// replaced by live reviews pulled from the Google Business Profile API.
export const SAMPLE_REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Marcus T.",
    rating: 5,
    text: "Best oat milk latte I've had in Austin, hands down. The staff remembered my name on the second visit. This place feels like home.",
    date: "2 days ago",
  },
  {
    id: "r2",
    author: "Priya N.",
    rating: 2,
    text: "Waited 25 minutes for a cold brew and it was watery when it finally came. Really disappointed, the place was barely half full.",
    date: "4 days ago",
  },
  {
    id: "r3",
    author: "Dana R.",
    rating: 4,
    text: "Lovely cozy spot, great pastries. Only knocking a star because the wifi kept dropping while I was trying to work.",
    date: "1 week ago",
  },
  {
    id: "r4",
    author: "Kev",
    rating: 1,
    text: "Rude barista this morning. Won't be back.",
    date: "1 week ago",
  },
  {
    id: "r5",
    author: "Sofia L.",
    rating: 5,
    text: "My favorite café to work from. Fast wifi, friendly people, and the cortado is perfect every single time.",
    date: "2 weeks ago",
  },
];
