export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ExperienceLevel = 'Junior' | 'Mid-Level' | 'Senior' | 'Lead' | 'Architect';
export type AvailabilityStatus = 'available' | 'busy' | 'open_to_collaborate' | 'offline';
export type SkillCategory = 'language' | 'framework' | 'database' | 'devops' | 'tool' | 'ai_ml' | 'other';
export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type ProjectStatus = 'planning' | 'active' | 'in_progress' | 'completed' | 'paused';
export type MemberRole = 'owner' | 'admin' | 'lead' | 'contributor' | 'reviewer';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ConnectionStatus = 'pending' | 'accepted' | 'declined' | 'blocked';
export type NotificationType =
  | 'connection_request'
  | 'connection_accepted'
  | 'project_invite'
  | 'project_update'
  | 'task_assigned'
  | 'new_message'
  | 'collaboration_request';

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  headline: string | null;
  location: string | null;
  website_url: string | null;
  github_username: string | null;
  experience_level: ExperienceLevel;
  availability_status: AvailabilityStatus;
  weekly_hours_available: number;
  interests: string[];
  collaboration_preferences: {
    remoteOnly?: boolean;
    lookingFor?: string[];
    preferredTeamSize?: string;
  } | null;
  is_onboarded: boolean;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  icon: string | null;
  created_at: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  proficiency_level: ProficiencyLevel;
  years_of_experience: number;
  created_at: string;
  skill?: Skill;
}

export interface Project {
  id: string;
  owner_id: string;
  title: string;
  slug: string;
  tagline: string | null;
  description: string;
  category: string;
  status: ProjectStatus;
  team_size_needed: number;
  deadline: string | null;
  collaboration_requirements: string | null;
  github_repo_url: string | null;
  live_demo_url: string | null;
  is_published: boolean;
  required_skills: string[];
  created_at: string;
  updated_at: string;
  owner?: Profile;
  members?: ProjectMember[];
  tasks_count?: number;
  completed_tasks_count?: number;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: MemberRole;
  joined_at: string;
  profile?: Profile;
}

export interface ProjectInvitation {
  id: string;
  project_id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  role: string;
  message: string | null;
  created_at: string;
  updated_at: string;
  project?: Project;
  sender?: Profile;
  receiver?: Profile;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_id: string | null;
  creator_id: string;
  order_index: number;
  due_date: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  assignee?: Profile;
  creator?: Profile;
}

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  is_completed: boolean;
  completed_at: string | null;
  order_index: number;
  created_at: string;
}

export interface Connection {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: ConnectionStatus;
  created_at: string;
  updated_at: string;
  requester?: Profile;
  receiver?: Profile;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'project' | 'group';
  project_id: string | null;
  name: string | null;
  created_at: string;
  updated_at: string;
  members?: ConversationMember[];
  last_message?: Message;
}

export interface ConversationMember {
  id: string;
  conversation_id: string;
  user_id: string;
  last_read_at: string;
  joined_at: string;
  profile?: Profile;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  attachments: {
    name: string;
    url: string;
    type: string;
    size?: number;
  }[];
  is_edited: boolean;
  created_at: string;
  sender?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  sender_id: string | null;
  type: NotificationType;
  title: string;
  content: string;
  data: Record<string, any>;
  is_read: boolean;
  created_at: string;
  sender?: Profile;
}

export interface GitHubAccount {
  id: string;
  user_id: string;
  github_user_id: string | null;
  username: string;
  avatar_url: string | null;
  profile_url: string | null;
  public_repos: number;
  followers: number;
  following: number;
  bio: string | null;
  top_languages: { name: string; percentage: number; color?: string }[];
  cached_repos: {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    updated_at: string;
  }[];
  last_synced_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  project_id: string | null;
  action_type: string;
  description: string;
  metadata: Record<string, any>;
  created_at: string;
  user?: Profile;
}

export interface DeveloperAvailability {
  id: string;
  user_id: string;
  status: AvailabilityStatus;
  hours_per_week: number;
  preferred_roles: string[];
  timezone: string;
  available_from: string;
  notes: string | null;
  updated_at: string;
}

export interface MatchRecommendation {
  developer: Profile;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  reasons: string[];
  calculatedVia: 'ai' | 'algorithmic';
}
