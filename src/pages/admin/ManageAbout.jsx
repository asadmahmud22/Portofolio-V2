import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useOutletContext } from "react-router-dom";
import {
  Briefcase,
  GraduationCap,
  Plus,
  Trash2,
  Save,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  AlertCircle,
  User,
  Menu,
} from "lucide-react";

/* ─── Small reusable UI ─── */
const Label = ({ children }) => (
  <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1.5">{children}</p>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full text-sm bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-800 placeholder-stone-300 focus:outline-none focus:border-stone-400 transition ${className}`}
    {...props}
  />
);

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`w-full text-sm bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-800 placeholder-stone-300 focus:outline-none focus:border-stone-400 transition resize-none ${className}`}
    {...props}
  />
);

const Btn = ({ variant = "default", className = "", children, ...props }) => {
  const base = "inline-flex items-center gap-1.5 text-xs font-medium rounded-lg px-3 py-2 transition";
  const variants = {
    default: "bg-stone-900 text-white hover:bg-stone-700",
    ghost: "bg-white border border-stone-200 text-stone-600 hover:border-stone-400 hover:text-stone-900",
    danger: "bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-400",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

/* ─── List editor ─── */
const ListEditor = ({ items = [], onChange }) => {
  const update = (i, val) => { const n = [...items]; n[i] = val; onChange(n); };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, ""]);
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          <Textarea rows={2} value={item} onChange={(e) => update(i, e.target.value)} placeholder="Isi item..." className="flex-1" />
          <button onClick={() => remove(i)} className="mt-1 text-stone-300 hover:text-red-400 transition flex-shrink-0"><Trash2 size={14} /></button>
        </div>
      ))}
      <button onClick={add} className="inline-flex items-center gap-1.5 text-[11px] text-stone-400 hover:text-stone-700 transition mt-1">
        <Plus size={12} /> Tambah item
      </button>
    </div>
  );
};

