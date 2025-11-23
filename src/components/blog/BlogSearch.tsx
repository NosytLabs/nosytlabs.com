import React, { useState, useEffect, useMemo } from "react";
import type { CollectionEntry } from "astro:content";
import { Search, X, Calendar, Tag, Filter } from "lucide-react";
import { createImagePath, createInternalLink } from "@/lib/constants";

interface BlogSearchProps {
  posts: CollectionEntry<"blog">[];
  className?: string;
}

type SortOption =
  | "date-desc"
  | "date-asc"
  | "title-asc"
  | "title-desc";

interface FilterState {
  search: string;
  tags: string[];
  sortBy: SortOption;
}

// Enhanced consolidated style classes
const styles = {
  input:
    "w-full pl-12 pr-12 py-4 bg-background border-2 border-border rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-foreground placeholder-muted-foreground text-base min-h-[52px]",
  button: {
    primary:
      "px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 hover:shadow-lg transition-all duration-300 focus:ring-4 focus:ring-primary/20 focus:ring-offset-2 font-medium min-h-[44px]",
    secondary:
      "px-6 py-3 bg-muted hover:bg-muted/80 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-primary/20 focus:ring-offset-2 font-medium min-h-[44px]",
    tag: "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[36px] border-2",
    clear:
      "text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 px-3 py-2 rounded-lg transition-all duration-200 font-medium",
  },
  card: "group bg-card border-2 border-border rounded-xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 animate-fade-in gpu-accelerated cursor-pointer",
  select:
    "bg-background border-2 border-border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent min-h-[44px]",
  iconButton:
    "absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-muted/50 p-2 rounded-lg transition-all duration-200",
};

