/**
 * Blog Utilities for NOSYT Labs
 * Provides functions for blog post processing and related content
 */

import type { CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

/**
 * Calculate reading time for a blog post
 * @param content - The markdown content of the blog post
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string): number {
  // Average reading speed: 200-250 words per minute
  // We'll use 225 as a middle ground
  const wordsPerMinute = 225;

  // Remove markdown syntax and count words
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/`[^`]*`/g, "") // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
    .replace(/\[.*?\]\(.*?\)/g, "") // Remove links
    .replace(/[#*_~]/g, "") // Remove markdown formatting
    .trim();

  const wordCount = cleanContent.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  return Math.max(1, readingTime); // Minimum 1 minute
}

/**
 * Get related blog posts based on shared tags
 * @param currentPost - The current blog post
 * @param allPosts - All available blog posts
 * @param limit - Maximum number of related posts to return
 * @returns Array of related blog posts
 */
export function getRelatedPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit: number = 3,
): BlogPost[] {
  const currentTags = currentPost.data.tags || [];

  if (currentTags.length === 0) {
    // If no tags, return most recent posts
    return allPosts
      .filter((post) => post.slug !== currentPost.slug)
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .slice(0, limit);
  }

  // Calculate relevance score for each post
  const postsWithScores = allPosts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => {
      const postTags = post.data.tags || [];
      const sharedTags = postTags.filter((tag: string) =>
        currentTags.includes(tag),
      );
      const score = sharedTags.length;

      return { post, score };
    })
    .filter((item) => item.score > 0) // Only posts with at least one shared tag
    .sort((a, b) => {
      // Sort by score first, then by date
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf();
    });

  // If we don't have enough related posts, fill with recent posts
  const relatedPosts = postsWithScores.slice(0, limit).map((item) => item.post);

  if (relatedPosts.length < limit) {
    const recentPosts = allPosts
      .filter(
        (post) =>
          post.slug !== currentPost.slug &&
          !relatedPosts.some((rp) => rp.slug === post.slug),
      )
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .slice(0, limit - relatedPosts.length);

    relatedPosts.push(...recentPosts);
  }

  return relatedPosts;
}

// Import formatDate from shared-utils unified date utilities
import { formatDate } from "@shared-utils/unified-date-utils";

// Re-export for backward compatibility
export { formatDate };

/**
 * Get unique tags from all blog posts
 * @param posts - Array of blog posts
 * @returns Array of unique tags sorted alphabetically
 */
export function getAllTags(posts: BlogPost[]): string[] {
  const tagSet = new Set<string>();

  posts.forEach((post) => {
    const tags = post.data.tags || [];
    tags.forEach((tag: string) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}

/**
 * Filter posts by tag
 * @param posts - Array of blog posts
 * @param tag - Tag to filter by
 * @returns Filtered array of blog posts
 */
export function filterPostsByTag(posts: BlogPost[], tag: string): BlogPost[] {
  return posts.filter((post) => {
    const tags = post.data.tags || [];
    return tags.includes(tag);
  });
}

/**
 * Get featured blog posts
 * @param posts - Array of blog posts
 * @param limit - Maximum number of featured posts to return
 * @returns Array of featured blog posts
 */
export function getFeaturedPosts(
  posts: BlogPost[],
  limit: number = 3,
): BlogPost[] {
  return posts
    .filter((post) => post.data.featured === true)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .slice(0, limit);
}

/**
 * Generate excerpt from content if not provided
 * @param content - The markdown content
 * @param maxLength - Maximum length of excerpt
 * @returns Excerpt string
 */
export function generateExcerpt(
  content: string,
  maxLength: number = 160,
): string {
  // Remove markdown syntax
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[.*?\]\((.*?)\)/g, "$1")
    .replace(/[#*_~]/g, "")
    .trim();

  // Get first paragraph or first maxLength characters
  const firstParagraph = cleanContent.split("\n\n")[0];

  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }

  return firstParagraph.substring(0, maxLength).trim() + "...";
}

/**
 * Sort posts by date (newest first)
 * @param posts - Array of blog posts
 * @returns Sorted array of blog posts
 */
export function sortPostsByDate(posts: BlogPost[]): BlogPost[] {
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

/**
 * Get posts by category
 * @param posts - Array of blog posts
 * @param category - Category to filter by
 * @returns Filtered array of blog posts
 */
export function getPostsByCategory(
  posts: BlogPost[],
  category: string,
): BlogPost[] {
  return posts.filter((post) => post.data.category === category);
}
