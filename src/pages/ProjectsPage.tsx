import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FolderGit2,
  Plus,
  Search,
  Users,
  Calendar,
  Sparkles,
  GitBranch,
  ArrowRight,
  Filter,
  CheckCircle2,
  Flame,
  Layers,
  Compass,
  Bookmark,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Project, ProjectStatus } from '@/types/database.types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate } from '@/lib/utils';
import { CardSpotlight } from '@/components/ui/CardSpotlight';
import { DEMO_PROJECTS, DEMO_PROFILES } from '@/data/demoCommunityData';

export const ProjectsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('filter') || 'all';

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const categories = [
    'All Categories',
    'Web Application',
    'AI & Machine Learning',
    'Developer Tools',
    'Open Source Library',
    'Mobile Application',
    'Infrastructure',
  ];

  const loadProjects = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          owner:owner_id (id, username, full_name, avatar_url),
          members:project_members (id, user_id, role)
        `)
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all' && selectedCategory !== 'All Categories') {
        query = query.eq('category', selectedCategory);
      }

      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus);
      }

      let rawList: any[] = [];
      try {
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          rawList = data;
        }
      } catch (err) {
        console.warn('Using demo community projects fallback:', err);
      }

      // Enhance DEMO_PROJECTS with owner and member relationships from DEMO_PROFILES
      const enhancedDemoProjects = DEMO_PROJECTS.map((dp, i) => {
        const owner = DEMO_PROFILES.find((p) => p.id === dp.owner_id) || DEMO_PROFILES[0];
        const members = [
          { id: `mem-1-${i}`, user_id: owner.id, role: 'owner' as const },
          { id: `mem-2-${i}`, user_id: DEMO_PROFILES[(i + 1) % DEMO_PROFILES.length].id, role: 'lead' as const },
          { id: `mem-3-${i}`, user_id: DEMO_PROFILES[(i + 2) % DEMO_PROFILES.length].id, role: 'contributor' as const },
        ];
        return {
          ...dp,
          owner,
          members,
        };
      });

      const existingIds = new Set(rawList.map((p: any) => p.id));
      const demoToAdd = enhancedDemoProjects.filter((dp) => !existingIds.has(dp.id));
      let list = [...rawList, ...demoToAdd];

      // Filter by tab
      if (user) {
        if (activeTab === 'my-projects') {
          list = list.filter((p: any) => p.owner_id === user.id);
        } else if (activeTab === 'my-teams') {
          list = list.filter((p: any) => p.members?.some((m: any) => m.user_id === user.id));
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        list = list.filter(
          (p: any) =>
            p.title?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.required_skills?.some((sk: string) => sk.toLowerCase().includes(q))
        );
      }

      setProjects(list as any);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [selectedCategory, selectedStatus, activeTab, user]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadProjects();
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'active':
      case 'in_progress':
        return <Badge variant="success" className="text-[10px] font-mono">Active Sprint</Badge>;
      case 'planning':
        return <Badge variant="cyan" className="text-[10px] font-mono">Planning</Badge>;
      case 'completed':
        return <Badge variant="purple" className="text-[10px] font-mono">Completed</Badge>;
      default:
        return <Badge variant="secondary" className="text-[10px] font-mono">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(167,139,250,0.20)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono tracking-widest text-[#C4B5FD] uppercase font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" /> PROJECT WORKSPACES
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse shadow-[0_0_8px_#8B5CF6]" />
            <span className="text-xs font-mono text-[#B8ACD9]">{projects.length} Active Hubs</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-[#F8F7FF] tracking-tight">
            {activeTab === 'my-projects'
              ? 'My Created Projects'
              : activeTab === 'my-teams'
              ? 'My Collaborative Teams'
              : activeTab === 'saved'
              ? 'Saved Projects'
              : 'Engineering Workspaces'}
          </h1>
          <p className="text-sm text-[#B8ACD9] mt-1 font-sans max-w-2xl leading-relaxed">
            Discover active engineering builds, recruit teammates via AI matchmaking, and coordinate on live Kanban boards.
          </p>
        </div>

        <Link to="/projects/new">
          <Button variant="primary" size="md" className="font-semibold text-xs sm:text-sm bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#7C3AED] hover:to-[#9333EA] text-[#F8F7FF] shadow-lg shadow-[#8B5CF6]/25">
            <Plus className="h-4 w-4 mr-1.5" /> Start Project
          </Button>
        </Link>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-[rgba(167,139,250,0.20)] pb-3">
        {[
          { id: 'all', label: 'All Projects', icon: Compass },
          { id: 'my-projects', label: 'My Projects', icon: FolderGit2 },
          { id: 'my-teams', label: 'My Teams', icon: Users },
          { id: 'saved', label: 'Saved', icon: Bookmark },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'all') {
                  searchParams.delete('filter');
                  setSearchParams(searchParams);
                } else {
                  setSearchParams({ filter: tab.id });
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all duration-200 ${
                isActive
                  ? 'bg-[#8B5CF6]/25 text-[#F8F7FF] border border-[#8B5CF6]/40 shadow-[0_0_12px_rgba(139,92,246,0.25)]'
                  : 'text-[#B8ACD9] hover:text-[#F8F7FF] hover:bg-[#160E30]'
              }`}
            >
              <tab.icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C4B5FD]' : 'text-[#B8ACD9]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl border border-[rgba(167,139,250,0.20)] bg-[#160E30]/75 backdrop-blur-xl shadow-xl space-y-3.5">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, stack keywords, or technologies (e.g. Supabase, Next.js, Rust)..."
            icon={<Search className="h-4 w-4 text-[#B8ACD9]" />}
            className="h-10 text-xs bg-[#100A24] border-[rgba(167,139,250,0.20)] text-[#F8F7FF] placeholder-[#B8ACD9] focus:border-[#8B5CF6]"
          />
          <Button type="submit" variant="primary" className="h-10 px-5 font-semibold text-xs bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-[#F8F7FF] shadow-sm shadow-[#8B5CF6]/25">
            Search
          </Button>
        </form>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-[rgba(167,139,250,0.15)]">
          <span className="text-xs font-mono text-[#B8ACD9] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#A855F7]" /> Stack:
          </span>
          {categories.map((cat) => {
            const isSelected =
              (cat === 'All Categories' && (selectedCategory === 'all' || selectedCategory === 'All Categories')) ||
              selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat === 'All Categories' ? 'all' : cat)}
                className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#8B5CF6] text-[#080514] font-bold shadow-[0_0_12px_rgba(139,92,246,0.35)]'
                    : 'bg-[#100A24] text-[#B8ACD9] hover:text-[#F8F7FF] border border-[rgba(167,139,250,0.20)] hover:border-[#8B5CF6]/40'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl border border-[rgba(167,139,250,0.20)] bg-[#160E30]/50 animate-pulse"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-[rgba(167,139,250,0.25)] rounded-2xl bg-[#100A24]/60 backdrop-blur-md">
          <FolderGit2 className="h-12 w-12 text-[#B8ACD9]/40 mx-auto mb-3" />
          <h3 className="text-lg font-bold font-display text-[#F8F7FF] mb-1">No Projects Found</h3>
          <p className="text-xs text-[#B8ACD9] max-w-sm mx-auto mb-5 leading-relaxed">
            {activeTab === 'my-projects'
              ? "You haven't published any projects yet. Launch your vision today!"
              : activeTab === 'my-teams'
              ? "You haven't joined any team workspaces yet."
              : 'No projects matched your filter criteria. Try resetting filters or launch your own collaborative initiative.'}
          </p>
          <Link to="/projects/new">
            <Button variant="primary">Create Project</Button>
          </Link>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.05 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {projects.map((proj) => {
            const isOwner = user && proj.owner_id === user.id;
            const isMember = user && proj.members?.some((m) => m.user_id === user.id);
            const currentMembersCount = proj.members?.length || 1;
            const targetMembersCount = proj.team_size_needed || 4;
            const teamFillPercent = Math.min(
              100,
              Math.round((currentMembersCount / targetMembersCount) * 100)
            );

            return (
              <motion.div
                key={proj.id}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <CardSpotlight className="h-full flex flex-col justify-between overflow-hidden group bg-[#160E30]/75 backdrop-blur-xl border border-[rgba(167,139,250,0.20)] hover:border-[#8B5CF6]/50 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(139,92,246,0.18)] rounded-2xl transition-all duration-300">
                  <div className="space-y-4">
                    {/* Top: Category & Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/15 border border-[rgba(167,139,250,0.25)] text-[#C4B5FD]">
                        {proj.category}
                      </span>
                      {getStatusBadge(proj.status)}
                    </div>

                    {/* Title & Tagline */}
                    <div>
                      <h3 className="text-base font-bold font-display text-[#F8F7FF] group-hover:text-[#C4B5FD] transition-colors line-clamp-1">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-[#B8ACD9] mt-1 line-clamp-2 leading-relaxed">
                        {proj.tagline || proj.description}
                      </p>
                    </div>

                    {/* Skills Required */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(proj.required_skills || []).slice(0, 3).map((sk) => (
                        <span
                          key={sk}
                          className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#100A24] border border-[rgba(167,139,250,0.20)] text-[#C4B5FD]"
                        >
                          {sk}
                        </span>
                      ))}
                      {(proj.required_skills || []).length > 3 && (
                        <span className="text-[10px] text-[#B8ACD9] font-mono px-1">
                          +{proj.required_skills.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Team progress capacity bar */}
                    <div className="space-y-1.5 pt-2 border-t border-[rgba(167,139,250,0.15)]">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#B8ACD9]">
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-[#A855F7]" /> Team: {currentMembersCount} / {targetMembersCount}
                        </span>
                        <span>{teamFillPercent}% Full</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#100A24] rounded-full overflow-hidden border border-[rgba(167,139,250,0.20)]">
                        <div
                          className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-full transition-all duration-500"
                          style={{ width: `${teamFillPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 mt-4 border-t border-[rgba(167,139,250,0.15)] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={proj.owner?.avatar_url}
                        name={proj.owner?.full_name}
                        size="sm"
                        className="w-6 h-6 text-[10px]"
                      />
                      <span className="text-xs text-[#B8ACD9] font-mono truncate max-w-[100px]">
                        {proj.owner?.full_name || 'Lead'}
                      </span>
                    </div>

                    <Link to={`/projects/${proj.id}`}>
                      <Button variant="secondary" size="xs" className="h-7 text-xs font-semibold border-[rgba(167,139,250,0.25)] bg-[#100A24] hover:bg-[#8B5CF6]/20 text-[#F8F7FF] transition-all">
                        {isMember || isOwner ? 'Workspace' : 'Details'}{' '}
                        <ArrowRight className="h-3 w-3 ml-1 text-[#A855F7]" />
                      </Button>
                    </Link>
                  </div>
                </CardSpotlight>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
