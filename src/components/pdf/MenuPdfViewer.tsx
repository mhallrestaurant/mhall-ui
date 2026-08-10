import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import ErrorState from './ErrorState'
import LoadingState from './LoadingState'
import PdfToolbar from './PdfToolbar'

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

const PDF_URL = '/MOOR HALL RESTAURANT MENU_.pdf'
const MIN_SCALE = 0.5
const MAX_SCALE = 3
const DEFAULT_SCALE = 1
const FIT_WIDTH_PADDING = 56

const MenuPdfViewer = React.memo(function MenuPdfViewer() {
  const viewerRef = useRef<HTMLDivElement | null>(null)
  const pageRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(DEFAULT_SCALE)
  const [rotation, setRotation] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fitWidthMode, setFitWidthMode] = useState(false)

  useEffect(() => {
    const element = viewerRef.current
    if (!element) return

    const resizeObserver = new ResizeObserver(entries => {
      const nextWidth = entries[0]?.contentRect.width ?? 0
      setContainerWidth(nextWidth)
    })

    resizeObserver.observe(element)
    return () => resizeObserver.disconnect()
  }, [])

  const fitWidthScale = useMemo(() => {
    if (!containerWidth) return DEFAULT_SCALE
    const idealWidth = Math.max(280, containerWidth - FIT_WIDTH_PADDING)
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, idealWidth / 760))
  }, [containerWidth])

  useEffect(() => {
    if (fitWidthMode && containerWidth) {
      setScale(fitWidthScale)
    }
  }, [containerWidth, fitWidthMode, fitWidthScale])

  const handleZoomIn = useCallback(() => {
    setFitWidthMode(false)
    setScale(prev => Math.min(MAX_SCALE, Number((prev + 0.1).toFixed(2))))
  }, [])

  const handleZoomOut = useCallback(() => {
    setFitWidthMode(false)
    setScale(prev => Math.max(MIN_SCALE, Number((prev - 0.1).toFixed(2))))
  }, [])

  const handleResetZoom = useCallback(() => {
    setFitWidthMode(false)
    setScale(DEFAULT_SCALE)
  }, [])

  const handleFitWidth = useCallback(() => {
    setFitWidthMode(true)
    setScale(fitWidthScale)
  }, [fitWidthScale])

  const handleRotateLeft = useCallback(() => {
    setRotation(prev => (prev - 90 + 360) % 360)
  }, [])

  const handleRotateRight = useCallback(() => {
    setRotation(prev => (prev + 90) % 360)
  }, [])

  const scrollToPage = useCallback((page: number) => {
    const target = pageRefs.current[page]
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const handlePreviousPage = useCallback(() => {
    setPageNumber(prev => {
      const next = Math.max(1, prev - 1)
      scrollToPage(next)
      return next
    })
  }, [scrollToPage])

  const handleNextPage = useCallback(() => {
    setPageNumber(prev => {
      const next = Math.min(numPages || 1, prev + 1)
      scrollToPage(next)
      return next
    })
  }, [numPages, scrollToPage])

  const handleDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setPageNumber(1)
    setError(null)
  }, [])

  const handleDocumentLoadError = useCallback(() => {
    setError('Unable to load the PDF document.')
  }, [])

  const handleRetry = useCallback(() => {
    setError(null)
    setPageNumber(1)
    setScale(DEFAULT_SCALE)
    setRotation(0)
    setFitWidthMode(false)
  }, [])

  const handleDownload = useCallback(() => {
    const link = document.createElement('a')
    link.href = PDF_URL
    link.download = 'Moor Hall Restaurant Menu.pdf'
    link.click()
  }, [])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const handleFullscreen = useCallback(async () => {
    if (!viewerRef.current) return

    if (!document.fullscreenElement) {
      await viewerRef.current.requestFullscreen()
      setIsFullscreen(true)
      return
    }

    await document.exitFullscreen()
    setIsFullscreen(false)
  }, [])

  const pageList = useMemo(() => Array.from({ length: numPages }, (_, index) => index + 1), [numPages])

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(226,232,240,0.8),_rgba(241,245,249,1))] px-3 py-6 sm:px-6 lg:px-8" aria-label="Restaurant menu PDF viewer">
      <div className="mx-auto flex max-w-7xl flex-col rounded-[2.5rem] border border-slate-200 bg-white/95 p-4 shadow-[0_35px_120px_rgba(15,23,42,0.18)] sm:p-6 lg:p-8" ref={viewerRef}>
        <header className="mb-6 flex flex-col gap-4 rounded-[2rem] bg-[#BB0503] px-6 py-8 text-white shadow-[0_20px_50px_rgba(187,5,3,0.25)] lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Premium Dining Experience</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Moor Hall Restaurant Menu</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">Browse our complete menu with a polished digital reading experience designed for modern hospitality.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/menu" className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
              Back to Order Menu
            </a>
          </div>
        </header>

        <PdfToolbar
          pageNumber={pageNumber}
          totalPages={numPages || 1}
          scale={scale}
          rotation={rotation}
          isFullscreen={isFullscreen}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
          onZoomOut={handleZoomOut}
          onZoomIn={handleZoomIn}
          onResetZoom={handleResetZoom}
          onFitWidth={handleFitWidth}
          onRotateLeft={handleRotateLeft}
          onRotateRight={handleRotateRight}
          onFullscreen={handleFullscreen}
          onDownload={handleDownload}
          onPrint={handlePrint}
        />

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50/80 p-3 sm:p-4 lg:p-6">
          <Document
            file={PDF_URL}
            onLoadSuccess={handleDocumentLoadSuccess}
            onLoadError={handleDocumentLoadError}
            loading={<LoadingState />}
            error={<ErrorState onRetry={handleRetry} />}
            className="w-full"
          >
            {error ? (
              <ErrorState onRetry={handleRetry} />
            ) : (
              <div className="space-y-6">
                {pageList.map(page => (
                  <div
                    key={page}
                    ref={element => {
                      pageRefs.current[page] = element
                    }}
                    className={`rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-4 ${pageNumber === page ? 'ring-2 ring-amber-400' : ''}`}
                  >
                    <Page
                      pageNumber={page}
                      scale={scale}
                      rotate={rotation}
                      renderTextLayer
                      renderAnnotationLayer
                      className="mx-auto"
                      loading={<LoadingState />}
                      error={<ErrorState onRetry={handleRetry} />}
                    />
                  </div>
                ))}
              </div>
            )}
          </Document>
        </div>
      </div>
    </section>
  )
})

export default MenuPdfViewer
