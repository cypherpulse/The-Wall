import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ReplyCard from "@/components/ReplyCard";
import { usePost, useReplies, useCreateReply } from "@/hooks/usePosts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MessageSquare, TrendingUp, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [replyContent, setReplyContent] = useState("");

  const { data: post, isLoading: postLoading } = usePost(id!);
  const { data: replies, isLoading: repliesLoading } = useReplies(id!);
  const createReply = useCreateReply();

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !id) return;

    await createReply.mutateAsync({ postId: id, content: replyContent });
    setReplyContent("");
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
              {post.onChain && (
                <Badge variant="outline" className="border-primary/50">
                  ⛓️ On-Chain
                </Badge>
              )}
            </div>
            <Badge variant="secondary">{post.category}</Badge>
          </div>

          <p className="text-lg text-foreground mb-6 whitespace-pre-wrap">{post.content}</p>

          <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-primary/20 pt-4">
            <span>{formatDistanceToNow(post.timestamp, { addSuffix: true })}</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4" />
                <span>{post.upvotes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>{post.replyCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reply Form */}
        <form onSubmit={handleReplySubmit} className="mb-8">
          <Textarea
            placeholder="Share your thoughts..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="mb-4 min-h-[120px]"
            required
          />
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
                Reply Anonymously
              </>
            )}
          </Button>
        </form>

        {/* Replies */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">
            Replies ({post.replyCount})
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
