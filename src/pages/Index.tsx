// Contribution #64: "^1.8.14", - Pull request workflow
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import CreatePostModal from "@/components/CreatePostModal";
import { usePosts } from "@/hooks/usePosts";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { Category, SortOption } from "@/lib/types";

const categories: (Category | "All")[] = [
  "All",
  "General",
  "Loneliness",
  "Career",
  "Anxiety",
  "Relationships",
  "Identity",
  "Loss",
];

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  
  const sortBy = (searchParams.get("sort") as SortOption) || "latest";

  const { data: posts, isLoading } = usePosts(
    sortBy,
    selectedCategory === "All" ? undefined : selectedCategory,
    searchQuery
  );

  const handleSortChange = (value: SortOption) => {
    setSearchParams({ sort: value });
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-5 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-4 glow-text">
            THE WALL
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Anonymous thoughts. Permanent records. Real connections.
          </p>
          <CreatePostModal />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search the wall..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as Category | "All")}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="top">Top</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[200px] rounded-lg" />
            ))
          ) : posts && posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No posts found. Be the first to share.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
