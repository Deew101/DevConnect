import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  UserPlus,
  UserCheck,
  Check,
  Clock,
  Sparkles,
  MapPin,
  ExternalLink,
  Github,
} from 'lucide-react';
import { Profile, ExperienceLevel, AvailabilityStatus } from '@/types/database.types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';

export const DiscoveryPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [developers, setDevelopers] = useState<(Profile & { skillsList?: string[]; isConnected?: boolean; isPending?: boolean })[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('lang') || 'all');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
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
      // 1. Fetch profiles
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
        query = query.neq('id', user.id); // Don't show current user in discovery
      }

      if (selectedExperience !== 'all') {
        query = query.eq('experience_level', selectedExperience);
      }

      if (selectedAvailability !== 'all') {
        query = query.eq('availability_status', selectedAvailability);
      }

      const { data, error } = await query;
      if (error) throw error;

      // 2. Fetch connections state for current user
      let connectionMap: Record<string, { status: string; id: string }> = {};
      if (user) {
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
      }

      // Map profiles with parsed skills & connection statuses
      const mapped = (data || []).map((p: any) => {
        const skillsList = (p.user_skills || []).map((us: any) => us.skill?.name).filter(Boolean);
        const conn = connectionMap[p.id];
        return {
          ...p,
          skillsList,
          isConnected: conn?.status === 'accepted',
          isPending: conn?.status === 'pending',
          connectionId: conn?.id,
        };
      });

      // Filter by text search & language in memory for high responsiveness
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
  }, [user, selectedExperience, selectedAvailability]);

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
        // Disconnect or cancel request
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
        // Send connection request
        const { error } = await supabase.from('connections').insert({
          requester_id: user.id,
          receiver_id: targetDev.id,
          status: 'pending',
        });

        if (error) throw error;

        // Send notification
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Discover Developers
            <Badge variant="cyan" className="font-mono text-xs">
              {developers.length} Found
            </Badge>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Connect with skilled software engineers, open-source maintainers, and potential project teammates.
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl border border-slate-800 bg-[#0d1527]/90 shadow-xl space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, @username, or technology (e.g. React, Python, Go)..."
            icon={<Search className="h-4 w-4" />}
            className="h-11"
          />
          <Button type="submit" variant="primary" className="h-11 px-5 font-semibold text-xs">
            Search
          </Button>
        </form>

        {/* Filter Dropdowns & Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
            <Filter className="h-3.5 w-3.5" /> Filters:
          </div>

          {/* Experience level filter */}
          <select
            value={selectedExperience}
            onChange={(e) => setSelectedExperience(e.target.value)}
            className="h-9 rounded-lg bg-slate-900 border border-slate-700/80 px-3 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Experience Levels</option>
            {experienceLevels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>

          {/* Availability filter */}
          <select
            value={selectedAvailability}
            onChange={(e) => setSelectedAvailability(e.target.value)}
            className="h-9 rounded-lg bg-slate-900 border border-slate-700/80 px-3 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Availability</option>
            <option value="available">Available</option>
            <option value="open_to_collaborate">Open to Collaborate</option>
            <option value="busy">Busy</option>
          </select>

          {/* Language quick pills */}
          <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto ml-auto">
            <button
              onClick={() => setSelectedLanguage('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                selectedLanguage === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All Skills
            </button>
            {languagesList.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                  selectedLanguage.toLowerCase() === lang.toLowerCase()
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
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
        <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-[#0d1527]/50">
          <Sparkles className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Developers Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Try adjusting your search criteria or resetting filters to discover more developers.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedLanguage('all');
              setSelectedExperience('all');
              setSelectedAvailability('all');
              loadDevelopers();
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {developers.map((dev) => (
            <Card
              key={dev.id}
              className="border-slate-800 bg-[#0d1527]/90 hover:border-slate-700/80 transition-all flex flex-col justify-between overflow-hidden group shadow-xl"
            >
              <CardContent className="p-6 space-y-4">
                {/* Header with Avatar & Details */}
                <div className="flex items-start justify-between gap-3">
                  <Link to={`/profile/${dev.username}`} className="flex items-center gap-3 min-w-0">
                    <Avatar
                      src={dev.avatar_url}
                      name={dev.full_name}
                      size="lg"
                      status={dev.availability_status}
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-base text-white group-hover:text-cyan-400 transition-colors truncate">
                        {dev.full_name}
                      </h4>
                      <p className="text-xs text-cyan-400 font-mono">@{dev.username}</p>
                      <Badge variant="secondary" className="mt-1 text-[10px] font-mono">
                        {dev.experience_level}
                      </Badge>
                    </div>
                  </Link>

                  {dev.github_username && (
                    <a
                      href={`https://github.com/${dev.github_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="GitHub Profile"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                </div>

                {/* Headline & Bio */}
                <div>
                  <p className="text-xs font-medium text-slate-200 line-clamp-1">
                    {dev.headline || 'Software Engineer'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {dev.bio || 'Passionate software developer interested in modern web tech and collaborative engineering.'}
                  </p>
                </div>

                {/* Location & Weekly Availability */}
                <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
                  {dev.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-500" /> {dev.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-cyan-400" /> {dev.weekly_hours_available}h/wk
                  </span>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(dev.skillsList || []).slice(0, 4).map((sk) => (
                    <span
                      key={sk}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-mono"
                    >
                      {sk}
                    </span>
                  ))}
                  {(dev.skillsList || []).length > 4 && (
                    <span className="text-[10px] text-slate-500 font-mono px-1">
                      +{dev.skillsList!.length - 4} more
                    </span>
                  )}
                </div>
              </CardContent>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between gap-2">
                <Link to={`/profile/${dev.username}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                    View Profile
                  </Button>
                </Link>

                <Button
                  variant={dev.isConnected ? 'outline' : dev.isPending ? 'secondary' : 'primary'}
                  size="sm"
                  disabled={connectingId === dev.id}
                  isLoading={connectingId === dev.id}
                  onClick={() => handleConnectToggle(dev)}
                  className="flex-1 text-xs font-semibold"
                >
                  {dev.isConnected ? (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <UserCheck className="h-3.5 w-3.5" /> Connected
                    </span>
                  ) : dev.isPending ? (
                    <span className="flex items-center gap-1 text-amber-400">
                      <Clock className="h-3.5 w-3.5" /> Pending
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <UserPlus className="h-3.5 w-3.5" /> Connect
                    </span>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
