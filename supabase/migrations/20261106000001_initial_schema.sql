-- ============================================================================
-- DEVCONNECT DATABASE SCHEMA & SECURITY POLICIES
-- PostgreSQL + Supabase Authentication & Realtime
-- ============================================================================

-- 0. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  headline TEXT DEFAULT 'Software Developer',
  location TEXT,
  website_url TEXT,
  github_username TEXT,
  experience_level TEXT CHECK (experience_level IN ('Junior', 'Mid-Level', 'Senior', 'Lead', 'Architect')) DEFAULT 'Mid-Level',
  availability_status TEXT CHECK (availability_status IN ('available', 'busy', 'open_to_collaborate', 'offline')) DEFAULT 'open_to_collaborate',
  weekly_hours_available INTEGER DEFAULT 10,
  interests TEXT[] DEFAULT '{}',
  collaboration_preferences JSONB DEFAULT '{"remoteOnly": true, "lookingFor": ["Open Source", "Hackathon", "Startup"], "preferredTeamSize": "3-5"}'::jsonb,
  is_onboarded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================================
-- 2. SKILLS TABLE (Canonical dictionary of skills)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('language', 'framework', 'database', 'devops', 'tool', 'ai_ml', 'other')),
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================================
-- 3. USER_SKILLS (M-to-N with proficiency and years)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency_level TEXT DEFAULT 'Intermediate' CHECK (proficiency_level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  years_of_experience NUMERIC(3,1) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id, skill_id)
);

-- ============================================================================
-- 4. PROJECTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Web Application',
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'in_progress', 'completed', 'paused')),
  team_size_needed INTEGER DEFAULT 3,
  deadline TIMESTAMPTZ,
  collaboration_requirements TEXT,
  github_repo_url TEXT,
  live_demo_url TEXT,
  is_published BOOLEAN DEFAULT true,
  required_skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================================
-- 5. PROJECT_MEMBERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'contributor' CHECK (role IN ('owner', 'admin', 'lead', 'contributor', 'reviewer')),
  joined_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(project_id, user_id)
);

-- ============================================================================
-- 6. PROJECT_INVITATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.project_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
  role TEXT DEFAULT 'contributor',
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================================
-- 7. TASKS (KANBAN BOARD)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  due_date TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================================
-- 8. MILESTONES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================================
-- 9. CONNECTIONS (DEVELOPER NETWORK)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(requester_id, receiver_id)
);

-- ============================================================================
-- 10. CONVERSATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT DEFAULT 'direct' CHECK (type IN ('direct', 'project', 'group')),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================================
-- 11. CONVERSATION_MEMBERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.conversation_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(conversation_id, user_id)
);

-- ============================================================================
-- 12. MESSAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  is_edited BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================================
-- 13. NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('connection_request', 'connection_accepted', 'project_invite', 'project_update', 'task_assigned', 'new_message', 'collaboration_request')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================================
-- 14. GITHUB_ACCOUNTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.github_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  github_user_id TEXT,
  username TEXT NOT NULL,
  avatar_url TEXT,
  profile_url TEXT,
  public_repos INTEGER DEFAULT 0,
  followers INTEGER DEFAULT 0,
  following INTEGER DEFAULT 0,
  bio TEXT,
  top_languages JSONB DEFAULT '[]'::jsonb,
  cached_repos JSONB DEFAULT '[]'::jsonb,
  last_synced_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================================
-- 15. ACTIVITY_LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================================
-- 16. SAVED_PROJECTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.saved_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id, project_id)
);

-- ============================================================================
-- 17. DEVELOPER_AVAILABILITY TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.developer_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  status TEXT DEFAULT 'open_to_collaborate' CHECK (status IN ('available', 'busy', 'open_to_collaborate', 'offline')),
  hours_per_week INTEGER DEFAULT 10,
  preferred_roles TEXT[] DEFAULT '{}',
  timezone TEXT DEFAULT 'UTC',
  available_from DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_availability ON public.profiles(availability_status);
