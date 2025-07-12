import { generateSlug } from '../utils/pathResolvers';

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishDate: Date;
  lastModified?: Date;
  author: string;
  authorRole: string;
  tags: string[];
  category: string;
  featuredImage?: string;
  readingTime: string;
  featured?: boolean;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
  relatedPosts?: string[]; // Array of slugs
}

export const blogPosts: BlogPost[] = [
  {
    title: "AI Trends to Watch in 2025",
    slug: "ai-trends-2025",
    excerpt: "Explore the cutting-edge AI trends shaping web development, business automation, and innovation in 2025, focusing on practical applications and future impact.",
    content: `
      <h2>The AI Revolution: Beyond Hype in 2025</h2>
      <p>In 2025, Artificial Intelligence (AI) is no longer just a buzzword. It's a fundamental driver of innovation across all sectors. The focus has shifted from theoretical possibilities to tangible applications that deliver real return on investment (ROI).</p>
      <p>Forward-thinking organizations must integrate these pivotal AI trends:</p>
      
      <h3>1. AI-Enhanced Development & Operations (AI-DevOps)</h3>
      <p>AI is revolutionizing development workflows. Tools are now more sophisticated, offering AI assistants that generate code and debug issues. They also proactively optimize performance and security.</p>
      <p>This integration leads to significantly faster development cycles, higher code quality, and more robust deployments. Expect to see increased automated testing, AI-driven performance monitoring, and proactive maintenance.</p>
      
      <h3>2. Hyper-Personalization & Predictive Analytics</h3>
      <p>AI analyzes vast datasets, enabling unprecedented levels of personalization. It tailors user experiences on websites and creates highly targeted marketing campaigns. AI also predicts user behavior, market trends, and system performance with remarkable accuracy.</p>
      <p>This empowers businesses to make proactive, data-driven decisions. The result is enhanced customer engagement and improved operational efficiency.</p>
      
      <h3>3. Agentic AI Systems & Collaborative Intelligence</h3>
      <p>The rise of "agentic AI" marks a significant shift. These AI systems can autonomously plan, execute, and adapt to complex tasks. They often collaborate with other AI agents or human experts.</p>
      <p>This fosters a collaborative environment. AI complements human creativity and oversight, leading to innovative solutions neither could achieve alone. Imagine AI assistants managing entire projects or troubleshooting complex systems with minimal human intervention.</p>
      
      <h3>4. AI in Content Creation & Automation</h3>
      <p>AI is transforming content generation. It crafts compelling marketing copy and personalized user interfaces. It also automates complex business processes.</p>
      <p>This includes hyper-automation, where advanced AI integrates with Robotic Process Automation (RPA). This integration transforms entire workflows, enabling autonomous execution of complex processes at scale.</p>
      
      <h3>5. Specialized AI Hardware & Cloud Integration</h3>
      <p>The demand for more powerful AI capabilities drives innovation in custom silicon and specialized AI hardware. Concurrently, cloud migrations are accelerating. They provide the scalable infrastructure necessary for deploying and managing advanced AI models.</p>
      <p>This synergy between hardware and cloud platforms is crucial. It handles the computational demands of next-generation AI applications.</p>
      
      <p>At NosytLabs, we actively implement these advanced AI strategies. We help businesses not just adapt, but thrive in the evolving digital landscape. Partner with us to leverage AI for:</p>
      <ul>
        <li>Accelerated development</li>
        <li>Superior customer experiences</li>
        <li>A significant competitive edge</li>
      </ul>
    `,
    publishDate: new Date('2025-01-05'),
    lastModified: new Date('2025-01-05'),
    author: "NosytLabs Team",
    authorRole: "AI Development Specialists",
    tags: ["AI", "Technology Trends", "Development", "Automation", "Business Innovation", "Web Development", "Hyper-automation", "Predictive Analytics", "Agentic AI"],
    category: "Technology",
    featuredImage: "/images/blog/ai-trends-2025.jpg",
    readingTime: "7 min read",
    featured: true,
    metadata: {
      title: "AI Trends to Watch in 2025 | NosytLabs Blog",
      description: "Explore the cutting-edge AI trends shaping web development, business automation, and innovation in 2025, focusing on practical applications and future impact. Expert insights from NosytLabs.",
      keywords: ["AI trends 2025", "artificial intelligence", "web development", "automation", "business innovation", "AI-DevOps", "hyper-personalization", "agentic AI", "custom silicon", "cloud AI"]
    },
    relatedPosts: ["web-performance-optimization", "future-of-web-development", "scalable-api-design"]
  },
  {
    title: "Web Performance Optimization: A Complete Guide",
    slug: "web-performance-optimization",
    excerpt: "Learn essential techniques to optimize your website's performance, improve Core Web Vitals, and enhance user experience.",
    content: `
      <h2>Why Performance Matters</h2>
      <p>Website performance directly impacts user experience, search engine rankings, and business conversions. Even a one-second delay in page load time can reduce conversions by up to 7%.</p>
      
      <h3>Core Web Vitals Optimization</h3>
      <p>Google's Core Web Vitals are essential metrics for measuring user experience. These include:</p>
      <ul>
        <li><strong>Largest Contentful Paint (LCP):</strong> Measures loading performance.</li>
        <li><strong>First Input Delay (FID):</strong> Measures interactivity.</li>
        <li><strong>Cumulative Layout Shift (CLS):</strong> Measures visual stability.</li>
      </ul>
      
      <h3>Optimization Techniques</h3>
      <h4>1. Image Optimization</h4>
      <p>Utilize modern image formats such as WebP and AVIF. Implement lazy loading for images below the fold. Always serve responsive images to fit various screen sizes.</p>
      
      <h4>2. Code Splitting</h4>
      <p>Break down your JavaScript bundles. This ensures that only the necessary code is loaded for each specific page, reducing initial load times.</p>
      
      <h4>3. Caching Strategies</h4>
      <p>Implement effective caching at multiple levels. This includes browser caching, Content Delivery Network (CDN) caching, and server-side caching. This reduces server load and speeds up content delivery.</p>
      
      <h4>4. Critical Resource Prioritization</h4>
      <p>Prioritize the loading of above-the-fold content. This includes critical CSS and essential JavaScript. This ensures users see and interact with your page quickly.</p>
      
      <p>Ready to optimize your website's performance? Contact NosytLabs today for a comprehensive performance audit and a tailored optimization plan.</p>
    `,
    publishDate: new Date('2024-11-15'),
    author: "NosytLabs Team",
    authorRole: "Performance Engineering Specialists",
    tags: ["Performance", "Web Development", "SEO", "User Experience"],
    category: "Development",
    featuredImage: "/images/blog/web-performance.jpg",
    readingTime: "8 min read",
    metadata: {
      title: "Web Performance Optimization Guide | NosytLabs",
      description: "Complete guide to web performance optimization. Improve Core Web Vitals, enhance user experience, and boost search rankings.",
      keywords: ["web performance", "core web vitals", "page speed", "website optimization", "user experience"]
    },
    relatedPosts: ["ai-trends-2025", "mobile-first-development"]
  },
  {
    title: "The Future of Web Development: Trends and Technologies in 2025",
    slug: "future-of-web-development",
    excerpt: "Explore the cutting-edge technologies and evolving trends that are shaping the future of web development in 2025, from AI integration to Web3.",
    content: `
      <h2>The Dynamic Evolution of Web Development in 2025</h2>
      <p>Web development continues its rapid evolution in 2025. This is driven by groundbreaking technologies, shifting user expectations, and increasing demands for superior performance, security, and accessibility. Staying abreast of these changes is paramount for both developers and businesses.</p>
      
      <h3>Key Trends and Technologies Shaping the Future</h3>
      
      <h4>1. AI-Driven Development and Automation</h4>
      <p>Artificial Intelligence (AI) is profoundly transforming the development lifecycle. AI tools are becoming indispensable for code generation, intelligent debugging, automated testing, and performance optimization. This integration accelerates development cycles and enhances code quality.</p>
      <p>It also allows developers to focus on more complex problem-solving and innovation. Expect to see more AI-powered low-code/no-code platforms and intelligent automation of routine tasks.</p>
      
      <h4>2. Edge Computing and Serverless Architectures</h4>
      <p>Edge computing is gaining significant traction. It brings computation and data storage closer to end-users. This minimizes latency, improves response times, and enhances overall application performance, especially for real-time applications.</p>
      <p>Coupled with serverless architectures, developers can build highly scalable, cost-effective, and resilient applications without managing underlying infrastructure.</p>
      
      <h4>3. WebAssembly (WASM) for High-Performance Web Applications</h4>
      <p>WebAssembly continues to mature, enabling near-native performance for web applications. This technology opens new frontiers for computationally intensive tasks directly within the browser. Examples include advanced gaming, video editing, and complex data visualizations. This blurs the lines between desktop and web applications.</p>
      
      <h4>4. Progressive Web Apps (PWAs) and Hybrid Experiences</h4>
      <p>PWAs are increasingly bridging the gap between traditional websites and native mobile applications. They offer offline capabilities, push notifications, and app-like user experiences. PWAs provide a compelling solution for reaching users across various devices and network conditions without app store installations. The focus is on seamless, integrated hybrid experiences.</p>
      
      <h4>5. Headless CMS and Jamstack Architecture Evolution</h4>
      <p>The adoption of headless Content Management Systems (CMS) and the Jamstack (JavaScript, APIs, Markup) architecture continues to grow. This decoupled approach offers unparalleled flexibility, enhanced security, improved performance, and a superior developer experience. It allows front-end and back-end development to proceed independently.</p>
      
      <h4>6. Web3 and Blockchain Integration</h4>
      <p>While still in nascent stages for mainstream web development, Web3 technologies are emerging as significant trends. These include blockchain, decentralized applications (dApps), and NFTs. They promise enhanced data ownership, transparency, and new monetization models. This fundamentally reshapes how digital interactions and transactions occur.</p>
      
      <h3>What This Means for Businesses and Developers</h3>
      <p>Embracing these trends is crucial for maintaining a competitive edge and delivering exceptional digital products. Businesses must invest in upskilling their teams and partnering with experts. These experts should possess deep knowledge of these evolving technologies.</p>
      <p>At NosytLabs, we are committed to guiding our clients through this dynamic landscape. We ensure their web presence is future-proof, performant, and innovative.</p>
    `,
    publishDate: new Date('2025-03-15'),
    author: "NosytLabs Team",
    authorRole: "Full-Stack Development Team",
    tags: ["Web Development", "Technology Trends", "Future Tech", "Innovation", "AI Development", "Edge Computing", "Serverless", "WebAssembly", "PWAs", "Headless CMS", "Jamstack", "Web3", "Blockchain"],
    category: "Technology",
    featuredImage: "/images/blog/future-web-dev.jpg",
    readingTime: "9 min read",
    metadata: {
      title: "Future of Web Development: Trends & Technologies in 2025 | NosytLabs",
      description: "Explore the cutting-edge technologies and evolving trends that are shaping the future of web development in 2025, from AI integration to Web3. Expert insights and predictions from NosytLabs.",
      keywords: ["future web development 2025", "web development trends 2025", "AI in web development", "edge computing", "serverless architecture", "WebAssembly", "Progressive Web Apps", "Headless CMS", "Jamstack", "Web3", "blockchain development"]
    },
    relatedPosts: ["ai-trends-2025", "web-performance-optimization", "scalable-api-design"]
  },
  {
    title: "Mobile-First Development: Best Practices for 2025",
    slug: "mobile-first-development",
    excerpt: "Master mobile-first development with proven strategies for creating responsive, fast, and user-friendly mobile experiences in 2025.",
    content: `
      <h2>Why Mobile-First Matters More Than Ever in 2025</h2>
      <p>With mobile traffic consistently dominating web usage, mobile-first development is no longer just a best practice—it's a fundamental requirement for digital success in 2025. Prioritizing the mobile experience ensures broader reach, better engagement, and improved search engine visibility.</p>
      
      <h3>Core Mobile-First Principles for 2025</h3>
      
      <h4>1. Progressive Enhancement & Responsive Design</h4>
      <p>Start with the most basic, functional experience for mobile devices and progressively enhance it for larger screens and more capable browsers. This ensures universal accessibility while delivering rich experiences where possible. Responsive design, utilizing CSS Grid, Flexbox, and media queries, remains crucial for adapting layouts gracefully.</p>
      
      <h4>2. Performance Optimization for Mobile Networks</h4>
      <p>Mobile users often contend with slower network speeds and less powerful devices. Optimizing for performance from the ground up is paramount. This includes aggressive image optimization (WebP, AVIF, responsive images), efficient loading strategies (lazy loading, critical CSS), and minimizing JavaScript payloads.</p>
      
      <h4>3. Touch-First Interactions & Accessibility</h4>
      <p>Design interfaces primarily for touch interactions, ensuring appropriately sized tap targets (minimum 44px by 44px) and intuitive gesture support. Beyond touch, focus on comprehensive accessibility (WCAG 2.2 guidelines) to ensure all users, regardless of ability, can effectively interact with your mobile experience.</p>
      
      <h3>Technical Implementation & Considerations</h3>
      
      <h4>Optimized Media Delivery</h4>
      <p>Implement &lt;picture&gt; elements and &lt;srcset&gt; attributes for responsive images. Consider adaptive video streaming and content delivery networks (CDNs) optimized for mobile traffic.</p>
      
      <h4>Efficient JavaScript & CSS Loading</h4>
      <p>Utilize techniques like tree-shaking, code splitting, and deferred loading for JavaScript. Extract critical CSS for immediate rendering and lazy-load the rest.</p>
      
      <h4>Leveraging Progressive Web App (PWA) Features</h4>
      <p>Embrace PWA capabilities for offline access, push notifications, and add-to-home-screen functionality, providing an app-like experience without app store friction.</p>
      
      <h3>Continuous Testing and Monitoring</h3>
      <p>Regular testing on a diverse range of real mobile devices and emulators is crucial. Implement continuous performance monitoring and user experience analytics to identify and address bottlenecks proactively. Tools that simulate various network conditions are invaluable.</p>
    `,
    publishDate: new Date('2025-04-20'),
    author: "NosytLabs Team",
    authorRole: "Mobile Development Specialists",
    tags: ["Mobile Development", "Responsive Design", "UX", "Performance", "Progressive Enhancement", "Touch-First", "Responsive Images", "Flexible Layouts", "PWA", "Accessibility", "Core Web Vitals"],
    category: "Development",
    featuredImage: "/images/blog/mobile-first.jpg",
    readingTime: "7 min read",
    metadata: {
      title: "Mobile-First Development Best Practices for 2025 | NosytLabs",
      description: "Master mobile-first development with proven strategies for responsive, fast, and user-friendly mobile experiences in 2025. Includes insights on PWAs, performance, and accessibility.",
      keywords: ["mobile-first development 2025", "responsive design", "mobile optimization", "touch interfaces", "progressive enhancement", "PWA development", "mobile UX", "web performance"]
    },
    relatedPosts: ["web-performance-optimization", "future-of-web-development", "ai-trends-2025"]
  },
  {
    title: "Building Scalable APIs: Design Patterns and Best Practices for 2025",
    slug: "scalable-api-design",
    excerpt: "Learn essential patterns and practices for building APIs that can scale with your business growth and handle increasing loads efficiently in 2025.",
    content: `
      <h2>The Foundation of Modern Applications: Scalable APIs in 2025</h2>
      <p>In 2025, APIs remain the critical backbone of modern applications. They facilitate seamless communication between diverse services, mobile apps, and third-party integrations. Building scalable, resilient, and secure APIs from the outset is paramount for sustainable business growth and efficient resource utilization.</p>
      
      <h3>Core Design Principles for 2025</h3>
      
      <h4>1. API-First and Contract-First Design</h4>
      <p>Adopt an API-first approach. Here, the API contract (e.g., OpenAPI/Swagger) is defined before development begins. This ensures clear communication, consistency, and enables parallel development. Contract-first design promotes better collaboration and reduces integration issues.</p>
      
      <h4>2. RESTful Principles with Pragmatic Adaptations</h4>
      <p>RESTful design remains a strong foundation for predictable, cacheable, and stateless APIs. However, pragmatic adaptations are common. This includes using appropriate HTTP methods, status codes, and embracing HATEOAS where beneficial. For complex interactions, consider supplementing with GraphQL or gRPC.</p>
      
      <h4>3. Consistent Naming Conventions and Versioning</h4>
      <p>Establish clear, consistent naming patterns for endpoints, parameters, and response structures. Implement a robust versioning strategy (e.g., URL-based, header-based) to manage API evolution without breaking existing client integrations.</p>
      
      <h3>Advanced Scalability Patterns for 2025</h3>
      
      <h4>1. Microservices Architecture</h4>
      <p>Decompose monolithic applications into smaller, independent microservices. This allows for independent development, deployment, and scaling of individual components, improving agility and resilience.</p>
      
      <h4>2. Efficient Data Handling: Pagination, Filtering, and Projections</h4>
      <p>Implement efficient pagination, filtering, sorting, and field projection mechanisms to handle large datasets. This prevents overwhelming clients and servers by allowing consumers to request only the data they need.</p>
      
      <h4>3. Multi-Layer Caching Strategies</h4>
      <p>Utilize multi-layered caching, including HTTP caching headers, in-memory caches (e.g., Redis), and Content Delivery Networks (CDNs). This significantly reduces database load and improves response times by serving frequently accessed data from closer, faster sources.</p>
      
      <h4>4. Robust Rate Limiting and Throttling</h4>
      <p>Protect your API from abuse, ensure fair usage, and prevent resource exhaustion with intelligent rate limiting and throttling mechanisms. Implement dynamic rate limits based on user tiers or historical usage patterns.</p>
      
      <h4>5. Asynchronous Processing and Event-Driven Architectures</h4>
      <p>For long-running or resource-intensive operations, implement asynchronous processing using message queues (e.g., Kafka, RabbitMQ). Embrace event-driven architectures to decouple services and improve responsiveness and scalability.</p>
      
      <h3>Monitoring, Security, and Documentation</h3>
      <p>Comprehensive API monitoring (performance, errors, usage), robust security measures (OAuth 2.0, OpenID Connect, API Gateway security), and clear, interactive documentation (e.g., Swagger UI) are non-negotiable for API success and widespread developer adoption in 2025.</p>
    `,
    publishDate: new Date('2025-05-25'),
    author: "NosytLabs Team",
    authorRole: "Backend Architecture Team",
    tags: ["API Design", "Backend Development", "Scalability", "Architecture", "RESTful API", "Caching", "Rate Limiting", "API Versioning", "Microservices", "GraphQL", "gRPC", "Event-Driven Architecture", "API Security"],
    category: "Development",
    featuredImage: "/images/blog/api-design.jpg",
    readingTime: "10 min read",
    metadata: {
      title: "Building Scalable APIs: Design Patterns & Best Practices for 2025 | NosytLabs",
      description: "Learn essential patterns for building APIs that scale in 2025. Covers API-first design, microservices, advanced caching, rate limiting, and security best practices.",
      keywords: ["API design 2025", "scalable APIs", "REST API", "backend development", "API best practices", "microservices", "GraphQL", "gRPC", "API security", "event-driven architecture"]
    },
    relatedPosts: ["future-of-web-development", "web-performance-optimization", "ai-trends-2025"]
  }
];

