// Blog Component for Nosyt Labs
// This component adds a blog/news section for company updates

export class BlogManager {
  constructor() {
    this.blogPosts = [];
    this.categories = [];
    this.tags = [];
  }

  /**
   * Initialize the blog manager with sample posts
   */
  initialize() {
    // Add sample categories
    this.categories = [
      { id: 'tech', name: 'Technology' },
      { id: 'updates', name: 'Updates' },
      { id: 'tutorials', name: 'Tutorials' },
      { id: 'projects', name: 'Projects' }
    ];
    
    // Add sample tags
    this.tags = [
      { id: 'ai', name: 'AI' },
      { id: 'web-dev', name: 'Web Development' },
      { id: 'blockchain', name: 'Blockchain' },
      { id: 'streaming', name: 'Streaming' },
      { id: 'vault-tec', name: 'Vault-Tec' }
    ];
    
    // Add sample blog posts
    this.blogPosts = [
      {
        id: 'introducing-stream-companion',
        title: 'Introducing Stream Companion: AI-Powered Chat Bot for Streamers',
        slug: 'introducing-stream-companion',
        date: '2025-03-15',
        author: 'Nosyt Labs Team',
        category: 'projects',
        tags: ['ai', 'streaming'],
        excerpt: 'We\'re excited to announce our latest project: Stream Companion, an AI-powered streaming chat bot that runs independently without requiring users to keep the app open.',
        content: `
          <div class="terminal-blog-post">
            <p>We're excited to announce our latest project: Stream Companion, an AI-powered streaming chat bot that runs independently without requiring users to keep the app open.</p>
            
            <h3>What is Stream Companion?</h3>
            <p>Stream Companion is designed as a server that can run independently and continuously monitor streaming chats. It uses advanced AI to interact with viewers, moderate content, and provide valuable insights to streamers.</p>
            
            <h3>Key Features</h3>
            <ul>
              <li>24/7 chat monitoring without requiring an open application window</li>
              <li>Advanced AI-powered responses to common viewer questions</li>
              <li>Customizable commands and responses</li>
              <li>Content moderation capabilities</li>
              <li>Viewer engagement analytics</li>
              <li>Integration with popular streaming platforms</li>
            </ul>
            
            <h3>Getting Started</h3>
            <p>Stream Companion is currently in beta testing. If you're interested in trying it out, visit our <a href="/projects" class="terminal-link">Projects</a> page for more information and to sign up for the beta program.</p>
            
            <p>Stay tuned for more updates as we continue to develop and refine Stream Companion!</p>
          </div>
        `
      },
      {
        id: 'vault-tec-shelter-simulator-update',
        title: 'Vault-Tec Shelter Simulator: New Features and Improvements',
        slug: 'vault-tec-shelter-simulator-update',
        date: '2025-03-10',
        author: 'Vault-Tec Development Team',
        category: 'updates',
        tags: ['vault-tec', 'web-dev'],
        excerpt: 'We\'ve added exciting new features to the Vault-Tec Shelter Simulator, including resource trading, robot upgrades, and more complex events.',
        content: `
          <div class="terminal-blog-post">
            <p>We've been hard at work improving the Vault-Tec Shelter Simulator, and we're excited to share the latest updates with you!</p>
            
            <h3>New Features</h3>
            <ul>
              <li><strong>Resource Trading System:</strong> Buy and sell resources with wasteland traders</li>
              <li><strong>Robot Upgrade System:</strong> Improve your robots' efficiency, durability, and AI capabilities</li>
              <li><strong>Shelter Expansion:</strong> Unlock new rooms and increase your vault's capacity</li>
              <li><strong>Enhanced Events:</strong> Experience more complex incidents and special encounters</li>
            </ul>
            
            <h3>Improvements</h3>
            <ul>
              <li>Improved UI with better resource visualization</li>
              <li>Enhanced terminal command system</li>
              <li>Better performance and stability</li>
              <li>New sound effects and visual feedback</li>
            </ul>
            
            <h3>Try It Out</h3>
            <p>To experience these new features, visit the <a href="/vault-shelter" class="terminal-link">Vault-Tec Shelter Simulator</a> page or type "vault" in the terminal command line.</p>
            
            <p>We'd love to hear your feedback on these new features. Happy vault managing!</p>
          </div>
        `
      },
      {
        id: 'nosyt-labs-website-launch',
        title: 'Nosyt Labs Website Launch: Notable Opportunities Shape Your Tomorrow',
        slug: 'nosyt-labs-website-launch',
        date: '2025-03-01',
        author: 'Nosyt Labs Team',
        category: 'updates',
        tags: ['web-dev'],
        excerpt: 'We\'re thrilled to announce the launch of our new website with a unique Fallout terminal theme, showcasing our projects and vision.',
        content: `
          <div class="terminal-blog-post">
            <p>We're thrilled to announce the launch of our new website! With a unique Fallout terminal aesthetic, our site showcases our projects, vision, and the technology we're passionate about.</p>
            
            <h3>Notable Opportunities Shape Your Tomorrow</h3>
            <p>Our slogan "Notable Opportunities Shape Your Tomorrow" (NOSYT) reflects our commitment to identifying and leveraging significant opportunities in technology to create a better future for our clients and partners.</p>
            
            <h3>Website Features</h3>
            <ul>
              <li><strong>Terminal Interface:</strong> Experience our unique Fallout-inspired terminal interface</li>
              <li><strong>Interactive Elements:</strong> Explore 3D objects, particle effects, and dynamic animations</li>
              <li><strong>Command Line:</strong> Use terminal commands to navigate and discover easter eggs</li>
              <li><strong>Vault-Tec Shelter Simulator:</strong> Try our interactive game showcasing our development capabilities</li>
              <li><strong>Project Showcase:</strong> Explore our current projects and technologies</li>
            </ul>
            
            <h3>Explore the Site</h3>
            <p>We invite you to explore our new website and discover all it has to offer. Use the terminal command line to navigate, or click the links in the navigation menu.</p>
            
            <p>Thank you for visiting Nosyt Labs. We look forward to shaping tomorrow together!</p>
          </div>
        `
      }
    ];
    
    // Blog Manager initialized with sample posts.
  }

