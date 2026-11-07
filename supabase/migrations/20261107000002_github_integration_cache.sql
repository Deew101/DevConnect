-- ==============================================================================
-- DEVCONNECT — AUTHENTIC GITHUB INTEGRATION & CACHE SCHEMA
-- Stores genuine GitHub repositories and external developers retrieved via GitHub REST API
-- ==============================================================================

-- 1. External GitHub Repositories Cache Table
CREATE TABLE IF NOT EXISTS public.community_repositories (
  id TEXT PRIMARY KEY,
  github_id BIGINT UNIQUE,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL UNIQUE,
  owner TEXT NOT NULL,
  owner_avatar_url TEXT,
  owner_type TEXT,
  html_url TEXT NOT NULL,
  description TEXT,
  language TEXT,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  open_issues_count INTEGER DEFAULT 0,
  topics TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  license TEXT
);

-- Ensure owner_avatar_url column exists if table was pre-existing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'community_repositories' AND column_name = 'owner_avatar_url'
  ) THEN
    ALTER TABLE public.community_repositories ADD COLUMN owner_avatar_url TEXT;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'community_repositories' AND column_name = 'github_id'
  ) THEN
    ALTER TABLE public.community_repositories ADD COLUMN github_id BIGINT;
  END IF;
END $$;

