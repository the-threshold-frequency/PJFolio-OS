'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { projects } from "../projects/projectsData";


const domains = ['Cyber Security', 'Full Stack'];

export default function ProjectsSection() {
  const [selectedDomain, setSelectedDomain] = useState(domains[0]);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-20% 0px' });
  const [openedProject, setOpenedProject] = useState<null | (typeof projects)[0]>(null);
  const filteredProjects = projects.filter((p) => p.domain === selectedDomain);

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
            {/* Window Top Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <h2 className="text-sm font-semibold text-gray-200">Projects</h2>
              <div /> {/* Empty div for symmetry */}
            </div>

            {/* File Explorer Body */}
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <aside className="w-1/4 bg-white/5 border-r border-white/10 p-4">
                <h3 className="text-sm uppercase text-gray-400 mb-2 font-semibold">Domains</h3>
                <ul className="space-y-1">
                  {domains.map((domain) => (
                    <li key={domain}>
                      <button
                        onClick={() => setSelectedDomain(domain)}
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
              </aside>

              {/* Main Panel */}
              <main className="flex-1 p-4 overflow-y-auto">
                <h3 className="text-lg font-bold mb-4">{selectedDomain} Projects</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredProjects.map((project) => (
                  <div
                    key={project.title}
                    onClick={() => setOpenedProject(project)}
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
      {openedProject && (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/50"
        >
        <div className="relative w-[90vw] max-w-5xl h-[75vh] bg-zinc-950 rounded-xl overflow-hidden border border-white/20 shadow-2xl flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-white/10">
            <h4 className="text-sm text-white font-medium">
                {openedProject.title}
            </h4>
            <button
                onClick={() => setOpenedProject(null)}
                className="text-gray-400 hover:text-white transition"
            >
                <X size={18} />
            </button>
        </div>

        {/* Iframe Preview */}
        <div className="flex-1 bg-black">
        <iframe
          src={openedProject.iframeUrl}
          title={openedProject.title}
          className="w-full h-full border-none"
        />
      </div>
    </div>
  </motion.div>
)}

    </section>
  );
}
