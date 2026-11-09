// Single source of truth for every word on the page.

export type ExternalLink = { label: string; href: string }

export type ProjectVisual = 'board' | 'contract' | 'local'

export type TreeBranch = { name: string; detail: string }

export type Tree = {
  caption: string
  root: string
  rootNote: string
  branches: TreeBranch[]
  footnote: string
}

export const contractTree: Tree = {
  caption: 'One API definition, three consumers',
  root: 'contract',
  rootNote: 'ts-rest + Zod',
  branches: [
    { name: 'client', detail: 'ReactJS compiles against it' },
    { name: 'routes', detail: 'ExpressJS compiles against it' },
    { name: 'docs', detail: 'OpenAPI generated from it' },
  ],
  footnote: 'Change the contract once, and the compiler points at everything that must follow.',
}

export const localDataTree: Tree = {
  caption: 'Where your data lives',
  root: 'your mac',
  rootNote: 'no account',
  branches: [
    { name: 'tasks', detail: 'epics, tasks and rich notes' },
    { name: 'sessions', detail: 'every focus session and break' },
    { name: 'backups', detail: 'made before each update' },
  ],
  footnote: 'Deepkoi connects to the internet only when you click Check for Updates.',
}

export type Stat = { value: string; label: string }

export type Project = {
  slug: string
  name: string
  kind: string
  summary: string
  lines: string[]
  stack: string[]
  links: ExternalLink[]
  stat?: string
  visual?: ProjectVisual
}

export const profile = {
  firstLine: 'Nguyen',
  secondLine: 'Tien Dat',
  name: 'Nguyen Tien Dat',
  role: 'Software Engineer',
  stack: 'ReactJS, NodeJS, TypeScript',
  location: 'Ho Chi Minh City, Vietnam',
  status: 'Open to new roles',
  positioning:
    'Builds the ReactJS screens and NodeJS services behind B2B web products, from a Jira add-on now installed by 1,915 organizations to sign-in and billing for two SaaS products.',
  email: 'aslandev2k@gmail.com',
  github: 'https://github.com/aslandev2k',
  repository: 'https://github.com/aslandev2k/aslandev2k.github.io',
} as const

export const sections = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'awards', label: 'Awards' },
  { id: 'contact', label: 'Contact' },
] as const

export type SectionId = (typeof sections)[number]['id']

export const stats: Stat[] = [
  { value: '1,915', label: 'organizations installed Product Go' },
  { value: '4.6 / 5', label: 'rating across 143 public reviews' },
  { value: '4+ years', label: 'building B2B web products' },
  { value: '2nd Prize', label: 'ICPC Asia Can Tho Regional, 2020' },
]

export const featuredProjects: Project[] = [
  {
    slug: 'product-go',
    name: 'Product Go',
    kind: 'Jira add-on',
    summary:
      'Turns a Jira backlog into a story map, so a product team sees a whole release at once.',
    stat: 'Installed by 1,915 organizations. Rated 4.6 out of 5 across 143 reviews.',
    lines: [
      'Took over the ReactJS screens and NodeJS service after six months, then owned both for three years.',
      'Kept boards of 500 to 1,000 cards smooth by rendering only the cards on screen.',
      'Reworked how the app loads Jira data, so a large board opens in a few seconds instead of up to a minute.',
      'Made card moves appear at once while saving in the background.',
      'Built the screens that break a large goal into smaller tasks with AI.',
    ],
    stack: ['ReactJS', 'Redux', 'NodeJS', 'ExpressJS', 'PostgreSQL', 'Jira REST API'],
    links: [
      { label: 'Atlassian Marketplace', href: 'https://marketplace.atlassian.com/apps/1222309' },
    ],
    visual: 'board',
  },
  {
    slug: 'account-platform',
    name: 'Sign-in and billing platform',
    kind: 'Shared SaaS platform',
    summary: 'Decides who a customer is and what they pay for, across TaskFord and AssetLoom.',
    lines: [
      'Wrote the whole sign-in and billing side alone, in TypeScript.',
      'Let workspace owners invite teammates and give each one a role.',
      'Built paid plans on Stripe: choose, pay and change a plan later.',
      'Added Google and Microsoft sign-in and two-factor codes.',
      'Pushed new accounts and plan changes to both products as Pub/Sub events.',
    ],
    stack: ['ReactJS', 'NodeJS', 'PostgreSQL', 'Prisma', 'ts-rest', 'Zod', 'Stripe', 'Pub/Sub'],
    links: [
      { label: 'TaskFord', href: 'https://taskford.com/' },
      { label: 'AssetLoom', href: 'https://assetloom.com/' },
    ],
    visual: 'contract',
  },
  {
    slug: 'deepkoi',
    name: 'Deepkoi',
    kind: 'Personal project, macOS app',
    summary:
      'A focus tracker for the Mac: start a session on one task in a click, and see where your time really goes.',
    stat: 'Three public releases in the first eight days.',
    lines: [
      'Built the whole app alone, from the SwiftUI screens to the data layer.',
      'Kept every task and session on the Mac, with no account.',
      'Shipped signed in-app updates that back up user data before installing.',
      'Covered the app with more than 400 automated tests.',
    ],
    stack: ['Swift', 'SwiftUI', 'SwiftData', 'Sparkle', 'Swift Testing'],
    links: [
      {
        label: 'Download for macOS',
        href: 'https://github.com/aslandev2k/deepkoi-home/releases/latest',
      },
      { label: 'Project page', href: 'https://github.com/aslandev2k/deepkoi-home' },
    ],
    visual: 'local',
  },
]

