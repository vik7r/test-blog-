import { useState } from "react";
import { useCreateBlog } from "@/hooks/useBlogs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, X, Loader2, ImageIcon } from "lucide-react";

const AVAILABLE_CATEGORIES = [
  "FINANCE",
  "TECH",
  "CAREER",
  "EDUCATION",
  "REGULATIONS",
  "LIFESTYLE",
  "SKILLS",
];

interface CreateBlogFormProps {
  onSuccess?: () => void;
}

export function CreateBlogForm({ onSuccess }: CreateBlogFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const createBlog = useCreateBlog();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setContent("");
    setCoverImage("");
    setSelectedCategories([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !content || selectedCategories.length === 0) {
      return;
    }

    try {
      await createBlog.mutateAsync({
        title,
        description,
        content,
        coverImage: coverImage || "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
        category: selectedCategories,
      });

      resetForm();
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create blog:", error);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const isValid =
    title.trim() &&
    description.trim() &&
    content.trim() &&
    selectedCategories.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Article
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Blog</DialogTitle>
          <DialogDescription>
            Write a new article to share with your readers
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter blog title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-medium"
            />
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <Label>Categories * (select at least one)</Label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_CATEGORIES.map((category) => {
                const isSelected = selectedCategories.includes(category);
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {category}
                    {isSelected && <X className="h-3 w-3" />}
                  </button>
                );
              })}
            </div>
            {selectedCategories.length > 0 && (
              <div className="flex gap-1 mt-2">
                {selectedCategories.map((cat) => (
                  <Badge key={cat} variant="outline" className="text-xs">
                    {cat}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="coverImage"
                  placeholder="https://example.com/image.jpg"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            {coverImage && (
              <div className="mt-2 relative aspect-video w-full max-w-sm rounded-lg overflow-hidden bg-muted">
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="A brief summary of your blog..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/200 characters recommended
            </p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              placeholder="Write your blog content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="min-h-[200px]"
            />
            <p className="text-xs text-muted-foreground">
              Use plain text. Separate paragraphs with blank lines.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || createBlog.isPending}
            >
              {createBlog.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {createBlog.isPending ? "Publishing..." : "Publish Article"}
            </Button>
          </div>

          {createBlog.isError && (
            <p className="text-sm text-destructive">
              Failed to create blog. Please try again.
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
