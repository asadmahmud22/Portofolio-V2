import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  Mail, Instagram, Linkedin, Github, Save, Check, X,
  AlertCircle, Menu, ExternalLink,
} from "lucide-react";

/* ─── TikTok icon (lucide doesn't have one) ─── */
const TikTokIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

/* ─── Field metadata ─── */
const FIELDS = [
  {
    key: "email",
    label: "Email",
    icon: Mail,
    iconColor: "text-red-500",
    iconBg: "bg-red-50 border-red-100",
    placeholder: "asadmahmudakram@gmail.com",
    prefix: "mailto:",
    hint: "Masukkan alamat email saja, tanpa 'mailto:'",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: Instagram,
    iconColor: "text-pink-500",
    iconBg: "bg-pink-50 border-pink-100",
    placeholder: "https://instagram.com/username",
    hint: "URL lengkap profil Instagram",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50 border-blue-100",
    placeholder: "https://linkedin.com/in/username",
    hint: "URL lengkap profil LinkedIn",
  },
  {
    key: "tiktok",
    label: "TikTok",
    CustomIcon: TikTokIcon,
    iconColor: "text-stone-700",
    iconBg: "bg-stone-100 border-stone-200",
    placeholder: "https://www.tiktok.com/@username",
    hint: "URL lengkap profil TikTok",
  },
  {
    key: "github",
    label: "GitHub",
    icon: Github,
    iconColor: "text-stone-900",
    iconBg: "bg-stone-100 border-stone-200",
    placeholder: "https://github.com/username",
    hint: "URL lengkap profil GitHub",
  },
];

const DEFAULT_LINKS = {
  email:     "asadmahmudakram@gmail.com",
  instagram: "https://instagram.com/asaddakram",
  linkedin:  "https://linkedin.com/in/asad-mahmud-akram",
  tiktok:    "https://www.tiktok.com/@asad-akram",
  github:    "https://github.com/asadmahmud22",
};

/* ─── Toast ─── */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed bottom-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-white text-sm shadow-lg
      ${type === "success" ? "bg-emerald-600" : "bg-red-500"}`}>
      {type === "success" ? <Check size={15} /> : <AlertCircle size={15} />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={13} /></button>
    </div>
  );
};

/* ─── Main ─── */
const ManageContact = () => {
  const { setSidebarOpen } = useOutletContext();

  const [links,     setLinks]     = useState(DEFAULT_LINKS);
  const [isSaving,  setIsSaving]  = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast,     setToast]     = useState(null);

  /* Load from Firestore */
  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "contact", "links"));
        if (snap.exists()) setLinks({ ...DEFAULT_LINKS, ...snap.data() });
      } catch (err) {
        console.error(err);
        setToast({ message: "Gagal memuat data.", type: "error" });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  /* Save */
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "contact", "links"), links);
      setToast({ message: "Link berhasil disimpan!", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({ message: "Gagal menyimpan. Coba lagi.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const update = (key, val) => setLinks(p => ({ ...p, [key]: val }));

  /* Resolve href for preview */
  const resolveHref = (field) => {
    if (field.key === "email") return `mailto:${links[field.key]}`;
    return links[field.key];
  };

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
          <button
            className="md:hidden text-stone-500 hover:text-stone-900 transition"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-stone-900 font-semibold text-base leading-none">Manage Contact</h1>
            <p className="text-stone-400 text-xs mt-0.5">Kelola link sosial media di halaman Contact</p>
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

      {/* Body */}
      <main className="flex-1 overflow-y-auto px-6 py-8 pb-24 bg-white">
        <div className="max-w-2xl mx-auto flex flex-col gap-3">

          <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1">
            Social Links
          </p>

          {FIELDS.map((field) => {
            const IconComp = field.icon;
            const value = links[field.key] ?? "";

            return (
              <div
                key={field.key}
                className="bg-white border border-stone-200 rounded-xl p-4 hover:border-stone-300 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${field.iconBg}`}>
                    {field.CustomIcon
                      ? <field.CustomIcon size={17} className={field.iconColor} />
                      : <IconComp size={17} className={field.iconColor} />
                    }
                  </div>
                  <p className="text-[13px] font-medium text-stone-900">{field.label}</p>

                  {/* Preview link */}
                  {value && (
                    <a
                      href={resolveHref(field)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto flex items-center gap-1 text-[11px] text-stone-400 hover:text-stone-700 transition-colors"
                    >
                      Preview <ExternalLink size={11} />
                    </a>
                  )}
                </div>

                {/* Input */}
                <input
                  type="text"
                  value={value}
                  onChange={e => update(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full text-[13px] text-stone-800 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 outline-none focus:border-stone-400 focus:bg-white placeholder-stone-300 transition-colors"
                />
                {field.hint && (
                  <p className="text-[11px] text-stone-400 mt-1.5">{field.hint}</p>
                )}
              </div>
            );
          })}

        </div>
      </main>

      {/* Sticky save bar */}
      <div className="flex-shrink-0 bg-white border-t border-stone-100 py-3 px-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-1.5 text-[12px] font-medium bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-700 transition disabled:opacity-50"
        >
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

export default ManageContact;