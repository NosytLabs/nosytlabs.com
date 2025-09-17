import React, { useState, useMemo } from 'react';

const BlogSearch = ({ posts = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set();
    posts.forEach(post => {
      if (post.data.tags) {
        post.data.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [posts]);

  // Filter posts based on search term and selected tag
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = searchTerm === '' || 
        post.data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.data.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTag = selectedTag === '' || 
        (post.data.tags && post.data.tags.includes(selectedTag));
      
      return matchesSearch && matchesTag;
    });
  }, [posts, searchTerm, selectedTag]);

  return (
    <div className="mb-16">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <select
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="">All Topics</option>
            {allTags.map(tag => (
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