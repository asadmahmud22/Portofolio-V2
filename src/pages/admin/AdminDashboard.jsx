import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Award,
  Briefcase,
  LogOut,
  Shield,
  LayoutDashboard,
  ArrowUpRight,
  Menu,
  ChevronRight,
} from "lucide-react";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projectCount, setProjectCount] = useState(null);
  const [achievementCount, setAchievementCount] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/admin");
      } else {
        setUser(currentUser);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [projectSnap, achievementSnap] = await Promise.all([
          getDocs(collection(db, "projects")),
          getDocs(collection(db, "achievements")),
        ]);
        setProjectCount(projectSnap.size);
        setAchievementCount(achievementSnap.size);
      } catch (err) {
        console.error("Gagal fetch counts:", err);
        setProjectCount(0);
        setAchievementCount(0);
      }
    };
    fetchCounts();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin");
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-stone-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-700 rounded-full animate-spin" />
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Achievements", icon: Award, path: "/admin/achievements" },
    { label: "Projects", icon: Briefcase, path: "/admin/projects" },
  ];

  const stats = [
    {
      label: "Total Proyek",
      value: projectCount === null ? "..." : projectCount,
      sub: "dari database",
    },
    {
      label: "Sertifikat",
      value: achievementCount === null ? "..." : achievementCount,
      sub: "dari database",
    },
    {
      label: "Terakhir Login",
      value: "Hari ini",
      sub: user?.email,
    },
  ];

  const isActive = (path) => location.pathname === path;

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-white border-r border-stone-200">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3 border-b border-stone-200">
        <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center flex-shrink-0">
          <Shield size={16} className="text-white" />
        </div>
        <div>
          <p className="text-stone-900 text-sm font-semibold leading-none">Admin Panel</p>
          <p className="text-stone-400 text-xs mt-0.5">Portofolio</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                ${active
                  ? "bg-stone-900 text-white"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
            >
              <item.icon
                size={16}
                className={active ? "text-white" : "text-stone-400 group-hover:text-stone-700"}
              />
              {item.label}
              {active && <ChevronRight size={14} className="ml-auto text-stone-400" />}
            </button>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="px-3 py-4 border-t border-stone-200 space-y-1">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition"
        >
          <ArrowUpRight size={16} />
          Ke Portofolio
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-500 hover:text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* User pill */}
      <div className="px-4 pb-5">
        <div className="bg-stone-100 border border-stone-200 rounded-lg px-3 py-2.5 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-stone-800 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold uppercase">
              {user?.email?.[0]}
            </span>
          </div>
          <p className="text-stone-700 text-xs truncate">{user?.email}</p>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="fixed inset-0 flex bg-stone-100">

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-56 lg:w-60 flex-shrink-0 flex-col">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-50 w-64 flex flex-col">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

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
              <h1 className="text-stone-900 font-semibold text-base leading-none">Dashboard</h1>
              <p className="text-stone-400 text-xs mt-0.5">Selamat datang kembali</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500 hover:text-red-600 transition px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            <LogOut size={14} />
            Logout
          </button>
        </header>

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto px-6 py-8">

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {stats.map((s, i) => (
              <div key={i} className="bg-white border border-stone-200 rounded-xl px-5 py-4 shadow-sm">
                <p className="text-stone-400 text-xs uppercase tracking-wider mb-1">{s.label}</p>
                <p className="text-stone-900 text-2xl font-bold leading-none mb-1">{s.value}</p>
                <p className="text-stone-400 text-xs truncate">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Menu Cards */}
          <p className="text-stone-400 text-xs uppercase tracking-widest mb-4">Kelola Konten</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Achievements */}
            <button
              onClick={() => navigate("/admin/achievements")}
              className="group bg-white border border-stone-200 hover:border-yellow-400 rounded-xl p-6 text-left transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-10 h-10 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center justify-center">
                  <Award size={20} className="text-yellow-500" />
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-stone-300 group-hover:text-yellow-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                />
              </div>
              <h3 className="text-stone-900 font-semibold mb-1">Achievements</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Tambah, edit, dan hapus data sertifikat & pencapaian.
              </p>
              {achievementCount !== null && (
                <p className="text-yellow-600 text-xs mt-3 font-medium">
                  {achievementCount} sertifikat tersimpan
                </p>
              )}
            </button>

            {/* Projects */}
            <button
              onClick={() => navigate("/admin/projects")}
              className="group bg-white border border-stone-200 hover:border-blue-400 rounded-xl p-6 text-left transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center">
                  <Briefcase size={20} className="text-blue-500" />
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-stone-300 group-hover:text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                />
              </div>
              <h3 className="text-stone-900 font-semibold mb-1">Projects</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Kelola daftar proyek yang ditampilkan di portofolio.
              </p>
              {projectCount !== null && (
                <p className="text-blue-600 text-xs mt-3 font-medium">
                  {projectCount} proyek tersimpan
                </p>
              )}
            </button>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;