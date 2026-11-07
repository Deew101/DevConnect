// DevConnect Demo Community Seed Generator
// Generates idempotent, safe, interconnected SQL and TypeScript datasets

const fs = require('fs');
const path = require('path');

const profiles = [
  {
    id: 'd3300000-0000-4000-a000-000000000001',
    username: 'arjun.codes',
    full_name: 'Arjun Patel',
    headline: 'Senior Full-Stack Architect | Distributed Systems & Go',
    bio: 'Passionate about distributed microservices, event streams, and building developer-first developer tooling. Open source advocate.',
    location: 'Bangalore, India',
    github_username: 'arjun-patel',
    website_url: 'https://arjunpatel.dev',
    experience_level: 'Senior',
    availability_status: 'open_to_collaborate',
    weekly_hours_available: 15,
    interests: ['Distributed Systems', 'Go', 'Microservices', 'Kubernetes'],
    preset_avatar_id: 'preset:dev-1',
    professional_description: {
      bio: 'Full-stack software architect with 6+ years shipping high-throughput backends and reactive React frontends.',
      technical_interests: ['Distributed consensus (Raft/Paxos)', 'High-concurrency Go services', 'Rust for systems programming', 'Edge computing'],
      current_goals: 'Architecting fault-tolerant task orchestrators and mentoring early-career engineers in distributed systems.',
      collaboration_style: 'Async-first, documented PRs, clear architecture decision records (ADRs), weekly sprint sync.',
      target_projects: ['Developer infrastructure tools', 'Real-time telemetry platforms', 'Open-source distributed databases']
    },
    skills: ['Go', 'TypeScript', 'PostgreSQL', 'Docker', 'Kubernetes', 'Redis', 'React', 'REST APIs']
  },
  {
    id: 'd3300000-0000-4000-a000-000000000002',
    username: 'dev_meera',
    full_name: 'Meera Nair',
    headline: 'Lead Frontend Engineer | UI/UX & Design Systems',
    bio: 'Obsessed with fluid micro-interactions, accessible UI architecture, and modern WebGL canvases. Linear & Vercel design aesthetic enthusiast.',
    location: 'Mumbai, India',
    github_username: 'meera-nair',
    website_url: 'https://meera.design',
    experience_level: 'Lead',
    availability_status: 'open_to_collaborate',
    weekly_hours_available: 12,
    interests: ['Design Systems', 'React', 'Framer Motion', 'Tailwind CSS', 'Web Performance'],
    preset_avatar_id: 'preset:dev-2',
    professional_description: {
      bio: 'Design systems engineer crafting pixel-perfect, accessible component libraries and high-performance React frontends.',
      technical_interests: ['Design tokens & Tailwind orchestration', 'Complex animation choreographies with Framer Motion', 'Accessible ARIA patterns'],
      current_goals: 'Building frictionless developer tool interfaces with sub-100ms interaction latencies.',
      collaboration_style: 'Pair programming on critical components, Figma tokens-to-code workflow, proactive UI reviews.',
      target_projects: ['Dark-mode first developer SaaS dashboards', 'Interactive canvas applications', 'Component design libraries']
    },
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Figma', 'WebSockets']
  },
  {
    id: 'd3300000-0000-4000-a000-000000000003',
    username: 'harshitbuilds',
    full_name: 'Harshit Sharma',
    headline: 'Systems Engineer | Rust, WebAssembly & Low Latency',
    bio: 'Compiling Rust to Wasm, optimizing memory layouts, and building ultra-fast developer platforms with zero-cost abstractions.',
    location: 'Delhi NCR, India',
    github_username: 'harshit-builds',
    website_url: 'https://harshit.systems',
    experience_level: 'Senior',
    availability_status: 'available',
    weekly_hours_available: 20,
    interests: ['Rust', 'WebAssembly', 'Performance', 'Compilers'],
    preset_avatar_id: 'preset:dev-3',
    professional_description: {
      bio: 'Systems programmer focused on high-throughput services, Wasm runtimes, and concurrent network protocols in Rust.',
      technical_interests: ['Tokio async runtimes', 'SIMD optimizations', 'Zero-copy serialization (FlatBuffers)', 'Cross-compilation'],
      current_goals: 'Creating blazing-fast edge processing engines that run seamlessly in browser and cloud.',
      collaboration_style: 'Benchmark-driven development, comprehensive integration tests, async GitHub reviews.',
      target_projects: ['Wasm-powered client runtime engines', 'Edge compute proxies', 'Distributed cache clusters']
    },
    skills: ['Rust', 'C++', 'Linux', 'Docker', 'WebSockets', 'PostgreSQL']
  },
  {
    id: 'd3300000-0000-4000-a000-000000000004',
    username: 'rohanxdev',
    full_name: 'Rohan Mehta',
    headline: 'AI/ML Researcher & LLM Orchestration Engineer',
    bio: 'Fine-tuning open weights models, building agentic reasoning workflows, and optimizing vector search pipelines with LangChain & PyTorch.',
    location: 'Pune, India',
    github_username: 'rohan-mehta',
    website_url: 'https://rohanmehta.ai',
    experience_level: 'Mid-Level',
    availability_status: 'open_to_collaborate',
    weekly_hours_available: 10,
    interests: ['AI Agents', 'PyTorch', 'Vector Databases', 'LangChain'],
    preset_avatar_id: 'preset:dev-4',
    professional_description: {
      bio: 'Machine learning specialist developing production RAG systems, model evaluation harnesses, and multi-agent systems.',
      technical_interests: ['Quantized LLM deployment (GGUF/vLLM)', 'Hierarchical RAG architectures', 'Tool-calling agents'],
      current_goals: 'Fine-tuning specialized coding assistant models and building autonomous pair-programming pipelines.',
      collaboration_style: 'Experiment notebooks with clear metrics, reproducible validation sets, weekly sprint check-ins.',
      target_projects: ['AI code reviewers', 'Automated developer matchmaking engines', 'Semantic code search']
    },
    skills: ['Python', 'PyTorch', 'OpenAI API', 'Gemini API', 'LangChain', 'FastAPI', 'PostgreSQL']
  },
  {
    id: 'd3300000-0000-4000-a000-000000000005',
    username: 'ananya.codes',
    full_name: 'Ananya Roy',
    headline: 'Cloud Native & Platform Engineer | Kubernetes & Helm',
    bio: 'Automating multi-cloud deployments, GitOps pipelines with ArgoCD, and maintaining 99.99% reliability for developer workloads.',
    location: 'Hyderabad, India',
    github_username: 'ananya-roy',
    website_url: 'https://ananya.cloud',
    experience_level: 'Senior',
    availability_status: 'busy',
    weekly_hours_available: 8,
    interests: ['Kubernetes', 'Terraform', 'CI/CD', 'AWS', 'Observability'],
    preset_avatar_id: 'preset:dev-5',
    professional_description: {
      bio: 'Platform engineer specializing in infrastructure-as-code, zero-trust cloud security, and resilient Kubernetes clusters.',
      technical_interests: ['GitOps automation', 'eBPF networking with Cilium', 'OpenTelemetry observability stacks', 'Cost optimization'],
      current_goals: 'Building ephemeral preview environment platforms for fast pull-request testing.',
      collaboration_style: 'Terraform modules with strict PR linting, automated staging deployments, blameless post-mortems.',
      target_projects: ['Developer platform orchestrators', 'Cloud monitoring dashboards', 'Automated CI/CD pipelines']
    },
    skills: ['Kubernetes', 'Docker', 'AWS', 'Google Cloud', 'Terraform', 'GitHub Actions', 'Linux']
  },
  {
    id: 'd3300000-0000-4000-a000-000000000006',
    username: 'akash_fullstack',
    full_name: 'Akash Verma',
    headline: 'Full-Stack Developer | Next.js, Node.js & Supabase',
    bio: 'Shipping clean SaaS products from prototype to production. Fan of PostgreSQL row-level security and TypeScript end-to-end.',
    location: 'Chennai, India',
    github_username: 'akash-verma',
    website_url: 'https://akashverma.dev',
    experience_level: 'Mid-Level',
    availability_status: 'open_to_collaborate',
    weekly_hours_available: 16,
    interests: ['Next.js', 'Supabase', 'TypeScript', 'Tailwind CSS'],
    preset_avatar_id: 'preset:dev-6',
    professional_description: {
      bio: 'Product-focused full-stack engineer who loves rapid prototyping and turning complex requirements into clean applications.',
      technical_interests: ['Type-safe RPC (tRPC)', 'Supabase Realtime & PostgreSQL triggers', 'Responsive UI architecture'],
      current_goals: 'Collaborating on open-source developer networking tools and student portfolio ecosystems.',
      collaboration_style: 'Daily async updates on Slack/Discord, clean atomic git commits, rapid feature iterations.',
      target_projects: ['Developer job match platforms', 'Real-time collaborative whiteboards', 'Project management SaaS']
    },
    skills: ['TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js', 'Supabase', 'PostgreSQL', 'Tailwind CSS']
  },
  {
    id: 'd3300000-0000-4000-a000-000000000007',
    username: 'ishita.ml',
    full_name: 'Ishita Sen',
    headline: 'NLP & Deep Learning Engineer | Transformers & GenAI',
    bio: 'Building natural language understanding pipelines, custom embeddings, and conversational AI agents with Hugging Face & PyTorch.',
    location: 'Kolkata, India',
    github_username: 'ishita-sen',
    website_url: 'https://ishita.tech',
    experience_level: 'Mid-Level',
    availability_status: 'open_to_collaborate',
    weekly_hours_available: 12,
    interests: ['Transformers', 'Hugging Face', 'Python', 'Vector Search'],
    preset_avatar_id: 'preset:dev-7',
    professional_description: {
      bio: 'Deep learning practitioner working on state-of-the-art NLP models, embedding clustering, and domain adaptation.',
      technical_interests: ['Parameter-efficient fine-tuning (LoRA/QLoRA)', 'Semantic similarity matching', 'Contextual summarization'],
      current_goals: 'Developing semantic matching models for pairing developers with open-source project needs.',
      collaboration_style: 'Open notebook sharing, reproducible experimental pipelines, structured model documentation.',
      target_projects: ['AI resume & skill analysers', 'Intelligent search engines', 'Code sentiment & review tools']
    },
    skills: ['Python', 'PyTorch', 'Hugging Face', 'FastAPI', 'OpenAI API', 'PostgreSQL']
  },
  {
    id: 'd3300000-0000-4000-a000-000000000008',
    username: 'nikhilcreates',
    full_name: 'Nikhil Deshmukh',
    headline: 'Creative Developer & UI/UX Designer | 3D & WebGL',
    bio: 'Bridging design and code. Creating tactile interfaces, 3D web experiences, and micro-interactions that make software feel alive.',
    location: 'Bengaluru, India',
    github_username: 'nikhil-deshmukh',
    website_url: 'https://nikhil.design',
    experience_level: 'Senior',
    availability_status: 'open_to_collaborate',
    weekly_hours_available: 14,
    interests: ['UI/UX', 'Three.js', 'Figma', 'Framer Motion', 'Tailwind CSS'],
    preset_avatar_id: 'preset:dev-8',
    professional_description: {
      bio: 'Creative technologist with 5+ years crafting distinct visual identities and interactive digital experiences.',
      technical_interests: ['Interactive shader art', 'High-contrast typography systems', 'Haptic feedback in web interfaces'],
      current_goals: 'Redefining developer tools to possess the aesthetic refinement of editorial publications.',
      collaboration_style: 'Figma-first design exploration followed by high-fidelity React implementation and polish passes.',
      target_projects: ['Editorial developer blogs', 'Interactive documentation portals', 'Creative portfolio builders']
    },
    skills: ['Figma', 'React', 'TypeScript', 'Tailwind CSS', 'JavaScript']
  },
  {
    id: 'd3300000-0000-4000-a000-000000000009',
    username: 'kavya.dev',
    full_name: 'Kavya Iyer',
    headline: 'Backend Infrastructure Engineer | Go, gRPC & Kafka',
    bio: 'Designing high-volume streaming architectures, distributed event buses, and resilient API gateways in Go and PostgreSQL.',
    location: 'Kochi, India',
    github_username: 'kavya-iyer',
    website_url: 'https://kavyaiyer.io',
    experience_level: 'Lead',
    availability_status: 'available',
    weekly_hours_available: 18,
    interests: ['Go', 'Kafka', 'gRPC', 'Database Internals'],
    preset_avatar_id: 'preset:dev-9',
    professional_description: {
      bio: 'Infrastructure and backend specialist with a track record of scaling distributed backends past 100k requests/second.',
      technical_interests: ['Event-driven systems (Kafka/RabbitMQ)', 'Postgres query planner tuning', 'Strict contract-driven gRPC APIs'],
      current_goals: 'Mentoring junior developers and architecting open source backends for collaborative tooling.',
      collaboration_style: 'Thorough code reviews with benchmark comparisons, detailed system schematics, clear milestone roadmaps.',
      target_projects: ['Real-time messaging engines', 'API monitoring & telemetry services', 'Event-sourced task platforms']
    },
    skills: ['Go', 'PostgreSQL', 'Redis', 'Docker', 'Linux', 'REST APIs', 'WebSockets']
  },
  {
    id: 'd3300000-0000-4000-a000-000000000010',
    username: 'adityastacks',
    full_name: 'Aditya Joshi',
    headline: 'Cybersecurity Engineer & AppSec Specialist',
    bio: 'Securing cloud applications, hardening authentication workflows, and performing vulnerability assessments and penetration testing.',
    location: 'Ahmedabad, India',
    github_username: 'aditya-sec',
    website_url: 'https://adityajoshi.security',
    experience_level: 'Senior',
    availability_status: 'open_to_collaborate',
    weekly_hours_available: 10,
    interests: ['Cybersecurity', 'OAuth2', 'Zero Trust', 'AppSec', 'Linux'],
    preset_avatar_id: 'preset:dev-10',
    professional_description: {
      bio: 'Information security engineer focused on defending web applications against modern threat vectors and API vulnerabilities.',
      technical_interests: ['OAuth 2.1 / OIDC protocols', 'Postgres RLS security audits', 'Automated SAST/DAST in CI/CD pipelines'],
      current_goals: 'Building secure-by-default developer templates and open-source compliance checkers.',
      collaboration_style: 'Security threat modeling during design phase, peer review of sensitive auth paths, defensive coding standards.',
      target_projects: ['Cybersecurity monitoring tools', 'Identity & access management modules', 'API penetration testing suites']
    },
    skills: ['Python', 'Linux', 'Docker', 'PostgreSQL', 'REST APIs', 'Git']
  },
  {
    id: 'd3300000-0000-4000-a000-000000000011',
    username: 'tanvi_ux',
    full_name: 'Tanvi Kulkarni',
    headline: 'Senior Product Designer | Design Systems & Accessibility',
    bio: 'Crafting user-centered workflows for complex developer SaaS platforms. Advocate of WCAG AAA accessibility standards.',
    location: 'Pune, India',
    github_username: 'tanvi-kulkarni',
    website_url: 'https://tanvi.design',
    experience_level: 'Senior',
    availability_status: 'available',
    weekly_hours_available: 15,
    interests: ['UI/UX', 'Accessibility', 'Design Systems', 'Figma'],
    preset_avatar_id: 'preset:dev-11',
    professional_description: {
      bio: 'Product designer with deep technical literacy who writes clean semantic HTML/CSS and builds comprehensive Figma component libraries.',
      technical_interests: ['Design tokens', 'Micro-interactions', 'User mental models in developer tools'],
      current_goals: 'Creating world-class user interfaces for collaborative developer tools.',
      collaboration_style: 'High-touch alignment with frontend engineers, iterative user testing prototypes.',
      target_projects: ['Developer dashboards', 'Collaborative kanban boards', 'Open-source documentation systems']
    },
    skills: ['Figma', 'Tailwind CSS', 'React', 'TypeScript']
  },
  {
    id: 'd3300000-0000-4000-a000-000000000012',
    username: 'siddharth.cloud',
    full_name: 'Siddharth Rao',
    headline: 'DevOps & SRE Engineer | Multi-Cloud & Observability',
    bio: 'Automating everything from bare metal to Kubernetes clusters. Prometheus, Grafana, and OpenTelemetry advocate.',
    location: 'Chennai, India',
    github_username: 'siddharth-cloud',
    website_url: 'https://siddharthrao.dev',
    experience_level: 'Mid-Level',
    availability_status: 'open_to_collaborate',
    weekly_hours_available: 12,
    interests: ['DevOps', 'Kubernetes', 'Prometheus', 'Grafana', 'Docker'],
    preset_avatar_id: 'preset:dev-12',
    professional_description: {
      bio: 'Site Reliability Engineer dedicated to system resilience, automated incident response, and performance profiling.',
      technical_interests: ['SLO/SLA tracking dashboards', 'Prometheus metrics aggregation', 'Zero-downtime rolling updates'],
      current_goals: 'Implementing real-time health telemetry across multi-region services.',
      collaboration_style: 'Infrastructure-as-code reviews, automated smoke tests, operational readiness checklists.',
      target_projects: ['Cloud monitoring dashboards', 'API health monitoring platforms', 'Automated deployment pipelines']
    },
    skills: ['Docker', 'Kubernetes', 'Terraform', 'Linux', 'AWS', 'GitHub Actions']
  },
  {
    id: 'd3300000-0000-4000-a000-000000000013',
    username: 'priya.data',
    full_name: 'Priya Nambiar',
    headline: 'Data Scientist & Analytics Engineer | Pandas & BigQuery',
    bio: 'Transforming petabytes of raw signals into actionable engineering insights, predictive models, and intuitive dashboards.',
    location: 'Trivandrum, India',
    github_username: 'priya-data',
    website_url: 'https://priyanambiar.data',
    experience_level: 'Senior',
    availability_status: 'open_to_collaborate',
    weekly_hours_available: 14,
    interests: ['Data Science', 'Python', 'BigQuery', 'Data Analytics'],
    preset_avatar_id: 'preset:dev-13',
    professional_description: {
      bio: 'Analytics engineer specializing in ETL pipelines, statistical modeling, and developer telemetry visualization.',
      technical_interests: ['dbt transformations', 'Streaming data aggregations', 'Interactive Recharts dashboards'],
      current_goals: 'Building developer productivity telemetry systems that respect engineer autonomy.',
      collaboration_style: 'Clear schema definitions, data validation tests, well-documented queries.',
      target_projects: ['Data analytics dashboards', 'GitHub contribution trackers', 'Developer velocity analyzers']
    },
    skills: ['Python', 'SQL', 'PostgreSQL', 'FastAPI', 'Google Cloud']
  },
  {
    id: 'd3300000-0000-4000-a000-000000000014',
    username: 'vikram.systems',
    full_name: 'Vikram Malhotra',
    headline: 'Core Backend Architect | Java, Spring Boot & Distributed Caches',
    bio: 'Architecting rock-solid enterprise backends, transactional integrity, and scalable event streaming with Kafka.',
    location: 'Gurgaon, India',
    github_username: 'vikram-malhotra',
    website_url: 'https://vikrammalhotra.dev',
    experience_level: 'Architect',
    availability_status: 'busy',
    weekly_hours_available: 6,
    interests: ['Java', 'Spring Boot', 'Kafka', 'System Architecture'],
    preset_avatar_id: 'preset:dev-14',
    professional_description: {
      bio: 'Enterprise systems architect with 10+ years designing fault-tolerant transaction processing architectures.',
      technical_interests: ['Distributed locking', 'PostgreSQL query optimization', 'Clean architecture principles'],
      current_goals: 'Advising and building high-reliability open-source platforms.',
      collaboration_style: 'Architecture design reviews, strict API versioning, defensive error handling.',
      target_projects: ['Student management systems', 'Inventory management SaaS', 'Payment transaction gateways']
    },
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'Docker', 'REST APIs']
  },
  {
    id: 'd3300000-0000-4000-a000-000000000015',
    username: 'sneha_frontend',
    full_name: 'Sneha Banerjee',
    headline: 'Frontend Engineer | React, TypeScript & Web Performance',
    bio: 'Crafting responsive, high-speed single page applications with sub-second time-to-interactive and 100 Lighthouse scores.',
    location: 'Kolkata, India',
    github_username: 'sneha-frontend',
    website_url: 'https://snehabanerjee.dev',
    experience_level: 'Junior',
    availability_status: 'available',
    weekly_hours_available: 20,
    interests: ['React', 'TypeScript', 'Web Performance', 'Tailwind CSS'],
    preset_avatar_id: 'preset:dev-15',
    professional_description: {
      bio: 'Enthusiastic frontend engineer eager to contribute to collaborative projects and learn modern state management.',
      technical_interests: ['TanStack Query caching strategies', 'CSS grid & asymmetric layouts', 'Component unit testing'],
      current_goals: 'Collaborating on open-source applications and contributing to developer tool interfaces.',
      collaboration_style: 'Eager to receive code review feedback, fast iteration cycles, proactive communication.',
      target_projects: ['Developer portfolio builders', 'Code snippet sharing tools', 'E-commerce platforms']
    },
    skills: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Git']
  },
  {
    id: 'd3300000-0000-4000-a000-000000000016',
    username: 'rajesh.devops',
    full_name: 'Rajesh Gopinath',
    headline: 'Senior Cloud Architect | AWS, Terraform & Zero Trust',
    bio: 'Designing scalable cloud topographies across AWS and GCP. Automating deployment pipelines and security compliance.',
    location: 'Bengaluru, India',
    github_username: 'rajesh-gopinath',
    website_url: 'https://rajeshg.cloud',
    experience_level: 'Senior',
    availability_status: 'open_to_collaborate',
    weekly_hours_available: 10,
    interests: ['AWS', 'Terraform', 'Kubernetes', 'Security'],
    preset_avatar_id: 'preset:dev-16',
    professional_description: {
      bio: 'Cloud architect with extensive experience deploying enterprise SaaS workloads with strict SOC2 & GDPR compliance.',
      technical_interests: ['Infrastructure-as-code modularity', 'Serverless microservices (AWS Lambda)', 'VPC peering & mesh security'],
      current_goals: 'Helping collaborative open-source developer teams set up free-tier cloud architectures.',
      collaboration_style: 'Infrastructure blueprints, reproducible Docker environments, clear runbooks.',
      target_projects: ['Cloud monitoring dashboards', 'Automated CI/CD pipelines', 'API gateways']
    },
    skills: ['AWS', 'Terraform', 'Docker', 'Kubernetes', 'Linux', 'Python']
  },
  {
    id: 'd3300000-0000-4000-a000-000000000017',
    username: 'pooja.mobile',
    full_name: 'Pooja Hegde',
    headline: 'Mobile App Developer | React Native & Flutter',
    bio: 'Building smooth 60fps iOS and Android applications with offline-first local storage and snappy native animations.',
    location: 'Mangalore, India',
    github_username: 'pooja-mobile',
    website_url: 'https://poojahegde.mobile',
    experience_level: 'Mid-Level',
    availability_status: 'available',
    weekly_hours_available: 15,
    interests: ['React Native', 'Flutter', 'Mobile UX', 'Offline-First'],
    preset_avatar_id: 'preset:dev-17',
    professional_description: {
      bio: 'Cross-platform mobile engineer passionate about intuitive mobile experiences and high-performance native bridges.',
      technical_interests: ['SQLite & WatermelonDB offline sync', 'React Native Reanimated', 'Push notification orchestration'],
      current_goals: 'Building companion mobile apps for developer collaboration platforms.',
      collaboration_style: 'Mobile wireframes, rapid Expo prototypes, shared API schema synchronization.',
      target_projects: ['Mobile chat applications', 'Fitness tracking apps', 'Smart attendance systems']
    },
    skills: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'REST APIs', 'Supabase']
  },
  {
    id: 'd3300000-0000-4000-a000-000000000018',
    username: 'manish.ai',
    full_name: 'Manish Chawla',
    headline: 'Machine Learning Engineer | Computer Vision & PyTorch',
    bio: 'Training convolutional neural networks, vision transformers, and real-time object detection models at edge device constraints.',
    location: 'Chandigarh, India',
    github_username: 'manish-ai',
    website_url: 'https://manishchawla.ai',
    experience_level: 'Mid-Level',
    availability_status: 'open_to_collaborate',
    weekly_hours_available: 12,
    interests: ['Computer Vision', 'PyTorch', 'TensorFlow', 'Edge AI'],
    preset_avatar_id: 'preset:dev-18',
    professional_description: {
      bio: 'Computer vision researcher with experience deploying quantized inference models on mobile and embedded devices.',
      technical_interests: ['Vision Transformers (ViT)', 'OpenCV real-time image processing', 'Model pruning & ONNX runtime'],
      current_goals: 'Collaborating on real-time visual recognition applications.',
      collaboration_style: 'Jupyter notebooks with visual benchmarks, REST inference endpoints, reproducible training logs.',
      target_projects: ['AI image classification systems', 'Smart attendance systems', 'Smart agriculture monitoring']
    },
    skills: ['Python', 'PyTorch', 'TensorFlow', 'FastAPI', 'Docker']
  },
  {
    id: 'd3300000-0000-4000-a000-000000000019',
    username: 'deepa.infra',
    full_name: 'Deepa Krishnan',
    headline: 'Site Reliability Engineer | Linux Kernel & Performance',
    bio: 'Profiling Linux kernel bottlenecks, analyzing eBPF traces, and optimizing PostgreSQL query plans for massive read concurrency.',
    location: 'Coimbatore, India',
    github_username: 'deepa-infra',
    website_url: 'https://deepakrishnan.tech',
    experience_level: 'Senior',
    availability_status: 'open_to_collaborate',
    weekly_hours_available: 10,
    interests: ['Linux', 'Performance', 'eBPF', 'PostgreSQL'],
    preset_avatar_id: 'preset:dev-19',
    professional_description: {
      bio: 'SRE and systems performance specialist passionate about finding latency outliers and writing zero-overhead probes.',
      technical_interests: ['eBPF tracing with bpftrace', 'Postgres indexing & vacuum strategies', 'Memory allocation tuning'],
      current_goals: 'Optimizing open-source database response times and publishing performance audits.',
      collaboration_style: 'Benchmark flamegraphs, deterministic reproducibility, structured bug post-mortems.',
      target_projects: ['Cloud monitoring dashboards', 'API performance monitors', 'Database telemetry tools']
    },
    skills: ['Linux', 'PostgreSQL', 'Go', 'Docker', 'Git']
  },
  {
    id: 'd3300000-0000-4000-a000-000000000020',
    username: 'kunal.api',
    full_name: 'Kunal Singhania',
    headline: 'API Architect | GraphQL, Node.js & Microservices',
    bio: 'Designing federated GraphQL graphs, high-volume REST endpoints, and schema-driven developer experiences.',
    location: 'Mumbai, India',
    github_username: 'kunal-api',
    website_url: 'https://kunalsinghania.dev',
    experience_level: 'Lead',
    availability_status: 'available',
    weekly_hours_available: 16,
    interests: ['GraphQL', 'Node.js', 'NestJS', 'TypeScript'],
    preset_avatar_id: 'preset:dev-20',
    professional_description: {
      bio: 'Senior backend architect specializing in clean APIs, domain-driven design, and developer portal documentation.',
      technical_interests: ['Apollo Federation & GraphQL mesh', 'OpenAPI 3.1 specification tooling', 'Redis rate limiting & caching'],
      current_goals: 'Architecting developer-friendly APIs for modern collaborative applications.',
      collaboration_style: 'API design-first approach, contract testing, typed SDK generation for frontend consumers.',
      target_projects: ['Real-time chat platforms', 'Code snippet sharing tools', 'API monitoring platforms']
    },
    skills: ['TypeScript', 'Node.js', 'NestJS', 'GraphQL', 'REST APIs', 'PostgreSQL', 'Redis']
  }
];

