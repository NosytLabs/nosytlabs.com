import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  publishDate: string;
  lastModified?: string;
  featuredImage?: string;
  readingTime?: string;
  draft: boolean;
  featured: boolean;
  content?: string;
}

interface BlogManagerProps {
  initialPosts?: BlogPost[];
}

const BlogManager: React.FC<BlogManagerProps> = ({ initialPosts = [] }) => {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Get unique categories from posts
  const categories = ['all', ...new Set(posts.map(post => post.category))];

  // Filter posts based on search and filters
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'published' && !post.draft) ||
                         (filterStatus === 'draft' && post.draft) ||
                         (filterStatus === 'featured' && post.featured);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreatePost = () => {
    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title: 'New Blog Post',
      description: '',
      excerpt: '',
      category: 'Development',
      tags: [],
      author: 'NosyT Labs Team',
      publishDate: new Date().toISOString(),
      draft: true,
      featured: false,
      content: '# New Blog Post\n\nStart writing your content here...'
    };
    
    setPosts([newPost, ...posts]);
    setSelectedPost(newPost);
    setIsEditing(true);
    toast.success('New post created!');
  };

  const handleSavePost = async (updatedPost: BlogPost) => {
    try {
      // In a real implementation, this would save to your CMS or database
      setPosts(posts.map(post => 
        post.id === updatedPost.id ? { ...updatedPost, lastModified: new Date().toISOString() } : post
      ));
      
      setSelectedPost(updatedPost);
      toast.success('Post saved successfully!');
    } catch (_error) {
      toast.error('Failed to save post');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        setPosts(posts.filter(post => post.id !== postId));
        if (selectedPost?.id === postId) {
          setSelectedPost(null);
          setIsEditing(false);
        }
        toast.success('Post deleted successfully!');
      } catch (_error) {
        toast.error('Failed to delete post');
      }
    }
  };

  const handlePublishPost = async (postId: string) => {
    try {
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, draft: false, publishDate: new Date().toISOString() }
          : post
      ));
      toast.success('Post published successfully!');
    } catch (_error) {
      toast.error('Failed to publish post');
    }
  };

  const handleToggleFeatured = async (postId: string) => {
    try {
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, featured: !post.featured } : post
      ));
      toast.success('Post updated successfully!');
    } catch (_error) {
      toast.error('Failed to update post');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blog Manager</h1>
              <p className="text-gray-600 mt-1">Manage your blog posts and content</p>
            </div>
            <button
              onClick={handleCreatePost}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Post
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="featured">Featured</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Posts List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Posts ({filteredPosts.length})
                </h2>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedPost?.id === post.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => {
                      setSelectedPost(post);
                      setIsEditing(false);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {post.category}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            post.draft 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {post.draft ? 'Draft' : 'Published'}
                          </span>
                          {post.featured && (
                            <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredPosts.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <p>No posts found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Post Details/Editor */}
          <div className="lg:col-span-2">
            {selectedPost ? (
              <PostEditor
                post={selectedPost}
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={handleSavePost}
                onCancel={() => setIsEditing(false)}
                onDelete={() => handleDeletePost(selectedPost.id)}
                onPublish={() => handlePublishPost(selectedPost.id)}
                onToggleFeatured={() => handleToggleFeatured(selectedPost.id)}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Post</h3>
                <p className="text-gray-600">Choose a post from the list to view or edit its content.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Post Editor Component
interface PostEditorProps {
  post: BlogPost;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
  onDelete: () => void;
  onPublish: () => void;
  onToggleFeatured: () => void;
}

const PostEditor: React.FC<PostEditorProps> = ({
  post,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onPublish,
  onToggleFeatured
}) => {
  const [editedPost, setEditedPost] = useState<BlogPost>(post);

  useEffect(() => {
    setEditedPost(post);
  }, [post]);

  const handleSave = () => {
    onSave(editedPost);
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setEditedPost({ ...editedPost, tags });
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Edit Post</h2>
            <div className="flex gap-2">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={editedPost.title}
              onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={editedPost.description}
              onChange={(e) => setEditedPost({ ...editedPost, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
            <textarea
              value={editedPost.excerpt}
              onChange={(e) => setEditedPost({ ...editedPost, excerpt: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                value={editedPost.category}
                onChange={(e) => setEditedPost({ ...editedPost, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
              <input
                type="text"
                value={editedPost.author}
                onChange={(e) => setEditedPost({ ...editedPost, author: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={editedPost.tags.join(', ')}
              onChange={(e) => handleTagsChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="web development, react, typescript"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image URL</label>
            <input
              type="url"
              value={editedPost.featuredImage || ''}
              onChange={(e) => setEditedPost({ ...editedPost, featuredImage: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={editedPost.draft}
                onChange={(e) => setEditedPost({ ...editedPost, draft: e.target.checked })}
                className="mr-2"
              />
              Draft
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={editedPost.featured}
                onChange={(e) => setEditedPost({ ...editedPost, featured: e.target.checked })}
                className="mr-2"
              />
              Featured
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{post.category}</span>
              <span>•</span>
              <span>{post.author}</span>
              <span>•</span>
              <span>{new Date(post.publishDate).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Edit
            </button>
            
            {post.draft && (
              <button
                onClick={onPublish}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Publish
              </button>
            )}
            
            <button
              onClick={onToggleFeatured}
              className={`px-4 py-2 rounded-lg transition-colors ${
                post.featured
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {post.featured ? 'Unfeature' : 'Feature'}
            </button>
            
            <button
              onClick={onDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700">{post.description}</p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Excerpt</h3>
          <p className="text-gray-700">{post.excerpt}</p>
        </div>
        
        {post.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-4 text-sm">
          <span className={`px-3 py-1 rounded-full ${
            post.draft 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {post.draft ? 'Draft' : 'Published'}
          </span>
          
          {post.featured && (
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
              Featured
            </span>
          )}
          
          {post.readingTime && (
            <span className="text-gray-600">{post.readingTime}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogManager;