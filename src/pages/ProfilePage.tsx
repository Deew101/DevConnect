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
} from 'lucide-react';
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
          // Fetch by username or UUID
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

        // Fetch user projects (as owner or member)
        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .eq('owner_id', targetId)
          .order('created_at', { ascending: false });

        if (projectsData) setProjects(projectsData as Project[]);

        // Check connection status if viewing someone else's profile
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
        // Disconnect
        await supabase
          .from('connections')
          .delete()
          .or(
            `and(requester_id.eq.${currentUser.id},receiver_id.eq.${profile.id}),and(requester_id.eq.${profile.id},receiver_id.eq.${currentUser.id})`
          );

        setConnectionStatus(null);
        toast({ title: 'Connection removed', type: 'info' });
      } else {
        // Send request
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
      // Find or create direct conversation
      const { data: convData, error } = await supabase
        .from('conversations')
        .insert({ type: 'direct' })
        .select()
        .single();

      if (error) throw error;

      // Add both members
      await supabase.from('conversation_members').insert([
        { conversation_id: convData.id, user_id: currentUser.id },
        { conversation_id: convData.id, user_id: profile.id },
      ]);

      navigate('/messages');
    } catch (err: any) {
      toast({ title: 'Could not open conversation', description: err.message, type: 'error' });
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading developer portfolio..." />;
  }

  if (!profile) {
    return (
      <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl max-w-lg mx-auto mt-12 bg-[#0d1527]">
        <h3 className="text-xl font-bold text-white mb-2">Developer Not Found</h3>
        <p className="text-xs text-slate-400 mb-6">
          The requested developer profile does not exist or has been removed.
        </p>
        <Link to="/developers">
          <Button variant="primary">Discover Developers</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Profile Header Banner Card */}
      <div className="relative rounded-2xl border border-slate-800 bg-[#0d1527]/90 shadow-2xl overflow-hidden">
        {/* Cover gradient */}
        <div className="h-36 sm:h-48 bg-gradient-to-r from-cyan-900/60 via-slate-900 to-indigo-950/60 relative">
          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px]" />
        </div>

        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            <div className="flex items-end gap-4">
              <Avatar
                src={profile.avatar_url}
                name={profile.full_name}
                size="xl"
                status={profile.availability_status}
                className="ring-4 ring-[#0d1527] shadow-2xl"
              />
              <div className="mb-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  {profile.full_name}
                  <Badge variant="cyan" className="text-[10px] font-mono">
                    {profile.experience_level}
                  </Badge>
                </h1>
                <p className="text-xs sm:text-sm text-cyan-400 font-mono">@{profile.username}</p>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto self-end">
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
          <div className="space-y-3 pt-2 max-w-3xl">
            <h3 className="text-base font-semibold text-slate-100">
              {profile.headline || 'Software Developer & Open Source Contributor'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {profile.bio || 'Building collaborative projects on DevConnect.'}
            </p>

            {/* Metadata tags */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 font-mono">
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
                  <Globe className="h-3.5 w-3.5" /> Portfolio
                </a>
              )}
              {profile.github_username && (
                <a
                  href={`https://github.com/${profile.github_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-slate-200 hover:text-cyan-400"
                >
                  <Github className="h-3.5 w-3.5" /> github.com/{profile.github_username}
                </a>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-emerald-400" /> {profile.weekly_hours_available} hrs/week available
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="h-3.5 w-3.5" /> Joined {formatDate(profile.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Skills & Interests (1 col) */}
        <div className="space-y-6">
          {/* Technical Skills Card */}
          <Card className="border-slate-800 bg-[#0d1527]/90 p-6 shadow-xl">
            <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="h-4 w-4 text-cyan-400" /> Technical Skills
              </CardTitle>
              {isOwner && (
                <Link to="/profile/edit" className="text-xs text-cyan-400 hover:underline">
                  Manage
                </Link>
              )}
            </CardHeader>

            <CardContent className="p-0 space-y-3">
              {skills.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No skills listed yet.</p>
              ) : (
                skills.map((us) => (
                  <div
                    key={us.id}
                    className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-200">{us.skill?.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono ml-2">
                        {us.years_of_experience} yrs
                      </span>
                    </div>
                    <Badge variant="cyan" className="text-[10px] py-0 px-1.5">
                      {us.proficiency_level}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Interests & Collaboration Preferences */}
          <Card className="border-slate-800 bg-[#0d1527]/90 p-6 shadow-xl">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-400" /> Collaboration Focus
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium block mb-1.5">Interests:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(profile.interests || []).map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                  {(!profile.interests || profile.interests.length === 0) && (
                    <span className="text-slate-500 italic">No interests specified</span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-slate-400 font-medium block mb-1">Availability Status:</span>
                <Badge variant="cyan" className="capitalize">
                  {profile.availability_status.replace(/_/g, ' ')}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: GitHub Repos & Linked Projects (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* GitHub Repositories Section */}
          <GitHubReposCard
            githubUsername={profile.github_username}
            userId={profile.id}
            isOwner={Boolean(isOwner)}
          />

          {/* Linked Projects Card */}
          <Card className="border-slate-800 bg-[#0d1527]/90 p-6 shadow-xl">
            <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <FolderGit2 className="h-4 w-4 text-cyan-400" /> Collaborative Projects
              </CardTitle>
              {isOwner && (
                <Link to="/projects/new">
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    + New Project
                  </Button>
                </Link>
              )}
            </CardHeader>

            <CardContent className="p-0 space-y-3">
              {projects.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No projects created by this developer yet.
                </div>
              ) : (
                projects.map((proj) => (
                  <Link
                    key={proj.id}
                    to={`/projects/${proj.id}`}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/60 transition-all flex items-center justify-between group block"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-white group-hover:text-cyan-400 transition-colors">
                          {proj.title}
                        </h4>
                        <Badge variant="cyan" className="text-[10px]">
                          {proj.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {proj.tagline || proj.description}
                      </p>
                    </div>

                    <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