export const publicSectorProjects: Project[] = [
  {
    slug: 'culture-hub',
    name: 'Culture Hub',
    kind: 'Dong Nai youth culture center',
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
    name: 'Emulation & Reward System',
    kind: 'Dong Nai provincial youth union',
    summary:
      'An award application starts at a local unit and moves up four levels of review to the provincial council.',
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
]

export const compactProject: Project = {
  slug: 'mocky',
  name: 'Mocky',
  kind: 'Wireframe and diagram tool',
  summary: 'Helps teams on Jira and Confluence sketch screens and flows next to their work.',
  stat: 'Now installed by 365 organizations on Jira and 1,189 on Confluence.',
  lines: [
    'Built the drawing and flowchart features.',
    'Kept the canvas fast by controlling what triggers a redraw.',
  ],
  stack: ['ReactJS', 'FabricJS', 'Redux-Saga'],
  links: [
    {
      label: 'Jira listing',
      href: 'https://marketplace.atlassian.com/apps/1226280/draw-ui-wireframes-mockup-prototype-diagrams-for-jira',
    },
    { label: 'Confluence listing', href: 'https://marketplace.atlassian.com/apps/1225654' },
  ],
}

export type Role = {
  company: string
  href?: string
  title: string
  period: string
  place: string
  lines: string[]
}

export const experience: Role[] = [
  {
    company: 'Donasky Software Technology',
    title: 'Freelance Frontend Developer',
    period: 'May 2026 - Sep 2026',
    place: 'Dong Nai City',
    lines: [
      'Built the frontends of two public-sector systems for Dong Nai province, on a team of three.',
      "Finished the frontend of the culture center's system in six weeks and the youth union's in one month.",
    ],
  },
  {
    company: 'DevSamurai',
    href: 'https://devsamurai.vn/en',
    title: 'Software Engineer',
    period: 'Oct 2021 - Apr 2026',
    place: 'Ho Chi Minh City',
    lines: [
      'Owned the screens and service of Product Go, a Jira add-on, for three years.',
      'Wrote the sign-in and billing side of the platform behind TaskFord and AssetLoom, alone.',
      'Built the drawing and flowchart features of Mocky for Jira and Confluence.',
    ],
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

export type Award = {
  year: string
  title: string
  contest: string
  proof: ExternalLink
}

export const awards: Award[] = [
  {
    year: '2020',
    title: 'Second Prize',
    contest: 'ICPC Asia Can Tho Regional Contest',
    proof: {
      label: 'Certificate',
      href: 'https://drive.google.com/file/d/1evg8kAN9on034jh1kaF7-xAPuMEI1evb/view?usp=drive_link',
    },
  },
  {
    year: '2018',
    title: 'Second Prize',
    contest: 'Vietnam National Olympiad of Informatics',
    proof: {
      label: 'Official list',
      href: 'https://thptquocgia.org/wp-content/uploads/danh-sach-hsg-quoc-gia-thpt-2018.pdf#page=29',
    },
  },
  {
    year: '2017',
    title: 'Consolation Prize',
    contest: 'Vietnam National Olympiad of Informatics',
    proof: {
      label: 'Official list',
      href: 'https://moet.gov.vn/upload/2007219/20250814/b9409ddb9536f942eee697a47de72007in_dsdoatgiai_HSGQG_2017.pdf#page=21',
    },
  },
  {
    year: '2017',
    title: 'Gold Medal',
    contest: 'Olympic 30/4 in Informatics',
    proof: {
      label: 'Contest page',
      href: 'https://www.thpt-lehongphong-tphcm.edu.vn/vi/content/ket-qua-ky-thi-truyen-thong-olympic-304-lan-thu-23',
    },
  },
  {
    year: '2016',
    title: 'Gold Medal',
    contest: 'Olympic 30/4 in Informatics',
    proof: {
      label: 'Results',
      href: 'https://www.thpt-lehongphong-tphcm.edu.vn/sites/default/files/201604032/tin10.pdf',
    },
  },
]

export const education = [
  {
    school: 'University of Science (HCMUS)',
    detail: 'Bachelor of Science in Software Engineering',
    period: '2018 - 2022',
  },
  {
    school: 'Binh Long High School for the Gifted',
    detail: 'Mathematics, specialized class',
    period: '2015 - 2018',
  },
]
