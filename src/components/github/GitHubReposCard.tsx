import React, { useState, useEffect } from 'react';
import { GitBranch, Star, GitFork, ExternalLink, RefreshCw, Github } from 'lucide-react';
import { fetchGitHubUserData, GitHubRepo, syncGitHubAccount } from '@/services/githubService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';

interface GitHubReposCardProps {
  githubUsername: string | null | undefined;
  userId?: string;
  isOwner?: boolean;
}

export const GitHubReposCard: React.FC<GitHubReposCardProps> = ({
  githubUsername,
  userId,
  isOwner,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [languages, setLanguages] = useState<{ name: string; percentage: number; color?: string }[]>([]);
  const [stats, setStats] = useState<{ publicRepos: number; followers: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    if (!githubUsername) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGitHubUserData(githubUsername);
      setRepos(data.repos);
      setLanguages(data.topLanguages);
      setStats({
        publicRepos: data.profile.public_repos,
        followers: data.profile.followers,
      });

      if (userId && isOwner) {
        await syncGitHubAccount(userId, githubUsername);
      }
    } catch (err: any) {
      setError(err.message || 'Could not load GitHub profile data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (githubUsername) {
      loadData();
    }
  }, [githubUsername]);

  if (!githubUsername) {
    return (
      <Card className="border-slate-800 bg-[#0d1527]/70">
        <CardContent className="p-6 text-center">
          <Github className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h4 className="font-semibold text-white text-sm">No GitHub Account Linked</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {isOwner
              ? 'Connect your GitHub profile to showcase repositories and top programming languages.'
              : 'This developer has not connected their GitHub profile yet.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-800 bg-[#0d1527]/90 shadow-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <Github className="h-5 w-5 text-white" />
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              GitHub Repositories
              <a
                href={`https://github.com/${githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cyan-400 font-mono hover:underline inline-flex items-center gap-0.5"
              >
                @{githubUsername} <ExternalLink className="h-3 w-3" />
              </a>
            </CardTitle>
          </div>
        </div>

        {stats && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>{stats.publicRepos} Repos</span>
              <span>•</span>
              <span>{stats.followers} Followers</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadData}
              disabled={loading}
              className="h-8 px-2 text-slate-400 hover:text-white"
              title="Sync GitHub Repos"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Languages distribution bar */}
        {languages.length > 0 && (
          <div className="space-y-1.5">
            <div className="h-2 w-full rounded-full overflow-hidden flex bg-slate-800">
              {languages.map((lang) => (
                <div
                  key={lang.name}
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: lang.color || '#38bdf8',
                  }}
                  title={`${lang.name}: ${lang.percentage}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-3 text-[11px] text-slate-400">
              {languages.slice(0, 5).map((lang) => (
                <div key={lang.name} className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: lang.color || '#38bdf8' }}
                  />
                  <span className="text-slate-300 font-medium">{lang.name}</span>
                  <span className="text-slate-500 font-mono">{lang.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Repos Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-800/60 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h5 className="font-semibold text-xs text-white group-hover:text-cyan-300 transition-colors truncate">
                      {repo.name}
                    </h5>
                    <ExternalLink className="h-3 w-3 text-slate-500 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {repo.description || 'No description provided.'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-3 pt-2 border-t border-slate-800/60">
                  <span className="text-cyan-400 font-sans">{repo.language || 'Code'}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-400" /> {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="h-3 w-3 text-slate-400" /> {repo.forks_count}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
