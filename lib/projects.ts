/**
 * Curated project evidence bank for the portfolio Projects section.
 *
 * Source of truth: `.agents/github-project-inventory.md` and
 * `.agents/local-agent-evidence-inventory.md`. We surface only the
 * flagship (S/High-value) evidence — never duplicated collections,
 * tutorials, or unverifiable claims. All metrics below are pulled
 * from verified dissertation/report data or code+test evidence.
 *
 * Categories mirror the canonical positioning narratives from the
 * inventories: Computer Vision, Robotics, Agentic AI, Applied ML,
 * Edge AI, and Python/Backend.
 */

export type ProjectGroup =
  | 'computer-vision'
  | 'robotics'
  | 'agentic'
  | 'applied-ml'
  | 'edge'
  | 'backend'

export interface Project {
  id: string
  title: string
  /** short narrative of what was built */
  description: string
  /** verified headline result, when one exists */
  metric?: string
  tech: string[]
  /** github.com/<owner>/<repo> */
  repo?: string
  /** local-only evidence, surfaced with a note */
  localOnly?: boolean
  /** visual motif seed + variant, for a distinct header per project */
  seeds: { wave: number; eq: number }
  group: ProjectGroup
}

export const PROJECT_GROUPS: Record<
  ProjectGroup,
  { label: string; order: number }
> = {
  'computer-vision': { label: 'Computer Vision · ML', order: 0 },
  robotics: { label: 'Robotics · Autonomous Systems', order: 1 },
  agentic: { label: 'Agentic AI · Automation', order: 2 },
  'applied-ml': { label: 'Applied ML · Research', order: 3 },
  edge: { label: 'Edge AI · Mobile ML', order: 4 },
  backend: { label: 'Python · Backend', order: 5 },
}

