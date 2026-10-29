// Everything Prakash shares on LinkedIn. Add a real entry when a link arrives; placeholders show
// the types that are still missing and disappear once a real entry of that type exists.
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
    title: '[Working title] The HDR brightness spike and a call for use cases',
    tags: 'Accessibility · HDR · Web standards',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7517649277150597121/',
    thumb: '/images/hdr/photo-comparison.jpg',
    thumbAlt:
      'Two phone photos of an inbox: a logo glowing far brighter than the page, and the same logo with the brightness preference respected.',
    thumbNote: 'Stand-in thumbnail',
  },
  {
    type: 'article',
    year: '2026',
    date: '[Date]',
    title: '[Title to confirm] What if software could shape its own interface?',
    tags: 'noui · Interfaces · AI',
    url: 'https://www.linkedin.com/pulse/what-software-could-shape-its-own-interface-prakash-upadhyay-ueumf',
  },
];
