import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users2,
  Users,
  FolderGit2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Plus,
  Code2,
  Activity
} from 'lucide-react';
import { CardSpotlight } from '@/components/ui/CardSpotlight';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { DEMO_TEAMS, Team } from '@/data/demoCommunityData';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';

export const TeamsPage: React.FC = () => {
  const { toast } = useToast();
  const [teams, setTeams] = useState<Team[]>(DEMO_TEAMS);
  const [joinedTeamIds, setJoinedTeamIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadTeams() {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('*, members:team_members (*, profile:user_id (*))');

        if (!error && data && data.length > 0) {
          setTeams(data);
        } else {
          setTeams(DEMO_TEAMS);
        }
      } catch (err) {
        setTeams(DEMO_TEAMS);
      }
    }
    loadTeams();
  }, []);

  const handleJoinTeam = (teamName: string, teamId: string) => {
    if (joinedTeamIds.includes(teamId)) {
      toast({ title: `You are already a member of ${teamName}`, type: 'info' });
      return;
    }
    setJoinedTeamIds([...joinedTeamIds, teamId]);
    toast({
      title: 'Joined Collaborative Team!',
      description: `You have successfully joined ${teamName} as a Contributor.`,
      type: 'success'
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(167,139,250,0.20)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono tracking-widest text-[#C4B5FD] uppercase font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" /> COLLABORATIVE TEAMS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse shadow-[0_0_8px_#8B5CF6]" />
            <span className="text-xs font-mono text-[#B8ACD9]">
              {teams.length} Verified Engineering Teams
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-[#F8F7FF] tracking-tight">
            Collaborative Engineering Teams
          </h1>
          <p className="text-sm text-[#B8ACD9] mt-1 max-w-2xl leading-relaxed">
            Multi-disciplinary developer guilds shipping cohesive open-source initiatives. Join a squad or recruit specialists for your next release.
          </p>
        </div>

        <Badge variant="cyan" className="text-xs font-mono py-1.5 px-3 bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#C4B5FD]">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-[#A855F7]" /> Active Sprints Underway
        </Badge>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {teams.map((team) => {
          const isMember = joinedTeamIds.includes(team.id);
          return (
            <div
              key={team.id}
              className="h-full"
            >
              <CardSpotlight className="h-full flex flex-col justify-between overflow-hidden bg-[#160E30]/75 backdrop-blur-xl border border-[rgba(167,139,250,0.20)] hover:border-[#8B5CF6]/50 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(139,92,246,0.18)] rounded-2xl transition-all duration-300">
                <div className="space-y-5">
                  {/* Top banner / icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B5CF6]/25 to-[#D946EF]/25 border border-[#8B5CF6]/40 flex items-center justify-center text-[#C4B5FD] shadow-lg shadow-[#8B5CF6]/20">
                        <Users2 className="h-6 w-6 text-[#A855F7]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold font-display text-[#F8F7FF]">
                          {team.name}
                        </h3>
                        <span className="text-[11px] font-mono text-[#A855F7]">
                          {team.focus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#B8ACD9] leading-relaxed">
                    {team.description}
                  </p>

                  {/* Team Stats */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#100A24] border border-[rgba(167,139,250,0.20)] text-xs font-mono">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-[#B8ACD9] uppercase">Engineers</span>
                      <p className="text-sm font-bold text-[#F8F7FF]">{team.members.length} Members</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-[#B8ACD9] uppercase">Active Hubs</span>
                      <p className="text-sm font-bold text-[#D946EF]">{team.active_projects_count || 6} Projects</p>
                    </div>
                  </div>

                  {/* Members preview */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#B8ACD9] mb-2">
                      <span>Core Squad Roles</span>
                      <span>{team.members.length} devs</span>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 no-scrollbar">
                      {team.members.map((m) => (
                        <div
                          key={m.id || m.user_id}
                          className="flex items-center justify-between p-2 rounded-xl bg-[#100A24] border border-[rgba(167,139,250,0.15)] text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar
                              src={m.profile?.avatar_url}
                              name={m.profile?.full_name || 'Engineer'}
                              size="xs"
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold text-[#F8F7FF] text-[11px] truncate max-w-[120px]">
                                {m.profile?.full_name || 'Engineer'}
                              </span>
                              <span className="text-[9px] font-mono text-[#B8ACD9]">
                                @{m.profile?.username || 'developer'}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#8B5CF6]/15 border border-[rgba(167,139,250,0.25)] text-[#C4B5FD]">
                            {m.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="pt-4 mt-5 border-t border-[rgba(167,139,250,0.15)] flex items-center justify-between">
                  <Link to="/projects?filter=all">
                    <Button variant="secondary" size="xs" className="h-8 text-xs font-semibold border-[rgba(167,139,250,0.25)] bg-[#100A24] hover:bg-[#8B5CF6]/20 text-[#F8F7FF] transition-all">
                      <FolderGit2 className="h-3.5 w-3.5 mr-1 text-[#A855F7]" /> Projects
                    </Button>
                  </Link>

                  <Button
                    type="button"
                    variant={isMember ? 'outline' : 'primary'}
                    size="xs"
                    onClick={() => handleJoinTeam(team.name, team.id)}
                    className={`h-8 text-xs font-semibold ${
                      !isMember
                        ? 'bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#7C3AED] hover:to-[#9333EA] text-[#F8F7FF] shadow-sm shadow-[#8B5CF6]/25'
                        : 'border-[rgba(167,139,250,0.25)] text-[#F8F7FF]'
                    }`}
                  >
                    {isMember ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1 text-[#34D399]" /> Joined Team
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5 mr-1" /> Join Squad
                      </>
                    )}
                  </Button>
                </div>
              </CardSpotlight>
            </div>
          );
        })}
      </div>
    </div>
  );
};
