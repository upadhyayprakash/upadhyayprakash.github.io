// Public evidence for each stage on How I build. Keel links are pinned to a commit so they cannot
// move or break. CertPulse and RevuPulse are private repos, so they are cited by their live sites.
const keel = 'https://github.com/upadhyayprakash/keel/blob/25a568ec0a1c26c24bac20e3710038f5642903b8';

export type Citation = { project: string; title: string; href: string; note?: string };

export const citations: Record<string, Citation[]> = {
  research: [
    {
      project: 'Keel',
      title: 'Problem analysis',
      href: `${keel}/docs/01-analysis.md`,
      note: 'I started from four failures I had felt myself, and looked at how people handle parallel work, not at how other apps do.',
    },
    {
      project: 'HDR brightness preference',
      title: 'Case study',
      href: '/work/accessibility',
      note: 'I spotted the brightness spike in my own inbox and traced it down to the bytes of the image.',
    },
  ],
  spec: [
    {
      project: 'Keel',
      title: 'Product spec',
      href: `${keel}/docs/02-spec.md`,
      note: 'I moved clients and projects into v1 and pushed the decisions journal to v2.',
    },
    {
      project: 'Keel',
      title: 'ADR 0004: Goals',
      href: `${keel}/docs/adr/0004-goals.md`,
      note: 'I accepted the design before the build, including a required finish line and if-then plan.',
    },
  ],
  design: [
    {
      project: 'noui',
      title: 'The logo that lost a dot',
      href: '/blog/the-logo-that-lost-a-dot',
      note: 'Made as Claude artifacts. I set three rules, dropped the dot and picked the animation.',
    },
    {
      project: 'noui',
      title: 'noui-orb',
      href: 'https://github.com/upadhyayprakash/noui-orb',
      note: "I took the logo's o further, into an open-source Web Component.",
    },
    {
      project: 'Keel',
      title: 'The design pivot',
      href: '/work/keel#design',
      note: 'I saw the screens, then parked the graphical web app and the phone layout.',
    },
  ],
  build: [
    {
      project: 'Keel',
      title: 'Pull request #1: Goals',
      href: 'https://github.com/upadhyayprakash/keel/pull/1',
      note: 'Built against ADR 0004 and merged through a pull request.',
    },
    { project: 'CertPulse', title: 'Live site', href: 'https://certpulse.revupulse.com' },
    { project: 'RevuPulse', title: 'Live site', href: 'https://revupulse.com' },
  ],
  review: [
    {
      project: 'Keel',
      title: 'CI workflow',
      href: `${keel}/.github/workflows/ci.yml`,
      note: 'No release goes out without a clean typecheck, passing tests, a build and a manual run in a real terminal.',
    },
  ],
  ship: [
    {
      project: 'Keel',
      title: 'Release v0.4.0',
      href: 'https://github.com/upadhyayprakash/keel/releases/tag/v0.4.0',
    },
    {
      project: 'Keel',
      title: '@nouisi/keel on npm',
      href: 'https://www.npmjs.com/package/@nouisi/keel',
      note: 'A version only reaches users after I approve it on npm with a two-factor code.',
    },
  ],
  share: [
    {
      project: 'Keel',
      title: 'Documentation',
      href: 'https://nouisi-keel.mintlify.site',
      note: 'I held the docs site back until the commands had settled.',
    },
    {
      project: 'HDR brightness preference',
      title: 'CSS working group issue',
      href: 'https://github.com/w3c/csswg-drafts/issues/14616',
    },
  ],
  reuse: [
    {
      project: 'Keel',
      title: 'Claude Code plugin',
      href: `${keel}/plugins/claude`,
      note: 'Keel itself became a plugin, so capturing a promise works from inside a coding session.',
    },
    {
      project: 'patent-kit',
      title: 'Claude Code plugin',
      href: 'https://github.com/upadhyayprakash/patent-kit',
      note: 'Open source. Prior-art searches run only in batches the inventor approves.',
    },
  ],
};

// Numbers run on through the page, so each citation can be referred to on its own.
const order = ['research', 'spec', 'design', 'build', 'review', 'ship', 'share', 'reuse'];
export const firstNumber = (stage: string) =>
  order.slice(0, order.indexOf(stage)).reduce((sum, s) => sum + citations[s].length, 1);
