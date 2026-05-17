import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  const [loading, setLoading] = useState(true);

  // ✅ Cek apakah URL mengandung /admin — skip splash screen
  const isAdminPage = window.location.pathname.startsWith("/admin");

  return (
    <Router>
      <Routes>
        {/* ✅ Admin routes — tidak kena splash screen */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/achievements" element={<ManageAchievements />} />
        <Route path="/admin/projects" element={<ManageProjects />} />

        {/* ✅ Portfolio routes — dengan splash screen */}
        <Route
          path="/*"
          element={
            loading && !isAdminPage ? (
              <SplashScreen finishLoading={() => setLoading(false)} />
            ) : (
              <Routes>
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
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;