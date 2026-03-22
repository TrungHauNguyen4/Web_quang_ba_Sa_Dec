export function PageLoader() {
  return (
    <div className="min-h-[40vh] w-full px-4 py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 rounded-[2rem] border border-emerald-100 bg-white/80 p-8 shadow-[0_24px_80px_-32px_rgba(5,150,105,0.35)] backdrop-blur md:p-10">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 animate-pulse rounded-2xl bg-gradient-to-br from-emerald-500 to-orange-400" />
          <div className="space-y-2">
            <div className="h-3 w-28 rounded-full bg-stone-200" />
            <div className="h-4 w-40 rounded-full bg-stone-300" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4 rounded-[1.75rem] bg-stone-50 p-5">
            <div className="h-4 w-24 rounded-full bg-stone-200" />
            <div className="h-10 w-3/4 rounded-2xl bg-stone-200" />
            <div className="h-4 w-full rounded-full bg-stone-200" />
            <div className="h-4 w-5/6 rounded-full bg-stone-200" />
            <div className="flex gap-3 pt-2">
              <div className="h-11 w-32 rounded-full bg-emerald-200" />
              <div className="h-11 w-28 rounded-full bg-stone-200" />
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-gradient-to-br from-emerald-900 via-emerald-700 to-orange-500/80 p-5">
            <div className="h-full min-h-56 rounded-[1.3rem] border border-white/20 bg-white/15" />
          </div>
        </div>
      </div>
    </div>
  );
}