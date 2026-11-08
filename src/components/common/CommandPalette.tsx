import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import {
  LayoutDashboard,
  Users,
  Compass,
  FolderGit2,
  GitBranch,
  Users2,
  Sparkles,
  Trophy,
  MessageSquare,
  Bell,
  Code2,
  GraduationCap,
  Activity,
  Plus,
  Settings,
  Github,
  Radio,
  Search,
} from 'lucide-react';

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = isControlled ? setControlledOpen : setOpen;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen?.(!isOpen);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isOpen, setIsOpen]);

  const runCommand = (command: () => void) => {
    setIsOpen?.(false);
    command();
  };

  return (
    <CommandDialog isOpen={isOpen} onClose={() => setIsOpen?.(false)}>
      <CommandInput placeholder="Type a command, tool, or navigate..." className="text-xs font-mono" />
      <CommandList className="max-h-[360px] overflow-y-auto no-scrollbar py-2">
        <CommandEmpty className="py-6 text-center text-xs text-[#98A6BD] font-mono">
          No matching command or destination found.
        </CommandEmpty>

        <CommandGroup heading="PRIMARY WORKSPACE">
          <CommandItem
            onSelect={() => runCommand(() => navigate('/dashboard'))}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-mono cursor-pointer rounded-lg hover:bg-[#19253A]"
          >
            <LayoutDashboard className="h-4 w-4 text-[#638DFF]" />
            <span>Developer Dashboard</span>
            <CommandShortcut className="text-[10px] font-mono">G D</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate('/developers'))}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-mono cursor-pointer rounded-lg hover:bg-[#19253A]"
          >
            <Users className="h-4 w-4 text-[#638DFF]" />
            <span>Discover Developers</span>
            <CommandShortcut className="text-[10px] font-mono">G T</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate('/developers?tab=github'))}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-mono cursor-pointer rounded-lg hover:bg-[#19253A]"
          >
            <Github className="h-4 w-4 text-emerald-400" />
            <span>External GitHub Creators</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate('/projects'))}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-mono cursor-pointer rounded-lg hover:bg-[#19253A]"
          >
            <Compass className="h-4 w-4 text-[#638DFF]" />
            <span>Explore Projects</span>
            <CommandShortcut className="text-[10px] font-mono">G P</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate('/repositories'))}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-mono cursor-pointer rounded-lg hover:bg-[#19253A]"
          >
            <GitBranch className="h-4 w-4 text-[#55D9FF]" />
            <span>Open Source Repositories (40+)</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate('/teams'))}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-mono cursor-pointer rounded-lg hover:bg-[#19253A]"
          >
            <Users2 className="h-4 w-4 text-[#9875FF]" />
            <span>Collaborative Squads</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator className="my-2 bg-[#27334B]" />

        <CommandGroup heading="COLLABORATION & INTELLIGENCE">
          <CommandItem
            onSelect={() => runCommand(() => navigate('/build-in-public'))}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-mono cursor-pointer rounded-lg hover:bg-[#19253A]"
          >
            <Radio className="h-4 w-4 text-rose-400" />
            <span>Build in Public Feed</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate('/ai-tools'))}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-mono cursor-pointer rounded-lg hover:bg-[#19253A]"
          >
            <Sparkles className="h-4 w-4 text-[#FFBD59]" />
            <span>AI Developer Suite (10 Engines)</span>
            <CommandShortcut className="text-[10px] font-mono">AI</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate('/leaderboard'))}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-mono cursor-pointer rounded-lg hover:bg-[#19253A]"
          >
            <Trophy className="h-4 w-4 text-[#FFBD59]" />
            <span>Reputation & Leaderboard</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate('/challenges'))}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-mono cursor-pointer rounded-lg hover:bg-[#19253A]"
          >
            <Code2 className="h-4 w-4 text-[#31D69A]" />
            <span>Coding Challenges</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate('/mentorship'))}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-mono cursor-pointer rounded-lg hover:bg-[#19253A]"
          >
            <GraduationCap className="h-4 w-4 text-[#638DFF]" />
            <span>Engineering Mentorship</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate('/analytics'))}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-mono cursor-pointer rounded-lg hover:bg-[#19253A]"
          >
            <Activity className="h-4 w-4 text-[#55D9FF]" />
            <span>Developer Velocity & Analytics</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator className="my-2 bg-[#27334B]" />

        <CommandGroup heading="QUICK ACTIONS">
          <CommandItem
            onSelect={() => runCommand(() => navigate('/projects/new'))}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-mono cursor-pointer rounded-lg hover:bg-[#19253A]"
          >
            <Plus className="h-4 w-4 text-[#31D69A]" />
            <span>Create New Project Workspace</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate('/profile/edit'))}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-mono cursor-pointer rounded-lg hover:bg-[#19253A]"
          >
            <Settings className="h-4 w-4 text-[#98A6BD]" />
            <span>Edit Profile & Avatar</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate('/messages'))}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-mono cursor-pointer rounded-lg hover:bg-[#19253A]"
          >
            <MessageSquare className="h-4 w-4 text-[#638DFF]" />
            <span>Open Communications</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
