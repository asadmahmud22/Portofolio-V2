import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Award,
  Briefcase,
  User,
  Code,
  ArrowUpRight,
  Menu,
  LogOut,
} from "lucide-react";

const AdminDashboard = () => {
  const { user, handleLogout, setSidebarOpen } = useOutletContext();
  const [projectCount, setProjectCount] = useState(null);
  const [achievementCount, setAchievementCount] = useState(null);
  const [skillCount, setSkillCount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [projectSnap, achievementSnap, skillSnap] = await Promise.all([
          getDocs(collection(db, "projects")),
          getDocs(collection(db, "achievements")),
          getDocs(collection(db, "skills")),
        ]);
        setProjectCount(projectSnap.size);
        setAchievementCount(achievementSnap.size);
        setSkillCount(skillSnap.size);
      } catch (err) {
        console.error("Gagal fetch counts:", err);
        setProjectCount(0);
        setAchievementCount(0);
        setSkillCount(0);
      }
    };
    fetchCounts();
  }, []);

  const stats = [
    {
      label: "Total Proyek",
      value: projectCount === null ? "…" : projectCount,
      sub: "tersimpan di database",
    },
    {
      label: "Sertifikat",
      value: achievementCount === null ? "…" : achievementCount,
      sub: "tersimpan di database",
    },
    {
      label: "Skills",
      value: skillCount === null ? "…" : skillCount,
      sub: "tersimpan di database",
    },
    {
      label: "Terakhir Login",
      value: "Hari ini",
      sub: user?.email ?? "—",
    },
  ];

  const menuCards = [
    {
      label: "Achievements",
      desc: "Tambah, edit, dan hapus data sertifikat & pencapaian.",
      icon: Award,
      path: "/admin/achievements",
      accent: "yellow",
      count: achievementCount,
      countLabel: "sertifikat",
    },
    {
      label: "Projects",
      desc: "Kelola daftar proyek yang ditampilkan di portofolio.",
      icon: Briefcase,
      path: "/admin/projects",
      accent: "blue",
      count: projectCount,
      countLabel: "proyek",
    },
    {
      label: "About",
      desc: "Edit bio, pendidikan, dan pengalaman kerja.",
      icon: User,
      path: "/admin/about",
      accent: "emerald",
      count: null,
      countLabel: null,
    },
    {
      label: "Skills",
      desc: "Kelola daftar teknologi & skill di portofolio.",
      icon: Code,
      path: "/admin/skills",
      accent: "violet",
      count: skillCount,
      countLabel: "skill",
    },
  ];

  const accentMap = {
    yellow:  { border: "hover:border-yellow-300",  icon: "bg-yellow-50 border-yellow-200",  iconColor: "text-yellow-500",  arrow: "group-hover:text-yellow-400",  count: "text-yellow-600"  },
    blue:    { border: "hover:border-blue-300",    icon: "bg-blue-50 border-blue-200",      iconColor: "text-blue-500",    arrow: "group-hover:text-blue-400",    count: "text-blue-600"    },
    emerald: { border: "hover:border-emerald-300", icon: "bg-emerald-50 border-emerald-200",iconColor: "text-emerald-500", arrow: "group-hover:text-emerald-400", count: "text-emerald-600" },
    violet:  { border: "hover:border-violet-300",  icon: "bg-violet-50 border-violet-200",  iconColor: "text-violet-500",  arrow: "group-hover:text-violet-400",  count: "text-violet-600"  },
  };

  return (
    <>
      {/* Topbar */}
      <header className="flex-shrink-0 bg-white border-b border-stone-200 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-stone-500 hover:text-stone-900 transition"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} />
          </button>
          <div>
            <h1 className="text-stone-900 font-medium text-sm leading-none">
              Dashboard
            </h1>
            <p className="text-stone-400 text-xs mt-0.5">
              Selamat datang kembali
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500 hover:text-red-600 transition px-3 py-1.5 rounded-lg hover:bg-red-50"
        >
          <LogOut size={13} /> Logout
        </button>
      </header>

      {/* Scrollable body */}
      <main className="flex-1 overflow-y-auto px-5 py-6">

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white border border-stone-200 rounded-xl px-4 py-3.5"
            >
              <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1.5">
                {s.label}
              </p>
              <p className="text-stone-900 text-2xl font-semibold tabular-nums leading-none mb-1">
                {s.value}
              </p>
              <p className="text-stone-400 text-[11px] truncate">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Menu cards */}
        <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-3">
          Kelola Konten
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {menuCards.map((card) => {
            const a = accentMap[card.accent];
            return (
              <button
                key={card.path}
                onClick={() => navigate(card.path)}
                className={`group bg-white border border-stone-200 ${a.border} rounded-xl p-5 text-left transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-9 h-9 ${a.icon} border rounded-xl flex items-center justify-center`}>
                    <card.icon size={17} className={a.iconColor} />
                  </div>
                  <ArrowUpRight
                    size={14}
                    className={`text-stone-300 ${a.arrow} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all`}
                  />
                </div>
                <h3 className="text-stone-900 text-sm font-medium mb-1">
                  {card.label}
                </h3>
                <p className="text-stone-500 text-[12px] leading-relaxed">
                  {card.desc}
                </p>
                {card.count !== null && card.count !== undefined && (
                  <p className={`text-[11px] mt-2.5 font-medium ${a.count}`}>
                    {card.count} {card.countLabel} tersimpan
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;