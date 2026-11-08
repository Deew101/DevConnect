import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  MapPin,
  Globe,
  Github,
  Clock,
  Calendar,
  Sparkles,
  Edit,
  UserPlus,
  UserCheck,
  MessageSquare,
  Code2,
  FolderGit2,
  Share2,
  Check,
  ArrowUpRight,
  Terminal,
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
import { GridPattern } from '@/components/ui/GridPattern';
import { DEMO_PROFILES, DEMO_PROJECTS, FLAGSHIP_DEVANG_PROFILE } from '@/data/demoCommunityData';

export const ProfilePage: React.FC = () => {
  const { username: paramUsername } = useParams<{ username: string }>();
  const location = useLocation();
  const { user: currentUser, profile: currentProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Detect whether route is /profile/me or param is 'me' or missing
  const isMeRoute =
    location.pathname.endsWith('/profile/me') ||
    !paramUsername ||
    paramUsername === 'me';
  const username = isMeRoute ? 'me' : paramUsername;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isOwner =
    isMeRoute ||
    (currentUser && profile?.id === currentUser.id) ||
    (currentProfile && username?.toLowerCase() === currentProfile.username?.toLowerCase()) ||
    (currentUser?.user_metadata?.user_name &&
      username?.toLowerCase() === currentUser.user_metadata.user_name.toLowerCase()) ||
    (!currentUser &&
      (username === 'me' ||
        username?.toLowerCase() === 'devang' ||
        username?.toLowerCase() === 'deew101'));

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        let targetId = '';
        let fetchedProfile: Profile | null = null;

        // 1. Resolve logged-in user or "me"
        if (isMeRoute) {
          if (currentProfile) {
            fetchedProfile = currentProfile;
            targetId = currentProfile.id;
          } else if (currentUser) {
            // Attempt Supabase fetch
            try {
              const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentUser.id)
                .maybeSingle();
              if (data) {
                fetchedProfile = data;
                targetId = data.id;
              }
            } catch (e) {
              // ignore
            }

            // If not found in DB or error, synthesize from currentUser metadata
            if (!fetchedProfile) {
              const rawMeta = currentUser.user_metadata || {};
              const ghUser = rawMeta.user_name || rawMeta.preferred_username || '';
              const fullName =
                rawMeta.full_name ||
                rawMeta.name ||
                currentUser.email?.split('@')[0] ||
                'Devang';
              fetchedProfile = {
                id: currentUser.id,
                username: ghUser ? ghUser.toLowerCase() : 'devang',
                full_name: fullName,
                avatar_url: rawMeta.avatar_url || (ghUser ? `https://github.com/${ghUser}.png` : null),
                github_username: ghUser || 'Deew101',
                headline: ghUser
                  ? `Senior Software Engineer (@${ghUser})`
                  : 'Senior Full-Stack Architect',
                bio: 'Building software and open-source tooling on DevConnect.',
                location: 'Bengaluru, India',
                website_url: ghUser
                  ? `https://github.com/${ghUser}`
                  : 'https://deew101.github.io/DevConnect/',
                experience_level: 'Senior',
                availability_status: 'open_to_collaborate',
                weekly_hours_available: 15,
                interests: ['React', 'TypeScript', 'Distributed Systems', 'Open Source', 'Node.js'],
                is_onboarded: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              } as any;
              targetId = currentUser.id;
            }
          } else {
            // Guest or demo user on /profile/me
            fetchedProfile = FLAGSHIP_DEVANG_PROFILE;
            targetId = FLAGSHIP_DEVANG_PROFILE.id;
          }
        } else {
          // 2. Specific username requested
          const cleanUsername = (username || '').toLowerCase();

          // Check if it's the current user's profile
          if (
            currentUser &&
            (username === currentUser.id ||
              cleanUsername === currentProfile?.username?.toLowerCase() ||
              cleanUsername === (currentUser.user_metadata?.user_name || '').toLowerCase())
          ) {
            fetchedProfile = currentProfile || ({
              id: currentUser.id,
              username: cleanUsername,
              full_name: currentUser.user_metadata?.full_name || 'Devang',
              avatar_url: currentUser.user_metadata?.avatar_url,
              github_username: currentUser.user_metadata?.user_name || 'Deew101',
              headline: 'Senior Software Engineer',
              bio: 'Building software on DevConnect.',
              experience_level: 'Senior',
              availability_status: 'open_to_collaborate',
              weekly_hours_available: 15,
              interests: ['React', 'TypeScript', 'Node.js'],
              is_onboarded: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            } as any);
            targetId = currentUser.id;
          } else if (cleanUsername === 'devang' || cleanUsername === 'deew101') {
            fetchedProfile = FLAGSHIP_DEVANG_PROFILE;
            targetId = FLAGSHIP_DEVANG_PROFILE.id;
          } else {
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
              username || ''
            );

            try {
              if (isUuid) {
                const { data } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', username)
                  .maybeSingle();
                if (data) {
                  fetchedProfile = data;
                  targetId = data.id;
                }
              } else {
                const { data } = await supabase
                  .from('profiles')
                  .select('*')
                  .ilike('username', username || '')
                  .maybeSingle();
                if (data) {
                  fetchedProfile = data;
                  targetId = data.id;
                } else {
                  const { data: ghData } = await supabase
                    .from('profiles')
                    .select('*')
                    .ilike('github_username', username || '')
                    .maybeSingle();
                  if (ghData) {
                    fetchedProfile = ghData;
                    targetId = ghData.id;
                  }
                }
              }
            } catch (e) {
              // ignore
            }

            if (!fetchedProfile) {
              // Fallback to Demo Community Profiles
              const demoMatch = DEMO_PROFILES.find(
                (dp) =>
                  dp.username.toLowerCase() === cleanUsername ||
                  dp.id === username ||
                  (dp.github_username && dp.github_username.toLowerCase() === cleanUsername) ||
                  (dp.full_name && dp.full_name.toLowerCase() === cleanUsername)
              );
              if (demoMatch) {
                fetchedProfile = demoMatch;
                targetId = demoMatch.id;
              }
            }
          }
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

        if (skillsData && skillsData.length > 0) {
          setSkills(skillsData as any);
        } else if ((fetchedProfile as any)?.skillsList) {
          const fakeUserSkills = (fetchedProfile as any).skillsList.map((skName: string, i: number) => ({
            id: `usk-${i}`,
            user_id: targetId,
            skill_id: `sk-${i}`,
            proficiency_level: i === 0 ? 'Expert' : i < 3 ? 'Advanced' : 'Intermediate',
            years_of_experience: 3,
            created_at: new Date().toISOString(),
            skill: { id: `sk-${i}`, name: skName, category: 'language', icon: null, created_at: '' }
          }));
          setSkills(fakeUserSkills);
        } else if (Array.isArray((fetchedProfile as any)?.skills)) {
          const fakeUserSkills = (fetchedProfile as any).skills.map((skName: string, i: number) => ({
            id: `usk-${i}`,
            user_id: targetId,
            skill_id: `sk-${i}`,
            proficiency_level: i === 0 ? 'Expert' : i < 3 ? 'Advanced' : 'Intermediate',
            years_of_experience: 3,
            created_at: new Date().toISOString(),
            skill: { id: `sk-${i}`, name: skName, category: 'language', icon: null, created_at: '' }
          }));
          setSkills(fakeUserSkills as any);
        } else {
          const defaultSkills = ['React', 'TypeScript', 'Node.js', 'Go', 'Tailwind CSS'];
          const fakeUserSkills = defaultSkills.map((skName: string, i: number) => ({
            id: `usk-${i}`,
            user_id: targetId,
            skill_id: `sk-${i}`,
            proficiency_level: i === 0 ? 'Expert' : i < 3 ? 'Advanced' : 'Intermediate',
            years_of_experience: 3,
            created_at: new Date().toISOString(),
            skill: { id: `sk-${i}`, name: skName, category: 'language', icon: null, created_at: '' }
          }));
          setSkills(fakeUserSkills as any);
        }

        // Fetch user projects
        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .eq('owner_id', targetId)
          .order('created_at', { ascending: false });

        if (projectsData && projectsData.length > 0) {
          setProjects(projectsData as Project[]);
        } else {
          const demoUserProjects = DEMO_PROJECTS.filter((dp) => dp.owner_id === targetId);
          if (demoUserProjects.length > 0) {
            setProjects(demoUserProjects);
          } else if (isOwner || targetId === FLAGSHIP_DEVANG_PROFILE.id) {
            setProjects(DEMO_PROJECTS.slice(0, 3));
          } else {
            setProjects([]);
          }
        }

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
  }, [username, isMeRoute, currentUser, currentProfile]);

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
    return <LoadingScreen message="Accessing engineering dossier..." />;
  }

  if (!profile) {
    return (
      <div className="p-16 text-center border border-dashed border-[rgba(167,139,250,0.25)] rounded-2xl max-w-lg mx-auto mt-16 bg-[#100A24]/60 backdrop-blur-md font-sans">
        <div className="w-12 h-12 rounded-2xl bg-[#160E30] border border-[rgba(167,139,250,0.20)] flex items-center justify-center mx-auto mb-4 text-[#A855F7]">
          <Code2 className="w-6 h-6" />
        </div>
        <h3 className="font-display text-xl font-bold text-[#F8F7FF] mb-2">Record Not Found</h3>
        <p className="text-xs text-[#B8ACD9] mb-6 leading-relaxed">
          The requested developer profile does not exist or has been removed from the directory.
        </p>
        <Link to="/developers">
          <Button variant="primary" className="bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-[#F8F7FF]">
            Return to Directory
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto pb-12 font-sans"
    >
      {/* Editorial Hero Profile Banner Card */}
      <div className="relative rounded-2xl border border-[rgba(167,139,250,0.25)] bg-[#160E30]/85 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Cover Graphic with Mesh & Grid Pattern */}
        <div className="h-40 sm:h-48 relative overflow-hidden bg-gradient-to-r from-[#160E30] via-[#100A24] to-[#1E1442]">
          <GridPattern className="opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#160E30]/40 to-[#160E30]" />
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#8B5CF6]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-24 right-1/4 w-96 h-96 bg-[#D946EF]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Editorial Label & Quick Share button */}
          <div className="absolute top-4 left-6 hidden sm:flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#B8ACD9] uppercase">
            <span className="text-[10px] font-mono tracking-widest text-[#C4B5FD] uppercase font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" /> ENGINEER PROFILE
            </span>
          </div>

          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={handleCopyProfile}
              className="px-3 py-1.5 rounded-xl bg-[#100A24]/90 hover:bg-[#8B5CF6]/20 text-[#F8F7FF] border border-[rgba(167,139,250,0.25)] backdrop-blur-md text-xs font-mono flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#34D399]" />
                  <span className="text-[#34D399]">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#B8ACD9]" />
                  <span>Share Dossier</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5 -mt-14 sm:-mt-16 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              {/* Avatar with clean squircle frame */}
              <div className="relative flex-shrink-0">
                <Avatar
                  src={profile.avatar_url}
                  name={profile.full_name}
                  size="3xl"
                  status={profile.availability_status}
                  className="ring-4 ring-[#160E30] bg-[#160E30] shadow-2xl w-24 h-24 sm:w-28 sm:h-28 rounded-2xl"
                />
              </div>

              {/* Name, Badges, and Handle */}
              <div className="pb-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#FAF7FF] tracking-tight">
                    {profile.full_name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#8B5CF6]/15 text-[#C4B5FD] border border-[rgba(167,139,250,0.25)]">
                    {profile.experience_level}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#00E6A0]/10 text-[#00E6A0] border border-[#00E6A0]/25 shadow-[0_0_8px_rgba(0,230,160,0.15)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E6A0] animate-pulse" />
                    {profile.availability_status?.replace(/_/g, ' ') || 'Available'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#A855F7] font-mono mt-1 font-medium">
                  @{profile.username}
                </p>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto self-start sm:self-end sm:mb-1">
              {isOwner ? (
                <Link to="/profile/edit" className="w-full sm:w-auto">
                  <Button variant="primary" size="sm" className="w-full sm:w-auto text-xs font-semibold bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white shadow-md shadow-[#8B5CF6]/25 hover:brightness-110 transition-all">
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
                    className={`flex-1 sm:flex-none text-xs font-semibold ${
                      connectionStatus !== 'accepted' && connectionStatus !== 'pending'
                        ? 'bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white shadow-md shadow-[#8B5CF6]/25'
                        : 'border-[rgba(167,139,250,0.25)] text-[#F8F7FF]'
                    }`}
                  >
                    {connectionStatus === 'accepted' ? (
                      <span className="flex items-center gap-1.5 text-[#34D399]">
                        <UserCheck className="h-3.5 w-3.5" /> Connected
                      </span>
                    ) : connectionStatus === 'pending' ? (
                      <span className="flex items-center gap-1.5 text-[#C4B5FD]">
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
                    className="flex-1 sm:flex-none text-xs font-semibold border-[rgba(167,139,250,0.25)] bg-[#100A24] hover:bg-[#8B5CF6]/20 text-[#F8F7FF] transition-all"
                  >
                    <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-[#A855F7]" /> Message
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Headline & Bio */}
          <div className="space-y-2.5 max-w-3xl">
            <h2 className="font-display text-base font-bold text-[#FAF7FF] tracking-tight">
              {profile.headline || 'Software Developer & Open Source Contributor'}
            </h2>
            <p className="text-xs sm:text-sm text-[#B9A8D6] leading-relaxed whitespace-pre-line">
              {profile.bio || 'Building collaborative software and networking on DevConnect.'}
            </p>

            {/* Meta Tags Row */}
            <div className="flex flex-wrap items-center gap-y-2.5 gap-x-5 text-xs text-[#B9A8D6] pt-4 mt-4 border-t border-[rgba(167,139,250,0.20)] font-mono">
              {profile.github_username && (
                <a
                  href={`https://github.com/${profile.github_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#FAF7FF] hover:text-[#A855F7] transition-colors"
                >
                  <Github className="h-3.5 w-3.5 text-[#A855F7]" /> {profile.github_username}
                </a>
              )}
              {profile.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#B9A8D6]" /> {profile.location}
                </span>
              )}
              {profile.website_url && (
                <a
                  href={profile.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#A855F7] hover:underline"
                >
                  <Globe className="h-3.5 w-3.5" /> Portfolio <ArrowUpRight className="w-3 h-3" />
                </a>
              )}
              <span className="flex items-center gap-1.5 text-[#00E6A0]">
                <Clock className="h-3.5 w-3.5 text-[#00E6A0]" /> {profile.weekly_hours_available || 15} hrs/wk available
              </span>
              <span className="flex items-center gap-1.5 text-[#B9A8D6]">
                <Calendar className="h-3.5 w-3.5 text-[#B9A8D6]" /> Joined {formatDate(profile.created_at)}
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
          <Card className="border-[rgba(167,139,250,0.20)] bg-[#160E30]/75 backdrop-blur-xl p-6 shadow-xl relative overflow-hidden rounded-2xl">
            <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between border-b border-[rgba(167,139,250,0.15)]">
              <CardTitle className="font-display text-sm font-bold text-[#F8F7FF] flex items-center gap-2">
                <Code2 className="h-4 w-4 text-[#A855F7]" /> Technical Competencies
              </CardTitle>
              {isOwner && (
                <Link to="/profile/edit" className="text-xs text-[#A855F7] hover:underline font-mono">
                  Manage
                </Link>
              )}
            </CardHeader>

            <CardContent className="p-0 pt-4 space-y-2.5">
              {skills.length === 0 ? (
                <p className="text-xs text-[#B8ACD9] italic py-2">No technical competencies indexed yet.</p>
              ) : (
                skills.map((us) => (
                  <div
                    key={us.id}
                    className="p-2.5 rounded-xl bg-[#100A24] border border-[rgba(167,139,250,0.20)] flex items-center justify-between text-xs hover:border-[#8B5CF6]/50 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-[#F8F7FF]">{us.skill?.name}</span>
                      <span className="text-[10px] text-[#B8ACD9] font-mono ml-2">
                        {us.years_of_experience} yrs
                      </span>
                    </div>
                    <Badge variant="cyan" className="text-[10px] py-0 px-2 font-mono bg-[#8B5CF6]/15 text-[#C4B5FD] border-[#8B5CF6]/30">
                      {us.proficiency_level}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Collaboration Focus & Interests */}
          <Card className="border-[rgba(167,139,250,0.20)] bg-[#160E30]/75 backdrop-blur-xl p-6 shadow-xl rounded-2xl">
            <CardHeader className="p-0 pb-4 border-b border-[rgba(167,139,250,0.15)]">
              <CardTitle className="font-display text-sm font-bold text-[#F8F7FF] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#D946EF]" /> Collaboration Cadence
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-4 space-y-4 text-xs">
              <div>
                <span className="text-[#B8ACD9] font-medium block mb-2 font-mono text-[10px] uppercase tracking-wider">
                  AREAS OF SPECIALIZATION
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(profile.interests || []).map((interest) => (
                    <span
                      key={interest}
                      className="px-2.5 py-1 rounded-lg bg-[#100A24] border border-[rgba(167,139,250,0.20)] text-xs font-mono text-[#F8F7FF]"
                    >
                      {interest}
                    </span>
                  ))}
                  {(!profile.interests || profile.interests.length === 0) && (
                    <span className="text-[#B8ACD9] italic">No specializations specified</span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[rgba(167,139,250,0.15)]">
                <span className="text-[#B8ACD9] font-medium block mb-1.5 font-mono text-[10px] uppercase tracking-wider">
                  PROJECT COMMITMENT
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono capitalize bg-[#100A24] text-[#A855F7] border border-[rgba(167,139,250,0.20)]">
                    {profile.availability_status?.replace(/_/g, ' ') || 'Available'}
                  </span>
                  <span className="text-[#B8ACD9] font-mono text-xs">
                    ({profile.weekly_hours_available || 15} hours/week)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Professional Description, GitHub Repositories & Collaborative Projects */}
        <div className="lg:col-span-2 space-y-6">
          {/* Professional Profile & Collaboration Objectives */}
          <Card className="border-[rgba(167,139,250,0.20)] bg-[#160E30]/75 backdrop-blur-xl p-6 shadow-xl relative overflow-hidden rounded-2xl">
            <CardHeader className="p-0 pb-4 border-b border-[rgba(167,139,250,0.15)]">
              <CardTitle className="font-display text-sm font-bold text-[#F8F7FF] flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-[#A855F7]" /> Professional Dossier & Objectives
                </span>
                {(profile as any).is_demo && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    DEMO COMMUNITY PROFILE
                  </span>
                )}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0 pt-4 space-y-4 text-xs">
              {/* Bio summary */}
              <div>
                <span className="text-[10px] font-mono text-[#B8ACD9] uppercase tracking-wider block mb-1">
                  EXECUTIVE BIOGRAPHY
                </span>
                <p className="text-[#F8F7FF] leading-relaxed text-xs">
                  {(profile as any).professional_description?.bio || profile.bio || 'Building scalable applications and open-source software on DevConnect.'}
                </p>
              </div>

              {/* Current Goals */}
              {(profile as any).professional_description?.current_goals && (
                <div className="p-3.5 rounded-xl bg-[#100A24] border border-[rgba(167,139,250,0.20)]">
                  <span className="text-[10px] font-mono text-[#A855F7] uppercase font-bold tracking-wider block mb-1">
                    CURRENT ENGINEERING GOALS
                  </span>
                  <p className="text-[#F8F7FF] leading-relaxed text-xs">
                    {(profile as any).professional_description.current_goals}
                  </p>
                </div>
              )}

              {/* Collaboration Style & Target Projects */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {(profile as any).professional_description?.collaboration_style && (
                  <div className="p-3.5 rounded-xl bg-[#100A24] border border-[rgba(167,139,250,0.20)]">
                    <span className="text-[10px] font-mono text-[#D946EF] uppercase font-bold tracking-wider block mb-1">
                      COLLABORATION STYLE
                    </span>
                    <p className="text-[#B8ACD9] leading-relaxed text-xs">
                      {(profile as any).professional_description.collaboration_style}
                    </p>
                  </div>
                )}

                {Array.isArray((profile as any).professional_description?.target_projects) &&
                  (profile as any).professional_description.target_projects.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-[#100A24] border border-[rgba(167,139,250,0.20)]">
                      <span className="text-[10px] font-mono text-[#34D399] uppercase font-bold tracking-wider block mb-1">
                        TARGET PROJECT DOMAINS
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(profile as any).professional_description.target_projects.map((tp: string) => (
                          <span
                            key={tp}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[#160E30] border border-[rgba(167,139,250,0.20)] text-[#F8F7FF]"
                          >
                            {tp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>

          {/* GitHub Repositories Section */}
          <GitHubReposCard
            githubUsername={profile.github_username}
            userId={profile.id}
            isOwner={Boolean(isOwner)}
          />

          {/* Linked Projects Showcase */}
          <Card className="border-[rgba(167,139,250,0.20)] bg-[#160E30]/75 backdrop-blur-xl p-6 shadow-xl rounded-2xl">
            <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between border-b border-[rgba(167,139,250,0.15)]">
              <CardTitle className="font-display text-sm font-bold text-[#F8F7FF] flex items-center gap-2">
                <FolderGit2 className="h-4 w-4 text-[#A855F7]" /> Project Portfolio
              </CardTitle>
              {isOwner && (
                <Link to="/projects/new">
                  <Button variant="outline" size="sm" className="h-7 text-xs border-[rgba(167,139,250,0.25)] text-[#F8F7FF] font-mono hover:bg-[#8B5CF6]/20">
                    + New Project
                  </Button>
                </Link>
              )}
            </CardHeader>

            <CardContent className="p-0 pt-4 space-y-3">
              {projects.length === 0 ? (
                <div className="py-10 text-center text-xs text-[#B8ACD9] border border-dashed border-[rgba(167,139,250,0.25)] rounded-2xl bg-[#100A24]/60">
                  No collaborative projects indexed by this engineer yet.
                </div>
              ) : (
                projects.map((proj) => (
                  <Link
                    key={proj.id}
                    to={`/projects/${proj.id}`}
                    className="p-4 rounded-xl border border-[rgba(167,139,250,0.20)] bg-[#100A24] hover:bg-[#160E30] hover:border-[#8B5CF6]/50 transition-all flex items-center justify-between group block"
                  >
                    <div className="space-y-1.5 pr-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-display font-semibold text-sm text-[#F8F7FF] group-hover:text-[#C4B5FD] transition-colors">
                          {proj.title}
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#160E30] text-[#A855F7] border border-[rgba(167,139,250,0.20)]">
                          {proj.category}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono capitalize border border-[rgba(167,139,250,0.20)] text-[#B8ACD9]">
                          {proj.status?.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-[#B8ACD9] line-clamp-1 leading-relaxed">
                        {proj.tagline || proj.description}
                      </p>
                      {proj.required_skills && proj.required_skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {proj.required_skills.slice(0, 4).map((sk) => (
                            <span
                              key={sk}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#160E30] text-[#B8ACD9] border border-[rgba(167,139,250,0.20)]"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <ArrowUpRight className="h-4 w-4 text-[#B8ACD9] group-hover:text-[#A855F7] transition-colors flex-shrink-0" />
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
