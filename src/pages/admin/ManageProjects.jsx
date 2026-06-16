import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useOutletContext } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Search,
  Globe,
  Github,
  FolderKanban,
  Filter,
  Star,
  Menu,
  ImagePlus,
  GripVertical,
} from "lucide-react";

// ─── Tech Meta (CDN icons — sama dengan Projects.jsx) ─────────────────────────
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

const getTechMeta = (tech) => techMeta[tech.toLowerCase().trim()] ?? null;

// TECH_OPTIONS diambil dari label unik di techMeta (deduplicated)
const TECH_OPTIONS = [
  ...new Map(Object.values(techMeta).map((m) => [m.label, m])).values(),
].map((m) => m.label);

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Backend",
  "Other",
];

const CATEGORY_COLORS = {
  "Web Development": "bg-sky-50 text-sky-700 border border-sky-200",
  "Mobile Development": "bg-violet-50 text-violet-700 border border-violet-200",
  "UI/UX Design": "bg-pink-50 text-pink-700 border border-pink-200",
  Backend: "bg-teal-50 text-teal-700 border border-teal-200",
  Other: "bg-stone-100 text-stone-600 border border-stone-200",
};

const emptyForm = {
  title: "",
  description: "",
  category: "Web Development",
  tech: [],
  liveUrl: "",
  githubUrl: "",
  images: [],
  img: "",
  featured: false,
};

const inputCls =
  "w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 bg-white focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent transition";

// ─── Tech Badge (icon CDN atau text pill) ─────────────────────────────────────
const TechBadge = ({ tech, size = 16 }) => {
  const meta = getTechMeta(tech);
  return meta ? (
    <img
      src={meta.icon}
      alt={meta.label}
      title={meta.label}
      style={{ width: size, height: size }}
      className="object-contain opacity-80 shrink-0"
    />
  ) : (
    <span className="px-2 py-0.5 bg-stone-100 text-stone-600 border border-stone-200 rounded-full text-xs">
      {tech}
    </span>
  );
};

