import { useState, useEffect, useRef } from "react";

/* ── Typing effect hook ── */
function useTypingEffect(words, speed = 80, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = words[wordIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        } else setCharIdx((c) => c + 1);
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setWordIdx((i) => (i + 1) % words.length);
          setCharIdx(0);
        } else setCharIdx((c) => c - 1);
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);
  return display;
}

/* ── Intersection observer hook ── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function RevealSection({ children, className = "", delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(40px)",
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

/* ── DATA ── */
const NAV_LINKS = ["Home", "About", "Skills", "Education", "Certifications", "Projects", "Contact"];

const SKILLS = {
  Frontend: [
    { name: "HTML", level: 92 }, { name: "CSS", level: 88 }, { name: "JavaScript", level: 82 },
  ],
  Backend: [
    { name: "FastAPI", level: 65 }, { name: "REST APIs", level: 78 },
  ],
  Database: [
    { name: "MongoDB", level: 70 },
  ],
  Tools: [
    { name: "GitHub", level: 82 }, { name: "VS Code", level: 90 },
  ],
};

const SKILL_ICONS = {
  "HTML": "🌐", "CSS": "🎨", "JavaScript": "⚡",
  "FastAPI": "🚀", "REST APIs": "🔗", "MongoDB": "🍃",
  "GitHub": "🐙", "VS Code": "🖥️",
};

const EDUCATION = [
  { degree: "BS Computer Science", school: "National University of Technology", location: "Islamabad", period: "Sep 2023 – Present", desc: "Studying programming, problem solving, software development and AI. Building practical skills through real-world projects." },
  { degree: "Intermediate (ICS)", school: "Punjab Group of Colleges", location: "Talagang", period: "Apr 2021 – Apr 2023", desc: "Studied Computer Science and built a solid foundation in programming and analytical thinking." },
];

const CERTS = [
  { title: "Machine Learning with Python", org: "IBM · Coursera", desc: "Machine Learning fundamentals, data preprocessing, model training, and predictive analysis using Python.", icon: "🤖" },
  { title: "Python for Data Science, AI & Dev", org: "IBM · Coursera", desc: "Hands-on Python programming, data science concepts, AI fundamentals and modern development tools.", icon: "🐍" },
];

const PROJECTS = [
  {
    title: "Bookify – Book Ordering App",
    desc: "Modern online book ordering platform with user authentication, category filtering, shopping cart, and secure payment integration.",
    tech: ["HTML", "CSS", "JavaScript", "MongoDB", "FastAPI"],
    emoji: "📚",
    color: "#4f46e5",
  },
  {
    title: "Jarvis – Voice Assistant",
    desc: "Python-based virtual voice assistant with web searching, application control, voice interaction and media playback via speech recognition.",
    tech: ["Python", "SpeechRecognition", "Pyttsx3", "Selenium", "APIs"],
    emoji: "🎙️",
    color: "#0891b2",
  },
  {
    title: "AI Lung Cancer Detection",
    desc: "Deep Learning medical imaging system using CNNs to detect and classify lung cancer from CT scan images with high prediction accuracy.",
    tech: ["Python", "TensorFlow", "Keras", "OpenCV", "CNN"],
    emoji: "🔬",
    color: "#059669",
  },
  {
    title: "Agro AI Marketplace",
    desc: "AI-powered agriculture platform connecting farmers, suppliers, and buyers with smart crop recommendations and product matching.",
    tech: ["Python", "AI/ML", "FastAPI", "MongoDB"],
    emoji: "🌾",
    color: "#d97706",
  },
];

