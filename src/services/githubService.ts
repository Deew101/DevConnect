import { supabase } from '@/lib/supabase';
import { GitHubAccount } from '@/types/database.types';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

export interface GitHubUserProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

export async function fetchGitHubUserData(username: string): Promise<{
  profile: GitHubUserProfile;
  repos: GitHubRepo[];
  topLanguages: { name: string; percentage: number; color?: string }[];
}> {
  const cleanUsername = username.trim().replace(/^@/, '');
  if (!cleanUsername) {
    throw new Error('Please enter a valid GitHub username');
  }

  // 1. Fetch user profile
  const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}`);
  if (!userRes.ok) {
    if (userRes.status === 404) {
      throw new Error(`GitHub user "${cleanUsername}" was not found.`);
    }
    throw new Error(`GitHub API error: ${userRes.statusText}`);
  }
  const profile: GitHubUserProfile = await userRes.json();

  // 2. Fetch public repos
  const reposRes = await fetch(
    `https://api.github.com/users/${encodeURIComponent(cleanUsername)}/repos?sort=updated&per_page=12`
  );
  let repos: GitHubRepo[] = [];
  if (reposRes.ok) {
    const rawRepos = await reposRes.json();
    repos = rawRepos.map((r: any) => ({
      id: r.id,
      name: r.name,
      full_name: r.full_name,
      description: r.description,
      html_url: r.html_url,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      language: r.language,
      updated_at: r.updated_at,
    }));
  }

  // 3. Compute top languages distribution
  const langCounts: Record<string, number> = {};
  repos.forEach((repo) => {
    if (repo.language) {
      langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
    }
  });

  const totalWithLang = Object.values(langCounts).reduce((a, b) => a + b, 0);
  const colors: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f7df1e',
    Python: '#3572A5',
    Rust: '#dea584',
    Go: '#00ADD8',
    'C++': '#f34b7d',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Java: '#b07219',
    PHP: '#4F5D95',
  };

  const topLanguages = Object.entries(langCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({
      name,
      percentage: totalWithLang > 0 ? Math.round((count / totalWithLang) * 100) : 0,
      color: colors[name] || '#38bdf8',
    }));

  return { profile, repos, topLanguages };
}

export async function syncGitHubAccount(userId: string, username: string): Promise<GitHubAccount | null> {
  const { profile, repos, topLanguages } = await fetchGitHubUserData(username);

  const accountData = {
    user_id: userId,
    github_user_id: String(profile.login),
    username: profile.login,
    avatar_url: profile.avatar_url,
    profile_url: profile.html_url,
    public_repos: profile.public_repos,
    followers: profile.followers,
    following: profile.following,
    bio: profile.bio,
    top_languages: topLanguages,
    cached_repos: repos,
    last_synced_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('github_accounts')
    .upsert(accountData, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) {
    console.error('Failed to sync github account in database:', error);
    // Return structured object even if database upsert fails
    return accountData as unknown as GitHubAccount;
  }

  return data as GitHubAccount;
}
