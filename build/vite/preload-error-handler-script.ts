function setUrlParam(paramName: string, paramValue?: string | null, url = window.location.href): string {
  const urlObj = new URL(url, window.location.origin)
  const isHashRouter = urlObj.hash.startsWith('#/')

  if (isHashRouter) {
    const [baseHash, queryString] = urlObj.hash.split('?', 2)
    const params = new URLSearchParams(queryString)
    updateParams(params, paramName, paramValue)
    urlObj.hash = params.toString() ? `${baseHash}?${params}` : baseHash
  }
  else {
    const params = new URLSearchParams(urlObj.search)
    updateParams(params, paramName, paramValue)
    urlObj.search = params.toString()
  }

  return urlObj.toString()
}

function updateParams(params: URLSearchParams, paramName: string, paramValue?: string | null): void {
  paramValue === null || paramValue === undefined ? params.delete(paramName) : params.set(paramName, paramValue)
}

function handlePreloadError(): void {
  const newUrl = setUrlParam('_ts', Date.now().toString())
  history.replaceState(null, '', newUrl)
  window.location.reload()
}

window.addEventListener('vite:preloadError', handlePreloadError)
