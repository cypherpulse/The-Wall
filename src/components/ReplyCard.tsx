import { Reply } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface ReplyCardProps {
  reply: Reply;
}

export default function ReplyCard({ reply }: ReplyCardProps) {
  return (
    <Card className="p-4 bg-card/50">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-primary">{reply.username}</span>
          {reply.onChain && (
            <Badge variant="outline" className="text-xs border-primary/50">
              ⛓️
            </Badge>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(reply.timestamp, { addSuffix: true })}
        </span>
      </div>
      <p className="text-sm text-foreground">{reply.content}</p>
    </Card>
  );
}
