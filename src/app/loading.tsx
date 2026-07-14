export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo mark */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 grad-brand rounded-2xl opacity-20 animate-ping" />
          <div className="relative w-12 h-12 grad-brand rounded-2xl flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path d="M7 10h2V8a1 1 0 012 0v2h2a1 1 0 010 2h-2v2a1 1 0 01-2 0v-2H7a1 1 0 010-2z" fill="white"/>
            </svg>
          </div>
        </div>
        {/* Skeleton shimmer bars */}
        <div className="space-y-2 w-48">
          <div className="skeleton h-2.5 w-full rounded-full" />
          <div className="skeleton h-2.5 w-3/4 rounded-full" />
        </div>
      </div>
    </div>
  );
}