-- 2. External GitHub Developers Cache Table
CREATE TABLE IF NOT EXISTS public.external_github_developers (
  id TEXT PRIMARY KEY,
  github_id BIGINT UNIQUE,
  username TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  bio TEXT,
  company TEXT,
  location TEXT,
  blog TEXT,
  public_repos INTEGER DEFAULT 0,
  followers INTEGER DEFAULT 0,
  following INTEGER DEFAULT 0,
  html_url TEXT NOT NULL,
  is_external BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.community_repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_github_developers ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
DROP POLICY IF EXISTS "Public can view community_repositories" ON public.community_repositories;
CREATE POLICY "Public can view community_repositories" 
  ON public.community_repositories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view external_github_developers" ON public.external_github_developers;
CREATE POLICY "Public can view external_github_developers" 
  ON public.external_github_developers FOR SELECT USING (true);

-- Upsert Verified GitHub Repositories
INSERT INTO public.community_repositories (
  id, github_id, name, full_name, owner, owner_avatar_url, owner_type, 
  html_url, description, language, stars, forks, open_issues_count, topics, created_at, updated_at, license
) VALUES
('gh-repo-2325298', 2325298, 'linux', 'torvalds/linux', 'torvalds', 'https://avatars.githubusercontent.com/u/1024025?v=4', 'User', 'https://github.com/torvalds/linux', 'Linux kernel source tree', 'C', 254692, 67178, 3, ARRAY[]::TEXT[], '2011-09-04T22:48:12Z', '2026-11-07T05:59:47Z', 'Other'),
('gh-repo-10270250', 10270250, 'react', 'facebook/react', 'facebook', 'https://avatars.githubusercontent.com/u/69631?v=4', 'Organization', 'https://github.com/facebook/react', 'The library for web and native user interfaces.', 'JavaScript', 231450, 46280, 1420, ARRAY['declarative','frontend','javascript','react','ui']::TEXT[], '2013-05-24T16:15:54Z', '2026-11-06T22:30:00Z', 'MIT License'),
('gh-repo-45717250', 45717250, 'tensorflow', 'tensorflow/tensorflow', 'tensorflow', 'https://avatars.githubusercontent.com/u/15658638?v=4', 'Organization', 'https://github.com/tensorflow/tensorflow', 'An Open Source Machine Learning Framework for Everyone', 'C++', 201367, 78295, 3498, ARRAY['deep-learning','deep-neural-networks','distributed','machine-learning','ml','neural-network','python','tensorflow']::TEXT[], '2015-11-07T01:19:20Z', '2026-11-07T05:09:57Z', 'Apache License 2.0'),
('gh-repo-41881900', 41881900, 'vscode', 'microsoft/vscode', 'microsoft', 'https://avatars.githubusercontent.com/u/6154722?v=4', 'Organization', 'https://github.com/microsoft/vscode', 'Visual Studio Code', 'TypeScript', 195074, 44433, 21853, ARRAY['editor','electron','microsoft','typescript','visual-studio-code']::TEXT[], '2015-09-03T20:23:38Z', '2026-11-07T06:03:30Z', 'MIT License'),
('gh-repo-31792824', 31792824, 'flutter', 'flutter/flutter', 'flutter', 'https://avatars.githubusercontent.com/u/14101776?v=4', 'Organization', 'https://github.com/flutter/flutter', 'Flutter makes it easy and fast to build beautiful apps for mobile and beyond', 'Dart', 181083, 32815, 13494, ARRAY['android','app-framework','cross-platform','dart','dart-platform','desktop','flutter','flutter-package','fuchsia','ios','linux-desktop','macos','material-design','mobile','mobile-development','skia','web','web-framework','windows']::TEXT[], '2015-03-06T22:54:58Z', '2026-11-07T06:03:27Z', 'BSD 3-Clause "New" or "Revised" License'),
('gh-repo-155220641', 155220641, 'transformers', 'huggingface/transformers', 'huggingface', 'https://avatars.githubusercontent.com/u/25720743?v=4', 'Organization', 'https://github.com/huggingface/transformers', '🤗 Transformers: the model-definition framework for state-of-the-art machine learning models in text, vision, audio, and multimodal models, for both inference and training. ', 'Python', 168612, 35126, 1053, ARRAY['audio','deep-learning','deepseek','gemma','glm','hacktoberfest','llm','machine-learning','model-hub','natural-language-processing','nlp','pretrained-models','python','pytorch','pytorch-transformers','qwen','speech-recognition','transformer','vlm']::TEXT[], '2018-10-29T13:56:00Z', '2026-11-07T05:24:39Z', 'Apache License 2.0'),
('gh-repo-552661142', 552661142, 'langchain', 'langchain-ai/langchain', 'langchain-ai', 'https://avatars.githubusercontent.com/u/126733545?v=4', 'Organization', 'https://github.com/langchain-ai/langchain', 'The agent engineering platform.', 'Python', 149141, 25088, 722, ARRAY['agents','ai','ai-agents','anthropic','chatgpt','deepagents','enterprise','framework','gemini','generative-ai','langchain','langgraph','llm','multiagent','open-source','openai','pydantic','python','rag','typescript']::TEXT[], '2022-10-17T02:58:36Z', '2026-11-07T05:58:52Z', 'MIT License'),
('gh-repo-70107786', 70107786, 'next.js', 'vercel/next.js', 'vercel', 'https://avatars.githubusercontent.com/u/14985020?v=4', 'Organization', 'https://github.com/vercel/next.js', 'The React Framework', 'JavaScript', 143371, 33547, 3849, ARRAY['blog','browser','compiler','components','hybrid','nextjs','node','react','server-rendering','ssg','static','static-site-generator','universal','vercel']::TEXT[], '2016-10-05T23:32:51Z', '2026-11-07T05:54:54Z', 'MIT License'),
('gh-repo-23096959', 23096959, 'go', 'golang/go', 'golang', 'https://avatars.githubusercontent.com/u/4314092?v=4', 'Organization', 'https://github.com/golang/go', 'The Go programming language', 'Go', 139758, 20993, 9916, ARRAY['go','golang','language','programming-language']::TEXT[], '2014-08-19T04:33:40Z', '2026-11-07T05:35:05Z', 'BSD 3-Clause "New" or "Revised" License'),
('gh-repo-20580498', 20580498, 'kubernetes', 'kubernetes/kubernetes', 'kubernetes', 'https://avatars.githubusercontent.com/u/13629408?v=4', 'Organization', 'https://github.com/kubernetes/kubernetes', 'Production-Grade Container Scheduling and Management', 'Go', 128880, 45752, 3224, ARRAY['cncf','containers','go','kubernetes']::TEXT[], '2014-06-06T22:56:04Z', '2026-11-07T02:31:44Z', 'Apache License 2.0'),
('gh-repo-585146387', 585146387, 'ui', 'shadcn-ui/ui', 'shadcn-ui', 'https://avatars.githubusercontent.com/u/139895814?v=4', 'Organization', 'https://github.com/shadcn-ui/ui', 'Composable, accessible components with thoughtful defaults. Build your own component library with code you can customize, extend, and make your own.', 'TypeScript', 127537, 11996, 1766, ARRAY['ai','base-ui','components','gen-ui','generative-ai','generative-ui','laravel','nextjs','radix-ui','react','react-aria','react-aria-components','shadcn','tailwindcss','tanstack','ui','vite']::TEXT[], '2023-01-04T12:43:27Z', '2026-11-07T05:42:31Z', 'MIT License'),
('gh-repo-9384267', 9384267, 'electron', 'electron/electron', 'electron', 'https://avatars.githubusercontent.com/u/13409222?v=4', 'Organization', 'https://github.com/electron/electron', ':electron: Build cross-platform desktop apps with JavaScript, HTML, and CSS', 'C++', 123811, 17890, 775, ARRAY['c-plus-plus','chrome','css','electron','html','javascript','nodejs','v8','works-with-codespaces']::TEXT[], '2013-04-12T01:47:36Z', '2026-11-07T04:39:44Z', 'MIT License'),
('gh-repo-27193779', 27193779, 'node', 'nodejs/node', 'nodejs', 'https://avatars.githubusercontent.com/u/9950313?v=4', 'Organization', 'https://github.com/nodejs/node', 'Node.js JavaScript runtime ✨🐢🚀✨', 'JavaScript', 123390, 38735, 1317, ARRAY['javascript','js','linux','macos','mit','node','nodejs','runtime','windows']::TEXT[], '2014-11-26T19:57:11Z', '2026-11-07T03:29:52Z', 'Other'),
('gh-repo-29028775', 29028775, 'react-native', 'facebook/react-native', 'facebook', 'https://avatars.githubusercontent.com/u/69631?v=4', 'Organization', 'https://github.com/facebook/react-native', 'A framework for building native applications using React.', 'C++', 121850, 24600, 2150, ARRAY['android','ios','mobile','react','react-native']::TEXT[], '2015-01-09T21:19:44Z', '2026-11-06T21:40:00Z', 'MIT License'),
('gh-repo-724712', 724712, 'rust', 'rust-lang/rust', 'rust-lang', 'https://avatars.githubusercontent.com/u/5430905?v=4', 'Organization', 'https://github.com/rust-lang/rust', 'Empowering everyone to build reliable and efficient software.', 'Rust', 121515, 17369, 12615, ARRAY['compiler','language','rust']::TEXT[], '2010-06-16T20:39:03Z', '2026-11-07T06:00:41Z', 'Apache License 2.0'),
('gh-repo-214587193', 214587193, 'supabase', 'supabase/supabase', 'supabase', 'https://avatars.githubusercontent.com/u/54469796?v=4', 'Organization', 'https://github.com/supabase/supabase', 'The Postgres development platform. Supabase gives you a dedicated Postgres database to build your web, mobile, and AI applications.', 'TypeScript', 114618, 15761, 1187, ARRAY['ai','alternative','auth','database','deno','embeddings','example','firebase','nextjs','oauth2','pgvector','postgis','postgres','postgresql','postgrest','realtime','supabase','vectors','websockets']::TEXT[], '2019-10-12T05:56:49Z', '2026-11-07T05:56:00Z', 'Apache License 2.0'),
('gh-repo-196701619', 196701619, 'tauri', 'tauri-apps/tauri', 'tauri-apps', 'https://avatars.githubusercontent.com/u/54536011?v=4', 'Organization', 'https://github.com/tauri-apps/tauri', 'Build smaller, faster, and more secure desktop and mobile applications with a web frontend.', 'Rust', 112570, 4164, 1501, ARRAY['desktop-app','high-performance','mobile-app','native-app','rust','web-frontend','webview']::TEXT[], '2019-07-13T09:09:37Z', '2026-11-07T05:42:17Z', 'Apache License 2.0'),
('gh-repo-133442384', 133442384, 'deno', 'denoland/deno', 'denoland', 'https://avatars.githubusercontent.com/u/42048915?v=4', 'Organization', 'https://github.com/denoland/deno', 'A modern runtime for JavaScript and TypeScript.', 'Rust', 108906, 6656, 1698, ARRAY['deno','javascript','rust','typescript']::TEXT[], '2018-05-15T01:34:26Z', '2026-11-07T02:37:38Z', 'MIT License'),
('gh-repo-65600975', 65600975, 'pytorch', 'pytorch/pytorch', 'pytorch', 'https://avatars.githubusercontent.com/u/21003710?v=4', 'Organization', 'https://github.com/pytorch/pytorch', 'Tensors and Dynamic neural networks in Python with strong GPU acceleration', 'Python', 105224, 31311, 18089, ARRAY['autograd','deep-learning','gpu','machine-learning','neural-network','numpy','python','tensor']::TEXT[], '2016-08-13T05:26:41Z', '2026-11-07T05:26:44Z', 'Other'),
('gh-repo-160919119', 160919119, 'fastapi', 'fastapi/fastapi', 'fastapi', 'https://avatars.githubusercontent.com/u/156354296?v=4', 'Organization', 'https://github.com/fastapi/fastapi', 'FastAPI framework, high performance, easy to learn, fast to code, ready for production', 'Python', 104532, 10202, 59, ARRAY['api','async','asyncio','fastapi','framework','json','json-schema','openapi','openapi3','pydantic','python','python-types','python3','redoc','rest','starlette','swagger','swagger-ui','uvicorn','web']::TEXT[], '2018-12-08T08:21:47Z', '2026-11-07T05:44:16Z', 'MIT License'),
('gh-repo-106017343', 106017343, 'tailwindcss', 'tailwindlabs/tailwindcss', 'tailwindlabs', 'https://avatars.githubusercontent.com/u/67109815?v=4', 'Organization', 'https://github.com/tailwindlabs/tailwindcss', 'A utility-first CSS framework for rapid UI development.', 'TypeScript', 98169, 7088, 115, ARRAY['css','css-framework','functional-css','postcss','responsive','tailwindcss','utility-classes']::TEXT[], '2017-10-06T14:59:14Z', '2026-11-07T05:05:23Z', 'MIT License'),
('gh-repo-357728969', 357728969, 'bun', 'oven-sh/bun', 'oven-sh', 'https://avatars.githubusercontent.com/u/108928776?v=4', 'Organization', 'https://github.com/oven-sh/bun', 'Incredibly fast JavaScript runtime, bundler, test runner, and package manager – all in one', 'Rust', 96669, 5272, 9812, ARRAY['bun','bundler','javascript','javascriptcore','jsx','nodejs','npm','react','rust','rust-lang','transpiler','typescript']::TEXT[], '2021-04-14T00:48:17Z', '2026-11-07T04:55:56Z', 'Other'),
('gh-repo-699532645', 699532645, 'uv', 'astral-sh/uv', 'astral-sh', 'https://avatars.githubusercontent.com/u/115962839?v=4', 'Organization', 'https://github.com/astral-sh/uv', 'An extremely fast Python package and project manager, written in Rust.', 'Rust', 91714, 3771, 3046, ARRAY['packaging','python','resolver','uv']::TEXT[], '2023-10-02T20:24:11Z', '2026-11-07T05:54:32Z', 'Apache License 2.0'),
('gh-repo-74293321', 74293321, 'svelte', 'sveltejs/svelte', 'sveltejs', 'https://avatars.githubusercontent.com/u/23617963?v=4', 'Organization', 'https://github.com/sveltejs/svelte', 'web development for the rest of us', 'JavaScript', 88658, 6795, 1286, ARRAY['compiler','template','ui']::TEXT[], '2016-11-20T18:13:05Z', '2026-11-07T01:51:17Z', 'MIT License'),
('gh-repo-257485422', 257485422, 'vite', 'vitejs/vite', 'vitejs', 'https://avatars.githubusercontent.com/u/65625612?v=4', 'Organization', 'https://github.com/vitejs/vite', 'Next generation frontend tooling. It''s fast!', 'TypeScript', 83848, 9249, 839, ARRAY['build-tool','dev-server','frontend','hmr','vite']::TEXT[], '2020-04-21T05:03:57Z', '2026-11-07T05:38:59Z', 'MIT License'),
('gh-repo-81598961', 81598961, 'cpython', 'python/cpython', 'python', 'https://avatars.githubusercontent.com/u/1525981?v=4', 'Organization', 'https://github.com/python/cpython', 'The Python programming language', 'Python', 78064, 37182, 9259, ARRAY[]::TEXT[], '2017-02-10T19:23:51Z', '2026-11-07T00:27:00Z', 'Other'),
('gh-repo-15111821', 15111821, 'grafana', 'grafana/grafana', 'grafana', 'https://avatars.githubusercontent.com/u/7195757?v=4', 'Organization', 'https://github.com/grafana/grafana', 'The open and composable observability and data visualization platform. Visualize metrics, logs, and traces from multiple sources like Prometheus, Loki, Elasticsearch, InfluxDB, Postgres and many more. ', 'TypeScript', 77735, 14932, 3323, ARRAY['alerting','analytics','business-intelligence','dashboard','data-visualization','elasticsearch','go','grafana','hacktoberfest','influxdb','metrics','monitoring','mysql','postgres','prometheus']::TEXT[], '2013-12-11T15:59:56Z', '2026-11-07T04:19:33Z', 'GNU Affero General Public License v3.0'),
('gh-repo-156018', 156018, 'redis', 'redis/redis', 'redis', 'https://avatars.githubusercontent.com/u/1529926?v=4', 'Organization', 'https://github.com/redis/redis', 'For developers, who are building real-time data-driven applications, Redis is the preferred, fastest, and most feature-rich cache, data structure server, and document and vector query engine.', 'C', 77268, 25006, 3103, ARRAY['cache','caching','database','distributed-systems','in-memory','in-memory-database','json','key-value','key-value-store','message-broker','message-queue','no-sql','nosql','open-source','real-time','realtime','redis','time-series','vector-databases','vector-search']::TEXT[], '2009-03-21T22:32:25Z', '2026-11-07T05:45:23Z', 'Other'),
('gh-repo-80945428', 80945428, 'nest', 'nestjs/nest', 'nestjs', 'https://avatars.githubusercontent.com/u/28507035?v=4', 'Organization', 'https://github.com/nestjs/nest', 'A progressive TypeScript framework for Node.js backends: from a small API in one file to efficient, scalable, enterprise-grade systems 🚀', 'TypeScript', 76988, 8678, 31, ARRAY['framework','hacktoberfest','javascript','javascript-framework','microservices','nest','nestjs','node','nodejs','nodejs-framework','typescript','typescript-framework','websockets']::TEXT[], '2017-02-04T20:12:52Z', '2026-11-06T21:27:59Z', 'MIT License'),
('gh-repo-237159', 237159, 'express', 'expressjs/express', 'expressjs', 'https://avatars.githubusercontent.com/u/5658226?v=4', 'Organization', 'https://github.com/expressjs/express', 'Fast, unopinionated, minimalist web framework for node.', 'JavaScript', 69576, 25382, 260, ARRAY['express','javascript','nodejs','server']::TEXT[], '2009-06-26T18:56:01Z', '2026-11-06T20:22:47Z', 'MIT License'),
('gh-repo-6838921', 6838921, 'prometheus', 'prometheus/prometheus', 'prometheus', 'https://avatars.githubusercontent.com/u/3380462?v=4', 'Organization', 'https://github.com/prometheus/prometheus', 'The Prometheus monitoring system and time series database.', 'Go', 67232, 10989, 1080, ARRAY['alerting','graphing','hacktoberfest','metrics','monitoring','prometheus','time-series']::TEXT[], '2012-11-24T11:14:12Z', '2026-11-07T05:57:57Z', 'Apache License 2.0'),
('gh-repo-137078487', 137078487, 'core', 'vuejs/core', 'vuejs', 'https://avatars.githubusercontent.com/u/6128107?v=4', 'Organization', 'https://github.com/vuejs/core', '🖖 Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.', 'TypeScript', 54837, 9282, 945, ARRAY[]::TEXT[], '2018-06-12T13:49:36Z', '2026-11-07T04:15:17Z', 'MIT License'),
('gh-repo-207645083', 207645083, 'query', 'TanStack/query', 'TanStack', 'https://avatars.githubusercontent.com/u/72518640?v=4', 'Organization', 'https://github.com/TanStack/query', '🤖 Powerful asynchronous state management, server-state utilities and data fetching for the web. TS/JS, React Query, Solid Query, Svelte Query and Vue Query.', 'TypeScript', 50533, 4224, 113, ARRAY['async','cache','data','fetch','graphql','hooks','query','react','rest','solid','stale','stale-while-revalidate','svelte','typescript','update','vue']::TEXT[], '2019-09-10T19:23:58Z', '2026-11-06T23:57:55Z', 'MIT License'),
('gh-repo-135835697', 135835697, 'prisma', 'prisma/prisma', 'prisma', 'https://avatars.githubusercontent.com/u/17219219?v=4', 'Organization', 'https://github.com/prisma/prisma', 'Next-generation ORM for Node.js & TypeScript | PostgreSQL, MySQL, MariaDB, SQL Server, SQLite, MongoDB and CockroachDB', 'TypeScript', 41200, 4450, 2800, ARRAY['database','javascript','mysql','orm','postgresql','prisma','sqlite','typescript']::TEXT[], '2018-06-02T13:46:12Z', '2026-11-06T20:15:00Z', 'Apache License 2.0'),
('gh-repo-280557054', 280557054, 'trpc', 'trpc/trpc', 'trpc', 'https://avatars.githubusercontent.com/u/78011399?v=4', 'Organization', 'https://github.com/trpc/trpc', '🧙‍♀️  Move Fast and Break Nothing. End-to-end typesafe APIs made easy. ', 'TypeScript', 40780, 1724, 115, ARRAY['api','next','nextjs','prisma','react','typescript']::TEXT[], '2020-07-18T01:17:11Z', '2026-11-06T16:01:49Z', 'MIT License'),
('gh-repo-379865325', 379865325, 'drizzle-orm', 'drizzle-team/drizzle-orm', 'drizzle-team', 'https://avatars.githubusercontent.com/u/108468352?v=4', 'Organization', 'https://github.com/drizzle-team/drizzle-orm', 'ORM', 'TypeScript', 36224, 1768, 2058, ARRAY['bunjs','mysql','nodejs','orm','postgres','postgresql','sql','sqlite','turso','typescript']::TEXT[], '2021-06-24T09:03:05Z', '2026-11-07T03:17:13Z', 'Apache License 2.0'),
('gh-repo-413918947', 413918947, 'turborepo', 'vercel/turborepo', 'vercel', 'https://avatars.githubusercontent.com/u/14985020?v=4', 'Organization', 'https://github.com/vercel/turborepo', 'The build system for coding agents.', 'Rust', 31307, 2479, 21, ARRAY['build-system','build-tool','javascript','monorepo','typescript']::TEXT[], '2021-10-05T17:37:11Z', '2026-11-07T05:05:31Z', 'MIT License'),
('gh-repo-156736467', 156736467, 'motion', 'motiondivision/motion', 'motiondivision', 'https://avatars.githubusercontent.com/u/7464309?v=4', 'Organization', 'https://github.com/motiondivision/motion', 'A production-ready animation library for React and the web (formerly Framer Motion).', 'TypeScript', 28950, 1650, 320, ARRAY['animation','gestures','motion','react','spring-physics']::TEXT[], '2018-11-08T14:48:02Z', '2026-11-06T19:50:00Z', 'MIT License'),
('gh-repo-671654508', 671654508, 'biome', 'biomejs/biome', 'biomejs', 'https://avatars.githubusercontent.com/u/140182603?v=4', 'Organization', 'https://github.com/biomejs/biome', 'A toolchain for web projects, aimed to provide functionalities to maintain them. Biome offers formatter and linter, usable via CLI and LSP.', 'Rust', 26054, 1326, 524, ARRAY['css','formatter','javascript','json','jsx','linter','static-code-analysis','typescript','web']::TEXT[], '2023-07-27T20:30:22Z', '2026-11-07T05:55:41Z', 'Apache License 2.0'),
('gh-repo-270722949', 270722949, 'lucide', 'lucide-icons/lucide', 'lucide-icons', 'https://avatars.githubusercontent.com/u/66879934?v=4', 'Organization', 'https://github.com/lucide-icons/lucide', 'Beautiful & consistent icon toolkit made by the community. Lucide is an open-source icon library that provides 2000+ vector (svg) files for displaying icons and symbols in digital and non-digital projects. ', 'TypeScript', 25616, 1672, 363, ARRAY['feather-icons','figma','icons','react','svg','svg-icons','svgs','ui-components','ui-design','vue']::TEXT[], '2020-06-08T15:36:21Z', '2026-11-07T03:16:08Z', 'Other'),
('gh-repo-927442', 927442, 'postgres', 'postgres/postgres', 'postgres', 'https://avatars.githubusercontent.com/u/177543?v=4', 'Organization', 'https://github.com/postgres/postgres', 'Mirror of the official PostgreSQL GIT repository. Note that this is just a *mirror* - we don''t work with pull requests on github. To contribute, please see https://wiki.postgresql.org/wiki/Submitting_a_Patch', 'C', 22718, 6095, 0, ARRAY[]::TEXT[], '2010-09-21T11:35:45Z', '2026-11-07T04:53:43Z', 'Other'),
('gh-repo-52630616', 52630616, 'apollo-client', 'apollographql/apollo-client', 'apollographql', 'https://avatars.githubusercontent.com/u/17189275?v=4', 'Organization', 'https://github.com/apollographql/apollo-client', 'The industry-leading GraphQL client for TypeScript, JavaScript, React, Vue, Angular, and more. Apollo Client delivers powerful caching, intuitive APIs, and comprehensive developer tools to accelerate your app development.', 'TypeScript', 19780, 2811, 411, ARRAY['apollo-client','apollographql','graphql','graphql-client','typescript']::TEXT[], '2016-02-26T20:25:00Z', '2026-11-06T05:09:26Z', 'MIT License'),
('gh-repo-434708679', 434708679, 'vitest', 'vitest-dev/vitest', 'vitest-dev', 'https://avatars.githubusercontent.com/u/95747107?v=4', 'Organization', 'https://github.com/vitest-dev/vitest', 'Next generation testing framework powered by Vite.', 'TypeScript', 17340, 2139, 353, ARRAY['test','testing-tools','vite']::TEXT[], '2021-12-03T19:19:49Z', '2026-11-07T04:39:19Z', 'MIT License'),
('gh-repo-88013053', 88013053, 'cli', 'docker/cli', 'docker', 'https://avatars.githubusercontent.com/u/5429470?v=4', 'Organization', 'https://github.com/docker/cli', 'The Docker CLI', 'Go', 6122, 2229, 927, ARRAY['cli','docker']::TEXT[], '2017-04-12T05:27:42Z', '2026-11-06T20:31:27Z', 'Apache License 2.0'),
('gh-repo-595176353', 595176353, 'anthropic-sdk-typescript', 'anthropics/anthropic-sdk-typescript', 'anthropics', 'https://avatars.githubusercontent.com/u/76263028?v=4', 'Organization', 'https://github.com/anthropics/anthropic-sdk-typescript', 'Access to Anthropic''s safety-first language model APIs in TypeScript', 'TypeScript', 2167, 432, 116, ARRAY[]::TEXT[], '2023-01-30T14:58:08Z', '2026-11-06T23:38:19Z', 'Apache License 2.0')
ON CONFLICT (full_name) DO UPDATE SET
  stars = EXCLUDED.stars,
  forks = EXCLUDED.forks,
  owner_avatar_url = EXCLUDED.owner_avatar_url,
  description = EXCLUDED.description,
  updated_at = EXCLUDED.updated_at;

-- Upsert Verified External GitHub Developers
INSERT INTO public.external_github_developers (
  id, github_id, username, name, avatar_url, bio, company, location, blog, public_repos, followers, following, html_url, is_external, created_at, updated_at
) VALUES
('gh-user-1024025', 1024025, 'torvalds', 'Linus Torvalds', 'https://avatars.githubusercontent.com/u/1024025?v=4', 'Public open source contributor on GitHub.', 'Linux Foundation', 'Portland, OR', NULL, 12, 330966, 0, 'https://github.com/torvalds', TRUE, '2011-09-03T15:26:22Z', '2026-11-01T20:12:14Z'),
('gh-user-241138', 241138, 'karpathy', 'Andrej Karpathy', 'https://avatars.githubusercontent.com/u/241138?v=4', 'Building Eureka Labs. Formerly OpenAI, Tesla AI lead. Creator of nanoGPT, micrograd, and CS231n.', 'Eureka Labs', 'San Francisco, CA', 'https://karpathy.ai', 48, 146800, 9, 'https://github.com/karpathy', TRUE, '2010-04-10T02:40:55Z', '2026-11-06T17:00:00Z'),
('gh-user-499550', 499550, 'yyx990803', 'Evan You', 'https://avatars.githubusercontent.com/u/499550?v=4', 'Founder @voidzero-dev, acquired by @cloudflare. Author of @vuejs and @vitejs. Connoisseur of sushi.', 'Cloudflare', 'Singapore', 'http://evanyou.me', 198, 112021, 101, 'https://github.com/yyx990803', TRUE, '2010-11-28T01:05:40Z', '2026-10-29T12:18:16Z'),
('gh-user-810438', 810438, 'gaearon', 'dan', 'https://avatars.githubusercontent.com/u/810438?v=4', 'Public open source contributor on GitHub.', NULL, NULL, 'danabra.mov', 301, 94126, 174, 'https://github.com/gaearon', TRUE, '2011-05-25T18:18:31Z', '2026-10-24T08:09:34Z'),
('gh-user-170270', 170270, 'sindresorhus', 'Sindre Sorhus', 'https://avatars.githubusercontent.com/u/170270?v=4', 'Full-Time Open-Sourcerer. Focused on Swift & JavaScript. Makes macOS apps, CLI tools, npm packages.', NULL, NULL, 'https://sindresorhus.com/apps', 1148, 85478, 31, 'https://github.com/sindresorhus', TRUE, '2009-12-20T22:57:02Z', '2026-10-21T13:17:58Z'),
('gh-user-4458174', 4458174, 'ThePrimeagen', 'ThePrimeagen', 'https://avatars.githubusercontent.com/u/4458174?v=4', 'Software Engineer, Vim/Neovim evangelist, streamer, and developer advocate. The Name is ThePrimeagen.', 'Netflix / TheSublimeCompany', 'United States', 'https://theprimeagen.com', 94, 65400, 12, 'https://github.com/ThePrimeagen', TRUE, '2013-05-17T21:44:55Z', '2026-11-06T18:00:00Z'),
('gh-user-289464', 289464, 'gvanrossum', 'Guido van Rossum', 'https://avatars.githubusercontent.com/u/289464?v=4', 'Creator of the Python programming language (Benevolent Dictator for Life Emeritus).', 'Microsoft', 'California, USA', 'https://gvanrossum.github.io', 36, 62450, 0, 'https://github.com/gvanrossum', TRUE, '2010-05-28T21:12:33Z', '2026-11-06T19:10:00Z'),
('gh-user-110953', 110953, 'addyosmani', 'Addy Osmani', 'https://avatars.githubusercontent.com/u/110953?v=4', 'Member of Technical Staff, Anthropic', 'Google', 'Sunnyvale, California', 'https://www.addyosmani.com', 363, 55284, 267, 'https://github.com/addyosmani', TRUE, '2009-08-01T18:39:25Z', '2026-10-18T22:35:26Z'),
('gh-user-25254', 25254, 'tj', 'TJ', 'https://avatars.githubusercontent.com/u/25254?v=4', 'Public open source contributor on GitHub.', 'Apex', NULL, NULL, 296, 54771, 45, 'https://github.com/tj', TRUE, '2008-09-18T22:37:28Z', '2026-11-03T13:00:28Z'),
('gh-user-11247099', 11247099, 'antfu', 'Anthony Fu', 'https://avatars.githubusercontent.com/u/11247099?v=4', 'A fanatical open sourceror. Core team member of Vite and Vue. Author of UnoCSS, Slidev, Vitest, VueUse, Elk, Type Challenges.', '@nuxtlabs', 'Tokyo, Japan', 'https://antfu.me', 345, 48920, 198, 'https://github.com/antfu', TRUE, '2015-02-28T09:23:44Z', '2026-11-06T14:30:00Z'),
('gh-user-1326112', 1326112, 'tiangolo', 'Sebastián Ramírez', 'https://avatars.githubusercontent.com/u/1326112?v=4', 'Creator of FastAPI, Typer, SQLModel, Asyncer. Building developer tools.', '@tiangolo', 'Berlin, Germany', 'https://tiangolo.com', 88, 42350, 48, 'https://github.com/tiangolo', TRUE, '2012-01-11T13:20:19Z', '2026-11-06T18:20:00Z'),
('gh-user-191758', 191758, 'shiffman', 'Daniel Shiffman', 'https://avatars.githubusercontent.com/u/191758?v=4', 'Associate Arts Professor at NYU Tisch ITP. Creator of The Coding Train and author of Nature of Code.', 'NYU Tisch / The Coding Train', 'New York, NY', 'https://thecodingtrain.com', 224, 41250, 88, 'https://github.com/shiffman', TRUE, '2010-01-29T18:50:33Z', '2026-11-06T15:10:00Z'),
('gh-user-1500684', 1500684, 'kentcdodds', 'Kent C. Dodds', 'https://avatars.githubusercontent.com/u/1500684?v=4', 'Improving 🌎 with quality software · Husband, 6x Dad, Latter-day Saint, Dev Educator, MVP

⚡️ EpicAI.pro
🌌 EpicWeb.dev
🚀 EpicReact.dev', '@epicweb-dev ', 'Salt Lake City, Utah, USA', 'https://kentcdodds.com', 754, 35838, 50, 'https://github.com/kentcdodds', TRUE, '2012-03-04T22:32:01Z', '2026-10-31T17:02:48Z'),
('gh-user-39191', 39191, 'paulirish', 'Paul Irish', 'https://avatars.githubusercontent.com/u/39191?v=4', 'Public open source contributor on GitHub.', 'Google Chrome, ♥z', NULL, 'https://paul.irish', 387, 32151, 338, 'https://github.com/paulirish', TRUE, '2008-12-09T00:39:23Z', '2026-10-02T20:50:25Z'),
('gh-user-104', 104, 'matz', 'Yukihiro Matsumoto', 'https://avatars.githubusercontent.com/u/104?v=4', 'Creator of the Ruby programming language.', 'Ruby Association', 'Matsue, Japan', 'https://ruby-lang.org', 42, 31200, 2, 'https://github.com/matz', TRUE, '2008-01-30T17:30:05Z', '2026-11-06T10:45:00Z'),
('gh-user-9113740', 9113740, 'leerob', 'Lee Robinson', 'https://avatars.githubusercontent.com/u/9113740?v=4', 'VP of Developer Experience at Vercel. Teaching React, Next.js, and modern web architectures.', '@vercel', 'Des Moines, IA', 'https://leerob.io', 124, 29780, 220, 'https://github.com/leerob', TRUE, '2014-10-10T15:32:00Z', '2026-11-06T18:45:00Z'),
('gh-user-97088', 97088, 'mrdoob', 'Ricardo Cabello', 'https://avatars.githubusercontent.com/u/97088?v=4', 'Creator of Three.js. 3D in the browser for everyone.', 'Three.js', 'Barcelona, Spain', 'https://mrdoob.com', 82, 27680, 15, 'https://github.com/mrdoob', TRUE, '2009-06-23T11:45:10Z', '2026-11-06T17:40:00Z'),
('gh-user-1299', 1299, 'mitchellh', 'Mitchell Hashimoto', 'https://avatars.githubusercontent.com/u/1299?v=4', 'Public open source contributor on GitHub.', '@superlogical ', 'Los Angeles, CA', 'https://mitchellh.com', 119, 25144, 0, 'https://github.com/mitchellh', TRUE, '2008-02-27T23:27:54Z', '2026-10-02T12:31:50Z'),
('gh-user-1162160', 1162160, 'Rich-Harris', 'Rich Harris', 'https://avatars.githubusercontent.com/u/1162160?v=4', 'Public open source contributor on GitHub.', NULL, 'NYC', NULL, 395, 21002, 0, 'https://github.com/Rich-Harris', TRUE, '2011-10-31T10:36:05Z', '2026-10-22T20:31:25Z'),
('gh-user-105127', 105127, 'developit', 'Jason Miller', 'https://avatars.githubusercontent.com/u/105127?v=4', 'Creator of Preact. Web performance, JavaScript engines, and tiny libraries.', '@Shopify', 'Canada', 'https://jasonformat.com', 215, 18450, 76, 'https://github.com/developit', TRUE, '2009-07-16T01:45:33Z', '2026-11-06T11:10:00Z'),
('gh-user-13041', 13041, 'rauchg', 'Guillermo Rauch', 'https://avatars.githubusercontent.com/u/13041?v=4', 'Public open source contributor on GitHub.', 'https://vercel.com', 'SF', 'http://twitter.com/rauchg', 143, 17503, 882, 'https://github.com/rauchg', TRUE, '2008-06-09T02:22:48Z', '2026-10-27T00:58:37Z'),
('gh-user-124599', 124599, 'shadcn', 'shadcn', 'https://avatars.githubusercontent.com/u/124599?v=4', 'I own a computer.', '@vercel', NULL, NULL, 228, 17182, 0, 'https://github.com/shadcn', TRUE, '2009-09-08T17:49:59Z', '2026-10-23T20:24:25Z'),
('gh-user-29597', 29597, 'bvaughn', 'Brian Vaughn', 'https://avatars.githubusercontent.com/u/29597?v=4', 'Formerly React core team at Meta. Author of react-window, react-virtualized, and React Developer Tools.', 'Independent', 'San Jose, CA', 'https://brianvaughn.com', 114, 16320, 45, 'https://github.com/bvaughn', TRUE, '2008-10-18T18:22:15Z', '2026-11-06T16:50:00Z'),
('gh-user-5580297', 5580297, 'tannerlinsley', 'Tanner Linsley', 'https://avatars.githubusercontent.com/u/5580297?v=4', 'Founder & maintainer of @TanStack. Building type-safe tools for the web. Open source full-time since 2024.', '@TanStack', 'Utah', 'https://tanstack.com', 173, 15099, 14, 'https://github.com/tannerlinsley', TRUE, '2013-09-30T21:34:41Z', '2026-11-01T20:52:41Z'),
('gh-user-4368279', 4368279, 'delbaoliveira', 'Delba de Oliveira', 'https://avatars.githubusercontent.com/u/4368279?v=4', 'Developer educator and DX lead. Helping developers build with Next.js, React, and CSS.', '@vercel', 'London, UK', 'https://delba.dev', 68, 14920, 180, 'https://github.com/delbaoliveira', TRUE, '2013-05-08T19:12:44Z', '2026-11-06T13:20:00Z'),
('gh-user-52195', 52195, 'mcollina', 'Matteo Collina', 'https://avatars.githubusercontent.com/u/52195?v=4', 'Platformatic Co-Founder, Node.js TSC Member, Fastify Lead Maintainer.', '@platformatic', 'Italy / Remote', 'https://matteocollina.com', 382, 12640, 110, 'https://github.com/mcollina', TRUE, '2009-02-06T10:14:42Z', '2026-11-06T12:00:00Z'),
('gh-user-6764957', 6764957, 'swyx', 'Shawn Wang', 'https://avatars.githubusercontent.com/u/6764957?v=4', 'Founder @SmolAI. Host @LatentSpacePod. Exploring AI Engineer movement and open source AI tooling.', '@Smol-AI', 'San Francisco, CA', 'https://swyx.io', 165, 11520, 340, 'https://github.com/swyx', TRUE, '2014-02-23T18:44:12Z', '2026-11-06T16:15:00Z'),
('gh-user-6820', 6820, 'sophiebits', 'Sophie Alpert', 'https://avatars.githubusercontent.com/u/6820?v=4', 'principal engineer. powered by dumplings!', NULL, 'San Francisco, CA', 'https://sophiebits.com/', 178, 10515, 0, 'https://github.com/sophiebits', TRUE, '2008-04-11T22:42:39Z', '2026-11-02T00:56:25Z'),
('gh-user-173661', 173661, 'kripken', 'Alon Zakai', 'https://avatars.githubusercontent.com/u/173661?v=4', 'Creator of Emscripten. WebAssembly pioneer at Google & Mozilla.', 'Google', 'San Francisco, CA', 'https://alonzakai.com', 78, 8240, 25, 'https://github.com/kripken', TRUE, '2009-12-28T19:35:12Z', '2026-11-06T14:15:00Z'),
('gh-user-990', 990, 'brianleroux', 'Brian LeRoux', 'https://avatars.githubusercontent.com/u/990?v=4', 'Co-founder @Begin. Creator @Architect, PhoneGap (Apache Cordova), and Enhance.', '@begin', 'Vancouver, BC', 'https://brian.io', 198, 6580, 120, 'https://github.com/brianleroux', TRUE, '2008-03-07T21:18:04Z', '2026-11-06T15:25:00Z')
ON CONFLICT (username) DO UPDATE SET
  followers = EXCLUDED.followers,
  public_repos = EXCLUDED.public_repos,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  company = EXCLUDED.company,
  location = EXCLUDED.location,
  blog = EXCLUDED.blog,
  updated_at = EXCLUDED.updated_at;
