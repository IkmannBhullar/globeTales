export default function Loading() {
  return (
    <div className="section-shell flex min-h-[70vh] items-center justify-center py-24">
      <div className="glass-panel flex w-full max-w-xl flex-col gap-4 rounded-[2rem] p-8">
        <div className="h-4 w-28 animate-pulse rounded-full bg-slate-300/50" />
        <div className="h-10 w-2/3 animate-pulse rounded-full bg-slate-300/40" />
        <div className="h-4 w-full animate-pulse rounded-full bg-slate-300/30" />
        <div className="h-40 animate-pulse rounded-[1.75rem] bg-slate-300/20" />
      </div>
    </div>
  );
}
