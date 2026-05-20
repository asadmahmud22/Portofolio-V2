import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  Save, Menu, Check, X, AlertCircle,
  Plus, Trash2, GripVertical, ChevronDown, ChevronUp,
} from "lucide-react";

/* ─── Default data — mirrors Home.jsx exactly ─── */
const DEFAULT_DATA = {
  title:    "FULLSTACK DEVELOPER",
  name:     "Hi, I'm As'ad Mahmud Akram",
  location: "Based in Klaten, Indonesia 🇮🇩",
  workType: "Onsite",
  bio:      "Saya adalah mahasiswa Teknologi Komputer di Universitas Teknologi Digital Indonesia angkatan 2023. Sebagai seorang pengembang perangkat lunak yang antusias, saya memiliki fokus utama pada pengembangan frontend dengan pengalaman menggunakan React serta pemahaman berbagai teknologi web. Selain itu, saya juga memiliki ketertarikan dan pengalaman dalam desain UI/UX, dengan tujuan menciptakan antarmuka yang fungsional sekaligus menarik secara visual.",
  resumeUrl: "/src/assets/As'ad Mahmud Akram_CV.pdf",
  serviceText: "Sebagai seorang pengembang frontend lepas, saya berdedikasi untuk menciptakan situs web yang luar biasa dan solusi web strategis untuk merek, perusahaan, institusi, dan startup. Dengan pengalaman yang mendalam dalam pengembangan web modern, saya siap membantu mewujudkan visi digital Anda.",
  skills: [
    { id: "s1",  name: "HTML",         color: "border-orange-500", logo: "/logos/html.svg" },
    { id: "s2",  name: "JavaScript",   color: "border-yellow-500", logo: "/logos/js.svg" },
    { id: "s3",  name: "PHP",          color: "border-indigo-500", logo: "/logos/php.svg" },
    { id: "s4",  name: "Laravel",      color: "border-red-500",    logo: "/logos/laravel.svg" },
    { id: "s5",  name: "SQLite",       color: "border-blue-400",   logo: "/logos/sqlite.svg" },
    { id: "s6",  name: "Next.js",      color: "border-gray-800",   logo: "/logos/nextjs.svg" },
    { id: "s7",  name: "Vite",         color: "border-purple-500", logo: "/logos/vite.svg" },
    { id: "s8",  name: "GitHub",       color: "border-gray-800",   logo: "/logos/github.svg" },
    { id: "s9",  name: "Kotlin",       color: "border-purple-700", logo: "/logos/kotlin.svg" },
    { id: "s10", name: "TailwindCSS",  color: "border-blue-500",   logo: "/logos/tailwind.svg" },
    { id: "s11", name: "CSS",          color: "border-blue-500",   logo: "/logos/css.svg" },
    { id: "s12", name: "Autoprefixer", color: "border-blue-500",   logo: "/logos/autoprefixer.svg" },
    { id: "s13", name: "Mysql",        color: "border-blue-500",   logo: "/logos/mysql.svg" },
    { id: "s14", name: "Invinity",     color: "border-purple-500", logo: "/logos/infinity.svg" },
    { id: "s15", name: "Eslint",       color: "border-blue-500",   logo: "/logos/eslint.svg" },
    { id: "s16", name: "Vercel",       color: "border-purple-700", logo: "/logos/vercel.svg" },
  ],
};

const uid = () => Math.random().toString(36).slice(2, 9);

/* ─── Border color options ─── */
const COLOR_OPTIONS = [
  { label: "Orange",  value: "border-orange-500" },
  { label: "Yellow",  value: "border-yellow-500" },
  { label: "Indigo",  value: "border-indigo-500" },
  { label: "Red",     value: "border-red-500"    },
  { label: "Blue 4",  value: "border-blue-400"   },
  { label: "Blue 5",  value: "border-blue-500"   },
  { label: "Gray",    value: "border-gray-800"   },
  { label: "Purple5", value: "border-purple-500" },
  { label: "Purple7", value: "border-purple-700" },
  { label: "Green",   value: "border-green-500"  },
  { label: "Pink",    value: "border-pink-500"   },
];