// Generate 20 more profiles to reach 40
const additionalProfilesData = [
  ['aarav.dev', 'Aarav Gupta', 'Frontend Engineer | Vue.js & Nuxt', 'Jaipur, India', 'Junior', 'Vue.js', 'Nuxt.js', 'TypeScript', 'Tailwind CSS'],
  ['divya.sec', 'Divya Ranganathan', 'Penetration Tester & Ethical Hacker', 'Chennai, India', 'Senior', 'Linux', 'Python', 'REST APIs', 'Git'],
  ['tarun.code', 'Tarun Bhatia', 'Full-Stack Developer | MERN Stack', 'Lucknow, India', 'Mid-Level', 'React', 'Node.js', 'MongoDB', 'Express.js'],
  ['shreya.ui', 'Shreya Mukherjee', 'Visual Designer & CSS Specialist', 'Kolkata, India', 'Mid-Level', 'Figma', 'Tailwind CSS', 'React', 'JavaScript'],
  ['varun.ml', 'Varun Kapoor', 'Data Engineer | Spark & Data Pipelines', 'Noida, India', 'Senior', 'Python', 'SQL', 'PostgreSQL', 'Docker'],
  ['anita.cloud', 'Anita Deshpande', 'Cloud Engineer | GCP & Kubernetes', 'Nagpur, India', 'Senior', 'Google Cloud', 'Kubernetes', 'Docker', 'Terraform'],
  ['karthik.go', 'Karthik Raman', 'Go Backend Developer | Microservices', 'Bengaluru, India', 'Mid-Level', 'Go', 'Docker', 'PostgreSQL', 'REST APIs'],
  ['swati.qa', 'Swati Mishra', 'QA Automation Engineer | Cypress & Playwright', 'Bhopal, India', 'Mid-Level', 'TypeScript', 'JavaScript', 'React', 'Git'],
  ['alok.ai', 'Alok Trivedi', 'AI Engineer | LangChain & Vector Search', 'Varanasi, India', 'Junior', 'Python', 'OpenAI API', 'FastAPI', 'LangChain'],
  ['bhavna.web', 'Bhavna Parekh', 'Frontend Specialist | Angular & TypeScript', 'Surat, India', 'Senior', 'Angular', 'TypeScript', 'REST APIs', 'Tailwind CSS'],
  ['chetan.rust', 'Chetan Kulkarni', 'Rust Developer | Embedded & Systems', 'Nashik, India', 'Mid-Level', 'Rust', 'Linux', 'C++', 'Git'],
  ['geeta.db', 'Geeta Sundaram', 'PostgreSQL DBA & Query Tuner', 'Madurai, India', 'Lead', 'PostgreSQL', 'SQL', 'Linux', 'Docker'],
  ['harsh.dev', 'Harsh Agrawal', 'Full-Stack Engineer | Django & React', 'Indore, India', 'Mid-Level', 'Python', 'Django', 'React', 'PostgreSQL'],
  ['indira.ux', 'Indira Pillai', 'UX Researcher & Interaction Designer', 'Thrissur, India', 'Senior', 'Figma', 'UI/UX', 'Tailwind CSS', 'React'],
  ['jay.devops', 'Jayesh Shah', 'DevOps Specialist | GitHub Actions & CI', 'Vadodara, India', 'Mid-Level', 'GitHub Actions', 'Docker', 'Linux', 'AWS'],
  ['komal.ai', 'Komal Narang', 'Machine Learning Researcher | NLP', 'Amritsar, India', 'Junior', 'Python', 'PyTorch', 'Hugging Face', 'FastAPI'],
  ['lalit.full', 'Lalit Somani', 'Full-Stack Developer | SvelteKit & Supabase', 'Udaipur, India', 'Senior', 'Svelte', 'TypeScript', 'Supabase', 'PostgreSQL'],
  ['mona.sec', 'Mona Saxena', 'Cloud Security & IAM Architect', 'Dehradun, India', 'Lead', 'AWS', 'Linux', 'Python', 'Terraform'],
  ['nitin.code', 'Nitin Rawat', 'Backend Developer | FastAPI & Redis', 'Ranchi, India', 'Mid-Level', 'Python', 'FastAPI', 'Redis', 'PostgreSQL'],
  ['ojas.mobile', 'Ojas Kadam', 'Mobile Engineer | Flutter & Dart', 'Aurangabad, India', 'Junior', 'Flutter', 'Dart', 'REST APIs', 'Git']
];

