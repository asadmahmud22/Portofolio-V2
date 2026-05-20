import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  Monitor, Server, Wrench, Palette,
  Plus, Trash2, Check, X, ChevronDown, ChevronUp,
  GripVertical, Save, Menu, AlertCircle,
} from "lucide-react";

/* ─── Helpers ─── */
const uid = () => Math.random().toString(36).slice(2);

const ICON_MAP = {
  monitor: <Monitor size={13} />,
  server:  <Server  size={13} />,
  wrench:  <Wrench  size={13} />,
  palette: <Palette size={13} />,
};

/* ─── Micro components ─── */
const Editable = ({ value, onChange, placeholder = "Edit…", className = "", multiline = false }) => {
  const [on, setOn] = useState(false);
  const [draft, setDraft] = useState(value);
  const commit = () => { if (draft.trim()) onChange(draft.trim()); setOn(false); };
  const cancel = () => { setDraft(value); setOn(false); };

  if (!on) return (
    <span
      onClick={() => { setDraft(value); setOn(true); }}
      title="Klik untuk edit"
      className={`cursor-text hover:bg-stone-100 rounded px-0.5 -mx-0.5 transition-colors ${className}`}
    >
      {value || <span className="text-stone-300 italic text-[11px]">{placeholder}</span>}
    </span>
  );

  if (multiline) return (
    <span className="block w-full">
      <textarea autoFocus rows={3} value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => e.key === "Escape" && cancel()}
        className={`w-full border border-blue-300 rounded-md px-2 py-1 outline-none resize-none text-[12px] focus:ring-1 focus:ring-blue-200 ${className}`}
      />
      <span className="flex gap-1 mt-1">
        <PillBtn green onClick={commit}><Check size={9} /> Simpan</PillBtn>
        <PillBtn onClick={cancel}><X size={9} /> Batal</PillBtn>
      </span>
    </span>
  );

  return (
    <span className="inline-flex items-center gap-1">
      <input autoFocus value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") cancel(); }}
        className={`border border-blue-300 rounded-md px-2 py-0.5 outline-none focus:ring-1 focus:ring-blue-200 ${className}`}
      />
      <button onClick={commit} className="text-green-500 hover:text-green-700 transition-colors"><Check size={12} /></button>
      <button onClick={cancel} className="text-stone-400 hover:text-stone-600 transition-colors"><X size={12} /></button>
    </span>
  );
};

const PillBtn = ({ children, onClick, green = false, red = false }) => (
  <button onClick={onClick}
    className={`inline-flex items-center gap-0.5 text-[10px] font-medium px-2 py-0.5 rounded-full border transition-colors
      ${green ? "border-green-200 text-green-600 hover:bg-green-50"
        : red ? "border-red-200 text-red-400 hover:bg-red-50"
        : "border-stone-200 text-stone-400 hover:bg-stone-100"}`}
  >{children}</button>
);

const SectionLabel = ({ children }) => (
  <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-3">{children}</p>
);

/* ─── Toast ─── */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  const colors = { success: "bg-emerald-600", error: "bg-red-500" };
  return (
    <div className={`fixed bottom-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-white text-sm shadow-lg ${colors[type]}`}>
      {type === "success" ? <Check size={15} /> : <AlertCircle size={15} />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={13} /></button>
    </div>
  );
};

/* ─── Color Preset Picker ─── */
const PRESET_COLORS = [
  "#22D3EE","#3B82F6","#818CF8","#A855F7","#C084FC",
  "#F472B6","#EF4444","#F97316","#FACC15","#22C55E",
  "#2DD4BF","#EA580C","#CA8A04","#2C2C2A","#94A3B8",
];

const ColorPicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative flex-shrink-0" ref={ref}>
      <button
        onClick={() => setOpen(p => !p)}
        title="Ganti warna"
        className="w-4 h-4 rounded-full border-2 border-white shadow-sm ring-1 ring-stone-200 mt-1 block hover:scale-110 transition-transform"
        style={{ backgroundColor: value }}
      />
      {open && (
        <div className="absolute left-0 top-6 z-30 bg-white border border-stone-200 rounded-xl shadow-lg p-2.5 w-[148px]">
          <div className="grid grid-cols-5 gap-1.5 mb-2">
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                onClick={() => { onChange(c); setOpen(false); }}
                className={`w-5 h-5 rounded-full border-2 hover:scale-110 transition-transform ${value === c ? "border-stone-700 scale-110" : "border-white shadow-sm ring-1 ring-stone-200"}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          {/* Custom hex input */}
          <div className="flex items-center gap-1.5 border-t border-stone-100 pt-2">
            <span className="w-4 h-4 rounded-full flex-shrink-0 border border-stone-200" style={{ backgroundColor: value }} />
            <input
              type="text"
              value={value}
              onChange={e => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) onChange(e.target.value); }}
              className="flex-1 text-[10px] font-mono border border-stone-200 rounded px-1.5 py-0.5 outline-none focus:border-stone-400 w-0"
              maxLength={7}
              placeholder="#000000"
            />
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Skill Row ─── */
const SkillRow = ({ skill, onUpdate, onDelete }) => (
  <div className="flex items-start gap-2.5 bg-white border border-stone-200 rounded-lg px-3 py-2 hover:border-stone-300 group transition-colors">
    <GripVertical size={12} className="text-stone-200 mt-1 flex-shrink-0 cursor-grab" />
    <ColorPicker value={skill.dot} onChange={v => onUpdate("dot", v)} />
    <div className="flex-1 min-w-0">
      <Editable value={skill.name} onChange={v => onUpdate("name", v)}
        placeholder="Nama skill" className="text-[12px] font-medium text-stone-900 block" />
      <div className="mt-0.5">
        <Editable value={skill.description} onChange={v => onUpdate("description", v)}
          placeholder="Deskripsi singkat…"
          className="text-[11px] text-stone-400 leading-relaxed block w-full" multiline />
      </div>
    </div>
    <button onClick={onDelete}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md text-stone-300 hover:text-red-400 hover:bg-red-50 mt-0.5 flex-shrink-0">
      <Trash2 size={12} />
    </button>
  </div>
);

/* ─── Category Card ─── */
const CategoryCard = ({ cat, onUpdateCat, onDeleteCat, onAddSkill, onUpdateSkill, onDeleteSkill }) => {
  const [open, setOpen] = useState(true);
  const [iconMenu, setIconMenu] = useState(false);

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden hover:border-stone-300 transition-colors">
      <div className="flex items-center gap-2.5 px-4 py-3 bg-stone-50 border-b border-stone-100">
        <div className="relative">
          <button onClick={() => setIconMenu(p => !p)}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-md hover:bg-stone-200 transition-colors">
            {ICON_MAP[cat.iconKey] ?? <Monitor size={13} />}
          </button>
          {iconMenu && (
            <div className="absolute top-8 left-0 z-10 flex gap-1 bg-white border border-stone-200 rounded-lg p-1.5 shadow-md">
              {Object.keys(ICON_MAP).map(k => (
                <button key={k} onClick={() => { onUpdateCat("iconKey", k); setIconMenu(false); }}
                  className={`p-1.5 rounded-md transition-colors ${cat.iconKey === k ? "bg-stone-900 text-white" : "text-stone-400 hover:bg-stone-100"}`}>
                  {ICON_MAP[k]}
                </button>
              ))}
            </div>
          )}
        </div>
        <Editable value={cat.category} onChange={v => onUpdateCat("category", v)}
          placeholder="Nama kategori" className="text-[12px] font-medium text-stone-700 flex-1" />
        <span className="text-[10px] font-mono text-stone-300 flex-shrink-0">
          {cat.items.length} skill{cat.items.length !== 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0">
          <PillBtn onClick={onAddSkill}><Plus size={9} /> Tambah</PillBtn>
          <button onClick={() => setOpen(p => !p)}
            className="p-1 rounded-md text-stone-400 hover:bg-stone-200 transition-colors">
            {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          <button onClick={onDeleteCat}
            className="p-1 rounded-md text-stone-300 hover:text-red-400 hover:bg-red-50 transition-colors">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      {open && (
        <div className="p-3 flex flex-col gap-1.5">
          {cat.items.length === 0
            ? <p className="text-center text-[11px] text-stone-300 italic py-4">Belum ada skill — klik <strong>Tambah</strong> di atas.</p>
            : cat.items.map(skill => (
              <SkillRow key={skill.id} skill={skill}
                onUpdate={(f, v) => onUpdateSkill(skill.id, f, v)}
                onDelete={() => onDeleteSkill(skill.id)} />
            ))
          }
        </div>
      )}
    </div>
  );
};

/* ─── Timeline Item ─── */
const TimelineItem = ({ item, isLast, onUpdate, onDelete }) => (
  <div className="flex gap-3.5 pb-4 last:pb-0 group">
    <div className="flex flex-col items-center flex-shrink-0">
      <div className="w-2 h-2 rounded-full bg-stone-400 mt-1.5" />
      {!isLast && <div className="w-px flex-1 bg-stone-200 mt-1" />}
    </div>
    <div className="flex-1 min-w-0">
      <Editable value={item.period} onChange={v => onUpdate("period", v)}
        placeholder="Periode" className="text-[11px] font-mono text-stone-400 block mb-1" />
      <Editable value={item.role} onChange={v => onUpdate("role", v)}
        placeholder="Role / Jabatan" className="text-[13px] font-medium text-stone-900 block" />
      <div className="mt-0.5">
        <Editable value={item.company} onChange={v => onUpdate("company", v)}
          placeholder="Perusahaan / Instansi" className="text-[12px] text-stone-500 block" />
      </div>
      <div className="mt-1.5">
        <Editable value={item.description} onChange={v => onUpdate("description", v)}
          placeholder="Deskripsi singkat…"
          className="text-[12px] text-stone-400 leading-relaxed block w-full" multiline />
      </div>
    </div>
    <button onClick={onDelete}
      className="opacity-0 group-hover:opacity-100 self-start p-1 rounded-md text-stone-300 hover:text-red-400 hover:bg-red-50 transition-opacity flex-shrink-0 mt-1">
      <Trash2 size={12} />
    </button>
  </div>
);

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
const ManageSkills = () => {
  const { setSidebarOpen } = useOutletContext();

  const [skills,     setSkills]     = useState([]);
  const [additional, setAdditional] = useState([]);
  const [timeline,   setTimeline]   = useState([]);
  const [newAdd,     setNewAdd]     = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [addingCat,  setAddingCat]  = useState(false);
  const [isSaving,   setIsSaving]   = useState(false);
  const [isLoading,  setIsLoading]  = useState(true);
  const [toast,      setToast]      = useState(null);

  /* Load from Firestore */
  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "skills", "main"));
        if (snap.exists()) {
          const d = snap.data();
          setSkills(d.skills || []);
          setAdditional(d.additional || []);
          setTimeline(d.timeline || []);
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

  /* Save to Firestore */
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "skills", "main"), { skills, additional, timeline });
      setToast({ message: "Perubahan berhasil disimpan!", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({ message: "Gagal menyimpan. Coba lagi.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  /* Category */
  const updateCat = (id, f, v) => setSkills(p => p.map(c => c.id === id ? { ...c, [f]: v } : c));
  const deleteCat = (id) => { if (window.confirm("Hapus kategori ini?")) setSkills(p => p.filter(c => c.id !== id)); };
  const addCat    = () => {
    if (!newCatName.trim()) return;
    setSkills(p => [...p, { id: uid(), category: newCatName.trim(), iconKey: "monitor", items: [] }]);
    setNewCatName(""); setAddingCat(false);
  };

  /* Skill */
  const addSkill    = (catId) => setSkills(p => p.map(c => c.id !== catId ? c : { ...c, items: [...c.items, { id: uid(), name: "Skill Baru", dot: "#94A3B8", description: "Deskripsi skill." }] }));
  const updateSkill = (catId, sId, f, v) => setSkills(p => p.map(c => c.id !== catId ? c : { ...c, items: c.items.map(s => s.id !== sId ? s : { ...s, [f]: v }) }));
  const deleteSkill = (catId, sId) => setSkills(p => p.map(c => c.id !== catId ? c : { ...c, items: c.items.filter(s => s.id !== sId) }));

  /* Additional */
  const addAdditional    = () => { if (!newAdd.trim()) return; setAdditional(p => [...p, newAdd.trim()]); setNewAdd(""); };
  const deleteAdditional = (i) => setAdditional(p => p.filter((_, idx) => idx !== i));

  /* Timeline */
  const updateTimeline = (id, f, v) => setTimeline(p => p.map(t => t.id !== id ? t : { ...t, [f]: v }));
  const deleteTimeline = (id) => setTimeline(p => p.filter(t => t.id !== id));
  const addTimeline    = () => setTimeline(p => [...p, { id: uid(), period: "20XX – 20XX", role: "Role Baru", company: "Nama Perusahaan", description: "Deskripsi pengalaman." }]);

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
            <h1 className="text-stone-900 font-semibold text-base leading-none">Manage Skills</h1>
            <p className="text-stone-400 text-xs mt-0.5">Kelola skill, tools, dan timeline pengalaman</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-1.5 text-xs font-medium bg-stone-900 text-white px-3 py-2 rounded-lg hover:bg-stone-700 transition disabled:opacity-50"
        >
          {isSaving
            ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            : <Save size={13} />}
          {isSaving ? "Menyimpan..." : "Simpan"}
        </button>
      </header>

      {/* Scrollable body */}
      <main className="flex-1 overflow-y-auto px-6 py-8 pb-24">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">

          {/* ── Core Skills ── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <SectionLabel>Core Skills</SectionLabel>
              <PillBtn onClick={() => setAddingCat(true)}><Plus size={9} /> Tambah Kategori</PillBtn>
            </div>

            {addingCat && (
              <div className="flex items-center gap-2 mb-3 border border-dashed border-stone-300 rounded-xl px-4 py-3 bg-stone-50">
                <input autoFocus value={newCatName} onChange={e => setNewCatName(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") addCat(); if (e.key === "Escape") setAddingCat(false); }}
                  placeholder="Nama kategori baru…"
                  className="flex-1 text-[13px] outline-none bg-transparent border-b border-stone-300 py-0.5 placeholder-stone-300" />
                <PillBtn green onClick={addCat}><Check size={9} /> Tambah</PillBtn>
                <PillBtn onClick={() => setAddingCat(false)}><X size={9} /> Batal</PillBtn>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {skills.length === 0
                ? <p className="text-center text-[11px] text-stone-300 italic py-6 border border-dashed border-stone-200 rounded-xl">Belum ada kategori — klik <strong>Tambah Kategori</strong>.</p>
                : skills.map(cat => (
                  <CategoryCard key={cat.id} cat={cat}
                    onUpdateCat={(f, v) => updateCat(cat.id, f, v)}
                    onDeleteCat={() => deleteCat(cat.id)}
                    onAddSkill={() => addSkill(cat.id)}
                    onUpdateSkill={(sId, f, v) => updateSkill(cat.id, sId, f, v)}
                    onDeleteSkill={(sId) => deleteSkill(cat.id, sId)} />
                ))
              }
            </div>
          </section>

          <div className="border-t border-stone-200" />

          {/* ── Additional Skills ── */}
          <section>
            <SectionLabel>Additional Skills</SectionLabel>
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {additional.length === 0 && <span className="text-[11px] text-stone-300 italic">Belum ada skill tambahan.</span>}
                {additional.map((s, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-[11px] text-stone-500 bg-white border border-stone-200 px-2.5 py-1 rounded-full group hover:border-red-200 transition-colors">
                    {s}
                    <button onClick={() => deleteAdditional(i)} className="text-stone-300 group-hover:text-red-400 transition-colors"><X size={10} /></button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input value={newAdd} onChange={e => setNewAdd(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addAdditional()}
                  placeholder="Tambah skill baru… (Enter)"
                  className="flex-1 max-w-xs text-[12px] border border-stone-200 rounded-full px-3 py-1.5 outline-none focus:border-stone-400 placeholder-stone-300 bg-white" />
                <PillBtn green onClick={addAdditional}><Plus size={9} /> Tambah</PillBtn>
              </div>
            </div>
          </section>

          <div className="border-t border-stone-200" />

          {/* ── Experience Timeline ── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <SectionLabel>Experience Timeline</SectionLabel>
              <PillBtn onClick={addTimeline}><Plus size={9} /> Tambah Entri</PillBtn>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
              {timeline.length === 0
                ? <p className="text-center text-[11px] text-stone-300 italic py-6">Belum ada timeline — klik <strong>Tambah Entri</strong>.</p>
                : timeline.map((item, i) => (
                  <TimelineItem key={item.id} item={item} isLast={i === timeline.length - 1}
                    onUpdate={(f, v) => updateTimeline(item.id, f, v)}
                    onDelete={() => deleteTimeline(item.id)} />
                ))
              }
            </div>
          </section>

        </div>
      </main>

      {/* Sticky save bar */}
      <div className="flex-shrink-0 bg-white/90 backdrop-blur border-t border-stone-100 py-3 px-6 flex justify-end">
        <button onClick={handleSave} disabled={isSaving}
          className="inline-flex items-center gap-1.5 text-[12px] font-medium bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-700 transition disabled:opacity-50">
          {isSaving
            ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            : <Save size={13} />}
          {isSaving ? "Menyimpan..." : "Simpan Semua Perubahan"}
        </button>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
};

export default ManageSkills;