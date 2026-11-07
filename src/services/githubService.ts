// src/services/githubService.ts
// Official GitHub REST API client & resilient cache management for DevConnect

import { supabase } from '@/lib/supabase';
import { GitHubAccount } from '@/types/database.types';
import {
  GitHubRepository,
  ExternalGitHubDeveloper,
  COMMUNITY_GITHUB_REPOSITORIES,
  EXTERNAL_GITHUB_DEVELOPERS,
} from '@/data/githubData';

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
    return accountData as unknown as GitHubAccount;
  }

  return data as GitHubAccount;
}

class GitHubService {
  private memoryRepoCache: GitHubRepository[] = COMMUNITY_GITHUB_REPOSITORIES;
  private memoryDevCache: ExternalGitHubDeveloper[] = EXTERNAL_GITHUB_DEVELOPERS;
  private rateLimitRemaining: number = 60;

  /**
   * Retrieves verified community repositories from Supabase cache or high-fidelity fallback
   */
  async getCommunityRepositories(): Promise<GitHubRepository[]> {
    try {
      const { data, error } = await supabase
        .from('community_repositories')
        .select('*')
        .order('stars', { ascending: false });

      if (!error && data && data.length > 0) {
        const formatted: GitHubRepository[] = data.map((d: any) => ({
          id: d.id,
          github_id: Number(d.github_id) || 0,
          name: d.name,
          full_name: d.full_name,
          owner: d.owner,
          owner_avatar_url: d.owner_avatar_url || `https://avatars.githubusercontent.com/u/0?v=4`,
          owner_type: d.owner_type || 'User',
          html_url: d.html_url,
          description: d.description || '',
          language: d.language || 'Code',
          stars: Number(d.stars) || 0,
          forks: Number(d.forks) || 0,
          open_issues_count: Number(d.open_issues_count) || 0,
          topics: Array.isArray(d.topics) ? d.topics : [],
          created_at: d.created_at,
          updated_at: d.updated_at,
          license: d.license,
        }));
        this.memoryRepoCache = formatted;
        return formatted;
      }
    } catch (err) {
      console.warn('Supabase community_repositories fetch failed, falling back to verified catalog:', err);
    }

    return this.memoryRepoCache;
  }

  /**
   * Retrieves verified external GitHub developers from Supabase cache or high-fidelity fallback
   */
  async getExternalDevelopers(): Promise<ExternalGitHubDeveloper[]> {
    try {
      const { data, error } = await supabase
        .from('external_github_developers')
        .select('*')
        .order('followers', { ascending: false });

      if (!error && data && data.length > 0) {
        const formatted: ExternalGitHubDeveloper[] = data.map((d: any) => ({
          id: d.id,
          github_id: Number(d.github_id) || 0,
          username: d.username,
          name: d.name || d.username,
          avatar_url: d.avatar_url,
          bio: d.bio || '',
          company: d.company,
          location: d.location,
          blog: d.blog,
          public_repos: Number(d.public_repos) || 0,
          public_gists: Number(d.public_gists) || 0,
          followers: Number(d.followers) || 0,
          following: Number(d.following) || 0,
          html_url: d.html_url,
          created_at: d.created_at,
          updated_at: d.updated_at,
          is_external: true,
        }));
        this.memoryDevCache = formatted;
        return formatted;
      }
    } catch (err) {
      console.warn('Supabase external_github_developers fetch failed, falling back to verified catalog:', err);
    }

    return this.memoryDevCache;
  }

