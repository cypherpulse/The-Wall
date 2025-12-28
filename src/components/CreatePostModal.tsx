// Contribution #50: "^1.8.14", - Mention system
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCreatePostMutation } from "@/hooks/usePosts";
import { useAppKitAccount } from '@reown/appkit/react';
import { Category } from "@/lib/types";
import { Plus, Loader2, Wallet } from "lucide-react";

const categories: Category[] = [
  "General",
  "Loneliness",
  "Career",
  "Anxiety",
  "Relationships",
  "Identity",
  "Loss",
];

export default function CreatePostModal() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Category>("General");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const { address, isConnected } = useAppKitAccount();
  const createPost = useCreatePostMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !isConnected) return;

    await createPost.mutateAsync({ content, category, isAnonymous });
    setContent("");
    setCategory("General");
    setOpen(false);
  };

  if (!isConnected) {
    return (
      <Button size="lg" className="glow-hover font-semibold" disabled>
        <Wallet className="mr-2 h-5 w-5" />
        Connect Wallet to Post
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="glow-hover font-semibold">
          <Plus className="mr-2 h-5 w-5" />
          Post to The Wall
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] glow-border">
        <DialogHeader>
          <DialogTitle className="text-2xl glow-text">Share Your Thoughts</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">What's on your mind?</Label>
            <Textarea
              id="content"
              placeholder="Pour your thoughts into the void..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="anonymous" className="text-sm">
              Post anonymously (recommended for privacy)
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full glow-hover"
            disabled={createPost.isPending || !content.trim() || !isConnected}
          >
            {createPost.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Writing to blockchain...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                {isAnonymous ? 'Post Anonymously' : 'Post Publicly'}
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
