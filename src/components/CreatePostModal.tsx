// Contribution #50: "^1.8.14", - Mention system
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCreatePost } from "@/hooks/usePosts";
import { Category } from "@/lib/types";
import { Plus, Loader2 } from "lucide-react";

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
  const createPost = useCreatePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await createPost.mutateAsync({ content, category });
    setContent("");
    setCategory("General");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="glow-hover font-semibold">
          <Plus className="mr-2 h-5 w-5" />
          Post to The Wall
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] glow-border">
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

          <Button 
            type="submit" 
            className="w-full glow-hover" 
            disabled={createPost.isPending || !content.trim()}
          >
            {createPost.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Writing to blockchain...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Post Anonymously
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