CREATE INDEX IF NOT EXISTS idx_user_skills_user ON public.user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill ON public.user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_projects_owner ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_project_members_project ON public.project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user ON public.project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON public.tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_connections_requester ON public.connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_connections_receiver ON public.connections(receiver_id);
CREATE INDEX IF NOT EXISTS idx_conversation_members_user ON public.conversation_members(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_members_conv ON public.conversation_members(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_project ON public.activity_logs(project_id);

-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- A. Auto-update updated_at timestamp function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_profiles ON public.profiles;
CREATE TRIGGER trigger_update_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_update_projects ON public.projects;
CREATE TRIGGER trigger_update_projects
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_update_tasks ON public.tasks;
CREATE TRIGGER trigger_update_tasks
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_update_connections ON public.connections;
CREATE TRIGGER trigger_update_connections
  BEFORE UPDATE ON public.connections
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- B. Automatically create profile upon user registration (auth.users trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  user_full_name TEXT;
  user_avatar TEXT;
  counter INTEGER := 0;
BEGIN
  -- Extract name from metadata if available
  user_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );

  user_avatar := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture',
    NULL
  );

  -- Sanitize username from email or metadata
  base_username := lower(regexp_replace(
    COALESCE(
      NEW.raw_user_meta_data->>'user_name',
      NEW.raw_user_meta_data->>'preferred_username',
      split_part(NEW.email, '@', 1)
    ),
    '[^a-zA-Z0-9_]', '', 'g'
  ));

  IF length(base_username) < 3 THEN
    base_username := 'dev_' || substr(md5(random()::text), 1, 6);
  END IF;

  final_username := base_username;

  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || counter::text;
  END LOOP;

  INSERT INTO public.profiles (
    id,
    username,
    full_name,
    avatar_url,
    headline,
    is_onboarded
  ) VALUES (
    NEW.id,
    final_username,
    user_full_name,
    user_avatar,
    'Software Developer',
    false
  )
  ON CONFLICT (id) DO NOTHING;

  -- Also initialize developer_availability
  INSERT INTO public.developer_availability (user_id, status, hours_per_week)
  VALUES (NEW.id, 'open_to_collaborate', 10)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- C. Automatically add project creator to project_members as 'owner'
CREATE OR REPLACE FUNCTION public.handle_new_project()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.project_members (project_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner')
  ON CONFLICT (project_id, user_id) DO NOTHING;

  -- Create default project conversation
  INSERT INTO public.conversations (type, project_id, name)
  VALUES ('project', NEW.id, NEW.title || ' General')
  ON CONFLICT DO NOTHING;

  -- Log activity
  INSERT INTO public.activity_logs (user_id, project_id, action_type, description)
  VALUES (NEW.owner_id, NEW.id, 'project_created', 'Created project ' || NEW.title);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_project_created ON public.projects;
CREATE TRIGGER on_project_created
  AFTER INSERT ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_project();


-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_availability ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES
-- Anyone can view profiles (public developer network)
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can only insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. SKILLS POLICIES
-- Everyone can select skills
CREATE POLICY "Skills are readable by everyone"
  ON public.skills FOR SELECT
  USING (true);

-- Authenticated users can insert new skills
CREATE POLICY "Authenticated users can create skills"
  ON public.skills FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 3. USER_SKILLS POLICIES
-- Viewable by everyone
CREATE POLICY "User skills are viewable by everyone"
  ON public.user_skills FOR SELECT
  USING (true);

-- Manageable only by the owner
CREATE POLICY "Users can manage their own skills"
  ON public.user_skills FOR ALL
  USING (auth.uid() = user_id);

-- 4. PROJECTS POLICIES
-- Published projects or projects where user is member/owner are viewable
CREATE POLICY "Projects viewable if published or user is member"
  ON public.projects FOR SELECT
  USING (
    is_published = true
    OR auth.uid() = owner_id
    OR EXISTS (
      SELECT 1 FROM public.project_members
      WHERE project_id = public.projects.id AND user_id = auth.uid()
    )
  );

-- Authenticated users can create projects
CREATE POLICY "Authenticated users can create projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Project owners or admins can update
CREATE POLICY "Project owners can update their projects"
  ON public.projects FOR UPDATE
  USING (
    auth.uid() = owner_id
    OR EXISTS (
      SELECT 1 FROM public.project_members
      WHERE project_id = public.projects.id AND user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Only project owners can delete
CREATE POLICY "Project owners can delete their projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = owner_id);

-- 5. PROJECT_MEMBERS POLICIES
-- Members visible to everyone (or project viewers)
CREATE POLICY "Project members are viewable by authenticated users"
  ON public.project_members FOR SELECT
  USING (auth.role() = 'authenticated');

-- Project owner or admins can insert/update/delete members
CREATE POLICY "Owners and admins can manage members"
  ON public.project_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id AND owner_id = auth.uid()
    )
    OR user_id = auth.uid() -- Allow member to leave
  );

-- 6. PROJECT_INVITATIONS POLICIES
-- View invitations where user is sender, receiver, or project owner
CREATE POLICY "Users can view relevant invitations"
  ON public.project_invitations FOR SELECT
  USING (
    auth.uid() = sender_id
    OR auth.uid() = receiver_id
    OR EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id AND owner_id = auth.uid()
    )
  );

-- Project admins/owner can send invitations
CREATE POLICY "Project team can invite"
  ON public.project_invitations FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id AND (
        owner_id = auth.uid() OR EXISTS (
          SELECT 1 FROM public.project_members WHERE project_id = public.projects.id AND user_id = auth.uid() AND role IN ('owner', 'admin', 'lead')
        )
      )
    )
  );

