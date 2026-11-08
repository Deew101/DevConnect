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
import { BorderBeam } from '@/components/galaxy';

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
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[rgba(167,139,250,0.20)] text-[11px] font-mono text-[#B8ACD9]">
        <div className="flex items-center gap-3">
          <span className="text-[#C4B5FD] font-semibold tracking-wider flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-[#A855F7]" /> DEVCONNECT — VOL. 2026
          </span>
          <span className="hidden sm:inline text-[rgba(167,139,250,0.3)] font-bold">·</span>
          <span className="hidden sm:inline">ISSUE 04 — EDITORIAL NETWORK DISPATCH</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#34D399] animate-pulse shadow-[0_0_8px_#34D399]" />
          <span className="text-[#F8F7FF] font-semibold">STATUS: NOMINAL</span>
          <span className="text-[#B8ACD9]">({new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })})</span>
        </div>
      </div>

      {/* 1. HERO SECTION: Galaxy Flow Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl border border-[rgba(167,139,250,0.25)] bg-gradient-to-r from-[#160E30]/90 via-[#100A24]/90 to-[#1E1442]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl group">
        <BorderBeam size={280} duration={14} colorFrom="#8B5CF6" colorTo="#D946EF" />
        <GridPattern className="opacity-15" />
        <div className="absolute right-0 top-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#8B5CF6]/15 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 rounded-full bg-[#D946EF]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[10px] font-mono tracking-wider text-[#C4B5FD] uppercase shadow-[0_0_12px_rgba(139,92,246,0.15)]">
              <Sparkles className="h-3 w-3 text-[#A855F7]" /> Architecture & Teammate Mesh
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F8F7FF] tracking-tight leading-tight">
              {getGreeting()},{' '}
              <span className="bg-gradient-to-r from-[#F8F7FF] via-[#C4B5FD] to-[#A855F7] bg-clip-text text-transparent">
                {profile?.full_name?.split(' ')[0] || 'Engineer'}
              </span>.
            </h1>
            <p className="text-xs sm:text-sm text-[#B8ACD9] leading-relaxed">
              Welcome to your cosmic command center. Discover verified engineering peers, coordinate sprints through interactive Kanban boards, and build high-impact software.
            </p>
          </div>

          {/* Profile Readiness & Action */}
          <div className="flex items-center gap-4 bg-[#100A24]/90 border border-[rgba(167,139,250,0.25)] p-4 rounded-xl w-full lg:w-auto shadow-lg backdrop-blur-md">
            {/* Progress Gauge */}
            <div className="relative flex items-center justify-center">
              <svg className="w-14 h-14 transform -rotate-90">
                <defs>
                  <linearGradient id="galaxyGaugeGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="50%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#D946EF" />
                  </linearGradient>
                </defs>
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-[rgba(167,139,250,0.2)]"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  stroke="url(#galaxyGaugeGradient)"
                  strokeWidth="4"
                  className="transition-all duration-700 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                  fill="transparent"
                  strokeDasharray="138"
                  strokeDashoffset={138 - (138 * stats.profileCompletion) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-mono text-xs font-bold text-[#F8F7FF]">
                {stats.profileCompletion}%
              </span>
            </div>

            <div className="min-w-[140px]">
              <div className="text-xs font-display font-bold text-[#F8F7FF]">Dossier Readiness</div>
              <p className="text-[11px] text-[#B8ACD9] mt-0.5">
                {stats.profileCompletion === 100 ? 'Verified & Complete' : 'Refine public profile'}
              </p>
              {stats.profileCompletion < 100 && (
                <Link
                  to="/profile/edit"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#A855F7] hover:text-[#D946EF] transition-colors mt-1"
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
        <CardSpotlight className="p-5 flex flex-col justify-between bg-[#160E30]/75 backdrop-blur-xl border-[rgba(167,139,250,0.20)] hover:border-[#8B5CF6]/50 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(139,92,246,0.15)] transition-all duration-300 rounded-2xl group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-[#B8ACD9] uppercase font-bold">
              PEER NETWORK
            </span>
            <div className="p-1.5 rounded-lg bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#C4B5FD] shadow-[0_0_10px_rgba(139,92,246,0.2)]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-display text-3xl font-extrabold text-[#F8F7FF] tracking-tight group-hover:text-[#C4B5FD] transition-colors">
              <NumberTicker value={stats.connectionsCount} />
            </div>
            <div className="flex items-center justify-between text-xs mt-1 pt-1 border-t border-[rgba(167,139,250,0.15)]">
              <span className="text-[#34D399] text-[11px] font-mono font-medium">+3 verified</span>
              <Link to="/developers" className="text-[#B8ACD9] hover:text-[#A855F7] transition-colors flex items-center text-[11px]">
                Directory <ArrowUpRight className="h-3 w-3 ml-0.5" />
              </Link>
            </div>
          </div>
        </CardSpotlight>

        {/* Tile 2: Active Projects */}
        <CardSpotlight className="p-5 flex flex-col justify-between bg-[#160E30]/75 backdrop-blur-xl border-[rgba(167,139,250,0.20)] hover:border-[#A855F7]/50 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(168,85,247,0.15)] transition-all duration-300 rounded-2xl group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-[#B8ACD9] uppercase font-bold">
              ACTIVE WORKSPACES
            </span>
            <div className="p-1.5 rounded-lg bg-[#A855F7]/15 border border-[#A855F7]/30 text-[#F8F7FF] shadow-[0_0_10px_rgba(168,85,247,0.2)]">
              <FolderGit2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-display text-3xl font-extrabold text-[#F8F7FF] tracking-tight group-hover:text-[#F8F7FF] transition-colors">
              <NumberTicker value={stats.activeProjectsCount} />
            </div>
            <div className="flex items-center justify-between text-xs mt-1 pt-1 border-t border-[rgba(167,139,250,0.15)]">
              <span className="text-[#B8ACD9] text-[11px] font-mono">Contributor / Lead</span>
              <Link to="/projects/new" className="text-[#A855F7] hover:text-[#D946EF] transition-colors flex items-center gap-0.5 text-[11px] font-medium">
                <Plus className="h-3 w-3" /> New
              </Link>
            </div>
          </div>
        </CardSpotlight>

        {/* Tile 3: Pending Invites */}
        <CardSpotlight className="p-5 flex flex-col justify-between bg-[#160E30]/75 backdrop-blur-xl border-[rgba(167,139,250,0.20)] hover:border-[#D946EF]/50 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(217,70,239,0.15)] transition-all duration-300 rounded-2xl group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-[#B8ACD9] uppercase font-bold">
              COLLABORATION INQUIRIES
            </span>
            <div className="p-1.5 rounded-lg bg-[#D946EF]/15 border border-[#D946EF]/30 text-[#D946EF] shadow-[0_0_10px_rgba(217,70,239,0.2)]">
              <Mail className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-display text-3xl font-extrabold text-[#F8F7FF] tracking-tight group-hover:text-[#D946EF] transition-colors">
              <NumberTicker value={stats.pendingInvitesCount} />
            </div>
            <div className="flex items-center justify-between text-xs mt-1 pt-1 border-t border-[rgba(167,139,250,0.15)]">
              <span className={`text-[11px] font-mono ${stats.pendingInvitesCount > 0 ? 'text-[#D946EF] font-medium' : 'text-[#B8ACD9]'}`}>
                {stats.pendingInvitesCount > 0 ? 'Pending action' : 'Zero pending'}
              </span>
              <Link to="/notifications" className="text-[#B8ACD9] hover:text-[#F8F7FF] text-[11px]">
                View Stream
              </Link>
            </div>
          </div>
        </CardSpotlight>

        {/* Tile 4: Productivity Index */}
        <CardSpotlight className="p-5 flex flex-col justify-between bg-[#160E30]/75 backdrop-blur-xl border-[rgba(167,139,250,0.20)] hover:border-[#34D399]/50 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(52,211,153,0.15)] transition-all duration-300 rounded-2xl group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-[#B8ACD9] uppercase font-bold">
              SPRINT VELOCITY
            </span>
            <div className="p-1.5 rounded-lg bg-[#34D399]/15 border border-[#34D399]/30 text-[#34D399] shadow-[0_0_10px_rgba(52,211,153,0.2)]">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-display text-3xl font-extrabold text-[#F8F7FF] tracking-tight flex items-baseline">
              <NumberTicker value={94} />
              <span className="text-sm font-normal text-[#B8ACD9] font-mono ml-1">/100</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1 pt-1 border-t border-[rgba(167,139,250,0.15)]">
              <span className="text-[#34D399] text-[11px] font-mono font-medium">Cadence on track</span>
              <span className="text-[#B8ACD9] font-mono text-[10px]">Realtime RLS</span>
            </div>
          </div>
        </CardSpotlight>
      </div>

      {/* 3. MIDDLE SECTION: Asymmetrical Layout (Analytics Chart 65% + Milestones 35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Collaboration Analytics Chart */}
        <CardSpotlight className="lg:col-span-2 p-6 flex flex-col justify-between bg-[#160E30]/75 backdrop-blur-xl border-[rgba(167,139,250,0.20)] hover:border-[rgba(167,139,250,0.40)] rounded-2xl shadow-xl transition-all duration-300">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-[#F8F7FF] tracking-tight">System Telemetry & Commits</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30 shadow-[0_0_10px_rgba(139,92,246,0.15)]">
                    Telemetry Live
                  </span>
                </div>
                <p className="text-xs text-[#B8ACD9] mt-0.5">
                  Aggregate pull requests, completed deliverables, and repository commits
                </p>
              </div>

              {/* Time Range Pills */}
              <div className="flex items-center gap-1 bg-[#100A24] p-1 rounded-xl border border-[rgba(167,139,250,0.20)] self-start sm:self-auto">
                <button
                  onClick={() => setAnalyticsRange('7D')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-all duration-200 ${
                    analyticsRange === '7D'
                      ? 'bg-[#8B5CF6]/25 text-[#F8F7FF] border border-[#8B5CF6]/40 shadow-[0_0_12px_rgba(139,92,246,0.25)]'
                      : 'text-[#B8ACD9] hover:text-[#F8F7FF] hover:bg-[#160E30]'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setAnalyticsRange('30D')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-all duration-200 ${
                    analyticsRange === '30D'
                      ? 'bg-[#8B5CF6]/25 text-[#F8F7FF] border border-[#8B5CF6]/40 shadow-[0_0_12px_rgba(139,92,246,0.25)]'
                      : 'text-[#B8ACD9] hover:text-[#F8F7FF] hover:bg-[#160E30]'
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
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="accentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D946EF" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#D946EF" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    stroke="rgba(167,139,250,0.20)"
                    tick={{ fill: '#B8ACD9', fontSize: 11, fontFamily: 'monospace' }}
                    axisLine={{ stroke: 'rgba(167,139,250,0.20)' }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="rgba(167,139,250,0.20)"
                    tick={{ fill: '#B8ACD9', fontSize: 11, fontFamily: 'monospace' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#160E30',
                      borderColor: 'rgba(167, 139, 250, 0.3)',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      color: '#F8F7FF',
                      boxShadow: '0 20px 30px -5px rgba(8, 5, 20, 0.8), 0 0 15px rgba(139, 92, 246, 0.2)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="commits"
                    name="Commits"
                    stroke="#8B5CF6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#primaryGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="tasks"
                    name="Tasks Completed"
                    stroke="#D946EF"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#accentGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mt-2 border-t border-[rgba(167,139,250,0.20)] text-xs font-mono text-[#B8ACD9]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#8B5CF6] shadow-[0_0_6px_#8B5CF6]" /> Commits
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#D946EF] shadow-[0_0_6px_#D946EF]" /> Completed Tasks
              </span>
            </div>
            <span className="text-[11px] text-[#B8ACD9]/80">Synced via PostgreSQL Realtime</span>
          </div>
        </CardSpotlight>

        {/* Upcoming Milestones */}
        <CardSpotlight className="p-6 flex flex-col justify-between bg-[#160E30]/75 backdrop-blur-xl border-[rgba(167,139,250,0.20)] hover:border-[rgba(167,139,250,0.40)] rounded-2xl shadow-xl transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(167,139,250,0.20)]">
              <div>
                <h3 className="font-display text-base font-bold text-[#F8F7FF] tracking-tight">Sprint Milestones</h3>
                <p className="text-xs text-[#B8ACD9] mt-0.5">Deliverables checkpoint</p>
              </div>
              <Link to="/projects">
                <Button variant="outline" size="sm" className="h-7 text-xs border-[rgba(167,139,250,0.25)] hover:border-[#8B5CF6]/50 hover:bg-[#8B5CF6]/15 text-[#F8F7FF] font-mono">
                  View All
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingMilestones.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#B8ACD9] border border-dashed border-[rgba(167,139,250,0.25)] rounded-xl bg-[#100A24]/50 p-4">
                  <CheckCircle2 className="h-8 w-8 text-[#B8ACD9]/40 mx-auto mb-2" />
                  <p className="font-semibold text-[#F8F7FF]">All milestones cleared</p>
                  <p className="text-[#B8ACD9] mt-1">Open a project workspace to configure roadmap goals.</p>
                  <Link to="/projects/new" className="inline-block mt-3">
                    <Button variant="secondary" size="xs" className="border-[rgba(167,139,250,0.25)] bg-[#160E30] hover:bg-[#8B5CF6]/20 text-[#F8F7FF]">
                      + Initialize Project
                    </Button>
                  </Link>
                </div>
              ) : (
                upcomingMilestones.map((ms, index) => (
                  <div
                    key={ms.id}
                    className="p-3 rounded-xl bg-[#100A24]/80 border border-[rgba(167,139,250,0.20)] hover:border-[#8B5CF6]/50 hover:bg-[#1E1442]/60 hover:translate-x-1 transition-all duration-200 flex items-start gap-3 group"
                  >
                    <span className="text-[10px] font-mono text-[#A855F7] mt-0.5 font-bold">
                      [{String(index + 1).padStart(2, '0')}]
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#F8F7FF] group-hover:text-[#C4B5FD] transition-colors truncate">{ms.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-[#B8ACD9] font-mono">
                        {ms.due_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-[#A855F7]" />
                            {formatDate(ms.due_date)}
                          </span>
                        )}
                        <span>•</span>
                        <span className="text-[#34D399]">In Progress</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[rgba(167,139,250,0.20)] text-center">
            <Link
              to="/projects"
              className="text-xs text-[#A855F7] hover:text-[#D946EF] font-medium inline-flex items-center gap-1 font-mono transition-colors"
            >
              Open Kanban Workspace <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </CardSpotlight>
      </div>

      {/* 4. BOTTOM SECTION: Recommended Developers & Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Engineers */}
        <CardSpotlight className="p-6 bg-[#160E30]/75 backdrop-blur-xl border-[rgba(167,139,250,0.20)] hover:border-[rgba(167,139,250,0.40)] rounded-2xl shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(167,139,250,0.20)]">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#A855F7]" />
              <h3 className="font-display text-base font-bold text-[#F8F7FF] tracking-tight">Recommended Engineering Talent</h3>
            </div>
            <Link to="/developers" className="text-xs text-[#A855F7] hover:text-[#D946EF] font-mono transition-colors">
              View Directory →
            </Link>
          </div>

          <div className="space-y-3">
            {recommendedDevs.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#B8ACD9] border border-dashed border-[rgba(167,139,250,0.25)] rounded-xl">
                No developer recommendations available yet.
              </div>
            ) : (
              recommendedDevs.map((dev) => (
                <div
                  key={dev.id}
                  className="p-3.5 rounded-xl bg-[#100A24]/80 border border-[rgba(167,139,250,0.20)] hover:border-[#8B5CF6]/50 hover:bg-[#1E1442]/60 hover:translate-x-1 transition-all duration-200 flex items-center justify-between gap-3 group"
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
                      <h4 className="font-semibold text-xs text-[#F8F7FF] group-hover:text-[#C4B5FD] transition-colors truncate">
                        {dev.full_name}
                      </h4>
                      <p className="text-[11px] text-[#B8ACD9] truncate font-mono">
                        {dev.headline || dev.experience_level}
                      </p>
                    </div>
                  </Link>

                  <Link to={`/profile/${dev.username}`}>
                    <Button variant="secondary" size="xs" className="h-7 text-xs border-[rgba(167,139,250,0.25)] bg-[#160E30] hover:bg-[#8B5CF6]/20 text-[#F8F7FF] transition-all">
                      Dossier
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </CardSpotlight>

        {/* Recent Collaborative Projects */}
        <CardSpotlight className="p-6 bg-[#160E30]/75 backdrop-blur-xl border-[rgba(167,139,250,0.20)] hover:border-[rgba(167,139,250,0.40)] rounded-2xl shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(167,139,250,0.20)]">
            <div className="flex items-center gap-2">
              <FolderGit2 className="h-4 w-4 text-[#D946EF]" />
              <h3 className="font-display text-base font-bold text-[#F8F7FF] tracking-tight">Active Team Repositories</h3>
            </div>
            <Link to="/projects/new">
              <Button variant="secondary" size="xs" className="h-7 text-xs border-[rgba(167,139,250,0.25)] bg-[#100A24] hover:bg-[#8B5CF6]/20 text-[#F8F7FF] transition-all">
                + Launch Project
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {recentProjects.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#B8ACD9] border border-dashed border-[rgba(167,139,250,0.25)] rounded-xl">
                No active projects found. Start your first build!
              </div>
            ) : (
              recentProjects.map((proj) => (
                <Link
                  key={proj.id}
                  to={`/projects/${proj.id}`}
                  className="p-3.5 rounded-xl bg-[#100A24]/80 border border-[rgba(167,139,250,0.20)] hover:border-[#8B5CF6]/50 hover:bg-[#1E1442]/60 hover:translate-x-1 transition-all duration-200 flex items-center justify-between gap-3 group block"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-xs text-[#F8F7FF] group-hover:text-[#C4B5FD] transition-colors truncate">
                        {proj.title}
                      </h4>
                      <span className="text-[9px] py-0.5 px-2 font-mono bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[rgba(167,139,250,0.25)] rounded-full">
                        {proj.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#B8ACD9] line-clamp-1">
                      {proj.tagline || proj.description}
                    </p>
                  </div>

                  <ArrowRight className="h-4 w-4 text-[#B8ACD9] group-hover:text-[#D946EF] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </Link>
              ))
            )}
          </div>
        </CardSpotlight>
      </div>
    </div>
  );
};
