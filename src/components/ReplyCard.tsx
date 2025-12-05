// Contribution #54: "^1.8.14", - Activity feed
import { Reply } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useVoteOnReplyMutation } from "@/hooks/usePosts";
import { useAppKitAccount } from '@reown/appkit/react';
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ReplyCardProps {
  reply: Reply;
}

export default function ReplyCard({ reply }: ReplyCardProps) {
  const { isConnected } = useAppKitAccount();
  const voteOnReply = useVoteOnReplyMutation();

  const handleVote = async (isUpvote: boolean) => {
    await voteOnReply.mutateAsync({ replyId: reply.id, isUpvote });
  };

  // Parse numeric values from contract
  const upvotes = typeof reply.upvotes === 'string' ? parseInt(reply.upvotes) : reply.upvotes;
  const downvotes = typeof reply.downvotes === 'string' ? parseInt(reply.downvotes) : reply.downvotes;

  return (
    <Card className="p-4 bg-card/50">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-primary">{reply.username}</span>
          <Badge variant="outline" className="text-xs border-primary/50">
            🔗 On-Chain
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(reply.timestamp, { addSuffix: true })}
        </span>
      </div>
      <p className="text-sm text-foreground mb-3">{reply.content}</p>
      {isConnected && (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote(true)}
            disabled={voteOnReply.isPending}
            className="text-green-500 hover:text-green-600 h-6 px-2"
          >
            <ThumbsUp className="h-3 w-3 mr-1" />
            {upvotes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote(false)}
            disabled={voteOnReply.isPending}
            className="text-red-500 hover:text-red-600 h-6 px-2"
          >
            <ThumbsDown className="h-3 w-3 mr-1" />
            {downvotes}
          </Button>
        </div>
      )}
    </Card>
  );
}
