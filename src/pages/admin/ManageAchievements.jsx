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
  Upload,
  Search,
  Trophy,
  Filter,
  Menu,
} from "lucide-react";

const CATEGORIES = [
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

const emptyForm = {
  title: "",
  org: "",
  date: "",
  category: "achievement",
  link: "",
  img: "",
  description: "",
};

const inputCls =
  "w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-stone-400 bg-white focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent transition";

const ManageAchievements = () => {
  const { setSidebarOpen } = useOutletContext();

  const [achievements, setAchievements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const fetchAchievements = async () => {
    const snapshot = await getDocs(collection(db, "achievements"));
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    data.sort((a, b) => (b.date > a.date ? 1 : -1));
    setAchievements(data);
  };

  useEffect(() => { fetchAchievements(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setImageFile(null);
    setImagePreview("");
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title || "",
      org: item.org || "",
      date: item.date || "",
      category: item.category || "achievement",
      link: item.link || "",
      img: item.img || "",
      description: item.description || "",
    });
    setEditId(item.id);
    setImageFile(null);
    setImagePreview(item.img || "");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.org || !form.date) {
      alert("Title, organisasi, dan tanggal wajib diisi.");
      return;
    }
    setIsSaving(true);
    try {
      const data = { ...form };
      if (editId) {
        await updateDoc(doc(db, "achievements", editId), data);
      } else {
        await addDoc(collection(db, "achievements"), data);
      }
      await fetchAchievements();
      setShowModal(false);
    } catch (err) {
      alert(`Error: ${err.code}\n${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus achievement ini?")) return;
    setIsDeleting(id);
    try {
      await deleteDoc(doc(db, "achievements", id));
      await fetchAchievements();
    } catch (err) {
      alert("Gagal menghapus data.");
    } finally {
      setIsDeleting(null);
    }
  };

  const filtered = achievements.filter((a) => {
    const matchSearch =
      a.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.org?.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      filterCategory === "all" || a.category === filterCategory;
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
            <h1 className="text-stone-900 font-semibold text-base leading-none">Manage Achievements</h1>
            <p className="text-stone-400 text-xs mt-0.5">{achievements.length} data tersimpan</p>
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
        >
          <Plus size={15} /> Tambah Baru
        </button>
      </header>

      {/* Scrollable body */}
      <main className="flex-1 overflow-y-auto px-6 py-6
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-stone-300
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb:hover]:bg-stone-400">

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari judul atau organisasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-lg text-sm text-gray-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent transition shadow-sm"
            />
          </div>
          <div className="relative shrink-0">
            <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-8 pr-8 py-2 bg-white border border-stone-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-stone-800 shadow-sm appearance-none cursor-pointer"
            >
              <option value="all">Semua Kategori</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-stone-400">
              <Trophy size={32} className="mb-3 opacity-30" />
              <p className="text-sm">Tidak ada data ditemukan.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider w-16">Img</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Judul</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Organisasi</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider w-44">Kategori</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider w-32">Tanggal</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Deskripsi</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/70 transition-colors group">
                      <td className="px-5 py-3">
                        {item.img ? (
                          <img src={item.img} alt={item.title} className="w-12 h-10 object-cover rounded-lg border border-stone-200 shadow-sm" />
                        ) : (
                          <div className="w-12 h-10 bg-stone-100 rounded-lg border border-stone-200 flex items-center justify-center">
                            <Trophy size={14} className="text-stone-300" />
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-semibold text-stone-800 line-clamp-2 leading-snug max-w-xs">{item.title}</p>
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noreferrer"
                            className="text-xs text-sky-500 hover:text-sky-700 transition-colors mt-0.5 block truncate max-w-xs">
                            {item.link}
                          </a>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-stone-600 line-clamp-2 max-w-xs text-sm leading-snug">{item.org}</p>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${CATEGORY_COLORS[item.category] || "bg-stone-100 text-stone-600 border border-stone-200"}`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-stone-500 text-xs font-medium tabular-nums">{item.date}</span>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-stone-400 text-xs line-clamp-2 max-w-sm leading-relaxed">
                          {item.description || <span className="italic text-stone-300">—</span>}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(item)} title="Edit"
                            className="p-1.5 text-stone-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} disabled={isDeleting === item.id} title="Hapus"
                            className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-40">
                            {isDeleting === item.id
                              ? <div className="w-3.5 h-3.5 border-2 border-rose-300 border-t-rose-500 rounded-full animate-spin" />
                              : <Trash2 size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {filtered.length > 0 && (
            <div className="px-5 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-400">
                Menampilkan {filtered.length} dari {achievements.length} data
              </span>
              {filterCategory !== "all" && (
                <button onClick={() => setFilterCategory("all")}
                  className="text-xs text-stone-500 hover:text-stone-800 transition-colors underline underline-offset-2">
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col border border-stone-100"
            style={{ maxHeight: "90vh" }}>

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 rounded-t-2xl shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-stone-900 rounded-lg flex items-center justify-center">
                  <Trophy size={13} className="text-amber-400" />
                </div>
                <h2 className="font-semibold text-stone-800 text-sm">
                  {editId ? "Edit Achievement" : "Tambah Achievement"}
                </h2>
              </div>
              <button onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-stone-100 rounded-lg transition text-stone-500">
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4
              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-stone-200
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb:hover]:bg-stone-300">

              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">Gambar Sertifikat</label>
                {imagePreview && (
                  <img src={imagePreview} alt="preview"
                    className="w-full h-40 object-cover rounded-xl border border-stone-200 mb-2.5 shadow-sm" />
                )}
                <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-stone-200 rounded-xl px-4 py-3 hover:border-stone-400 hover:bg-stone-50 transition text-sm text-stone-500">
                  <Upload size={15} />
                  {imageFile ? imageFile.name : "Upload gambar baru"}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                <p className="text-xs text-stone-400 mt-1.5">Atau isi URL gambar jika sudah tersimpan di folder public.</p>
                <input type="text" placeholder="/certs/nama-file.jpg" value={form.img}
                  onChange={(e) => setForm({ ...form, img: e.target.value })}
                  className={`mt-1.5 ${inputCls}`} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">
                  Judul <span className="text-rose-500 normal-case font-normal">*wajib</span>
                </label>
                <input type="text" value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Nama sertifikat / pencapaian" className={inputCls} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">
                  Organisasi / Penerbit <span className="text-rose-500 normal-case font-normal">*wajib</span>
                </label>
                <input type="text" value={form.org}
                  onChange={(e) => setForm({ ...form, org: e.target.value })}
                  placeholder="Nama organisasi / lembaga" className={inputCls} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">
                  Deskripsi <span className="text-stone-400 normal-case font-normal">(opsional)</span>
                </label>
                <textarea value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Deskripsi singkat tentang pencapaian ini..."
                  rows={3} className={`${inputCls} resize-none`} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">
                    Tanggal <span className="text-rose-500 normal-case font-normal">*wajib</span>
                  </label>
                  <input type="text" value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="January 2025" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">Kategori</label>
                  <select value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className={inputCls}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">
                  Link Sertifikat <span className="text-stone-400 normal-case font-normal">(opsional)</span>
                </label>
                <input type="text" value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://..." className={inputCls} />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-stone-100 flex gap-3 justify-end rounded-b-2xl shrink-0 bg-white">
              <button onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg transition font-medium">
                Batal
              </button>
              <button onClick={handleSave} disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-sm rounded-lg transition disabled:opacity-60 font-medium shadow-sm">
                {isSaving
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <Save size={14} />}
                {isSaving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageAchievements;