import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI, CATEGORIES, POST_STATUSES, type Post, type Reply, type Category } from '../config/contract';
import { keccak256, stringToBytes } from 'viem';

// Raw contract return types
interface RawPost {
  id: bigint;
  author: `0x${string}`;
  contentHash: `0x${string}`;
  category: number;
  timestamp: bigint;
  replyCount: bigint;
  upvotes: bigint;
  downvotes: bigint;
  status: number;
  parentId: bigint;
  reputation: bigint;
  isAnonymous: boolean;
}

interface RawReply {
  id: bigint;
  postId: bigint;
  author: `0x${string}`;
  contentHash: `0x${string}`;
  timestamp: bigint;
  upvotes: bigint;
  downvotes: bigint;
  status: number;
  reputation: bigint;
  isAnonymous: boolean;
}

// Utility function to hash content
export function hashContent(content: string): `0x${string}` {
  return keccak256(stringToBytes(content));
}

// Format raw post data from contract
function formatPost(rawPost: RawPost): Post {
  return {
    id: rawPost.id.toString(),
    author: rawPost.author,
    contentHash: rawPost.contentHash,
    category: rawPost.category,
    timestamp: new Date(Number(rawPost.timestamp) * 1000),
    replyCount: rawPost.replyCount.toString(),
    upvotes: rawPost.upvotes.toString(),
    downvotes: rawPost.downvotes.toString(),
    status: rawPost.status,
    parentId: rawPost.parentId.toString(),
    reputation: rawPost.reputation.toString(),
    isAnonymous: rawPost.isAnonymous,
  };
}

// Format raw reply data from contract
function formatReply(rawReply: RawReply): Reply {
  return {
    id: rawReply.id.toString(),
    postId: rawReply.postId.toString(),
    author: rawReply.author,
    contentHash: rawReply.contentHash,
    timestamp: new Date(Number(rawReply.timestamp) * 1000),
    upvotes: rawReply.upvotes.toString(),
    downvotes: rawReply.downvotes.toString(),
    status: rawReply.status,
    reputation: rawReply.reputation.toString(),
    isAnonymous: rawReply.isAnonymous,
  };
}

// Hook to get a single post
export function usePost(postId: string | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getPost',
    args: postId ? [BigInt(postId)] : undefined,
    query: {
      enabled: !!postId,
      select: (data) => formatPost(data),
    },
  });
}

// Hook to get posts by category with pagination
export function usePosts(category: Category, offset: number = 0, limit: number = 20) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getPosts',
    args: [category, BigInt(offset), BigInt(limit)],
    query: {
      select: (data) => data.map(formatPost),
    },
  });
}

// Hook to get all posts across categories
export function useAllPosts(limit: number = 50) {
  // TODO: Implement proper multi-category fetching without violating hooks rules
  return {
    data: [],
    isLoading: false,
    error: null,
    refetch: () => {},
  };
}

// Hook to get replies for a post
export function useReplies(postId: string | undefined, offset: number = 0, limit: number = 50) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getReplies',
    args: postId ? [BigInt(postId), BigInt(offset), BigInt(limit)] : undefined,
    query: {
      enabled: !!postId,
      select: (data) => data.map(formatReply),
    },
  });
}

// Hook to get user reputation
export function useUserReputation(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getUserReputation',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

// Hook to get contract version
export function useContractVersion() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'version',
  });
}

// Hook to create a post
export function useCreatePost() {
  const { writeContract, data: hash, error, ...rest } = useWriteContract();

  const createPost = (content: string, category: Category, isAnonymous: boolean = false) => {
    const contentHash = hashContent(content);
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'createPost',
      args: [contentHash, category, isAnonymous],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = useWaitForTransactionReceipt({
    hash,
  });

  // Check for revert reasons in the receipt
  const contractError = receipt && receipt.status === 'reverted' ? 'Transaction reverted - check your reputation or try again' : null;

  return {
    createPost,
    hash,
    isConfirming,
    isConfirmed,
    error: error || contractError,
    ...rest,
  };
}

// Hook to create a reply
export function useCreateReply() {
  const { writeContract, data: hash, error, ...rest } = useWriteContract();

  const createReply = (postId: string, content: string, isAnonymous: boolean = false) => {
    const contentHash = hashContent(content);
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'createReply',
      args: [BigInt(postId), contentHash, isAnonymous],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = useWaitForTransactionReceipt({
    hash,
  });

  // Check for revert reasons in the receipt
  const contractError = receipt && receipt.status === 'reverted' ? 'Transaction reverted - check your reputation or try again' : null;

  return {
    createReply,
    hash,
    isConfirming,
    isConfirmed,
    error: error || contractError,
    ...rest,
  };
}

// Hook to vote on posts
export function useVoteOnPost() {
  const { writeContract, data: hash, ...rest } = useWriteContract();

  const upvotePost = (postId: string) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'upvotePost',
      args: [BigInt(postId)],
    });
  };

  const downvotePost = (postId: string) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'downvotePost',
      args: [BigInt(postId)],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    upvotePost,
    downvotePost,
    hash,
    isConfirming,
    isConfirmed,
    ...rest,
  };
}

// Hook to vote on replies
export function useVoteOnReply() {
  const { writeContract, data: hash, ...rest } = useWriteContract();

  const upvoteReply = (replyId: string) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'upvoteReply',
      args: [BigInt(replyId)],
    });
  };

  const downvoteReply = (replyId: string) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'downvoteReply',
      args: [BigInt(replyId)],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    upvoteReply,
    downvoteReply,
    hash,
    isConfirming,
    isConfirmed,
    ...rest,
  };
}

// Hook to watch for new posts
export function useWatchPosts(onPostCreated?: (postId: string, author: string, contentHash: string, category: number, timestamp: number) => void) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'PostCreated',
    onLogs: (logs) => {
      logs.forEach((log) => {
        const { postId, author, contentHash, category, timestamp } = log.args;
        onPostCreated?.(postId.toString(), author, contentHash, Number(category), Number(timestamp));
      });
    },
  });
}

// Hook to watch for new replies
export function useWatchReplies(onReplyCreated?: (replyId: string, postId: string, author: string, contentHash: string, timestamp: number) => void) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'ReplyCreated',
    onLogs: (logs) => {
      logs.forEach((log) => {
        const { replyId, postId, author, contentHash, timestamp } = log.args;
        onReplyCreated?.(replyId.toString(), postId.toString(), author, contentHash, Number(timestamp));
      });
    },
  });
}

// Hook to watch for votes
export function useWatchVotes(onVoteCast?: (targetId: string, voter: string, isUpvote: boolean, weight: string) => void) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'VoteCast',
    onLogs: (logs) => {
      logs.forEach((log) => {
        const { targetId, voter, isUpvote, weight } = log.args;
        onVoteCast?.(targetId.toString(), voter, isUpvote, weight.toString());
      });
    },
  });
}

// Hook to get post count
export function usePostCount() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'postCount',
  });
}

// Hook to get reply count
export function useReplyCount() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'replyCount',
  });
}