import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardTitle } from '@/components/ui/Card';
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
      <div className="flex items-center gap-3 border-b border-[#273249]/60 pb-5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="p-2 h-9 w-9 rounded-lg border border-[#273249] text-[#929DB2] hover:text-[#F4F6FC] hover:bg-[#151F30]"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <div className="text-[10px] font-mono tracking-widest text-[#6D95FF] uppercase font-semibold mb-1">
            NEW PROJECT
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#F4F6FC] tracking-tight">
            Launch Collaborative Workspace
          </h1>
          <p className="text-xs text-[#929DB2] mt-0.5">
            Publish your project vision, assemble engineering teammates, and coordinate deliverables.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-[#273249] bg-[#101725] p-6 shadow-xl space-y-4">
          <CardTitle className="text-xs font-bold text-[#6D95FF] uppercase tracking-wider font-mono">
            // Project Overview
          </CardTitle>

          <div>
            <label className="block text-xs font-medium text-[#929DB2] mb-1.5 font-mono">
              Project Title *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Task Orchestrator & Edge Mesh"
              className="h-10 text-xs bg-[#151F30] border-[#273249] text-[#F4F6FC]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#929DB2] mb-1.5 font-mono">
              Tagline
            </label>
            <Input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="A high-impact one-liner explaining the core value proposition"
              className="h-10 text-xs bg-[#151F30] border-[#273249] text-[#F4F6FC]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#929DB2] mb-1.5 font-mono">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 rounded-lg border border-[#273249] bg-[#151F30] px-3 text-xs text-[#F4F6FC] focus:outline-none focus:border-[#6D95FF] font-mono cursor-pointer"
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
              <label className="block text-xs font-medium text-[#929DB2] mb-1.5 font-mono">
                Target Team Size
              </label>
              <Input
                type="number"
                min={2}
                max={15}
                value={teamSizeNeeded}
                onChange={(e) => setTeamSizeNeeded(Number(e.target.value))}
                className="h-10 text-xs font-mono bg-[#151F30] border-[#273249] text-[#F4F6FC]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#929DB2] mb-1.5 font-mono">
              Full Architecture & Description *
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline the core problem, expected technical stack, roadmap sprints, and engineering culture..."
              rows={5}
              className="text-xs bg-[#151F30] border-[#273249] text-[#F4F6FC]"
              required
            />
          </div>
        </Card>

        {/* Required Skills for AI Teammate Matching */}
        <Card className="border-[#273249] bg-[#101725] p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#6D95FF]" />
            <CardTitle className="text-xs font-bold text-[#6D95FF] uppercase tracking-wider font-mono">
              // Required Technical Stack (AI Matching)
            </CardTitle>
          </div>
          <p className="text-xs text-[#929DB2]">
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
                      ? 'bg-[#6D95FF]/20 border-[#6D95FF] text-[#F4F6FC] font-semibold'
                      : 'bg-[#151F30] border-[#273249] text-[#929DB2] hover:border-[#6D95FF]/40 hover:text-[#F4F6FC]'
                  }`}
                >
                  {isSelected && '✓ '}
                  {sk.name}
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#929DB2] mb-1.5 font-mono">
              Add Custom Technology (Press Enter)
            </label>
            <Input
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyDown={handleAddCustomSkill}
              placeholder="e.g. WebRTC, GraphQL, Prisma, Redis, Docker"
              className="h-10 text-xs font-mono bg-[#151F30] border-[#273249] text-[#F4F6FC]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {requiredSkills.map((sk) => (
              <span
                key={sk}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#151F30] border border-[#6D95FF]/30 text-[#6D95FF] font-mono text-xs"
              >
                {sk}
                <button
                  type="button"
                  onClick={() => handleToggleSkill(sk)}
                  className="text-[#929DB2] hover:text-rose-400 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </Card>

        {/* Links & Collaboration Requirements */}
        <Card className="border-[#273249] bg-[#101725] p-6 shadow-xl space-y-4">
          <CardTitle className="text-xs font-bold text-[#6D95FF] uppercase tracking-wider font-mono">
            // Repository & Collaboration Cadence
          </CardTitle>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#929DB2] mb-1.5 font-mono">
                GitHub Repository URL
              </label>
              <Input
                value={githubRepoUrl}
                onChange={(e) => setGithubRepoUrl(e.target.value)}
                placeholder="https://github.com/organization/repo"
                className="h-10 text-xs font-mono bg-[#151F30] border-[#273249] text-[#F4F6FC]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#929DB2] mb-1.5 font-mono">
                Live Demo / Preview URL
              </label>
              <Input
                value={liveDemoUrl}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
                placeholder="https://preview.dev"
                className="h-10 text-xs font-mono bg-[#151F30] border-[#273249] text-[#F4F6FC]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#929DB2] mb-1.5 font-mono">
                Target Deadline (Optional)
              </label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="h-10 text-xs font-mono bg-[#151F30] border-[#273249] text-[#F4F6FC]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#929DB2] mb-1.5 font-mono">
                Collaboration Commitment
              </label>
              <Input
                value={collaborationRequirements}
                onChange={(e) => setCollaborationRequirements(e.target.value)}
                placeholder="e.g. 5-10 hours/week, async sprints on Discord"
                className="h-10 text-xs bg-[#151F30] border-[#273249] text-[#F4F6FC]"
              />
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} className="h-10 text-xs border-[#273249] text-[#F4F6FC] bg-[#101725] hover:bg-[#151F30]">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={saving}
            className="px-6 font-semibold h-10 text-xs shadow-md shadow-[#6D95FF]/20"
          >
            Create Workspace & Kanban Board
          </Button>
        </div>
      </form>
    </motion.div>
  );
};
