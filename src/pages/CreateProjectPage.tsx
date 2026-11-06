import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderGit2, ArrowLeft, Plus, X, Sparkles, Layers, Calendar, Users, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/Toast';
import { Skill } from '@/types/database.types';

export const CreateProjectPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Application');
  const [teamSizeNeeded, setTeamSizeNeeded] = useState(3);
  const [deadline, setDeadline] = useState('');
  const [collaborationRequirements, setCollaborationRequirements] = useState('');
  const [githubRepoUrl, setGithubRepoUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');

  // Required skills selection
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [requiredSkills, setRequiredSkills] = useState<string[]>(['React', 'TypeScript']);
  const [customSkill, setCustomSkill] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSkills() {
      const { data } = await supabase.from('skills').select('*').order('name');
      if (data) setAvailableSkills(data);
    }
    loadSkills();
  }, []);

  const handleAddCustomSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customSkill.trim()) {
      e.preventDefault();
      if (!requiredSkills.includes(customSkill.trim())) {
        setRequiredSkills([...requiredSkills, customSkill.trim()]);
      }
      setCustomSkill('');
    }
  };

  const handleToggleSkill = (skillName: string) => {
    if (requiredSkills.includes(skillName)) {
      setRequiredSkills(requiredSkills.filter((s) => s !== skillName));
    } else {
      setRequiredSkills([...requiredSkills, skillName]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: 'Please sign in to create a project', type: 'error' });
      return;
    }

    if (!title.trim() || !description.trim()) {
      toast({ title: 'Title and description are required', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      const uniqueSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

      const { data, error } = await supabase
        .from('projects')
        .insert({
          owner_id: user.id,
          title: title.trim(),
          slug: uniqueSlug,
          tagline: tagline.trim() || null,
          description: description.trim(),
          category,
          status: 'planning',
          team_size_needed: Number(teamSizeNeeded) || 3,
          deadline: deadline ? new Date(deadline).toISOString() : null,
          collaboration_requirements: collaborationRequirements.trim() || null,
          github_repo_url: githubRepoUrl.trim() || null,
          live_demo_url: liveDemoUrl.trim() || null,
          required_skills: requiredSkills,
          is_published: true,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Project Workspace Initialized!',
        description: 'Your project repository, Kanban board, and channels are ready.',
        type: 'success',
      });

      navigate(`/projects/${data.id}`);
    } catch (err: any) {
      toast({
        title: 'Failed to create project',
        description: err.message,
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto space-y-6 pb-16"
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="p-2 h-9 w-9 rounded-lg"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Launch Collaborative Workspace
          </h1>
          <p className="text-xs text-slate-400">
            Publish your project vision, assemble engineering teammates, and coordinate deliverables.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-slate-800/80 bg-[#0c1017] p-6 shadow-xl space-y-4">
          <CardTitle className="text-sm font-bold text-white uppercase tracking-wider font-mono text-cyan-400">
            Project Overview
          </CardTitle>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
              Project Title *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Task Orchestrator & Edge Mesh"
              className="h-10 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
              Tagline
            </label>
            <Input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="A high-impact one-liner explaining the core value proposition"
              className="h-10 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-700/80 bg-slate-900/90 px-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="Web Application">Web Application</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Developer Tools">Developer Tools</option>
                <option value="Open Source Library">Open Source Library</option>
                <option value="Mobile Application">Mobile Application</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                Target Team Size
              </label>
              <Input
                type="number"
                min={2}
                max={15}
                value={teamSizeNeeded}
                onChange={(e) => setTeamSizeNeeded(Number(e.target.value))}
                className="h-10 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
              Full Architecture & Description *
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline the core problem, expected technical stack, roadmap sprints, and engineering culture..."
              rows={5}
              className="text-xs"
              required
            />
          </div>
        </Card>

        {/* Required Skills for AI Teammate Matching */}
        <Card className="border-slate-800/80 bg-[#0c1017] p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <CardTitle className="text-sm font-bold text-white uppercase tracking-wider font-mono text-cyan-400">
              Required Technical Stack (AI Matching)
            </CardTitle>
          </div>
          <p className="text-xs text-slate-400">
            Our AI matchmaking engine will rank and recommend developers based on their proficiency with these selected skills.
          </p>

          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1">
            {availableSkills.slice(0, 24).map((sk) => {
              const isSelected = requiredSkills.includes(sk.name);
              return (
                <button
                  key={sk.id}
                  type="button"
                  onClick={() => handleToggleSkill(sk.name)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400/80 text-cyan-200 font-semibold shadow-[0_0_8px_rgba(56,189,248,0.2)]'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {isSelected && '✓ '}
                  {sk.name}
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
              Add Custom Technology (Press Enter)
            </label>
            <Input
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyDown={handleAddCustomSkill}
              placeholder="e.g. WebRTC, GraphQL, Prisma, Redis, Docker"
              className="h-10 text-xs font-mono"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {requiredSkills.map((sk) => (
              <span
                key={sk}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-xs"
              >
                {sk}
                <button
                  type="button"
                  onClick={() => handleToggleSkill(sk)}
                  className="text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </Card>

        {/* Links & Collaboration Requirements */}
        <Card className="border-slate-800/80 bg-[#0c1017] p-6 shadow-xl space-y-4">
          <CardTitle className="text-sm font-bold text-white uppercase tracking-wider font-mono text-cyan-400">
            Repository & Collaboration Cadence
          </CardTitle>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                GitHub Repository URL
              </label>
              <Input
                value={githubRepoUrl}
                onChange={(e) => setGithubRepoUrl(e.target.value)}
                placeholder="https://github.com/organization/repo"
                className="h-10 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                Live Demo / Preview URL
              </label>
              <Input
                value={liveDemoUrl}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
                placeholder="https://preview.dev"
                className="h-10 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                Target Deadline (Optional)
              </label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="h-10 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                Collaboration Commitment
              </label>
              <Input
                value={collaborationRequirements}
                onChange={(e) => setCollaborationRequirements(e.target.value)}
                placeholder="e.g. 5-10 hours/week, async sprints on Discord"
                className="h-10 text-xs"
              />
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} className="h-10 text-xs">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="glow"
            isLoading={saving}
            className="px-6 font-semibold h-10 text-xs shadow-md shadow-cyan-500/20"
          >
            Create Workspace & Kanban Board
          </Button>
        </div>
      </form>
    </motion.div>
  );
};
