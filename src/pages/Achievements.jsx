import { useState, useEffect } from "react";
import { Search, X, Trophy, ExternalLink, ChevronDown } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const CATEGORIES = [
  "all",
  "achievement",
  "competition",
  "bootcamp",
  "organization",
  "webinar and seminar",
  "intern",
];

const CATEGORY_COLORS = {
  achievement: "bg-amber-50 text-amber-700 border border-amber-200",
  competition: "bg-rose-50 text-rose-700 border border-rose-200",
  bootcamp: "bg-violet-50 text-violet-700 border border-violet-200",
  organization: "bg-sky-50 text-sky-700 border border-sky-200",
  "webinar and seminar": "bg-teal-50 text-teal-700 border border-teal-200",
  intern: "bg-orange-50 text-orange-700 border border-orange-200",
};

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const snapshot = await getDocs(collection(db, "achievements"));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        data.sort((a, b) => (b.date > a.date ? 1 : -1));
        setAchievements(data);
      } catch (err) {
        console.error("Gagal mengambil data achievements:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = () => setOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [open]);

  const filtered = achievements.filter(
    (a) =>
      (filter === "all" || a.category === filter) &&
      a.title?.toLowerCase().includes(search.toLowerCase())
  );

  const activeLabel =
    filter === "all" ? "Semua Kategori" : filter.charAt(0).toUpperCase() + filter.slice(1);

  return (
    <div className="max-w-6xl mx-auto px-4 text-black bg-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Achievements</h1>
        <p className="text-stone-500 text-sm max-w-lg leading-relaxed">
          Koleksi sertifikat dan pencapaian yang telah diraih sepanjang perjalanan belajar dan berkarya.
        </p>
        <div className="border-t border-gray-300 my-4" />
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {CATEGORIES.filter((c) => c !== "all").map((cat) => {
          const count = achievements.filter((a) => a.category === cat).length;
          if (count === 0) return null;
          return (
            <button
              key={cat}
              onClick={() => setFilter(filter === cat ? "all" : cat)}
              className={`flex items-center gap-1.5 text-xs transition-all ${filter === cat ? "opacity-100" : "opacity-50 hover:opacity-80"}`}
            >
              <span className={`px-2 py-0.5 rounded-full font-medium border ${CATEGORY_COLORS[cat] || "bg-stone-100 text-stone-600 border-stone-200"}`}>
                {cat}
              </span>
              <span className="text-stone-400 font-mono">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari judul sertifikat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent shadow-sm transition"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Category dropdown */}
        <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setOpen((p) => !p)}
            className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg px-4 py-2 text-sm text-stone-700 shadow-sm hover:border-stone-300 transition"
          >
            <span>{activeLabel}</span>
            <ChevronDown size={13} className={`text-stone-400 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-lg border border-stone-100 z-20 overflow-hidden py-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setFilter(cat); setOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${filter === cat ? "bg-stone-900 text-white" : "text-stone-700 hover:bg-stone-50"}`}
                >
                  <span className="capitalize">{cat === "all" ? "Semua Kategori" : cat}</span>
                  {cat !== "all" && (
                    <span className={`text-xs tabular-nums ${filter === cat ? "text-stone-300" : "text-stone-400"}`}>
                      {achievements.filter((a) => a.category === cat).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="text-xs text-stone-400 shrink-0">{filtered.length} hasil</span>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center items-center py-24">
          <div className="w-7 h-7 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-stone-400">
          <Trophy size={36} className="mb-3 opacity-20" />
          <p className="text-sm">Tidak ada data yang cocok.</p>
          {(search || filter !== "all") && (
            <button onClick={() => { setSearch(""); setFilter("all"); }} className="mt-3 text-xs text-stone-500 hover:text-stone-800 underline underline-offset-2 transition">
              Reset pencarian
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-16">
          {filtered.map((ach) => (
            <div
              key={ach.id}
              onClick={() => setModal(ach)}
              className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <div className="relative w-full h-44 bg-stone-100 overflow-hidden">
                {ach.img ? (
                  <img src={ach.img} alt={ach.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Trophy size={28} className="text-stone-300" />
                  </div>
                )}
                <div className="absolute top-2.5 left-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize backdrop-blur-sm ${CATEGORY_COLORS[ach.category] || "bg-stone-100 text-stone-600 border border-stone-200"}`}>
                    {ach.category}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-stone-800 text-sm leading-snug line-clamp-2 mb-1">{ach.title}</h3>
                <p className="text-xs text-stone-500 line-clamp-1 mb-0.5">{ach.org}</p>
                <p className="text-xs text-stone-400 font-mono">{ach.date}</p>
                {ach.description && <p className="text-xs text-stone-400 line-clamp-2 mt-2 leading-relaxed">{ach.description}</p>}
                {ach.link && (
                  <a href={ach.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 mt-3 text-xs text-sky-500 hover:text-sky-700 transition-colors">
                    <ExternalLink size={11} /> Lihat Sertifikat
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={() => setModal(null)}>
          <div className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-stone-100" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModal(null)} className="absolute top-3 right-3 z-10 p-1.5 bg-white/90 hover:bg-white rounded-lg shadow-sm border border-stone-100 text-stone-500 hover:text-stone-800 transition">
              <X size={15} />
            </button>

            <div className="bg-stone-100 w-full max-h-[60vh] overflow-hidden flex items-center justify-center">
              {modal.img ? (
                <img src={modal.img} alt={modal.title} className="w-full object-contain max-h-[60vh]" />
              ) : (
                <div className="h-40 flex items-center justify-center">
                  <Trophy size={40} className="text-stone-300" />
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-base font-bold text-stone-900 leading-snug">{modal.title}</h3>
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${CATEGORY_COLORS[modal.category] || "bg-stone-100 text-stone-600 border-stone-200"}`}>
                  {modal.category}
                </span>
              </div>
              <p className="text-sm text-stone-600 mb-0.5">{modal.org}</p>
              <p className="text-xs text-stone-400 font-mono mb-3">{modal.date}</p>
              {modal.description && <p className="text-sm text-stone-500 leading-relaxed border-t border-stone-100 pt-3">{modal.description}</p>}
              {modal.link && (
                <a href={modal.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-sm text-sky-500 hover:text-sky-700 transition-colors font-medium">
                  <ExternalLink size={13} /> Lihat Sertifikat
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;