import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Post, Reply, Category, SortOption } from "@/lib/types";
import { mockPosts, mockReplies, getPostById, getRepliesForPost } from "@/lib/mockData";
import { generateAnonymousName } from "@/lib/anonymousNames";
import { toast } from "@/hooks/use-toast";

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Posts queries
export function usePosts(sortBy: SortOption = "latest", category?: Category, searchQuery?: string) {
  return useQuery({
    queryKey: ["posts", sortBy, category, searchQuery],
    queryFn: async () => {
      await delay(500);
      let filtered = [...mockPosts];

      // Filter by category
      if (category && category !== "General") {
        filtered = filtered.filter(post => post.category === category);
      }

      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter(post => 
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Sort
      if (sortBy === "top") {
        filtered.sort((a, b) => b.upvotes - a.upvotes);
      } else {
        filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      }

      return filtered;
    },
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      await delay(300);
      const post = getPostById(id);
      if (!post) throw new Error("Post not found");
      return post;
    },
  });
}

export function useReplies(postId: string) {
  return useQuery({
    queryKey: ["replies", postId],
    queryFn: async () => {
      await delay(400);
      return getRepliesForPost(postId);
    },
  });
}

// Mutations
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, category }: { content: string; category: Category }) => {
      await delay(1000); // Simulate blockchain write
      const newPost: Post = {
        id: `post-${Date.now()}`,
        username: generateAnonymousName(),
        content,
        category,
        timestamp: new Date(),
        replyCount: 0,
        upvotes: 0,
        onChain: true,
      };
      mockPosts.unshift(newPost);
      return newPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Posted to The Wall",
        description: "Your thoughts have been written to the blockchain.",
      });
    },
  });
}

export function useCreateReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      await delay(1000); // Simulate blockchain write
      const newReply: Reply = {
        id: `reply-${Date.now()}`,
        postId,
        username: generateAnonymousName(),
        content,
        timestamp: new Date(),
        onChain: true,
      };
      mockReplies.push(newReply);
      
      // Update reply count
      const post = getPostById(postId);
      if (post) {
        post.replyCount += 1;
      }
      
      return newReply;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["replies", variables.postId] });
      queryClient.invalidateQueries({ queryKey: ["post", variables.postId] });
      toast({
        title: "Reply sent",
        description: "Your reply has been written to the blockchain.",
      });
    },
  });
}
