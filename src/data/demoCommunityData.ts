// Auto-generated DevConnect Demo Community Dataset
// Provides identical, fully-typed data for both client-side showcase and database sync

import { Profile, Project, Skill } from '@/types/database.types';

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profile?: any;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  focus: string;
  avatar_url: string;
  owner_id: string;
  is_demo: boolean;
  members: TeamMember[];
  active_projects_count?: number;
}

export interface CommunityRepository {
  id: string;
  name: string;
  owner: string;
  full_name: string;
  description: string;
  html_url: string;
  language: string;
  stars: number;
  forks: number;
  topics: string[];
  updated_at: string;
}

export interface DemoMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: any;
}

export interface DemoConversation {
  id: string;
  type: 'direct' | 'project' | 'group';
  name: string;
  members: { user_id: string; profile: any }[];
  messages: DemoMessage[];
  last_message?: DemoMessage;
}

export const DEMO_PROFILES: (Profile & { skillsList: string[]; professional_description?: any })[] = [
  {
    "id": "d3300000-0000-4000-a000-000000000001",
    "username": "arjun.codes",
    "full_name": "Arjun Patel",
    "avatar_url": "preset:dev-1",
    "bio": "Passionate about distributed microservices, event streams, and building developer-first developer tooling. Open source advocate.",
    "headline": "Senior Full-Stack Architect | Distributed Systems & Go",
    "location": "Bangalore, India",
    "website_url": "https://arjunpatel.dev",
    "github_username": "arjun-patel",
    "experience_level": "Senior",
    "availability_status": "open_to_collaborate",
    "weekly_hours_available": 15,
    "interests": [
      "Distributed Systems",
      "Go",
      "Microservices",
      "Kubernetes"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Distributed Systems",
        "Go",
        "Microservices",
        "Kubernetes"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.961Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Go",
      "TypeScript",
      "PostgreSQL",
      "Docker",
      "Kubernetes",
      "Redis",
      "React",
      "REST APIs"
    ],
    "professional_description": {
      "bio": "Full-stack software architect with 6+ years shipping high-throughput backends and reactive React frontends.",
      "technical_interests": [
        "Distributed consensus (Raft/Paxos)",
        "High-concurrency Go services",
        "Rust for systems programming",
        "Edge computing"
      ],
      "current_goals": "Architecting fault-tolerant task orchestrators and mentoring early-career engineers in distributed systems.",
      "collaboration_style": "Async-first, documented PRs, clear architecture decision records (ADRs), weekly sprint sync.",
      "target_projects": [
        "Developer infrastructure tools",
        "Real-time telemetry platforms",
        "Open-source distributed databases"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000002",
    "username": "dev_meera",
    "full_name": "Meera Nair",
    "avatar_url": "preset:dev-2",
    "bio": "Obsessed with fluid micro-interactions, accessible UI architecture, and modern WebGL canvases. Linear & Vercel design aesthetic enthusiast.",
    "headline": "Lead Frontend Engineer | UI/UX & Design Systems",
    "location": "Mumbai, India",
    "website_url": "https://meera.design",
    "github_username": "meera-nair",
    "experience_level": "Lead",
    "availability_status": "open_to_collaborate",
    "weekly_hours_available": 12,
    "interests": [
      "Design Systems",
      "React",
      "Framer Motion",
      "Tailwind CSS",
      "Web Performance"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Design Systems",
        "React",
        "Framer Motion",
        "Tailwind CSS",
        "Web Performance"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "React",
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "Figma",
      "WebSockets"
    ],
    "professional_description": {
      "bio": "Design systems engineer crafting pixel-perfect, accessible component libraries and high-performance React frontends.",
      "technical_interests": [
        "Design tokens & Tailwind orchestration",
        "Complex animation choreographies with Framer Motion",
        "Accessible ARIA patterns"
      ],
      "current_goals": "Building frictionless developer tool interfaces with sub-100ms interaction latencies.",
      "collaboration_style": "Pair programming on critical components, Figma tokens-to-code workflow, proactive UI reviews.",
      "target_projects": [
        "Dark-mode first developer SaaS dashboards",
        "Interactive canvas applications",
        "Component design libraries"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000003",
    "username": "harshitbuilds",
    "full_name": "Harshit Sharma",
    "avatar_url": "preset:dev-3",
    "bio": "Compiling Rust to Wasm, optimizing memory layouts, and building ultra-fast developer platforms with zero-cost abstractions.",
    "headline": "Systems Engineer | Rust, WebAssembly & Low Latency",
    "location": "Delhi NCR, India",
    "website_url": "https://harshit.systems",
    "github_username": "harshit-builds",
    "experience_level": "Senior",
    "availability_status": "available",
    "weekly_hours_available": 20,
    "interests": [
      "Rust",
      "WebAssembly",
      "Performance",
      "Compilers"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Rust",
        "WebAssembly",
        "Performance",
        "Compilers"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Rust",
      "C++",
      "Linux",
      "Docker",
      "WebSockets",
      "PostgreSQL"
    ],
    "professional_description": {
      "bio": "Systems programmer focused on high-throughput services, Wasm runtimes, and concurrent network protocols in Rust.",
      "technical_interests": [
        "Tokio async runtimes",
        "SIMD optimizations",
        "Zero-copy serialization (FlatBuffers)",
        "Cross-compilation"
      ],
      "current_goals": "Creating blazing-fast edge processing engines that run seamlessly in browser and cloud.",
      "collaboration_style": "Benchmark-driven development, comprehensive integration tests, async GitHub reviews.",
      "target_projects": [
        "Wasm-powered client runtime engines",
        "Edge compute proxies",
        "Distributed cache clusters"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000004",
    "username": "rohanxdev",
    "full_name": "Rohan Mehta",
    "avatar_url": "preset:dev-4",
    "bio": "Fine-tuning open weights models, building agentic reasoning workflows, and optimizing vector search pipelines with LangChain & PyTorch.",
    "headline": "AI/ML Researcher & LLM Orchestration Engineer",
    "location": "Pune, India",
    "website_url": "https://rohanmehta.ai",
    "github_username": "rohan-mehta",
    "experience_level": "Mid-Level",
    "availability_status": "open_to_collaborate",
    "weekly_hours_available": 10,
    "interests": [
      "AI Agents",
      "PyTorch",
      "Vector Databases",
      "LangChain"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "AI Agents",
        "PyTorch",
        "Vector Databases",
        "LangChain"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Python",
      "PyTorch",
      "OpenAI API",
      "Gemini API",
      "LangChain",
      "FastAPI",
      "PostgreSQL"
    ],
    "professional_description": {
      "bio": "Machine learning specialist developing production RAG systems, model evaluation harnesses, and multi-agent systems.",
      "technical_interests": [
        "Quantized LLM deployment (GGUF/vLLM)",
        "Hierarchical RAG architectures",
        "Tool-calling agents"
      ],
      "current_goals": "Fine-tuning specialized coding assistant models and building autonomous pair-programming pipelines.",
      "collaboration_style": "Experiment notebooks with clear metrics, reproducible validation sets, weekly sprint check-ins.",
      "target_projects": [
        "AI code reviewers",
        "Automated developer matchmaking engines",
        "Semantic code search"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000005",
    "username": "ananya.codes",
    "full_name": "Ananya Roy",
    "avatar_url": "preset:dev-5",
    "bio": "Automating multi-cloud deployments, GitOps pipelines with ArgoCD, and maintaining 99.99% reliability for developer workloads.",
    "headline": "Cloud Native & Platform Engineer | Kubernetes & Helm",
    "location": "Hyderabad, India",
    "website_url": "https://ananya.cloud",
    "github_username": "ananya-roy",
    "experience_level": "Senior",
    "availability_status": "busy",
    "weekly_hours_available": 8,
    "interests": [
      "Kubernetes",
      "Terraform",
      "CI/CD",
      "AWS",
      "Observability"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Kubernetes",
        "Terraform",
        "CI/CD",
        "AWS",
        "Observability"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Kubernetes",
      "Docker",
      "AWS",
      "Google Cloud",
      "Terraform",
      "GitHub Actions",
      "Linux"
    ],
    "professional_description": {
      "bio": "Platform engineer specializing in infrastructure-as-code, zero-trust cloud security, and resilient Kubernetes clusters.",
      "technical_interests": [
        "GitOps automation",
        "eBPF networking with Cilium",
        "OpenTelemetry observability stacks",
        "Cost optimization"
      ],
      "current_goals": "Building ephemeral preview environment platforms for fast pull-request testing.",
      "collaboration_style": "Terraform modules with strict PR linting, automated staging deployments, blameless post-mortems.",
      "target_projects": [
        "Developer platform orchestrators",
        "Cloud monitoring dashboards",
        "Automated CI/CD pipelines"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000006",
    "username": "akash_fullstack",
    "full_name": "Akash Verma",
    "avatar_url": "preset:dev-6",
    "bio": "Shipping clean SaaS products from prototype to production. Fan of PostgreSQL row-level security and TypeScript end-to-end.",
    "headline": "Full-Stack Developer | Next.js, Node.js & Supabase",
    "location": "Chennai, India",
    "website_url": "https://akashverma.dev",
    "github_username": "akash-verma",
    "experience_level": "Mid-Level",
    "availability_status": "open_to_collaborate",
    "weekly_hours_available": 16,
    "interests": [
      "Next.js",
      "Supabase",
      "TypeScript",
      "Tailwind CSS"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Next.js",
        "Supabase",
        "TypeScript",
        "Tailwind CSS"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "TypeScript",
      "JavaScript",
      "React",
      "Next.js",
      "Node.js",
      "Supabase",
      "PostgreSQL",
      "Tailwind CSS"
    ],
    "professional_description": {
      "bio": "Product-focused full-stack engineer who loves rapid prototyping and turning complex requirements into clean applications.",
      "technical_interests": [
        "Type-safe RPC (tRPC)",
        "Supabase Realtime & PostgreSQL triggers",
        "Responsive UI architecture"
      ],
      "current_goals": "Collaborating on open-source developer networking tools and student portfolio ecosystems.",
      "collaboration_style": "Daily async updates on Slack/Discord, clean atomic git commits, rapid feature iterations.",
      "target_projects": [
        "Developer job match platforms",
        "Real-time collaborative whiteboards",
        "Project management SaaS"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000007",
    "username": "ishita.ml",
    "full_name": "Ishita Sen",
    "avatar_url": "preset:dev-7",
    "bio": "Building natural language understanding pipelines, custom embeddings, and conversational AI agents with Hugging Face & PyTorch.",
    "headline": "NLP & Deep Learning Engineer | Transformers & GenAI",
    "location": "Kolkata, India",
    "website_url": "https://ishita.tech",
    "github_username": "ishita-sen",
    "experience_level": "Mid-Level",
    "availability_status": "open_to_collaborate",
    "weekly_hours_available": 12,
    "interests": [
      "Transformers",
      "Hugging Face",
      "Python",
      "Vector Search"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Transformers",
        "Hugging Face",
        "Python",
        "Vector Search"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Python",
      "PyTorch",
      "Hugging Face",
      "FastAPI",
      "OpenAI API",
      "PostgreSQL"
    ],
    "professional_description": {
      "bio": "Deep learning practitioner working on state-of-the-art NLP models, embedding clustering, and domain adaptation.",
      "technical_interests": [
        "Parameter-efficient fine-tuning (LoRA/QLoRA)",
        "Semantic similarity matching",
        "Contextual summarization"
      ],
      "current_goals": "Developing semantic matching models for pairing developers with open-source project needs.",
      "collaboration_style": "Open notebook sharing, reproducible experimental pipelines, structured model documentation.",
      "target_projects": [
        "AI resume & skill analysers",
        "Intelligent search engines",
        "Code sentiment & review tools"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000008",
    "username": "nikhilcreates",
    "full_name": "Nikhil Deshmukh",
    "avatar_url": "preset:dev-8",
    "bio": "Bridging design and code. Creating tactile interfaces, 3D web experiences, and micro-interactions that make software feel alive.",
    "headline": "Creative Developer & UI/UX Designer | 3D & WebGL",
    "location": "Bengaluru, India",
    "website_url": "https://nikhil.design",
    "github_username": "nikhil-deshmukh",
    "experience_level": "Senior",
    "availability_status": "open_to_collaborate",
    "weekly_hours_available": 14,
    "interests": [
      "UI/UX",
      "Three.js",
      "Figma",
      "Framer Motion",
      "Tailwind CSS"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "UI/UX",
        "Three.js",
        "Figma",
        "Framer Motion",
        "Tailwind CSS"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Figma",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "JavaScript"
    ],
    "professional_description": {
      "bio": "Creative technologist with 5+ years crafting distinct visual identities and interactive digital experiences.",
      "technical_interests": [
        "Interactive shader art",
        "High-contrast typography systems",
        "Haptic feedback in web interfaces"
      ],
      "current_goals": "Redefining developer tools to possess the aesthetic refinement of editorial publications.",
      "collaboration_style": "Figma-first design exploration followed by high-fidelity React implementation and polish passes.",
      "target_projects": [
        "Editorial developer blogs",
        "Interactive documentation portals",
        "Creative portfolio builders"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000009",
    "username": "kavya.dev",
    "full_name": "Kavya Iyer",
    "avatar_url": "preset:dev-9",
    "bio": "Designing high-volume streaming architectures, distributed event buses, and resilient API gateways in Go and PostgreSQL.",
    "headline": "Backend Infrastructure Engineer | Go, gRPC & Kafka",
    "location": "Kochi, India",
    "website_url": "https://kavyaiyer.io",
    "github_username": "kavya-iyer",
    "experience_level": "Lead",
    "availability_status": "available",
    "weekly_hours_available": 18,
    "interests": [
      "Go",
      "Kafka",
      "gRPC",
      "Database Internals"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Go",
        "Kafka",
        "gRPC",
        "Database Internals"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Go",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Linux",
      "REST APIs",
      "WebSockets"
    ],
    "professional_description": {
      "bio": "Infrastructure and backend specialist with a track record of scaling distributed backends past 100k requests/second.",
      "technical_interests": [
        "Event-driven systems (Kafka/RabbitMQ)",
        "Postgres query planner tuning",
        "Strict contract-driven gRPC APIs"
      ],
      "current_goals": "Mentoring junior developers and architecting open source backends for collaborative tooling.",
      "collaboration_style": "Thorough code reviews with benchmark comparisons, detailed system schematics, clear milestone roadmaps.",
      "target_projects": [
        "Real-time messaging engines",
        "API monitoring & telemetry services",
        "Event-sourced task platforms"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000010",
    "username": "adityastacks",
    "full_name": "Aditya Joshi",
    "avatar_url": "preset:dev-10",
    "bio": "Securing cloud applications, hardening authentication workflows, and performing vulnerability assessments and penetration testing.",
    "headline": "Cybersecurity Engineer & AppSec Specialist",
    "location": "Ahmedabad, India",
    "website_url": "https://adityajoshi.security",
    "github_username": "aditya-sec",
    "experience_level": "Senior",
    "availability_status": "open_to_collaborate",
    "weekly_hours_available": 10,
    "interests": [
      "Cybersecurity",
      "OAuth2",
      "Zero Trust",
      "AppSec",
      "Linux"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Cybersecurity",
        "OAuth2",
        "Zero Trust",
        "AppSec",
        "Linux"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Python",
      "Linux",
      "Docker",
      "PostgreSQL",
      "REST APIs",
      "Git"
    ],
    "professional_description": {
      "bio": "Information security engineer focused on defending web applications against modern threat vectors and API vulnerabilities.",
      "technical_interests": [
        "OAuth 2.1 / OIDC protocols",
        "Postgres RLS security audits",
        "Automated SAST/DAST in CI/CD pipelines"
      ],
      "current_goals": "Building secure-by-default developer templates and open-source compliance checkers.",
      "collaboration_style": "Security threat modeling during design phase, peer review of sensitive auth paths, defensive coding standards.",
      "target_projects": [
        "Cybersecurity monitoring tools",
        "Identity & access management modules",
        "API penetration testing suites"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000011",
    "username": "tanvi_ux",
    "full_name": "Tanvi Kulkarni",
    "avatar_url": "preset:dev-11",
    "bio": "Crafting user-centered workflows for complex developer SaaS platforms. Advocate of WCAG AAA accessibility standards.",
    "headline": "Senior Product Designer | Design Systems & Accessibility",
    "location": "Pune, India",
    "website_url": "https://tanvi.design",
    "github_username": "tanvi-kulkarni",
    "experience_level": "Senior",
    "availability_status": "available",
    "weekly_hours_available": 15,
    "interests": [
      "UI/UX",
      "Accessibility",
      "Design Systems",
      "Figma"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "UI/UX",
        "Accessibility",
        "Design Systems",
        "Figma"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Figma",
      "Tailwind CSS",
      "React",
      "TypeScript"
    ],
    "professional_description": {
      "bio": "Product designer with deep technical literacy who writes clean semantic HTML/CSS and builds comprehensive Figma component libraries.",
      "technical_interests": [
        "Design tokens",
        "Micro-interactions",
        "User mental models in developer tools"
      ],
      "current_goals": "Creating world-class user interfaces for collaborative developer tools.",
      "collaboration_style": "High-touch alignment with frontend engineers, iterative user testing prototypes.",
      "target_projects": [
        "Developer dashboards",
        "Collaborative kanban boards",
        "Open-source documentation systems"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000012",
    "username": "siddharth.cloud",
    "full_name": "Siddharth Rao",
    "avatar_url": "preset:dev-12",
    "bio": "Automating everything from bare metal to Kubernetes clusters. Prometheus, Grafana, and OpenTelemetry advocate.",
    "headline": "DevOps & SRE Engineer | Multi-Cloud & Observability",
    "location": "Chennai, India",
    "website_url": "https://siddharthrao.dev",
    "github_username": "siddharth-cloud",
    "experience_level": "Mid-Level",
    "availability_status": "open_to_collaborate",
    "weekly_hours_available": 12,
    "interests": [
      "DevOps",
      "Kubernetes",
      "Prometheus",
      "Grafana",
      "Docker"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "DevOps",
        "Kubernetes",
        "Prometheus",
        "Grafana",
        "Docker"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Docker",
      "Kubernetes",
      "Terraform",
      "Linux",
      "AWS",
      "GitHub Actions"
    ],
    "professional_description": {
      "bio": "Site Reliability Engineer dedicated to system resilience, automated incident response, and performance profiling.",
      "technical_interests": [
        "SLO/SLA tracking dashboards",
        "Prometheus metrics aggregation",
        "Zero-downtime rolling updates"
      ],
      "current_goals": "Implementing real-time health telemetry across multi-region services.",
      "collaboration_style": "Infrastructure-as-code reviews, automated smoke tests, operational readiness checklists.",
      "target_projects": [
        "Cloud monitoring dashboards",
        "API health monitoring platforms",
        "Automated deployment pipelines"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000013",
    "username": "priya.data",
    "full_name": "Priya Nambiar",
    "avatar_url": "preset:dev-13",
    "bio": "Transforming petabytes of raw signals into actionable engineering insights, predictive models, and intuitive dashboards.",
    "headline": "Data Scientist & Analytics Engineer | Pandas & BigQuery",
    "location": "Trivandrum, India",
    "website_url": "https://priyanambiar.data",
    "github_username": "priya-data",
    "experience_level": "Senior",
    "availability_status": "open_to_collaborate",
    "weekly_hours_available": 14,
    "interests": [
      "Data Science",
      "Python",
      "BigQuery",
      "Data Analytics"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Data Science",
        "Python",
        "BigQuery",
        "Data Analytics"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Python",
      "SQL",
      "PostgreSQL",
      "FastAPI",
      "Google Cloud"
    ],
    "professional_description": {
      "bio": "Analytics engineer specializing in ETL pipelines, statistical modeling, and developer telemetry visualization.",
      "technical_interests": [
        "dbt transformations",
        "Streaming data aggregations",
        "Interactive Recharts dashboards"
      ],
      "current_goals": "Building developer productivity telemetry systems that respect engineer autonomy.",
      "collaboration_style": "Clear schema definitions, data validation tests, well-documented queries.",
      "target_projects": [
        "Data analytics dashboards",
        "GitHub contribution trackers",
        "Developer velocity analyzers"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000014",
    "username": "vikram.systems",
    "full_name": "Vikram Malhotra",
    "avatar_url": "preset:dev-14",
    "bio": "Architecting rock-solid enterprise backends, transactional integrity, and scalable event streaming with Kafka.",
    "headline": "Core Backend Architect | Java, Spring Boot & Distributed Caches",
    "location": "Gurgaon, India",
    "website_url": "https://vikrammalhotra.dev",
    "github_username": "vikram-malhotra",
    "experience_level": "Architect",
    "availability_status": "busy",
    "weekly_hours_available": 6,
    "interests": [
      "Java",
      "Spring Boot",
      "Kafka",
      "System Architecture"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Java",
        "Spring Boot",
        "Kafka",
        "System Architecture"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "Redis",
      "Docker",
      "REST APIs"
    ],
    "professional_description": {
      "bio": "Enterprise systems architect with 10+ years designing fault-tolerant transaction processing architectures.",
      "technical_interests": [
        "Distributed locking",
        "PostgreSQL query optimization",
        "Clean architecture principles"
      ],
      "current_goals": "Advising and building high-reliability open-source platforms.",
      "collaboration_style": "Architecture design reviews, strict API versioning, defensive error handling.",
      "target_projects": [
        "Student management systems",
        "Inventory management SaaS",
        "Payment transaction gateways"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000015",
    "username": "sneha_frontend",
    "full_name": "Sneha Banerjee",
    "avatar_url": "preset:dev-15",
    "bio": "Crafting responsive, high-speed single page applications with sub-second time-to-interactive and 100 Lighthouse scores.",
    "headline": "Frontend Engineer | React, TypeScript & Web Performance",
    "location": "Kolkata, India",
    "website_url": "https://snehabanerjee.dev",
    "github_username": "sneha-frontend",
    "experience_level": "Junior",
    "availability_status": "available",
    "weekly_hours_available": 20,
    "interests": [
      "React",
      "TypeScript",
      "Web Performance",
      "Tailwind CSS"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "React",
        "TypeScript",
        "Web Performance",
        "Tailwind CSS"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "React",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Git"
    ],
    "professional_description": {
      "bio": "Enthusiastic frontend engineer eager to contribute to collaborative projects and learn modern state management.",
      "technical_interests": [
        "TanStack Query caching strategies",
        "CSS grid & asymmetric layouts",
        "Component unit testing"
      ],
      "current_goals": "Collaborating on open-source applications and contributing to developer tool interfaces.",
      "collaboration_style": "Eager to receive code review feedback, fast iteration cycles, proactive communication.",
      "target_projects": [
        "Developer portfolio builders",
        "Code snippet sharing tools",
        "E-commerce platforms"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000016",
    "username": "rajesh.devops",
    "full_name": "Rajesh Gopinath",
    "avatar_url": "preset:dev-16",
    "bio": "Designing scalable cloud topographies across AWS and GCP. Automating deployment pipelines and security compliance.",
    "headline": "Senior Cloud Architect | AWS, Terraform & Zero Trust",
    "location": "Bengaluru, India",
    "website_url": "https://rajeshg.cloud",
    "github_username": "rajesh-gopinath",
    "experience_level": "Senior",
    "availability_status": "open_to_collaborate",
    "weekly_hours_available": 10,
    "interests": [
      "AWS",
      "Terraform",
      "Kubernetes",
      "Security"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "AWS",
        "Terraform",
        "Kubernetes",
        "Security"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "AWS",
      "Terraform",
      "Docker",
      "Kubernetes",
      "Linux",
      "Python"
    ],
    "professional_description": {
      "bio": "Cloud architect with extensive experience deploying enterprise SaaS workloads with strict SOC2 & GDPR compliance.",
      "technical_interests": [
        "Infrastructure-as-code modularity",
        "Serverless microservices (AWS Lambda)",
        "VPC peering & mesh security"
      ],
      "current_goals": "Helping collaborative open-source developer teams set up free-tier cloud architectures.",
      "collaboration_style": "Infrastructure blueprints, reproducible Docker environments, clear runbooks.",
      "target_projects": [
        "Cloud monitoring dashboards",
        "Automated CI/CD pipelines",
        "API gateways"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000017",
    "username": "pooja.mobile",
    "full_name": "Pooja Hegde",
    "avatar_url": "preset:dev-17",
    "bio": "Building smooth 60fps iOS and Android applications with offline-first local storage and snappy native animations.",
    "headline": "Mobile App Developer | React Native & Flutter",
    "location": "Mangalore, India",
    "website_url": "https://poojahegde.mobile",
    "github_username": "pooja-mobile",
    "experience_level": "Mid-Level",
    "availability_status": "available",
    "weekly_hours_available": 15,
    "interests": [
      "React Native",
      "Flutter",
      "Mobile UX",
      "Offline-First"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "React Native",
        "Flutter",
        "Mobile UX",
        "Offline-First"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "React",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "REST APIs",
      "Supabase"
    ],
    "professional_description": {
      "bio": "Cross-platform mobile engineer passionate about intuitive mobile experiences and high-performance native bridges.",
      "technical_interests": [
        "SQLite & WatermelonDB offline sync",
        "React Native Reanimated",
        "Push notification orchestration"
      ],
      "current_goals": "Building companion mobile apps for developer collaboration platforms.",
      "collaboration_style": "Mobile wireframes, rapid Expo prototypes, shared API schema synchronization.",
      "target_projects": [
        "Mobile chat applications",
        "Fitness tracking apps",
        "Smart attendance systems"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000018",
    "username": "manish.ai",
    "full_name": "Manish Chawla",
    "avatar_url": "preset:dev-18",
    "bio": "Training convolutional neural networks, vision transformers, and real-time object detection models at edge device constraints.",
    "headline": "Machine Learning Engineer | Computer Vision & PyTorch",
    "location": "Chandigarh, India",
    "website_url": "https://manishchawla.ai",
    "github_username": "manish-ai",
    "experience_level": "Mid-Level",
    "availability_status": "open_to_collaborate",
    "weekly_hours_available": 12,
    "interests": [
      "Computer Vision",
      "PyTorch",
      "TensorFlow",
      "Edge AI"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Computer Vision",
        "PyTorch",
        "TensorFlow",
        "Edge AI"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Python",
      "PyTorch",
      "TensorFlow",
      "FastAPI",
      "Docker"
    ],
    "professional_description": {
      "bio": "Computer vision researcher with experience deploying quantized inference models on mobile and embedded devices.",
      "technical_interests": [
        "Vision Transformers (ViT)",
        "OpenCV real-time image processing",
        "Model pruning & ONNX runtime"
      ],
      "current_goals": "Collaborating on real-time visual recognition applications.",
      "collaboration_style": "Jupyter notebooks with visual benchmarks, REST inference endpoints, reproducible training logs.",
      "target_projects": [
        "AI image classification systems",
        "Smart attendance systems",
        "Smart agriculture monitoring"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000019",
    "username": "deepa.infra",
    "full_name": "Deepa Krishnan",
    "avatar_url": "preset:dev-19",
    "bio": "Profiling Linux kernel bottlenecks, analyzing eBPF traces, and optimizing PostgreSQL query plans for massive read concurrency.",
    "headline": "Site Reliability Engineer | Linux Kernel & Performance",
    "location": "Coimbatore, India",
    "website_url": "https://deepakrishnan.tech",
    "github_username": "deepa-infra",
    "experience_level": "Senior",
    "availability_status": "open_to_collaborate",
    "weekly_hours_available": 10,
    "interests": [
      "Linux",
      "Performance",
      "eBPF",
      "PostgreSQL"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Linux",
        "Performance",
        "eBPF",
        "PostgreSQL"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Linux",
      "PostgreSQL",
      "Go",
      "Docker",
      "Git"
    ],
    "professional_description": {
      "bio": "SRE and systems performance specialist passionate about finding latency outliers and writing zero-overhead probes.",
      "technical_interests": [
        "eBPF tracing with bpftrace",
        "Postgres indexing & vacuum strategies",
        "Memory allocation tuning"
      ],
      "current_goals": "Optimizing open-source database response times and publishing performance audits.",
      "collaboration_style": "Benchmark flamegraphs, deterministic reproducibility, structured bug post-mortems.",
      "target_projects": [
        "Cloud monitoring dashboards",
        "API performance monitors",
        "Database telemetry tools"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000020",
    "username": "kunal.api",
    "full_name": "Kunal Singhania",
    "avatar_url": "preset:dev-20",
    "bio": "Designing federated GraphQL graphs, high-volume REST endpoints, and schema-driven developer experiences.",
    "headline": "API Architect | GraphQL, Node.js & Microservices",
    "location": "Mumbai, India",
    "website_url": "https://kunalsinghania.dev",
    "github_username": "kunal-api",
    "experience_level": "Lead",
    "availability_status": "available",
    "weekly_hours_available": 16,
    "interests": [
      "GraphQL",
      "Node.js",
      "NestJS",
      "TypeScript"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "GraphQL",
        "Node.js",
        "NestJS",
        "TypeScript"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "TypeScript",
      "Node.js",
      "NestJS",
      "GraphQL",
      "REST APIs",
      "PostgreSQL",
      "Redis"
    ],
    "professional_description": {
      "bio": "Senior backend architect specializing in clean APIs, domain-driven design, and developer portal documentation.",
      "technical_interests": [
        "Apollo Federation & GraphQL mesh",
        "OpenAPI 3.1 specification tooling",
        "Redis rate limiting & caching"
      ],
      "current_goals": "Architecting developer-friendly APIs for modern collaborative applications.",
      "collaboration_style": "API design-first approach, contract testing, typed SDK generation for frontend consumers.",
      "target_projects": [
        "Real-time chat platforms",
        "Code snippet sharing tools",
        "API monitoring platforms"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000021",
    "username": "aarav.dev",
    "full_name": "Aarav Gupta",
    "avatar_url": "preset:dev-22",
    "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
    "headline": "Frontend Engineer | Vue.js & Nuxt",
    "location": "Jaipur, India",
    "website_url": "https://aaravdev.dev",
    "github_username": "aarav-dev",
    "experience_level": "Junior",
    "availability_status": "available",
    "weekly_hours_available": 10,
    "interests": [
      "Vue.js",
      "Nuxt.js",
      "Software Architecture"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Vue.js",
        "Nuxt.js",
        "Software Architecture"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Vue.js",
      "Nuxt.js",
      "TypeScript",
      "Tailwind CSS"
    ],
    "professional_description": {
      "bio": "Dedicated Frontend Engineer | Vue.js & Nuxt with strong technical fundamentals and passion for reliable collaborative engineering.",
      "technical_interests": [
        "Vue.js",
        "Nuxt.js",
        "Clean Code"
      ],
      "current_goals": "Building impactful open-source tools with developer communities.",
      "collaboration_style": "Async communication, clear task estimation, peer reviews.",
      "target_projects": [
        "Collaborative platforms",
        "Developer tools",
        "SaaS applications"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000022",
    "username": "divya.sec",
    "full_name": "Divya Ranganathan",
    "avatar_url": "preset:dev-23",
    "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
    "headline": "Penetration Tester & Ethical Hacker",
    "location": "Chennai, India",
    "website_url": "https://divyasec.dev",
    "github_username": "divya-sec",
    "experience_level": "Senior",
    "availability_status": "open_to_collaborate",
    "weekly_hours_available": 11,
    "interests": [
      "Linux",
      "Python",
      "Software Architecture"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Linux",
        "Python",
        "Software Architecture"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Linux",
      "Python",
      "REST APIs",
      "Git"
    ],
    "professional_description": {
      "bio": "Dedicated Penetration Tester & Ethical Hacker with strong technical fundamentals and passion for reliable collaborative engineering.",
      "technical_interests": [
        "Linux",
        "Python",
        "Clean Code"
      ],
      "current_goals": "Building impactful open-source tools with developer communities.",
      "collaboration_style": "Async communication, clear task estimation, peer reviews.",
      "target_projects": [
        "Collaborative platforms",
        "Developer tools",
        "SaaS applications"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000023",
    "username": "tarun.code",
    "full_name": "Tarun Bhatia",
    "avatar_url": "preset:dev-24",
    "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
    "headline": "Full-Stack Developer | MERN Stack",
    "location": "Lucknow, India",
    "website_url": "https://taruncode.dev",
    "github_username": "tarun-code",
    "experience_level": "Mid-Level",
    "availability_status": "busy",
    "weekly_hours_available": 12,
    "interests": [
      "React",
      "Node.js",
      "Software Architecture"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "React",
        "Node.js",
        "Software Architecture"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "React",
      "Node.js",
      "MongoDB",
      "Express.js"
    ],
    "professional_description": {
      "bio": "Dedicated Full-Stack Developer | MERN Stack with strong technical fundamentals and passion for reliable collaborative engineering.",
      "technical_interests": [
        "React",
        "Node.js",
        "Clean Code"
      ],
      "current_goals": "Building impactful open-source tools with developer communities.",
      "collaboration_style": "Async communication, clear task estimation, peer reviews.",
      "target_projects": [
        "Collaborative platforms",
        "Developer tools",
        "SaaS applications"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000024",
    "username": "shreya.ui",
    "full_name": "Shreya Mukherjee",
    "avatar_url": "preset:dev-1",
    "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
    "headline": "Visual Designer & CSS Specialist",
    "location": "Kolkata, India",
    "website_url": "https://shreyaui.dev",
    "github_username": "shreya-ui",
    "experience_level": "Mid-Level",
    "availability_status": "available",
    "weekly_hours_available": 13,
    "interests": [
      "Figma",
      "Tailwind CSS",
      "Software Architecture"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Figma",
        "Tailwind CSS",
        "Software Architecture"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Figma",
      "Tailwind CSS",
      "React",
      "JavaScript"
    ],
    "professional_description": {
      "bio": "Dedicated Visual Designer & CSS Specialist with strong technical fundamentals and passion for reliable collaborative engineering.",
      "technical_interests": [
        "Figma",
        "Tailwind CSS",
        "Clean Code"
      ],
      "current_goals": "Building impactful open-source tools with developer communities.",
      "collaboration_style": "Async communication, clear task estimation, peer reviews.",
      "target_projects": [
        "Collaborative platforms",
        "Developer tools",
        "SaaS applications"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000025",
    "username": "varun.ml",
    "full_name": "Varun Kapoor",
    "avatar_url": "preset:dev-2",
    "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
    "headline": "Data Engineer | Spark & Data Pipelines",
    "location": "Noida, India",
    "website_url": "https://varunml.dev",
    "github_username": "varun-ml",
    "experience_level": "Senior",
    "availability_status": "open_to_collaborate",
    "weekly_hours_available": 14,
    "interests": [
      "Python",
      "SQL",
      "Software Architecture"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Python",
        "SQL",
        "Software Architecture"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Python",
      "SQL",
      "PostgreSQL",
      "Docker"
    ],
    "professional_description": {
      "bio": "Dedicated Data Engineer | Spark & Data Pipelines with strong technical fundamentals and passion for reliable collaborative engineering.",
      "technical_interests": [
        "Python",
        "SQL",
        "Clean Code"
      ],
      "current_goals": "Building impactful open-source tools with developer communities.",
      "collaboration_style": "Async communication, clear task estimation, peer reviews.",
      "target_projects": [
        "Collaborative platforms",
        "Developer tools",
        "SaaS applications"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000026",
    "username": "anita.cloud",
    "full_name": "Anita Deshpande",
    "avatar_url": "preset:dev-3",
    "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
    "headline": "Cloud Engineer | GCP & Kubernetes",
    "location": "Nagpur, India",
    "website_url": "https://anitacloud.dev",
    "github_username": "anita-cloud",
    "experience_level": "Senior",
    "availability_status": "busy",
    "weekly_hours_available": 15,
    "interests": [
      "Google Cloud",
      "Kubernetes",
      "Software Architecture"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Google Cloud",
        "Kubernetes",
        "Software Architecture"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Google Cloud",
      "Kubernetes",
      "Docker",
      "Terraform"
    ],
    "professional_description": {
      "bio": "Dedicated Cloud Engineer | GCP & Kubernetes with strong technical fundamentals and passion for reliable collaborative engineering.",
      "technical_interests": [
        "Google Cloud",
        "Kubernetes",
        "Clean Code"
      ],
      "current_goals": "Building impactful open-source tools with developer communities.",
      "collaboration_style": "Async communication, clear task estimation, peer reviews.",
      "target_projects": [
        "Collaborative platforms",
        "Developer tools",
        "SaaS applications"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000027",
    "username": "karthik.go",
    "full_name": "Karthik Raman",
    "avatar_url": "preset:dev-4",
    "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
    "headline": "Go Backend Developer | Microservices",
    "location": "Bengaluru, India",
    "website_url": "https://karthikgo.dev",
    "github_username": "karthik-go",
    "experience_level": "Mid-Level",
    "availability_status": "available",
    "weekly_hours_available": 16,
    "interests": [
      "Go",
      "Docker",
      "Software Architecture"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Go",
        "Docker",
        "Software Architecture"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Go",
      "Docker",
      "PostgreSQL",
      "REST APIs"
    ],
    "professional_description": {
      "bio": "Dedicated Go Backend Developer | Microservices with strong technical fundamentals and passion for reliable collaborative engineering.",
      "technical_interests": [
        "Go",
        "Docker",
        "Clean Code"
      ],
      "current_goals": "Building impactful open-source tools with developer communities.",
      "collaboration_style": "Async communication, clear task estimation, peer reviews.",
      "target_projects": [
        "Collaborative platforms",
        "Developer tools",
        "SaaS applications"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000028",
    "username": "swati.qa",
    "full_name": "Swati Mishra",
    "avatar_url": "preset:dev-5",
    "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
    "headline": "QA Automation Engineer | Cypress & Playwright",
    "location": "Bhopal, India",
    "website_url": "https://swatiqa.dev",
    "github_username": "swati-qa",
    "experience_level": "Mid-Level",
    "availability_status": "open_to_collaborate",
    "weekly_hours_available": 17,
    "interests": [
      "TypeScript",
      "JavaScript",
      "Software Architecture"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "TypeScript",
        "JavaScript",
        "Software Architecture"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "TypeScript",
      "JavaScript",
      "React",
      "Git"
    ],
    "professional_description": {
      "bio": "Dedicated QA Automation Engineer | Cypress & Playwright with strong technical fundamentals and passion for reliable collaborative engineering.",
      "technical_interests": [
        "TypeScript",
        "JavaScript",
        "Clean Code"
      ],
      "current_goals": "Building impactful open-source tools with developer communities.",
      "collaboration_style": "Async communication, clear task estimation, peer reviews.",
      "target_projects": [
        "Collaborative platforms",
        "Developer tools",
        "SaaS applications"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000029",
    "username": "alok.ai",
    "full_name": "Alok Trivedi",
    "avatar_url": "preset:dev-6",
    "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
    "headline": "AI Engineer | LangChain & Vector Search",
    "location": "Varanasi, India",
    "website_url": "https://alokai.dev",
    "github_username": "alok-ai",
    "experience_level": "Junior",
    "availability_status": "busy",
    "weekly_hours_available": 18,
    "interests": [
      "Python",
      "OpenAI API",
      "Software Architecture"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Python",
        "OpenAI API",
        "Software Architecture"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Python",
      "OpenAI API",
      "FastAPI",
      "LangChain"
    ],
    "professional_description": {
      "bio": "Dedicated AI Engineer | LangChain & Vector Search with strong technical fundamentals and passion for reliable collaborative engineering.",
      "technical_interests": [
        "Python",
        "OpenAI API",
        "Clean Code"
      ],
      "current_goals": "Building impactful open-source tools with developer communities.",
      "collaboration_style": "Async communication, clear task estimation, peer reviews.",
      "target_projects": [
        "Collaborative platforms",
        "Developer tools",
        "SaaS applications"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000030",
    "username": "bhavna.web",
    "full_name": "Bhavna Parekh",
    "avatar_url": "preset:dev-7",
    "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
    "headline": "Frontend Specialist | Angular & TypeScript",
    "location": "Surat, India",
    "website_url": "https://bhavnaweb.dev",
    "github_username": "bhavna-web",
    "experience_level": "Senior",
    "availability_status": "available",
    "weekly_hours_available": 19,
    "interests": [
      "Angular",
      "TypeScript",
      "Software Architecture"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Angular",
        "TypeScript",
        "Software Architecture"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Angular",
      "TypeScript",
      "REST APIs",
      "Tailwind CSS"
    ],
    "professional_description": {
      "bio": "Dedicated Frontend Specialist | Angular & TypeScript with strong technical fundamentals and passion for reliable collaborative engineering.",
      "technical_interests": [
        "Angular",
        "TypeScript",
        "Clean Code"
      ],
      "current_goals": "Building impactful open-source tools with developer communities.",
      "collaboration_style": "Async communication, clear task estimation, peer reviews.",
      "target_projects": [
        "Collaborative platforms",
        "Developer tools",
        "SaaS applications"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000031",
    "username": "chetan.rust",
    "full_name": "Chetan Kulkarni",
    "avatar_url": "preset:dev-8",
    "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
    "headline": "Rust Developer | Embedded & Systems",
    "location": "Nashik, India",
    "website_url": "https://chetanrust.dev",
    "github_username": "chetan-rust",
    "experience_level": "Mid-Level",
    "availability_status": "open_to_collaborate",
    "weekly_hours_available": 10,
    "interests": [
      "Rust",
      "Linux",
      "Software Architecture"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Rust",
        "Linux",
        "Software Architecture"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Rust",
      "Linux",
      "C++",
      "Git"
    ],
    "professional_description": {
      "bio": "Dedicated Rust Developer | Embedded & Systems with strong technical fundamentals and passion for reliable collaborative engineering.",
      "technical_interests": [
        "Rust",
        "Linux",
        "Clean Code"
      ],
      "current_goals": "Building impactful open-source tools with developer communities.",
      "collaboration_style": "Async communication, clear task estimation, peer reviews.",
      "target_projects": [
        "Collaborative platforms",
        "Developer tools",
        "SaaS applications"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000032",
    "username": "geeta.db",
    "full_name": "Geeta Sundaram",
    "avatar_url": "preset:dev-9",
    "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
    "headline": "PostgreSQL DBA & Query Tuner",
    "location": "Madurai, India",
    "website_url": "https://geetadb.dev",
    "github_username": "geeta-db",
    "experience_level": "Lead",
    "availability_status": "busy",
    "weekly_hours_available": 11,
    "interests": [
      "PostgreSQL",
      "SQL",
      "Software Architecture"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "PostgreSQL",
        "SQL",
        "Software Architecture"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "PostgreSQL",
      "SQL",
      "Linux",
      "Docker"
    ],
    "professional_description": {
      "bio": "Dedicated PostgreSQL DBA & Query Tuner with strong technical fundamentals and passion for reliable collaborative engineering.",
      "technical_interests": [
        "PostgreSQL",
        "SQL",
        "Clean Code"
      ],
      "current_goals": "Building impactful open-source tools with developer communities.",
      "collaboration_style": "Async communication, clear task estimation, peer reviews.",
      "target_projects": [
        "Collaborative platforms",
        "Developer tools",
        "SaaS applications"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000033",
    "username": "harsh.dev",
    "full_name": "Harsh Agrawal",
    "avatar_url": "preset:dev-10",
    "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
    "headline": "Full-Stack Engineer | Django & React",
    "location": "Indore, India",
    "website_url": "https://harshdev.dev",
    "github_username": "harsh-dev",
    "experience_level": "Mid-Level",
    "availability_status": "available",
    "weekly_hours_available": 12,
    "interests": [
      "Python",
      "Django",
      "Software Architecture"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Python",
        "Django",
        "Software Architecture"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Python",
      "Django",
      "React",
      "PostgreSQL"
    ],
    "professional_description": {
      "bio": "Dedicated Full-Stack Engineer | Django & React with strong technical fundamentals and passion for reliable collaborative engineering.",
      "technical_interests": [
        "Python",
        "Django",
        "Clean Code"
      ],
      "current_goals": "Building impactful open-source tools with developer communities.",
      "collaboration_style": "Async communication, clear task estimation, peer reviews.",
      "target_projects": [
        "Collaborative platforms",
        "Developer tools",
        "SaaS applications"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000034",
    "username": "indira.ux",
    "full_name": "Indira Pillai",
    "avatar_url": "preset:dev-11",
    "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
    "headline": "UX Researcher & Interaction Designer",
    "location": "Thrissur, India",
    "website_url": "https://indiraux.dev",
    "github_username": "indira-ux",
    "experience_level": "Senior",
    "availability_status": "open_to_collaborate",
    "weekly_hours_available": 13,
    "interests": [
      "Figma",
      "UI/UX",
      "Software Architecture"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Figma",
        "UI/UX",
        "Software Architecture"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Figma",
      "UI/UX",
      "Tailwind CSS",
      "React"
    ],
    "professional_description": {
      "bio": "Dedicated UX Researcher & Interaction Designer with strong technical fundamentals and passion for reliable collaborative engineering.",
      "technical_interests": [
        "Figma",
        "UI/UX",
        "Clean Code"
      ],
      "current_goals": "Building impactful open-source tools with developer communities.",
      "collaboration_style": "Async communication, clear task estimation, peer reviews.",
      "target_projects": [
        "Collaborative platforms",
        "Developer tools",
        "SaaS applications"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000035",
    "username": "jay.devops",
    "full_name": "Jayesh Shah",
    "avatar_url": "preset:dev-12",
    "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
    "headline": "DevOps Specialist | GitHub Actions & CI",
    "location": "Vadodara, India",
    "website_url": "https://jaydevops.dev",
    "github_username": "jay-devops",
    "experience_level": "Mid-Level",
    "availability_status": "busy",
    "weekly_hours_available": 14,
    "interests": [
      "GitHub Actions",
      "Docker",
      "Software Architecture"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "GitHub Actions",
        "Docker",
        "Software Architecture"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "GitHub Actions",
      "Docker",
      "Linux",
      "AWS"
    ],
    "professional_description": {
      "bio": "Dedicated DevOps Specialist | GitHub Actions & CI with strong technical fundamentals and passion for reliable collaborative engineering.",
      "technical_interests": [
        "GitHub Actions",
        "Docker",
        "Clean Code"
      ],
      "current_goals": "Building impactful open-source tools with developer communities.",
      "collaboration_style": "Async communication, clear task estimation, peer reviews.",
      "target_projects": [
        "Collaborative platforms",
        "Developer tools",
        "SaaS applications"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000036",
    "username": "komal.ai",
    "full_name": "Komal Narang",
    "avatar_url": "preset:dev-13",
    "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
    "headline": "Machine Learning Researcher | NLP",
    "location": "Amritsar, India",
    "website_url": "https://komalai.dev",
    "github_username": "komal-ai",
    "experience_level": "Junior",
    "availability_status": "available",
    "weekly_hours_available": 15,
    "interests": [
      "Python",
      "PyTorch",
      "Software Architecture"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Python",
        "PyTorch",
        "Software Architecture"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Python",
      "PyTorch",
      "Hugging Face",
      "FastAPI"
    ],
    "professional_description": {
      "bio": "Dedicated Machine Learning Researcher | NLP with strong technical fundamentals and passion for reliable collaborative engineering.",
      "technical_interests": [
        "Python",
        "PyTorch",
        "Clean Code"
      ],
      "current_goals": "Building impactful open-source tools with developer communities.",
      "collaboration_style": "Async communication, clear task estimation, peer reviews.",
      "target_projects": [
        "Collaborative platforms",
        "Developer tools",
        "SaaS applications"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000037",
    "username": "lalit.full",
    "full_name": "Lalit Somani",
    "avatar_url": "preset:dev-14",
    "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
    "headline": "Full-Stack Developer | SvelteKit & Supabase",
    "location": "Udaipur, India",
    "website_url": "https://lalitfull.dev",
    "github_username": "lalit-full",
    "experience_level": "Senior",
    "availability_status": "open_to_collaborate",
    "weekly_hours_available": 16,
    "interests": [
      "Svelte",
      "TypeScript",
      "Software Architecture"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Svelte",
        "TypeScript",
        "Software Architecture"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Svelte",
      "TypeScript",
      "Supabase",
      "PostgreSQL"
    ],
    "professional_description": {
      "bio": "Dedicated Full-Stack Developer | SvelteKit & Supabase with strong technical fundamentals and passion for reliable collaborative engineering.",
      "technical_interests": [
        "Svelte",
        "TypeScript",
        "Clean Code"
      ],
      "current_goals": "Building impactful open-source tools with developer communities.",
      "collaboration_style": "Async communication, clear task estimation, peer reviews.",
      "target_projects": [
        "Collaborative platforms",
        "Developer tools",
        "SaaS applications"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000038",
    "username": "mona.sec",
    "full_name": "Mona Saxena",
    "avatar_url": "preset:dev-15",
    "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
    "headline": "Cloud Security & IAM Architect",
    "location": "Dehradun, India",
    "website_url": "https://monasec.dev",
    "github_username": "mona-sec",
    "experience_level": "Lead",
    "availability_status": "busy",
    "weekly_hours_available": 17,
    "interests": [
      "AWS",
      "Linux",
      "Software Architecture"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "AWS",
        "Linux",
        "Software Architecture"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "AWS",
      "Linux",
      "Python",
      "Terraform"
    ],
    "professional_description": {
      "bio": "Dedicated Cloud Security & IAM Architect with strong technical fundamentals and passion for reliable collaborative engineering.",
      "technical_interests": [
        "AWS",
        "Linux",
        "Clean Code"
      ],
      "current_goals": "Building impactful open-source tools with developer communities.",
      "collaboration_style": "Async communication, clear task estimation, peer reviews.",
      "target_projects": [
        "Collaborative platforms",
        "Developer tools",
        "SaaS applications"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000039",
    "username": "nitin.code",
    "full_name": "Nitin Rawat",
    "avatar_url": "preset:dev-16",
    "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
    "headline": "Backend Developer | FastAPI & Redis",
    "location": "Ranchi, India",
    "website_url": "https://nitincode.dev",
    "github_username": "nitin-code",
    "experience_level": "Mid-Level",
    "availability_status": "available",
    "weekly_hours_available": 18,
    "interests": [
      "Python",
      "FastAPI",
      "Software Architecture"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Python",
        "FastAPI",
        "Software Architecture"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Python",
      "FastAPI",
      "Redis",
      "PostgreSQL"
    ],
    "professional_description": {
      "bio": "Dedicated Backend Developer | FastAPI & Redis with strong technical fundamentals and passion for reliable collaborative engineering.",
      "technical_interests": [
        "Python",
        "FastAPI",
        "Clean Code"
      ],
      "current_goals": "Building impactful open-source tools with developer communities.",
      "collaboration_style": "Async communication, clear task estimation, peer reviews.",
      "target_projects": [
        "Collaborative platforms",
        "Developer tools",
        "SaaS applications"
      ]
    }
  },
  {
    "id": "d3300000-0000-4000-a000-000000000040",
    "username": "ojas.mobile",
    "full_name": "Ojas Kadam",
    "avatar_url": "preset:dev-17",
    "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
    "headline": "Mobile Engineer | Flutter & Dart",
    "location": "Aurangabad, India",
    "website_url": "https://ojasmobile.dev",
    "github_username": "ojas-mobile",
    "experience_level": "Junior",
    "availability_status": "open_to_collaborate",
    "weekly_hours_available": 19,
    "interests": [
      "Flutter",
      "Dart",
      "Software Architecture"
    ],
    "collaboration_preferences": {
      "remoteOnly": true,
      "lookingFor": [
        "Flutter",
        "Dart",
        "Software Architecture"
      ],
      "preferredTeamSize": "3-5"
    },
    "is_onboarded": true,
    "is_demo": true,
    "created_at": "2026-10-08T05:26:46.964Z",
    "updated_at": "2026-11-07T05:26:46.964Z",
    "skillsList": [
      "Flutter",
      "Dart",
      "REST APIs",
      "Git"
    ],
    "professional_description": {
      "bio": "Dedicated Mobile Engineer | Flutter & Dart with strong technical fundamentals and passion for reliable collaborative engineering.",
      "technical_interests": [
        "Flutter",
        "Dart",
        "Clean Code"
      ],
      "current_goals": "Building impactful open-source tools with developer communities.",
      "collaboration_style": "Async communication, clear task estimation, peer reviews.",
      "target_projects": [
        "Collaborative platforms",
        "Developer tools",
        "SaaS applications"
      ]
    }
  }
];

export const DEMO_PROJECTS: Project[] = [
  {
    "id": "d3300000-0000-4000-b000-000000000001",
    "owner_id": "d3300000-0000-4000-a000-000000000004",
    "title": "AI Resume & Technical Skill Analyzer",
    "slug": "ai-resume-technical-skill-analyzer-100",
    "tagline": "Automated developer resume parser with skill ontology matching and portfolio scoring.",
    "description": "An AI-powered resume analyzer that parses PDF/Word developer portfolios, extracts technical proficiencies against a canonical tech ontology, benchmarks project complexity, and recommends high-fit engineering roles.",
    "category": "AI & Machine Learning",
    "status": "in_progress",
    "team_size_needed": 4,
    "deadline": "2026-12-07T05:26:46.965Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/ai-resume-analyzer",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "Python",
      "FastAPI",
      "PyTorch",
      "React",
      "TypeScript",
      "Tailwind CSS"
    ],
    "created_at": "2026-11-05T05:26:46.965Z",
    "updated_at": "2026-11-07T05:26:46.965Z",
    "tasks_count": 5,
    "completed_tasks_count": 4
  },
  {
    "id": "d3300000-0000-4000-b000-000000000002",
    "owner_id": "d3300000-0000-4000-a000-000000000001",
    "title": "Distributed Real-Time WebSocket Mesh",
    "slug": "distributed-real-time-websocket-mesh-101",
    "tagline": "High-throughput real-time messaging gateway backed by Redis Pub/Sub and Go.",
    "description": "A distributed message broker orchestrating real-time state synchronization, peer-to-peer WebRTC signaling, and bi-directional event distribution across multiple geographic edge nodes with low latency.",
    "category": "Infrastructure",
    "status": "active",
    "team_size_needed": 5,
    "deadline": "2026-12-09T05:26:46.965Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/realtime-chat-mesh",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "Go",
      "Redis",
      "Docker",
      "WebSockets",
      "Kubernetes"
    ],
    "created_at": "2026-11-04T05:26:46.965Z",
    "updated_at": "2026-11-07T05:26:46.965Z",
    "tasks_count": 5,
    "completed_tasks_count": 3
  },
  {
    "id": "d3300000-0000-4000-b000-000000000003",
    "owner_id": "d3300000-0000-4000-a000-000000000006",
    "title": "Modern E-Commerce Headless Storefront",
    "slug": "modern-e-commerce-headless-storefront-102",
    "tagline": "Sub-second page loads, edge-cached product catalogs, and serverless checkout flows.",
    "description": "A headless e-commerce platform built with Next.js App Router, Stripe Elements, Supabase PostgreSQL, and automated inventory sync with real-time stock notifications.",
    "category": "Web Application",
    "status": "in_progress",
    "team_size_needed": 4,
    "deadline": "2026-12-11T05:26:46.965Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/headless-ecommerce-suite",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "Next.js",
      "React",
      "TypeScript",
      "Supabase",
      "Tailwind CSS"
    ],
    "created_at": "2026-11-03T05:26:46.965Z",
    "updated_at": "2026-11-07T05:26:46.965Z",
    "tasks_count": 5,
    "completed_tasks_count": 4
  },
  {
    "id": "d3300000-0000-4000-b000-000000000004",
    "owner_id": "d3300000-0000-4000-a000-000000000014",
    "title": "Campus Student & Placement Management System",
    "slug": "campus-student-placement-management-system-103",
    "tagline": "Comprehensive academic tracking, internship placement drives, and student portfolios.",
    "description": "Centralized portal for college administrators, placement officers, and students to coordinate placement interviews, automate resume validation, and visualize historical placement statistics.",
    "category": "Web Application",
    "status": "completed",
    "team_size_needed": 3,
    "deadline": "2026-12-13T05:26:46.965Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/campus-placement-manager",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "React",
      "Node.js",
      "PostgreSQL",
      "Express.js",
      "Tailwind CSS"
    ],
    "created_at": "2026-11-02T05:26:46.965Z",
    "updated_at": "2026-11-07T05:26:46.965Z",
    "tasks_count": 5,
    "completed_tasks_count": 5
  },
  {
    "id": "d3300000-0000-4000-b000-000000000005",
    "owner_id": "d3300000-0000-4000-a000-000000000013",
    "title": "Smart Expense & Budget Analytics Tracker",
    "slug": "smart-expense-budget-analytics-tracker-104",
    "tagline": "Intelligent transaction categorization, recurring subscription detection, and budget alerts.",
    "description": "A modern personal finance dashboard that ingests bank statements, classifies recurring expenses with machine learning models, and forecasts monthly burn rates with interactive Recharts visualizations.",
    "category": "Web Application",
    "status": "active",
    "team_size_needed": 3,
    "deadline": "2026-12-15T05:26:46.965Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/smart-expense-analytics",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "React",
      "TypeScript",
      "Recharts",
      "Python",
      "PostgreSQL"
    ],
    "created_at": "2026-11-01T05:26:46.965Z",
    "updated_at": "2026-11-07T05:26:46.965Z",
    "tasks_count": 5,
    "completed_tasks_count": 3
  },
  {
    "id": "d3300000-0000-4000-b000-000000000006",
    "owner_id": "d3300000-0000-4000-a000-000000000007",
    "title": "Autonomous AI Coding Assistant & Reviewer",
    "slug": "autonomous-ai-coding-assistant-reviewer-105",
    "tagline": "Automated GitHub pull request reviewer providing semantic diff analysis and security audits.",
    "description": "A GitHub App and CLI tool that intercepts incoming pull requests, generates architectural summaries, detects security vulnerabilities, and suggests idiomatic refactoring using Gemini and OpenAI APIs.",
    "category": "AI & Machine Learning",
    "status": "in_progress",
    "team_size_needed": 4,
    "deadline": "2026-12-17T05:26:46.965Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/autonomous-code-reviewer",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "Python",
      "OpenAI API",
      "Gemini API",
      "TypeScript",
      "GitHub Actions"
    ],
    "created_at": "2026-10-31T05:26:46.965Z",
    "updated_at": "2026-11-07T05:26:46.965Z",
    "tasks_count": 5,
    "completed_tasks_count": 4
  },
  {
    "id": "d3300000-0000-4000-b000-000000000007",
    "owner_id": "d3300000-0000-4000-a000-000000000004",
    "title": "Hybrid Collaborative Movie Recommendation Engine",
    "slug": "hybrid-collaborative-movie-recommendation-engine-106",
    "tagline": "Vector embeddings + collaborative matrix factorization for personalized entertainment discovery.",
    "description": "A recommendation system that utilizes two-tower neural architectures to match user watch history with cinematic embeddings, streaming real-time recommendations over a reactive React UI.",
    "category": "AI & Machine Learning",
    "status": "completed",
    "team_size_needed": 3,
    "deadline": "2026-12-19T05:26:46.965Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/movie-recommendation-engine",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "Python",
      "PyTorch",
      "FastAPI",
      "React",
      "Tailwind CSS"
    ],
    "created_at": "2026-10-30T05:26:46.965Z",
    "updated_at": "2026-11-07T05:26:46.965Z",
    "tasks_count": 5,
    "completed_tasks_count": 5
  },
  {
    "id": "d3300000-0000-4000-b000-000000000008",
    "owner_id": "d3300000-0000-4000-a000-000000000002",
    "title": "Developer Social Network & Open Hub",
    "slug": "developer-social-network-open-hub-107",
    "tagline": "Dark editorial developer collaboration network uniting GitHub, LinkedIn, and Discord.",
    "description": "The flagship DevConnect ecosystem enabling developers to showcase projects, connect via AI teammate matching, track tasks on Kanban boards, and collaborate in real-time chat rooms.",
    "category": "Web Application",
    "status": "active",
    "team_size_needed": 6,
    "deadline": "2026-12-21T05:26:46.965Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/Deew101/DevConnect",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "React",
      "TypeScript",
      "Supabase",
      "Tailwind CSS",
      "Framer Motion"
    ],
    "created_at": "2026-10-29T05:26:46.965Z",
    "updated_at": "2026-11-07T05:26:46.965Z",
    "tasks_count": 5,
    "completed_tasks_count": 5
  },
  {
    "id": "d3300000-0000-4000-b000-000000000009",
    "owner_id": "d3300000-0000-4000-a000-000000000005",
    "title": "Multi-Cloud Infrastructure Observability Dashboard",
    "slug": "multi-cloud-infrastructure-observability-dashboard-108",
    "tagline": "Unified Prometheus metric aggregation, trace waterfall visualization, and SLA alert management.",
    "description": "A cloud-native observability portal that pulls live metrics from Kubernetes nodes, Docker daemons, and microservices into customizable Grafana-style dashboards with instant alert webhooks.",
    "category": "Infrastructure",
    "status": "in_progress",
    "team_size_needed": 4,
    "deadline": "2026-12-23T05:26:46.965Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/cloud-observability-mesh",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "Go",
      "Kubernetes",
      "Docker",
      "Prometheus",
      "React",
      "TypeScript"
    ],
    "created_at": "2026-10-28T05:26:46.965Z",
    "updated_at": "2026-11-07T05:26:46.965Z",
    "tasks_count": 5,
    "completed_tasks_count": 3
  },
  {
    "id": "d3300000-0000-4000-b000-000000000010",
    "owner_id": "d3300000-0000-4000-a000-000000000008",
    "title": "Interactive Developer Portfolio Generator",
    "slug": "interactive-developer-portfolio-generator-109",
    "tagline": "Turn your GitHub profile and markdown resume into a custom editorial web portfolio in 60s.",
    "description": "A static-site generator and hosted builder that reads GitHub public repositories, star counts, and commit histories to automatically assemble a sleek portfolio with custom typography and domain hosting.",
    "category": "Developer Tools",
    "status": "completed",
    "team_size_needed": 2,
    "deadline": "2026-12-25T05:26:46.965Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/portfolio-generator-pro",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "Framer Motion"
    ],
    "created_at": "2026-10-27T05:26:46.965Z",
    "updated_at": "2026-11-07T05:26:46.965Z",
    "tasks_count": 5,
    "completed_tasks_count": 5
  },
  {
    "id": "d3300000-0000-4000-b000-000000000011",
    "owner_id": "d3300000-0000-4000-a000-000000000001",
    "title": "Intelligent Job & Hackathon Teammate Matcher",
    "slug": "intelligent-job-hackathon-teammate-matcher-110",
    "tagline": "Semantic skill alignment algorithm pairing engineers based on complementary strengths.",
    "description": "An AI matching engine that evaluates developer experience levels, active project domains, and desired weekly commitments to form balanced hackathon squads and project teams.",
    "category": "AI & Machine Learning",
    "status": "active",
    "team_size_needed": 4,
    "deadline": "2026-12-27T05:26:46.965Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/teammate-matcher-ai",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "React",
      "TypeScript"
    ],
    "created_at": "2026-10-26T05:26:46.965Z",
    "updated_at": "2026-11-07T05:26:46.965Z",
    "tasks_count": 5,
    "completed_tasks_count": 4
  },
  {
    "id": "d3300000-0000-4000-b000-000000000012",
    "owner_id": "d3300000-0000-4000-a000-000000000003",
    "title": "Interactive Code Learning & Interactive Playground",
    "slug": "interactive-code-learning-interactive-playground-111",
    "tagline": "In-browser Wasm compiler sandbox with step-by-step algorithms and interactive challenges.",
    "description": "An interactive learning platform running WebAssembly runtimes inside the browser. Users can write Rust, C++, and Python code without server sandboxes and visualize data structures in real-time.",
    "category": "Developer Tools",
    "status": "in_progress",
    "team_size_needed": 5,
    "deadline": "2026-12-29T05:26:46.965Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/interactive-code-playground",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "Rust",
      "WebAssembly",
      "React",
      "TypeScript",
      "Tailwind CSS"
    ],
    "created_at": "2026-10-25T05:26:46.965Z",
    "updated_at": "2026-11-07T05:26:46.965Z",
    "tasks_count": 5,
    "completed_tasks_count": 3
  },
  {
    "id": "d3300000-0000-4000-b000-000000000013",
    "owner_id": "d3300000-0000-4000-a000-000000000017",
    "title": "Hyperlocal Food Delivery & Fleet Tracking App",
    "slug": "hyperlocal-food-delivery-fleet-tracking-app-112",
    "tagline": "Real-time GPS dispatch, driver route optimization, and live order status streams.",
    "description": "Full-stack food delivery application with driver companion app, live map tracking via WebSockets, menu management, and instant payment integration.",
    "category": "Mobile Application",
    "status": "completed",
    "team_size_needed": 4,
    "deadline": "2026-12-31T05:26:46.965Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/hyperlocal-food-delivery",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "React Native",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "WebSockets"
    ],
    "created_at": "2026-10-24T05:26:46.965Z",
    "updated_at": "2026-11-07T05:26:46.965Z",
    "tasks_count": 5,
    "completed_tasks_count": 5
  },
  {
    "id": "d3300000-0000-4000-b000-000000000014",
    "owner_id": "d3300000-0000-4000-a000-000000000018",
    "title": "Computer Vision Attendance & Biometric Recognition",
    "slug": "computer-vision-attendance-biometric-recognition-113",
    "tagline": "Real-time face recognition camera stream for classroom and office attendance logging.",
    "description": "An edge vision system that scans video feeds from IP cameras, verifies identities against a local face embedding database in under 50ms, and posts automated attendance reports to Supabase.",
    "category": "AI & Machine Learning",
    "status": "active",
    "team_size_needed": 3,
    "deadline": "2027-01-02T05:26:46.965Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/cv-attendance-system",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "Python",
      "OpenCV",
      "PyTorch",
      "FastAPI",
      "Supabase"
    ],
    "created_at": "2026-10-23T05:26:46.965Z",
    "updated_at": "2026-11-07T05:26:46.965Z",
    "tasks_count": 5,
    "completed_tasks_count": 4
  },
  {
    "id": "d3300000-0000-4000-b000-000000000015",
    "owner_id": "d3300000-0000-4000-a000-000000000010",
    "title": "Automated API Penetration & Vulnerability Scanner",
    "slug": "automated-api-penetration-vulnerability-scanner-114",
    "tagline": "Continuous security testing for REST and GraphQL endpoints against OWASP Top 10.",
    "description": "A developer security scanner that inspects OpenAPI specs, fuzzes endpoint inputs, checks for broken object-level authorization (BOLA), and outputs actionable remediation guides.",
    "category": "Developer Tools",
    "status": "in_progress",
    "team_size_needed": 3,
    "deadline": "2027-01-04T05:26:46.965Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/api-security-scanner",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "Python",
      "Linux",
      "Docker",
      "PostgreSQL",
      "REST APIs"
    ],
    "created_at": "2026-10-22T05:26:46.965Z",
    "updated_at": "2026-11-07T05:26:46.965Z",
    "tasks_count": 5,
    "completed_tasks_count": 3
  },
  {
    "id": "d3300000-0000-4000-b000-000000000016",
    "owner_id": "d3300000-0000-4000-a000-000000000013",
    "title": "Executive Engineering Analytics & DORA Metrics",
    "slug": "executive-engineering-analytics-dora-metrics-115",
    "tagline": "Deployment frequency, lead time for changes, change failure rate, and mean time to recovery.",
    "description": "Engineering leadership dashboard pulling webhook data from GitHub and GitLab to compute team DORA metrics, sprint velocity trends, and PR review cycle times.",
    "category": "Developer Tools",
    "status": "active",
    "team_size_needed": 4,
    "deadline": "2027-01-06T05:26:46.965Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/dora-metrics-analytics",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "TypeScript",
      "React",
      "Recharts",
      "PostgreSQL",
      "Tailwind CSS"
    ],
    "created_at": "2026-10-21T05:26:46.965Z",
    "updated_at": "2026-11-07T05:26:46.965Z",
    "tasks_count": 5,
    "completed_tasks_count": 4
  },
  {
    "id": "d3300000-0000-4000-b000-000000000017",
    "owner_id": "d3300000-0000-4000-a000-000000000002",
    "title": "Collaborative Kanban & Sprint Planning SaaS",
    "slug": "collaborative-kanban-sprint-planning-saas-116",
    "tagline": "Drag-and-drop task boards, velocity burn-down charts, and multi-user cursor sync.",
    "description": "A Linear-inspired project management platform engineered with @dnd-kit, Supabase Realtime WebSocket synchronization, task hierarchy, and team assignment milestones.",
    "category": "Web Application",
    "status": "completed",
    "team_size_needed": 4,
    "deadline": "2027-01-08T05:26:46.965Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/kanban-sprint-saas",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "React",
      "TypeScript",
      "Supabase",
      "Tailwind CSS",
      "Framer Motion"
    ],
    "created_at": "2026-10-20T05:26:46.965Z",
    "updated_at": "2026-11-07T05:26:46.965Z",
    "tasks_count": 5,
    "completed_tasks_count": 5
  },
  {
    "id": "d3300000-0000-4000-b000-000000000018",
    "owner_id": "d3300000-0000-4000-a000-000000000018",
    "title": "Agricultural Crop Disease Diagnosis via Image AI",
    "slug": "agricultural-crop-disease-diagnosis-via-image-ai-117",
    "tagline": "Smartphone camera leaf scan for instant crop disease classification and remedies.",
    "description": "A mobile-friendly web application assisting farmers by detecting 38 common crop leaf diseases using lightweight MobileNet vision models and providing natural language remedy advice.",
    "category": "AI & Machine Learning",
    "status": "active",
    "team_size_needed": 3,
    "deadline": "2027-01-10T05:26:46.966Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/crop-disease-ai",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "Python",
      "TensorFlow",
      "FastAPI",
      "React",
      "Tailwind CSS"
    ],
    "created_at": "2026-10-19T05:26:46.966Z",
    "updated_at": "2026-11-07T05:26:46.966Z",
    "tasks_count": 5,
    "completed_tasks_count": 4
  },
  {
    "id": "d3300000-0000-4000-b000-000000000019",
    "owner_id": "d3300000-0000-4000-a000-000000000006",
    "title": "Collaborative Travel Itinerary & Budget Planner",
    "slug": "collaborative-travel-itinerary-budget-planner-118",
    "tagline": "Multiplayer trip planning, interactive map waypoints, and split expense ledger.",
    "description": "Travel coordination software allowing friends to pin map destinations, build day-by-day itineraries with travel times, and settle shared trip expenses automatically.",
    "category": "Web Application",
    "status": "in_progress",
    "team_size_needed": 3,
    "deadline": "2027-01-12T05:26:46.966Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/travel-itinerary-collab",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Tailwind CSS"
    ],
    "created_at": "2026-10-18T05:26:46.966Z",
    "updated_at": "2026-11-07T05:26:46.966Z",
    "tasks_count": 5,
    "completed_tasks_count": 2
  },
  {
    "id": "d3300000-0000-4000-b000-000000000020",
    "owner_id": "d3300000-0000-4000-a000-000000000017",
    "title": "Fitness & Workout Telemetry Tracker",
    "slug": "fitness-workout-telemetry-tracker-119",
    "tagline": "Progressive overload tracking, custom routine builders, and health metrics integration.",
    "description": "A workout logging app offering audio timers, weight progression charts, and personal record tracking with seamless cloud backup.",
    "category": "Mobile Application",
    "status": "completed",
    "team_size_needed": 2,
    "deadline": "2027-01-14T05:26:46.966Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/fitness-tracker-pro",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "React Native",
      "TypeScript",
      "Supabase",
      "Tailwind CSS"
    ],
    "created_at": "2026-10-17T05:26:46.966Z",
    "updated_at": "2026-11-07T05:26:46.966Z",
    "tasks_count": 5,
    "completed_tasks_count": 5
  },
  {
    "id": "d3300000-0000-4000-b000-000000000021",
    "owner_id": "d3300000-0000-4000-a000-000000000001",
    "title": "GitHub Organization Insights & Contributor Analytics",
    "slug": "github-organization-insights-contributor-analytics-120",
    "tagline": "Deep dive into repository commit frequency, PR review turnaround, and contributor health.",
    "description": "Visual analytics tool for open-source maintainers to monitor repository star velocity, active pull request queues, and contributor onboarding friction.",
    "category": "Developer Tools",
    "status": "active",
    "team_size_needed": 3,
    "deadline": "2027-01-16T05:26:46.966Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/github-insights-analytics",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "TypeScript",
      "React",
      "Recharts",
      "REST APIs",
      "Tailwind CSS"
    ],
    "created_at": "2026-10-16T05:26:46.966Z",
    "updated_at": "2026-11-07T05:26:46.966Z",
    "tasks_count": 5,
    "completed_tasks_count": 4
  },
  {
    "id": "d3300000-0000-4000-b000-000000000022",
    "owner_id": "d3300000-0000-4000-a000-000000000003",
    "title": "IoT Smart Agriculture Irrigation & Soil Sensor Mesh",
    "slug": "iot-smart-agriculture-irrigation-soil-sensor-mesh-121",
    "tagline": "ESP32 sensor telemetry mesh streaming soil moisture and weather data to dashboard.",
    "description": "Hardware + cloud platform that gathers soil moisture, temperature, and solar irradiance metrics via MQTT brokers and triggers automated drip irrigation valves.",
    "category": "Infrastructure",
    "status": "in_progress",
    "team_size_needed": 4,
    "deadline": "2027-01-18T05:26:46.966Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/iot-smart-agriculture",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "C++",
      "Python",
      "FastAPI",
      "MQTT",
      "React",
      "PostgreSQL"
    ],
    "created_at": "2026-10-15T05:26:46.966Z",
    "updated_at": "2026-11-07T05:26:46.966Z",
    "tasks_count": 5,
    "completed_tasks_count": 3
  },
  {
    "id": "d3300000-0000-4000-b000-000000000023",
    "owner_id": "d3300000-0000-4000-a000-000000000008",
    "title": "Real-Time Markdown & Architecture Document Workspace",
    "slug": "real-time-markdown-architecture-document-workspace-122",
    "tagline": "Operational transformation document editor with live cursor sync and Mermaid charts.",
    "description": "Collaborative technical documentation editor with live code preview, auto-generating table of contents, and instant export to PDF and static sites.",
    "category": "Web Application",
    "status": "completed",
    "team_size_needed": 3,
    "deadline": "2027-01-20T05:26:46.966Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/collaborative-doc-editor",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "React",
      "TypeScript",
      "WebSockets",
      "Tailwind CSS"
    ],
    "created_at": "2026-10-14T05:26:46.966Z",
    "updated_at": "2026-11-07T05:26:46.966Z",
    "tasks_count": 5,
    "completed_tasks_count": 5
  },
  {
    "id": "d3300000-0000-4000-b000-000000000024",
    "owner_id": "d3300000-0000-4000-a000-000000000006",
    "title": "Developer Conference & Hackathon Event Platform",
    "slug": "developer-conference-hackathon-event-platform-123",
    "tagline": "Ticketing, stage livestreams, speaker schedules, and project expo voting.",
    "description": "An all-in-one event management system handling attendee registration, badge scanning, breakout room links, and community voting for hackathon winners.",
    "category": "Web Application",
    "status": "active",
    "team_size_needed": 4,
    "deadline": "2027-01-22T05:26:46.966Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/event-expo-platform",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "Next.js",
      "React",
      "TypeScript",
      "Supabase",
      "Stripe"
    ],
    "created_at": "2026-10-13T05:26:46.966Z",
    "updated_at": "2026-11-07T05:26:46.966Z",
    "tasks_count": 5,
    "completed_tasks_count": 5
  },
  {
    "id": "d3300000-0000-4000-b000-000000000025",
    "owner_id": "d3300000-0000-4000-a000-000000000009",
    "title": "Synthetic API Monitoring & Global Ping Network",
    "slug": "synthetic-api-monitoring-global-ping-network-124",
    "tagline": "Multi-region uptime checks, latency breakdown, and status page hosting.",
    "description": "High-frequency HTTP/gRPC/WebSocket synthetic probe system distributed across 8 global edge regions with automatic incident escalation and public status pages.",
    "category": "Developer Tools",
    "status": "in_progress",
    "team_size_needed": 3,
    "deadline": "2027-01-24T05:26:46.966Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/synthetic-api-monitor",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "Go",
      "Docker",
      "PostgreSQL",
      "React",
      "Tailwind CSS"
    ],
    "created_at": "2026-10-12T05:26:46.966Z",
    "updated_at": "2026-11-07T05:26:46.966Z",
    "tasks_count": 5,
    "completed_tasks_count": 4
  },
  {
    "id": "d3300000-0000-4000-b000-000000000026",
    "owner_id": "d3300000-0000-4000-a000-000000000015",
    "title": "Developer Code Snippet Vault & Sharing Platform",
    "slug": "developer-code-snippet-vault-sharing-platform-125",
    "tagline": "Gist alternative with syntax highlighting, tag categorization, and secret redaction.",
    "description": "Secure code snippet manager with instant command line publishing via custom CLI, syntax highlighting for 120+ languages, and automatic API key sanitization.",
    "category": "Developer Tools",
    "status": "completed",
    "team_size_needed": 2,
    "deadline": "2027-01-26T05:26:46.966Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/code-snippet-vault",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "TypeScript",
      "React",
      "Supabase",
      "Tailwind CSS"
    ],
    "created_at": "2026-10-11T05:26:46.966Z",
    "updated_at": "2026-11-07T05:26:46.966Z",
    "tasks_count": 5,
    "completed_tasks_count": 5
  },
  {
    "id": "d3300000-0000-4000-b000-000000000027",
    "owner_id": "d3300000-0000-4000-a000-000000000011",
    "title": "Mental Wellness & Developer Burnout Journal",
    "slug": "mental-wellness-developer-burnout-journal-126",
    "tagline": "Sentiment analysis on daily engineering reflections with burnout prevention tips.",
    "description": "Encrypted daily journaling app tailored for remote knowledge workers to log stress levels, celebrate small wins, and detect early symptoms of engineering burnout.",
    "category": "Web Application",
    "status": "active",
    "team_size_needed": 3,
    "deadline": "2027-01-28T05:26:46.966Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/wellness-developer-journal",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Python",
      "FastAPI"
    ],
    "created_at": "2026-10-10T05:26:46.966Z",
    "updated_at": "2026-11-07T05:26:46.966Z",
    "tasks_count": 5,
    "completed_tasks_count": 3
  },
  {
    "id": "d3300000-0000-4000-b000-000000000028",
    "owner_id": "d3300000-0000-4000-a000-000000000014",
    "title": "Real-Time Inventory & Warehouse Supply Chain SaaS",
    "slug": "real-time-inventory-warehouse-supply-chain-saas-127",
    "tagline": "Stock alerts, barcode scanning, order fulfillment, and multi-warehouse routing.",
    "description": "Enterprise inventory control platform providing real-time stock decrements, low-supply automated reorders, and printable QR asset tags.",
    "category": "Web Application",
    "status": "in_progress",
    "team_size_needed": 4,
    "deadline": "2027-01-30T05:26:46.966Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/inventory-supply-chain-saas",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "React",
      "Docker"
    ],
    "created_at": "2026-10-09T05:26:46.966Z",
    "updated_at": "2026-11-07T05:26:46.966Z",
    "tasks_count": 5,
    "completed_tasks_count": 3
  },
  {
    "id": "d3300000-0000-4000-b000-000000000029",
    "owner_id": "d3300000-0000-4000-a000-000000000020",
    "title": "Adaptive Technical Skill Assessment & Quiz Platform",
    "slug": "adaptive-technical-skill-assessment-quiz-platform-128",
    "tagline": "Timed algorithmic challenges, interactive multiple choice, and verified skill badges.",
    "description": "An interactive testing platform where developers solve practical coding problems and verify proficiency to earn verified skill endorsements on their DevConnect profiles.",
    "category": "Developer Tools",
    "status": "active",
    "team_size_needed": 3,
    "deadline": "2027-02-01T05:26:46.966Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/skill-assessment-platform",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Tailwind CSS"
    ],
    "created_at": "2026-10-08T05:26:46.966Z",
    "updated_at": "2026-11-07T05:26:46.966Z",
    "tasks_count": 5,
    "completed_tasks_count": 4
  },
  {
    "id": "d3300000-0000-4000-b000-000000000030",
    "owner_id": "d3300000-0000-4000-a000-000000000001",
    "title": "Open Source Contribution & Bounty Tracking Mesh",
    "slug": "open-source-contribution-bounty-tracking-mesh-129",
    "tagline": "Crowdfunded issue bounties, good-first-issue discoverer, and PR verification.",
    "description": "Decentralized open-source funding platform where maintainers tag issues with cash bounties and contributors get paid immediately upon PR merge.",
    "category": "Developer Tools",
    "status": "in_progress",
    "team_size_needed": 4,
    "deadline": "2027-02-03T05:26:46.966Z",
    "collaboration_requirements": "5-15 hrs/wk, async pull requests, weekly Discord check-ins",
    "github_repo_url": "https://github.com/DevConnect-Demo/open-source-bounty-mesh",
    "live_demo_url": "https://deew101.github.io/DevConnect/",
    "is_published": true,
    "is_demo": true,
    "required_skills": [
      "TypeScript",
      "Next.js",
      "PostgreSQL",
      "Stripe",
      "Tailwind CSS"
    ],
    "created_at": "2026-10-07T05:26:46.966Z",
    "updated_at": "2026-11-07T05:26:46.966Z",
    "tasks_count": 5,
    "completed_tasks_count": 4
  }
];

export const DEMO_TEAMS: Team[] = [
  {
    "id": "d3300000-0000-4000-c000-000000000001",
    "name": "CodeCraft Labs",
    "description": "Dedicated to architecting resilient full-stack systems, high-concurrency microservices, and modern SaaS developer tools.",
    "focus": "Full-Stack Development & SaaS Platforms",
    "avatar_url": "preset:team-1",
    "owner_id": "d3300000-0000-4000-a000-000000000001",
    "is_demo": true,
    "active_projects_count": 8,
    "members": [
      {
        "id": "mem-cy5marw",
        "team_id": "d3300000-0000-4000-c000-000000000001",
        "user_id": "d3300000-0000-4000-a000-000000000001",
        "role": "Team Lead",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000001",
          "username": "arjun.codes",
          "full_name": "Arjun Patel",
          "headline": "Senior Full-Stack Architect | Distributed Systems & Go",
          "bio": "Passionate about distributed microservices, event streams, and building developer-first developer tooling. Open source advocate.",
          "location": "Bangalore, India",
          "github_username": "arjun-patel",
          "website_url": "https://arjunpatel.dev",
          "experience_level": "Senior",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 15,
          "interests": [
            "Distributed Systems",
            "Go",
            "Microservices",
            "Kubernetes"
          ],
          "preset_avatar_id": "preset:dev-1",
          "professional_description": {
            "bio": "Full-stack software architect with 6+ years shipping high-throughput backends and reactive React frontends.",
            "technical_interests": [
              "Distributed consensus (Raft/Paxos)",
              "High-concurrency Go services",
              "Rust for systems programming",
              "Edge computing"
            ],
            "current_goals": "Architecting fault-tolerant task orchestrators and mentoring early-career engineers in distributed systems.",
            "collaboration_style": "Async-first, documented PRs, clear architecture decision records (ADRs), weekly sprint sync.",
            "target_projects": [
              "Developer infrastructure tools",
              "Real-time telemetry platforms",
              "Open-source distributed databases"
            ]
          },
          "skills": [
            "Go",
            "TypeScript",
            "PostgreSQL",
            "Docker",
            "Kubernetes",
            "Redis",
            "React",
            "REST APIs"
          ]
        }
      },
      {
        "id": "mem-amfgiz2",
        "team_id": "d3300000-0000-4000-c000-000000000001",
        "user_id": "d3300000-0000-4000-a000-000000000002",
        "role": "Frontend Lead",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000002",
          "username": "dev_meera",
          "full_name": "Meera Nair",
          "headline": "Lead Frontend Engineer | UI/UX & Design Systems",
          "bio": "Obsessed with fluid micro-interactions, accessible UI architecture, and modern WebGL canvases. Linear & Vercel design aesthetic enthusiast.",
          "location": "Mumbai, India",
          "github_username": "meera-nair",
          "website_url": "https://meera.design",
          "experience_level": "Lead",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 12,
          "interests": [
            "Design Systems",
            "React",
            "Framer Motion",
            "Tailwind CSS",
            "Web Performance"
          ],
          "preset_avatar_id": "preset:dev-2",
          "professional_description": {
            "bio": "Design systems engineer crafting pixel-perfect, accessible component libraries and high-performance React frontends.",
            "technical_interests": [
              "Design tokens & Tailwind orchestration",
              "Complex animation choreographies with Framer Motion",
              "Accessible ARIA patterns"
            ],
            "current_goals": "Building frictionless developer tool interfaces with sub-100ms interaction latencies.",
            "collaboration_style": "Pair programming on critical components, Figma tokens-to-code workflow, proactive UI reviews.",
            "target_projects": [
              "Dark-mode first developer SaaS dashboards",
              "Interactive canvas applications",
              "Component design libraries"
            ]
          },
          "skills": [
            "React",
            "TypeScript",
            "Next.js",
            "Tailwind CSS",
            "Figma",
            "WebSockets"
          ]
        }
      },
      {
        "id": "mem-kka0sga",
        "team_id": "d3300000-0000-4000-c000-000000000001",
        "user_id": "d3300000-0000-4000-a000-000000000003",
        "role": "Systems Engineer",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000003",
          "username": "harshitbuilds",
          "full_name": "Harshit Sharma",
          "headline": "Systems Engineer | Rust, WebAssembly & Low Latency",
          "bio": "Compiling Rust to Wasm, optimizing memory layouts, and building ultra-fast developer platforms with zero-cost abstractions.",
          "location": "Delhi NCR, India",
          "github_username": "harshit-builds",
          "website_url": "https://harshit.systems",
          "experience_level": "Senior",
          "availability_status": "available",
          "weekly_hours_available": 20,
          "interests": [
            "Rust",
            "WebAssembly",
            "Performance",
            "Compilers"
          ],
          "preset_avatar_id": "preset:dev-3",
          "professional_description": {
            "bio": "Systems programmer focused on high-throughput services, Wasm runtimes, and concurrent network protocols in Rust.",
            "technical_interests": [
              "Tokio async runtimes",
              "SIMD optimizations",
              "Zero-copy serialization (FlatBuffers)",
              "Cross-compilation"
            ],
            "current_goals": "Creating blazing-fast edge processing engines that run seamlessly in browser and cloud.",
            "collaboration_style": "Benchmark-driven development, comprehensive integration tests, async GitHub reviews.",
            "target_projects": [
              "Wasm-powered client runtime engines",
              "Edge compute proxies",
              "Distributed cache clusters"
            ]
          },
          "skills": [
            "Rust",
            "C++",
            "Linux",
            "Docker",
            "WebSockets",
            "PostgreSQL"
          ]
        }
      },
      {
        "id": "mem-hq43ha7",
        "team_id": "d3300000-0000-4000-c000-000000000001",
        "user_id": "d3300000-0000-4000-a000-000000000006",
        "role": "Full-Stack Developer",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000006",
          "username": "akash_fullstack",
          "full_name": "Akash Verma",
          "headline": "Full-Stack Developer | Next.js, Node.js & Supabase",
          "bio": "Shipping clean SaaS products from prototype to production. Fan of PostgreSQL row-level security and TypeScript end-to-end.",
          "location": "Chennai, India",
          "github_username": "akash-verma",
          "website_url": "https://akashverma.dev",
          "experience_level": "Mid-Level",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 16,
          "interests": [
            "Next.js",
            "Supabase",
            "TypeScript",
            "Tailwind CSS"
          ],
          "preset_avatar_id": "preset:dev-6",
          "professional_description": {
            "bio": "Product-focused full-stack engineer who loves rapid prototyping and turning complex requirements into clean applications.",
            "technical_interests": [
              "Type-safe RPC (tRPC)",
              "Supabase Realtime & PostgreSQL triggers",
              "Responsive UI architecture"
            ],
            "current_goals": "Collaborating on open-source developer networking tools and student portfolio ecosystems.",
            "collaboration_style": "Daily async updates on Slack/Discord, clean atomic git commits, rapid feature iterations.",
            "target_projects": [
              "Developer job match platforms",
              "Real-time collaborative whiteboards",
              "Project management SaaS"
            ]
          },
          "skills": [
            "TypeScript",
            "JavaScript",
            "React",
            "Next.js",
            "Node.js",
            "Supabase",
            "PostgreSQL",
            "Tailwind CSS"
          ]
        }
      },
      {
        "id": "mem-d75rhs9",
        "team_id": "d3300000-0000-4000-c000-000000000001",
        "user_id": "d3300000-0000-4000-a000-000000000009",
        "role": "Backend Engineer",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000009",
          "username": "kavya.dev",
          "full_name": "Kavya Iyer",
          "headline": "Backend Infrastructure Engineer | Go, gRPC & Kafka",
          "bio": "Designing high-volume streaming architectures, distributed event buses, and resilient API gateways in Go and PostgreSQL.",
          "location": "Kochi, India",
          "github_username": "kavya-iyer",
          "website_url": "https://kavyaiyer.io",
          "experience_level": "Lead",
          "availability_status": "available",
          "weekly_hours_available": 18,
          "interests": [
            "Go",
            "Kafka",
            "gRPC",
            "Database Internals"
          ],
          "preset_avatar_id": "preset:dev-9",
          "professional_description": {
            "bio": "Infrastructure and backend specialist with a track record of scaling distributed backends past 100k requests/second.",
            "technical_interests": [
              "Event-driven systems (Kafka/RabbitMQ)",
              "Postgres query planner tuning",
              "Strict contract-driven gRPC APIs"
            ],
            "current_goals": "Mentoring junior developers and architecting open source backends for collaborative tooling.",
            "collaboration_style": "Thorough code reviews with benchmark comparisons, detailed system schematics, clear milestone roadmaps.",
            "target_projects": [
              "Real-time messaging engines",
              "API monitoring & telemetry services",
              "Event-sourced task platforms"
            ]
          },
          "skills": [
            "Go",
            "PostgreSQL",
            "Redis",
            "Docker",
            "Linux",
            "REST APIs",
            "WebSockets"
          ]
        }
      },
      {
        "id": "mem-26alohh",
        "team_id": "d3300000-0000-4000-c000-000000000001",
        "user_id": "d3300000-0000-4000-a000-000000000012",
        "role": "DevOps / SRE",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000012",
          "username": "siddharth.cloud",
          "full_name": "Siddharth Rao",
          "headline": "DevOps & SRE Engineer | Multi-Cloud & Observability",
          "bio": "Automating everything from bare metal to Kubernetes clusters. Prometheus, Grafana, and OpenTelemetry advocate.",
          "location": "Chennai, India",
          "github_username": "siddharth-cloud",
          "website_url": "https://siddharthrao.dev",
          "experience_level": "Mid-Level",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 12,
          "interests": [
            "DevOps",
            "Kubernetes",
            "Prometheus",
            "Grafana",
            "Docker"
          ],
          "preset_avatar_id": "preset:dev-12",
          "professional_description": {
            "bio": "Site Reliability Engineer dedicated to system resilience, automated incident response, and performance profiling.",
            "technical_interests": [
              "SLO/SLA tracking dashboards",
              "Prometheus metrics aggregation",
              "Zero-downtime rolling updates"
            ],
            "current_goals": "Implementing real-time health telemetry across multi-region services.",
            "collaboration_style": "Infrastructure-as-code reviews, automated smoke tests, operational readiness checklists.",
            "target_projects": [
              "Cloud monitoring dashboards",
              "API health monitoring platforms",
              "Automated deployment pipelines"
            ]
          },
          "skills": [
            "Docker",
            "Kubernetes",
            "Terraform",
            "Linux",
            "AWS",
            "GitHub Actions"
          ]
        }
      },
      {
        "id": "mem-tfnjfgc",
        "team_id": "d3300000-0000-4000-c000-000000000001",
        "user_id": "d3300000-0000-4000-a000-000000000015",
        "role": "Frontend Contributor",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000015",
          "username": "sneha_frontend",
          "full_name": "Sneha Banerjee",
          "headline": "Frontend Engineer | React, TypeScript & Web Performance",
          "bio": "Crafting responsive, high-speed single page applications with sub-second time-to-interactive and 100 Lighthouse scores.",
          "location": "Kolkata, India",
          "github_username": "sneha-frontend",
          "website_url": "https://snehabanerjee.dev",
          "experience_level": "Junior",
          "availability_status": "available",
          "weekly_hours_available": 20,
          "interests": [
            "React",
            "TypeScript",
            "Web Performance",
            "Tailwind CSS"
          ],
          "preset_avatar_id": "preset:dev-15",
          "professional_description": {
            "bio": "Enthusiastic frontend engineer eager to contribute to collaborative projects and learn modern state management.",
            "technical_interests": [
              "TanStack Query caching strategies",
              "CSS grid & asymmetric layouts",
              "Component unit testing"
            ],
            "current_goals": "Collaborating on open-source applications and contributing to developer tool interfaces.",
            "collaboration_style": "Eager to receive code review feedback, fast iteration cycles, proactive communication.",
            "target_projects": [
              "Developer portfolio builders",
              "Code snippet sharing tools",
              "E-commerce platforms"
            ]
          },
          "skills": [
            "React",
            "TypeScript",
            "JavaScript",
            "Tailwind CSS",
            "Git"
          ]
        }
      },
      {
        "id": "mem-6fpfa5m",
        "team_id": "d3300000-0000-4000-c000-000000000001",
        "user_id": "d3300000-0000-4000-a000-000000000020",
        "role": "API Architect",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000020",
          "username": "kunal.api",
          "full_name": "Kunal Singhania",
          "headline": "API Architect | GraphQL, Node.js & Microservices",
          "bio": "Designing federated GraphQL graphs, high-volume REST endpoints, and schema-driven developer experiences.",
          "location": "Mumbai, India",
          "github_username": "kunal-api",
          "website_url": "https://kunalsinghania.dev",
          "experience_level": "Lead",
          "availability_status": "available",
          "weekly_hours_available": 16,
          "interests": [
            "GraphQL",
            "Node.js",
            "NestJS",
            "TypeScript"
          ],
          "preset_avatar_id": "preset:dev-20",
          "professional_description": {
            "bio": "Senior backend architect specializing in clean APIs, domain-driven design, and developer portal documentation.",
            "technical_interests": [
              "Apollo Federation & GraphQL mesh",
              "OpenAPI 3.1 specification tooling",
              "Redis rate limiting & caching"
            ],
            "current_goals": "Architecting developer-friendly APIs for modern collaborative applications.",
            "collaboration_style": "API design-first approach, contract testing, typed SDK generation for frontend consumers.",
            "target_projects": [
              "Real-time chat platforms",
              "Code snippet sharing tools",
              "API monitoring platforms"
            ]
          },
          "skills": [
            "TypeScript",
            "Node.js",
            "NestJS",
            "GraphQL",
            "REST APIs",
            "PostgreSQL",
            "Redis"
          ]
        }
      },
      {
        "id": "mem-ojv4fme",
        "team_id": "d3300000-0000-4000-c000-000000000001",
        "user_id": "d3300000-0000-4000-a000-000000000023",
        "role": "QA Engineer",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000023",
          "username": "tarun.code",
          "full_name": "Tarun Bhatia",
          "headline": "Full-Stack Developer | MERN Stack",
          "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
          "location": "Lucknow, India",
          "github_username": "tarun-code",
          "website_url": "https://taruncode.dev",
          "experience_level": "Mid-Level",
          "availability_status": "busy",
          "weekly_hours_available": 12,
          "interests": [
            "React",
            "Node.js",
            "Software Architecture"
          ],
          "preset_avatar_id": "preset:dev-24",
          "professional_description": {
            "bio": "Dedicated Full-Stack Developer | MERN Stack with strong technical fundamentals and passion for reliable collaborative engineering.",
            "technical_interests": [
              "React",
              "Node.js",
              "Clean Code"
            ],
            "current_goals": "Building impactful open-source tools with developer communities.",
            "collaboration_style": "Async communication, clear task estimation, peer reviews.",
            "target_projects": [
              "Collaborative platforms",
              "Developer tools",
              "SaaS applications"
            ]
          },
          "skills": [
            "React",
            "Node.js",
            "MongoDB",
            "Express.js"
          ]
        }
      },
      {
        "id": "mem-ta24tab",
        "team_id": "d3300000-0000-4000-c000-000000000001",
        "user_id": "d3300000-0000-4000-a000-000000000027",
        "role": "Contributor",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000027",
          "username": "karthik.go",
          "full_name": "Karthik Raman",
          "headline": "Go Backend Developer | Microservices",
          "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
          "location": "Bengaluru, India",
          "github_username": "karthik-go",
          "website_url": "https://karthikgo.dev",
          "experience_level": "Mid-Level",
          "availability_status": "available",
          "weekly_hours_available": 16,
          "interests": [
            "Go",
            "Docker",
            "Software Architecture"
          ],
          "preset_avatar_id": "preset:dev-4",
          "professional_description": {
            "bio": "Dedicated Go Backend Developer | Microservices with strong technical fundamentals and passion for reliable collaborative engineering.",
            "technical_interests": [
              "Go",
              "Docker",
              "Clean Code"
            ],
            "current_goals": "Building impactful open-source tools with developer communities.",
            "collaboration_style": "Async communication, clear task estimation, peer reviews.",
            "target_projects": [
              "Collaborative platforms",
              "Developer tools",
              "SaaS applications"
            ]
          },
          "skills": [
            "Go",
            "Docker",
            "PostgreSQL",
            "REST APIs"
          ]
        }
      }
    ]
  },
  {
    "id": "d3300000-0000-4000-c000-000000000002",
    "name": "NeuralForge AI",
    "description": "Specializing in generative AI agents, neural embeddings, natural language pipelines, and scalable computer vision models.",
    "focus": "Artificial Intelligence, Machine Learning & Data Science",
    "avatar_url": "preset:team-2",
    "owner_id": "d3300000-0000-4000-a000-000000000004",
    "is_demo": true,
    "active_projects_count": 6,
    "members": [
      {
        "id": "mem-0yclay4",
        "team_id": "d3300000-0000-4000-c000-000000000002",
        "user_id": "d3300000-0000-4000-a000-000000000004",
        "role": "Team Lead",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000004",
          "username": "rohanxdev",
          "full_name": "Rohan Mehta",
          "headline": "AI/ML Researcher & LLM Orchestration Engineer",
          "bio": "Fine-tuning open weights models, building agentic reasoning workflows, and optimizing vector search pipelines with LangChain & PyTorch.",
          "location": "Pune, India",
          "github_username": "rohan-mehta",
          "website_url": "https://rohanmehta.ai",
          "experience_level": "Mid-Level",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 10,
          "interests": [
            "AI Agents",
            "PyTorch",
            "Vector Databases",
            "LangChain"
          ],
          "preset_avatar_id": "preset:dev-4",
          "professional_description": {
            "bio": "Machine learning specialist developing production RAG systems, model evaluation harnesses, and multi-agent systems.",
            "technical_interests": [
              "Quantized LLM deployment (GGUF/vLLM)",
              "Hierarchical RAG architectures",
              "Tool-calling agents"
            ],
            "current_goals": "Fine-tuning specialized coding assistant models and building autonomous pair-programming pipelines.",
            "collaboration_style": "Experiment notebooks with clear metrics, reproducible validation sets, weekly sprint check-ins.",
            "target_projects": [
              "AI code reviewers",
              "Automated developer matchmaking engines",
              "Semantic code search"
            ]
          },
          "skills": [
            "Python",
            "PyTorch",
            "OpenAI API",
            "Gemini API",
            "LangChain",
            "FastAPI",
            "PostgreSQL"
          ]
        }
      },
      {
        "id": "mem-ftd1kzt",
        "team_id": "d3300000-0000-4000-c000-000000000002",
        "user_id": "d3300000-0000-4000-a000-000000000007",
        "role": "NLP Specialist",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000007",
          "username": "ishita.ml",
          "full_name": "Ishita Sen",
          "headline": "NLP & Deep Learning Engineer | Transformers & GenAI",
          "bio": "Building natural language understanding pipelines, custom embeddings, and conversational AI agents with Hugging Face & PyTorch.",
          "location": "Kolkata, India",
          "github_username": "ishita-sen",
          "website_url": "https://ishita.tech",
          "experience_level": "Mid-Level",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 12,
          "interests": [
            "Transformers",
            "Hugging Face",
            "Python",
            "Vector Search"
          ],
          "preset_avatar_id": "preset:dev-7",
          "professional_description": {
            "bio": "Deep learning practitioner working on state-of-the-art NLP models, embedding clustering, and domain adaptation.",
            "technical_interests": [
              "Parameter-efficient fine-tuning (LoRA/QLoRA)",
              "Semantic similarity matching",
              "Contextual summarization"
            ],
            "current_goals": "Developing semantic matching models for pairing developers with open-source project needs.",
            "collaboration_style": "Open notebook sharing, reproducible experimental pipelines, structured model documentation.",
            "target_projects": [
              "AI resume & skill analysers",
              "Intelligent search engines",
              "Code sentiment & review tools"
            ]
          },
          "skills": [
            "Python",
            "PyTorch",
            "Hugging Face",
            "FastAPI",
            "OpenAI API",
            "PostgreSQL"
          ]
        }
      },
      {
        "id": "mem-e4ed5m7",
        "team_id": "d3300000-0000-4000-c000-000000000002",
        "user_id": "d3300000-0000-4000-a000-000000000013",
        "role": "Data Scientist",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000013",
          "username": "priya.data",
          "full_name": "Priya Nambiar",
          "headline": "Data Scientist & Analytics Engineer | Pandas & BigQuery",
          "bio": "Transforming petabytes of raw signals into actionable engineering insights, predictive models, and intuitive dashboards.",
          "location": "Trivandrum, India",
          "github_username": "priya-data",
          "website_url": "https://priyanambiar.data",
          "experience_level": "Senior",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 14,
          "interests": [
            "Data Science",
            "Python",
            "BigQuery",
            "Data Analytics"
          ],
          "preset_avatar_id": "preset:dev-13",
          "professional_description": {
            "bio": "Analytics engineer specializing in ETL pipelines, statistical modeling, and developer telemetry visualization.",
            "technical_interests": [
              "dbt transformations",
              "Streaming data aggregations",
              "Interactive Recharts dashboards"
            ],
            "current_goals": "Building developer productivity telemetry systems that respect engineer autonomy.",
            "collaboration_style": "Clear schema definitions, data validation tests, well-documented queries.",
            "target_projects": [
              "Data analytics dashboards",
              "GitHub contribution trackers",
              "Developer velocity analyzers"
            ]
          },
          "skills": [
            "Python",
            "SQL",
            "PostgreSQL",
            "FastAPI",
            "Google Cloud"
          ]
        }
      },
      {
        "id": "mem-qy956ju",
        "team_id": "d3300000-0000-4000-c000-000000000002",
        "user_id": "d3300000-0000-4000-a000-000000000018",
        "role": "Computer Vision Engineer",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000018",
          "username": "manish.ai",
          "full_name": "Manish Chawla",
          "headline": "Machine Learning Engineer | Computer Vision & PyTorch",
          "bio": "Training convolutional neural networks, vision transformers, and real-time object detection models at edge device constraints.",
          "location": "Chandigarh, India",
          "github_username": "manish-ai",
          "website_url": "https://manishchawla.ai",
          "experience_level": "Mid-Level",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 12,
          "interests": [
            "Computer Vision",
            "PyTorch",
            "TensorFlow",
            "Edge AI"
          ],
          "preset_avatar_id": "preset:dev-18",
          "professional_description": {
            "bio": "Computer vision researcher with experience deploying quantized inference models on mobile and embedded devices.",
            "technical_interests": [
              "Vision Transformers (ViT)",
              "OpenCV real-time image processing",
              "Model pruning & ONNX runtime"
            ],
            "current_goals": "Collaborating on real-time visual recognition applications.",
            "collaboration_style": "Jupyter notebooks with visual benchmarks, REST inference endpoints, reproducible training logs.",
            "target_projects": [
              "AI image classification systems",
              "Smart attendance systems",
              "Smart agriculture monitoring"
            ]
          },
          "skills": [
            "Python",
            "PyTorch",
            "TensorFlow",
            "FastAPI",
            "Docker"
          ]
        }
      },
      {
        "id": "mem-qbb26j9",
        "team_id": "d3300000-0000-4000-c000-000000000002",
        "user_id": "d3300000-0000-4000-a000-000000000025",
        "role": "ML Engineer",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000025",
          "username": "varun.ml",
          "full_name": "Varun Kapoor",
          "headline": "Data Engineer | Spark & Data Pipelines",
          "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
          "location": "Noida, India",
          "github_username": "varun-ml",
          "website_url": "https://varunml.dev",
          "experience_level": "Senior",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 14,
          "interests": [
            "Python",
            "SQL",
            "Software Architecture"
          ],
          "preset_avatar_id": "preset:dev-2",
          "professional_description": {
            "bio": "Dedicated Data Engineer | Spark & Data Pipelines with strong technical fundamentals and passion for reliable collaborative engineering.",
            "technical_interests": [
              "Python",
              "SQL",
              "Clean Code"
            ],
            "current_goals": "Building impactful open-source tools with developer communities.",
            "collaboration_style": "Async communication, clear task estimation, peer reviews.",
            "target_projects": [
              "Collaborative platforms",
              "Developer tools",
              "SaaS applications"
            ]
          },
          "skills": [
            "Python",
            "SQL",
            "PostgreSQL",
            "Docker"
          ]
        }
      },
      {
        "id": "mem-8x1pxj3",
        "team_id": "d3300000-0000-4000-c000-000000000002",
        "user_id": "d3300000-0000-4000-a000-000000000029",
        "role": "AI Researcher",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000029",
          "username": "alok.ai",
          "full_name": "Alok Trivedi",
          "headline": "AI Engineer | LangChain & Vector Search",
          "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
          "location": "Varanasi, India",
          "github_username": "alok-ai",
          "website_url": "https://alokai.dev",
          "experience_level": "Junior",
          "availability_status": "busy",
          "weekly_hours_available": 18,
          "interests": [
            "Python",
            "OpenAI API",
            "Software Architecture"
          ],
          "preset_avatar_id": "preset:dev-6",
          "professional_description": {
            "bio": "Dedicated AI Engineer | LangChain & Vector Search with strong technical fundamentals and passion for reliable collaborative engineering.",
            "technical_interests": [
              "Python",
              "OpenAI API",
              "Clean Code"
            ],
            "current_goals": "Building impactful open-source tools with developer communities.",
            "collaboration_style": "Async communication, clear task estimation, peer reviews.",
            "target_projects": [
              "Collaborative platforms",
              "Developer tools",
              "SaaS applications"
            ]
          },
          "skills": [
            "Python",
            "OpenAI API",
            "FastAPI",
            "LangChain"
          ]
        }
      },
      {
        "id": "mem-7r29nk7",
        "team_id": "d3300000-0000-4000-c000-000000000002",
        "user_id": "d3300000-0000-4000-a000-000000000036",
        "role": "Data Analyst",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000036",
          "username": "komal.ai",
          "full_name": "Komal Narang",
          "headline": "Machine Learning Researcher | NLP",
          "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
          "location": "Amritsar, India",
          "github_username": "komal-ai",
          "website_url": "https://komalai.dev",
          "experience_level": "Junior",
          "availability_status": "available",
          "weekly_hours_available": 15,
          "interests": [
            "Python",
            "PyTorch",
            "Software Architecture"
          ],
          "preset_avatar_id": "preset:dev-13",
          "professional_description": {
            "bio": "Dedicated Machine Learning Researcher | NLP with strong technical fundamentals and passion for reliable collaborative engineering.",
            "technical_interests": [
              "Python",
              "PyTorch",
              "Clean Code"
            ],
            "current_goals": "Building impactful open-source tools with developer communities.",
            "collaboration_style": "Async communication, clear task estimation, peer reviews.",
            "target_projects": [
              "Collaborative platforms",
              "Developer tools",
              "SaaS applications"
            ]
          },
          "skills": [
            "Python",
            "PyTorch",
            "Hugging Face",
            "FastAPI"
          ]
        }
      },
      {
        "id": "mem-g0a89kn",
        "team_id": "d3300000-0000-4000-c000-000000000002",
        "user_id": "d3300000-0000-4000-a000-000000000039",
        "role": "MLOps Engineer",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000039",
          "username": "nitin.code",
          "full_name": "Nitin Rawat",
          "headline": "Backend Developer | FastAPI & Redis",
          "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
          "location": "Ranchi, India",
          "github_username": "nitin-code",
          "website_url": "https://nitincode.dev",
          "experience_level": "Mid-Level",
          "availability_status": "available",
          "weekly_hours_available": 18,
          "interests": [
            "Python",
            "FastAPI",
            "Software Architecture"
          ],
          "preset_avatar_id": "preset:dev-16",
          "professional_description": {
            "bio": "Dedicated Backend Developer | FastAPI & Redis with strong technical fundamentals and passion for reliable collaborative engineering.",
            "technical_interests": [
              "Python",
              "FastAPI",
              "Clean Code"
            ],
            "current_goals": "Building impactful open-source tools with developer communities.",
            "collaboration_style": "Async communication, clear task estimation, peer reviews.",
            "target_projects": [
              "Collaborative platforms",
              "Developer tools",
              "SaaS applications"
            ]
          },
          "skills": [
            "Python",
            "FastAPI",
            "Redis",
            "PostgreSQL"
          ]
        }
      },
      {
        "id": "mem-2v0dmyq",
        "team_id": "d3300000-0000-4000-c000-000000000002",
        "user_id": "d3300000-0000-4000-a000-000000000001",
        "role": "Backend Advisor",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000001",
          "username": "arjun.codes",
          "full_name": "Arjun Patel",
          "headline": "Senior Full-Stack Architect | Distributed Systems & Go",
          "bio": "Passionate about distributed microservices, event streams, and building developer-first developer tooling. Open source advocate.",
          "location": "Bangalore, India",
          "github_username": "arjun-patel",
          "website_url": "https://arjunpatel.dev",
          "experience_level": "Senior",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 15,
          "interests": [
            "Distributed Systems",
            "Go",
            "Microservices",
            "Kubernetes"
          ],
          "preset_avatar_id": "preset:dev-1",
          "professional_description": {
            "bio": "Full-stack software architect with 6+ years shipping high-throughput backends and reactive React frontends.",
            "technical_interests": [
              "Distributed consensus (Raft/Paxos)",
              "High-concurrency Go services",
              "Rust for systems programming",
              "Edge computing"
            ],
            "current_goals": "Architecting fault-tolerant task orchestrators and mentoring early-career engineers in distributed systems.",
            "collaboration_style": "Async-first, documented PRs, clear architecture decision records (ADRs), weekly sprint sync.",
            "target_projects": [
              "Developer infrastructure tools",
              "Real-time telemetry platforms",
              "Open-source distributed databases"
            ]
          },
          "skills": [
            "Go",
            "TypeScript",
            "PostgreSQL",
            "Docker",
            "Kubernetes",
            "Redis",
            "React",
            "REST APIs"
          ]
        }
      }
    ]
  },
  {
    "id": "d3300000-0000-4000-c000-000000000003",
    "name": "PixelStack Studio",
    "description": "Obsessed with fluid digital craft, design systems, accessible WebGL interfaces, and high-performance frontend engineering.",
    "focus": "Frontend Engineering, UI/UX & Web Performance",
    "avatar_url": "preset:team-3",
    "owner_id": "d3300000-0000-4000-a000-000000000002",
    "is_demo": true,
    "active_projects_count": 7,
    "members": [
      {
        "id": "mem-4r8wdbx",
        "team_id": "d3300000-0000-4000-c000-000000000003",
        "user_id": "d3300000-0000-4000-a000-000000000002",
        "role": "Team Lead",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000002",
          "username": "dev_meera",
          "full_name": "Meera Nair",
          "headline": "Lead Frontend Engineer | UI/UX & Design Systems",
          "bio": "Obsessed with fluid micro-interactions, accessible UI architecture, and modern WebGL canvases. Linear & Vercel design aesthetic enthusiast.",
          "location": "Mumbai, India",
          "github_username": "meera-nair",
          "website_url": "https://meera.design",
          "experience_level": "Lead",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 12,
          "interests": [
            "Design Systems",
            "React",
            "Framer Motion",
            "Tailwind CSS",
            "Web Performance"
          ],
          "preset_avatar_id": "preset:dev-2",
          "professional_description": {
            "bio": "Design systems engineer crafting pixel-perfect, accessible component libraries and high-performance React frontends.",
            "technical_interests": [
              "Design tokens & Tailwind orchestration",
              "Complex animation choreographies with Framer Motion",
              "Accessible ARIA patterns"
            ],
            "current_goals": "Building frictionless developer tool interfaces with sub-100ms interaction latencies.",
            "collaboration_style": "Pair programming on critical components, Figma tokens-to-code workflow, proactive UI reviews.",
            "target_projects": [
              "Dark-mode first developer SaaS dashboards",
              "Interactive canvas applications",
              "Component design libraries"
            ]
          },
          "skills": [
            "React",
            "TypeScript",
            "Next.js",
            "Tailwind CSS",
            "Figma",
            "WebSockets"
          ]
        }
      },
      {
        "id": "mem-p5p26r2",
        "team_id": "d3300000-0000-4000-c000-000000000003",
        "user_id": "d3300000-0000-4000-a000-000000000008",
        "role": "Creative Developer",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000008",
          "username": "nikhilcreates",
          "full_name": "Nikhil Deshmukh",
          "headline": "Creative Developer & UI/UX Designer | 3D & WebGL",
          "bio": "Bridging design and code. Creating tactile interfaces, 3D web experiences, and micro-interactions that make software feel alive.",
          "location": "Bengaluru, India",
          "github_username": "nikhil-deshmukh",
          "website_url": "https://nikhil.design",
          "experience_level": "Senior",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 14,
          "interests": [
            "UI/UX",
            "Three.js",
            "Figma",
            "Framer Motion",
            "Tailwind CSS"
          ],
          "preset_avatar_id": "preset:dev-8",
          "professional_description": {
            "bio": "Creative technologist with 5+ years crafting distinct visual identities and interactive digital experiences.",
            "technical_interests": [
              "Interactive shader art",
              "High-contrast typography systems",
              "Haptic feedback in web interfaces"
            ],
            "current_goals": "Redefining developer tools to possess the aesthetic refinement of editorial publications.",
            "collaboration_style": "Figma-first design exploration followed by high-fidelity React implementation and polish passes.",
            "target_projects": [
              "Editorial developer blogs",
              "Interactive documentation portals",
              "Creative portfolio builders"
            ]
          },
          "skills": [
            "Figma",
            "React",
            "TypeScript",
            "Tailwind CSS",
            "JavaScript"
          ]
        }
      },
      {
        "id": "mem-378gchb",
        "team_id": "d3300000-0000-4000-c000-000000000003",
        "user_id": "d3300000-0000-4000-a000-000000000011",
        "role": "Product Designer",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000011",
          "username": "tanvi_ux",
          "full_name": "Tanvi Kulkarni",
          "headline": "Senior Product Designer | Design Systems & Accessibility",
          "bio": "Crafting user-centered workflows for complex developer SaaS platforms. Advocate of WCAG AAA accessibility standards.",
          "location": "Pune, India",
          "github_username": "tanvi-kulkarni",
          "website_url": "https://tanvi.design",
          "experience_level": "Senior",
          "availability_status": "available",
          "weekly_hours_available": 15,
          "interests": [
            "UI/UX",
            "Accessibility",
            "Design Systems",
            "Figma"
          ],
          "preset_avatar_id": "preset:dev-11",
          "professional_description": {
            "bio": "Product designer with deep technical literacy who writes clean semantic HTML/CSS and builds comprehensive Figma component libraries.",
            "technical_interests": [
              "Design tokens",
              "Micro-interactions",
              "User mental models in developer tools"
            ],
            "current_goals": "Creating world-class user interfaces for collaborative developer tools.",
            "collaboration_style": "High-touch alignment with frontend engineers, iterative user testing prototypes.",
            "target_projects": [
              "Developer dashboards",
              "Collaborative kanban boards",
              "Open-source documentation systems"
            ]
          },
          "skills": [
            "Figma",
            "Tailwind CSS",
            "React",
            "TypeScript"
          ]
        }
      },
      {
        "id": "mem-duh1l5p",
        "team_id": "d3300000-0000-4000-c000-000000000003",
        "user_id": "d3300000-0000-4000-a000-000000000015",
        "role": "Frontend Developer",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000015",
          "username": "sneha_frontend",
          "full_name": "Sneha Banerjee",
          "headline": "Frontend Engineer | React, TypeScript & Web Performance",
          "bio": "Crafting responsive, high-speed single page applications with sub-second time-to-interactive and 100 Lighthouse scores.",
          "location": "Kolkata, India",
          "github_username": "sneha-frontend",
          "website_url": "https://snehabanerjee.dev",
          "experience_level": "Junior",
          "availability_status": "available",
          "weekly_hours_available": 20,
          "interests": [
            "React",
            "TypeScript",
            "Web Performance",
            "Tailwind CSS"
          ],
          "preset_avatar_id": "preset:dev-15",
          "professional_description": {
            "bio": "Enthusiastic frontend engineer eager to contribute to collaborative projects and learn modern state management.",
            "technical_interests": [
              "TanStack Query caching strategies",
              "CSS grid & asymmetric layouts",
              "Component unit testing"
            ],
            "current_goals": "Collaborating on open-source applications and contributing to developer tool interfaces.",
            "collaboration_style": "Eager to receive code review feedback, fast iteration cycles, proactive communication.",
            "target_projects": [
              "Developer portfolio builders",
              "Code snippet sharing tools",
              "E-commerce platforms"
            ]
          },
          "skills": [
            "React",
            "TypeScript",
            "JavaScript",
            "Tailwind CSS",
            "Git"
          ]
        }
      },
      {
        "id": "mem-zfasgc6",
        "team_id": "d3300000-0000-4000-c000-000000000003",
        "user_id": "d3300000-0000-4000-a000-000000000017",
        "role": "Mobile Specialist",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000017",
          "username": "pooja.mobile",
          "full_name": "Pooja Hegde",
          "headline": "Mobile App Developer | React Native & Flutter",
          "bio": "Building smooth 60fps iOS and Android applications with offline-first local storage and snappy native animations.",
          "location": "Mangalore, India",
          "github_username": "pooja-mobile",
          "website_url": "https://poojahegde.mobile",
          "experience_level": "Mid-Level",
          "availability_status": "available",
          "weekly_hours_available": 15,
          "interests": [
            "React Native",
            "Flutter",
            "Mobile UX",
            "Offline-First"
          ],
          "preset_avatar_id": "preset:dev-17",
          "professional_description": {
            "bio": "Cross-platform mobile engineer passionate about intuitive mobile experiences and high-performance native bridges.",
            "technical_interests": [
              "SQLite & WatermelonDB offline sync",
              "React Native Reanimated",
              "Push notification orchestration"
            ],
            "current_goals": "Building companion mobile apps for developer collaboration platforms.",
            "collaboration_style": "Mobile wireframes, rapid Expo prototypes, shared API schema synchronization.",
            "target_projects": [
              "Mobile chat applications",
              "Fitness tracking apps",
              "Smart attendance systems"
            ]
          },
          "skills": [
            "React",
            "TypeScript",
            "JavaScript",
            "Tailwind CSS",
            "REST APIs",
            "Supabase"
          ]
        }
      },
      {
        "id": "mem-d0ueodz",
        "team_id": "d3300000-0000-4000-c000-000000000003",
        "user_id": "d3300000-0000-4000-a000-000000000021",
        "role": "UI Engineer",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000021",
          "username": "aarav.dev",
          "full_name": "Aarav Gupta",
          "headline": "Frontend Engineer | Vue.js & Nuxt",
          "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
          "location": "Jaipur, India",
          "github_username": "aarav-dev",
          "website_url": "https://aaravdev.dev",
          "experience_level": "Junior",
          "availability_status": "available",
          "weekly_hours_available": 10,
          "interests": [
            "Vue.js",
            "Nuxt.js",
            "Software Architecture"
          ],
          "preset_avatar_id": "preset:dev-22",
          "professional_description": {
            "bio": "Dedicated Frontend Engineer | Vue.js & Nuxt with strong technical fundamentals and passion for reliable collaborative engineering.",
            "technical_interests": [
              "Vue.js",
              "Nuxt.js",
              "Clean Code"
            ],
            "current_goals": "Building impactful open-source tools with developer communities.",
            "collaboration_style": "Async communication, clear task estimation, peer reviews.",
            "target_projects": [
              "Collaborative platforms",
              "Developer tools",
              "SaaS applications"
            ]
          },
          "skills": [
            "Vue.js",
            "Nuxt.js",
            "TypeScript",
            "Tailwind CSS"
          ]
        }
      },
      {
        "id": "mem-ufxcg1r",
        "team_id": "d3300000-0000-4000-c000-000000000003",
        "user_id": "d3300000-0000-4000-a000-000000000024",
        "role": "Visual Designer",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000024",
          "username": "shreya.ui",
          "full_name": "Shreya Mukherjee",
          "headline": "Visual Designer & CSS Specialist",
          "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
          "location": "Kolkata, India",
          "github_username": "shreya-ui",
          "website_url": "https://shreyaui.dev",
          "experience_level": "Mid-Level",
          "availability_status": "available",
          "weekly_hours_available": 13,
          "interests": [
            "Figma",
            "Tailwind CSS",
            "Software Architecture"
          ],
          "preset_avatar_id": "preset:dev-1",
          "professional_description": {
            "bio": "Dedicated Visual Designer & CSS Specialist with strong technical fundamentals and passion for reliable collaborative engineering.",
            "technical_interests": [
              "Figma",
              "Tailwind CSS",
              "Clean Code"
            ],
            "current_goals": "Building impactful open-source tools with developer communities.",
            "collaboration_style": "Async communication, clear task estimation, peer reviews.",
            "target_projects": [
              "Collaborative platforms",
              "Developer tools",
              "SaaS applications"
            ]
          },
          "skills": [
            "Figma",
            "Tailwind CSS",
            "React",
            "JavaScript"
          ]
        }
      },
      {
        "id": "mem-69bjaec",
        "team_id": "d3300000-0000-4000-c000-000000000003",
        "user_id": "d3300000-0000-4000-a000-000000000034",
        "role": "UX Researcher",
        "joined_at": "2026-10-23T05:26:46.966Z",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000034",
          "username": "indira.ux",
          "full_name": "Indira Pillai",
          "headline": "UX Researcher & Interaction Designer",
          "bio": "Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.",
          "location": "Thrissur, India",
          "github_username": "indira-ux",
          "website_url": "https://indiraux.dev",
          "experience_level": "Senior",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 13,
          "interests": [
            "Figma",
            "UI/UX",
            "Software Architecture"
          ],
          "preset_avatar_id": "preset:dev-11",
          "professional_description": {
            "bio": "Dedicated UX Researcher & Interaction Designer with strong technical fundamentals and passion for reliable collaborative engineering.",
            "technical_interests": [
              "Figma",
              "UI/UX",
              "Clean Code"
            ],
            "current_goals": "Building impactful open-source tools with developer communities.",
            "collaboration_style": "Async communication, clear task estimation, peer reviews.",
            "target_projects": [
              "Collaborative platforms",
              "Developer tools",
              "SaaS applications"
            ]
          },
          "skills": [
            "Figma",
            "UI/UX",
            "Tailwind CSS",
            "React"
          ]
        }
      }
    ]
  }
];

export const DEMO_COMMUNITY_REPOS: CommunityRepository[] = [
  {
    "id": "repo-1",
    "name": "react",
    "owner": "facebook",
    "full_name": "facebook/react",
    "description": "The library for web and native user interfaces.",
    "html_url": "https://github.com/facebook/react",
    "language": "JavaScript",
    "stars": 228000,
    "forks": 45000,
    "topics": [
      "declarative",
      "frontend",
      "javascript",
      "react",
      "ui"
    ],
    "updated_at": "2026-11-06T17:26:46.967Z"
  },
  {
    "id": "repo-2",
    "name": "next.js",
    "owner": "vercel",
    "full_name": "vercel/next.js",
    "description": "The React Framework for the Web created by Vercel.",
    "html_url": "https://github.com/vercel/next.js",
    "language": "JavaScript",
    "stars": 126000,
    "forks": 26000,
    "topics": [
      "blog",
      "browser",
      "compiler",
      "nextjs",
      "react",
      "ssr"
    ],
    "updated_at": "2026-11-06T05:26:46.967Z"
  },
  {
    "id": "repo-3",
    "name": "supabase",
    "owner": "supabase",
    "full_name": "supabase/supabase",
    "description": "The open source Firebase alternative with Postgres, Auth, and Realtime.",
    "html_url": "https://github.com/supabase/supabase",
    "language": "TypeScript",
    "stars": 74000,
    "forks": 6200,
    "topics": [
      "database",
      "firebase",
      "postgres",
      "realtime",
      "supabase"
    ],
    "updated_at": "2026-11-05T17:26:46.967Z"
  },
  {
    "id": "repo-4",
    "name": "vscode",
    "owner": "microsoft",
    "full_name": "microsoft/vscode",
    "description": "Visual Studio Code is a code editor redefined and optimized for building modern web and cloud applications.",
    "html_url": "https://github.com/microsoft/vscode",
    "language": "TypeScript",
    "stars": 162000,
    "forks": 30000,
    "topics": [
      "developer-tools",
      "editor",
      "electron",
      "typescript",
      "vscode"
    ],
    "updated_at": "2026-11-05T05:26:46.967Z"
  },
  {
    "id": "repo-5",
    "name": "tailwindcss",
    "owner": "tailwindlabs",
    "full_name": "tailwindlabs/tailwindcss",
    "description": "A utility-first CSS framework for rapid UI development.",
    "html_url": "https://github.com/tailwindlabs/tailwindcss",
    "language": "TypeScript",
    "stars": 83000,
    "forks": 4100,
    "topics": [
      "css",
      "css-framework",
      "design-systems",
      "responsive",
      "tailwind"
    ],
    "updated_at": "2026-11-04T17:26:46.967Z"
  },
  {
    "id": "repo-6",
    "name": "linux",
    "owner": "torvalds",
    "full_name": "torvalds/linux",
    "description": "Linux kernel source tree maintained by Linus Torvalds.",
    "html_url": "https://github.com/torvalds/linux",
    "language": "C",
    "stars": 184000,
    "forks": 54000,
    "topics": [
      "kernel",
      "linux",
      "operating-system",
      "systems"
    ],
    "updated_at": "2026-11-04T05:26:46.967Z"
  },
  {
    "id": "repo-7",
    "name": "core",
    "owner": "vuejs",
    "full_name": "vuejs/core",
    "description": "Vue.js is a progressive, incrementally-adoptable JavaScript framework.",
    "html_url": "https://github.com/vuejs/core",
    "language": "TypeScript",
    "stars": 47000,
    "forks": 8100,
    "topics": [
      "framework",
      "frontend",
      "javascript",
      "vue"
    ],
    "updated_at": "2026-11-03T17:26:46.967Z"
  },
  {
    "id": "repo-8",
    "name": "angular",
    "owner": "angular",
    "full_name": "angular/angular",
    "description": "Deliver web apps with confidence using Google web application framework.",
    "html_url": "https://github.com/angular/angular",
    "language": "TypeScript",
    "stars": 96000,
    "forks": 25000,
    "topics": [
      "angular",
      "framework",
      "frontend",
      "pwa",
      "typescript"
    ],
    "updated_at": "2026-11-03T05:26:46.967Z"
  },
  {
    "id": "repo-9",
    "name": "node",
    "owner": "nodejs",
    "full_name": "nodejs/node",
    "description": "Node.js JavaScript runtime built on Chrome V8 JavaScript engine.",
    "html_url": "https://github.com/nodejs/node",
    "language": "JavaScript",
    "stars": 107000,
    "forks": 29000,
    "topics": [
      "backend",
      "javascript",
      "node",
      "runtime",
      "server"
    ],
    "updated_at": "2026-11-02T17:26:46.967Z"
  },
  {
    "id": "repo-10",
    "name": "deno",
    "owner": "denoland",
    "full_name": "denoland/deno",
    "description": "A modern runtime for JavaScript and TypeScript with secure defaults.",
    "html_url": "https://github.com/denoland/deno",
    "language": "Rust",
    "stars": 95000,
    "forks": 5200,
    "topics": [
      "deno",
      "javascript",
      "runtime",
      "rust",
      "typescript"
    ],
    "updated_at": "2026-11-02T05:26:46.967Z"
  },
  {
    "id": "repo-11",
    "name": "bun",
    "owner": "oven-sh",
    "full_name": "oven-sh/bun",
    "description": "Incredibly fast JavaScript runtime, bundler, test runner, and package manager.",
    "html_url": "https://github.com/oven-sh/bun",
    "language": "Zig",
    "stars": 76000,
    "forks": 2400,
    "topics": [
      "bundler",
      "javascript",
      "nodejs",
      "package-manager",
      "runtime",
      "zig"
    ],
    "updated_at": "2026-11-01T17:26:46.967Z"
  },
  {
    "id": "repo-12",
    "name": "rust",
    "owner": "rust-lang",
    "full_name": "rust-lang/rust",
    "description": "Empowering everyone to build reliable and efficient software.",
    "html_url": "https://github.com/rust-lang/rust",
    "language": "Rust",
    "stars": 99000,
    "forks": 12500,
    "topics": [
      "compiler",
      "language",
      "programming-language",
      "rust"
    ],
    "updated_at": "2026-11-01T05:26:46.967Z"
  },
  {
    "id": "repo-13",
    "name": "go",
    "owner": "golang",
    "full_name": "golang/go",
    "description": "The Go programming language created by Google.",
    "html_url": "https://github.com/golang/go",
    "language": "Go",
    "stars": 124000,
    "forks": 17500,
    "topics": [
      "compiler",
      "go",
      "golang",
      "language",
      "programming-language"
    ],
    "updated_at": "2026-10-31T17:26:46.967Z"
  },
  {
    "id": "repo-14",
    "name": "kubernetes",
    "owner": "kubernetes",
    "full_name": "kubernetes/kubernetes",
    "description": "Production-Grade Container Scheduling and Management.",
    "html_url": "https://github.com/kubernetes/kubernetes",
    "language": "Go",
    "stars": 111000,
    "forks": 39000,
    "topics": [
      "containers",
      "docker",
      "go",
      "kubernetes",
      "orchestration"
    ],
    "updated_at": "2026-10-31T05:26:46.967Z"
  },
  {
    "id": "repo-15",
    "name": "ui",
    "owner": "shadcn-ui",
    "full_name": "shadcn-ui/ui",
    "description": "Beautifully designed components that you can copy and paste into your apps.",
    "html_url": "https://github.com/shadcn-ui/ui",
    "language": "TypeScript",
    "stars": 72000,
    "forks": 6400,
    "topics": [
      "components",
      "design-system",
      "radix-ui",
      "react",
      "tailwind"
    ],
    "updated_at": "2026-10-30T17:26:46.967Z"
  },
  {
    "id": "repo-16",
    "name": "react-native",
    "owner": "facebook",
    "full_name": "facebook/react-native",
    "description": "A framework for building native applications using React.",
    "html_url": "https://github.com/facebook/react-native",
    "language": "C++",
    "stars": 118000,
    "forks": 24000,
    "topics": [
      "android",
      "ios",
      "mobile",
      "native",
      "react",
      "react-native"
    ],
    "updated_at": "2026-10-30T05:26:46.967Z"
  },
  {
    "id": "repo-17",
    "name": "flutter",
    "owner": "flutter",
    "full_name": "flutter/flutter",
    "description": "Flutter makes it easy and fast to build beautiful apps for mobile and beyond.",
    "html_url": "https://github.com/flutter/flutter",
    "language": "Dart",
    "stars": 165000,
    "forks": 27000,
    "topics": [
      "android",
      "cross-platform",
      "dart",
      "flutter",
      "ios",
      "mobile"
    ],
    "updated_at": "2026-10-29T17:26:46.968Z"
  },
  {
    "id": "repo-18",
    "name": "axios",
    "owner": "axios",
    "full_name": "axios/axios",
    "description": "Promise based HTTP client for the browser and node.js.",
    "html_url": "https://github.com/axios/axios",
    "language": "JavaScript",
    "stars": 104000,
    "forks": 10600,
    "topics": [
      "ajax",
      "http",
      "http-client",
      "javascript",
      "promise"
    ],
    "updated_at": "2026-10-29T05:26:46.968Z"
  },
  {
    "id": "repo-19",
    "name": "express",
    "owner": "expressjs",
    "full_name": "expressjs/express",
    "description": "Fast, unopinionated, minimalist web framework for node.",
    "html_url": "https://github.com/expressjs/express",
    "language": "JavaScript",
    "stars": 64000,
    "forks": 15500,
    "topics": [
      "express",
      "framework",
      "middleware",
      "node",
      "rest",
      "web"
    ],
    "updated_at": "2026-10-28T17:26:46.968Z"
  },
  {
    "id": "repo-20",
    "name": "prisma",
    "owner": "prisma",
    "full_name": "prisma/prisma",
    "description": "Next-generation ORM for Node.js & TypeScript with schema migrations.",
    "html_url": "https://github.com/prisma/prisma",
    "language": "TypeScript",
    "stars": 40000,
    "forks": 1500,
    "topics": [
      "database",
      "orm",
      "postgresql",
      "prisma",
      "sql",
      "typescript"
    ],
    "updated_at": "2026-10-28T05:26:46.968Z"
  },
  {
    "id": "repo-21",
    "name": "trpc",
    "owner": "trpc",
    "full_name": "trpc/trpc",
    "description": "Move Fast and Break Nothing. End-to-end typesafe APIs made easy.",
    "html_url": "https://github.com/trpc/trpc",
    "language": "TypeScript",
    "stars": 34500,
    "forks": 1200,
    "topics": [
      "api",
      "fullstack",
      "rpc",
      "trpc",
      "typescript"
    ],
    "updated_at": "2026-10-27T17:26:46.968Z"
  },
  {
    "id": "repo-22",
    "name": "query",
    "owner": "TanStack",
    "full_name": "TanStack/query",
    "description": "Powerful asynchronous state management, data-fetching, and caching for TS/JS.",
    "html_url": "https://github.com/TanStack/query",
    "language": "TypeScript",
    "stars": 42000,
    "forks": 2700,
    "topics": [
      "cache",
      "data-fetching",
      "react",
      "react-query",
      "typescript"
    ],
    "updated_at": "2026-10-27T05:26:46.968Z"
  },
  {
    "id": "repo-23",
    "name": "vite",
    "owner": "vitejs",
    "full_name": "vitejs/vite",
    "description": "Next generation frontend tooling. It is fast!",
    "html_url": "https://github.com/vitejs/vite",
    "language": "TypeScript",
    "stars": 70000,
    "forks": 6100,
    "topics": [
      "bundler",
      "devtools",
      "es-modules",
      "frontend",
      "vite"
    ],
    "updated_at": "2026-10-26T17:26:46.968Z"
  },
  {
    "id": "repo-24",
    "name": "electron",
    "owner": "electron",
    "full_name": "electron/electron",
    "description": "Build cross-platform desktop apps with JavaScript, HTML, and CSS.",
    "html_url": "https://github.com/electron/electron",
    "language": "C++",
    "stars": 114000,
    "forks": 15000,
    "topics": [
      "c-plus-plus",
      "chrome",
      "css",
      "desktop",
      "electron",
      "html"
    ],
    "updated_at": "2026-10-26T05:26:46.968Z"
  },
  {
    "id": "repo-25",
    "name": "kafka",
    "owner": "apache",
    "full_name": "apache/kafka",
    "description": "Mirror of Apache Kafka: distributed streaming platform.",
    "html_url": "https://github.com/apache/kafka",
    "language": "Java",
    "stars": 28500,
    "forks": 14000,
    "topics": [
      "distributed-systems",
      "event-streaming",
      "java",
      "kafka",
      "messaging"
    ],
    "updated_at": "2026-10-25T17:26:46.968Z"
  },
  {
    "id": "repo-26",
    "name": "redis",
    "owner": "redis",
    "full_name": "redis/redis",
    "description": "Redis is an in-memory database that persists on disk. The data model is key-value.",
    "html_url": "https://github.com/redis/redis",
    "language": "C",
    "stars": 65500,
    "forks": 23000,
    "topics": [
      "cache",
      "database",
      "in-memory",
      "key-value",
      "nosql",
      "redis"
    ],
    "updated_at": "2026-10-25T05:26:46.968Z"
  },
  {
    "id": "repo-27",
    "name": "postgres",
    "owner": "postgres",
    "full_name": "postgres/postgres",
    "description": "Mirror of the official PostgreSQL GIT repository.",
    "html_url": "https://github.com/postgres/postgres",
    "language": "C",
    "stars": 15500,
    "forks": 5200,
    "topics": [
      "database",
      "postgres",
      "postgresql",
      "relational-database",
      "sql"
    ],
    "updated_at": "2026-10-24T17:26:46.968Z"
  },
  {
    "id": "repo-28",
    "name": "tensorflow",
    "owner": "tensorflow",
    "full_name": "tensorflow/tensorflow",
    "description": "An Open Source Machine Learning Framework for Everyone.",
    "html_url": "https://github.com/tensorflow/tensorflow",
    "language": "C++",
    "stars": 187000,
    "forks": 89000,
    "topics": [
      "deep-learning",
      "machine-learning",
      "neural-network",
      "python",
      "tensorflow"
    ],
    "updated_at": "2026-10-24T05:26:46.968Z"
  },
  {
    "id": "repo-29",
    "name": "pytorch",
    "owner": "pytorch",
    "full_name": "pytorch/pytorch",
    "description": "Tensors and Dynamic neural networks in Python with strong GPU acceleration.",
    "html_url": "https://github.com/pytorch/pytorch",
    "language": "Python",
    "stars": 85000,
    "forks": 22500,
    "topics": [
      "autograd",
      "deep-learning",
      "gpu",
      "neural-network",
      "python",
      "pytorch"
    ],
    "updated_at": "2026-10-23T17:26:46.968Z"
  },
  {
    "id": "repo-30",
    "name": "langchain",
    "owner": "langchain-ai",
    "full_name": "langchain-ai/langchain",
    "description": "Build context-aware reasoning applications with LangChain.",
    "html_url": "https://github.com/langchain-ai/langchain",
    "language": "Python",
    "stars": 97500,
    "forks": 15500,
    "topics": [
      "ai",
      "langchain",
      "llm",
      "nlp",
      "openai",
      "python"
    ],
    "updated_at": "2026-10-23T05:26:46.968Z"
  },
  {
    "id": "repo-31",
    "name": "transformers",
    "owner": "huggingface",
    "full_name": "huggingface/transformers",
    "description": "State-of-the-art Machine Learning for Pytorch, TensorFlow, and JAX.",
    "html_url": "https://github.com/huggingface/transformers",
    "language": "Python",
    "stars": 137000,
    "forks": 26000,
    "topics": [
      "bert",
      "deep-learning",
      "huggingface",
      "nlp",
      "pytorch",
      "transformers"
    ],
    "updated_at": "2026-10-22T17:26:46.968Z"
  },
  {
    "id": "repo-32",
    "name": "TypeScript",
    "owner": "microsoft",
    "full_name": "microsoft/TypeScript",
    "description": "TypeScript is a superset of JavaScript that compiles to clean JavaScript output.",
    "html_url": "https://github.com/microsoft/TypeScript",
    "language": "TypeScript",
    "stars": 100500,
    "forks": 12500,
    "topics": [
      "javascript",
      "language",
      "microsoft",
      "typechecker",
      "typescript"
    ],
    "updated_at": "2026-10-22T05:26:46.968Z"
  },
  {
    "id": "repo-33",
    "name": "flask",
    "owner": "pallets",
    "full_name": "pallets/flask",
    "description": "The Python micro framework for building web applications.",
    "html_url": "https://github.com/pallets/flask",
    "language": "Python",
    "stars": 68500,
    "forks": 16000,
    "topics": [
      "flask",
      "framework",
      "jinja",
      "pallets",
      "python",
      "web-framework"
    ],
    "updated_at": "2026-10-21T17:26:46.968Z"
  },
  {
    "id": "repo-34",
    "name": "django",
    "owner": "django",
    "full_name": "django/django",
    "description": "The Web framework for perfectionists with deadlines.",
    "html_url": "https://github.com/django/django",
    "language": "Python",
    "stars": 80500,
    "forks": 31500,
    "topics": [
      "django",
      "framework",
      "models",
      "orm",
      "python",
      "views"
    ],
    "updated_at": "2026-10-21T05:26:46.968Z"
  },
  {
    "id": "repo-35",
    "name": "spring-boot",
    "owner": "spring-projects",
    "full_name": "spring-projects/spring-boot",
    "description": "Spring Boot helps you to create stand-alone, production-grade Spring based Applications.",
    "html_url": "https://github.com/spring-projects/spring-boot",
    "language": "Java",
    "stars": 75500,
    "forks": 40500,
    "topics": [
      "framework",
      "java",
      "microservices",
      "spring",
      "spring-boot"
    ],
    "updated_at": "2026-10-20T17:26:46.968Z"
  },
  {
    "id": "repo-36",
    "name": "fastapi",
    "owner": "fastapi",
    "full_name": "fastapi/fastapi",
    "description": "FastAPI framework, high performance, easy to learn, fast to code, ready for production.",
    "html_url": "https://github.com/fastapi/fastapi",
    "language": "Python",
    "stars": 78500,
    "forks": 6400,
    "topics": [
      "async",
      "fastapi",
      "openapi",
      "pydantic",
      "python",
      "rest"
    ],
    "updated_at": "2026-10-20T05:26:46.968Z"
  },
  {
    "id": "repo-37",
    "name": "uv",
    "owner": "astral-sh",
    "full_name": "astral-sh/uv",
    "description": "An extremely fast Python package and project manager, written in Rust.",
    "html_url": "https://github.com/astral-sh/uv",
    "language": "Rust",
    "stars": 44000,
    "forks": 1200,
    "topics": [
      "package-manager",
      "pip",
      "python",
      "rust",
      "uv"
    ],
    "updated_at": "2026-10-19T17:26:46.968Z"
  },
  {
    "id": "repo-38",
    "name": "ollama",
    "owner": "ollama",
    "full_name": "ollama/ollama",
    "description": "Get up and running with Llama 3, Mistral, Gemma 2, and other large language models.",
    "html_url": "https://github.com/ollama/ollama",
    "language": "Go",
    "stars": 104000,
    "forks": 9200,
    "topics": [
      "ai",
      "go",
      "llama",
      "llm",
      "local-ai",
      "ollama"
    ],
    "updated_at": "2026-10-19T05:26:46.968Z"
  },
  {
    "id": "repo-39",
    "name": "vllm",
    "owner": "vllm-project",
    "full_name": "vllm-project/vllm",
    "description": "A high-throughput and memory-efficient inference and serving engine for LLMs.",
    "html_url": "https://github.com/vllm-project/vllm",
    "language": "Python",
    "stars": 37500,
    "forks": 4500,
    "topics": [
      "cuda",
      "inference",
      "llm",
      "pagedattention",
      "pytorch",
      "vllm"
    ],
    "updated_at": "2026-10-18T17:26:46.968Z"
  },
  {
    "id": "repo-40",
    "name": "docker-cli",
    "owner": "docker",
    "full_name": "docker/cli",
    "description": "The official CLI tool for managing Docker containers and images.",
    "html_url": "https://github.com/docker/cli",
    "language": "Go",
    "stars": 5500,
    "forks": 2400,
    "topics": [
      "containers",
      "docker",
      "docker-cli",
      "go"
    ],
    "updated_at": "2026-10-18T05:26:46.968Z"
  }
];

export const DEMO_CONVERSATIONS: DemoConversation[] = [
  {
    "id": "d3300000-0000-4000-d000-000000000001",
    "type": "direct",
    "name": "Arjun Patel & Meera Nair",
    "members": [
      {
        "user_id": "d3300000-0000-4000-a000-000000000001",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000001",
          "username": "arjun.codes",
          "full_name": "Arjun Patel",
          "headline": "Senior Full-Stack Architect | Distributed Systems & Go",
          "bio": "Passionate about distributed microservices, event streams, and building developer-first developer tooling. Open source advocate.",
          "location": "Bangalore, India",
          "github_username": "arjun-patel",
          "website_url": "https://arjunpatel.dev",
          "experience_level": "Senior",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 15,
          "interests": [
            "Distributed Systems",
            "Go",
            "Microservices",
            "Kubernetes"
          ],
          "preset_avatar_id": "preset:dev-1",
          "professional_description": {
            "bio": "Full-stack software architect with 6+ years shipping high-throughput backends and reactive React frontends.",
            "technical_interests": [
              "Distributed consensus (Raft/Paxos)",
              "High-concurrency Go services",
              "Rust for systems programming",
              "Edge computing"
            ],
            "current_goals": "Architecting fault-tolerant task orchestrators and mentoring early-career engineers in distributed systems.",
            "collaboration_style": "Async-first, documented PRs, clear architecture decision records (ADRs), weekly sprint sync.",
            "target_projects": [
              "Developer infrastructure tools",
              "Real-time telemetry platforms",
              "Open-source distributed databases"
            ]
          },
          "skills": [
            "Go",
            "TypeScript",
            "PostgreSQL",
            "Docker",
            "Kubernetes",
            "Redis",
            "React",
            "REST APIs"
          ]
        }
      },
      {
        "user_id": "d3300000-0000-4000-a000-000000000002",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000002",
          "username": "dev_meera",
          "full_name": "Meera Nair",
          "headline": "Lead Frontend Engineer | UI/UX & Design Systems",
          "bio": "Obsessed with fluid micro-interactions, accessible UI architecture, and modern WebGL canvases. Linear & Vercel design aesthetic enthusiast.",
          "location": "Mumbai, India",
          "github_username": "meera-nair",
          "website_url": "https://meera.design",
          "experience_level": "Lead",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 12,
          "interests": [
            "Design Systems",
            "React",
            "Framer Motion",
            "Tailwind CSS",
            "Web Performance"
          ],
          "preset_avatar_id": "preset:dev-2",
          "professional_description": {
            "bio": "Design systems engineer crafting pixel-perfect, accessible component libraries and high-performance React frontends.",
            "technical_interests": [
              "Design tokens & Tailwind orchestration",
              "Complex animation choreographies with Framer Motion",
              "Accessible ARIA patterns"
            ],
            "current_goals": "Building frictionless developer tool interfaces with sub-100ms interaction latencies.",
            "collaboration_style": "Pair programming on critical components, Figma tokens-to-code workflow, proactive UI reviews.",
            "target_projects": [
              "Dark-mode first developer SaaS dashboards",
              "Interactive canvas applications",
              "Component design libraries"
            ]
          },
          "skills": [
            "React",
            "TypeScript",
            "Next.js",
            "Tailwind CSS",
            "Figma",
            "WebSockets"
          ]
        }
      }
    ],
    "messages": [
      {
        "id": "d3300000-0000-4000-e000-000000000000",
        "conversation_id": "d3300000-0000-4000-d000-000000000001",
        "sender_id": "d3300000-0000-4000-a000-000000000001",
        "content": "Hey Meera! Are you available to review the dashboard telemetry architecture?",
        "created_at": "2026-11-07T03:46:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000001",
          "username": "arjun.codes",
          "full_name": "Arjun Patel",
          "headline": "Senior Full-Stack Architect | Distributed Systems & Go",
          "bio": "Passionate about distributed microservices, event streams, and building developer-first developer tooling. Open source advocate.",
          "location": "Bangalore, India",
          "github_username": "arjun-patel",
          "website_url": "https://arjunpatel.dev",
          "experience_level": "Senior",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 15,
          "interests": [
            "Distributed Systems",
            "Go",
            "Microservices",
            "Kubernetes"
          ],
          "preset_avatar_id": "preset:dev-1",
          "professional_description": {
            "bio": "Full-stack software architect with 6+ years shipping high-throughput backends and reactive React frontends.",
            "technical_interests": [
              "Distributed consensus (Raft/Paxos)",
              "High-concurrency Go services",
              "Rust for systems programming",
              "Edge computing"
            ],
            "current_goals": "Architecting fault-tolerant task orchestrators and mentoring early-career engineers in distributed systems.",
            "collaboration_style": "Async-first, documented PRs, clear architecture decision records (ADRs), weekly sprint sync.",
            "target_projects": [
              "Developer infrastructure tools",
              "Real-time telemetry platforms",
              "Open-source distributed databases"
            ]
          },
          "skills": [
            "Go",
            "TypeScript",
            "PostgreSQL",
            "Docker",
            "Kubernetes",
            "Redis",
            "React",
            "REST APIs"
          ]
        }
      },
      {
        "id": "d3300000-0000-4000-e000-000000000001",
        "conversation_id": "d3300000-0000-4000-d000-000000000001",
        "sender_id": "d3300000-0000-4000-a000-000000000002",
        "content": "Hey Arjun! Absolutely. I was just reviewing the Recharts dual-gradient velocity implementation. It looks super crisp.",
        "created_at": "2026-11-07T04:06:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000002",
          "username": "dev_meera",
          "full_name": "Meera Nair",
          "headline": "Lead Frontend Engineer | UI/UX & Design Systems",
          "bio": "Obsessed with fluid micro-interactions, accessible UI architecture, and modern WebGL canvases. Linear & Vercel design aesthetic enthusiast.",
          "location": "Mumbai, India",
          "github_username": "meera-nair",
          "website_url": "https://meera.design",
          "experience_level": "Lead",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 12,
          "interests": [
            "Design Systems",
            "React",
            "Framer Motion",
            "Tailwind CSS",
            "Web Performance"
          ],
          "preset_avatar_id": "preset:dev-2",
          "professional_description": {
            "bio": "Design systems engineer crafting pixel-perfect, accessible component libraries and high-performance React frontends.",
            "technical_interests": [
              "Design tokens & Tailwind orchestration",
              "Complex animation choreographies with Framer Motion",
              "Accessible ARIA patterns"
            ],
            "current_goals": "Building frictionless developer tool interfaces with sub-100ms interaction latencies.",
            "collaboration_style": "Pair programming on critical components, Figma tokens-to-code workflow, proactive UI reviews.",
            "target_projects": [
              "Dark-mode first developer SaaS dashboards",
              "Interactive canvas applications",
              "Component design libraries"
            ]
          },
          "skills": [
            "React",
            "TypeScript",
            "Next.js",
            "Tailwind CSS",
            "Figma",
            "WebSockets"
          ]
        }
      },
      {
        "id": "d3300000-0000-4000-e000-000000000002",
        "conversation_id": "d3300000-0000-4000-d000-000000000001",
        "sender_id": "d3300000-0000-4000-a000-000000000001",
        "content": "Awesome. We need to hook up the 30-day velocity metric to the live Supabase project tasks.",
        "created_at": "2026-11-07T04:26:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000001",
          "username": "arjun.codes",
          "full_name": "Arjun Patel",
          "headline": "Senior Full-Stack Architect | Distributed Systems & Go",
          "bio": "Passionate about distributed microservices, event streams, and building developer-first developer tooling. Open source advocate.",
          "location": "Bangalore, India",
          "github_username": "arjun-patel",
          "website_url": "https://arjunpatel.dev",
          "experience_level": "Senior",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 15,
          "interests": [
            "Distributed Systems",
            "Go",
            "Microservices",
            "Kubernetes"
          ],
          "preset_avatar_id": "preset:dev-1",
          "professional_description": {
            "bio": "Full-stack software architect with 6+ years shipping high-throughput backends and reactive React frontends.",
            "technical_interests": [
              "Distributed consensus (Raft/Paxos)",
              "High-concurrency Go services",
              "Rust for systems programming",
              "Edge computing"
            ],
            "current_goals": "Architecting fault-tolerant task orchestrators and mentoring early-career engineers in distributed systems.",
            "collaboration_style": "Async-first, documented PRs, clear architecture decision records (ADRs), weekly sprint sync.",
            "target_projects": [
              "Developer infrastructure tools",
              "Real-time telemetry platforms",
              "Open-source distributed databases"
            ]
          },
          "skills": [
            "Go",
            "TypeScript",
            "PostgreSQL",
            "Docker",
            "Kubernetes",
            "Redis",
            "React",
            "REST APIs"
          ]
        }
      },
      {
        "id": "d3300000-0000-4000-e000-000000000003",
        "conversation_id": "d3300000-0000-4000-d000-000000000001",
        "sender_id": "d3300000-0000-4000-a000-000000000002",
        "content": "Great, I can handle the frontend data formatting and state hooks tonight. Let me know once the endpoint is ready.",
        "created_at": "2026-11-07T04:46:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000002",
          "username": "dev_meera",
          "full_name": "Meera Nair",
          "headline": "Lead Frontend Engineer | UI/UX & Design Systems",
          "bio": "Obsessed with fluid micro-interactions, accessible UI architecture, and modern WebGL canvases. Linear & Vercel design aesthetic enthusiast.",
          "location": "Mumbai, India",
          "github_username": "meera-nair",
          "website_url": "https://meera.design",
          "experience_level": "Lead",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 12,
          "interests": [
            "Design Systems",
            "React",
            "Framer Motion",
            "Tailwind CSS",
            "Web Performance"
          ],
          "preset_avatar_id": "preset:dev-2",
          "professional_description": {
            "bio": "Design systems engineer crafting pixel-perfect, accessible component libraries and high-performance React frontends.",
            "technical_interests": [
              "Design tokens & Tailwind orchestration",
              "Complex animation choreographies with Framer Motion",
              "Accessible ARIA patterns"
            ],
            "current_goals": "Building frictionless developer tool interfaces with sub-100ms interaction latencies.",
            "collaboration_style": "Pair programming on critical components, Figma tokens-to-code workflow, proactive UI reviews.",
            "target_projects": [
              "Dark-mode first developer SaaS dashboards",
              "Interactive canvas applications",
              "Component design libraries"
            ]
          },
          "skills": [
            "React",
            "TypeScript",
            "Next.js",
            "Tailwind CSS",
            "Figma",
            "WebSockets"
          ]
        }
      },
      {
        "id": "d3300000-0000-4000-e000-000000000004",
        "conversation_id": "d3300000-0000-4000-d000-000000000001",
        "sender_id": "d3300000-0000-4000-a000-000000000001",
        "content": "Pushed the database function! Let me know if you hit any TypeScript typing mismatches.",
        "created_at": "2026-11-07T05:06:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000001",
          "username": "arjun.codes",
          "full_name": "Arjun Patel",
          "headline": "Senior Full-Stack Architect | Distributed Systems & Go",
          "bio": "Passionate about distributed microservices, event streams, and building developer-first developer tooling. Open source advocate.",
          "location": "Bangalore, India",
          "github_username": "arjun-patel",
          "website_url": "https://arjunpatel.dev",
          "experience_level": "Senior",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 15,
          "interests": [
            "Distributed Systems",
            "Go",
            "Microservices",
            "Kubernetes"
          ],
          "preset_avatar_id": "preset:dev-1",
          "professional_description": {
            "bio": "Full-stack software architect with 6+ years shipping high-throughput backends and reactive React frontends.",
            "technical_interests": [
              "Distributed consensus (Raft/Paxos)",
              "High-concurrency Go services",
              "Rust for systems programming",
              "Edge computing"
            ],
            "current_goals": "Architecting fault-tolerant task orchestrators and mentoring early-career engineers in distributed systems.",
            "collaboration_style": "Async-first, documented PRs, clear architecture decision records (ADRs), weekly sprint sync.",
            "target_projects": [
              "Developer infrastructure tools",
              "Real-time telemetry platforms",
              "Open-source distributed databases"
            ]
          },
          "skills": [
            "Go",
            "TypeScript",
            "PostgreSQL",
            "Docker",
            "Kubernetes",
            "Redis",
            "React",
            "REST APIs"
          ]
        }
      }
    ],
    "last_message": {
      "id": "d3300000-0000-4000-e000-000000000004",
      "conversation_id": "d3300000-0000-4000-d000-000000000001",
      "sender_id": "d3300000-0000-4000-a000-000000000001",
      "content": "Pushed the database function! Let me know if you hit any TypeScript typing mismatches.",
      "created_at": "2026-11-07T05:06:46.968Z",
      "sender": {
        "id": "d3300000-0000-4000-a000-000000000001",
        "username": "arjun.codes",
        "full_name": "Arjun Patel",
        "headline": "Senior Full-Stack Architect | Distributed Systems & Go",
        "bio": "Passionate about distributed microservices, event streams, and building developer-first developer tooling. Open source advocate.",
        "location": "Bangalore, India",
        "github_username": "arjun-patel",
        "website_url": "https://arjunpatel.dev",
        "experience_level": "Senior",
        "availability_status": "open_to_collaborate",
        "weekly_hours_available": 15,
        "interests": [
          "Distributed Systems",
          "Go",
          "Microservices",
          "Kubernetes"
        ],
        "preset_avatar_id": "preset:dev-1",
        "professional_description": {
          "bio": "Full-stack software architect with 6+ years shipping high-throughput backends and reactive React frontends.",
          "technical_interests": [
            "Distributed consensus (Raft/Paxos)",
            "High-concurrency Go services",
            "Rust for systems programming",
            "Edge computing"
          ],
          "current_goals": "Architecting fault-tolerant task orchestrators and mentoring early-career engineers in distributed systems.",
          "collaboration_style": "Async-first, documented PRs, clear architecture decision records (ADRs), weekly sprint sync.",
          "target_projects": [
            "Developer infrastructure tools",
            "Real-time telemetry platforms",
            "Open-source distributed databases"
          ]
        },
        "skills": [
          "Go",
          "TypeScript",
          "PostgreSQL",
          "Docker",
          "Kubernetes",
          "Redis",
          "React",
          "REST APIs"
        ]
      }
    }
  },
  {
    "id": "d3300000-0000-4000-d000-000000000002",
    "type": "direct",
    "name": "Harshit Sharma & Arjun Patel",
    "members": [
      {
        "user_id": "d3300000-0000-4000-a000-000000000003",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000003",
          "username": "harshitbuilds",
          "full_name": "Harshit Sharma",
          "headline": "Systems Engineer | Rust, WebAssembly & Low Latency",
          "bio": "Compiling Rust to Wasm, optimizing memory layouts, and building ultra-fast developer platforms with zero-cost abstractions.",
          "location": "Delhi NCR, India",
          "github_username": "harshit-builds",
          "website_url": "https://harshit.systems",
          "experience_level": "Senior",
          "availability_status": "available",
          "weekly_hours_available": 20,
          "interests": [
            "Rust",
            "WebAssembly",
            "Performance",
            "Compilers"
          ],
          "preset_avatar_id": "preset:dev-3",
          "professional_description": {
            "bio": "Systems programmer focused on high-throughput services, Wasm runtimes, and concurrent network protocols in Rust.",
            "technical_interests": [
              "Tokio async runtimes",
              "SIMD optimizations",
              "Zero-copy serialization (FlatBuffers)",
              "Cross-compilation"
            ],
            "current_goals": "Creating blazing-fast edge processing engines that run seamlessly in browser and cloud.",
            "collaboration_style": "Benchmark-driven development, comprehensive integration tests, async GitHub reviews.",
            "target_projects": [
              "Wasm-powered client runtime engines",
              "Edge compute proxies",
              "Distributed cache clusters"
            ]
          },
          "skills": [
            "Rust",
            "C++",
            "Linux",
            "Docker",
            "WebSockets",
            "PostgreSQL"
          ]
        }
      },
      {
        "user_id": "d3300000-0000-4000-a000-000000000001",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000001",
          "username": "arjun.codes",
          "full_name": "Arjun Patel",
          "headline": "Senior Full-Stack Architect | Distributed Systems & Go",
          "bio": "Passionate about distributed microservices, event streams, and building developer-first developer tooling. Open source advocate.",
          "location": "Bangalore, India",
          "github_username": "arjun-patel",
          "website_url": "https://arjunpatel.dev",
          "experience_level": "Senior",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 15,
          "interests": [
            "Distributed Systems",
            "Go",
            "Microservices",
            "Kubernetes"
          ],
          "preset_avatar_id": "preset:dev-1",
          "professional_description": {
            "bio": "Full-stack software architect with 6+ years shipping high-throughput backends and reactive React frontends.",
            "technical_interests": [
              "Distributed consensus (Raft/Paxos)",
              "High-concurrency Go services",
              "Rust for systems programming",
              "Edge computing"
            ],
            "current_goals": "Architecting fault-tolerant task orchestrators and mentoring early-career engineers in distributed systems.",
            "collaboration_style": "Async-first, documented PRs, clear architecture decision records (ADRs), weekly sprint sync.",
            "target_projects": [
              "Developer infrastructure tools",
              "Real-time telemetry platforms",
              "Open-source distributed databases"
            ]
          },
          "skills": [
            "Go",
            "TypeScript",
            "PostgreSQL",
            "Docker",
            "Kubernetes",
            "Redis",
            "React",
            "REST APIs"
          ]
        }
      }
    ],
    "messages": [
      {
        "id": "d3300000-0000-4000-e000-000000000100",
        "conversation_id": "d3300000-0000-4000-d000-000000000002",
        "sender_id": "d3300000-0000-4000-a000-000000000001",
        "content": "Arjun, did you get a chance to test the Wasm client-side parser crate?",
        "created_at": "2026-11-07T04:06:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000001",
          "username": "arjun.codes",
          "full_name": "Arjun Patel",
          "headline": "Senior Full-Stack Architect | Distributed Systems & Go",
          "bio": "Passionate about distributed microservices, event streams, and building developer-first developer tooling. Open source advocate.",
          "location": "Bangalore, India",
          "github_username": "arjun-patel",
          "website_url": "https://arjunpatel.dev",
          "experience_level": "Senior",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 15,
          "interests": [
            "Distributed Systems",
            "Go",
            "Microservices",
            "Kubernetes"
          ],
          "preset_avatar_id": "preset:dev-1",
          "professional_description": {
            "bio": "Full-stack software architect with 6+ years shipping high-throughput backends and reactive React frontends.",
            "technical_interests": [
              "Distributed consensus (Raft/Paxos)",
              "High-concurrency Go services",
              "Rust for systems programming",
              "Edge computing"
            ],
            "current_goals": "Architecting fault-tolerant task orchestrators and mentoring early-career engineers in distributed systems.",
            "collaboration_style": "Async-first, documented PRs, clear architecture decision records (ADRs), weekly sprint sync.",
            "target_projects": [
              "Developer infrastructure tools",
              "Real-time telemetry platforms",
              "Open-source distributed databases"
            ]
          },
          "skills": [
            "Go",
            "TypeScript",
            "PostgreSQL",
            "Docker",
            "Kubernetes",
            "Redis",
            "React",
            "REST APIs"
          ]
        }
      },
      {
        "id": "d3300000-0000-4000-e000-000000000101",
        "conversation_id": "d3300000-0000-4000-d000-000000000002",
        "sender_id": "d3300000-0000-4000-a000-000000000003",
        "content": "Yes! It reduced our JSON parsing bottleneck by almost 4x in the benchmark run.",
        "created_at": "2026-11-07T04:26:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000003",
          "username": "harshitbuilds",
          "full_name": "Harshit Sharma",
          "headline": "Systems Engineer | Rust, WebAssembly & Low Latency",
          "bio": "Compiling Rust to Wasm, optimizing memory layouts, and building ultra-fast developer platforms with zero-cost abstractions.",
          "location": "Delhi NCR, India",
          "github_username": "harshit-builds",
          "website_url": "https://harshit.systems",
          "experience_level": "Senior",
          "availability_status": "available",
          "weekly_hours_available": 20,
          "interests": [
            "Rust",
            "WebAssembly",
            "Performance",
            "Compilers"
          ],
          "preset_avatar_id": "preset:dev-3",
          "professional_description": {
            "bio": "Systems programmer focused on high-throughput services, Wasm runtimes, and concurrent network protocols in Rust.",
            "technical_interests": [
              "Tokio async runtimes",
              "SIMD optimizations",
              "Zero-copy serialization (FlatBuffers)",
              "Cross-compilation"
            ],
            "current_goals": "Creating blazing-fast edge processing engines that run seamlessly in browser and cloud.",
            "collaboration_style": "Benchmark-driven development, comprehensive integration tests, async GitHub reviews.",
            "target_projects": [
              "Wasm-powered client runtime engines",
              "Edge compute proxies",
              "Distributed cache clusters"
            ]
          },
          "skills": [
            "Rust",
            "C++",
            "Linux",
            "Docker",
            "WebSockets",
            "PostgreSQL"
          ]
        }
      },
      {
        "id": "d3300000-0000-4000-e000-000000000102",
        "conversation_id": "d3300000-0000-4000-d000-000000000002",
        "sender_id": "d3300000-0000-4000-a000-000000000001",
        "content": "Incredible. I just added SIMD vectorization. Compiling to wasm32-unknown-unknown now.",
        "created_at": "2026-11-07T04:46:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000001",
          "username": "arjun.codes",
          "full_name": "Arjun Patel",
          "headline": "Senior Full-Stack Architect | Distributed Systems & Go",
          "bio": "Passionate about distributed microservices, event streams, and building developer-first developer tooling. Open source advocate.",
          "location": "Bangalore, India",
          "github_username": "arjun-patel",
          "website_url": "https://arjunpatel.dev",
          "experience_level": "Senior",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 15,
          "interests": [
            "Distributed Systems",
            "Go",
            "Microservices",
            "Kubernetes"
          ],
          "preset_avatar_id": "preset:dev-1",
          "professional_description": {
            "bio": "Full-stack software architect with 6+ years shipping high-throughput backends and reactive React frontends.",
            "technical_interests": [
              "Distributed consensus (Raft/Paxos)",
              "High-concurrency Go services",
              "Rust for systems programming",
              "Edge computing"
            ],
            "current_goals": "Architecting fault-tolerant task orchestrators and mentoring early-career engineers in distributed systems.",
            "collaboration_style": "Async-first, documented PRs, clear architecture decision records (ADRs), weekly sprint sync.",
            "target_projects": [
              "Developer infrastructure tools",
              "Real-time telemetry platforms",
              "Open-source distributed databases"
            ]
          },
          "skills": [
            "Go",
            "TypeScript",
            "PostgreSQL",
            "Docker",
            "Kubernetes",
            "Redis",
            "React",
            "REST APIs"
          ]
        }
      },
      {
        "id": "d3300000-0000-4000-e000-000000000103",
        "conversation_id": "d3300000-0000-4000-d000-000000000002",
        "sender_id": "d3300000-0000-4000-a000-000000000003",
        "content": "Let us merge it into the Distributed Task Orchestrator repo before tomorrow morning sprint sync.",
        "created_at": "2026-11-07T05:06:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000003",
          "username": "harshitbuilds",
          "full_name": "Harshit Sharma",
          "headline": "Systems Engineer | Rust, WebAssembly & Low Latency",
          "bio": "Compiling Rust to Wasm, optimizing memory layouts, and building ultra-fast developer platforms with zero-cost abstractions.",
          "location": "Delhi NCR, India",
          "github_username": "harshit-builds",
          "website_url": "https://harshit.systems",
          "experience_level": "Senior",
          "availability_status": "available",
          "weekly_hours_available": 20,
          "interests": [
            "Rust",
            "WebAssembly",
            "Performance",
            "Compilers"
          ],
          "preset_avatar_id": "preset:dev-3",
          "professional_description": {
            "bio": "Systems programmer focused on high-throughput services, Wasm runtimes, and concurrent network protocols in Rust.",
            "technical_interests": [
              "Tokio async runtimes",
              "SIMD optimizations",
              "Zero-copy serialization (FlatBuffers)",
              "Cross-compilation"
            ],
            "current_goals": "Creating blazing-fast edge processing engines that run seamlessly in browser and cloud.",
            "collaboration_style": "Benchmark-driven development, comprehensive integration tests, async GitHub reviews.",
            "target_projects": [
              "Wasm-powered client runtime engines",
              "Edge compute proxies",
              "Distributed cache clusters"
            ]
          },
          "skills": [
            "Rust",
            "C++",
            "Linux",
            "Docker",
            "WebSockets",
            "PostgreSQL"
          ]
        }
      }
    ],
    "last_message": {
      "id": "d3300000-0000-4000-e000-000000000103",
      "conversation_id": "d3300000-0000-4000-d000-000000000002",
      "sender_id": "d3300000-0000-4000-a000-000000000003",
      "content": "Let us merge it into the Distributed Task Orchestrator repo before tomorrow morning sprint sync.",
      "created_at": "2026-11-07T05:06:46.968Z",
      "sender": {
        "id": "d3300000-0000-4000-a000-000000000003",
        "username": "harshitbuilds",
        "full_name": "Harshit Sharma",
        "headline": "Systems Engineer | Rust, WebAssembly & Low Latency",
        "bio": "Compiling Rust to Wasm, optimizing memory layouts, and building ultra-fast developer platforms with zero-cost abstractions.",
        "location": "Delhi NCR, India",
        "github_username": "harshit-builds",
        "website_url": "https://harshit.systems",
        "experience_level": "Senior",
        "availability_status": "available",
        "weekly_hours_available": 20,
        "interests": [
          "Rust",
          "WebAssembly",
          "Performance",
          "Compilers"
        ],
        "preset_avatar_id": "preset:dev-3",
        "professional_description": {
          "bio": "Systems programmer focused on high-throughput services, Wasm runtimes, and concurrent network protocols in Rust.",
          "technical_interests": [
            "Tokio async runtimes",
            "SIMD optimizations",
            "Zero-copy serialization (FlatBuffers)",
            "Cross-compilation"
          ],
          "current_goals": "Creating blazing-fast edge processing engines that run seamlessly in browser and cloud.",
          "collaboration_style": "Benchmark-driven development, comprehensive integration tests, async GitHub reviews.",
          "target_projects": [
            "Wasm-powered client runtime engines",
            "Edge compute proxies",
            "Distributed cache clusters"
          ]
        },
        "skills": [
          "Rust",
          "C++",
          "Linux",
          "Docker",
          "WebSockets",
          "PostgreSQL"
        ]
      }
    }
  },
  {
    "id": "d3300000-0000-4000-d000-000000000003",
    "type": "direct",
    "name": "Rohan Mehta & Ishita Sen",
    "members": [
      {
        "user_id": "d3300000-0000-4000-a000-000000000004",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000004",
          "username": "rohanxdev",
          "full_name": "Rohan Mehta",
          "headline": "AI/ML Researcher & LLM Orchestration Engineer",
          "bio": "Fine-tuning open weights models, building agentic reasoning workflows, and optimizing vector search pipelines with LangChain & PyTorch.",
          "location": "Pune, India",
          "github_username": "rohan-mehta",
          "website_url": "https://rohanmehta.ai",
          "experience_level": "Mid-Level",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 10,
          "interests": [
            "AI Agents",
            "PyTorch",
            "Vector Databases",
            "LangChain"
          ],
          "preset_avatar_id": "preset:dev-4",
          "professional_description": {
            "bio": "Machine learning specialist developing production RAG systems, model evaluation harnesses, and multi-agent systems.",
            "technical_interests": [
              "Quantized LLM deployment (GGUF/vLLM)",
              "Hierarchical RAG architectures",
              "Tool-calling agents"
            ],
            "current_goals": "Fine-tuning specialized coding assistant models and building autonomous pair-programming pipelines.",
            "collaboration_style": "Experiment notebooks with clear metrics, reproducible validation sets, weekly sprint check-ins.",
            "target_projects": [
              "AI code reviewers",
              "Automated developer matchmaking engines",
              "Semantic code search"
            ]
          },
          "skills": [
            "Python",
            "PyTorch",
            "OpenAI API",
            "Gemini API",
            "LangChain",
            "FastAPI",
            "PostgreSQL"
          ]
        }
      },
      {
        "user_id": "d3300000-0000-4000-a000-000000000007",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000007",
          "username": "ishita.ml",
          "full_name": "Ishita Sen",
          "headline": "NLP & Deep Learning Engineer | Transformers & GenAI",
          "bio": "Building natural language understanding pipelines, custom embeddings, and conversational AI agents with Hugging Face & PyTorch.",
          "location": "Kolkata, India",
          "github_username": "ishita-sen",
          "website_url": "https://ishita.tech",
          "experience_level": "Mid-Level",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 12,
          "interests": [
            "Transformers",
            "Hugging Face",
            "Python",
            "Vector Search"
          ],
          "preset_avatar_id": "preset:dev-7",
          "professional_description": {
            "bio": "Deep learning practitioner working on state-of-the-art NLP models, embedding clustering, and domain adaptation.",
            "technical_interests": [
              "Parameter-efficient fine-tuning (LoRA/QLoRA)",
              "Semantic similarity matching",
              "Contextual summarization"
            ],
            "current_goals": "Developing semantic matching models for pairing developers with open-source project needs.",
            "collaboration_style": "Open notebook sharing, reproducible experimental pipelines, structured model documentation.",
            "target_projects": [
              "AI resume & skill analysers",
              "Intelligent search engines",
              "Code sentiment & review tools"
            ]
          },
          "skills": [
            "Python",
            "PyTorch",
            "Hugging Face",
            "FastAPI",
            "OpenAI API",
            "PostgreSQL"
          ]
        }
      }
    ],
    "messages": [
      {
        "id": "d3300000-0000-4000-e000-000000000200",
        "conversation_id": "d3300000-0000-4000-d000-000000000003",
        "sender_id": "d3300000-0000-4000-a000-000000000007",
        "content": "Hey Ishita, how is the embedding pipeline coming along for the resume analyzer?",
        "created_at": "2026-11-07T03:46:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000007",
          "username": "ishita.ml",
          "full_name": "Ishita Sen",
          "headline": "NLP & Deep Learning Engineer | Transformers & GenAI",
          "bio": "Building natural language understanding pipelines, custom embeddings, and conversational AI agents with Hugging Face & PyTorch.",
          "location": "Kolkata, India",
          "github_username": "ishita-sen",
          "website_url": "https://ishita.tech",
          "experience_level": "Mid-Level",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 12,
          "interests": [
            "Transformers",
            "Hugging Face",
            "Python",
            "Vector Search"
          ],
          "preset_avatar_id": "preset:dev-7",
          "professional_description": {
            "bio": "Deep learning practitioner working on state-of-the-art NLP models, embedding clustering, and domain adaptation.",
            "technical_interests": [
              "Parameter-efficient fine-tuning (LoRA/QLoRA)",
              "Semantic similarity matching",
              "Contextual summarization"
            ],
            "current_goals": "Developing semantic matching models for pairing developers with open-source project needs.",
            "collaboration_style": "Open notebook sharing, reproducible experimental pipelines, structured model documentation.",
            "target_projects": [
              "AI resume & skill analysers",
              "Intelligent search engines",
              "Code sentiment & review tools"
            ]
          },
          "skills": [
            "Python",
            "PyTorch",
            "Hugging Face",
            "FastAPI",
            "OpenAI API",
            "PostgreSQL"
          ]
        }
      },
      {
        "id": "d3300000-0000-4000-e000-000000000201",
        "conversation_id": "d3300000-0000-4000-d000-000000000003",
        "sender_id": "d3300000-0000-4000-a000-000000000007",
        "content": "Hey Rohan! I swapped in the new bge-large model. Top-3 recall jumped from 72% to 89% on our benchmark test dataset!",
        "created_at": "2026-11-07T04:06:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000007",
          "username": "ishita.ml",
          "full_name": "Ishita Sen",
          "headline": "NLP & Deep Learning Engineer | Transformers & GenAI",
          "bio": "Building natural language understanding pipelines, custom embeddings, and conversational AI agents with Hugging Face & PyTorch.",
          "location": "Kolkata, India",
          "github_username": "ishita-sen",
          "website_url": "https://ishita.tech",
          "experience_level": "Mid-Level",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 12,
          "interests": [
            "Transformers",
            "Hugging Face",
            "Python",
            "Vector Search"
          ],
          "preset_avatar_id": "preset:dev-7",
          "professional_description": {
            "bio": "Deep learning practitioner working on state-of-the-art NLP models, embedding clustering, and domain adaptation.",
            "technical_interests": [
              "Parameter-efficient fine-tuning (LoRA/QLoRA)",
              "Semantic similarity matching",
              "Contextual summarization"
            ],
            "current_goals": "Developing semantic matching models for pairing developers with open-source project needs.",
            "collaboration_style": "Open notebook sharing, reproducible experimental pipelines, structured model documentation.",
            "target_projects": [
              "AI resume & skill analysers",
              "Intelligent search engines",
              "Code sentiment & review tools"
            ]
          },
          "skills": [
            "Python",
            "PyTorch",
            "Hugging Face",
            "FastAPI",
            "OpenAI API",
            "PostgreSQL"
          ]
        }
      },
      {
        "id": "d3300000-0000-4000-e000-000000000202",
        "conversation_id": "d3300000-0000-4000-d000-000000000003",
        "sender_id": "d3300000-0000-4000-a000-000000000007",
        "content": "89% is huge. Are we within our 150ms latency SLA on CPU?",
        "created_at": "2026-11-07T04:26:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000007",
          "username": "ishita.ml",
          "full_name": "Ishita Sen",
          "headline": "NLP & Deep Learning Engineer | Transformers & GenAI",
          "bio": "Building natural language understanding pipelines, custom embeddings, and conversational AI agents with Hugging Face & PyTorch.",
          "location": "Kolkata, India",
          "github_username": "ishita-sen",
          "website_url": "https://ishita.tech",
          "experience_level": "Mid-Level",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 12,
          "interests": [
            "Transformers",
            "Hugging Face",
            "Python",
            "Vector Search"
          ],
          "preset_avatar_id": "preset:dev-7",
          "professional_description": {
            "bio": "Deep learning practitioner working on state-of-the-art NLP models, embedding clustering, and domain adaptation.",
            "technical_interests": [
              "Parameter-efficient fine-tuning (LoRA/QLoRA)",
              "Semantic similarity matching",
              "Contextual summarization"
            ],
            "current_goals": "Developing semantic matching models for pairing developers with open-source project needs.",
            "collaboration_style": "Open notebook sharing, reproducible experimental pipelines, structured model documentation.",
            "target_projects": [
              "AI resume & skill analysers",
              "Intelligent search engines",
              "Code sentiment & review tools"
            ]
          },
          "skills": [
            "Python",
            "PyTorch",
            "Hugging Face",
            "FastAPI",
            "OpenAI API",
            "PostgreSQL"
          ]
        }
      },
      {
        "id": "d3300000-0000-4000-e000-000000000203",
        "conversation_id": "d3300000-0000-4000-d000-000000000003",
        "sender_id": "d3300000-0000-4000-a000-000000000007",
        "content": "Yes, quantized it with ONNX Runtime. Running at ~85ms per document chunk now!",
        "created_at": "2026-11-07T04:46:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000007",
          "username": "ishita.ml",
          "full_name": "Ishita Sen",
          "headline": "NLP & Deep Learning Engineer | Transformers & GenAI",
          "bio": "Building natural language understanding pipelines, custom embeddings, and conversational AI agents with Hugging Face & PyTorch.",
          "location": "Kolkata, India",
          "github_username": "ishita-sen",
          "website_url": "https://ishita.tech",
          "experience_level": "Mid-Level",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 12,
          "interests": [
            "Transformers",
            "Hugging Face",
            "Python",
            "Vector Search"
          ],
          "preset_avatar_id": "preset:dev-7",
          "professional_description": {
            "bio": "Deep learning practitioner working on state-of-the-art NLP models, embedding clustering, and domain adaptation.",
            "technical_interests": [
              "Parameter-efficient fine-tuning (LoRA/QLoRA)",
              "Semantic similarity matching",
              "Contextual summarization"
            ],
            "current_goals": "Developing semantic matching models for pairing developers with open-source project needs.",
            "collaboration_style": "Open notebook sharing, reproducible experimental pipelines, structured model documentation.",
            "target_projects": [
              "AI resume & skill analysers",
              "Intelligent search engines",
              "Code sentiment & review tools"
            ]
          },
          "skills": [
            "Python",
            "PyTorch",
            "Hugging Face",
            "FastAPI",
            "OpenAI API",
            "PostgreSQL"
          ]
        }
      },
      {
        "id": "d3300000-0000-4000-e000-000000000204",
        "conversation_id": "d3300000-0000-4000-d000-000000000003",
        "sender_id": "d3300000-0000-4000-a000-000000000007",
        "content": "Outstanding work. Let us package the FastAPI endpoint and connect the DevConnect discovery cards.",
        "created_at": "2026-11-07T05:06:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000007",
          "username": "ishita.ml",
          "full_name": "Ishita Sen",
          "headline": "NLP & Deep Learning Engineer | Transformers & GenAI",
          "bio": "Building natural language understanding pipelines, custom embeddings, and conversational AI agents with Hugging Face & PyTorch.",
          "location": "Kolkata, India",
          "github_username": "ishita-sen",
          "website_url": "https://ishita.tech",
          "experience_level": "Mid-Level",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 12,
          "interests": [
            "Transformers",
            "Hugging Face",
            "Python",
            "Vector Search"
          ],
          "preset_avatar_id": "preset:dev-7",
          "professional_description": {
            "bio": "Deep learning practitioner working on state-of-the-art NLP models, embedding clustering, and domain adaptation.",
            "technical_interests": [
              "Parameter-efficient fine-tuning (LoRA/QLoRA)",
              "Semantic similarity matching",
              "Contextual summarization"
            ],
            "current_goals": "Developing semantic matching models for pairing developers with open-source project needs.",
            "collaboration_style": "Open notebook sharing, reproducible experimental pipelines, structured model documentation.",
            "target_projects": [
              "AI resume & skill analysers",
              "Intelligent search engines",
              "Code sentiment & review tools"
            ]
          },
          "skills": [
            "Python",
            "PyTorch",
            "Hugging Face",
            "FastAPI",
            "OpenAI API",
            "PostgreSQL"
          ]
        }
      }
    ],
    "last_message": {
      "id": "d3300000-0000-4000-e000-000000000204",
      "conversation_id": "d3300000-0000-4000-d000-000000000003",
      "sender_id": "d3300000-0000-4000-a000-000000000007",
      "content": "Outstanding work. Let us package the FastAPI endpoint and connect the DevConnect discovery cards.",
      "created_at": "2026-11-07T05:06:46.968Z",
      "sender": {
        "id": "d3300000-0000-4000-a000-000000000007",
        "username": "ishita.ml",
        "full_name": "Ishita Sen",
        "headline": "NLP & Deep Learning Engineer | Transformers & GenAI",
        "bio": "Building natural language understanding pipelines, custom embeddings, and conversational AI agents with Hugging Face & PyTorch.",
        "location": "Kolkata, India",
        "github_username": "ishita-sen",
        "website_url": "https://ishita.tech",
        "experience_level": "Mid-Level",
        "availability_status": "open_to_collaborate",
        "weekly_hours_available": 12,
        "interests": [
          "Transformers",
          "Hugging Face",
          "Python",
          "Vector Search"
        ],
        "preset_avatar_id": "preset:dev-7",
        "professional_description": {
          "bio": "Deep learning practitioner working on state-of-the-art NLP models, embedding clustering, and domain adaptation.",
          "technical_interests": [
            "Parameter-efficient fine-tuning (LoRA/QLoRA)",
            "Semantic similarity matching",
            "Contextual summarization"
          ],
          "current_goals": "Developing semantic matching models for pairing developers with open-source project needs.",
          "collaboration_style": "Open notebook sharing, reproducible experimental pipelines, structured model documentation.",
          "target_projects": [
            "AI resume & skill analysers",
            "Intelligent search engines",
            "Code sentiment & review tools"
          ]
        },
        "skills": [
          "Python",
          "PyTorch",
          "Hugging Face",
          "FastAPI",
          "OpenAI API",
          "PostgreSQL"
        ]
      }
    }
  },
  {
    "id": "d3300000-0000-4000-d000-000000000004",
    "type": "direct",
    "name": "Ananya Roy & Siddharth Rao",
    "members": [
      {
        "user_id": "d3300000-0000-4000-a000-000000000005",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000005",
          "username": "ananya.codes",
          "full_name": "Ananya Roy",
          "headline": "Cloud Native & Platform Engineer | Kubernetes & Helm",
          "bio": "Automating multi-cloud deployments, GitOps pipelines with ArgoCD, and maintaining 99.99% reliability for developer workloads.",
          "location": "Hyderabad, India",
          "github_username": "ananya-roy",
          "website_url": "https://ananya.cloud",
          "experience_level": "Senior",
          "availability_status": "busy",
          "weekly_hours_available": 8,
          "interests": [
            "Kubernetes",
            "Terraform",
            "CI/CD",
            "AWS",
            "Observability"
          ],
          "preset_avatar_id": "preset:dev-5",
          "professional_description": {
            "bio": "Platform engineer specializing in infrastructure-as-code, zero-trust cloud security, and resilient Kubernetes clusters.",
            "technical_interests": [
              "GitOps automation",
              "eBPF networking with Cilium",
              "OpenTelemetry observability stacks",
              "Cost optimization"
            ],
            "current_goals": "Building ephemeral preview environment platforms for fast pull-request testing.",
            "collaboration_style": "Terraform modules with strict PR linting, automated staging deployments, blameless post-mortems.",
            "target_projects": [
              "Developer platform orchestrators",
              "Cloud monitoring dashboards",
              "Automated CI/CD pipelines"
            ]
          },
          "skills": [
            "Kubernetes",
            "Docker",
            "AWS",
            "Google Cloud",
            "Terraform",
            "GitHub Actions",
            "Linux"
          ]
        }
      },
      {
        "user_id": "d3300000-0000-4000-a000-000000000012",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000012",
          "username": "siddharth.cloud",
          "full_name": "Siddharth Rao",
          "headline": "DevOps & SRE Engineer | Multi-Cloud & Observability",
          "bio": "Automating everything from bare metal to Kubernetes clusters. Prometheus, Grafana, and OpenTelemetry advocate.",
          "location": "Chennai, India",
          "github_username": "siddharth-cloud",
          "website_url": "https://siddharthrao.dev",
          "experience_level": "Mid-Level",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 12,
          "interests": [
            "DevOps",
            "Kubernetes",
            "Prometheus",
            "Grafana",
            "Docker"
          ],
          "preset_avatar_id": "preset:dev-12",
          "professional_description": {
            "bio": "Site Reliability Engineer dedicated to system resilience, automated incident response, and performance profiling.",
            "technical_interests": [
              "SLO/SLA tracking dashboards",
              "Prometheus metrics aggregation",
              "Zero-downtime rolling updates"
            ],
            "current_goals": "Implementing real-time health telemetry across multi-region services.",
            "collaboration_style": "Infrastructure-as-code reviews, automated smoke tests, operational readiness checklists.",
            "target_projects": [
              "Cloud monitoring dashboards",
              "API health monitoring platforms",
              "Automated deployment pipelines"
            ]
          },
          "skills": [
            "Docker",
            "Kubernetes",
            "Terraform",
            "Linux",
            "AWS",
            "GitHub Actions"
          ]
        }
      }
    ],
    "messages": [
      {
        "id": "d3300000-0000-4000-e000-000000000300",
        "conversation_id": "d3300000-0000-4000-d000-000000000004",
        "sender_id": "d3300000-0000-4000-a000-000000000012",
        "content": "Siddharth, Prometheus scrape intervals are set to 15s in the staging cluster.",
        "created_at": "2026-11-07T04:06:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000012",
          "username": "siddharth.cloud",
          "full_name": "Siddharth Rao",
          "headline": "DevOps & SRE Engineer | Multi-Cloud & Observability",
          "bio": "Automating everything from bare metal to Kubernetes clusters. Prometheus, Grafana, and OpenTelemetry advocate.",
          "location": "Chennai, India",
          "github_username": "siddharth-cloud",
          "website_url": "https://siddharthrao.dev",
          "experience_level": "Mid-Level",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 12,
          "interests": [
            "DevOps",
            "Kubernetes",
            "Prometheus",
            "Grafana",
            "Docker"
          ],
          "preset_avatar_id": "preset:dev-12",
          "professional_description": {
            "bio": "Site Reliability Engineer dedicated to system resilience, automated incident response, and performance profiling.",
            "technical_interests": [
              "SLO/SLA tracking dashboards",
              "Prometheus metrics aggregation",
              "Zero-downtime rolling updates"
            ],
            "current_goals": "Implementing real-time health telemetry across multi-region services.",
            "collaboration_style": "Infrastructure-as-code reviews, automated smoke tests, operational readiness checklists.",
            "target_projects": [
              "Cloud monitoring dashboards",
              "API health monitoring platforms",
              "Automated deployment pipelines"
            ]
          },
          "skills": [
            "Docker",
            "Kubernetes",
            "Terraform",
            "Linux",
            "AWS",
            "GitHub Actions"
          ]
        }
      },
      {
        "id": "d3300000-0000-4000-e000-000000000301",
        "conversation_id": "d3300000-0000-4000-d000-000000000004",
        "sender_id": "d3300000-0000-4000-a000-000000000012",
        "content": "Thanks Ananya. I noticed a small memory leak in the WebSocket proxy during load testing.",
        "created_at": "2026-11-07T04:26:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000012",
          "username": "siddharth.cloud",
          "full_name": "Siddharth Rao",
          "headline": "DevOps & SRE Engineer | Multi-Cloud & Observability",
          "bio": "Automating everything from bare metal to Kubernetes clusters. Prometheus, Grafana, and OpenTelemetry advocate.",
          "location": "Chennai, India",
          "github_username": "siddharth-cloud",
          "website_url": "https://siddharthrao.dev",
          "experience_level": "Mid-Level",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 12,
          "interests": [
            "DevOps",
            "Kubernetes",
            "Prometheus",
            "Grafana",
            "Docker"
          ],
          "preset_avatar_id": "preset:dev-12",
          "professional_description": {
            "bio": "Site Reliability Engineer dedicated to system resilience, automated incident response, and performance profiling.",
            "technical_interests": [
              "SLO/SLA tracking dashboards",
              "Prometheus metrics aggregation",
              "Zero-downtime rolling updates"
            ],
            "current_goals": "Implementing real-time health telemetry across multi-region services.",
            "collaboration_style": "Infrastructure-as-code reviews, automated smoke tests, operational readiness checklists.",
            "target_projects": [
              "Cloud monitoring dashboards",
              "API health monitoring platforms",
              "Automated deployment pipelines"
            ]
          },
          "skills": [
            "Docker",
            "Kubernetes",
            "Terraform",
            "Linux",
            "AWS",
            "GitHub Actions"
          ]
        }
      },
      {
        "id": "d3300000-0000-4000-e000-000000000302",
        "conversation_id": "d3300000-0000-4000-d000-000000000004",
        "sender_id": "d3300000-0000-4000-a000-000000000012",
        "content": "Good catch. Let us check the connection close handlers. I will push a patch branch.",
        "created_at": "2026-11-07T04:46:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000012",
          "username": "siddharth.cloud",
          "full_name": "Siddharth Rao",
          "headline": "DevOps & SRE Engineer | Multi-Cloud & Observability",
          "bio": "Automating everything from bare metal to Kubernetes clusters. Prometheus, Grafana, and OpenTelemetry advocate.",
          "location": "Chennai, India",
          "github_username": "siddharth-cloud",
          "website_url": "https://siddharthrao.dev",
          "experience_level": "Mid-Level",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 12,
          "interests": [
            "DevOps",
            "Kubernetes",
            "Prometheus",
            "Grafana",
            "Docker"
          ],
          "preset_avatar_id": "preset:dev-12",
          "professional_description": {
            "bio": "Site Reliability Engineer dedicated to system resilience, automated incident response, and performance profiling.",
            "technical_interests": [
              "SLO/SLA tracking dashboards",
              "Prometheus metrics aggregation",
              "Zero-downtime rolling updates"
            ],
            "current_goals": "Implementing real-time health telemetry across multi-region services.",
            "collaboration_style": "Infrastructure-as-code reviews, automated smoke tests, operational readiness checklists.",
            "target_projects": [
              "Cloud monitoring dashboards",
              "API health monitoring platforms",
              "Automated deployment pipelines"
            ]
          },
          "skills": [
            "Docker",
            "Kubernetes",
            "Terraform",
            "Linux",
            "AWS",
            "GitHub Actions"
          ]
        }
      },
      {
        "id": "d3300000-0000-4000-e000-000000000303",
        "conversation_id": "d3300000-0000-4000-d000-000000000004",
        "sender_id": "d3300000-0000-4000-a000-000000000012",
        "content": "Sounds good, will monitor the Grafana pod memory graph.",
        "created_at": "2026-11-07T05:06:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000012",
          "username": "siddharth.cloud",
          "full_name": "Siddharth Rao",
          "headline": "DevOps & SRE Engineer | Multi-Cloud & Observability",
          "bio": "Automating everything from bare metal to Kubernetes clusters. Prometheus, Grafana, and OpenTelemetry advocate.",
          "location": "Chennai, India",
          "github_username": "siddharth-cloud",
          "website_url": "https://siddharthrao.dev",
          "experience_level": "Mid-Level",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 12,
          "interests": [
            "DevOps",
            "Kubernetes",
            "Prometheus",
            "Grafana",
            "Docker"
          ],
          "preset_avatar_id": "preset:dev-12",
          "professional_description": {
            "bio": "Site Reliability Engineer dedicated to system resilience, automated incident response, and performance profiling.",
            "technical_interests": [
              "SLO/SLA tracking dashboards",
              "Prometheus metrics aggregation",
              "Zero-downtime rolling updates"
            ],
            "current_goals": "Implementing real-time health telemetry across multi-region services.",
            "collaboration_style": "Infrastructure-as-code reviews, automated smoke tests, operational readiness checklists.",
            "target_projects": [
              "Cloud monitoring dashboards",
              "API health monitoring platforms",
              "Automated deployment pipelines"
            ]
          },
          "skills": [
            "Docker",
            "Kubernetes",
            "Terraform",
            "Linux",
            "AWS",
            "GitHub Actions"
          ]
        }
      }
    ],
    "last_message": {
      "id": "d3300000-0000-4000-e000-000000000303",
      "conversation_id": "d3300000-0000-4000-d000-000000000004",
      "sender_id": "d3300000-0000-4000-a000-000000000012",
      "content": "Sounds good, will monitor the Grafana pod memory graph.",
      "created_at": "2026-11-07T05:06:46.968Z",
      "sender": {
        "id": "d3300000-0000-4000-a000-000000000012",
        "username": "siddharth.cloud",
        "full_name": "Siddharth Rao",
        "headline": "DevOps & SRE Engineer | Multi-Cloud & Observability",
        "bio": "Automating everything from bare metal to Kubernetes clusters. Prometheus, Grafana, and OpenTelemetry advocate.",
        "location": "Chennai, India",
        "github_username": "siddharth-cloud",
        "website_url": "https://siddharthrao.dev",
        "experience_level": "Mid-Level",
        "availability_status": "open_to_collaborate",
        "weekly_hours_available": 12,
        "interests": [
          "DevOps",
          "Kubernetes",
          "Prometheus",
          "Grafana",
          "Docker"
        ],
        "preset_avatar_id": "preset:dev-12",
        "professional_description": {
          "bio": "Site Reliability Engineer dedicated to system resilience, automated incident response, and performance profiling.",
          "technical_interests": [
            "SLO/SLA tracking dashboards",
            "Prometheus metrics aggregation",
            "Zero-downtime rolling updates"
          ],
          "current_goals": "Implementing real-time health telemetry across multi-region services.",
          "collaboration_style": "Infrastructure-as-code reviews, automated smoke tests, operational readiness checklists.",
          "target_projects": [
            "Cloud monitoring dashboards",
            "API health monitoring platforms",
            "Automated deployment pipelines"
          ]
        },
        "skills": [
          "Docker",
          "Kubernetes",
          "Terraform",
          "Linux",
          "AWS",
          "GitHub Actions"
        ]
      }
    }
  },
  {
    "id": "d3300000-0000-4000-d000-000000000005",
    "type": "direct",
    "name": "Meera Nair & Nikhil Deshmukh",
    "members": [
      {
        "user_id": "d3300000-0000-4000-a000-000000000002",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000002",
          "username": "dev_meera",
          "full_name": "Meera Nair",
          "headline": "Lead Frontend Engineer | UI/UX & Design Systems",
          "bio": "Obsessed with fluid micro-interactions, accessible UI architecture, and modern WebGL canvases. Linear & Vercel design aesthetic enthusiast.",
          "location": "Mumbai, India",
          "github_username": "meera-nair",
          "website_url": "https://meera.design",
          "experience_level": "Lead",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 12,
          "interests": [
            "Design Systems",
            "React",
            "Framer Motion",
            "Tailwind CSS",
            "Web Performance"
          ],
          "preset_avatar_id": "preset:dev-2",
          "professional_description": {
            "bio": "Design systems engineer crafting pixel-perfect, accessible component libraries and high-performance React frontends.",
            "technical_interests": [
              "Design tokens & Tailwind orchestration",
              "Complex animation choreographies with Framer Motion",
              "Accessible ARIA patterns"
            ],
            "current_goals": "Building frictionless developer tool interfaces with sub-100ms interaction latencies.",
            "collaboration_style": "Pair programming on critical components, Figma tokens-to-code workflow, proactive UI reviews.",
            "target_projects": [
              "Dark-mode first developer SaaS dashboards",
              "Interactive canvas applications",
              "Component design libraries"
            ]
          },
          "skills": [
            "React",
            "TypeScript",
            "Next.js",
            "Tailwind CSS",
            "Figma",
            "WebSockets"
          ]
        }
      },
      {
        "user_id": "d3300000-0000-4000-a000-000000000008",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000008",
          "username": "nikhilcreates",
          "full_name": "Nikhil Deshmukh",
          "headline": "Creative Developer & UI/UX Designer | 3D & WebGL",
          "bio": "Bridging design and code. Creating tactile interfaces, 3D web experiences, and micro-interactions that make software feel alive.",
          "location": "Bengaluru, India",
          "github_username": "nikhil-deshmukh",
          "website_url": "https://nikhil.design",
          "experience_level": "Senior",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 14,
          "interests": [
            "UI/UX",
            "Three.js",
            "Figma",
            "Framer Motion",
            "Tailwind CSS"
          ],
          "preset_avatar_id": "preset:dev-8",
          "professional_description": {
            "bio": "Creative technologist with 5+ years crafting distinct visual identities and interactive digital experiences.",
            "technical_interests": [
              "Interactive shader art",
              "High-contrast typography systems",
              "Haptic feedback in web interfaces"
            ],
            "current_goals": "Redefining developer tools to possess the aesthetic refinement of editorial publications.",
            "collaboration_style": "Figma-first design exploration followed by high-fidelity React implementation and polish passes.",
            "target_projects": [
              "Editorial developer blogs",
              "Interactive documentation portals",
              "Creative portfolio builders"
            ]
          },
          "skills": [
            "Figma",
            "React",
            "TypeScript",
            "Tailwind CSS",
            "JavaScript"
          ]
        }
      }
    ],
    "messages": [
      {
        "id": "d3300000-0000-4000-e000-000000000400",
        "conversation_id": "d3300000-0000-4000-d000-000000000005",
        "sender_id": "d3300000-0000-4000-a000-000000000008",
        "content": "Nikhil, love the new editorial dossier card styling!",
        "created_at": "2026-11-07T04:06:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000008",
          "username": "nikhilcreates",
          "full_name": "Nikhil Deshmukh",
          "headline": "Creative Developer & UI/UX Designer | 3D & WebGL",
          "bio": "Bridging design and code. Creating tactile interfaces, 3D web experiences, and micro-interactions that make software feel alive.",
          "location": "Bengaluru, India",
          "github_username": "nikhil-deshmukh",
          "website_url": "https://nikhil.design",
          "experience_level": "Senior",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 14,
          "interests": [
            "UI/UX",
            "Three.js",
            "Figma",
            "Framer Motion",
            "Tailwind CSS"
          ],
          "preset_avatar_id": "preset:dev-8",
          "professional_description": {
            "bio": "Creative technologist with 5+ years crafting distinct visual identities and interactive digital experiences.",
            "technical_interests": [
              "Interactive shader art",
              "High-contrast typography systems",
              "Haptic feedback in web interfaces"
            ],
            "current_goals": "Redefining developer tools to possess the aesthetic refinement of editorial publications.",
            "collaboration_style": "Figma-first design exploration followed by high-fidelity React implementation and polish passes.",
            "target_projects": [
              "Editorial developer blogs",
              "Interactive documentation portals",
              "Creative portfolio builders"
            ]
          },
          "skills": [
            "Figma",
            "React",
            "TypeScript",
            "Tailwind CSS",
            "JavaScript"
          ]
        }
      },
      {
        "id": "d3300000-0000-4000-e000-000000000401",
        "conversation_id": "d3300000-0000-4000-d000-000000000005",
        "sender_id": "d3300000-0000-4000-a000-000000000008",
        "content": "Thanks Meera! Space Grotesk headings with fine 1px borders really gives that premium editorial SaaS vibe.",
        "created_at": "2026-11-07T04:26:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000008",
          "username": "nikhilcreates",
          "full_name": "Nikhil Deshmukh",
          "headline": "Creative Developer & UI/UX Designer | 3D & WebGL",
          "bio": "Bridging design and code. Creating tactile interfaces, 3D web experiences, and micro-interactions that make software feel alive.",
          "location": "Bengaluru, India",
          "github_username": "nikhil-deshmukh",
          "website_url": "https://nikhil.design",
          "experience_level": "Senior",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 14,
          "interests": [
            "UI/UX",
            "Three.js",
            "Figma",
            "Framer Motion",
            "Tailwind CSS"
          ],
          "preset_avatar_id": "preset:dev-8",
          "professional_description": {
            "bio": "Creative technologist with 5+ years crafting distinct visual identities and interactive digital experiences.",
            "technical_interests": [
              "Interactive shader art",
              "High-contrast typography systems",
              "Haptic feedback in web interfaces"
            ],
            "current_goals": "Redefining developer tools to possess the aesthetic refinement of editorial publications.",
            "collaboration_style": "Figma-first design exploration followed by high-fidelity React implementation and polish passes.",
            "target_projects": [
              "Editorial developer blogs",
              "Interactive documentation portals",
              "Creative portfolio builders"
            ]
          },
          "skills": [
            "Figma",
            "React",
            "TypeScript",
            "Tailwind CSS",
            "JavaScript"
          ]
        }
      },
      {
        "id": "d3300000-0000-4000-e000-000000000402",
        "conversation_id": "d3300000-0000-4000-d000-000000000005",
        "sender_id": "d3300000-0000-4000-a000-000000000008",
        "content": "Totally agree. Make sure the radial spotlight hover effect on CardSpotlight maintains the 60fps frame rate.",
        "created_at": "2026-11-07T04:46:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000008",
          "username": "nikhilcreates",
          "full_name": "Nikhil Deshmukh",
          "headline": "Creative Developer & UI/UX Designer | 3D & WebGL",
          "bio": "Bridging design and code. Creating tactile interfaces, 3D web experiences, and micro-interactions that make software feel alive.",
          "location": "Bengaluru, India",
          "github_username": "nikhil-deshmukh",
          "website_url": "https://nikhil.design",
          "experience_level": "Senior",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 14,
          "interests": [
            "UI/UX",
            "Three.js",
            "Figma",
            "Framer Motion",
            "Tailwind CSS"
          ],
          "preset_avatar_id": "preset:dev-8",
          "professional_description": {
            "bio": "Creative technologist with 5+ years crafting distinct visual identities and interactive digital experiences.",
            "technical_interests": [
              "Interactive shader art",
              "High-contrast typography systems",
              "Haptic feedback in web interfaces"
            ],
            "current_goals": "Redefining developer tools to possess the aesthetic refinement of editorial publications.",
            "collaboration_style": "Figma-first design exploration followed by high-fidelity React implementation and polish passes.",
            "target_projects": [
              "Editorial developer blogs",
              "Interactive documentation portals",
              "Creative portfolio builders"
            ]
          },
          "skills": [
            "Figma",
            "React",
            "TypeScript",
            "Tailwind CSS",
            "JavaScript"
          ]
        }
      },
      {
        "id": "d3300000-0000-4000-e000-000000000403",
        "conversation_id": "d3300000-0000-4000-d000-000000000005",
        "sender_id": "d3300000-0000-4000-a000-000000000008",
        "content": "Tested on both Chrome and Safari—zero layout thrashing.",
        "created_at": "2026-11-07T05:06:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000008",
          "username": "nikhilcreates",
          "full_name": "Nikhil Deshmukh",
          "headline": "Creative Developer & UI/UX Designer | 3D & WebGL",
          "bio": "Bridging design and code. Creating tactile interfaces, 3D web experiences, and micro-interactions that make software feel alive.",
          "location": "Bengaluru, India",
          "github_username": "nikhil-deshmukh",
          "website_url": "https://nikhil.design",
          "experience_level": "Senior",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 14,
          "interests": [
            "UI/UX",
            "Three.js",
            "Figma",
            "Framer Motion",
            "Tailwind CSS"
          ],
          "preset_avatar_id": "preset:dev-8",
          "professional_description": {
            "bio": "Creative technologist with 5+ years crafting distinct visual identities and interactive digital experiences.",
            "technical_interests": [
              "Interactive shader art",
              "High-contrast typography systems",
              "Haptic feedback in web interfaces"
            ],
            "current_goals": "Redefining developer tools to possess the aesthetic refinement of editorial publications.",
            "collaboration_style": "Figma-first design exploration followed by high-fidelity React implementation and polish passes.",
            "target_projects": [
              "Editorial developer blogs",
              "Interactive documentation portals",
              "Creative portfolio builders"
            ]
          },
          "skills": [
            "Figma",
            "React",
            "TypeScript",
            "Tailwind CSS",
            "JavaScript"
          ]
        }
      }
    ],
    "last_message": {
      "id": "d3300000-0000-4000-e000-000000000403",
      "conversation_id": "d3300000-0000-4000-d000-000000000005",
      "sender_id": "d3300000-0000-4000-a000-000000000008",
      "content": "Tested on both Chrome and Safari—zero layout thrashing.",
      "created_at": "2026-11-07T05:06:46.968Z",
      "sender": {
        "id": "d3300000-0000-4000-a000-000000000008",
        "username": "nikhilcreates",
        "full_name": "Nikhil Deshmukh",
        "headline": "Creative Developer & UI/UX Designer | 3D & WebGL",
        "bio": "Bridging design and code. Creating tactile interfaces, 3D web experiences, and micro-interactions that make software feel alive.",
        "location": "Bengaluru, India",
        "github_username": "nikhil-deshmukh",
        "website_url": "https://nikhil.design",
        "experience_level": "Senior",
        "availability_status": "open_to_collaborate",
        "weekly_hours_available": 14,
        "interests": [
          "UI/UX",
          "Three.js",
          "Figma",
          "Framer Motion",
          "Tailwind CSS"
        ],
        "preset_avatar_id": "preset:dev-8",
        "professional_description": {
          "bio": "Creative technologist with 5+ years crafting distinct visual identities and interactive digital experiences.",
          "technical_interests": [
            "Interactive shader art",
            "High-contrast typography systems",
            "Haptic feedback in web interfaces"
          ],
          "current_goals": "Redefining developer tools to possess the aesthetic refinement of editorial publications.",
          "collaboration_style": "Figma-first design exploration followed by high-fidelity React implementation and polish passes.",
          "target_projects": [
            "Editorial developer blogs",
            "Interactive documentation portals",
            "Creative portfolio builders"
          ]
        },
        "skills": [
          "Figma",
          "React",
          "TypeScript",
          "Tailwind CSS",
          "JavaScript"
        ]
      }
    }
  },
  {
    "id": "d3300000-0000-4000-d000-000000000006",
    "type": "direct",
    "name": "Kavya Iyer & Aditya Joshi",
    "members": [
      {
        "user_id": "d3300000-0000-4000-a000-000000000009",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000009",
          "username": "kavya.dev",
          "full_name": "Kavya Iyer",
          "headline": "Backend Infrastructure Engineer | Go, gRPC & Kafka",
          "bio": "Designing high-volume streaming architectures, distributed event buses, and resilient API gateways in Go and PostgreSQL.",
          "location": "Kochi, India",
          "github_username": "kavya-iyer",
          "website_url": "https://kavyaiyer.io",
          "experience_level": "Lead",
          "availability_status": "available",
          "weekly_hours_available": 18,
          "interests": [
            "Go",
            "Kafka",
            "gRPC",
            "Database Internals"
          ],
          "preset_avatar_id": "preset:dev-9",
          "professional_description": {
            "bio": "Infrastructure and backend specialist with a track record of scaling distributed backends past 100k requests/second.",
            "technical_interests": [
              "Event-driven systems (Kafka/RabbitMQ)",
              "Postgres query planner tuning",
              "Strict contract-driven gRPC APIs"
            ],
            "current_goals": "Mentoring junior developers and architecting open source backends for collaborative tooling.",
            "collaboration_style": "Thorough code reviews with benchmark comparisons, detailed system schematics, clear milestone roadmaps.",
            "target_projects": [
              "Real-time messaging engines",
              "API monitoring & telemetry services",
              "Event-sourced task platforms"
            ]
          },
          "skills": [
            "Go",
            "PostgreSQL",
            "Redis",
            "Docker",
            "Linux",
            "REST APIs",
            "WebSockets"
          ]
        }
      },
      {
        "user_id": "d3300000-0000-4000-a000-000000000010",
        "profile": {
          "id": "d3300000-0000-4000-a000-000000000010",
          "username": "adityastacks",
          "full_name": "Aditya Joshi",
          "headline": "Cybersecurity Engineer & AppSec Specialist",
          "bio": "Securing cloud applications, hardening authentication workflows, and performing vulnerability assessments and penetration testing.",
          "location": "Ahmedabad, India",
          "github_username": "aditya-sec",
          "website_url": "https://adityajoshi.security",
          "experience_level": "Senior",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 10,
          "interests": [
            "Cybersecurity",
            "OAuth2",
            "Zero Trust",
            "AppSec",
            "Linux"
          ],
          "preset_avatar_id": "preset:dev-10",
          "professional_description": {
            "bio": "Information security engineer focused on defending web applications against modern threat vectors and API vulnerabilities.",
            "technical_interests": [
              "OAuth 2.1 / OIDC protocols",
              "Postgres RLS security audits",
              "Automated SAST/DAST in CI/CD pipelines"
            ],
            "current_goals": "Building secure-by-default developer templates and open-source compliance checkers.",
            "collaboration_style": "Security threat modeling during design phase, peer review of sensitive auth paths, defensive coding standards.",
            "target_projects": [
              "Cybersecurity monitoring tools",
              "Identity & access management modules",
              "API penetration testing suites"
            ]
          },
          "skills": [
            "Python",
            "Linux",
            "Docker",
            "PostgreSQL",
            "REST APIs",
            "Git"
          ]
        }
      }
    ],
    "messages": [
      {
        "id": "d3300000-0000-4000-e000-000000000500",
        "conversation_id": "d3300000-0000-4000-d000-000000000006",
        "sender_id": "d3300000-0000-4000-a000-000000000010",
        "content": "Aditya, we need to ensure the Supabase Realtime channels validate user session JWTs properly.",
        "created_at": "2026-11-07T04:06:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000010",
          "username": "adityastacks",
          "full_name": "Aditya Joshi",
          "headline": "Cybersecurity Engineer & AppSec Specialist",
          "bio": "Securing cloud applications, hardening authentication workflows, and performing vulnerability assessments and penetration testing.",
          "location": "Ahmedabad, India",
          "github_username": "aditya-sec",
          "website_url": "https://adityajoshi.security",
          "experience_level": "Senior",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 10,
          "interests": [
            "Cybersecurity",
            "OAuth2",
            "Zero Trust",
            "AppSec",
            "Linux"
          ],
          "preset_avatar_id": "preset:dev-10",
          "professional_description": {
            "bio": "Information security engineer focused on defending web applications against modern threat vectors and API vulnerabilities.",
            "technical_interests": [
              "OAuth 2.1 / OIDC protocols",
              "Postgres RLS security audits",
              "Automated SAST/DAST in CI/CD pipelines"
            ],
            "current_goals": "Building secure-by-default developer templates and open-source compliance checkers.",
            "collaboration_style": "Security threat modeling during design phase, peer review of sensitive auth paths, defensive coding standards.",
            "target_projects": [
              "Cybersecurity monitoring tools",
              "Identity & access management modules",
              "API penetration testing suites"
            ]
          },
          "skills": [
            "Python",
            "Linux",
            "Docker",
            "PostgreSQL",
            "REST APIs",
            "Git"
          ]
        }
      },
      {
        "id": "d3300000-0000-4000-e000-000000000501",
        "conversation_id": "d3300000-0000-4000-d000-000000000006",
        "sender_id": "d3300000-0000-4000-a000-000000000010",
        "content": "Already on it! Audited the PostgreSQL RLS policies. Direct message tables only allow authenticated participants.",
        "created_at": "2026-11-07T04:26:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000010",
          "username": "adityastacks",
          "full_name": "Aditya Joshi",
          "headline": "Cybersecurity Engineer & AppSec Specialist",
          "bio": "Securing cloud applications, hardening authentication workflows, and performing vulnerability assessments and penetration testing.",
          "location": "Ahmedabad, India",
          "github_username": "aditya-sec",
          "website_url": "https://adityajoshi.security",
          "experience_level": "Senior",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 10,
          "interests": [
            "Cybersecurity",
            "OAuth2",
            "Zero Trust",
            "AppSec",
            "Linux"
          ],
          "preset_avatar_id": "preset:dev-10",
          "professional_description": {
            "bio": "Information security engineer focused on defending web applications against modern threat vectors and API vulnerabilities.",
            "technical_interests": [
              "OAuth 2.1 / OIDC protocols",
              "Postgres RLS security audits",
              "Automated SAST/DAST in CI/CD pipelines"
            ],
            "current_goals": "Building secure-by-default developer templates and open-source compliance checkers.",
            "collaboration_style": "Security threat modeling during design phase, peer review of sensitive auth paths, defensive coding standards.",
            "target_projects": [
              "Cybersecurity monitoring tools",
              "Identity & access management modules",
              "API penetration testing suites"
            ]
          },
          "skills": [
            "Python",
            "Linux",
            "Docker",
            "PostgreSQL",
            "REST APIs",
            "Git"
          ]
        }
      },
      {
        "id": "d3300000-0000-4000-e000-000000000502",
        "conversation_id": "d3300000-0000-4000-d000-000000000006",
        "sender_id": "d3300000-0000-4000-a000-000000000010",
        "content": "Perfect. We cannot have messages leaking between demo channels and real users.",
        "created_at": "2026-11-07T04:46:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000010",
          "username": "adityastacks",
          "full_name": "Aditya Joshi",
          "headline": "Cybersecurity Engineer & AppSec Specialist",
          "bio": "Securing cloud applications, hardening authentication workflows, and performing vulnerability assessments and penetration testing.",
          "location": "Ahmedabad, India",
          "github_username": "aditya-sec",
          "website_url": "https://adityajoshi.security",
          "experience_level": "Senior",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 10,
          "interests": [
            "Cybersecurity",
            "OAuth2",
            "Zero Trust",
            "AppSec",
            "Linux"
          ],
          "preset_avatar_id": "preset:dev-10",
          "professional_description": {
            "bio": "Information security engineer focused on defending web applications against modern threat vectors and API vulnerabilities.",
            "technical_interests": [
              "OAuth 2.1 / OIDC protocols",
              "Postgres RLS security audits",
              "Automated SAST/DAST in CI/CD pipelines"
            ],
            "current_goals": "Building secure-by-default developer templates and open-source compliance checkers.",
            "collaboration_style": "Security threat modeling during design phase, peer review of sensitive auth paths, defensive coding standards.",
            "target_projects": [
              "Cybersecurity monitoring tools",
              "Identity & access management modules",
              "API penetration testing suites"
            ]
          },
          "skills": [
            "Python",
            "Linux",
            "Docker",
            "PostgreSQL",
            "REST APIs",
            "Git"
          ]
        }
      },
      {
        "id": "d3300000-0000-4000-e000-000000000503",
        "conversation_id": "d3300000-0000-4000-d000-000000000006",
        "sender_id": "d3300000-0000-4000-a000-000000000010",
        "content": "Everything is isolated under the demo partition with strict auth.uid() checks.",
        "created_at": "2026-11-07T05:06:46.968Z",
        "sender": {
          "id": "d3300000-0000-4000-a000-000000000010",
          "username": "adityastacks",
          "full_name": "Aditya Joshi",
          "headline": "Cybersecurity Engineer & AppSec Specialist",
          "bio": "Securing cloud applications, hardening authentication workflows, and performing vulnerability assessments and penetration testing.",
          "location": "Ahmedabad, India",
          "github_username": "aditya-sec",
          "website_url": "https://adityajoshi.security",
          "experience_level": "Senior",
          "availability_status": "open_to_collaborate",
          "weekly_hours_available": 10,
          "interests": [
            "Cybersecurity",
            "OAuth2",
            "Zero Trust",
            "AppSec",
            "Linux"
          ],
          "preset_avatar_id": "preset:dev-10",
          "professional_description": {
            "bio": "Information security engineer focused on defending web applications against modern threat vectors and API vulnerabilities.",
            "technical_interests": [
              "OAuth 2.1 / OIDC protocols",
              "Postgres RLS security audits",
              "Automated SAST/DAST in CI/CD pipelines"
            ],
            "current_goals": "Building secure-by-default developer templates and open-source compliance checkers.",
            "collaboration_style": "Security threat modeling during design phase, peer review of sensitive auth paths, defensive coding standards.",
            "target_projects": [
              "Cybersecurity monitoring tools",
              "Identity & access management modules",
              "API penetration testing suites"
            ]
          },
          "skills": [
            "Python",
            "Linux",
            "Docker",
            "PostgreSQL",
            "REST APIs",
            "Git"
          ]
        }
      }
    ],
    "last_message": {
      "id": "d3300000-0000-4000-e000-000000000503",
      "conversation_id": "d3300000-0000-4000-d000-000000000006",
      "sender_id": "d3300000-0000-4000-a000-000000000010",
      "content": "Everything is isolated under the demo partition with strict auth.uid() checks.",
      "created_at": "2026-11-07T05:06:46.968Z",
      "sender": {
        "id": "d3300000-0000-4000-a000-000000000010",
        "username": "adityastacks",
        "full_name": "Aditya Joshi",
        "headline": "Cybersecurity Engineer & AppSec Specialist",
        "bio": "Securing cloud applications, hardening authentication workflows, and performing vulnerability assessments and penetration testing.",
        "location": "Ahmedabad, India",
        "github_username": "aditya-sec",
        "website_url": "https://adityajoshi.security",
        "experience_level": "Senior",
        "availability_status": "open_to_collaborate",
        "weekly_hours_available": 10,
        "interests": [
          "Cybersecurity",
          "OAuth2",
          "Zero Trust",
          "AppSec",
          "Linux"
        ],
        "preset_avatar_id": "preset:dev-10",
        "professional_description": {
          "bio": "Information security engineer focused on defending web applications against modern threat vectors and API vulnerabilities.",
          "technical_interests": [
            "OAuth 2.1 / OIDC protocols",
            "Postgres RLS security audits",
            "Automated SAST/DAST in CI/CD pipelines"
          ],
          "current_goals": "Building secure-by-default developer templates and open-source compliance checkers.",
          "collaboration_style": "Security threat modeling during design phase, peer review of sensitive auth paths, defensive coding standards.",
          "target_projects": [
            "Cybersecurity monitoring tools",
            "Identity & access management modules",
            "API penetration testing suites"
          ]
        },
        "skills": [
          "Python",
          "Linux",
          "Docker",
          "PostgreSQL",
          "REST APIs",
          "Git"
        ]
      }
    }
  }
];