-- Receiver or sender can update invitation status
CREATE POLICY "Receiver or sender can update invitation"
  ON public.project_invitations FOR UPDATE
  USING (auth.uid() = receiver_id OR auth.uid() = sender_id);

-- 7. TASKS POLICIES
-- Viewable by project members
CREATE POLICY "Project members can view tasks"
  ON public.tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.project_members
      WHERE project_id = public.tasks.project_id AND user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = public.tasks.project_id AND owner_id = auth.uid()
    )
  );

-- Members can create tasks
CREATE POLICY "Project members can create tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (
    auth.uid() = creator_id
    AND (
      EXISTS (
        SELECT 1 FROM public.project_members
        WHERE project_id = public.tasks.project_id AND user_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM public.projects
        WHERE id = public.tasks.project_id AND owner_id = auth.uid()
      )
    )
  );

-- Members can update tasks (Kanban status change, reassign)
CREATE POLICY "Project members can update tasks"
  ON public.tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.project_members
      WHERE project_id = public.tasks.project_id AND user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = public.tasks.project_id AND owner_id = auth.uid()
    )
  );

-- Creator or owner can delete tasks
CREATE POLICY "Task creator or project owner can delete tasks"
  ON public.tasks FOR DELETE
  USING (
    auth.uid() = creator_id
    OR EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = public.tasks.project_id AND owner_id = auth.uid()
    )
  );

-- 8. MILESTONES POLICIES
CREATE POLICY "Project members can view milestones"
  ON public.milestones FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.project_members
      WHERE project_id = public.milestones.project_id AND user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = public.milestones.project_id AND (is_published = true OR owner_id = auth.uid())
    )
  );

CREATE POLICY "Project admins can manage milestones"
  ON public.milestones FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = public.milestones.project_id AND owner_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.project_members
      WHERE project_id = public.milestones.project_id AND user_id = auth.uid() AND role IN ('owner', 'admin', 'lead')
    )
  );

