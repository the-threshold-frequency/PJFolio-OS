'use client';

import { useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, ArrowUpRightFromSquare, Menu, ChevronDown } from 'lucide-react';
import { projects } from "../projects/projectsData";
import clsx from "clsx";

const domains = ['Cyber Security', 'Full Stack'];

export default function ProjectsSection() {
  const [selectedDomain, setSelectedDomain] = useState(domains[0]);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-20% 0px' });

  const [openedProjects, setOpenedProjects] = useState<(typeof projects)[0][]>([]);
  const [minimized, setMinimized] = useState(false);
  const [isAnimatingMinimize, setIsAnimatingMinimize] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTabsMobile, setShowTabsMobile] = useState(false);

  const filteredProjects = projects.filter((p) => p.domain === selectedDomain);

  const openProject = (project: (typeof projects)[0]) => {
    if (minimized) setMinimized(false);
    setOpenedProjects((prev) => {
      if (prev.find((p) => p.title === project.title)) return prev;
      return [...prev, project];
    });
  };

  const closeProject = (title: string) => {
    setOpenedProjects((prev) => prev.filter((p) => p.title !== title));
  };

  const handleMinimize = () => {
    setIsAnimatingMinimize(true);
    setTimeout(() => {
      setMinimized(true);
      setIsAnimatingMinimize(false);
    }, 400);
  };

  const activeProject = openedProjects[openedProjects.length - 1];

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="snap-start min-w-full h-[100dvh] flex items-center justify-center relative z-10"
    >
      <AnimatePresence>
        {isInView && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="w-[90vw] max-w-6xl h-[80vh] rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <h2 className="text-sm font-semibold text-gray-200">Projects</h2>
              <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="md:hidden text-gray-300 hover:text-white transition"
              >
                <motion.div
                  animate={{
                    rotate: sidebarOpen ? 90 : 0,
                    scale: sidebarOpen ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.div>
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 relative">
              {/* Sidebar */}
              <aside
                className={clsx(
                  `absolute md:static top-0 left-0 h-full w-3/4 md:w-1/4 z-20 
                  border-r border-white/10 p-4 
                  transition-transform duration-300 ease-in-out
                  bg-[#1a1a1a] md:bg-white/5 
                  md:backdrop-blur-md`,
                  {
                    'translate-x-0': sidebarOpen,
                    '-translate-x-full md:translate-x-0': !sidebarOpen,
                  }
                )}
              >
                <div className="p-4">
                  <h3 className="text-sm uppercase text-gray-400 mb-2 font-semibold">Domains</h3>
                  <ul className="space-y-1">
                    {domains.map((domain) => (
                      <li key={domain}>
                        <button
                          onClick={() => {
                            setSelectedDomain(domain);
                            setSidebarOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded transition ${
                            selectedDomain === domain
                              ? 'bg-white/10 text-white'
                              : 'hover:bg-white/5 text-gray-400'
                          }`}
                        >
                          {domain}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>

              {/* Projects Grid */}
              <main className="flex-1 p-4 overflow-y-auto md:ml-0">
                <h3 className="text-lg font-bold mb-4">{selectedDomain} Projects</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredProjects.map((project) => (
                    <div
                      key={project.title}
                      onClick={() => openProject(project)}
                      className="p-4 bg-white/5 rounded-lg border border-white/10 shadow hover:shadow-xl cursor-pointer transition-all"
                    >
                      <h4 className="text-md font-semibold text-white">{project.title}</h4>
                      <p className="text-sm text-gray-300">{project.description}</p>
                    </div>
                  ))}
                </div>
              </main>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Browser Window */}
      <AnimatePresence>
        {!minimized && openedProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 1, scale: 1, y: 0 }}
            animate={isAnimatingMinimize ? { opacity: 0, scale: 0.5, y: 300 } : { opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/50"
          >
            <div className="relative w-[94vw] max-w-[94vw] h-[88vh] bg-zinc-950 rounded-xl overflow-hidden border border-white/20 shadow-2xl flex flex-col">
              {/* Tab Bar */}
<div className="flex items-center justify-between px-3 py-2 bg-zinc-900 border-b border-white/10 flex-wrap gap-2 sm:flex-nowrap">
  <div className="flex items-center gap-2">
    <button
      onClick={() => setShowInfo(true)}
      className="w-6 h-6 rounded-full bg-white/10 text-white text-sm flex items-center justify-center hover:bg-white/20 transition"
      title="Show project info"
    >
      ?
    </button>

    {/* Mobile Tabs Button */}
    <div className="sm:hidden relative">
      <button
        onClick={() => setShowTabsMobile((prev) => !prev)}
        className="text-white bg-zinc-800 px-3 py-1 rounded-md text-sm"
      >
        Tabs
      </button>
      {showTabsMobile && (
        <div className="absolute mt-2 left-0 z-10 bg-zinc-800 rounded shadow-md">
          {openedProjects.map((proj) => (
            <button
              key={proj.title}
              onClick={() => {
                const reordered = openedProjects.filter((p) => p.title !== proj.title);
                setOpenedProjects([...reordered, proj]);
                setShowTabsMobile(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-700"
            >
              {proj.title}
            </button>
          ))}
        </div>
      )}
    </div>

    {/* Desktop Tabs */}
    <div className="hidden sm:flex gap-2 overflow-x-auto max-w-[70%]">
      {openedProjects.map((proj, idx) => (
        <button
          key={proj.title}
          onClick={() => {
            const reordered = openedProjects.filter((p) => p.title !== proj.title);
            setOpenedProjects([...reordered, proj]);
          }}
          className={`px-3 py-1 text-sm rounded-t-md ${
            idx === openedProjects.length - 1
              ? 'bg-zinc-800 text-white'
              : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'
          }`}
        >
          {proj.title}
        </button>
      ))}
    </div>
  </div>

  <div className="flex space-x-3 items-center">
    <button onClick={handleMinimize} className="text-gray-400 hover:text-white transition">
      <Minus size={18} />
    </button>
    <a
      href={activeProject.iframeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-white transition"
      title="Open in new tab"
    >
      <ArrowUpRightFromSquare size={18} />
    </a>
    <button
      onClick={() => setOpenedProjects([])}
      className="text-gray-400 hover:text-white transition"
    >
      <X size={18} />
    </button>
  </div>
</div>


              {/* Iframe Viewer */}
              <div className="flex-1 bg-black overflow-hidden">
                <iframe
                  src={activeProject.iframeUrl}
                  title={activeProject.title}
                  className="w-full h-full border-none"
                />
              </div>

              {/* Info Modal */}
<AnimatePresence>
  {showInfo && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
    >
      <div className="bg-zinc-900 border border-white/20 rounded-lg p-4 sm:p-6 w-full max-w-md text-white relative flex flex-col md:flex-row gap-4 overflow-y-auto max-h-[80vh]">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{activeProject.title}</h3>
          <p className="text-sm text-gray-300">{activeProject.description}</p>
        </div>

        {activeProject.techStack && (
          <div className="flex flex-wrap gap-2">
            {activeProject.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs bg-white/10 rounded-full text-gray-200"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => setShowInfo(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>
    </motion.div>
  )}
</AnimatePresence>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
