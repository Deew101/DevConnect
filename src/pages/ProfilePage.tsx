import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Globe,
  Github,
  Mail,
  Clock,
  Calendar,
  Sparkles,
  Edit,
  UserPlus,
  UserCheck,
  MessageSquare,
  Award,
  Code2,
  FolderGit2,
  ExternalLink,
  Share2,
  Check,
  CheckCircle2,
  Flame,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Profile, UserSkill, Project, ConnectionStatus } from '@/types/database.types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { GitHubReposCard } from '@/components/github/GitHubReposCard';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { CardSpotlight } from '@/components/ui/CardSpotlight';
import { GridPattern } from '@/components/ui/GridPattern';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, profile: currentProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isOwner =
    (currentUser && profile?.id === currentUser.id) ||
    username === 'me' ||
    (currentProfile && username === currentProfile.username);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        let targetId = '';
        let fetchedProfile: Profile | null = null;

        if (username === 'me' || (currentUser && username === currentProfile?.username)) {
          fetchedProfile = currentProfile;
          targetId = currentUser?.id || '';
        } else {
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            username || ''
          );

          const query = supabase.from('profiles').select('*');
          const { data, error } = isUuid
            ? await query.eq('id', username).maybeSingle()
            : await query.eq('username', username).maybeSingle();

          if (error) throw error;
          fetchedProfile = data;
          targetId = data?.id || '';
        }

        if (!fetchedProfile) {
          setProfile(null);
          setLoading(false);
          return;
        }

        setProfile(fetchedProfile);

        // Fetch user skills
        const { data: skillsData } = await supabase
          .from('user_skills')
          .select(`
            *,
            skill:skill_id (name, category, icon)
          `)
          .eq('user_id', targetId);

        if (skillsData) setSkills(skillsData as any);

        // Fetch user projects
        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .eq('owner_id', targetId)
          .order('created_at', { ascending: false });

        if (projectsData) setProjects(projectsData as Project[]);

        // Check connection status
        if (currentUser && targetId !== currentUser.id) {
          const { data: conn } = await supabase
            .from('connections')
            .select('*')
            .or(
              `and(requester_id.eq.${currentUser.id},receiver_id.eq.${targetId}),and(requester_id.eq.${targetId},receiver_id.eq.${currentUser.id})`
            )
            .maybeSingle();

          if (conn) {
            setConnectionStatus(conn.status);
          } else {
            setConnectionStatus(null);
          }
        }
      } catch (err: any) {
        console.error('Error loading developer profile:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [username, currentUser, currentProfile]);

  const handleConnect = async () => {
    if (!currentUser || !profile) return;
    setActionLoading(true);
    try {
      if (connectionStatus === 'pending' || connectionStatus === 'accepted') {
        await supabase
          .from('connections')
          .delete()
          .or(
            `and(requester_id.eq.${currentUser.id},receiver_id.eq.${profile.id}),and(requester_id.eq.${profile.id},receiver_id.eq.${currentUser.id})`
          );

        setConnectionStatus(null);
        toast({ title: 'Connection removed', type: 'info' });
      } else {
        await supabase.from('connections').insert({
          requester_id: currentUser.id,
          receiver_id: profile.id,
          status: 'pending',
        });

        await supabase.from('notifications').insert({
          user_id: profile.id,
          sender_id: currentUser.id,
          type: 'connection_request',
          title: 'New Connection Request',
          content: 'sent you a connection request on DevConnect.',
          data: { requester_id: currentUser.id },
        });

        setConnectionStatus('pending');
        toast({ title: 'Connection request sent!', type: 'success' });
      }
    } catch (err: any) {
      toast({ title: 'Connection error', description: err.message, type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartMessage = async () => {
    if (!currentUser || !profile) return;
    try {
      const { data: convData, error } = await supabase
        .from('conversations')
        .insert({ type: 'direct' })
        .select()
        .single();

      if (error) throw error;

      await supabase.from('conversation_members').insert([
        { conversation_id: convData.id, user_id: currentUser.id },
        { conversation_id: convData.id, user_id: profile.id },
      ]);

      navigate('/messages');
    } catch (err: any) {
      toast({ title: 'Could not open conversation', description: err.message, type: 'error' });
    }
  };

  const handleCopyProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast({ title: 'Profile URL copied to clipboard', type: 'success' });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return <LoadingScreen message="Loading developer portfolio..." />;
  }

  if (!profile) {
    return (
      <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl max-w-lg mx-auto mt-16 bg-[#0c1017]">
        <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <Code2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Developer Not Found</h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          The requested developer profile does not exist or has been removed.
        </p>
        <Link to="/developers">
          <Button variant="primary">Discover Developers</Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto pb-12"
    >
      {/* Hero Profile Banner Card */}
      <div className="relative rounded-2xl border border-slate-800/80 bg-[#0c1017] shadow-2xl overflow-hidden">
        {/* Cover Graphic with Mesh & Grid Pattern */}
        <div className="h-44 sm:h-56 relative overflow-hidden bg-gradient-to-r from-cyan-950/40 via-[#0a0e17] to-indigo-950/40 border-b border-slate-800/70">
          <GridPattern className="opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0c1017]" />
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-24 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Quick share button in cover */}
          <div className="absolute top-4 right-4">
            <button
              onClick={handleCopyProfile}
              className="px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 backdrop-blur-md text-xs font-mono flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5 -mt-16 sm:-mt-20 mb-6">
            <div className="flex items-end gap-5">
              <div className="relative">
                <Avatar
                  src={profile.avatar_url}
                  name={profile.full_name}
                  size="xl"
                  status={profile.availability_status}
                  className="ring-4 ring-[#0c1017] shadow-2xl w-24 h-24 sm:w-28 sm:h-28 text-2xl"
                />
              </div>
              <div className="mb-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {profile.full_name}
                  </h1>
                  <Badge variant="cyan" className="text-[10px] font-mono capitalize">
                    {profile.experience_level}
                  </Badge>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {profile.availability_status?.replace(/_/g, ' ') || 'Available'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-cyan-400/90 font-mono mt-0.5">
                  @{profile.username}
                </p>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto self-end">
              {isOwner ? (
                <Link to="/profile/edit" className="w-full sm:w-auto">
                  <Button variant="primary" size="sm" className="w-full sm:w-auto text-xs font-semibold">
                    <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit Profile
                  </Button>
                </Link>
              ) : (
                <>
                  <Button
                    variant={connectionStatus === 'accepted' ? 'outline' : 'primary'}
                    size="sm"
                    isLoading={actionLoading}
                    onClick={handleConnect}
                    className="flex-1 sm:flex-none text-xs font-semibold"
                  >
                    {connectionStatus === 'accepted' ? (
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <UserCheck className="h-3.5 w-3.5" /> Connected
                      </span>
                    ) : connectionStatus === 'pending' ? (
                      <span className="flex items-center gap-1.5 text-amber-400">
                        <Clock className="h-3.5 w-3.5" /> Request Sent
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <UserPlus className="h-3.5 w-3.5" /> Connect
                      </span>
                    )}
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleStartMessage}
                    className="flex-1 sm:flex-none text-xs font-semibold"
                  >
                    <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Message
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Headline & Bio */}
          <div className="space-y-3 max-w-3xl">
            <h3 className="text-base font-semibold text-slate-100 tracking-tight">
              {profile.headline || 'Software Developer & Open Source Contributor'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {profile.bio || 'Building collaborative software and networking on DevConnect.'}
            </p>

            {/* Meta Tags Row */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-400 pt-3 border-t border-slate-800/80 font-mono">
              {profile.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" /> {profile.location}
                </span>
              )}
              {profile.website_url && (
                <a
                  href={profile.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-cyan-400 hover:underline"
                >
                  <Globe className="h-3.5 w-3.5" /> Portfolio <ArrowUpRight className="w-3 h-3" />
                </a>
              )}
              {profile.github_username && (
                <a
                  href={`https://github.com/${profile.github_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-slate-200 hover:text-cyan-400 transition-colors"
                >
                  <Github className="h-3.5 w-3.5" /> {profile.github_username}
                </a>
              )}
              <span className="flex items-center gap-1.5 text-emerald-400/90">
                <Clock className="h-3.5 w-3.5 text-emerald-400" /> {profile.weekly_hours_available || 15} hrs/wk available
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="h-3.5 w-3.5" /> Joined {formatDate(profile.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Technical Skills, Languages, Focus Areas */}
        <div className="space-y-6">
          {/* Technical Skills Card */}
          <Card className="border-slate-800/80 bg-[#0c1017] p-6 shadow-xl relative overflow-hidden">
            <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between border-b border-slate-800/60">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Code2 className="h-4 w-4 text-cyan-400" /> Technical Skills
              </CardTitle>
              {isOwner && (
                <Link to="/profile/edit" className="text-xs text-cyan-400 hover:underline font-mono">
                  Manage
                </Link>
              )}
            </CardHeader>

            <CardContent className="p-0 pt-4 space-y-2.5">
              {skills.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">No technical skills added yet.</p>
              ) : (
                skills.map((us) => (
                  <div
                    key={us.id}
                    className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs hover:border-slate-700/80 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-slate-200">{us.skill?.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono ml-2">
                        {us.years_of_experience} yrs
                      </span>
                    </div>
                    <Badge variant="cyan" className="text-[10px] py-0 px-2 font-mono">
                      {us.proficiency_level}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Collaboration Focus & Interests */}
          <Card className="border-slate-800/80 bg-[#0c1017] p-6 shadow-xl">
            <CardHeader className="p-0 pb-4 border-b border-slate-800/60">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-400" /> Collaboration Focus
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-4 space-y-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium block mb-2 font-mono text-[11px]">
                  AREAS OF INTEREST
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(profile.interests || []).map((interest) => (
                    <Badge key={interest} variant="secondary" className="text-[11px]">
                      {interest}
                    </Badge>
                  ))}
                  {(!profile.interests || profile.interests.length === 0) && (
                    <span className="text-slate-500 italic">No interests specified</span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/60">
                <span className="text-slate-400 font-medium block mb-1.5 font-mono text-[11px]">
                  COLLABORATION AVAILABILITY
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant="cyan" className="capitalize text-xs font-mono">
                    {profile.availability_status?.replace(/_/g, ' ') || 'Available'}
                  </Badge>
                  <span className="text-slate-500 font-mono text-xs">
                    ({profile.weekly_hours_available || 15} hours/week)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: GitHub Repositories & Collaborative Projects */}
        <div className="lg:col-span-2 space-y-6">
          {/* GitHub Repositories Section */}
          <GitHubReposCard
            githubUsername={profile.github_username}
            userId={profile.id}
            isOwner={Boolean(isOwner)}
          />

          {/* Linked Projects Showcase */}
          <Card className="border-slate-800/80 bg-[#0c1017] p-6 shadow-xl">
            <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between border-b border-slate-800/60">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <FolderGit2 className="h-4 w-4 text-cyan-400" /> Collaborative Projects
              </CardTitle>
              {isOwner && (
                <Link to="/projects/new">
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    + New Project
                  </Button>
                </Link>
              )}
            </CardHeader>

            <CardContent className="p-0 pt-4 space-y-3">
              {projects.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-500 border border-dashed border-slate-800/80 rounded-xl">
                  No projects created by this developer yet.
                </div>
              ) : (
                projects.map((proj) => (
                  <Link
                    key={proj.id}
                    to={`/projects/${proj.id}`}
                    className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-800/50 hover:border-slate-700/80 transition-all flex items-center justify-between group block"
                  >
                    <div className="space-y-1.5 pr-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-sm text-white group-hover:text-cyan-400 transition-colors">
                          {proj.title}
                        </h4>
                        <Badge variant="cyan" className="text-[10px] font-mono">
                          {proj.category}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] font-mono capitalize">
                          {proj.status?.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
                        {proj.tagline || proj.description}
                      </p>
                      {proj.required_skills && proj.required_skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {proj.required_skills.slice(0, 4).map((sk) => (
                            <span
                              key={sk}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
