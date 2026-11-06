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
  Zap,
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. HERO SECTION: Personalized Greeting & Profile Dial */}
      <div className="relative overflow-hidden rounded-2xl border border-[#273249] bg-gradient-to-r from-[#141C2B] via-[#0E1420] to-[#141C2B] p-6 sm:p-8 shadow-2xl">
        <GridPattern className="opacity-30" />
        <div className="absolute right-0 top-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-[#648BFF]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#648BFF]/10 border border-[#648BFF]/30 text-[#648BFF] text-[11px] font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-[#35C98A] animate-pulse" />
                DevConnect v2.0 • Supabase Live
              </span>
              <span className="text-xs text-[#929DB2] font-mono">
                {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F1F5FC] tracking-tight">
              {getGreeting()}, {profile?.full_name || 'Developer'}
            </h1>
            <p className="text-xs sm:text-sm text-[#929DB2] max-w-xl leading-relaxed">
              Find collaborative engineering builds, coordinate sprint deliverables on Kanban boards, and recruit teammates via AI matching.
            </p>
          </div>

          {/* Profile Readiness & Action */}
          <div className="flex items-center gap-4 bg-[#0E1420] border border-[#273249] p-3.5 rounded-2xl backdrop-blur-md w-full md:w-auto shadow-sm">
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
                  className="text-[#648BFF] transition-all duration-500"
                  fill="transparent"
                  strokeDasharray="138"
                  strokeDashoffset={138 - (138 * stats.profileCompletion) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-mono text-xs font-bold text-[#F1F5FC]">
                {stats.profileCompletion}%
              </span>
            </div>

            <div className="min-w-[130px]">
              <div className="text-xs font-semibold text-[#F1F5FC]">Profile Readiness</div>
              <p className="text-[11px] text-[#929DB2] mt-0.5">
                {stats.profileCompletion === 100 ? 'All details set' : 'Boost matchmaking'}
              </p>
              {stats.profileCompletion < 100 && (
                <Link
                  to="/profile/edit"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#648BFF] hover:text-[#9B7BFF] mt-1"
                >
                  Complete profile <ChevronRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. STAT TILES: 4 Distinct Asymmetric SaaS KPIs with Animated NumberTicker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tile 1: Connections */}
        <CardSpotlight className="p-5 flex flex-col justify-between bg-[#141C2B] border-[#273249]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#929DB2] font-mono tracking-wider">TOTAL CONNECTIONS</span>
            <div className="p-2 rounded-xl bg-[#648BFF]/10 border border-[#648BFF]/20 text-[#648BFF]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-[#F1F5FC] font-mono tracking-tight">
              <NumberTicker value={stats.connectionsCount} />
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-[#35C98A] font-medium">+3 this week</span>
              <Link to="/developers" className="text-[#929DB2] hover:text-[#648BFF] transition-colors flex items-center">
                Discover <ArrowUpRight className="h-3 w-3 ml-0.5" />
              </Link>
            </div>
          </div>
        </CardSpotlight>

        {/* Tile 2: Active Projects */}
        <CardSpotlight className="p-5 flex flex-col justify-between bg-[#141C2B] border-[#273249]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#929DB2] font-mono tracking-wider">ACTIVE PROJECTS</span>
            <div className="p-2 rounded-xl bg-[#9B7BFF]/10 border border-[#9B7BFF]/20 text-[#9B7BFF]">
              <FolderGit2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-[#F1F5FC] font-mono tracking-tight">
              <NumberTicker value={stats.activeProjectsCount} />
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-[#929DB2]">Member & owner</span>
              <Link to="/projects/new" className="text-[#648BFF] hover:underline flex items-center gap-0.5">
                <Plus className="h-3 w-3" /> New
              </Link>
            </div>
          </div>
        </CardSpotlight>

        {/* Tile 3: Pending Invites */}
        <CardSpotlight className="p-5 flex flex-col justify-between bg-[#141C2B] border-[#273249]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#929DB2] font-mono tracking-wider">PENDING INVITATIONS</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Mail className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-[#F1F5FC] font-mono tracking-tight">
              <NumberTicker value={stats.pendingInvitesCount} />
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className={stats.pendingInvitesCount > 0 ? 'text-amber-400 font-medium' : 'text-[#929DB2]'}>
                {stats.pendingInvitesCount > 0 ? 'Requires response' : 'No pending requests'}
              </span>
              <Link to="/notifications" className="text-[#929DB2] hover:text-[#F1F5FC]">
                View
              </Link>
            </div>
          </div>
        </CardSpotlight>

        {/* Tile 4: Productivity Index */}
        <CardSpotlight className="p-5 flex flex-col justify-between bg-[#141C2B] border-[#273249]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#929DB2] font-mono tracking-wider">SPRINT VELOCITY</span>
            <div className="p-2 rounded-xl bg-[#35C98A]/10 border border-[#35C98A]/20 text-[#35C98A]">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-[#F1F5FC] font-mono tracking-tight flex items-baseline">
              <NumberTicker value={94} />
              <span className="text-sm font-normal text-[#929DB2]">/100</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-[#35C98A] font-medium">Sprint on track</span>
              <span className="text-[#929DB2] font-mono text-[10px]">Realtime RLS</span>
            </div>
          </div>
        </CardSpotlight>
      </div>

      {/* 3. MIDDLE SECTION: Chart (2 Cols) & Milestones Checklist (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Collaboration Analytics */}
        <CardSpotlight className="lg:col-span-2 p-6 flex flex-col justify-between bg-[#141C2B] border-[#273249]">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#F1F5FC] tracking-tight">Collaboration Analytics</h3>
                  <Badge variant="cyan" className="bg-[#648BFF]/15 text-[#648BFF] border-[#648BFF]/30">Realtime</Badge>
                </div>
                <p className="text-xs text-[#929DB2] mt-0.5">
                  Task completions and Git commits across team repositories
                </p>
              </div>

              {/* Time Range Pills */}
              <div className="flex items-center gap-1 bg-[#0E1420] p-1 rounded-xl border border-[#273249] self-start sm:self-auto">
                <button
                  onClick={() => setAnalyticsRange('7D')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-all ${
                    analyticsRange === '7D'
                      ? 'bg-[#141C2B] text-[#648BFF] border border-[#273249] shadow-sm'
                      : 'text-[#929DB2] hover:text-[#F1F5FC]'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setAnalyticsRange('30D')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-all ${
                    analyticsRange === '30D'
                      ? 'bg-[#141C2B] text-[#648BFF] border border-[#273249] shadow-sm'
                      : 'text-[#929DB2] hover:text-[#F1F5FC]'
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
                      <stop offset="5%" stopColor="#648BFF" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#648BFF" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="accentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9B7BFF" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#9B7BFF" stopOpacity={0.0} />
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
                      backgroundColor: '#141C2B',
                      borderColor: '#273249',
                      borderRadius: '0.875rem',
                      fontSize: '12px',
                      color: '#F1F5FC',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="commits"
                    name="Commits"
                    stroke="#648BFF"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#primaryGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="tasks"
                    name="Tasks Done"
                    stroke="#9B7BFF"
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
                <span className="h-2.5 w-2.5 rounded-full bg-[#648BFF]" /> Commits
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#9B7BFF]" /> Completed Tasks
              </span>
            </div>
            <span>Syncing Supabase DB</span>
          </div>
        </CardSpotlight>

        {/* Upcoming Milestones */}
        <CardSpotlight className="p-6 flex flex-col justify-between bg-[#141C2B] border-[#273249]">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#273249]">
              <div>
                <h3 className="text-base font-bold text-[#F1F5FC] tracking-tight">Upcoming Milestones</h3>
                <p className="text-xs text-[#929DB2] mt-0.5">Sprint checkpoints</p>
              </div>
              <Link to="/projects">
                <Button variant="outline" size="sm" className="h-7 text-xs border-[#273249]">
                  View All
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingMilestones.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#929DB2] border border-dashed border-[#273249] rounded-xl bg-[#0E1420]/50 p-4">
                  <CheckCircle2 className="h-8 w-8 text-[#929DB2]/40 mx-auto mb-2" />
                  <p className="font-semibold text-[#F1F5FC]">No pending milestones</p>
                  <p className="text-[#929DB2] mt-1">Create or join a project workspace to track deliverables.</p>
                  <Link to="/projects/new" className="inline-block mt-3">
                    <Button variant="secondary" size="xs">
                      + Start Project
                    </Button>
                  </Link>
                </div>
              ) : (
                upcomingMilestones.map((ms) => (
                  <div
                    key={ms.id}
                    className="p-3 rounded-xl bg-[#0E1420] border border-[#273249] hover:border-[#648BFF]/40 transition-all flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#929DB2] mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#F1F5FC] truncate">{ms.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-[#929DB2] font-mono">
                        {ms.due_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-[#648BFF]" />
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
              className="text-xs text-[#648BFF] hover:text-[#9B7BFF] font-medium inline-flex items-center gap-1"
            >
              Open Project Workspace <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </CardSpotlight>
      </div>

      {/* 4. BOTTOM SECTION: Recommended Developers & Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Developers */}
        <CardSpotlight className="p-6 bg-[#141C2B] border-[#273249]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#273249]">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#648BFF]" />
              <h3 className="text-base font-bold text-[#F1F5FC] tracking-tight">Recommended Engineers</h3>
            </div>
            <Link to="/developers" className="text-xs text-[#648BFF] hover:underline font-mono">
              View Directory
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
                  className="p-3.5 rounded-xl bg-[#0E1420] border border-[#273249] hover:border-[#648BFF]/40 transition-all flex items-center justify-between gap-3 group"
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
                      <h4 className="font-semibold text-xs text-[#F1F5FC] group-hover:text-[#648BFF] transition-colors truncate">
                        {dev.full_name}
                      </h4>
                      <p className="text-[11px] text-[#929DB2] truncate">
                        {dev.headline || dev.experience_level}
                      </p>
                    </div>
                  </Link>

                  <Link to={`/profile/${dev.username}`}>
                    <Button variant="secondary" size="xs" className="h-7 text-xs border-[#273249]">
                      View Profile
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </CardSpotlight>

        {/* Recent Collaborative Projects */}
        <CardSpotlight className="p-6 bg-[#141C2B] border-[#273249]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#273249]">
            <div className="flex items-center gap-2">
              <FolderGit2 className="h-4 w-4 text-[#9B7BFF]" />
              <h3 className="text-base font-bold text-[#F1F5FC] tracking-tight">Recent Projects</h3>
            </div>
            <Link to="/projects/new">
              <Button variant="secondary" size="xs" className="h-7 text-xs border-[#273249]">
                + New Project
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
                  className="p-3.5 rounded-xl bg-[#0E1420] border border-[#273249] hover:border-[#648BFF]/40 transition-all flex items-center justify-between gap-3 group block"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-xs text-[#F1F5FC] group-hover:text-[#648BFF] transition-colors truncate">
                        {proj.title}
                      </h4>
                      <Badge variant="cyan" className="text-[9px] py-0 px-1.5 font-mono bg-[#648BFF]/15 text-[#648BFF] border-[#648BFF]/30">
                        {proj.category}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#929DB2] line-clamp-1">
                      {proj.tagline || proj.description}
                    </p>
                  </div>

                  <ArrowRight className="h-4 w-4 text-[#929DB2] group-hover:text-[#648BFF] transition-colors flex-shrink-0" />
                </Link>
              ))
            )}
          </div>
        </CardSpotlight>
      </div>
    </div>
  );
};
