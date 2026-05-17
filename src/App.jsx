import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import SplashScreen from "./components/SplashScreen";
import Home from "./pages/Home";
import About from "./pages/About";
import Achievements from "./pages/Achievements";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Chat from "./pages/Chat";
import Skills from "./pages/Skills";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageAchievements from "./pages/admin/ManageAchievements";
import ManageProjects from "./pages/admin/ManageProjects";
import "./App.css";

function NotFound() {
  return <div className="p-8 text-gray-400">Page not found</div>;
}

// ✅ Dipisah agar bisa pakai useLocation (harus di dalam Router)
function AppRoutes() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  // Tampilkan splash hanya di halaman non-admin, sekali saja
  if (loading && !isAdminPage) {
    return <SplashScreen finishLoading={() => setLoading(false)} />;
  }

  return (
    <Routes>
      {/* Admin routes */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/achievements" element={<ManageAchievements />} />
      <Route path="/admin/projects" element={<ManageProjects />} />

      {/* Portfolio routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="projects" element={<Projects />} />
        <Route path="contact" element={<Contact />} />
        <Route path="skills" element={<Skills />} />
        <Route path="chat" element={<Chat />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;