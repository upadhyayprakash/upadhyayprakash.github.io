// Open-source repos featured on Work. Facts come from each repo's README and GitHub metadata.
export interface Project {
  name: string;
  repo: string;
  summary: string;
  year: string;
  tags: string[];
  note: string;
  live?: { label: string; url: string };
}

export const featured: Project = {
  name: 'PlayUI',
  repo: 'https://github.com/upadhyayprakash/playui-react',
  summary: 'A lightweight design system and React component library: typed components, design tokens, light and dark themes, documented in a public Storybook.',
  year: '2024',
  tags: ['React', 'TypeScript', 'Storybook', 'Design tokens'],
  note: 'On npm as playui-react · Button, Card, Icon, theme toggle · more components on the roadmap',
  live: { label: 'Storybook', url: 'https://upadhyayprakash.github.io/playui-react/' },
};

export const projects: Project[] = [
  {
    name: 'noui-orb',
    repo: 'https://github.com/upadhyayprakash/noui-orb',
    summary: 'The living orange o of the noui mark, as a Web Component.',
    year: '2026',
    tags: ['Web Components', 'TypeScript'],
    note: 'MIT',
  },
  {
    name: 'hdr-brightness-a11y',
    repo: 'https://github.com/upadhyayprakash/hdr-brightness-a11y',
    summary: 'The explainer and live demo for a user preference that limits HDR brightness spikes.',
    year: '2026',
    tags: ['CSS', 'Accessibility'],
    note: 'Explainer site',
    live: { label: 'Explainer', url: 'https://upadhyayprakash.github.io/hdr-brightness-a11y/' },
  },
  {
    name: 'react-super-responsive-table',
    repo: 'https://github.com/upadhyayprakash/react-super-responsive-table',
    summary: 'A responsive React table component, with sibling tabs and placeholder components.',
    year: '2022',
    tags: ['React', 'TypeScript'],
    note: 'Also: tabs, placeholder',
  },
  {
    name: 'deterministic-color-generator',
    repo: 'https://github.com/upadhyayprakash/deterministic-color-generator',
    summary: 'The same colour for the same string, every time. Pairs with name-to-initials for avatars.',
    year: '2022',
    tags: ['TypeScript'],
    note: 'Also: name-to-initials',
  },
];