  /**
   * Get all blog posts
   * @returns {Array} Array of blog posts
   */
  getAllPosts() {
    return this.blogPosts;
  }

  /**
   * Get blog post by ID or slug
   * @param {string} idOrSlug - Post ID or slug
   * @returns {Object|null} Blog post or null if not found
   */
  getPost(idOrSlug) {
    return this.blogPosts.find(post => 
      post.id === idOrSlug || post.slug === idOrSlug
    ) || null;
  }

  /**
   * Get posts by category
   * @param {string} categoryId - Category ID
   * @returns {Array} Array of blog posts in the category
   */
  getPostsByCategory(categoryId) {
    return this.blogPosts.filter(post => post.category === categoryId);
  }

  /**
   * Get posts by tag
   * @param {string} tagId - Tag ID
   * @returns {Array} Array of blog posts with the tag
   */
  getPostsByTag(tagId) {
    return this.blogPosts.filter(post => post.tags.includes(tagId));
  }

  /**
   * Get all categories
   * @returns {Array} Array of categories
   */
  getAllCategories() {
    return this.categories;
  }

  /**
   * Get all tags
   * @returns {Array} Array of tags
   */
  getAllTags() {
    return this.tags;
  }

  /**
   * Generate HTML for blog post list
   * @param {Array} posts - Array of blog posts
   * @returns {string} HTML for blog post list
   */
  generatePostListHTML(posts) {
    if (!posts || posts.length === 0) {
      return '<div class="terminal-blog-empty">No posts found</div>';
    }
    
    let html = '<div class="terminal-blog-list">';
    
    posts.forEach(post => {
      const category = this.categories.find(cat => cat.id === post.category);
      
      html += `
        <div class="terminal-blog-item">
          <div class="terminal-blog-date">${post.date}</div>
          <h3 class="terminal-blog-title">
            <a href="/blog/${post.slug}" class="terminal-link">${post.title}</a>
          </h3>
          <div class="terminal-blog-meta">
            <span class="terminal-blog-author">By ${post.author}</span>
            <span class="terminal-blog-category">in ${category ? category.name : post.category}</span>
          </div>
          <div class="terminal-blog-excerpt">${post.excerpt}</div>
          <div class="terminal-blog-tags">
            ${post.tags.map(tag => {
              const tagObj = this.tags.find(t => t.id === tag);
              return `<span class="terminal-blog-tag">${tagObj ? tagObj.name : tag}</span>`;
            }).join('')}
          </div>
          <a href="/blog/${post.slug}" class="terminal-button">Read More</a>
        </div>
      `;
    });
    
    html += '</div>';
    
    return html;
  }

