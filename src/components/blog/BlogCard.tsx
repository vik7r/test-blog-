import type { Blog } from "@/types/blog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  blog: Blog;
  isSelected: boolean;
  onClick: () => void;
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

export function BlogCard({ blog, isSelected, onClick }: BlogCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/30",
        isSelected && "border-primary shadow-md bg-primary/5"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {blog.category.map((cat) => (
              <Badge
                key={cat}
                variant={categoryVariants[cat] || "secondary"}
                className="text-[10px] uppercase tracking-wider"
              >
                {cat}
              </Badge>
            ))}
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {getRelativeTime(blog.date)}
          </span>
        </div>
        <h3 className="font-semibold text-base leading-tight mt-2 line-clamp-2">
          {blog.title}
        </h3>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {blog.description}
        </p>
      </CardContent>
    </Card>
  );
}
