
import { readJSON, writeJSON } from '../utils/storage'

const STORAGE_KEY = 'meetai-meeting-settings'

function readStoredSettings() {
  const parsed = readJSON(STORAGE_KEY, {})

  if (
    !parsed ||
    typeof parsed !== 'object' ||
    Array.isArray(parsed)
  ) {
    return {}
  }

  return parsed
}

function writeStoredSettings(settings) {
  writeJSON(STORAGE_KEY, settings)
}

export function createMeetingSettings(meetings = []) {
  const stored = readStoredSettings()

  return meetings.reduce((result, meeting) => {
    if (!meeting?.id) return result

    const saved = stored[meeting.id]

    const autoJoin =
      saved?.autoJoin ??
      meeting?.meetAI?.invited ??
      false

    const recordVideo =
      autoJoin === true
        ? (
            saved?.recordVideo ??
            meeting?.meetAI?.recordVideo ??
            false
          )
        : false

    result[meeting.id] = {
      autoJoin: autoJoin === true,
      recordVideo: recordVideo === true,
    }

    return result
  }, {})
}

export function getMeetingSettings() {
  return readStoredSettings()
}

export function saveMeetingSettings(meetingId, changes = {}) {
  if (!meetingId) return readStoredSettings()

  const current = readStoredSettings()
  const existing = current[meetingId] ?? {}

  const nextAutoJoin =
    changes?.autoJoin ??
    existing?.autoJoin ??
    false

  const nextRecordVideo =
    nextAutoJoin === true
      ? (
          changes?.recordVideo ??
          existing?.recordVideo ??
          false
        )
      : false

  const nextSettings = {
    ...current,
    [meetingId]: {
      ...existing,
      ...changes,
      autoJoin: nextAutoJoin === true,
      recordVideo: nextRecordVideo === true,
    },
  }

  writeStoredSettings(nextSettings)

  return nextSettings
}

export function saveMeetingSettingsBulk(
  meetings = [],
  checked,
) {
  const current = readStoredSettings()
  const next = { ...current }

  meetings.forEach((meeting) => {
    if (!meeting?.id) return

    const existing = next[meeting.id] ?? {}

    next[meeting.id] = {
      ...existing,
      autoJoin: checked === true,
      ...(checked === true ? {} : { recordVideo: false }),
    }
  })

  writeStoredSettings(next)

  return next
}

export function clearMeetingSettings(meetingId) {
  if (!meetingId) return readStoredSettings()

  const current = readStoredSettings()
  const next = { ...current }

  delete next[meetingId]

  writeStoredSettings(next)

  return next
}

export function clearAllMeetingSettings() {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // Ignore storage failures.
  }
}
