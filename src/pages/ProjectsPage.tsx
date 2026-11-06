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
} from 'lucide-react';
import { Project, ProjectStatus } from '@/types/database.types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate } from '@/lib/utils';

export const ProjectsPage: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const categories = [
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

      if (selectedCategory !== 'all') {
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
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
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
        return <Badge variant="success">Active</Badge>;
      case 'planning':
        return <Badge variant="cyan">Planning</Badge>;
      case 'completed':
        return <Badge variant="purple">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Project Hub & Workspaces
            <Badge variant="cyan" className="font-mono text-xs">
              {projects.length} Projects
            </Badge>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Discover collaborative builds, recruit teammates with AI matching, and manage work on Kanban boards.
          </p>
        </div>

        <Link to="/projects/new">
          <Button variant="glow" size="md" className="font-semibold text-xs sm:text-sm">
            <Plus className="h-4 w-4 mr-1.5" /> Start New Project
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl border border-slate-800 bg-[#0d1527]/90 shadow-xl space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, description or required skills (e.g. Next.js, Rust)..."
            icon={<Search className="h-4 w-4" />}
            className="h-11"
          />
          <Button type="submit" variant="primary" className="h-11 px-5 font-semibold text-xs">
            Search
          </Button>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
            <Filter className="h-3.5 w-3.5" /> Filter by:
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 rounded-lg bg-slate-900 border border-slate-700/80 px-3 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 rounded-lg bg-slate-900 border border-slate-700/80 px-3 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-2xl border border-slate-800 bg-[#0d1527]/50 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-[#0d1527]/50">
          <FolderGit2 className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Projects Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Try adjusting your search criteria or create your own collaborative project!
          </p>
          <Link to="/projects/new">
            <Button variant="primary">Create Project</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => {
            const isOwner = user && proj.owner_id === user.id;
            const isMember = user && proj.members?.some((m) => m.user_id === user.id);

            return (
              <Card
                key={proj.id}
                className="border-slate-800 bg-[#0d1527]/90 hover:border-slate-700/80 transition-all flex flex-col justify-between overflow-hidden group shadow-xl"
              >
                <CardContent className="p-6 space-y-4">
                  {/* Top: Category & Status */}
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px]">
                      {proj.category}
                    </Badge>
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
                  <div className="flex flex-wrap gap-1.5">
                    {(proj.required_skills || []).slice(0, 3).map((sk) => (
                      <span
                        key={sk}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-cyan-300 font-mono"
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

                  {/* Meta: Team size & deadline */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800/80">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-cyan-400" />
                      {proj.members?.length || 1} / {proj.team_size_needed} members
                    </span>

                    {proj.deadline && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        Due {formatDate(proj.deadline)}
                      </span>
                    )}
                  </div>
                </CardContent>

                {/* Footer Action */}
                <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={proj.owner?.avatar_url}
                      name={proj.owner?.full_name}
                      size="sm"
                      className="w-6 h-6 text-[10px]"
                    />
                    <span className="text-xs text-slate-400 font-mono truncate max-w-[100px]">
                      {proj.owner?.full_name || 'Owner'}
                    </span>
                  </div>

                  <Link to={`/projects/${proj.id}`}>
                    <Button variant="outline" size="sm" className="h-8 text-xs font-semibold">
                      {isMember || isOwner ? 'Open Workspace' : 'View Details'}{' '}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
