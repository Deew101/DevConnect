-- ============================================================================
-- DEVCONNECT SEED DATA (Canonical Skills & Initial Catalog)
-- ============================================================================

INSERT INTO public.skills (name, category, icon) VALUES
  -- Languages
  ('TypeScript', 'language', 'code'),
  ('JavaScript', 'language', 'code'),
  ('Python', 'language', 'code'),
  ('Rust', 'language', 'code'),
  ('Go', 'language', 'code'),
  ('C++', 'language', 'code'),
  ('C#', 'language', 'code'),
  ('Java', 'language', 'code'),
  ('Kotlin', 'language', 'code'),
  ('Swift', 'language', 'code'),
  ('PHP', 'language', 'code'),
  ('Ruby', 'language', 'code'),
  ('SQL', 'language', 'database'),

  -- Frameworks & Libraries
  ('React', 'framework', 'layers'),
  ('Next.js', 'framework', 'layers'),
  ('Vue.js', 'framework', 'layers'),
  ('Nuxt.js', 'framework', 'layers'),
  ('Svelte', 'framework', 'layers'),
  ('Angular', 'framework', 'layers'),
  ('Node.js', 'framework', 'server'),
  ('Express.js', 'framework', 'server'),
  ('NestJS', 'framework', 'server'),
  ('FastAPI', 'framework', 'server'),
  ('Django', 'framework', 'server'),
  ('Flask', 'framework', 'server'),
  ('Spring Boot', 'framework', 'server'),
  ('Ruby on Rails', 'framework', 'server'),
  ('Tailwind CSS', 'framework', 'palette'),

  -- Databases
  ('PostgreSQL', 'database', 'database'),
  ('MongoDB', 'database', 'database'),
  ('Redis', 'database', 'database'),
  ('Supabase', 'database', 'database'),
  ('MySQL', 'database', 'database'),
  ('Elasticsearch', 'database', 'database'),
  ('Prisma', 'database', 'database'),

  -- Cloud & DevOps
  ('Docker', 'devops', 'box'),
  ('Kubernetes', 'devops', 'cpu'),
  ('AWS', 'devops', 'cloud'),
  ('Google Cloud', 'devops', 'cloud'),
  ('Azure', 'devops', 'cloud'),
  ('Terraform', 'devops', 'cpu'),
  ('GitHub Actions', 'devops', 'git-branch'),
  ('Vercel', 'devops', 'cloud'),

  -- AI / ML
  ('OpenAI API', 'ai_ml', 'sparkles'),
  ('Gemini API', 'ai_ml', 'sparkles'),
  ('PyTorch', 'ai_ml', 'sparkles'),
  ('TensorFlow', 'ai_ml', 'sparkles'),
  ('LangChain', 'ai_ml', 'sparkles'),
  ('Hugging Face', 'ai_ml', 'sparkles'),

  -- Tools
  ('Git', 'tool', 'git-branch'),
  ('GraphQL', 'tool', 'share-2'),
  ('REST APIs', 'tool', 'repeat'),
  ('WebSockets', 'tool', 'activity'),
  ('Figma', 'tool', 'layout'),
  ('Linux', 'tool', 'terminal')
ON CONFLICT (name) DO NOTHING;
