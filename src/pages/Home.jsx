import {
  Code,
  Coffee,
  Download,
  Mail,
  Instagram,
  Linkedin,
  Github,
} from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const DEFAULT_SKILLS = [
  { name: "HTML", color: "border-orange-500", logo: "/logos/html.svg" },
  { name: "JavaScript", color: "border-yellow-500", logo: "/logos/js.svg" },
  { name: "PHP", color: "border-indigo-500", logo: "/logos/php.svg" },
  { name: "Laravel", color: "border-red-500", logo: "/logos/laravel.svg" },
  { name: "SQLite", color: "border-blue-400", logo: "/logos/sqlite.svg" },
  { name: "Next.js", color: "border-gray-800", logo: "/logos/nextjs.svg" },
  { name: "Vite", color: "border-purple-500", logo: "/logos/vite.svg" },
  { name: "GitHub", color: "border-gray-800", logo: "/logos/github.svg" },
  { name: "Kotlin", color: "border-purple-700", logo: "/logos/kotlin.svg" },
  {
    name: "TailwindCSS",
    color: "border-blue-500",
    logo: "/logos/tailwind.svg",
  },
  { name: "CSS", color: "border-blue-500", logo: "/logos/css.svg" },
  {
    name: "Autoprefixer",
    color: "border-blue-500",
    logo: "/logos/autoprefixer.svg",
  },
  { name: "Mysql", color: "border-blue-500", logo: "/logos/mysql.svg" },
  { name: "Invinity", color: "border-purple-500", logo: "/logos/infinity.svg" },
  { name: "Eslint", color: "border-blue-500", logo: "/logos/eslint.svg" },
  { name: "Vercel", color: "border-purple-700", logo: "/logos/vercel.svg" },
];

