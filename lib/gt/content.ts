/**
 * Content for the site — English and German.
 *
 * Two rules kept from the design contract:
 *  1. Nothing invented. Every number/claim here traces to a repo source file or a
 *     stated owner fact; `src` travels with the value so the UI can print it.
 *  2. Structure is identical in both languages (same ids, slugs, dates, URLs).
 *     `tests/content.spec.ts` asserts that parity, so a copied language block
 *     cannot drift silently.
 *
 * Owner facts not present in the JSON data files (permit, availability, hours,
 * German level) are recorded here once and rendered in the hero's hiring block.
 * Education data now reflects the graduation recorded on the CV: MSc 02/2025–08/2026.
 */

export type Lang = 'en' | 'de'

export interface Fact {
  k: string
  v: string
}

export interface Kpi {
  value: string
  label: string
  src: string
}

export interface SceneMeta {
  id: 'shelf' | 'quadruped' | 'apriltag'
  short: string
  name: string
  note: string
  src: string
}

export interface Track {
  id: string
  lane: 'exp' | 'edu'
  role: string
  org: string
  /** exclusive decimal year: year + (monthIndex + 1) / 12 */
  start: number
  end: number | null
  src: string
  facts: string[]
}

export interface GtCase {
  id: string
  index: string
  title: string
  org: string
  arch: 'retail' | 'sku' | 'pose'
  problem: string
  system: string
  proof: { v: string; k: string }[]
  skills: string[]
  src: string
  repo?: string
  /** short label for the repo button when several projects share one repo */
  repoName?: string
  demo?: string
}

export interface Chip {
  id: string
  title: string
  line: string
  metric: string
  skills: string[]
  src: string
  repo?: string
  repoName?: string
}

export interface StackColumn {
  id: string
  title: string
  items: { label: string; slug: string; src: string }[]
}

export interface EvidenceRow {
  task: string
  method: string
  result: string
  src: string
  skills: string[]
}

export interface Post {
  title: string
  date: string
  description: string
  url: string
}

export interface GtContent {
  meta: { title: string; description: string }
  identity: {
    name: string
    role: string
    location: string
    availability: string
    status: string
  }
  contact: {
    email: string
    github: string
    linkedin: string
    xing: string
    researchgate: string
    cv: string
    headshot: string
    eyebrow: string
    title: string
    lede: string
    copy: string
    copyAria: string
    mail: string
    cvLabel: string
    cvAria: string
    payloadAria: string
    cardAria: string
    location: string
    status: string
    foot: string
  }
  nav: {
    badge: string
    stages: { id: string; target: string; label: string }[]
    github: string
    linkedin: string
    email: string
    cv: string
    skip: string
    langLabel: string
    theme: { toLight: string; toDark: string; label: string }
  }
  hero: {
    eyebrow: string
    name: string
    sub: string
    hireTitle: string
    hire: Fact[]
    stackLabel: string
    ctaWork: string
    ctaCv: string
    copyEmail: string
    cue: string
    kpisLabel: string
    kpis: Kpi[]
  }
  bench: {
    eyebrow: string
    title: string
    lede: string
    sceneAria: string
    confidence: string
    viewLabel: string
    views: { id: 'raw' | 'seg' | 'embed'; label: string }[]
    layersLabel: string
    layers: { id: 'boxes' | 'seg' | 'nms'; label: string }[]
    split: string
    telemetry: string
    sim: string
    sceneSrc: string
    canvasAria: string
    scenes: SceneMeta[]
  }
  track: {
    eyebrow: string
    title: string
    lede: string
    experience: string
    education: string
    hint: string
    hostAria: string
    present: string
    cardAria: string
  }
  timeline: Track[]
  work: {
    eyebrow: string
    title: string
    lede: string
    compact: string
    problem: string
    system: string
    architecture: string
    repo: string
    demo: string
    caseAria: (title: string) => string
    drawerAria: (title: string) => string
    cases: GtCase[]
    chips: Chip[]
  }
  stack: {
    eyebrow: string
    title: string
    lede: string
    hint: string
    clear: string
    clearWith: (n: number) => string
    status: (skills: string, projects: number, rows: number, total: number) => string
    noEvidence: (skills: string) => string
    columns: StackColumn[]
  }
  evidence: {
    eyebrow: string
    title: string
    lede: string
    note: string
    count: (n: number) => string
    litCount: (lit: number, total: number) => string
    none: string
    eduNote: string
    tableAria: string
    columns: [string, string, string, string, string]
    rows: EvidenceRow[]
  }
  writing: {
    eyebrow: string
    title: string
    lede: string
    posts: Post[]
  }
  footer: {
    impressum: string
    datenschutz: string
    note: string
    top: string
    legalAria: string
  }
  toast: {
    copied: (email: string) => string
    copyFailed: string
    copyEmail: string
  }
}

const EMAIL = 'gadgesanket75@gmail.com'
const CV = '/assets/Sanket-Gadge-Resume.pdf'
const HEADSHOT = 'assets/headshot.jpg'
const GITHUB = 'https://github.com/Sanket758'
const LINKEDIN = 'https://www.linkedin.com/in/sanket758'
const XING = 'https://www.xing.com/profile/Sanket_Gadge'
const RESEARCHGATE = 'https://www.researchgate.net/profile/Sanket-Gadge'
const ATBSBI = 'https://github.com/Sanket758/AtBSBI'

