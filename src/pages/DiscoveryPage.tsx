import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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

export const DiscoveryPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const [developers, setDevelopers] = useState<
    (Profile & { skillsList?: string[]; isConnected?: boolean; isPending?: boolean; connectionId?: string })[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting
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
      toast({
        title: 'Error loading developers',
        description: err.message,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevelopers();
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#273249]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-[#6D95FF] uppercase font-bold flex items-center gap-1.5">
              <Terminal className="h-3 w-3" /> TALENT INDEX // DIRECTORY 01
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F4F6FC] tracking-tight flex items-center gap-3">
            Engineering Directory
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-[#151F30] border border-[#273249] text-[#6D95FF] inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#35C98A] animate-pulse" />
              {developers.length} Verified
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#929DB2] mt-1">
            Discover verified systems architects, full-stack builders, and prospective collaborators.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-[#273249] bg-[#101725] shadow-xl space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, @username, or technology (e.g. React, Rust, Python, Go)..."
            icon={<Search className="h-4 w-4 text-[#929DB2]" />}
            className="h-10 text-xs sm:text-sm bg-[#151F30] border-[#273249] text-[#F4F6FC] placeholder-[#929DB2]"
          />
          <Button type="submit" variant="primary" className="h-10 px-6 font-semibold text-xs shadow-md shadow-[#6D95FF]/20">
            Query Index
          </Button>
        </form>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-[#929DB2] font-semibold font-mono text-[10px] tracking-wider uppercase">
              <Filter className="h-3 w-3 text-[#6D95FF]" /> FILTERS:
            </div>

            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="h-8 rounded-lg bg-[#151F30] border border-[#273249] px-2.5 text-xs text-[#F4F6FC] focus:outline-none focus:border-[#6D95FF]/60 cursor-pointer font-mono"
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
              className="h-8 rounded-lg bg-[#151F30] border border-[#273249] px-2.5 text-xs text-[#F4F6FC] focus:outline-none focus:border-[#6D95FF]/60 cursor-pointer font-mono"
            >
              <option value="all">All Availability</option>
              <option value="open_to_collaborate">Open to Collaborate</option>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
            </select>

            <div className="flex items-center gap-1 pl-2 border-l border-[#273249]">
              <ArrowUpDown className="h-3 w-3 text-[#929DB2]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-8 rounded-lg bg-[#151F30] border border-[#273249] px-2 text-xs text-[#F4F6FC] focus:outline-none focus:border-[#6D95FF]/60 cursor-pointer font-mono"
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
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                selectedLanguage === 'all'
                  ? 'bg-[#6D95FF] text-[#090C13] font-bold shadow-sm'
                  : 'bg-[#151F30] text-[#929DB2] hover:text-[#F4F6FC] border border-[#273249]'
              }`}
            >
              All Skills
            </button>
            {languagesList.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                  selectedLanguage.toLowerCase() === lang.toLowerCase()
                    ? 'bg-[#6D95FF] text-[#090C13] font-bold shadow-sm'
                    : 'bg-[#151F30] text-[#929DB2] hover:text-[#F4F6FC] border border-[#273249]'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Developers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : developers.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-[#273249] rounded-xl bg-[#101725]">
          <Sparkles className="h-10 w-10 text-[#929DB2] mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-base font-bold text-[#F4F6FC] mb-1">No Engineers Found</h3>
          <p className="text-xs text-[#929DB2] max-w-sm mx-auto mb-4">
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
            className="border-[#273249] text-[#F4F6FC] hover:bg-[#151F30] font-mono"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Reset Filters
          </Button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence>
            {developers.map((dev) => (
              <motion.div
                key={dev.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <CardSpotlight className="h-full flex flex-col justify-between p-5 space-y-4 border-[#273249] bg-[#151F30]">
                  <div>
                    {/* Top Status & GitHub Link */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-[#273249] bg-[#101725] text-[#929DB2] flex items-center gap-1.5">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              dev.availability_status === 'open_to_collaborate'
                                ? 'bg-[#35C98A]'
                                : dev.availability_status === 'available'
                                ? 'bg-[#6D95FF]'
                                : 'bg-[#929DB2]'
                            }`}
                          />
                          {dev.availability_status.replace(/_/g, ' ')}
                        </span>
                        {dev.is_demo && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                            DEMO
                          </span>
                        )}
                      </div>

                      {dev.github_username && (
                        <a
                          href={`https://github.com/${dev.github_username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-md text-[#929DB2] hover:text-[#F4F6FC] hover:bg-[#1C2940] transition-colors"
                          title={`github.com/${dev.github_username}`}
                        >
                          <Github className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>

                    {/* Developer Info */}
                    <Link to={`/profile/${dev.username}`} className="flex items-start gap-3 group">
                      <Avatar
                        src={dev.avatar_url}
                        name={dev.full_name}
                        size="lg"
                        status={dev.availability_status}
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-display font-bold text-sm text-[#F4F6FC] group-hover:text-[#6D95FF] transition-colors truncate">
                          {dev.full_name}
                        </h4>
                        <p className="text-xs text-[#6D95FF] font-mono">@{dev.username}</p>
                        <span className="text-[10px] text-[#929DB2] font-mono block mt-0.5 uppercase tracking-wide">
                          {dev.experience_level}
                        </span>
                      </div>
                    </Link>

                    {/* Headline & Bio */}
                    <p className="text-xs font-semibold text-[#F4F6FC] mt-3 line-clamp-1">
                      {dev.headline || 'Software Engineer'}
                    </p>
                    <p className="text-xs text-[#929DB2] mt-1 line-clamp-2 leading-relaxed">
                      {dev.bio || 'Building modern software and open-source projects on DevConnect.'}
                    </p>

                    {/* Professional Description: Current Goal */}
                    {dev.professional_description?.current_goals && (
                      <div className="mt-2.5 p-2 rounded-lg bg-[#101725] border border-[#273249]/60 text-[11px] text-[#929DB2] line-clamp-2 leading-relaxed font-sans">
                        <span className="font-mono text-[#6D95FF] text-[10px] font-bold mr-1">// FOCUS:</span>
                        {dev.professional_description.current_goals}
                      </div>
                    )}

                    {/* Metadata: Location & Hours */}
                    <div className="flex items-center gap-4 text-[11px] text-[#929DB2] font-mono mt-3">
                      {dev.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-[#929DB2]" /> {dev.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-[#6D95FF]" /> {dev.weekly_hours_available}h/wk
                      </span>
                    </div>

                    {/* Technical Skills Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-[#273249]">
                      {(dev.skillsList || []).slice(0, 4).map((sk) => (
                        <span
                          key={sk}
                          className="text-[10px] px-2 py-0.5 rounded bg-[#101725] border border-[#273249] text-[#F4F6FC] font-mono"
                        >
                          {sk}
                        </span>
                      ))}
                      {(dev.skillsList || []).length > 4 && (
                        <span className="text-[10px] text-[#929DB2] font-mono px-1">
                          +{dev.skillsList!.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#273249]">
                    <Link to={`/profile/${dev.username}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full text-xs font-semibold h-8 border-[#273249] text-[#F4F6FC] hover:bg-[#1C2940]">
                        Dossier
                      </Button>
                    </Link>

                    <Button
                      variant={dev.isConnected ? 'outline' : dev.isPending ? 'secondary' : 'primary'}
                      size="sm"
                      disabled={connectingId === dev.id}
                      isLoading={connectingId === dev.id}
                      onClick={() => handleConnectToggle(dev)}
                      className="flex-1 text-xs font-semibold h-8"
                    >
                      {dev.isConnected ? (
                        <span className="flex items-center gap-1 text-[#35C98A]">
                          <UserCheck className="h-3.5 w-3.5" /> Connected
                        </span>
                      ) : dev.isPending ? (
                        <span className="flex items-center gap-1 text-[#9D83FF]">
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
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
