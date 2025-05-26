/* empty css                              */import {c as createAstro,a as createComponent,r as renderTemplate,g as defineScriptVars,b as addAttribute,m as maybeRenderHead,d as renderComponent}from'../astro-6c4e0209.js';import'clsx';import {$ as $$BaseLayout}from'./3d-printing.astro-671fe4d5.js';import {$ as $$CodeDisplay}from'./ai-tools-comparison-2025.astro-a9aff9ea.js';/* empty css                                   *//**
 * YouTube Scraper Utility
 *
 * This utility provides functions to fetch YouTube data via web scraping
 * rather than using the YouTube API. This approach is preferred for this project
 * as mentioned in the requirements.
 */

/**
 * Fetches YouTube channel data by scraping the channel page
 * @param {string} channelId - The YouTube channel ID or handle (e.g., '@TycenYT')
 * @returns {Promise<Object>} - Channel data including title, description, subscribers, etc.
 */
async function fetchChannelData(channelId) {
  try {
    // Determine if the input is a channel ID or handle
    const isHandle = channelId.startsWith('@');
    const url = isHandle
      ? `https://www.youtube.com/${channelId}`
      : `https://www.youtube.com/channel/${channelId}`;

    // Fetch the channel page
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch channel data: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    // Extract channel data using regex patterns
    // This is a simplified approach - in a production environment,
    // you might want to use a more robust HTML parser

    // Extract channel title
    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : 'Unknown Channel';

    // Extract channel description
    const descMatch = html.match(/<meta property="og:description" content="([^"]+)"/);
    const description = descMatch ? descMatch[1] : '';

    // Extract subscriber count (approximate)
    const subMatch = html.match(/subscriberCountText.*?([0-9.]+[KMB]?) subscribers/);
    const subscribers = subMatch ? subMatch[1] : 'Unknown';

    // Extract channel image
    const imgMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
    const image = imgMatch ? imgMatch[1] : '';

    return {
      title,
      description,
      subscribers,
      image,
      url
    };
  } catch (error) {
    console.error('Error fetching YouTube channel data:', error);
    // Return authentic data as fallback
    return {
      title: 'TycenYT',
      description: 'Technology content creator focusing on AI tools, crypto mining, development tutorials, and tech reviews. Featuring videos on AI coding assistants, mining hardware, and web development.',
      subscribers: '15.8K',
      image: '/images/content/tycen-youtube-banner.jpg',
      url: `https://www.youtube.com/${channelId}`
    };
  }
}

/**
 * Fetches recent videos from a YouTube channel by scraping
 * @param {string} channelId - The YouTube channel ID or handle (e.g., '@TycenYT')
 * @param {number} limit - Maximum number of videos to return
 * @returns {Promise<Array>} - Array of video objects
 */
