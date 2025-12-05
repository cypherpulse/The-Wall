// Contribution #58: "^1.8.14", - Version history
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Post, Reply, Category, SortOption } from "@/lib/types";
import { useAllPosts, usePost as useContractPost, useReplies, useCreatePost, useCreateReply, useVoteOnPost, useVoteOnReply } from "@/hooks/useContract";
import { useContent, useBatchContent } from "@/lib/contentManager";
import { generateAnonymousName } from "@/lib/anonymousNames";
import { toast } from "@/hooks/use-toast";
import { CATEGORY_IDS } from "@/config/contract";

// Convert contract category to our Category type
function mapContractCategory(contractCategory: number): Category {
  const categories: Category[] = ['General', 'Loneliness', 'Career', 'Anxiety', 'Relationships', 'Identity', 'Loss'];
  return categories[contractCategory] || 'General';
}

// Convert our Category to contract category
function mapToContractCategory(category: Category): number {
  return CATEGORY_IDS[category] || 0;
}

// Posts queries - now using smart contract
export function usePosts(sortBy: SortOption = "latest", category?: Category, searchQuery?: string) {
  const contractCategory = category ? mapToContractCategory(category) : undefined;
  const { data: contractPosts, isLoading, error, refetch } = useAllPosts(100);

  // Get content for all posts
  const contentHashes = contractPosts?.map(post => post.contentHash) || [];
  const { contents: postContents, isLoading: contentLoading } = useBatchContent(contentHashes);

  return useQuery({
    queryKey: ["posts", sortBy, category, searchQuery],
    queryFn: async () => {
      if (!contractPosts) return [];

      let filtered = contractPosts.map(post => ({
        ...post,
        category: mapContractCategory(post.category),
        content: postContents[post.contentHash] || 'Loading content...',
        username: post.isAnonymous ? generateAnonymousName() : `User ${post.author.slice(-6)}`,
      }));

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
        filtered.sort((a, b) => parseInt(b.upvotes) - parseInt(a.upvotes));
      } else {
        filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      }

      return filtered;
    },
    enabled: !!contractPosts && !contentLoading,
  });
}

export function usePost(id: string) {
  const { data: contractPost, isLoading, error } = useContractPost(id);
  const { content, isLoading: contentLoading } = useContent(contractPost?.contentHash);

  return useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      if (!contractPost) throw new Error("Post not found");

      return {
        ...contractPost,
        category: mapContractCategory(contractPost.category),
        content: content || 'Loading content...',
        username: contractPost.isAnonymous ? generateAnonymousName() : `User ${contractPost.author.slice(-6)}`,
      };
    },
    enabled: !!contractPost && !contentLoading,
  });
}

export function useReplies(postId: string) {
  const { data: contractReplies, isLoading, error } = useReplies(postId);
  const contentHashes = contractReplies?.map(reply => reply.contentHash) || [];
  const { contents: replyContents } = useBatchContent(contentHashes);

  return useQuery({
    queryKey: ["replies", postId],
    queryFn: async () => {
      if (!contractReplies) return [];

      return contractReplies.map(reply => ({
        ...reply,
        content: replyContents[reply.contentHash] || 'Loading content...',
        username: reply.isAnonymous ? generateAnonymousName() : `User ${reply.author.slice(-6)}`,
      }));
    },
    enabled: !!contractReplies,
  });
}

// Mutations - now using smart contract
export function useCreatePostMutation() {
  const queryClient = useQueryClient();
  const { createPost, isPending, isConfirming, isConfirmed, error } = useCreatePost();

  return useMutation({
    mutationFn: async ({ content, category, isAnonymous = false }: {
      content: string;
      category: Category;
      isAnonymous?: boolean;
    }) => {
      // Store content off-chain first
      const { storeContent } = await import('@/lib/contentManager');
      const { hashContent } = await import('@/hooks/useContract');

      const contentHash = hashContent(content);
      await storeContent(content, contentHash);

      // Create post on-chain (now async)
      createPost(content, mapToContractCategory(category), isAnonymous);

      return { contentHash };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Posted to The Wall",
        description: "Your thoughts have been permanently written to the blockchain.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to post",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
}

export function useCreateReplyMutation() {
  const queryClient = useQueryClient();
  const { createReply, isPending, isConfirming, isConfirmed, error } = useCreateReply();

  return useMutation({
    mutationFn: async ({ postId, content, isAnonymous = false }: {
      postId: string;
      content: string;
      isAnonymous?: boolean;
    }) => {
      // Store content off-chain first
      const { storeContent } = await import('@/lib/contentManager');
      const { hashContent } = await import('@/hooks/useContract');

      const contentHash = hashContent(content);
      await storeContent(content, contentHash);

      // Create reply on-chain
      createReply(postId, content, isAnonymous);

      return { contentHash };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["replies", variables.postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // Update reply count
      toast({
        title: "Reply posted",
        description: "Your reply has been added to the conversation.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to reply",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
}

export function useVoteOnPostMutation() {
  const queryClient = useQueryClient();
  const { upvotePost, downvotePost, isPending, error } = useVoteOnPost();

  return useMutation({
    mutationFn: async ({ postId, isUpvote }: { postId: string; isUpvote: boolean }) => {
      if (isUpvote) {
        upvotePost(postId);
      } else {
        downvotePost(postId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
      toast({
        title: "Upvoted!",
        description: "Your vote has been recorded on the blockchain.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Vote failed",
        description: error.message || "Unable to cast vote. You may have already voted.",
        variant: "destructive",
      });
    },
  });
}

export function useVoteOnReplyMutation() {
  const queryClient = useQueryClient();
  const { upvoteReply, downvoteReply, isPending, error } = useVoteOnReply();

  return useMutation({
    mutationFn: async ({ replyId, isUpvote }: { replyId: string; isUpvote: boolean }) => {
      if (isUpvote) {
        upvoteReply(replyId);
      } else {
        downvoteReply(replyId);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["replies"] });
      toast({
        title: isUpvote ? "Upvoted!" : "Downvoted!",
        description: "Your vote has been recorded on the blockchain.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Vote failed",
        description: error.message || "Unable to cast vote. You may have already voted.",
        variant: "destructive",
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
