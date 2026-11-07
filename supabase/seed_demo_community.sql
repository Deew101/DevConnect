-- ============================================================================
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

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000001',
  'arjun.codes',
  'Arjun Patel',
  'Senior Full-Stack Architect | Distributed Systems & Go',
  'Passionate about distributed microservices, event streams, and building developer-first developer tooling. Open source advocate.',
  'Bangalore, India',
  'arjun-patel',
  'https://arjunpatel.dev',
  'Senior',
  'open_to_collaborate',
  15,
  ARRAY['Distributed Systems', 'Go', 'Microservices', 'Kubernetes'],
  'preset:dev-1',
  true,
  true,
  '{"bio":"Full-stack software architect with 6+ years shipping high-throughput backends and reactive React frontends.","technical_interests":["Distributed consensus (Raft/Paxos)","High-concurrency Go services","Rust for systems programming","Edge computing"],"current_goals":"Architecting fault-tolerant task orchestrators and mentoring early-career engineers in distributed systems.","collaboration_style":"Async-first, documented PRs, clear architecture decision records (ADRs), weekly sprint sync.","target_projects":["Developer infrastructure tools","Real-time telemetry platforms","Open-source distributed databases"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000002',
  'dev_meera',
  'Meera Nair',
  'Lead Frontend Engineer | UI/UX & Design Systems',
  'Obsessed with fluid micro-interactions, accessible UI architecture, and modern WebGL canvases. Linear & Vercel design aesthetic enthusiast.',
  'Mumbai, India',
  'meera-nair',
  'https://meera.design',
  'Lead',
  'open_to_collaborate',
  12,
  ARRAY['Design Systems', 'React', 'Framer Motion', 'Tailwind CSS', 'Web Performance'],
  'preset:dev-2',
  true,
  true,
  '{"bio":"Design systems engineer crafting pixel-perfect, accessible component libraries and high-performance React frontends.","technical_interests":["Design tokens & Tailwind orchestration","Complex animation choreographies with Framer Motion","Accessible ARIA patterns"],"current_goals":"Building frictionless developer tool interfaces with sub-100ms interaction latencies.","collaboration_style":"Pair programming on critical components, Figma tokens-to-code workflow, proactive UI reviews.","target_projects":["Dark-mode first developer SaaS dashboards","Interactive canvas applications","Component design libraries"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000003',
  'harshitbuilds',
  'Harshit Sharma',
  'Systems Engineer | Rust, WebAssembly & Low Latency',
  'Compiling Rust to Wasm, optimizing memory layouts, and building ultra-fast developer platforms with zero-cost abstractions.',
  'Delhi NCR, India',
  'harshit-builds',
  'https://harshit.systems',
  'Senior',
  'available',
  20,
  ARRAY['Rust', 'WebAssembly', 'Performance', 'Compilers'],
  'preset:dev-3',
  true,
  true,
  '{"bio":"Systems programmer focused on high-throughput services, Wasm runtimes, and concurrent network protocols in Rust.","technical_interests":["Tokio async runtimes","SIMD optimizations","Zero-copy serialization (FlatBuffers)","Cross-compilation"],"current_goals":"Creating blazing-fast edge processing engines that run seamlessly in browser and cloud.","collaboration_style":"Benchmark-driven development, comprehensive integration tests, async GitHub reviews.","target_projects":["Wasm-powered client runtime engines","Edge compute proxies","Distributed cache clusters"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000004',
  'rohanxdev',
  'Rohan Mehta',
  'AI/ML Researcher & LLM Orchestration Engineer',
  'Fine-tuning open weights models, building agentic reasoning workflows, and optimizing vector search pipelines with LangChain & PyTorch.',
  'Pune, India',
  'rohan-mehta',
  'https://rohanmehta.ai',
  'Mid-Level',
  'open_to_collaborate',
  10,
  ARRAY['AI Agents', 'PyTorch', 'Vector Databases', 'LangChain'],
  'preset:dev-4',
  true,
  true,
  '{"bio":"Machine learning specialist developing production RAG systems, model evaluation harnesses, and multi-agent systems.","technical_interests":["Quantized LLM deployment (GGUF/vLLM)","Hierarchical RAG architectures","Tool-calling agents"],"current_goals":"Fine-tuning specialized coding assistant models and building autonomous pair-programming pipelines.","collaboration_style":"Experiment notebooks with clear metrics, reproducible validation sets, weekly sprint check-ins.","target_projects":["AI code reviewers","Automated developer matchmaking engines","Semantic code search"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000005',
  'ananya.codes',
  'Ananya Roy',
  'Cloud Native & Platform Engineer | Kubernetes & Helm',
  'Automating multi-cloud deployments, GitOps pipelines with ArgoCD, and maintaining 99.99% reliability for developer workloads.',
  'Hyderabad, India',
  'ananya-roy',
  'https://ananya.cloud',
  'Senior',
  'busy',
  8,
  ARRAY['Kubernetes', 'Terraform', 'CI/CD', 'AWS', 'Observability'],
  'preset:dev-5',
  true,
  true,
  '{"bio":"Platform engineer specializing in infrastructure-as-code, zero-trust cloud security, and resilient Kubernetes clusters.","technical_interests":["GitOps automation","eBPF networking with Cilium","OpenTelemetry observability stacks","Cost optimization"],"current_goals":"Building ephemeral preview environment platforms for fast pull-request testing.","collaboration_style":"Terraform modules with strict PR linting, automated staging deployments, blameless post-mortems.","target_projects":["Developer platform orchestrators","Cloud monitoring dashboards","Automated CI/CD pipelines"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000006',
  'akash_fullstack',
  'Akash Verma',
  'Full-Stack Developer | Next.js, Node.js & Supabase',
  'Shipping clean SaaS products from prototype to production. Fan of PostgreSQL row-level security and TypeScript end-to-end.',
  'Chennai, India',
  'akash-verma',
  'https://akashverma.dev',
  'Mid-Level',
  'open_to_collaborate',
  16,
  ARRAY['Next.js', 'Supabase', 'TypeScript', 'Tailwind CSS'],
  'preset:dev-6',
  true,
  true,
  '{"bio":"Product-focused full-stack engineer who loves rapid prototyping and turning complex requirements into clean applications.","technical_interests":["Type-safe RPC (tRPC)","Supabase Realtime & PostgreSQL triggers","Responsive UI architecture"],"current_goals":"Collaborating on open-source developer networking tools and student portfolio ecosystems.","collaboration_style":"Daily async updates on Slack/Discord, clean atomic git commits, rapid feature iterations.","target_projects":["Developer job match platforms","Real-time collaborative whiteboards","Project management SaaS"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000007',
  'ishita.ml',
  'Ishita Sen',
  'NLP & Deep Learning Engineer | Transformers & GenAI',
  'Building natural language understanding pipelines, custom embeddings, and conversational AI agents with Hugging Face & PyTorch.',
  'Kolkata, India',
  'ishita-sen',
  'https://ishita.tech',
  'Mid-Level',
  'open_to_collaborate',
  12,
  ARRAY['Transformers', 'Hugging Face', 'Python', 'Vector Search'],
  'preset:dev-7',
  true,
  true,
  '{"bio":"Deep learning practitioner working on state-of-the-art NLP models, embedding clustering, and domain adaptation.","technical_interests":["Parameter-efficient fine-tuning (LoRA/QLoRA)","Semantic similarity matching","Contextual summarization"],"current_goals":"Developing semantic matching models for pairing developers with open-source project needs.","collaboration_style":"Open notebook sharing, reproducible experimental pipelines, structured model documentation.","target_projects":["AI resume & skill analysers","Intelligent search engines","Code sentiment & review tools"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000008',
  'nikhilcreates',
  'Nikhil Deshmukh',
  'Creative Developer & UI/UX Designer | 3D & WebGL',
  'Bridging design and code. Creating tactile interfaces, 3D web experiences, and micro-interactions that make software feel alive.',
  'Bengaluru, India',
  'nikhil-deshmukh',
  'https://nikhil.design',
  'Senior',
  'open_to_collaborate',
  14,
  ARRAY['UI/UX', 'Three.js', 'Figma', 'Framer Motion', 'Tailwind CSS'],
  'preset:dev-8',
  true,
  true,
  '{"bio":"Creative technologist with 5+ years crafting distinct visual identities and interactive digital experiences.","technical_interests":["Interactive shader art","High-contrast typography systems","Haptic feedback in web interfaces"],"current_goals":"Redefining developer tools to possess the aesthetic refinement of editorial publications.","collaboration_style":"Figma-first design exploration followed by high-fidelity React implementation and polish passes.","target_projects":["Editorial developer blogs","Interactive documentation portals","Creative portfolio builders"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000009',
  'kavya.dev',
  'Kavya Iyer',
  'Backend Infrastructure Engineer | Go, gRPC & Kafka',
  'Designing high-volume streaming architectures, distributed event buses, and resilient API gateways in Go and PostgreSQL.',
  'Kochi, India',
  'kavya-iyer',
  'https://kavyaiyer.io',
  'Lead',
  'available',
  18,
  ARRAY['Go', 'Kafka', 'gRPC', 'Database Internals'],
  'preset:dev-9',
  true,
  true,
  '{"bio":"Infrastructure and backend specialist with a track record of scaling distributed backends past 100k requests/second.","technical_interests":["Event-driven systems (Kafka/RabbitMQ)","Postgres query planner tuning","Strict contract-driven gRPC APIs"],"current_goals":"Mentoring junior developers and architecting open source backends for collaborative tooling.","collaboration_style":"Thorough code reviews with benchmark comparisons, detailed system schematics, clear milestone roadmaps.","target_projects":["Real-time messaging engines","API monitoring & telemetry services","Event-sourced task platforms"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000010',
  'adityastacks',
  'Aditya Joshi',
  'Cybersecurity Engineer & AppSec Specialist',
  'Securing cloud applications, hardening authentication workflows, and performing vulnerability assessments and penetration testing.',
  'Ahmedabad, India',
  'aditya-sec',
  'https://adityajoshi.security',
  'Senior',
  'open_to_collaborate',
  10,
  ARRAY['Cybersecurity', 'OAuth2', 'Zero Trust', 'AppSec', 'Linux'],
  'preset:dev-10',
  true,
  true,
  '{"bio":"Information security engineer focused on defending web applications against modern threat vectors and API vulnerabilities.","technical_interests":["OAuth 2.1 / OIDC protocols","Postgres RLS security audits","Automated SAST/DAST in CI/CD pipelines"],"current_goals":"Building secure-by-default developer templates and open-source compliance checkers.","collaboration_style":"Security threat modeling during design phase, peer review of sensitive auth paths, defensive coding standards.","target_projects":["Cybersecurity monitoring tools","Identity & access management modules","API penetration testing suites"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000011',
  'tanvi_ux',
  'Tanvi Kulkarni',
  'Senior Product Designer | Design Systems & Accessibility',
  'Crafting user-centered workflows for complex developer SaaS platforms. Advocate of WCAG AAA accessibility standards.',
  'Pune, India',
  'tanvi-kulkarni',
  'https://tanvi.design',
  'Senior',
  'available',
  15,
  ARRAY['UI/UX', 'Accessibility', 'Design Systems', 'Figma'],
  'preset:dev-11',
  true,
  true,
  '{"bio":"Product designer with deep technical literacy who writes clean semantic HTML/CSS and builds comprehensive Figma component libraries.","technical_interests":["Design tokens","Micro-interactions","User mental models in developer tools"],"current_goals":"Creating world-class user interfaces for collaborative developer tools.","collaboration_style":"High-touch alignment with frontend engineers, iterative user testing prototypes.","target_projects":["Developer dashboards","Collaborative kanban boards","Open-source documentation systems"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000012',
  'siddharth.cloud',
  'Siddharth Rao',
  'DevOps & SRE Engineer | Multi-Cloud & Observability',
  'Automating everything from bare metal to Kubernetes clusters. Prometheus, Grafana, and OpenTelemetry advocate.',
  'Chennai, India',
  'siddharth-cloud',
  'https://siddharthrao.dev',
  'Mid-Level',
  'open_to_collaborate',
  12,
  ARRAY['DevOps', 'Kubernetes', 'Prometheus', 'Grafana', 'Docker'],
  'preset:dev-12',
  true,
  true,
  '{"bio":"Site Reliability Engineer dedicated to system resilience, automated incident response, and performance profiling.","technical_interests":["SLO/SLA tracking dashboards","Prometheus metrics aggregation","Zero-downtime rolling updates"],"current_goals":"Implementing real-time health telemetry across multi-region services.","collaboration_style":"Infrastructure-as-code reviews, automated smoke tests, operational readiness checklists.","target_projects":["Cloud monitoring dashboards","API health monitoring platforms","Automated deployment pipelines"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000013',
  'priya.data',
  'Priya Nambiar',
  'Data Scientist & Analytics Engineer | Pandas & BigQuery',
  'Transforming petabytes of raw signals into actionable engineering insights, predictive models, and intuitive dashboards.',
  'Trivandrum, India',
  'priya-data',
  'https://priyanambiar.data',
  'Senior',
  'open_to_collaborate',
  14,
  ARRAY['Data Science', 'Python', 'BigQuery', 'Data Analytics'],
  'preset:dev-13',
  true,
  true,
  '{"bio":"Analytics engineer specializing in ETL pipelines, statistical modeling, and developer telemetry visualization.","technical_interests":["dbt transformations","Streaming data aggregations","Interactive Recharts dashboards"],"current_goals":"Building developer productivity telemetry systems that respect engineer autonomy.","collaboration_style":"Clear schema definitions, data validation tests, well-documented queries.","target_projects":["Data analytics dashboards","GitHub contribution trackers","Developer velocity analyzers"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000014',
  'vikram.systems',
  'Vikram Malhotra',
  'Core Backend Architect | Java, Spring Boot & Distributed Caches',
  'Architecting rock-solid enterprise backends, transactional integrity, and scalable event streaming with Kafka.',
  'Gurgaon, India',
  'vikram-malhotra',
  'https://vikrammalhotra.dev',
  'Architect',
  'busy',
  6,
  ARRAY['Java', 'Spring Boot', 'Kafka', 'System Architecture'],
  'preset:dev-14',
  true,
  true,
  '{"bio":"Enterprise systems architect with 10+ years designing fault-tolerant transaction processing architectures.","technical_interests":["Distributed locking","PostgreSQL query optimization","Clean architecture principles"],"current_goals":"Advising and building high-reliability open-source platforms.","collaboration_style":"Architecture design reviews, strict API versioning, defensive error handling.","target_projects":["Student management systems","Inventory management SaaS","Payment transaction gateways"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000015',
  'sneha_frontend',
  'Sneha Banerjee',
  'Frontend Engineer | React, TypeScript & Web Performance',
  'Crafting responsive, high-speed single page applications with sub-second time-to-interactive and 100 Lighthouse scores.',
  'Kolkata, India',
  'sneha-frontend',
  'https://snehabanerjee.dev',
  'Junior',
  'available',
  20,
  ARRAY['React', 'TypeScript', 'Web Performance', 'Tailwind CSS'],
  'preset:dev-15',
  true,
  true,
  '{"bio":"Enthusiastic frontend engineer eager to contribute to collaborative projects and learn modern state management.","technical_interests":["TanStack Query caching strategies","CSS grid & asymmetric layouts","Component unit testing"],"current_goals":"Collaborating on open-source applications and contributing to developer tool interfaces.","collaboration_style":"Eager to receive code review feedback, fast iteration cycles, proactive communication.","target_projects":["Developer portfolio builders","Code snippet sharing tools","E-commerce platforms"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000016',
  'rajesh.devops',
  'Rajesh Gopinath',
  'Senior Cloud Architect | AWS, Terraform & Zero Trust',
  'Designing scalable cloud topographies across AWS and GCP. Automating deployment pipelines and security compliance.',
  'Bengaluru, India',
  'rajesh-gopinath',
  'https://rajeshg.cloud',
  'Senior',
  'open_to_collaborate',
  10,
  ARRAY['AWS', 'Terraform', 'Kubernetes', 'Security'],
  'preset:dev-16',
  true,
  true,
  '{"bio":"Cloud architect with extensive experience deploying enterprise SaaS workloads with strict SOC2 & GDPR compliance.","technical_interests":["Infrastructure-as-code modularity","Serverless microservices (AWS Lambda)","VPC peering & mesh security"],"current_goals":"Helping collaborative open-source developer teams set up free-tier cloud architectures.","collaboration_style":"Infrastructure blueprints, reproducible Docker environments, clear runbooks.","target_projects":["Cloud monitoring dashboards","Automated CI/CD pipelines","API gateways"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000017',
  'pooja.mobile',
  'Pooja Hegde',
  'Mobile App Developer | React Native & Flutter',
  'Building smooth 60fps iOS and Android applications with offline-first local storage and snappy native animations.',
  'Mangalore, India',
  'pooja-mobile',
  'https://poojahegde.mobile',
  'Mid-Level',
  'available',
  15,
  ARRAY['React Native', 'Flutter', 'Mobile UX', 'Offline-First'],
  'preset:dev-17',
  true,
  true,
  '{"bio":"Cross-platform mobile engineer passionate about intuitive mobile experiences and high-performance native bridges.","technical_interests":["SQLite & WatermelonDB offline sync","React Native Reanimated","Push notification orchestration"],"current_goals":"Building companion mobile apps for developer collaboration platforms.","collaboration_style":"Mobile wireframes, rapid Expo prototypes, shared API schema synchronization.","target_projects":["Mobile chat applications","Fitness tracking apps","Smart attendance systems"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000018',
  'manish.ai',
  'Manish Chawla',
  'Machine Learning Engineer | Computer Vision & PyTorch',
  'Training convolutional neural networks, vision transformers, and real-time object detection models at edge device constraints.',
  'Chandigarh, India',
  'manish-ai',
  'https://manishchawla.ai',
  'Mid-Level',
  'open_to_collaborate',
  12,
  ARRAY['Computer Vision', 'PyTorch', 'TensorFlow', 'Edge AI'],
  'preset:dev-18',
  true,
  true,
  '{"bio":"Computer vision researcher with experience deploying quantized inference models on mobile and embedded devices.","technical_interests":["Vision Transformers (ViT)","OpenCV real-time image processing","Model pruning & ONNX runtime"],"current_goals":"Collaborating on real-time visual recognition applications.","collaboration_style":"Jupyter notebooks with visual benchmarks, REST inference endpoints, reproducible training logs.","target_projects":["AI image classification systems","Smart attendance systems","Smart agriculture monitoring"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000019',
  'deepa.infra',
  'Deepa Krishnan',
  'Site Reliability Engineer | Linux Kernel & Performance',
  'Profiling Linux kernel bottlenecks, analyzing eBPF traces, and optimizing PostgreSQL query plans for massive read concurrency.',
  'Coimbatore, India',
  'deepa-infra',
  'https://deepakrishnan.tech',
  'Senior',
  'open_to_collaborate',
  10,
  ARRAY['Linux', 'Performance', 'eBPF', 'PostgreSQL'],
  'preset:dev-19',
  true,
  true,
  '{"bio":"SRE and systems performance specialist passionate about finding latency outliers and writing zero-overhead probes.","technical_interests":["eBPF tracing with bpftrace","Postgres indexing & vacuum strategies","Memory allocation tuning"],"current_goals":"Optimizing open-source database response times and publishing performance audits.","collaboration_style":"Benchmark flamegraphs, deterministic reproducibility, structured bug post-mortems.","target_projects":["Cloud monitoring dashboards","API performance monitors","Database telemetry tools"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000020',
  'kunal.api',
  'Kunal Singhania',
  'API Architect | GraphQL, Node.js & Microservices',
  'Designing federated GraphQL graphs, high-volume REST endpoints, and schema-driven developer experiences.',
  'Mumbai, India',
  'kunal-api',
  'https://kunalsinghania.dev',
  'Lead',
  'available',
  16,
  ARRAY['GraphQL', 'Node.js', 'NestJS', 'TypeScript'],
  'preset:dev-20',
  true,
  true,
  '{"bio":"Senior backend architect specializing in clean APIs, domain-driven design, and developer portal documentation.","technical_interests":["Apollo Federation & GraphQL mesh","OpenAPI 3.1 specification tooling","Redis rate limiting & caching"],"current_goals":"Architecting developer-friendly APIs for modern collaborative applications.","collaboration_style":"API design-first approach, contract testing, typed SDK generation for frontend consumers.","target_projects":["Real-time chat platforms","Code snippet sharing tools","API monitoring platforms"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000021',
  'aarav.dev',
  'Aarav Gupta',
  'Frontend Engineer | Vue.js & Nuxt',
  'Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.',
  'Jaipur, India',
  'aarav-dev',
  'https://aaravdev.dev',
  'Junior',
  'available',
  10,
  ARRAY['Vue.js', 'Nuxt.js', 'Software Architecture'],
  'preset:dev-22',
  true,
  true,
  '{"bio":"Dedicated Frontend Engineer | Vue.js & Nuxt with strong technical fundamentals and passion for reliable collaborative engineering.","technical_interests":["Vue.js","Nuxt.js","Clean Code"],"current_goals":"Building impactful open-source tools with developer communities.","collaboration_style":"Async communication, clear task estimation, peer reviews.","target_projects":["Collaborative platforms","Developer tools","SaaS applications"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000022',
  'divya.sec',
  'Divya Ranganathan',
  'Penetration Tester & Ethical Hacker',
  'Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.',
  'Chennai, India',
  'divya-sec',
  'https://divyasec.dev',
  'Senior',
  'open_to_collaborate',
  11,
  ARRAY['Linux', 'Python', 'Software Architecture'],
  'preset:dev-23',
  true,
  true,
  '{"bio":"Dedicated Penetration Tester & Ethical Hacker with strong technical fundamentals and passion for reliable collaborative engineering.","technical_interests":["Linux","Python","Clean Code"],"current_goals":"Building impactful open-source tools with developer communities.","collaboration_style":"Async communication, clear task estimation, peer reviews.","target_projects":["Collaborative platforms","Developer tools","SaaS applications"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000023',
  'tarun.code',
  'Tarun Bhatia',
  'Full-Stack Developer | MERN Stack',
  'Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.',
  'Lucknow, India',
  'tarun-code',
  'https://taruncode.dev',
  'Mid-Level',
  'busy',
  12,
  ARRAY['React', 'Node.js', 'Software Architecture'],
  'preset:dev-24',
  true,
  true,
  '{"bio":"Dedicated Full-Stack Developer | MERN Stack with strong technical fundamentals and passion for reliable collaborative engineering.","technical_interests":["React","Node.js","Clean Code"],"current_goals":"Building impactful open-source tools with developer communities.","collaboration_style":"Async communication, clear task estimation, peer reviews.","target_projects":["Collaborative platforms","Developer tools","SaaS applications"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000024',
  'shreya.ui',
  'Shreya Mukherjee',
  'Visual Designer & CSS Specialist',
  'Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.',
  'Kolkata, India',
  'shreya-ui',
  'https://shreyaui.dev',
  'Mid-Level',
  'available',
  13,
  ARRAY['Figma', 'Tailwind CSS', 'Software Architecture'],
  'preset:dev-1',
  true,
  true,
  '{"bio":"Dedicated Visual Designer & CSS Specialist with strong technical fundamentals and passion for reliable collaborative engineering.","technical_interests":["Figma","Tailwind CSS","Clean Code"],"current_goals":"Building impactful open-source tools with developer communities.","collaboration_style":"Async communication, clear task estimation, peer reviews.","target_projects":["Collaborative platforms","Developer tools","SaaS applications"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000025',
  'varun.ml',
  'Varun Kapoor',
  'Data Engineer | Spark & Data Pipelines',
  'Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.',
  'Noida, India',
  'varun-ml',
  'https://varunml.dev',
  'Senior',
  'open_to_collaborate',
  14,
  ARRAY['Python', 'SQL', 'Software Architecture'],
  'preset:dev-2',
  true,
  true,
  '{"bio":"Dedicated Data Engineer | Spark & Data Pipelines with strong technical fundamentals and passion for reliable collaborative engineering.","technical_interests":["Python","SQL","Clean Code"],"current_goals":"Building impactful open-source tools with developer communities.","collaboration_style":"Async communication, clear task estimation, peer reviews.","target_projects":["Collaborative platforms","Developer tools","SaaS applications"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000026',
  'anita.cloud',
  'Anita Deshpande',
  'Cloud Engineer | GCP & Kubernetes',
  'Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.',
  'Nagpur, India',
  'anita-cloud',
  'https://anitacloud.dev',
  'Senior',
  'busy',
  15,
  ARRAY['Google Cloud', 'Kubernetes', 'Software Architecture'],
  'preset:dev-3',
  true,
  true,
  '{"bio":"Dedicated Cloud Engineer | GCP & Kubernetes with strong technical fundamentals and passion for reliable collaborative engineering.","technical_interests":["Google Cloud","Kubernetes","Clean Code"],"current_goals":"Building impactful open-source tools with developer communities.","collaboration_style":"Async communication, clear task estimation, peer reviews.","target_projects":["Collaborative platforms","Developer tools","SaaS applications"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000027',
  'karthik.go',
  'Karthik Raman',
  'Go Backend Developer | Microservices',
  'Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.',
  'Bengaluru, India',
  'karthik-go',
  'https://karthikgo.dev',
  'Mid-Level',
  'available',
  16,
  ARRAY['Go', 'Docker', 'Software Architecture'],
  'preset:dev-4',
  true,
  true,
  '{"bio":"Dedicated Go Backend Developer | Microservices with strong technical fundamentals and passion for reliable collaborative engineering.","technical_interests":["Go","Docker","Clean Code"],"current_goals":"Building impactful open-source tools with developer communities.","collaboration_style":"Async communication, clear task estimation, peer reviews.","target_projects":["Collaborative platforms","Developer tools","SaaS applications"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000028',
  'swati.qa',
  'Swati Mishra',
  'QA Automation Engineer | Cypress & Playwright',
  'Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.',
  'Bhopal, India',
  'swati-qa',
  'https://swatiqa.dev',
  'Mid-Level',
  'open_to_collaborate',
  17,
  ARRAY['TypeScript', 'JavaScript', 'Software Architecture'],
  'preset:dev-5',
  true,
  true,
  '{"bio":"Dedicated QA Automation Engineer | Cypress & Playwright with strong technical fundamentals and passion for reliable collaborative engineering.","technical_interests":["TypeScript","JavaScript","Clean Code"],"current_goals":"Building impactful open-source tools with developer communities.","collaboration_style":"Async communication, clear task estimation, peer reviews.","target_projects":["Collaborative platforms","Developer tools","SaaS applications"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000029',
  'alok.ai',
  'Alok Trivedi',
  'AI Engineer | LangChain & Vector Search',
  'Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.',
  'Varanasi, India',
  'alok-ai',
  'https://alokai.dev',
  'Junior',
  'busy',
  18,
  ARRAY['Python', 'OpenAI API', 'Software Architecture'],
  'preset:dev-6',
  true,
  true,
  '{"bio":"Dedicated AI Engineer | LangChain & Vector Search with strong technical fundamentals and passion for reliable collaborative engineering.","technical_interests":["Python","OpenAI API","Clean Code"],"current_goals":"Building impactful open-source tools with developer communities.","collaboration_style":"Async communication, clear task estimation, peer reviews.","target_projects":["Collaborative platforms","Developer tools","SaaS applications"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000030',
  'bhavna.web',
  'Bhavna Parekh',
  'Frontend Specialist | Angular & TypeScript',
  'Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.',
  'Surat, India',
  'bhavna-web',
  'https://bhavnaweb.dev',
  'Senior',
  'available',
  19,
  ARRAY['Angular', 'TypeScript', 'Software Architecture'],
  'preset:dev-7',
  true,
  true,
  '{"bio":"Dedicated Frontend Specialist | Angular & TypeScript with strong technical fundamentals and passion for reliable collaborative engineering.","technical_interests":["Angular","TypeScript","Clean Code"],"current_goals":"Building impactful open-source tools with developer communities.","collaboration_style":"Async communication, clear task estimation, peer reviews.","target_projects":["Collaborative platforms","Developer tools","SaaS applications"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000031',
  'chetan.rust',
  'Chetan Kulkarni',
  'Rust Developer | Embedded & Systems',
  'Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.',
  'Nashik, India',
  'chetan-rust',
  'https://chetanrust.dev',
  'Mid-Level',
  'open_to_collaborate',
  10,
  ARRAY['Rust', 'Linux', 'Software Architecture'],
  'preset:dev-8',
  true,
  true,
  '{"bio":"Dedicated Rust Developer | Embedded & Systems with strong technical fundamentals and passion for reliable collaborative engineering.","technical_interests":["Rust","Linux","Clean Code"],"current_goals":"Building impactful open-source tools with developer communities.","collaboration_style":"Async communication, clear task estimation, peer reviews.","target_projects":["Collaborative platforms","Developer tools","SaaS applications"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000032',
  'geeta.db',
  'Geeta Sundaram',
  'PostgreSQL DBA & Query Tuner',
  'Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.',
  'Madurai, India',
  'geeta-db',
  'https://geetadb.dev',
  'Lead',
  'busy',
  11,
  ARRAY['PostgreSQL', 'SQL', 'Software Architecture'],
  'preset:dev-9',
  true,
  true,
  '{"bio":"Dedicated PostgreSQL DBA & Query Tuner with strong technical fundamentals and passion for reliable collaborative engineering.","technical_interests":["PostgreSQL","SQL","Clean Code"],"current_goals":"Building impactful open-source tools with developer communities.","collaboration_style":"Async communication, clear task estimation, peer reviews.","target_projects":["Collaborative platforms","Developer tools","SaaS applications"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000033',
  'harsh.dev',
  'Harsh Agrawal',
  'Full-Stack Engineer | Django & React',
  'Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.',
  'Indore, India',
  'harsh-dev',
  'https://harshdev.dev',
  'Mid-Level',
  'available',
  12,
  ARRAY['Python', 'Django', 'Software Architecture'],
  'preset:dev-10',
  true,
  true,
  '{"bio":"Dedicated Full-Stack Engineer | Django & React with strong technical fundamentals and passion for reliable collaborative engineering.","technical_interests":["Python","Django","Clean Code"],"current_goals":"Building impactful open-source tools with developer communities.","collaboration_style":"Async communication, clear task estimation, peer reviews.","target_projects":["Collaborative platforms","Developer tools","SaaS applications"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000034',
  'indira.ux',
  'Indira Pillai',
  'UX Researcher & Interaction Designer',
  'Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.',
  'Thrissur, India',
  'indira-ux',
  'https://indiraux.dev',
  'Senior',
  'open_to_collaborate',
  13,
  ARRAY['Figma', 'UI/UX', 'Software Architecture'],
  'preset:dev-11',
  true,
  true,
  '{"bio":"Dedicated UX Researcher & Interaction Designer with strong technical fundamentals and passion for reliable collaborative engineering.","technical_interests":["Figma","UI/UX","Clean Code"],"current_goals":"Building impactful open-source tools with developer communities.","collaboration_style":"Async communication, clear task estimation, peer reviews.","target_projects":["Collaborative platforms","Developer tools","SaaS applications"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000035',
  'jay.devops',
  'Jayesh Shah',
  'DevOps Specialist | GitHub Actions & CI',
  'Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.',
  'Vadodara, India',
  'jay-devops',
  'https://jaydevops.dev',
  'Mid-Level',
  'busy',
  14,
  ARRAY['GitHub Actions', 'Docker', 'Software Architecture'],
  'preset:dev-12',
  true,
  true,
  '{"bio":"Dedicated DevOps Specialist | GitHub Actions & CI with strong technical fundamentals and passion for reliable collaborative engineering.","technical_interests":["GitHub Actions","Docker","Clean Code"],"current_goals":"Building impactful open-source tools with developer communities.","collaboration_style":"Async communication, clear task estimation, peer reviews.","target_projects":["Collaborative platforms","Developer tools","SaaS applications"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000036',
  'komal.ai',
  'Komal Narang',
  'Machine Learning Researcher | NLP',
  'Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.',
  'Amritsar, India',
  'komal-ai',
  'https://komalai.dev',
  'Junior',
  'available',
  15,
  ARRAY['Python', 'PyTorch', 'Software Architecture'],
  'preset:dev-13',
  true,
  true,
  '{"bio":"Dedicated Machine Learning Researcher | NLP with strong technical fundamentals and passion for reliable collaborative engineering.","technical_interests":["Python","PyTorch","Clean Code"],"current_goals":"Building impactful open-source tools with developer communities.","collaboration_style":"Async communication, clear task estimation, peer reviews.","target_projects":["Collaborative platforms","Developer tools","SaaS applications"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000037',
  'lalit.full',
  'Lalit Somani',
  'Full-Stack Developer | SvelteKit & Supabase',
  'Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.',
  'Udaipur, India',
  'lalit-full',
  'https://lalitfull.dev',
  'Senior',
  'open_to_collaborate',
  16,
  ARRAY['Svelte', 'TypeScript', 'Software Architecture'],
  'preset:dev-14',
  true,
  true,
  '{"bio":"Dedicated Full-Stack Developer | SvelteKit & Supabase with strong technical fundamentals and passion for reliable collaborative engineering.","technical_interests":["Svelte","TypeScript","Clean Code"],"current_goals":"Building impactful open-source tools with developer communities.","collaboration_style":"Async communication, clear task estimation, peer reviews.","target_projects":["Collaborative platforms","Developer tools","SaaS applications"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000038',
  'mona.sec',
  'Mona Saxena',
  'Cloud Security & IAM Architect',
  'Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.',
  'Dehradun, India',
  'mona-sec',
  'https://monasec.dev',
  'Lead',
  'busy',
  17,
  ARRAY['AWS', 'Linux', 'Software Architecture'],
  'preset:dev-15',
  true,
  true,
  '{"bio":"Dedicated Cloud Security & IAM Architect with strong technical fundamentals and passion for reliable collaborative engineering.","technical_interests":["AWS","Linux","Clean Code"],"current_goals":"Building impactful open-source tools with developer communities.","collaboration_style":"Async communication, clear task estimation, peer reviews.","target_projects":["Collaborative platforms","Developer tools","SaaS applications"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000039',
  'nitin.code',
  'Nitin Rawat',
  'Backend Developer | FastAPI & Redis',
  'Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.',
  'Ranchi, India',
  'nitin-code',
  'https://nitincode.dev',
  'Mid-Level',
  'available',
  18,
  ARRAY['Python', 'FastAPI', 'Software Architecture'],
  'preset:dev-16',
  true,
  true,
  '{"bio":"Dedicated Backend Developer | FastAPI & Redis with strong technical fundamentals and passion for reliable collaborative engineering.","technical_interests":["Python","FastAPI","Clean Code"],"current_goals":"Building impactful open-source tools with developer communities.","collaboration_style":"Async communication, clear task estimation, peer reviews.","target_projects":["Collaborative platforms","Developer tools","SaaS applications"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

