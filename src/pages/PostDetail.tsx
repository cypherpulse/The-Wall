// Contribution #66: "^1.8.14", - Automated testing
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ReplyCard from "@/components/ReplyCard";
import { usePost, useReplies, useCreateReplyMutation, useVoteOnPostMutation } from "@/hooks/usePosts";
import { useAppKitAccount } from '@reown/appkit/react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MessageSquare, TrendingUp, ThumbsUp, ThumbsDown, Loader2, Wallet } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [replyContent, setReplyContent] = useState("");
  const [isAnonymousReply, setIsAnonymousReply] = useState(true);
  const { address, isConnected } = useAppKitAccount();

  const { data: post, isLoading: postLoading } = usePost(id!);
  const { data: replies, isLoading: repliesLoading } = useReplies(id!);
  const createReply = useCreateReplyMutation();
  const voteOnPost = useVoteOnPostMutation();

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !id || !isConnected) return;

    await createReply.mutateAsync({ postId: id, content: replyContent, isAnonymous: isAnonymousReply });
    setReplyContent("");
  };

  const handleVote = async (isUpvote: boolean) => {
    if (!id || !isConnected) return;
    await voteOnPost.mutateAsync({ postId: id, isUpvote });
  };

  if (postLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-8 w-24 mb-6" />
          <Skeleton className="h-64 mb-8" />
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl text-center">
          <p className="text-muted-foreground">Post not found</p>
        </main>
      </div>
    );
  }

  // Parse numeric values from contract
  const upvotes = typeof post.upvotes === 'string' ? parseInt(post.upvotes) : post.upvotes;
  const downvotes = typeof post.downvotes === 'string' ? parseInt(post.downvotes) : post.downvotes;
  const replyCount = typeof post.replyCount === 'string' ? parseInt(post.replyCount) : post.replyCount;

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Wall
        </Button>

        {/* Post Content */}
        <div className="border border-primary/30 rounded-lg p-8 mb-8 glow-border">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-primary">{post.username}</span>
              <Badge variant="outline" className="border-primary/50">
                🔗 On-Chain
              </Badge>
            </div>
            <Badge variant="secondary">{post.category}</Badge>
          </div>

          <p className="text-lg text-foreground mb-6 whitespace-pre-wrap">{post.content}</p>

          <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-primary/20 pt-4">
            <span>{formatDistanceToNow(post.timestamp, { addSuffix: true })}</span>
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote(true)}
                    disabled={voteOnPost.isPending}
                    className="text-green-500 hover:text-green-600"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {upvotes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote(false)}
                    disabled={voteOnPost.isPending}
                    className="text-red-500 hover:text-red-600"
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    {downvotes}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>{upvotes - downvotes}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>{replyCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {isConnected ? (
          <form onSubmit={handleReplySubmit} className="mb-8">
            <Textarea
              placeholder="Share your thoughts..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="mb-4 min-h-[120px]"
              required
            />
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="anonymous-reply"
                checked={isAnonymousReply}
                onChange={(e) => setIsAnonymousReply(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="anonymous-reply" className="text-sm">
                Reply anonymously
              </label>
            </div>
            <Button
              type="submit"
              className="glow-hover"
              disabled={createReply.isPending || !replyContent.trim()}
            >
              {createReply.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Writing to blockchain...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {isAnonymousReply ? 'Reply Anonymously' : 'Reply Publicly'}
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="mb-8 p-4 border border-primary/30 rounded-lg text-center">
            <Wallet className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Connect your wallet to reply to this post</p>
          </div>
        )}

        {/* Replies */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">
            Replies ({replyCount})
          </h2>
          {repliesLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))
          ) : replies && replies.length > 0 ? (
            replies.map((reply) => <ReplyCard key={reply.id} reply={reply} />)
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No replies yet. Be the first to respond.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
