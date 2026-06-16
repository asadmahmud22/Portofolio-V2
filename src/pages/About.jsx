import { useState, useEffect } from "react";
import { Briefcase, GraduationCap, ChevronDown, ChevronUp } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const About = () => {
  const [visibleCareerIndexes, setVisibleCareerIndexes] = useState([]);
  const [visibleEduIndexes, setVisibleEduIndexes] = useState([]);
  const [bio, setBio] = useState("");
  const [education, setEducation] = useState([]);
  const [careers, setCareers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const snap = await getDoc(doc(db, "about", "main"));
        if (snap.exists()) {
          const d = snap.data();
          setBio(d.bio || "");
          setEducation(d.education || []);
          setCareers(d.careers || []);
        }
      } catch (err) {
        console.error("Gagal memuat data about:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const toggleCareerResponsibilities = (index) => {
    setVisibleCareerIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const toggleEduResponsibilities = (index) => {
    setVisibleEduIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 flex justify-center">
        <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 bg-white text-black">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium tracking-tight mb-1.5">About</h1>
        <p className="text-stone-400 text-sm">
          Sebuah cerita pendek tentang saya
        </p>
        <div className="border-t border-stone-200 mt-4" />
      </div>

      {/* Bio */}
      {bio && (
        <div className="text-gray-700 space-y-3 sm:space-y-3 text-sm sm:text-base leading-relaxed mb-10">
          {bio}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Section
          icon={<GraduationCap size={15} />}
          title="Education"
          sub="Riwayat pendidikan saya."
        >
          {education.map((edu, index) => {
            const expanded = visibleEduIndexes.includes(index);
            return (
              <Card key={index}>
                {edu.logo && (
                  <img
                    src={edu.logo}
                    alt={edu.institution}
                    className="w-10 h-10 rounded-lg border border-stone-200 object-contain bg-white flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-stone-900 leading-snug">
                    {edu.institution}
                  </p>
                  <p className="text-[12px] text-stone-500 mt-0.5 truncate">
                    {edu.degree}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {edu.period && <MetaBadge mono>{edu.period}</MetaBadge>}
                    {edu.location && <MetaBadge>{edu.location}</MetaBadge>}
                  </div>

                  {edu.responsibilities?.length > 0 && (
                    <>
                      <ToggleBtn
                        expanded={expanded}
                        onClick={() => toggleEduResponsibilities(index)}
                        label={expanded ? "Hide activities" : "Show activities"}
                      />
                      {expanded && (
                        <ExpandBox>
                          <ExpandGroup
                            label="Activities & Responsibilities"
                            items={edu.responsibilities}
                          />
                          {edu.achievements?.length > 0 && (
                            <ExpandGroup
                              label="Achievements"
                              items={edu.achievements}
                            />
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
      )}

      {/* Career */}
      {careers.length > 0 && (
        <Section
          icon={<Briefcase size={15} />}
          title="Career"
          sub="Pengalaman kerja dan kegiatan profesional saya."
        >
          {careers.map((exp, index) => {
            const expanded = visibleCareerIndexes.includes(index);
            return (
              <Card key={index}>
                {exp.logo && (
                  <img
                    src={exp.logo}
                    alt={exp.company}
                    className="w-10 h-10 rounded-lg border border-stone-200 object-contain bg-white flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-stone-900 leading-snug">
                    {exp.title}
                  </p>
                  <p className="text-[12px] text-stone-500 mt-0.5 truncate">
                    {exp.company}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {exp.period && <MetaBadge mono>{exp.period}</MetaBadge>}
                    {exp.location && <MetaBadge>{exp.location}</MetaBadge>}
                    {exp.type && exp.mode && (
                      <MetaBadge>
                        {exp.type} · {exp.mode}
                      </MetaBadge>
                    )}
                  </div>

                  {exp.description && (
                    <p className="text-[12px] text-stone-400 leading-relaxed mt-2.5 pt-2.5 border-t border-stone-100">
                      {exp.description}
                    </p>
                  )}

                  {exp.responsibilities?.length > 0 && (
                    <>
                      <ToggleBtn
                        expanded={expanded}
                        onClick={() => toggleCareerResponsibilities(index)}
                        label={
                          expanded
                            ? "Hide responsibilities"
                            : "Show responsibilities"
                        }
                      />
                      {expanded && (
                        <ExpandBox>
                          <ExpandGroup
                            label="Responsibilities"
                            items={exp.responsibilities}
                          />
                        </ExpandBox>
                      )}
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </Section>
      )}
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
  <span
    className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded-full border border-stone-200 bg-white text-stone-500 ${mono ? "font-mono" : ""}`}
  >
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
    <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-2">
      {label}
    </p>
    <ul className="flex flex-col gap-1.5">
      {items.map((item, idx) => (
        <li
          key={idx}
          className="flex gap-2 text-[12px] text-stone-500 leading-relaxed"
        >
          <span className="text-stone-300 mt-0.5 shrink-0">–</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default About;