/* ── Navbar ── */
function Navbar() {
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setActive(id);
    setMenuOpen(false);
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(5,7,20,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(99,102,241,0.15)" : "none",
      transition: "all 0.3s ease",
      padding: "0 2rem",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, background: "linear-gradient(135deg, #818cf8, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          MH.
        </span>
        {/* Desktop links */}
        <div style={{ display: "flex", gap: 8 }} className="desktop-nav">
          {NAV_LINKS.map((l) => (
            <button key={l} onClick={() => scrollTo(l)} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "6px 14px", borderRadius: 8, fontSize: 14,
              color: active === l ? "#818cf8" : "rgba(255,255,255,0.65)",
              fontWeight: active === l ? 600 : 400,
              borderBottom: active === l ? "1px solid #818cf8" : "1px solid transparent",
              transition: "all 0.2s",
              fontFamily: "'Space Grotesk', sans-serif",
            }}>{l}</button>
          ))}
        </div>
        {/* Mobile burger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-burger" style={{
          background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "#fff",
          borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 18, display: "none",
        }}>☰</button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: "rgba(5,7,20,0.97)", borderTop: "1px solid rgba(99,102,241,0.15)",
          padding: "1rem 2rem", display: "flex", flexDirection: "column", gap: 8,
        }}>
          {NAV_LINKS.map((l) => (
            <button key={l} onClick={() => scrollTo(l)} style={{
              background: "none", border: "none", cursor: "pointer", textAlign: "left",
              padding: "10px 0", fontSize: 16, color: "rgba(255,255,255,0.8)",
              fontFamily: "'Space Grotesk', sans-serif", borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}>{l}</button>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ── Hero ── */
function Hero() {
  const typed = useTypingEffect(["Computer Science Student", "Frontend Developer", "Backend Developer", "AI-Powered Projects", "Python Developer"]);
  return (
    <section id="home" style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "6rem 2rem 4rem", position: "relative", overflow: "hidden",
    }}>
      {/* BG blobs */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <div style={{ position: "absolute", top: "10%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)", filter: "blur(40px)", animation: "float1 8s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(56,189,248,0.14) 0%, transparent 70%)", filter: "blur(40px)", animation: "float2 10s ease-in-out infinite" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />
        {/* Grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px", opacity: 0.6 }} />
      </div>
      <div style={{ maxWidth: 1100, width: "100%", display: "grid", gridTemplateColumns: "1fr auto", gap: "3rem", alignItems: "center", position: "relative", zIndex: 1 }} className="hero-grid">
        <div>
          <div style={{ display: "inline-block", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 20, padding: "6px 16px", fontSize: 13, color: "#818cf8", marginBottom: "1.5rem", fontFamily: "'Space Grotesk', sans-serif" }}>
            👋 Available for Opportunities
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 1rem", color: "#fff" }}>
            Muhammad<br />
            <span style={{ background: "linear-gradient(135deg, #818cf8 0%, #38bdf8 50%, #a78bfa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Haroon</span>
          </h1>
          <div style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", color: "rgba(255,255,255,0.55)", marginBottom: "1.5rem", fontFamily: "'Space Grotesk', sans-serif", minHeight: "2em" }}>
            <span style={{ color: "#38bdf8", fontWeight: 600 }}>{typed}</span>
            <span style={{ borderRight: "2px solid #38bdf8", marginLeft: 2, animation: "blink 1s step-end infinite" }}></span>
          </div>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 520, marginBottom: "2.5rem", fontFamily: "'Space Grotesk', sans-serif" }}>
            Computer Science student at NUTECH building responsive, user-friendly web applications. Passionate about clean code, modern frameworks, and creative problem-solving.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="mailto:haroon.26malik@gmail.com" style={{
              background: "linear-gradient(135deg, #4f46e5, #818cf8)", color: "#fff",
              padding: "14px 32px", borderRadius: 12, textDecoration: "none",
              fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk', sans-serif",
              boxShadow: "0 0 30px rgba(99,102,241,0.35)", transition: "transform 0.2s, box-shadow 0.2s",
              display: "inline-block",
            }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(99,102,241,0.55)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 0 30px rgba(99,102,241,0.35)"; }}>
              Hire Me ✦
            </a>
            <a href="#" style={{
              background: "transparent", color: "rgba(255,255,255,0.8)",
              padding: "14px 32px", borderRadius: 12, textDecoration: "none",
              fontWeight: 600, fontSize: 15, fontFamily: "'Space Grotesk', sans-serif",
              border: "1px solid rgba(255,255,255,0.2)", transition: "all 0.2s", display: "inline-block",
            }} onMouseEnter={e => { e.currentTarget.style.borderColor = "#818cf8"; e.currentTarget.style.color = "#818cf8"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}>
              ↓ Download CV
            </a>
          </div>
          {/* Socials */}
          <div style={{ display: "flex", gap: 16, marginTop: "2.5rem" }}>
            {[["GitHub", "https://github.com", "⌥"], ["LinkedIn", "https://linkedin.com", "in"], ["Email", "mailto:haroon.26malik@gmail.com", "@"]].map(([label, href, icon]) => (
              <a key={label} href={href} style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Space Grotesk', sans-serif", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#818cf8"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
                <span style={{ fontWeight: 700 }}>{icon}</span> {label}
              </a>
            ))}
          </div>
        </div>
        {/* Avatar */}
        <div className="hero-avatar" style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            width: 260, height: 260, borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(56,189,248,0.25))",
            border: "2px solid rgba(99,102,241,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 100, boxShadow: "0 0 60px rgba(99,102,241,0.2)",
            animation: "float1 6s ease-in-out infinite",
          }}>
            👨‍💻
          </div>
          {/* Orbiting badges */}
          {[["⚛️", "top: -10px", "left: 50%"], ["🐍", "bottom: 20px", "right: -10px"], ["🔗", "top: 50%", "left: -20px"]].map(([icon, t, l], i) => (
            <div key={i} style={{
              position: "absolute", [t.split(":")[0]]: t.split(": ")[1], [l.split(":")[0]]: l.split(": ")[1],
              background: "rgba(15,18,40,0.9)", border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: 12, padding: "8px 12px", fontSize: 20, backdropFilter: "blur(10px)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
              animation: `float${i % 2 === 0 ? "1" : "2"} ${6 + i}s ease-in-out infinite`,
            }}>{icon}</div>
          ))}
        </div>
      </div>
      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, animation: "float2 2s ease-in-out infinite" }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: 2, textTransform: "uppercase" }}>Scroll</span>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 18 }}>↓</span>
      </div>
    </section>
  );
}

