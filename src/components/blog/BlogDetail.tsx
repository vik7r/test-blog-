import { useBlog } from "@/hooks/useBlogs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatDate, estimateReadTime } from "@/lib/utils";
import { AlertCircle, ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";

interface BlogDetailProps {
  blogId: string | null;
  onBack: () => void;
}

const categoryVariants: Record<string, "finance" | "tech" | "career" | "education" | "regulations" | "lifestyle" | "skills" | "secondary"> = {
  FINANCE: "finance",
  TECH: "tech",
  CAREER: "career",
  EDUCATION: "education",
  REGULATIONS: "regulations",
  LIFESTYLE: "lifestyle",
  SKILLS: "skills",
};

function BlogDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <Skeleton className="w-full aspect-[21/9] rounded-xl mb-6" />
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="h-10 w-3/4 mb-4" />
      <div className="flex gap-6 mb-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-20 w-full mb-4" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 px-4 text-center">
      <div className="w-64 h-64 mb-6 relative">
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-muted-foreground/20"
        >
          <rect x="30" y="40" width="140" height="120" rx="8" stroke="currentColor" strokeWidth="2" />
          <rect x="45" y="60" width="60" height="8" rx="2" fill="currentColor" />
          <rect x="45" y="76" width="110" height="4" rx="2" fill="currentColor" opacity="0.5" />
          <rect x="45" y="86" width="100" height="4" rx="2" fill="currentColor" opacity="0.5" />
          <rect x="45" y="96" width="90" height="4" rx="2" fill="currentColor" opacity="0.5" />
          <rect x="45" y="110" width="110" height="4" rx="2" fill="currentColor" opacity="0.5" />
          <rect x="45" y="120" width="80" height="4" rx="2" fill="currentColor" opacity="0.5" />
          <circle cx="155" cy="145" r="25" stroke="currentColor" strokeWidth="2" />
          <path d="M170 160L185 175" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="font-semibold text-xl mb-2 text-foreground">Select an article</h3>
      <p className="text-muted-foreground max-w-sm">
        Choose a blog from the list on the left to read its full content
      </p>
    </div>
  );
}

export function BlogDetail({ blogId, onBack }: BlogDetailProps) {
  const { data: blog, isLoading, isError, error, refetch } = useBlog(blogId);

  if (!blogId) {
    return <EmptyState />;
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <BlogDetailSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 px-4 text-center">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="font-semibold text-xl mb-2">Failed to load blog</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
          {error instanceof Error ? error.message : "Something went wrong while loading this blog"}
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (!blog) {
    return <EmptyState />;
  }

  const readTime = estimateReadTime(blog.content);

  return (
    <article className="max-w-3xl mx-auto">
      {/* Mobile back button */}
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 lg:hidden -ml-2"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to articles
      </Button>

      {/* Cover Image */}
      <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden mb-6 bg-muted">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-4">
        {blog.category.map((cat) => (
          <Badge
            key={cat}
            variant={categoryVariants[cat] || "secondary"}
            className="uppercase tracking-wider"
          >
            {cat}
          </Badge>
        ))}
        <span className="text-sm text-muted-foreground flex items-center ml-2">
          <Clock className="h-3.5 w-3.5 mr-1" />
          {readTime} min read
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
        {blog.title}
      </h1>

      {/* Share button and Date */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1.5" />
            {formatDate(blog.date)}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
          }}
        >
          <Share2 className="h-4 w-4 mr-1.5" />
          Share Article
        </Button>
      </div>

      {/* Description */}
      <p className="text-lg text-muted-foreground mb-8 leading-relaxed font-medium">
        {blog.description}
      </p>

      {/* Content */}
      <div className="prose prose-slate max-w-none">
        {blog.content.split("\n\n").map((paragraph, index) => (
          <p key={index} className="text-base leading-relaxed mb-4 text-foreground/90">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Tags at bottom */}
      <div className="mt-10 pt-6 border-t">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Tags</h4>
        <div className="flex flex-wrap gap-2">
          {blog.category.map((cat) => (
            <Badge key={cat} variant="outline" className="lowercase">
              #{cat.toLowerCase()}
            </Badge>
          ))}
        </div>
      </div>
    </article>
  );
}
