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
  Clock,
  CheckCircle2,
  Circle,
  Trash2,
  Share2,
} from 'lucide-react';
import { Project, Task, Milestone, ProjectMember, Conversation } from '@/types/database.types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { AIMatchModal } from '@/components/matching/AIMatchModal';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

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
      // 1. Fetch project
      const { data: projData, error: projError } = await supabase
        .from('projects')
        .select(`
          *,
          owner:owner_id (id, username, full_name, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (projError) throw projError;
      setProject(projData as any);

      // 2. Fetch project members
      const { data: membersData } = await supabase
        .from('project_members')
        .select(`
          *,
          profile:user_id (id, username, full_name, avatar_url, headline, availability_status)
        `)
        .eq('project_id', id);

      if (membersData) setMembers(membersData as any);

      // 3. Fetch project tasks
      const { data: tasksData } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:assignee_id (id, username, full_name, avatar_url),
          creator:creator_id (id, username, full_name, avatar_url)
        `)
        .eq('project_id', id)
        .order('order_index', { ascending: true });

      if (tasksData) setTasks(tasksData as any);

      // 4. Fetch project milestones
      const { data: milestonesData } = await supabase
        .from('milestones')
        .select('*')
        .eq('project_id', id)
        .order('order_index', { ascending: true });

      if (milestonesData) setMilestones(milestonesData as Milestone[]);

      // 5. Fetch or ensure project conversation channel
      const { data: convData } = await supabase
        .from('conversations')
        .select('*')
        .eq('project_id', id)
        .maybeSingle();

      if (convData) {
        setConversation(convData as Conversation);
      } else {
        // Create conversation channel for project
        const { data: newConv } = await supabase
          .from('conversations')
          .insert({
            type: 'project',
            project_id: id,
            name: `${projData.title} Discussions`,
          })
          .select()
          .single();
        if (newConv) setConversation(newConv as Conversation);
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
      <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl max-w-lg mx-auto mt-12 bg-[#0d1527]">
        <h3 className="text-xl font-bold text-white mb-2">Project Not Found</h3>
        <p className="text-xs text-slate-400 mb-6">
          The requested project does not exist or you do not have permission to view it.
        </p>
        <Link to="/projects">
          <Button variant="primary">Browse Projects</Button>
        </Link>
      </div>
    );
  }

  // Calculate Progress Percentage
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const isOwner = user && project.owner_id === user.id;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Workspace Header */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d1527]/95 p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                <FolderGit2 className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  {project.title}
                  <Badge variant="cyan" className="text-[10px] font-mono">
                    {project.status.toUpperCase()}
                  </Badge>
                </h1>
                <span className="text-xs text-cyan-400 font-mono">{project.category}</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 pt-1 leading-relaxed">
              {project.tagline || project.description}
            </p>
          </div>

          {/* Action buttons & AI Teammate matching button */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
            <Button
              variant="glow"
              size="sm"
              onClick={() => setIsAIModalOpen(true)}
              className="font-semibold text-xs shadow-cyan-500/20"
            >
              <Sparkles className="h-4 w-4 mr-1.5" /> AI Teammate Match
            </Button>

            {project.github_repo_url && (
              <a
                href={project.github_repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 transition-colors"
              >
                <GitBranch className="h-3.5 w-3.5" /> Repo <ExternalLink className="h-3 w-3" />
              </a>
            )}

            {isOwner && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteProject}
                className="h-9 px-3"
                title="Delete project"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Workspace Metrics & Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
              <span className="text-slate-400">Workspace Progress</span>
              <span className="font-bold text-cyan-400">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <CheckSquare className="h-4 w-4 text-emerald-400" />
            <span>
              {completedTasks} / {tasks.length} tasks completed
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 sm:justify-end">
            <Users className="h-4 w-4 text-cyan-400" />
            <span>
              {members.length} / {project.team_size_needed} team members
            </span>
          </div>
        </div>
      </div>

      {/* Workspace Tabs: Kanban Board, Milestones, Team, Chat */}
      <Tabs defaultValue="kanban">
        <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:inline-flex">
          <TabsTrigger value="kanban" className="text-xs gap-1.5">
            <CheckSquare className="h-3.5 w-3.5" /> Kanban Board
          </TabsTrigger>
          <TabsTrigger value="milestones" className="text-xs gap-1.5">
            <MilestoneIcon className="h-3.5 w-3.5" /> Milestones ({milestones.length})
          </TabsTrigger>
          <TabsTrigger value="team" className="text-xs gap-1.5">
            <Users className="h-3.5 w-3.5" /> Team ({members.length})
          </TabsTrigger>
          <TabsTrigger value="chat" className="text-xs gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" /> Team Chat
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
          <Card className="border-slate-800 bg-[#0d1527]/90 p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-bold text-white">Project Milestones</CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track high-level deliverables and sprint checkpoints.
                </p>
              </div>
            </div>

            {/* Add Milestone Form */}
            <form onSubmit={handleAddMilestone} className="flex flex-wrap sm:flex-nowrap gap-2">
              <Input
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                placeholder="New milestone title (e.g. Complete Supabase Auth & RLS policies)"
                className="flex-1"
                required
              />
              <Input
                type="date"
                value={newMilestoneDate}
                onChange={(e) => setNewMilestoneDate(e.target.value)}
                className="w-full sm:w-44"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={addingMilestone}
                className="text-xs font-semibold"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Milestone
              </Button>
            </form>

            {/* Milestones Checklist */}
            <div className="space-y-2.5">
              {milestones.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No milestones added yet. Add key milestones above to keep the team aligned.
                </div>
              ) : (
                milestones.map((ms) => (
                  <div
                    key={ms.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      ms.is_completed
                        ? 'border-emerald-500/30 bg-emerald-950/20'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/60'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleMilestone(ms)}
                      className="flex items-center gap-3 text-left flex-1 min-w-0"
                    >
                      {ms.is_completed ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-500 hover:text-cyan-400 flex-shrink-0 transition-colors" />
                      )}
                      <span
                        className={`text-xs font-medium truncate ${
                          ms.is_completed ? 'line-through text-slate-400' : 'text-slate-100'
                        }`}
                      >
                        {ms.title}
                      </span>
                    </button>

                    {ms.due_date && (
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 flex-shrink-0">
                        <Calendar className="h-3 w-3 text-slate-500" />
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
          <Card className="border-slate-800 bg-[#0d1527]/90 p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-white">Project Members</CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Engineers currently contributing to this project.
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
                  className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between"
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
                      <h5 className="font-semibold text-xs text-white group-hover:text-cyan-400 transition-colors truncate">
                        {mem.profile?.full_name}
                      </h5>
                      <span className="text-[10px] text-cyan-400 font-mono">
                        @{mem.profile?.username}
                      </span>
                    </div>
                  </Link>

                  <Badge variant={mem.role === 'owner' ? 'cyan' : 'secondary'} className="capitalize text-[10px]">
                    {mem.role}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Tab 4: Team Chat */}
        <TabsContent value="chat" className="mt-4">
          <div className="h-[650px] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
            {conversation && user ? (
              <ChatWindow conversation={conversation} currentUserId={user.id} />
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
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
    </div>
  );
};
