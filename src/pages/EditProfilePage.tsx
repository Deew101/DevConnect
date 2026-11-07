import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Plus, X, Upload, Code2, Sparkles, Compass, Target, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardTitle } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { useToast } from '@/components/ui/Toast';
import { ExperienceLevel, AvailabilityStatus, Skill } from '@/types/database.types';
import { AvatarSelector } from '@/components/avatar/AvatarSelector';

export const EditProfilePage: React.FC = () => {
  const { profile, user, refreshProfile, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [headline, setHeadline] = useState(profile?.headline || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [websiteUrl, setWebsiteUrl] = useState(profile?.website_url || '');
  const [githubUsername, setGithubUsername] = useState(profile?.github_username || '');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(profile?.experience_level || 'Mid-Level');
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>(profile?.availability_status || 'open_to_collaborate');
  const [weeklyHours, setWeeklyHours] = useState(profile?.weekly_hours_available || 10);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [interests, setInterests] = useState<string[]>(profile?.interests || []);
  const [interestInput, setInterestInput] = useState('');

  // Professional Description & Collaboration Goals
  const [currentGoals, setCurrentGoals] = useState(
    (profile as any)?.professional_description?.current_goals || ''
  );
  const [collaborationStyle, setCollaborationStyle] = useState(
    (profile as any)?.professional_description?.collaboration_style || ''
  );
  const [targetProjects, setTargetProjects] = useState(
    Array.isArray((profile as any)?.professional_description?.target_projects)
      ? (profile as any)?.professional_description?.target_projects.join(', ')
      : ''
  );

  // Skills
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [userSkillIds, setUserSkillIds] = useState<string[]>([]);
  const [selectedSkillToAdd, setSelectedSkillToAdd] = useState('');

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    async function loadSkills() {
      const { data: allSkills } = await supabase.from('skills').select('*').order('name');
      if (allSkills) setAvailableSkills(allSkills);

      if (user) {
        const { data: mySkills } = await supabase
          .from('user_skills')
          .select('skill_id')
          .eq('user_id', user.id);
        if (mySkills) setUserSkillIds(mySkills.map((s: any) => s.skill_id));
      }
    }

    loadSkills();
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('profile-avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(urlData.publicUrl);
      toast({ title: 'Avatar uploaded successfully!', type: 'success' });
    } catch (err: any) {
      toast({ title: 'Avatar upload failed', description: err.message, type: 'error' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAddInterest = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && interestInput.trim()) {
      e.preventDefault();
      if (!interests.includes(interestInput.trim())) {
        setInterests([...interests, interestInput.trim()]);
      }
      setInterestInput('');
    }
  };

  const handleRemoveInterest = (item: string) => {
    setInterests(interests.filter((i) => i !== item));
  };

  const handleAddSkill = async () => {
    if (!selectedSkillToAdd || !user) return;
    if (userSkillIds.includes(selectedSkillToAdd)) return;

    try {
      await supabase.from('user_skills').insert({
        user_id: user.id,
        skill_id: selectedSkillToAdd,
        proficiency_level: 'Intermediate',
        years_of_experience: 1,
      });

      setUserSkillIds([...userSkillIds, selectedSkillToAdd]);
      setSelectedSkillToAdd('');
      toast({ title: 'Skill added', type: 'success' });
    } catch (err: any) {
      toast({ title: 'Failed to add skill', description: err.message, type: 'error' });
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    if (!user) return;
    try {
      await supabase
        .from('user_skills')
        .delete()
        .eq('user_id', user.id)
        .eq('skill_id', skillId);

      setUserSkillIds(userSkillIds.filter((id) => id !== skillId));
      toast({ title: 'Skill removed', type: 'info' });
    } catch (err: any) {
      toast({ title: 'Failed to remove skill', description: err.message, type: 'error' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const updates = {
        full_name: fullName.trim(),
        username: username.trim().toLowerCase(),
        headline: headline.trim(),
        bio: bio.trim(),
        location: location.trim() || null,
        website_url: websiteUrl.trim() || null,
        github_username: githubUsername.trim().replace(/^@/, '') || null,
        experience_level: experienceLevel,
        availability_status: availabilityStatus,
        weekly_hours_available: Number(weeklyHours) || 10,
        avatar_url: avatarUrl || null,
        interests,
        is_onboarded: true,
        professional_description: {
          bio: bio.trim(),
          technical_interests: interests,
          current_goals: currentGoals.trim(),
          collaboration_style: collaborationStyle.trim(),
          target_projects: targetProjects.split(',').map((s: string) => s.trim()).filter(Boolean)
        }
      };

      const { error } = await updateProfile(updates);
      if (error) throw error;

      await refreshProfile();
      toast({ title: 'Profile updated successfully!', type: 'success' });
      navigate(`/profile/${updates.username}`);
    } catch (err: any) {
      toast({
        title: 'Error updating profile',
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
      className="max-w-4xl mx-auto space-y-6 pb-16"
    >
      <div className="flex items-center justify-between border-b border-[#273249]/60 pb-5">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2 h-9 w-9 rounded-lg border border-[#273249] text-[#929DB2] hover:text-[#F4F6FC] hover:bg-[#151F30]"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="text-[10px] font-mono tracking-widest text-[#6D95FF] uppercase font-bold mb-1">
              ARCHIVE // PROFILE METADATA
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#F4F6FC] tracking-tight">
              Edit Developer Profile
            </h1>
            <p className="text-xs text-[#929DB2] mt-0.5">
              Customize your developer identity, skill endorsements, and collaboration availability.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <Card className="border-[#273249] bg-[#101725] p-6 shadow-xl space-y-5">
          <CardTitle className="text-xs font-bold text-[#6D95FF] uppercase tracking-wider font-mono">
            // General Information
          </CardTitle>

          {/* Avatar Identity Options */}
          <div className="flex items-center gap-5 pt-1">
            <Avatar src={avatarUrl} name={fullName} size="xl" className="ring-2 ring-[#6D95FF]/30" />
            <div>
              <label className="block text-xs font-semibold text-[#929DB2] mb-1.5 font-mono">
                DEVELOPER AVATAR IDENTITY
              </label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setShowAvatarSelector(true)}
                  className="text-xs font-semibold h-8"
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Change Avatar / Photo
                </Button>
                {avatarUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setAvatarUrl('')}
                    className="text-xs text-rose-400 h-8"
                  >
                    Reset to Initials
                  </Button>
                )}
              </div>
              <p className="text-[11px] text-[#929DB2] mt-1 font-mono">
                Choose from 24 curated vector presets, upload personal photos, or use custom initials.
              </p>
            </div>
          </div>

          {/* Avatar Selector Modal */}
          {showAvatarSelector && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <AvatarSelector
                currentAvatar={avatarUrl}
                userName={username || fullName}
                onSelectAvatar={(newAvatar) => {
                  setAvatarUrl(newAvatar);
                  setShowAvatarSelector(false);
                }}
                onClose={() => setShowAvatarSelector(false)}
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-[#929DB2] mb-1.5 font-mono">
                Full Name *
              </label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-10 text-xs bg-[#151F30] border-[#273249] text-[#F4F6FC]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#929DB2] mb-1.5 font-mono">
                Username *
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-10 text-xs bg-[#151F30] border-[#273249] text-[#F4F6FC]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#929DB2] mb-1.5 font-mono">
              Professional Headline
            </label>
            <Input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Senior Full-Stack Engineer | Distributed Systems & Rust"
              className="h-10 text-xs bg-[#151F30] border-[#273249] text-[#F4F6FC]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-[#929DB2] font-mono">
                Engineering Biography *
              </label>
              <span className="text-[10px] font-mono text-[#929DB2]">
                {bio.length} / 500
              </span>
            </div>
            <Textarea
              value={bio}
              maxLength={500}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your tech background, current builds, and open source interests..."
              rows={4}
              className="text-xs bg-[#151F30] border-[#273249] text-[#F4F6FC]"
            />
          </div>
        </Card>

        {/* Dedicated Professional Description Card */}
        <Card className="border-[#273249] bg-[#101725] p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-[#6D95FF]" />
            <CardTitle className="text-xs font-bold text-[#6D95FF] uppercase tracking-wider font-mono">
              // Professional Description & Collaboration Profile
            </CardTitle>
          </div>
          <p className="text-xs text-[#929DB2]">
            Detailed collaboration preferences featured on your developer dossier card to match with ideal project partners.
          </p>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-[#929DB2] font-mono">
                Current Engineering Goals
              </label>
              <span className="text-[10px] font-mono text-[#929DB2]">
                {currentGoals.length} / 300
              </span>
            </div>
            <Input
              value={currentGoals}
              maxLength={300}
              onChange={(e) => setCurrentGoals(e.target.value)}
              placeholder="e.g. Architecting fault-tolerant task orchestrators and mentoring early-career engineers in distributed systems."
              className="h-10 text-xs bg-[#151F30] border-[#273249] text-[#F4F6FC]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#929DB2] mb-1.5 font-mono">
                Preferred Collaboration Style
              </label>
              <Input
                value={collaborationStyle}
                onChange={(e) => setCollaborationStyle(e.target.value)}
                placeholder="e.g. Async-first, documented PRs, weekly Discord sync"
                className="h-10 text-xs bg-[#151F30] border-[#273249] text-[#F4F6FC]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#929DB2] mb-1.5 font-mono">
                Target Project Domains (comma-separated)
              </label>
              <Input
                value={targetProjects}
                onChange={(e) => setTargetProjects(e.target.value)}
                placeholder="e.g. Developer tools, WebRTC mesh, Edge computing"
                className="h-10 text-xs bg-[#151F30] border-[#273249] text-[#F4F6FC]"
              />
            </div>
          </div>
        </Card>

        {/* Experience & Professional Links */}
        <Card className="border-[#273249] bg-[#101725] p-6 shadow-xl space-y-5">
          <CardTitle className="text-xs font-bold text-[#6D95FF] uppercase tracking-wider font-mono">
            // Experience & Professional Links
          </CardTitle>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-[#929DB2] mb-1.5 font-mono">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                className="w-full h-10 rounded-lg border border-[#273249] bg-[#151F30] px-3 text-xs text-[#F4F6FC] focus:outline-none focus:border-[#6D95FF] font-mono cursor-pointer"
              >
                <option value="Junior">Junior</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
                <option value="Architect">Architect</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#929DB2] mb-1.5 font-mono">
                Availability
              </label>
              <select
                value={availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value as AvailabilityStatus)}
                className="w-full h-10 rounded-lg border border-[#273249] bg-[#151F30] px-3 text-xs text-[#F4F6FC] focus:outline-none focus:border-[#6D95FF] font-mono cursor-pointer"
              >
                <option value="open_to_collaborate">Open to Collaborate</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#929DB2] mb-1.5 font-mono">
                Weekly Available Hours
              </label>
              <Input
                type="number"
                min={1}
                max={60}
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="h-10 text-xs font-mono bg-[#151F30] border-[#273249] text-[#F4F6FC]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-[#929DB2] mb-1.5 font-mono">
                Location
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="San Francisco, CA / Remote"
                className="h-10 text-xs bg-[#151F30] border-[#273249] text-[#F4F6FC]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#929DB2] mb-1.5 font-mono">
                GitHub Handle
              </label>
              <Input
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="torvalds"
                className="h-10 text-xs font-mono bg-[#151F30] border-[#273249] text-[#F4F6FC]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#929DB2] mb-1.5 font-mono">
                Portfolio URL
              </label>
              <Input
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yourportfolio.dev"
                className="h-10 text-xs font-mono bg-[#151F30] border-[#273249] text-[#F4F6FC]"
              />
            </div>
          </div>
        </Card>

        {/* Technical Skills Catalog Management */}
        <Card className="border-[#273249] bg-[#101725] p-6 shadow-xl space-y-4">
          <CardTitle className="text-xs font-bold text-[#6D95FF] uppercase tracking-wider font-mono flex items-center gap-2">
            <Code2 className="h-4 w-4 text-[#6D95FF]" /> // Technical Skills Catalog
          </CardTitle>
          <p className="text-xs text-[#929DB2]">
            Select technologies from the canonical dictionary to showcase on your profile and boost your AI matching score.
          </p>

          <div className="flex gap-2">
            <select
              value={selectedSkillToAdd}
              onChange={(e) => setSelectedSkillToAdd(e.target.value)}
              className="flex-1 h-10 rounded-lg border border-[#273249] bg-[#151F30] px-3 text-xs text-[#F4F6FC] focus:outline-none focus:border-[#6D95FF] font-mono cursor-pointer"
            >
              <option value="">Select a skill to add...</option>
              {availableSkills
                .filter((s) => !userSkillIds.includes(s.id))
                .map((sk) => (
                  <option key={sk.id} value={sk.id}>
                    {sk.name} ({sk.category})
                  </option>
                ))}
            </select>
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddSkill}
              disabled={!selectedSkillToAdd}
              className="text-xs font-semibold h-10 px-4 bg-[#151F30] border-[#273249] text-[#F4F6FC] hover:bg-[#1f2d45]"
            >
              <Plus className="h-4 w-4 mr-1 text-[#6D95FF]" /> Add Skill
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {userSkillIds.map((skillId) => {
              const skillObj = availableSkills.find((s) => s.id === skillId);
              return (
                <div
                  key={skillId}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#151F30] border border-[#273249] text-xs font-mono text-[#6D95FF]"
                >
                  <span>{skillObj?.name || 'Skill'}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skillId)}
                    className="text-[#929DB2] hover:text-rose-400 ml-1 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Interests */}
        <Card className="border-[#273249] bg-[#101725] p-6 shadow-xl space-y-4">
          <CardTitle className="text-xs font-bold text-[#9D83FF] uppercase tracking-wider font-mono flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#9D83FF]" /> // Focus Areas & Topics
          </CardTitle>
          <div>
            <Input
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={handleAddInterest}
              placeholder="Type a topic (e.g. AI Agents, Distributed Systems, Rust, WebGPU) and press Enter"
              className="h-10 text-xs bg-[#151F30] border-[#273249] text-[#F4F6FC]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {interests.map((item) => (
              <span
                key={item}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#151F30] border border-[#273249] text-xs text-[#F4F6FC]"
              >
                {item}
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(item)}
                  className="text-[#929DB2] hover:text-rose-400 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </Card>

        {/* Form Action */}
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
            <Save className="h-4 w-4 mr-1.5" /> Save Profile
          </Button>
        </div>
      </form>
    </motion.div>
  );
};
