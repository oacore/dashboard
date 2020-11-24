function handleResizeEvent(entries, elementId) {
  // https://stackoverflow.com/a/58701523/5594539
  window.requestAnimationFrame(() => {
    if (!Array.isArray(entries) || !entries.length) return

    const iframe = window.parent.document.getElementById(elementId)
    iframe.style.height = `${window.document.body.offsetHeight}px`
  })
}

// https://stackoverflow.com/a/326076/5594539
function isInIframe() {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}

const url = new URL(window.location)
if (
  isInIframe() &&
  typeof window.ResizeObserver !== 'undefined' &&
  url.searchParams.has('elementId')
) {
  new ResizeObserver((entries) =>
    handleResizeEvent(entries, url.searchParams.get('elementId'))
  ).observe(document.body)
}
