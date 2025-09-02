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
import Dashboard from "./pages/Dashboard";
import Skills from "./pages/Skills"; // ✅ tambahkan ini
import "./App.css";

function NotFound() {
  return <div className="p-8 text-gray-400">Page not found</div>;
}

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading ? (
        <SplashScreen finishLoading={() => setLoading(false)} />
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="achievements" element={<Achievements />} />
              <Route path="projects" element={<Projects />} />
              <Route path="contact" element={<Contact />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="skills" element={<Skills />} /> {/* ✅ sekarang aman */}
              <Route path="chat" element={<Chat />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