// ── ContactCard component ──
const ContactCard = ({
  title,
  description,
  link,
  buttonText,
  bg,
  icon,
  buttonBg,
}) => {
  return (
    <div className={"rounded-xl p-4 sm:p-5 flex flex-col gap-3 " + bg}>
      <div className="flex items-center gap-3">
        <div className="text-gray-700">{icon}</div>
        <h3 className="font-semibold text-sm sm:text-base">{title}</h3>
      </div>
      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
        {description}
      </p>
      <a
        href={link}
        target={link.startsWith("mailto") ? "_self" : "_blank"}
        rel="noopener noreferrer"
        className={
          "text-white text-xs sm:text-sm px-4 py-2 rounded-lg transition w-fit " +
          buttonBg
        }
      >
        {buttonText}
      </a>
    </div>
  );
};

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [homeData, setHomeData] = useState(null);
  const [links, setLinks] = useState(null);

  // ── Load from Firestore ──
  useEffect(() => {
    getDoc(doc(db, "home", "main")).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setHomeData(data);
        setLinks(data.links ?? null);
      }
    });
  }, []);

  // ── Inject marquee / flip CSS ──
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes marquee {
        0%   { transform: translateX(0%);   }
        100% { transform: translateX(-50%); }
      }
      @keyframes marquee-right {
        0%   { transform: translateX(-50%); }
        100% { transform: translateX(0%);   }
      }
      .animate-marquee       { animation: marquee       30s linear infinite; }
      .animate-marquee-right { animation: marquee-right 35s linear infinite; }
      @media (max-width: 740px) {
        .animate-marquee       { animation: marquee       15s linear infinite; }
        .animate-marquee-right { animation: marquee-right 20s linear infinite; }
      }
      .marquee-container:hover .animate-marquee,
      .marquee-container:hover .animate-marquee-right {
        animation-play-state: paused;
      }
      @media (max-width: 640px) {
        .flip-card { perspective: 1000px; }
        .flip-card-inner {
          position: relative; width: 100%; height: 100%;
          text-align: center; transition: transform 0.8s;
          transform-style: preserve-3d;
        }
        .flip-card:hover .flip-card-inner { transform: rotateY(180deg); }
        .flip-card-front, .flip-card-back {
          position: absolute; width: 100%; height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden; border-radius: 0.5rem;
        }
        .flip-card-back      { transform: rotateY(180deg); }
        .backface-hidden     { -webkit-backface-visibility: hidden; backface-visibility: hidden; }
        .rotateY-180         { transform: rotateY(180deg); }
        @keyframes slide-in-right {
          0%   { opacity: 0; transform: translateX(100px) scale(0.8); }
          100% { opacity: 1; transform: translateX(0)     scale(1);   }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .flip-card:hover      { transform: translateY(-4px); transition: transform 0.3s ease; }
        .flip-card-inner      { transition: transform 0.6s; }
      }
    `;
    document.head.appendChild(style);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => {
      document.head.removeChild(style);
      clearTimeout(timer);
    };
  }, []);

  // ── Derived values with fallbacks ──
  const title = homeData?.title ?? "FULLSTACK DEVELOPER";
  const name = homeData?.name ?? "Hi, I'm As'ad Mahmud Akram";
  const location = homeData?.location ?? "Based in Klaten, Indonesia 🇮🇩";
  const workType = homeData?.workType ?? "Onsite";
  const bio =
    homeData?.bio ??
    "Saya adalah mahasiswa Teknologi Komputer di Universitas Teknologi Digital Indonesia angkatan 2023. Sebagai seorang pengembang perangkat lunak yang antusias, saya memiliki fokus utama pada pengembangan frontend dengan pengalaman menggunakan React serta pemahaman berbagai teknologi web. Selain itu, saya juga memiliki ketertarikan dan pengalaman dalam desain UI/UX, dengan tujuan menciptakan antarmuka yang fungsional sekaligus menarik secara visual.";
  const resumeUrl =
    homeData?.resumeUrl ?? "/src/assets/As'ad Mahmud Akram_CV.pdf";
  const serviceText =
    homeData?.serviceText ??
    "Sebagai seorang pengembang frontend lepas, saya berdedikasi untuk menciptakan situs web yang luar biasa dan solusi web strategis untuk merek, perusahaan, institusi, dan startup. Dengan pengalaman yang mendalam dalam pengembangan web modern, saya siap membantu mewujudkan visi digital Anda.";
  const skills = homeData?.skills ?? DEFAULT_SKILLS;

  // ── Link fallbacks ──
  const email = links?.email ?? "asadmahmudakram@gmail.com";
  const instagram = links?.instagram ?? "https://instagram.com/asaddakram";
  const linkedin =
    links?.linkedin ?? "https://linkedin.com/in/asad-mahmud-akram";
  const github = links?.github ?? "https://github.com/asadmahmud22";
  const tiktok = links?.tiktok ?? "https://www.tiktok.com/@asad-akram";

  // ── Split skills into rows of 3 for mobile ──
  const skillRows = [];
  for (let i = 0; i < skills.length; i += 3) {
    skillRows.push(skills.slice(i, i + 3));
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        {/* ── Intro ── */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 leading-tight">
            {title}
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 leading-tight">
            {name}
          </h2>

          <div className="flex flex-col gap-1 sm:gap-2 text-gray-600 mb-4 sm:mb-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full" />
              {location}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full" />
              {workType}
            </div>
          </div>

          <div className="text-gray-700 space-y-3 sm:space-y-3 text-sm sm:text-base leading-relaxed">
            <p>{bio}</p>
          </div>
        </div>

        {/* ── Quick Links ── */}
        <div className="mb-5 sm:mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Resume */}
            <a
              href={resumeUrl}
              download
              className="bg-black/10 hover:bg-black/20 text-black text-xs sm:text-sm px-3 py-2 rounded-full border border-black/20 hover:scale-[1.02] transition flex items-center gap-2 justify-center min-w-[120px]"
            >
              <Download size={14} />
              Resume
            </a>

            {/* Gmail */}
            <a
              href={"mailto:" + email}
              className="bg-red-100 hover:bg-red-200 text-red-700 text-xs sm:text-sm px-3 py-2 rounded-full border border-red-200 hover:scale-[1.02] transition flex items-center gap-2 justify-center min-w-[120px]"
            >
              <Mail size={14} />
              Gmail
            </a>

            {/* Instagram */}
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs sm:text-sm px-3 py-2 rounded-full border border-pink-200 hover:scale-[1.02] transition flex items-center gap-2 justify-center min-w-[120px]"
            >
              <Instagram size={14} />
              Instagram
            </a>

            {/* LinkedIn */}
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs sm:text-sm px-3 py-2 rounded-full border border-blue-200 hover:scale-[1.02] transition flex items-center gap-2 justify-center min-w-[120px]"
            >
              <Linkedin size={14} />
              LinkedIn
            </a>

            {/* GitHub */}
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs sm:text-sm px-3 py-2 rounded-full border border-gray-300 hover:scale-[1.02] transition flex items-center gap-2 justify-center min-w-[120px]"
            >
              <Github size={14} />
              GitHub
            </a>
          </div>

          <hr className="border-gray-300 my-6 sm:my-8" />

          {/* ── Skills ── */}
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Code size={20} className="sm:w-6 sm:h-6" />
              <h2 className="text-lg sm:text-xl font-semibold">Skills</h2>
            </div>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              My professional skills and technologies
            </p>

            {/* Mobile: 3-column grid with flip cards */}
            <div className="block sm:hidden">
              <div className="space-y-3">
                {skillRows.map((row, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-3 gap-2">
                    {row.map((skill, colIndex) => (
                      <div
                        key={rowIndex + "-" + colIndex}
                        className={
                          "flip-card h-20 w-full " +
                          (isVisible ? "animate-slide-in-right" : "opacity-0")
                        }
                        style={{
                          animationDelay:
                            (rowIndex * 3 + colIndex) * 100 + "ms",
                        }}
                      >
                        <div className="flip-card-inner h-full w-full relative">
                          {/* Front */}
                          <div
                            className={
                              "flip-card-front absolute inset-0 text-black px-2 py-2 flex flex-col items-center justify-center gap-1 border " +
                              skill.color +
                              " bg-black/5 rounded-lg shadow-sm backface-hidden"
                            }
                          >
                            <img
                              src={skill.logo}
                              alt={skill.name}
                              className="w-5 h-5 object-contain"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                            <span className="text-xs font-medium text-center leading-tight">
                              {skill.name}
                            </span>
                          </div>
                          {/* Back */}
                          <div
                            className={
                              "flip-card-back absolute inset-0 text-white px-2 py-2 flex items-center justify-center border " +
                              skill.color +
                              " bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-sm backface-hidden rotateY-180"
                            }
                          >
                            <span className="text-xs font-bold text-center">
                              {skill.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: Marquee */}
            <div className="hidden sm:block">
              <div className="overflow-hidden relative marquee-container mb-4">
                <div className="flex w-max animate-marquee gap-3">
                  {skills.concat(skills).map((skill, index) => (
                    <div
                      key={index}
                      className={
                        "text-black px-4 py-2 flex items-center gap-2 border " +
                        skill.color +
                        " bg-black/5 backdrop-blur-md rounded-lg shadow-md whitespace-nowrap hover:bg-black/10 transition-all duration-300"
                      }
                    >
                      <img
                        src={skill.logo}
                        alt={skill.name}
                        className="w-4 h-4 object-contain"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <span className="text-sm font-medium">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="overflow-hidden relative marquee-container">
                <div className="flex w-max animate-marquee-right gap-3">
                  {skills.concat(skills).map((skill, index) => (
                    <div
                      key={index}
                      className={
                        "text-black px-4 py-2 flex items-center gap-2 border " +
                        skill.color +
                        " bg-black/5 backdrop-blur-md rounded-lg shadow-md whitespace-nowrap hover:bg-black/10 transition-all duration-300"
                      }
                    >
                      <img
                        src={skill.logo}
                        alt={skill.name}
                        className="w-4 h-4 object-contain"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <span className="text-sm font-medium">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Service ── */}
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Coffee size={18} className="sm:w-5 sm:h-5" />
              <h2 className="text-lg sm:text-xl font-semibold">Service</h2>
            </div>
            <div className="text-gray-700 space-y-3 sm:space-y-4 text-sm sm:text-base leading-relaxed">
              <p>{serviceText}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
