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
  Clock,
  ChevronRight,
  Plus,
  GitBranch,
  Calendar,
  Layers,
  ArrowUpRight,
  UserPlus,
  Award,
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
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Project, Profile, Milestone, ActivityLog } from '@/types/database.types';
import { formatTimeAgo, formatDate } from '@/lib/utils';

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

  // Dynamic greeting based on current time
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

        // 2. Active Projects count (as owner or member)
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
          connectionsCount: connectionsCount || 0,
          activeProjectsCount: projectsCount || 0,
          pendingInvitesCount: invitesCount || 0,
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

        if (projectsData) setRecentProjects(projectsData as any);

        // 6. Recommended developers (different from user)
        const { data: devsData } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        if (devsData) setRecommendedDevs(devsData as Profile[]);

        // 7. Recent activity logs
        const { data: logsData } = await supabase
          .from('activity_logs')
          .select(`
            *,
            user:user_id (id, username, full_name, avatar_url)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (logsData) setActivities(logsData as any);

        // 8. Upcoming milestones
        const { data: milestonesData } = await supabase
          .from('milestones')
          .select('*')
          .eq('is_completed', false)
          .order('due_date', { ascending: true })
          .limit(4);

        if (milestonesData) setUpcomingMilestones(milestonesData as Milestone[]);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    }

    loadDashboardData();
  }, [user, profile]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. HERO SECTION: Personalized Greeting & Profile Dial */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-r from-[#0c101a] via-[#090d16] to-[#0d121c] p-6 sm:p-8 shadow-2xl">
        <GridPattern className="opacity-40" />
        <div className="absolute right-0 top-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-[11px] font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                DevConnect v1.0 • Supabase Live
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {getGreeting()}, {profile?.full_name || 'Developer'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Find collaborative engineering projects, track milestones on Kanban boards, and recruit teammates with AI matching.
            </p>
          </div>

          {/* Profile Readiness & Action */}
          <div className="flex items-center gap-4 bg-slate-900/80 border border-white/[0.08] p-3.5 rounded-2xl backdrop-blur-md w-full md:w-auto">
            {/* Progress Gauge */}
            <div className="relative flex items-center justify-center">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-sky-400 transition-all duration-500"
                  fill="transparent"
                  strokeDasharray="138"
                  strokeDashoffset={138 - (138 * stats.profileCompletion) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-mono text-xs font-bold text-white">
                {stats.profileCompletion}%
              </span>
            </div>

            <div className="min-w-[130px]">
              <div className="text-xs font-semibold text-white">Profile Readiness</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {stats.profileCompletion === 100 ? 'All details set' : 'Boost matchmaking'}
              </p>
              {stats.profileCompletion < 100 && (
                <Link
                  to="/profile/edit"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-400 hover:text-sky-300 mt-1"
                >
                  Complete profile <ChevronRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. STAT TILES: 4 Distinct Asymmetric SaaS KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tile 1: Connections */}
        <CardSpotlight className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 font-mono tracking-wider">NETWORK</span>
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-white font-mono tracking-tight">
              {stats.connectionsCount}
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-emerald-400 font-medium">+3 this week</span>
              <Link to="/developers" className="text-slate-500 hover:text-sky-400 transition-colors flex items-center">
                Discover <ArrowUpRight className="h-3 w-3 ml-0.5" />
              </Link>
            </div>
          </div>
        </CardSpotlight>

        {/* Tile 2: Active Projects */}
        <CardSpotlight className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 font-mono tracking-wider">PROJECTS</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <FolderGit2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-white font-mono tracking-tight">
              {stats.activeProjectsCount}
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-slate-400">Member & owner</span>
              <Link to="/projects/new" className="text-sky-400 hover:underline flex items-center gap-0.5">
                <Plus className="h-3 w-3" /> New
              </Link>
            </div>
          </div>
        </CardSpotlight>

        {/* Tile 3: Pending Invites */}
        <CardSpotlight className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 font-mono tracking-wider">INVITATIONS</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Mail className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-white font-mono tracking-tight">
              {stats.pendingInvitesCount}
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className={stats.pendingInvitesCount > 0 ? 'text-amber-400 font-medium' : 'text-slate-500'}>
                {stats.pendingInvitesCount > 0 ? 'Requires response' : 'No pending invites'}
              </span>
              <Link to="/notifications" className="text-slate-500 hover:text-white">
                View
              </Link>
            </div>
          </div>
        </CardSpotlight>

        {/* Tile 4: Productivity Index */}
        <CardSpotlight className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 font-mono tracking-wider">PRODUCTIVITY</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-white font-mono tracking-tight">
              96<span className="text-sm font-normal text-slate-400">/100</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-emerald-400 font-medium">Sprint on track</span>
              <span className="text-slate-500 font-mono">Live RLS</span>
            </div>
          </div>
        </CardSpotlight>
      </div>

      {/* 3. MIDDLE SECTION: Chart (2 Cols) & Milestones Checklist (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Collaboration Analytics */}
        <CardSpotlight className="lg:col-span-2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight">Collaboration Analytics</h3>
                  <Badge variant="cyan">Realtime</Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Task completions and Git commits across team repositories
                </p>
              </div>

              {/* Time Range Selector */}
              <div className="flex rounded-lg bg-slate-900 border border-white/[0.08] p-0.5 text-xs font-mono self-start sm:self-auto">
                <button
                  onClick={() => setAnalyticsRange('7D')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    analyticsRange === '7D'
                      ? 'bg-slate-800 text-white shadow-sm font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  7D
                </button>
                <button
                  onClick={() => setAnalyticsRange('30D')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    analyticsRange === '30D'
                      ? 'bg-slate-800 text-white shadow-sm font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  30D
                </button>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentChartData}>
                  <defs>
                    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    stroke="#475569"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                  />
                  <YAxis
                    stroke="#475569"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c1017',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="commits"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#skyGrad)"
                    name="Commits & PRs"
                  />
                  <Area
                    type="monotone"
                    dataKey="tasks"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#indigoGrad)"
                    name="Completed Tasks"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] text-xs font-mono text-slate-400 mt-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-sky-400" /> Commits / PRs
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-400" /> Tasks Done
              </span>
            </div>
            <span className="text-[11px] text-slate-500">Live sync via PostgreSQL</span>
          </div>
        </CardSpotlight>

        {/* Upcoming Milestones */}
        <CardSpotlight className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Upcoming Milestones</h3>
                <p className="text-xs text-slate-400 mt-0.5">Sprint deliverables & checkpoints</p>
              </div>
              <Calendar className="h-4 w-4 text-slate-500" />
            </div>

            <div className="space-y-3 pt-1">
              {upcomingMilestones.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-white/[0.08] rounded-xl">
                  No pending milestones. Create one in your project workspace!
                </div>
              ) : (
                upcomingMilestones.map((ms) => (
                  <div
                    key={ms.id}
                    className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.06] flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-200 truncate">{ms.title}</p>
                      {ms.due_date && (
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5 text-sky-400" /> Due {formatDate(ms.due_date)}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 flex-shrink-0">
                      Sprint
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link
            to="/projects"
            className="pt-4 border-t border-white/[0.06] text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center justify-between group"
          >
            <span>Open project workspaces</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </CardSpotlight>
      </div>

      {/* 4. BOTTOM SECTION: Recommended Projects & Developer Discoveries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Featured Collaborative Projects */}
        <CardSpotlight className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Featured Projects</h3>
              <p className="text-xs text-slate-400 mt-0.5">Projects recruiting developers now</p>
            </div>
            <Link to="/projects">
              <Button variant="ghost" size="sm" className="text-xs text-sky-400">
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {recentProjects.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No active projects found. Be the first to publish one!
              </div>
            ) : (
              recentProjects.map((proj) => (
                <Link
                  key={proj.id}
                  to={`/projects/${proj.id}`}
                  className="p-3.5 rounded-xl border border-white/[0.06] bg-slate-900/40 hover:bg-slate-900/80 hover:border-sky-500/30 transition-all flex items-center justify-between group block"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-xs sm:text-sm text-white group-hover:text-sky-300 transition-colors truncate">
                        {proj.title}
                      </h4>
                      <Badge variant="secondary" className="text-[10px]">
                        {proj.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                      {proj.tagline || proj.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(proj.required_skills || []).slice(0, 3).map((sk) => (
                        <span
                          key={sk}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-sky-300 font-mono border border-white/[0.04]"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Link>
              ))
            )}
          </div>
        </CardSpotlight>

        {/* Recommended Teammates */}
        <CardSpotlight className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Recommended Engineers</h3>
              <p className="text-xs text-slate-400 mt-0.5">Top candidate matches for your stack</p>
            </div>
            <Link to="/developers">
              <Button variant="ghost" size="sm" className="text-xs text-sky-400">
                Browse All
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {recommendedDevs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No developer recommendations available yet.
              </div>
            ) : (
              recommendedDevs.map((dev) => (
                <div
                  key={dev.id}
                  className="p-3.5 rounded-xl border border-white/[0.06] bg-slate-900/40 hover:bg-slate-900/80 transition-all flex items-center justify-between"
                >
                  <Link
                    to={`/profile/${dev.username}`}
                    className="flex items-center gap-3 min-w-0 flex-1 group"
                  >
                    <Avatar
                      src={dev.avatar_url}
                      name={dev.full_name}
                      size="md"
                      status={dev.availability_status}
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm text-white group-hover:text-sky-300 transition-colors truncate">
                        {dev.full_name}
                      </h4>
                      <p className="text-xs text-slate-400 truncate">
                        {dev.headline || dev.experience_level}
                      </p>
                      <span className="text-[10px] text-sky-400 font-mono">
                        @{dev.username}
                      </span>
                    </div>
                  </Link>

                  <Link to={`/profile/${dev.username}`}>
                    <Button variant="outline" size="sm" className="h-7 text-xs font-semibold">
                      View
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </CardSpotlight>
      </div>
    </div>
  );
};
