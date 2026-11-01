import React, { useState } from 'react';
import { ProjectItem, mockProjects } from '../data/mockProjects';
import { useWorkflowStore } from '../store/workflowStore';
import {
  Plus,
  Search,
  Zap,
  Clock,
  Star,
  Settings,
  LayoutGrid,
  List,
  MoreVertical,
  ExternalLink,
  ShieldCheck,
  Activity,
  Layers,
  Copy,
  Trash2,
  GitBranch,
  Globe,
  FolderOpen,
  HelpCircle,
} from 'lucide-react';

export interface ProjectsDashboardProps {
  onOpenStudio: () => void;
}

export const ProjectsDashboard: React.FC<ProjectsDashboardProps> = ({ onOpenStudio }) => {
  const { loadWorkflow, createNewWorkflow } = useWorkflowStore();
  const [projects, setProjects] = useState<ProjectItem[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeNav, setActiveNav] = useState<'all' | 'recents' | 'favorites' | 'templates'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newPipelineName, setNewPipelineName] = useState('');

  const categories = ['ALL', 'FINANCE', 'DEVOPS', 'AI & LLM', 'ECOMMERCE'];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ALL' || project.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleLaunchProject = (project: ProjectItem) => {
    loadWorkflow(project.name, project.nodes, project.edges, project.id);
    onOpenStudio();
  };

  const handleCreateNew = () => {
    if (!newPipelineName.trim()) return;
    createNewWorkflow(newPipelineName.trim());
    setIsNewModalOpen(false);
    setNewPipelineName('');
    onOpenStudio();
  };

  const handleDuplicate = (project: ProjectItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const duplicated: ProjectItem = {
      ...project,
      id: `proj_${Date.now()}`,
      name: `${project.name} (Copy)`,
      status: 'DRAFT',
      updatedAt: 'just now',
      executionsCount: 0,
    };
    setProjects([duplicated, ...projects]);
    setActiveMenuId(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjects(projects.filter((p) => p.id !== id));
    setActiveMenuId(null);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070709] text-zinc-100 font-sans select-none antialiased">
      {/* 1. Left Sidebar (Figma Style) */}
      <aside className="w-64 border-r border-zinc-800/80 bg-zinc-950 flex flex-col justify-between shrink-0 z-30">
        <div>
          {/* Workspace Switcher Header */}
          <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center font-mono font-bold text-zinc-950 shadow-[0_0_14px_rgba(245,158,11,0.35)] border border-amber-300/40">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-xs text-zinc-100 tracking-tight">
                  Synapse Workspace
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  Production DAG Cluster
                </span>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <div className="p-3 space-y-1">
            <button
              onClick={() => setActiveNav('all')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeNav === 'all'
                  ? 'bg-zinc-800/90 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <FolderOpen className="size-4 text-amber-400" />
              <span>All Workflows</span>
              <span className="ml-auto font-mono text-[10px] text-zinc-400 bg-zinc-900 px-1.5 py-0.2 rounded">
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveNav('recents')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeNav === 'recents'
                  ? 'bg-zinc-800/90 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Clock className="size-4 text-sky-400" />
              <span>Recents</span>
            </button>

            <button
              onClick={() => setActiveNav('favorites')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeNav === 'favorites'
                  ? 'bg-zinc-800/90 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Star className="size-4 text-amber-400" />
              <span>Pinned Favorites</span>
            </button>

            <button
              onClick={() => setActiveNav('templates')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeNav === 'templates'
                  ? 'bg-zinc-800/90 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Layers className="size-4 text-emerald-400" />
              <span>Templates & Recipes</span>
            </button>
          </div>

          {/* Quick Pinned Workflows */}
          <div className="px-5 pt-3 pb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Pinned Pipelines
            </span>
          </div>
          <div className="px-3 space-y-0.5">
            {projects.slice(0, 3).map((p) => (
              <button
                key={p.id}
                onClick={() => handleLaunchProject(p)}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-900/80 transition-colors text-left truncate cursor-pointer group"
              >
                <span className="size-1.5 rounded-full bg-emerald-400 shrink-0 group-hover:scale-125 transition-transform" />
                <span className="truncate">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-zinc-300">Engine Online</span>
            </div>
            <span>28ms Kahn</span>
          </div>
          <div className="flex items-center justify-between pt-1 text-zinc-400 text-xs">
            <button className="hover:text-white flex items-center gap-1 cursor-pointer">
              <Settings className="size-3.5" />
              <span>Settings</span>
            </button>
            <button className="hover:text-white flex items-center gap-1 cursor-pointer">
              <HelpCircle className="size-3.5" />
              <span>Docs</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-14 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold text-zinc-100 tracking-tight">
              {activeNav === 'all'
                ? 'All Pipelines'
                : activeNav === 'recents'
                ? 'Recent Executions'
                : activeNav === 'favorites'
                ? 'Pinned Favorites'
                : 'Workflow Templates'}
            </h1>
            <span className="text-xs font-mono text-zinc-400">
              ({filteredProjects.length} items)
            </span>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-80">
              <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search workflows, tags, endpoints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/70 font-mono shadow-inner"
              />
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="size-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="List View"
              >
                <List className="size-3.5" />
              </button>
            </div>

            {/* New Workflow Button */}
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-semibold text-xs shadow-[0_0_16px_rgba(245,158,11,0.35)] transition-all cursor-pointer active:scale-95"
            >
              <Plus className="size-3.5 stroke-[2.5]" />
              <span>New Pipeline</span>
            </button>
          </div>
        </header>

        {/* Filter Pills Bar */}
        <div className="px-6 py-3 border-b border-zinc-800/80 bg-zinc-950/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-zinc-200 text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 bg-zinc-900/60 border border-zinc-800/60'
                }`}
              >
                {cat === 'ALL' ? 'All' : cat}
              </button>
            ))}
          </div>

          {/* Quick Metrics Strip */}
          <div className="hidden lg:flex items-center gap-4 text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1">
              <Activity className="size-3 text-sky-400" />
              <span>96.8K runs today</span>
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-3 text-emerald-400" />
              <span>100% DAG safe</span>
            </span>
          </div>
        </div>

        {/* Main Workflows Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredProjects.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-zinc-500 font-mono text-xs">
              <FolderOpen className="size-8 opacity-30 mb-2" />
              <span>No workflows found matching criteria.</span>
            </div>
          ) : viewMode === 'grid' ? (
            /* Figma File Grid */
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleLaunchProject(project)}
                  className="group relative rounded-xl border border-zinc-800/90 bg-zinc-900/70 hover:bg-zinc-900/95 hover:border-zinc-700/80 transition-all duration-200 overflow-hidden cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.5)] flex flex-col"
                >
                  {/* Figma-style Visual Canvas Thumbnail Preview */}
                  <div className="h-38 w-full bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center border-b border-zinc-800/80 p-4 group-hover:bg-[#0c0c14] transition-colors">
                    {/* Dot Grid Background */}
                    <div
                      className="absolute inset-0 opacity-25 pointer-events-none"
                      style={{
                        backgroundImage: 'radial-gradient(circle, #71717a 1px, transparent 1px)',
                        backgroundSize: '16px 16px',
                      }}
                    />

                    {/* Micro DAG Nodes Illustration */}
                    <div className="relative z-10 flex items-center gap-3">
                      {/* Node 1: Trigger */}
                      <div className="size-9 rounded-lg bg-zinc-900 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.2)] flex items-center justify-center text-amber-400">
                        <Zap className="size-4" />
                      </div>

                      {/* Cable 1 */}
                      <div className="w-6 h-0.5 bg-gradient-to-r from-amber-400 to-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.6)]" />

                      {/* Node 2: Condition */}
                      <div className="size-9 rounded-lg bg-zinc-900 border border-sky-500/50 shadow-[0_0_12px_rgba(56,189,248,0.2)] flex items-center justify-center text-sky-400">
                        <GitBranch className="size-4" />
                      </div>

                      {/* Cable 2 */}
                      <div className="flex flex-col gap-2">
                        <div className="w-5 h-0.5 bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                        <div className="w-5 h-0.5 bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
                      </div>

                      {/* Node 3: Sinks */}
                      <div className="flex flex-col gap-1.5">
                        <div className="size-6 rounded-md bg-zinc-900 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                          <Globe className="size-3" />
                        </div>
                        <div className="size-6 rounded-md bg-zinc-900 border border-rose-500/50 flex items-center justify-center text-rose-400">
                          <Globe className="size-3" />
                        </div>
                      </div>
                    </div>

                    {/* Hover Action Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs flex items-center justify-center gap-2">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs shadow-lg transition-transform transform group-hover:scale-105">
                        <span>Open in Studio</span>
                        <ExternalLink className="size-3.5" />
                      </span>
                    </div>

                    {/* Status Pill Badge */}
                    <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-950/80 border border-zinc-800 text-[10px] font-mono">
                      <span
                        className={`size-1.5 rounded-full ${
                          project.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-zinc-500'
                        }`}
                      />
                      <span className="text-zinc-300 font-semibold">{project.status}</span>
                    </div>
                  </div>

                  {/* Card Metadata Footer */}
                  <div className="p-3.5 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-xs text-zinc-100 group-hover:text-amber-300 transition-colors truncate">
                          {project.name}
                        </h3>

                        {/* Three dots menu */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === project.id ? null : project.id);
                            }}
                            className="text-zinc-500 hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors"
                          >
                            <MoreVertical className="size-3.5" />
                          </button>

                          {activeMenuId === project.id && (
                            <div className="absolute right-0 top-full mt-1 w-36 bg-zinc-900 border border-zinc-700/80 rounded-lg p-1 shadow-2xl z-50 text-xs">
                              <button
                                onClick={(e) => handleDuplicate(project, e)}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white text-left"
                              >
                                <Copy className="size-3" />
                                <span>Duplicate</span>
                              </button>
                              <button
                                onClick={(e) => handleDelete(project.id, e)}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-rose-950/40 text-rose-400 text-left"
                              >
                                <Trash2 className="size-3" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                        {project.description}
                      </p>
                    </div>

                    {/* Bottom stats row */}
                    <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                      <span className="text-zinc-300 bg-zinc-800/60 px-1.5 py-0.5 rounded border border-zinc-700/40 font-bold uppercase">
                        {project.category}
                      </span>
                      <span>{project.updatedAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Figma / Linear Table List View */
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 overflow-hidden divide-y divide-zinc-800/80">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleLaunchProject(project)}
                  className="px-4 py-3 flex items-center justify-between hover:bg-zinc-800/50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="size-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 text-amber-400">
                      <Zap className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-zinc-100 group-hover:text-amber-300 truncate">
                          {project.name}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400 bg-zinc-800 px-1.5 py-0.2 rounded uppercase">
                          {project.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 truncate block">
                        {project.description}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0 text-xs font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`size-1.5 rounded-full ${
                          project.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-zinc-500'
                        }`}
                      />
                      <span>{project.status}</span>
                    </span>
                    <span>{project.nodes.length} nodes</span>
                    <span>{project.updatedAt}</span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLaunchProject(project);
                      }}
                      className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-200 text-xs font-semibold transition-colors"
                    >
                      Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Pipeline Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-700/80 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-semibold text-zinc-100">Create New Pipeline</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Name your workflow graph. You can start connecting nodes right away on the canvas.
            </p>
            <input
              type="text"
              placeholder="e.g. Stripe Order Settlement Router"
              value={newPipelineName}
              onChange={(e) => setNewPipelineName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
              autoFocus
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNew}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 cursor-pointer"
              >
                Create Pipeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
