import React from 'react'

interface ErrorStateProps {
  onRetry: () => void
}

const ErrorState = React.memo(function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2rem] border border-rose-200 bg-rose-50 px-8 py-14 text-center shadow-sm" role="alert">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-sm">⚠️</div>
      <h3 className="mt-6 text-xl font-semibold text-[#192333]">Unable to load restaurant menu.</h3>
      <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
        The menu file could not be opened right now. Please try again in a moment.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex items-center rounded-full bg-[#BB0503] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#8f0403]"
      >
        Retry
      </button>
    </div>
  )
})

export default ErrorState
