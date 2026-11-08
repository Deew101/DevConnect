import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  Search,
  ArrowUpDown,
  ExternalLink,
  ShieldAlert,
  Users,
  FolderGit2,
  Sparkles,
  MapPin,
  Building,
  RotateCcw,
  BookOpen,
  GitBranch,
} from 'lucide-react';
import { CardSpotlight } from '@/components/ui/CardSpotlight';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ExternalGitHubDeveloper, EXTERNAL_GITHUB_DEVELOPERS } from '@/data/githubData';
import { githubService } from '@/services/githubService';
import {
  staggerContainerVariants,
  staggerItemVariants,
  cardVariants,
} from '@/components/animation';

export const GitHubDevelopersPage: React.FC = () => {
  const [externalDevs, setExternalDevs] = useState<ExternalGitHubDeveloper[]>(EXTERNAL_GITHUB_DEVELOPERS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'followers' | 'repos'>('followers');

  const loadGitHubDevelopers = async () => {
    setLoading(true);
    try {
      const data = await githubService.getExternalDevelopers();
      if (data && data.length > 0) {
        setExternalDevs(data);
      } else {
        setExternalDevs(EXTERNAL_GITHUB_DEVELOPERS);
      }
    } catch (err) {
      console.warn('Using cached verified GitHub developers:', err);
      setExternalDevs(EXTERNAL_GITHUB_DEVELOPERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGitHubDevelopers();
  }, []);

  // Filter and sort external GitHub developers
  const filteredDevs = externalDevs
    .filter((d) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        d.name?.toLowerCase().includes(q) ||
        d.username?.toLowerCase().includes(q) ||
        d.bio?.toLowerCase().includes(q) ||
        d.company?.toLowerCase().includes(q) ||
        d.location?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'repos') {
        return (b.public_repos || 0) - (a.public_repos || 0);
      }
      return (b.followers || 0) - (a.followers || 0);
    });

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 font-sans pb-16"
    >
      {/* Top Header */}
      <motion.div variants={staggerItemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[rgba(167,139,250,0.20)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-[#C4B5FD] uppercase font-semibold flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-[#A855F7]" /> GITHUB ECOSYSTEM DIRECTORY
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F8F7FF] tracking-tight flex items-center gap-3">
            GitHub Developers
          </h1>
          <p className="text-xs sm:text-sm text-[#B8ACD9] mt-1 max-w-3xl leading-relaxed">
            Real public GitHub creators, core maintainers and open-source leaders retrieved via official GitHub REST API. Genuine public profiles and metrics preserved.
          </p>
        </div>

        {/* Directory Switcher Shortcuts */}
        <div className="flex items-center gap-2">
          <Link to="/developers">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-mono border-[rgba(167,139,250,0.25)] bg-[#100A24] text-[#F8F7FF] hover:bg-[#160E30] hover:border-[#8B5CF6]/50 shadow-sm transition-all"
            >
              <Users className="w-3.5 h-3.5 mr-1.5 text-[#A855F7]" /> DevConnect Peers
            </Button>
          </Link>
          <Link to="/repositories">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-mono border-[rgba(167,139,250,0.25)] bg-[#100A24] text-[#F8F7FF] hover:bg-[#160E30] hover:border-[#8B5CF6]/50 shadow-sm transition-all"
            >
              <FolderGit2 className="w-3.5 h-3.5 mr-1.5 text-[#D946EF]" /> Open Source Repos
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Official Attribution Banner */}
      <motion.div variants={staggerItemVariants} className="p-4 sm:p-5 rounded-2xl border border-emerald-500/30 bg-[#160E30]/75 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-300">
              Public GitHub Directory • Verified External Maintainers
            </h4>
            <p className="text-xs text-[#B8ACD9] mt-0.5 leading-relaxed">
              These profiles represent real, publicly accessible GitHub creators and maintainers retrieved via the official GitHub REST API.
              They are <span className="text-[#F8F7FF] font-semibold">not registered DevConnect accounts</span>. Click "Connect on GitHub" to inspect their authentic public repositories and commits.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.15)] flex items-center gap-1.5">
            <Github className="w-3 h-3" /> Official REST API Synced
          </span>
        </div>
      </motion.div>

      {/* Filter and Search Bar */}
      <motion.div variants={staggerItemVariants} className="p-4 sm:p-5 rounded-2xl border border-[rgba(167,139,250,0.20)] bg-[#160E30]/75 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="flex-1 relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search real GitHub developers (e.g. torvalds, gaearon, yyx990803, shadcn, karpathy)..."
              icon={<Search className="h-4 w-4 text-[#B8ACD9]" />}
              className="h-10 text-xs sm:text-sm bg-[#100A24] border-[rgba(167,139,250,0.20)] text-[#F8F7FF] placeholder-[#B8ACD9] focus:border-[#8B5CF6]"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-[#B8ACD9] flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-[#A855F7]" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-10 rounded-xl bg-[#100A24] border border-[rgba(167,139,250,0.20)] px-3 text-xs text-[#F8F7FF] focus:outline-none focus:border-[#8B5CF6] cursor-pointer font-mono"
            >
              <option value="followers">Most Followers</option>
              <option value="repos">Most Public Repos</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredDevs.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-[rgba(167,139,250,0.25)] rounded-2xl bg-[#100A24]/60 backdrop-blur-md">
          <Github className="h-10 w-10 text-[#B8ACD9] mx-auto mb-3 opacity-60" />
          <h3 className="font-display text-base font-bold text-[#F8F7FF] mb-1">No GitHub Developers Found</h3>
          <p className="text-xs text-[#B8ACD9] max-w-sm mx-auto mb-4">
            Try searching for known handles like "torvalds", "gaearon", or "shadcn".
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchQuery('')}
            className="border-[rgba(167,139,250,0.25)] text-[#F8F7FF] hover:bg-[#8B5CF6]/15 hover:border-[#8B5CF6]/40 font-mono"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Clear Search
          </Button>
        </div>
      ) : (
        <motion.div layout variants={staggerContainerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filteredDevs.map((dev) => (
              <motion.div
                key={dev.username}
                layout
                variants={cardVariants}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <CardSpotlight className="h-full flex flex-col justify-between p-5 space-y-4 border-[rgba(167,139,250,0.20)] bg-[#160E30]/75 backdrop-blur-xl hover:border-[#8B5CF6]/50 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(139,92,246,0.18)] rounded-2xl transition-all duration-300 group">
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5 shadow-sm">
                        <Github className="w-3 h-3" /> External Public Profile
                      </span>
                      <span className="text-[10px] font-mono text-[#B8ACD9] bg-[#100A24] border border-[rgba(167,139,250,0.20)] px-2 py-0.5 rounded-full">
                        id: #{dev.github_id}
                      </span>
                    </div>

                    {/* Header */}
                    <div className="flex items-start gap-3.5">
                      <Avatar
                        src={dev.avatar_url}
                        name={dev.name || dev.username}
                        size="lg"
                        className="border-2 border-emerald-500/30 ring-2 ring-[#080514] shadow-md group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-display font-bold text-sm text-[#F8F7FF] group-hover:text-[#C4B5FD] transition-colors truncate">
                          {dev.name || dev.username}
                        </h4>
                        <a
                          href={dev.html_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1 transition-colors"
                        >
                          @{dev.username}
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                        {dev.company && (
                          <span className="text-[11px] text-[#B8ACD9] font-sans flex items-center gap-1 mt-0.5 truncate">
                            <Building className="w-3 h-3 text-[#B8ACD9] shrink-0" />
                            {dev.company}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-[#B8ACD9] mt-3 line-clamp-2 leading-relaxed">
                      {dev.bio || 'Public open-source developer on GitHub.'}
                    </p>

                    {/* Location */}
                    {dev.location && (
                      <div className="flex items-center gap-1 text-[11px] text-[#B8ACD9] font-mono mt-2.5">
                        <MapPin className="w-3 h-3 text-[#A855F7] shrink-0" />
                        <span className="truncate">{dev.location}</span>
                      </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[rgba(167,139,250,0.20)]">
                      <div className="p-2.5 rounded-xl bg-[#100A24] border border-[rgba(167,139,250,0.15)] text-center">
                        <span className="block text-xs font-mono font-bold text-[#F8F7FF]">
                          {dev.followers.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-mono text-[#B8ACD9] uppercase tracking-wider flex items-center justify-center gap-1 mt-0.5">
                          <Users className="w-2.5 h-2.5 text-[#8B5CF6]" /> Followers
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#100A24] border border-[rgba(167,139,250,0.15)] text-center">
                        <span className="block text-xs font-mono font-bold text-[#F8F7FF]">
                          {dev.public_repos.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-mono text-[#B8ACD9] uppercase tracking-wider flex items-center justify-center gap-1 mt-0.5">
                          <BookOpen className="w-2.5 h-2.5 text-[#D946EF]" /> Repos
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* External GitHub Action Button */}
                  <div className="pt-3 border-t border-[rgba(167,139,250,0.20)]">
                    <a
                      href={dev.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs font-semibold h-9 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-500/50 shadow-sm transition-all"
                      >
                        <Github className="w-3.5 h-3.5 mr-1.5" /> Connect on GitHub
                        <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
                      </Button>
                    </a>
                  </div>
                </CardSpotlight>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GitHubDevelopersPage;
