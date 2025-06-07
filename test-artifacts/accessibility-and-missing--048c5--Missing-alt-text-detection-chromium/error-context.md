# Test info

- Name: Accessibility and Missing Elements Detection >> Missing alt text detection
- Location: C:\Users\Tyson\Desktop\Development Tools\nosytlabs-github-ready\tests\accessibility-and-missing-elements.spec.js:15:3

# Error details

```
TimeoutError: page.goto: Timeout 30000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

    at C:\Users\Tyson\Desktop\Development Tools\nosytlabs-github-ready\tests\accessibility-and-missing-elements.spec.js:11:16
```

# Page snapshot

```yaml
- link "Skip to main content":
  - /url: "#main-content"
- link "Skip to main content":
  - /url: "#main-content"
- banner:
  - link "Skip to main content":
    - /url: "#main-content"
  - link "NosytLabs Home":
    - /url: /
    - text: N NosytLabs Notable Opportunities
  - navigation "Main navigation":
    - menubar:
      - menuitem "Services"
      - menuitem "Projects"
      - menuitem "Content"
    - menubar:
      - menuitem "Income"
      - menuitem "Mining"
      - menuitem "3D Print"
    - menubar:
      - menuitem "NosytOS95"
      - menuitem "Live"
  - button "Search"
  - button "Switch to dark mode"
  - link "Get Started":
    - /url: /contact
- main:
  - region "NosytLabs Notable Opportunities Shape Your Tomorrow":
    - text: Established 2025 • Innovative Solutions
    - heading "NosytLabs Notable Opportunities Shape Your Tomorrow" [level=1]
    - paragraph: Innovative digital solutions including web development, AI integration, content creation, 3D printing services, and passive income strategies.
    - link "Explore Services":
      - /url: /services
    - link "View Projects":
      - /url: /projects
    - text: Trusted by 25+ clients Fast delivery guaranteed 100% satisfaction rate
    - img "NosytLabs Digital Solutions"
    - text: Est. 2025 Innovation Leader 50+ Projects Completed 25+ Happy Clients 5+ Years Experience 24/7 Support Available
  - region "Our Services Transform Your Ideas Into Reality":
    - heading "Our Services Transform Your Ideas Into Reality" [level=2]
    - paragraph: Professional services designed to accelerate your digital transformation and business growth
    - article:
      - text: ⭐ Most Popular
      - heading "Web Development" [level=3]
      - text: From $2,500 2-4 weeks
      - paragraph: Custom websites and web applications built with modern technologies
      - list:
        - listitem: Responsive Design
        - listitem: SEO Optimized
        - listitem: Fast Performance
      - link "Learn more about Web Development":
        - /url: /services#web-development
        - text: Start Project
      - button "Quick contact for Web Development": Quick Chat
    - article:
      - heading "AI Integration" [level=3]
      - text: From $1,500 1-3 weeks
      - paragraph: Integrate AI tools and automation into your existing workflows
      - list:
        - listitem: Custom AI Solutions
        - listitem: Workflow Automation
        - listitem: Data Analysis
      - link "Learn more about AI Integration":
        - /url: /services#ai-integration
        - text: Get Started
      - button "Quick contact for AI Integration": Quick Chat
    - article:
      - heading "Content Creation" [level=3]
      - text: From $500 1-2 weeks
      - paragraph: Professional video content and educational materials
      - list:
        - listitem: Video Production
        - listitem: Tutorial Creation
        - listitem: Live Streaming
      - link "Learn more about Content Creation":
        - /url: /services#content-creation
        - text: Create Content
      - button "Quick contact for Content Creation": Quick Chat
    - link "View All Services":
      - /url: /services
  - region "ROI Calculators Calculate Your Potential Returns":
    - heading "ROI Calculators Calculate Your Potential Returns" [level=2]
    - paragraph: Use our interactive calculators to estimate potential returns on various investments and projects
    - heading "Passive Income ROI" [level=3]
    - paragraph: Calculate potential returns from passive income streams
    - text: Initial Investment ($)
    - button "Initial Investment ($)": "1000"
    - text: Enter initial investment ($) Monthly Income ($)
    - button "Monthly Income ($)": "50"
    - text: Enter monthly income ($) Time Period (months)
    - button "Time Period (months)": "12"
    - text: Enter time period (months)
    - button "Calculate Passive Income ROI": Calculate ROI
    - text: Enter values and click Calculate to see results
    - heading "Web Development ROI" [level=3]
    - paragraph: Calculate ROI for web development projects
    - text: Project Cost ($)
    - button "Project Cost ($)": "5000"
    - text: Enter project cost ($) Monthly Revenue Increase ($)
    - button "Monthly Revenue Increase ($)": "1000"
    - text: Enter monthly revenue increase ($) Timeline (months)
    - button "Timeline (months)": "24"
    - text: Enter timeline (months)
    - button "Calculate Web Development ROI": Calculate ROI
    - text: Enter values and click Calculate to see results
    - heading "Investment ROI" [level=3]
    - paragraph: Calculate returns on various investment strategies
    - text: Investment Amount ($)
    - button "Investment Amount ($)": "10000"
    - text: Enter investment amount ($) Annual Return (%)
    - button "Annual Return (%)": "7"
    - text: Enter annual return (%) Investment Period (years)
    - button "Investment Period (years)": "10"
    - text: Enter investment period (years)
    - button "Calculate Investment ROI": Calculate ROI
    - text: Enter values and click Calculate to see results
    - paragraph:
      - strong: "Disclaimer:"
      - text: These calculators provide estimates based on the inputs provided. Actual results may vary and past performance does not guarantee future results. Please consult with financial professionals for investment advice.
    - heading "Need Help With Your Calculations?" [level=3]
    - paragraph: Our team can help you create custom ROI models and financial projections for your specific needs.
    - link "Get Expert Help":
      - /url: /contact?service=consulting
  - heading "Featured Projects" [level=2]
  - paragraph: Discover our portfolio of innovative projects built with modern technologies like React, Astro, and AI integration. Each project demonstrates our commitment to quality, performance, and user experience.
  - img "NosytLabs Website"
  - heading "NosytLabs Website" [level=4]
  - heading "NosytLabs Website" [level=3]
  - paragraph: A modern, responsive website built with Astro and TailwindCSS featuring interactive components, dark mode support, and a Windows 95-inspired desktop interface. Includes blog functionality, project portfolio, and service pages with advanced animations and user experience features.
  - text: Astro JavaScript TailwindCSS HTML5 CSS3
  - link "View Project":
    - /url: https://github.com/NosytLabs/nosytlabs.com
  - img "Crypto Mining Calculator"
  - heading "Crypto Mining Calculator" [level=4]
  - heading "Crypto Mining Calculator" [level=3]
  - paragraph: A web-based cryptocurrency mining profitability calculator that helps miners evaluate potential earnings based on hardware specifications, electricity costs, and current market conditions. Features real-time price data integration and customizable mining scenarios.
  - text: JavaScript HTML5 CSS3 Chart.js CoinGecko API
  - link "View Project":
    - /url: https://github.com/NosytLabs
  - img "Kick.com MCP Integration"
  - heading "Kick.com MCP Integration" [level=4]
  - heading "Kick.com MCP Integration" [level=3]
  - paragraph: A Model Context Protocol (MCP) server integration for Kick.com streaming platform, enabling automated chat interactions and stream management. Provides API connectivity for content creators to enhance their streaming experience with programmatic controls.
  - text: JavaScript Node.js MCP Protocol Kick.com API
  - link "View Project":
    - /url: https://github.com/NosytLabs/KickMCP
  - img "NosytOS95"
  - heading "NosytOS95" [level=4]
  - heading "NosytOS95" [level=3]
  - paragraph: A Windows 95-inspired web interface featuring classic applications like Doom II, Duck Hunt, Notepad, and AI chat functionality. Includes authentic sounds, animations, and a command line terminal with working file system simulation. A creative showcase of front-end development skills.
  - text: JavaScript HTML5 CSS3 Canvas API Web Audio API
  - link "View Project":
    - /url: https://github.com/NosytLabs/nosytlabs.com
  - link "View All Projects":
    - /url: /projects
  - heading "Content Creation" [level=2]
  - paragraph: Stay updated with our latest technology content featuring in-depth coding tutorials, AI tool reviews, crypto mining insights, and live development sessions. Join our growing community of tech enthusiasts.
  - heading "Latest YouTube Videos" [level=3]
  - link "Unknown Video":
    - /url: https://www.youtube.com/watch?v=undefined
    - img "Unknown Video"
  - link "Unknown Video":
    - /url: https://www.youtube.com/watch?v=undefined
    - heading "Unknown Video" [level=4]
  - paragraph: 0 views views •
  - link "Unknown Video":
    - /url: https://www.youtube.com/watch?v=undefined
    - img "Unknown Video"
  - link "Unknown Video":
    - /url: https://www.youtube.com/watch?v=undefined
    - heading "Unknown Video" [level=4]
  - paragraph: 0 views views •
  - link "Unknown Video":
    - /url: https://www.youtube.com/watch?v=undefined
    - img "Unknown Video"
  - link "Unknown Video":
    - /url: https://www.youtube.com/watch?v=undefined
    - heading "Unknown Video" [level=4]
  - paragraph: 0 views views •
  - link "Visit YouTube Channel":
    - /url: https://www.youtube.com/@TycenYT
  - heading "Live on Kick.com" [level=3]
  - iframe
  - paragraph: Join us live on Kick.com for coding sessions, tech discussions, and gaming streams. Follow the channel to get notified when we go live.
  - link "Watch Live Stream":
    - /url: https://kick.com/Tycen
  - heading "3D Printing Services" [level=2]
  - paragraph: Professional 3D printing services using industry-leading Creality and Elegoo printers. From rapid prototyping to detailed miniatures, we deliver high-quality prints with precision and attention to detail.
  - heading "Custom 3D Printing" [level=3]
  - paragraph: "Our 3D printing services use the latest technology to create high-quality prints for various applications:"
  - list:
    - listitem: Prototyping for product development
    - listitem: Custom models and figurines
    - listitem: Functional parts and components
    - listitem: Architectural models and displays
    - listitem: Educational tools and visual aids
  - paragraph: We use a Creality Ender 3 S1 Pro for FDM printing and an Elegoo Saturn 2 for resin printing, allowing us to create both functional parts and highly detailed models.
  - link "Learn More":
    - /url: /3d-printing
  - img "Sample 3D Prints"
  - heading "Our 3D Printing Equipment" [level=4]
  - img "Creality Ender 3 S1 Pro"
  - paragraph: Creality Ender 3 S1 Pro (FDM)
  - img "Elegoo Saturn 2"
  - paragraph: Elegoo Saturn 2 (Resin)
  - img "About NosytLabs"
  - paragraph: Est. 2025
  - heading "About NosytLabs" [level=2]
  - paragraph: Founded in 2025, NosytLabs represents the innovative spirit of NOSYT LLC, where we believe that Notable Opportunities Shape Your Tomorrow. We're passionate about leveraging cutting-edge technology to create meaningful solutions that drive real-world impact.
  - paragraph: Our expertise spans modern web development, AI-powered applications, engaging content creation, and precision 3D printing. Through our YouTube channel (@TycenYT) and live streams on Kick.com/Tycen, we share knowledge, build community, and demonstrate the latest in technology innovation.
  - heading "Our Core Offerings" [level=3]
  - list:
    - listitem: Custom web development with React, Astro, and modern frameworks
    - listitem: Technology content creation on YouTube and Kick.com
    - listitem: 3D printing services with Creality Ender 3 S1 Pro (FDM) and Elegoo Saturn 2 (resin)
    - listitem: Educational resources on passive income opportunities
    - listitem: Open-source GitHub projects and development tools
  - link "Learn More":
    - /url: /about
  - link "Contact Us":
    - /url: /contact
  - heading "Ready to Get Started?" [level=2]
  - paragraph: Contact us today to discuss your project requirements and how we can help bring your ideas to life.
  - link "Contact Us":
    - /url: /contact
  - link "Explore Services":
    - /url: /services
- contentinfo:
  - img "NosytLabs Logo"
  - text: NosytLabs
  - paragraph: Notable Opportunities Shape Your Tomorrow
  - link "Follow us on YouTube":
    - /url: https://www.youtube.com/@TycenYT
  - link "Follow us on Kick":
    - /url: https://kick.com/Tycen
  - link "Follow us on GitHub":
    - /url: https://github.com/NosytLabs
  - heading "Quick Links" [level=3]
  - list:
    - listitem:
      - link "Home":
        - /url: /
    - listitem:
      - link "About":
        - /url: /about
    - listitem:
      - link "Skills":
        - /url: /skills
    - listitem:
      - link "Projects":
        - /url: /projects
    - listitem:
      - link "Content Creation":
        - /url: /content-creation
  - heading "Services" [level=3]
  - list:
    - listitem:
      - link "Web Development":
        - /url: /services#web-development
    - listitem:
      - link "Content Creation":
        - /url: /content-creation
    - listitem:
      - link "3D Printing Services":
        - /url: /3d-printing
    - listitem:
      - link "Passive Income Resources":
        - /url: /passive-income
    - listitem:
      - link "SEO & Website Audits":
        - /url: /services#seo
  - heading "Contact Us" [level=3]
  - list:
    - listitem:
      - link "contact@nosytlabs.com":
        - /url: mailto:contact@nosytlabs.com
    - listitem: United States
    - listitem:
      - link "Contact Us":
        - /url: /contact
  - text: © 2025 NosytLabs. All rights reserved.
  - link "Passive Income":
    - /url: /passive-income
  - link "NosytOS95":
    - /url: /nosytos95
  - link "Contact":
    - /url: /contact
  - link "Privacy Policy":
    - /url: /privacy-policy
  - link "Terms of Service":
    - /url: /terms-of-service
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | /**
   4 |  * Comprehensive Accessibility and Missing Elements Testing
   5 |  * Scans for missing elements, broken links, accessibility issues, and content gaps
   6 |  */
   7 |
   8 | test.describe('Accessibility and Missing Elements Detection', () => {
   9 |   
   10 |   test.beforeEach(async ({ page }) => {
>  11 |     await page.goto('/');
      |                ^ TimeoutError: page.goto: Timeout 30000ms exceeded.
   12 |     await page.waitForLoadState('networkidle');
   13 |   });
   14 |
   15 |   test('Missing alt text detection', async ({ page }) => {
   16 |     const images = page.locator('img');
   17 |     const imageCount = await images.count();
   18 |     
   19 |     console.log(`Found ${imageCount} images to check for alt text`);
   20 |     
   21 |     for (let i = 0; i < imageCount; i++) {
   22 |       const img = images.nth(i);
   23 |       const alt = await img.getAttribute('alt');
   24 |       const src = await img.getAttribute('src');
   25 |       const isDecorative = await img.getAttribute('role') === 'presentation' || 
   26 |                           await img.getAttribute('aria-hidden') === 'true';
   27 |       
   28 |       if (!isDecorative) {
   29 |         expect(alt, `Image ${src} is missing alt text`).toBeTruthy();
   30 |         expect(alt.length, `Alt text for ${src} should be descriptive`).toBeGreaterThan(3);
   31 |       }
   32 |     }
   33 |   });
   34 |
   35 |   test('Broken links detection', async ({ page }) => {
   36 |     const links = page.locator('a[href]');
   37 |     const linkCount = await links.count();
   38 |     
   39 |     console.log(`Found ${linkCount} links to check`);
   40 |     
   41 |     const brokenLinks = [];
   42 |     
   43 |     for (let i = 0; i < Math.min(linkCount, 50); i++) { // Limit to 50 links for performance
   44 |       const link = links.nth(i);
   45 |       const href = await link.getAttribute('href');
   46 |       
   47 |       if (href && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:')) {
   48 |         try {
   49 |           if (href.startsWith('http')) {
   50 |             // External link - check if it's reachable
   51 |             const response = await page.request.head(href);
   52 |             if (response.status() >= 400) {
   53 |               brokenLinks.push({ href, status: response.status() });
   54 |             }
   55 |           } else if (href.startsWith('/') || href.startsWith('#')) {
   56 |             // Internal link - check if target exists
   57 |             if (href.startsWith('#')) {
   58 |               const targetId = href.substring(1);
   59 |               const target = page.locator(`#${targetId}`);
   60 |               const targetExists = await target.count() > 0;
   61 |               if (!targetExists) {
   62 |                 brokenLinks.push({ href, error: 'Target element not found' });
   63 |               }
   64 |             } else {
   65 |               // Internal page link - would need navigation to test fully
   66 |               // For now, just check if it's a reasonable path
   67 |               expect(href).toMatch(/^\/[a-zA-Z0-9\-_\/]*$/);
   68 |             }
   69 |           }
   70 |         } catch (error) {
   71 |           brokenLinks.push({ href, error: error.message });
   72 |         }
   73 |       }
   74 |     }
   75 |     
   76 |     if (brokenLinks.length > 0) {
   77 |       console.log('Broken links found:', brokenLinks);
   78 |     }
   79 |     
   80 |     expect(brokenLinks.length, `Found ${brokenLinks.length} broken links: ${JSON.stringify(brokenLinks)}`).toBe(0);
   81 |   });
   82 |
   83 |   test('Missing form labels and accessibility', async ({ page }) => {
   84 |     const inputs = page.locator('input, textarea, select');
   85 |     const inputCount = await inputs.count();
   86 |     
   87 |     for (let i = 0; i < inputCount; i++) {
   88 |       const input = inputs.nth(i);
   89 |       const type = await input.getAttribute('type');
   90 |       
   91 |       // Skip hidden inputs
   92 |       if (type === 'hidden') continue;
   93 |       
   94 |       const id = await input.getAttribute('id');
   95 |       const ariaLabel = await input.getAttribute('aria-label');
   96 |       const ariaLabelledby = await input.getAttribute('aria-labelledby');
   97 |       const placeholder = await input.getAttribute('placeholder');
   98 |       
   99 |       // Check for associated label
  100 |       let hasLabel = false;
  101 |       if (id) {
  102 |         const label = page.locator(`label[for="${id}"]`);
  103 |         hasLabel = await label.count() > 0;
  104 |       }
  105 |       
  106 |       // Input should have some form of labeling
  107 |       const hasAccessibleName = hasLabel || ariaLabel || ariaLabelledby;
  108 |       expect(hasAccessibleName, `Input of type "${type}" lacks accessible labeling`).toBe(true);
  109 |       
  110 |       // Placeholder should not be the only form of labeling
  111 |       if (!hasAccessibleName && placeholder) {
```