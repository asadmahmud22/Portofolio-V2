import React, { useEffect, useState } from "react";
import { BadgeCheck, Link as LinkIcon, X, FolderOpen } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const techIcons = {
  html: "/icons/html.svg",
  css: "/icons/css.svg",
  php: "/icons/php.svg",
  ts: "/icons/ts.svg",
  mysql: "/icons/mysql.svg",
  js: "/icons/js.svg",
  react: "/icons/react.svg",
  vue: "/icons/vue.svg",
  next: "/icons/nextjs.svg",
  tailwind: "/icons/tailwind.svg",
  vercel: "/icons/vercel.svg",
  infinity: "/icons/infinity.svg",
  eslint: "/icons/eslint.svg",
  vite: "/icons/vite.svg",
  kotlin: "/icons/kotlin.svg",
  figma: "/icons/figma.svg",
  sqlite: "/icons/sqlite.svg",
  firebase: "/icons/firebase.svg",
  laravel: "/icons/laravel.svg",
  python: "/icons/python.svg",
  nodejs: "/icons/nodejs.svg",
  mongodb: "/icons/mongodb.svg",
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, "projects"));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        data.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        setProjects(data);
      } catch (err) {
        console.error("Gagal mengambil data projects:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 bg-white text-black">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium tracking-tight mb-1.5">Projects</h1>
        <p className="text-stone-400 text-sm max-w-lg leading-relaxed">
          Beberapa proyek yang telah saya kerjakan, baik proyek swasta maupun proyek sumber terbuka.
        </p>
        <div className="border-t border-stone-200 mt-4" />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-6 h-6 border-2 border-stone-200 border-t-stone-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Empty */}
      {!isLoading && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-stone-400">
          <FolderOpen size={32} className="mb-3 opacity-20" />
          <p className="text-sm">Belum ada project yang ditambahkan.</p>
        </div>
      )}

      {/* Grid */}
      {!isLoading && projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-16">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setModal(project)}
              className="group relative flex flex-col bg-stone-50 border border-stone-200 rounded-xl overflow-hidden cursor-pointer hover:border-stone-300 hover:shadow-md transition-all duration-200"
            >
              {/* Thumbnail */}
              <div className="relative w-full h-40 bg-stone-200 overflow-hidden flex items-center justify-center">
                {project.img ? (
                  <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                  />
                ) : (
                  <span className="text-xs text-stone-400 font-mono">no image</span>
                )}

                {project.featured && (
                  <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 bg-blue-600 text-blue-50 text-[11px] font-medium px-2.5 py-1 rounded-full">
                    <BadgeCheck size={11} />
                    Featured
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 p-3.5 gap-1">
                <h3 className="text-[13px] font-medium text-stone-900 leading-snug">
                  {project.title}
                </h3>

                {project.category && (
                  <span className="w-fit text-[11px] text-stone-500 bg-white border border-stone-200 px-2 py-0.5 rounded-full mt-0.5">
                    {project.category}
                  </span>
                )}

                <p className="text-[12px] text-stone-500 line-clamp-3 leading-relaxed mt-1.5">
                  {project.description}
                </p>

                {project.tech?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-stone-200 mt-3">
                    {project.tech.map((tech, index) =>
                      techIcons[tech.toLowerCase()] ? (
                        <img
                          key={index}
                          src={techIcons[tech.toLowerCase()]}
                          alt={tech}
                          title={tech}
                          className="w-[18px] h-[18px] object-contain opacity-80"
                        />
                      ) : (
                        <span
                          key={index}
                          className="text-[11px] bg-white border border-stone-200 text-stone-500 px-2 py-0.5 rounded-full"
                        >
                          {tech}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setModal(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModal(null)}
              className="absolute top-3 right-3 z-10 p-1.5 bg-white rounded-lg border border-stone-200 text-stone-500 hover:text-stone-900 hover:border-stone-300 transition"
            >
              <X size={14} />
            </button>

            {modal.img && (
              <img
                src={modal.img}
                alt={modal.title}
                className="w-full object-cover max-h-[55vh]"
              />
            )}

            <div className="p-5 text-black">
              <div className="flex items-center gap-2.5 mb-1.5">
                <h3 className="text-sm font-medium text-stone-900">{modal.title}</h3>
                {modal.featured && (
                  <span className="inline-flex items-center gap-1 bg-blue-600 text-blue-50 text-[11px] font-medium px-2.5 py-0.5 rounded-full shrink-0">
                    <BadgeCheck size={11} /> Featured
                  </span>
                )}
              </div>

              {modal.category && (
                <span className="inline-block text-[11px] bg-stone-100 text-stone-500 border border-stone-200 px-2.5 py-0.5 rounded-full mb-3">
                  {modal.category}
                </span>
              )}

              <p className="text-sm text-stone-500 leading-relaxed">{modal.description}</p>

              {modal.tech?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-stone-100">
                  {modal.tech.map((tech, index) =>
                    techIcons[tech.toLowerCase()] ? (
                      <img
                        key={index}
                        src={techIcons[tech.toLowerCase()]}
                        alt={tech}
                        title={tech}
                        className="w-5 h-5 object-contain opacity-80"
                      />
                    ) : (
                      <span
                        key={index}
                        className="text-[11px] bg-stone-100 border border-stone-200 text-stone-500 px-2.5 py-0.5 rounded-full"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              )}

              {(modal.liveUrl || modal.githubUrl) && (
                <div className="flex gap-5 mt-4 pt-3 border-t border-stone-100">
                  {modal.liveUrl && (
                    
                    <a href={modal.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[12px] font-medium text-sky-500 hover:text-sky-600 transition-colors"
                    >
                      <LinkIcon size={12} /> Visit Project
                    </a>
                  )}
                  {modal.githubUrl && (
                    
                    <a href={modal.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[12px] font-medium text-stone-500 hover:text-stone-800 transition-colors"
                    >
                      <LinkIcon size={12} /> GitHub
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;