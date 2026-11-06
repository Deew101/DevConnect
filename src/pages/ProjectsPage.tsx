import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

export const ProjectsPage: React.FC = () => {
  const { user } = useAuth();
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

      const { data, error } = await query;
      if (error) throw error;

      let list = data || [];
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
  }, [selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadProjects();
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'active':
      case 'in_progress':
        return <Badge variant="success">Active Sprint</Badge>;
      case 'planning':
        return <Badge variant="cyan">Planning</Badge>;
      case 'completed':
        return <Badge variant="purple">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono tracking-wider text-cyan-400 uppercase font-semibold">
              DevConnect Workspaces
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-xs font-mono text-slate-400">{projects.length} Active Hubs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Collaborative Projects
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Discover active engineering builds, recruit teammates via AI matchmaking, and coordinate on live Kanban boards.
          </p>
        </div>

        <Link to="/projects/new">
          <Button variant="glow" size="md" className="font-semibold text-xs sm:text-sm">
            <Plus className="h-4 w-4 mr-1.5" /> Start Project
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl border border-slate-800/80 bg-[#0c1017] shadow-xl space-y-3.5">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, stack keywords, or technologies (e.g. Supabase, Next.js, Rust)..."
            icon={<Search className="h-4 w-4" />}
            className="h-10 text-xs"
          />
          <Button type="submit" variant="primary" className="h-10 px-5 font-semibold text-xs">
            Search
          </Button>
        </form>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-slate-800/60">
          <span className="text-xs font-mono text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Stack:
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
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(56,189,248,0.15)]'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
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
              className="h-64 rounded-2xl border border-slate-800/80 bg-[#0c1017] animate-pulse"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-800/80 rounded-2xl bg-[#0c1017]">
          <FolderGit2 className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Projects Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5 leading-relaxed">
            No projects matched your filter criteria. Try resetting filters or launch your own collaborative initiative.
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
                <CardSpotlight className="h-full flex flex-col justify-between overflow-hidden group">
                  <div className="space-y-4">
                    {/* Top: Category & Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                        {proj.category}
                      </span>
                      {getStatusBadge(proj.status)}
                    </div>

                    {/* Title & Tagline */}
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {proj.tagline || proj.description}
                      </p>
                    </div>

                    {/* Skills Required */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(proj.required_skills || []).slice(0, 3).map((sk) => (
                        <span
                          key={sk}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/30 border border-cyan-800/40 text-cyan-300"
                        >
                          {sk}
                        </span>
                      ))}
                      {(proj.required_skills || []).length > 3 && (
                        <span className="text-[10px] text-slate-500 font-mono px-1">
                          +{proj.required_skills.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Team progress capacity bar */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-800/70">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-cyan-400" /> Team: {currentMembersCount} / {targetMembersCount}
                        </span>
                        <span>{teamFillPercent}% Full</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${teamFillPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 mt-4 border-t border-slate-800/70 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={proj.owner?.avatar_url}
                        name={proj.owner?.full_name}
                        size="sm"
                        className="w-6 h-6 text-[10px]"
                      />
                      <span className="text-xs text-slate-400 font-mono truncate max-w-[100px]">
                        {proj.owner?.full_name || 'Lead'}
                      </span>
                    </div>

                    <Link to={`/projects/${proj.id}`}>
                      <Button variant="outline" size="sm" className="h-7 text-xs font-semibold">
                        {isMember || isOwner ? 'Workspace' : 'Details'}{' '}
                        <ArrowRight className="h-3 w-3 ml-1" />
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
