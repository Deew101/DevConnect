import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  UserPlus,
  UserCheck,
  Clock,
  Sparkles,
  MapPin,
  Github,
  ArrowUpDown,
  RotateCcw,
  Terminal,
  ExternalLink,
  ShieldAlert,
  Users,
  BookOpen,
  Building,
  Copy,
  FolderGit2,
} from 'lucide-react';
import { Profile, ExperienceLevel } from '@/types/database.types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { CardSpotlight } from '@/components/ui/CardSpotlight';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { DEMO_PROFILES } from '@/data/demoCommunityData';
import { ExternalGitHubDeveloper, EXTERNAL_GITHUB_DEVELOPERS } from '@/data/githubData';
import { githubService } from '@/services/githubService';

export const DiscoveryPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // If navigated with ?tab=github, route to dedicated /github-developers page
  useEffect(() => {
    if (searchParams.get('tab') === 'github') {
      navigate('/github-developers', { replace: true });
    }
  }, [searchParams, navigate]);

  // Active Tab: 'devconnect' | 'github'
  const initialTab = searchParams.get('tab') === 'github' ? 'github' : 'devconnect';
  const [activeTab, setActiveTab] = useState<'devconnect' | 'github'>(initialTab);

  // DevConnect Directory State
  const [developers, setDevelopers] = useState<
    (Profile & { skillsList?: string[]; isConnected?: boolean; isPending?: boolean; connectionId?: string })[]
  >([]);
  const [loading, setLoading] = useState(true);

  // External GitHub Developers State
  const [externalDevs, setExternalDevs] = useState<ExternalGitHubDeveloper[]>(EXTERNAL_GITHUB_DEVELOPERS);
  const [loadingExternal, setLoadingExternal] = useState(false);
  const [externalSearchQuery, setExternalSearchQuery] = useState('');
  const [externalSortBy, setExternalSortBy] = useState<'followers' | 'repos'>('followers');

  // Filters & Sorting for DevConnect Members
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('lang') || 'all');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'seniority' | 'availability'>('recent');
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const languagesList = [
    'TypeScript',
    'JavaScript',
    'Python',
    'Rust',
    'Go',
    'React',
    'Node.js',
    'PostgreSQL',
    'Docker',
  ];

  const experienceLevels: ExperienceLevel[] = ['Junior', 'Mid-Level', 'Senior', 'Lead', 'Architect'];

  // Switch tabs and update URL
  const handleTabChange = (tab: 'devconnect' | 'github') => {
    setActiveTab(tab);
    const newParams = new URLSearchParams(searchParams);
    if (tab === 'github') {
      newParams.set('tab', 'github');
    } else {
      newParams.delete('tab');
    }
    setSearchParams(newParams);
  };

  // Load DevConnect Platform Developers
  const loadDevelopers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          user_skills:user_skills (
            proficiency_level,
            skill:skill_id (name, category)
          )
        `)
        .order('created_at', { ascending: false });

      if (user) {
        query = query.neq('id', user.id);
      }

      if (selectedExperience !== 'all') {
        query = query.eq('experience_level', selectedExperience);
      }

      if (selectedAvailability !== 'all') {
        query = query.eq('availability_status', selectedAvailability);
      }

      let rawData: any[] = [];
      try {
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          rawData = data;
        }
      } catch (e) {
        console.warn('Using demo community profiles fallback:', e);
      }

      // Merge with 40 Demo Profiles, ensuring real users take precedence
      const existingIds = new Set(rawData.map((r: any) => r.id));
      const demoToAdd = DEMO_PROFILES.filter((dp) => !existingIds.has(dp.id));
      const combined = [...rawData, ...demoToAdd];

      let connectionMap: Record<string, { status: string; id: string }> = {};
      if (user) {
        try {
          const { data: conns } = await supabase
            .from('connections')
            .select('*')
            .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`);

          if (conns) {
            conns.forEach((c: any) => {
              const partnerId = c.requester_id === user.id ? c.receiver_id : c.requester_id;
              connectionMap[partnerId] = { status: c.status, id: c.id };
            });
          }
        } catch (e) {
          // ignore
        }
      }

      const mapped = combined.map((p: any) => {
        const skillsList = p.skillsList || (p.user_skills || []).map((us: any) => us.skill?.name).filter(Boolean);
        const conn = connectionMap[p.id];
        return {
          ...p,
          skillsList,
          isConnected: conn?.status === 'accepted',
          isPending: conn?.status === 'pending',
          connectionId: conn?.id,
        };
      });

      let filtered = mapped;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(
          (d: any) =>
            d.full_name?.toLowerCase().includes(q) ||
            d.username?.toLowerCase().includes(q) ||
            d.headline?.toLowerCase().includes(q) ||
            d.skillsList?.some((s: string) => s.toLowerCase().includes(q))
        );
      }

      if (selectedLanguage !== 'all') {
        filtered = filtered.filter((d: any) =>
          d.skillsList?.some((s: string) => s.toLowerCase() === selectedLanguage.toLowerCase())
        );
      }

      // Sorting
      if (sortBy === 'seniority') {
        const weight: Record<string, number> = { Architect: 5, Lead: 4, Senior: 3, 'Mid-Level': 2, Junior: 1 };
        filtered.sort((a, b) => (weight[b.experience_level] || 0) - (weight[a.experience_level] || 0));
      } else if (sortBy === 'availability') {
        filtered.sort((a, b) => (b.weekly_hours_available || 0) - (a.weekly_hours_available || 0));
      }

      setDevelopers(filtered);
    } catch (err: any) {
      console.error('Error discovering developers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load External GitHub Developers
  const loadExternalDevelopers = async () => {
    setLoadingExternal(true);
    try {
      const data = await githubService.getExternalDevelopers();
      setExternalDevs(data);
    } catch (err) {
      setExternalDevs(EXTERNAL_GITHUB_DEVELOPERS);
    } finally {
      setLoadingExternal(false);
    }
  };

  useEffect(() => {
    loadDevelopers();
    loadExternalDevelopers();
  }, [user, selectedExperience, selectedAvailability, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadDevelopers();
  };

  const handleConnectToggle = async (targetDev: any) => {
    if (!user) {
      toast({ title: 'Please sign in to connect with developers', type: 'info' });
      return;
    }

    setConnectingId(targetDev.id);
    try {
      if (targetDev.isConnected || targetDev.isPending) {
        if (targetDev.connectionId) {
          await supabase.from('connections').delete().eq('id', targetDev.connectionId);
        } else {
          await supabase
            .from('connections')
            .delete()
            .or(`and(requester_id.eq.${user.id},receiver_id.eq.${targetDev.id}),and(requester_id.eq.${targetDev.id},receiver_id.eq.${user.id})`);
        }

        toast({ title: 'Connection removed', type: 'info' });
        setDevelopers((prev) =>
          prev.map((d) =>
            d.id === targetDev.id ? { ...d, isConnected: false, isPending: false } : d
          )
        );
      } else {
        const { error } = await supabase.from('connections').insert({
          requester_id: user.id,
          receiver_id: targetDev.id,
          status: 'pending',
        });

        if (error) throw error;

        await supabase.from('notifications').insert({
          user_id: targetDev.id,
          sender_id: user.id,
          type: 'connection_request',
          title: 'New Connection Request',
          content: 'wants to connect with you on DevConnect.',
          data: { requester_id: user.id },
        });

        toast({ title: 'Connection request sent!', type: 'success' });
        setDevelopers((prev) =>
          prev.map((d) => (d.id === targetDev.id ? { ...d, isPending: true } : d))
        );
      }
    } catch (err: any) {
      toast({
        title: 'Connection action failed',
        description: err.message,
        type: 'error',
      });
    } finally {
      setConnectingId(null);
    }
  };

  // Filter external GitHub developers
  const filteredExternalDevs = externalDevs
    .filter((dev) => {
      const q = externalSearchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        dev.username.toLowerCase().includes(q) ||
        dev.name.toLowerCase().includes(q) ||
        (dev.bio && dev.bio.toLowerCase().includes(q)) ||
        (dev.company && dev.company.toLowerCase().includes(q)) ||
        (dev.location && dev.location.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (externalSortBy === 'followers') return b.followers - a.followers;
      if (externalSortBy === 'repos') return b.public_repos - a.public_repos;
      return 0;
    });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[rgba(167,139,250,0.20)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-[#C4B5FD] uppercase font-semibold flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-[#A855F7]" /> TALENT DIRECTORY
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F8F7FF] tracking-tight flex items-center gap-3">
            Engineering Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#B8ACD9] mt-1 max-w-3xl">
            Discover verified systems architects, full-stack builders, and prospective collaborators inside DevConnect.
          </p>
        </div>

        {/* Repositories Quick Nav */}
        <Link to="/repositories">
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-mono border-[rgba(167,139,250,0.25)] bg-[#100A24] text-[#F8F7FF] hover:bg-[#160E30] hover:border-[#8B5CF6]/50 shadow-sm transition-all"
          >
            <FolderGit2 className="w-3.5 h-3.5 mr-1.5 text-[#A855F7]" /> Community Repositories (40+)
          </Button>
        </Link>
      </div>

      {/* Directory Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#100A24]/90 border border-[rgba(167,139,250,0.20)] w-fit backdrop-blur-xl">
        <Link
          to="/developers"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono bg-[#8B5CF6]/25 text-[#F8F7FF] border border-[#8B5CF6]/40 shadow-[0_0_15px_rgba(139,92,246,0.25)]"
        >
          <Users className="w-3.5 h-3.5 text-[#C4B5FD]" />
          <span>DevConnect Engineers</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#100A24] border border-[rgba(167,139,250,0.20)] text-[#B8ACD9]">
            {developers.length}
          </span>
        </Link>

        <Link
          to="/github-developers"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono text-[#B8ACD9] hover:text-[#F8F7FF] hover:bg-[#160E30] transition-colors"
        >
          <Github className="w-3.5 h-3.5 text-emerald-400" />
          <span>GitHub Developers</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            {externalDevs.length} Public Stars
          </span>
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DEVCONNECT ENGINEERS                                               */}
      {/* ========================================================================= */}
      {activeTab === 'devconnect' && (
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <div className="p-4 sm:p-5 rounded-2xl border border-[rgba(167,139,250,0.20)] bg-[#160E30]/75 backdrop-blur-xl shadow-xl space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, @username, or technology (e.g. React, Rust, Python, Go)..."
                icon={<Search className="h-4 w-4 text-[#B8ACD9]" />}
                className="h-10 text-xs sm:text-sm bg-[#100A24] border-[rgba(167,139,250,0.20)] text-[#F8F7FF] placeholder-[#B8ACD9] focus:border-[#8B5CF6]"
              />
              <Button type="submit" variant="primary" className="h-10 px-6 font-semibold text-xs shadow-md shadow-[#8B5CF6]/25 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#7C3AED] hover:to-[#9333EA] text-[#F8F7FF]">
                Query Index
              </Button>
            </form>

            {/* Filter Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-1.5 text-[#B8ACD9] font-semibold font-mono text-[10px] tracking-wider uppercase">
                  <Filter className="h-3 w-3 text-[#A855F7]" /> FILTERS:
                </div>

                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="h-8 rounded-lg bg-[#100A24] border border-[rgba(167,139,250,0.20)] px-2.5 text-xs text-[#F8F7FF] focus:outline-none focus:border-[#8B5CF6] cursor-pointer font-mono"
                >
                  <option value="all">All Seniority</option>
                  {experienceLevels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  className="h-8 rounded-lg bg-[#100A24] border border-[rgba(167,139,250,0.20)] px-2.5 text-xs text-[#F8F7FF] focus:outline-none focus:border-[#8B5CF6] cursor-pointer font-mono"
                >
                  <option value="all">All Availability</option>
                  <option value="open_to_collaborate">Open to Collaborate</option>
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                </select>

                <div className="flex items-center gap-1 pl-2 border-l border-[rgba(167,139,250,0.20)]">
                  <ArrowUpDown className="h-3 w-3 text-[#B8ACD9]" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="h-8 rounded-lg bg-[#100A24] border border-[rgba(167,139,250,0.20)] px-2 text-xs text-[#F8F7FF] focus:outline-none focus:border-[#8B5CF6] cursor-pointer font-mono"
                  >
                    <option value="recent">Sort by: Recently Joined</option>
                    <option value="seniority">Sort by: Seniority</option>
                    <option value="availability">Sort by: Hours Available</option>
                  </select>
                </div>
              </div>

              {/* Quick Skill Filter Pills */}
              <div className="hidden xl:flex items-center gap-1 overflow-x-auto">
                <button
                  onClick={() => setSelectedLanguage('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all duration-200 ${
                    selectedLanguage === 'all'
                      ? 'bg-[#8B5CF6] text-[#080514] font-bold shadow-[0_0_12px_rgba(139,92,246,0.4)]'
                      : 'bg-[#100A24] text-[#B8ACD9] hover:text-[#F8F7FF] border border-[rgba(167,139,250,0.20)] hover:border-[#8B5CF6]/40'
                  }`}
                >
                  All Skills
                </button>
                {languagesList.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all duration-200 ${
                      selectedLanguage.toLowerCase() === lang.toLowerCase()
                        ? 'bg-[#8B5CF6] text-[#080514] font-bold shadow-[0_0_12px_rgba(139,92,246,0.4)]'
                        : 'bg-[#100A24] text-[#B8ACD9] hover:text-[#F8F7FF] border border-[rgba(167,139,250,0.20)] hover:border-[#8B5CF6]/40'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* DevConnect Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : developers.length === 0 ? (
            <div className="p-16 text-center border border-dashed border-[rgba(167,139,250,0.25)] rounded-2xl bg-[#100A24]/60 backdrop-blur-md">
              <Sparkles className="h-10 w-10 text-[#B8ACD9] mx-auto mb-3 opacity-60" />
              <h3 className="font-display text-base font-bold text-[#F8F7FF] mb-1">No Engineers Found</h3>
              <p className="text-xs text-[#B8ACD9] max-w-sm mx-auto mb-4">
                Try adjusting your query criteria or resetting filters to surface more peers.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLanguage('all');
                  setSelectedExperience('all');
                  setSelectedAvailability('all');
                  setSortBy('recent');
                  loadDevelopers();
                }}
                className="border-[rgba(167,139,250,0.25)] text-[#F8F7FF] hover:bg-[#8B5CF6]/15 hover:border-[#8B5CF6]/40 font-mono"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Reset Filters
              </Button>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {developers.map((dev) => (
                <div
                  key={dev.id}
                  className="h-full"
                >
                  <CardSpotlight className="h-full flex flex-col justify-between p-5 space-y-4 border-[rgba(167,139,250,0.20)] bg-[#160E30]/75 backdrop-blur-xl hover:border-[#8B5CF6]/50 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(139,92,246,0.18)] rounded-2xl transition-all duration-300 group">
                      <div>
                        {/* Top Status & GitHub Link */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono border border-[rgba(167,139,250,0.25)] bg-[#100A24]/90 text-[#B8ACD9] flex items-center gap-1.5 shadow-sm">
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  dev.availability_status === 'open_to_collaborate'
                                    ? 'bg-[#34D399] shadow-[0_0_6px_#34D399]'
                                    : dev.availability_status === 'available'
                                    ? 'bg-[#8B5CF6] shadow-[0_0_6px_#8B5CF6]'
                                    : 'bg-[#B8ACD9]'
                                }`}
                              />
                              {dev.availability_status.replace(/_/g, ' ')}
                            </span>
                            {dev.is_demo && (
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#D946EF]/15 border border-[#D946EF]/30 text-[#D946EF] font-semibold">
                                DEMO
                              </span>
                            )}
                          </div>

                          {dev.github_username && (
                            <a
                              href={`https://github.com/${dev.github_username}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-[#B8ACD9] hover:text-[#F8F7FF] hover:bg-[#8B5CF6]/20 transition-colors"
                              title={`github.com/${dev.github_username}`}
                            >
                              <Github className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>

                        {/* Developer Info */}
                        <Link to={`/profile/${dev.username}`} className="flex items-start gap-3 group/link">
                          <Avatar
                            src={dev.avatar_url}
                            name={dev.full_name}
                            size="lg"
                            status={dev.availability_status}
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-display font-bold text-sm text-[#F8F7FF] group-hover/link:text-[#C4B5FD] transition-colors truncate">
                              {dev.full_name}
                            </h4>
                            <p className="text-xs text-[#A855F7] font-mono">@{dev.username}</p>
                            <span className="text-[10px] text-[#B8ACD9] font-mono block mt-0.5 uppercase tracking-wide">
                              {dev.experience_level}
                            </span>
                          </div>
                        </Link>

                        {/* Headline & Bio */}
                        <p className="text-xs font-semibold text-[#F8F7FF] mt-3 line-clamp-1">
                          {dev.headline || 'Software Engineer'}
                        </p>
                        <p className="text-xs text-[#B8ACD9] mt-1 line-clamp-2 leading-relaxed">
                          {dev.bio || 'Building modern software and open-source projects on DevConnect.'}
                        </p>

                        {/* Professional Description: Current Goal */}
                        {dev.professional_description?.current_goals && (
                          <div className="mt-2.5 p-2 rounded-xl bg-[#100A24]/90 border border-[rgba(167,139,250,0.20)] text-[11px] text-[#B8ACD9] line-clamp-2 leading-relaxed font-sans">
                            <span className="font-mono text-[#A855F7] text-[10px] font-bold mr-1">FOCUS:</span>
                            {dev.professional_description.current_goals}
                          </div>
                        )}

                        {/* Metadata: Location & Hours */}
                        <div className="flex items-center gap-4 text-[11px] text-[#B8ACD9] font-mono mt-3">
                          {dev.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-[#B8ACD9]" /> {dev.location}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-[#A855F7]" /> {dev.weekly_hours_available}h/wk
                          </span>
                        </div>

                        {/* Technical Skills Pills */}
                        <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-[rgba(167,139,250,0.20)]">
                          {(dev.skillsList || []).slice(0, 4).map((sk) => (
                            <span
                              key={sk}
                              className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/15 border border-[rgba(167,139,250,0.25)] text-[#C4B5FD] font-mono"
                            >
                              {sk}
                            </span>
                          ))}
                          {(dev.skillsList || []).length > 4 && (
                            <span className="text-[10px] text-[#B8ACD9] font-mono px-1">
                              +{dev.skillsList!.length - 4}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions Footer */}
                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-[rgba(167,139,250,0.20)]">
                        <Link to={`/profile/${dev.username}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full text-xs font-semibold h-8 border-[rgba(167,139,250,0.25)] text-[#F8F7FF] hover:bg-[#8B5CF6]/20 hover:border-[#8B5CF6]/50 transition-all">
                            Dossier
                          </Button>
                        </Link>

                        <Button
                          variant={dev.isConnected ? 'outline' : dev.isPending ? 'secondary' : 'primary'}
                          size="sm"
                          disabled={connectingId === dev.id}
                          isLoading={connectingId === dev.id}
                          onClick={() => handleConnectToggle(dev)}
                          className={`flex-1 text-xs font-semibold h-8 ${
                            !dev.isConnected && !dev.isPending
                              ? 'bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#7C3AED] hover:to-[#9333EA] text-[#F8F7FF] shadow-sm shadow-[#8B5CF6]/30'
                              : 'border-[rgba(167,139,250,0.25)] text-[#F8F7FF]'
                          }`}
                        >
                          {dev.isConnected ? (
                            <span className="flex items-center gap-1 text-[#34D399]">
                              <UserCheck className="h-3.5 w-3.5" /> Connected
                            </span>
                          ) : dev.isPending ? (
                            <span className="flex items-center gap-1 text-[#C4B5FD]">
                              <Clock className="h-3.5 w-3.5" /> Pending
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <UserPlus className="h-3.5 w-3.5" /> Connect
                            </span>
                          )}
                        </Button>
                      </div>
                    </CardSpotlight>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: EXTERNAL GITHUB DEVELOPERS                                         */}
      {/* ========================================================================= */}
      {activeTab === 'github' && (
        <div className="space-y-6">
          {/* Disclaimer Banner */}
          <div className="p-4 sm:p-5 rounded-2xl border border-emerald-500/30 bg-[#160E30]/75 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-300">
                  Public GitHub Directory • External Open Source Profiles
                </h4>
                <p className="text-xs text-[#B8ACD9] mt-0.5 leading-relaxed">
                  These profiles represent real, publicly accessible GitHub creators and maintainers retrieved via the official GitHub REST API.
                  They are <span className="text-[#F8F7FF] font-semibold">not registered DevConnect accounts</span>. Click "Connect on GitHub" to open their actual profile.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.15)]">
                Official REST API Synced
              </span>
            </div>
          </div>

          {/* External Filter and Search Bar */}
          <div className="p-4 sm:p-5 rounded-2xl border border-[rgba(167,139,250,0.20)] bg-[#160E30]/75 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="flex-1 relative">
                <Input
                  value={externalSearchQuery}
                  onChange={(e) => setExternalSearchQuery(e.target.value)}
                  placeholder="Search real GitHub developers (e.g. torvalds, gaearon, yyx990803, shadcn, karpathy)..."
                  icon={<Search className="h-4 w-4 text-[#B8ACD9]" />}
                  className="h-10 text-xs sm:text-sm bg-[#100A24] border-[rgba(167,139,250,0.20)] text-[#F8F7FF] placeholder-[#B8ACD9] focus:border-[#8B5CF6]"
                />
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono text-[#B8ACD9] flex items-center gap-1">
                  <ArrowUpDown className="w-3 h-3 text-[#A855F7]" /> Sort:
                </span>
                <select
                  value={externalSortBy}
                  onChange={(e) => setExternalSortBy(e.target.value as any)}
                  className="h-10 rounded-xl bg-[#100A24] border border-[rgba(167,139,250,0.20)] px-3 text-xs text-[#F8F7FF] focus:outline-none focus:border-[#8B5CF6] cursor-pointer font-mono"
                >
                  <option value="followers">Most Followers</option>
                  <option value="repos">Most Public Repos</option>
                </select>
              </div>
            </div>
          </div>

          {/* External Developers Grid */}
          {loadingExternal ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredExternalDevs.length === 0 ? (
            <div className="p-16 text-center border border-dashed border-[rgba(167,139,250,0.25)] rounded-2xl bg-[#100A24]/60 backdrop-blur-md">
              <Github className="h-10 w-10 text-[#B8ACD9] mx-auto mb-3 opacity-60" />
              <h3 className="font-display text-base font-bold text-[#F8F7FF] mb-1">No GitHub Developers Found</h3>
              <p className="text-xs text-[#B8ACD9] max-w-sm mx-auto mb-4">
                Try searching for known handles like "torvalds", "gaearon", or "shadcn".
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExternalSearchQuery('')}
                className="border-[rgba(167,139,250,0.25)] text-[#F8F7FF] hover:bg-[#8B5CF6]/15 hover:border-[#8B5CF6]/40 font-mono"
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredExternalDevs.map((dev) => (
                <div key={dev.username} className="h-full">
                  <CardSpotlight className="h-full flex flex-col justify-between p-5 space-y-4 border-[rgba(167,139,250,0.20)] bg-[#160E30]/75 backdrop-blur-xl hover:border-[#8B5CF6]/50 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(139,92,246,0.18)] rounded-2xl transition-all duration-300 group">
                      <div>
                        {/* Top Badges */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5 shadow-sm">
                            <Github className="h-3 w-3" /> External GitHub Developer
                          </span>

                          <span className="text-[10px] font-mono text-[#B8ACD9] bg-[#100A24] px-2.5 py-0.5 rounded-full border border-[rgba(167,139,250,0.20)]">
                            ID: {dev.github_id}
                          </span>
                        </div>

                        {/* Developer Header Info */}
                        <div className="flex items-start gap-3">
                          <img
                            src={dev.avatar_url}
                            alt={dev.username}
                            className="w-12 h-12 rounded-xl border border-[rgba(167,139,250,0.25)] object-cover bg-[#100A24] shrink-0 shadow-md"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-display font-bold text-sm text-[#F8F7FF] group-hover:text-[#C4B5FD] transition-colors truncate">
                              {dev.name || dev.username}
                            </h4>
                            <a
                              href={dev.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#A855F7] font-mono hover:underline block truncate"
                            >
                              @{dev.username}
                            </a>
                            {dev.company && (
                              <span className="text-[10px] text-[#B8ACD9] font-mono block mt-0.5 truncate flex items-center gap-1">
                                <Building className="w-2.5 h-2.5 text-[#B8ACD9]" />
                                {dev.company}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bio */}
                        <p className="text-xs text-[#B8ACD9] mt-3 line-clamp-3 leading-relaxed">
                          {dev.bio || 'Public open-source developer on GitHub.'}
                        </p>

                        {/* Location */}
                        {dev.location && (
                          <div className="flex items-center gap-1 text-[11px] text-[#B8ACD9] font-mono mt-3">
                            <MapPin className="h-3 w-3 text-[#B8ACD9]" />
                            <span className="truncate">{dev.location}</span>
                          </div>
                        )}

                        {/* Metrics Bar: Repos & Followers */}
                        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[rgba(167,139,250,0.20)]">
                          <div className="p-2.5 rounded-xl bg-[#100A24]/90 border border-[rgba(167,139,250,0.20)]">
                            <div className="text-[9px] font-mono uppercase text-[#B8ACD9]">Public Repos</div>
                            <div className="text-sm font-bold font-display text-[#F8F7FF] mt-0.5">
                              {dev.public_repos.toLocaleString()}
                            </div>
                          </div>
                          <div className="p-2.5 rounded-xl bg-[#100A24]/90 border border-[rgba(167,139,250,0.20)]">
                            <div className="text-[9px] font-mono uppercase text-[#B8ACD9]">Followers</div>
                            <div className="text-sm font-bold font-display text-[#A855F7] mt-0.5">
                              {dev.followers >= 1000
                                ? `${(dev.followers / 1000).toFixed(1)}k`
                                : dev.followers.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Outlink Button: Connect on GitHub */}
                      <div className="pt-3 border-t border-[rgba(167,139,250,0.20)]">
                        <a
                          href={dev.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold bg-[#100A24] hover:bg-[#8B5CF6]/20 border border-[rgba(167,139,250,0.25)] hover:border-[#8B5CF6]/50 text-[#F8F7FF] hover:text-[#C4B5FD] transition-all group/btn shadow-sm"
                        >
                          <Github className="h-3.5 w-3.5" />
                          <span>Connect on GitHub</span>
                          <ExternalLink className="h-3 w-3 text-[#A855F7] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform ml-auto" />
                        </a>
                      </div>
                    </CardSpotlight>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
