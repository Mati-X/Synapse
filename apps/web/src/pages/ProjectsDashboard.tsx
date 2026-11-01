import React, { useState } from 'react';
import { ProjectItem, mockProjects } from '../data/mockProjects';
import { useWorkflowStore } from '../store/workflowStore';
import {
  Plus,
  Search,
  Zap,
  Layers,
  Activity,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Copy,
  Trash2,
  Filter,
} from 'lucide-react';

export interface ProjectsDashboardProps {
  onOpenStudio: () => void;
}

export const ProjectsDashboard: React.FC<ProjectsDashboardProps> = ({ onOpenStudio }) => {
  const { loadWorkflow, createNewWorkflow } = useWorkflowStore();
  const [projects, setProjects] = useState<ProjectItem[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isCreatingModal, setIsCreatingModal] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');

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
    if (!newWorkflowName.trim()) return;
    createNewWorkflow(newWorkflowName.trim());
    setIsCreatingModal(false);
    setNewWorkflowName('');
    onOpenStudio();
  };

  const handleDuplicateProject = (project: ProjectItem) => {
    const duplicated: ProjectItem = {
      ...project,
      id: `proj_${Date.now()}`,
      name: `${project.name} (Copy)`,
      status: 'DRAFT',
      updatedAt: 'just now',
      executionsCount: 0,
    };
    setProjects([duplicated, ...projects]);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const totalRuns = projects.reduce((acc, p) => acc + p.executionsCount, 0);

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar */}
      <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="size-9 font-mono font-bold text-lg rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-500 text-zinc-950 shadow-[0_0_20px_rgba(245,158,11,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] border border-amber-300/40">
            S
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base text-zinc-100 tracking-tight">
                Synapse Engine
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
                v1.2.0-core
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              Automated Event DAG Studio
            </span>
          </div>
        </div>

        {/* Global Search */}
        <div className="w-96 relative">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search pipelines, tags, endpoints... (Cmd+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono shadow-inner"
          />
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              createNewWorkflow('New Production Pipeline');
              onOpenStudio();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-semibold text-xs shadow-[0_0_20px_rgba(245,158,11,0.3)] border border-amber-300/40 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>New Pipeline</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 space-y-8">
        {/* Metric Cards Deck */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md shadow-lg flex items-center gap-3.5">
            <div className="size-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="size-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                Total Workflows
              </span>
              <span className="text-xl font-bold font-mono text-zinc-100">
                {projects.length} Active
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md shadow-lg flex items-center gap-3.5">
            <div className="size-11 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Activity className="size-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                Total Dispatches
              </span>
              <span className="text-xl font-bold font-mono text-zinc-100">
                {totalRuns.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md shadow-lg flex items-center gap-3.5">
            <div className="size-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                In-Flight Cycle Safety
              </span>
              <span className="text-xl font-bold font-mono text-zinc-100">
                100% DAG Safe
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md shadow-lg flex items-center gap-3.5">
            <div className="size-11 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Cpu className="size-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                Median Engine Latency
              </span>
              <span className="text-xl font-bold font-mono text-zinc-100">
                28ms Kahn
              </span>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-zinc-100 text-zinc-950 font-bold shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/70 border border-zinc-800/70 hover:border-zinc-700'
                  }`}
                >
                  {cat === 'ALL' ? 'All Pipelines' : cat}
                </button>
              );
            })}
          </div>

          <div className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
            <Filter className="size-3.5 text-zinc-500" />
            <span>Showing {filteredProjects.length} pipelines</span>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative rounded-2xl border border-zinc-800/90 bg-gradient-to-b from-zinc-900/80 via-zinc-900/70 to-zinc-950/90 p-5 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.65)] hover:border-zinc-600 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-zinc-300">
                    {project.category}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`size-2 rounded-full ${
                        project.status === 'ACTIVE'
                          ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                          : project.status === 'PAUSED'
                          ? 'bg-zinc-500'
                          : 'bg-amber-400'
                      }`}
                    />
                    <span className="text-[10px] font-mono font-semibold uppercase text-zinc-400">
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="font-semibold text-base text-zinc-100 group-hover:text-amber-300 transition-colors tracking-tight mb-2">
                  {project.name}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono text-zinc-400 bg-zinc-950/80 border border-zinc-800/90 px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                {/* Metrics Bar */}
                <div className="pt-3 border-t border-zinc-800/80 grid grid-cols-3 gap-2 text-[10px] font-mono text-zinc-400 mb-4">
                  <div className="flex flex-col">
                    <span className="text-zinc-500">Topology</span>
                    <span className="font-semibold text-zinc-200 flex items-center gap-1 mt-0.5">
                      <Layers className="size-3 text-amber-400" />
                      {project.nodes.length} Nodes
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-zinc-500">Reliability</span>
                    <span className="font-semibold text-emerald-400 mt-0.5">
                      {project.successRate}%
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-zinc-500">Dispatches</span>
                    <span className="font-semibold text-zinc-200 mt-0.5">
                      {project.executionsCount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLaunchProject(project)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-800/90 hover:bg-amber-500 hover:text-zinc-950 text-zinc-200 font-semibold text-xs border border-zinc-700/80 hover:border-amber-400 transition-all cursor-pointer shadow-sm group/btn"
                  >
                    <span>Open in Studio</span>
                    <ArrowRight className="size-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => handleDuplicateProject(project)}
                    className="p-2 rounded-xl bg-zinc-950/60 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                    title="Duplicate pipeline"
                  >
                    <Copy className="size-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-2 rounded-xl bg-zinc-950/60 hover:bg-rose-950/40 border border-zinc-800 hover:border-rose-500/40 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete pipeline"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* New Pipeline Modal */}
      {isCreatingModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-700/80 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-semibold text-zinc-100">Create New Workflow</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Start an empty orchestration graph or instantiate from a template.
            </p>
            <input
              type="text"
              placeholder="e.g. Order Settlement Webhook"
              value={newWorkflowName}
              onChange={(e) => setNewWorkflowName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
              autoFocus
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsCreatingModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNew}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
