import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  ArrowRight,
  ArrowLeft,
  Check,
  Code2,
  Github,
  User,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { Skill, ExperienceLevel } from '@/types/database.types';

export const OnboardingPage: React.FC = () => {
  const { user, profile, refreshProfile, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Step 1: Identity
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [headline, setHeadline] = useState(profile?.headline || 'Full-Stack Developer');
  const [bio, setBio] = useState(profile?.bio || '');
  const [location, setLocation] = useState(profile?.location || '');

  // Step 2: Tech stack & seniority
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Mid-Level');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);

  // Step 3: Collaboration & Availability
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [interests, setInterests] = useState<string[]>(['Open Source', 'Web Applications']);

  // Step 4: GitHub & Links
  const [githubUsername, setGithubUsername] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSkills() {
      const { data } = await supabase.from('skills').select('*').order('name');
      if (data) setAvailableSkills(data);
    }
    fetchSkills();
  }, []);

  const handleToggleSkill = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skillName));
    } else {
      setSelectedSkills([...selectedSkills, skillName]);
    }
  };

  const handleFinishOnboarding = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // 1. Update Profile record with is_onboarded = true
      const { error: profileError } = await updateProfile({
        full_name: fullName.trim() || 'Developer',
        username: username.trim().toLowerCase(),
        headline: headline.trim(),
        bio: bio.trim(),
        location: location.trim() || null,
        experience_level: experienceLevel,
        weekly_hours_available: Number(weeklyHours) || 10,
        availability_status: 'open_to_collaborate',
        github_username: githubUsername.trim().replace(/^@/, '') || null,
        website_url: websiteUrl.trim() || null,
        interests,
        is_onboarded: true,
      });

      if (profileError) throw profileError;

      // 2. Link chosen skills to user_skills table
      if (selectedSkills.length > 0) {
        const skillsToInsert = availableSkills
          .filter((s) => selectedSkills.includes(s.name))
          .map((s) => ({
            user_id: user.id,
            skill_id: s.id,
            proficiency_level: 'Intermediate',
            years_of_experience: 2,
          }));

        if (skillsToInsert.length > 0) {
          await supabase.from('user_skills').upsert(skillsToInsert, { onConflict: 'user_id,skill_id' });
        }
      }

      await refreshProfile();
      toast({
        title: 'Welcome to DevConnect!',
        description: 'Your developer profile is now active.',
        type: 'success',
      });
      navigate('/dashboard');
    } catch (err: any) {
      toast({
        title: 'Onboarding failed',
        description: err.message,
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090C13] flex flex-col justify-center items-center p-4 sm:p-6 text-[#F1F5FC]">
      <div className="max-w-2xl w-full">
        {/* Logo and Progress */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#648BFF] to-[#9B7BFF] items-center justify-center shadow-lg shadow-[#648BFF]/25 mb-3 border border-white/20">
            <Layers className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#F1F5FC] tracking-tight">
            Set Up Your DevConnect Profile
          </h1>
          <p className="text-xs text-[#929DB2] mt-1 font-mono">
            Step {step} of {totalSteps} — Personalize your developer footprint
          </p>

          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-[#141C2B] rounded-full mt-4 overflow-hidden max-w-md mx-auto border border-[#273249]">
            <div
              className="h-full bg-gradient-to-r from-[#648BFF] to-[#9B7BFF] transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Card */}
        <Card className="border-[#273249] bg-[#0E1420]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-5 w-5 text-[#648BFF]" />
                  <h3 className="font-bold text-base text-[#F1F5FC]">Basic Information</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#929DB2] mb-1 font-mono">
                      Full Name *
                    </label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Linus Torvalds"
                      className="bg-[#141C2B] border-[#273249] text-[#F1F5FC]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#929DB2] mb-1 font-mono">
                      Username *
                    </label>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="ltorvalds"
                      className="bg-[#141C2B] border-[#273249] text-[#F1F5FC]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#929DB2] mb-1 font-mono">
                    Headline
                  </label>
                  <Input
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer | TypeScript & Next.js"
                    className="bg-[#141C2B] border-[#273249] text-[#F1F5FC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#929DB2] mb-1 font-mono">Bio</label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Briefly describe what you love building and what technologies excite you..."
                    rows={3}
                    className="bg-[#141C2B] border-[#273249] text-[#F1F5FC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#929DB2] mb-1 font-mono">Location</label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Berlin, Germany / Remote"
                    className="bg-[#141C2B] border-[#273249] text-[#F1F5FC]"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="h-5 w-5 text-[#648BFF]" />
                  <h3 className="font-bold text-base text-[#F1F5FC]">Technical Skills & Seniority</h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#929DB2] mb-1 font-mono">
                    Seniority Level
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {(['Junior', 'Mid-Level', 'Senior', 'Lead', 'Architect'] as ExperienceLevel[]).map(
                      (lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setExperienceLevel(lvl)}
                          className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                            experienceLevel === lvl
                              ? 'bg-[#648BFF]/20 border-[#648BFF] text-[#F1F5FC] shadow-sm'
                              : 'bg-[#141C2B] border-[#273249] text-[#929DB2] hover:text-[#F1F5FC]'
                          }`}
                        >
                          {lvl}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#929DB2] mb-2 font-mono">
                    Select Your Core Technologies (AI matchmaking uses this)
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto p-1">
                    {availableSkills.map((sk) => {
                      const isSelected = selectedSkills.includes(sk.name);
                      return (
                        <button
                          key={sk.id}
                          type="button"
                          onClick={() => handleToggleSkill(sk.name)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                            isSelected
                              ? 'bg-[#648BFF] border-[#648BFF] text-[#090C13] font-bold shadow-sm'
                              : 'bg-[#141C2B] border-[#273249] text-[#929DB2] hover:border-[#648BFF]/40 hover:text-[#F1F5FC]'
                          }`}
                        >
                          {isSelected && '✓ '}
                          {sk.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-[#648BFF]" />
                  <h3 className="font-bold text-base text-[#F1F5FC]">Collaboration Preferences</h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#929DB2] mb-1 font-mono">
                    Available Hours per Week for Projects
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={2}
                      max={40}
                      step={2}
                      value={weeklyHours}
                      onChange={(e) => setWeeklyHours(Number(e.target.value))}
                      className="w-full h-2 bg-[#141C2B] rounded-lg appearance-none cursor-pointer accent-[#648BFF]"
                    />
                    <span className="font-mono text-sm font-bold text-[#648BFF] min-w-[70px]">
                      {weeklyHours} hrs/wk
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#929DB2] mb-2 font-mono">
                    Project Categories You Want to Build
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      'Web Applications',
                      'Open Source Tools',
                      'AI Agents & LLMs',
                      'Mobile Apps',
                      'Developer Infra',
                      'Hackathon Projects',
                    ].map((cat) => {
                      const isSelected = interests.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            if (isSelected) setInterests(interests.filter((i) => i !== cat));
                            else setInterests([...interests, cat]);
                          }}
                          className={`p-3 rounded-xl text-xs font-semibold border text-left transition-all ${
                            isSelected
                              ? 'bg-[#648BFF]/20 border-[#648BFF] text-[#F1F5FC]'
                              : 'bg-[#141C2B] border-[#273249] text-[#929DB2] hover:text-[#F1F5FC]'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Github className="h-5 w-5 text-[#648BFF]" />
                  <h3 className="font-bold text-base text-[#F1F5FC]">Connect GitHub & Portfolio</h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#929DB2] mb-1 font-mono">
                    GitHub Username
                  </label>
                  <Input
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    placeholder="e.g. torvalds (without @)"
                    className="bg-[#141C2B] border-[#273249] text-[#F1F5FC]"
                  />
                  <p className="text-[11px] text-[#929DB2] mt-1 font-mono">
                    DevConnect will automatically showcase your public repos and star counts.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#929DB2] mb-1 font-mono">
                    Portfolio or Personal Website URL
                  </label>
                  <Input
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://myportfolio.dev"
                    className="bg-[#141C2B] border-[#273249] text-[#F1F5FC]"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#273249]">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep(step - 1)}
                className="border-[#273249] text-[#F1F5FC]"
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
              </Button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setStep(step + 1)}
                className="shadow-md shadow-[#648BFF]/20"
              >
                Next Step <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="glow"
                size="sm"
                isLoading={saving}
                onClick={handleFinishOnboarding}
                className="shadow-md shadow-[#648BFF]/20"
              >
                <Check className="h-4 w-4 mr-1.5" /> Complete Profile & Enter
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
