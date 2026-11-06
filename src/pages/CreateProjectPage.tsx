import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderGit2, ArrowLeft, Plus, X, Sparkles } from 'lucide-react';
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
        title: 'Project Created!',
        description: 'Your project workspace and Kanban board are ready.',
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
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Create Collaborative Project</h1>
          <p className="text-xs text-slate-400">
            Publish your project to recruit teammates and collaborate seamlessly.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-slate-800 bg-[#0d1527]/90 p-6 shadow-xl space-y-4">
          <CardTitle className="text-base font-bold text-white">Project Overview</CardTitle>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Task Orchestrator"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline</label>
            <Input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="A one-sentence summary of the vision"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-700/80 bg-slate-900/70 px-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Team Size
              </label>
              <Input
                type="number"
                min={2}
                max={15}
                value={teamSizeNeeded}
                onChange={(e) => setTeamSizeNeeded(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Description *</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the architecture, problem being solved, roadmap, and expectations..."
              rows={5}
              required
            />
          </div>
        </Card>

        {/* Required Skills for AI Teammate Matching */}
        <Card className="border-slate-800 bg-[#0d1527]/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <CardTitle className="text-base font-bold text-white">
              Required Technical Stack
            </CardTitle>
          </div>
          <p className="text-xs text-slate-400">
            Our AI matchmaking engine will evaluate candidates against these technical requirements.
          </p>

          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
            {availableSkills.slice(0, 24).map((sk) => {
              const isSelected = requiredSkills.includes(sk.name);
              return (
                <button
                  key={sk.id}
                  type="button"
                  onClick={() => handleToggleSkill(sk.name)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono border transition-all ${
                    isSelected
                      ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {isSelected && '✓ '}
                  {sk.name}
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Add Custom Skill (Press Enter)
            </label>
            <Input
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyDown={handleAddCustomSkill}
              placeholder="Type a technology and press Enter (e.g. WebRTC, Tailwind, Redis)"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {requiredSkills.map((sk) => (
              <span
                key={sk}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs"
              >
                {sk}
                <button
                  type="button"
                  onClick={() => handleToggleSkill(sk)}
                  className="text-slate-400 hover:text-rose-400"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </Card>

        {/* Links & Collaboration Requirements */}
        <Card className="border-slate-800 bg-[#0d1527]/90 p-6 shadow-xl space-y-4">
          <CardTitle className="text-base font-bold text-white">Repository & Collaboration</CardTitle>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Repo URL</label>
              <Input
                value={githubRepoUrl}
                onChange={(e) => setGithubRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repo"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Live Demo URL</label>
              <Input
                value={liveDemoUrl}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
                placeholder="https://myproject.dev"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Deadline (Optional)
              </label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Collaboration Commitment
              </label>
              <Input
                value={collaborationRequirements}
                onChange={(e) => setCollaborationRequirements(e.target.value)}
                placeholder="e.g. 5-10 hours/week, async on Discord"
              />
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" variant="glow" isLoading={saving} className="px-6 font-semibold">
            Create Project & Open Workspace
          </Button>
        </div>
      </form>
    </div>
  );
};
