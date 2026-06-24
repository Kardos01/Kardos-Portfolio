import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Github,
  Mail,
  Sparkles,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Award,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  Star,
} from "lucide-react";

import { navLinks } from "./data/nav";
import { personalInfo } from "./data/personal";
import { skills } from "./data/skills";
import { aboutParagraphs } from "./data/about";
import { stats } from "./data/stats";
import { experiences } from "./data/experience";
import { projects } from "./data/projects";
import { contactItems } from "./data/contact";
import { socialLinks } from "./data/social";
import { languages } from "./data/languages";
import PortfolioSkeleton from "./components/PortfolioSkeleton";
import { education, certifications } from "./data/education";
import ComputersCanvas from "./components/hero/ComputersCanvas";

type IndicatorStyle = {
  left: number;
  width: number;
  opacity: number;
};

export default function Index() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string>("about");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [typedText, setTypedText] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);

  const progressBarRef = useRef<HTMLDivElement>(null);

  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const [hoverStyle, setHoverStyle] = useState<IndicatorStyle>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const navRef = useRef<HTMLDivElement>(null);
  const navButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const cursorRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const scrollRafRef = useRef<number | null>(null);
  const cursorRafRef = useRef<number | null>(null);

  const typingTitles = personalInfo.typingTitles;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const current = typingTitles[typingIndex];
    let charIndex = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const type = () => {
      if (charIndex <= current.length) {
        setTypedText(current.slice(0, charIndex));
        charIndex++;
        timeout = setTimeout(type, 80);
      } else {
        timeout = setTimeout(() => {
          const erase = () => {
            if (charIndex > 0) {
              charIndex--;
              setTypedText(current.slice(0, charIndex));
              timeout = setTimeout(erase, 40);
            } else {
              setTypingIndex((prev) => (prev + 1) % typingTitles.length);
            }
          };
          erase();
        }, 2000);
      }
    };

    type();

    return () => clearTimeout(timeout);
  }, [typingIndex, typingTitles]);

  useEffect(() => {
    const updateScrollState = () => {
      const nextScrolled = window.scrollY > 50;
      setIsScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));

      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;

      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${progress}%`;
      }

      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-section]")
      );

      let currentActive = "about";

      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      if (scrolledToBottom && sections.length > 0) {
        const lastId = sections[sections.length - 1].dataset.section;
        if (lastId) currentActive = lastId;
      } else {
        for (const section of sections) {
          const rect = section.getBoundingClientRect();
          const id = section.dataset.section;
          if (!id) continue;

          if (rect.top <= 140 && rect.bottom >= 140) {
            currentActive = id;
            break;
          }
        }
      }

      const newVisible = new Set<string>();
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const id = section.dataset.section;
        if (!id) return;

        if (rect.top < window.innerHeight * 0.8) {
          newVisible.add(id);
        }
      });

      setActiveSection((prev) => (prev === currentActive ? prev : currentActive));

      setVisibleSections((prev) => {
        const merged = new Set([...prev, ...newVisible]);

        if (merged.size === prev.size) {
          let same = true;
          prev.forEach((value) => {
            if (!merged.has(value)) same = false;
          });
          if (same) return prev;
        }

        return merged;
      });

      scrollRafRef.current = null;
    };

    const onScroll = () => {
      if (scrollRafRef.current !== null) return;
      scrollRafRef.current = window.requestAnimationFrame(updateScrollState);
    };

    updateScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (scrollRafRef.current !== null) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    const isMobileWidth = window.innerWidth <= 768;
    if (isMobileWidth) return;

    let latestX = 0;
    let latestY = 0;
    let latestScale = 1;
    let visible = false;

    const renderCursor = () => {
      cursorEl.style.left = `${latestX}px`;
      cursorEl.style.top = `${latestY}px`;
      cursorEl.style.opacity = visible ? "1" : "0";
      cursorEl.style.transform = `translate(-50%, -50%) scale(${latestScale})`;
      cursorRafRef.current = null;
    };

    const queueRender = () => {
      if (cursorRafRef.current !== null) return;
      cursorRafRef.current = window.requestAnimationFrame(renderCursor);
    };

    const onMove = (e: MouseEvent) => {
      latestX = e.clientX;
      latestY = e.clientY;
      visible = true;

      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [role='button']");
      latestScale = interactive ? 2.2 : 1;

      queueRender();
    };

    const onLeave = () => {
      visible = false;
      queueRender();
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      if (cursorRafRef.current !== null) {
        window.cancelAnimationFrame(cursorRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const updateIndicator = () => {
      const btn = navButtonRefs.current[activeSection];
      const container = navRef.current;

      if (!btn || !container) {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();

      setIndicatorStyle({
        left: btnRect.left - containerRect.left,
        width: btnRect.width,
        opacity: 1,
      });
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);

    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeSection]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavHover = (id: string) => {
    const btn = navButtonRefs.current[id];
    const container = navRef.current;

    if (!btn || !container) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    setHoverStyle({
      left: btnRect.left - containerRect.left,
      width: btnRect.width,
      opacity: 1,
    });
  };

  const handleNavLeave = () => {
    setHoverStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleAboutMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!aboutRef.current || !spotlightRef.current) return;

    const rect = aboutRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    spotlightRef.current.style.left = `${x}px`;
    spotlightRef.current.style.top = `${y}px`;
    spotlightRef.current.style.opacity = "1";
  };

  const handleAboutMouseLeave = () => {
    if (!spotlightRef.current) return;
    spotlightRef.current.style.opacity = "0";
  };

  const isAboutActive =
    activeSection === "about" || visibleSections.has("about");

  if (isPageLoading) {
    return <PortfolioSkeleton />;
  }

  return (
    <div className="bg-[#0A0A0F] text-[#F4F4F4] min-h-screen font-inter overflow-x-hidden cursor-none">
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes mesh-shift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.08); }
          66% { transform: translate(-20px, 20px) scale(0.97); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.3), 0 0 40px rgba(34, 211, 238, 0.1); }
          50% { box-shadow: 0 0 28px rgba(34, 211, 238, 0.45), 0 0 54px rgba(34, 211, 238, 0.16); }
        }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.65; } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes word-reveal {
          from { color: #4A4A4A; opacity: 0.4; filter: blur(2px); }
          to { color: #F4F4F4; opacity: 1; filter: blur(0); }
        }
        @keyframes stagger-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        @keyframes aurora {
          0%, 100% { transform: translateX(-30%) translateY(0); opacity: 0.45; }
          50% { transform: translateX(30%) translateY(-20px); opacity: 0.7; }
        }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-glow { animation: glow 3s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.8s ease-out backwards; }

        .glass-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%);
          backdrop-filter: blur(18px) saturate(180%);
          -webkit-backdrop-filter: blur(18px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4),
                      inset 0 1px 0 0 rgba(255, 255, 255, 0.07);
          position: relative;
        }
        .glass-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), transparent 40%, rgba(34, 211, 238, 0.1));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .glass-card-hover:hover {
          background: linear-gradient(135deg, rgba(34, 211, 238, 0.06) 0%, rgba(167, 139, 250, 0.04) 100%);
          border-color: rgba(34, 211, 238, 0.4);
          box-shadow: 0 12px 40px 0 rgba(34, 211, 238, 0.16),
                      inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
        }
        .glass-strong {
          background: rgba(15, 15, 25, 0.55);
          backdrop-filter: blur(22px) saturate(180%);
          -webkit-backdrop-filter: blur(22px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

      .noise-overlay {.noise: fixed;
        inset: 0;
        pointer-events: none;
        opacity: 0.03;
        mix-blend-mode: overlay;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        z-index: 1;
      }


        .mesh-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(75px);
          animation: mesh-shift 20s ease-in-out infinite;
          will-change: transform;
        }

        .aurora {
          position: absolute;
          width: 60%;
          height: 100px;
          filter: blur(50px);
          animation: aurora 12s ease-in-out infinite;
          opacity: 0.5;
          will-change: transform, opacity;
        }

        .about-word {
          color: #4A4A4A;
          opacity: 0.4;
          display: inline-block;
          transition: color 0.3s ease;
        }
        .about-active .about-word {
          animation: word-reveal 0.5s ease-out forwards;
        }

        .about-spotlight {
          position: absolute;
          pointer-events: none;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(34, 211, 238, 0.18) 0%, rgba(167, 139, 250, 0.1) 40%, transparent 70%);
          transform: translate(-50%, -50%);
          transition: opacity 0.25s ease;
          mix-blend-mode: screen;
          z-index: 5;
          opacity: 0;
          will-change: transform, opacity, left, top;
        }
        .about-text-layer { position: relative; z-index: 10; }

        .nav-indicator {
          position: absolute;
          bottom: -8px;
          height: 3px;
          border-radius: 999px;
          background: linear-gradient(90deg, #22D3EE, #A78BFA, #22D3EE);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
          box-shadow: 0 0 12px rgba(34, 211, 238, 0.7), 0 0 24px rgba(167, 139, 250, 0.4);
          transition: left 0.55s cubic-bezier(0.65, 0, 0.35, 1),
                      width 0.55s cubic-bezier(0.65, 0, 0.35, 1),
                      opacity 0.3s ease;
          pointer-events: none;
        }
        .nav-hover-indicator {
          position: absolute;
          bottom: -8px;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.6), rgba(34, 211, 238, 0.9));
          transition: left 0.45s cubic-bezier(0.22, 1, 0.36, 1),
                      width 0.45s cubic-bezier(0.22, 1, 0.36, 1),
                      opacity 0.25s ease;
          pointer-events: none;
        }

        .gradient-text {
          background: linear-gradient(135deg, #22D3EE 0%, #A78BFA 50%, #F472B6 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .gradient-text-2 {
          background: linear-gradient(90deg, #FFFFFF 0%, #A78BFA 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .cursor-dot {
          position: fixed;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: radial-gradient(circle, #22D3EE 0%, #A78BFA 100%);
          pointer-events: none;
          z-index: 9999;
          transition: transform 0.15s ease-out, opacity 0.2s ease;
          transform: translate(-50%, -50%) scale(1);
          box-shadow:
            0 0 20px rgba(34, 211, 238, 0.7),
            0 0 40px rgba(167, 139, 250, 0.35);
          opacity: 0;
          will-change: transform, left, top, opacity;
        }
        @media (max-width: 768px) {
          .cursor-dot { display: none; }
          .cursor-none { cursor: auto !important; }
        }

        .hover-accent-text {
          transition: color 0.3s ease, text-shadow 0.3s ease;
        }
        .hover-accent-text:hover {
          color: #F472B6;
          text-shadow: 0 0 10px rgba(244, 114, 182, 0.25);
        }
        @media (max-width: 768px) {
          .cursor-dot { display: none; }
          .cursor-none { cursor: auto !important; }
        }

        .typing-cursor {
          display: inline-block;
          width: 3px;
          height: 1em;
          background: #22D3EE;
          margin-left: 4px;
          vertical-align: text-bottom;
          animation: blink 1s steps(1) infinite;
        }

        .project-card {
          transform-style: preserve-3d;
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }
        .project-card:hover {
          transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-6px);
        }
      `}</style>

      <div ref={cursorRef} className="cursor-dot" />

      <div className="fixed top-0 left-0 right-0 h-0.5 z-[60] pointer-events-none">
        <div
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-[#22D3EE] via-[#A78BFA] to-[#F472B6]"
          style={{
            width: "0%",
            boxShadow: "0 0 10px rgba(34, 211, 238, 0.6)",
          }}
        />
      </div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="mesh-blob bg-[#22D3EE]/20 w-[600px] h-[600px] -top-40 -right-40" />
        <div
          className="mesh-blob bg-[#A78BFA]/20 w-[700px] h-[700px] top-1/3 -left-60"
          style={{ animationDelay: "5s" }}
        />
        <div
          className="mesh-blob bg-[#F472B6]/10 w-[500px] h-[500px] bottom-0 right-1/4"
          style={{ animationDelay: "10s" }}
        />

        <div className="aurora bg-gradient-to-r from-transparent via-[#22D3EE] to-transparent top-[20%] left-[20%]" />
        <div
          className="aurora bg-gradient-to-r from-transparent via-[#A78BFA] to-transparent top-[60%] left-[40%]"
          style={{ animationDelay: "6s" }}
        />

        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#22D3EE" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="noise-overlay" />

      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? "py-2" : "py-3"}`}>
        <div
          className={`max-w-6xl mx-3 sm:mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative z-20 transition-all duration-500 ${
            isScrolled ? "glass-strong rounded-2xl py-3 mt-2" : "py-4 bg-transparent"
          }`}
        >
          <button
            onClick={() => scrollToSection("about")}
            className="text-2xl font-bold font-montserrat gradient-text"
          >
            {personalInfo.shortName}
          </button>

          <div
            ref={navRef}
            onMouseLeave={handleNavLeave}
            className="hidden md:flex gap-8 items-center relative"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  ref={(el) => {
                    navButtonRefs.current[link.id] = el;
                  }}
                  onClick={() => scrollToSection(link.id)}
                  onMouseEnter={() => handleNavHover(link.id)}
                  className="relative font-medium text-sm py-1 transition-colors duration-300"
                >
                  <span
                    className={`transition-colors duration-300 ${
                      isActive
                        ? "gradient-text font-semibold"
                        : "text-[#C7C9D9] hover:text-[#22D3EE]"
                    }`}
                  >
                    {link.label}
                  </span>
                </button>
              );
            })}

            <span
              className="nav-hover-indicator"
              style={{
                left: hoverStyle.left,
                width: hoverStyle.width,
                opacity: hoverStyle.opacity,
              }}
            />
            <span
              className="nav-indicator"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                opacity: indicatorStyle.opacity,
              }}
            />
          </div>

          <button
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl glass-card text-[#22D3EE] hover:border-[#22D3EE] transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-5">
              <Menu
                size={20}
                className={`absolute inset-0 transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0 rotate-90" : "opacity-100"
                }`}
              />
              <X
                size={20}
                className={`absolute inset-0 transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-100" : "opacity-0 -rotate-90"
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      <div
        className={`md:hidden fixed inset-0 z-40 transition-all duration-500 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-[#0A0A0F]/90 backdrop-blur-2xl"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#22D3EE] rounded-full opacity-15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-[#A78BFA] rounded-full opacity-10 blur-3xl pointer-events-none" />

        <div className="relative h-full flex flex-col items-center justify-center px-6">
          <div className="w-full max-w-sm">
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-r from-[#22D3EE] to-[#A78BFA] p-0.5 rounded-full w-fit">
                <div className="bg-[#0A0A0F] rounded-full px-4 py-1.5 flex items-center gap-2">
                  <Sparkles size={12} className="text-[#22D3EE]" />
                  <span className="gradient-text text-xs font-semibold uppercase tracking-wider">
                    Navigation
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {navLinks.map((link, idx) => {
                const Icon = link.icon;
                const isActive = activeSection === link.id;

                return (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-300 group ${
                      isActive
                        ? "bg-gradient-to-r from-[#22D3EE]/15 to-[#A78BFA]/15 border-[#22D3EE] shadow-lg shadow-[#22D3EE]/20"
                        : "glass-card glass-card-hover"
                    }`}
                    style={{
                      animation: isMobileMenuOpen
                        ? `stagger-in 0.4s ease-out ${idx * 0.08}s backwards`
                        : undefined,
                    }}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                        isActive
                          ? "bg-gradient-to-br from-[#22D3EE] to-[#A78BFA] text-[#0A0A0F]"
                          : "bg-[#22D3EE]/10 text-[#22D3EE]"
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <span
                      className={`font-medium text-base flex-grow text-left transition-colors duration-300 ${
                        isActive ? "gradient-text font-semibold" : "text-[#F4F4F4]"
                      }`}
                    >
                      {link.label}
                    </span>

                    <ArrowRight
                      size={16}
                      className={`transition-all duration-300 ${
                        isActive
                          ? "text-[#22D3EE]"
                          : "text-[#22D3EE]/40 -translate-x-2 group-hover:translate-x-0"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-10 pt-6 border-t border-white/10 flex justify-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.key}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="p-2.5 rounded-xl glass-card glass-card-hover text-[#22D3EE]"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}

              <a
                href={`mailto:${personalInfo.email}`}
                aria-label="Email"
                className="p-2.5 rounded-xl glass-card glass-card-hover text-[#22D3EE]"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="relative min-h-screen w-full mx-auto overflow-hidden z-10 pt-28 pb-28 md:pb-32 px-4 sm:px-6 lg:px-8">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#22D3EE]/10 to-[#A78BFA]/10 blur-3xl animate-pulse-glow" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
          {/* TOP AREA: name on left, computer on right */}
          <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
            {/* LEFT SIDE: only name + typing text */}
            <div className="w-full lg:w-[40%] flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="mb-6">
                <div className="bg-gradient-to-r from-[#22D3EE] via-[#A78BFA] to-[#F472B6] p-0.5 rounded-full w-fit animate-glow">
                  <div className="bg-[#0A0A0F] rounded-full px-4 py-2 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-[#F4F4F4] text-xs sm:text-sm font-medium">
                      Available for new opportunities
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4 flex flex-col items-center lg:items-start">
                <div className="w-4 h-4 rounded-full bg-[#22D3EE] mb-3" />
                <div className="w-1 h-16 bg-gradient-to-b from-[#22D3EE] via-[#A78BFA] to-transparent rounded-full" />
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-montserrat font-bold leading-tight tracking-tight">
                <span className="text-white">Hi, I&apos;m </span>
                <span className="gradient-text">{personalInfo.shortName}</span>
              </h1>

              <p className="mt-4 text-xl sm:text-2xl md:text-3xl text-[#C7C9D9] font-medium min-h-[2.5rem]">
                <span className="text-[#22D3EE]">{typedText}</span>
                <span className="typing-cursor" />
              </p>
            </div>

            {/* RIGHT SIDE: computer */}
            <div className="w-full lg:w-[60%] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[560px]">
              <ComputersCanvas />
            </div>
          </div>

          {/* BOTTOM AREA: description + buttons + stats under computer */}
          <div className="w-full mt-8 flex flex-col items-center text-center">
            <p className="text-base sm:text-lg text-[#9CA0B5] max-w-3xl leading-relaxed">
              {personalInfo.heroDescription}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => scrollToSection("projects")}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#22D3EE] to-[#A78BFA] text-[#0A0A0F] rounded-xl font-semibold hover:shadow-xl hover:shadow-[#22D3EE]/40 transition-all duration-300 transform hover:scale-105 group flex items-center justify-center gap-2"
              >
                View My Work
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </button>

              <a
                href="/Kardos-Portfolio/KardosAhmed.pdf"

                download
                className="w-full sm:w-auto px-8 py-3 glass-card glass-card-hover text-[#F4F4F4] rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Download CV
              </a>
            </div>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="glass-card rounded-2xl p-4 text-center group hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-2xl sm:text-3xl font-bold gradient-text font-montserrat">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#9CA0B5] mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex justify-center items-center z-10">
          <button onClick={() => scrollToSection("about")} aria-label="Scroll to about section">
            <div className="w-[34px] h-[60px] rounded-3xl border-2 border-[#A78BFA] flex justify-center items-start p-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#22D3EE] animate-bounce" />
            </div>
          </button>
        </div>
      </section>
      {/* ABOUT */}
      <section
        id="about"
        data-section="about"
        className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative z-10 transition-all duration-700 ${
          visibleSections.has("about") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-bold mb-10 sm:mb-12 text-center">
            About <span className="gradient-text">Me</span>
          </h2>

          <div className="relative group about-card">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#22D3EE] via-[#A78BFA] to-[#F472B6] rounded-2xl opacity-0 group-hover:opacity-25 blur-2xl transition-all duration-700" />

            <div
              ref={aboutRef}
              onMouseMove={handleAboutMouseMove}
              onMouseLeave={handleAboutMouseLeave}
              className={`glass-card rounded-2xl p-6 sm:p-8 md:p-12 relative z-10 overflow-hidden ${
                isAboutActive ? "about-active" : ""
              }`}
            >
              <div ref={spotlightRef} className="about-spotlight" />

              <div className="about-text-layer relative">
                {aboutParagraphs.map((paragraph, pIdx) => {
                  const words = paragraph.split(" ");
                  let wordCounter = 0;

                  for (let i = 0; i < pIdx; i++) {
                    wordCounter += aboutParagraphs[i].split(" ").length;
                  }

                  return (
                    <p
                      key={pIdx}
                      className={`text-base sm:text-lg leading-relaxed ${
                        pIdx < aboutParagraphs.length - 1 ? "mb-5" : ""
                      }`}
                    >
                      {words.map((word, wIdx) => {
                        const globalIdx = wordCounter + wIdx;
                        return (
                          <span
                            key={wIdx}
                            className="about-word"
                            style={{ animationDelay: `${globalIdx * 0.04}s` }}
                          >
                            {word}
                            {wIdx < words.length - 1 ? "\u00A0" : ""}
                          </span>
                        );
                      })}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section
        id="skills"
        data-section="skills"
        className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative z-10 transition-all duration-700 ${
          visibleSections.has("skills") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-bold mb-12 sm:mb-16 text-center">
            Technical <span className="gradient-text">Skills</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, idx) => {
              const Icon = skill.icon;
              return (
                <div key={idx} className="group relative">
                  <div className="glass-card glass-card-hover rounded-2xl p-6 sm:p-8 transition-all duration-300 transform group-hover:-translate-y-2 h-full">
                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/10">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22D3EE]/20 to-[#A78BFA]/20 border border-[#22D3EE]/30 flex items-center justify-center">
                        <Icon size={18} className="text-[#22D3EE]" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-montserrat font-bold text-[#F4F4F4]">
                        {skill.category}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {skill.items.map((item, itemIdx) => (
                        <span
                          key={itemIdx}
                          className="px-3 py-1.5 bg-gradient-to-r from-[#22D3EE]/10 to-[#A78BFA]/10 text-[#C7C9D9] rounded-full text-xs sm:text-sm font-medium border border-white/10 hover:border-[#22D3EE]/50 hover:text-[#22D3EE] transition-all duration-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section
        id="experience"
        data-section="experience"
        className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative z-10 transition-all duration-700 ${
          visibleSections.has("experience") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-bold mb-12 sm:mb-16 text-center">
            Work <span className="gradient-text">Experience</span>
          </h2>

          <div className="relative space-y-6 sm:space-y-8">
            <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#22D3EE] via-[#A78BFA] to-transparent" />

            {experiences.map((exp, idx) => (
              <div key={idx} className="group relative pl-12 sm:pl-16">
                <div className="absolute left-2 sm:left-4 top-6 w-5 h-5 rounded-full bg-gradient-to-br from-[#22D3EE] to-[#A78BFA] border-4 border-[#0A0A0F] shadow-lg shadow-[#22D3EE]/50" />

                <div className="glass-card glass-card-hover rounded-2xl p-6 sm:p-8 transition-all duration-300 relative">
                  <div className="hidden sm:flex absolute top-6 right-6 w-12 h-12 rounded-xl bg-gradient-to-br from-[#22D3EE]/20 to-[#A78BFA]/20 border border-[#22D3EE]/30 items-center justify-center">
                    <Briefcase size={20} className="text-[#22D3EE]" />
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:pr-16">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-montserrat font-bold text-[#F4F4F4] mb-2">
                        {exp.title}
                      </h3>
                      <p className="text-[#22D3EE] font-medium text-sm sm:text-base">
                        {exp.company}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[#9CA0B5] text-xs sm:text-sm mt-2 md:mt-0">
                      <Calendar size={14} />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-[#C7C9D9] leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section
        id="projects"
        data-section="projects"
        className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative z-10 transition-all duration-700 ${
          visibleSections.has("projects") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-bold mb-12 sm:mb-16 text-center">
            Featured <span className="gradient-text">Projects</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project, idx) => {
              const isLarge = project.size === "large";
              const accentGradient =
                project.accent === "cyan"
                  ? "from-[#22D3EE] to-[#67E8F9]"
                  : "from-[#A78BFA] to-[#F472B6]";

              return (
                <div
                  key={idx}
                  className={`project-card group relative flex flex-col h-full ${
                    isLarge ? "md:col-span-2" : "md:col-span-1"
                  }`}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-[#22D3EE] via-[#A78BFA] to-[#F472B6] rounded-2xl opacity-0 group-hover:opacity-40 blur-xl transition-all duration-700" />

                  <div className="glass-card rounded-2xl p-6 sm:p-8 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                    <div
                      className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${accentGradient} opacity-10 group-hover:opacity-30 blur-3xl transition-opacity duration-500`}
                    />

                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-mono font-bold bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent`}>
                        / 0{idx + 1}
                      </span>

                      <div className="flex gap-2">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} GitHub`}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#C7C9D9] hover:text-[#22D3EE] transition-all duration-300"
                        >
                          <Github size={14} />
                        </a>
                      </div>
                    </div>

                    <h3
                      className={`font-montserrat font-bold text-[#F4F4F4] mb-1 transition-all duration-300 ${
                        isLarge ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
                      }`}
                    >
                      {project.title}
                    </h3>

                    <p className={`bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent text-sm font-medium mb-4`}>
                      {project.tagline}
                    </p>

                    <p className="text-sm text-[#9CA0B5] leading-relaxed mb-6 flex-grow">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIdx) => (
                        <span
                          key={techIdx}
                          className="px-3 py-1 bg-white/5 text-[#C7C9D9] rounded-full text-xs font-medium border border-white/10 hover:border-[#22D3EE]/50 transition-all duration-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section
        id="education"
        data-section="education"
        className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative z-10 transition-all duration-700 ${
          visibleSections.has("education") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-bold mb-12 sm:mb-16 text-center">
            Education <span className="gradient-text">& Certifications</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="group relative">
              <div className="glass-card glass-card-hover rounded-2xl p-6 sm:p-8 md:p-10 transition-all duration-300 transform group-hover:-translate-y-2 h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#22D3EE]/20 to-[#A78BFA]/20 border border-[#22D3EE]/30 flex items-center justify-center">
                    <GraduationCap size={22} className="text-[#22D3EE]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-montserrat font-bold gradient-text">
                    Education
                  </h3>
                </div>

                <p className="text-[#F4F4F4] font-semibold mb-2 text-lg">{education.degree}</p>
                <p className="text-[#C7C9D9] mb-2 text-sm sm:text-base">{education.university}</p>
                <div className="flex items-center gap-2 text-[#9CA0B5] text-sm mt-3">
                  <Calendar size={14} />
                  <span>{education.period}</span>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="glass-card glass-card-hover rounded-2xl p-6 sm:p-8 md:p-10 transition-all duration-300 transform group-hover:-translate-y-2 h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#A78BFA]/20 to-[#F472B6]/20 border border-[#A78BFA]/30 flex items-center justify-center">
                    <Award size={22} className="text-[#A78BFA]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-montserrat font-bold gradient-text">
                    Certifications
                  </h3>
                </div>

                <div className="space-y-4">
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2
                        size={16}
                        className={`mt-1 flex-shrink-0 ${
                          cert.accent === "cyan" ? "text-[#22D3EE]" : "text-[#A78BFA]"
                        }`}
                      />
                      <div>
                        <p className="text-[#F4F4F4] font-semibold">{cert.title}</p>
                        <p className="text-[#9CA0B5] text-sm">{cert.period}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="glass-card glass-card-hover rounded-2xl p-6 sm:p-8 md:p-10 transition-all duration-300 transform group-hover:-translate-y-2">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#22D3EE]/20 to-[#A78BFA]/20 border border-[#22D3EE]/30 flex items-center justify-center">
                  <Star size={22} className="text-[#22D3EE]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-montserrat font-bold gradient-text">
                  Languages
                </h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {languages.map((language, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-[#22D3EE]/10 to-[#A78BFA]/10 text-[#C7C9D9] text-sm sm:text-base font-medium border border-white/10 hover:border-[#22D3EE]/40 transition-all duration-300"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        data-section="contact"
        className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative z-10 transition-all duration-700 ${
          visibleSections.has("contact") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-bold mb-6 text-center">
            Get In <span className="gradient-text">Touch</span>
          </h2>

          <p className="text-center text-[#9CA0B5] mb-12 max-w-xl mx-auto flex items-center justify-center gap-2">
            <Clock size={14} className="text-[#22D3EE]" />
            <span>Usually replies within 24 hours</span>
          </p>

          <div className="glass-card rounded-3xl p-6 sm:p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#22D3EE] via-[#A78BFA] to-[#F472B6]" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
              {contactItems.map((item, idx) => {
                const Icon = item.icon;
                const cardContent = (
                  <div className="flex flex-col items-center text-center gap-3 p-5 sm:p-6 glass-card glass-card-hover rounded-2xl transition-all duration-300 transform hover:-translate-y-1 h-full min-h-[170px] justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#22D3EE]/20 to-[#A78BFA]/20 border border-[#22D3EE]/30 flex items-center justify-center flex-shrink-0">
                      <Icon className="text-[#22D3EE]" size={24} />
                    </div>

                    <div className="w-full">
                      <p className="text-[#9CA0B5] text-xs sm:text-sm mb-1">{item.label}</p>
                      <p className="text-[#F4F4F4] text-sm font-medium break-words">{item.value}</p>
                    </div>
                  </div>
                );

                if (item.href) {
                  return (
                    <a key={idx} href={item.href} className="block h-full">
                      {cardContent}
                    </a>
                  );
                }

                return (
                  <div key={idx} className="block h-full">
                    {cardContent}
                  </div>
                );
              })}
            </div>

            <div className="text-center border-t border-white/10 pt-8">
              <p className="text-sm sm:text-base text-[#C7C9D9] mb-6 max-w-xl mx-auto">
                Feel free to reach out via email or phone. I&apos;m always interested in hearing about exciting projects and opportunities.
              </p>

              <div className="flex justify-center gap-3 sm:gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.key}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="text-[#22D3EE] hover:text-cyan-300 transition-all duration-300 p-3 glass-card glass-card-hover rounded-xl hover:scale-110 transform"
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}

                <a
                  href={`mailto:${personalInfo.email}`}
                  aria-label="Email"
                  className="text-[#22D3EE] hover:text-cyan-300 transition-all duration-300 p-3 glass-card glass-card-hover rounded-xl hover:scale-110 transform"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[#9CA0B5] text-xs sm:text-sm flex items-center justify-center gap-2 flex-wrap">
            <span>© {new Date().getFullYear()} {personalInfo.name}.</span>
            <span className="text-[#22D3EE]">•</span>
            <span>Made with</span>
            <Star size={12} className="text-[#A78BFA] fill-[#A78BFA]" />
            <span>in Sulaymaniyah</span>
          </p>
        </div>
      </footer>
    </div>
  );
}