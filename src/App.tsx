import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { BlogList } from "@/components/blog/BlogList";
import { BlogDetail } from "@/components/blog/BlogDetail";
import type { Blog } from "@/types/blog";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

function BlogApp() {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  const handleSelectBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    setMobileShowDetail(true);
  };

  const handleBack = () => {
    setMobileShowDetail(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 lg:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            BlogSpace
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            Stay updated with the latest trends in finance, accounting, and career growth
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Panel - Blog List */}
          <aside
            className={`w-full lg:w-[380px] xl:w-[420px] flex-shrink-0 ${
              mobileShowDetail ? "hidden lg:block" : "block"
            }`}
          >
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Latest Articles</h2>
              </div>
              <div className="max-h-[calc(100vh-220px)] overflow-y-auto pr-1 space-y-3">
                <BlogList
                  selectedBlogId={selectedBlog?.id ?? null}
                  onSelectBlog={handleSelectBlog}
                />
              </div>
            </div>
          </aside>

          {/* Right Panel - Blog Detail */}
          <section
            className={`flex-1 min-w-0 ${
              !mobileShowDetail ? "hidden lg:block" : "block"
            }`}
          >
            <div className="bg-card rounded-xl border p-6 lg:p-8 min-h-[500px]">
              <BlogDetail blogId={selectedBlog?.id ?? null} onBack={handleBack} />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="font-bold text-lg mb-2">BlogSpace</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Empowering the next generation of financial leaders with tools,
                community, and knowledge.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Webinars
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Case Studies
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 BlogSpace. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BlogApp />
    </QueryClientProvider>
  );
}

export default App;
