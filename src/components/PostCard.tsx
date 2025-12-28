// Contribution #53: "^1.8.14", - Follow system
import { Post } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  // Parse numeric values from contract (they come as strings)
  const upvotes = typeof post.upvotes === 'string' ? parseInt(post.upvotes) : post.upvotes;
  const replyCount = typeof post.replyCount === 'string' ? parseInt(post.replyCount) : post.replyCount;

  return (
    <Link to={`/post/${post.id}`}>
      <Card className="p-6 glow-hover cursor-pointer transition-all duration-200 hover:-translate-y-0.5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-primary">{post.username}</span>
            <Badge variant="outline" className="text-xs border-primary/50">
              🔗 On-Chain
            </Badge>
          </div>
          <Badge variant="secondary" className="text-xs">
            {post.category}
          </Badge>
        </div>

        <p className="text-foreground mb-4 line-clamp-3">{post.content}</p>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatDistanceToNow(post.timestamp, { addSuffix: true })}</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4" />
              <span>{upvotes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>{replyCount}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