  /**
   * Live search on official GitHub REST API with graceful fallback to cached catalog
   */
  async searchLiveRepositories(query: string): Promise<{ items: GitHubRepository[]; isLive: boolean }> {
    if (!query.trim()) {
      const repos = await this.getCommunityRepositories();
      return { items: repos, isLive: false };
    }

    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=30`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      const remaining = response.headers.get('x-ratelimit-remaining');
      if (remaining) {
        this.rateLimitRemaining = parseInt(remaining, 10);
      }

      if (response.ok) {
        const json = await response.json();
        if (json.items && Array.isArray(json.items)) {
          const liveRepos: GitHubRepository[] = json.items.map((item: any) => ({
            id: `gh-repo-${item.id}`,
            github_id: item.id,
            name: item.name,
            full_name: item.full_name,
            owner: item.owner?.login || 'unknown',
            owner_avatar_url: item.owner?.avatar_url || '',
            owner_type: item.owner?.type || 'User',
            html_url: item.html_url,
            description: item.description || '',
            language: item.language || 'Code',
            stars: item.stargazers_count,
            forks: item.forks_count,
            open_issues_count: item.open_issues_count,
            topics: item.topics || [],
            created_at: item.created_at,
            updated_at: item.updated_at,
            license: item.license?.name || null,
          }));

          this.cacheReposToSupabase(liveRepos.slice(0, 5));
          return { items: liveRepos, isLive: true };
        }
      }
    } catch (err) {
      console.warn('Live GitHub repo search unreachable or rate limited, falling back to local index:', err);
    }

    const all = await this.getCommunityRepositories();
    const q = query.toLowerCase();
    const filtered = all.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.owner.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.topics.some((t) => t.toLowerCase().includes(q))
    );

    return { items: filtered, isLive: false };
  }

  /**
   * Live search on official GitHub REST API for developers with graceful fallback
   */
  async searchLiveDevelopers(query: string): Promise<{ items: ExternalGitHubDeveloper[]; isLive: boolean }> {
    if (!query.trim()) {
      const devs = await this.getExternalDevelopers();
      return { items: devs, isLive: false };
    }

    try {
      const response = await fetch(
        `https://api.github.com/search/users?q=${encodeURIComponent(query)}+type:user&per_page=20`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      const remaining = response.headers.get('x-ratelimit-remaining');
      if (remaining) {
        this.rateLimitRemaining = parseInt(remaining, 10);
      }

      if (response.ok) {
        const json = await response.json();
        if (json.items && Array.isArray(json.items)) {
          const liveDevs: ExternalGitHubDeveloper[] = json.items.map((user: any) => ({
            id: `gh-user-${user.id}`,
            github_id: user.id,
            username: user.login,
            name: user.login,
            avatar_url: user.avatar_url,
            bio: 'Public open source developer on GitHub.',
            company: null,
            location: null,
            blog: null,
            public_repos: 0,
            followers: 0,
            html_url: user.html_url,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_external: true,
          }));

          return { items: liveDevs, isLive: true };
        }
      }
    } catch (err) {
      console.warn('Live GitHub user search failed, falling back to local catalog:', err);
    }

    const allDevs = await this.getExternalDevelopers();
    const q = query.toLowerCase();
    const filtered = allDevs.filter(
      (d) =>
        d.username.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q) ||
        (d.bio && d.bio.toLowerCase().includes(q)) ||
        (d.company && d.company.toLowerCase().includes(q))
    );

    return { items: filtered, isLive: false };
  }

  private async cacheReposToSupabase(repos: GitHubRepository[]) {
    try {
      const rows = repos.map((r) => ({
        id: r.id,
        github_id: r.github_id,
        name: r.name,
        full_name: r.full_name,
        owner: r.owner,
        owner_avatar_url: r.owner_avatar_url,
        owner_type: r.owner_type,
        html_url: r.html_url,
        description: r.description,
        language: r.language,
        stars: r.stars,
        forks: r.forks,
        open_issues_count: r.open_issues_count || 0,
        topics: r.topics,
        updated_at: r.updated_at,
        license: r.license,
      }));

      await supabase.from('community_repositories').upsert(rows, { onConflict: 'full_name' });
    } catch (e) {
      // Ignore background cache failure
    }
  }

  getRateLimitRemaining(): number {
    return this.rateLimitRemaining;
  }
}

export const githubService = new GitHubService();
