import React, { useEffect, useState, useRef } from "react";
import {
  BadgeCheck,
  Link as LinkIcon,
  X,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const techMeta = {
  js: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    label: "JavaScript",
  },
  javascript: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    label: "JavaScript",
  },
  ts: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    label: "TypeScript",
  },
  typescript: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    label: "TypeScript",
  },
  react: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    label: "React.js",
  },
  "react.js": {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    label: "React.js",
  },
  reactjs: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    label: "React.js",
  },
  next: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    label: "Next.js",
  },
  "next.js": {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    label: "Next.js",
  },
  nextjs: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    label: "Next.js",
  },
  tailwind: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    label: "Tailwind CSS",
  },
  "tailwind css": {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    label: "Tailwind CSS",
  },
  tailwindcss: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    label: "Tailwind CSS",
  },
  html: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    label: "HTML",
  },
  "html/css": {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    label: "HTML/CSS",
  },
  css: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    label: "CSS",
  },
  php: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    label: "PHP",
  },
  laravel: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg",
    label: "Laravel",
  },
  python: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    label: "Python",
  },
  nodejs: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    label: "Node.js",
  },
  "node.js": {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    label: "Node.js",
  },
  node: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    label: "Node.js",
  },
  mysql: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    label: "MySQL",
  },
  mongodb: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    label: "MongoDB",
  },
  sqlite: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
    label: "SQLite",
  },
  firebase: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
    label: "Firebase",
  },
  vue: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
    label: "Vue.js",
  },
  "vue.js": {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
    label: "Vue.js",
  },
  vuejs: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
    label: "Vue.js",
  },
  kotlin: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
    label: "Kotlin",
  },
  figma: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
    label: "Figma",
  },
  vite: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg",
    label: "Vite",
  },
  git: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    label: "Git",
  },
  docker: {
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    label: "Docker",
  },
};

// ─── Helper ───────────────────────────────────────────────────────────────────
const getTechMeta = (tech) => techMeta[tech.toLowerCase().trim()] ?? null;

// ─── Image Slider ─────────────────────────────────────────────────────────────
const ImageSlider = ({ images = [], alt = "" }) => {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(null);

  const slides = images.length > 0 ? images : [];
  if (slides.length === 0) return null;

  const prev = (e) => {
    e?.stopPropagation();
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  };

  const next = (e) => {
    e?.stopPropagation();
    setCurrent((c) => (c + 1) % slides.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <div
      className="relative w-full select-none overflow-hidden bg-stone-100"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${alt} ${i + 1}`}
            className="w-full shrink-0 object-cover max-h-[55vh]"
            draggable={false}
          />
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm hover:bg-white text-stone-700 rounded-full shadow-md border border-stone-200 transition"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm hover:bg-white text-stone-700 rounded-full shadow-md border border-stone-200 transition"
          >
            <ChevronRight size={16} />
          </button>

          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent(i);
                }}
                className={`rounded-full transition-all duration-200 ${
                  i === current
                    ? "w-4 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

          <div className="absolute top-2.5 left-2.5 z-10 bg-black/40 text-white text-[11px] px-2 py-0.5 rounded-full backdrop-blur-sm">
            {current + 1} / {slides.length}
          </div>
        </>
      )}
    </div>
  );
};

// ─── Card Thumbnail ───────────────────────────────────────────────────────────
const CardThumbnail = ({ project }) => {
  const images =
    project.images?.length > 0
      ? project.images
      : project.img
        ? [project.img]
        : [];

  return (
    <div className="relative w-full h-40 bg-stone-200 overflow-hidden flex items-center justify-center">
      {images.length > 0 ? (
        <>
          <img
            src={images[0]}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
          />
          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full backdrop-blur-sm">
              +{images.length - 1} foto
            </div>
          )}
        </>
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
  );
};

// ─── Tech Badge ───────────────────────────────────────────────────────────────
const TechBadge = ({ tech, size = 18 }) => {
  const meta = getTechMeta(tech);
  return meta ? (
    <img
      src={meta.icon}
      alt={meta.label}
      title={meta.label}
      style={{ width: size, height: size }}
      className="object-contain opacity-80"
    />
  ) : (
    <span className="text-[11px] bg-white border border-stone-200 text-stone-500 px-2 py-0.5 rounded-full">
      {tech}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, "projects"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
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

  const getModalImages = (project) => {
    if (project.images?.length > 0) return project.images;
    if (project.img) return [project.img];
    return [];
  };

  return (
    <div className="max-w-6xl mx-auto px-4 bg-white text-black">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium tracking-tight mb-1.5">Projects</h1>
        <p className="text-stone-400 text-sm max-w-lg leading-relaxed">
          Beberapa proyek yang telah saya kerjakan, baik proyek swasta maupun
          proyek sumber terbuka.
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
              <CardThumbnail project={project} />

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
                  <div className="flex flex-wrap items-center gap-1.5 mt-auto pt-3 border-t border-stone-200 mt-3">
                    {project.tech.map((tech, index) => (
                      <TechBadge key={index} tech={tech} size={18} />
                    ))}
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
              className="absolute top-3 right-3 z-20 p-1.5 bg-white rounded-lg border border-stone-200 text-stone-500 hover:text-stone-900 hover:border-stone-300 transition"
            >
              <X size={14} />
            </button>

            <ImageSlider images={getModalImages(modal)} alt={modal.title} />

            <div className="p-5 text-black">
              <div className="flex items-center gap-2.5 mb-1.5">
                <h3 className="text-sm font-medium text-stone-900">
                  {modal.title}
                </h3>
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

              <p className="text-sm text-stone-500 leading-relaxed">
                {modal.description}
              </p>

              {modal.tech?.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-stone-100">
                  {modal.tech.map((tech, index) => (
                    <TechBadge key={index} tech={tech} size={20} />
                  ))}
                </div>
              )}

              {(modal.liveUrl || modal.githubUrl) && (
                <div className="flex gap-5 mt-4 pt-3 border-t border-stone-100">
                  {modal.liveUrl && (
                    <a
                      href={modal.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[12px] font-medium text-sky-500 hover:text-sky-600 transition-colors"
                    >
                      <LinkIcon size={12} /> Visit Project
                    </a>
                  )}
                  {modal.githubUrl && (
                    <a
                      href={modal.githubUrl}
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
