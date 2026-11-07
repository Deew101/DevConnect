import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  Users,
  CheckSquare,
  Milestone as MilestoneIcon,
  MessageSquare,
  Sparkles,
  GitBranch,
  ExternalLink,
  Plus,
  Calendar,
  CheckCircle2,
  Circle,
  Trash2,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Terminal,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Project, Task, Milestone, ProjectMember, Conversation } from '@/types/database.types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { AIMatchModal } from '@/components/matching/AIMatchModal';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { GridPattern } from '@/components/ui/GridPattern';
import { DEMO_PROJECTS, DEMO_PROFILES } from '@/data/demoCommunityData';

export const ProjectWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals & form state
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');
  const [addingMilestone, setAddingMilestone] = useState(false);

  const loadProjectData = useCallback(async () => {
    if (!id) return;
    try {
      let currentProj: any = null;

      // 1. Fetch project from Supabase
      try {
        const { data: projData, error: projError } = await supabase
          .from('projects')
          .select(`
            *,
            owner:owner_id (id, username, full_name, avatar_url)
          `)
          .eq('id', id)
          .single();

        if (!projError && projData) {
          currentProj = projData;
        }
      } catch (e) {
        // ignore
      }

      // Fallback to Demo Projects
      if (!currentProj) {
        const demoMatch = DEMO_PROJECTS.find((dp) => dp.id === id || dp.slug === id);
        if (demoMatch) {
          const owner = DEMO_PROFILES.find((p) => p.id === demoMatch.owner_id) || DEMO_PROFILES[0];
          currentProj = {
            ...demoMatch,
            owner,
          };
        }
      }

      if (!currentProj) {
        throw new Error('Project not found');
      }

      setProject(currentProj);

      // 2. Fetch project members
      try {
        const { data: membersData } = await supabase
          .from('project_members')
          .select(`
            *,
            profile:user_id (id, username, full_name, avatar_url, headline, availability_status)
          `)
          .eq('project_id', id);

        if (membersData && membersData.length > 0) {
          setMembers(membersData as any);
        } else {
          // Demo members
          const demoMembers = [
            {
              id: 'dmem-1',
              project_id: currentProj.id,
              user_id: currentProj.owner.id,
              role: 'owner',
              profile: currentProj.owner,
            },
            {
              id: 'dmem-2',
              project_id: currentProj.id,
              user_id: DEMO_PROFILES[1].id,
              role: 'lead',
              profile: DEMO_PROFILES[1],
            },
            {
              id: 'dmem-3',
              project_id: currentProj.id,
              user_id: DEMO_PROFILES[2].id,
              role: 'contributor',
              profile: DEMO_PROFILES[2],
            },
          ];
          setMembers(demoMembers as any);
        }
      } catch (e) {
        // ignore
      }

      // 3. Fetch project tasks
      try {
        const { data: tasksData } = await supabase
          .from('tasks')
          .select(`
            *,
            assignee:assignee_id (id, username, full_name, avatar_url),
            creator:creator_id (id, username, full_name, avatar_url)
          `)
          .eq('project_id', id)
          .order('order_index', { ascending: true });

        if (tasksData && tasksData.length > 0) {
          setTasks(tasksData as any);
        } else {
          // Demo Tasks
          const demoTasks: any[] = [
            {
              id: `task-${id}-1`,
              project_id: currentProj.id,
              title: 'Architect system boundaries and data schemas',
              description: 'Draft API contracts, database migration files, and edge worker routes.',
              status: 'done',
              priority: 'high',
              creator_id: currentProj.owner.id,
              assignee_id: currentProj.owner.id,
              assignee: currentProj.owner,
              order_index: 0,
              tags: ['architecture', 'backend'],
            },
            {
              id: `task-${id}-2`,
              project_id: currentProj.id,
              title: 'Implement real-time WebSocket telemetry mesh',
              description: 'Wire up live subscription channels and bi-directional message dispatch.',
              status: 'in_progress',
              priority: 'urgent',
              creator_id: currentProj.owner.id,
              assignee_id: DEMO_PROFILES[1].id,
              assignee: DEMO_PROFILES[1],
              order_index: 1,
              tags: ['realtime', 'mesh'],
            },
            {
              id: `task-${id}-3`,
              project_id: currentProj.id,
              title: 'Design dark editorial dashboard interface',
              description: 'Build high-fidelity Linear-inspired responsive workspace with status cards.',
              status: 'review',
              priority: 'medium',
              creator_id: currentProj.owner.id,
              assignee_id: DEMO_PROFILES[2].id,
              assignee: DEMO_PROFILES[2],
              order_index: 2,
              tags: ['ui', 'tailwind'],
            },
            {
              id: `task-${id}-4`,
              project_id: currentProj.id,
              title: 'Unit tests & performance profiling pass',
              description: 'Ensure 90%+ code coverage and zero sub-frame layout thrashing.',
              status: 'todo',
              priority: 'low',
              creator_id: currentProj.owner.id,
              assignee_id: null,
              assignee: null,
              order_index: 3,
              tags: ['testing', 'benchmarks'],
            },
          ];
          setTasks(demoTasks);
        }
      } catch (e) {
        // ignore
      }

      // 4. Fetch project milestones
      try {
        const { data: milestonesData } = await supabase
          .from('milestones')
          .select('*')
          .eq('project_id', id)
          .order('order_index', { ascending: true });

        if (milestonesData && milestonesData.length > 0) {
          setMilestones(milestonesData as Milestone[]);
        } else {
          setMilestones([
            {
              id: `ms-${id}-1`,
              project_id: currentProj.id,
              title: 'Sprint 01: Core Architecture Foundation',
              description: 'Schema migrations, type definitions, and repository initialization',
              is_completed: true,
              completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
              due_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
              order_index: 0,
              created_at: new Date().toISOString(),
            },
            {
              id: `ms-${id}-2`,
              project_id: currentProj.id,
              title: 'Sprint 02: Realtime Synchronization & Kanban',
              description: 'Live task board, chat stream, and AI teammate matchmaking integration',
              is_completed: false,
              completed_at: null,
              due_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
              order_index: 1,
              created_at: new Date().toISOString(),
            },
          ]);
        }
      } catch (e) {
        // ignore
      }

      // 5. Fetch or ensure conversation channel
      try {
        const { data: convData } = await supabase
          .from('conversations')
          .select('*')
          .eq('project_id', id)
          .maybeSingle();

        if (convData) {
          setConversation(convData as Conversation);
        } else {
          setConversation({
            id: `conv-proj-${id}`,
            type: 'project',
            project_id: currentProj.id,
            name: `${currentProj.title} Channel`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as Conversation);
        }
      } catch (e) {
        setConversation({
          id: `conv-proj-${id}`,
          type: 'project',
          project_id: currentProj.id,
          name: `${currentProj.title} Channel`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Conversation);
      }
    } catch (err: any) {
      console.error('Error fetching workspace:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProjectData();

    if (!id) return;

    // Realtime subscription for tasks updates
    const taskChannel = supabase
      .channel(`project-tasks-${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `project_id=eq.${id}`,
        },
        () => {
          loadProjectData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(taskChannel);
    };
  }, [id, loadProjectData]);

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim() || !id) return;

    setAddingMilestone(true);
    try {
      const { error } = await supabase.from('milestones').insert({
        project_id: id,
        title: newMilestoneTitle.trim(),
        due_date: newMilestoneDate ? new Date(newMilestoneDate).toISOString() : null,
        order_index: milestones.length,
      });

      if (error) throw error;
      setNewMilestoneTitle('');
      setNewMilestoneDate('');
      toast({ title: 'Milestone added', type: 'success' });
      loadProjectData();
    } catch (err: any) {
      toast({ title: 'Error adding milestone', description: err.message, type: 'error' });
    } finally {
      setAddingMilestone(false);
    }
  };

  const handleToggleMilestone = async (milestone: Milestone) => {
    try {
      const isCompleted = !milestone.is_completed;
      const { error } = await supabase
        .from('milestones')
        .update({
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
        })
        .eq('id', milestone.id);

      if (error) throw error;
      setMilestones((prev) =>
        prev.map((m) => (m.id === milestone.id ? { ...m, is_completed: isCompleted } : m))
      );
    } catch (err: any) {
      toast({ title: 'Failed to update milestone', description: err.message, type: 'error' });
    }
  };

  const handleDeleteProject = async () => {
    if (!project || !user) return;
    if (project.owner_id !== user.id) {
      toast({ title: 'Only the project owner can delete this project', type: 'error' });
      return;
    }

    if (window.confirm(`Are you sure you want to permanently delete "${project.title}"?`)) {
      try {
        const { error } = await supabase.from('projects').delete().eq('id', project.id);
        if (error) throw error;
        toast({ title: 'Project deleted', type: 'info' });
        navigate('/projects');
      } catch (err: any) {
        toast({ title: 'Failed to delete project', description: err.message, type: 'error' });
      }
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading collaboration workspace..." />;
  }

  if (!project) {
    return (
      <div className="p-16 text-center border border-dashed border-[#273249] rounded-xl max-w-lg mx-auto mt-16 bg-[#101725]">
        <h3 className="font-display text-xl font-bold text-[#F4F6FC] mb-2">Workspace Not Found</h3>
        <p className="text-xs text-[#929DB2] mb-6 leading-relaxed">
          The requested project does not exist or you do not have permission to view it.
        </p>
        <Link to="/projects">
          <Button variant="primary">Browse Workspaces</Button>
        </Link>
      </div>
    );
  }

  // Calculate Progress Percentage
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const isOwner = user && project.owner_id === user.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto pb-12 font-sans"
    >
      {/* Breadcrumb nav */}
      <div className="flex items-center gap-2 text-xs font-mono text-[#929DB2]">
        <Link to="/projects" className="hover:text-[#6D95FF] transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Workspaces
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#273249]" />
        <span className="text-[#F4F6FC] truncate max-w-xs">{project.title}</span>
      </div>

      {/* Workspace Header Hero */}
      <div className="relative rounded-xl border border-[#273249] bg-[#101725] p-6 shadow-2xl overflow-hidden">
        <GridPattern className="opacity-15" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-lg bg-[#151F30] border border-[#6D95FF]/30 text-[#6D95FF] shadow-inner">
                  <FolderGit2 className="h-5 w-5" />
                </span>
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#F4F6FC] tracking-tight flex items-center gap-2.5">
                    {project.title}
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono capitalize bg-[#151F30] text-[#6D95FF] border border-[#273249]">
                      {project.status?.replace(/_/g, ' ')}
                    </span>
                  </h1>
                  <span className="text-xs text-[#6D95FF] font-mono">{project.category}</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#929DB2] pt-1 leading-relaxed">
                {project.tagline || project.description}
              </p>
            </div>

            {/* Action buttons & AI Teammate matching button */}
            <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
              <Button
                variant="glow"
                size="sm"
                onClick={() => setIsAIModalOpen(true)}
                className="font-semibold text-xs shadow-md shadow-[#6D95FF]/20"
              >
                <Sparkles className="h-4 w-4 mr-1.5" /> AI Matchmaker
              </Button>

              {project.github_repo_url && (
                <a
                  href={project.github_repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151F30] hover:bg-[#1C2940] border border-[#273249] text-xs font-mono text-[#F4F6FC] transition-colors"
                >
                  <GitBranch className="h-3.5 w-3.5" /> Repo <ExternalLink className="h-3 w-3" />
                </a>
              )}

              {isOwner && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteProject}
                  className="h-8 px-2.5"
                  title="Delete project"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Workspace Metrics & Progress Bar */}
          <div className="mt-6 pt-5 border-t border-[#273249] grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                <span className="text-[#929DB2] flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#6D95FF]" /> Workspace Velocity
                </span>
                <span className="font-bold text-[#6D95FF]">{progressPercent}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#151F30] border border-[#273249] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#6D95FF] to-[#9D83FF] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-[#929DB2]">
              <CheckSquare className="h-4 w-4 text-[#35C98A]" />
              <span>
                {completedTasks} / {tasks.length} tasks completed
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-[#929DB2] sm:justify-end">
              <Users className="h-4 w-4 text-[#6D95FF]" />
              <span>
                {members.length} / {project.team_size_needed} active contributors
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Workspace Tabs: Kanban Board, Milestones, Team, Chat */}
      <Tabs defaultValue="kanban">
        <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:inline-flex mb-2 bg-[#101725] border border-[#273249]">
          <TabsTrigger value="kanban" className="text-xs gap-1.5 font-mono data-[state=active]:bg-[#151F30] data-[state=active]:text-[#F4F6FC]">
            <CheckSquare className="h-3.5 w-3.5 text-[#6D95FF]" /> Kanban Board
          </TabsTrigger>
          <TabsTrigger value="milestones" className="text-xs gap-1.5 font-mono data-[state=active]:bg-[#151F30] data-[state=active]:text-[#F4F6FC]">
            <MilestoneIcon className="h-3.5 w-3.5 text-[#9D83FF]" /> Milestones ({milestones.length})
          </TabsTrigger>
          <TabsTrigger value="team" className="text-xs gap-1.5 font-mono data-[state=active]:bg-[#151F30] data-[state=active]:text-[#F4F6FC]">
            <Users className="h-3.5 w-3.5 text-[#6D95FF]" /> Team ({members.length})
          </TabsTrigger>
          <TabsTrigger value="chat" className="text-xs gap-1.5 font-mono data-[state=active]:bg-[#151F30] data-[state=active]:text-[#F4F6FC]">
            <MessageSquare className="h-3.5 w-3.5 text-[#35C98A]" /> Team Stream
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Kanban Board */}
        <TabsContent value="kanban" className="mt-4">
          <KanbanBoard
            projectId={project.id}
            initialTasks={tasks}
            members={members}
            onTasksUpdated={loadProjectData}
          />
        </TabsContent>

        {/* Tab 2: Project Milestones */}
        <TabsContent value="milestones" className="mt-4">
          <Card className="border-[#273249] bg-[#101725] p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="font-display text-sm font-bold text-[#F4F6FC] flex items-center gap-2">
                  <MilestoneIcon className="w-4 h-4 text-[#6D95FF]" /> Sprint Deliverables & Milestones
                </CardTitle>
                <p className="text-xs text-[#929DB2] mt-1">
                  Track sprint checkpoints, roadmap release dates, and critical features.
                </p>
              </div>
            </div>

            {/* Add Milestone Form */}
            <form onSubmit={handleAddMilestone} className="flex flex-wrap sm:flex-nowrap gap-2.5">
              <Input
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                placeholder="New milestone title (e.g. Supabase Realtime Channels & Schema Migration)"
                className="flex-1 h-10 text-xs bg-[#151F30] border-[#273249] text-[#F4F6FC]"
                required
              />
              <Input
                type="date"
                value={newMilestoneDate}
                onChange={(e) => setNewMilestoneDate(e.target.value)}
                className="w-full sm:w-44 h-10 text-xs bg-[#151F30] border-[#273249] text-[#F4F6FC]"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={addingMilestone}
                className="h-10 text-xs font-semibold px-4"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Milestone
              </Button>
            </form>

            {/* Milestones Checklist */}
            <div className="space-y-2.5">
              {milestones.length === 0 ? (
                <div className="py-10 text-center text-xs text-[#929DB2] border border-dashed border-[#273249] rounded-xl bg-[#151F30]/40">
                  No sprint milestones configured yet. Add key milestones above to align the team.
                </div>
              ) : (
                milestones.map((ms) => (
                  <div
                    key={ms.id}
                    className={`p-3.5 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                      ms.is_completed
                        ? 'border-[#35C98A]/30 bg-[#35C98A]/10'
                        : 'border-[#273249] bg-[#151F30] hover:bg-[#1C2940]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleMilestone(ms)}
                      className="flex items-center gap-3 text-left flex-1 min-w-0"
                    >
                      {ms.is_completed ? (
                        <CheckCircle2 className="h-5 w-5 text-[#35C98A] flex-shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-[#929DB2] hover:text-[#6D95FF] flex-shrink-0 transition-colors" />
                      )}
                      <span
                        className={`text-xs font-medium truncate ${
                          ms.is_completed ? 'line-through text-[#929DB2]' : 'text-[#F4F6FC]'
                        }`}
                      >
                        {ms.title}
                      </span>
                    </button>

                    {ms.due_date && (
                      <span className="text-[11px] font-mono text-[#929DB2] flex items-center gap-1 flex-shrink-0">
                        <Calendar className="h-3 w-3 text-[#929DB2]" />
                        {formatDate(ms.due_date)}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Tab 3: Team Members */}
        <TabsContent value="team" className="mt-4">
          <Card className="border-[#273249] bg-[#101725] p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-display text-sm font-bold text-[#F4F6FC] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#6D95FF]" /> Active Engineering Contributors
                </CardTitle>
                <p className="text-xs text-[#929DB2] mt-1">
                  Engineers currently building and committing to this workspace.
                </p>
              </div>
              <Button
                variant="glow"
                size="sm"
                onClick={() => setIsAIModalOpen(true)}
                className="text-xs font-semibold"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1" /> Recruit with AI Match
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((mem) => (
                <div
                  key={mem.id}
                  className="p-4 rounded-xl border border-[#273249] bg-[#151F30] flex items-center justify-between hover:border-[#6D95FF]/40 transition-colors"
                >
                  <Link
                    to={`/profile/${mem.profile?.username}`}
                    className="flex items-center gap-3 min-w-0 flex-1 group"
                  >
                    <Avatar
                      src={mem.profile?.avatar_url}
                      name={mem.profile?.full_name}
                      size="md"
                      status={mem.profile?.availability_status}
                    />
                    <div className="min-w-0">
                      <h5 className="font-display font-semibold text-xs text-[#F4F6FC] group-hover:text-[#6D95FF] transition-colors truncate">
                        {mem.profile?.full_name}
                      </h5>
                      <span className="text-[10px] text-[#6D95FF] font-mono">
                        @{mem.profile?.username}
                      </span>
                    </div>
                  </Link>

                  <Badge
                    variant={mem.role === 'owner' ? 'cyan' : 'secondary'}
                    className="capitalize text-[10px] font-mono"
                  >
                    {mem.role}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Tab 4: Team Chat */}
        <TabsContent value="chat" className="mt-4">
          <div className="h-[650px] rounded-xl border border-[#273249] overflow-hidden shadow-2xl bg-[#101725]">
            {conversation && user ? (
              <ChatWindow conversation={conversation} currentUserId={user.id} />
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#929DB2] font-mono">
                Initializing team channel...
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Teammate Matchmaker Modal */}
      <AIMatchModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        project={project}
        onInviteSent={loadProjectData}
      />
    </motion.div>
  );
};
