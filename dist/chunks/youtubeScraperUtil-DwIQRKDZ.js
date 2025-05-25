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
    console.error("Error fetching YouTube channel data:", error);
    return {
      title: "TycenYT",
      description: "Technology content creator focusing on AI tools, crypto mining, development tutorials, and tech reviews. Featuring videos on AI coding assistants, mining hardware, and web development.",
      subscribers: "15.8K",
      image: "/images/content/tycen-youtube-banner.jpg",
      url: `https://www.youtube.com/${channelId}`
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
        id: "AmGSEH7QcDg",
        title: "Cursor AI: The FREE AI Coding Assistant That's Better Than GitHub Copilot",
        thumbnail: "/images/content/cursor-ai-thumbnail.jpg",
        views: "24K views",
        publishedTime: "2 months ago",
        duration: "12:47",
        url: "https://www.youtube.com/watch?v=AmGSEH7QcDg"
      },
      {
        id: "igEPucjeXTE",
        title: "What's Inside This Mystery Crypto Mining Box? $6 USD A DAY?",
        thumbnail: "/images/content/crypto-box-thumbnail.jpg",
        views: "18K views",
        publishedTime: "3 months ago",
        duration: "15:22",
        url: "https://www.youtube.com/watch?v=igEPucjeXTE"
      },
      {
        id: "j7-emwgQwt8",
        title: "Jingle Mining Sent Me Their BEST Mining Rig Yet! Jasminer X16Q Unboxing",
        thumbnail: "/images/content/jasminer-thumbnail.jpg",
        views: "12K views",
        publishedTime: "4 months ago",
        duration: "10:35",
        url: "https://www.youtube.com/watch?v=j7-emwgQwt8"
      }
    ].slice(0, limit);
  }
}
export {
  fetchChannelVideos as a,
  fetchChannelData as f
};