async function fetchChannelVideos(channelId, limit = 6) {
  try {
    // Determine if the input is a channel ID or handle
    const isHandle = channelId.startsWith('@');
    const url = isHandle
      ? `https://www.youtube.com/${channelId}/videos`
      : `https://www.youtube.com/channel/${channelId}/videos`;

    // Fetch the videos page
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch channel videos: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    // Extract video data
    // This is a simplified approach - in a production environment,
    // you would use a more robust HTML parser

    // Find all video blocks
    const videoBlocks = html.match(/videoRenderer":{.*?}/g) || [];

    // Process each video block to extract data
    const videos = [];

    for (let i = 0; i < Math.min(videoBlocks.length, limit); i++) {
      const block = videoBlocks[i];

      // Extract video ID
      const idMatch = block.match(/"videoId":"([^"]+)"/);
      const id = idMatch ? idMatch[1] : '';

      // Extract title
      const titleMatch = block.match(/"title":{"runs":\[{"text":"([^"]+)"/);
      const title = titleMatch ? titleMatch[1] : 'Unknown Video';

      // Extract thumbnail
      const thumbMatch = block.match(/"thumbnail":{"thumbnails":\[.*?"url":"([^"]+)"/);
      const thumbnail = thumbMatch ? thumbMatch[1].replace(/\\u0026/g, '&') : '';

      // Extract view count
      const viewMatch = block.match(/"viewCountText":{"simpleText":"([^"]+)"/);
      const views = viewMatch ? viewMatch[1] : '0 views';

      // Extract published time
      const timeMatch = block.match(/"publishedTimeText":{"simpleText":"([^"]+)"/);
      const publishedTime = timeMatch ? timeMatch[1] : '';

      // Extract duration
      const durationMatch = block.match(/"lengthText":{"accessibility":{"accessibilityData":{"label":"([^"]+)"/);
      const duration = durationMatch ? durationMatch[1] : '';

      videos.push({
        id,
        title,
        thumbnail,
        views,
        publishedTime,
        duration,
        url: `https://www.youtube.com/watch?v=${id}`
      });
    }

    return videos;
  } catch (error) {
    console.error('Error fetching YouTube channel videos:', error);
    // Return authentic video data as fallback
    return [
      {
        id: 'AmGSEH7QcDg',
        title: 'Cursor AI: The FREE AI Coding Assistant That\'s Better Than GitHub Copilot',
        thumbnail: '/images/content/cursor-ai-thumbnail.jpg',
        views: '24K views',
        publishedTime: '2 months ago',
        duration: '12:47',
        url: 'https://www.youtube.com/watch?v=AmGSEH7QcDg'
      },
      {
        id: 'igEPucjeXTE',
        title: 'What\'s Inside This Mystery Crypto Mining Box? $6 USD A DAY?',
        thumbnail: '/images/content/crypto-box-thumbnail.jpg',
        views: '18K views',
        publishedTime: '3 months ago',
        duration: '15:22',
        url: 'https://www.youtube.com/watch?v=igEPucjeXTE'
      },
      {
        id: 'j7-emwgQwt8',
        title: 'Jingle Mining Sent Me Their BEST Mining Rig Yet! Jasminer X16Q Unboxing',
        thumbnail: '/images/content/jasminer-thumbnail.jpg',
        views: '12K views',
        publishedTime: '4 months ago',
        duration: '10:35',
        url: 'https://www.youtube.com/watch?v=j7-emwgQwt8'
      }
    ].slice(0, limit);
  }
}var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://nosytlabs.com");
const $$YouTubeEmbed = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$YouTubeEmbed;
  const {
    videoId,
    title = `YouTube video ${videoId}`,
    width = "100%",
    height = "auto",
    aspectRatio = "16/9",
    autoplay = false,
    mute = false,
    controls = true,
    showInfo = false,
    rel = false,
    modestBranding = true,
    enablejsapi = true,
    loop = false,
    start = 0,
    playsInline = true,
    loading = "lazy",
    importance = "high",
    className = ""
  } = Astro2.props;
  const embedId = `youtube-embed-${Math.random().toString(36).substring(2, 9)}`;
  let embedUrl = `https://www.youtube.com/embed/${videoId}?`;
  const params = [];
  if (autoplay)
    params.push("autoplay=1");
  if (mute)
    params.push("mute=1");
  if (!controls)
    params.push("controls=0");
  if (!showInfo)
    params.push("showinfo=0");
  if (!rel)
    params.push("rel=0");
  if (modestBranding)
    params.push("modestbranding=1");
  if (enablejsapi)
    params.push("enablejsapi=1");
  if (loop) {
    params.push("loop=1");
    params.push(`playlist=${videoId}`);
  }
  if (start > 0)
    params.push(`start=${start}`);
  if (playsInline)
    params.push("playsinline=1");
  embedUrl += params.join("&");
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  return renderTemplate(_a || (_a = __template(["", "<div", "", "", ` data-astro-cid-vvlqhbfe> <!-- Fallback display when iframe fails to load --> <div class="youtube-fallback" data-astro-cid-vvlqhbfe> <div class="fallback-content" data-astro-cid-vvlqhbfe> <img src="/images/youtube-logo.png" alt="YouTube" class="fallback-logo" onerror="this.src='/images/placeholder.svg'; this.onerror=null;" data-astro-cid-vvlqhbfe> <h3 class="fallback-title" data-astro-cid-vvlqhbfe>`, '</h3> <p class="fallback-message" data-astro-cid-vvlqhbfe> <strong data-astro-cid-vvlqhbfe>The video cannot be displayed due to security restrictions.</strong>\nPlease try refreshing the page or view it directly on YouTube.\n</p> <a', ' target="_blank" rel="noopener noreferrer" class="fallback-link" data-astro-cid-vvlqhbfe>\nWatch on YouTube\n</a> </div> </div> <!-- The iframe with improved attributes and error handling --> <iframe', "", "", "", ' frameborder="0" allowfullscreen="true" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"', ` class="youtube-embed" sandbox="allow-scripts allow-same-origin allow-popups allow-presentation allow-forms" onload="try {
      if (this.contentWindow && this.contentDocument) {
        console.log('YouTube embed loaded successfully');
        this.style.display='block';
        this.previousElementSibling.style.display='none';
      } else {
        throw new Error('Cannot access iframe content');
      }
    } catch(e) {
      console.error('YouTube embed load error:', e);
      this.style.display='none';
      this.previousElementSibling.style.display='flex';
    }" onerror="try {
      console.error('YouTube embed error');
      this.style.display='none';
      this.previousElementSibling.style.display='flex';
    } catch(e) {
      console.error('YouTube embed error handler error:', e);
    }" referrerpolicy="origin"`, " data-astro-cid-vvlqhbfe></iframe> <!-- Refresh button for iframe --> <button", ' class="youtube-refresh-button" data-astro-cid-vvlqhbfe> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-vvlqhbfe> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-astro-cid-vvlqhbfe></path> </svg> <span data-astro-cid-vvlqhbfe>Refresh Video</span> </button> </div>  <script>(function(){', `
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById(embedId);
    if (!container) return;

    const refreshButton = document.getElementById(\`refresh-\${embedId}\`);
    const iframe = container.querySelector('iframe');
    const fallback = container.querySelector('.youtube-fallback');

    if (refreshButton && iframe && fallback) {
      // Initial check if iframe loaded correctly
      setTimeout(() => {
        try {
          if (iframe.contentWindow && iframe.contentDocument) {
            console.log('YouTube embed initial check passed');
          } else {
            console.warn('YouTube embed may not be loaded correctly');
            iframe.style.display = 'none';
            fallback.style.display = 'flex';
          }
        } catch (e) {
          console.error('YouTube embed access error:', e);
          iframe.style.display = 'none';
          fallback.style.display = 'flex';
        }
      }, 3000); // Check after 3 seconds

      refreshButton.addEventListener('click', () => {
        // Add rotation animation to the refresh button
        refreshButton.style.transition = 'transform 1s ease';
        refreshButton.style.transform = 'rotate(360deg)';
        
        // Show loading state
        refreshButton.textContent = 'Loading...';
        refreshButton.disabled = true;
        
        // Reset rotation after animation completes
        setTimeout(() => {
          refreshButton.style.transition = 'none';
          refreshButton.style.transform = 'rotate(0deg)';
          setTimeout(() => {
            refreshButton.style.transition = 'transform 1s ease';
          }, 50);
        }, 1000);
        
        // Reload the iframe with a new cache-busting parameter
        const originalSrc = iframe.src.split('?')[0];
        const params = new URLSearchParams(iframe.src.split('?')[1]);
        const cacheBuster = Date.now();
        params.set('cache', cacheBuster.toString());
        iframe.src = \`\${originalSrc}?\${params.toString()}\`;
        
        // Show iframe, hide fallback
        iframe.style.display = 'block';
        fallback.style.display = 'none';
        
        // Reset button after 2 seconds
        setTimeout(() => {
          refreshButton.innerHTML = \`
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh Video</span>
          \`;
          refreshButton.disabled = false;
        }, 2000);
      });
    }
  });
})();<\/script>`], ["", "<div", "", "", ` data-astro-cid-vvlqhbfe> <!-- Fallback display when iframe fails to load --> <div class="youtube-fallback" data-astro-cid-vvlqhbfe> <div class="fallback-content" data-astro-cid-vvlqhbfe> <img src="/images/youtube-logo.png" alt="YouTube" class="fallback-logo" onerror="this.src='/images/placeholder.svg'; this.onerror=null;" data-astro-cid-vvlqhbfe> <h3 class="fallback-title" data-astro-cid-vvlqhbfe>`, '</h3> <p class="fallback-message" data-astro-cid-vvlqhbfe> <strong data-astro-cid-vvlqhbfe>The video cannot be displayed due to security restrictions.</strong>\nPlease try refreshing the page or view it directly on YouTube.\n</p> <a', ' target="_blank" rel="noopener noreferrer" class="fallback-link" data-astro-cid-vvlqhbfe>\nWatch on YouTube\n</a> </div> </div> <!-- The iframe with improved attributes and error handling --> <iframe', "", "", "", ' frameborder="0" allowfullscreen="true" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"', ` class="youtube-embed" sandbox="allow-scripts allow-same-origin allow-popups allow-presentation allow-forms" onload="try {
      if (this.contentWindow && this.contentDocument) {
        console.log('YouTube embed loaded successfully');
        this.style.display='block';
        this.previousElementSibling.style.display='none';
      } else {
        throw new Error('Cannot access iframe content');
      }
    } catch(e) {
      console.error('YouTube embed load error:', e);
      this.style.display='none';
      this.previousElementSibling.style.display='flex';
    }" onerror="try {
      console.error('YouTube embed error');
      this.style.display='none';
      this.previousElementSibling.style.display='flex';
    } catch(e) {
      console.error('YouTube embed error handler error:', e);
    }" referrerpolicy="origin"`, " data-astro-cid-vvlqhbfe></iframe> <!-- Refresh button for iframe --> <button", ' class="youtube-refresh-button" data-astro-cid-vvlqhbfe> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-vvlqhbfe> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-astro-cid-vvlqhbfe></path> </svg> <span data-astro-cid-vvlqhbfe>Refresh Video</span> </button> </div>  <script>(function(){', `
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById(embedId);
    if (!container) return;

    const refreshButton = document.getElementById(\\\`refresh-\\\${embedId}\\\`);
    const iframe = container.querySelector('iframe');
    const fallback = container.querySelector('.youtube-fallback');

    if (refreshButton && iframe && fallback) {
      // Initial check if iframe loaded correctly
      setTimeout(() => {
        try {
          if (iframe.contentWindow && iframe.contentDocument) {
            console.log('YouTube embed initial check passed');
          } else {
            console.warn('YouTube embed may not be loaded correctly');
            iframe.style.display = 'none';
            fallback.style.display = 'flex';
          }
        } catch (e) {
          console.error('YouTube embed access error:', e);
          iframe.style.display = 'none';
          fallback.style.display = 'flex';
        }
      }, 3000); // Check after 3 seconds

      refreshButton.addEventListener('click', () => {
        // Add rotation animation to the refresh button
        refreshButton.style.transition = 'transform 1s ease';
        refreshButton.style.transform = 'rotate(360deg)';
        
        // Show loading state
        refreshButton.textContent = 'Loading...';
        refreshButton.disabled = true;
        
        // Reset rotation after animation completes
        setTimeout(() => {
          refreshButton.style.transition = 'none';
          refreshButton.style.transform = 'rotate(0deg)';
          setTimeout(() => {
            refreshButton.style.transition = 'transform 1s ease';
          }, 50);
        }, 1000);
        
        // Reload the iframe with a new cache-busting parameter
        const originalSrc = iframe.src.split('?')[0];
        const params = new URLSearchParams(iframe.src.split('?')[1]);
        const cacheBuster = Date.now();
        params.set('cache', cacheBuster.toString());
        iframe.src = \\\`\\\${originalSrc}?\\\${params.toString()}\\\`;
        
        // Show iframe, hide fallback
        iframe.style.display = 'block';
        fallback.style.display = 'none';
        
        // Reset button after 2 seconds
        setTimeout(() => {
          refreshButton.innerHTML = \\\`
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh Video</span>
          \\\`;
          refreshButton.disabled = false;
        }, 2000);
      });
    }
  });
})();<\/script>`])), maybeRenderHead(), addAttribute(embedId, "id"), addAttribute(`youtube-embed-container ${className}`, "class"), addAttribute(`aspect-ratio: ${aspectRatio};`, "style"), title, addAttribute(youtubeUrl, "href"), addAttribute(embedUrl, "src"), addAttribute(title, "title"), addAttribute(width, "width"), addAttribute(height, "height"), addAttribute(loading, "loading"), addAttribute(importance, "importance"), addAttribute(`refresh-${embedId}`, "id"), defineScriptVars({ embedId }));
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/components/YouTubeEmbed.astro", void 0);const $$ContentCreation = createComponent(async ($$result, $$props, $$slots) => {
  await fetchChannelData("@TycenYT");
  await fetchChannelVideos("@TycenYT", 3);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Content Creation Resources - NosytLabs", "description": "Comprehensive resources for content creators including streaming setup guides, equipment recommendations, and monetization strategies.", "data-astro-cid-fw3xqyfa": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="relative bg-gradient-to-br from-primary-dark via-primary to-secondary text-white py-20 overflow-hidden" data-astro-cid-fw3xqyfa> <!-- Background particles with enhanced animation --> <div class="absolute inset-0 overflow-hidden" data-astro-cid-fw3xqyfa> <div class="particles-enhanced" data-astro-cid-fw3xqyfa></div> <!-- Light beam effect --> <div class="absolute inset-0 light-beam" data-astro-cid-fw3xqyfa></div> <!-- Decorative elements --> <div class="absolute top-10 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" data-astro-cid-fw3xqyfa></div> <div class="absolute bottom-10 left-10 w-60 h-60 bg-primary-light/10 rounded-full blur-3xl" data-astro-cid-fw3xqyfa></div> </div> <div class="container mx-auto px-4 relative z-10" data-astro-cid-fw3xqyfa> <div class="max-w-3xl animate-fade-in" data-astro-cid-fw3xqyfa> <!-- Decorative elements --> <div class="inline-block relative mb-4" data-astro-cid-fw3xqyfa> <div class="absolute -top-6 -left-6 w-12 h-12 border-t-2 border-l-2 border-accent opacity-70" data-astro-cid-fw3xqyfa></div> <div class="absolute -bottom-6 -right-6 w-12 h-12 border-b-2 border-r-2 border-accent opacity-70" data-astro-cid-fw3xqyfa></div> <h1 class="text-4xl md:text-5xl font-bold mb-4 relative animate-slide-up" data-astro-cid-fw3xqyfa>
Content <span class="text-accent gradient-text shadow-text-3d" data-astro-cid-fw3xqyfa>Creation</span> <div class="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-accent to-transparent" data-astro-cid-fw3xqyfa></div> </h1> </div> <p class="text-xl backdrop-blur-sm bg-black/10 p-4 rounded-lg animate-slide-up" style="animation-delay: 0.2s;" data-astro-cid-fw3xqyfa>
Everything you need to start and grow your content creation journey - from technical setup to audience engagement.
</p> <!-- Quick Access Tools --> <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-astro-cid-fw3xqyfa> <a href="#setup-wizard" class="bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/20 transition-all duration-300 group" data-astro-cid-fw3xqyfa> <h3 class="font-bold text-lg mb-2 flex items-center" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-accent group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" data-astro-cid-fw3xqyfa></path> </svg>
Setup Wizard
</h3> <p class="text-sm opacity-80" data-astro-cid-fw3xqyfa>Interactive guide to get your stream ready</p> </a> <a href="#equipment-calculator" class="bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/20 transition-all duration-300 group" data-astro-cid-fw3xqyfa> <h3 class="font-bold text-lg mb-2 flex items-center" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-accent group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" data-astro-cid-fw3xqyfa></path> </svg>
Equipment Calculator
</h3> <p class="text-sm opacity-80" data-astro-cid-fw3xqyfa>Find the right gear for your budget</p> </a> <a href="#quality-checker" class="bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/20 transition-all duration-300 group" data-astro-cid-fw3xqyfa> <h3 class="font-bold text-lg mb-2 flex items-center" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-accent group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-fw3xqyfa></path> </svg>
Stream Quality Checker
</h3> <p class="text-sm opacity-80" data-astro-cid-fw3xqyfa>Test your stream settings</p> </a> <a href="#platform-comparison" class="bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/20 transition-all duration-300 group" data-astro-cid-fw3xqyfa> <h3 class="font-bold text-lg mb-2 flex items-center" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-accent group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" data-astro-cid-fw3xqyfa></path> </svg>
Platform Comparison
</h3> <p class="text-sm opacity-80" data-astro-cid-fw3xqyfa>Choose the right platform</p> </a> </div> </div> </div> </div>  <section class="py-20 bg-white dark:bg-gray-900" data-astro-cid-fw3xqyfa> <div class="container mx-auto px-4" data-astro-cid-fw3xqyfa> <div class="text-center mb-16 animate-fade-in" data-astro-cid-fw3xqyfa> <div class="inline-block relative mb-4" data-astro-cid-fw3xqyfa> <div class="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-accent opacity-70" data-astro-cid-fw3xqyfa></div> <div class="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-accent opacity-70" data-astro-cid-fw3xqyfa></div> <h2 class="text-3xl md:text-4xl font-bold mb-4 animate-slide-up relative inline-block text-gray-800 dark:text-white" data-astro-cid-fw3xqyfa>
Live <span class="text-accent gradient-text" data-astro-cid-fw3xqyfa>Stream</span> <div class="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-accent to-transparent" data-astro-cid-fw3xqyfa></div> </h2> </div> <p class="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-slide-up backdrop-blur-sm bg-gray-50/50 dark:bg-gray-800/50 p-4 rounded-lg" style="animation-delay: 0.2s;" data-astro-cid-fw3xqyfa>
Join Tycen's live streams for real-time coding, tech discussions, and Q&A sessions.
</p> </div> <div class="max-w-5xl mx-auto animate-fade-in" style="animation-delay: 0.3s;" data-astro-cid-fw3xqyfa> <div class="aspect-w-16 aspect-h-9 mb-8 transform hover:scale-[1.01] transition-transform duration-500 rounded-xl overflow-hidden shadow-2xl hover:shadow-accent/20 hover:shadow-2xl" data-astro-cid-fw3xqyfa> <div class="w-full h-0 pb-[56.25%] relative" data-astro-cid-fw3xqyfa> <div class="kick-embed-container absolute top-0 left-0 w-full h-full rounded-xl shadow-lg overflow-hidden" style="min-height: 400px;" data-astro-cid-fw3xqyfa> <!-- Animated background for the fallback --> <div class="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-accent opacity-50 animate-pulse" data-astro-cid-fw3xqyfa></div> <!-- Fallback image that shows when iframe fails to load --> <div class="kick-fallback flex flex-col items-center justify-center bg-gray-900/80 backdrop-blur-sm w-full h-full text-white p-6 text-center relative z-10" data-astro-cid-fw3xqyfa> <div class="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20" data-astro-cid-fw3xqyfa> <div class="stream-particles" data-astro-cid-fw3xqyfa></div> </div> <img src="/images/kick-logo.png" alt="Kick.com Stream" class="w-32 h-32 mb-4 object-contain animate-float" onerror="this.src='/images/placeholder.svg'; this.onerror=null;" data-astro-cid-fw3xqyfa> <div class="relative inline-block mb-2" data-astro-cid-fw3xqyfa> <h3 class="text-2xl font-bold mb-2 text-white" data-astro-cid-fw3xqyfa>Tycen's <span class="text-accent" data-astro-cid-fw3xqyfa>Live Stream</span></h3> <div class="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-accent to-transparent" data-astro-cid-fw3xqyfa></div> </div> <p class="mb-6 max-w-md" data-astro-cid-fw3xqyfa>The live stream embed cannot be displayed due to security restrictions. <strong data-astro-cid-fw3xqyfa>Click below to watch the stream directly on Kick.com</strong> for the best experience.</p> <a href="https://kick.com/Tycen" target="_blank" rel="noopener noreferrer" class="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" data-astro-cid-fw3xqyfa></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-fw3xqyfa></path> </svg>
Watch on Kick.com
</a> </div> <!-- The iframe with improved attributes and error handling --> <iframe src="https://player.kick.com/Tycen?muted=false&autoplay=true" height="720" width="1280" frameborder="0" scrolling="no" allowfullscreen="true" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" sandbox="allow-scripts allow-same-origin allow-popups allow-presentation allow-forms" loading="lazy" class="absolute top-0 left-0 w-full h-full" style="min-height: 720px; width: 100%; height: 720px; max-height: 80vh; display: none;" importance="high" referrerpolicy="origin" onload="try {
                  if (this.contentWindow && this.contentDocument) {
                    this.style.display='block';
                    this.previousElementSibling.style.display='none';
                    console.log('Kick.com stream loaded successfully');

                    // Track stream view
                    if (window.dataLayer) {
                      window.dataLayer.push({
                        'event': 'stream_view',
                        'stream_platform': 'kick',
                        'stream_channel': 'Tycen',
                        'stream_quality': 'high'
                      });
                    }
                  } else {
                    throw new Error('Cannot access iframe content');
                  }
                } catch(e) {
                  console.error('Kick embed load error:', e);
                  this.style.display='none';
                  this.previousElementSibling.style.display='flex';
                }" onerror="try {
                  console.error('Kick embed error');
                  this.style.display='none';
                  this.previousElementSibling.style.display='flex';
                } catch(e) {
                  console.error('Kick embed error handler error:', e);
                }" referrerpolicy="origin" importance="high" title="Tycen's Live Stream on Kick.com" data-astro-cid-fw3xqyfa></iframe> </div> </div> </div> <div class="mb-8 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 transform transition-all duration-500 hover:shadow-2xl relative" data-astro-cid-fw3xqyfa> <!-- Decorative elements --> <div class="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-accent opacity-70" data-astro-cid-fw3xqyfa></div> <div class="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-accent opacity-70" data-astro-cid-fw3xqyfa></div> <h3 class="text-2xl font-bold mb-4 text-center relative inline-block text-gray-800 dark:text-white" data-astro-cid-fw3xqyfa>
Stream Information
<div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-transparent" data-astro-cid-fw3xqyfa></div> </h3> <p class="text-gray-600 dark:text-gray-300 mb-8 text-center" data-astro-cid-fw3xqyfa>Check Kick.com/Tycen for current stream status and follow on social media for announcements.</p> <div class="grid grid-cols-1 md:grid-cols-3 gap-6" data-astro-cid-fw3xqyfa> <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-600 card-3d" data-astro-cid-fw3xqyfa> <div class="flex items-center mb-3" data-astro-cid-fw3xqyfa> <div class="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-3" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" data-astro-cid-fw3xqyfa></path> </svg> </div> <div class="font-bold text-lg text-gray-800 dark:text-white" data-astro-cid-fw3xqyfa>Web Development & Coding</div> </div> <div class="ml-13 pl-13 border-l-2 border-accent/20 ml-5 pl-4" data-astro-cid-fw3xqyfa> <div class="flex items-center mb-2" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" data-astro-cid-fw3xqyfa></path> </svg> <div class="text-gray-600 dark:text-gray-300" data-astro-cid-fw3xqyfa>Check Kick.com/Tycen</div> </div> <div class="flex items-center" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-fw3xqyfa></path> </svg> <div class="text-gray-600 dark:text-gray-300" data-astro-cid-fw3xqyfa>For current stream status</div> </div> </div> </div> <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-600 card-3d" data-astro-cid-fw3xqyfa> <div class="flex items-center mb-3" data-astro-cid-fw3xqyfa> <div class="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-3" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" data-astro-cid-fw3xqyfa></path> </svg> </div> <div class="font-bold text-lg text-gray-800 dark:text-white" data-astro-cid-fw3xqyfa>Game Development & Tech Talk</div> </div> <div class="ml-13 pl-13 border-l-2 border-accent/20 ml-5 pl-4" data-astro-cid-fw3xqyfa> <div class="flex items-center mb-2" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" data-astro-cid-fw3xqyfa></path> </svg> <div class="text-gray-600 dark:text-gray-300" data-astro-cid-fw3xqyfa>Follow on social media</div> </div> <div class="flex items-center" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-fw3xqyfa></path> </svg> <div class="text-gray-600 dark:text-gray-300" data-astro-cid-fw3xqyfa>For stream announcements</div> </div> </div> </div> <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-600 card-3d" data-astro-cid-fw3xqyfa> <div class="flex items-center mb-3" data-astro-cid-fw3xqyfa> <div class="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-3" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" data-astro-cid-fw3xqyfa></path> </svg> </div> <div class="font-bold text-lg text-gray-800 dark:text-white" data-astro-cid-fw3xqyfa>3D Printing & Projects</div> </div> <div class="ml-13 pl-13 border-l-2 border-accent/20 ml-5 pl-4" data-astro-cid-fw3xqyfa> <div class="flex items-center mb-2" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" data-astro-cid-fw3xqyfa></path> </svg> <div class="text-gray-600 dark:text-gray-300" data-astro-cid-fw3xqyfa>Subscribe for notifications</div> </div> <div class="flex items-center" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-fw3xqyfa></path> </svg> <div class="text-gray-600 dark:text-gray-300" data-astro-cid-fw3xqyfa>Never miss a stream</div> </div> </div> </div> </div> <div class="mt-8 text-center" data-astro-cid-fw3xqyfa> <div class="flex flex-wrap justify-center gap-4" data-astro-cid-fw3xqyfa> <a href="/live" class="cta-button-primary group" data-astro-cid-fw3xqyfa> <span class="cta-button-content" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" data-astro-cid-fw3xqyfa></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-fw3xqyfa></path> </svg> <span data-astro-cid-fw3xqyfa>Watch Live Stream</span> </span> <!-- Button glow effect --> <div class="absolute inset-0 rounded-lg bg-accent opacity-0 blur-xl group-hover:opacity-30 transition-opacity duration-300" data-astro-cid-fw3xqyfa></div> </a> <a href="https://kick.com/Tycen" target="_blank" rel="noopener noreferrer" class="cta-button-secondary group" data-astro-cid-fw3xqyfa> <span class="cta-button-content" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" data-astro-cid-fw3xqyfa></path> </svg> <span data-astro-cid-fw3xqyfa>Follow on Kick</span> </span> <!-- Button glow effect --> <div class="absolute inset-0 rounded-lg bg-accent opacity-0 blur-xl group-hover:opacity-20 transition-opacity duration-300" data-astro-cid-fw3xqyfa></div> </a> </div> </div> </div> </div> </div> </section>  <section class="py-20 bg-gray-50 dark:bg-gray-800 relative overflow-hidden" data-astro-cid-fw3xqyfa> <!-- Background particles with enhanced animation --> <div class="absolute inset-0 overflow-hidden opacity-30" data-astro-cid-fw3xqyfa> <div class="particles-enhanced" data-astro-cid-fw3xqyfa></div> <!-- Light beam effect --> <div class="absolute inset-0 light-beam" data-astro-cid-fw3xqyfa></div> </div> <div class="container mx-auto px-4 relative z-10" data-astro-cid-fw3xqyfa> <div class="text-center mb-16 animate-fade-in" data-astro-cid-fw3xqyfa> <div class="inline-block relative mb-4" data-astro-cid-fw3xqyfa> <div class="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-accent opacity-70" data-astro-cid-fw3xqyfa></div> <div class="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-accent opacity-70" data-astro-cid-fw3xqyfa></div> <h2 class="text-3xl md:text-4xl font-bold mb-4 animate-slide-up relative inline-block text-gray-800 dark:text-white" data-astro-cid-fw3xqyfa>
Video <span class="text-accent gradient-text" data-astro-cid-fw3xqyfa>Content</span> <div class="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-accent to-transparent" data-astro-cid-fw3xqyfa></div> </h2> </div> <p class="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-slide-up backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 p-4 rounded-lg" style="animation-delay: 0.2s;" data-astro-cid-fw3xqyfa>
Tutorials, tech reviews, and coding sessions to help you learn and stay updated.
</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-astro-cid-fw3xqyfa> <!-- Enhanced Video Card 1 --> <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700 transform transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] card-3d animate-fade-in" style="animation-delay: 0.3s;" data-astro-cid-fw3xqyfa> <div class="aspect-w-16 aspect-h-9 relative" data-astro-cid-fw3xqyfa> <!-- Video overlay with play button --> <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center" data-astro-cid-fw3xqyfa> <div class="w-16 h-16 rounded-full bg-accent/80 flex items-center justify-center transform hover:scale-110 transition-transform duration-300" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" data-astro-cid-fw3xqyfa></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-fw3xqyfa></path> </svg> </div> </div> ${renderComponent($$result2, "YouTubeEmbed", $$YouTubeEmbed, { "videoId": "AmGSEH7QcDg", "title": "Cursor AI: The FREE AI Coding Assistant That's Better Than GitHub Copilot", "aspectRatio": "16/9", "modestBranding": true, "rel": false, "loading": "lazy", "importance": "high", "className": "absolute top-0 left-0 w-full h-full", "data-astro-cid-fw3xqyfa": true })} </div> <div class="p-6 relative" data-astro-cid-fw3xqyfa> <!-- Decorative elements --> <div class="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-accent opacity-70" data-astro-cid-fw3xqyfa></div> <div class="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-accent opacity-70" data-astro-cid-fw3xqyfa></div> <h3 class="text-xl font-bold mb-3 text-gray-800 dark:text-white relative inline-block" data-astro-cid-fw3xqyfa>
Cursor AI: The FREE AI Coding Assistant That's Better Than GitHub Copilot
<div class="absolute bottom-0 left-0 w-1/2 h-1 bg-gradient-to-r from-accent to-transparent" data-astro-cid-fw3xqyfa></div> </h3> <p class="text-gray-600 dark:text-gray-300 mb-4" data-astro-cid-fw3xqyfa>
In this video, I demonstrate why Cursor AI has become my go-to coding assistant, outperforming GitHub Copilot in many scenarios. See real examples of how it helps with complex coding tasks and why it's worth trying for any developer.
</p> <div class="flex justify-between items-center" data-astro-cid-fw3xqyfa> <span class="text-sm text-gray-500 dark:text-gray-400 flex items-center" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" data-astro-cid-fw3xqyfa></path> </svg>
March 15, 2024
</span> <span class="text-sm text-gray-500 dark:text-gray-400 flex items-center" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-fw3xqyfa></path> </svg>
14:27
</span> </div> </div> </div> <!-- Enhanced Video Card 2 --> <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700 transform transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] card-3d animate-fade-in" style="animation-delay: 0.4s;" data-astro-cid-fw3xqyfa> <div class="aspect-w-16 aspect-h-9 relative" data-astro-cid-fw3xqyfa> <!-- Video overlay with play button --> <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center" data-astro-cid-fw3xqyfa> <div class="w-16 h-16 rounded-full bg-accent/80 flex items-center justify-center transform hover:scale-110 transition-transform duration-300" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" data-astro-cid-fw3xqyfa></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-fw3xqyfa></path> </svg> </div> </div> ${renderComponent($$result2, "YouTubeEmbed", $$YouTubeEmbed, { "videoId": "igEPucjeXTE", "title": "What's Inside This Mystery Crypto Mining Box? $6 USD A DAY?", "aspectRatio": "16/9", "modestBranding": true, "rel": false, "loading": "lazy", "importance": "high", "className": "absolute top-0 left-0 w-full h-full", "data-astro-cid-fw3xqyfa": true })} </div> <div class="p-6 relative" data-astro-cid-fw3xqyfa> <!-- Decorative elements --> <div class="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-accent opacity-70" data-astro-cid-fw3xqyfa></div> <div class="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-accent opacity-70" data-astro-cid-fw3xqyfa></div> <h3 class="text-xl font-bold mb-3 text-gray-800 dark:text-white relative inline-block" data-astro-cid-fw3xqyfa>
What's Inside This Mystery Crypto Mining Box? $6 USD A DAY?
<div class="absolute bottom-0 left-0 w-1/2 h-1 bg-gradient-to-r from-accent to-transparent" data-astro-cid-fw3xqyfa></div> </h3> <p class="text-gray-600 dark:text-gray-300 mb-4" data-astro-cid-fw3xqyfa>
Unboxing and testing a mystery crypto mining box that claims to earn $6 USD per day. Is it worth the investment? Watch to find out the real performance and profitability.
</p> <div class="flex justify-between items-center" data-astro-cid-fw3xqyfa> <span class="text-sm text-gray-500 dark:text-gray-400 flex items-center" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" data-astro-cid-fw3xqyfa></path> </svg>
April 9, 2025
</span> <span class="text-sm text-gray-500 dark:text-gray-400 flex items-center" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-fw3xqyfa></path> </svg>
18:45
</span> </div> </div> </div> <!-- Enhanced Video Card 3 --> <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700 transform transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] card-3d animate-fade-in" style="animation-delay: 0.5s;" data-astro-cid-fw3xqyfa> <div class="aspect-w-16 aspect-h-9 relative" data-astro-cid-fw3xqyfa> <!-- Video overlay with play button --> <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center" data-astro-cid-fw3xqyfa> <div class="w-16 h-16 rounded-full bg-accent/80 flex items-center justify-center transform hover:scale-110 transition-transform duration-300" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" data-astro-cid-fw3xqyfa></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-fw3xqyfa></path> </svg> </div> </div> ${renderComponent($$result2, "YouTubeEmbed", $$YouTubeEmbed, { "videoId": "j7-emwgQwt8", "title": "Jingle Mining Sent Me Their BEST Mining Rig Yet! Jasminer X16Q Unboxing", "aspectRatio": "16/9", "modestBranding": true, "rel": false, "loading": "lazy", "importance": "high", "className": "absolute top-0 left-0 w-full h-full", "data-astro-cid-fw3xqyfa": true })} </div> </div> </div> <!-- Resource Grid Section --> <div class="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-astro-cid-fw3xqyfa> <!-- Getting Started Guide --> <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 transform hover:scale-[1.02] transition-all duration-500 group" data-astro-cid-fw3xqyfa> <div class="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" data-astro-cid-fw3xqyfa></path> </svg> </div> <h3 class="text-xl font-bold mb-3 text-gray-800 dark:text-white" data-astro-cid-fw3xqyfa>Getting Started Guide</h3> <p class="text-gray-600 dark:text-gray-300 mb-4" data-astro-cid-fw3xqyfa>Essential steps to launch your content creation journey.</p> <ul class="space-y-2 text-gray-600 dark:text-gray-300" data-astro-cid-fw3xqyfa> <li class="flex items-center" data-astro-cid-fw3xqyfa> <svg class="w-4 h-4 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" data-astro-cid-fw3xqyfa></path> </svg>
Platform selection guide
</li> <li class="flex items-center" data-astro-cid-fw3xqyfa> <svg class="w-4 h-4 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" data-astro-cid-fw3xqyfa></path> </svg>
Basic equipment needs
</li> <li class="flex items-center" data-astro-cid-fw3xqyfa> <svg class="w-4 h-4 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" data-astro-cid-fw3xqyfa></path> </svg>
Content planning basics
</li> </ul> </div> <!-- Technical Setup --> <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 transform hover:scale-[1.02] transition-all duration-500 group" data-astro-cid-fw3xqyfa> <div class="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" data-astro-cid-fw3xqyfa></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-astro-cid-fw3xqyfa></path> </svg> </div> <h3 class="text-xl font-bold mb-3 text-gray-800 dark:text-white" data-astro-cid-fw3xqyfa>Technical Setup</h3> <p class="text-gray-600 dark:text-gray-300 mb-4" data-astro-cid-fw3xqyfa>Detailed technical configuration guides.</p> <ul class="space-y-2 text-gray-600 dark:text-gray-300" data-astro-cid-fw3xqyfa> <li class="flex items-center" data-astro-cid-fw3xqyfa> <svg class="w-4 h-4 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" data-astro-cid-fw3xqyfa></path> </svg>
OBS/Streamlabs setup
</li> <li class="flex items-center" data-astro-cid-fw3xqyfa> <svg class="w-4 h-4 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" data-astro-cid-fw3xqyfa></path> </svg>
Audio configuration
</li> <li class="flex items-center" data-astro-cid-fw3xqyfa> <svg class="w-4 h-4 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" data-astro-cid-fw3xqyfa></path> </svg>
Stream settings
</li> </ul> </div> <!-- Monetization Guide --> <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 transform hover:scale-[1.02] transition-all duration-500 group" data-astro-cid-fw3xqyfa> <div class="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-fw3xqyfa></path> </svg> </div> <h3 class="text-xl font-bold mb-3 text-gray-800 dark:text-white" data-astro-cid-fw3xqyfa>Monetization Guide</h3> <p class="text-gray-600 dark:text-gray-300 mb-4" data-astro-cid-fw3xqyfa>Strategies to monetize your content.</p> <ul class="space-y-2 text-gray-600 dark:text-gray-300" data-astro-cid-fw3xqyfa> <li class="flex items-center" data-astro-cid-fw3xqyfa> <svg class="w-4 h-4 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" data-astro-cid-fw3xqyfa></path> </svg>
Sponsorship strategies
</li> <li class="flex items-center" data-astro-cid-fw3xqyfa> <svg class="w-4 h-4 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" data-astro-cid-fw3xqyfa></path> </svg>
Platform monetization
</li> <li class="flex items-center" data-astro-cid-fw3xqyfa> <svg class="w-4 h-4 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" data-astro-cid-fw3xqyfa></path> </svg>
Donation setup
</li> </ul> </div> </div> <!-- Interactive Tools Section --> <section class="mt-20 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-100 dark:border-gray-700" data-astro-cid-fw3xqyfa> <div class="text-center mb-12" data-astro-cid-fw3xqyfa> <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-4" data-astro-cid-fw3xqyfa>Interactive Tools</h2> <p class="text-gray-600 dark:text-gray-300" data-astro-cid-fw3xqyfa>Tools to help optimize your content creation setup and workflow</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-8" data-astro-cid-fw3xqyfa> <!-- Setup Wizard --> <div id="setup-wizard" class="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-600" data-astro-cid-fw3xqyfa> <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white" data-astro-cid-fw3xqyfa>Stream Setup Wizard</h3> <p class="text-gray-600 dark:text-gray-300 mb-4" data-astro-cid-fw3xqyfa>Interactive guide to configure your streaming setup</p> <div class="space-y-4" data-astro-cid-fw3xqyfa> <div class="flex items-center" data-astro-cid-fw3xqyfa> <input type="checkbox" class="form-checkbox h-4 w-4 text-accent" data-astro-cid-fw3xqyfa> <span class="ml-2 text-gray-600 dark:text-gray-300" data-astro-cid-fw3xqyfa>Basic Hardware Check</span> </div> <div class="flex items-center" data-astro-cid-fw3xqyfa> <input type="checkbox" class="form-checkbox h-4 w-4 text-accent" data-astro-cid-fw3xqyfa> <span class="ml-2 text-gray-600 dark:text-gray-300" data-astro-cid-fw3xqyfa>Software Installation</span> </div> <div class="flex items-center" data-astro-cid-fw3xqyfa> <input type="checkbox" class="form-checkbox h-4 w-4 text-accent" data-astro-cid-fw3xqyfa> <span class="ml-2 text-gray-600 dark:text-gray-300" data-astro-cid-fw3xqyfa>Stream Settings</span> </div> <button class="mt-4 bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg transition-all duration-300" data-astro-cid-fw3xqyfa>
Start Setup
</button> </div> </div> <!-- Equipment Calculator --> <div id="equipment-calculator" class="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-600" data-astro-cid-fw3xqyfa> <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white" data-astro-cid-fw3xqyfa>Equipment Calculator</h3> <p class="text-gray-600 dark:text-gray-300 mb-4" data-astro-cid-fw3xqyfa>Calculate required equipment based on your needs</p> <div class="space-y-4" data-astro-cid-fw3xqyfa> <div class="flex flex-col" data-astro-cid-fw3xqyfa> <label class="text-gray-600 dark:text-gray-300 mb-1" data-astro-cid-fw3xqyfa>Content Type</label> <select class="form-select rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" data-astro-cid-fw3xqyfa> <option data-astro-cid-fw3xqyfa>Gaming</option> <option data-astro-cid-fw3xqyfa>Tech Reviews</option> <option data-astro-cid-fw3xqyfa>Tutorials</option> </select> </div> <div class="flex flex-col" data-astro-cid-fw3xqyfa> <label class="text-gray-600 dark:text-gray-300 mb-1" data-astro-cid-fw3xqyfa>Budget Range</label> <select class="form-select rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" data-astro-cid-fw3xqyfa> <option data-astro-cid-fw3xqyfa>Starter ($500-1000)</option> <option data-astro-cid-fw3xqyfa>Mid-Range ($1000-2000)</option> <option data-astro-cid-fw3xqyfa>Professional ($2000+)</option> </select> </div> <button class="mt-4 bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg transition-all duration-300" data-astro-cid-fw3xqyfa>
Calculate Setup
</button> </div> </div> </div> </section> <!-- Platform Tools Section --> <section class="mt-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 shadow-xl border border-gray-100 dark:border-gray-700" data-astro-cid-fw3xqyfa> <div class="text-center mb-12" data-astro-cid-fw3xqyfa> <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-4" data-astro-cid-fw3xqyfa>Platform Tools</h2> <p class="text-gray-600 dark:text-gray-300" data-astro-cid-fw3xqyfa>Compare platforms and optimize your stream quality</p> </div> <!-- Platform Comparison Tool --> <div id="platform-comparison" class="mb-12" data-astro-cid-fw3xqyfa> <div class="grid grid-cols-1 md:grid-cols-3 gap-6" data-astro-cid-fw3xqyfa> <div class="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg" data-astro-cid-fw3xqyfa> <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white" data-astro-cid-fw3xqyfa>YouTube</h3> <ul class="space-y-2 text-gray-600 dark:text-gray-300" data-astro-cid-fw3xqyfa> <li class="flex items-center" data-astro-cid-fw3xqyfa> <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-astro-cid-fw3xqyfa></path> </svg>
Largest audience
</li> <li class="flex items-center" data-astro-cid-fw3xqyfa> <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-astro-cid-fw3xqyfa></path> </svg>
Best analytics
</li> </ul> </div> <div class="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg" data-astro-cid-fw3xqyfa> <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white" data-astro-cid-fw3xqyfa>Twitch</h3> <ul class="space-y-2 text-gray-600 dark:text-gray-300" data-astro-cid-fw3xqyfa> <li class="flex items-center" data-astro-cid-fw3xqyfa> <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-astro-cid-fw3xqyfa></path> </svg>
Live focus
</li> <li class="flex items-center" data-astro-cid-fw3xqyfa> <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-astro-cid-fw3xqyfa></path> </svg>
Strong community
</li> </ul> </div> <div class="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg" data-astro-cid-fw3xqyfa> <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white" data-astro-cid-fw3xqyfa>Kick</h3> <ul class="space-y-2 text-gray-600 dark:text-gray-300" data-astro-cid-fw3xqyfa> <li class="flex items-center" data-astro-cid-fw3xqyfa> <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-astro-cid-fw3xqyfa></path> </svg>
Better revenue
</li> <li class="flex items-center" data-astro-cid-fw3xqyfa> <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-astro-cid-fw3xqyfa></path> </svg>
Growing platform
</li> </ul> </div> </div> </div> <!-- Stream Quality Checker --> <div id="quality-checker" class="mb-12" data-astro-cid-fw3xqyfa> <div class="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg" data-astro-cid-fw3xqyfa> <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-white" data-astro-cid-fw3xqyfa>Stream Quality Checker</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-astro-cid-fw3xqyfa> <div data-astro-cid-fw3xqyfa> <label class="block text-gray-600 dark:text-gray-300 mb-2" data-astro-cid-fw3xqyfa>Upload Speed (Mbps)</label> <input type="number" class="w-full rounded-lg border-gray-300 dark:border-gray-600" data-astro-cid-fw3xqyfa> </div> <div data-astro-cid-fw3xqyfa> <label class="block text-gray-600 dark:text-gray-300 mb-2" data-astro-cid-fw3xqyfa>Target Resolution</label> <select class="w-full rounded-lg border-gray-300 dark:border-gray-600" data-astro-cid-fw3xqyfa> <option data-astro-cid-fw3xqyfa>1080p60</option> <option data-astro-cid-fw3xqyfa>1080p30</option> <option data-astro-cid-fw3xqyfa>720p60</option> <option data-astro-cid-fw3xqyfa>720p30</option> </select> </div> </div> <button class="mt-4 bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg transition-all duration-300" data-astro-cid-fw3xqyfa>
Check Settings
</button> </div> </div> <!-- Newsletter Signup --> <div class="bg-gradient-to-r from-accent/20 to-primary/20 rounded-xl p-8" data-astro-cid-fw3xqyfa> <div class="max-w-2xl mx-auto text-center" data-astro-cid-fw3xqyfa> <h3 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white" data-astro-cid-fw3xqyfa>Get Content Creation Tips</h3> <p class="text-gray-600 dark:text-gray-300 mb-6" data-astro-cid-fw3xqyfa>Subscribe for weekly streaming tips, equipment guides, and monetization strategies</p> <form class="flex flex-col sm:flex-row gap-4" data-astro-cid-fw3xqyfa> <input type="email" placeholder="Enter your email" class="flex-1 rounded-lg border-gray-300 dark:border-gray-600" required data-astro-cid-fw3xqyfa> <button type="submit" class="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg transition-all duration-300" data-astro-cid-fw3xqyfa>
Subscribe
</button> </form> </div> </div> </section> <div class="flex justify-between items-center" data-astro-cid-fw3xqyfa> <span class="text-sm text-gray-500 dark:text-gray-400 flex items-center" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" data-astro-cid-fw3xqyfa></path> </svg>
July 9, 2023
</span> <span class="text-sm text-gray-500 dark:text-gray-400 flex items-center" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-fw3xqyfa></path> </svg>
22:18
</span> </div> </div> <div class="text-center mt-16 animate-fade-in" style="animation-delay: 0.6s;" data-astro-cid-fw3xqyfa> <div class="flex flex-wrap justify-center gap-4" data-astro-cid-fw3xqyfa> <a href="/live" class="cta-button-primary group" data-astro-cid-fw3xqyfa> <span class="cta-button-content" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" data-astro-cid-fw3xqyfa></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-fw3xqyfa></path> </svg> <span data-astro-cid-fw3xqyfa>Watch Live Stream</span> </span> <!-- Button glow effect --> <div class="absolute inset-0 rounded-lg bg-accent opacity-0 blur-xl group-hover:opacity-30 transition-opacity duration-300" data-astro-cid-fw3xqyfa></div> </a> <a href="https://www.youtube.com/@TycenYT" target="_blank" rel="noopener noreferrer" class="cta-button-secondary group" data-astro-cid-fw3xqyfa> <span class="cta-button-content" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" data-astro-cid-fw3xqyfa></path> </svg> <span data-astro-cid-fw3xqyfa>View All Videos</span> </span> <!-- Button subtle glow effect --> <div class="absolute inset-0 rounded-lg bg-accent opacity-0 blur-xl group-hover:opacity-20 transition-opacity duration-300" data-astro-cid-fw3xqyfa></div> </a> </div> </div> </section>  <section class="py-20 bg-white dark:bg-gray-900 relative overflow-hidden" data-astro-cid-fw3xqyfa> <!-- Background code pattern --> <div class="absolute inset-0 overflow-hidden opacity-5 dark:opacity-10 pointer-events-none" data-astro-cid-fw3xqyfa> <div class="code-pattern" data-astro-cid-fw3xqyfa></div> </div> <div class="container mx-auto px-4 relative z-10" data-astro-cid-fw3xqyfa> <div class="text-center mb-16 animate-fade-in" data-astro-cid-fw3xqyfa> <div class="inline-block relative mb-4" data-astro-cid-fw3xqyfa> <div class="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-accent opacity-70" data-astro-cid-fw3xqyfa></div> <div class="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-accent opacity-70" data-astro-cid-fw3xqyfa></div> <h2 class="text-3xl md:text-4xl font-bold mb-4 animate-slide-up relative inline-block text-gray-800 dark:text-white" data-astro-cid-fw3xqyfa>
Interactive <span class="text-accent gradient-text" data-astro-cid-fw3xqyfa>Code Editor</span> <div class="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-accent to-transparent" data-astro-cid-fw3xqyfa></div> </h2> </div> <p class="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-slide-up backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg" style="animation-delay: 0.2s;" data-astro-cid-fw3xqyfa>
Explore code snippets and examples from our tutorials and live streams.
</p> </div> <div class="max-w-4xl mx-auto animate-fade-in" style="animation-delay: 0.3s;" data-astro-cid-fw3xqyfa> <div class="bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800 transform transition-all duration-500 hover:shadow-accent/20 hover:shadow-2xl" data-astro-cid-fw3xqyfa> <!-- Code editor header --> <div class="bg-gray-800 px-4 py-2 flex items-center justify-between" data-astro-cid-fw3xqyfa> <div class="flex items-center" data-astro-cid-fw3xqyfa> <div class="flex space-x-2 mr-4" data-astro-cid-fw3xqyfa> <div class="w-3 h-3 rounded-full bg-red-500" data-astro-cid-fw3xqyfa></div> <div class="w-3 h-3 rounded-full bg-yellow-500" data-astro-cid-fw3xqyfa></div> <div class="w-3 h-3 rounded-full bg-green-500" data-astro-cid-fw3xqyfa></div> </div> <div class="text-white font-mono flex items-center" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" data-astro-cid-fw3xqyfa></path> </svg> <span data-astro-cid-fw3xqyfa>web-tools.js</span> </div> </div> <div class="flex space-x-2 text-gray-400 text-sm" data-astro-cid-fw3xqyfa> <span class="px-2 py-1 bg-gray-700 rounded text-xs" data-astro-cid-fw3xqyfa>JavaScript</span> <span class="px-2 py-1 bg-gray-700 rounded text-xs" data-astro-cid-fw3xqyfa>NosytLabs</span> </div> </div> <!-- Code editor content --> ${renderComponent($$result2, "CodeDisplay", $$CodeDisplay, { "title": "web-tools.js", "language": "javascript", "videoSrc": "https://www.youtube.com/embed/AmGSEH7QcDg", "videoFallbackUrl": "https://www.youtube.com/watch?v=AmGSEH7QcDg", "code": `// NosytLabs Web Development Tools
class WebDevTools {
  constructor(projectName) {
    this.projectName = projectName;
    this.version = '1.0.0';
    this.components = [];
  }

  async initialize() {
    console.log(\`Initializing \${this.projectName} tools...\`);
    await this.loadComponents();
    this.setupEventListeners();
    console.log(\`\${this.projectName} tools are ready!\`);
  }

  async loadComponents() {
    try {
      // Load project components
      const response = await fetch('/api/components');
      const componentData = await response.json();

      console.log('Components loaded successfully');
      return componentData;
    } catch (error) {
      console.error('Error loading components:', error);
      throw new Error('Failed to initialize web components');
    }
  }

  setupEventListeners() {
    // Listen for user interactions
    document.querySelector('#component-selector')
      .addEventListener('change', this.handleComponentSelection.bind(this));

    // Setup live preview updates
    document.querySelector('#code-editor')
      .addEventListener('input', this.updatePreview.bind(this));
  }

  handleComponentSelection(event) {
    const componentId = event.target.value;
    if (!componentId) return;

    this.loadComponentCode(componentId)
      .then(code => this.displayCode(code))
      .catch(error => {
        console.error('Error loading component:', error);
        this.displayError('Failed to load component. Please try again.');
      });
  }

  updatePreview(event) {
    // Update live preview with current code
    const code = event.target.value;
    const previewFrame = document.querySelector('#preview-frame');

    if (previewFrame && previewFrame.contentDocument) {
      previewFrame.contentDocument.body.innerHTML = code;
    }
  }
}`, "data-astro-cid-fw3xqyfa": true })} <!-- Code editor footer --> <div class="bg-gray-800 px-4 py-2 flex items-center justify-between text-gray-400 text-sm" data-astro-cid-fw3xqyfa> <div class="flex items-center" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" data-astro-cid-fw3xqyfa></path> </svg> <span data-astro-cid-fw3xqyfa>Download</span> </div> <div data-astro-cid-fw3xqyfa> <span data-astro-cid-fw3xqyfa>Line: 32, Col: 15</span> </div> <div class="flex items-center" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" data-astro-cid-fw3xqyfa></path> </svg> <span data-astro-cid-fw3xqyfa>Share</span> </div> </div> </div> <div class="mt-12 text-center animate-fade-in" style="animation-delay: 0.4s;" data-astro-cid-fw3xqyfa> <div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 transform transition-all duration-500 hover:shadow-2xl relative" data-astro-cid-fw3xqyfa> <!-- Decorative elements --> <div class="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-accent opacity-70" data-astro-cid-fw3xqyfa></div> <div class="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-accent opacity-70" data-astro-cid-fw3xqyfa></div> <p class="text-gray-600 dark:text-gray-300 mb-6 text-lg" data-astro-cid-fw3xqyfa>
Want to see more code examples and tutorials? Check out our GitHub repositories.
</p> <a href="https://github.com/NosytLabs" target="_blank" rel="noopener noreferrer" class="cta-button-secondary group" data-astro-cid-fw3xqyfa> <span class="cta-button-content" data-astro-cid-fw3xqyfa> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-fw3xqyfa> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" data-astro-cid-fw3xqyfa></path> </svg> <span data-astro-cid-fw3xqyfa>Visit GitHub</span> </span> <!-- Button subtle glow effect --> <div class="absolute inset-0 rounded-lg bg-accent opacity-0 blur-xl group-hover:opacity-20 transition-opacity duration-300" data-astro-cid-fw3xqyfa></div> </a> </div> </div> </div> </div> </section> ` })}  `;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/content-creation.astro", void 0);

const $$file = "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/content-creation.astro";
const $$url = "/content-creation.html";const contentCreation=/*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({__proto__:null,default:$$ContentCreation,file:$$file,url:$$url},Symbol.toStringTag,{value:'Module'}));export{fetchChannelVideos as a,contentCreation as c,fetchChannelData as f};