/* ─── Collapsible panel ─── */
const Panel = ({ title, icon, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-stone-50 transition"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-stone-800">
          {icon} {title}
        </span>
        {open ? <ChevronUp size={15} className="text-stone-400" /> : <ChevronDown size={15} className="text-stone-400" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-stone-100 pt-4">{children}</div>}
    </div>
  );
};

/* ─── Education Card Editor ─── */
const EduEditor = ({ edu, onChange, onRemove }) => (
  <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col gap-3">
    <div className="flex items-center justify-between mb-1">
      <p className="text-xs font-semibold text-stone-600 flex items-center gap-1.5"><GraduationCap size={13} /> Institusi</p>
      <button onClick={onRemove} className="text-stone-300 hover:text-red-400 transition"><Trash2 size={14} /></button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div><Label>Nama Institusi</Label><Input value={edu.institution} onChange={(e) => onChange({ ...edu, institution: e.target.value })} placeholder="Universitas..." /></div>
      <div><Label>Gelar / Jurusan</Label><Input value={edu.degree} onChange={(e) => onChange({ ...edu, degree: e.target.value })} placeholder="S1 Informatika · GPA 3.9" /></div>
      <div><Label>Periode</Label><Input value={edu.period} onChange={(e) => onChange({ ...edu, period: e.target.value })} placeholder="2023 – 2026" /></div>
      <div><Label>Lokasi</Label><Input value={edu.location} onChange={(e) => onChange({ ...edu, location: e.target.value })} placeholder="Yogyakarta" /></div>
      <div className="sm:col-span-2"><Label>Path Logo (opsional)</Label><Input value={edu.logo} onChange={(e) => onChange({ ...edu, logo: e.target.value })} placeholder="/assets/logo.png" /></div>
    </div>
    <div><Label>Kegiatan & Tanggung Jawab</Label><ListEditor items={edu.responsibilities || []} onChange={(v) => onChange({ ...edu, responsibilities: v })} /></div>
    <div><Label>Pencapaian</Label><ListEditor items={edu.achievements || []} onChange={(v) => onChange({ ...edu, achievements: v })} /></div>
  </div>
);

/* ─── Career Card Editor ─── */
const CareerEditor = ({ exp, onChange, onRemove }) => (
  <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col gap-3">
    <div className="flex items-center justify-between mb-1">
      <p className="text-xs font-semibold text-stone-600 flex items-center gap-1.5"><Briefcase size={13} /> Pengalaman</p>
      <button onClick={onRemove} className="text-stone-300 hover:text-red-400 transition"><Trash2 size={14} /></button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div><Label>Jabatan / Posisi</Label><Input value={exp.title} onChange={(e) => onChange({ ...exp, title: e.target.value })} placeholder="Frontend Developer" /></div>
      <div><Label>Perusahaan / Organisasi</Label><Input value={exp.company} onChange={(e) => onChange({ ...exp, company: e.target.value })} placeholder="PT. ..." /></div>
      <div><Label>Periode</Label><Input value={exp.period} onChange={(e) => onChange({ ...exp, period: e.target.value })} placeholder="Jan 2024 – Present" /></div>
      <div><Label>Lokasi</Label><Input value={exp.location} onChange={(e) => onChange({ ...exp, location: e.target.value })} placeholder="Yogyakarta" /></div>
      <div><Label>Tipe</Label>
        <select value={exp.type} onChange={(e) => onChange({ ...exp, type: e.target.value })}
          className="w-full text-sm bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:border-stone-400 transition">
          {["Full-time", "Part-time", "Internship", "Freelance", "Contract"].map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div><Label>Mode</Label>
        <select value={exp.mode} onChange={(e) => onChange({ ...exp, mode: e.target.value })}
          className="w-full text-sm bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:border-stone-400 transition">
          {["Onsite", "Remote", "Hybrid"].map((m) => <option key={m}>{m}</option>)}
        </select>
      </div>
      <div className="sm:col-span-2"><Label>Path Logo (opsional)</Label><Input value={exp.logo} onChange={(e) => onChange({ ...exp, logo: e.target.value })} placeholder="/assets/logo.png" /></div>
    </div>
    <div><Label>Deskripsi (opsional)</Label><Textarea rows={2} value={exp.description || ""} onChange={(e) => onChange({ ...exp, description: e.target.value })} placeholder="Deskripsi singkat tentang perusahaan/organisasi..." /></div>
    <div><Label>Tanggung Jawab</Label><ListEditor items={exp.responsibilities || []} onChange={(v) => onChange({ ...exp, responsibilities: v })} /></div>
  </div>
);

/* ─── Toast ─── */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  const colors = { success: "bg-emerald-600", error: "bg-red-500" };
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-white text-sm shadow-lg ${colors[type]}`}>
      {type === "success" ? <Check size={15} /> : <AlertCircle size={15} />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={13} /></button>
    </div>
  );
};

/* ─── Blank templates ─── */
const blankEdu = () => ({ institution: "", degree: "", period: "", location: "", logo: "", responsibilities: [], achievements: [] });
const blankCareer = () => ({ title: "", company: "", period: "", location: "", type: "Full-time", mode: "Onsite", logo: "", description: "", responsibilities: [] });

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
const ManageAbout = () => {
  const { setSidebarOpen } = useOutletContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving]   = useState(false);
  const [toast, setToast]         = useState(null);
  const [bio, setBio]             = useState("");
  const [education, setEducation] = useState([]);
  const [careers, setCareers]     = useState([]);

  /* Load from Firestore */
  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "about", "main"));
        if (snap.exists()) {
          const d = snap.data();
          setBio(d.bio || "");
          setEducation(d.education || []);
          setCareers(d.careers || []);
        }
      } catch (err) {
        console.error(err);
        setToast({ message: "Gagal memuat data.", type: "error" });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "about", "main"), { bio, education, careers });
      setToast({ message: "Perubahan berhasil disimpan!", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({ message: "Gagal menyimpan. Coba lagi.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  /* Education helpers */
  const updateEdu  = (i, val) => setEducation((p) => p.map((e, idx) => idx === i ? val : e));
  const removeEdu  = (i) => setEducation((p) => p.filter((_, idx) => idx !== i));
  const addEdu     = () => setEducation((p) => [...p, blankEdu()]);

  /* Career helpers */
  const updateCareer = (i, val) => setCareers((p) => p.map((c, idx) => idx === i ? val : c));
  const removeCareer = (i) => setCareers((p) => p.filter((_, idx) => idx !== i));
  const addCareer    = () => setCareers((p) => [...p, blankCareer()]);

  if (isLoading) return (
    <div className="flex-1 flex items-center justify-center">
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
            <h1 className="text-stone-900 font-semibold text-base leading-none">Manage About</h1>
            <p className="text-stone-400 text-xs mt-0.5">Edit bio, pendidikan, dan pengalaman</p>
          </div>
        </div>
        <Btn variant="default" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save size={13} />}
          {isSaving ? "Menyimpan..." : "Simpan"}
        </Btn>
      </header>

      {/* Scrollable body */}
      <main className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-5">

          <Panel title="Bio" icon={<User size={15} />} defaultOpen>
            <Label>Teks Perkenalan</Label>
            <Textarea rows={5} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Saya adalah mahasiswa..." />
            <p className="text-[11px] text-stone-400 mt-1.5">{bio.length} karakter</p>
          </Panel>

          <Panel title="Education" icon={<GraduationCap size={15} />} defaultOpen>
            <div className="flex flex-col gap-4">
              {education.map((edu, i) => (
                <EduEditor key={i} edu={edu} onChange={(v) => updateEdu(i, v)} onRemove={() => removeEdu(i)} />
              ))}
              <Btn variant="ghost" onClick={addEdu} className="self-start">
                <Plus size={13} /> Tambah Institusi
              </Btn>
            </div>
          </Panel>

          <Panel title="Career" icon={<Briefcase size={15} />} defaultOpen>
            <div className="flex flex-col gap-4">
              {careers.map((exp, i) => (
                <CareerEditor key={i} exp={exp} onChange={(v) => updateCareer(i, v)} onRemove={() => removeCareer(i)} />
              ))}
              <Btn variant="ghost" onClick={addCareer} className="self-start">
                <Plus size={13} /> Tambah Pengalaman
              </Btn>
            </div>
          </Panel>

          <div className="flex justify-end pb-6">
            <Btn variant="default" onClick={handleSave} disabled={isSaving} className="px-6 py-2.5 text-sm">
              {isSaving ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
              {isSaving ? "Menyimpan..." : "Simpan Semua Perubahan"}
            </Btn>
          </div>

        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
};

export default ManageAbout;