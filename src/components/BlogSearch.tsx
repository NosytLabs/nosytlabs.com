import React, { useState, useMemo } from 'react';

interface BlogPost {
  slug: string;
  data: {
    title: string;
    description: string;
    tags?: string[];
    pubDate: Date;
    author?: string;
    heroImage?: string;
  };
}

interface BlogSearchProps {
  posts?: BlogPost[];
}

const BlogSearch: React.FC<BlogSearchProps> = ({ posts = [] }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((post: BlogPost) => {
      if (post.data.tags) {
        post.data.tags.forEach((tag: string) => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [posts]);

  // Filter posts based on search term and selected tag
  const filteredPosts = useMemo(() => {
    return posts.filter((post: BlogPost) => {
      const matchesSearch = searchTerm === '' || 
        post.data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.data.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTag = selectedTag === '' || 
        (post.data.tags && post.data.tags.includes(selectedTag));
      
      return matchesSearch && matchesTag;
    });
  }, [posts, searchTerm, selectedTag]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTag(e.target.value);
  };

  return (
    <div className="mb-16">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <label htmlFor="search-input" className="sr-only">Search articles by keyword</label>
          <input
            id="search-input"
            type="text"
            placeholder="Search articles..."
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="w-full md:w-48">
          <label htmlFor="filter-select" className="block text-sm leading-relaxed font-medium text-foreground mb-1">
            Filter by topic
          </label>
          <div id="filter-help" className="text-xs text-muted-foreground mb-2">
            Choose a topic to filter articles, or select "All Topics" to view everything
          </div>
          <select
            id="filter-select"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            value={selectedTag}
            onChange={handleTagChange}
            aria-label="Filter articles by topic"
            aria-describedby="filter-help"
          >
            <option value="">All Topics</option>
            {allTags.map((tag: string) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>
      
      {searchTerm || selectedTag ? (
        <p className="text-muted-foreground mb-4">
          {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
        </p>
      ) : null}
    </div>
  );
};

export default BlogSearch;