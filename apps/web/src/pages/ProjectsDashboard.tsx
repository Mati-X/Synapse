import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectItem } from '../types/workflow';
import { useWorkflowStore } from '../store/workflowStore';
import { useAuthStore } from '../store/authStore';
import { BorderGlow } from '../components/reactbits/BorderGlow';
import { SpecularButton } from '../components/reactbits/SpecularButton';
import {
  Plus,
  Search,
  Zap,
  Clock,
  Star,
  LayoutGrid,
  List,
  ShieldCheck,
  Activity,
  Layers,
  Copy,
  Trash2,
  GitBranch,
  Globe,
  FolderOpen,
  Database,
  LogOut,
  ArrowUpRight,
  Terminal,
  LogIn,
} from 'lucide-react';

export interface ProjectsDashboardProps {
  onOpenStudio?: () => void;
  onLogout?: () => void;
}

const CATEGORY_ACCENTS: Record<
  string,
  {
    glowColor: string;
    ledBg: string;
    ledBorder: string;
    ledShadow: string;
    text: string;
    badgeBorder: string;
    badgeBg: string;
  }
> = {
  FINANCE: {
    glowColor: '16, 185, 129',
    ledBg: 'bg-emerald-400',
    ledBorder: 'border-emerald-300',
    ledShadow: 'shadow-[0_0_8px_rgba(16,185,129,0.85)]',
    text: 'text-emerald-400',
    badgeBorder: 'border-emerald-500/35',
    badgeBg: 'bg-emerald-500/10',
  },
  DEVOPS: {
    glowColor: '56, 189, 248',
    ledBg: 'bg-sky-400',
    ledBorder: 'border-sky-300',
    ledShadow: 'shadow-[0_0_8px_rgba(56,189,248,0.85)]',
    text: 'text-sky-400',
    badgeBorder: 'border-sky-500/35',
    badgeBg: 'bg-sky-500/10',
  },
  'AI & LLM': {
    glowColor: '245, 158, 11',
    ledBg: 'bg-amber-400',
    ledBorder: 'border-amber-300',
    ledShadow: 'shadow-[0_0_8px_rgba(245,158,11,0.85)]',
    text: 'text-amber-400',
    badgeBorder: 'border-amber-500/35',
    badgeBg: 'bg-amber-500/10',
  },
  ECOMMERCE: {
    glowColor: '244, 63, 94',
    ledBg: 'bg-rose-400',
    ledBorder: 'border-rose-300',
    ledShadow: 'shadow-[0_0_8px_rgba(244,63,94,0.85)]',
    text: 'text-rose-400',
    badgeBorder: 'border-rose-500/35',
    badgeBg: 'bg-rose-500/10',
  },
};

const DEFAULT_ACCENT = {
  glowColor: '245, 158, 11',
  ledBg: 'bg-amber-400',
  ledBorder: 'border-amber-300',
  ledShadow: 'shadow-[0_0_8px_rgba(245,158,11,0.85)]',
  text: 'text-amber-400',
  badgeBorder: 'border-amber-500/35',
  badgeBg: 'bg-amber-500/10',
};

