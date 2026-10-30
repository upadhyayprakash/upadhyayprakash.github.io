export const site = {
  name: 'Prakash Upadhyay',
  role: 'Product-focused full-stack engineer',
  url: 'https://upadhyayprakash.github.io',
  email: 'prakash.upadhyay93@yahoo.com',
  // The Apps Script /exec URL for the contact form; see apps-script/README.md.
  contactUrl: 'https://script.google.com/macros/s/AKfycbwBCkfG12Eop_E4CNWoHJtf341Utni5iYz2V51NPe0di-_Y7OfHBCXyYuX1CnxMQdM7fg/exec',
  github: 'https://github.com/upadhyayprakash',
  linkedin: 'https://www.linkedin.com/in/upadhyayprakash',
  resumePdf: '/content/prakash_upadhyay_resume.pdf',
  patent: {
    number: 'US 10,936,288',
    shortLabel: 'US Patent 10,936,288',
    title: 'Voice-enabled User Interface Framework',
    url: 'https://patents.google.com/patent/US10936288',
  },
  location: 'Bengaluru, India',
} as const;

export type NavKey = 'writing' | 'how-i-build' | 'work' | 'about';

export const nav: { key: NavKey; label: string; href: string }[] = [
  { key: 'how-i-build', label: 'How I build', href: '/how-i-build' },
  { key: 'writing', label: 'Writing', href: '/writing' },
  { key: 'work', label: 'Work', href: '/work' },
  { key: 'about', label: 'About', href: '/about' },
];
