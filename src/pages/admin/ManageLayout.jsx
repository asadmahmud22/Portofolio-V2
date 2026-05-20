/**
 * ManageLayout.jsx
 * Halaman admin untuk mengedit konten sidebar Layout.jsx (portfolio publik).
 * Data disimpan ke Firestore collection "siteConfig" doc "layout".
 */

import { useEffect, useState } from "react";
import { db, storage } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useOutletContext } from "react-router-dom";
import {
  User,
  Type,
  AtSign,
  Copyright,
  ImageIcon,
  Save,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Upload,
  Menu,
} from "lucide-react";

const DOC_REF_PATH = { collection: "siteConfig", doc: "layout" };

const DEFAULT_DATA = {
  name: "As'ad Mahmud Akram",
  title: "Fullstack Developer",
  username: "@asadmahmudakram",
  footerName: "As'ad Mahmud Akram",
  footerYear: "2025",
  profileImage: "/assets/profile.jpg",
};

const FIELDS = [
  {
    key: "name",
    label: "Nama Lengkap",
    icon: User,
    placeholder: "As'ad Mahmud Akram",
    hint: "Ditampilkan sebagai heading utama di sidebar.",
  },
  {
    key: "title",
    label: "Profesi / Title",
    icon: Type,
    placeholder: "Fullstack Developer",
    hint: "Ditampilkan di bawah nama.",
  },
  {
    key: "username",
    label: "Username",
    icon: AtSign,
    placeholder: "@asadmahmudakram",
    hint: "Handle sosial media yang tampil di sidebar.",
  },
  {
    key: "footerName",
    label: "Nama di Footer",
    icon: Copyright,
    placeholder: "As'ad Mahmud Akram",
    hint: 'Nama yang muncul di "© 2025 ..."',
  },
  {
    key: "footerYear",
    label: "Tahun Copyright",
    icon: Copyright,
    placeholder: "2025",
    hint: "Tahun yang tampil di footer sidebar.",
  },
];

// ─── Status Banner ────────────────────────────────────────────────────────────

