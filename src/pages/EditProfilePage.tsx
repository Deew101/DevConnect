import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, User, ArrowLeft, Plus, X, Upload, Code2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { useToast } from '@/components/ui/Toast';
import { ExperienceLevel, AvailabilityStatus, Skill } from '@/types/database.types';

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
  const [interests, setInterests] = useState<string[]>(profile?.interests || []);
  const [interestInput, setInterestInput] = useState('');

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Edit Profile & Skills</h1>
            <p className="text-xs text-slate-400">Keep your developer profile fresh and accurate.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <Card className="border-slate-800 bg-[#0d1527]/90 p-6 shadow-xl space-y-5">
          <CardTitle className="text-base font-bold text-white">General Information</CardTitle>

          {/* Avatar Upload */}
          <div className="flex items-center gap-5">
            <Avatar src={avatarUrl} name={fullName} size="xl" />
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Profile Avatar
              </label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors">
                    <Upload className="h-3.5 w-3.5" />
                    {uploadingAvatar ? 'Uploading...' : 'Upload Image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploadingAvatar}
                  />
                </label>
                {avatarUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setAvatarUrl('')}
                    className="text-xs text-rose-400"
                  >
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">PNG, JPG or WebP (max 5MB)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Username *</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Professional Headline</label>
            <Input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Senior Full-Stack Engineer | Distributed Systems"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Bio</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other developers about your engineering journey, interests, and what projects you want to build..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                className="w-full h-10 rounded-lg border border-slate-700/80 bg-slate-900/70 px-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="Junior">Junior</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
                <option value="Architect">Architect</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Availability Status</label>
              <select
                value={availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value as AvailabilityStatus)}
                className="w-full h-10 rounded-lg border border-slate-700/80 bg-slate-900/70 px-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="open_to_collaborate">Open to Collaborate</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hours / Week</label>
              <Input
                type="number"
                min={1}
                max={60}
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA / Remote"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Username</label>
              <Input
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="e.g. torvalds"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Portfolio / Website</label>
              <Input
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yourportfolio.dev"
              />
            </div>
          </div>
        </Card>

        {/* Technical Skills Catalog Management */}
        <Card className="border-slate-800 bg-[#0d1527]/90 p-6 shadow-xl space-y-4">
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <Code2 className="h-4 w-4 text-cyan-400" /> Technical Skills Catalog
          </CardTitle>
          <p className="text-xs text-slate-400">
            Select technologies from the canonical dictionary to showcase on your profile and boost your AI matching score.
          </p>

          <div className="flex gap-2">
            <select
              value={selectedSkillToAdd}
              onChange={(e) => setSelectedSkillToAdd(e.target.value)}
              className="flex-1 h-10 rounded-lg border border-slate-700/80 bg-slate-900/70 px-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
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
              className="text-xs font-semibold"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Skill
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {userSkillIds.map((skillId) => {
              const skillObj = availableSkills.find((s) => s.id === skillId);
              return (
                <div
                  key={skillId}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-mono text-cyan-300"
                >
                  <span>{skillObj?.name || 'Skill'}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skillId)}
                    className="text-slate-400 hover:text-rose-400 ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Interests */}
        <Card className="border-slate-800 bg-[#0d1527]/90 p-6 shadow-xl space-y-4">
          <CardTitle className="text-base font-bold text-white">Interests & Topics</CardTitle>
          <div>
            <Input
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={handleAddInterest}
              placeholder="Type an interest (e.g. AI Agents, Web3, Distributed Systems) and press Enter"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {interests.map((item) => (
              <span
                key={item}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
              >
                {item}
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(item)}
                  className="text-slate-500 hover:text-rose-400"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </Card>

        {/* Form Action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={saving} className="px-6 font-semibold">
            <Save className="h-4 w-4 mr-2" /> Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
};
