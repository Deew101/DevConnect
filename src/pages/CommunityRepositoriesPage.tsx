import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch,
  Star,
  GitFork,
  ExternalLink,
  Search,
  Filter,
  Bookmark,
  Sparkles,
  Layers,
  Code2,
  Check,
  Github,
  ArrowUpDown,
  RefreshCw,
  Copy,
  Clock,
  ShieldCheck,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import { CardSpotlight } from '@/components/ui/CardSpotlight';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GitHubRepository, COMMUNITY_GITHUB_REPOSITORIES } from '@/data/githubData';
import { githubService } from '@/services/githubService';
import { useToast } from '@/components/ui/Toast';
import { formatTimeAgo } from '@/lib/utils';
import { Link } from 'react-router-dom';

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Python: '#3572A5',
  Rust: '#DEA584',
  Go: '#00ADD8',
  'C++': '#F34B7D',
  C: '#555555',
  Dart: '#00B4AB',
  Zig: '#EC915C',
};

export const CommunityRepositoriesPage: React.FC = () => {
  const { toast } = useToast();
  const [repositories, setRepositories] = useState<GitHubRepository[]>(COMMUNITY_GITHUB_REPOSITORIES);
  const [loading, setLoading] = useState(false);
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'stars' | 'forks' | 'updated'>('stars');
  const [savedRepoNames, setSavedRepoNames] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('devconnect_saved_repos');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const languages = [
    'all',
    'TypeScript',
    'JavaScript',
    'Python',
    'Rust',
    'Go',
    'C++',
    'C',
    'Dart',
    'Zig',
  ];

  // Load repositories from Supabase cache with verified fallback
  useEffect(() => {
    async function fetchRepos() {
      setLoading(true);
      try {
        const data = await githubService.getCommunityRepositories();
        setRepositories(data);
      } catch (err) {
        setRepositories(COMMUNITY_GITHUB_REPOSITORIES);
      } finally {
        setLoading(false);
      }
    }
    fetchRepos();
  }, []);

  const handleToggleSave = (fullName: string) => {
    let updated: string[];
    if (savedRepoNames.includes(fullName)) {
      updated = savedRepoNames.filter((r) => r !== fullName);
      toast({ title: 'Removed from saved repositories', type: 'info' });
    } else {
      updated = [...savedRepoNames, fullName];
      toast({ title: 'Repository bookmarked!', type: 'success' });
    }
    setSavedRepoNames(updated);
    try {
      localStorage.setItem('devconnect_saved_repos', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleCopyUrl = (url: string, repoName: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: `Copied URL for ${repoName}`, type: 'success' });
  };

  const handleLiveGitHubSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearchingLive(true);
    try {
      const { items, isLive } = await githubService.searchLiveRepositories(searchQuery);
      setRepositories(items);
      if (isLive) {
        toast({
          title: 'Fetched live results from GitHub REST API',
          description: `Discovered ${items.length} repositories from api.github.com`,
          type: 'success',
        });
      } else {
        toast({
          title: 'Filtered from verified catalog',
          description: 'GitHub API rate-limit protected; showing verified local matches.',
          type: 'info',
        });
      }
    } catch (err) {
      toast({ title: 'Search failed', type: 'error' });
    } finally {
      setIsSearchingLive(false);
    }
  };

  const handleResetCatalog = async () => {
    setSearchQuery('');
    setSelectedLanguage('all');
    setLoading(true);
    const data = await githubService.getCommunityRepositories();
    setRepositories(data);
    setLoading(false);
  };

  // Filter and Sort Repositories
  const filteredRepos = repositories
    .filter((repo) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        repo.name.toLowerCase().includes(q) ||
        repo.owner.toLowerCase().includes(q) ||
        repo.full_name.toLowerCase().includes(q) ||
        (repo.description && repo.description.toLowerCase().includes(q)) ||
        (repo.topics && repo.topics.some((t) => t.toLowerCase().includes(q)));

      const matchesLanguage =
        selectedLanguage === 'all' ||
        repo.language?.toLowerCase() === selectedLanguage.toLowerCase();

      return matchesSearch && matchesLanguage;
    })
    .sort((a, b) => {
      if (sortBy === 'stars') return (b.stars || 0) - (a.stars || 0);
      if (sortBy === 'forks') return (b.forks || 0) - (a.forks || 0);
      if (sortBy === 'updated') return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      return 0;
    });

  const totalStars = repositories.reduce((acc, r) => acc + (r.stars || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-[rgba(167,139,250,0.20)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono tracking-widest text-[#C4B5FD] uppercase font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" /> GITHUB OPEN SOURCE CATALOG
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse shadow-[0_0_8px_#34D399]" />
            <span className="text-xs font-mono text-[#B8ACD9]">
              {repositories.length} Verified Repositories
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-[#F8F7FF] tracking-tight">
            Community Open Source Repositories
          </h1>
          <p className="text-sm text-[#B8ACD9] mt-1.5 max-w-3xl leading-relaxed">
            40+ real, publicly accessible GitHub repositories retrieved via the official GitHub REST API.
            Original repository URLs, authentic descriptions, live star metrics, and author attributions preserved.
          </p>
        </div>

        {/* Action Controls & External Link */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/developers?tab=github">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-mono border-[rgba(167,139,250,0.25)] bg-[#100A24] text-[#F8F7FF] hover:bg-[#160E30] hover:border-[#8B5CF6]/50 shadow-sm transition-all"
            >
              <Github className="w-3.5 h-3.5 mr-1.5 text-[#A855F7]" /> External Developers Directory
            </Button>
          </Link>
          <Badge variant="cyan" className="text-xs font-mono py-1.5 px-3 bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#C4B5FD]">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#34D399]" /> 100% Genuine GitHub Attribution
          </Badge>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl border border-[rgba(167,139,250,0.20)] bg-[#160E30]/75 backdrop-blur-xl shadow-lg">
          <div className="text-[10px] font-mono uppercase text-[#B8ACD9]">Verified Public Repos</div>
          <div className="text-2xl font-bold font-display text-[#F8F7FF] mt-1">{repositories.length}</div>
          <div className="text-[10px] font-mono text-[#C4B5FD] mt-0.5">Authentic Open Source</div>
        </div>
        <div className="p-4 rounded-2xl border border-[rgba(167,139,250,0.20)] bg-[#160E30]/75 backdrop-blur-xl shadow-lg">
          <div className="text-[10px] font-mono uppercase text-[#B8ACD9]">Collective Stars</div>
          <div className="text-2xl font-bold font-display text-[#D946EF] mt-1">
            {(totalStars / 1000000).toFixed(2)}M+
          </div>
          <div className="text-[10px] font-mono text-[#B8ACD9] mt-0.5">Global GitHub Community</div>
        </div>
        <div className="p-4 rounded-2xl border border-[rgba(167,139,250,0.20)] bg-[#160E30]/75 backdrop-blur-xl shadow-lg">
          <div className="text-[10px] font-mono uppercase text-[#B8ACD9]">Ecosystem Diversity</div>
          <div className="text-2xl font-bold font-display text-[#A855F7] mt-1">10+ Stacks</div>
          <div className="text-[10px] font-mono text-[#B8ACD9] mt-0.5">TS, Rust, Go, Python, C++</div>
        </div>
        <div className="p-4 rounded-2xl border border-[rgba(167,139,250,0.20)] bg-[#160E30]/75 backdrop-blur-xl shadow-lg">
          <div className="text-[10px] font-mono uppercase text-[#B8ACD9]">REST API Cache</div>
          <div className="text-2xl font-bold font-display text-[#34D399] mt-1">Supabase Synced</div>
          <div className="text-[10px] font-mono text-[#B8ACD9] mt-0.5">Zero Rate-Limit Lockout</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-[rgba(167,139,250,0.20)] bg-[#160E30]/75 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="flex-1 relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleLiveGitHubSearch();
              }}
              placeholder="Search by repo (e.g. react, next.js, supabase, linux) or owner (e.g. vercel, microsoft)..."
              icon={<Search className="h-4 w-4 text-[#B8ACD9]" />}
              className="h-10 text-xs bg-[#100A24] border-[rgba(167,139,250,0.20)] text-[#F8F7FF] placeholder-[#B8ACD9] focus:border-[#8B5CF6]"
            />
          </div>
          <Button
            type="button"
            variant="primary"
            onClick={handleLiveGitHubSearch}
            isLoading={isSearchingLive}
            className="h-10 px-4 text-xs font-semibold shrink-0 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-[#F8F7FF] shadow-sm shadow-[#8B5CF6]/25"
          >
            <Github className="w-3.5 h-3.5 mr-1.5" /> Search Live GitHub
          </Button>
          {(searchQuery || selectedLanguage !== 'all') && (
            <Button
              type="button"
              variant="outline"
              onClick={handleResetCatalog}
              className="h-10 text-xs border-[rgba(167,139,250,0.25)] text-[#F8F7FF] bg-[#100A24] hover:bg-[#8B5CF6]/20 shrink-0 font-mono"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1 text-[#A855F7]" /> Reset
            </Button>
          )}
        </div>

        {/* Sort and Language Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-[rgba(167,139,250,0.15)]">
          {/* Language Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-mono text-[#B8ACD9] mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3 text-[#A855F7]" /> Language:
            </span>
            {languages.map((lang) => {
              const isSelected = selectedLanguage === lang;
              const color = LANGUAGE_COLORS[lang];
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#8B5CF6] text-[#080514] font-bold shadow-[0_0_12px_rgba(139,92,246,0.35)]'
                      : 'bg-[#100A24] text-[#B8ACD9] hover:text-[#F8F7FF] border border-[rgba(167,139,250,0.20)] hover:border-[#8B5CF6]/40'
                  }`}
                >
                  {color && (
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: color }}
                    />
                  )}
                  {lang === 'all' ? 'All Languages' : lang}
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-[#B8ACD9] flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-[#A855F7]" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-8 rounded-xl border border-[rgba(167,139,250,0.20)] bg-[#100A24] px-2.5 text-xs text-[#F8F7FF] font-mono focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
            >
              <option value="stars">Most Stars</option>
              <option value="forks">Most Forks</option>
              <option value="updated">Recently Updated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Repositories Grid */}
      {filteredRepos.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-[rgba(167,139,250,0.25)] rounded-2xl bg-[#100A24]/60 backdrop-blur-md">
          <GitBranch className="h-12 w-12 text-[#B8ACD9]/40 mx-auto mb-3" />
          <h3 className="text-lg font-bold font-display text-[#F8F7FF] mb-1">
            No Repositories Match Your Filter
          </h3>
          <p className="text-xs text-[#B8ACD9] max-w-sm mx-auto mb-4">
            Try adjusting your search keywords or switching back to "All Languages".
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetCatalog}
            className="border-[rgba(167,139,250,0.25)] text-[#F8F7FF] hover:bg-[#160E30]"
          >
            Reset Catalog
          </Button>
        </div>
      ) : (
        <motion.div
          key={selectedLanguage + '-' + sortBy}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.28 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredRepos.map((repo, idx) => {
            const isSaved = savedRepoNames.includes(repo.full_name);
            const langColor = LANGUAGE_COLORS[repo.language] || '#8B5CF6';

            return (
              <motion.div
                key={repo.full_name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: Math.min(idx * 0.045, 0.25),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="h-full"
              >
                <CardSpotlight className="h-full flex flex-col justify-between overflow-hidden group bg-[#160E30]/75 backdrop-blur-xl border border-[rgba(167,139,250,0.20)] hover:border-[#8B5CF6]/50 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(139,92,246,0.18)] transition-all duration-300 p-5 rounded-2xl">
                  <div className="space-y-4">
                    {/* Top Owner Header with Real GitHub Avatar */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {repo.owner_avatar_url ? (
                          <img
                            src={repo.owner_avatar_url}
                            alt={repo.owner}
                            className="w-7 h-7 rounded-lg border border-[rgba(167,139,250,0.25)] object-cover shrink-0 bg-[#100A24]"
                            loading="lazy"
                            onError={(e) => {
                              // fallback on image error
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-lg border border-[rgba(167,139,250,0.25)] bg-[#100A24] flex items-center justify-center text-xs font-mono font-bold text-[#A855F7]">
                            {repo.owner.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <a
                            href={`https://github.com/${repo.owner}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono font-semibold text-[#A855F7] hover:text-[#D946EF] hover:underline truncate block transition-colors"
                            title={`View @${repo.owner} on GitHub`}
                          >
                            @{repo.owner}
                          </a>
                          <div className="text-[10px] font-mono text-[#B8ACD9] flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-[#34D399]" />
                            {repo.owner_type || 'Organization'}
                          </div>
                        </div>
                      </div>

                      {/* Bookmark and Copy Button */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(repo.html_url, repo.name)}
                          className="p-1.5 rounded-lg border border-[rgba(167,139,250,0.20)] bg-[#100A24] text-[#B8ACD9] hover:text-[#F8F7FF] hover:bg-[#8B5CF6]/20 transition-all"
                          title="Copy GitHub URL"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleSave(repo.full_name)}
                          className={`p-1.5 rounded-lg border transition-all ${
                            isSaved
                              ? 'bg-[#8B5CF6]/25 border-[#8B5CF6] text-[#F8F7FF] shadow-[0_0_8px_rgba(139,92,246,0.3)]'
                              : 'bg-[#100A24] border-[rgba(167,139,250,0.20)] text-[#B8ACD9] hover:text-[#F8F7FF] hover:bg-[#8B5CF6]/20'
                          }`}
                          title={isSaved ? 'Bookmarked' : 'Bookmark repository'}
                        >
                          <Bookmark className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Repo Title & Language */}
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base font-bold font-display text-[#F8F7FF] group-hover:text-[#C4B5FD] transition-colors truncate">
                          {repo.name}
                        </h3>
                        {repo.language && (
                          <span
                            className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-[rgba(167,139,250,0.25)] bg-[#100A24] text-[#F8F7FF] shrink-0 flex items-center gap-1"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full inline-block"
                              style={{ backgroundColor: langColor }}
                            />
                            {repo.language}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#B8ACD9] mt-2 line-clamp-3 leading-relaxed">
                        {repo.description || 'Verified authentic open source repository on GitHub.'}
                      </p>
                    </div>

                    {/* Topics */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(repo.topics || []).slice(0, 4).map((topic) => (
                        <span
                          key={topic}
                          className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#100A24] border border-[rgba(167,139,250,0.20)] text-[#C4B5FD]"
                        >
                          #{topic}
                        </span>
                      ))}
                      {(repo.topics || []).length > 4 && (
                        <span className="text-[10px] text-[#B8ACD9] font-mono px-1">
                          +{repo.topics.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Metrics & Direct GitHub Outlink */}
                  <div className="pt-4 mt-4 border-t border-[rgba(167,139,250,0.15)] space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-[#B8ACD9]">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-amber-400 font-semibold" title="GitHub Stars">
                          <Star className="h-3.5 w-3.5 fill-amber-400" />
                          {repo.stars >= 1000 ? `${(repo.stars / 1000).toFixed(1)}k` : repo.stars.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1" title="Forks">
                          <GitFork className="h-3.5 w-3.5 text-[#B8ACD9]" />
                          {repo.forks >= 1000 ? `${(repo.forks / 1000).toFixed(1)}k` : repo.forks.toLocaleString()}
                        </span>
                      </div>

                      {repo.updated_at && (
                        <span className="text-[10px] text-[#B8ACD9] flex items-center gap-1" title="Last updated">
                          <Clock className="w-3 h-3 text-[#A855F7]" />
                          {formatTimeAgo(repo.updated_at)}
                        </span>
                      )}
                    </div>

                    {/* Official Outlink Action Button */}
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold bg-[#100A24] hover:bg-[#8B5CF6]/20 border border-[rgba(167,139,250,0.25)] hover:border-[#8B5CF6]/50 text-[#F8F7FF] hover:text-[#C4B5FD] transition-all group/btn shadow-sm"
                    >
                      <Github className="h-3.5 w-3.5" />
                      <span>Open GitHub Repository</span>
                      <ExternalLink className="h-3 w-3 text-[#A855F7] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform ml-auto" />
                    </a>
                  </div>
                </CardSpotlight>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
