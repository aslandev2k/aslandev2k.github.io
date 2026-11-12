// Single source of truth for every word and number on the page.

export type ExternalLink = { label: string; href: string }

// Each figure is one arrangement of the same dots. The order here is the
// order they appear in on the page, and it numbers the captions.
export const figureKeys = [
  'globe',
  'board',
  'hub',
  'schedule',
  'tiers',
  'koi',
  'wireframe',
  'page',
  'spiral',
  'medals',
  'envelope',
] as const

export type FigureKey = (typeof figureKeys)[number]

// Read from the public Atlassian Marketplace listings. The counts move, so
// re-read them before a release and update the date with them.
export const marketplace = {
  checkedOn: 'Nov 12, 2026',
  productGo: {
    installs: 1916,
    rating: '4.6',
    reviews: 143,
    href: 'https://marketplace.atlassian.com/apps/1222309',
  },
  mockyJira: {
    installs: 364,
    href: 'https://marketplace.atlassian.com/apps/1226280/draw-ui-wireframes-mockup-prototype-diagrams-for-jira',
  },
  mockyConfluence: {
    installs: 1187,
    href: 'https://marketplace.atlassian.com/apps/1225654',
  },
} as const

export function formatCount(value: number): string {
  return value.toLocaleString('en-US')
}

// One dot on the page for every organization that has Product Go installed.
export const dotCount: number = marketplace.productGo.installs

const productGoInstalls = formatCount(marketplace.productGo.installs)
const productGoRating = `${marketplace.productGo.rating} out of 5 across ${marketplace.productGo.reviews} public reviews`

export const profile = {
  firstLine: 'Nguyen',
  secondLine: 'Tien Dat',
  name: 'Nguyen Tien Dat',
  role: 'Software Engineer',
  location: 'Ho Chi Minh City, Vietnam',
  status: 'Open to full-stack and frontend roles',
  positioning:
    'Full-stack engineer with 4+ years on B2B web products in ReactJS, NodeJS and TypeScript. Took over Product Go, a Jira add-on installed by more than 1,900 organizations, and owned its frontend and backend. Then wrote the sign-in and billing platform behind two SaaS products, alone.',
  dotNote: `${productGoInstalls} dots. One for every organization that has Product Go installed. Scroll, and the same dots draw the rest of the story.`,
  facts: [
    `Product Go: rated ${marketplace.productGo.rating} out of 5 in ${marketplace.productGo.reviews} public reviews`,
    'Second Prize, ICPC Asia Regional programming contest',
    'Works with Claude Code daily, writing the test first',
  ],
  contactNote: 'Hiring for a full-stack or frontend role? Email is the fastest way to reach me.',
  email: 'aslandev2k@gmail.com',
  github: 'https://github.com/aslandev2k',
  repository: 'https://github.com/aslandev2k/aslandev2k.github.io',
} as const

export const sections = [
  { id: 'product-go', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'awards', label: 'Awards' },
  { id: 'contact', label: 'Contact' },
] as const

export const figureCaptions: Record<FigureKey, string> = {
  globe: `${productGoInstalls} organizations, counted on the Atlassian Marketplace on ${marketplace.checkedOn}.`,
  board:
    'The same dots as a story map. Only the cards inside the frame are drawn at full strength, the way the real board renders only what is on screen.',
  hub: 'TaskFord and AssetLoom hand sign-in and payment to the platform. The platform sends each new account and plan change back as an event.',
  schedule: 'A week of classes, one block per time slot.',
  tiers: 'One application, climbing from a local unit to the provincial council.',
  koi: 'The same dots, swimming.',
  wireframe: 'A wireframe and a flowchart, the two things Mocky draws.',
  page: 'The same dots as a one-page resume.',
  spiral: 'Eight arms, one for each group of skills.',
  medals: 'Five results, from high school to ICPC.',
  envelope: 'One email away.',
}

export type ProjectDemo = 'board'

export type Project = {
  slug: string
  figure: FigureKey
  name: string
  kind: string
  context: string
  summary: string
  stat?: string
  lines: string[]
  stack: string[]
  links: ExternalLink[]
  demo?: ProjectDemo
}

