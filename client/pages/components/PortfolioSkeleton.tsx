export default function PortfolioSkeleton() {
  return (
    <div className="bg-[#0A0A0F] text-[#F4F4F4] min-h-screen overflow-x-hidden">
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.04) 0%,
            rgba(255, 255, 255, 0.08) 20%,
            rgba(34, 211, 238, 0.12) 40%,
            rgba(255, 255, 255, 0.08) 60%,
            rgba(255, 255, 255, 0.04) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.8s linear infinite;
        }

        .skeleton-card {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.04) 0%,
            rgba(255, 255, 255, 0.02) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-radius: 1rem;
          overflow: hidden;
        }

        .skeleton-pill {
          border-radius: 999px;
        }
      `}</style>

      {/* top progress line */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-[60]">
        <div className="h-full w-1/3 skeleton-shimmer" />
      </div>

      {/* nav skeleton */}
      <nav className="fixed top-0 w-full z-50 py-3">
        <div className="max-w-6xl mx-3 sm:mx-auto px-4 sm:px-6 lg:px-8">
          <div className="skeleton-card py-4 px-4 sm:px-6 flex items-center justify-between">
            <div className="h-7 w-24 skeleton-shimmer skeleton-pill" />
            <div className="hidden md:flex gap-6 items-center">
              <div className="h-4 w-14 skeleton-shimmer skeleton-pill" />
              <div className="h-4 w-14 skeleton-shimmer skeleton-pill" />
              <div className="h-4 w-20 skeleton-shimmer skeleton-pill" />
              <div className="h-4 w-16 skeleton-shimmer skeleton-pill" />
              <div className="h-4 w-16 skeleton-shimmer skeleton-pill" />
            </div>
            <div className="md:hidden h-10 w-10 rounded-xl skeleton-shimmer" />
          </div>
        </div>
      </nav>

      {/* hero skeleton */}
      <section className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="h-9 w-56 rounded-full skeleton-shimmer" />
          </div>

          <div className="max-w-3xl mx-auto space-y-4 mb-8">
            <div className="h-14 sm:h-16 md:h-20 w-3/4 mx-auto rounded-xl skeleton-shimmer" />
            <div className="h-14 sm:h-16 md:h-20 w-1/2 mx-auto rounded-xl skeleton-shimmer" />
          </div>

          <div className="h-8 w-72 mx-auto rounded-xl skeleton-shimmer mb-6" />
          <div className="max-w-2xl mx-auto space-y-3 mb-10">
            <div className="h-4 w-full rounded-xl skeleton-shimmer" />
            <div className="h-4 w-5/6 mx-auto rounded-xl skeleton-shimmer" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="h-12 w-44 rounded-xl skeleton-shimmer" />
            <div className="h-12 w-44 rounded-xl skeleton-shimmer" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="skeleton-card p-4">
                <div className="h-8 w-16 mx-auto rounded-xl skeleton-shimmer mb-2" />
                <div className="h-3 w-20 mx-auto rounded-xl skeleton-shimmer" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* about skeleton */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-10 w-56 mx-auto rounded-xl skeleton-shimmer mb-12" />
          <div className="skeleton-card p-6 sm:p-8 md:p-12 space-y-4">
            <div className="h-4 w-full rounded-xl skeleton-shimmer" />
            <div className="h-4 w-full rounded-xl skeleton-shimmer" />
            <div className="h-4 w-5/6 rounded-xl skeleton-shimmer" />
            <div className="h-4 w-full rounded-xl skeleton-shimmer" />
            <div className="h-4 w-4/5 rounded-xl skeleton-shimmer" />
          </div>
        </div>
      </section>

      {/* skills skeleton */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="h-10 w-64 mx-auto rounded-xl skeleton-shimmer mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="skeleton-card p-6 sm:p-8 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl skeleton-shimmer" />
                  <div className="h-5 w-36 rounded-xl skeleton-shimmer" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 6 }).map((__, tagIdx) => (
                    <div
                      key={tagIdx}
                      className="h-8 w-20 rounded-full skeleton-shimmer"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* projects skeleton */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="h-10 w-64 mx-auto rounded-xl skeleton-shimmer mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className={`skeleton-card p-6 sm:p-8 space-y-5 ${
                  idx === 0 || idx === 3 ? "md:col-span-2" : "md:col-span-1"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="h-4 w-10 rounded-xl skeleton-shimmer" />
                  <div className="h-8 w-8 rounded-lg skeleton-shimmer" />
                </div>
                <div className="h-7 w-2/3 rounded-xl skeleton-shimmer" />
                <div className="h-4 w-1/2 rounded-xl skeleton-shimmer" />
                <div className="space-y-3">
                  <div className="h-4 w-full rounded-xl skeleton-shimmer" />
                  <div className="h-4 w-5/6 rounded-xl skeleton-shimmer" />
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {Array.from({ length: 5 }).map((__, tagIdx) => (
                    <div
                      key={tagIdx}
                      className="h-7 w-16 rounded-full skeleton-shimmer"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* contact skeleton */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="h-10 w-48 mx-auto rounded-xl skeleton-shimmer mb-6" />
          <div className="h-4 w-56 mx-auto rounded-xl skeleton-shimmer mb-12" />
          <div className="skeleton-card p-6 sm:p-8 md:p-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="skeleton-card p-6 space-y-4">
                  <div className="h-14 w-14 mx-auto rounded-2xl skeleton-shimmer" />
                  <div className="h-4 w-16 mx-auto rounded-xl skeleton-shimmer" />
                  <div className="h-4 w-36 mx-auto rounded-xl skeleton-shimmer" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}