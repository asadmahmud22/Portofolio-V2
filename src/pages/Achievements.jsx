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

const CATEGORY_STYLES = {
  achievement: {
    pill: "bg-amber-50 text-amber-800 border-amber-200",
    thumb: "bg-amber-50",
    icon: "text-amber-300",
  },
  competition: {
    pill: "bg-red-50 text-red-800 border-red-200",
    thumb: "bg-red-50",
    icon: "text-red-300",
  },
  bootcamp: {
    pill: "bg-violet-50 text-violet-800 border-violet-200",
    thumb: "bg-violet-50",
    icon: "text-violet-300",
  },
  organization: {
    pill: "bg-sky-50 text-sky-800 border-sky-200",
    thumb: "bg-sky-50",
    icon: "text-sky-300",
  },
  "webinar and seminar": {
    pill: "bg-teal-50 text-teal-800 border-teal-200",
    thumb: "bg-teal-50",
    icon: "text-teal-300",
  },
  intern: {
    pill: "bg-orange-50 text-orange-800 border-orange-200",
    thumb: "bg-orange-50",
    icon: "text-orange-300",
  },
};

const DEFAULT_STYLE = {
  pill: "bg-stone-100 text-stone-600 border-stone-200",
  thumb: "bg-stone-100",
  icon: "text-stone-300",
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
    filter === "all"
      ? "Semua Kategori"
      : filter.charAt(0).toUpperCase() + filter.slice(1);

  return (
    <div className="max-w-6xl mx-auto px-4 text-black bg-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium tracking-tight mb-1.5">Achievements</h1>
        <p className="text-stone-400 text-sm max-w-lg leading-relaxed">
          Koleksi sertifikat dan pencapaian yang telah diraih sepanjang perjalanan belajar dan berkarya.
        </p>
        <div className="border-t border-stone-200 mt-4" />
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {CATEGORIES.filter((c) => c !== "all").map((cat) => {
          const count = achievements.filter((a) => a.category === cat).length;
          if (count === 0) return null;
          const s = CATEGORY_STYLES[cat] || DEFAULT_STYLE;
          const isActive = filter === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilter(isActive ? "all" : cat)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize transition-opacity ${s.pill} ${isActive ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
            >
              {cat}
              <span className="tabular-nums opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari judul sertifikat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-9 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-300 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Dropdown */}
        <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setOpen((p) => !p)}
            className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg px-3.5 py-2 text-sm text-stone-600 hover:border-stone-300 transition"
          >
            <span>{activeLabel}</span>
            <ChevronDown size={12} className={`text-stone-400 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl border border-stone-100 shadow-xl z-20 overflow-hidden py-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setFilter(cat); setOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${
                    filter === cat
                      ? "bg-stone-900 text-white"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <span className="capitalize">{cat === "all" ? "Semua Kategori" : cat}</span>
                  {cat !== "all" && (
                    <span className={`text-xs tabular-nums ${filter === cat ? "text-stone-400" : "text-stone-400"}`}>
                      {achievements.filter((a) => a.category === cat).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="text-xs text-stone-400 shrink-0 tabular-nums">{filtered.length} hasil</span>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center items-center py-24">
          <div className="w-6 h-6 border-2 border-stone-200 border-t-stone-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-stone-400">
          <Trophy size={32} className="mb-3 opacity-20" />
          <p className="text-sm">Tidak ada data yang cocok.</p>
          {(search || filter !== "all") && (
            <button
              onClick={() => { setSearch(""); setFilter("all"); }}
              className="mt-3 text-xs text-stone-500 hover:text-stone-800 underline underline-offset-2 transition"
            >
              Reset pencarian
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-16">
          {filtered.map((ach) => {
            const s = CATEGORY_STYLES[ach.category] || DEFAULT_STYLE;
            return (
              <div
                key={ach.id}
                onClick={() => setModal(ach)}
                className="group flex flex-col bg-white rounded-xl border border-stone-200 overflow-hidden cursor-pointer hover:border-stone-300 hover:shadow-md transition-all duration-200"
              >
                {/* Thumbnail */}
                <div className={`relative w-full h-36 overflow-hidden flex items-center justify-center ${ach.img ? "bg-stone-100" : s.thumb}`}>
                  {ach.img ? (
                    <img
                      src={ach.img}
                      alt={ach.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                    />
                  ) : (
                    <Trophy size={26} className={s.icon} />
                  )}
                  <div className="absolute top-2.5 left-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize border backdrop-blur-sm ${s.pill}`}>
                      {ach.category}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-3.5 gap-1">
                  <h3 className="text-[13px] font-medium text-stone-900 leading-snug line-clamp-2">
                    {ach.title}
                  </h3>
                  <p className="text-[12px] text-stone-500 truncate">{ach.org}</p>
                  <p className="text-[11px] text-stone-400 font-mono">{ach.date}</p>

                  {ach.description && (
                    <p className="text-[12px] text-stone-400 line-clamp-2 leading-relaxed mt-2 pt-2.5 border-t border-stone-100">
                      {ach.description}
                    </p>
                  )}

                  {ach.link && (
                    
                   <a href={ach.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 mt-auto pt-2.5 text-[11px] text-sky-500 hover:text-sky-600 transition-colors font-medium w-fit"
                    >
                      <ExternalLink size={10} />
                      Lihat Sertifikat
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setModal(null)}
        >
          <div
            className="relative w-full max-w-xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-stone-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModal(null)}
              className="absolute top-3 right-3 z-10 p-1.5 bg-white rounded-lg border border-stone-200 text-stone-500 hover:text-stone-900 hover:border-stone-300 transition"
            >
              <X size={14} />
            </button>

            <div className="bg-stone-100 w-full max-h-[55vh] overflow-hidden flex items-center justify-center">
              {modal.img ? (
                <img
                  src={modal.img}
                  alt={modal.title}
                  className="w-full object-contain max-h-[55vh]"
                />
              ) : (
                <div className={`w-full h-36 flex items-center justify-center ${(CATEGORY_STYLES[modal.category] || DEFAULT_STYLE).thumb}`}>
                  <Trophy size={36} className={(CATEGORY_STYLES[modal.category] || DEFAULT_STYLE).icon} />
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-sm font-medium text-stone-900 leading-snug">
                  {modal.title}
                </h3>
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${(CATEGORY_STYLES[modal.category] || DEFAULT_STYLE).pill}`}>
                  {modal.category}
                </span>
              </div>
              <p className="text-sm text-stone-500 mb-0.5">{modal.org}</p>
              <p className="text-xs text-stone-400 font-mono mb-3">{modal.date}</p>

              {modal.description && (
                <p className="text-sm text-stone-500 leading-relaxed border-t border-stone-100 pt-3">
                  {modal.description}
                </p>
              )}

              {modal.link && (
                
                <a  href={modal.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 text-sm text-sky-500 hover:text-sky-600 transition-colors font-medium"
                >
                  <ExternalLink size={13} />
                  Lihat Sertifikat
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