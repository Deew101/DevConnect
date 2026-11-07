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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#273249]/60 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono tracking-widest text-[#6D95FF] uppercase font-bold">
              ORGANIZATIONS // COLLABORATIVE SQUADS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#6D95FF] animate-pulse" />
            <span className="text-xs font-mono text-[#929DB2]">
              {teams.length} Verified Engineering Teams
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-[#F4F6FC] tracking-tight">
            Collaborative Engineering Teams
          </h1>
          <p className="text-sm text-[#929DB2] mt-1 max-w-2xl leading-relaxed">
            Multi-disciplinary developer guilds shipping cohesive open-source initiatives. Join a squad or recruit specialists for your next release.
          </p>
        </div>

        <Badge variant="cyan" className="text-xs font-mono py-1.5 px-3">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-[#6D95FF]" /> Active Sprints Underway
        </Badge>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {teams.map((team, idx) => {
          const isMember = joinedTeamIds.includes(team.id);
          return (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <CardSpotlight className="h-full flex flex-col justify-between overflow-hidden bg-[#151F30] border-[#273249]">
                <div className="space-y-5">
                  {/* Top banner / icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6D95FF]/20 to-[#9D83FF]/20 border border-[#6D95FF]/30 flex items-center justify-center text-[#6D95FF] shadow-lg">
                        <Users2 className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold font-display text-[#F4F6FC]">
                          {team.name}
                        </h3>
                        <span className="text-[11px] font-mono text-[#6D95FF]">
                          {team.focus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#929DB2] leading-relaxed">
                    {team.description}
                  </p>

                  {/* Team Stats */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#101725] border border-[#273249] text-xs font-mono">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-[#929DB2] uppercase">Engineers</span>
                      <p className="text-sm font-bold text-[#F4F6FC]">{team.members.length} Members</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-[#929DB2] uppercase">Active Hubs</span>
                      <p className="text-sm font-bold text-[#6D95FF]">{team.active_projects_count || 6} Projects</p>
                    </div>
                  </div>

                  {/* Members preview */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#929DB2] mb-2">
                      <span>Core Squad Roles</span>
                      <span>{team.members.length} devs</span>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 no-scrollbar">
                      {team.members.map((m) => (
                        <div
                          key={m.id || m.user_id}
                          className="flex items-center justify-between p-2 rounded-lg bg-[#101725] border border-[#273249]/60 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar
                              src={m.profile?.avatar_url}
                              name={m.profile?.full_name || 'Engineer'}
                              size="xs"
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold text-[#F4F6FC] text-[11px] truncate max-w-[120px]">
                                {m.profile?.full_name || 'Engineer'}
                              </span>
                              <span className="text-[9px] font-mono text-[#929DB2]">
                                @{m.profile?.username || 'developer'}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#151F30] border border-[#273249] text-[#6D95FF]">
                            {m.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="pt-4 mt-5 border-t border-[#273249]/60 flex items-center justify-between">
                  <Link to="/projects?filter=all">
                    <Button variant="secondary" size="xs" className="h-8 text-xs font-semibold border-[#273249] bg-[#101725]">
                      <FolderGit2 className="h-3.5 w-3.5 mr-1 text-[#6D95FF]" /> Projects
                    </Button>
                  </Link>

                  <Button
                    type="button"
                    variant={isMember ? 'outline' : 'primary'}
                    size="xs"
                    onClick={() => handleJoinTeam(team.name, team.id)}
                    className="h-8 text-xs font-semibold"
                  >
                    {isMember ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" /> Joined Team
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5 mr-1" /> Join Squad
                      </>
                    )}
                  </Button>
                </div>
              </CardSpotlight>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
