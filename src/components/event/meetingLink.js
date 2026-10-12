const MEETING_HOSTS =
  /(^|\.)(zoom\.us|zoom\.com|zoomgov\.com|meet\.google\.com|teams\.microsoft\.com|teams\.live\.com)$/i

/* Returns a clean https link for Zoom / Google Meet / Teams, or null. */
export function normalizeMeetingLink(value) {
  const raw = value.trim()

  if (!raw) return null

  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`)

    return MEETING_HOSTS.test(url.hostname) ? url.href : null
  } catch {
    return null
  }
}