import { useBlogs } from "@/hooks/useBlogs";
import type { Blog } from "@/types/blog";
import { BlogCard } from "./BlogCard";
import { BlogCardSkeleton } from "./BlogCardSkeleton";
import { AlertCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogListProps {
  selectedBlogId: string | null;
  onSelectBlog: (blog: Blog) => void;
}

export function BlogList({ selectedBlogId, onSelectBlog }: BlogListProps) {
  const { data: blogs, isLoading, isError, error, refetch } = useBlogs();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="rounded-full bg-destructive/10 p-3 mb-4">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="font-semibold text-lg mb-1">Failed to load blogs</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <BookOpen className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-1">No blogs yet</h3>
        <p className="text-sm text-muted-foreground">
          Create your first blog to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {blogs.map((blog) => (
        <BlogCard
          key={blog.id}
          blog={blog}
          isSelected={selectedBlogId === blog.id}
          onClick={() => onSelectBlog(blog)}
        />
      ))}
    </div>
  );
}
