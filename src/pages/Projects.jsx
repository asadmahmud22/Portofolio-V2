import React, { useEffect, useState } from "react";
import { BadgeCheck, Link as LinkIcon, X } from "lucide-react";
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
    <div className="max-w-6xl mx-auto px-4 text-black bg-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Projects</h1>
        <p className="text-stone-500 text-sm max-w-lg leading-relaxed">
          Beberapa proyek yang telah saya kerjakan, baik proyek swasta maupun proyek sumber terbuka.
        </p>
        <div className="border-t border-gray-300 my-4" />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </div>
      )}

      {/* Empty */}
      {!isLoading && projects.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          Belum ada project yang ditambahkan.
        </p>
      )}

      {/* Grid Cards */}
      {!isLoading && projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setModal(project)}
              className="relative bg-black/20 backdrop-blur-md p-4 rounded-lg shadow-xl shadow-black border border-black/10 hover:scale-[1.02] transition cursor-pointer"
            >
              {project.img ? (
                <img src={project.img} alt={project.title} className="w-full h-45 object-cover rounded-md mb-3" />
              ) : (
                <div className="w-full h-45 bg-gray-100 rounded-md mb-3 flex items-center justify-center text-gray-300 text-sm">
                  No Image
                </div>
              )}

              {project.featured && (
                <div className="absolute top-2 right-2 bg-blue-600 text-xs px-2 py-1 rounded-full flex items-center gap-1 text-white">
                  <BadgeCheck size={12} /> Featured
                </div>
              )}

              <h3 className="text-md font-semibold">{project.title}</h3>
              <p className="text-sm text-gray-800 mt-1 line-clamp-3">{project.description}</p>

              {project.tech?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.tech.map((tech, index) =>
                    techIcons[tech.toLowerCase()] ? (
                      <img key={index} src={techIcons[tech.toLowerCase()]} alt={tech} title={tech} className="w-5 h-5" />
                    ) : (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tech}</span>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div className="relative max-w-3xl w-full mx-4 bg-white rounded-lg overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-black hover:text-red-500 z-10" onClick={() => setModal(null)}>
              <X size={24} />
            </button>

            {modal.img && <img src={modal.img} alt={modal.title} className="w-full object-contain max-h-[70vh]" />}

            <div className="p-4 text-black">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-semibold">{modal.title}</h3>
                {modal.featured && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <BadgeCheck size={11} /> Featured
                  </span>
                )}
              </div>

              {modal.category && (
                <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full mb-2">{modal.category}</span>
              )}

              <p className="text-sm mt-1 text-gray-700 leading-relaxed">{modal.description}</p>

              {modal.tech?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {modal.tech.map((tech, index) =>
                    techIcons[tech.toLowerCase()] ? (
                      <img key={index} src={techIcons[tech.toLowerCase()]} alt={tech} title={tech} className="w-6 h-6" />
                    ) : (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tech}</span>
                    )
                  )}
                </div>
              )}

              <div className="flex gap-4 mt-3">
                {modal.liveUrl && (
                  <a href={modal.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
                    <LinkIcon size={14} /> Visit Project
                  </a>
                )}
                {modal.githubUrl && (
                  <a href={modal.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-gray-700 hover:underline">
                    <LinkIcon size={14} /> GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;