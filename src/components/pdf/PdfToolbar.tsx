import React from 'react'

interface PdfToolbarProps {
  pageNumber: number
  totalPages: number
  scale: number
  rotation: number
  isFullscreen: boolean
  onPreviousPage: () => void
  onNextPage: () => void
  onZoomOut: () => void
  onZoomIn: () => void
  onResetZoom: () => void
  onFitWidth: () => void
  onRotateLeft: () => void
  onRotateRight: () => void
  onFullscreen: () => void
  onDownload: () => void
  onPrint: () => void
}

const PdfToolbar = React.memo(function PdfToolbar({
  pageNumber,
  totalPages,
  scale,
  rotation,
  isFullscreen,
  onPreviousPage,
  onNextPage,
  onZoomOut,
  onZoomIn,
  onResetZoom,
  onFitWidth,
  onRotateLeft,
  onRotateRight,
  onFullscreen,
  onDownload,
  onPrint,
}: PdfToolbarProps) {
  const zoomPercent = Math.round(scale * 100)

  return (
    <div className="sticky top-4 z-20 mb-6 rounded-[1.5rem] border border-slate-200 bg-white/90 px-3 py-3 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={onPreviousPage} aria-label="Previous page" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            Previous Page
          </button>
          <button type="button" onClick={onNextPage} aria-label="Next page" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            Next Page
          </button>
          <button type="button" onClick={onZoomOut} aria-label="Zoom out" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            Zoom Out
          </button>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700" aria-label="Current zoom level">
            {zoomPercent}%
          </div>
          <button type="button" onClick={onZoomIn} aria-label="Zoom in" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            Zoom In
          </button>
          <button type="button" onClick={onResetZoom} aria-label="Reset zoom" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            Reset Zoom
          </button>
          <button type="button" onClick={onFitWidth} aria-label="Fit width" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            Fit Width
          </button>
          <button type="button" onClick={onRotateLeft} aria-label="Rotate left" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            Rotate Left
          </button>
          <button type="button" onClick={onRotateRight} aria-label="Rotate right" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            Rotate Right
          </button>
          <button type="button" onClick={onFullscreen} aria-label="Toggle fullscreen" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-full bg-[#BB0503] px-3 py-2 text-sm font-semibold text-white">
            Page {pageNumber} / {totalPages}
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
            Rotation {rotation}°
          </div>
          <button type="button" onClick={onDownload} aria-label="Download PDF" className="rounded-full bg-amber-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-amber-600">
            Download
          </button>
          <button type="button" onClick={onPrint} aria-label="Print PDF" className="rounded-full bg-[#BB0503] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#8f0403]">
            Print
          </button>
        </div>
      </div>
    </div>
  )
})

export default PdfToolbar