// ─── Multi-image Input ────────────────────────────────────────────────────────
const MultiImageInput = ({ images, onChange }) => {
  const [newUrl, setNewUrl] = useState("");

  const addImage = () => {
    const trimmed = newUrl.trim();
    if (!trimmed) return;
    onChange([...images, trimmed]);
    setNewUrl("");
  };

  const removeImage = (index) => onChange(images.filter((_, i) => i !== index));

  const moveUp = (index) => {
    if (index === 0) return;
    const next = [...images];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };

  const moveDown = (index) => {
    if (index === images.length - 1) return;
    const next = [...images];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {images.length > 0 && (
        <div className="space-y-2">
          {images.map((url, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg p-2"
            >
              <img
                src={url}
                alt={`img-${i}`}
                className="w-14 h-10 object-cover rounded-md border border-stone-200 shrink-0"
                onError={(e) => {
                  e.target.src = "";
                  e.target.style.display = "none";
                }}
              />
              <span className="flex-1 text-[11px] text-stone-500 truncate">
                {url}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  title="Pindah ke atas"
                  className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30 transition"
                >
                  <GripVertical size={12} />
                </button>
                <span className="text-[10px] text-stone-400 font-mono w-4 text-center">
                  {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  title="Hapus gambar"
                  className="p-1 text-stone-400 hover:text-rose-500 transition"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="/projects/nama-file.jpg atau https://..."
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), addImage())
          }
          className={inputCls}
        />
        <button
          type="button"
          onClick={addImage}
          className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 text-white text-xs rounded-lg hover:bg-stone-700 transition shrink-0"
        >
          <ImagePlus size={13} /> Tambah
        </button>
      </div>
      <p className="text-xs text-stone-400">
        Gambar pertama tampil sebagai thumbnail kartu. Urutan dapat diubah
        dengan tombol angka.
      </p>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ManageProjects = () => {
  const { setSidebarOpen } = useOutletContext();

  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const fetchProjects = async () => {
    const snapshot = await getDocs(collection(db, "projects"));
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const toggleTech = (label) => {
    setForm((prev) => ({
      ...prev,
      tech: prev.tech.includes(label)
        ? prev.tech.filter((t) => t !== label)
        : [...prev.tech, label],
    }));
  };

  const handleAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    const existingImages =
      item.images?.length > 0 ? item.images : item.img ? [item.img] : [];
    setForm({
      title: item.title || "",
      description: item.description || "",
      category: item.category || "Web Development",
      tech: item.tech || [],
      liveUrl: item.liveUrl || "",
      githubUrl: item.githubUrl || "",
      images: existingImages,
      img: existingImages[0] || "",
      featured: item.featured || false,
    });
    setEditId(item.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.description) {
      alert("Judul dan deskripsi wajib diisi.");
      return;
    }
    setIsSaving(true);
    const payload = { ...form, img: form.images[0] || "" };
    try {
      if (editId) {
        await updateDoc(doc(db, "projects", editId), payload);
      } else {
        await addDoc(collection(db, "projects"), payload);
      }
      await fetchProjects();
      setShowModal(false);
    } catch (err) {
      alert(`Error: ${err.code}\n${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus project ini?")) return;
    setIsDeleting(id);
    try {
      await deleteDoc(doc(db, "projects", id));
      await fetchProjects();
    } catch {
      alert("Gagal menghapus data.");
    } finally {
      setIsDeleting(null);
    }
  };

  const getThumb = (item) => item.images?.[0] || item.img || null;

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      filterCategory === "all" || p.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <>
      {/* Topbar */}
      <header className="flex-shrink-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-stone-500 hover:text-stone-900 transition"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-stone-900 font-semibold text-base leading-none">
              Manage Projects
            </h1>
            <p className="text-stone-400 text-xs mt-0.5">
              {projects.length} project tersimpan
            </p>
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
        >
          <Plus size={15} /> Tambah Project
        </button>
      </header>

      {/* Scrollable body */}
      <main
        className="flex-1 overflow-y-auto px-6 py-6
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-stone-300
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb:hover]:bg-stone-400"
      >
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-0">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Cari judul atau deskripsi project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent transition shadow-sm"
            />
          </div>
          <div className="relative shrink-0">
            <Filter
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-8 pr-8 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-800 shadow-sm appearance-none cursor-pointer"
            >
              <option value="all">Semua Kategori</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-stone-400">
              <FolderKanban size={32} className="mb-3 opacity-30" />
              <p className="text-sm">Tidak ada project ditemukan.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider w-16">
                      Img
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      Judul
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      Deskripsi
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      Tech Stack
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider w-24">
                      Links
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider w-24">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filtered.map((item) => {
                    const thumb = getThumb(item);
                    const imgCount = item.images?.length || (item.img ? 1 : 0);
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-stone-50/70 transition-colors group"
                      >
                        {/* Thumbnail */}
                        <td className="px-5 py-3">
                          <div className="relative">
                            {thumb ? (
                              <img
                                src={thumb}
                                alt={item.title}
                                className="w-12 h-10 object-cover rounded-lg border border-stone-200 shadow-sm"
                              />
                            ) : (
                              <div className="w-12 h-10 bg-stone-100 rounded-lg border border-stone-200 flex items-center justify-center">
                                <FolderKanban
                                  size={14}
                                  className="text-stone-300"
                                />
                              </div>
                            )}
                            {imgCount > 1 && (
                              <span className="absolute -bottom-1 -right-1 bg-stone-700 text-white text-[9px] px-1 rounded-full font-mono">
                                {imgCount}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Judul + kategori */}
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <p className="font-semibold text-stone-800 line-clamp-1 max-w-[180px]">
                              {item.title}
                            </p>
                            {item.featured && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-full text-xs font-medium shrink-0">
                                <Star
                                  size={9}
                                  className="fill-amber-500 text-amber-500"
                                />{" "}
                                Featured
                              </span>
                            )}
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[item.category] || "bg-stone-100 text-stone-600 border border-stone-200"}`}
                          >
                            {item.category}
                          </span>
                        </td>

                        {/* Deskripsi */}
                        <td className="px-5 py-3">
                          <p className="text-stone-500 text-xs line-clamp-2 max-w-sm leading-relaxed">
                            {item.description || (
                              <span className="italic text-stone-300">—</span>
                            )}
                          </p>
                        </td>

                        {/* Tech Stack — icon dari CDN */}
                        <td className="px-5 py-3">
                          <div className="flex flex-wrap items-center gap-1.5 max-w-[200px]">
                            {(item.tech || []).slice(0, 6).map((t) => (
                              <TechBadge key={t} tech={t} size={16} />
                            ))}
                            {(item.tech || []).length > 6 && (
                              <span className="px-2 py-0.5 bg-stone-100 text-stone-400 rounded-full text-xs">
                                +{item.tech.length - 6}
                              </span>
                            )}
                            {(!item.tech || item.tech.length === 0) && (
                              <span className="text-xs text-stone-300 italic">
                                —
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Links */}
                        <td className="px-5 py-3">
                          <div className="flex flex-col gap-1">
                            {item.liveUrl && (
                              <a
                                href={item.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-sky-500 hover:text-sky-700 transition-colors"
                              >
                                <Globe size={11} /> Live
                              </a>
                            )}
                            {item.githubUrl && (
                              <a
                                href={item.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 transition-colors"
                              >
                                <Github size={11} /> GitHub
                              </a>
                            )}
                            {!item.liveUrl && !item.githubUrl && (
                              <span className="text-xs text-stone-300 italic">
                                —
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Aksi */}
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(item)}
                              title="Edit"
                              className="p-1.5 text-stone-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              disabled={isDeleting === item.id}
                              title="Hapus"
                              className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-40"
                            >
                              {isDeleting === item.id ? (
                                <div className="w-3.5 h-3.5 border-2 border-rose-300 border-t-rose-500 rounded-full animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {filtered.length > 0 && (
            <div className="px-5 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-400">
                Menampilkan {filtered.length} dari {projects.length} project
              </span>
              {filterCategory !== "all" && (
                <button
                  onClick={() => setFilterCategory("all")}
                  className="text-xs text-stone-500 hover:text-stone-800 transition-colors underline underline-offset-2"
                >
                  Reset filter
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col border border-stone-100"
            style={{ maxHeight: "90vh" }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 rounded-t-2xl shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-stone-900 rounded-lg flex items-center justify-center">
                  <FolderKanban size={13} className="text-sky-400" />
                </div>
                <h2 className="font-semibold text-stone-800 text-sm">
                  {editId ? "Edit Project" : "Tambah Project"}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-stone-100 rounded-lg transition text-stone-500"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div
              className="flex-1 overflow-y-auto px-6 py-5 space-y-4
              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-stone-200
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb:hover]:bg-stone-300"
            >
              {/* Gambar */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">
                  Gambar Project
                  <span className="ml-1.5 text-stone-400 font-normal normal-case">
                    ({form.images.length} gambar)
                  </span>
                </label>
                <MultiImageInput
                  images={form.images}
                  onChange={(imgs) => setForm({ ...form, images: imgs })}
                />
              </div>

              {/* Judul */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">
                  Judul{" "}
                  <span className="text-rose-500 normal-case font-normal">
                    *wajib
                  </span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Nama project"
                  className={inputCls}
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">
                  Deskripsi{" "}
                  <span className="text-rose-500 normal-case font-normal">
                    *wajib
                  </span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Deskripsi singkat project"
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">
                  Kategori
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className={inputCls}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tech Stack — tombol dengan icon CDN */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">
                  Tech Stack
                </label>
                <div className="flex flex-wrap gap-2">
                  {TECH_OPTIONS.map((label) => {
                    const meta = getTechMeta(label);
                    const selected = form.tech.includes(label);
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => toggleTech(label)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all ${
                          selected
                            ? "bg-stone-900 text-white border-stone-900"
                            : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                        }`}
                      >
                        {meta && (
                          <img
                            src={meta.icon}
                            alt={label}
                            className={`w-3.5 h-3.5 object-contain ${selected ? "opacity-100" : "opacity-70"}`}
                          />
                        )}
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">
                    Live URL{" "}
                    <span className="text-stone-400 normal-case font-normal">
                      (opsional)
                    </span>
                  </label>
                  <div className="relative">
                    <Globe
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      value={form.liveUrl}
                      onChange={(e) =>
                        setForm({ ...form, liveUrl: e.target.value })
                      }
                      placeholder="https://..."
                      className={`${inputCls} pl-8`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">
                    GitHub URL{" "}
                    <span className="text-stone-400 normal-case font-normal">
                      (opsional)
                    </span>
                  </label>
                  <div className="relative">
                    <Github
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      value={form.githubUrl}
                      onChange={(e) =>
                        setForm({ ...form, githubUrl: e.target.value })
                      }
                      placeholder="https://github.com/..."
                      className={`${inputCls} pl-8`}
                    />
                  </div>
                </div>
              </div>

              {/* Featured toggle */}
              <div
                onClick={() => setForm({ ...form, featured: !form.featured })}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                  form.featured
                    ? "border-amber-300 bg-amber-50"
                    : "border-stone-200 bg-stone-50 hover:border-stone-300"
                }`}
              >
                <div
                  className={`w-9 h-5 rounded-full transition-colors relative ${form.featured ? "bg-amber-400" : "bg-stone-300"}`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.featured ? "left-4" : "left-0.5"}`}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-700">
                    Featured Project
                  </p>
                  <p className="text-xs text-stone-400">
                    Ditampilkan di bagian utama portofolio
                  </p>
                </div>
                {form.featured && (
                  <Star
                    size={14}
                    className="ml-auto fill-amber-400 text-amber-400"
                  />
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-stone-100 flex gap-3 justify-end rounded-b-2xl shrink-0 bg-white">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg transition font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-sm rounded-lg transition disabled:opacity-60 font-medium shadow-sm"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {isSaving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageProjects;
