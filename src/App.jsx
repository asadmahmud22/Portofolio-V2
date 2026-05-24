import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Layout from "./components/Layout";
import SplashScreen from "./components/SplashScreen";
import Home from "./pages/Home";
import About from "./pages/About";
import Achievements from "./pages/Achievements";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Skills from "./pages/Skills";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageLayout from "./pages/admin/ManageLayout";
import ManageAchievements from "./pages/admin/ManageAchievements";
import ManageProjects from "./pages/admin/ManageProjects";
import ManageAbout from "./pages/admin/ManageAbout";
import ManageSkills from "./pages/admin/ManageSkills";
import ManageContact from "./pages/admin/ManageContact";
import ManageHome from "./pages/admin/ManageHome";

import "./App.css";

function NotFound() {
  return <div className="p-8 text-gray-400">Page not found</div>;
}

function AppRoutes() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  if (loading && !isAdminPage) {
    return <SplashScreen finishLoading={() => setLoading(false)} />;
  }

  return (
    <Routes>
      {/* Admin login — standalone, tanpa sidebar */}
      <Route path="/admin" element={<AdminLogin />} />

      {/* Admin pages — pakai AdminLayout (auth guard + sidebar) */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Halaman Manage — dibungkus ManageLayout */}
        <Route path="/admin/layout"       element={<ManageLayout />} />
        <Route path="/admin/home"         element={<ManageHome />} />
        <Route path="/admin/about"        element={<ManageAbout />} />
        <Route path="/admin/skills"       element={<ManageSkills />} />
        <Route path="/admin/achievements" element={<ManageAchievements />} />
        <Route path="/admin/projects"     element={<ManageProjects />} />
        <Route path="/admin/contact"      element={<ManageContact />} />
      </Route>

      {/* Portfolio routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about"         element={<About />} />
        <Route path="achievements"  element={<Achievements />} />
        <Route path="projects"      element={<Projects />} />
        <Route path="contact"       element={<Contact />} />
        <Route path="skills"        element={<Skills />} />
        <Route path="*"             element={<NotFound />} />
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