/* ── About ── */
function About() {
  const stats = [["2+", "Years Coding"], ["4+", "Projects Built"], ["2", "Certifications"], ["∞", "Curiosity"]];
  return (
    <section id="about" style={{ padding: "6rem 2rem", position: "relative" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <RevealSection>
          <p style={{ color: "#818cf8", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: "0.75rem" }}>About Me</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#fff", margin: "0 0 3rem" }}>Crafting Digital <span style={{ color: "#818cf8" }}>Experiences</span></h2>
        </RevealSection>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }} className="about-grid">
          <RevealSection>
            <div style={{ position: "relative" }}>
              <div style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(56,189,248,0.08))",
                border: "1px solid rgba(99,102,241,0.2)", borderRadius: 24,
                padding: "2.5rem", backdropFilter: "blur(10px)",
              }}>
                <div style={{ fontSize: 64, marginBottom: "1.5rem" }}>👨‍💻</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {stats.map(([val, label]) => (
                    <div key={label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "1rem", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#818cf8" }}>{val}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontFamily: "'Space Grotesk', sans-serif", marginTop: 4 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealSection>
          <RevealSection delay={150}>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.9, marginBottom: "1.5rem", fontFamily: "'Space Grotesk', sans-serif" }}>
              I'm <strong style={{ color: "#fff" }}>Muhammad Haroon</strong>, a Computer Science student at NUTECH, Islamabad, and a passionate full-stack developer focused on building clean, responsive, and user-friendly web applications.
            </p>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.9, marginBottom: "1.5rem", fontFamily: "'Space Grotesk', sans-serif" }}>
              I thrive on turning complex problems into elegant solutions. From AI-powered systems to marketplace platforms, I love crafting software that makes a real impact. I'm constantly exploring modern technologies to stay at the cutting edge.
            </p>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.9, marginBottom: "2rem", fontFamily: "'Space Grotesk', sans-serif" }}>
              My approach emphasizes clean code, thoughtful UX, and continuous learning — building not just functional apps, but beautiful, memorable experiences.
            </p>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[["📧", "haroon.26malik@gmail.com"], ["📱", "03175546804"], ["📍", "Islamabad, PK"]].map(([icon, val]) => (
                <div key={val} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "'Space Grotesk', sans-serif" }}>
                  <span>{icon}</span><span>{val}</span>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}

/* ── Skills ── */
function SkillBar({ name, level, icon, delay }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.25rem", transition: "border-color 0.2s, transform 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = ""; }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: "rgba(255,255,255,0.85)", fontSize: 14 }}>{name}</span>
        </div>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: "#818cf8", fontWeight: 700 }}>{level}%</span>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 99,
          background: "linear-gradient(90deg, #4f46e5, #818cf8, #38bdf8)",
          width: visible ? `${level}%` : "0%",
          transition: `width 1s ease ${delay}ms`,
          boxShadow: "0 0 10px rgba(129,140,248,0.6)",
        }} />
      </div>
    </div>
  );
}

