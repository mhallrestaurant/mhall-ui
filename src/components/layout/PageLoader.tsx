const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="flex flex-col items-center gap-3" aria-busy="true" aria-live="polite">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-4 border-white/15" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-500 animate-spin" />
        </div>
        <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Loading...</p>
      </div>
    </div>
  )
}

export default PageLoader
