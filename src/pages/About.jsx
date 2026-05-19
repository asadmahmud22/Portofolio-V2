import { useState } from "react";
import { Briefcase, GraduationCap, ChevronDown, ChevronUp } from "lucide-react";

const About = () => {
  const [visibleCareerIndexes, setVisibleCareerIndexes] = useState([]);
  const [visibleEduIndexes, setVisibleEduIndexes] = useState([]);

  const toggleCareerResponsibilities = (index) => {
    setVisibleCareerIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleEduResponsibilities = (index) => {
    setVisibleEduIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const education = [
    {
      institution: "Universitas Teknologi Digital Indonesia",
      degree: "Diploma, Teknologi Komputer · GPA 3.83/4.00",
      period: "2023 – 2026",
      location: "Bantul, Daerah Istimewa Yogyakarta",
      logo: "/assets/utdi-logo.png",
      responsibilities: [
        "Meraih Juara 2 dalam lomba desain poster tingkat mahasiswa bertema Keselamatan dan Kesehatan Kerja (K3).",
        "Aktif mengikuti seminar dan workshop pengembangan teknologi komputer, keamanan jaringan, dan inovasi digital.",
        "Aktif mengikuti pelatihan mandiri dan bootcamp di luar kampus yang berfokus pada pengembangan frontend dan desain UI/UX.",
        "Aktif terlibat dalam berbagai kepanitiaan organisasi, termasuk HIMATEKKOM dan BEM.",
        "Bertanggung jawab sebagai staf Public Relations HIMATEKKOM dalam mendesain materi publikasi dan komunikasi eksternal.",
        "Menjadi panitia pelaksana dalam kegiatan pelatihan Arduino dasar di beberapa sekolah mitra.",
        "Berperan aktif dalam kepanitiaan BEM, khususnya divisi acara dan dokumentasi.",
      ],
      achievements: ["Dean's List selama 5 semester berturut-turut"],
    },
  ];

  const careerExperiences = [
    {
      title: "Web Development Intern",
      company: "Diskominfo Kabupaten Klaten",
      location: "Klaten, Indonesia",
      period: "Mar 2025 – May 2025",
      type: "Internship",
      mode: "Onsite",
      logo: "/assets/diskominfo-logo.png",
      responsibilities: [
        "Mengembangkan website UMKM Kabupaten Klaten menggunakan framework Laravel.",
        "Merancang dan mengelola database menggunakan MySQL untuk mendukung sistem informasi UMKM.",
        "Berkolaborasi dengan tim Diskominfo dalam proses pengembangan dan pengujian aplikasi web.",
      ],
    },
    {
      title: "Divisi HUMAS Hubungan & Masyarakat",
      company: "Himpunan Mahasiswa Teknologi Komputer – UTDI",
      location: "Bantul, Daerah Istimewa Yogyakarta",
      period: "Aug 2024 – Present",
      type: "Part-time",
      mode: "Onsite",
      logo: "/assets/himatekkom-logo.png",
      description:
        "HIMATEKKOM merupakan organisasi mahasiswa di UTDI yang mewadahi pengembangan minat, bakat, dan keterampilan mahasiswa Teknologi Komputer.",
      responsibilities: [
        "Menyusun dan mengirimkan surat kerja sama, undangan, dan proposal ke instansi eksternal.",
        "Mengelola media sosial HIMATEKKOM untuk publikasi kegiatan dan informasi penting.",
        "Menjalin komunikasi dengan organisasi lain, sponsor, media partner, serta alumni.",
      ],
    },
    {
      title: "Asisten Teknisi Jaringan – Praktik Kerja Lapangan",
      company: "Diskominfo Kabupaten Klaten",
      location: "Klaten, Indonesia",
      period: "Jun 2022 – Sep 2022",
      type: "Internship",
      mode: "Onsite",
      logo: "/assets/diskominfo-logo.png",
      responsibilities: [
        "Memperbaiki dan mengganti kabel jaringan yang rusak di sepanjang jalan dan titik layanan publik.",
        "Melakukan pengecekan konektivitas dan kestabilan jaringan pasca-perbaikan.",
        "Bekerja dalam tim lapangan dengan menerapkan standar keselamatan kerja dan efisiensi waktu.",
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 bg-white text-black">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium tracking-tight mb-1.5">About</h1>
        <p className="text-stone-400 text-sm">Sebuah cerita pendek tentang saya</p>
        <div className="border-t border-stone-200 mt-4" />
      </div>

      {/* Bio */}
      <p className="text-[13.5px] text-stone-500 leading-relaxed max-w-2xl mb-10">
        Saya adalah mahasiswa Diploma semester 6 Program Studi Teknologi Komputer di Universitas
        Teknologi Digital Indonesia. Saya memiliki pengalaman dalam berbagai kegiatan organisasi
        kampus, didukung oleh kemampuan kerja sama tim dan komunikasi yang baik. Selain itu, saya
        juga memiliki minat serta pengalaman di bidang komputer, khususnya dalam pengembangan
        frontend dan desain UI/UX, yang saya tekuni melalui berbagai proyek dan pelatihan mandiri.
      </p>

      {/* Education */}
      <Section icon={<GraduationCap size={15} />} title="Education" sub="Riwayat pendidikan saya.">
        {education.map((edu, index) => {
          const expanded = visibleEduIndexes.includes(index);
          return (
            <Card key={index}>
              <img
                src={edu.logo}
                alt={edu.institution}
                className="w-10 h-10 rounded-lg border border-stone-200 object-contain bg-white flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-stone-900 leading-snug">{edu.institution}</p>
                <p className="text-[12px] text-stone-500 mt-0.5 truncate">{edu.degree}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <MetaBadge mono>{edu.period}</MetaBadge>
                  <MetaBadge>{edu.location}</MetaBadge>
                </div>

                {edu.responsibilities?.length > 0 && (
                  <>
                    <ToggleBtn expanded={expanded} onClick={() => toggleEduResponsibilities(index)}
                      label={expanded ? "Hide activities" : "Show activities"} />
                    {expanded && (
                      <ExpandBox>
                        <ExpandGroup label="Activities & Responsibilities" items={edu.responsibilities} />
                        {edu.achievements?.length > 0 && (
                          <ExpandGroup label="Achievements" items={edu.achievements} />
                        )}
                      </ExpandBox>
                    )}
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </Section>

      {/* Career */}
      <Section icon={<Briefcase size={15} />} title="Career" sub="Pengalaman kerja dan kegiatan profesional saya.">
        {careerExperiences.map((exp, index) => {
          const expanded = visibleCareerIndexes.includes(index);
          return (
            <Card key={index}>
              <img
                src={exp.logo}
                alt={exp.company}
                className="w-10 h-10 rounded-lg border border-stone-200 object-contain bg-white flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-stone-900 leading-snug">{exp.title}</p>
                <p className="text-[12px] text-stone-500 mt-0.5 truncate">{exp.company}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <MetaBadge mono>{exp.period}</MetaBadge>
                  <MetaBadge>{exp.location}</MetaBadge>
                  <MetaBadge>{exp.type} · {exp.mode}</MetaBadge>
                </div>

                {exp.description && (
                  <p className="text-[12px] text-stone-400 leading-relaxed mt-2.5 pt-2.5 border-t border-stone-100">
                    {exp.description}
                  </p>
                )}

                {exp.responsibilities?.length > 0 && (
                  <>
                    <ToggleBtn expanded={expanded} onClick={() => toggleCareerResponsibilities(index)}
                      label={expanded ? "Hide responsibilities" : "Show responsibilities"} />
                    {expanded && (
                      <ExpandBox>
                        <ExpandGroup label="Responsibilities" items={exp.responsibilities} />
                      </ExpandBox>
                    )}
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </Section>
    </div>
  );
};

/* ── Sub-components ── */

const Section = ({ icon, title, sub, children }) => (
  <div className="mb-10">
    <h2 className="flex items-center gap-2 text-sm font-medium text-stone-900 mb-1">
      {icon} {title}
    </h2>
    <p className="text-xs text-stone-400 mb-4">{sub}</p>
    <div className="flex flex-col gap-3">{children}</div>
  </div>
);

const Card = ({ children }) => (
  <div className="flex gap-3.5 bg-stone-50 border border-stone-200 rounded-xl p-4 hover:border-stone-300 hover:shadow-md transition-all duration-200">
    {children}
  </div>
);

const MetaBadge = ({ children, mono }) => (
  <span className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded-full border border-stone-200 bg-white text-stone-500 ${mono ? "font-mono" : ""}`}>
    {children}
  </span>
);

const ToggleBtn = ({ expanded, onClick, label }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-1 mt-2.5 text-[11px] font-medium text-stone-500 bg-white border border-stone-200 rounded-full px-2.5 py-1 hover:border-stone-300 hover:text-stone-800 transition"
  >
    {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
    {label}
  </button>
);

const ExpandBox = ({ children }) => (
  <div className="mt-3 pt-3 border-t border-stone-100 flex flex-col gap-3">
    {children}
  </div>
);

const ExpandGroup = ({ label, items }) => (
  <div>
    <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-2">{label}</p>
    <ul className="flex flex-col gap-1.5">
      {items.map((item, idx) => (
        <li key={idx} className="flex gap-2 text-[12px] text-stone-500 leading-relaxed">
          <span className="text-stone-300 mt-0.5 shrink-0">–</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default About;