function Skills() {
  const [activeTab, setActiveTab] = useState("Frontend");
  return (
    <section id="skills" style={{ padding: "6rem 2rem", background: "rgba(99,102,241,0.03)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <RevealSection>
          <p style={{ color: "#818cf8", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: "0.75rem" }}>Technical Skills</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#fff", margin: "0 0 2.5rem" }}>My <span style={{ color: "#818cf8" }}>Toolkit</span></h2>
          <div style={{ display: "flex", gap: 8, marginBottom: "2.5rem", flexWrap: "wrap" }}>
            {Object.keys(SKILLS).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: "8px 22px", borderRadius: 30, border: "1px solid",
                borderColor: activeTab === tab ? "#818cf8" : "rgba(255,255,255,0.15)",
                background: activeTab === tab ? "rgba(99,102,241,0.2)" : "transparent",
                color: activeTab === tab ? "#818cf8" : "rgba(255,255,255,0.5)",
                cursor: "pointer", fontSize: 14, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600,
                transition: "all 0.2s",
              }}>{tab}</button>
            ))}
          </div>
        </RevealSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {SKILLS[activeTab].map((skill, i) => (
            <SkillBar key={skill.name} {...skill} icon={SKILL_ICONS[skill.name] || "💡"} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Education ── */
function Education() {
  return (
    <section id="education" style={{ padding: "6rem 2rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <RevealSection>
          <p style={{ color: "#818cf8", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: "0.75rem" }}>Academic Background</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#fff", margin: "0 0 3.5rem" }}>Education <span style={{ color: "#818cf8" }}>Timeline</span></h2>
        </RevealSection>
        <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
          {/* Timeline line */}
          <div style={{ position: "absolute", left: 22, top: 0, bottom: 0, width: 2, background: "linear-gradient(to bottom, #4f46e5, rgba(56,189,248,0.3))", borderRadius: 99 }} />
          {EDUCATION.map((edu, i) => (
            <RevealSection key={i} delay={i * 150}>
              <div style={{ display: "flex", gap: "2rem", marginBottom: "2.5rem", paddingLeft: 12 }}>
                {/* Dot */}
                <div style={{ position: "relative", flexShrink: 0, zIndex: 1, marginTop: 6 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg, #4f46e5, #818cf8)", border: "3px solid #050714", boxShadow: "0 0 16px rgba(99,102,241,0.5)", flexShrink: 0 }} />
                </div>
                {/* Card */}
                <div style={{
                  flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 20, padding: "1.75rem", backdropFilter: "blur(10px)",
                  transition: "border-color 0.2s, transform 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)"; e.currentTarget.style.transform = "translateX(6px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = ""; }}>
                  <div style={{ display: "inline-block", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 20, padding: "3px 12px", fontSize: 12, color: "#818cf8", marginBottom: "0.75rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
                    {edu.period}
                  </div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 0.25rem" }}>{edu.degree}</h3>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: "#38bdf8", fontWeight: 600, margin: "0 0 0.75rem" }}>{edu.school} · {edu.location}</p>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0 }}>{edu.desc}</p>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Certifications ── */
function Certifications() {
  return (
    <section id="certifications" style={{ padding: "6rem 2rem", background: "rgba(56,189,248,0.03)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <RevealSection>
          <p style={{ color: "#818cf8", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: "0.75rem" }}>Credentials</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#fff", margin: "0 0 3rem" }}>Courses & <span style={{ color: "#818cf8" }}>Certifications</span></h2>
        </RevealSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {CERTS.map((cert, i) => (
            <RevealSection key={i} delay={i * 150}>
              <div style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 24, padding: "2rem", position: "relative", overflow: "hidden",
                transition: "all 0.3s", cursor: "default",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(99,102,241,0.12)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = ""; }}>
                {/* Glow */}
                <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(99,102,241,0.08)", filter: "blur(30px)" }} />
                <div style={{ fontSize: 48, marginBottom: "1.25rem" }}>{cert.icon}</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", margin: "0 0 0.5rem", lineHeight: 1.3 }}>{cert.title}</h3>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: "#818cf8", fontWeight: 600, margin: "0 0 1rem" }}>{cert.org}</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0 }}>{cert.desc}</p>
                <div style={{ marginTop: "1.5rem", display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 20, padding: "5px 14px", fontSize: 12, color: "#818cf8", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
                  ✓ Certified
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Projects ── */
function Projects() {
  return (
    <section id="projects" style={{ padding: "6rem 2rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <RevealSection>
          <p style={{ color: "#818cf8", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: "0.75rem" }}>Portfolio</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#fff", margin: "0 0 3rem" }}>Featured <span style={{ color: "#818cf8" }}>Projects</span></h2>
        </RevealSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))", gap: 24 }} className="projects-grid">
          {PROJECTS.map((project, i) => (
            <RevealSection key={i} delay={i * 100}>
              <div style={{
                background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 24, overflow: "hidden", height: "100%",
                transition: "all 0.3s", cursor: "default",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.4)`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                {/* Image placeholder */}
                <div style={{
                  height: 200, background: `linear-gradient(135deg, ${project.color}22, ${project.color}08)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 72, borderBottom: "1px solid rgba(255,255,255,0.06)",
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
                  {project.emoji}
                </div>
                <div style={{ padding: "1.75rem" }}>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 0.75rem" }}>{project.title}</h3>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 0 1.25rem" }}>{project.desc}</p>
                  {/* Tech badges */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {project.tech.map((t) => (
                      <span key={t} style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 6, padding: "3px 10px", fontSize: 11, color: "#818cf8", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Contact ── */
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
    window.location.href = `mailto:haroon.26malik@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", message: "" });
  };

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 12, padding: "14px 16px", fontSize: 15, color: "#fff",
    fontFamily: "'Space Grotesk', sans-serif", outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  return (
    <section id="contact" style={{ padding: "6rem 2rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <RevealSection>
          <p style={{ color: "#818cf8", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: "0.75rem" }}>Get In Touch</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#fff", margin: "0 0 1rem" }}>Let's <span style={{ color: "#818cf8" }}>Connect</span></h2>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 500, margin: "0 0 3rem", lineHeight: 1.7 }}>
            Open for internships, freelance work, and collaborative projects. Let's build something great together.
          </p>
        </RevealSection>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "4rem", alignItems: "start" }} className="contact-grid">
          {/* Info */}
          <RevealSection>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { icon: "📧", label: "Email", value: "haroon.26malik@gmail.com", href: "mailto:haroon.26malik@gmail.com", badge: "Send Email" },
                { icon: "💬", label: "WhatsApp", value: "+92 317 5546804", href: "https://wa.me/923175546804", badge: "Chat Now" },
                { icon: "💼", label: "LinkedIn", value: "linkedin.com/in/haroon", href: "https://linkedin.com" },
              ].map(({ icon, label, value, href, badge }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" style={{
                  display: "flex", alignItems: "center", gap: 16, padding: "1.25rem 1.5rem",
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16, textDecoration: "none", transition: "all 0.2s", color: "inherit",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; e.currentTarget.style.transform = "translateX(6px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = ""; }}>
                  <span style={{ fontSize: 24 }}>{icon}</span>
                  <div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "#818cf8", fontWeight: 600, marginBottom: 2 }}>{label}</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{value}</div>
                  </div>
                  {badge && <span style={{ marginLeft: "auto", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 20, padding: "3px 10px", fontSize: 11, color: "#4ade80", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>{badge}</span>}
                </a>
              ))}
            </div>
          </RevealSection>
          {/* Form */}
          <RevealSection delay={150}>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "2.5rem" }}>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 1.75rem" }}>Send a Message</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <input placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#818cf8"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"} />
                <input placeholder="Your Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#818cf8"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"} />
                <textarea placeholder="Your Message" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={e => e.target.style.borderColor = "#818cf8"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"} />
                <button onClick={handleSubmit} style={{
                  background: sent ? "linear-gradient(135deg, #059669, #34d399)" : "linear-gradient(135deg, #4f46e5, #818cf8)",
                  color: "#fff", border: "none", borderRadius: 12, padding: "15px",
                  fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif",
                  cursor: "pointer", transition: "all 0.3s",
                  boxShadow: sent ? "0 0 30px rgba(52,211,153,0.3)" : "0 0 30px rgba(99,102,241,0.3)",
                }}>
                  {sent ? "✓ Message Sent!" : "Send Message →"}
                </button>
              </div>
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "2.5rem 2rem", textAlign: "center" }}>
      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)", margin: 0 }}>
        Designed & Built by{" "}
        <span style={{ color: "#818cf8", fontWeight: 600 }}>Muhammad Haroon</span>{" "}
        · © {new Date().getFullYear()} · All rights reserved
      </p>
    </footer>
  );
}

/* ── Root App ── */
export default function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1400); return () => clearTimeout(t); }, []);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#050714", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36, background: "linear-gradient(135deg, #818cf8, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>MH.</div>
      <div style={{ width: 200, height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", background: "linear-gradient(90deg, #4f46e5, #818cf8, #38bdf8)", borderRadius: 99, animation: "load 1.2s ease forwards" }} />
      </div>
    </div>
  );

  return (
    <div style={{ background: "#050714", minHeight: "100vh", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: #050714; }
        ::selection { background: rgba(99,102,241,0.3); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #050714; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 99px; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(12px)} }
        @keyframes load { from{width:0} to{width:100%} }
        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr!important;}
          .hero-avatar{display:none!important;}
          .about-grid{grid-template-columns:1fr!important;}
          .contact-grid{grid-template-columns:1fr!important;}
          .projects-grid{grid-template-columns:1fr!important;}
          .desktop-nav{display:none!important;}
          .mobile-burger{display:flex!important;align-items:center;}
        }
      `}</style>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Education />
        <Certifications />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