export const projects: Project[] = [
  {
    slug: 'product-go',
    figure: 'board',
    name: 'Product Go',
    kind: 'Jira add-on',
    context: 'DevSamurai, Jan 2022 to Dec 2024',
    summary:
      'A planning add-on for Jira, sold worldwide on the Atlassian Marketplace. It turns a backlog into a story map, so a product team sees a whole release at once instead of reading down a list of tickets.',
    stat: `Installed by ${productGoInstalls} organizations. Rated ${productGoRating}.`,
    lines: [
      'Joined an existing product and took over both sides after six months: the ReactJS screens and the NodeJS service.',
      'Shipped new features and fixed the bugs that testers and customers reported.',
      'Cut the time to open a large board from up to a minute to a few seconds, by reworking how the app loads Jira data.',
      'Kept boards of 500 to 1,000 cards smooth to scroll and drag, by rendering only the cards on screen.',
      'Made a card move show instantly: the screen updates first, the save follows, and a failed save rolls the card back.',
      'Built the screens where AI breaks a large goal into smaller tasks, without leaving the board.',
    ],
    stack: ['ReactJS', 'Redux', 'NodeJS', 'ExpressJS', 'PostgreSQL', 'Jira REST API'],
    links: [{ label: 'Atlassian Marketplace', href: marketplace.productGo.href }],
    demo: 'board',
  },
  {
    slug: 'account-platform',
    figure: 'hub',
    name: 'Sign-in and billing platform',
    kind: 'Shared platform for two SaaS products',
    context: 'DevSamurai, Jan 2025 to Apr 2026',
    summary:
      'The account platform behind TaskFord (work management) and AssetLoom (IT asset tracking). It decides who a customer is and what they pay for, from sign-in to teammates to the subscription.',
    stat: 'Both products run on it in production.',
    lines: [
      'Wrote the whole sign-in and billing side alone: the ReactJS screens, the NodeJS service and the PostgreSQL database.',
      'Built subscriptions on Stripe: a customer chooses a plan, pays and changes it later. Four plans on TaskFord, seven on AssetLoom.',
      'Built sign-up, password reset, Google and Microsoft sign-in, and two-factor codes.',
      'Built team workspaces: an owner invites teammates and gives each a role (owner, admin, billing manager or member).',
      'Defined the API once, in a contract that the screens and the service both compile against, so the two cannot drift apart.',
    ],
    stack: ['ReactJS', 'NodeJS', 'PostgreSQL', 'Prisma', 'ts-rest', 'Zod', 'Stripe', 'Pub/Sub'],
    links: [
      { label: 'TaskFord', href: 'https://taskford.com/' },
      { label: 'AssetLoom', href: 'https://assetloom.com/' },
    ],
  },
  {
    slug: 'culture-hub',
    figure: 'schedule',
    name: 'Culture Hub',
    kind: 'Management system for a youth culture center',
    context: 'Donasky (freelance), 2026',
    summary:
      'Parents enroll their children and pay the course fee online. Teachers take attendance. Staff run the schedule.',
    lines: [
      'Built the frontend for staff, teachers, students and parents in six weeks, on a team of three.',
      'Kept the frontend in sync with the Java API: a Claude Code command reads the backend code and regenerates the typed API definitions.',
      "Live, running on the center's own classes and facilities.",
    ],
    stack: ['ReactJS', 'TanStack', 'Tailwind CSS', 'ts-rest', 'Zod'],
    links: [
      {
        label: 'Live site (Vietnamese)',
        href: 'https://nhavanhoathanhthieunhithanhphodongnai.com/',
      },
    ],
  },
  {
    slug: 'reward-system',
    figure: 'tiers',
    name: 'Emulation & Reward System',
    kind: 'Award review system for a provincial youth union',
    context: 'Donasky (freelance), 2026',
    summary:
      'Replaces a paper process. An award application starts at a local unit and moves up four levels of review to the provincial council, where members vote on it.',
    lines: [
      'Built the frontend for all six user roles in one month, on a team of three.',
      'Delivered, handed over to the provincial youth union, and live.',
    ],
    stack: ['ReactJS', 'TanStack', 'Tailwind CSS', 'ts-rest', 'Zod'],
    links: [
      {
        label: 'Live site (Vietnamese)',
        href: 'https://hethongkhenthuong.thanhdoandongnai.com/',
      },
    ],
  },
  {
    slug: 'deepkoi',
    figure: 'koi',
    name: 'Deepkoi',
    kind: 'Personal project, macOS app',
    context: '2026',
    summary:
      'A focus tracker for the Mac: start a session on one task in a click, and see where your time really goes.',
    stat: 'From first commit to three public releases in eight days.',
    lines: [
      'Built the whole app alone, from the SwiftUI screens to the data layer.',
      "Kept every task and session on the user's Mac, so the app needs no account.",
      'Shipped signed in-app updates that back up user data before installing.',
      'Covered the app with more than 900 automated tests.',
    ],
    stack: ['Swift', 'SwiftUI', 'SwiftData', 'Sparkle', 'Swift Testing'],
    links: [
      {
        label: 'Download for macOS',
        href: 'https://github.com/aslandev2k/deepkoi-home/releases/latest',
      },
      { label: 'Project page', href: 'https://github.com/aslandev2k/deepkoi-home' },
    ],
  },
  {
    slug: 'mocky',
    figure: 'wireframe',
    name: 'Mocky',
    kind: 'Wireframe and diagram tool',
    context: 'DevSamurai, Oct to Dec 2021',
    summary:
      'Sold on the Atlassian Marketplace. Helps teams on Jira and Confluence sketch screens and flows next to their work.',
    stat: `Now installed by ${formatCount(marketplace.mockyJira.installs)} organizations on Jira and ${formatCount(marketplace.mockyConfluence.installs)} on Confluence.`,
    lines: [
      'Built the drawing, design and flowchart features by extending FabricJS components.',
      'Kept the canvas fast while people draw, by controlling exactly what triggers a redraw.',
    ],
    stack: ['ReactJS', 'FabricJS', 'Redux-Saga'],
    links: [
      { label: 'Jira listing', href: marketplace.mockyJira.href },
      { label: 'Confluence listing', href: marketplace.mockyConfluence.href },
    ],
  },
]

