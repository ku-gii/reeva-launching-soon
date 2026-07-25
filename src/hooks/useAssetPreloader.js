import { useEffect, useState } from 'react'

export function useAssetPreloader(urls) {
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    let loaded = 0

    const preload = async (url) => {
      const image = new Image()
      image.src = url

      await new Promise((resolve, reject) => {
        image.onload = resolve
        image.onerror = reject
      })

      if (image.decode) {
        try {
          await image.decode()
        } catch {
          // The image is already loaded; decoding failure is non-fatal.
        }
      }

      loaded += 1
      if (!cancelled) {
        setProgress(Math.round((loaded / urls.length) * 100))
      }
    }

    Promise.all(urls.map(preload))
      .then(() => {
        if (!cancelled) setReady(true)
      })
      .catch(() => {
        if (!cancelled) setReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [urls])

  return { ready, progress }
}