/* ─── Toast ─── */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-white text-sm shadow-lg
      ${type === "success" ? "bg-emerald-600" : "bg-red-500"}`}>
      {type === "success" ? <Check size={15} /> : <AlertCircle size={15} />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={13} /></button>
    </div>
  );
};

/* ─── Section wrapper ─── */
const Section = ({ title, open, onToggle, children }) => (
  <div className="border border-stone-200 rounded-xl overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-5 py-4 bg-stone-50 border-b border-stone-100 hover:bg-stone-100 transition-colors text-left"
    >
      <span className="text-[13px] font-semibold text-stone-700">{title}</span>
      {open ? <ChevronUp size={15} className="text-stone-400" /> : <ChevronDown size={15} className="text-stone-400" />}
    </button>
    {open && <div className="p-5">{children}</div>}
  </div>
);

/* ─── Field label ─── */
const FieldLabel = ({ children, hint }) => (
  <div className="mb-1.5">
    <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">{children}</p>
    {hint && <p className="text-[11px] text-stone-300 mt-0.5">{hint}</p>}
  </div>
);

/* ─── Text input ─── */
const Input = ({ value, onChange, placeholder, className = "" }) => (
  <input
    type="text"
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    className={`w-full text-[13px] text-stone-800 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 outline-none
      focus:border-stone-400 focus:bg-white placeholder-stone-300 transition-colors ${className}`}
  />
);

/* ─── Textarea ─── */
const Textarea = ({ value, onChange, rows = 4, placeholder }) => (
  <textarea
    value={value}
    onChange={e => onChange(e.target.value)}
    rows={rows}
    placeholder={placeholder}
    className="w-full text-[13px] text-stone-800 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 outline-none
      focus:border-stone-400 focus:bg-white placeholder-stone-300 resize-none transition-colors"
  />
);

/* ─── Pill button ─── */
const PillBtn = ({ children, onClick, green = false, red = false }) => (
  <button onClick={onClick}
    className={`inline-flex items-center gap-0.5 text-[10px] font-medium px-2 py-0.5 rounded-full border transition-colors
      ${green ? "border-green-200 text-green-600 hover:bg-green-50"
        : red ? "border-red-200 text-red-400 hover:bg-red-50"
        : "border-stone-200 text-stone-400 hover:bg-stone-100"}`}
  >{children}</button>
);

/* ─── Skill row ─── */
const SkillRow = ({ skill, onUpdate, onDelete }) => (
  <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg px-3 py-2 hover:border-stone-300 group transition-colors">
    <GripVertical size={12} className="text-stone-200 flex-shrink-0 cursor-grab" />

    {/* Logo preview */}
    <div className={`w-7 h-7 rounded border ${skill.color} bg-black/5 flex items-center justify-center flex-shrink-0`}>
      <img src={skill.logo} alt={skill.name}
        className="w-4 h-4 object-contain"
        onError={e => { e.target.style.display = "none"; }}
      />
    </div>

    {/* Name */}
    <input
      value={skill.name}
      onChange={e => onUpdate("name", e.target.value)}
      className="flex-1 text-[12px] text-stone-800 bg-transparent outline-none border-b border-transparent focus:border-stone-300 py-0.5 min-w-0"
      placeholder="Nama skill"
    />

    {/* Logo path */}
    <input
      value={skill.logo}
      onChange={e => onUpdate("logo", e.target.value)}
      className="w-44 text-[11px] text-stone-400 bg-transparent outline-none border-b border-transparent focus:border-stone-300 py-0.5 font-mono"
      placeholder="/logos/nama.svg"
    />

    {/* Color */}
    <select
      value={skill.color}
      onChange={e => onUpdate("color", e.target.value)}
      className="text-[11px] text-stone-500 bg-white border border-stone-200 rounded px-1.5 py-1 outline-none cursor-pointer"
    >
      {COLOR_OPTIONS.map(c => (
        <option key={c.value} value={c.value}>{c.label}</option>
      ))}
    </select>

    <button onClick={onDelete}
      className="opacity-0 group-hover:opacity-100 p-1 rounded text-stone-300 hover:text-red-400 hover:bg-red-50 transition-all flex-shrink-0">
      <Trash2 size={12} />
    </button>
  </div>
);

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
const ManageHome = () => {
  const { setSidebarOpen } = useOutletContext();

  const [data,      setData]      = useState(DEFAULT_DATA);
  const [isSaving,  setIsSaving]  = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast,     setToast]     = useState(null);

  // section open state
  const [openSections, setOpenSections] = useState({
    intro: true, bio: true, service: true, resume: true, skills: true,
  });
  const toggleSection = (key) => setOpenSections(p => ({ ...p, [key]: !p[key] }));

  /* Load from Firestore */
  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "home", "main"));
        if (snap.exists()) setData({ ...DEFAULT_DATA, ...snap.data() });
      } catch (err) {
        console.error(err);
        setToast({ message: "Gagal memuat data.", type: "error" });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  /* Save to Firestore */
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "home", "main"), data);
      setToast({ message: "Perubahan berhasil disimpan!", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({ message: "Gagal menyimpan. Coba lagi.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const set = (field, value) => setData(p => ({ ...p, [field]: value }));

  /* Skill helpers */
  const addSkill = () =>
    setData(p => ({ ...p, skills: [...p.skills, { id: uid(), name: "Skill Baru", color: "border-blue-500", logo: "/logos/nama.svg" }] }));
  const updateSkill = (id, field, val) =>
    setData(p => ({ ...p, skills: p.skills.map(s => s.id !== id ? s : { ...s, [field]: val }) }));
  const deleteSkill = (id) =>
    setData(p => ({ ...p, skills: p.skills.filter(s => s.id !== id) }));

  if (isLoading) return (
    <div className="flex-1 flex items-center justify-center bg-white">
      <div className="w-7 h-7 border-2 border-stone-300 border-t-stone-700 rounded-full animate-spin" />
    </div>
  );

  return (
    <>
      {/* Topbar */}
      <header className="flex-shrink-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="md:hidden text-stone-500 hover:text-stone-900 transition" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-stone-900 font-semibold text-base leading-none">Manage Home</h1>
            <p className="text-stone-400 text-xs mt-0.5">Kelola konten yang ditampilkan di halaman Home</p>
          </div>
        </div>
        <button onClick={handleSave} disabled={isSaving}
          className="inline-flex items-center gap-1.5 text-xs font-medium bg-stone-900 text-white px-3 py-2 rounded-lg hover:bg-stone-700 transition disabled:opacity-50">
          {isSaving
            ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            : <Save size={13} />}
          {isSaving ? "Menyimpan..." : "Simpan"}
        </button>
      </header>

      {/* Body */}
      <main className="flex-1 overflow-y-auto px-6 py-6 pb-24 bg-white">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">

          {/* ── Intro ── */}
          <Section title="Intro" open={openSections.intro} onToggle={() => toggleSection("intro")}>
            <div className="flex flex-col gap-4">
              <div>
                <FieldLabel hint="Teks besar paling atas">Title</FieldLabel>
                <Input value={data.title} onChange={v => set("title", v)} placeholder="FULLSTACK DEVELOPER" />
              </div>
              <div>
                <FieldLabel hint="Nama lengkap / tagline">Nama / Headline</FieldLabel>
                <Input value={data.name} onChange={v => set("name", v)} placeholder="Hi, I'm ..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <FieldLabel hint="Contoh: Based in Klaten, Indonesia 🇮🇩">Lokasi</FieldLabel>
                  <Input value={data.location} onChange={v => set("location", v)} placeholder="Based in ..." />
                </div>
                <div>
                  <FieldLabel hint="Contoh: Onsite / Remote / Hybrid">Work Type</FieldLabel>
                  <Input value={data.workType} onChange={v => set("workType", v)} placeholder="Onsite" />
                </div>
              </div>
            </div>
          </Section>

          {/* ── Bio ── */}
          <Section title="Bio" open={openSections.bio} onToggle={() => toggleSection("bio")}>
            <FieldLabel hint="Paragraf deskripsi diri di bagian Intro">Deskripsi Bio</FieldLabel>
            <Textarea value={data.bio} onChange={v => set("bio", v)} rows={5} placeholder="Tulis bio singkat..." />
          </Section>

          {/* ── Resume ── */}
          <Section title="Resume / CV" open={openSections.resume} onToggle={() => toggleSection("resume")}>
            <FieldLabel hint="Path file PDF di folder public, contoh: /As'ad CV.pdf">URL / Path File Resume</FieldLabel>
            <Input value={data.resumeUrl} onChange={v => set("resumeUrl", v)} placeholder="/src/assets/nama-file.pdf" />
            <p className="text-[11px] text-stone-300 mt-1.5">
              File harus berada di folder <code className="bg-stone-100 px-1 rounded">public</code> atau accessible secara statis.
            </p>
          </Section>

          {/* ── Service ── */}
          <Section title="Service" open={openSections.service} onToggle={() => toggleSection("service")}>
            <FieldLabel hint="Teks di bawah bagian Service">Deskripsi Service</FieldLabel>
            <Textarea value={data.serviceText} onChange={v => set("serviceText", v)} rows={4} placeholder="Deskripsi layanan..." />
          </Section>

          {/* ── Skills ── */}
          <Section title={`Skills Marquee (${data.skills.length} item)`} open={openSections.skills} onToggle={() => toggleSection("skills")}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] text-stone-400">
                Klik nama / path / warna untuk edit langsung. Hover untuk hapus.
              </p>
              <PillBtn onClick={addSkill}><Plus size={9} /> Tambah Skill</PillBtn>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[auto_1fr_10rem_7rem_auto] gap-2 px-3 mb-1.5 items-center">
              <span />
              <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-300">Nama</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-300">Logo Path</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-300">Warna Border</p>
              <span />
            </div>

            <div className="flex flex-col gap-1.5">
              {data.skills.length === 0 && (
                <p className="text-center text-[11px] text-stone-300 italic py-6 border border-dashed border-stone-200 rounded-xl">
                  Belum ada skill — klik <strong>Tambah Skill</strong>.
                </p>
              )}
              {data.skills.map(skill => (
                <SkillRow key={skill.id} skill={skill}
                  onUpdate={(f, v) => updateSkill(skill.id, f, v)}
                  onDelete={() => deleteSkill(skill.id)} />
              ))}
            </div>

            {/* Color legend */}
            <div className="mt-4 pt-3 border-t border-stone-100">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-300 mb-2">Preview Warna Border</p>
              <div className="flex flex-wrap gap-1.5">
                {COLOR_OPTIONS.map(c => (
                  <span key={c.value} className={`text-[10px] text-stone-500 border ${c.value} bg-black/5 px-2 py-0.5 rounded-full`}>
                    {c.label}
                  </span>
                ))}
              </div>
            </div>
          </Section>

        </div>
      </main>

      {/* Sticky save bar */}
      <div className="flex-shrink-0 bg-white border-t border-stone-100 py-3 px-6 flex justify-end">
        <button onClick={handleSave} disabled={isSaving}
          className="inline-flex items-center gap-1.5 text-[12px] font-medium bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-700 transition disabled:opacity-50">
          {isSaving
            ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            : <Save size={13} />}
          {isSaving ? "Menyimpan..." : "Simpan Semua Perubahan"}
        </button>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
};

export default ManageHome;