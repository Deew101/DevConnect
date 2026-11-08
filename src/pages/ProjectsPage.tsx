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

export interface ProjectsPageProps {
  defaultFilter?: 'all' | 'my-projects' | 'my-teams' | 'saved';
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ defaultFilter }) => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('filter') || defaultFilter || 'all';

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
      if (activeTab === 'saved') {
        // If saved, show demo/starred subset
        list = list.slice(0, 3);
      } else if (user) {
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
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [user, activeTab, selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadProjects();
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'active':
        return <Badge variant="glow" dot>Active</Badge>;
      case 'planning':
        return <Badge variant="purple" dot>Planning</Badge>;
      case 'in_progress':
        return <Badge variant="cyan" dot>In Progress</Badge>;
      case 'completed':
        return <Badge variant="success" dot>Completed</Badge>;
      case 'paused':
        return <Badge variant="secondary">Paused</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(167,139,250,0.20)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono tracking-wider text-[#A855F7] uppercase font-semibold">
              Workspaces & Repositories
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
              className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-colors duration-200 ${
                isActive
                  ? 'text-[#F8F7FF]'
                  : 'text-[#B8ACD9] hover:text-[#F8F7FF] hover:bg-[#160E30]/60'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="projectsTabIndicator"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className="absolute inset-0 rounded-xl bg-[#8B5CF6]/25 border border-[#8B5CF6]/50 shadow-[0_0_12px_rgba(139,92,246,0.3)] z-0"
                />
              )}
              <tab.icon className={`w-3.5 h-3.5 relative z-10 ${isActive ? 'text-[#C4B5FD]' : 'text-[#B8ACD9]'}`} />
              <span className="relative z-10">{tab.label}</span>
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
                onClick={() => setSelectedCategory(cat === 'All Categories' ? 'all' : cat)}
                className={`whitespace-nowrap px-3 py-1 rounded-lg text-xs font-mono transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#8B5CF6] text-[#080514] font-bold shadow-[0_0_12px_rgba(139,92,246,0.4)]'
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
            <div key={i} className="h-64 rounded-2xl border border-[rgba(167,139,250,0.15)] bg-[#160E30]/60 animate-pulse p-6 space-y-4" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-[rgba(167,139,250,0.25)] rounded-2xl bg-[#100A24]/60 backdrop-blur-md">
          <Sparkles className="h-10 w-10 text-[#B8ACD9] mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-base font-bold text-[#F8F7FF] mb-1">No Projects Found</h3>
          <p className="text-xs text-[#B8ACD9] max-w-sm mx-auto mb-5 leading-relaxed">
            {activeTab === 'my-projects'
              ? "You haven't initiated any workspaces yet. Launch your vision into orbit."
              : 'No workspaces matched your stack query. Adjust filters or launch a new initiative.'}
          </p>
          <Link to="/projects/new">
            <Button variant="primary" size="sm" className="font-semibold text-xs bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-[#F8F7FF] shadow-sm">
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Start New Project
            </Button>
          </Link>
        </div>
      ) : (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.28 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: Math.min(idx * 0.045, 0.25),
                ease: [0.16, 1, 0.3, 1],
              }}
              className="h-full"
            >
              <CardSpotlight className="h-full flex flex-col justify-between p-5 space-y-4 border-[rgba(167,139,250,0.20)] bg-[#160E30]/75 backdrop-blur-xl hover:border-[#8B5CF6]/50 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(139,92,246,0.18)] rounded-2xl transition-all duration-300 group">
                <div>
                  {/* Top Status & Category */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#C4B5FD]">
                      {project.category}
                    </span>
                    {getStatusBadge(project.status)}
                  </div>

                  {/* Title & Description */}
                  <Link to={`/projects/${project.id}`} className="block group/link">
                    <h3 className="font-display font-bold text-base text-[#F8F7FF] group-hover/link:text-[#C4B5FD] transition-colors leading-snug">
                      {project.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-[#B8ACD9] mt-2 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Required Tech Stack Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-[rgba(167,139,250,0.15)]">
                    {project.required_skills?.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-[#100A24] border border-[rgba(167,139,250,0.20)] text-[#B8ACD9] font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                    {(project.required_skills?.length || 0) > 4 && (
                      <span className="text-[10px] text-[#B8ACD9] font-mono px-1">
                        +{(project.required_skills?.length || 0) - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer: Owner, Team count, Enter button */}
                <div className="flex items-center justify-between pt-3 border-t border-[rgba(167,139,250,0.20)]">
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={project.owner?.avatar_url}
                      name={project.owner?.full_name || project.owner?.username}
                      size="xs"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs text-[#B8ACD9] font-mono truncate max-w-[100px]">
                        @{project.owner?.username || 'engineer'}
                      </span>
                    </div>
                  </div>

                  <Link to={`/projects/${project.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-semibold h-8 border-[rgba(167,139,250,0.25)] text-[#F8F7FF] hover:bg-[#8B5CF6]/20 hover:border-[#8B5CF6]/50 group-hover:bg-gradient-to-r group-hover:from-[#8B5CF6] group-hover:to-[#A855F7] group-hover:text-[#F8F7FF] transition-all"
                    >
                      Enter Workspace <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardSpotlight>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ProjectsPage;