-- 9. CONNECTIONS POLICIES
CREATE POLICY "Users can view their connections"
  ON public.connections FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send connection requests"
  ON public.connections FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update their connection requests"
  ON public.connections FOR UPDATE
  USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can delete connection"
  ON public.connections FOR DELETE
  USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

-- 10. CONVERSATIONS & MEMBERS POLICIES
CREATE POLICY "Users can view their conversations"
  ON public.conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_members
      WHERE conversation_id = public.conversations.id AND user_id = auth.uid()
    )
    OR (
      project_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.project_members
        WHERE project_id = public.conversations.project_id AND user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Authenticated users can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Members can view conversation members"
  ON public.conversation_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_members cm
      WHERE cm.conversation_id = public.conversation_members.conversation_id AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join or add members"
  ON public.conversation_members FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own conversation member record"
  ON public.conversation_members FOR UPDATE
  USING (user_id = auth.uid());

-- 11. MESSAGES POLICIES
CREATE POLICY "Conversation members can read messages"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_members
      WHERE conversation_id = public.messages.conversation_id AND user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.conversations c
      JOIN public.project_members pm ON pm.project_id = c.project_id
      WHERE c.id = public.messages.conversation_id AND pm.user_id = auth.uid()
    )
  );

CREATE POLICY "Conversation members can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND (
      EXISTS (
        SELECT 1 FROM public.conversation_members
        WHERE conversation_id = public.messages.conversation_id AND user_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM public.conversations c
        JOIN public.project_members pm ON pm.project_id = c.project_id
        WHERE c.id = public.messages.conversation_id AND pm.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Senders can edit their messages"
  ON public.messages FOR UPDATE
  USING (auth.uid() = sender_id);

CREATE POLICY "Senders can delete their messages"
  ON public.messages FOR DELETE
  USING (auth.uid() = sender_id);

-- 12. NOTIFICATIONS POLICIES
CREATE POLICY "Users can view their notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System and users can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their notifications (mark as read)"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- 13. GITHUB_ACCOUNTS POLICIES
CREATE POLICY "GitHub accounts viewable by everyone"
  ON public.github_accounts FOR SELECT
  USING (true);

CREATE POLICY "Users manage their own github account connection"
  ON public.github_accounts FOR ALL
  USING (auth.uid() = user_id);

-- 14. ACTIVITY_LOGS POLICIES
CREATE POLICY "Activity logs are viewable by project members or followers"
  ON public.activity_logs FOR SELECT
  USING (
    project_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.is_published = true OR p.owner_id = auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM public.project_members pm WHERE pm.project_id = public.activity_logs.project_id AND pm.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create activity logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 15. SAVED_PROJECTS POLICIES
CREATE POLICY "Users can manage their saved projects"
  ON public.saved_projects FOR ALL
  USING (auth.uid() = user_id);

-- 16. DEVELOPER_AVAILABILITY POLICIES
CREATE POLICY "Availability viewable by everyone"
  ON public.developer_availability FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own availability"
  ON public.developer_availability FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- SUPABASE REALTIME CONFIGURATION
-- Enable realtime publication for reactive chat, notifications, and tasks
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'tasks'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'connections'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.connections;
  END IF;
END $$;

-- ============================================================================
-- STORAGE BUCKETS CONFIGURATION
-- ============================================================================
-- Insert buckets if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('profile-avatars', 'profile-avatars', true),
  ('project-files', 'project-files', true),
  ('chat-attachments', 'chat-attachments', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage bucket RLS policies
CREATE POLICY "Public avatar access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-avatars');

CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'profile-avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their avatars"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'profile-avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Public project files access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-files');

CREATE POLICY "Authenticated users can upload project files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-files' AND auth.role() = 'authenticated');

CREATE POLICY "Chat attachments access for authenticated users"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'chat-attachments' AND auth.role() = 'authenticated');

CREATE POLICY "Chat attachments upload for authenticated users"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'chat-attachments' AND auth.role() = 'authenticated');