additionalProfilesData.forEach((item, index) => {
  const profileId = `d3300000-0000-4000-a000-0000000000${(21 + index).toString().padStart(2, '0')}`;
  profiles.push({
    id: profileId,
    username: item[0],
    full_name: item[1],
    headline: `${item[2]}`,
    bio: `Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.`,
    location: item[3],
    github_username: item[0].replace('.', '-'),
    website_url: `https://${item[0].replace('.', '')}.dev`,
    experience_level: item[4],
    availability_status: index % 3 === 0 ? 'available' : index % 3 === 1 ? 'open_to_collaborate' : 'busy',
    weekly_hours_available: 10 + (index % 10),
    interests: [item[5], item[6] || 'Open Source', 'Software Architecture'],
    preset_avatar_id: `preset:dev-${((21 + index) % 24) + 1}`,
    professional_description: {
      bio: `Dedicated ${item[2]} with strong technical fundamentals and passion for reliable collaborative engineering.`,
      technical_interests: [item[5], item[6] || 'System Design', 'Clean Code'],
      current_goals: 'Building impactful open-source tools with developer communities.',
      collaboration_style: 'Async communication, clear task estimation, peer reviews.',
      target_projects: ['Collaborative platforms', 'Developer tools', 'SaaS applications']
    },
    skills: [item[5], item[6], item[7], item[8]].filter(Boolean)
  });
});

