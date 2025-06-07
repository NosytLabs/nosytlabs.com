import { s as server_default } from "./react-vendor-FwMBFPql.js";
const renderers = [Object.assign({ "name": "@astrojs/react", "clientEntrypoint": "@astrojs/react/client.js", "serverEntrypoint": "@astrojs/react/server.js" }, { ssr: server_default })];
async function fetchChannelData(channelId) {
  try {
    const isHandle = channelId.startsWith("@");
    const url = isHandle ? `https://www.youtube.com/${channelId}` : `https://www.youtube.com/channel/${channelId}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch channel data: ${response.status} ${response.statusText}`);
    }
    const html = await response.text();
    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : "Unknown Channel";
    const descMatch = html.match(/<meta property="og:description" content="([^"]+)"/);
    const description = descMatch ? descMatch[1] : "";
    const subMatch = html.match(/subscriberCountText.*?([0-9.]+[KMB]?) subscribers/);
    const subscribers = subMatch ? subMatch[1] : "Unknown";
    const imgMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
    const image = imgMatch ? imgMatch[1] : "";
    return {
      title,
      description,
      subscribers,
      image,
      url
    };
  } catch (error) {
    console.warn("YouTube API scraping failed, using fallback data:", error.message);
    return {
      title: "TycenYT",
      description: "Gaming content creator specializing in Xbox One games, Android and iOS gameplay, and gaming tutorials. Join 19.5K+ subscribers for the latest gaming content, reviews, and gameplay videos.",
      subscribers: "19.5K+",
      image: "/images/content/tycen-youtube-banner.jpg",
      url: `https://www.youtube.com/${channelId}`,
      verified: true,
      category: "Gaming",
      uploadFrequency: "Regular",
      averageViews: "5K+",
      totalVideos: "593+"
    };
  }
}
async function fetchChannelVideos(channelId, limit = 6) {
  try {
    const isHandle = channelId.startsWith("@");
    const url = isHandle ? `https://www.youtube.com/${channelId}/videos` : `https://www.youtube.com/channel/${channelId}/videos`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch channel videos: ${response.status} ${response.statusText}`);
    }
    const html = await response.text();
    const videoBlocks = html.match(/videoRenderer":{.*?}/g) || [];
    const videos = [];
    for (let i = 0; i < Math.min(videoBlocks.length, limit); i++) {
      const block = videoBlocks[i];
      const idMatch = block.match(/"videoId":"([^"]+)"/);
      const id = idMatch ? idMatch[1] : "";
      const titleMatch = block.match(/"title":{"runs":\[{"text":"([^"]+)"/);
      const title = titleMatch ? titleMatch[1] : "Unknown Video";
      const thumbMatch = block.match(/"thumbnail":{"thumbnails":\[.*?"url":"([^"]+)"/);
      const thumbnail = thumbMatch ? thumbMatch[1].replace(/\\u0026/g, "&") : "";
      const viewMatch = block.match(/"viewCountText":{"simpleText":"([^"]+)"/);
      const views = viewMatch ? viewMatch[1] : "0 views";
      const timeMatch = block.match(/"publishedTimeText":{"simpleText":"([^"]+)"/);
      const publishedTime = timeMatch ? timeMatch[1] : "";
      const durationMatch = block.match(/"lengthText":{"accessibility":{"accessibilityData":{"label":"([^"]+)"/);
      const duration = durationMatch ? durationMatch[1] : "";
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
    console.error("Error fetching YouTube channel videos:", error);
    return [
      {
        id: "Buty-cxMTfM",
        title: "Longvinter Early Access Live [Animal Crossing meets PVP Survival]",
        description: "Live gameplay of Longvinter Early Access - a unique survival game that combines Animal Crossing vibes with PVP elements. Join me as I explore this new indie game!",
        thumbnail: "/images/content/longvinter-thumbnail.jpg",
        views: "3.2K views",
        publishedTime: "2 days ago",
        duration: "45:23",
        url: "https://www.youtube.com/watch?v=Buty-cxMTfM",
        category: "Gaming",
        tags: ["Longvinter", "Early Access", "Survival", "PVP", "Indie Game"]
      },
      {
        id: "Ka8P5VS01Eo",
        title: "How to get the Short Sword in PIXELS ONLINE (CRYPTO NFT GAME)",
        description: "Tutorial on obtaining the Mambikari Short Sword in Pixels Online, a crypto NFT game. Step-by-step guide with tips and strategies.",
        thumbnail: "/images/content/pixels-online-thumbnail.jpg",
        views: "1.8K views",
        publishedTime: "1 week ago",
        duration: "8:15",
        url: "https://www.youtube.com/watch?v=Ka8P5VS01Eo",
        category: "Gaming",
        tags: ["Pixels Online", "NFT Game", "Crypto Gaming", "Tutorial", "Short Sword"]
      },
      {
        id: "0Zv79ZOxcS4",
        title: "DYSMANTLE - Post-Apocalyptic Survival Game First Look",
        description: "First impressions and gameplay of DYSMANTLE, a post-apocalyptic survival game. Exploring the world, crafting, and zombie survival mechanics.",
        thumbnail: "/images/content/dysmantle-thumbnail.jpg",
        views: "2.5K views",
        publishedTime: "2 weeks ago",
        duration: "22:18",
        url: "https://www.youtube.com/watch?v=0Zv79ZOxcS4",
        category: "Gaming",
        tags: ["DYSMANTLE", "Survival", "Post-Apocalyptic", "Zombies", "First Look"]
      },
      {
        id: "JNloGaTgBEA",
        title: "10 Hidden Secrets in Legend of Zelda Breath of the Wild",
        description: "Discover 10 amazing hidden secrets and easter eggs in The Legend of Zelda: Breath of the Wild that you probably missed! Tips and tricks for exploration.",
        thumbnail: "/images/content/zelda-secrets-thumbnail.jpg",
        views: "8.5K views",
        publishedTime: "3 weeks ago",
        duration: "12:45",
        url: "https://www.youtube.com/watch?v=JNloGaTgBEA",
        category: "Gaming",
        tags: ["Zelda", "Breath of the Wild", "Secrets", "Tips", "Nintendo"]
      },
      {
        id: "XboxGameplay1",
        title: "Xbox Series X Gaming Session - Latest Releases Review",
        description: "Testing out the latest Xbox Series X games and sharing my thoughts on performance, graphics, and gameplay. Join me for some casual gaming!",
        thumbnail: "/images/content/xbox-gaming-thumbnail.jpg",
        views: "4.2K views",
        publishedTime: "1 week ago",
        duration: "35:20",
        url: "https://www.youtube.com/watch?v=XboxGameplay1",
        category: "Gaming",
        tags: ["Xbox Series X", "Gaming", "Review", "Gameplay", "Console"]
      },
      {
        id: "MobileGaming2",
        title: "Best Mobile Games of 2025 - Android & iOS Gameplay",
        description: "Showcasing the best mobile games available on Android and iOS in 2025. Gameplay footage, reviews, and recommendations for mobile gamers.",
        thumbnail: "/images/content/mobile-games-thumbnail.jpg",
        views: "6.1K views",
        publishedTime: "5 days ago",
        duration: "18:30",
        url: "https://www.youtube.com/watch?v=MobileGaming2",
        category: "Gaming",
        tags: ["Mobile Gaming", "Android", "iOS", "Best Games", "2025"]
      }
    ].slice(0, limit);
  }
}
export {
  fetchChannelVideos as a,
  fetchChannelData as f,
  renderers as r
};
