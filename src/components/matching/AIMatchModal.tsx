import React, { useState, useEffect } from 'react';
import { Sparkles, Check, AlertCircle, UserPlus, ArrowRight, Brain, Cpu } from 'lucide-react';
import { Project, Profile, MatchRecommendation } from '@/types/database.types';
import { matchTeammatesForProject } from '@/services/matchingService';
import { supabase } from '@/lib/supabase';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';

interface AIMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onInviteSent?: () => void;
}

export const AIMatchModal: React.FC<AIMatchModalProps> = ({
  isOpen,
  onClose,
  project,
  onInviteSent,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<MatchRecommendation[]>([]);
  const [invitingId, setInvitingId] = useState<string | null>(null);
  const [invitedMap, setInvitedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isOpen) return;

    async function computeMatches() {
      setLoading(true);
      try {
        // Fetch candidates (exclude current project owner)
        const { data: profilesData, error } = await supabase
          .from('profiles')
          .select(`
            *,
            user_skills:user_skills (
              proficiency_level,
              skill:skill_id (name)
            )
          `)
          .neq('id', project.owner_id)
          .limit(20);

        if (error) throw error;

        // Map skills to string list
        const candidates = (profilesData || []).map((p: any) => ({
          ...p,
          skillsList: (p.user_skills || []).map((us: any) => us.skill?.name).filter(Boolean),
        }));

        const results = await matchTeammatesForProject(project, candidates);
        setMatches(results);
      } catch (err: any) {
        console.error('Error computing teammate matches:', err);
        toast({
          title: 'Matching computation error',
          description: err.message,
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    }

    computeMatches();
  }, [isOpen, project]);

  const handleSendInvite = async (candidateId: string) => {
    setInvitingId(candidateId);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be signed in to invite developers');

      const { error } = await supabase.from('project_invitations').insert({
        project_id: project.id,
        sender_id: user.id,
        receiver_id: candidateId,
        role: 'contributor',
        message: `Hi! Based on your matching profile and technical skills, we would love to collaborate with you on "${project.title}".`,
      });

      if (error) {
        // If invitation already exists or duplicate
        if (error.code === '23505') {
          toast({ title: 'Invitation already sent to this developer', type: 'info' });
        } else {
          throw error;
        }
      } else {
        toast({
          title: 'Invitation Sent!',
          description: 'The developer has been notified of your project invitation.',
          type: 'success',
        });

        // Also trigger notification record
        await supabase.from('notifications').insert({
          user_id: candidateId,
          sender_id: user.id,
          type: 'project_invite',
          title: `Invited to project: ${project.title}`,
          content: `${project.title} invited you to join as a contributor.`,
          data: { project_id: project.id },
        });
      }

      setInvitedMap((prev) => ({ ...prev, [candidateId]: true }));
      onInviteSent?.();
    } catch (err: any) {
      toast({
        title: 'Failed to send invite',
        description: err.message,
        type: 'error',
      });
    } finally {
      setInvitingId(null);
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge variant="success" className="text-xs px-2 py-0.5">{score}% Match</Badge>;
    if (score >= 60) return <Badge variant="cyan" className="text-xs px-2 py-0.5">{score}% Match</Badge>;
    return <Badge variant="warning" className="text-xs px-2 py-0.5">{score}% Match</Badge>;
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Intelligent Teammate Matchmaker"
      description={`Finding the best engineers for ${project.title}`}
      maxWidth="2xl"
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* Project requirements overview pill */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Target Tech Stack:</span>
            <div className="flex flex-wrap gap-1">
              {(project.required_skills || []).map((sk) => (
                <span key={sk} className="px-2 py-0.5 rounded-md bg-cyan-950/60 text-cyan-300 font-mono text-[11px] border border-cyan-800/40">
                  {sk}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span>Algorithm: Weighted Skill & Availability</span>
          </div>
        </div>

        {loading && (
          <div className="space-y-3 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))}
          </div>
        )}

        {!loading && matches.length === 0 && (
          <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl">
            <Sparkles className="h-10 w-10 text-slate-600 mx-auto mb-2" />
            <h4 className="font-semibold text-white text-sm">No Candidate Matches Yet</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              As more developers register and add their technical skills, DevConnect will automatically identify compatible teammates for your project.
            </p>
          </div>
        )}

        {!loading && matches.length > 0 && (
          <div className="space-y-3">
            {matches.map((match) => (
              <div
                key={match.developer.id}
                className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/60 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                      src={match.developer.avatar_url}
                      name={match.developer.full_name}
                      size="md"
                      status={match.developer.availability_status}
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-white truncate flex items-center gap-2">
                        {match.developer.full_name}
                        <span className="text-xs text-cyan-400 font-mono font-normal">
                          @{match.developer.username}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400 truncate">
                        {match.developer.headline || match.developer.experience_level}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {getScoreBadge(match.matchScore)}
                  </div>
                </div>

                {/* Compatibility Reasons */}
                <div className="bg-slate-950/60 rounded-lg p-2.5 text-xs text-slate-300 space-y-1">
                  {match.reasons.map((r, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {match.matchingSkills.map((sk) => (
                      <span
                        key={sk}
                        className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 font-mono border border-emerald-800/40"
                      >
                        ✓ {sk}
                      </span>
                    ))}
                    {match.missingSkills.map((sk) => (
                      <span
                        key={sk}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800/60 text-slate-500 font-mono"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>

                  <Button
                    variant={invitedMap[match.developer.id] ? 'outline' : 'primary'}
                    size="sm"
                    disabled={invitedMap[match.developer.id] || invitingId === match.developer.id}
                    isLoading={invitingId === match.developer.id}
                    onClick={() => handleSendInvite(match.developer.id)}
                    className="h-8 text-xs font-semibold"
                  >
                    {invitedMap[match.developer.id] ? (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Check className="h-3.5 w-3.5" /> Invited
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <UserPlus className="h-3.5 w-3.5" /> Invite Teammate
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Dialog>
  );
};
