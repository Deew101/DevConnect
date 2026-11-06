import { supabase } from '@/lib/supabase';
import { Profile, Project, MatchRecommendation } from '@/types/database.types';

export async function matchTeammatesForProject(
  project: Project,
  candidates: (Profile & { skillsList?: string[] })[]
): Promise<MatchRecommendation[]> {
  try {
    // Attempt invoking the Edge Function if available
    const { data, error } = await supabase.functions.invoke('match-teammates', {
      body: {
        projectId: project.id,
        projectRequirements: {
          title: project.title,
          description: project.description,
          category: project.category,
          requiredSkills: project.required_skills || [],
        },
        candidateProfiles: candidates.map((c) => ({
          id: c.id,
          username: c.username,
          full_name: c.full_name,
          bio: c.bio,
          headline: c.headline,
          experience_level: c.experience_level,
          availability_status: c.availability_status,
          skills: c.skillsList || [],
          interests: c.interests || [],
        })),
      },
    });

    if (!error && data?.matches) {
      return data.matches.map((m: any) => {
        const dev = candidates.find((c) => c.id === m.candidateId);
        return {
          developer: dev!,
          matchScore: m.matchScore,
          matchingSkills: m.matchingSkills,
          missingSkills: m.missingSkills,
          reasons: m.reasons,
          calculatedVia: data.calculatedVia || 'ai',
        };
      }).filter((item: MatchRecommendation) => Boolean(item.developer));
    }
  } catch (err) {
    // Edge function not deployed or network error; gracefully fall back to algorithmic engine
    console.warn('Falling back to local weighted matchmaking algorithm:', err);
  }

  // Transparent, deterministic, weighted matching algorithm
  return computeAlgorithmicMatch(project, candidates);
}

export function computeAlgorithmicMatch(
  project: Project,
  candidates: (Profile & { skillsList?: string[] })[]
): MatchRecommendation[] {
  const reqSkills = (project.required_skills || []).map((s) => s.trim().toLowerCase());

  const results: MatchRecommendation[] = candidates.map((cand) => {
    const candSkills = (cand.skillsList || []).map((s) => s.trim().toLowerCase());
    const candSkillsSet = new Set(candSkills);

    const matching = (project.required_skills || []).filter((s) =>
      candSkillsSet.has(s.trim().toLowerCase())
    );
    const missing = (project.required_skills || []).filter(
      (s) => !candSkillsSet.has(s.trim().toLowerCase())
    );

    // 1. Skill overlap (up to 55 points)
    let skillScore = 0;
    if (reqSkills.length > 0) {
      skillScore = (matching.length / reqSkills.length) * 55;
    } else {
      skillScore = 30; // neutral baseline if project has no specified skills
    }

    // 2. Experience level compatibility (up to 20 points)
    let expScore = 12;
    if (cand.experience_level === 'Senior' || cand.experience_level === 'Lead' || cand.experience_level === 'Architect') {
      expScore = 20;
    } else if (cand.experience_level === 'Mid-Level') {
      expScore = 16;
    } else if (cand.experience_level === 'Junior') {
      expScore = 10;
    }

    // 3. Availability status & hours (up to 15 points)
    let availScore = 0;
    if (cand.availability_status === 'open_to_collaborate' || cand.availability_status === 'available') {
      availScore += 10;
    }
    if ((cand.weekly_hours_available || 0) >= 10) {
      availScore += 5;
    }

    // 4. Interest overlap with project category (up to 10 points)
    let interestScore = 0;
    const catLower = project.category.toLowerCase();
    const hasInterest = (cand.interests || []).some(
      (int) => catLower.includes(int.toLowerCase()) || int.toLowerCase().includes(catLower)
    );
    if (hasInterest) {
      interestScore = 10;
    } else if ((cand.interests || []).length > 0) {
      interestScore = 5;
    }

    const total = Math.min(100, Math.round(skillScore + expScore + availScore + interestScore));

    const reasons: string[] = [];
    if (matching.length > 0) {
      reasons.push(
        `Possesses key required technologies: ${matching.slice(0, 3).join(', ')}${
          matching.length > 3 ? ` +${matching.length - 3} more` : ''
        }`
      );
    }
    if (cand.availability_status === 'open_to_collaborate') {
      reasons.push(`Actively looking for collaborative team projects (${cand.weekly_hours_available} hrs/week)`);
    }
    if (hasInterest) {
      reasons.push(`Stated personal interest in ${project.category}`);
    }
    if (cand.experience_level === 'Senior' || cand.experience_level === 'Lead') {
      reasons.push(`Strong engineering seniority (${cand.experience_level}) to drive implementation`);
    }
    if (reasons.length === 0) {
      reasons.push('General engineering skill baseline with potential cross-functional alignment');
    }

    return {
      developer: cand,
      matchScore: Math.max(15, total),
      matchingSkills: matching,
      missingSkills: missing,
      reasons,
      calculatedVia: 'algorithmic',
    };
  });

  return results.sort((a, b) => b.matchScore - a.matchScore);
}
