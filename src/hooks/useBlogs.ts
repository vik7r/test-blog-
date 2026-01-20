import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBlogs, fetchBlogById, createBlog } from "@/api/blogs";
import type { CreateBlogInput } from "@/types/blog";

export const blogKeys = {
  all: ["blogs"] as const,
  detail: (id: string) => ["blogs", id] as const,
};

export function useBlogs() {
  return useQuery({
    queryKey: blogKeys.all,
    queryFn: fetchBlogs,
  });
}

export function useBlog(id: string | null) {
  return useQuery({
    queryKey: blogKeys.detail(id ?? ""),
    queryFn: () => fetchBlogById(id!),
    enabled: !!id,
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (blog: CreateBlogInput) => createBlog(blog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}