console.log(`Generated ${profiles.length} total profiles.`);

// Generate 30 Projects
const projectsList = [
  {
    title: 'AI Resume & Technical Skill Analyzer',
    category: 'AI & Machine Learning',
    tagline: 'Automated developer resume parser with skill ontology matching and portfolio scoring.',
    description: 'An AI-powered resume analyzer that parses PDF/Word developer portfolios, extracts technical proficiencies against a canonical tech ontology, benchmarks project complexity, and recommends high-fit engineering roles.',
    status: 'in_progress',
    progress: 75,
    team_size: 4,
    required_skills: ['Python', 'FastAPI', 'PyTorch', 'React', 'TypeScript', 'Tailwind CSS'],
    github_url: 'https://github.com/DevConnect-Demo/ai-resume-analyzer',
    owner_idx: 3 // rohanxdev
  },
  {
    title: 'Distributed Real-Time WebSocket Mesh',
    category: 'Infrastructure',
    tagline: 'High-throughput real-time messaging gateway backed by Redis Pub/Sub and Go.',
    description: 'A distributed message broker orchestrating real-time state synchronization, peer-to-peer WebRTC signaling, and bi-directional event distribution across multiple geographic edge nodes with low latency.',
    status: 'active',
    progress: 60,
    team_size: 5,
    required_skills: ['Go', 'Redis', 'Docker', 'WebSockets', 'Kubernetes'],
    github_url: 'https://github.com/DevConnect-Demo/realtime-chat-mesh',
    owner_idx: 0 // arjun.codes
  },
  {
    title: 'Modern E-Commerce Headless Storefront',
    category: 'Web Application',
    tagline: 'Sub-second page loads, edge-cached product catalogs, and serverless checkout flows.',
    description: 'A headless e-commerce platform built with Next.js App Router, Stripe Elements, Supabase PostgreSQL, and automated inventory sync with real-time stock notifications.',
    status: 'in_progress',
    progress: 85,
    team_size: 4,
    required_skills: ['Next.js', 'React', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    github_url: 'https://github.com/DevConnect-Demo/headless-ecommerce-suite',
    owner_idx: 5 // akash_fullstack
  },
  {
    title: 'Campus Student & Placement Management System',
    category: 'Web Application',
    tagline: 'Comprehensive academic tracking, internship placement drives, and student portfolios.',
    description: 'Centralized portal for college administrators, placement officers, and students to coordinate placement interviews, automate resume validation, and visualize historical placement statistics.',
    status: 'completed',
    progress: 100,
    team_size: 3,
    required_skills: ['React', 'Node.js', 'PostgreSQL', 'Express.js', 'Tailwind CSS'],
    github_url: 'https://github.com/DevConnect-Demo/campus-placement-manager',
    owner_idx: 13 // vikram.systems
  },
  {
    title: 'Smart Expense & Budget Analytics Tracker',
    category: 'Web Application',
    tagline: 'Intelligent transaction categorization, recurring subscription detection, and budget alerts.',
    description: 'A modern personal finance dashboard that ingests bank statements, classifies recurring expenses with machine learning models, and forecasts monthly burn rates with interactive Recharts visualizations.',
    status: 'active',
    progress: 50,
    team_size: 3,
    required_skills: ['React', 'TypeScript', 'Recharts', 'Python', 'PostgreSQL'],
    github_url: 'https://github.com/DevConnect-Demo/smart-expense-analytics',
    owner_idx: 12 // priya.data
  },
  {
    title: 'Autonomous AI Coding Assistant & Reviewer',
    category: 'AI & Machine Learning',
    tagline: 'Automated GitHub pull request reviewer providing semantic diff analysis and security audits.',
    description: 'A GitHub App and CLI tool that intercepts incoming pull requests, generates architectural summaries, detects security vulnerabilities, and suggests idiomatic refactoring using Gemini and OpenAI APIs.',
    status: 'in_progress',
    progress: 70,
    team_size: 4,
    required_skills: ['Python', 'OpenAI API', 'Gemini API', 'TypeScript', 'GitHub Actions'],
    github_url: 'https://github.com/DevConnect-Demo/autonomous-code-reviewer',
    owner_idx: 6 // ishita.ml
  },
  {
    title: 'Hybrid Collaborative Movie Recommendation Engine',
    category: 'AI & Machine Learning',
    tagline: 'Vector embeddings + collaborative matrix factorization for personalized entertainment discovery.',
    description: 'A recommendation system that utilizes two-tower neural architectures to match user watch history with cinematic embeddings, streaming real-time recommendations over a reactive React UI.',
    status: 'completed',
    progress: 100,
    team_size: 3,
    required_skills: ['Python', 'PyTorch', 'FastAPI', 'React', 'Tailwind CSS'],
    github_url: 'https://github.com/DevConnect-Demo/movie-recommendation-engine',
    owner_idx: 3 // rohanxdev
  },
  {
    title: 'Developer Social Network & Open Hub',
    category: 'Web Application',
    tagline: 'Dark editorial developer collaboration network uniting GitHub, LinkedIn, and Discord.',
    description: 'The flagship DevConnect ecosystem enabling developers to showcase projects, connect via AI teammate matching, track tasks on Kanban boards, and collaborate in real-time chat rooms.',
    status: 'active',
    progress: 90,
    team_size: 6,
    required_skills: ['React', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Framer Motion'],
    github_url: 'https://github.com/Deew101/DevConnect',
    owner_idx: 1 // dev_meera
  },
  {
    title: 'Multi-Cloud Infrastructure Observability Dashboard',
    category: 'Infrastructure',
    tagline: 'Unified Prometheus metric aggregation, trace waterfall visualization, and SLA alert management.',
    description: 'A cloud-native observability portal that pulls live metrics from Kubernetes nodes, Docker daemons, and microservices into customizable Grafana-style dashboards with instant alert webhooks.',
    status: 'in_progress',
    progress: 65,
    team_size: 4,
    required_skills: ['Go', 'Kubernetes', 'Docker', 'Prometheus', 'React', 'TypeScript'],
    github_url: 'https://github.com/DevConnect-Demo/cloud-observability-mesh',
    owner_idx: 4 // ananya.codes
  },
  {
    title: 'Interactive Developer Portfolio Generator',
    category: 'Developer Tools',
    tagline: 'Turn your GitHub profile and markdown resume into a custom editorial web portfolio in 60s.',
    description: 'A static-site generator and hosted builder that reads GitHub public repositories, star counts, and commit histories to automatically assemble a sleek portfolio with custom typography and domain hosting.',
    status: 'completed',
    progress: 100,
    team_size: 2,
    required_skills: ['TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
    github_url: 'https://github.com/DevConnect-Demo/portfolio-generator-pro',
    owner_idx: 7 // nikhilcreates
  },
  {
    title: 'Intelligent Job & Hackathon Teammate Matcher',
    category: 'AI & Machine Learning',
    tagline: 'Semantic skill alignment algorithm pairing engineers based on complementary strengths.',
    description: 'An AI matching engine that evaluates developer experience levels, active project domains, and desired weekly commitments to form balanced hackathon squads and project teams.',
    status: 'active',
    progress: 80,
    team_size: 4,
    required_skills: ['Python', 'FastAPI', 'PostgreSQL', 'React', 'TypeScript'],
    github_url: 'https://github.com/DevConnect-Demo/teammate-matcher-ai',
    owner_idx: 0 // arjun.codes
  },
  {
    title: 'Interactive Code Learning & Interactive Playground',
    category: 'Developer Tools',
    tagline: 'In-browser Wasm compiler sandbox with step-by-step algorithms and interactive challenges.',
    description: 'An interactive learning platform running WebAssembly runtimes inside the browser. Users can write Rust, C++, and Python code without server sandboxes and visualize data structures in real-time.',
    status: 'in_progress',
    progress: 55,
    team_size: 5,
    required_skills: ['Rust', 'WebAssembly', 'React', 'TypeScript', 'Tailwind CSS'],
    github_url: 'https://github.com/DevConnect-Demo/interactive-code-playground',
    owner_idx: 2 // harshitbuilds
  },
  {
    title: 'Hyperlocal Food Delivery & Fleet Tracking App',
    category: 'Mobile Application',
    tagline: 'Real-time GPS dispatch, driver route optimization, and live order status streams.',
    description: 'Full-stack food delivery application with driver companion app, live map tracking via WebSockets, menu management, and instant payment integration.',
    status: 'completed',
    progress: 100,
    team_size: 4,
    required_skills: ['React Native', 'Node.js', 'Express.js', 'PostgreSQL', 'WebSockets'],
    github_url: 'https://github.com/DevConnect-Demo/hyperlocal-food-delivery',
    owner_idx: 16 // pooja.mobile
  },
  {
    title: 'Computer Vision Attendance & Biometric Recognition',
    category: 'AI & Machine Learning',
    tagline: 'Real-time face recognition camera stream for classroom and office attendance logging.',
    description: 'An edge vision system that scans video feeds from IP cameras, verifies identities against a local face embedding database in under 50ms, and posts automated attendance reports to Supabase.',
    status: 'active',
    progress: 75,
    team_size: 3,
    required_skills: ['Python', 'OpenCV', 'PyTorch', 'FastAPI', 'Supabase'],
    github_url: 'https://github.com/DevConnect-Demo/cv-attendance-system',
    owner_idx: 17 // manish.ai
  },
  {
    title: 'Automated API Penetration & Vulnerability Scanner',
    category: 'Developer Tools',
    tagline: 'Continuous security testing for REST and GraphQL endpoints against OWASP Top 10.',
    description: 'A developer security scanner that inspects OpenAPI specs, fuzzes endpoint inputs, checks for broken object-level authorization (BOLA), and outputs actionable remediation guides.',
    status: 'in_progress',
    progress: 60,
    team_size: 3,
    required_skills: ['Python', 'Linux', 'Docker', 'PostgreSQL', 'REST APIs'],
    github_url: 'https://github.com/DevConnect-Demo/api-security-scanner',
    owner_idx: 9 // adityastacks
  },
  {
    title: 'Executive Engineering Analytics & DORA Metrics',
    category: 'Developer Tools',
    tagline: 'Deployment frequency, lead time for changes, change failure rate, and mean time to recovery.',
    description: 'Engineering leadership dashboard pulling webhook data from GitHub and GitLab to compute team DORA metrics, sprint velocity trends, and PR review cycle times.',
    status: 'active',
    progress: 85,
    team_size: 4,
    required_skills: ['TypeScript', 'React', 'Recharts', 'PostgreSQL', 'Tailwind CSS'],
    github_url: 'https://github.com/DevConnect-Demo/dora-metrics-analytics',
    owner_idx: 12 // priya.data
  },
  {
    title: 'Collaborative Kanban & Sprint Planning SaaS',
    category: 'Web Application',
    tagline: 'Drag-and-drop task boards, velocity burn-down charts, and multi-user cursor sync.',
    description: 'A Linear-inspired project management platform engineered with @dnd-kit, Supabase Realtime WebSocket synchronization, task hierarchy, and team assignment milestones.',
    status: 'completed',
    progress: 100,
    team_size: 4,
    required_skills: ['React', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Framer Motion'],
    github_url: 'https://github.com/DevConnect-Demo/kanban-sprint-saas',
    owner_idx: 1 // dev_meera
  },
  {
    title: 'Agricultural Crop Disease Diagnosis via Image AI',
    category: 'AI & Machine Learning',
    tagline: 'Smartphone camera leaf scan for instant crop disease classification and remedies.',
    description: 'A mobile-friendly web application assisting farmers by detecting 38 common crop leaf diseases using lightweight MobileNet vision models and providing natural language remedy advice.',
    status: 'active',
    progress: 70,
    team_size: 3,
    required_skills: ['Python', 'TensorFlow', 'FastAPI', 'React', 'Tailwind CSS'],
    github_url: 'https://github.com/DevConnect-Demo/crop-disease-ai',
    owner_idx: 17 // manish.ai
  },
  {
    title: 'Collaborative Travel Itinerary & Budget Planner',
    category: 'Web Application',
    tagline: 'Multiplayer trip planning, interactive map waypoints, and split expense ledger.',
    description: 'Travel coordination software allowing friends to pin map destinations, build day-by-day itineraries with travel times, and settle shared trip expenses automatically.',
    status: 'in_progress',
    progress: 45,
    team_size: 3,
    required_skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    github_url: 'https://github.com/DevConnect-Demo/travel-itinerary-collab',
    owner_idx: 5 // akash_fullstack
  },
  {
    title: 'Fitness & Workout Telemetry Tracker',
    category: 'Mobile Application',
    tagline: 'Progressive overload tracking, custom routine builders, and health metrics integration.',
    description: 'A workout logging app offering audio timers, weight progression charts, and personal record tracking with seamless cloud backup.',
    status: 'completed',
    progress: 100,
    team_size: 2,
    required_skills: ['React Native', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    github_url: 'https://github.com/DevConnect-Demo/fitness-tracker-pro',
    owner_idx: 16 // pooja.mobile
  },
  {
    title: 'GitHub Organization Insights & Contributor Analytics',
    category: 'Developer Tools',
    tagline: 'Deep dive into repository commit frequency, PR review turnaround, and contributor health.',
    description: 'Visual analytics tool for open-source maintainers to monitor repository star velocity, active pull request queues, and contributor onboarding friction.',
    status: 'active',
    progress: 80,
    team_size: 3,
    required_skills: ['TypeScript', 'React', 'Recharts', 'REST APIs', 'Tailwind CSS'],
    github_url: 'https://github.com/DevConnect-Demo/github-insights-analytics',
    owner_idx: 0 // arjun.codes
  },
  {
    title: 'IoT Smart Agriculture Irrigation & Soil Sensor Mesh',
    category: 'Infrastructure',
    tagline: 'ESP32 sensor telemetry mesh streaming soil moisture and weather data to dashboard.',
    description: 'Hardware + cloud platform that gathers soil moisture, temperature, and solar irradiance metrics via MQTT brokers and triggers automated drip irrigation valves.',
    status: 'in_progress',
    progress: 60,
    team_size: 4,
    required_skills: ['C++', 'Python', 'FastAPI', 'MQTT', 'React', 'PostgreSQL'],
    github_url: 'https://github.com/DevConnect-Demo/iot-smart-agriculture',
    owner_idx: 2 // harshitbuilds
  },
  {
    title: 'Real-Time Markdown & Architecture Document Workspace',
    category: 'Web Application',
    tagline: 'Operational transformation document editor with live cursor sync and Mermaid charts.',
    description: 'Collaborative technical documentation editor with live code preview, auto-generating table of contents, and instant export to PDF and static sites.',
    status: 'completed',
    progress: 100,
    team_size: 3,
    required_skills: ['React', 'TypeScript', 'WebSockets', 'Tailwind CSS'],
    github_url: 'https://github.com/DevConnect-Demo/collaborative-doc-editor',
    owner_idx: 7 // nikhilcreates
  },
  {
    title: 'Developer Conference & Hackathon Event Platform',
    category: 'Web Application',
    tagline: 'Ticketing, stage livestreams, speaker schedules, and project expo voting.',
    description: 'An all-in-one event management system handling attendee registration, badge scanning, breakout room links, and community voting for hackathon winners.',
    status: 'active',
    progress: 90,
    team_size: 4,
    required_skills: ['Next.js', 'React', 'TypeScript', 'Supabase', 'Stripe'],
    github_url: 'https://github.com/DevConnect-Demo/event-expo-platform',
    owner_idx: 5 // akash_fullstack
  },
  {
    title: 'Synthetic API Monitoring & Global Ping Network',
    category: 'Developer Tools',
    tagline: 'Multi-region uptime checks, latency breakdown, and status page hosting.',
    description: 'High-frequency HTTP/gRPC/WebSocket synthetic probe system distributed across 8 global edge regions with automatic incident escalation and public status pages.',
    status: 'in_progress',
    progress: 75,
    team_size: 3,
    required_skills: ['Go', 'Docker', 'PostgreSQL', 'React', 'Tailwind CSS'],
    github_url: 'https://github.com/DevConnect-Demo/synthetic-api-monitor',
    owner_idx: 8 // kavya.dev
  },
  {
    title: 'Developer Code Snippet Vault & Sharing Platform',
    category: 'Developer Tools',
    tagline: 'Gist alternative with syntax highlighting, tag categorization, and secret redaction.',
    description: 'Secure code snippet manager with instant command line publishing via custom CLI, syntax highlighting for 120+ languages, and automatic API key sanitization.',
    status: 'completed',
    progress: 100,
    team_size: 2,
    required_skills: ['TypeScript', 'React', 'Supabase', 'Tailwind CSS'],
    github_url: 'https://github.com/DevConnect-Demo/code-snippet-vault',
    owner_idx: 14 // sneha_frontend
  },
  {
    title: 'Mental Wellness & Developer Burnout Journal',
    category: 'Web Application',
    tagline: 'Sentiment analysis on daily engineering reflections with burnout prevention tips.',
    description: 'Encrypted daily journaling app tailored for remote knowledge workers to log stress levels, celebrate small wins, and detect early symptoms of engineering burnout.',
    status: 'active',
    progress: 65,
    team_size: 3,
    required_skills: ['React', 'TypeScript', 'Tailwind CSS', 'Python', 'FastAPI'],
    github_url: 'https://github.com/DevConnect-Demo/wellness-developer-journal',
    owner_idx: 10 // tanvi_ux
  },
  {
    title: 'Real-Time Inventory & Warehouse Supply Chain SaaS',
    category: 'Web Application',
    tagline: 'Stock alerts, barcode scanning, order fulfillment, and multi-warehouse routing.',
    description: 'Enterprise inventory control platform providing real-time stock decrements, low-supply automated reorders, and printable QR asset tags.',
    status: 'in_progress',
    progress: 55,
    team_size: 4,
    required_skills: ['Java', 'Spring Boot', 'PostgreSQL', 'React', 'Docker'],
    github_url: 'https://github.com/DevConnect-Demo/inventory-supply-chain-saas',
    owner_idx: 13 // vikram.systems
  },
  {
    title: 'Adaptive Technical Skill Assessment & Quiz Platform',
    category: 'Developer Tools',
    tagline: 'Timed algorithmic challenges, interactive multiple choice, and verified skill badges.',
    description: 'An interactive testing platform where developers solve practical coding problems and verify proficiency to earn verified skill endorsements on their DevConnect profiles.',
    status: 'active',
    progress: 85,
    team_size: 3,
    required_skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    github_url: 'https://github.com/DevConnect-Demo/skill-assessment-platform',
    owner_idx: 19 // kunal.api
  },
  {
    title: 'Open Source Contribution & Bounty Tracking Mesh',
    category: 'Developer Tools',
    tagline: 'Crowdfunded issue bounties, good-first-issue discoverer, and PR verification.',
    description: 'Decentralized open-source funding platform where maintainers tag issues with cash bounties and contributors get paid immediately upon PR merge.',
    status: 'in_progress',
    progress: 70,
    team_size: 4,
    required_skills: ['TypeScript', 'Next.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
    github_url: 'https://github.com/DevConnect-Demo/open-source-bounty-mesh',
    owner_idx: 0 // arjun.codes
  }
];

// 3 Demonstration Teams
const teamsData = [
  {
    id: 'd3300000-0000-4000-c000-000000000001',
    name: 'CodeCraft Labs',
    description: 'Dedicated to architecting resilient full-stack systems, high-concurrency microservices, and modern SaaS developer tools.',
    focus: 'Full-Stack Development & SaaS Platforms',
    avatar_url: 'preset:team-1',
    owner_id: profiles[0].id, // Arjun Patel
    members: [
      { user_idx: 0, role: 'Team Lead' },
      { user_idx: 1, role: 'Frontend Lead' },
      { user_idx: 2, role: 'Systems Engineer' },
      { user_idx: 5, role: 'Full-Stack Developer' },
      { user_idx: 8, role: 'Backend Engineer' },
      { user_idx: 11, role: 'DevOps / SRE' },
      { user_idx: 14, role: 'Frontend Contributor' },
      { user_idx: 19, role: 'API Architect' },
      { user_idx: 22, role: 'QA Engineer' },
      { user_idx: 26, role: 'Contributor' }
    ]
  },
  {
    id: 'd3300000-0000-4000-c000-000000000002',
    name: 'NeuralForge AI',
    description: 'Specializing in generative AI agents, neural embeddings, natural language pipelines, and scalable computer vision models.',
    focus: 'Artificial Intelligence, Machine Learning & Data Science',
    avatar_url: 'preset:team-2',
    owner_id: profiles[3].id, // Rohan Mehta
    members: [
      { user_idx: 3, role: 'Team Lead' },
      { user_idx: 6, role: 'NLP Specialist' },
      { user_idx: 12, role: 'Data Scientist' },
      { user_idx: 17, role: 'Computer Vision Engineer' },
      { user_idx: 24, role: 'ML Engineer' },
      { user_idx: 28, role: 'AI Researcher' },
      { user_idx: 35, role: 'Data Analyst' },
      { user_idx: 38, role: 'MLOps Engineer' },
      { user_idx: 0, role: 'Backend Advisor' }
    ]
  },
  {
    id: 'd3300000-0000-4000-c000-000000000003',
    name: 'PixelStack Studio',
    description: 'Obsessed with fluid digital craft, design systems, accessible WebGL interfaces, and high-performance frontend engineering.',
    focus: 'Frontend Engineering, UI/UX & Web Performance',
    avatar_url: 'preset:team-3',
    owner_id: profiles[1].id, // Meera Nair
    members: [
      { user_idx: 1, role: 'Team Lead' },
      { user_idx: 7, role: 'Creative Developer' },
      { user_idx: 10, role: 'Product Designer' },
      { user_idx: 14, role: 'Frontend Developer' },
      { user_idx: 16, role: 'Mobile Specialist' },
      { user_idx: 20, role: 'UI Engineer' },
      { user_idx: 23, role: 'Visual Designer' },
      { user_idx: 33, role: 'UX Researcher' }
    ]
  }
];

// 40 Authentic Community Open Source Repositories
const communityRepos = [
  { name: 'react', owner: 'facebook', full_name: 'facebook/react', description: 'The library for web and native user interfaces.', html_url: 'https://github.com/facebook/react', language: 'JavaScript', stars: 228000, forks: 45000, topics: ['declarative', 'frontend', 'javascript', 'react', 'ui'] },
  { name: 'next.js', owner: 'vercel', full_name: 'vercel/next.js', description: 'The React Framework for the Web created by Vercel.', html_url: 'https://github.com/vercel/next.js', language: 'JavaScript', stars: 126000, forks: 26000, topics: ['blog', 'browser', 'compiler', 'nextjs', 'react', 'ssr'] },
  { name: 'supabase', owner: 'supabase', full_name: 'supabase/supabase', description: 'The open source Firebase alternative with Postgres, Auth, and Realtime.', html_url: 'https://github.com/supabase/supabase', language: 'TypeScript', stars: 74000, forks: 6200, topics: ['database', 'firebase', 'postgres', 'realtime', 'supabase'] },
  { name: 'vscode', owner: 'microsoft', full_name: 'microsoft/vscode', description: 'Visual Studio Code is a code editor redefined and optimized for building modern web and cloud applications.', html_url: 'https://github.com/microsoft/vscode', language: 'TypeScript', stars: 162000, forks: 30000, topics: ['developer-tools', 'editor', 'electron', 'typescript', 'vscode'] },
  { name: 'tailwindcss', owner: 'tailwindlabs', full_name: 'tailwindlabs/tailwindcss', description: 'A utility-first CSS framework for rapid UI development.', html_url: 'https://github.com/tailwindlabs/tailwindcss', language: 'TypeScript', stars: 83000, forks: 4100, topics: ['css', 'css-framework', 'design-systems', 'responsive', 'tailwind'] },
  { name: 'linux', owner: 'torvalds', full_name: 'torvalds/linux', description: 'Linux kernel source tree maintained by Linus Torvalds.', html_url: 'https://github.com/torvalds/linux', language: 'C', stars: 184000, forks: 54000, topics: ['kernel', 'linux', 'operating-system', 'systems'] },
  { name: 'core', owner: 'vuejs', full_name: 'vuejs/core', description: 'Vue.js is a progressive, incrementally-adoptable JavaScript framework.', html_url: 'https://github.com/vuejs/core', language: 'TypeScript', stars: 47000, forks: 8100, topics: ['framework', 'frontend', 'javascript', 'vue'] },
  { name: 'angular', owner: 'angular', full_name: 'angular/angular', description: 'Deliver web apps with confidence using Google web application framework.', html_url: 'https://github.com/angular/angular', language: 'TypeScript', stars: 96000, forks: 25000, topics: ['angular', 'framework', 'frontend', 'pwa', 'typescript'] },
  { name: 'node', owner: 'nodejs', full_name: 'nodejs/node', description: 'Node.js JavaScript runtime built on Chrome V8 JavaScript engine.', html_url: 'https://github.com/nodejs/node', language: 'JavaScript', stars: 107000, forks: 29000, topics: ['backend', 'javascript', 'node', 'runtime', 'server'] },
  { name: 'deno', owner: 'denoland', full_name: 'denoland/deno', description: 'A modern runtime for JavaScript and TypeScript with secure defaults.', html_url: 'https://github.com/denoland/deno', language: 'Rust', stars: 95000, forks: 5200, topics: ['deno', 'javascript', 'runtime', 'rust', 'typescript'] },
  { name: 'bun', owner: 'oven-sh', full_name: 'oven-sh/bun', description: 'Incredibly fast JavaScript runtime, bundler, test runner, and package manager.', html_url: 'https://github.com/oven-sh/bun', language: 'Zig', stars: 76000, forks: 2400, topics: ['bundler', 'javascript', 'nodejs', 'package-manager', 'runtime', 'zig'] },
  { name: 'rust', owner: 'rust-lang', full_name: 'rust-lang/rust', description: 'Empowering everyone to build reliable and efficient software.', html_url: 'https://github.com/rust-lang/rust', language: 'Rust', stars: 99000, forks: 12500, topics: ['compiler', 'language', 'programming-language', 'rust'] },
  { name: 'go', owner: 'golang', full_name: 'golang/go', description: 'The Go programming language created by Google.', html_url: 'https://github.com/golang/go', language: 'Go', stars: 124000, forks: 17500, topics: ['compiler', 'go', 'golang', 'language', 'programming-language'] },
  { name: 'kubernetes', owner: 'kubernetes', full_name: 'kubernetes/kubernetes', description: 'Production-Grade Container Scheduling and Management.', html_url: 'https://github.com/kubernetes/kubernetes', language: 'Go', stars: 111000, forks: 39000, topics: ['containers', 'docker', 'go', 'kubernetes', 'orchestration'] },
  { name: 'ui', owner: 'shadcn-ui', full_name: 'shadcn-ui/ui', description: 'Beautifully designed components that you can copy and paste into your apps.', html_url: 'https://github.com/shadcn-ui/ui', language: 'TypeScript', stars: 72000, forks: 6400, topics: ['components', 'design-system', 'radix-ui', 'react', 'tailwind'] },
  { name: 'react-native', owner: 'facebook', full_name: 'facebook/react-native', description: 'A framework for building native applications using React.', html_url: 'https://github.com/facebook/react-native', language: 'C++', stars: 118000, forks: 24000, topics: ['android', 'ios', 'mobile', 'native', 'react', 'react-native'] },
  { name: 'flutter', owner: 'flutter', full_name: 'flutter/flutter', description: 'Flutter makes it easy and fast to build beautiful apps for mobile and beyond.', html_url: 'https://github.com/flutter/flutter', language: 'Dart', stars: 165000, forks: 27000, topics: ['android', 'cross-platform', 'dart', 'flutter', 'ios', 'mobile'] },
  { name: 'axios', owner: 'axios', full_name: 'axios/axios', description: 'Promise based HTTP client for the browser and node.js.', html_url: 'https://github.com/axios/axios', language: 'JavaScript', stars: 104000, forks: 10600, topics: ['ajax', 'http', 'http-client', 'javascript', 'promise'] },
  { name: 'express', owner: 'expressjs', full_name: 'expressjs/express', description: 'Fast, unopinionated, minimalist web framework for node.', html_url: 'https://github.com/expressjs/express', language: 'JavaScript', stars: 64000, forks: 15500, topics: ['express', 'framework', 'middleware', 'node', 'rest', 'web'] },
  { name: 'prisma', owner: 'prisma', full_name: 'prisma/prisma', description: 'Next-generation ORM for Node.js & TypeScript with schema migrations.', html_url: 'https://github.com/prisma/prisma', language: 'TypeScript', stars: 40000, forks: 1500, topics: ['database', 'orm', 'postgresql', 'prisma', 'sql', 'typescript'] },
  { name: 'trpc', owner: 'trpc', full_name: 'trpc/trpc', description: 'Move Fast and Break Nothing. End-to-end typesafe APIs made easy.', html_url: 'https://github.com/trpc/trpc', language: 'TypeScript', stars: 34500, forks: 1200, topics: ['api', 'fullstack', 'rpc', 'trpc', 'typescript'] },
  { name: 'query', owner: 'TanStack', full_name: 'TanStack/query', description: 'Powerful asynchronous state management, data-fetching, and caching for TS/JS.', html_url: 'https://github.com/TanStack/query', language: 'TypeScript', stars: 42000, forks: 2700, topics: ['cache', 'data-fetching', 'react', 'react-query', 'typescript'] },
  { name: 'vite', owner: 'vitejs', full_name: 'vitejs/vite', description: 'Next generation frontend tooling. It is fast!', html_url: 'https://github.com/vitejs/vite', language: 'TypeScript', stars: 70000, forks: 6100, topics: ['bundler', 'devtools', 'es-modules', 'frontend', 'vite'] },
  { name: 'electron', owner: 'electron', full_name: 'electron/electron', description: 'Build cross-platform desktop apps with JavaScript, HTML, and CSS.', html_url: 'https://github.com/electron/electron', language: 'C++', stars: 114000, forks: 15000, topics: ['c-plus-plus', 'chrome', 'css', 'desktop', 'electron', 'html'] },
  { name: 'kafka', owner: 'apache', full_name: 'apache/kafka', description: 'Mirror of Apache Kafka: distributed streaming platform.', html_url: 'https://github.com/apache/kafka', language: 'Java', stars: 28500, forks: 14000, topics: ['distributed-systems', 'event-streaming', 'java', 'kafka', 'messaging'] },
  { name: 'redis', owner: 'redis', full_name: 'redis/redis', description: 'Redis is an in-memory database that persists on disk. The data model is key-value.', html_url: 'https://github.com/redis/redis', language: 'C', stars: 65500, forks: 23000, topics: ['cache', 'database', 'in-memory', 'key-value', 'nosql', 'redis'] },
  { name: 'postgres', owner: 'postgres', full_name: 'postgres/postgres', description: 'Mirror of the official PostgreSQL GIT repository.', html_url: 'https://github.com/postgres/postgres', language: 'C', stars: 15500, forks: 5200, topics: ['database', 'postgres', 'postgresql', 'relational-database', 'sql'] },
  { name: 'tensorflow', owner: 'tensorflow', full_name: 'tensorflow/tensorflow', description: 'An Open Source Machine Learning Framework for Everyone.', html_url: 'https://github.com/tensorflow/tensorflow', language: 'C++', stars: 187000, forks: 89000, topics: ['deep-learning', 'machine-learning', 'neural-network', 'python', 'tensorflow'] },
  { name: 'pytorch', owner: 'pytorch', full_name: 'pytorch/pytorch', description: 'Tensors and Dynamic neural networks in Python with strong GPU acceleration.', html_url: 'https://github.com/pytorch/pytorch', language: 'Python', stars: 85000, forks: 22500, topics: ['autograd', 'deep-learning', 'gpu', 'neural-network', 'python', 'pytorch'] },
  { name: 'langchain', owner: 'langchain-ai', full_name: 'langchain-ai/langchain', description: 'Build context-aware reasoning applications with LangChain.', html_url: 'https://github.com/langchain-ai/langchain', language: 'Python', stars: 97500, forks: 15500, topics: ['ai', 'langchain', 'llm', 'nlp', 'openai', 'python'] },
  { name: 'transformers', owner: 'huggingface', full_name: 'huggingface/transformers', description: 'State-of-the-art Machine Learning for Pytorch, TensorFlow, and JAX.', html_url: 'https://github.com/huggingface/transformers', language: 'Python', stars: 137000, forks: 26000, topics: ['bert', 'deep-learning', 'huggingface', 'nlp', 'pytorch', 'transformers'] },
  { name: 'TypeScript', owner: 'microsoft', full_name: 'microsoft/TypeScript', description: 'TypeScript is a superset of JavaScript that compiles to clean JavaScript output.', html_url: 'https://github.com/microsoft/TypeScript', language: 'TypeScript', stars: 100500, forks: 12500, topics: ['javascript', 'language', 'microsoft', 'typechecker', 'typescript'] },
  { name: 'flask', owner: 'pallets', full_name: 'pallets/flask', description: 'The Python micro framework for building web applications.', html_url: 'https://github.com/pallets/flask', language: 'Python', stars: 68500, forks: 16000, topics: ['flask', 'framework', 'jinja', 'pallets', 'python', 'web-framework'] },
  { name: 'django', owner: 'django', full_name: 'django/django', description: 'The Web framework for perfectionists with deadlines.', html_url: 'https://github.com/django/django', language: 'Python', stars: 80500, forks: 31500, topics: ['django', 'framework', 'models', 'orm', 'python', 'views'] },
  { name: 'spring-boot', owner: 'spring-projects', full_name: 'spring-projects/spring-boot', description: 'Spring Boot helps you to create stand-alone, production-grade Spring based Applications.', html_url: 'https://github.com/spring-projects/spring-boot', language: 'Java', stars: 75500, forks: 40500, topics: ['framework', 'java', 'microservices', 'spring', 'spring-boot'] },
  { name: 'fastapi', owner: 'fastapi', full_name: 'fastapi/fastapi', description: 'FastAPI framework, high performance, easy to learn, fast to code, ready for production.', html_url: 'https://github.com/fastapi/fastapi', language: 'Python', stars: 78500, forks: 6400, topics: ['async', 'fastapi', 'openapi', 'pydantic', 'python', 'rest'] },
  { name: 'uv', owner: 'astral-sh', full_name: 'astral-sh/uv', description: 'An extremely fast Python package and project manager, written in Rust.', html_url: 'https://github.com/astral-sh/uv', language: 'Rust', stars: 44000, forks: 1200, topics: ['package-manager', 'pip', 'python', 'rust', 'uv'] },
  { name: 'ollama', owner: 'ollama', full_name: 'ollama/ollama', description: 'Get up and running with Llama 3, Mistral, Gemma 2, and other large language models.', html_url: 'https://github.com/ollama/ollama', language: 'Go', stars: 104000, forks: 9200, topics: ['ai', 'go', 'llama', 'llm', 'local-ai', 'ollama'] },
  { name: 'vllm', owner: 'vllm-project', full_name: 'vllm-project/vllm', description: 'A high-throughput and memory-efficient inference and serving engine for LLMs.', html_url: 'https://github.com/vllm-project/vllm', language: 'Python', stars: 37500, forks: 4500, topics: ['cuda', 'inference', 'llm', 'pagedattention', 'pytorch', 'vllm'] },
  { name: 'docker-cli', owner: 'docker', full_name: 'docker/cli', description: 'The official CLI tool for managing Docker containers and images.', html_url: 'https://github.com/docker/cli', language: 'Go', stars: 5500, forks: 2400, topics: ['containers', 'docker', 'docker-cli', 'go'] }
];

console.log(`Configured ${communityRepos.length} authentic open source repositories.`);

// Generate conversations & realistic messages
const directConversations = [
  {
    user1_idx: 0, // Arjun
    user2_idx: 1, // Meera
    messages: [
      { sender: 0, text: 'Hey Meera! Are you available to review the dashboard telemetry architecture?' },
      { sender: 1, text: 'Hey Arjun! Absolutely. I was just reviewing the Recharts dual-gradient velocity implementation. It looks super crisp.' },
      { sender: 0, text: 'Awesome. We need to hook up the 30-day velocity metric to the live Supabase project tasks.' },
      { sender: 1, text: 'Great, I can handle the frontend data formatting and state hooks tonight. Let me know once the endpoint is ready.' },
      { sender: 0, text: 'Pushed the database function! Let me know if you hit any TypeScript typing mismatches.' }
    ]
  },
  {
    user1_idx: 2, // Harshit
    user2_idx: 0, // Arjun
    messages: [
      { sender: 2, text: 'Arjun, did you get a chance to test the Wasm client-side parser crate?' },
      { sender: 0, text: 'Yes! It reduced our JSON parsing bottleneck by almost 4x in the benchmark run.' },
      { sender: 2, text: 'Incredible. I just added SIMD vectorization. Compiling to wasm32-unknown-unknown now.' },
      { sender: 0, text: 'Let us merge it into the Distributed Task Orchestrator repo before tomorrow morning sprint sync.' }
    ]
  },
  {
    user1_idx: 3, // Rohan
    user2_idx: 6, // Ishita
    messages: [
      { sender: 3, text: 'Hey Ishita, how is the embedding pipeline coming along for the resume analyzer?' },
      { sender: 6, text: 'Hey Rohan! I swapped in the new bge-large model. Top-3 recall jumped from 72% to 89% on our benchmark test dataset!' },
      { sender: 3, text: '89% is huge. Are we within our 150ms latency SLA on CPU?' },
      { sender: 6, text: 'Yes, quantized it with ONNX Runtime. Running at ~85ms per document chunk now!' },
      { sender: 3, text: 'Outstanding work. Let us package the FastAPI endpoint and connect the DevConnect discovery cards.' }
    ]
  },
  {
    user1_idx: 4, // Ananya
    user2_idx: 11, // Siddharth
    messages: [
      { sender: 4, text: 'Siddharth, Prometheus scrape intervals are set to 15s in the staging cluster.' },
      { sender: 11, text: 'Thanks Ananya. I noticed a small memory leak in the WebSocket proxy during load testing.' },
      { sender: 4, text: 'Good catch. Let us check the connection close handlers. I will push a patch branch.' },
      { sender: 11, text: 'Sounds good, will monitor the Grafana pod memory graph.' }
    ]
  },
  {
    user1_idx: 1, // Meera
    user2_idx: 7, // Nikhil
    messages: [
      { sender: 1, text: 'Nikhil, love the new editorial dossier card styling!' },
      { sender: 7, text: 'Thanks Meera! Space Grotesk headings with fine 1px borders really gives that premium editorial SaaS vibe.' },
      { sender: 1, text: 'Totally agree. Make sure the radial spotlight hover effect on CardSpotlight maintains the 60fps frame rate.' },
      { sender: 7, text: 'Tested on both Chrome and Safari—zero layout thrashing.' }
    ]
  },
  {
    user1_idx: 8, // Kavya
    user2_idx: 9, // Aditya
    messages: [
      { sender: 8, text: 'Aditya, we need to ensure the Supabase Realtime channels validate user session JWTs properly.' },
      { sender: 9, text: 'Already on it! Audited the PostgreSQL RLS policies. Direct message tables only allow authenticated participants.' },
      { sender: 8, text: 'Perfect. We cannot have messages leaking between demo channels and real users.' },
      { sender: 9, text: 'Everything is isolated under the demo partition with strict auth.uid() checks.' }
    ]
  }
];

// Output SQL and TS files
let sql = `-- ============================================================================
-- DEVCONNECT DEMO COMMUNITY SCHEMA EXTENSIONS & COMPLETE DATA SEED
-- Idempotent, safe, and cleanly isolated with is_demo = true
-- ============================================================================

-- 1. Ensure schema extensions exist
ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS professional_description JSONB DEFAULT '{}'::jsonb;
ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS preset_avatar_id TEXT;

ALTER TABLE IF EXISTS public.projects ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS public.conversations ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS public.tasks ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Allow demo profiles to exist without requiring entries in auth.users
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. Teams Table
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  focus TEXT,
  avatar_url TEXT,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_demo BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'Contributor',
  joined_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(team_id, user_id)
);

-- 3. Community Open Source Repositories Table
CREATE TABLE IF NOT EXISTS public.community_repositories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner TEXT NOT NULL,
  full_name TEXT NOT NULL UNIQUE,
  description TEXT,
  html_url TEXT NOT NULL,
  language TEXT,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  topics TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable RLS on newly created tables
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_repositories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Teams are readable by everyone" ON public.teams;
CREATE POLICY "Teams are readable by everyone" ON public.teams FOR SELECT USING (true);

DROP POLICY IF EXISTS "Team members readable by everyone" ON public.team_members;
CREATE POLICY "Team members readable by everyone" ON public.team_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Community repos are readable by everyone" ON public.community_repositories;
CREATE POLICY "Community repos are readable by everyone" ON public.community_repositories FOR SELECT USING (true);

-- ============================================================================
-- 4. INSERT 40 DEMO DEVELOPER PROFILES
-- ============================================================================
`;

// Build Profile Inserts
profiles.forEach((p) => {
  const pDescJson = JSON.stringify(p.professional_description).replace(/'/g, "''");
  const interestsArray = `ARRAY[${p.interests.map(i => `'${i.replace(/'/g, "''")}'`).join(', ')}]`;

  sql += `
INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  '${p.id}',
  '${p.username}',
  '${p.full_name.replace(/'/g, "''")}',
  '${p.headline.replace(/'/g, "''")}',
  '${p.bio.replace(/'/g, "''")}',
  '${p.location.replace(/'/g, "''")}',
  '${p.github_username}',
  '${p.website_url}',
  '${p.experience_level}',
  '${p.availability_status}',
  ${p.weekly_hours_available},
  ${interestsArray},
  '${p.preset_avatar_id}',
  true,
  true,
  '${pDescJson}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;
`;
});

sql += `
-- ============================================================================
-- 5. INSERT 30 DEMONSTRATION COMMUNITY PROJECTS
-- ============================================================================
`;

projectsList.forEach((proj, idx) => {
  const projId = `d3300000-0000-4000-b000-0000000000${(idx + 1).toString().padStart(2, '0')}`;
  const slug = proj.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + `-${idx + 100}`;
  const ownerId = profiles[proj.owner_idx % profiles.length].id;
  const skillsArray = `ARRAY[${proj.required_skills.map(s => `'${s.replace(/'/g, "''")}'`).join(', ')}]`;

  sql += `
INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  '${projId}',
  '${ownerId}',
  '${proj.title.replace(/'/g, "''")}',
  '${slug}',
  '${proj.tagline.replace(/'/g, "''")}',
  '${proj.description.replace(/'/g, "''")}',
  '${proj.category}',
  '${proj.status === 'in_progress' ? 'in_progress' : proj.status === 'completed' ? 'completed' : proj.status === 'active' ? 'active' : 'planning'}',
  ${proj.team_size},
  ${skillsArray},
  '${proj.github_url}',
  true,
  true
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  is_demo = true;

-- Ensure owner is in project_members
INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('${projId}', '${ownerId}', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;
`;

  // Add 2-3 members to each project
  for (let m = 1; m <= 3; m++) {
    const memberIdx = (proj.owner_idx + m * 3) % profiles.length;
    const memberId = profiles[memberIdx].id;
    const role = m === 1 ? 'lead' : m === 2 ? 'contributor' : 'reviewer';
    sql += `
INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('${projId}', '${memberId}', '${role}')
ON CONFLICT (project_id, user_id) DO NOTHING;
`;
  }

  // Add Kanban tasks for projects
  sql += `
INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('${projId}', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', '${ownerId}', 0, true),
  ('${projId}', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', '${ownerId}', 1, true),
  ('${projId}', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', '${ownerId}', 2, true)
ON CONFLICT DO NOTHING;
`;
});

sql += `
-- ============================================================================
-- 6. INSERT 3 DEMONSTRATION TEAMS
-- ============================================================================
`;

teamsData.forEach((team) => {
  sql += `
INSERT INTO public.teams (id, name, description, focus, avatar_url, owner_id, is_demo)
VALUES (
  '${team.id}',
  '${team.name}',
  '${team.description.replace(/'/g, "''")}',
  '${team.focus}',
  '${team.avatar_url}',
  '${team.owner_id}',
  true
)
ON CONFLICT (id) DO UPDATE SET
  description = EXCLUDED.description,
  focus = EXCLUDED.focus;
`;

  team.members.forEach((m) => {
    const memberId = profiles[m.user_idx].id;
    sql += `
INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('${team.id}', '${memberId}', '${m.role}')
ON CONFLICT (team_id, user_id) DO NOTHING;
`;
  });
});

sql += `
-- ============================================================================
-- 7. INSERT 40 COMMUNITY OPEN SOURCE REPOSITORIES
-- ============================================================================
`;

communityRepos.forEach((repo) => {
  const topicsArray = `ARRAY[${repo.topics.map(t => `'${t}'`).join(', ')}]`;
  sql += `
INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  '${repo.name}',
  '${repo.owner}',
  '${repo.full_name}',
  '${repo.description.replace(/'/g, "''")}',
  '${repo.html_url}',
  '${repo.language}',
  ${repo.stars},
  ${repo.forks},
  ${topicsArray}
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;
`;
});

sql += `
-- ============================================================================
-- 8. INSERT DEMO CONVERSATIONS & MESSAGES
-- ============================================================================
`;

directConversations.forEach((conv, cIdx) => {
  const convId = `d3300000-0000-4000-d000-0000000000${(cIdx + 1).toString().padStart(2, '0')}`;
  const u1 = profiles[conv.user1_idx];
  const u2 = profiles[conv.user2_idx];

  sql += `
INSERT INTO public.conversations (id, type, name, is_demo)
VALUES ('${convId}', 'direct', '${u1.full_name} & ${u2.full_name}', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.conversation_members (conversation_id, user_id)
VALUES 
  ('${convId}', '${u1.id}'),
  ('${convId}', '${u2.id}')
ON CONFLICT (conversation_id, user_id) DO NOTHING;
`;

  conv.messages.forEach((msg, mIdx) => {
    const senderId = msg.sender === 0 ? u1.id : u2.id;
    const msgId = `d3300000-0000-4000-e000-00000000${cIdx.toString().padStart(2, '0')}${mIdx.toString().padStart(2, '0')}`;
    const minutesAgo = (conv.messages.length - mIdx) * 15;
    sql += `
INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  '${msgId}',
  '${convId}',
  '${senderId}',
  '${msg.text.replace(/'/g, "''")}',
  TIMEZONE('utc', NOW()) - INTERVAL '${minutesAgo} minutes'
)
ON CONFLICT (id) DO NOTHING;
`;
  });
});

sql += `
-- ============================================================================
-- 9. INSERT REALISTIC ACTIVITY LOGS & NOTIFICATIONS
-- ============================================================================
INSERT INTO public.activity_logs (user_id, project_id, action_type, description, created_at)
VALUES 
  ('${profiles[0].id}', 'd3300000-0000-4000-b000-000000000002', 'milestone_completed', 'Arjun completed sprint milestone: Distributed WebSocket mesh benchmarks', NOW() - INTERVAL '2 hours'),
  ('${profiles[1].id}', 'd3300000-0000-4000-b000-000000000008', 'task_updated', 'Meera updated task status to Done: Redesign Three-Column Messaging UI', NOW() - INTERVAL '4 hours'),
  ('${profiles[3].id}', 'd3300000-0000-4000-b000-000000000001', 'project_created', 'Rohan published new project: AI Resume & Technical Skill Analyzer', NOW() - INTERVAL '1 day'),
  ('${profiles[2].id}', 'd3300000-0000-4000-b000-000000000012', 'task_created', 'Harshit created task: Compile Rust AST parser to WebAssembly binary', NOW() - INTERVAL '2 days'),
  ('${profiles[5].id}', 'd3300000-0000-4000-b000-000000000003', 'member_joined', 'Akash joined project team: Modern E-Commerce Headless Storefront', NOW() - INTERVAL '3 days');

-- ============================================================================
-- 10. IDEMPOTENT CLEANUP PROCEDURE
-- ============================================================================
CREATE OR REPLACE FUNCTION public.cleanup_demo_data()
RETURNS void AS $$
BEGIN
  DELETE FROM public.messages WHERE conversation_id IN (SELECT id FROM public.conversations WHERE is_demo = true);
  DELETE FROM public.conversation_members WHERE conversation_id IN (SELECT id FROM public.conversations WHERE is_demo = true);
  DELETE FROM public.conversations WHERE is_demo = true;
  DELETE FROM public.tasks WHERE is_demo = true;
  DELETE FROM public.team_members WHERE team_id IN (SELECT id FROM public.teams WHERE is_demo = true);
  DELETE FROM public.teams WHERE is_demo = true;
  DELETE FROM public.project_members WHERE project_id IN (SELECT id FROM public.projects WHERE is_demo = true);
  DELETE FROM public.projects WHERE is_demo = true;
  DELETE FROM public.profiles WHERE is_demo = true;
  DELETE FROM public.community_repositories;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

// Save SQL Migration
const sqlPath = path.join(__dirname, '../supabase/migrations/20261107000001_demo_community_schema_and_seed.sql');
fs.writeFileSync(sqlPath, sql, 'utf-8');
console.log(`Saved SQL migration to ${sqlPath} (${(sql.length / 1024).toFixed(1)} KB)`);

// Also save seed_demo_community.sql for convenience
const seedPath = path.join(__dirname, '../supabase/seed_demo_community.sql');
fs.writeFileSync(seedPath, sql, 'utf-8');
console.log(`Saved standalone seed SQL to ${seedPath}`);

// Generate TypeScript datasets file for client-side seamless demo mode
const tsContent = `// Auto-generated DevConnect Demo Community Dataset
// Provides identical, fully-typed data for both client-side showcase and database sync

import { Profile, Project, Skill } from '@/types/database.types';

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profile?: Profile;
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
  sender?: Profile;
}

export interface DemoConversation {
  id: string;
  type: 'direct' | 'project' | 'group';
  name: string;
  members: { user_id: string; profile: Profile }[];
  messages: DemoMessage[];
  last_message?: DemoMessage;
}

export const DEMO_PROFILES: (Profile & { skillsList: string[]; professional_description?: any })[] = ${JSON.stringify(profiles.map(p => ({
  id: p.id,
  username: p.username,
  full_name: p.full_name,
  avatar_url: p.preset_avatar_id,
  bio: p.bio,
  headline: p.headline,
  location: p.location,
  website_url: p.website_url,
  github_username: p.github_username,
  experience_level: p.experience_level,
  availability_status: p.availability_status,
  weekly_hours_available: p.weekly_hours_available,
  interests: p.interests,
  collaboration_preferences: {
    remoteOnly: true,
    lookingFor: p.interests,
    preferredTeamSize: '3-5'
  },
  is_onboarded: true,
  is_demo: true,
  created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  updated_at: new Date().toISOString(),
  skillsList: p.skills,
  professional_description: p.professional_description
})), null, 2)};

export const DEMO_PROJECTS: Project[] = ${JSON.stringify(projectsList.map((p, idx) => ({
  id: `d3300000-0000-4000-b000-0000000000${(idx + 1).toString().padStart(2, '0')}`,
  owner_id: profiles[p.owner_idx % profiles.length].id,
  title: p.title,
  slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + `-${idx + 100}`,
  tagline: p.tagline,
  description: p.description,
  category: p.category,
  status: p.status,
  team_size_needed: p.team_size,
  deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * (30 + idx * 2)).toISOString(),
  collaboration_requirements: '5-15 hrs/wk, async pull requests, weekly Discord check-ins',
  github_repo_url: p.github_url,
  live_demo_url: 'https://deew101.github.io/DevConnect/',
  is_published: true,
  is_demo: true,
  required_skills: p.required_skills,
  created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * (idx + 2)).toISOString(),
  updated_at: new Date().toISOString(),
  tasks_count: 5,
  completed_tasks_count: Math.round((p.progress / 100) * 5)
})), null, 2)};

