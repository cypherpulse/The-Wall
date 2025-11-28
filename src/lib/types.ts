export type Category = 
  | "Loneliness"
  | "Career"
  | "Anxiety"
  | "Relationships"
  | "Identity"
  | "Loss"
  | "General";

export interface Post {
  id: string;
  username: string;
  content: string;
  category: Category;
  timestamp: Date;
  replyCount: number;
  upvotes: number;
  onChain: boolean;
}

export interface Reply {
  id: string;
  postId: string;
  username: string;
  content: string;
  timestamp: Date;
  onChain: boolean;
}

export type SortOption = "latest" | "top";
