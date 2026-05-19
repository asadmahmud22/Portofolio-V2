import React from "react";
import { Monitor, Server, Wrench, Palette } from "lucide-react";

const Skills = () => {
  const skills = [
    {
      category: "Frontend Development",
      icon: <Monitor size={13} />,
      items: [
        {
          name: "React",
          dot: "#22D3EE",
          description:
            "UI interaktif dan SPA dengan hooks, component-based architecture, dan state management.",
        },
        {
          name: "Next.js",
          dot: "#2C2C2A",
          description:
            "Aplikasi full-stack dengan SSR, SSG, dan App Router untuk performa optimal.",
        },
        {
          name: "JavaScript",
          dot: "#FACC15",
          description:
            "ES6+, async/await, DOM manipulation, dan logika pemrograman berbasis web.",
        },
        {
          name: "TypeScript",
          dot: "#3B82F6",
          description:
            "Kode lebih aman dan terstruktur dengan static typing pada proyek React dan Node.js.",
        },
        {
          name: "Tailwind CSS",
          dot: "#2DD4BF",
          description:
            "Tampilan responsif dan modern secara cepat dengan utility-first CSS framework.",
        },
        {
          name: "HTML / CSS",
          dot: "#F97316",
          description:
            "Semantic HTML5 dan CSS3 termasuk flexbox, grid, dan animasi.",
        },
      ],
    },
    {
      category: "Backend Development",
      icon: <Server size={13} />,
      items: [
        {
          name: "Laravel",
          dot: "#EF4444",
          description:
            "Aplikasi web berbasis MVC dengan routing, Eloquent ORM, dan Blade templating.",
        },
        {
          name: "PHP",
          dot: "#818CF8",
          description:
            "Aplikasi web dinamis dan sistem backend secara native maupun dengan Laravel.",
        },
        {
          name: "Node.js",
          dot: "#22C55E",
          description:
            "Server-side application dan REST API menggunakan Node.js dengan Express.",
        },
        {
          name: "Python",
          dot: "#60A5FA",
          description: "Scripting, otomasi, dan eksplorasi data sederhana.",
        },
        {
          name: "REST APIs",
          dot: "#A855F7",
          description:
            "Merancang dan mengonsumsi RESTful API untuk komunikasi antar layanan.",
        },
        {
          name: "MySQL",
          dot: "#FB923C",
          description:
            "Skema database relasional, query kompleks, dan manajemen data.",
        },
      ],
    },
    {
      category: "DevOps & Tools",
      icon: <Wrench size={13} />,
      items: [
        {
          name: "Git & GitHub",
          dot: "#EA580C",
          description:
            "Version control dengan branching, pull request, dan kolaborasi tim.",
        },
        {
          name: "Vercel",
          dot: "#2C2C2A",
          description:
            "Deploy React dan Next.js dengan CI/CD otomatis dari GitHub.",
        },
        {
          name: "Linux",
          dot: "#CA8A04",
          description:
            "Environment Linux untuk development, file management, dan terminal.",
        },
        {
          name: "VS Code",
          dot: "#3B82F6",
          description: "Ekstensi untuk efisiensi pengembangan web modern.",
        },
        {
          name: "Postman",
          dot: "#F97316",
          description:
            "Menguji dan mendokumentasikan REST API selama proses pengembangan backend.",
        },
        {
          name: "InfinityFree",
          dot: "#22C55E",
          description:
            "Hosting aplikasi PHP dan MySQL untuk proyek dan pembelajaran.",
        },
      ],
    },
    {
      category: "Design & UX",
      icon: <Palette size={13} />,
      items: [
        {
          name: "Figma",
          dot: "#C084FC",
          description:
            "Wireframe, mockup, dan prototype UI interaktif untuk kebutuhan proyek web.",
        },
        {
          name: "UI Design",
          dot: "#F472B6",
          description:
            "Tipografi, warna, spacing, dan konsistensi antarmuka visual.",
        },
        {
          name: "UX Principles",
          dot: "#818CF8",
          description:
            "User flow, usability, dan desain berbasis pengguna yang intuitif.",
        },
      ],
    },
  ];

  const additionalSkills = [
    "Bootstrap",
    "jQuery",
    "MongoDB",
    "Firebase",
    "Arduino",
    "Canva",
    "Notion",
    "Trello",
    "Microsoft Office",
    "Google Workspace",
    "Responsive Design",
    "SEO Basics",
  ];

  const timeline = [
    {
      period: "Mar 2025 – May 2025",
      role: "Web Development Intern",
      company: "Diskominfo Kabupaten Klaten",
      description:
        "Mengembangkan website UMKM menggunakan Laravel dan MySQL, serta berkolaborasi dalam pengujian dan deployment.",
    },
    {
      period: "Aug 2024 – Present",
      role: "Divisi HUMAS",
      company: "HIMATEKKOM – UTDI",
      description:
        "Mengelola komunikasi eksternal, media sosial, dan materi publikasi organisasi mahasiswa Teknologi Komputer.",
    },
    {
      period: "Jun 2022 – Sep 2022",
      role: "Asisten Teknisi Jaringan – PKL",
      company: "Diskominfo Kabupaten Klaten",
      description:
        "Membantu perbaikan infrastruktur jaringan lapangan dan memastikan konektivitas layanan publik tetap stabil.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 bg-white text-black">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium tracking-tight mb-1.5">
          My Skills
        </h1>
        <p className="text-stone-400 text-sm max-w-lg leading-relaxed">
          Teknologi dan alat yang saya gunakan untuk menciptakan pengalaman
          digital.
        </p>
        <div className="border-t border-stone-200 mt-4" />
      </div>

      {/* Section label */}
      <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-3">
        Core Skills
      </p>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {skills.map((cat, i) => (
          <div
            key={i}
            className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 hover:border-stone-300 transition-colors"
          >
            <div className="flex items-center gap-2 text-[11px] font-medium text-stone-500 mb-3">
              {cat.icon}
              {cat.category}
            </div>
            <div className="flex flex-col gap-1.5">
              {cat.items.map((skill, j) => (
                <div
                  key={j}
                  className="flex items-start gap-2.5 bg-white border border-stone-200 rounded-lg px-3 py-2 hover:border-stone-300 transition-colors"
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                    style={{ backgroundColor: skill.dot }}
                  />
                  <div>
                    <p className="text-[12px] font-medium text-stone-900 leading-snug">
                      {skill.name}
                    </p>
                    <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">
                      {skill.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Skills */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-3">
          Additional Skills
        </p>
        <div className="flex flex-wrap gap-1.5">
          {additionalSkills.map((skill, i) => (
            <span
              key={i}
              className="text-[11px] text-stone-500 bg-white border border-stone-200 px-2.5 py-1 rounded-full hover:border-stone-400 hover:text-stone-800 transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Experience Timeline */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 pb-16">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-4">
          Experience Timeline
        </p>
        <div className="flex flex-col">
          {timeline.map((item, i) => (
            <div key={i} className="flex gap-3.5 pb-5 last:pb-0">
              {/* Line + dot */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-stone-400 mt-1" />
                {i < timeline.length - 1 && (
                  <div className="w-px flex-1 bg-stone-200 mt-1" />
                )}
              </div>
              {/* Content */}
              <div className="flex-1">
                <p className="text-[11px] font-mono text-stone-400 mb-1">
                  {item.period}
                </p>
                <p className="text-[13px] font-medium text-stone-900">
                  {item.role}
                </p>
                <p className="text-[12px] text-stone-500 mt-0.5">
                  {item.company}
                </p>
                <p className="text-[12px] text-stone-400 leading-relaxed mt-1.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
