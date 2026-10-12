
export function readJSON(key, fallback, storage) {
  try {
    const target =
      storage ??
      (typeof window !== 'undefined' ? window.localStorage : null)

    if (!target) return fallback

    const raw = target.getItem(key)

    if (raw === null) return fallback

    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJSON(key, value, storage) {
  try {
    const target =
      storage ??
      (typeof window !== 'undefined' ? window.localStorage : null)

    if (!target) return false

    target.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
