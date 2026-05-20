import { useState, useEffect } from "react";
import { Monitor, Server, Wrench, Palette } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const ICON_MAP = {
  monitor: <Monitor size={13} />,
  server:  <Server  size={13} />,
  wrench:  <Wrench  size={13} />,
  palette: <Palette size={13} />,
};

const Skills = () => {
  const [skills,     setSkills]     = useState([]);
  const [additional, setAdditional] = useState([]);
  const [timeline,   setTimeline]   = useState([]);
  const [isLoading,  setIsLoading]  = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const snap = await getDoc(doc(db, "skills", "main"));
        if (snap.exists()) {
          const d = snap.data();
          setSkills(d.skills       || []);
          setAdditional(d.additional || []);
          setTimeline(d.timeline   || []);
        }
      } catch (err) {
        console.error("Gagal memuat data skills:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkills();
  }, []);

  if (isLoading) return (
    <div className="max-w-6xl mx-auto px-4 py-10 flex justify-center">
      <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 bg-white text-black">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium tracking-tight mb-1.5">My Skills</h1>
        <p className="text-stone-400 text-sm max-w-lg leading-relaxed">
          Teknologi dan alat yang saya gunakan untuk menciptakan pengalaman digital.
        </p>
        <div className="border-t border-stone-200 mt-4" />
      </div>

      {/* Core Skills */}
      {skills.length > 0 && (
        <>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-3">
            Core Skills
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {skills.map((cat) => (
              <div
                key={cat.id}
                className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 hover:border-stone-300 transition-colors"
              >
                <div className="flex items-center gap-2 text-[11px] font-medium text-stone-500 mb-3">
                  {ICON_MAP[cat.iconKey] ?? <Monitor size={13} />}
                  {cat.category}
                </div>
                <div className="flex flex-col gap-1.5">
                  {cat.items.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-start gap-2.5 bg-white border border-stone-200 rounded-lg px-3 py-2 hover:border-stone-300 transition-colors"
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                        style={{ backgroundColor: skill.dot }}
                      />
                      <div>
                        <p className="text-[12px] font-medium text-stone-900 leading-snug">{skill.name}</p>
                        <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">{skill.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Additional Skills */}
      {additional.length > 0 && (
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 mb-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-3">
            Additional Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {additional.map((skill, i) => (
              <span
                key={i}
                className="text-[11px] text-stone-500 bg-white border border-stone-200 px-2.5 py-1 rounded-full hover:border-stone-400 hover:text-stone-800 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience Timeline */}
      {timeline.length > 0 && (
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 pb-16">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-4">
            Experience Timeline
          </p>
          <div className="flex flex-col">
            {timeline.map((item, i) => (
              <div key={item.id} className="flex gap-3.5 pb-5 last:pb-0">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-stone-400 mt-1" />
                  {i < timeline.length - 1 && (
                    <div className="w-px flex-1 bg-stone-200 mt-1" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-mono text-stone-400 mb-1">{item.period}</p>
                  <p className="text-[13px] font-medium text-stone-900">{item.role}</p>
                  <p className="text-[12px] text-stone-500 mt-0.5">{item.company}</p>
                  <p className="text-[12px] text-stone-400 leading-relaxed mt-1.5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;