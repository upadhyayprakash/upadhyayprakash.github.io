// Everything Prakash shares on LinkedIn. Add a real entry when a link arrives; a type gets its
// filter on the Content page once it has at least one entry.
export type ContentType = 'post' | 'video' | 'article' | 'carousel' | 'short';

export interface ContentEntry {
  type: ContentType;
  year: string;
  date: string;
  title: string;
  tags: string;
  url: string;
  thumb?: string;
  thumbAlt?: string;
  thumbNote?: string;
  // Set when the post is replicated on the site at /content/<slug>
  slug?: string;
  video?: string;
}

export const types: { id: ContentType; label: string; single: string }[] = [
  { id: 'post', label: 'Posts', single: 'Post' },
  { id: 'video', label: 'Videos', single: 'Video' },
  { id: 'article', label: 'Articles', single: 'Article' },
  { id: 'carousel', label: 'Carousels', single: 'Carousel' },
  { id: 'short', label: 'Shorts', single: 'Short' },
];

export const entries: ContentEntry[] = [
  {
    type: 'post',
    year: '2026',
    date: '18 Oct 2026',
    title: 'The HDR brightness spike and a call for use cases',
    tags: 'Accessibility · HDR · Web standards',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7517649277150597121/',
    thumb: '/images/hdr/photo-comparison.jpg',
    thumbAlt:
      'Two phone photos of an inbox: a logo glowing far brighter than the page, and the same logo with the brightness preference respected.',
    slug: 'hdr-brightness-spike',
  },
  {
    type: 'post',
    year: '2026',
    date: '10 Oct 2026',
    title: 'The orb: the orange o of noui as a Web Component',
    tags: 'noui · Web Components · Open source',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7514569283327197185/',
    thumb: '/content-media/orb.jpg',
    thumbAlt: '',
    video: '/content-media/orb.mp4',
    slug: 'orb',
  },
  {
    type: 'article',
    year: '2026',
    date: '10 Oct 2026',
    title: 'The logo that lost a dot',
    tags: 'noui · Brand · Logo design',
    url: 'https://www.linkedin.com/pulse/logo-lost-dot-prakash-upadhyay-wpfbf/',
    thumb: '/blog/noui-logo/cover.png',
    thumbAlt: 'The noui mark before and after: the i loses its dot and the orange o becomes it.',
  },
  {
    type: 'short',
    year: '2026',
    date: '7 Oct 2026',
    title: 'The logo that lost a dot, in a short video',
    tags: 'noui · Brand · Logo design',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7513582342381330432/',
    thumb: '/content-media/logo-story.jpg',
    thumbAlt: '',
    video: '/content-media/logo-story.mp4',
    slug: 'logo-story',
  },
  {
    type: 'post',
    year: '2026',
    date: '6 Oct 2026',
    title: 'When a React transition froze the CertPulse admin screen',
    tags: 'CertPulse · React · Async',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7513307070729932800/',
    thumb: '/content-media/react-freeze.jpg',
    thumbAlt: '',
    video: '/content-media/react-freeze.mp4',
    slug: 'react-freeze',
  },
  {
    type: 'short',
    year: '2026',
    date: '6 Oct 2026',
    title: "Booking a ride shouldn't take this many decisions",
    tags: 'noui · Interfaces · Prototype',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7513133825233977344/',
    thumb: '/content-media/ride-booking.jpg',
    thumbAlt: '',
    video: '/content-media/ride-booking.mp4',
    slug: 'ride-booking',
  },
  {
    type: 'article',
    year: '2026',
    date: '2 Oct 2026',
    title: 'What if software could shape its own interface?',
    tags: 'noui · Interfaces · AI',
    url: 'https://www.linkedin.com/pulse/what-software-could-shape-its-own-interface-prakash-upadhyay-ueumf',
    thumb: '/blog/noui-interface/cover.png',
    thumbAlt: 'Cover: What if software could shape its own interface? with floating interface cards.',
  },
  {
    type: 'short',
    year: '2026',
    date: '2 Oct 2026',
    title: 'Engineering Byte 04: when a robot counted as a real person',
    tags: 'CertPulse · API design',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7511848900648157184/',
    thumb: '/content-media/byte-04.jpg',
    thumbAlt: '',
    video: '/content-media/byte-04.mp4',
    slug: 'byte-04',
  },
  {
    type: 'short',
    year: '2026',
    date: '1 Oct 2026',
    title: "Engineering Byte 03: a PDF carrying 2,000 letters it didn't need",
    tags: 'CertPulse · PDF · Performance',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7511481878525227008/',
    thumb: '/content-media/byte-03.jpg',
    thumbAlt: '',
    video: '/content-media/byte-03.mp4',
    slug: 'byte-03',
  },
  {
    type: 'article',
    year: '2026',
    date: '30 Sep 2026',
    title: '5 things I got wrong building account deletion for a solo SaaS',
    tags: 'CertPulse · Privacy · Solo SaaS',
    url: 'https://www.linkedin.com/pulse/5-things-i-got-wrong-building-account-deletion-solo-saas-upadhyay-ywytf/',
    thumb: '/blog/account-deletion/cover.png',
    thumbAlt: 'Cover: 5 things I got wrong building account deletion, with a terminal reading Blocked, crossed out.',
  },
  {
    type: 'short',
    year: '2026',
    date: '30 Sep 2026',
    title: 'Engineering Byte 02: remembering someone you promised to forget',
    tags: 'CertPulse · Privacy · Security',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7511161061988032512/',
    thumb: '/content-media/byte-02.jpg',
    thumbAlt: '',
    video: '/content-media/byte-02.mp4',
    slug: 'byte-02',
  },
  {
    type: 'short',
    year: '2026',
    date: '30 Sep 2026',
    title: "Engineering Byte 01: a screen that says it worked when it didn't",
    tags: 'CertPulse · UX',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7511128977126891520/',
    thumb: '/content-media/byte-01.jpg',
    thumbAlt: '',
    video: '/content-media/byte-01.mp4',
    slug: 'byte-01',
  },
  {
    type: 'post',
    year: '2026',
    date: '17 Jun 2026',
    title: 'A sitemap that updates itself',
    tags: 'SEO · Next.js · MDX',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7473007334697373696/',
    slug: 'sitemap',
  },
  {
    type: 'post',
    year: '2021',
    date: '25 Mar 2021',
    title: 'Yogijio: my first web app concept in Figma',
    tags: 'UI design · Figma',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:6780934404509442048/',
    slug: 'yogijio',
  },
  {
    type: 'video',
    year: '2020',
    date: '2 May 2020',
    title: 'Detecting potholes with YOLOv3',
    tags: 'Computer vision · Transfer learning',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:6662377244096376832/',
    slug: 'potholes',
  },
];
