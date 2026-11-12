// Single source of truth for every word and number on the page.

export type ExternalLink = { label: string; href: string }

// Each figure is one arrangement of the same dots. The order here is the
// order they appear in on the page, and it numbers the captions.
export const figureKeys = [
  'globe',
  'board',
  'hub',
  'koi',
  'schedule',
  'tiers',
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

export const profile = {
  firstLine: 'Nguyen',
  secondLine: 'Tien Dat',
  name: 'Nguyen Tien Dat',
  role: 'Software Engineer',
  location: 'Ho Chi Minh City, Vietnam',
  status: 'Open to new roles',
  positioning:
    'Builds the ReactJS screens and NodeJS services behind B2B web products: a Jira add-on installed by more than 1,900 organizations, and the sign-in and billing platform behind two SaaS products.',
  dotNote: `${productGoInstalls} dots. One for every organization that has Product Go installed. Scroll, and the same dots draw the rest of the story.`,
  facts: [
    '4+ years building B2B web products',
    'Second Prize, ICPC Asia Regional',
    'Daily Claude Code user since January 2026',
  ],
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
  hub: 'A product hands sign-in and payment to the core. The core pushes each new account and plan change back as an event.',
  koi: 'The same dots, swimming.',
  schedule: 'A week of classes, one block per time slot.',
  tiers: 'One application, climbing from a local unit to the provincial council.',
  wireframe: 'A wireframe and a flowchart, the two things Mocky draws.',
  page: 'The same dots as one page. This site is the longer version.',
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
    context: 'DevSamurai, 2022 to 2024',
    summary:
      'Turns a Jira backlog into a story map, so a product team sees a whole release at once.',
    stat: `Installed by ${productGoInstalls} organizations. Rated ${marketplace.productGo.rating} out of 5 across ${marketplace.productGo.reviews} reviews.`,
    lines: [
      'Took over the ReactJS screens and NodeJS service after six months, then owned both for three years.',
      'Kept boards of 500 to 1,000 cards smooth by rendering only the cards on screen.',
      'Made card moves appear at once while the save runs in the background, with rollback if it fails.',
      'Reworked how the app loads Jira data, so a large board opens in a few seconds instead of up to a minute.',
      'Built the screens that break a large goal into smaller tasks with AI.',
    ],
    stack: ['ReactJS', 'Redux', 'NodeJS', 'ExpressJS', 'PostgreSQL', 'Jira REST API'],
    links: [{ label: 'Atlassian Marketplace', href: marketplace.productGo.href }],
    demo: 'board',
  },
  {
    slug: 'account-platform',
    figure: 'hub',
    name: 'Sign-in and billing platform',
    kind: 'Shared SaaS platform',
    context: 'DevSamurai, 2025 to 2026',
    summary: 'Decides who a customer is and what they pay for, across TaskFord and AssetLoom.',
    lines: [
      'Wrote the whole sign-in and billing side alone, in TypeScript.',
      'Defined the API once in a shared contract that the client and the server both compile against.',
      'Let workspace owners invite teammates and give each one a role.',
      'Built paid plans on Stripe: choose, pay and change a plan later.',
      'Added Google and Microsoft sign-in and two-factor codes.',
    ],
    stack: ['ReactJS', 'NodeJS', 'PostgreSQL', 'Prisma', 'ts-rest', 'Zod', 'Stripe', 'Pub/Sub'],
    links: [
      { label: 'TaskFord', href: 'https://taskford.com/' },
      { label: 'AssetLoom', href: 'https://assetloom.com/' },
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
      'Kept every task and session on the Mac, with no account.',
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
    slug: 'culture-hub',
    figure: 'schedule',
    name: 'Culture Hub',
    kind: 'Dong Nai youth culture center',
    context: 'Donasky, 2026',
    summary:
      'Parents enroll their children and pay the course fee online. Teachers take attendance. Staff run the schedule.',
    lines: [
      'Built the frontend for staff, teachers, students and parents in six weeks, on a team of three.',
      'Wrote a Claude Code command that regenerates typed API contracts from the Java backend.',
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
    kind: 'Dong Nai provincial youth union',
    context: 'Donasky, 2026',
    summary:
      'An award application starts at a local unit and moves up four levels of review to the provincial council. It replaces a paper process.',
    lines: [
      'Built the frontend for all six roles in one month, on a team of three.',
      'Delivered and handed over to the provincial youth union.',
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
    slug: 'mocky',
    figure: 'wireframe',
    name: 'Mocky',
    kind: 'Wireframe and diagram tool',
    context: 'DevSamurai, 2021',
    summary: 'Helps teams on Jira and Confluence sketch screens and flows next to their work.',
    stat: `Now installed by ${formatCount(marketplace.mockyJira.installs)} organizations on Jira and ${formatCount(marketplace.mockyConfluence.installs)} on Confluence.`,
    lines: [
      'Built the drawing and flowchart features.',
      'Kept the canvas fast by controlling what triggers a redraw.',
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
      'Owned the screens and service of Product Go, a Jira add-on, for three years.',
      'Wrote the sign-in and billing side of the platform behind TaskFord and AssetLoom, alone.',
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
      "Finished the frontend of the culture center's system in six weeks and the youth union's in one month.",
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
    items: ['Claude Code', 'Custom commands', 'Reusable skills', 'Test-first with AI'],
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