function StatusBanner({ status }) {
  if (!status) return null;
  const config = {
    saving: { icon: Loader2,       text: "Menyimpan perubahan...",      cls: "bg-stone-50 border-stone-200 text-stone-600",   spin: true  },
    success: { icon: CheckCircle2, text: "Perubahan berhasil disimpan!", cls: "bg-green-50 border-green-200 text-green-700",   spin: false },
    error:   { icon: AlertCircle,  text: "Gagal menyimpan. Coba lagi.", cls: "bg-red-50 border-red-200 text-red-700",         spin: false },
  }[status];
  const Icon = config.icon;
  return (
    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm mb-6 ${config.cls}`}>
      <Icon size={15} className={config.spin ? "animate-spin" : ""} />
      {config.text}
    </div>
  );
}

// ─── Preview Card ─────────────────────────────────────────────────────────────

function PreviewCard({ data }) {
  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-stone-100 flex items-center gap-2">
        <Eye size={13} className="text-stone-400" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
          Preview Sidebar
        </span>
      </div>
      <div className="p-5 flex flex-col items-center bg-gradient-to-b from-stone-50 to-white">
        <div className="w-16 h-16 rounded-full overflow-hidden mb-3 ring-2 ring-white shadow-md bg-stone-200 flex-shrink-0">
          <img
            src={data.profileImage || "/assets/profile.jpg"}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>
        <p className="text-sm font-bold text-stone-800 text-center leading-tight mb-0.5">{data.name || "—"}</p>
        <p className="text-xs font-semibold text-stone-700 text-center leading-tight mb-1">{data.title || "—"}</p>
        <p className="text-[11px] text-stone-400 mb-3">{data.username || "—"}</p>
        <div className="flex items-center gap-1.5 bg-stone-900 text-white text-[11px] px-3 py-1.5 rounded-lg w-full justify-center mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          Hire me
        </div>
        <div className="w-full space-y-0.5 mb-4">
          {["Home", "About", "Skills", "Achievements", "Projects", "Contact"].map((label, i) => (
            <div
              key={label}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] ${
                i === 0 ? "bg-stone-900 text-white font-medium" : "text-stone-500"
              }`}
            >
              <span className="w-1 h-1 rounded-full bg-current opacity-50" />
              {label}
            </div>
          ))}
        </div>
        <div className="text-[10px] text-stone-400 text-center space-y-0.5 pt-3 border-t border-stone-100 w-full">
          <div className="font-medium">© {data.footerYear || "2025"}</div>
          <div>{data.footerName || "—"}</div>
          <div className="text-stone-300">All rights reserved</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const ManageLayout = () => {
  const context = useOutletContext();
  const { setSidebarOpen } = context ?? {};

  const [formData, setFormData]     = useState(DEFAULT_DATA);
  const [savedData, setSavedData]   = useState(DEFAULT_DATA);
  const [loadingData, setLoadingData] = useState(true);
  const [status, setStatus]         = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDirty, setIsDirty]       = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, DOC_REF_PATH.collection, DOC_REF_PATH.doc));
        if (snap.exists()) {
          const data = { ...DEFAULT_DATA, ...snap.data() };
          setFormData(data);
          setSavedData(data);
        }
      } catch (err) {
        console.error("Gagal load data layout:", err);
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    setIsDirty(JSON.stringify(formData) !== JSON.stringify(savedData));
  }, [formData, savedData]);

  const handleChange = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `profile/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      handleChange("profileImage", url);
    } catch (err) {
      console.error("Gagal upload gambar:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setStatus("saving");
    try {
      await setDoc(doc(db, DOC_REF_PATH.collection, DOC_REF_PATH.doc), formData, { merge: true });
      setSavedData(formData);
      setStatus("success");
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      console.error("Gagal simpan:", err);
      setStatus("error");
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const handleReset = () => {
    setFormData(savedData);
    setStatus(null);
  };

  if (loadingData) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={20} className="animate-spin text-stone-400" />
        </div>
      </div>
    );
  }

  return (
    // ↓ Ini wrapper utama: flex column, full height, overflow hidden
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Topbar sticky ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 md:px-6 py-3.5 bg-white border-b border-stone-200">
        <div className="flex items-center gap-3">
          {/* Hamburger mobile */}
          <button
            onClick={() => setSidebarOpen?.(true)}
            className="md:hidden p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <Menu size={18} />
          </button>
          <div>
            <h1 className="text-sm font-semibold text-stone-900 leading-tight">Manage Layout</h1>
            <p className="text-[11px] text-stone-400 hidden sm:block">Edit konten sidebar portfolio publik.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            disabled={!isDirty || status === "saving"}
            className="flex items-center gap-1.5 text-[12px] border border-stone-200 text-stone-500 px-3 py-2 rounded-lg hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw size={13} />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            onClick={handleSave}
            disabled={!isDirty || status === "saving"}
            className="flex items-center gap-1.5 text-[12px] bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {status === "saving" ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            Simpan
          </button>
        </div>
      </div>

      {/* ── Scrollable content area ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full">

          <StatusBanner status={status} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Form */}
            <div className="lg:col-span-2 space-y-4">

              {/* Foto Profil */}
              <div className="bg-white border border-stone-200 rounded-xl p-5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-4">
                  Foto Profil
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-stone-100 ring-2 ring-stone-200 flex-shrink-0">
                    <img
                      src={formData.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 px-3 py-2 border border-stone-200 rounded-lg bg-stone-50">
                      <ImageIcon size={13} className="text-stone-400 flex-shrink-0" />
                      <input
                        type="text"
                        value={formData.profileImage}
                        onChange={(e) => handleChange("profileImage", e.target.value)}
                        placeholder="URL gambar atau upload..."
                        className="flex-1 text-[12px] bg-transparent focus:outline-none text-stone-700 placeholder:text-stone-400 min-w-0"
                      />
                    </div>
                    <label className="flex items-center gap-1.5 text-[11px] text-stone-500 border border-stone-200 bg-white px-3 py-1.5 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors w-fit">
                      {uploadingImage ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                      {uploadingImage ? "Mengupload..." : "Upload gambar"}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Text Fields */}
              <div className="bg-white border border-stone-200 rounded-xl p-5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-4">
                  Informasi Profil
                </p>
                <div className="space-y-4">
                  {FIELDS.map(({ key, label, icon: Icon, placeholder, hint }) => (
                    <div key={key}>
                      <label className="flex items-center gap-1.5 text-[11px] font-medium text-stone-600 mb-1.5">
                        <Icon size={12} className="text-stone-400" />
                        {label}
                      </label>
                      <input
                        type="text"
                        value={formData[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder={placeholder}
                        className="w-full text-[13px] border border-stone-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-stone-400 bg-stone-50 focus:bg-white transition-colors text-stone-800 placeholder:text-stone-300"
                      />
                      {hint && <p className="text-[11px] text-stone-400 mt-1">{hint}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  <span className="font-semibold text-stone-700">Catatan:</span>{" "}
                  Perubahan akan langsung tampil di portfolio setelah disimpan. Nav items dan tombol "Hire me" tidak perlu diubah dari sini.
                </p>
              </div>
            </div>

            {/* Preview — sticky hanya di lg ke atas */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-4">
                <PreviewCard data={formData} />
                {isDirty && (
                  <p className="text-[11px] text-amber-600 text-center mt-2 flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                    Ada perubahan yang belum disimpan
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default ManageLayout;