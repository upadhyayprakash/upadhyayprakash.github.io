// Exact copies of Prakash's LinkedIn captions, kept as posted, keyed by the entry's slug.
export const bodies: Record<string, string> = {
  'hdr-brightness-spike': `[CSSWG] [HDR]

So this afternoon, in a dimly lit cafe, I was casually checking LinkedIn job listing alerts in my Yahoo Mailbox (Chrome), and I noticed that one of the company logo was glowing intensely. It looked like an LED flash in the shape of logo (square blocks).

I knew it wasn't the display issue, but was wondering why are other whites on the page not as bright as this company logo?

When I showed the isuue to a friend by taking a screenshot, the glow disappeared. It felt magical.

Turns out, HDR can do that.

HDR (High Dynamic Range) can display brighter highlights and greater contrast than SDR (Standard Dynamic Range), which uses a more limited brightness range.

Coming back, the company logo appeared to have an HDR colour profile pushing its white level to 10,000 nits (PQ-encoded logo image export). Modern screens can render highlights far brighter than normal white, but screenshots saved in SDR lose that effect.

Here's the accessibility gap that caught my attention:

→ We have prefers-reduced-motion for people who want less motion. We have no equivalent for sudden brightness spikes.
→ Developers can limit HDR brightness using CSS, but this safeguard appears on just 0.66% of page loads.
→ Dimming the screen isn't a real fix. It dims the text, too.

My proposal:

① A browser/OS setting to cap HDR brightness across websites.
② A CSS media query that lets websites adapt HDR content to user preferences.

I've shared the proposal, live demo and CSS Working Group issue in the first comment.

Have you experienced sudden brightness spikes while browsing, particularly with light sensitivity, migraines or low vision? I'd like to hear about real-world cases.

#Accessibility #CSS #WebStandards #HDR`,

  orb: `Why an "orb"?

I built the "orb": the orange "o" from the noui logo, as a real thing. A small Web Component called <𝚗𝚘𝚞𝚒-𝚘𝚛𝚋>.

𝗪𝗵𝗮𝘁 𝗶𝘁 𝗱𝗼𝗲𝘀:
• You tell it what is happening (listening, thinking, working, speaking) and it draws and moves accordingly.
• It swells and shifts with the loudness and pace of the audio you feed it
• Gestures like nod, shake and point, and it respects reduced motion

𝗛𝗼𝘄 𝗶𝘁 𝗯𝗲𝗵𝗮𝘃𝗲𝘀:
• One animation loop at your display's refresh rate. Motion is tuned to look the same at 60 fps and at 15 fps
• Zero GPU work when it is off screen or the tab is hidden
• If a device struggles it lowers its own detail, then restores it
• Falls back to a CSS orb when WebGL is unavailable
• About 16 KB gzipped, no dependencies, MIT

It is a surface for voice. It listens, thinks, works through steps and speaks, and it is the place an interface can come from.

𝚗𝚙𝚖 𝚒 @𝚗𝚘𝚞𝚒𝚜𝚒/𝚘𝚛𝚋, then drop <𝚗𝚘𝚞𝚒-𝚘𝚛𝚋> into any page.
𝗗𝗲𝗺𝗼: https://noui.si/lab/orb`,

  'logo-story': `noui.si's logo started with three rules and ended with one missing dot.

The rules:
- All four letters of "noui".
- One or two colors.
- It must work as a tiny browser tab icon.

The big lesson came early. At 16 pixels, nobody reads letters. They recognize shapes. So "no" went on top and "ui" below, in a small square.

Then I noticed the o sitting right above the i. Why give the i its own dot when the o can be the dot?

The animation follows the same idea as the product: something small turning into what it needs to be. The i's stem springs and flings its dot up into the orange o.

I built it over one evening with Claude (Anthropic), which made exploring cheap and kept me honest about what wouldn't work. The decisions, though, all came down to one question: does this feel like noui?

At this point, I don't know if I'm a coder or a designer. 😜

----

Funny how a logo for a product called "no UI" ended up being about removing one more thing: a dot.

What do you see first, the letters or the shape?

#Branding #LogoDesign #AI #BuildInPublic`,

  'react-freeze': `"It only showed up when we tested with a realistic event, 150+ participants. Small test data hid it completely."

----

During big certificate publishes, our CertPulse admin screen froze. Tabs, menu, every click. Then every click landed at once.

The cause was one React pattern: a network call inside an async function passed to "startTransition()".

Why it freezes? 🤔
in React 19 an async transition holds its lane open until the action settles, and React Router navigates through a transition too. So a tab click waits behind the publish request.

Once identified, followed the fix, ESLint guardrails and the "Big change" (Async Job Queue.

#React #WebDevelopment #AsyncProcessing`,

  'ride-booking': `Booking a ride shouldn't take this many decisions. 🚕

What if the screen rebuilt itself around what you need, and kept rebuilding as things changed?

Watch this 40 seconds, scripted prototype (an early exploration)

(Experience it - Link in the first comment)

#UXDesign #ProductDesign #GenerativeUI #Interfaces`,

  'byte-04': `Engineering Byte (Episode 04)

For five days, my app counted a robot as a real person opening their certificate. 🤖

I found it testing link previews, then traced it while writing up how the feature works.

A minute on the bug: the link preview and the certificate page used the same backend call.

I added a view counter to that call, and I forgot the preview bot was a caller too. What a side effect is, how the one-line patch works, and the habit I took from it.

Behind the scenes at CertPulse. Byte 04: one lesson, in about a minute.

#EngineeringBytes #SocialMediaSharing #APIDesign`,

  'byte-03': `"My first test PDF was carrying 2,000 letters it didn't need." 🔤

Making PDFs is the heart of CertPulse, so I wanted every certificate lean before it reached a participant.

A minute on how I found the problem, weighed my own fix against the library's, and measured before and after: one font inside a PDF went from 74 KB to under 3 KB for a full name, and with the move from PNG images, each certificate went from about 2 MB to under 300 KB.

Engineering Bytes, behind the scenes at CertPulse. Byte 03: one lesson, in about a minute.

#SoftwareEngineering #PDF #CertPulse`,

  'byte-02': `How do you remember someone you've promised to forget? 🤔

That was the puzzle when I built blocking for CertPulse.

50 seconds on why my blocklist stores HMACs, not email addresses, and the guessing attack a plain SHA-256 would have fallen for.

Engineering Byte 02: one lesson from building CertPulse, in under a minute.

#BuildInPublic #Privacy #Security #SoftwareEngineering #CertPulse`,

  'byte-01': `A screen that says it worked when it didnt is worse than an error message. ❌

I almost shipped one. 🤞

"57 seconds" (tech-byte) on the bug I caught before release, and why I now walk through the screens and not just the database.

This is the first Engineering Byte: one engineering lesson from building CertPulse, in under a minute.

#EngineeringByte #SaaS #UX #CertPulse`,

  sitemap: `🚀 𝗦𝗺𝗮𝗹𝗹 𝗳𝗶𝗹𝗲. 𝗕𝗶𝗴 𝗶𝗺𝗽𝗮𝗰𝘁!

Today, I focused on something that works quietly in the background but plays a huge role in how search engines discover and rank your website - sitemap.xml

✅ 𝗪𝗵𝘆 𝗶𝘁 𝗺𝗮𝘁𝘁𝗲𝗿𝘀: A sitemap helps search engines crawl your site smarter, understand your structure, and index your pages faster. It's essential for SEO (and GEO?), especially as your site grows.

🛠️ 𝗪𝗵𝗮𝘁 𝗜 𝗯𝘂𝗶𝗹𝘁 𝘁𝗼𝗱𝗮𝘆: A scalable, auto-generated sitemap that pulls in URLs from my static site (Next.js) and blog posts written in MDX.
• Auto-builds XML syntax
• Groups all important pages (static + blog)
• Adds metadata like last modified, change frequency & priority
• Ready to scale as I add more content

Now every time I publish a new MDX blog, the sitemap updates automatically. Less manual work, better SEO. ✅

Check it out: https://lnkd.in/dx5DMzMd

Small step today, stronger foundation for tomorrow. 💪

#SEO #GEO #Sitemap #WebDevelopment #NextJS #MDX`,

  yogijio: `Presenting my first web app concept in FIGMA for one of my client in Yoga training industry.

U̳s̳e̳r̳:̳
"Yogijio" is a portfolio web app for Yoga trainers who need their online presence help them get clients (yoga students) and to build a community around them.

U̳s̳e̳c̳a̳s̳e̳s̳:̳
- To have a public platform to share their Yog asans videos.
- Guide their student to choose the appropriate practice segment (Beginner, Intermediate, or Advanced)
- Enroll for classes

This is v1 of the Yogijio app design and after couple of small iterations (adding animations and interactions), I'll start with app development.

I'd be using my favorites NextJS (frontend) and NestJS (backend), which are both javascript frameworks.

T̳o̳o̳l̳s̳ ̳U̳s̳e̳d̳:̳
1. Figma: A web app that has a vast community of plugins that makes app designing a cakewalk for beginners.
2. UnSplash: Get millions of images for all your needs, royalty-free
3. Vector Icons: Used many different websites (Free) for getting the appropriate SVG illustrations.

Link to FIGMA Prototype: https://lnkd.in/gT8aSqv

I'll also share my color palette and typeface details once the design is finalized.

#uidesign #uiux #figma #frontend #startups #yogijio #nextjs #nestjs #webapp`,

  potholes: `Over 𝟭𝟬,𝟬𝟬𝟬 road accidents in India, are caused by potholes and bad patches on the roads, with over 𝟑𝟑% fatality rate. (data for 2017 as per MRTH, India)

To tackle the problem arising from potholes, we need a scalable model that's assisted by Artificial Intelligence.

So during my training for an Extensive Vision AI (EVA) course with The School of AI, I trained a YOLOv3 model for potholes detection using transfer learning.

𝗧𝗼𝗼𝗹 𝗨𝘀𝗲𝗱:
- Pretrained weights for YOLOv3 with manually annotated 500 data samples for 𝟮𝟬𝟬 epochs.
- YOLOv3 𝗔𝗻𝗻𝗼𝘁𝗮𝘁𝗶𝗼𝗻 𝗧𝗼𝗼𝗹 (https://lnkd.in/gWSeUdp)
- Google Colab with Tesla-P100 (16 G)
- 𝗳𝗳𝗺𝗽𝗲𝗴 for video to frame construction

To explore more, have a look at this Colab Notebook:
https://lnkd.in/g7RH7ax

Hope to see patroling vehicles equipped with such techs that can estimate the city road condition and repair them quickly.

Thanks Rohan Shravan for all the research work and in-depth coaching.

Stay tuned for more cool stuffs coming soon.

#YOLOv3 #potholeDetection #googleColab #theSchoolOfAI #EVA`,
};
