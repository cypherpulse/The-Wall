import { Post, Reply } from "./types";
import { generateAnonymousName } from "./anonymousNames";

const categories = ["Loneliness", "Career", "Anxiety", "Relationships", "Identity", "Loss", "General"] as const;

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Generate mock posts
export const mockPosts: Post[] = Array.from({ length: 20 }, (_, i) => ({
  id: `post-${i + 1}`,
  username: generateAnonymousName(),
  content: [
    "Sometimes I feel like I'm invisible to everyone around me. Like I could disappear and nobody would notice.",
    "Stuck in a dead-end job with no clear path forward. The system feels rigged.",
    "Every decision feels overwhelming. Can't stop overthinking everything.",
    "Watching everyone else succeed while I'm still figuring out what I want.",
    "The weight of expectations is crushing me. I don't know who I am anymore.",
    "Lost someone important. The void they left behind feels permanent.",
    "Just need to vent into the digital void. Anyone else feeling disconnected?",
    "Career change at 30? Is it too late to start over?",
    "Social anxiety is real. Every interaction feels like a performance.",
    "Why does everything feel so temporary? Nothing lasts.",
    "Imposter syndrome hitting hard today. Do I even deserve to be here?",
    "The loneliness of being in a crowded room is the worst kind.",
    "Family doesn't understand my choices. Feeling isolated.",
    "Burnout is real and nobody talks about it enough.",
    "Quarter-life crisis or just Tuesday? Can't tell anymore.",
    "Miss the person I used to be before life got complicated.",
    "Anyone else feel like they're just going through the motions?",
    "Dreams vs reality. The gap keeps getting wider.",
    "Tired of pretending everything is fine when it's not.",
    "Sometimes the weight of existence is just... heavy."
  ][i],
  category: categories[Math.floor(Math.random() * categories.length)],
  timestamp: randomDate(new Date(2024, 0, 1), new Date()),
  replyCount: Math.floor(Math.random() * 50),
  upvotes: Math.floor(Math.random() * 200),
  onChain: true,
}));

// Generate mock replies
export const mockReplies: Reply[] = Array.from({ length: 50 }, (_, i) => ({
  id: `reply-${i + 1}`,
  postId: `post-${Math.floor(Math.random() * 20) + 1}`,
  username: generateAnonymousName(),
  content: [
    "I feel this. You're not alone in feeling alone.",
    "Been there. It gets better, trust the process.",
    "Same energy. The struggle is real.",
    "This hit different. Thank you for sharing.",
    "Sending digital solidarity your way.",
    "Felt this in my core. We're all just trying.",
    "The realest post I've read today.",
    "You put into words what I couldn't. Thank you.",
    "This is the content I needed today.",
    "Keep going. Your journey matters.",
  ][i % 10],
  timestamp: randomDate(new Date(2024, 0, 1), new Date()),
  onChain: true,
}));

export function getPostById(id: string): Post | undefined {
  return mockPosts.find(post => post.id === id);
}

export function getRepliesForPost(postId: string): Reply[] {
  return mockReplies.filter(reply => reply.postId === postId);
}