export const DEMO_TEAMS: Team[] = ${JSON.stringify(teamsData.map(t => ({
  id: t.id,
  name: t.name,
  description: t.description,
  focus: t.focus,
  avatar_url: t.avatar_url,
  owner_id: t.owner_id,
  is_demo: true,
  active_projects_count: t.id.endsWith('1') ? 8 : t.id.endsWith('2') ? 6 : 7,
  members: t.members.map(m => ({
    id: 'mem-' + Math.random().toString(36).substring(2, 9),
    team_id: t.id,
    user_id: profiles[m.user_idx].id,
    role: m.role,
    joined_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    profile: profiles[m.user_idx]
  }))
})), null, 2)};

export const DEMO_COMMUNITY_REPOS: CommunityRepository[] = ${JSON.stringify(communityRepos.map((r, i) => ({
  id: 'repo-' + (i + 1),
  name: r.name,
  owner: r.owner,
  full_name: r.full_name,
  description: r.description,
  html_url: r.html_url,
  language: r.language,
  stars: r.stars,
  forks: r.forks,
  topics: r.topics,
  updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12 * (i + 1)).toISOString()
})), null, 2)};

export const DEMO_CONVERSATIONS: DemoConversation[] = ${JSON.stringify(directConversations.map((c, cIdx) => {
  const u1 = profiles[c.user1_idx];
  const u2 = profiles[c.user2_idx];
  const convId = `d3300000-0000-4000-d000-0000000000${(cIdx + 1).toString().padStart(2, '0')}`;
  const msgs = c.messages.map((m, mIdx) => ({
    id: `d3300000-0000-4000-e000-00000000${cIdx.toString().padStart(2, '0')}${mIdx.toString().padStart(2, '0')}`,
    conversation_id: convId,
    sender_id: m.sender === 0 ? u1.id : u2.id,
    content: m.text,
    created_at: new Date(Date.now() - 1000 * 60 * (c.messages.length - mIdx) * 20).toISOString(),
    sender: m.sender === 0 ? u1 : u2
  }));
  return {
    id: convId,
    type: 'direct',
    name: `${u1.full_name} & ${u2.full_name}`,
    members: [
      { user_id: u1.id, profile: u1 },
      { user_id: u2.id, profile: u2 }
    ],
    messages: msgs,
    last_message: msgs[msgs.length - 1]
  };
}), null, 2)};
`;

const tsPath = path.join(__dirname, '../src/data/demoCommunityData.ts');
fs.mkdirSync(path.dirname(tsPath), { recursive: true });
fs.writeFileSync(tsPath, tsContent, 'utf-8');
console.log(`Saved TypeScript dataset to ${tsPath} (${(tsContent.length / 1024).toFixed(1)} KB)`);