  /**
   * Generate HTML for a single blog post
   * @param {string} idOrSlug - Post ID or slug
   * @returns {string} HTML for blog post
   */
  generatePostHTML(idOrSlug) {
    const post = this.getPost(idOrSlug);
    
    if (!post) {
      return '<div class="terminal-blog-error">Post not found</div>';
    }
    
    const category = this.categories.find(cat => cat.id === post.category);
    
    let html = `
      <div class="terminal-blog-post-container">
        <div class="terminal-blog-date">${post.date}</div>
        <h2 class="terminal-blog-title">${post.title}</h2>
        <div class="terminal-blog-meta">
          <span class="terminal-blog-author">By ${post.author}</span>
          <span class="terminal-blog-category">in ${category ? category.name : post.category}</span>
        </div>
        <div class="terminal-blog-content">
          ${post.content}
        </div>
        <div class="terminal-blog-tags">
          ${post.tags.map(tag => {
            const tagObj = this.tags.find(t => t.id === tag);
            return `<span class="terminal-blog-tag">${tagObj ? tagObj.name : tag}</span>`;
          }).join('')}
        </div>
        <div class="terminal-blog-navigation">
          <a href="/blog" class="terminal-button">Back to Blog</a>
        </div>
      </div>
    `;
    
    return html;
  }

  /**
   * Generate HTML for blog sidebar
   * @returns {string} HTML for blog sidebar
   */
  generateSidebarHTML() {
    let html = '<div class="terminal-blog-sidebar">';
    
    // Categories section
    html += '<div class="terminal-blog-sidebar-section">';
    html += '<h3 class="terminal-blog-sidebar-title">Categories</h3>';
    html += '<ul class="terminal-blog-sidebar-list">';
    this.categories.forEach(category => {
      const count = this.getPostsByCategory(category.id).length;
      html += `<li><a href="/blog/category/${category.id}" class="terminal-link">${category.name} (${count})</a></li>`;
    });
    html += '</ul>';
    html += '</div>';
    
    // Tags section
    html += '<div class="terminal-blog-sidebar-section">';
    html += '<h3 class="terminal-blog-sidebar-title">Tags</h3>';
    html += '<div class="terminal-blog-tag-cloud">';
    this.tags.forEach(tag => {
      const count = this.getPostsByTag(tag.id).length;
      html += `<a href="/blog/tag/${tag.id}" class="terminal-blog-tag">${tag.name} (${count})</a>`;
    });
    html += '</div>';
    html += '</div>';
    
    // Recent posts section
    html += '<div class="terminal-blog-sidebar-section">';
    html += '<h3 class="terminal-blog-sidebar-title">Recent Posts</h3>';
    html += '<ul class="terminal-blog-sidebar-list">';
    this.blogPosts.slice(0, 5).forEach(post => {
      html += `<li><a href="/blog/${post.slug}" class="terminal-link">${post.title}</a></li>`;
    });
    html += '</ul>';
    html += '</div>';
    
    html += '</div>';
    
    return html;
  }
}

export default BlogManager;
