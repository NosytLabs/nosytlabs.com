/* empty css                              */import {a as createComponent,r as renderTemplate,f as renderComponent,m as maybeRenderHead,e as addAttribute}from'../astro-061ea033.js';import {$ as $$BaseLayout}from'./3d-printing.astro-bbf5f2c9.js';/* empty css                       */const posts = [
	{
		id: "cursor-ai",
		title: "Cursor AI: A Review of the Free AI Coding Assistant",
		excerpt: "A hands-on review of Cursor AI, a code editor built on VSCode that offers AI-assisted features like code completion, explanations, and refactoring suggestions.",
		image: "/images/blog/cursor-ai.jpg",
		author: "Tycen",
		authorImage: "/images/authors/tycen.jpg",
		date: "March 15, 2025",
		category: "Development Tools",
		tags: [
			"Cursor AI",
			"Code Editor",
			"Development",
			"Coding",
			"Productivity",
			"AI Tools"
		],
		featured: true
	},
	{
		id: "crypto-mining-box",
		title: "What's Inside This Mystery Crypto Mining Box?",
		excerpt: "An unboxing and analysis of a mystery crypto mining device that claims to earn passive income. We examine its hardware, power consumption, and actual earnings.",
		image: "/images/blog/crypto-box-thumbnail.jpg",
		author: "Tycen",
		authorImage: "/images/authors/tycen.jpg",
		date: "February 22, 2025",
		category: "Crypto Mining",
		tags: [
			"Crypto Mining",
			"Hardware Review",
			"Passive Income",
			"Cryptocurrency",
			"Mining Rig"
		],
		featured: true
	},
	{
		id: "jasminer-mining-rig",
		title: "Jasminer X16Q Mining Rig: Unboxing and Performance Review",
		excerpt: "A detailed review of the Jasminer X16Q mining rig, including unboxing, setup process, power consumption, and mining performance for Ethereum and other cryptocurrencies.",
		image: "/images/blog/jasminer-thumbnail.jpg",
		author: "Tycen",
		authorImage: "/images/authors/tycen.jpg",
		date: "January 18, 2025",
		category: "Crypto Mining",
		tags: [
			"Jasminer",
			"Mining Rig",
			"Ethereum Mining",
			"Hardware Review",
			"Cryptocurrency"
		],
		featured: false
	},
	{
		id: "3d-printing-basics",
		title: "3D Printing Basics: Getting Started with FDM and Resin Printing",
		excerpt: "A beginner's guide to 3D printing covering the differences between FDM and resin printing, recommended starter printers, filament types, and basic troubleshooting tips.",
		image: "/images/blog/3d-printing-basics.jpg",
		author: "Tycen",
		authorImage: "/images/authors/tycen.jpg",
		date: "February 5, 2025",
		category: "3D Printing",
		tags: [
			"3D Printing",
			"FDM",
			"Resin Printing",
			"Beginner Guide",
			"Creality",
			"Elegoo"
		],
		featured: false
	},
	{
		id: "passive-income-apps",
		title: "Realistic Earnings from Passive Income Apps: What to Expect",
		excerpt: "An honest look at what you can realistically earn from passive income apps like HoneyGain, EarnApp, and Repocket based on actual data and user reports.",
		image: "/images/blog/passive-income-apps.jpg",
		author: "Tycen",
		authorImage: "/images/authors/tycen.jpg",
		date: "January 25, 2025",
		category: "Passive Income",
		tags: [
			"Passive Income",
			"HoneyGain",
			"EarnApp",
			"Repocket",
			"Bandwidth Sharing",
			"Realistic Earnings"
		],
		featured: true
	},
	{
		id: "ai-trends-2025",
		title: "AI Trends to Watch in 2025",
		excerpt: "Explore the cutting-edge AI technologies and trends that will shape the business landscape in 2025 and beyond.",
		image: "/images/blog/placeholder.svg",
		author: "Tycen",
		authorImage: "/images/authors/tycen.jpg",
		date: "April 15, 2025",
		category: "Artificial Intelligence",
		tags: [
			"AI",
			"Machine Learning",
			"Business Technology",
			"Future Tech"
		],
		featured: false
	},
	{
		id: "future-of-3d-printing-2025",
		title: "The Future of 3D Printing in 2025 and Beyond",
		excerpt: "Explore the latest advancements in 3D printing technology, from high-resolution resin printers to AI-assisted modeling and sustainable materials.",
		image: "/images/blog/placeholder.svg",
		author: "Tycen",
		authorImage: "/images/authors/tycen.jpg",
		date: "April 10, 2025",
		category: "3D Printing",
		tags: [
			"3D Printing",
			"Creality",
			"Manufacturing",
			"Technology"
		],
		featured: false
	},
	{
		id: "web3-blockchain-business",
		title: "How Web3 and Blockchain Are Transforming Business",
		excerpt: "Discover how decentralized technologies are creating new business models and opportunities across industries.",
		image: "/images/blog/web3-blockchain.jpg",
		author: "Tycen",
		authorImage: "/images/authors/tycen.jpg",
		date: "April 5, 2025",
		category: "Blockchain",
		tags: [
			"Blockchain",
			"Web3",
			"Decentralization",
			"Business Innovation"
		],
		featured: false
	},
	{
		id: "3d-printing-manufacturing",
		title: "The Future of Manufacturing: 3D Printing Revolution",
		excerpt: "How additive manufacturing is reshaping production processes and enabling new possibilities in product development.",
		image: "/images/blog/3d-printing-manufacturing.jpg",
		author: "Tycen",
		authorImage: "/images/authors/tycen.jpg",
		date: "March 25, 2025",
		category: "3D Printing",
		tags: [
			"3D Printing",
			"Manufacturing",
			"Product Development",
			"Innovation"
		],
		featured: false
	},
	{
		id: "mobile-app-development-trends",
		title: "Mobile App Development Trends for 2025",
		excerpt: "Stay ahead of the curve with these emerging trends in mobile application development.",
		image: "/images/blog/mobile-app-development.jpg",
		author: "Tycen",
		authorImage: "/images/authors/tycen.jpg",
		date: "March 15, 2025",
		category: "Mobile Development",
		tags: [
			"Mobile Apps",
			"App Development",
			"Cross-Platform",
			"UI/UX"
		],
		featured: false
	}
];
const blogPostsData = {
	posts: posts
};const $$Blog = createComponent(($$result, $$props, $$slots) => {
  const { posts } = blogPostsData;
  const featuredPosts = posts.filter((post) => post.featured);
  const recentPosts = posts.filter((post) => !post.featured);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Blog - NosytLabs", "description": "Explore our blog for insights on AI, web development, mobile apps, and 3D printing technologies.", "data-astro-cid-ijnerlr2": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="relative bg-indigo-700 text-white py-20" data-astro-cid-ijnerlr2> <div class="container mx-auto px-4" data-astro-cid-ijnerlr2> <div class="max-w-3xl animate-fade-in" data-astro-cid-ijnerlr2> <h1 class="text-4xl md:text-5xl font-bold mb-4 animate-slide-up" data-astro-cid-ijnerlr2>Our Blog</h1> <p class="text-xl animate-slide-up" style="animation-delay: 0.2s;" data-astro-cid-ijnerlr2>
Insights, tutorials, and updates from the NosytLabs team.
</p> </div> </div> </div>  <section class="py-20 bg-white" data-astro-cid-ijnerlr2> <div class="container mx-auto px-4" data-astro-cid-ijnerlr2> <div class="text-center mb-16 animate-fade-in" data-astro-cid-ijnerlr2> <h2 class="text-3xl md:text-4xl font-bold mb-4 animate-slide-up" data-astro-cid-ijnerlr2>Featured Posts</h2> <p class="text-lg text-gray-600 max-w-3xl mx-auto animate-slide-up" style="animation-delay: 0.2s;" data-astro-cid-ijnerlr2>
Our most popular and informative articles.
</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-8" data-astro-cid-ijnerlr2> ${featuredPosts.map((post, index) => renderTemplate`<div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in"${addAttribute(`animation-delay: ${0.3 + index * 0.1}s;`, "style")} data-astro-cid-ijnerlr2> <img${addAttribute(post.image, "src")}${addAttribute(post.title, "alt")} class="w-full h-64 object-cover" loading="lazy" data-astro-cid-ijnerlr2> <div class="p-6" data-astro-cid-ijnerlr2> <div class="flex items-center mb-4" data-astro-cid-ijnerlr2> <img${addAttribute(post.authorImage, "src")}${addAttribute(post.author, "alt")} class="w-10 h-10 rounded-full mr-4" loading="lazy" data-astro-cid-ijnerlr2> <div data-astro-cid-ijnerlr2> <div class="font-medium" data-astro-cid-ijnerlr2>${post.author}</div> <div class="text-sm text-gray-500" data-astro-cid-ijnerlr2>${post.date}</div> </div> </div> <h3 class="text-2xl font-bold mb-3 hover:text-indigo-600 transition-colors" data-astro-cid-ijnerlr2> <a${addAttribute(`/blog/${post.id}`, "href")} data-astro-cid-ijnerlr2>${post.title}</a> </h3> <p class="text-gray-600 mb-4" data-astro-cid-ijnerlr2>${post.excerpt}</p> <div class="flex flex-wrap gap-2 mb-4" data-astro-cid-ijnerlr2> ${post.tags.map((tag) => renderTemplate`<span class="px-2 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full" data-astro-cid-ijnerlr2> ${tag} </span>`)} </div> <a${addAttribute(`/blog/${post.id}`, "href")} class="inline-block text-indigo-600 hover:text-indigo-800 font-medium transition-colors" data-astro-cid-ijnerlr2>
Read More &rarr;
</a> </div> </div>`)} </div> </div> </section>  <section class="py-20 bg-gray-50" data-astro-cid-ijnerlr2> <div class="container mx-auto px-4" data-astro-cid-ijnerlr2> <div class="text-center mb-16 animate-fade-in" data-astro-cid-ijnerlr2> <h2 class="text-3xl md:text-4xl font-bold mb-4 animate-slide-up" data-astro-cid-ijnerlr2>Recent Posts</h2> <p class="text-lg text-gray-600 max-w-3xl mx-auto animate-slide-up" style="animation-delay: 0.2s;" data-astro-cid-ijnerlr2>
Stay up to date with our latest articles and insights.
</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-astro-cid-ijnerlr2> ${recentPosts.map((post, index) => renderTemplate`<div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in"${addAttribute(`animation-delay: ${0.3 + index * 0.1}s;`, "style")} data-astro-cid-ijnerlr2> <img${addAttribute(post.image, "src")}${addAttribute(post.title, "alt")} class="w-full h-48 object-cover" loading="lazy" data-astro-cid-ijnerlr2> <div class="p-6" data-astro-cid-ijnerlr2> <div class="flex items-center mb-4" data-astro-cid-ijnerlr2> <img${addAttribute(post.authorImage, "src")}${addAttribute(post.author, "alt")} class="w-8 h-8 rounded-full mr-3" loading="lazy" data-astro-cid-ijnerlr2> <div data-astro-cid-ijnerlr2> <div class="font-medium text-sm" data-astro-cid-ijnerlr2>${post.author}</div> <div class="text-xs text-gray-500" data-astro-cid-ijnerlr2>${post.date}</div> </div> </div> <h3 class="text-xl font-bold mb-3 hover:text-indigo-600 transition-colors" data-astro-cid-ijnerlr2> <a${addAttribute(`/blog/${post.id}`, "href")} data-astro-cid-ijnerlr2>${post.title}</a> </h3> <p class="text-gray-600 mb-4 text-sm" data-astro-cid-ijnerlr2>${post.excerpt}</p> <div class="flex flex-wrap gap-2 mb-4" data-astro-cid-ijnerlr2> ${post.tags.slice(0, 2).map((tag) => renderTemplate`<span class="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full" data-astro-cid-ijnerlr2> ${tag} </span>`)} ${post.tags.length > 2 && renderTemplate`<span class="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full" data-astro-cid-ijnerlr2>
+${post.tags.length - 2} more
</span>`} </div> <a${addAttribute(`/blog/${post.id}`, "href")} class="inline-block text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors" data-astro-cid-ijnerlr2>
Read More &rarr;
</a> </div> </div>`)} </div> </div> </section>  <section class="py-20 bg-indigo-700 text-white" data-astro-cid-ijnerlr2> <div class="container mx-auto px-4" data-astro-cid-ijnerlr2> <div class="max-w-3xl mx-auto text-center animate-fade-in" data-astro-cid-ijnerlr2> <h2 class="text-3xl md:text-4xl font-bold mb-6 animate-slide-up" data-astro-cid-ijnerlr2>Subscribe to Our Newsletter</h2> <p class="text-xl mb-8 animate-slide-up" style="animation-delay: 0.2s;" data-astro-cid-ijnerlr2>
Get the latest articles, tutorials, and updates delivered straight to your inbox.
</p> <form class="flex flex-col md:flex-row gap-4 animate-fade-in" style="animation-delay: 0.4s;" data-astro-cid-ijnerlr2> <input type="email" placeholder="Enter your email address" class="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" required data-astro-cid-ijnerlr2> <button type="submit" class="bg-white text-indigo-700 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1" data-astro-cid-ijnerlr2>
Subscribe
</button> </form> <p class="text-sm mt-4 text-indigo-200 animate-fade-in" style="animation-delay: 0.5s;" data-astro-cid-ijnerlr2>
We respect your privacy. Unsubscribe at any time.
</p> </div> </div> </section> ` })} `;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/blog.astro", void 0);

const $$file = "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/blog.astro";
const $$url = "/blog.html";export{$$Blog as default,$$file as file,$$url as url};