// Helper functions for blog data
export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

export const getBlogPostsByCategory = (category: string): BlogPost[] => {
  return blogPosts.filter(post => post.category === category);
};

export const getBlogPostsByTag = (tag: string): BlogPost[] => {
  return blogPosts.filter(post => post.tags.includes(tag));
};

export const getFeaturedBlogPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.featured);
};

export const getRecentBlogPosts = (limit: number = 5): BlogPost[] => {
  return blogPosts
    .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime())
    .slice(0, limit);
};

export const getRelatedPosts = (currentSlug: string, limit: number = 3): BlogPost[] => {
  const currentPost = getBlogPostBySlug(currentSlug);
  if (!currentPost) return [];

  // Get posts with related slugs first
  let relatedPosts: BlogPost[] = [];
  
  if (currentPost.relatedPosts) {
    relatedPosts = currentPost.relatedPosts
      .map(slug => getBlogPostBySlug(slug))
      .filter(Boolean) as BlogPost[];
  }

  // If we need more posts, get posts from the same category
  if (relatedPosts.length < limit) {
    const categoryPosts = getBlogPostsByCategory(currentPost.category)
      .filter(post => post.slug !== currentSlug && !relatedPosts.includes(post))
      .slice(0, limit - relatedPosts.length);
    
    relatedPosts = [...relatedPosts, ...categoryPosts];
  }

  // If we still need more, get posts with similar tags
  if (relatedPosts.length < limit) {
    const tagPosts = blogPosts
      .filter(post => 
        post.slug !== currentSlug && 
        !relatedPosts.includes(post) &&
        post.tags.some(tag => currentPost.tags.includes(tag))
      )
      .slice(0, limit - relatedPosts.length);
    
    relatedPosts = [...relatedPosts, ...tagPosts];
  }

  return relatedPosts.slice(0, limit);
};

export const getAllBlogCategories = (): Array<{ name: string; slug: string; count: number }> => {
  const categoryNames = [...new Set(blogPosts.map(post => post.category))];
  
  const categories = categoryNames.map(name => ({
    name,
    slug: generateSlug(name),
    count: getBlogPostsByCategory(name).length
  }));
  
  return categories;
};

export const getAllBlogTags = (): string[] => {
  const tags = [...new Set(blogPosts.flatMap(post => post.tags))];
  return tags;
};

export const getAllBlogTagsWithMetadata = (): Array<{ name: string; slug: string; count: number }> => {
  const tagNames = [...new Set(blogPosts.flatMap(post => post.tags))];
  
  const tags = tagNames.map(name => ({
    name,
    slug: generateSlug(name),
    count: getBlogPostsByTag(name).length
  }));
  
  return tags;
};

export const getBlogPostsWithPagination = (page: number = 1, postsPerPage: number = 6) => {
  const sortedPosts = blogPosts.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  const totalPosts = sortedPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (page - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  
  return {
    posts: sortedPosts.slice(startIndex, endIndex),
    pagination: {
      currentPage: page,
      totalPages,
      totalPosts,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null
    }
  };
};