export type Role = {
  company: string
  href?: string
  title: string
  period: string
  place: string
  lines: string[]
}

// Salaried history first, freelance work below it.
export const experience: Role[] = [
  {
    company: 'DevSamurai',
    href: 'https://devsamurai.vn/en',
    title: 'Software Engineer',
    period: 'Oct 2021 to Apr 2026',
    place: 'Ho Chi Minh City',
    lines: [
      'Took over Product Go, a Jira add-on installed by more than 1,900 organizations, and owned its frontend and backend.',
      'Wrote the sign-in and billing platform behind two SaaS products in production, alone.',
      'Built the drawing and flowchart features of Mocky for Jira and Confluence.',
    ],
  },
  {
    company: 'Donasky Software Technology',
    title: 'Freelance Frontend Developer',
    period: 'May 2026 to Sep 2026',
    place: 'Dong Nai City',
    lines: [
      'Built the frontends of two public-sector systems for Dong Nai province, on a team of three.',
      "Finished the culture center's frontend in six weeks and the youth union's in one month.",
    ],
  },
]

export const education = [
  {
    school: 'University of Science (HCMUS)',
    detail: 'Bachelor of Science in Software Engineering',
    period: '2018 to 2022',
  },
  {
    school: 'Binh Long High School for the Gifted',
    detail: 'Mathematics, specialized class',
    period: '2015 to 2018',
  },
]

export const skillGroups: { name: string; items: string[] }[] = [
  { name: 'Languages', items: ['TypeScript', 'JavaScript (ES6+)', 'SQL'] },
  {
    name: 'Frontend',
    items: ['ReactJS', 'Vite', 'Tailwind CSS', 'TanStack', 'Redux', 'Redux-Saga', 'shadcn/ui'],
  },
  {
    name: 'Backend and APIs',
    items: ['NodeJS', 'ExpressJS', 'REST APIs', 'ts-rest', 'Zod', 'OpenAPI', 'Multi-tenant SaaS'],
  },
  {
    name: 'Data and storage',
    items: ['PostgreSQL', 'Prisma', 'Sequelize', 'Redis', 'Google Cloud Storage', 'AWS S3'],
  },
  {
    name: 'Integrations and auth',
    items: [
      'Stripe',
      'Google sign-in',
      'Microsoft sign-in',
      'TOTP two-factor',
      'JWT',
      'Jira REST API',
    ],
  },
  { name: 'Native macOS', items: ['Swift', 'SwiftUI', 'SwiftData'] },
  {
    name: 'AI-assisted engineering',
    items: ['Claude Code', 'Custom commands', 'Reusable agent skills', 'Test-first with AI'],
  },
  {
    name: 'Testing and delivery',
    items: ['Vitest', 'Testing Library', 'Biome', 'Turborepo', 'Docker', 'Google Cloud Platform'],
  },
]

export type AwardRank = 'gold' | 'second' | 'consolation'

export type Award = {
  year: string
  title: string
  rank: AwardRank
  contest: string
  proof?: ExternalLink
}

// Newest first. The first two are drawn as the large medals in the figure.
export const awards: Award[] = [
  {
    year: '2020',
    title: 'Second Prize',
    rank: 'second',
    contest: 'ICPC Asia Can Tho Regional Contest',
    proof: {
      label: 'Certificate',
      href: 'https://drive.google.com/file/d/1evg8kAN9on034jh1kaF7-xAPuMEI1evb/view?usp=drive_link',
    },
  },
  {
    year: '2018',
    title: 'Second Prize',
    rank: 'second',
    contest: 'Vietnam National Olympiad of Informatics',
    proof: {
      label: 'Official list',
      href: 'https://thptquocgia.org/wp-content/uploads/danh-sach-hsg-quoc-gia-thpt-2018.pdf#page=29',
    },
  },
  {
    year: '2017',
    title: 'Consolation Prize',
    rank: 'consolation',
    contest: 'Vietnam National Olympiad of Informatics',
  },
  {
    year: '2017',
    title: 'Gold Medal',
    rank: 'gold',
    contest: 'Olympic 30/4 in Informatics',
    proof: {
      label: 'Contest page',
      href: 'https://www.thpt-lehongphong-tphcm.edu.vn/vi/content/ket-qua-ky-thi-truyen-thong-olympic-304-lan-thu-23',
    },
  },
  {
    year: '2016',
    title: 'Gold Medal',
    rank: 'gold',
    contest: 'Olympic 30/4 in Informatics',
    proof: {
      label: 'Results',
      href: 'https://www.thpt-lehongphong-tphcm.edu.vn/sites/default/files/201604032/tin10.pdf',
    },
  },
]