export const ProjectsDashboard: React.FC<ProjectsDashboardProps> = () => {
  const navigate = useNavigate();
  const { loadWorkflow, createNewWorkflow } = useWorkflowStore();
  const { user, logout } = useAuthStore();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeNav, setActiveNav] = useState<'all' | 'recents' | 'favorites' | 'templates'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(() => projects.length === 0);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchWorkflows();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchWorkflows = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/workflows`);
      if (res.ok) {
        const data = await res.json();
        if (data.workflows && data.workflows.length > 0) {
          setProjects(data.workflows);
          setIsDbConnected(true);
          if (favoriteIds.length === 0) {
            setFavoriteIds(data.workflows.slice(0, 2).map((w: ProjectItem) => w.id));
          }
        }
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const categories = ['ALL', 'FINANCE', 'DEVOPS', 'AI & LLM', 'ECOMMERCE'];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ALL' || project.category === selectedCategory;

    const matchesNav =
      activeNav === 'all'
        ? true
        : activeNav === 'favorites'
        ? favoriteIds.includes(project.id)
        : activeNav === 'recents'
        ? project.status === 'ACTIVE' || project.updatedAt === 'just now'
        : project.nodes.length >= 2;

    return matchesSearch && matchesCategory && matchesNav;
  });

  const handleLaunchProject = (project: ProjectItem) => {
    loadWorkflow(project.name, project.nodes, project.edges, project.id);
    navigate(`/studio/${project.id}`);
  };

  const handleCreateNew = async () => {
    const newId = crypto.randomUUID();
    const defaultNodes = [
      {
        id: 'trigger_1',
        type: 'triggerNode',
        position: { x: 100, y: 150 },
        data: {
          title: 'Incoming Webhook',
          type: 'TRIGGER',
          category: 'TRIGGER',
          config: {},
          status: 'IDLE',
        },
      },
    ];

    try {
      const res = await fetch(`${apiUrl}/api/workflows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newId,
          name: 'Unnamed Pipeline',
          nodes: defaultNodes,
          edges: [],
        }),
      });

      if (res.ok) {
        const created = await res.json();
        createNewWorkflow(created.name, created.id);
        navigate(`/studio/${created.id}`);
        return;
      }
    } catch {}

    createNewWorkflow('Unnamed Pipeline', newId);
    navigate(`/studio/${newId}`);
  };

  const handleDuplicate = async (project: ProjectItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const newId = crypto.randomUUID();
    const duplicateName = `${project.name} (Copy)`;

    try {
      const res = await fetch(`${apiUrl}/api/workflows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newId,
          name: duplicateName,
          description: project.description,
          category: project.category,
          nodes: project.nodes,
          edges: project.edges,
        }),
      });

      if (res.ok) {
        fetchWorkflows();
        return;
      }
    } catch {}

    const duplicated: ProjectItem = {
      ...project,
      id: newId,
      name: duplicateName,
      status: 'DRAFT',
      updatedAt: 'just now',
      executionsCount: 0,
    };
    setProjects([duplicated, ...projects]);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`${apiUrl}/api/workflows/${id}`, { method: 'DELETE' });
    } catch {}

    setProjects(projects.filter((p) => p.id !== id));
  };

  const totalNodesCount = projects.reduce((acc, p) => acc + (p.nodes?.length || 0), 0);
  const activePipelinesCount = projects.filter((p) => p.status === 'ACTIVE').length;

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#070709] text-zinc-100 font-sans select-none antialiased">
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-60"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <aside className="relative z-30 w-68 border-r border-zinc-800/90 bg-gradient-to-b from-zinc-900/90 via-zinc-950/95 to-[#070709] backdrop-blur-xl flex flex-col justify-between shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col min-h-0">
          <div className="p-3.5 border-b border-zinc-800/80 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 cursor-pointer group text-left min-w-0"
            >
              <div className="size-8 font-mono font-bold text-sm rounded-lg flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-500 text-zinc-950 shadow-[0_0_12px_rgba(245,158,11,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] border border-amber-300/40 shrink-0 group-hover:scale-105 transition-transform">
                S
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-sans font-bold text-xs text-zinc-100 tracking-tight truncate">
                  Synapse Patchbay
                </span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider truncate">
                  DAG Studio Rack
                </span>
              </div>
            </button>

            <span className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[9px] font-mono font-bold text-zinc-400 uppercase">
              v0.1
            </span>
          </div>

          <div className="p-3 border-b border-zinc-800/70">
            <div className="rounded-xl bg-zinc-950/95 border border-zinc-800/90 p-2.5 shadow-[inset_0_2px_5px_rgba(0,0,0,0.9)] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-7 px-2 rounded-md bg-zinc-900 border border-zinc-700/80 flex items-center gap-1.5 shrink-0">
                  <span
                    className={`w-1.5 h-3 rounded-xs ${
                      user
                        ? 'bg-emerald-400 border border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.9)]'
                        : 'bg-amber-400 border border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.9)]'
                    }`}
                  />
                  <span className="text-[9px] font-mono font-bold text-zinc-300 uppercase">
                    {user ? 'AUTH' : 'GUEST'}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-zinc-100 truncate">
                    {user ? user.name : 'Anonymous Operator'}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 truncate">
                    {user ? user.email : 'Local Session Mode'}
                  </span>
                </div>
              </div>

              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="p-1.5 rounded-lg bg-zinc-900/90 hover:bg-rose-950/50 border border-zinc-800 hover:border-rose-500/40 text-zinc-400 hover:text-rose-300 transition-colors cursor-pointer shrink-0"
                  title="Sign Out"
                >
                  <LogOut className="size-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="p-1.5 rounded-lg bg-zinc-900/90 hover:bg-sky-950/50 border border-zinc-800 hover:border-sky-500/40 text-zinc-400 hover:text-sky-300 transition-colors cursor-pointer shrink-0"
                  title="Sign In"
                >
                  <LogIn className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="px-3 pt-3 pb-2">
            <div className="px-2 pb-2 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                01 / Bay Selectors
              </span>
              <span className="text-[9px] font-mono text-zinc-600 uppercase">CH 1–4</span>
            </div>

            <div className="space-y-1.5">
              {[
                {
                  id: 'all' as const,
                  label: 'All Workflows',
                  code: 'BAY 01',
                  icon: FolderOpen,
                  count: projects.length,
                  ledActive: 'bg-amber-400 border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.9)]',
                  iconColor: 'text-amber-400',
                },
                {
                  id: 'recents' as const,
                  label: 'Active & Recent',
                  code: 'BAY 02',
                  icon: Clock,
                  count: activePipelinesCount,
                  ledActive: 'bg-sky-400 border-sky-300 shadow-[0_0_8px_rgba(56,189,248,0.9)]',
                  iconColor: 'text-sky-400',
                },
                {
                  id: 'favorites' as const,
                  label: 'Pinned Favorites',
                  code: 'BAY 03',
                  icon: Star,
                  count: favoriteIds.length,
                  ledActive: 'bg-amber-400 border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.9)]',
                  iconColor: 'text-amber-400',
                },
                {
                  id: 'templates' as const,
                  label: 'Multi-Node Recipes',
                  code: 'BAY 04',
                  icon: Layers,
                  count: projects.filter((p) => p.nodes.length >= 2).length,
                  ledActive: 'bg-emerald-400 border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.9)]',
                  iconColor: 'text-emerald-400',
                },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveNav(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-zinc-900/95 border-zinc-700/90 text-zinc-100 shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]'
                        : 'bg-zinc-950/50 border-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 hover:border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-1.5 h-3 rounded-xs border transition-all shrink-0 ${
                          isActive ? item.ledActive : 'bg-zinc-800 border-zinc-700'
                        }`}
                      />
                      <Icon className={`size-3.5 shrink-0 ${isActive ? item.iconColor : 'text-zinc-500'}`} />
                      <span className="truncate font-medium">{item.label}</span>
                    </div>
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                        isActive
                          ? 'bg-zinc-950 border-zinc-700 text-zinc-200 font-bold'
                          : 'bg-zinc-950/80 border-zinc-800/80 text-zinc-500'
                      }`}
                    >
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-3 pt-3 pb-2 flex-1 overflow-y-auto">
            <div className="px-2 pb-2 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                02 / Quick Patch Ports
              </span>
              <span className="text-[9px] font-mono text-zinc-600 uppercase">DIRECT</span>
            </div>

            <div className="space-y-1">
              {projects.slice(0, 4).map((p) => {
                const accent = CATEGORY_ACCENTS[p.category] || DEFAULT_ACCENT;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleLaunchProject(p)}
                    className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-950/60 hover:bg-zinc-900/90 border border-transparent hover:border-zinc-800 text-xs text-zinc-400 hover:text-zinc-100 transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-1 h-2.5 rounded-xs shrink-0 ${accent.ledBg} opacity-75 group-hover:opacity-100`}
                      />
                      <span className="truncate font-mono text-[11px]">{p.name}</span>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-600 group-hover:text-zinc-400 shrink-0">
                      {p.nodes.length}N
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-3.5 border-t border-zinc-800/80 bg-zinc-950/90 space-y-2.5">
          <div className="rounded-xl bg-[#070709] border border-zinc-800/90 p-2.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <div className="flex items-center gap-2">
                <span
                  className={`w-1.5 h-3 rounded-xs border ${
                    isDbConnected
                      ? 'bg-emerald-400 border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.9)]'
                      : 'bg-amber-400 border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.9)]'
                  }`}
                />
                <span className="font-bold text-zinc-200 uppercase tracking-wider">
                  {isDbConnected ? 'POSTGRESQL LIVE' : 'LOCAL MEMORY'}
                </span>
              </div>
              <span className="flex items-center gap-1 text-zinc-500">
                <Database className="size-3 text-sky-400" />
                <span>UUIDv4</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-zinc-800/60 text-[10px] font-mono">
              <div className="bg-zinc-900/60 rounded px-2 py-1 flex items-center justify-between">
                <span className="text-zinc-500">PIPELINES</span>
                <span className="text-zinc-200 font-bold">{projects.length}</span>
              </div>
              <div className="bg-zinc-900/60 rounded px-2 py-1 flex items-center justify-between">
                <span className="text-zinc-500">NODES</span>
                <span className="text-amber-400 font-bold">{totalNodesCount}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="relative z-10 flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-zinc-800/80 bg-[#070709]/85 backdrop-blur-xl px-6 lg:px-8 flex items-center shrink-0 z-20">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-7 px-2.5 rounded-md bg-zinc-950 border border-zinc-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] flex items-center gap-2 shrink-0">
                <span className="w-1.5 h-3 rounded-xs bg-amber-400 border border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.9)]" />
                <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
                  {activeNav === 'all'
                    ? 'BAY 01'
                    : activeNav === 'recents'
                    ? 'BAY 02'
                    : activeNav === 'favorites'
                    ? 'BAY 03'
                    : 'BAY 04'}
                </span>
              </div>
              <h1 className="text-base font-bold text-zinc-100 tracking-tight truncate">
                {activeNav === 'all'
                  ? 'All Patched Pipelines'
                  : activeNav === 'recents'
                  ? 'Active & Recent Executions'
                  : activeNav === 'favorites'
                  ? 'Pinned Favorite Modules'
                  : 'Multi-Node DAG Templates'}
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'module' : 'modules'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-64 lg:w-80">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Filter pipelines, tags, nodes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-14 py-1.5 rounded-xl bg-zinc-950/95 border border-zinc-800/90 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/70 font-mono shadow-[inset_0_2px_5px_rgba(0,0,0,0.9)] transition-colors"
                />
                <kbd className="hidden sm:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] font-mono text-zinc-500">
                  ⌘K
                </kbd>
              </div>

              <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-zinc-800 text-amber-400 border border-zinc-700/80 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                  }`}
                  title="Chassis Grid View"
                >
                  <LayoutGrid className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-zinc-800 text-amber-400 border border-zinc-700/80 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                  }`}
                  title="Rack List View"
                >
                  <List className="size-3.5" />
                </button>
              </div>

              <SpecularButton
                variant="primary"
                ledColor="amber"
                shortcut="NEW"
                onClick={handleCreateNew}
                className="px-3.5 py-2 text-[11px]"
              >
                <Plus className="size-3.5 stroke-[2.5]" />
                <span>New Pipeline</span>
              </SpecularButton>
            </div>
          </div>
        </header>

        <div className="px-6 lg:px-8 py-3 border-b border-zinc-800/70 bg-zinc-950/50 backdrop-blur-md shrink-0">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 mr-1">
                BUS FILTER:
              </span>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const accent = CATEGORY_ACCENTS[cat] || DEFAULT_ACCENT;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-zinc-900 border-zinc-700 text-zinc-100 shadow-[0_2px_8px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]'
                        : 'bg-zinc-950/80 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700/70'
                    }`}
                  >
                    <span
                      className={`w-1 h-2.5 rounded-xs ${
                        isSelected
                          ? `${accent.ledBg} ${accent.ledShadow}`
                          : 'bg-zinc-800'
                      }`}
                    />
                    <span>{cat === 'ALL' ? 'ALL CHANNELS' : cat}</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden xl:flex items-center gap-5 text-[11px] font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Activity className="size-3.5 text-sky-400" />
                <span>Kahn Sort:</span>
                <strong className="text-zinc-200">O(V + E)</strong>
              </span>
              <span className="text-zinc-800">|</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-400" />
                <span>DFS Cycle Guard:</span>
                <strong className="text-emerald-400">ARMED</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5 space-y-4 animate-pulse"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-zinc-800/60" />
                      <div className="space-y-2 flex-1">
                        <div className="h-3.5 bg-zinc-800/70 rounded w-2/3" />
                        <div className="h-2.5 bg-zinc-800/40 rounded w-1/3" />
                      </div>
                    </div>
                    <div className="h-32 rounded-xl bg-zinc-950/80 border border-zinc-800/60 w-full" />
                    <div className="pt-2 border-t border-zinc-800/60 flex justify-between">
                      <div className="h-4 bg-zinc-800/40 rounded w-20" />
                      <div className="h-4 bg-zinc-800/40 rounded w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="my-12 max-w-md mx-auto rounded-2xl border border-zinc-800/90 bg-gradient-to-b from-zinc-900/85 to-zinc-950/95 p-8 text-center shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
                <div className="size-12 rounded-xl bg-zinc-950 border border-zinc-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] flex items-center justify-center mx-auto mb-4 text-amber-400">
                  <Terminal className="size-5" />
                </div>
                <h3 className="text-sm font-bold text-zinc-100 mb-1">
                  No Patched Modules Matching Filter
                </h3>
                <p className="text-xs font-mono text-zinc-400 mb-6 leading-relaxed">
                  Adjust your search query or initialize a fresh webhook pipeline on the Studio canvas.
                </p>
                <div className="flex justify-center gap-3">
                  {searchQuery || selectedCategory !== 'ALL' || activeNav !== 'all' ? (
                    <SpecularButton
                      variant="secondary"
                      ledColor="sky"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('ALL');
                        setActiveNav('all');
                      }}
                      className="px-3.5 py-2 text-[11px]"
                    >
                      <span>Reset Filters</span>
                    </SpecularButton>
                  ) : null}
                  <SpecularButton
                    variant="primary"
                    ledColor="amber"
                    onClick={handleCreateNew}
                    className="px-3.5 py-2 text-[11px]"
                  >
                    <Plus className="size-3.5" />
                    <span>Create Pipeline</span>
                  </SpecularButton>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.map((project) => {
                  const accent = CATEGORY_ACCENTS[project.category] || DEFAULT_ACCENT;
                  const isFav = favoriteIds.includes(project.id);
                  const nodeCount = project.nodes?.length || 0;
                  const edgeCount = project.edges?.length || 0;

                  return (
                    <BorderGlow
                      key={project.id}
                      accentRgb={accent.glowColor}
                      borderRadius="1rem"
                      className="cursor-pointer group"
                    >
                      <div
                        onClick={() => handleLaunchProject(project)}
                        className="h-full flex flex-col justify-between p-5 bg-gradient-to-b from-zinc-900/90 via-zinc-900/95 to-zinc-950/98 rounded-[calc(1rem-1px)]"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-zinc-800/80">
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`size-10 rounded-xl bg-zinc-950 border ${accent.badgeBorder} flex items-center justify-center shrink-0 ${accent.text} shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]`}
                              >
                                <Zap className="size-4" />
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-bold text-sm text-zinc-100 group-hover:text-white transition-colors truncate">
                                  {project.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className={`text-[10px] font-mono font-bold uppercase ${accent.text}`}>
                                    {project.category}
                                  </span>
                                  <span className="text-zinc-700">•</span>
                                  <span className="text-[10px] font-mono text-zinc-500">
                                    {project.updatedAt}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={(e) => toggleFavorite(project.id, e)}
                                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                  isFav
                                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                                    : 'bg-zinc-950/90 border-zinc-800/90 text-zinc-500 hover:text-zinc-300'
                                }`}
                                title="Pin Pipeline"
                              >
                                <Star className={`size-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                              </button>

                              <div className="h-7 px-2.5 rounded-lg bg-zinc-950/95 border border-zinc-800/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.95)] flex items-center gap-1.5">
                                <span
                                  className={`w-1.5 h-3 rounded-xs border ${
                                    project.status === 'ACTIVE'
                                      ? 'bg-emerald-400 border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.9)]'
                                      : 'bg-zinc-600 border-zinc-500'
                                  }`}
                                />
                                <span className="text-[9px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
                                  {project.status}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="my-3.5 h-32 w-full rounded-xl bg-[#070709] border border-zinc-800/90 shadow-[inset_0_2px_8px_rgba(0,0,0,0.95)] relative overflow-hidden flex items-center justify-between px-4">
                            <div
                              className="absolute inset-0 opacity-35 pointer-events-none"
                              style={{
                                backgroundImage:
                                  'radial-gradient(circle, rgba(255,255,255,0.14) 1px, transparent 1px)',
                                backgroundSize: '14px 14px',
                              }}
                            />

                            <svg
                              className="absolute inset-0 w-full h-full pointer-events-none"
                              viewBox="0 0 320 120"
                               preserveAspectRatio="none"
                            >
                              <path
                                d="M 88 60 C 125 60, 125 60, 155 60"
                                fill="none"
                                stroke="#38bdf8"
                                strokeWidth="4"
                                opacity="0.18"
                              />
                              <path
                                d="M 88 60 C 125 60, 125 60, 155 60"
                                fill="none"
                                stroke="#38bdf8"
                                strokeWidth="1.5"
                                strokeDasharray="4 4"
                              />
                              <path
                                d="M 205 52 C 230 52, 230 36, 255 36"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="1.5"
                                strokeDasharray="4 4"
                              />
                              <path
                                d="M 205 68 C 230 68, 230 84, 255 84"
                                fill="none"
                                stroke="#f43f5e"
                                strokeWidth="1.5"
                                opacity="0.65"
                              />
                            </svg>

                            <div className="relative z-10 flex items-center justify-between w-full">
                              <div className="px-2.5 py-2 rounded-lg bg-zinc-900/95 border border-zinc-700/80 shadow-md flex items-center gap-2">
                                <Zap className="size-3.5 text-amber-400" />
                                <span className="text-[9px] font-mono font-bold text-zinc-200 uppercase">
                                  TRIG
                                </span>
                                <span className="w-1 h-2.5 rounded-xs bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.9)]" />
                              </div>

                              <div className="px-2.5 py-2 rounded-lg bg-zinc-900/95 border border-zinc-700/80 shadow-md flex items-center gap-2">
                                <span className="w-1 h-2.5 rounded-xs bg-sky-400" />
                                <GitBranch className="size-3.5 text-sky-400" />
                                <span className="text-[9px] font-mono font-bold text-zinc-200 uppercase">
                                  ===
                                </span>
                              </div>

                              <div className="flex flex-col gap-2">
                                <div className="px-2 py-1 rounded-md bg-zinc-900/95 border border-emerald-500/40 flex items-center gap-1.5">
                                  <span className="w-1 h-2 rounded-xs bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.9)]" />
                                  <Globe className="size-3 text-emerald-400" />
                                  <span className="text-[8px] font-mono font-bold text-emerald-300">
                                    200
                                  </span>
                                </div>
                                <div className="px-2 py-1 rounded-md bg-zinc-900/95 border border-rose-500/35 flex items-center gap-1.5 opacity-80">
                                  <span className="w-1 h-2 rounded-xs bg-rose-400" />
                                  <Globe className="size-3 text-rose-400" />
                                  <span className="text-[8px] font-mono font-bold text-rose-300">
                                    ERR
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="absolute bottom-2 left-2.5 flex items-center gap-1.5">
                              {project.tags?.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-1.5 py-0.5 rounded bg-zinc-950/90 border border-zinc-800/90 text-[9px] font-mono text-zinc-400"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <p className="text-xs font-mono text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                            {project.description || 'Deterministic webhook pipeline with topological execution.'}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <div className="h-7 px-2.5 rounded-lg bg-zinc-950 border border-zinc-800/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] flex items-center gap-2 text-[10px] font-mono">
                              <span className={`w-1 h-2.5 rounded-xs ${accent.ledBg}`} />
                              <span className="text-zinc-300 font-bold">{nodeCount} NODES</span>
                              <span className="text-zinc-700">•</span>
                              <span className="text-zinc-400">{edgeCount} CABLES</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => handleDuplicate(project, e)}
                              className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800/90 hover:border-zinc-700 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
                              title="Clone Module"
                            >
                              <Copy className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDelete(project.id, e)}
                              className="p-1.5 rounded-lg bg-zinc-950 hover:bg-rose-950/60 border border-zinc-800/90 hover:border-rose-500/40 text-zinc-400 hover:text-rose-300 transition-colors cursor-pointer"
                              title="Delete Module"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                            <div className="h-7 px-2.5 rounded-lg bg-zinc-900 group-hover:bg-amber-500/15 border border-zinc-700/80 group-hover:border-amber-500/50 flex items-center gap-1.5 text-[10px] font-mono font-bold text-zinc-200 group-hover:text-amber-300 transition-colors">
                              <span>MOUNT</span>
                              <ArrowUpRight className="size-3.5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </BorderGlow>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredProjects.map((project) => {
                  const accent = CATEGORY_ACCENTS[project.category] || DEFAULT_ACCENT;
                  const isFav = favoriteIds.includes(project.id);
                  return (
                    <BorderGlow
                      key={project.id}
                      accentRgb={accent.glowColor}
                      borderRadius="0.875rem"
                      className="cursor-pointer group"
                    >
                      <div
                        onClick={() => handleLaunchProject(project)}
                        className="px-4 py-3.5 bg-gradient-to-r from-zinc-900/90 via-zinc-900/95 to-zinc-950/95 rounded-[calc(0.875rem-1px)] flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <div className="h-8 px-2.5 rounded-lg bg-zinc-950 border border-zinc-800/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.95)] flex items-center gap-2 shrink-0">
                            <span
                              className={`w-1.5 h-3 rounded-xs border ${
                                project.status === 'ACTIVE'
                                  ? 'bg-emerald-400 border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.9)]'
                                  : 'bg-zinc-600 border-zinc-500'
                              }`}
                            />
                            <span className="text-[10px] font-mono font-bold text-zinc-300">
                              {project.status}
                            </span>
                          </div>

                          <div
                            className={`size-9 rounded-xl bg-zinc-950 border ${accent.badgeBorder} flex items-center justify-center shrink-0 ${accent.text}`}
                          >
                            <Zap className="size-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2.5">
                              <span className="font-bold text-sm text-zinc-100 group-hover:text-white truncate">
                                {project.name}
                              </span>
                              <span
                                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${accent.badgeBg} ${accent.badgeBorder} ${accent.text} uppercase`}
                              >
                                {project.category}
                              </span>
                            </div>
                            <span className="text-xs font-mono text-zinc-400 truncate block mt-0.5">
                              {project.description}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800/90 text-[11px] text-zinc-300">
                            <span>{project.nodes.length} NODES</span>
                            <span className="text-zinc-700">•</span>
                            <span className="text-zinc-400">{project.edges.length} CABLES</span>
                          </div>

                          <span className="hidden lg:inline text-[11px] text-zinc-500 w-20 text-right">
                            {project.updatedAt}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => toggleFavorite(project.id, e)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isFav
                                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                                : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                            }`}
                            title="Pin Pipeline"
                          >
                            <Star className={`size-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleDuplicate(project, e)}
                            className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
                            title="Clone Module"
                          >
                            <Copy className="size-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleDelete(project.id, e)}
                            className="p-1.5 rounded-lg bg-zinc-950 hover:bg-rose-950/60 border border-zinc-800 hover:border-rose-500/40 text-zinc-400 hover:text-rose-300 transition-colors cursor-pointer"
                            title="Delete Module"
                          >
                            <Trash2 className="size-3.5" />
                          </button>

                          <div className="h-8 px-3 rounded-lg bg-zinc-900 group-hover:bg-amber-500/15 border border-zinc-700/80 group-hover:border-amber-500/50 flex items-center gap-1.5 text-[11px] font-mono font-bold text-zinc-200 group-hover:text-amber-300 transition-colors">
                            <span>MOUNT</span>
                            <ArrowUpRight className="size-3.5" />
                          </div>
                        </div>
                      </div>
                    </BorderGlow>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
