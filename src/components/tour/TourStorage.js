
import { readJSON, writeJSON } from '../../utils/storage'

export const TOUR_STORAGE_KEY = 'meetai-active-tour'

const toSafeSteps = (steps) =>
  steps.map((step) => ({
    ...step,
    icon:
      typeof step.icon === 'string'
        ? step.icon
        : 'Lightbulb',
  }))

function getSessionStorage() {
  try {
    return typeof window !== 'undefined'
      ? window.sessionStorage
      : null
  } catch {
    return null
  }
}

export function startAppTour(steps) {
  const safeSteps = Array.isArray(steps)
    ? toSafeSteps(steps)
    : []

  if (!safeSteps.length) return

  const saved = writeJSON(
    TOUR_STORAGE_KEY,
    {
      steps: safeSteps,
      index: 0,
      phase: 'intro',
    },
    getSessionStorage(),
  )

  if (!saved) return

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('meetai-tour-start'))
  }
}

export function stopAppTour() {
  try {
    getSessionStorage()?.removeItem(TOUR_STORAGE_KEY)
  } catch {
    // Ignore storage errors.
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('meetai-tour-stop'))
  }
}

export function readTour() {
  const parsed = readJSON(
    TOUR_STORAGE_KEY,
    null,
    getSessionStorage(),
  )

  if (
    !parsed ||
    !Array.isArray(parsed.steps) ||
    !parsed.steps.length
  ) {
    return null
  }

  const steps = toSafeSteps(parsed.steps)

  const index = Number.isInteger(parsed.index)
    ? parsed.index
    : 0

  return {
    steps,
    index: Math.min(
      Math.max(index, 0),
      steps.length - 1,
    ),
    phase: parsed.phase === 'intro'
      ? 'intro'
      : 'tour',
  }
}

export function saveTour(tour) {
  return writeJSON(
    TOUR_STORAGE_KEY,
    tour,
    getSessionStorage(),
  )
}