export default function BlogSearch({ posts, className = "" }: BlogSearchProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    tags: [],
    sortBy: "date-desc",
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted for client-side features
  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract all unique tags from posts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((post) => {
      if (post.data.tags) {
        post.data.tags.forEach((tag: string) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    const filtered = posts.filter((post) => {
      // Search filter
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        !searchLower ||
        post.data.title.toLowerCase().includes(searchLower) ||
        post.data.description?.toLowerCase().includes(searchLower) ||
        post.data.tags?.some((tag: string) =>
          tag.toLowerCase().includes(searchLower),
        );

      // Tag filter
      const matchesTags =
        filters.tags.length === 0 ||
        filters.tags.every((filterTag) => post.data.tags?.includes(filterTag));

      return matchesSearch && matchesTags;
    });

    // Sort posts
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "date-desc":
          return (
            new Date(b.data.pubDate).getTime() -
            new Date(a.data.pubDate).getTime()
          );
        case "date-asc":
          return (
            new Date(a.data.pubDate).getTime() -
            new Date(b.data.pubDate).getTime()
          );
        case "title-asc":
          return a.data.title.localeCompare(b.data.title);
        case "title-desc":
          return b.data.title.localeCompare(a.data.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [posts, filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSortChange = (sortBy: SortOption) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      tags: [],
      sortBy: "date-desc",
    });
  };

  const hasActiveFilters =
    filters.search || filters.tags.length > 0 || filters.sortBy !== "date-desc";

  if (!mounted) {
    return (
      <div className={`blog-search-loading ${className}`}>
        <div className="animate-pulse">
          <div className="h-12 bg-muted rounded-lg mb-4"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`blog-search-container ${className}`}>
      {/* Enhanced Search and Filter Controls */}
      <div className="mb-8 space-y-6">
        {/* Search Input with enhanced UX */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search posts by title, description, or tags..."
            value={filters.search}
            onChange={handleSearchChange}
            className={styles.input}
            aria-label="Search blog posts"
            autoComplete="off"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: "" }))}
              className={styles.iconButton}
              aria-label="Clear search"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {/* Search hint */}
          <div className="absolute -bottom-6 left-0 text-xs text-muted-foreground">
            {filters.search &&
              `Found ${filteredPosts.length} result${filteredPosts.length !== 1 ? "s" : ""}`}
          </div>
        </div>

        {/* Enhanced Filter Toggle and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsFilterOpen(!isFilterOpen);
              }
            }}
            className={`${styles.button.secondary} flex items-center gap-3 w-full sm:w-auto justify-center`}
            aria-expanded={isFilterOpen}
            aria-controls="filter-panel"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-semibold min-w-[24px] text-center">
                {filters.tags.length + (filters.search ? 1 : 0)}
              </span>
            )}
            {/* Animated chevron */}
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isFilterOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label
              htmlFor="sort-select"
              className="text-sm font-medium text-muted-foreground whitespace-nowrap"
            >
              Sort by:
            </label>
            <select
              id="sort-select"
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className={styles.select}
              aria-label="Sort posts"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </div>
        </div>

        {/* Enhanced Filter Panel */}
        {isFilterOpen && (
          <div
            id="filter-panel"
            className="bg-muted/30 rounded-xl p-6 space-y-6 animate-fade-in border border-border/50"
          >
            <div>
              <h3 className="text-base font-semibold mb-4 text-foreground">
                Filter by Tags
              </h3>
              <div className="flex flex-wrap gap-3">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleTagToggle(tag);
                      }
                    }}
                    className={`${styles.button.tag} ${
                      filters.tags.includes(tag)
                        ? "bg-primary text-primary-foreground border-primary shadow-md hover:shadow-lg"
                        : "bg-background border-border hover:border-primary/50 hover:bg-primary/5"
                    }`}
                    aria-pressed={filters.tags.includes(tag)}
                  >
                    {tag}
                    {filters.tags.includes(tag) && (
                      <svg
                        className="w-3 h-3 ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              {allTags.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  No tags available
                </p>
              )}
            </div>

            {hasActiveFilters && (
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between pt-4 border-t border-border/50">
                <span className="text-sm text-muted-foreground">
                  {filters.tags.length} tag
                  {filters.tags.length !== 1 ? "s" : ""} selected
                  {filters.search && " • search active"}
                </span>
                <button
                  onClick={clearFilters}
                  className={`${styles.button.clear} flex items-center gap-2`}
                  aria-label="Clear all active filters"
                >
                  <X className="w-4 h-4" />
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Results Summary */}
      <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border/50">
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
          <p className="text-sm font-medium text-foreground">
            {filteredPosts.length === posts.length
              ? `Showing all ${posts.length} posts`
              : `Showing ${filteredPosts.length} of ${posts.length} posts`}
          </p>
          {hasActiveFilters && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Active filters:</span>
              {filters.search && (
                <span className="px-2 py-1 bg-background border border-border rounded-md">
                  Search: "{filters.search}"
                </span>
              )}
              {filters.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-background border border-border rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Posts Grid - Wider layout */}
      <main
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        role="main"
        aria-label="Blog posts"
      >
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <article
              key={post.slug}
              className={`${styles.card} animate-fade-in-up transform hover:-translate-y-2`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {post.data.heroImage && (
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={createImagePath(post.data.heroImage)}
                    alt={
                      post.data.heroImageAlt ||
                      `Featured image for blog post: ${post.data.title}`
                    }
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = createImagePath(
                        "images/blog-index-og.jpg",
                      );
                      e.currentTarget.alt = "NOSYT Labs Blog Fallback Image";
                    }}
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}

              <div className="p-6 relative">
                {/* Enhanced metadata */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <time
                    dateTime={post.data.pubDate.toISOString()}
                    className="flex items-center gap-1.5 font-medium"
                  >
                    <Calendar className="w-4 h-4" />
                    {post.data.pubDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>

                {/* Enhanced title */}
                <h2 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                  <a
                    href={createInternalLink(`/blog/${post.slug}`)}
                    className="hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    aria-label={`Read post: ${post.data.title}`}
                  >
                    {post.data.title}
                  </a>
                </h2>

                {/* Enhanced description */}
                {post.data.description && (
                  <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                    {post.data.description}
                  </p>
                )}

                {/* Enhanced tags */}
                {post.data.tags && post.data.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.data.tags.slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground text-xs rounded-full transition-colors duration-200 cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onClick={() => handleTagToggle(tag)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleTagToggle(tag);
                          }
                        }}
                        aria-label={`Filter by tag: ${tag}`}
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                    {post.data.tags.length > 3 && (
                      <span className="text-xs text-muted-foreground px-2 py-1">
                        +{post.data.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Read more indicator */}
                <div className="flex items-center gap-2 text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Read more</span>
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                No posts found
              </h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Try adjusting your search terms or filters to find what you're
                looking for.
              </p>
              {hasActiveFilters && (
                <div className="space-y-4">
                  <button
                    onClick={clearFilters}
                    className={styles.button.primary}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear all filters
                  </button>
                  <div className="text-sm text-muted-foreground">
                    Or try searching for:{" "}
                    <span className="font-medium">
                      React, TypeScript, Web Development
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