const en: GtContent = {
  meta: {
    title: 'Ground Truth — Sanket Gadge · Computer Vision & AI Engineer, Berlin',
    description:
      'Computer-vision engineer in Berlin. 4+ years on production detection pipelines, 95% precision over 500+ SKUs. MSc AI (2026), 18-month post-study work permit, available immediately.',
  },
  identity: {
    name: 'Sanket Gadge',
    role: 'Computer Vision, AI & Python Engineer',
    location: 'Berlin, Germany',
    availability: 'available immediately · 40 h/week',
    status: 'MSc AI, Class of 2026',
  },
  contact: {
    email: EMAIL,
    github: GITHUB,
    linkedin: LINKEDIN,
    xing: XING,
    researchgate: RESEARCHGATE,
    cv: CV,
    headshot: HEADSHOT,
    eyebrow: '07 · CONTACT / DEPLOY',
    title: 'Deploy the pipeline',
    lede: 'One endpoint, no forms: the payload below is the whole handshake.',
    copy: 'copy email',
    copyAria: 'Copy email address',
    mail: 'mail',
    cvLabel: 'cv · pdf',
    cvAria: 'Download CV (PDF)',
    payloadAria: 'Contact payload — JSON',
    cardAria: 'Operator ID card',
    location: 'LOCATION',
    status: 'STATUS',
    foot: 'GROUND TRUTH · GT-758 · RELEASED 2026-10',
  },
  nav: {
    badge: 'SANKET GADGE',
    stages: [
      { id: 'ingest', target: '#ingest', label: 'INGEST' },
      { id: 'perceive', target: '#perceive', label: 'PERCEIVE' },
      { id: 'track', target: '#track', label: 'TRACK' },
      { id: 'retrieve', target: '#work', label: 'RETRIEVE' },
      { id: 'control', target: '#stack', label: 'CONTROL' },
      { id: 'calibrate', target: '#evidence', label: 'CALIBRATE' },
      { id: 'deploy', target: '#contact', label: 'DEPLOY' },
    ],
    github: 'GitHub',
    linkedin: 'LinkedIn',
    email: 'Email',
    cv: 'CV ↓',
    skip: 'Skip to content',
    langLabel: 'Switch language',
    theme: { toLight: 'Switch to light theme', toDark: 'Switch to dark theme', label: 'Colour theme' },
  },
  hero: {
    eyebrow: '01 · LAB / INGEST',
    name: 'Sanket Gadge',
    sub: 'Computer Vision, AI & Python Engineer — Berlin',
    hireTitle: 'Hiring facts',
    hire: [
      { k: 'Looking for', v: 'Werkstudent · full-time' },
      { k: 'Available', v: 'immediately · 40 h/week' },
      {
        k: 'Work permit',
        v: '18-month post-study job-seeker permit (§ 20 AufenthG) · change filed at LEA Berlin',
      },
      { k: 'Languages', v: 'German B1 · English' },
    ],
    stackLabel: 'Core stack',
    ctaWork: 'See the work',
    ctaCv: 'Download CV',
    copyEmail: 'copy email',
    cue: 'one capture — frame #1847 — through seven stages',
    kpisLabel: 'Headline results',
    kpis: [
      { value: '95%', label: 'detection precision · 500+ SKUs', src: 'experience.json — Big Rattle' },
      { value: '10k+', label: 'images processed per month', src: 'experience.json — HRI / SAM+DinoV2' },
      { value: '−60%', label: 'manual shelf audits', src: 'experience.json — Colgate' },
      { value: '≤10 cm', label: 'autonomous landing · <100 ms', src: 'lib/projects.ts — drone-delivery' },
    ],
  },
  bench: {
    eyebrow: '01 · LAB / PERCEIVE',
    title: 'Inference bench',
    lede: 'Three captures from the work below, one control surface: threshold, layers, split view, telemetry. Synthetic parts are labelled.',
    sceneAria: 'Scene',
    confidence: 'CONFIDENCE',
    viewLabel: 'VIEW',
    views: [
      { id: 'raw', label: 'RAW' },
      { id: 'seg', label: 'SEG+BBOX' },
      { id: 'embed', label: 'EMBED' },
    ],
    layersLabel: 'LAYERS',
    layers: [
      { id: 'boxes', label: 'boxes' },
      { id: 'seg', label: 'seg masks' },
      { id: 'nms', label: 'NMS ghosts' },
    ],
    split: 'SPLIT',
    telemetry: 'TELEMETRY',
    sim: 'SIM · ILLUSTRATIVE',
    sceneSrc: 'scene src: ',
    canvasAria: 'Inference bench — scene rendering',
    scenes: [
      {
        id: 'shelf',
        short: 'SHELF #1847',
        name: 'Retail shelf — frame #1847',
        note: 'illustrative capture · FAISS retrieval strip',
        src: 'lib/projects.ts — sku-vision',
      },
      {
        id: 'quadruped',
        short: 'QUADRUPED 26 KP',
        name: 'Quadruped pose — 26 keypoints',
        note: 'synthetic wireframe · cow-pose stack',
        src: 'lib/projects.ts — cow-pose',
      },
      {
        id: 'apriltag',
        short: 'APRILTAG LANDING',
        name: 'Aerial AprilTag landing',
        note: 'illustrative sim · ≤10 cm · <100 ms',
        src: 'lib/projects.ts — drone-delivery',
      },
    ],
  },
  track: {
    eyebrow: '02 · TRACK',
    title: 'Career as multi-object tracking',
    lede: 'Seven tracks on one timeline — real dates, persistent IDs. Scroll scrubs the playhead; the record below follows it.',
    experience: 'experience',
    education: 'education',
    hint: 'click a track to jump the playhead',
    hostAria: 'Career timeline (scrolls horizontally on small screens)',
    present: 'present',
    cardAria: 'Track record',
  },
  timeline: [
    {
      id: 'T01',
      lane: 'edu',
      role: 'Diploma in Computer Engineering',
      org: "VPM's Polytechnic",
      start: 2014.0,
      end: 2017.0,
      src: 'education.json — Diploma',
      facts: ['Computer Engineering diploma, Thane, India.'],
    },
    {
      id: 'T02',
      lane: 'edu',
      role: 'BSc Computer Engineering',
      org: 'Mumbai University',
      start: 2017.0,
      end: 2020.0,
      src: 'education.json — BSc',
      facts: ['BSc Computer Engineering, Mumbai University.', 'Mumbai, India.'],
    },
    {
      id: 'T03',
      lane: 'edu',
      role: 'MSc Artificial Intelligence',
      org: 'University of Creative Arts (BSBI)',
      start: 2025.08,
      end: 2026.67,
      src: 'education.json — MSc',
      facts: [
        'MSc Artificial Intelligence — Berlin School of Business and Innovation.',
        'Berlin, Germany · awarded 08/2026.',
      ],
    },
    {
      id: 'T04',
      lane: 'exp',
      role: 'Monitoring Software Developer',
      org: 'Study League IT Solutions',
      start: 2018.42,
      end: 2018.58,
      src: 'experience.json — Study League',
      facts: [
        'Built installable Windows monitoring software.',
        'Automated four scheduled scripts with precise timing logic.',
      ],
    },
    {
      id: 'T05',
      lane: 'exp',
      role: 'AI / ML Engineer',
      org: 'EAZR DigiPayments',
      start: 2020.83,
      end: 2021.83,
      src: 'experience.json — EAZR',
      facts: [
        'Alternative credit scoring on device metadata — approval accuracy +25%.',
        'OpenCV OCR verification for KYC documents — 90% accuracy.',
        'spaCy transaction/spam classifier — 92% accuracy.',
        'Video-KYC liveness checks — compliance +35%.',
      ],
    },
    {
      id: 'T06',
      lane: 'exp',
      role: 'AI / ML Engineer',
      org: 'Big Rattle Technologies',
      start: 2021.75,
      end: 2024.83,
      src: 'experience.json — Big Rattle',
      facts: [
        'Colgate shelf monitoring — manual audits −60%.',
        'YOLOv5 fine-tune on 500+ SKUs — 95% precision.',
        'HRI Streax counting with SAM + DinoV2 — 10k+ images/mo, manual checks −90%.',
        'Python multiprocessing — production efficiency +50%.',
      ],
    },
    {
      id: 'T07',
      lane: 'exp',
      role: 'Volunteer — GDPR & Full Stack',
      org: 'Klimaneustart Berlin',
      start: 2025.5,
      end: 2025.75,
      src: 'experience.json — Klimaneustart',
      facts: [
        'GDPR-compliant data handling — PII separation, hashing, encryption.',
        'Express.js + MongoDB architecture — 50+ daily operations, 99% uptime.',
      ],
    },
  ],
  work: {
    eyebrow: '03 · WORK / RETRIEVE',
    title: 'Flagship evidence',
    lede: 'Three systems, each with its architecture on the record — plus three compact builds.',
    compact: 'Compact builds',
    problem: 'Problem',
    system: 'System',
    architecture: 'Architecture',
    repo: 'repo',
    demo: 'demo',
    caseAria: (title) => `Case — ${title}`,
    drawerAria: (title) => `Architecture — ${title}`,
    cases: [
      {
        id: 'retail-shelf',
        index: 'W.01',
        title: 'Retail shelf intelligence',
        org: 'Big Rattle Technologies · for Colgate',
        arch: 'retail',
        problem:
          'Manual shelf audits across retail sites were slow and inconsistent, and similar-packaged goods were easy to misread.',
        system:
          'YOLOv5 detection fine-tuned on 500+ SKUs, an OpenCV dimension algorithm for millimetre-level product differences, GPS capture clustering, and Python multiprocessing for throughput.',
        proof: [
          { v: '95%', k: 'detection precision' },
          { v: '−60%', k: 'manual audits' },
          { v: '+15%', k: 'classification reliability' },
        ],
        skills: ['python', 'yolo', 'opencv', 'deep-learning', 'automation', 'fastapi', 'data-engineering'],
        src: 'experience.json — Big Rattle',
      },
      {
        id: 'sku-vision',
        index: 'W.02',
        title: 'SKU Vision Pipeline',
        org: 'Personal project · live demo',
        arch: 'sku',
        problem:
          'Fine-grained retail recognition: visually near-identical products, few labelled samples per new SKU.',
        system:
          'YOLO detection into DINOv3 / MobileNetV2 visual embeddings, indexed in FAISS for top-k retrieval with few-shot support.',
        proof: [
          { v: '93.7%', k: 'top-1 on the evaluation set' },
          { v: 'FAISS', k: 'embedding retrieval for new SKUs' },
        ],
        skills: ['yolo', 'faiss', 'pytorch', 'python', 'deep-learning', 'opencv', 'github'],
        src: 'lib/projects.ts — sku-vision',
        repo: 'https://github.com/Sanket758/sku-vision-pipeline',
        demo: 'https://sku-vision-pipeline.vercel.app/',
      },
      {
        id: 'cow-pose',
        index: 'W.03',
        title: 'Cow Pose — 26-keypoint detection',
        org: 'Personal project · coursework repo',
        arch: 'pose',
        problem:
          'Real-time animal pose estimation needs a keypoint dataset and a model small enough to run alongside a robot stack.',
        system:
          'Custom 26-keypoint dataset, YOLOv8n-pose training, ROS 2 Jazzy integration and a Gazebo simulation environment.',
        proof: [
          { v: '+57.5%', k: 'mAP50 gain' },
          { v: '−59.7%', k: 'model size' },
          { v: '26 kp', k: 'custom keypoint schema' },
        ],
        skills: ['yolo', 'ros2', 'gazebo', 'pytorch', 'python', 'deep-learning', 'github'],
        src: 'lib/projects.ts — cow-pose',
        repo: ATBSBI,
        repoName: 'atbsbi',
      },
    ],
    chips: [
      {
        id: 'turtlebot',
        title: 'TurtleBot3 vision-guided navigation',
        line: 'OpenCV HSV tracking + 360° LiDAR + finite-state control in ROS 2 / Gazebo.',
        metric: 'target-following · obstacle-aware',
        skills: ['ros2', 'opencv', 'gazebo', 'github'],
        src: 'lib/projects.ts — turtlebot',
        repo: ATBSBI,
        repoName: 'atbsbi',
      },
      {
        id: 'drone',
        title: 'Drone delivery framework',
        line: 'AprilTag localization, Nav2 + PX4/Pixhawk control, precision landing simulation.',
        metric: '≤10 cm · <100 ms',
        skills: ['ros2', 'github'],
        src: 'lib/projects.ts — drone-delivery',
        repo: ATBSBI,
        repoName: 'atbsbi',
      },
      {
        id: 'crop',
        title: 'Crop disease classification',
        line: 'ResNet18 + Siamese / metric learning across 17 disease classes (~13k images).',
        metric: '92.3% accuracy',
        skills: ['pytorch', 'deep-learning', 'machine-learning', 'github'],
        src: 'lib/projects.ts — crop-disease',
        repo: ATBSBI,
        repoName: 'atbsbi',
      },
    ],
  },
  stack: {
    eyebrow: '04 · STACK / CONTROL',
    title: 'Systems under control',
    lede: 'No percentage bars — selecting a skill lights the evidence that proves it.',
    hint: 'multi-select — click again to release',
    clear: 'clear filter',
    clearWith: (n) => `clear filter · ${n}`,
    status: (skills, projects, rows, total) =>
      `${skills} · ${projects} ${projects === 1 ? 'project' : 'projects'} · ${rows} of ${total} evidence rows`,
    noEvidence: (skills) => `${skills} · no project on this page cites it`,
    columns: [
      {
        id: 'ai',
        title: 'AI · Deep Learning',
        items: [
          { label: 'Python', slug: 'python', src: 'skills.json' },
          { label: 'PyTorch', slug: 'pytorch', src: 'skills.json' },
          { label: 'TensorFlow', slug: 'tensorflow', src: 'skills.json' },
          { label: 'Machine Learning', slug: 'machine-learning', src: 'skills.json' },
          { label: 'Deep Learning', slug: 'deep-learning', src: 'skills.json' },
          { label: 'AI Systems', slug: 'ai-systems', src: 'skills.json' },
          { label: 'Research', slug: 'research', src: 'skills.json' },
          { label: 'AI Ethics', slug: 'ai-ethics', src: 'skills.json' },
        ],
      },
      {
        id: 'vision',
        title: 'Vision · Robotics',
        items: [
          { label: 'OpenCV', slug: 'opencv', src: 'experience.json · lib/projects.ts' },
          { label: 'YOLO', slug: 'yolo', src: 'lib/projects.ts' },
          { label: 'ROS 2', slug: 'ros2', src: 'lib/projects.ts' },
          { label: 'Gazebo', slug: 'gazebo', src: 'lib/projects.ts' },
          { label: 'Linux', slug: 'linux', src: 'skills.json' },
          { label: 'Shell Scripting', slug: 'shell-scripting', src: 'skills.json' },
          { label: 'Automation', slug: 'automation', src: 'skills.json' },
        ],
      },
      {
        id: 'cloud',
        title: 'Cloud · MLOps',
        items: [
          { label: 'FastAPI', slug: 'fastapi', src: 'skills.json · experience.json — Big Rattle' },
          { label: 'Docker', slug: 'docker', src: 'owner-confirmed' },
          { label: 'AWS Lambda', slug: 'aws-lambda', src: 'skills.json' },
          { label: 'Google Cloud Run', slug: 'gcp-run', src: 'skills.json' },
          { label: 'CI/CD', slug: 'ci-cd', src: 'skills.json' },
          { label: 'MLOps', slug: 'mlops', src: 'skills.json' },
        ],
      },
      {
        id: 'data',
        title: 'Data · Retrieval',
        items: [
          { label: 'FAISS', slug: 'faiss', src: 'skills.json' },
          { label: 'MySQL', slug: 'mysql', src: 'skills.json' },
          { label: 'MongoDB', slug: 'mongodb', src: 'skills.json' },
          { label: 'DynamoDB', slug: 'dynamodb', src: 'skills.json' },
          { label: 'GitHub', slug: 'github', src: 'skills.json' },
          { label: 'Data Engineering', slug: 'data-engineering', src: 'skills.json' },
          { label: 'Feature Engineering', slug: 'feature-engineering', src: 'skills.json' },
        ],
      },
    ],
  },
  evidence: {
    eyebrow: '05 · EVIDENCE / CALIBRATE',
    title: 'Measured, not claimed',
    lede: 'Benchmark table — measured-only; every row traces to its source file.',
    note: 'Measured-only. Anything without a measurement is not listed.',
    count: (n) => `${n} rows · ${n} sources`,
    litCount: (lit, total) => `${lit} of ${total} rows lit`,
    none: 'no row cites this skill',
    eduNote:
      'MSc Artificial Intelligence — University of Creative Arts (Berlin School of Business and Innovation) · 02/2025 – 08/2026 · awarded.',
    tableAria: 'Measured results, each row traced to its source',
    columns: ['#', 'Task', 'Method', 'Result', 'Source'],
    rows: [
      {
        task: 'Retail SKU detection',
        method: 'YOLOv5 fine-tune · 500+ SKUs',
        result: '95% precision',
        src: 'experience.json — Big Rattle',
        skills: ['yolo', 'opencv', 'python', 'deep-learning', 'fastapi'],
      },
      {
        task: 'Shelf audit automation',
        method: 'CV pipeline · GPS capture clustering',
        result: '−60% manual audits',
        src: 'experience.json — Big Rattle',
        skills: ['opencv', 'python', 'automation', 'data-engineering', 'fastapi'],
      },
      {
        task: 'Product counting',
        method: 'SAM + DinoV2 segmentation',
        result: '10k+ images/mo · −90% manual checks',
        src: 'experience.json — HRI',
        skills: ['deep-learning', 'pytorch', 'python'],
      },
      {
        task: 'Inference throughput',
        method: 'Python multiprocessing',
        result: '+50% production efficiency',
        src: 'experience.json — Big Rattle',
        skills: ['python', 'automation', 'fastapi'],
      },
      {
        task: 'SKU retrieval',
        method: 'YOLO + DINOv3 embeddings + FAISS',
        result: '93.7% top-1',
        src: 'lib/projects.ts — sku-vision',
        skills: ['yolo', 'faiss', 'deep-learning', 'python', 'opencv'],
      },
      {
        task: 'Animal pose estimation',
        method: 'YOLOv8n-pose · 26-kp dataset',
        result: '+57.5% mAP50 · −59.7% size',
        src: 'lib/projects.ts — cow-pose',
        skills: ['yolo', 'pytorch', 'deep-learning', 'python', 'ros2', 'gazebo'],
      },
      {
        task: 'Crop disease classification',
        method: 'ResNet18 · 17 classes',
        result: '92.3% accuracy',
        src: 'lib/projects.ts — crop-disease',
        skills: ['pytorch', 'deep-learning', 'machine-learning'],
      },
      {
        task: 'UAV precision landing',
        method: 'AprilTag + Nav2 / PX4',
        result: '≤10 cm · <100 ms',
        src: 'lib/projects.ts — drone-delivery',
        skills: ['ros2'],
      },
      {
        task: 'KYC document OCR',
        method: 'OpenCV verification',
        result: '90% accuracy',
        src: 'experience.json — EAZR',
        skills: ['opencv', 'python'],
      },
      {
        task: 'Transaction classification',
        method: 'spaCy multi-class NLP',
        result: '92% accuracy',
        src: 'experience.json — EAZR',
        skills: ['machine-learning', 'python'],
      },
      {
        task: 'Video-KYC liveness',
        method: 'Fraud checks',
        result: '+35% compliance',
        src: 'experience.json — EAZR',
        skills: ['opencv', 'python'],
      },
      {
        task: 'Credit scoring',
        method: 'Device-metadata engine',
        result: '+25% approval accuracy',
        src: 'experience.json — EAZR',
        skills: ['feature-engineering', 'machine-learning', 'python'],
      },
      {
        task: 'Platform reliability',
        method: 'Express.js + MongoDB',
        result: '99% uptime · 50+ ops/day',
        src: 'experience.json — Klimaneustart',
        skills: ['mongodb'],
      },
    ],
  },
  writing: {
    eyebrow: '06 · FIELD NOTES',
    title: 'Writing',
    lede: 'Five pieces on things I had to work out the hard way — tax, NER, bandits, denoising, sentiment.',
    posts: [
      {
        title: 'Understanding the German Tax System: A Student Quick Guide',
        date: '2025.03',
        description:
          'From why net salary looks nothing like gross to reducing the tax burden legally as a student.',
        url: 'https://sanket-gadge.blogspot.com/2025/03/understanding-german-tax-system-students.html',
      },
      {
        title: 'Training a Custom Named Entity Recogniser',
        date: '2021.06',
        description: 'Custom NER with spaCy — domain data, sparse labels, and shipping it.',
        url: 'https://sanket-gadge.blogspot.com/2021/06/training-custom-named-entity-recogniser.html',
      },
      {
        title: 'Reinforcement Learning — UCB and Thompson Sampling',
        date: '2021.02',
        description: 'Multi-armed bandits and the exploration–exploitation tradeoff.',
        url: 'https://sanket-gadge.blogspot.com/2021/02/reinforcement-learning-ucb-and-thompson.html',
      },
      {
        title: 'Image Denoising Using Auto Encoders',
        date: '2020.11',
        description: 'Training autoencoders to ignore signal noise — a practical intro to unsupervised learning.',
        url: 'https://sanket-gadge.blogspot.com/2020/11/image-denoising-using-auto-encoders.html',
      },
      {
        title: 'Sentiment Analysis on the IMDB Dataset',
        date: '2020.11',
        description: 'Predicting review sentiment from raw labelled data — preprocessing, modelling, evaluation.',
        url: 'https://sanket-gadge.blogspot.com/2020/11/sentiment-analysis-on-imdb-dataset.html',
      },
    ],
  },
  footer: {
    impressum: 'Impressum',
    datenschutz: 'Privacy',
    note: 'Built from measured sources. Illustrative captures are labelled.',
    top: '↑ top',
    legalAria: 'Legal and contact',
  },
  toast: {
    copied: (email) => `Copied — ${email}`,
    copyFailed: 'Copy failed',
    copyEmail: 'copied',
  },
}

