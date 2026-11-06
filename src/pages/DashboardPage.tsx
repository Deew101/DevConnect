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
  ExternalLink,
  Plus,
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
import { StatCard } from '@/components/common/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { Project, Profile, Connection, ActivityLog } from '@/types/database.types';
import { formatTimeAgo } from '@/lib/utils';

export const DashboardPage: React.FC = () => {
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    connectionsCount: 0,
    activeProjectsCount: 0,
    pendingInvitesCount: 0,
    profileCompletion: 80,
  });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recommendedDevs, setRecommendedDevs] = useState<Profile[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  // Weekly activity metrics
  const activityChartData = [
    { day: 'Mon', commits: 4, tasks: 2 },
    { day: 'Tue', commits: 7, tasks: 5 },
    { day: 'Wed', commits: 5, tasks: 3 },
    { day: 'Thu', commits: 9, tasks: 6 },
    { day: 'Fri', commits: 12, tasks: 8 },
    { day: 'Sat', commits: 6, tasks: 4 },
    { day: 'Sun', commits: 8, tasks: 5 },
  ];

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      setLoading(true);

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
        let completion = 20; // baseline for created account
        if (profile?.bio) completion += 20;
        if (profile?.github_username) completion += 20;
        if (profile?.avatar_url) completion += 15;
        if (profile?.headline) completion += 15;
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
            owner:owner_id (id, username, full_name, avatar_url)
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
          .limit(4);

        if (devsData) setRecommendedDevs(devsData as Profile[]);

        // 7. Recent activity logs
        const { data: logsData } = await supabase
          .from('activity_logs')
          .select(`
            *,
            user:user_id (id, username, full_name, avatar_url)
          `)
          .order('created_at', { ascending: false })
          .limit(6);

        if (logsData) setActivities(logsData as any);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user, profile]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome & Profile Completion Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-[#0d172e] via-[#091122] to-[#070d1a] p-6 sm:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <Sparkles className="h-3.5 w-3.5" /> Developer Workspace Live
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {profile?.full_name || 'Developer'}!
            </h1>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              Find teammates, build cutting-edge collaborative projects, track milestones, and synchronize your code contributions in real-time.
            </p>
          </div>

          {/* Profile Completion Dial / Card */}
          <div className="w-full md:w-72 p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-300">Profile Readiness</span>
              <span className="font-mono font-bold text-cyan-400">{stats.profileCompletion}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.profileCompletion}%` }}
              />
            </div>
            {stats.profileCompletion < 100 ? (
              <Link
                to="/profile/edit"
                className="inline-flex items-center text-xs font-semibold text-cyan-400 hover:text-cyan-300"
              >
                Complete profile & skills <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Profile 100% complete
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Primary KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Network Connections"
          value={stats.connectionsCount}
          icon={Users}
          change="+3 this week"
          trend="up"
          color="cyan"
        />
        <StatCard
          title="Active Projects"
          value={stats.activeProjectsCount}
          icon={FolderGit2}
          change="2 in progress"
          trend="neutral"
          color="purple"
        />
        <StatCard
          title="Pending Invites"
          value={stats.pendingInvitesCount}
          icon={Mail}
          change={stats.pendingInvitesCount > 0 ? 'Action required' : 'Up to date'}
          trend={stats.pendingInvitesCount > 0 ? 'up' : 'neutral'}
          color="amber"
        />
        <StatCard
          title="Weekly Productivity"
          value="94%"
          icon={Activity}
          change="+12% activity"
          trend="up"
          color="emerald"
        />
      </div>

      {/* Middle Row: Chart & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart (2 cols) */}
        <Card className="lg:col-span-2 border-slate-800 bg-[#0d1527]/90 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-base font-bold text-white">Collaboration Activity</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                Task completions and development milestones over the past 7 days
              </p>
            </div>
            <Badge variant="cyan" className="font-mono text-xs">
              Live Stream
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityChartData}>
                <defs>
                  <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="commits"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#cyanGradient)"
                  name="Commits & PRs"
                />
                <Area
                  type="monotone"
                  dataKey="tasks"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#purpleGradient)"
                  name="Tasks Completed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity Feed (1 col) */}
        <Card className="border-slate-800 bg-[#0d1527]/90 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-base font-bold text-white">Recent Activity</CardTitle>
              <Clock className="h-4 w-4 text-slate-500" />
            </div>

            <div className="space-y-3.5">
              {activities.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No recent activities recorded. Start by joining or creating a project!
                </div>
              ) : (
                activities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <Avatar
                      src={act.user?.avatar_url}
                      name={act.user?.full_name}
                      size="sm"
                      className="w-7 h-7 text-[10px]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-200">
                        <span className="font-semibold text-white">
                          {act.user?.full_name || 'Member'}
                        </span>{' '}
                        {act.description}
                      </p>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {formatTimeAgo(act.created_at)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link
            to="/projects"
            className="mt-4 pt-3 border-t border-slate-800 text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center justify-between"
          >
            <span>Explore all workspace feeds</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Card>
      </div>

      {/* Bottom Row: Recommended Projects & Developers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Projects */}
        <Card className="border-slate-800 bg-[#0d1527]/90 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-base font-bold text-white">Featured Projects</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Projects looking for engineers and contributors</p>
            </div>
            <Link to="/projects/new">
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <Plus className="h-3.5 w-3.5 mr-1" /> New Project
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {recentProjects.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No active projects found. Be the first to create one!
              </div>
            ) : (
              recentProjects.map((p) => (
                <Link
                  key={p.id}
                  to={`/projects/${p.id}`}
                  className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-800/60 hover:border-cyan-500/40 transition-all flex items-center justify-between group block"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-white group-hover:text-cyan-400 transition-colors truncate">
                        {p.title}
                      </h4>
                      <Badge variant="secondary" className="text-[10px]">
                        {p.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                      {p.tagline || p.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(p.required_skills || []).slice(0, 3).map((sk) => (
                        <span
                          key={sk}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Link>
              ))
            )}
          </div>
        </Card>

        {/* Recommended Developers */}
        <Card className="border-slate-800 bg-[#0d1527]/90 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-base font-bold text-white">Recommended Developers</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Engineers matching your interests and tech stack</p>
            </div>
            <Link to="/developers">
              <Button variant="ghost" size="sm" className="h-8 text-xs text-cyan-400">
                View All
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
                  className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-800/60 transition-all flex items-center justify-between"
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
                      <h4 className="font-semibold text-sm text-white group-hover:text-cyan-400 transition-colors truncate">
                        {dev.full_name}
                      </h4>
                      <p className="text-xs text-slate-400 truncate">
                        {dev.headline || dev.experience_level}
                      </p>
                      <span className="text-[10px] text-cyan-400 font-mono">
                        @{dev.username}
                      </span>
                    </div>
                  </Link>

                  <Link to={`/profile/${dev.username}`}>
                    <Button variant="outline" size="sm" className="h-8 text-xs font-semibold">
                      View Profile
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