export const projects: Project[] = [
  // ── Computer Vision / ML ──────────────────────────────────────
  {
    id: 'sku-vision',
    title: 'SKU Vision Pipeline',
    description:
      'End-to-end fine-grained SKU recognition combining YOLO detection with DINOv3/MobileNetV2 visual embeddings and FAISS retrieval — built for visually-similar retail product recognition with few-shot support.',
    metric: '93.7% top-1 on the final evaluation set',
    tech: ['PyTorch', 'YOLO', 'DINOv3', 'MobileNetV2', 'CLIP', 'FAISS', 'OpenCV'],
    repo: 'Sanket758/sku-vision-pipeline',
    seeds: { wave: 1, eq: 1 },
    group: 'computer-vision',
  },
  {
    id: 'crop-disease',
    title: 'Crop Disease Classification',
    description:
      'ResNet18-based crop-disease classifier with Siamese / metric-learning components trained across 17 disease classes and ~13K images.',
    metric: '92.3% reported accuracy · 17 classes',
    tech: ['PyTorch', 'ResNet18', 'Siamese', 'Metric Learning'],
    repo: 'Sanket758/AtBSBI',
    seeds: { wave: 2, eq: 2 },
    group: 'computer-vision',
  },
  // ── Robotics / Autonomous Systems ─────────────────────────────
  {
    id: 'cow-pose',
    title: 'Cow Pose / Keypoint Detection',
    description:
      'YOLOv8n-pose perception pipeline with a custom 26-keypoint dataset, ROS2 Jazzy integration and simulated Gazebo environment for real-time animal pose estimation.',
    metric: '57.5% mAP50 gain · 59.7% smaller model',
    tech: ['YOLOv8', 'ROS2', 'Gazebo', 'Python'],
    repo: 'Sanket758/AtBSBI',
    seeds: { wave: 3, eq: 3 },
    group: 'robotics',
  },
  {
    id: 'turtlebot',
    title: 'TurtleBot3 Vision-Guided Navigation',
    description:
      'Vision-guided TurtleBot3 autonomous navigation in ROS2/Gazebo using OpenCV HSV tracking, 360° LiDAR and finite-state control for target-following and obstacle-aware motion.',
    tech: ['ROS2', 'OpenCV', 'LiDAR', 'Gazebo', 'FSM'],
    repo: 'Sanket758/AtBSBI',
    seeds: { wave: 4, eq: 4 },
    group: 'robotics',
  },
  {
    id: 'drone-delivery',
    title: 'Drone Delivery Framework',
    description:
      'Autonomous UAV delivery / navigation architecture in ROS2 with visual AprilTag localization, Nav2 + PX4/Pixhawk control and precision landing simulation.',
    metric: 'Landing ≤10 cm · <100 ms latency',
    tech: ['ROS2', 'Nav2', 'PX4', 'AprilTags'],
    repo: 'Sanket758/AtBSBI',
    seeds: { wave: 5, eq: 5 },
    group: 'robotics',
  },
  // ── Agentic AI / Automation ───────────────────────────────────
  {
    id: 'gmail-agent',
    title: 'Event-driven Gmail→Tracker Agent',
    description:
      'Crash-safe Gmail sync engine with hybrid rule+LLM classification, confidence-tiered human review, 5-level employer matching and an auditable SQLite event store with dead-letter queue + replay.',
    metric: '201 tests · 14 modules',
    tech: ['Python', 'SQLite', 'LLM', 'OAuth2'],
    repo: 'Sanket758/german-career-ops',
    localOnly: true,
    seeds: { wave: 6, eq: 6 },
    group: 'agentic',
  },
  {
    id: 'trendshorts',
    title: 'TrendShorts — Multi-Agent Video Pipeline',
    description:
      '12 specialized agents under a custom orchestrator with event bus, SQLite job-state resume/retry, pluggable Ollama + NVIDIA-NIM LLM backends and faster-whisper transcription with rights-clearance guardrails.',
    metric: '20 tests · real scheduled runs',
    tech: ['Python', 'FastAPI', 'SQLite', 'Whisper', 'Ollama'],
    seeds: { wave: 7, eq: 7 },
    localOnly: true,
    group: 'agentic',
  },
  // ── Applied ML / Research ─────────────────────────────────────
  {
    id: 'credit-card-fraud',
    title: 'Credit Card Fraud Detection',
    description:
      'Imbalanced fraud-detection classifier using SMOTE, stratified splitting and ensembles (XGBoost, Random Forest, MLP) plus Isolation Forest, evaluated on precision/recall/F1.',
    tech: ['Python', 'XGBoost', 'scikit-learn', 'SMOTE'],
    repo: 'Sanket758/AtBSBI',
    seeds: { wave: 14, eq: 14 },
    group: 'applied-ml',
  },
  {
    id: 'ai-snake',
    title: 'AI Snake',
    description:
      'Autonomous Snake gameplay agent trained with policy-gradient / REINFORCE-style reinforcement learning, including a Python training and evaluation loop.',
    tech: ['PyTorch', 'Policy Gradient', 'Python', 'Pygame'],
    repo: 'Sanket758/AI-Snake',
    seeds: { wave: 12, eq: 12 },
    group: 'applied-ml',
  },
  {
    id: 'tensorflow-chatbot',
    title: 'Intent-based TensorFlow Chatbot',
    description:
      'Intent-classification chatbot using TensorFlow and NLTK with bag-of-words features, available through CLI, Tkinter and Flask interfaces.',
    tech: ['TensorFlow', 'NLTK', 'NLP', 'Flask'],
    repo: 'Sanket758/AI-Chatbot-with-Tensorflow',
    seeds: { wave: 13, eq: 13 },
    group: 'applied-ml',
  },
  // ── Edge AI / Mobile ML ───────────────────────────────────────
  {
    id: 'gemstone',
    title: 'RN Gemstone Classifier',
    description:
      'TensorFlow Lite image classification integrated into a React Native app for on-device gemstone recognition from user-selected images.',
    tech: ['React Native', 'TensorFlow Lite', 'Mobile Inference'],
    repo: 'Sanket758/RN-Gemstone-Classifier',
    seeds: { wave: 10, eq: 10 },
    group: 'edge',
  },
  {
    id: 'blink-smile',
    title: 'RN Blink & Smile Detection',
    description:
      'Real-time face-landmark blink/smile detection running on-device with TensorFlow Lite, tuned for edge inference on mobile.',
    tech: ['React Native', 'TensorFlow Lite', 'CV'],
    repo: 'Sanket758/RN-Blink-Smile-Detection',
    seeds: { wave: 11, eq: 11 },
    group: 'edge',
  },
  // ── Python / Backend ──────────────────────────────────────────
  {
    id: 'django-rest',
    title: 'Django PostgreSQL REST API',
    description:
      'Django REST API with a PostgreSQL-oriented data layer and a structured endpoint architecture.',
    tech: ['Python', 'Django', 'PostgreSQL', 'REST API'],
    repo: 'Sanket758/Django-PostgreSQL-Rest-API',
    seeds: { wave: 15, eq: 15 },
    group: 'backend',
  },
  {
    id: 'activity-monitor',
    title: 'Activity Monitor',
    description:
      'Python automation that captures periodic screenshots and uploads them to Google Drive via OAuth 2.0.',
    tech: ['Python', 'Google Drive API', 'OAuth2'],
    repo: 'Sanket758/Activity-Monitor',
    seeds: { wave: 16, eq: 16 },
    group: 'backend',
  },
]

/** Ordered group keys, mirroring the canonical positioning order. */
export const projectGroupOrder: ProjectGroup[] = [
  'computer-vision',
  'robotics',
  'agentic',
  'applied-ml',
  'edge',
  'backend',
]
