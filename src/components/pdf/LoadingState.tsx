import React from 'react'

const LoadingState = React.memo(function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2rem] border border-slate-200 bg-slate-50/80 px-8 py-14 shadow-inner" role="status" aria-live="polite">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-slate-200 border-t-amber-500" aria-hidden="true" />
      <div className="mt-6 h-3 w-40 rounded-full bg-slate-200" />
      <div className="mt-3 h-3 w-28 rounded-full bg-slate-200" />
      <div className="mt-6 grid w-full max-w-md gap-3 sm:grid-cols-2">
        <div className="h-44 animate-pulse rounded-[1.25rem] bg-slate-200" />
        <div className="h-44 animate-pulse rounded-[1.25rem] bg-slate-200" />
      </div>
    </div>
  )
})

export default LoadingState