INSERT INTO public.profiles (
  id, username, full_name, headline, bio, location, github_username, website_url,
  experience_level, availability_status, weekly_hours_available, interests,
  preset_avatar_id, is_onboarded, is_demo, professional_description
) VALUES (
  'd3300000-0000-4000-a000-000000000040',
  'ojas.mobile',
  'Ojas Kadam',
  'Mobile Engineer | Flutter & Dart',
  'Focused on building production-grade software, continuous learning, and contributing to open-source developer tools.',
  'Aurangabad, India',
  'ojas-mobile',
  'https://ojasmobile.dev',
  'Junior',
  'open_to_collaborate',
  19,
  ARRAY['Flutter', 'Dart', 'Software Architecture'],
  'preset:dev-17',
  true,
  true,
  '{"bio":"Dedicated Mobile Engineer | Flutter & Dart with strong technical fundamentals and passion for reliable collaborative engineering.","technical_interests":["Flutter","Dart","Clean Code"],"current_goals":"Building impactful open-source tools with developer communities.","collaboration_style":"Async communication, clear task estimation, peer reviews.","target_projects":["Collaborative platforms","Developer tools","SaaS applications"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  experience_level = EXCLUDED.experience_level,
  availability_status = EXCLUDED.availability_status,
  is_demo = true,
  professional_description = EXCLUDED.professional_description;

-- ============================================================================
-- 5. INSERT 30 DEMONSTRATION COMMUNITY PROJECTS
-- ============================================================================

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000001',
  'd3300000-0000-4000-a000-000000000004',
  'AI Resume & Technical Skill Analyzer',
  'ai-resume-technical-skill-analyzer-100',
  'Automated developer resume parser with skill ontology matching and portfolio scoring.',
  'An AI-powered resume analyzer that parses PDF/Word developer portfolios, extracts technical proficiencies against a canonical tech ontology, benchmarks project complexity, and recommends high-fit engineering roles.',
  'AI & Machine Learning',
  'in_progress',
  4,
  ARRAY['Python', 'FastAPI', 'PyTorch', 'React', 'TypeScript', 'Tailwind CSS'],
  'https://github.com/DevConnect-Demo/ai-resume-analyzer',
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
VALUES ('d3300000-0000-4000-b000-000000000001', 'd3300000-0000-4000-a000-000000000004', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000001', 'd3300000-0000-4000-a000-000000000007', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000001', 'd3300000-0000-4000-a000-000000000010', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000001', 'd3300000-0000-4000-a000-000000000013', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000001', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000004', 0, true),
  ('d3300000-0000-4000-b000-000000000001', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000004', 1, true),
  ('d3300000-0000-4000-b000-000000000001', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000004', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000002',
  'd3300000-0000-4000-a000-000000000001',
  'Distributed Real-Time WebSocket Mesh',
  'distributed-real-time-websocket-mesh-101',
  'High-throughput real-time messaging gateway backed by Redis Pub/Sub and Go.',
  'A distributed message broker orchestrating real-time state synchronization, peer-to-peer WebRTC signaling, and bi-directional event distribution across multiple geographic edge nodes with low latency.',
  'Infrastructure',
  'active',
  5,
  ARRAY['Go', 'Redis', 'Docker', 'WebSockets', 'Kubernetes'],
  'https://github.com/DevConnect-Demo/realtime-chat-mesh',
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
VALUES ('d3300000-0000-4000-b000-000000000002', 'd3300000-0000-4000-a000-000000000001', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000002', 'd3300000-0000-4000-a000-000000000004', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000002', 'd3300000-0000-4000-a000-000000000007', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000002', 'd3300000-0000-4000-a000-000000000010', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000002', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000001', 0, true),
  ('d3300000-0000-4000-b000-000000000002', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000001', 1, true),
  ('d3300000-0000-4000-b000-000000000002', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000001', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000003',
  'd3300000-0000-4000-a000-000000000006',
  'Modern E-Commerce Headless Storefront',
  'modern-e-commerce-headless-storefront-102',
  'Sub-second page loads, edge-cached product catalogs, and serverless checkout flows.',
  'A headless e-commerce platform built with Next.js App Router, Stripe Elements, Supabase PostgreSQL, and automated inventory sync with real-time stock notifications.',
  'Web Application',
  'in_progress',
  4,
  ARRAY['Next.js', 'React', 'TypeScript', 'Supabase', 'Tailwind CSS'],
  'https://github.com/DevConnect-Demo/headless-ecommerce-suite',
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
VALUES ('d3300000-0000-4000-b000-000000000003', 'd3300000-0000-4000-a000-000000000006', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000003', 'd3300000-0000-4000-a000-000000000009', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000003', 'd3300000-0000-4000-a000-000000000012', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000003', 'd3300000-0000-4000-a000-000000000015', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000003', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000006', 0, true),
  ('d3300000-0000-4000-b000-000000000003', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000006', 1, true),
  ('d3300000-0000-4000-b000-000000000003', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000006', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000004',
  'd3300000-0000-4000-a000-000000000014',
  'Campus Student & Placement Management System',
  'campus-student-placement-management-system-103',
  'Comprehensive academic tracking, internship placement drives, and student portfolios.',
  'Centralized portal for college administrators, placement officers, and students to coordinate placement interviews, automate resume validation, and visualize historical placement statistics.',
  'Web Application',
  'completed',
  3,
  ARRAY['React', 'Node.js', 'PostgreSQL', 'Express.js', 'Tailwind CSS'],
  'https://github.com/DevConnect-Demo/campus-placement-manager',
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
VALUES ('d3300000-0000-4000-b000-000000000004', 'd3300000-0000-4000-a000-000000000014', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000004', 'd3300000-0000-4000-a000-000000000017', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000004', 'd3300000-0000-4000-a000-000000000020', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000004', 'd3300000-0000-4000-a000-000000000023', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000004', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000014', 0, true),
  ('d3300000-0000-4000-b000-000000000004', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000014', 1, true),
  ('d3300000-0000-4000-b000-000000000004', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000014', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000005',
  'd3300000-0000-4000-a000-000000000013',
  'Smart Expense & Budget Analytics Tracker',
  'smart-expense-budget-analytics-tracker-104',
  'Intelligent transaction categorization, recurring subscription detection, and budget alerts.',
  'A modern personal finance dashboard that ingests bank statements, classifies recurring expenses with machine learning models, and forecasts monthly burn rates with interactive Recharts visualizations.',
  'Web Application',
  'active',
  3,
  ARRAY['React', 'TypeScript', 'Recharts', 'Python', 'PostgreSQL'],
  'https://github.com/DevConnect-Demo/smart-expense-analytics',
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
VALUES ('d3300000-0000-4000-b000-000000000005', 'd3300000-0000-4000-a000-000000000013', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000005', 'd3300000-0000-4000-a000-000000000016', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000005', 'd3300000-0000-4000-a000-000000000019', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000005', 'd3300000-0000-4000-a000-000000000022', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000005', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000013', 0, true),
  ('d3300000-0000-4000-b000-000000000005', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000013', 1, true),
  ('d3300000-0000-4000-b000-000000000005', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000013', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000006',
  'd3300000-0000-4000-a000-000000000007',
  'Autonomous AI Coding Assistant & Reviewer',
  'autonomous-ai-coding-assistant-reviewer-105',
  'Automated GitHub pull request reviewer providing semantic diff analysis and security audits.',
  'A GitHub App and CLI tool that intercepts incoming pull requests, generates architectural summaries, detects security vulnerabilities, and suggests idiomatic refactoring using Gemini and OpenAI APIs.',
  'AI & Machine Learning',
  'in_progress',
  4,
  ARRAY['Python', 'OpenAI API', 'Gemini API', 'TypeScript', 'GitHub Actions'],
  'https://github.com/DevConnect-Demo/autonomous-code-reviewer',
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
VALUES ('d3300000-0000-4000-b000-000000000006', 'd3300000-0000-4000-a000-000000000007', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000006', 'd3300000-0000-4000-a000-000000000010', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000006', 'd3300000-0000-4000-a000-000000000013', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000006', 'd3300000-0000-4000-a000-000000000016', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000006', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000007', 0, true),
  ('d3300000-0000-4000-b000-000000000006', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000007', 1, true),
  ('d3300000-0000-4000-b000-000000000006', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000007', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000007',
  'd3300000-0000-4000-a000-000000000004',
  'Hybrid Collaborative Movie Recommendation Engine',
  'hybrid-collaborative-movie-recommendation-engine-106',
  'Vector embeddings + collaborative matrix factorization for personalized entertainment discovery.',
  'A recommendation system that utilizes two-tower neural architectures to match user watch history with cinematic embeddings, streaming real-time recommendations over a reactive React UI.',
  'AI & Machine Learning',
  'completed',
  3,
  ARRAY['Python', 'PyTorch', 'FastAPI', 'React', 'Tailwind CSS'],
  'https://github.com/DevConnect-Demo/movie-recommendation-engine',
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
VALUES ('d3300000-0000-4000-b000-000000000007', 'd3300000-0000-4000-a000-000000000004', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000007', 'd3300000-0000-4000-a000-000000000007', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000007', 'd3300000-0000-4000-a000-000000000010', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000007', 'd3300000-0000-4000-a000-000000000013', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000007', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000004', 0, true),
  ('d3300000-0000-4000-b000-000000000007', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000004', 1, true),
  ('d3300000-0000-4000-b000-000000000007', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000004', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000008',
  'd3300000-0000-4000-a000-000000000002',
  'Developer Social Network & Open Hub',
  'developer-social-network-open-hub-107',
  'Dark editorial developer collaboration network uniting GitHub, LinkedIn, and Discord.',
  'The flagship DevConnect ecosystem enabling developers to showcase projects, connect via AI teammate matching, track tasks on Kanban boards, and collaborate in real-time chat rooms.',
  'Web Application',
  'active',
  6,
  ARRAY['React', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Framer Motion'],
  'https://github.com/Deew101/DevConnect',
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
VALUES ('d3300000-0000-4000-b000-000000000008', 'd3300000-0000-4000-a000-000000000002', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000008', 'd3300000-0000-4000-a000-000000000005', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000008', 'd3300000-0000-4000-a000-000000000008', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000008', 'd3300000-0000-4000-a000-000000000011', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000008', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000002', 0, true),
  ('d3300000-0000-4000-b000-000000000008', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000002', 1, true),
  ('d3300000-0000-4000-b000-000000000008', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000002', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000009',
  'd3300000-0000-4000-a000-000000000005',
  'Multi-Cloud Infrastructure Observability Dashboard',
  'multi-cloud-infrastructure-observability-dashboard-108',
  'Unified Prometheus metric aggregation, trace waterfall visualization, and SLA alert management.',
  'A cloud-native observability portal that pulls live metrics from Kubernetes nodes, Docker daemons, and microservices into customizable Grafana-style dashboards with instant alert webhooks.',
  'Infrastructure',
  'in_progress',
  4,
  ARRAY['Go', 'Kubernetes', 'Docker', 'Prometheus', 'React', 'TypeScript'],
  'https://github.com/DevConnect-Demo/cloud-observability-mesh',
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
VALUES ('d3300000-0000-4000-b000-000000000009', 'd3300000-0000-4000-a000-000000000005', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000009', 'd3300000-0000-4000-a000-000000000008', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000009', 'd3300000-0000-4000-a000-000000000011', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000009', 'd3300000-0000-4000-a000-000000000014', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000009', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000005', 0, true),
  ('d3300000-0000-4000-b000-000000000009', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000005', 1, true),
  ('d3300000-0000-4000-b000-000000000009', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000005', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000010',
  'd3300000-0000-4000-a000-000000000008',
  'Interactive Developer Portfolio Generator',
  'interactive-developer-portfolio-generator-109',
  'Turn your GitHub profile and markdown resume into a custom editorial web portfolio in 60s.',
  'A static-site generator and hosted builder that reads GitHub public repositories, star counts, and commit histories to automatically assemble a sleek portfolio with custom typography and domain hosting.',
  'Developer Tools',
  'completed',
  2,
  ARRAY['TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
  'https://github.com/DevConnect-Demo/portfolio-generator-pro',
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
VALUES ('d3300000-0000-4000-b000-000000000010', 'd3300000-0000-4000-a000-000000000008', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000010', 'd3300000-0000-4000-a000-000000000011', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000010', 'd3300000-0000-4000-a000-000000000014', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000010', 'd3300000-0000-4000-a000-000000000017', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000010', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000008', 0, true),
  ('d3300000-0000-4000-b000-000000000010', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000008', 1, true),
  ('d3300000-0000-4000-b000-000000000010', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000008', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000011',
  'd3300000-0000-4000-a000-000000000001',
  'Intelligent Job & Hackathon Teammate Matcher',
  'intelligent-job-hackathon-teammate-matcher-110',
  'Semantic skill alignment algorithm pairing engineers based on complementary strengths.',
  'An AI matching engine that evaluates developer experience levels, active project domains, and desired weekly commitments to form balanced hackathon squads and project teams.',
  'AI & Machine Learning',
  'active',
  4,
  ARRAY['Python', 'FastAPI', 'PostgreSQL', 'React', 'TypeScript'],
  'https://github.com/DevConnect-Demo/teammate-matcher-ai',
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
VALUES ('d3300000-0000-4000-b000-000000000011', 'd3300000-0000-4000-a000-000000000001', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000011', 'd3300000-0000-4000-a000-000000000004', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000011', 'd3300000-0000-4000-a000-000000000007', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000011', 'd3300000-0000-4000-a000-000000000010', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000011', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000001', 0, true),
  ('d3300000-0000-4000-b000-000000000011', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000001', 1, true),
  ('d3300000-0000-4000-b000-000000000011', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000001', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000012',
  'd3300000-0000-4000-a000-000000000003',
  'Interactive Code Learning & Interactive Playground',
  'interactive-code-learning-interactive-playground-111',
  'In-browser Wasm compiler sandbox with step-by-step algorithms and interactive challenges.',
  'An interactive learning platform running WebAssembly runtimes inside the browser. Users can write Rust, C++, and Python code without server sandboxes and visualize data structures in real-time.',
  'Developer Tools',
  'in_progress',
  5,
  ARRAY['Rust', 'WebAssembly', 'React', 'TypeScript', 'Tailwind CSS'],
  'https://github.com/DevConnect-Demo/interactive-code-playground',
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
VALUES ('d3300000-0000-4000-b000-000000000012', 'd3300000-0000-4000-a000-000000000003', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000012', 'd3300000-0000-4000-a000-000000000006', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000012', 'd3300000-0000-4000-a000-000000000009', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000012', 'd3300000-0000-4000-a000-000000000012', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000012', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000003', 0, true),
  ('d3300000-0000-4000-b000-000000000012', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000003', 1, true),
  ('d3300000-0000-4000-b000-000000000012', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000003', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000013',
  'd3300000-0000-4000-a000-000000000017',
  'Hyperlocal Food Delivery & Fleet Tracking App',
  'hyperlocal-food-delivery-fleet-tracking-app-112',
  'Real-time GPS dispatch, driver route optimization, and live order status streams.',
  'Full-stack food delivery application with driver companion app, live map tracking via WebSockets, menu management, and instant payment integration.',
  'Mobile Application',
  'completed',
  4,
  ARRAY['React Native', 'Node.js', 'Express.js', 'PostgreSQL', 'WebSockets'],
  'https://github.com/DevConnect-Demo/hyperlocal-food-delivery',
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
VALUES ('d3300000-0000-4000-b000-000000000013', 'd3300000-0000-4000-a000-000000000017', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000013', 'd3300000-0000-4000-a000-000000000020', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000013', 'd3300000-0000-4000-a000-000000000023', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000013', 'd3300000-0000-4000-a000-000000000026', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000013', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000017', 0, true),
  ('d3300000-0000-4000-b000-000000000013', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000017', 1, true),
  ('d3300000-0000-4000-b000-000000000013', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000017', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000014',
  'd3300000-0000-4000-a000-000000000018',
  'Computer Vision Attendance & Biometric Recognition',
  'computer-vision-attendance-biometric-recognition-113',
  'Real-time face recognition camera stream for classroom and office attendance logging.',
  'An edge vision system that scans video feeds from IP cameras, verifies identities against a local face embedding database in under 50ms, and posts automated attendance reports to Supabase.',
  'AI & Machine Learning',
  'active',
  3,
  ARRAY['Python', 'OpenCV', 'PyTorch', 'FastAPI', 'Supabase'],
  'https://github.com/DevConnect-Demo/cv-attendance-system',
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
VALUES ('d3300000-0000-4000-b000-000000000014', 'd3300000-0000-4000-a000-000000000018', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000014', 'd3300000-0000-4000-a000-000000000021', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000014', 'd3300000-0000-4000-a000-000000000024', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000014', 'd3300000-0000-4000-a000-000000000027', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000014', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000018', 0, true),
  ('d3300000-0000-4000-b000-000000000014', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000018', 1, true),
  ('d3300000-0000-4000-b000-000000000014', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000018', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000015',
  'd3300000-0000-4000-a000-000000000010',
  'Automated API Penetration & Vulnerability Scanner',
  'automated-api-penetration-vulnerability-scanner-114',
  'Continuous security testing for REST and GraphQL endpoints against OWASP Top 10.',
  'A developer security scanner that inspects OpenAPI specs, fuzzes endpoint inputs, checks for broken object-level authorization (BOLA), and outputs actionable remediation guides.',
  'Developer Tools',
  'in_progress',
  3,
  ARRAY['Python', 'Linux', 'Docker', 'PostgreSQL', 'REST APIs'],
  'https://github.com/DevConnect-Demo/api-security-scanner',
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
VALUES ('d3300000-0000-4000-b000-000000000015', 'd3300000-0000-4000-a000-000000000010', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000015', 'd3300000-0000-4000-a000-000000000013', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000015', 'd3300000-0000-4000-a000-000000000016', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000015', 'd3300000-0000-4000-a000-000000000019', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000015', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000010', 0, true),
  ('d3300000-0000-4000-b000-000000000015', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000010', 1, true),
  ('d3300000-0000-4000-b000-000000000015', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000010', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000016',
  'd3300000-0000-4000-a000-000000000013',
  'Executive Engineering Analytics & DORA Metrics',
  'executive-engineering-analytics-dora-metrics-115',
  'Deployment frequency, lead time for changes, change failure rate, and mean time to recovery.',
  'Engineering leadership dashboard pulling webhook data from GitHub and GitLab to compute team DORA metrics, sprint velocity trends, and PR review cycle times.',
  'Developer Tools',
  'active',
  4,
  ARRAY['TypeScript', 'React', 'Recharts', 'PostgreSQL', 'Tailwind CSS'],
  'https://github.com/DevConnect-Demo/dora-metrics-analytics',
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
VALUES ('d3300000-0000-4000-b000-000000000016', 'd3300000-0000-4000-a000-000000000013', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000016', 'd3300000-0000-4000-a000-000000000016', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000016', 'd3300000-0000-4000-a000-000000000019', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000016', 'd3300000-0000-4000-a000-000000000022', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000016', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000013', 0, true),
  ('d3300000-0000-4000-b000-000000000016', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000013', 1, true),
  ('d3300000-0000-4000-b000-000000000016', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000013', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000017',
  'd3300000-0000-4000-a000-000000000002',
  'Collaborative Kanban & Sprint Planning SaaS',
  'collaborative-kanban-sprint-planning-saas-116',
  'Drag-and-drop task boards, velocity burn-down charts, and multi-user cursor sync.',
  'A Linear-inspired project management platform engineered with @dnd-kit, Supabase Realtime WebSocket synchronization, task hierarchy, and team assignment milestones.',
  'Web Application',
  'completed',
  4,
  ARRAY['React', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Framer Motion'],
  'https://github.com/DevConnect-Demo/kanban-sprint-saas',
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
VALUES ('d3300000-0000-4000-b000-000000000017', 'd3300000-0000-4000-a000-000000000002', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000017', 'd3300000-0000-4000-a000-000000000005', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000017', 'd3300000-0000-4000-a000-000000000008', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000017', 'd3300000-0000-4000-a000-000000000011', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000017', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000002', 0, true),
  ('d3300000-0000-4000-b000-000000000017', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000002', 1, true),
  ('d3300000-0000-4000-b000-000000000017', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000002', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000018',
  'd3300000-0000-4000-a000-000000000018',
  'Agricultural Crop Disease Diagnosis via Image AI',
  'agricultural-crop-disease-diagnosis-via-image-ai-117',
  'Smartphone camera leaf scan for instant crop disease classification and remedies.',
  'A mobile-friendly web application assisting farmers by detecting 38 common crop leaf diseases using lightweight MobileNet vision models and providing natural language remedy advice.',
  'AI & Machine Learning',
  'active',
  3,
  ARRAY['Python', 'TensorFlow', 'FastAPI', 'React', 'Tailwind CSS'],
  'https://github.com/DevConnect-Demo/crop-disease-ai',
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
VALUES ('d3300000-0000-4000-b000-000000000018', 'd3300000-0000-4000-a000-000000000018', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000018', 'd3300000-0000-4000-a000-000000000021', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000018', 'd3300000-0000-4000-a000-000000000024', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000018', 'd3300000-0000-4000-a000-000000000027', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000018', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000018', 0, true),
  ('d3300000-0000-4000-b000-000000000018', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000018', 1, true),
  ('d3300000-0000-4000-b000-000000000018', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000018', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000019',
  'd3300000-0000-4000-a000-000000000006',
  'Collaborative Travel Itinerary & Budget Planner',
  'collaborative-travel-itinerary-budget-planner-118',
  'Multiplayer trip planning, interactive map waypoints, and split expense ledger.',
  'Travel coordination software allowing friends to pin map destinations, build day-by-day itineraries with travel times, and settle shared trip expenses automatically.',
  'Web Application',
  'in_progress',
  3,
  ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
  'https://github.com/DevConnect-Demo/travel-itinerary-collab',
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
VALUES ('d3300000-0000-4000-b000-000000000019', 'd3300000-0000-4000-a000-000000000006', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000019', 'd3300000-0000-4000-a000-000000000009', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000019', 'd3300000-0000-4000-a000-000000000012', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000019', 'd3300000-0000-4000-a000-000000000015', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000019', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000006', 0, true),
  ('d3300000-0000-4000-b000-000000000019', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000006', 1, true),
  ('d3300000-0000-4000-b000-000000000019', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000006', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000020',
  'd3300000-0000-4000-a000-000000000017',
  'Fitness & Workout Telemetry Tracker',
  'fitness-workout-telemetry-tracker-119',
  'Progressive overload tracking, custom routine builders, and health metrics integration.',
  'A workout logging app offering audio timers, weight progression charts, and personal record tracking with seamless cloud backup.',
  'Mobile Application',
  'completed',
  2,
  ARRAY['React Native', 'TypeScript', 'Supabase', 'Tailwind CSS'],
  'https://github.com/DevConnect-Demo/fitness-tracker-pro',
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
VALUES ('d3300000-0000-4000-b000-000000000020', 'd3300000-0000-4000-a000-000000000017', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000020', 'd3300000-0000-4000-a000-000000000020', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000020', 'd3300000-0000-4000-a000-000000000023', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000020', 'd3300000-0000-4000-a000-000000000026', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000020', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000017', 0, true),
  ('d3300000-0000-4000-b000-000000000020', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000017', 1, true),
  ('d3300000-0000-4000-b000-000000000020', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000017', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000021',
  'd3300000-0000-4000-a000-000000000001',
  'GitHub Organization Insights & Contributor Analytics',
  'github-organization-insights-contributor-analytics-120',
  'Deep dive into repository commit frequency, PR review turnaround, and contributor health.',
  'Visual analytics tool for open-source maintainers to monitor repository star velocity, active pull request queues, and contributor onboarding friction.',
  'Developer Tools',
  'active',
  3,
  ARRAY['TypeScript', 'React', 'Recharts', 'REST APIs', 'Tailwind CSS'],
  'https://github.com/DevConnect-Demo/github-insights-analytics',
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
VALUES ('d3300000-0000-4000-b000-000000000021', 'd3300000-0000-4000-a000-000000000001', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000021', 'd3300000-0000-4000-a000-000000000004', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000021', 'd3300000-0000-4000-a000-000000000007', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000021', 'd3300000-0000-4000-a000-000000000010', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000021', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000001', 0, true),
  ('d3300000-0000-4000-b000-000000000021', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000001', 1, true),
  ('d3300000-0000-4000-b000-000000000021', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000001', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000022',
  'd3300000-0000-4000-a000-000000000003',
  'IoT Smart Agriculture Irrigation & Soil Sensor Mesh',
  'iot-smart-agriculture-irrigation-soil-sensor-mesh-121',
  'ESP32 sensor telemetry mesh streaming soil moisture and weather data to dashboard.',
  'Hardware + cloud platform that gathers soil moisture, temperature, and solar irradiance metrics via MQTT brokers and triggers automated drip irrigation valves.',
  'Infrastructure',
  'in_progress',
  4,
  ARRAY['C++', 'Python', 'FastAPI', 'MQTT', 'React', 'PostgreSQL'],
  'https://github.com/DevConnect-Demo/iot-smart-agriculture',
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
VALUES ('d3300000-0000-4000-b000-000000000022', 'd3300000-0000-4000-a000-000000000003', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000022', 'd3300000-0000-4000-a000-000000000006', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000022', 'd3300000-0000-4000-a000-000000000009', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000022', 'd3300000-0000-4000-a000-000000000012', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000022', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000003', 0, true),
  ('d3300000-0000-4000-b000-000000000022', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000003', 1, true),
  ('d3300000-0000-4000-b000-000000000022', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000003', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000023',
  'd3300000-0000-4000-a000-000000000008',
  'Real-Time Markdown & Architecture Document Workspace',
  'real-time-markdown-architecture-document-workspace-122',
  'Operational transformation document editor with live cursor sync and Mermaid charts.',
  'Collaborative technical documentation editor with live code preview, auto-generating table of contents, and instant export to PDF and static sites.',
  'Web Application',
  'completed',
  3,
  ARRAY['React', 'TypeScript', 'WebSockets', 'Tailwind CSS'],
  'https://github.com/DevConnect-Demo/collaborative-doc-editor',
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
VALUES ('d3300000-0000-4000-b000-000000000023', 'd3300000-0000-4000-a000-000000000008', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000023', 'd3300000-0000-4000-a000-000000000011', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000023', 'd3300000-0000-4000-a000-000000000014', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000023', 'd3300000-0000-4000-a000-000000000017', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000023', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000008', 0, true),
  ('d3300000-0000-4000-b000-000000000023', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000008', 1, true),
  ('d3300000-0000-4000-b000-000000000023', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000008', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000024',
  'd3300000-0000-4000-a000-000000000006',
  'Developer Conference & Hackathon Event Platform',
  'developer-conference-hackathon-event-platform-123',
  'Ticketing, stage livestreams, speaker schedules, and project expo voting.',
  'An all-in-one event management system handling attendee registration, badge scanning, breakout room links, and community voting for hackathon winners.',
  'Web Application',
  'active',
  4,
  ARRAY['Next.js', 'React', 'TypeScript', 'Supabase', 'Stripe'],
  'https://github.com/DevConnect-Demo/event-expo-platform',
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
VALUES ('d3300000-0000-4000-b000-000000000024', 'd3300000-0000-4000-a000-000000000006', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000024', 'd3300000-0000-4000-a000-000000000009', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000024', 'd3300000-0000-4000-a000-000000000012', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000024', 'd3300000-0000-4000-a000-000000000015', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000024', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000006', 0, true),
  ('d3300000-0000-4000-b000-000000000024', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000006', 1, true),
  ('d3300000-0000-4000-b000-000000000024', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000006', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000025',
  'd3300000-0000-4000-a000-000000000009',
  'Synthetic API Monitoring & Global Ping Network',
  'synthetic-api-monitoring-global-ping-network-124',
  'Multi-region uptime checks, latency breakdown, and status page hosting.',
  'High-frequency HTTP/gRPC/WebSocket synthetic probe system distributed across 8 global edge regions with automatic incident escalation and public status pages.',
  'Developer Tools',
  'in_progress',
  3,
  ARRAY['Go', 'Docker', 'PostgreSQL', 'React', 'Tailwind CSS'],
  'https://github.com/DevConnect-Demo/synthetic-api-monitor',
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
VALUES ('d3300000-0000-4000-b000-000000000025', 'd3300000-0000-4000-a000-000000000009', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000025', 'd3300000-0000-4000-a000-000000000012', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000025', 'd3300000-0000-4000-a000-000000000015', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000025', 'd3300000-0000-4000-a000-000000000018', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000025', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000009', 0, true),
  ('d3300000-0000-4000-b000-000000000025', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000009', 1, true),
  ('d3300000-0000-4000-b000-000000000025', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000009', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000026',
  'd3300000-0000-4000-a000-000000000015',
  'Developer Code Snippet Vault & Sharing Platform',
  'developer-code-snippet-vault-sharing-platform-125',
  'Gist alternative with syntax highlighting, tag categorization, and secret redaction.',
  'Secure code snippet manager with instant command line publishing via custom CLI, syntax highlighting for 120+ languages, and automatic API key sanitization.',
  'Developer Tools',
  'completed',
  2,
  ARRAY['TypeScript', 'React', 'Supabase', 'Tailwind CSS'],
  'https://github.com/DevConnect-Demo/code-snippet-vault',
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
VALUES ('d3300000-0000-4000-b000-000000000026', 'd3300000-0000-4000-a000-000000000015', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000026', 'd3300000-0000-4000-a000-000000000018', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000026', 'd3300000-0000-4000-a000-000000000021', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000026', 'd3300000-0000-4000-a000-000000000024', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000026', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000015', 0, true),
  ('d3300000-0000-4000-b000-000000000026', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000015', 1, true),
  ('d3300000-0000-4000-b000-000000000026', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000015', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000027',
  'd3300000-0000-4000-a000-000000000011',
  'Mental Wellness & Developer Burnout Journal',
  'mental-wellness-developer-burnout-journal-126',
  'Sentiment analysis on daily engineering reflections with burnout prevention tips.',
  'Encrypted daily journaling app tailored for remote knowledge workers to log stress levels, celebrate small wins, and detect early symptoms of engineering burnout.',
  'Web Application',
  'active',
  3,
  ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Python', 'FastAPI'],
  'https://github.com/DevConnect-Demo/wellness-developer-journal',
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
VALUES ('d3300000-0000-4000-b000-000000000027', 'd3300000-0000-4000-a000-000000000011', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000027', 'd3300000-0000-4000-a000-000000000014', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000027', 'd3300000-0000-4000-a000-000000000017', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000027', 'd3300000-0000-4000-a000-000000000020', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000027', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000011', 0, true),
  ('d3300000-0000-4000-b000-000000000027', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000011', 1, true),
  ('d3300000-0000-4000-b000-000000000027', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000011', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000028',
  'd3300000-0000-4000-a000-000000000014',
  'Real-Time Inventory & Warehouse Supply Chain SaaS',
  'real-time-inventory-warehouse-supply-chain-saas-127',
  'Stock alerts, barcode scanning, order fulfillment, and multi-warehouse routing.',
  'Enterprise inventory control platform providing real-time stock decrements, low-supply automated reorders, and printable QR asset tags.',
  'Web Application',
  'in_progress',
  4,
  ARRAY['Java', 'Spring Boot', 'PostgreSQL', 'React', 'Docker'],
  'https://github.com/DevConnect-Demo/inventory-supply-chain-saas',
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
VALUES ('d3300000-0000-4000-b000-000000000028', 'd3300000-0000-4000-a000-000000000014', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000028', 'd3300000-0000-4000-a000-000000000017', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000028', 'd3300000-0000-4000-a000-000000000020', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000028', 'd3300000-0000-4000-a000-000000000023', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000028', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000014', 0, true),
  ('d3300000-0000-4000-b000-000000000028', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000014', 1, true),
  ('d3300000-0000-4000-b000-000000000028', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000014', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000029',
  'd3300000-0000-4000-a000-000000000020',
  'Adaptive Technical Skill Assessment & Quiz Platform',
  'adaptive-technical-skill-assessment-quiz-platform-128',
  'Timed algorithmic challenges, interactive multiple choice, and verified skill badges.',
  'An interactive testing platform where developers solve practical coding problems and verify proficiency to earn verified skill endorsements on their DevConnect profiles.',
  'Developer Tools',
  'active',
  3,
  ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
  'https://github.com/DevConnect-Demo/skill-assessment-platform',
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
VALUES ('d3300000-0000-4000-b000-000000000029', 'd3300000-0000-4000-a000-000000000020', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000029', 'd3300000-0000-4000-a000-000000000023', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000029', 'd3300000-0000-4000-a000-000000000026', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000029', 'd3300000-0000-4000-a000-000000000029', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000029', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000020', 0, true),
  ('d3300000-0000-4000-b000-000000000029', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000020', 1, true),
  ('d3300000-0000-4000-b000-000000000029', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000020', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (
  id, owner_id, title, slug, tagline, description, category, status,
  team_size_needed, required_skills, github_repo_url, is_published, is_demo
) VALUES (
  'd3300000-0000-4000-b000-000000000030',
  'd3300000-0000-4000-a000-000000000001',
  'Open Source Contribution & Bounty Tracking Mesh',
  'open-source-contribution-bounty-tracking-mesh-129',
  'Crowdfunded issue bounties, good-first-issue discoverer, and PR verification.',
  'Decentralized open-source funding platform where maintainers tag issues with cash bounties and contributors get paid immediately upon PR merge.',
  'Developer Tools',
  'in_progress',
  4,
  ARRAY['TypeScript', 'Next.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
  'https://github.com/DevConnect-Demo/open-source-bounty-mesh',
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
VALUES ('d3300000-0000-4000-b000-000000000030', 'd3300000-0000-4000-a000-000000000001', 'owner')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000030', 'd3300000-0000-4000-a000-000000000004', 'lead')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000030', 'd3300000-0000-4000-a000-000000000007', 'contributor')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.project_members (project_id, user_id, role)
VALUES ('d3300000-0000-4000-b000-000000000030', 'd3300000-0000-4000-a000-000000000010', 'reviewer')
ON CONFLICT (project_id, user_id) DO NOTHING;

INSERT INTO public.tasks (project_id, title, description, status, priority, creator_id, order_index, is_demo)
VALUES 
  ('d3300000-0000-4000-b000-000000000030', 'Architect initial system schema & API contracts', 'Define TypeScript interfaces and Supabase PostgreSQL RLS tables.', 'done', 'high', 'd3300000-0000-4000-a000-000000000001', 0, true),
  ('d3300000-0000-4000-b000-000000000030', 'Implement core service endpoints & worker queues', 'Connect data layer with responsive queries and event broadcasting.', 'in_progress', 'urgent', 'd3300000-0000-4000-a000-000000000001', 1, true),
  ('d3300000-0000-4000-b000-000000000030', 'Construct responsive dark editorial dashboard cards', 'Build interactive UI components with micro-animations and status dials.', 'todo', 'medium', 'd3300000-0000-4000-a000-000000000001', 2, true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 6. INSERT 3 DEMONSTRATION TEAMS
-- ============================================================================

INSERT INTO public.teams (id, name, description, focus, avatar_url, owner_id, is_demo)
VALUES (
  'd3300000-0000-4000-c000-000000000001',
  'CodeCraft Labs',
  'Dedicated to architecting resilient full-stack systems, high-concurrency microservices, and modern SaaS developer tools.',
  'Full-Stack Development & SaaS Platforms',
  'preset:team-1',
  'd3300000-0000-4000-a000-000000000001',
  true
)
ON CONFLICT (id) DO UPDATE SET
  description = EXCLUDED.description,
  focus = EXCLUDED.focus;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000001', 'd3300000-0000-4000-a000-000000000001', 'Team Lead')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000001', 'd3300000-0000-4000-a000-000000000002', 'Frontend Lead')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000001', 'd3300000-0000-4000-a000-000000000003', 'Systems Engineer')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000001', 'd3300000-0000-4000-a000-000000000006', 'Full-Stack Developer')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000001', 'd3300000-0000-4000-a000-000000000009', 'Backend Engineer')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000001', 'd3300000-0000-4000-a000-000000000012', 'DevOps / SRE')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000001', 'd3300000-0000-4000-a000-000000000015', 'Frontend Contributor')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000001', 'd3300000-0000-4000-a000-000000000020', 'API Architect')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000001', 'd3300000-0000-4000-a000-000000000023', 'QA Engineer')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000001', 'd3300000-0000-4000-a000-000000000027', 'Contributor')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.teams (id, name, description, focus, avatar_url, owner_id, is_demo)
VALUES (
  'd3300000-0000-4000-c000-000000000002',
  'NeuralForge AI',
  'Specializing in generative AI agents, neural embeddings, natural language pipelines, and scalable computer vision models.',
  'Artificial Intelligence, Machine Learning & Data Science',
  'preset:team-2',
  'd3300000-0000-4000-a000-000000000004',
  true
)
ON CONFLICT (id) DO UPDATE SET
  description = EXCLUDED.description,
  focus = EXCLUDED.focus;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000002', 'd3300000-0000-4000-a000-000000000004', 'Team Lead')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000002', 'd3300000-0000-4000-a000-000000000007', 'NLP Specialist')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000002', 'd3300000-0000-4000-a000-000000000013', 'Data Scientist')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000002', 'd3300000-0000-4000-a000-000000000018', 'Computer Vision Engineer')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000002', 'd3300000-0000-4000-a000-000000000025', 'ML Engineer')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000002', 'd3300000-0000-4000-a000-000000000029', 'AI Researcher')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000002', 'd3300000-0000-4000-a000-000000000036', 'Data Analyst')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000002', 'd3300000-0000-4000-a000-000000000039', 'MLOps Engineer')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000002', 'd3300000-0000-4000-a000-000000000001', 'Backend Advisor')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.teams (id, name, description, focus, avatar_url, owner_id, is_demo)
VALUES (
  'd3300000-0000-4000-c000-000000000003',
  'PixelStack Studio',
  'Obsessed with fluid digital craft, design systems, accessible WebGL interfaces, and high-performance frontend engineering.',
  'Frontend Engineering, UI/UX & Web Performance',
  'preset:team-3',
  'd3300000-0000-4000-a000-000000000002',
  true
)
ON CONFLICT (id) DO UPDATE SET
  description = EXCLUDED.description,
  focus = EXCLUDED.focus;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000003', 'd3300000-0000-4000-a000-000000000002', 'Team Lead')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000003', 'd3300000-0000-4000-a000-000000000008', 'Creative Developer')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000003', 'd3300000-0000-4000-a000-000000000011', 'Product Designer')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000003', 'd3300000-0000-4000-a000-000000000015', 'Frontend Developer')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000003', 'd3300000-0000-4000-a000-000000000017', 'Mobile Specialist')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000003', 'd3300000-0000-4000-a000-000000000021', 'UI Engineer')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000003', 'd3300000-0000-4000-a000-000000000024', 'Visual Designer')
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO public.team_members (team_id, user_id, role)
VALUES ('d3300000-0000-4000-c000-000000000003', 'd3300000-0000-4000-a000-000000000034', 'UX Researcher')
ON CONFLICT (team_id, user_id) DO NOTHING;

-- ============================================================================
-- 7. INSERT 40 COMMUNITY OPEN SOURCE REPOSITORIES
-- ============================================================================

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'react',
  'facebook',
  'facebook/react',
  'The library for web and native user interfaces.',
  'https://github.com/facebook/react',
  'JavaScript',
  228000,
  45000,
  ARRAY['declarative', 'frontend', 'javascript', 'react', 'ui']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'next.js',
  'vercel',
  'vercel/next.js',
  'The React Framework for the Web created by Vercel.',
  'https://github.com/vercel/next.js',
  'JavaScript',
  126000,
  26000,
  ARRAY['blog', 'browser', 'compiler', 'nextjs', 'react', 'ssr']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'supabase',
  'supabase',
  'supabase/supabase',
  'The open source Firebase alternative with Postgres, Auth, and Realtime.',
  'https://github.com/supabase/supabase',
  'TypeScript',
  74000,
  6200,
  ARRAY['database', 'firebase', 'postgres', 'realtime', 'supabase']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'vscode',
  'microsoft',
  'microsoft/vscode',
  'Visual Studio Code is a code editor redefined and optimized for building modern web and cloud applications.',
  'https://github.com/microsoft/vscode',
  'TypeScript',
  162000,
  30000,
  ARRAY['developer-tools', 'editor', 'electron', 'typescript', 'vscode']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'tailwindcss',
  'tailwindlabs',
  'tailwindlabs/tailwindcss',
  'A utility-first CSS framework for rapid UI development.',
  'https://github.com/tailwindlabs/tailwindcss',
  'TypeScript',
  83000,
  4100,
  ARRAY['css', 'css-framework', 'design-systems', 'responsive', 'tailwind']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'linux',
  'torvalds',
  'torvalds/linux',
  'Linux kernel source tree maintained by Linus Torvalds.',
  'https://github.com/torvalds/linux',
  'C',
  184000,
  54000,
  ARRAY['kernel', 'linux', 'operating-system', 'systems']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'core',
  'vuejs',
  'vuejs/core',
  'Vue.js is a progressive, incrementally-adoptable JavaScript framework.',
  'https://github.com/vuejs/core',
  'TypeScript',
  47000,
  8100,
  ARRAY['framework', 'frontend', 'javascript', 'vue']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'angular',
  'angular',
  'angular/angular',
  'Deliver web apps with confidence using Google web application framework.',
  'https://github.com/angular/angular',
  'TypeScript',
  96000,
  25000,
  ARRAY['angular', 'framework', 'frontend', 'pwa', 'typescript']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'node',
  'nodejs',
  'nodejs/node',
  'Node.js JavaScript runtime built on Chrome V8 JavaScript engine.',
  'https://github.com/nodejs/node',
  'JavaScript',
  107000,
  29000,
  ARRAY['backend', 'javascript', 'node', 'runtime', 'server']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'deno',
  'denoland',
  'denoland/deno',
  'A modern runtime for JavaScript and TypeScript with secure defaults.',
  'https://github.com/denoland/deno',
  'Rust',
  95000,
  5200,
  ARRAY['deno', 'javascript', 'runtime', 'rust', 'typescript']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'bun',
  'oven-sh',
  'oven-sh/bun',
  'Incredibly fast JavaScript runtime, bundler, test runner, and package manager.',
  'https://github.com/oven-sh/bun',
  'Zig',
  76000,
  2400,
  ARRAY['bundler', 'javascript', 'nodejs', 'package-manager', 'runtime', 'zig']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'rust',
  'rust-lang',
  'rust-lang/rust',
  'Empowering everyone to build reliable and efficient software.',
  'https://github.com/rust-lang/rust',
  'Rust',
  99000,
  12500,
  ARRAY['compiler', 'language', 'programming-language', 'rust']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'go',
  'golang',
  'golang/go',
  'The Go programming language created by Google.',
  'https://github.com/golang/go',
  'Go',
  124000,
  17500,
  ARRAY['compiler', 'go', 'golang', 'language', 'programming-language']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'kubernetes',
  'kubernetes',
  'kubernetes/kubernetes',
  'Production-Grade Container Scheduling and Management.',
  'https://github.com/kubernetes/kubernetes',
  'Go',
  111000,
  39000,
  ARRAY['containers', 'docker', 'go', 'kubernetes', 'orchestration']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'ui',
  'shadcn-ui',
  'shadcn-ui/ui',
  'Beautifully designed components that you can copy and paste into your apps.',
  'https://github.com/shadcn-ui/ui',
  'TypeScript',
  72000,
  6400,
  ARRAY['components', 'design-system', 'radix-ui', 'react', 'tailwind']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'react-native',
  'facebook',
  'facebook/react-native',
  'A framework for building native applications using React.',
  'https://github.com/facebook/react-native',
  'C++',
  118000,
  24000,
  ARRAY['android', 'ios', 'mobile', 'native', 'react', 'react-native']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'flutter',
  'flutter',
  'flutter/flutter',
  'Flutter makes it easy and fast to build beautiful apps for mobile and beyond.',
  'https://github.com/flutter/flutter',
  'Dart',
  165000,
  27000,
  ARRAY['android', 'cross-platform', 'dart', 'flutter', 'ios', 'mobile']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'axios',
  'axios',
  'axios/axios',
  'Promise based HTTP client for the browser and node.js.',
  'https://github.com/axios/axios',
  'JavaScript',
  104000,
  10600,
  ARRAY['ajax', 'http', 'http-client', 'javascript', 'promise']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'express',
  'expressjs',
  'expressjs/express',
  'Fast, unopinionated, minimalist web framework for node.',
  'https://github.com/expressjs/express',
  'JavaScript',
  64000,
  15500,
  ARRAY['express', 'framework', 'middleware', 'node', 'rest', 'web']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'prisma',
  'prisma',
  'prisma/prisma',
  'Next-generation ORM for Node.js & TypeScript with schema migrations.',
  'https://github.com/prisma/prisma',
  'TypeScript',
  40000,
  1500,
  ARRAY['database', 'orm', 'postgresql', 'prisma', 'sql', 'typescript']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'trpc',
  'trpc',
  'trpc/trpc',
  'Move Fast and Break Nothing. End-to-end typesafe APIs made easy.',
  'https://github.com/trpc/trpc',
  'TypeScript',
  34500,
  1200,
  ARRAY['api', 'fullstack', 'rpc', 'trpc', 'typescript']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'query',
  'TanStack',
  'TanStack/query',
  'Powerful asynchronous state management, data-fetching, and caching for TS/JS.',
  'https://github.com/TanStack/query',
  'TypeScript',
  42000,
  2700,
  ARRAY['cache', 'data-fetching', 'react', 'react-query', 'typescript']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'vite',
  'vitejs',
  'vitejs/vite',
  'Next generation frontend tooling. It is fast!',
  'https://github.com/vitejs/vite',
  'TypeScript',
  70000,
  6100,
  ARRAY['bundler', 'devtools', 'es-modules', 'frontend', 'vite']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'electron',
  'electron',
  'electron/electron',
  'Build cross-platform desktop apps with JavaScript, HTML, and CSS.',
  'https://github.com/electron/electron',
  'C++',
  114000,
  15000,
  ARRAY['c-plus-plus', 'chrome', 'css', 'desktop', 'electron', 'html']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'kafka',
  'apache',
  'apache/kafka',
  'Mirror of Apache Kafka: distributed streaming platform.',
  'https://github.com/apache/kafka',
  'Java',
  28500,
  14000,
  ARRAY['distributed-systems', 'event-streaming', 'java', 'kafka', 'messaging']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'redis',
  'redis',
  'redis/redis',
  'Redis is an in-memory database that persists on disk. The data model is key-value.',
  'https://github.com/redis/redis',
  'C',
  65500,
  23000,
  ARRAY['cache', 'database', 'in-memory', 'key-value', 'nosql', 'redis']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'postgres',
  'postgres',
  'postgres/postgres',
  'Mirror of the official PostgreSQL GIT repository.',
  'https://github.com/postgres/postgres',
  'C',
  15500,
  5200,
  ARRAY['database', 'postgres', 'postgresql', 'relational-database', 'sql']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'tensorflow',
  'tensorflow',
  'tensorflow/tensorflow',
  'An Open Source Machine Learning Framework for Everyone.',
  'https://github.com/tensorflow/tensorflow',
  'C++',
  187000,
  89000,
  ARRAY['deep-learning', 'machine-learning', 'neural-network', 'python', 'tensorflow']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'pytorch',
  'pytorch',
  'pytorch/pytorch',
  'Tensors and Dynamic neural networks in Python with strong GPU acceleration.',
  'https://github.com/pytorch/pytorch',
  'Python',
  85000,
  22500,
  ARRAY['autograd', 'deep-learning', 'gpu', 'neural-network', 'python', 'pytorch']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'langchain',
  'langchain-ai',
  'langchain-ai/langchain',
  'Build context-aware reasoning applications with LangChain.',
  'https://github.com/langchain-ai/langchain',
  'Python',
  97500,
  15500,
  ARRAY['ai', 'langchain', 'llm', 'nlp', 'openai', 'python']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'transformers',
  'huggingface',
  'huggingface/transformers',
  'State-of-the-art Machine Learning for Pytorch, TensorFlow, and JAX.',
  'https://github.com/huggingface/transformers',
  'Python',
  137000,
  26000,
  ARRAY['bert', 'deep-learning', 'huggingface', 'nlp', 'pytorch', 'transformers']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'TypeScript',
  'microsoft',
  'microsoft/TypeScript',
  'TypeScript is a superset of JavaScript that compiles to clean JavaScript output.',
  'https://github.com/microsoft/TypeScript',
  'TypeScript',
  100500,
  12500,
  ARRAY['javascript', 'language', 'microsoft', 'typechecker', 'typescript']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'flask',
  'pallets',
  'pallets/flask',
  'The Python micro framework for building web applications.',
  'https://github.com/pallets/flask',
  'Python',
  68500,
  16000,
  ARRAY['flask', 'framework', 'jinja', 'pallets', 'python', 'web-framework']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'django',
  'django',
  'django/django',
  'The Web framework for perfectionists with deadlines.',
  'https://github.com/django/django',
  'Python',
  80500,
  31500,
  ARRAY['django', 'framework', 'models', 'orm', 'python', 'views']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'spring-boot',
  'spring-projects',
  'spring-projects/spring-boot',
  'Spring Boot helps you to create stand-alone, production-grade Spring based Applications.',
  'https://github.com/spring-projects/spring-boot',
  'Java',
  75500,
  40500,
  ARRAY['framework', 'java', 'microservices', 'spring', 'spring-boot']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'fastapi',
  'fastapi',
  'fastapi/fastapi',
  'FastAPI framework, high performance, easy to learn, fast to code, ready for production.',
  'https://github.com/fastapi/fastapi',
  'Python',
  78500,
  6400,
  ARRAY['async', 'fastapi', 'openapi', 'pydantic', 'python', 'rest']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'uv',
  'astral-sh',
  'astral-sh/uv',
  'An extremely fast Python package and project manager, written in Rust.',
  'https://github.com/astral-sh/uv',
  'Rust',
  44000,
  1200,
  ARRAY['package-manager', 'pip', 'python', 'rust', 'uv']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'ollama',
  'ollama',
  'ollama/ollama',
  'Get up and running with Llama 3, Mistral, Gemma 2, and other large language models.',
  'https://github.com/ollama/ollama',
  'Go',
  104000,
  9200,
  ARRAY['ai', 'go', 'llama', 'llm', 'local-ai', 'ollama']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'vllm',
  'vllm-project',
  'vllm-project/vllm',
  'A high-throughput and memory-efficient inference and serving engine for LLMs.',
  'https://github.com/vllm-project/vllm',
  'Python',
  37500,
  4500,
  ARRAY['cuda', 'inference', 'llm', 'pagedattention', 'pytorch', 'vllm']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

INSERT INTO public.community_repositories (name, owner, full_name, description, html_url, language, stars, forks, topics)
VALUES (
  'docker-cli',
  'docker',
  'docker/cli',
  'The official CLI tool for managing Docker containers and images.',
  'https://github.com/docker/cli',
  'Go',
  5500,
  2400,
  ARRAY['containers', 'docker', 'docker-cli', 'go']
)
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  description = EXCLUDED.description;

-- ============================================================================
-- 8. INSERT DEMO CONVERSATIONS & MESSAGES
-- ============================================================================

INSERT INTO public.conversations (id, type, name, is_demo)
VALUES ('d3300000-0000-4000-d000-000000000001', 'direct', 'Arjun Patel & Meera Nair', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.conversation_members (conversation_id, user_id)
VALUES 
  ('d3300000-0000-4000-d000-000000000001', 'd3300000-0000-4000-a000-000000000001'),
  ('d3300000-0000-4000-d000-000000000001', 'd3300000-0000-4000-a000-000000000002')
ON CONFLICT (conversation_id, user_id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000000',
  'd3300000-0000-4000-d000-000000000001',
  'd3300000-0000-4000-a000-000000000001',
  'Hey Meera! Are you available to review the dashboard telemetry architecture?',
  TIMEZONE('utc', NOW()) - INTERVAL '75 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000001',
  'd3300000-0000-4000-d000-000000000001',
  'd3300000-0000-4000-a000-000000000002',
  'Hey Arjun! Absolutely. I was just reviewing the Recharts dual-gradient velocity implementation. It looks super crisp.',
  TIMEZONE('utc', NOW()) - INTERVAL '60 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000002',
  'd3300000-0000-4000-d000-000000000001',
  'd3300000-0000-4000-a000-000000000001',
  'Awesome. We need to hook up the 30-day velocity metric to the live Supabase project tasks.',
  TIMEZONE('utc', NOW()) - INTERVAL '45 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000003',
  'd3300000-0000-4000-d000-000000000001',
  'd3300000-0000-4000-a000-000000000002',
  'Great, I can handle the frontend data formatting and state hooks tonight. Let me know once the endpoint is ready.',
  TIMEZONE('utc', NOW()) - INTERVAL '30 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000004',
  'd3300000-0000-4000-d000-000000000001',
  'd3300000-0000-4000-a000-000000000001',
  'Pushed the database function! Let me know if you hit any TypeScript typing mismatches.',
  TIMEZONE('utc', NOW()) - INTERVAL '15 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.conversations (id, type, name, is_demo)
VALUES ('d3300000-0000-4000-d000-000000000002', 'direct', 'Harshit Sharma & Arjun Patel', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.conversation_members (conversation_id, user_id)
VALUES 
  ('d3300000-0000-4000-d000-000000000002', 'd3300000-0000-4000-a000-000000000003'),
  ('d3300000-0000-4000-d000-000000000002', 'd3300000-0000-4000-a000-000000000001')
ON CONFLICT (conversation_id, user_id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000100',
  'd3300000-0000-4000-d000-000000000002',
  'd3300000-0000-4000-a000-000000000001',
  'Arjun, did you get a chance to test the Wasm client-side parser crate?',
  TIMEZONE('utc', NOW()) - INTERVAL '60 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000101',
  'd3300000-0000-4000-d000-000000000002',
  'd3300000-0000-4000-a000-000000000003',
  'Yes! It reduced our JSON parsing bottleneck by almost 4x in the benchmark run.',
  TIMEZONE('utc', NOW()) - INTERVAL '45 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000102',
  'd3300000-0000-4000-d000-000000000002',
  'd3300000-0000-4000-a000-000000000001',
  'Incredible. I just added SIMD vectorization. Compiling to wasm32-unknown-unknown now.',
  TIMEZONE('utc', NOW()) - INTERVAL '30 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000103',
  'd3300000-0000-4000-d000-000000000002',
  'd3300000-0000-4000-a000-000000000003',
  'Let us merge it into the Distributed Task Orchestrator repo before tomorrow morning sprint sync.',
  TIMEZONE('utc', NOW()) - INTERVAL '15 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.conversations (id, type, name, is_demo)
VALUES ('d3300000-0000-4000-d000-000000000003', 'direct', 'Rohan Mehta & Ishita Sen', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.conversation_members (conversation_id, user_id)
VALUES 
  ('d3300000-0000-4000-d000-000000000003', 'd3300000-0000-4000-a000-000000000004'),
  ('d3300000-0000-4000-d000-000000000003', 'd3300000-0000-4000-a000-000000000007')
ON CONFLICT (conversation_id, user_id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000200',
  'd3300000-0000-4000-d000-000000000003',
  'd3300000-0000-4000-a000-000000000007',
  'Hey Ishita, how is the embedding pipeline coming along for the resume analyzer?',
  TIMEZONE('utc', NOW()) - INTERVAL '75 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000201',
  'd3300000-0000-4000-d000-000000000003',
  'd3300000-0000-4000-a000-000000000007',
  'Hey Rohan! I swapped in the new bge-large model. Top-3 recall jumped from 72% to 89% on our benchmark test dataset!',
  TIMEZONE('utc', NOW()) - INTERVAL '60 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000202',
  'd3300000-0000-4000-d000-000000000003',
  'd3300000-0000-4000-a000-000000000007',
  '89% is huge. Are we within our 150ms latency SLA on CPU?',
  TIMEZONE('utc', NOW()) - INTERVAL '45 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000203',
  'd3300000-0000-4000-d000-000000000003',
  'd3300000-0000-4000-a000-000000000007',
  'Yes, quantized it with ONNX Runtime. Running at ~85ms per document chunk now!',
  TIMEZONE('utc', NOW()) - INTERVAL '30 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000204',
  'd3300000-0000-4000-d000-000000000003',
  'd3300000-0000-4000-a000-000000000007',
  'Outstanding work. Let us package the FastAPI endpoint and connect the DevConnect discovery cards.',
  TIMEZONE('utc', NOW()) - INTERVAL '15 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.conversations (id, type, name, is_demo)
VALUES ('d3300000-0000-4000-d000-000000000004', 'direct', 'Ananya Roy & Siddharth Rao', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.conversation_members (conversation_id, user_id)
VALUES 
  ('d3300000-0000-4000-d000-000000000004', 'd3300000-0000-4000-a000-000000000005'),
  ('d3300000-0000-4000-d000-000000000004', 'd3300000-0000-4000-a000-000000000012')
ON CONFLICT (conversation_id, user_id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000300',
  'd3300000-0000-4000-d000-000000000004',
  'd3300000-0000-4000-a000-000000000012',
  'Siddharth, Prometheus scrape intervals are set to 15s in the staging cluster.',
  TIMEZONE('utc', NOW()) - INTERVAL '60 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000301',
  'd3300000-0000-4000-d000-000000000004',
  'd3300000-0000-4000-a000-000000000012',
  'Thanks Ananya. I noticed a small memory leak in the WebSocket proxy during load testing.',
  TIMEZONE('utc', NOW()) - INTERVAL '45 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000302',
  'd3300000-0000-4000-d000-000000000004',
  'd3300000-0000-4000-a000-000000000012',
  'Good catch. Let us check the connection close handlers. I will push a patch branch.',
  TIMEZONE('utc', NOW()) - INTERVAL '30 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000303',
  'd3300000-0000-4000-d000-000000000004',
  'd3300000-0000-4000-a000-000000000012',
  'Sounds good, will monitor the Grafana pod memory graph.',
  TIMEZONE('utc', NOW()) - INTERVAL '15 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.conversations (id, type, name, is_demo)
VALUES ('d3300000-0000-4000-d000-000000000005', 'direct', 'Meera Nair & Nikhil Deshmukh', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.conversation_members (conversation_id, user_id)
VALUES 
  ('d3300000-0000-4000-d000-000000000005', 'd3300000-0000-4000-a000-000000000002'),
  ('d3300000-0000-4000-d000-000000000005', 'd3300000-0000-4000-a000-000000000008')
ON CONFLICT (conversation_id, user_id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000400',
  'd3300000-0000-4000-d000-000000000005',
  'd3300000-0000-4000-a000-000000000008',
  'Nikhil, love the new editorial dossier card styling!',
  TIMEZONE('utc', NOW()) - INTERVAL '60 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000401',
  'd3300000-0000-4000-d000-000000000005',
  'd3300000-0000-4000-a000-000000000008',
  'Thanks Meera! Space Grotesk headings with fine 1px borders really gives that premium editorial SaaS vibe.',
  TIMEZONE('utc', NOW()) - INTERVAL '45 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000402',
  'd3300000-0000-4000-d000-000000000005',
  'd3300000-0000-4000-a000-000000000008',
  'Totally agree. Make sure the radial spotlight hover effect on CardSpotlight maintains the 60fps frame rate.',
  TIMEZONE('utc', NOW()) - INTERVAL '30 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000403',
  'd3300000-0000-4000-d000-000000000005',
  'd3300000-0000-4000-a000-000000000008',
  'Tested on both Chrome and Safari—zero layout thrashing.',
  TIMEZONE('utc', NOW()) - INTERVAL '15 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.conversations (id, type, name, is_demo)
VALUES ('d3300000-0000-4000-d000-000000000006', 'direct', 'Kavya Iyer & Aditya Joshi', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.conversation_members (conversation_id, user_id)
VALUES 
  ('d3300000-0000-4000-d000-000000000006', 'd3300000-0000-4000-a000-000000000009'),
  ('d3300000-0000-4000-d000-000000000006', 'd3300000-0000-4000-a000-000000000010')
ON CONFLICT (conversation_id, user_id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000500',
  'd3300000-0000-4000-d000-000000000006',
  'd3300000-0000-4000-a000-000000000010',
  'Aditya, we need to ensure the Supabase Realtime channels validate user session JWTs properly.',
  TIMEZONE('utc', NOW()) - INTERVAL '60 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000501',
  'd3300000-0000-4000-d000-000000000006',
  'd3300000-0000-4000-a000-000000000010',
  'Already on it! Audited the PostgreSQL RLS policies. Direct message tables only allow authenticated participants.',
  TIMEZONE('utc', NOW()) - INTERVAL '45 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000502',
  'd3300000-0000-4000-d000-000000000006',
  'd3300000-0000-4000-a000-000000000010',
  'Perfect. We cannot have messages leaking between demo channels and real users.',
  TIMEZONE('utc', NOW()) - INTERVAL '30 minutes'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at)
VALUES (
  'd3300000-0000-4000-e000-000000000503',
  'd3300000-0000-4000-d000-000000000006',
  'd3300000-0000-4000-a000-000000000010',
  'Everything is isolated under the demo partition with strict auth.uid() checks.',
  TIMEZONE('utc', NOW()) - INTERVAL '15 minutes'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 9. INSERT REALISTIC ACTIVITY LOGS & NOTIFICATIONS
-- ============================================================================
INSERT INTO public.activity_logs (user_id, project_id, action_type, description, created_at)
VALUES 
  ('d3300000-0000-4000-a000-000000000001', 'd3300000-0000-4000-b000-000000000002', 'milestone_completed', 'Arjun completed sprint milestone: Distributed WebSocket mesh benchmarks', NOW() - INTERVAL '2 hours'),
  ('d3300000-0000-4000-a000-000000000002', 'd3300000-0000-4000-b000-000000000008', 'task_updated', 'Meera updated task status to Done: Redesign Three-Column Messaging UI', NOW() - INTERVAL '4 hours'),
  ('d3300000-0000-4000-a000-000000000004', 'd3300000-0000-4000-b000-000000000001', 'project_created', 'Rohan published new project: AI Resume & Technical Skill Analyzer', NOW() - INTERVAL '1 day'),
  ('d3300000-0000-4000-a000-000000000003', 'd3300000-0000-4000-b000-000000000012', 'task_created', 'Harshit created task: Compile Rust AST parser to WebAssembly binary', NOW() - INTERVAL '2 days'),
  ('d3300000-0000-4000-a000-000000000006', 'd3300000-0000-4000-b000-000000000003', 'member_joined', 'Akash joined project team: Modern E-Commerce Headless Storefront', NOW() - INTERVAL '3 days');

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