const de: GtContent = {
  meta: {
    title: 'Ground Truth — Sanket Gadge · Computer Vision & KI-Ingenieur, Berlin',
    description:
      'Computer-Vision-Ingenieur in Berlin. 4+ Jahre Produktions-Pipelines zur Detektion, 95 % Präzision über 500+ SKUs. MSc KI (2026), 18 Monate Arbeitsplatzsuche nach dem Studium, sofort verfügbar.',
  },
  identity: {
    name: 'Sanket Gadge',
    role: 'Computer Vision, KI & Python Engineer',
    location: 'Berlin, Deutschland',
    availability: 'sofort verfügbar · 40 Std./Woche',
    status: 'MSc KI, Abschluss 2026',
  },
  contact: {
    email: EMAIL,
    github: GITHUB,
    linkedin: LINKEDIN,
    xing: XING,
    researchgate: RESEARCHGATE,
    cv: CV,
    headshot: HEADSHOT,
    eyebrow: '07 · CONTACT / DEPLOY',
    title: 'Pipeline deployen',
    lede: 'Ein Endpoint, keine Formulare: die Payload unten ist der ganze Handshake.',
    copy: 'E-Mail kopieren',
    copyAria: 'E-Mail-Adresse kopieren',
    mail: 'Mail',
    cvLabel: 'CV · PDF',
    cvAria: 'CV herunterladen (PDF)',
    payloadAria: 'Kontakt-Payload — JSON',
    cardAria: 'Operator-Karte',
    location: 'STANDORT',
    status: 'STATUS',
    foot: 'GROUND TRUTH · GT-758 · RELEASE 2026-10',
  },
  nav: {
    badge: 'SANKET GADGE',
    stages: [
      { id: 'ingest', target: '#ingest', label: 'INGEST' },
      { id: 'perceive', target: '#perceive', label: 'PERCEIVE' },
      { id: 'track', target: '#track', label: 'TRACK' },
      { id: 'retrieve', target: '#work', label: 'RETRIEVE' },
      { id: 'control', target: '#stack', label: 'CONTROL' },
      { id: 'calibrate', target: '#evidence', label: 'CALIBRATE' },
      { id: 'deploy', target: '#contact', label: 'DEPLOY' },
    ],
    github: 'GitHub',
    linkedin: 'LinkedIn',
    email: 'E-Mail',
    cv: 'CV ↓',
    skip: 'Zum Inhalt springen',
    langLabel: 'Sprache wechseln',
    theme: { toLight: 'Zum hellen Theme wechseln', toDark: 'Zum dunklen Theme wechseln', label: 'Farbschema' },
  },
  hero: {
    eyebrow: '01 · LAB / INGEST',
    name: 'Sanket Gadge',
    sub: 'Computer Vision, KI & Python Engineer — Berlin',
    hireTitle: 'Einstellungs-Fakten',
    hire: [
      { k: 'Sucht', v: 'Werkstudent · Festanstellung' },
      { k: 'Verfügbar', v: 'sofort · 40 Std./Woche' },
      {
        k: 'Aufenthalt',
        v: '18 Monate Arbeitsplatzsuche nach dem Studium (§ 20 AufenthG) · Änderung beim LEA Berlin beantragt',
      },
      { k: 'Sprachen', v: 'Deutsch B1 · Englisch' },
    ],
    stackLabel: 'Kern-Stack',
    ctaWork: 'Arbeit ansehen',
    ctaCv: 'CV herunterladen',
    copyEmail: 'E-Mail kopieren',
    cue: 'eine Aufnahme — Frame #1847 — durch sieben Stufen',
    kpisLabel: 'Kennzahlen',
    kpis: [
      { value: '95 %', label: 'Detektionspräzision · 500+ SKUs', src: 'experience.json — Big Rattle' },
      { value: '10k+', label: 'Bilder pro Monat verarbeitet', src: 'experience.json — HRI / SAM+DinoV2' },
      { value: '−60 %', label: 'manuelle Regal-Audits', src: 'experience.json — Colgate' },
      { value: '≤10 cm', label: 'autonome Landung · <100 ms', src: 'lib/projects.ts — drone-delivery' },
    ],
  },
  bench: {
    eyebrow: '01 · LAB / PERCEIVE',
    title: 'Inferenz-Bench',
    lede: 'Drei Aufnahmen aus der Arbeit unten, eine Bedienfläche: Schwelle, Ebenen, Split-Ansicht, Telemetrie. Synthetische Teile sind gekennzeichnet.',
    sceneAria: 'Szene',
    confidence: 'KONFIDENZ',
    viewLabel: 'ANSICHT',
    views: [
      { id: 'raw', label: 'RAW' },
      { id: 'seg', label: 'SEG+BBOX' },
      { id: 'embed', label: 'EMBED' },
    ],
    layersLabel: 'EBENEN',
    layers: [
      { id: 'boxes', label: 'Boxen' },
      { id: 'seg', label: 'Seg-Masken' },
      { id: 'nms', label: 'NMS-Geister' },
    ],
    split: 'SPLIT',
    telemetry: 'TELEMETRIE',
    sim: 'SIM · ILLUSTRATIV',
    sceneSrc: 'Szene-Quelle: ',
    canvasAria: 'Inferenz-Bench — Szenendarstellung',
    scenes: [
      {
        id: 'shelf',
        short: 'SHELF #1847',
        name: 'Regal — Frame #1847',
        note: 'illustrative Aufnahme · FAISS-Retrieval-Leiste',
        src: 'lib/projects.ts — sku-vision',
      },
      {
        id: 'quadruped',
        short: 'QUADRUPED 26 KP',
        name: 'Quadruped-Pose — 26 Keypoints',
        note: 'synthetisches Wireframe · Cow-Pose-Stack',
        src: 'lib/projects.ts — cow-pose',
      },
      {
        id: 'apriltag',
        short: 'APRILTAG LANDING',
        name: 'Aerial-AprilTag-Landung',
        note: 'illustrative Simulation · ≤10 cm · <100 ms',
        src: 'lib/projects.ts — drone-delivery',
      },
    ],
  },
  track: {
    eyebrow: '02 · TRACK',
    title: 'Karriere als Multi-Object-Tracking',
    lede: 'Sieben Tracks auf einer Timeline — echte Daten, persistente IDs. Scrollen bewegt den Playhead; der Datensatz darunter folgt ihm.',
    experience: 'Beruf',
    education: 'Bildung',
    hint: 'Track anklicken, um den Playhead zu setzen',
    hostAria: 'Karriere-Timeline (scrollt auf kleinen Bildschirmen horizontal)',
    present: 'heute',
    cardAria: 'Track-Datensatz',
  },
  timeline: [
    {
      id: 'T01',
      lane: 'edu',
      role: 'Diplom Computer Engineering',
      org: "VPM's Polytechnic",
      start: 2014.0,
      end: 2017.0,
      src: 'education.json — Diploma',
      facts: ['Diplom Computer Engineering, Thane, Indien.'],
    },
    {
      id: 'T02',
      lane: 'edu',
      role: 'BSc Computer Engineering',
      org: 'Mumbai University',
      start: 2017.0,
      end: 2020.0,
      src: 'education.json — BSc',
      facts: ['BSc Computer Engineering, Mumbai University.', 'Mumbai, Indien.'],
    },
    {
      id: 'T03',
      lane: 'edu',
      role: 'MSc Künstliche Intelligenz',
      org: 'University of Creative Arts (BSBI)',
      start: 2025.08,
      end: 2026.67,
      src: 'education.json — MSc',
      facts: [
        'MSc Künstliche Intelligenz — Berlin School of Business and Innovation.',
        'Berlin, Deutschland · Abschluss 08/2026.',
      ],
    },
    {
      id: 'T04',
      lane: 'exp',
      role: 'Monitoring Software Developer',
      org: 'Study League IT Solutions',
      start: 2018.42,
      end: 2018.58,
      src: 'experience.json — Study League',
      facts: [
        'Installierbare Windows-Monitoring-Software gebaut.',
        'Vier geplante Skripte mit präziser Timing-Logik automatisiert.',
      ],
    },
    {
      id: 'T05',
      lane: 'exp',
      role: 'AI / ML Engineer',
      org: 'EAZR DigiPayments',
      start: 2020.83,
      end: 2021.83,
      src: 'experience.json — EAZR',
      facts: [
        'Alternative Kreditbewertung über Gerätedaten — Genehmigungsgenauigkeit +25 %.',
        'OpenCV-OCR-Verifikation für KYC-Dokumente — 90 % Genauigkeit.',
        'spaCy-Klassifikator für Transaktionen/Spam — 92 % Genauigkeit.',
        'Video-KYC-Liveness-Checks — Compliance +35 %.',
      ],
    },
    {
      id: 'T06',
      lane: 'exp',
      role: 'AI / ML Engineer',
      org: 'Big Rattle Technologies',
      start: 2021.75,
      end: 2024.83,
      src: 'experience.json — Big Rattle',
      facts: [
        'Colgate-Regalüberwachung — manuelle Audits −60 %.',
        'YOLOv5-Finetune auf 500+ SKUs — 95 % Präzision.',
        'HRI-Streax-Zählung mit SAM + DinoV2 — 10k+ Bilder/Monat, manuelle Prüfungen −90 %.',
        'Python-Multiprocessing — Produktionseffizienz +50 %.',
      ],
    },
    {
      id: 'T07',
      lane: 'exp',
      role: 'Volunteer — DSGVO & Full Stack',
      org: 'Klimaneustart Berlin',
      start: 2025.5,
      end: 2025.75,
      src: 'experience.json — Klimaneustart',
      facts: [
        'DSGVO-konforme Datenverarbeitung — PII-Trennung, Hashing, Verschlüsselung.',
        'Express.js + MongoDB — 50+ tägliche Operationen, 99 % Uptime.',
      ],
    },
  ],
  work: {
    eyebrow: '03 · WORK / RETRIEVE',
    title: 'Belegte Systeme',
    lede: 'Drei Systeme, jeweils mit Architektur im Protokoll — plus drei kompakte Builds.',
    compact: 'Kompakte Builds',
    problem: 'Problem',
    system: 'System',
    architecture: 'Architektur',
    repo: 'repo',
    demo: 'demo',
    caseAria: (title) => `Fall — ${title}`,
    drawerAria: (title) => `Architektur — ${title}`,
    cases: [
      {
        id: 'retail-shelf',
        index: 'W.01',
        title: 'Regal-Intelligenz im Einzelhandel',
        org: 'Big Rattle Technologies · für Colgate',
        arch: 'retail',
        problem:
          'Manuelle Regal-Audits über viele Filialen waren langsam und inkonsistent; ähnlich verpackte Produkte wurden leicht verwechselt.',
        system:
          'Auf 500+ SKUs feinabgestimmte YOLOv5-Detektion, ein OpenCV-Maßalgorithmus für Millimeter-Unterschiede, GPS-Clustering der Aufnahmen und Python-Multiprocessing für den Durchsatz.',
        proof: [
          { v: '95 %', k: 'Detektionspräzision' },
          { v: '−60 %', k: 'manuelle Audits' },
          { v: '+15 %', k: 'Klassifikationszuverlässigkeit' },
        ],
        skills: ['python', 'yolo', 'opencv', 'deep-learning', 'automation', 'fastapi', 'data-engineering'],
        src: 'experience.json — Big Rattle',
      },
      {
        id: 'sku-vision',
        index: 'W.02',
        title: 'SKU-Vision-Pipeline',
        org: 'Eigenes Projekt · Live-Demo',
        arch: 'sku',
        problem:
          'Feingranulare Regal-Erkennung: visuell fast identische Produkte, wenige Labels pro neuer SKU.',
        system:
          'YOLO-Detektion in DINOv3-/MobileNetV2-Embeddings, in FAISS indexiert für Top-k-Retrieval mit Few-Shot-Unterstützung.',
        proof: [
          { v: '93,7 %', k: 'Top-1 im Evaluationsset' },
          { v: 'FAISS', k: 'Embedding-Retrieval für neue SKUs' },
        ],
        skills: ['yolo', 'faiss', 'pytorch', 'python', 'deep-learning', 'opencv', 'github'],
        src: 'lib/projects.ts — sku-vision',
        repo: 'https://github.com/Sanket758/sku-vision-pipeline',
        demo: 'https://sku-vision-pipeline.vercel.app/',
      },
      {
        id: 'cow-pose',
        index: 'W.03',
        title: 'Cow Pose — 26-Keypoint-Detektion',
        org: 'Eigenes Projekt · Kurs-Repository',
        arch: 'pose',
        problem:
          'Echtzeit-Tierposenschätzung braucht einen Keypoint-Datensatz und ein Modell, das neben einem Robotik-Stack läuft.',
        system:
          'Eigener 26-Keypoint-Datensatz, YOLOv8n-pose-Training, ROS-2-Jazzy-Integration und eine Gazebo-Simulationsumgebung.',
        proof: [
          { v: '+57,5 %', k: 'mAP50-Gewinn' },
          { v: '−59,7 %', k: 'Modellgröße' },
          { v: '26 kp', k: 'eigenes Keypoint-Schema' },
        ],
        skills: ['yolo', 'ros2', 'gazebo', 'pytorch', 'python', 'deep-learning', 'github'],
        src: 'lib/projects.ts — cow-pose',
        repo: ATBSBI,
        repoName: 'atbsbi',
      },
    ],
    chips: [
      {
        id: 'turtlebot',
        title: 'TurtleBot3 vision-geführte Navigation',
        line: 'OpenCV-HSV-Tracking + 360°-LiDAR + Finite-State-Control in ROS 2 / Gazebo.',
        metric: 'Zielverfolgung · hindernisbewusst',
        skills: ['ros2', 'opencv', 'gazebo', 'github'],
        src: 'lib/projects.ts — turtlebot',
        repo: ATBSBI,
        repoName: 'atbsbi',
      },
      {
        id: 'drone',
        title: 'Drohnen-Lieferframework',
        line: 'AprilTag-Lokalisierung, Nav2 + PX4/Pixhawk-Steuerung, Präzisionslandung in Simulation.',
        metric: '≤10 cm · <100 ms',
        skills: ['ros2', 'github'],
        src: 'lib/projects.ts — drone-delivery',
        repo: ATBSBI,
        repoName: 'atbsbi',
      },
      {
        id: 'crop',
        title: 'Pflanzenkrankheits-Klassifikation',
        line: 'ResNet18 + Siamese / Metric Learning über 17 Krankheitsklassen (~13k Bilder).',
        metric: '92,3 % Genauigkeit',
        skills: ['pytorch', 'deep-learning', 'machine-learning', 'github'],
        src: 'lib/projects.ts — crop-disease',
        repo: ATBSBI,
        repoName: 'atbsbi',
      },
    ],
  },
  stack: {
    eyebrow: '04 · STACK / CONTROL',
    title: 'Systeme unter Kontrolle',
    lede: 'Keine Prozentbalken — ein Klick auf eine Kompetenz beleuchtet den Beleg dafür.',
    hint: 'Mehrfachauswahl — erneut klicken zum Lösen',
    clear: 'Filter löschen',
    clearWith: (n) => `Filter löschen · ${n}`,
    status: (skills, projects, rows, total) =>
      `${skills} · ${projects} ${projects === 1 ? 'Projekt' : 'Projekte'} · ${rows} von ${total} Evidenzzeilen`,
    noEvidence: (skills) => `${skills} · kein Projekt auf dieser Seite nennt es`,
    columns: [
      {
        id: 'ai',
        title: 'KI · Deep Learning',
        items: [
          { label: 'Python', slug: 'python', src: 'skills.json' },
          { label: 'PyTorch', slug: 'pytorch', src: 'skills.json' },
          { label: 'TensorFlow', slug: 'tensorflow', src: 'skills.json' },
          { label: 'Machine Learning', slug: 'machine-learning', src: 'skills.json' },
          { label: 'Deep Learning', slug: 'deep-learning', src: 'skills.json' },
          { label: 'KI-Systeme', slug: 'ai-systems', src: 'skills.json' },
          { label: 'Forschung', slug: 'research', src: 'skills.json' },
          { label: 'KI-Ethik', slug: 'ai-ethics', src: 'skills.json' },
        ],
      },
      {
        id: 'vision',
        title: 'Vision · Robotik',
        items: [
          { label: 'OpenCV', slug: 'opencv', src: 'experience.json · lib/projects.ts' },
          { label: 'YOLO', slug: 'yolo', src: 'lib/projects.ts' },
          { label: 'ROS 2', slug: 'ros2', src: 'lib/projects.ts' },
          { label: 'Gazebo', slug: 'gazebo', src: 'lib/projects.ts' },
          { label: 'Linux', slug: 'linux', src: 'skills.json' },
          { label: 'Shell-Scripting', slug: 'shell-scripting', src: 'skills.json' },
          { label: 'Automatisierung', slug: 'automation', src: 'skills.json' },
        ],
      },
      {
        id: 'cloud',
        title: 'Cloud · MLOps',
        items: [
          { label: 'FastAPI', slug: 'fastapi', src: 'skills.json · experience.json — Big Rattle' },
          { label: 'Docker', slug: 'docker', src: 'owner-confirmed' },
          { label: 'AWS Lambda', slug: 'aws-lambda', src: 'skills.json' },
          { label: 'Google Cloud Run', slug: 'gcp-run', src: 'skills.json' },
          { label: 'CI/CD', slug: 'ci-cd', src: 'skills.json' },
          { label: 'MLOps', slug: 'mlops', src: 'skills.json' },
        ],
      },
      {
        id: 'data',
        title: 'Daten · Retrieval',
        items: [
          { label: 'FAISS', slug: 'faiss', src: 'skills.json' },
          { label: 'MySQL', slug: 'mysql', src: 'skills.json' },
          { label: 'MongoDB', slug: 'mongodb', src: 'skills.json' },
          { label: 'DynamoDB', slug: 'dynamodb', src: 'skills.json' },
          { label: 'GitHub', slug: 'github', src: 'skills.json' },
          { label: 'Data Engineering', slug: 'data-engineering', src: 'skills.json' },
          { label: 'Feature Engineering', slug: 'feature-engineering', src: 'skills.json' },
        ],
      },
    ],
  },
  evidence: {
    eyebrow: '05 · EVIDENCE / CALIBRATE',
    title: 'Gemessen, nicht behauptet',
    lede: 'Benchmark-Tabelle — nur Messwerte; jede Zeile verweist auf ihre Quelldatei.',
    note: 'Nur Messwerte. Was keine Messung hat, steht hier nicht.',
    count: (n) => `${n} Zeilen · ${n} Quellen`,
    litCount: (lit, total) => `${lit} von ${total} Zeilen markiert`,
    none: 'keine Zeile nennt diese Kompetenz',
    eduNote:
      'MSc Artificial Intelligence — University of Creative Arts (Berlin School of Business and Innovation) · 02/2025 – 08/2026 · abgeschlossen.',
    tableAria: 'Gemessene Ergebnisse, jede Zeile mit Quelle',
    columns: ['#', 'Aufgabe', 'Methode', 'Ergebnis', 'Quelle'],
    rows: [
      {
        task: 'Regal-SKU-Erkennung',
        method: 'YOLOv5-Finetune · 500+ SKUs',
        result: '95 % Präzision',
        src: 'experience.json — Big Rattle',
        skills: ['yolo', 'opencv', 'python', 'deep-learning', 'fastapi'],
      },
      {
        task: 'Regal-Audit-Automatisierung',
        method: 'CV-Pipeline · GPS-Clustering',
        result: '−60 % manuelle Audits',
        src: 'experience.json — Big Rattle',
        skills: ['opencv', 'python', 'automation', 'data-engineering', 'fastapi'],
      },
      {
        task: 'Produktzählung',
        method: 'SAM + DinoV2-Segmentierung',
        result: '10k+ Bilder/Monat · −90 % manuelle Prüfungen',
        src: 'experience.json — HRI',
        skills: ['deep-learning', 'pytorch', 'python'],
      },
      {
        task: 'Inferenz-Durchsatz',
        method: 'Python-Multiprocessing',
        result: '+50 % Produktionseffizienz',
        src: 'experience.json — Big Rattle',
        skills: ['python', 'automation', 'fastapi'],
      },
      {
        task: 'SKU-Retrieval',
        method: 'YOLO + DINOv3-Embeddings + FAISS',
        result: '93,7 % Top-1',
        src: 'lib/projects.ts — sku-vision',
        skills: ['yolo', 'faiss', 'deep-learning', 'python', 'opencv'],
      },
      {
        task: 'Tierposenschätzung',
        method: 'YOLOv8n-pose · 26-kp-Datensatz',
        result: '+57,5 % mAP50 · −59,7 % Größe',
        src: 'lib/projects.ts — cow-pose',
        skills: ['yolo', 'pytorch', 'deep-learning', 'python', 'ros2', 'gazebo'],
      },
      {
        task: 'Pflanzenkrankheits-Klassifikation',
        method: 'ResNet18 · 17 Klassen',
        result: '92,3 % Genauigkeit',
        src: 'lib/projects.ts — crop-disease',
        skills: ['pytorch', 'deep-learning', 'machine-learning'],
      },
      {
        task: 'UAV-Präzisionslandung',
        method: 'AprilTag + Nav2 / PX4',
        result: '≤10 cm · <100 ms',
        src: 'lib/projects.ts — drone-delivery',
        skills: ['ros2'],
      },
      {
        task: 'KYC-Dokument-OCR',
        method: 'OpenCV-Verifikation',
        result: '90 % Genauigkeit',
        src: 'experience.json — EAZR',
        skills: ['opencv', 'python'],
      },
      {
        task: 'Transaktionsklassifikation',
        method: 'spaCy Multi-Class-NLP',
        result: '92 % Genauigkeit',
        src: 'experience.json — EAZR',
        skills: ['machine-learning', 'python'],
      },
      {
        task: 'Video-KYC-Liveness',
        method: 'Betrugsprüfungen',
        result: '+35 % Compliance',
        src: 'experience.json — EAZR',
        skills: ['opencv', 'python'],
      },
      {
        task: 'Kredit-Scoring',
        method: 'Gerätedaten-Engine',
        result: '+25 % Genehmigungsgenauigkeit',
        src: 'experience.json — EAZR',
        skills: ['feature-engineering', 'machine-learning', 'python'],
      },
      {
        task: 'Plattform-Zuverlässigkeit',
        method: 'Express.js + MongoDB',
        result: '99 % Uptime · 50+ Ops/Tag',
        src: 'experience.json — Klimaneustart',
        skills: ['mongodb'],
      },
    ],
  },
  writing: {
    eyebrow: '06 · FIELD NOTES',
    title: 'Texte',
    lede: 'Fünf Stücke über Dinge, die ich mir mühsam erarbeitet habe — Steuer, NER, Bandits, Denoising, Sentiment.',
    posts: [
      {
        title: 'German Tax System: A Student Quick Guide',
        date: '2025.03',
        description:
          'Warum netto anders aussieht als brutto — und wie man als Studierender die Steuerlast legal senkt.',
        url: 'https://sanket-gadge.blogspot.com/2025/03/understanding-german-tax-system-students.html',
      },
      {
        title: 'Training a Custom Named Entity Recogniser',
        date: '2021.06',
        description: 'Custom NER mit spaCy — Domänendaten, dünne Labels und der Weg in den Betrieb.',
        url: 'https://sanket-gadge.blogspot.com/2021/06/training-custom-named-entity-recogniser.html',
      },
      {
        title: 'Reinforcement Learning — UCB and Thompson Sampling',
        date: '2021.02',
        description: 'Multi-Armed Bandits und der Zielkonflikt zwischen Exploration und Exploitation.',
        url: 'https://sanket-gadge.blogspot.com/2021/02/reinforcement-learning-ucb-and-thompson.html',
      },
      {
        title: 'Image Denoising Using Auto Encoders',
        date: '2020.11',
        description: 'Autoencoder, die Signalrauschen ignorieren — ein Einstieg ins unüberwachte Lernen.',
        url: 'https://sanket-gadge.blogspot.com/2020/11/image-denoising-using-auto-encoders.html',
      },
      {
        title: 'Sentiment Analysis on the IMDB Dataset',
        date: '2020.11',
        description: 'Review-Sentiment aus Rohdaten — Vorverarbeitung, Modellierung, Auswertung.',
        url: 'https://sanket-gadge.blogspot.com/2020/11/sentiment-analysis-on-imdb-dataset.html',
      },
    ],
  },
  footer: {
    impressum: 'Impressum',
    datenschutz: 'Datenschutz',
    note: 'Aus belegten Quellen gebaut. Illustrative Aufnahmen sind gekennzeichnet.',
    top: '↑ nach oben',
    legalAria: 'Rechtliches und Kontakt',
  },
  toast: {
    copied: (email) => `Kopiert — ${email}`,
    copyFailed: 'Kopieren fehlgeschlagen',
    copyEmail: 'kopiert',
  },
}

export const content: Record<Lang, GtContent> = { en, de }

export const getContent = (lang: Lang): GtContent => content[lang]
