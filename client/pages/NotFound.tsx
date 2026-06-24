import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F4F4F4] flex items-center justify-center px-4 relative overflow-hidden">
      <style>{`
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(34, 211, 238, 0.25), 0 0 40px rgba(167, 139, 250, 0.12);
          }
          50% {
            box-shadow: 0 0 32px rgba(34, 211, 238, 0.4), 0 0 64px rgba(167, 139, 250, 0.18);
          }
        }

        .glass-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%);
          backdrop-filter: blur(18px) saturate(180%);
          -webkit-backdrop-filter: blur(18px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            0 8px 32px 0 rgba(0, 0, 0, 0.4),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.07);
          position: relative;
        }

        .glass-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.14),
            transparent 40%,
            rgba(34, 211, 238, 0.12)
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .gradient-text {
          background: linear-gradient(135deg, #22D3EE 0%, #A78BFA 50%, #F472B6 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }

        .mesh-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
        }
      `}</style>

      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="mesh-blob bg-[#22D3EE]/15 w-[420px] h-[420px] -top-24 -left-20" />
        <div className="mesh-blob bg-[#A78BFA]/15 w-[420px] h-[420px] bottom-0 right-0" />
        <div className="mesh-blob bg-[#F472B6]/10 w-[300px] h-[300px] top-1/3 left-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-xl w-full relative z-10">
        <div className="glass-card rounded-3xl p-8 sm:p-10 md:p-12 text-center animate-glow">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#22D3EE]/20 to-[#A78BFA]/20 border border-[#22D3EE]/30 flex items-center justify-center">
              <AlertTriangle size={28} className="text-[#22D3EE]" />
            </div>
          </div>

          <p className="text-sm uppercase tracking-[0.25em] text-[#9CA0B5] mb-3">
            Error
          </p>

          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold font-montserrat gradient-text mb-4">
            404
          </h1>

          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-[#F4F4F4]">
            Page Not Found
          </h2>

          <p className="text-[#9CA0B5] text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
            The page you are looking for does not exist, may have been moved,
            or the URL might be incorrect.
          </p>

          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#A78BFA] text-[#0A0A0F] font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#22D3EE]/30"
          >
            <ArrowLeft size={18} />
            Return Home
          </a>

          <p className="mt-6 text-xs text-[#6B7280] break-all">
            Requested path: <span className="text-[#C7C9D9]">{location.pathname}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;