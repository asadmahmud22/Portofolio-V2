import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  Award,
  Briefcase,
  LogOut,
  Shield,
  LayoutDashboard,
  ArrowUpRight,
  ChevronRight,
  User,
  Code,
  Phone,
  Home,
  LayoutTemplate,
} from "lucide-react";

// ─── Nav Config ───────────────────────────────────────────────────────────────

const navGroups = [
  {
    label: null,
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    ],
  },
  {
    label: "Manage",
    items: [
      { label: "Layout",       icon: LayoutTemplate, path: "/admin/layout" },
      { label: "Home",         icon: Home,           path: "/admin/home" },
      { label: "About",        icon: User,           path: "/admin/about" },
      { label: "Skills",       icon: Code,           path: "/admin/skills" },
      { label: "Achievements", icon: Award,          path: "/admin/achievements" },
      { label: "Projects",     icon: Briefcase,      path: "/admin/projects" },
      { label: "Contact",      icon: Phone,          path: "/admin/contact" },
    ],
  },
];

// ─── AdminLayout ──────────────────────────────────────────────────────────────

const AdminLayout = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) navigate("/admin");
      else setUser(u);
      setIsLoading(false);
    });
    return () => unsub();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin");
  };

  const isActive = (path) => location.pathname === path;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-stone-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-700 rounded-full animate-spin" />
      </div>
    );
  }

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-white border-r border-stone-200">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3 border-b border-stone-200">
        <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center flex-shrink-0">
          <Shield size={16} className="text-white" />
        </div>
        <div>
          <p className="text-stone-900 text-sm font-semibold leading-none">
            Admin Panel
          </p>
          <p className="text-stone-400 text-xs mt-0.5">Portofolio</p>
        </div>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className="text-[9px] font-semibold uppercase tracking-widest text-stone-400 px-3 mb-1.5">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
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
                    {active && (
                      <ChevronRight size={14} className="ml-auto text-stone-400" />
                    )}
                  </button>
                );
              })}
            </div>
            {gi < navGroups.length - 1 && (
              <div className="border-t border-stone-100 mt-3" />
            )}
          </div>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="px-3 py-4 border-t border-stone-200 space-y-1">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition"
        >
          <ArrowUpRight size={16} /> Ke Portofolio
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-500 hover:text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={16} /> Logout
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

      {/* Page content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet context={{ user, handleLogout, setSidebarOpen }} />
      </div>
    </div>
  );
};

export default AdminLayout;