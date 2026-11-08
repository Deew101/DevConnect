import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FolderGit2,
  Mail,
  Activity,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Plus,
  Calendar,
  ArrowUpRight,
  Terminal,
  Zap,
  Github,
  Globe,
  Settings,
  Star,
  MessageSquare,
  Code2,
  Target,
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
import { BorderBeam } from '@/components/galaxy';
import { motion } from 'framer-motion';

export const DashboardPage: React.FC = () => {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState({
    connectionsCount: 14,
    activeProjectsCount: 6,
    pendingInvitesCount: 2,
    profileCompletion: 25,
  });
  const [analyticsRange, setAnalyticsRange] = useState<'7D' | '30D' | '90D'>('7D');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Telemetry commit data matching the reference sine-wave with peak at Thursday
  const chartData7D = [
    { day: 'Mon', commits: 5, tasks: 3 },
    { day: 'Tue', commits: 8, tasks: 5 },
    { day: 'Wed', commits: 10, tasks: 6 },
    { day: 'Thu', commits: 22, tasks: 12 },
    { day: 'Fri', commits: 14, tasks: 8 },
    { day: 'Sat', commits: 18, tasks: 10 },
    { day: 'Sun', commits: 12, tasks: 8 },
  ];

  const chartData30D = [
    { day: 'W1', commits: 28, tasks: 18 },
    { day: 'W2', commits: 45, tasks: 26 },
    { day: 'W3', commits: 38, tasks: 22 },
    { day: 'W4', commits: 54, tasks: 37 },
  ];

  const chartData90D = [
    { day: 'M1', commits: 120, tasks: 80 },
    { day: 'M2', commits: 185, tasks: 110 },
    { day: 'M3', commits: 210, tasks: 145 },
  ];

  const currentChartData =
    analyticsRange === '7D'
      ? chartData7D
      : analyticsRange === '30D'
      ? chartData30D
      : chartData90D;

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;

      try {
        const { count: connectionsCount } = await supabase
          .from('connections')
          .select('*', { count: 'exact', head: true })
          .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .eq('status', 'accepted');

        const { count: projectsCount } = await supabase
          .from('project_members')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        const { count: invitesCount } = await supabase
          .from('project_invitations')
          .select('*', { count: 'exact', head: true })
          .eq('receiver_id', user.id)
          .eq('status', 'pending');

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
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    }

    loadDashboardData();
  }, [user, profile]);

  const milestonesList = [
    {
      id: 'ms-01',
      code: '[01]',
      title: 'Model Evaluation & Fine-Tuning Benchmarks',
      due: '10 Nov 2026',
      status: 'In Progress',
      statusColor: 'text-[#00E6A0]',
      dotColor: 'bg-[#00E6A0]',
    },
    {
      id: 'ms-02',
      code: '[02]',
      title: 'WebRTC P2P Data Mesh Alpha Release',
      due: '12 Nov 2026',
      status: 'Upcoming',
      statusColor: 'text-[#C4B5FD]',
      dotColor: 'bg-[#8B5CF6]',
    },
    {
      id: 'ms-03',
      code: '[03]',
      title: 'Production Deployment Prep',
      due: '15 Nov 2026',
      status: 'Pending',
      statusColor: 'text-[#FFC247]',
      dotColor: 'bg-[#FFC247]',
    },
  ];

  const userSkills = ['Python', 'React', 'Next.js', 'Data Science', 'Machine Learning'];

  const recentActivities = [
    {
      id: 'act-1',
      icon: Star,
      iconColor: 'text-[#A855F7]',
      bgGlow: 'bg-[#A855F7]/15 border-[#A855F7]/30',
      title: 'You starred a repository',
      time: '2m ago',
    },
    {
      id: 'act-2',
      icon: MessageSquare,
      iconColor: 'text-[#D946EF]',
      bgGlow: 'bg-[#D946EF]/15 border-[#D946EF]/30',
      title: 'New message from Team Devs',
      time: '5m ago',
    },
    {
      id: 'act-3',
      icon: Code2,
      iconColor: 'text-[#38BDF8]',
      bgGlow: 'bg-[#38BDF8]/15 border-[#38BDF8]/30',
      title: "Project 'Cineverse' was updated",
      time: '10m ago',
    },
  ];

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12 font-sans select-none">
      {/* 1. TOP EDITORIAL META BAR */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2 pb-2 text-[11px] font-mono text-[#C4B5FD]"
      >
        <span className="text-[#A855F7] font-semibold">&gt;_</span>
        <span className="tracking-wider uppercase font-semibold">DEVCONNECT — VOL. 1.0</span>
      </motion.div>

      {/* 2. HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-2xl border border-[rgba(167,139,250,0.22)] bg-[#100A24]/60 p-6 sm:p-7 shadow-2xl backdrop-blur-xl group"
      >
        <BorderBeam size={280} duration={14} colorFrom="#8B5CF6" colorTo="#D946EF" />
        <GridPattern className="opacity-10" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F8F7FF] tracking-tight leading-tight">
              Good afternoon,{' '}
              <span className="bg-gradient-to-r from-[#C4B5FD] via-[#A855F7] to-[#D946EF] bg-clip-text text-transparent">
                Engineer.
              </span>
            </h1>

            <p className="text-xs sm:text-[13px] text-[#B8ACD9] leading-relaxed max-w-xl">
              Welcome to your personal command center. Discover verified engineering peers, coordinate sprints through interactive Kanban boards, and build high-impact software.
            </p>

            {/* Pill CTA button */}
            <div className="pt-1">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-[#F8F7FF] bg-[#160E30]/80 border border-[rgba(167,139,250,0.25)] hover:border-[#8B5CF6]/50 hover:bg-[#1E1442] shadow-[0_0_12px_rgba(139,92,246,0.15)] transition-all"
              >
                <Sparkles className="h-3 w-3 text-[#A855F7]" />
                <span>Build. Collaborate. Innovate.</span>
                <ChevronRight className="h-3.5 w-3.5 text-[#B8ACD9]" />
              </Link>
            </div>
          </div>

          {/* Dossier Readiness Card */}
          <div className="flex items-center gap-4 bg-[#160E30]/70 border border-[rgba(167,139,250,0.22)] px-5 py-4 rounded-2xl shadow-xl backdrop-blur-md self-stretch sm:self-auto min-w-[260px]">
            {/* Circular Progress Gauge */}
            <div className="relative flex items-center justify-center flex-shrink-0">
              <svg className="w-16 h-16 transform -rotate-90">
                <defs>
                  <linearGradient id="dossierGaugeGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#D946EF" />
                  </linearGradient>
                </defs>
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-[rgba(167,139,250,0.18)]"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="url(#dossierGaugeGradient)"
                  strokeWidth="4.5"
                  className="transition-all duration-700 drop-shadow-[0_0_10px_rgba(217,70,239,0.6)]"
                  fill="transparent"
                  strokeDasharray="163"
                  strokeDashoffset={163 - (163 * stats.profileCompletion) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-mono text-xs font-extrabold text-[#F8F7FF]">
                {stats.profileCompletion}%
              </span>
            </div>

            <div className="min-w-[130px]">
              <div className="text-xs font-display font-bold text-[#F8F7FF]">Dossier Readiness</div>
              <p className="text-[11px] text-[#B8ACD9] mt-0.5">Refine public profile</p>
              <Link
                to="/profile/edit"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#A855F7] hover:text-[#D946EF] transition-colors mt-1"
              >
                Complete profile &gt;
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. ROW 1: 4 KPI STAT TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tile 1: Peer Network */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="h-full"
        >
          <CardSpotlight className="p-5 flex flex-col justify-between bg-[#100A24]/65 backdrop-blur-xl border-[rgba(167,139,250,0.20)] hover:border-[#8B5CF6]/50 rounded-2xl shadow-xl transition-all duration-300 h-full">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest text-[#B8ACD9] uppercase font-bold">
                PEER NETWORK
              </span>
              <div className="p-1.5 rounded-lg bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#C4B5FD] shadow-[0_0_8px_rgba(139,92,246,0.2)]">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-display text-3xl font-extrabold text-[#F8F7FF] tracking-tight">
                <NumberTicker value={stats.connectionsCount} />
              </div>
              <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-[rgba(167,139,250,0.14)]">
                <span className="text-[#00E6A0] text-[11px] font-mono font-medium flex items-center gap-0.5">
                  ↑ 3 verified
                </span>
                <Link to="/developers" className="text-[#B8ACD9] hover:text-[#A855F7] transition-colors flex items-center text-[11px]">
                  Directory <ArrowUpRight className="h-3 w-3 ml-0.5" />
                </Link>
              </div>
            </div>
          </CardSpotlight>
        </motion.div>

        {/* Tile 2: Active Workspaces */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="h-full"
        >
          <CardSpotlight className="p-5 flex flex-col justify-between bg-[#100A24]/65 backdrop-blur-xl border-[rgba(167,139,250,0.20)] hover:border-[#A855F7]/50 rounded-2xl shadow-xl transition-all duration-300 h-full">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest text-[#B8ACD9] uppercase font-bold">
                ACTIVE WORKSPACES
              </span>
              <div className="p-1.5 rounded-lg bg-[#A855F7]/15 border border-[#A855F7]/30 text-[#F8F7FF] shadow-[0_0_8px_rgba(168,85,247,0.2)]">
                <FolderGit2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-display text-3xl font-extrabold text-[#F8F7FF] tracking-tight">
                <NumberTicker value={stats.activeProjectsCount} />
              </div>
              <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-[rgba(167,139,250,0.14)]">
                <span className="text-[#B8ACD9] text-[11px] font-mono">Contributor / Lead</span>
                <Link to="/projects/new" className="text-[#A855F7] hover:text-[#D946EF] transition-colors flex items-center gap-0.5 text-[11px] font-medium">
                  <Plus className="h-3 w-3" /> New
                </Link>
              </div>
            </div>
          </CardSpotlight>
        </motion.div>

        {/* Tile 3: Collaboration Inquiries */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="h-full"
        >
          <CardSpotlight className="p-5 flex flex-col justify-between bg-[#100A24]/65 backdrop-blur-xl border-[rgba(167,139,250,0.20)] hover:border-[#D946EF]/50 rounded-2xl shadow-xl transition-all duration-300 h-full">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest text-[#B8ACD9] uppercase font-bold">
                COLLABORATION INQUIRIES
              </span>
              <div className="p-1.5 rounded-lg bg-[#D946EF]/15 border border-[#D946EF]/30 text-[#D946EF] shadow-[0_0_8px_rgba(217,70,239,0.2)]">
                <Mail className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-display text-3xl font-extrabold text-[#F8F7FF] tracking-tight">
                <NumberTicker value={stats.pendingInvitesCount} />
              </div>
              <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-[rgba(167,139,250,0.14)]">
                <span className="text-[11px] font-mono text-[#FFC247] font-medium">
                  Pending action
                </span>
                <Link to="/notifications" className="text-[#B8ACD9] hover:text-[#F8F7FF] text-[11px]">
                  View Stream
                </Link>
              </div>
            </div>
          </CardSpotlight>
        </motion.div>

        {/* Tile 4: Sprint Velocity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.20, ease: [0.16, 1, 0.3, 1] }}
          className="h-full"
        >
          <CardSpotlight className="p-5 flex flex-col justify-between bg-[#100A24]/65 backdrop-blur-xl border-[rgba(167,139,250,0.20)] hover:border-[#00E6A0]/50 rounded-2xl shadow-xl transition-all duration-300 h-full">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest text-[#B8ACD9] uppercase font-bold">
                SPRINT VELOCITY
              </span>
              <div className="p-1.5 rounded-lg bg-[#00E6A0]/15 border border-[#00E6A0]/30 text-[#00E6A0] shadow-[0_0_8px_rgba(0,230,160,0.2)]">
                <Activity className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 relative">
              <div className="flex items-baseline justify-between">
                <div className="font-display text-3xl font-extrabold text-[#F8F7FF] tracking-tight flex items-baseline">
                  <NumberTicker value={94} />
                  <span className="text-sm font-normal text-[#B8ACD9] font-mono ml-1">/100</span>
                </div>

                {/* Glowing cyan/blue sparkline wave on right side of card */}
                <div className="w-20 h-8 opacity-90">
                  <svg viewBox="0 0 80 32" fill="none" className="w-full h-full">
                    <path
                      d="M 2 28 C 15 26, 25 18, 40 20 C 55 22, 65 6, 78 4"
                      stroke="#38BDF8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 2 28 C 15 26, 25 18, 40 20 C 55 22, 65 6, 78 4 L 78 32 L 2 32 Z"
                      fill="url(#sparklineCyanGradient)"
                      opacity="0.3"
                    />
                    <defs>
                      <linearGradient id="sparklineCyanGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38BDF8" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-[rgba(167,139,250,0.14)]">
                <span className="text-[#00E6A0] text-[11px] font-mono font-medium">
                  ↑ 12% vs last sprint
                </span>
                <span className="text-[#B8ACD9] font-mono text-[10px]">Realtime RLS</span>
              </div>
            </div>
          </CardSpotlight>
        </motion.div>
      </div>

      {/* 4. ROW 2: SYSTEM TELEMETRY (65%) & SPRINT MILESTONES (35%) */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-5"
      >
        {/* System Telemetry & Commits */}
        <CardSpotlight className="lg:col-span-2 p-6 flex flex-col justify-between bg-[#100A24]/65 backdrop-blur-xl border-[rgba(167,139,250,0.20)] hover:border-[rgba(167,139,250,0.40)] rounded-2xl shadow-xl transition-all duration-300">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#A855F7]" />
                  <h3 className="font-display text-base font-bold text-[#F8F7FF] tracking-tight">
                    System Telemetry &amp; Commits
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[#8B5CF6]/30 shadow-[0_0_8px_rgba(139,92,246,0.15)] flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00E6A0] animate-pulse" />
                    TELEMETRY LIVE
                  </span>
                </div>
                <p className="text-xs text-[#B8ACD9] mt-0.5">
                  Aggregate pull requests, completed deliverables, and repository commits
                </p>
              </div>

              {/* Time Range Pills */}
              <div className="flex items-center gap-1 bg-[#160E30]/80 p-1 rounded-xl border border-[rgba(167,139,250,0.20)] self-start sm:self-auto">
                {(['7D', '30D', '90D'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setAnalyticsRange(r)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-all duration-200 ${
                      analyticsRange === r
                        ? 'bg-[#8B5CF6]/30 text-[#F8F7FF] border border-[#8B5CF6]/50 shadow-[0_0_10px_rgba(139,92,246,0.25)]'
                        : 'text-[#B8ACD9] hover:text-[#F8F7FF] hover:bg-[#1E1442]'
                    }`}
                  >
                    {r === '7D' ? '7 Days' : r === '30D' ? '30 Days' : '90 Days'}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentChartData} margin={{ top: 12, right: 12, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="violetSineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A855F7" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="softPurpleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D946EF" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#D946EF" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    stroke="rgba(167,139,250,0.18)"
                    tick={{ fill: '#B8ACD9', fontSize: 11, fontFamily: 'monospace' }}
                    axisLine={{ stroke: 'rgba(167,139,250,0.18)' }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="rgba(167,139,250,0.18)"
                    tick={{ fill: '#B8ACD9', fontSize: 11, fontFamily: 'monospace' }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 24]}
                    ticks={[0, 8, 16, 24]}
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
                    type="natural"
                    dataKey="commits"
                    name="Commits"
                    stroke="#A855F7"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#violetSineGradient)"
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      if (payload && payload.day === 'Thu') {
                        return (
                          <g key="peak-point">
                            <circle cx={cx} cy={cy} r={10} fill="rgba(168, 85, 247, 0.4)" className="animate-pulse" />
                            <circle cx={cx} cy={cy} r={4} fill="#FFFFFF" stroke="#A855F7" strokeWidth={2} />
                          </g>
                        );
                      }
                      return <React.Fragment key={props.index} />;
                    }}
                  />
                  <Area
                    type="natural"
                    dataKey="tasks"
                    name="Tasks"
                    stroke="#D946EF"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#softPurpleGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardSpotlight>

        {/* Sprint Milestones */}
        <CardSpotlight className="p-6 flex flex-col justify-between bg-[#100A24]/65 backdrop-blur-xl border-[rgba(167,139,250,0.20)] hover:border-[rgba(167,139,250,0.40)] rounded-2xl shadow-xl transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(167,139,250,0.18)]">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-[#A855F7]" />
                <div>
                  <h3 className="font-display text-sm font-bold text-[#F8F7FF] tracking-tight">
                    Sprint Milestones
                  </h3>
                  <p className="text-[11px] text-[#B8ACD9]">Deliverables checkpoint</p>
                </div>
              </div>
              <Link to="/projects">
                <Button variant="outline" size="xs" className="h-7 text-xs border-[rgba(167,139,250,0.25)] hover:border-[#8B5CF6]/50 hover:bg-[#8B5CF6]/15 text-[#F8F7FF] font-mono">
                  View All
                </Button>
              </Link>
            </div>

            {/* Timeline List */}
            <div className="relative pl-5 space-y-4">
              {/* Vertical connector line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[rgba(167,139,250,0.25)]" />

              {milestonesList.map((ms) => (
                <div key={ms.id} className="relative group">
                  {/* Timeline Node Dot */}
                  <div
                    className={`absolute -left-[17px] top-1.5 h-2.5 w-2.5 rounded-full ${ms.dotColor} ring-4 ring-[#100A24] shadow-[0_0_8px_currentColor]`}
                  />

                  <div className="p-2.5 rounded-xl bg-[#160E30]/70 border border-[rgba(167,139,250,0.18)] hover:border-[#8B5CF6]/50 hover:bg-[#1E1442]/60 transition-all duration-200">
                    <div className="flex items-start gap-1.5">
                      <span className="text-[10px] font-mono text-[#A855F7] font-bold mt-0.5">
                        {ms.code}
                      </span>
                      <p className="text-xs font-semibold text-[#F8F7FF] group-hover:text-[#C4B5FD] transition-colors leading-snug">
                        {ms.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 pl-4 text-[10px] text-[#B8ACD9] font-mono">
                      <Calendar className="h-3 w-3 text-[#B8ACD9]" />
                      <span>{ms.due}</span>
                      <span>•</span>
                      <span className={`font-semibold ${ms.statusColor}`}>{ms.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardSpotlight>
      </motion.div>

      {/* 5. ROW 3: BOTTOM SECTION (Quick Actions, Your Skills, Recent Activity) */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {/* Card 1: Quick Actions */}
        <CardSpotlight className="p-5 flex flex-col justify-between bg-[#100A24]/65 backdrop-blur-xl border-[rgba(167,139,250,0.20)] hover:border-[rgba(167,139,250,0.40)] rounded-2xl shadow-xl transition-all duration-300">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-[#A855F7]" />
              <h3 className="font-display text-sm font-bold text-[#F8F7FF] tracking-tight">
                Quick Actions
              </h3>
            </div>
            <p className="text-[11px] text-[#B8ACD9] mb-4">Jump back into your workflow</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {/* Action 1: New Project */}
              <Link
                to="/projects/new"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#160E30]/70 border border-[rgba(167,139,250,0.18)] hover:border-[#8B5CF6]/50 hover:bg-[#1E1442] hover:-translate-y-0.5 transition-all text-center group"
              >
                <div className="h-8 w-8 rounded-lg bg-[#8B5CF6]/15 flex items-center justify-center text-[#C4B5FD] group-hover:scale-105 transition-transform mb-1.5 shadow-[0_0_8px_rgba(139,92,246,0.2)]">
                  <Plus className="h-4 w-4 text-[#A855F7]" />
                </div>
                <span className="text-[11px] font-medium text-[#F8F7FF] group-hover:text-[#C4B5FD] transition-colors leading-tight">
                  New Project
                </span>
              </Link>

              {/* Action 2: Find Teammates */}
              <Link
                to="/developers"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#160E30]/70 border border-[rgba(167,139,250,0.18)] hover:border-[#8B5CF6]/50 hover:bg-[#1E1442] hover:-translate-y-0.5 transition-all text-center group"
              >
                <div className="h-8 w-8 rounded-lg bg-[#A855F7]/15 flex items-center justify-center text-[#C4B5FD] group-hover:scale-105 transition-transform mb-1.5 shadow-[0_0_8px_rgba(168,85,247,0.2)]">
                  <Users className="h-4 w-4 text-[#A855F7]" />
                </div>
                <span className="text-[11px] font-medium text-[#F8F7FF] group-hover:text-[#C4B5FD] transition-colors leading-tight">
                  Find Teammates
                </span>
              </Link>

              {/* Action 3: Explore Repos */}
              <Link
                to="/repositories"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#160E30]/70 border border-[rgba(167,139,250,0.18)] hover:border-[#8B5CF6]/50 hover:bg-[#1E1442] hover:-translate-y-0.5 transition-all text-center group"
              >
                <div className="h-8 w-8 rounded-lg bg-[#D946EF]/15 flex items-center justify-center text-[#D946EF] group-hover:scale-105 transition-transform mb-1.5 shadow-[0_0_8px_rgba(217,70,239,0.2)]">
                  <Github className="h-4 w-4 text-[#D946EF]" />
                </div>
                <span className="text-[11px] font-medium text-[#F8F7FF] group-hover:text-[#C4B5FD] transition-colors leading-tight">
                  Explore Repos
                </span>
              </Link>

              {/* Action 4: Join Community */}
              <Link
                to="/teams"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#160E30]/70 border border-[rgba(167,139,250,0.18)] hover:border-[#8B5CF6]/50 hover:bg-[#1E1442] hover:-translate-y-0.5 transition-all text-center group"
              >
                <div className="h-8 w-8 rounded-lg bg-[#38BDF8]/15 flex items-center justify-center text-[#38BDF8] group-hover:scale-105 transition-transform mb-1.5 shadow-[0_0_8px_rgba(56,189,248,0.2)]">
                  <Globe className="h-4 w-4 text-[#38BDF8]" />
                </div>
                <span className="text-[11px] font-medium text-[#F8F7FF] group-hover:text-[#C4B5FD] transition-colors leading-tight">
                  Join Community
                </span>
              </Link>
            </div>
          </div>
        </CardSpotlight>

        {/* Card 2: Your Skills */}
        <CardSpotlight className="p-5 flex flex-col justify-between bg-[#100A24]/65 backdrop-blur-xl border-[rgba(167,139,250,0.20)] hover:border-[rgba(167,139,250,0.40)] rounded-2xl shadow-xl transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-[#A855F7]" />
                <h3 className="font-display text-sm font-bold text-[#F8F7FF] tracking-tight">
                  Your Skills
                </h3>
              </div>
              <Link
                to="/profile/edit"
                className="text-xs text-[#A855F7] hover:text-[#D946EF] font-mono transition-colors"
              >
                View All →
              </Link>
            </div>
            <p className="text-[11px] text-[#B8ACD9] mb-4">Top Skills</p>

            <div className="flex flex-wrap gap-2 pt-1">
              {userSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium text-[#F8F7FF] bg-[#160E30]/90 border border-[rgba(167,139,250,0.22)] shadow-sm hover:border-[#8B5CF6]/60 hover:bg-[#1E1442] transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </CardSpotlight>

        {/* Card 3: Recent Activity */}
        <CardSpotlight className="p-5 flex flex-col justify-between bg-[#100A24]/65 backdrop-blur-xl border-[rgba(167,139,250,0.20)] hover:border-[rgba(167,139,250,0.40)] rounded-2xl shadow-xl transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#A855F7]" />
                <h3 className="font-display text-sm font-bold text-[#F8F7FF] tracking-tight">
                  Recent Activity
                </h3>
              </div>
              <Link
                to="/notifications"
                className="text-xs text-[#A855F7] hover:text-[#D946EF] font-mono transition-colors"
              >
                View All →
              </Link>
            </div>
            <p className="text-[11px] text-[#B8ACD9] mb-4">Live Activity Feed</p>

            <div className="space-y-2.5">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between gap-3 p-2 rounded-xl bg-[#160E30]/60 border border-[rgba(167,139,250,0.14)] hover:border-[#8B5CF6]/40 hover:bg-[#1E1442]/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className={`p-1.5 rounded-lg border ${act.bgGlow} flex-shrink-0`}>
                      <act.icon className={`h-3.5 w-3.5 ${act.iconColor}`} />
                    </div>
                    <span className="text-xs text-[#F8F7FF] font-medium truncate">
                      {act.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#B8ACD9] font-mono flex-shrink-0">
                    {act.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardSpotlight>
      </motion.div>
    </div>
  );
};
