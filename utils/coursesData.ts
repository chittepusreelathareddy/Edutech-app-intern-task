import { Course } from '../store/courseStore';

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  lessons: { id: string; title: string; duration: string; completed?: boolean }[];
}

export interface PremiumCourse extends Course {
  subtitle: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string;
  lessonsCount: number;
  studentsCount: number;
  originalPrice: number;
  isPro?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  instructorTitle: string;
  modules: CourseModule[];
  learningOutcomes: string[];
  targetAudience: string;
}

export const PREMIUM_COURSES: PremiumCourse[] = [
  {
    id: 'course-fullstack-2026',
    title: 'Full-Stack Web Development Bootcamp 2026',
    subtitle: 'Master Next.js 15, TypeScript, Node.js, Tailwind CSS & PostgreSQL from Scratch',
    description:
      'Become a job-ready full-stack software engineer. Build 8 real-world microservices, serverless APIs, auth systems, and deploy scalable cloud applications to AWS and Vercel.',
    price: 89.99,
    originalPrice: 199.99,
    category: 'Web Dev',
    thumbnail:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    level: 'Intermediate',
    duration: '38 hrs',
    lessonsCount: 84,
    studentsCount: 18450,
    isPro: true,
    isBestseller: true,
    isFeatured: true,
    instructorName: 'Sarah Jenkins',
    instructorTitle: 'Staff Software Engineer @ TechLead Labs',
    instructorAvatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    learningOutcomes: [
      'Build responsive frontends with Next.js 15 App Router & React Server Components',
      'Design RESTful & GraphQL APIs with Express, Node.js and TypeScript',
      'Implement Secure JWT Authentication, OAuth2 & RBAC Permissions',
      'Deploy production databases with PostgreSQL, Prisma ORM & Redis Caching',
    ],
    targetAudience: 'Aspiring web developers, software engineers, and bootcamp grads wanting production-level full-stack mastery.',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Modern Frontend Architecture & Next.js 15',
        duration: '8 hrs',
        lessons: [
          { id: 'l1', title: 'Course Overview & Dev Setup', duration: '12 min', completed: true },
          { id: 'l2', title: 'React Server Components & Streaming SSR', duration: '45 min' },
          { id: 'l3', title: 'Tailwind CSS Design Systems & Modern Layouts', duration: '35 min' },
        ],
      },
      {
        id: 'm2',
        title: 'Module 2: Backend APIs, Prisma ORM & Database Design',
        duration: '12 hrs',
        lessons: [
          { id: 'l4', title: 'PostgreSQL Schema Modeling & Relations', duration: '50 min' },
          { id: 'l5', title: 'Building Scalable Express & Node.js Services', duration: '65 min' },
          { id: 'l6', title: 'JWT Authentication & Refresh Token Rotation', duration: '40 min' },
        ],
      },
      {
        id: 'm3',
        title: 'Module 3: Cloud Deployment, CI/CD & Performance Tuning',
        duration: '18 hrs',
        lessons: [
          { id: 'l7', title: 'Dockerizing Full-Stack Apps', duration: '45 min' },
          { id: 'l8', title: 'Deploying to AWS ECS & Vercel Edge', duration: '55 min' },
        ],
      },
    ],
  },
  {
    id: 'course-ai-masterclass',
    title: 'AI & Large Language Models (LLM) Masterclass',
    subtitle: 'Build Custom AI Agents, RAG Pipelines, LangChain & Fine-Tune Llama 3',
    description:
      'Master generative AI engineering. Learn to build autonomous AI agents, multi-modal vector search databases with Pinecone, fine-tune open-source models, and integrate Gemini & OpenAI APIs.',
    price: 94.99,
    originalPrice: 229.99,
    category: 'AI & ML',
    thumbnail:
      'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    rating: 4.95,
    level: 'Advanced',
    duration: '42 hrs',
    lessonsCount: 96,
    studentsCount: 22100,
    isPro: true,
    isBestseller: true,
    isFeatured: true,
    instructorName: 'Dr. Alex Rivera',
    instructorTitle: 'AI Research Scientist & Ex-DeepMind Scholar',
    instructorAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    learningOutcomes: [
      'Build production RAG (Retrieval-Augmented Generation) applications',
      'Fine-tune Llama 3 & Mistral using QLoRA & Hugging Face Transformers',
      'Master LangChain, LlamaIndex, and Vector Databases (Pinecone, Qdrant)',
      'Engineer multi-agent workflows with AutoGen & CrewAI framework',
    ],
    targetAudience: 'Data scientists, software engineers, and AI enthusiasts looking to build enterprise AI applications.',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Foundations of LLMs & Prompt Engineering',
        duration: '10 hrs',
        lessons: [
          { id: 'l1', title: 'Transformer Architectures & Self-Attention Explained', duration: '40 min' },
          { id: 'l2', title: 'Prompt Engineering & System Prompt Mastery', duration: '30 min' },
        ],
      },
      {
        id: 'm2',
        title: 'Module 2: Building Enterprise RAG Applications',
        duration: '16 hrs',
        lessons: [
          { id: 'l3', title: 'Vector Embeddings & Semantic Search', duration: '45 min' },
          { id: 'l4', title: 'LangChain & LlamaIndex Pipelines', duration: '60 min' },
        ],
      },
    ],
  },
  {
    id: 'course-react-native-expo',
    title: 'React Native & Expo Mobile Engineering',
    subtitle: 'Build Cross-Platform iOS & Android Apps with NativeWind, Expo Router & Reanimated',
    description:
      'The ultimate hands-on guide to modern React Native app development. Master Expo SDK 56, file-based routing, native gestures, offline persistence, push notifications, and App Store publishing.',
    price: 74.99,
    originalPrice: 179.99,
    category: 'Mobile Eng',
    thumbnail:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    rating: 4.88,
    level: 'Intermediate',
    duration: '32 hrs',
    lessonsCount: 72,
    studentsCount: 14800,
    isPro: true,
    isBestseller: true,
    instructorName: 'David Chen',
    instructorTitle: 'Principal Mobile Architect',
    instructorAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    learningOutcomes: [
      'Master Expo Router file-based navigation & tab layouts',
      'Style native UIs effortlessly with NativeWind (Tailwind CSS)',
      'Create 60fps smooth animations with React Native Reanimated 3',
      'Publish iOS & Android apps to App Store & Google Play via EAS Build',
    ],
    targetAudience: 'Web developers transitioning to mobile, or React developers building native iOS and Android apps.',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Expo Architecture & File-Based Routing',
        duration: '8 hrs',
        lessons: [
          { id: 'l1', title: 'Setting up Expo SDK & Project Structure', duration: '20 min' },
          { id: 'l2', title: 'Stack & Tab Navigation with Expo Router', duration: '35 min' },
        ],
      },
    ],
  },
  {
    id: 'course-ui-ux-design-systems',
    title: 'UI/UX Design Systems & Figma Masterclass',
    subtitle: 'Craft Scalable Design Tokens, Component Libraries & Micro-Interactions',
    description:
      'Learn how silicon valley tech companies create world-class design systems. Master auto-layout 5.0, variables, design tokens, responsive UI components, interactive prototypes, and UX usability testing.',
    price: 64.99,
    originalPrice: 149.99,
    category: 'UI/UX Design',
    thumbnail:
      'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80',
    rating: 4.92,
    level: 'All Levels',
    duration: '26 hrs',
    lessonsCount: 58,
    studentsCount: 19300,
    isPro: false,
    isBestseller: true,
    instructorName: 'Elena Rostova',
    instructorTitle: 'Lead Product Designer @ Design Studio',
    instructorAvatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    learningOutcomes: [
      'Create comprehensive Figma Design Systems from scratch',
      'Master Auto Layout, Variants, Component Sets & Variables',
      'Design accessible, high-contrast color palettes and typography scales',
      'Build realistic interactive prototypes with micro-animations',
    ],
    targetAudience: 'UI/UX designers, product managers, and developers wanting top-tier UI design skills.',
    modules: [],
  },
  {
    id: 'course-system-design-architecture',
    title: 'System Design & Distributed Architecture',
    subtitle: 'Design High-Scalability Systems for Millions of Concurrent Users',
    description:
      'Prepare for senior & staff software engineering interviews and real-world infrastructure challenges. Master microservices, load balancing, message queues (Kafka), Redis caching, DB sharding & CAP theorem.',
    price: 99.99,
    originalPrice: 249.99,
    category: 'Architecture',
    thumbnail:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    rating: 4.97,
    level: 'Advanced',
    duration: '45 hrs',
    lessonsCount: 110,
    studentsCount: 26400,
    isPro: true,
    isBestseller: true,
    instructorName: 'Marcus Vance',
    instructorTitle: 'Distinguished Architect & Ex-Netflix VP',
    instructorAvatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    learningOutcomes: [
      'Design fault-tolerant distributed systems & microservice meshes',
      'Implement Redis caching strategies & Rate Limiting algorithms',
      'Master Apache Kafka event streaming & Async Message Queues',
      'Solve 15 real-world system design interview case studies (Uber, Netflix, Twitter)',
    ],
    targetAudience: 'Mid-to-senior software engineers preparing for architecture roles and high-scale interview rounds.',
    modules: [],
  },
  {
    id: 'course-cybersecurity-ethical-hacking',
    title: 'Cybersecurity & Ethical Hacking Essentials',
    subtitle: 'Penetration Testing, Network Security, OWASP Top 10 & Defense',
    description:
      'Learn how to secure web applications, networks, and cloud workloads. Gain practical experience with Nmap, Wireshark, Burp Suite, Metasploit, cryptography, and defensive security posture.',
    price: 79.99,
    originalPrice: 189.99,
    category: 'Cybersecurity',
    thumbnail:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    rating: 4.86,
    level: 'Intermediate',
    duration: '30 hrs',
    lessonsCount: 65,
    studentsCount: 11200,
    isPro: true,
    instructorName: 'Michael Thorne',
    instructorTitle: 'Certified Ethical Hacker (CEH) & SecOps Lead',
    instructorAvatar:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    learningOutcomes: [
      'Identify and remediate OWASP Top 10 Web Vulnerabilities',
      'Conduct network reconnaissance, packet analysis & vulnerability scans',
      'Understand public key infrastructure (PKI), TLS & AES encryption',
      'Build secure authentication pipelines and audit application logs',
    ],
    targetAudience: 'IT professionals, security analysts, and developers wanting to write exploit-proof code.',
    modules: [],
  },
  {
    id: 'course-cloud-aws-devops',
    title: 'Cloud Engineering with AWS & Kubernetes',
    subtitle: 'Infrastructure as Code (Terraform), Docker, Kubernetes & CI/CD Pipelines',
    description:
      'Master cloud-native infrastructure. Learn AWS services (EC2, S3, ECS, EKS, Lambda), containerize applications with Docker, orchestrate with Kubernetes, and automate deployments using Terraform.',
    price: 84.99,
    originalPrice: 199.99,
    category: 'Cloud & DevOps',
    thumbnail:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
    rating: 4.91,
    level: 'Intermediate',
    duration: '36 hrs',
    lessonsCount: 80,
    studentsCount: 16700,
    isPro: true,
    instructorName: 'Sophia Lin',
    instructorTitle: 'AWS Certified Solutions Architect Professional',
    instructorAvatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    learningOutcomes: [
      'Deploy multi-region cloud applications on AWS infrastructure',
      'Orchestrate microservices with Kubernetes (EKS) & Helm charts',
      'Provision cloud infrastructure deterministically using Terraform',
      'Set up continuous deployment pipelines with GitHub Actions',
    ],
    targetAudience: 'DevOps engineers, cloud developers, and system administrators expanding into AWS cloud engineering.',
    modules: [],
  },
  {
    id: 'course-data-science-python',
    title: 'Data Science & Big Data Analytics with Python',
    subtitle: 'Pandas, NumPy, Matplotlib, Scikit-Learn, SQL & Data Visualization',
    description:
      'Transform raw data into strategic business insights. Learn data manipulation with Pandas & NumPy, exploratory statistical analysis, SQL querying, machine learning modeling, and dashboard creation.',
    price: 69.99,
    originalPrice: 159.99,
    category: 'Data Science',
    thumbnail:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    rating: 4.89,
    level: 'Beginner',
    duration: '28 hrs',
    lessonsCount: 60,
    studentsCount: 15400,
    isPro: false,
    instructorName: 'Dr. James H. Watson',
    instructorTitle: 'Head of Data Science & Quantitative Analyst',
    instructorAvatar:
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    learningOutcomes: [
      'Clean, transform, and analyze complex datasets with Pandas',
      'Build predictive machine learning models using Scikit-Learn',
      'Craft compelling interactive data visualizations & executive dashboards',
      'Query relational databases using advanced SQL joins and window functions',
    ],
    targetAudience: 'Data analysts, business analysts, and Python enthusiasts starting a career in Data Science.',
    modules: [],
  },
];

export function getCuratedCourses(): PremiumCourse[] {
  return PREMIUM_COURSES;
}

export function findCuratedCourseById(id: string | number): PremiumCourse | undefined {
  return PREMIUM_COURSES.find((c) => String(c.id) === String(id));
}
