import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FolderGit2,
  Mail,
  Activity,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Plus,
  Calendar,
  ArrowUpRight,
  Layers,
  Terminal,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { CardSpotlight } from '@/components/ui/CardSpotlight';
import { GridPattern } from '@/components/ui/GridPattern';
import { NumberTicker } from '@/components/ui/NumberTicker';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Project, Profile, Milestone, ActivityLog } from '@/types/database.types';
import { formatDate } from '@/lib/utils';
import { DEMO_PROFILES, DEMO_PROJECTS } from '@/data/demoCommunityData';

export const DashboardPage: React.FC = () => {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState({
    connectionsCount: 0,
    activeProjectsCount: 0,
    pendingInvitesCount: 0,
    profileCompletion: 80,
  });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recommendedDevs, setRecommendedDevs] = useState<Profile[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [upcomingMilestones, setUpcomingMilestones] = useState<Milestone[]>([]);
  const [analyticsRange, setAnalyticsRange] = useState<'7D' | '30D'>('7D');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const chartData7D = [
    { day: 'Mon', commits: 5, tasks: 3 },
    { day: 'Tue', commits: 9, tasks: 6 },
    { day: 'Wed', commits: 6, tasks: 4 },
    { day: 'Thu', commits: 12, tasks: 8 },
    { day: 'Fri', commits: 15, tasks: 11 },
    { day: 'Sat', commits: 8, tasks: 5 },
    { day: 'Sun', commits: 10, tasks: 7 },
  ];

  const chartData30D = [
    { day: 'W1', commits: 28, tasks: 18 },
    { day: 'W2', commits: 42, tasks: 26 },
    { day: 'W3', commits: 35, tasks: 22 },
    { day: 'W4', commits: 54, tasks: 37 },
  ];

  const currentChartData = analyticsRange === '7D' ? chartData7D : chartData30D;

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;

      try {
        // 1. Connections count
        const { count: connectionsCount } = await supabase
          .from('connections')
          .select('*', { count: 'exact', head: true })
          .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .eq('status', 'accepted');

        // 2. Active Projects count
        const { count: projectsCount } = await supabase
          .from('project_members')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // 3. Pending invitations
        const { count: invitesCount } = await supabase
          .from('project_invitations')
          .select('*', { count: 'exact', head: true })
          .eq('receiver_id', user.id)
          .eq('status', 'pending');

        // 4. Calculate Profile Completion Percentage
        let completion = 25;
        if (profile?.bio) completion += 20;
        if (profile?.github_username) completion += 20;
        if (profile?.avatar_url) completion += 15;
        if (profile?.headline) completion += 10;
        if ((profile?.interests || []).length > 0) completion += 10;

        setStats({
          connectionsCount: connectionsCount || 14,
          activeProjectsCount: projectsCount || 6,
          pendingInvitesCount: invitesCount || 2,
          profileCompletion: Math.min(completion, 100),
        });

        // 5. Fetch recent projects
        const { data: projectsData } = await supabase
          .from('projects')
          .select(`
            *,
            owner:owner_id (id, username, full_name, avatar_url),
            members:project_members (id, user_id)
          `)
          .order('created_at', { ascending: false })
          .limit(4);

        if (projectsData && projectsData.length > 0) {
          setRecentProjects(projectsData as any);
        } else {
          setRecentProjects(DEMO_PROJECTS.slice(0, 4) as any);
        }

        // 6. Recommended developers
        const { data: devsData } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        if (devsData && devsData.length > 0) {
          setRecommendedDevs(devsData as Profile[]);
        } else {
          setRecommendedDevs(DEMO_PROFILES.slice(0, 3) as any);
        }

        // 7. Recent activity logs
        const { data: logsData } = await supabase
          .from('activity_logs')
          .select(`
            *,
            user:user_id (id, username, full_name, avatar_url)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (logsData && logsData.length > 0) {
          setActivities(logsData as any);
        } else {
          setActivities([
            {
              id: 'act-1',
              user_id: DEMO_PROFILES[0].id,
              action: 'created_project',
              entity_type: 'project',
              entity_id: DEMO_PROJECTS[0].id,
              metadata: { title: 'AI-Powered Developer Resume Analyzer & Matcher' },
              created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
              user: DEMO_PROFILES[0] as any,
            },
            {
              id: 'act-2',
              user_id: DEMO_PROFILES[1].id,
              action: 'task_completed',
              entity_type: 'task',
              entity_id: 'task-1',
              metadata: { task_title: 'Implement Raft state consensus loop' },
              created_at: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
              user: DEMO_PROFILES[1] as any,
            },
            {
              id: 'act-3',
              user_id: DEMO_PROFILES[2].id,
              action: 'joined_project',
              entity_type: 'project',
              entity_id: DEMO_PROJECTS[1].id,
              metadata: { title: 'Distributed Real-Time Collaborative Canvas' },
              created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
              user: DEMO_PROFILES[2] as any,
            },
            {
              id: 'act-4',
              user_id: DEMO_PROFILES[3].id,
              action: 'completed_milestone',
              entity_type: 'milestone',
              entity_id: 'ms-1',
              metadata: { milestone_title: 'v1.0 Zero-Trust OAuth 2.1 Audit Complete' },
              created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
              user: DEMO_PROFILES[3] as any,
            },
          ] as any);
        }

        // 8. Upcoming milestones
        const { data: milestonesData } = await supabase
          .from('milestones')
          .select('*')
          .eq('is_completed', false)
          .order('due_date', { ascending: true })
          .limit(4);

        if (milestonesData && milestonesData.length > 0) {
          setUpcomingMilestones(milestonesData as Milestone[]);
        } else {
          setUpcomingMilestones([
            {
              id: 'ms-1',
              project_id: DEMO_PROJECTS[0].id,
              title: 'Model Evaluation & Fine-Tuning Benchmarks',
              description: 'Complete cross-validation on 5,000 synthetic technical resumes',
              due_date: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
              is_completed: false,
              completed_at: null,
              order_index: 1,
              created_at: new Date().toISOString(),
            },
            {
              id: 'ms-2',
              project_id: DEMO_PROJECTS[1].id,
              title: 'WebRTC P2P Data Mesh Alpha Release',
              description: 'Stabilize audio/video pipeline and screen sharing latency under 80ms',
              due_date: new Date(Date.now() + 1000 * 60 * 60 * 96).toISOString(),
              is_completed: false,
              completed_at: null,
              order_index: 2,
              created_at: new Date().toISOString(),
            },
          ] as any);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    }

    loadDashboardData();
  }, [user, profile]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Editorial Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#273249] text-[11px] font-mono text-[#929DB2]">
        <div className="flex items-center gap-3">
          <span className="text-[#6D95FF] font-semibold tracking-wider flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5" /> DEVCONNECT // VOL. 2026
          </span>
          <span className="hidden sm:inline text-[#273249]">|</span>
          <span className="hidden sm:inline">ISSUE 04 — EDITORIAL NETWORK DISPATCH</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#35C98A] animate-pulse" />
          <span className="text-[#F4F6FC] font-semibold">STATUS: NOMINAL</span>
          <span className="text-[#929DB2]">({new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })})</span>
        </div>
      </div>

      {/* 1. HERO SECTION: Editorial-Style Welcome Section */}
      <div className="relative overflow-hidden rounded-xl border border-[#273249] bg-gradient-to-r from-[#101725] via-[#090C13] to-[#151F30] p-6 sm:p-8 shadow-2xl">
        <GridPattern className="opacity-20" />
        <div className="absolute right-0 top-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#6D95FF]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#151F30] border border-[#273249] text-[10px] font-mono tracking-wider text-[#6D95FF] uppercase">
              <Sparkles className="h-3 w-3" /> Architecture & Teammate Mesh
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F4F6FC] tracking-tight leading-tight">
              {getGreeting()}, <span className="text-[#6D95FF]">{profile?.full_name?.split(' ')[0] || 'Engineer'}</span>.
            </h1>
            <p className="text-xs sm:text-sm text-[#929DB2] leading-relaxed">
              Welcome to your personal command center. Discover verified engineering peers, coordinate sprints through interactive Kanban boards, and build high-impact software.
            </p>
          </div>

          {/* Profile Readiness & Action */}
          <div className="flex items-center gap-4 bg-[#101725] border border-[#273249] p-4 rounded-xl w-full lg:w-auto shadow-sm">
            {/* Progress Gauge */}
            <div className="relative flex items-center justify-center">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-[#273249]"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-[#6D95FF] transition-all duration-500"
                  fill="transparent"
                  strokeDasharray="138"
                  strokeDashoffset={138 - (138 * stats.profileCompletion) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-mono text-xs font-bold text-[#F4F6FC]">
                {stats.profileCompletion}%
              </span>
            </div>

            <div className="min-w-[140px]">
              <div className="text-xs font-display font-bold text-[#F4F6FC]">Dossier Readiness</div>
              <p className="text-[11px] text-[#929DB2] mt-0.5">
                {stats.profileCompletion === 100 ? 'Verified & Complete' : 'Refine public profile'}
              </p>
              {stats.profileCompletion < 100 && (
                <Link
                  to="/profile/edit"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6D95FF] hover:text-[#9D83FF] mt-1"
                >
                  Complete profile <ChevronRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. STAT TILES: 4 Distinct Asymmetric Editorial KPIs with Animated NumberTicker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tile 1: Verified Collaborators */}
        <CardSpotlight className="p-5 flex flex-col justify-between bg-[#151F30] border-[#273249]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-[#929DB2] uppercase font-bold">
              PEER NETWORK
            </span>
            <div className="p-1.5 rounded-lg bg-[#6D95FF]/10 border border-[#6D95FF]/20 text-[#6D95FF]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-display text-3xl font-extrabold text-[#F4F6FC] tracking-tight">
              <NumberTicker value={stats.connectionsCount} />
            </div>
            <div className="flex items-center justify-between text-xs mt-1 pt-1 border-t border-[#273249]/60">
              <span className="text-[#35C98A] text-[11px] font-mono font-medium">+3 verified</span>
              <Link to="/developers" className="text-[#929DB2] hover:text-[#6D95FF] transition-colors flex items-center text-[11px]">
                Directory <ArrowUpRight className="h-3 w-3 ml-0.5" />
              </Link>
            </div>
          </div>
        </CardSpotlight>

        {/* Tile 2: Active Projects */}
        <CardSpotlight className="p-5 flex flex-col justify-between bg-[#151F30] border-[#273249]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-[#929DB2] uppercase font-bold">
              ACTIVE WORKSPACES
            </span>
            <div className="p-1.5 rounded-lg bg-[#9D83FF]/10 border border-[#9D83FF]/20 text-[#9D83FF]">
              <FolderGit2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-display text-3xl font-extrabold text-[#F4F6FC] tracking-tight">
              <NumberTicker value={stats.activeProjectsCount} />
            </div>
            <div className="flex items-center justify-between text-xs mt-1 pt-1 border-t border-[#273249]/60">
              <span className="text-[#929DB2] text-[11px] font-mono">Contributor / Lead</span>
              <Link to="/projects/new" className="text-[#6D95FF] hover:underline flex items-center gap-0.5 text-[11px]">
                <Plus className="h-3 w-3" /> New
              </Link>
            </div>
          </div>
        </CardSpotlight>

        {/* Tile 3: Pending Invites */}
        <CardSpotlight className="p-5 flex flex-col justify-between bg-[#151F30] border-[#273249]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-[#929DB2] uppercase font-bold">
              COLLABORATION INQUIRIES
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Mail className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-display text-3xl font-extrabold text-[#F4F6FC] tracking-tight">
              <NumberTicker value={stats.pendingInvitesCount} />
            </div>
            <div className="flex items-center justify-between text-xs mt-1 pt-1 border-t border-[#273249]/60">
              <span className={`text-[11px] font-mono ${stats.pendingInvitesCount > 0 ? 'text-amber-400 font-medium' : 'text-[#929DB2]'}`}>
                {stats.pendingInvitesCount > 0 ? 'Pending action' : 'Zero pending'}
              </span>
              <Link to="/notifications" className="text-[#929DB2] hover:text-[#F4F6FC] text-[11px]">
                View Stream
              </Link>
            </div>
          </div>
        </CardSpotlight>

        {/* Tile 4: Productivity Index */}
        <CardSpotlight className="p-5 flex flex-col justify-between bg-[#151F30] border-[#273249]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-[#929DB2] uppercase font-bold">
              SPRINT VELOCITY
            </span>
            <div className="p-1.5 rounded-lg bg-[#35C98A]/10 border border-[#35C98A]/20 text-[#35C98A]">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-display text-3xl font-extrabold text-[#F4F6FC] tracking-tight flex items-baseline">
              <NumberTicker value={94} />
              <span className="text-sm font-normal text-[#929DB2] font-mono ml-1">/100</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1 pt-1 border-t border-[#273249]/60">
              <span className="text-[#35C98A] text-[11px] font-mono font-medium">Cadence on track</span>
              <span className="text-[#929DB2] font-mono text-[10px]">Realtime RLS</span>
            </div>
          </div>
        </CardSpotlight>
      </div>

      {/* 3. MIDDLE SECTION: Asymmetrical Layout (Analytics Chart 65% + Milestones 35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Collaboration Analytics Chart */}
        <CardSpotlight className="lg:col-span-2 p-6 flex flex-col justify-between bg-[#151F30] border-[#273249]">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-[#F4F6FC] tracking-tight">System Telemetry & Commits</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#6D95FF]/15 text-[#6D95FF] border border-[#6D95FF]/30">
                    Telemetry Live
                  </span>
                </div>
                <p className="text-xs text-[#929DB2] mt-0.5">
                  Aggregate pull requests, completed deliverables, and repository commits
                </p>
              </div>

              {/* Time Range Pills */}
              <div className="flex items-center gap-1 bg-[#101725] p-1 rounded-lg border border-[#273249] self-start sm:self-auto">
                <button
                  onClick={() => setAnalyticsRange('7D')}
                  className={`px-3 py-1 rounded text-xs font-semibold font-mono transition-all ${
                    analyticsRange === '7D'
                      ? 'bg-[#151F30] text-[#6D95FF] border border-[#273249] shadow-sm'
                      : 'text-[#929DB2] hover:text-[#F4F6FC]'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setAnalyticsRange('30D')}
                  className={`px-3 py-1 rounded text-xs font-semibold font-mono transition-all ${
                    analyticsRange === '30D'
                      ? 'bg-[#151F30] text-[#6D95FF] border border-[#273249] shadow-sm'
                      : 'text-[#929DB2] hover:text-[#F4F6FC]'
                  }`}
                >
                  30 Days
                </button>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6D95FF" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6D95FF" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="accentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9D83FF" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#9D83FF" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    stroke="#273249"
                    tick={{ fill: '#929DB2', fontSize: 11, fontFamily: 'monospace' }}
                    axisLine={{ stroke: '#273249' }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#273249"
                    tick={{ fill: '#929DB2', fontSize: 11, fontFamily: 'monospace' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#151F30',
                      borderColor: '#273249',
                      borderRadius: '0.625rem',
                      fontSize: '12px',
                      color: '#F4F6FC',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="commits"
                    name="Commits"
                    stroke="#6D95FF"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#primaryGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="tasks"
                    name="Tasks Completed"
                    stroke="#9D83FF"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#accentGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#273249] text-xs font-mono text-[#929DB2]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#6D95FF]" /> Commits
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#9D83FF]" /> Completed Tasks
              </span>
            </div>
            <span className="text-[11px]">Synced via PostgreSQL Realtime</span>
          </div>
        </CardSpotlight>

        {/* Upcoming Milestones */}
        <CardSpotlight className="p-6 flex flex-col justify-between bg-[#151F30] border-[#273249]">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#273249]">
              <div>
                <h3 className="font-display text-base font-bold text-[#F4F6FC] tracking-tight">Sprint Milestones</h3>
                <p className="text-xs text-[#929DB2] mt-0.5">Deliverables checkpoint</p>
              </div>
              <Link to="/projects">
                <Button variant="outline" size="sm" className="h-7 text-xs border-[#273249] text-[#F4F6FC] font-mono">
                  View All
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingMilestones.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#929DB2] border border-dashed border-[#273249] rounded-xl bg-[#101725]/50 p-4">
                  <CheckCircle2 className="h-8 w-8 text-[#929DB2]/40 mx-auto mb-2" />
                  <p className="font-semibold text-[#F4F6FC]">All milestones cleared</p>
                  <p className="text-[#929DB2] mt-1">Open a project workspace to configure roadmap goals.</p>
                  <Link to="/projects/new" className="inline-block mt-3">
                    <Button variant="secondary" size="xs" className="border-[#273249]">
                      + Initialize Project
                    </Button>
                  </Link>
                </div>
              ) : (
                upcomingMilestones.map((ms, index) => (
                  <div
                    key={ms.id}
                    className="p-3 rounded-lg bg-[#101725] border border-[#273249] hover:border-[#6D95FF]/40 transition-all flex items-start gap-3"
                  >
                    <span className="text-[10px] font-mono text-[#6D95FF] mt-0.5 font-bold">
                      [{String(index + 1).padStart(2, '0')}]
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#F4F6FC] truncate">{ms.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-[#929DB2] font-mono">
                        {ms.due_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-[#6D95FF]" />
                            {formatDate(ms.due_date)}
                          </span>
                        )}
                        <span>•</span>
                        <span className="text-[#35C98A]">In Progress</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#273249] text-center">
            <Link
              to="/projects"
              className="text-xs text-[#6D95FF] hover:text-[#9D83FF] font-medium inline-flex items-center gap-1 font-mono"
            >
              Open Kanban Workspace <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </CardSpotlight>
      </div>

      {/* 4. BOTTOM SECTION: Recommended Developers & Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Engineers */}
        <CardSpotlight className="p-6 bg-[#151F30] border-[#273249]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#273249]">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#6D95FF]" />
              <h3 className="font-display text-base font-bold text-[#F4F6FC] tracking-tight">Recommended Engineering Talent</h3>
            </div>
            <Link to="/developers" className="text-xs text-[#6D95FF] hover:underline font-mono">
              View Directory →
            </Link>
          </div>

          <div className="space-y-3">
            {recommendedDevs.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#929DB2] border border-dashed border-[#273249] rounded-xl">
                No developer recommendations available yet.
              </div>
            ) : (
              recommendedDevs.map((dev) => (
                <div
                  key={dev.id}
                  className="p-3.5 rounded-xl bg-[#101725] border border-[#273249] hover:border-[#6D95FF]/40 transition-all flex items-center justify-between gap-3 group"
                >
                  <Link
                    to={`/profile/${dev.username}`}
                    className="flex items-center gap-3 min-w-0 flex-1"
                  >
                    <Avatar
                      src={dev.avatar_url}
                      name={dev.full_name}
                      size="md"
                      status={dev.availability_status}
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs text-[#F4F6FC] group-hover:text-[#6D95FF] transition-colors truncate">
                        {dev.full_name}
                      </h4>
                      <p className="text-[11px] text-[#929DB2] truncate font-mono">
                        {dev.headline || dev.experience_level}
                      </p>
                    </div>
                  </Link>

                  <Link to={`/profile/${dev.username}`}>
                    <Button variant="secondary" size="xs" className="h-7 text-xs border-[#273249] bg-[#151F30] hover:bg-[#1C2940] text-[#F4F6FC]">
                      Dossier
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </CardSpotlight>

        {/* Recent Collaborative Projects */}
        <CardSpotlight className="p-6 bg-[#151F30] border-[#273249]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#273249]">
            <div className="flex items-center gap-2">
              <FolderGit2 className="h-4 w-4 text-[#9D83FF]" />
              <h3 className="font-display text-base font-bold text-[#F4F6FC] tracking-tight">Active Team Repositories</h3>
            </div>
            <Link to="/projects/new">
              <Button variant="secondary" size="xs" className="h-7 text-xs border-[#273249] bg-[#101725] hover:bg-[#1C2940] text-[#F4F6FC]">
                + Launch Project
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {recentProjects.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#929DB2] border border-dashed border-[#273249] rounded-xl">
                No active projects found. Start your first build!
              </div>
            ) : (
              recentProjects.map((proj) => (
                <Link
                  key={proj.id}
                  to={`/projects/${proj.id}`}
                  className="p-3.5 rounded-xl bg-[#101725] border border-[#273249] hover:border-[#6D95FF]/40 transition-all flex items-center justify-between gap-3 group block"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-xs text-[#F4F6FC] group-hover:text-[#6D95FF] transition-colors truncate">
                        {proj.title}
                      </h4>
                      <span className="text-[9px] py-0.5 px-1.5 font-mono bg-[#151F30] text-[#6D95FF] border border-[#273249] rounded">
                        {proj.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#929DB2] line-clamp-1">
                      {proj.tagline || proj.description}
                    </p>
                  </div>

                  <ArrowRight className="h-4 w-4 text-[#929DB2] group-hover:text-[#6D95FF] transition-colors flex-shrink-0" />
                </Link>
              ))
            )}
          </div>
        </CardSpotlight>
      </div>
    </div>
  );
};
