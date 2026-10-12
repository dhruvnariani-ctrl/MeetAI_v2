
export const STATUS_STYLES = {
  Live: {
    backgroundColor: '#E3F3E7',
    color: '#216B3B',
  },
  Upcoming: {
    backgroundColor: '#EAF3FF',
    color: '#1769AA',
  },
  'Up next': {
    backgroundColor: '#EAF3FF',
    color: '#1769AA',
  },
  Done: {
    backgroundColor: '#E7F6EE',
    color: '#237A4B',
  },
  'In progress': {
    backgroundColor: '#FDF3DF',
    color: '#946200',
  },
}

/**
 * Shared visual themes for meeting grid and list cards.
 */
const MEETING_CARD_THEMES = {
  live: {
    accent: '#2E9B5A',
    border: '#CFE7D6',
    borderHover: '#9FD0B0',
    bg: '#F6FBF8',
    bgHover: '#F1F9F4',
    shadow: '0 4px 14px rgba(35, 125, 82, 0.10)',
  },
  upcoming: {
    accent: '#2F7CC4',
    border: '#E2EAF1',
    borderHover: '#B8D0E4',
    bg: '#FFFFFF',
    bgHover: '#FAFCFE',
    shadow: '0 4px 14px rgba(18, 58, 89, 0.07)',
  },
  done: {
    accent: '#B7C3CF',
    border: '#E8EDF2',
    borderHover: '#D0D9E2',
    bg: '#FAFBFC',
    bgHover: '#F7F9FB',
    shadow: '0 3px 10px rgba(18, 58, 89, 0.04)',
  },
}

/**
 * Safely convert a value to a valid Date.
 * Returns null when the value is missing or invalid.
 */
export function asDate(value) {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const date = value instanceof Date ? value : new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

/**
 * Shared status source for meeting cards, calendar filters,
 * and calendar date utilities.
 *
 * An explicit meeting status takes priority. Otherwise status is
 * calculated from the meeting's start and end times.
 *
 * Possible results:
 * Live | Upcoming | Up next | Done | In progress
 */
export function getMeetingStatus(meeting, now = new Date(), nextId) {
  if (!meeting) {
    return 'Upcoming'
  }

  const explicitStatus = String(meeting.status ?? '')
    .trim()
    .toLowerCase()

  if (
    explicitStatus === 'done' ||
    explicitStatus === 'completed' ||
    explicitStatus === 'finished'
  ) {
    return 'Done'
  }

  if (explicitStatus.includes('progress')) {
    return 'In progress'
  }

  if (explicitStatus === 'live') {
    return 'Live'
  }

  if (
    explicitStatus === 'upcoming' ||
    explicitStatus === 'next' ||
    explicitStatus === 'up next'
  ) {
    return 'Upcoming'
  }

  const start = asDate(meeting.start)
  const end = asDate(meeting.end)
  const currentTime = asDate(now)

  // Missing or invalid dates should not be mistaken for completed meetings.
  if (!start || !end || !currentTime) {
    return 'Upcoming'
  }

  if (currentTime >= start && currentTime < end) {
    return 'Live'
  }

  if (start > currentTime) {
    if (nextId !== null && nextId !== undefined && meeting.id === nextId) {
      return 'Up next'
    }

    return 'Upcoming'
  }

  return 'Done'
}

/**
 * Resolve the shared visual theme for a meeting status.
 */
export function getMeetingCardTheme(status) {
  const value = String(status ?? '').toLowerCase()

  if (value === 'live' || value.includes('progress')) {
    return MEETING_CARD_THEMES.live
  }

  if (value === 'done' || value === 'completed' || value === 'finished') {
    return MEETING_CARD_THEMES.done
  }

  return MEETING_CARD_THEMES.upcoming
}

/**
 * Check whether the meeting status represents a completed meeting.
 */
export function isDoneMeetingStatus(status) {
  const value = String(status ?? '').trim().toLowerCase()

  return (
    value === 'done' ||
    value === 'completed' ||
    value === 'finished'
  )
}

/**
 * Check whether an object owns a particular property.
 */
export function hasOwnProperty(object, key) {
  return (
    object !== null &&
    object !== undefined &&
    Object.prototype.hasOwnProperty.call(object, key)
  )
}

/**
 * Identify a settings object belonging to a meeting.
 * Supports both complete settings maps and individual settings.
 */
export function hasSettingsKeys(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    (hasOwnProperty(value, 'autoJoin') ||
      hasOwnProperty(value, 'recordVideo'))
  )
}

/**
 * Stop an interaction from bubbling to the meeting card.
 */
export function stopEventPropagation(event) {
  event.stopPropagation()
}

/**
 * Create the shared meeting-details navigation handler.
 */
export function createOpenMeetingHandler(navigate, meeting) {
  return () => {
    if (meeting?.id !== undefined && meeting?.id !== null) {
      navigate(`/meetings/${meeting.id}`)
    }
  }
}

/**
 * Shared keyboard support for clickable meeting cards.
 */
export function handleMeetingCardKeyDown(event, openMeeting) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    openMeeting()
  }
}

/**
 * Video recording is enabled only when Auto Join is enabled.
 */
export function isRecordingEnabled(autoJoin, recordVideo) {
  return autoJoin === true && recordVideo === true
}

/**
 * Resolve saved MeetAI settings.
 *
 * Priority:
 * 1. Local user changes
 * 2. Meeting data
 * 3. false
 */
export function getMeetingToggleSettings(meeting, localSettings) {
  const autoJoin =
    localSettings?.autoJoin ??
    meeting?.meetAI?.invited ??
    false

  const recordVideo = isRecordingEnabled(
    autoJoin,
    localSettings?.recordVideo ??
      meeting?.meetAI?.recordVideo ??
      false,
  )

  return {
    autoJoin: autoJoin === true,
    recordVideo,
  }
}

/**
 * Resolve settings for a meeting card.
 * Accepts a complete settings map or one meeting's settings.
 */
export function getMeetingCardSettings(settings, meeting) {
  const settingsForMeeting = hasSettingsKeys(settings)
    ? settings
    : settings?.[meeting?.id]

  if (hasSettingsKeys(settingsForMeeting)) {
    const autoJoin = settingsForMeeting.autoJoin === true

    return {
      autoJoin,
      recordVideo: isRecordingEnabled(
        autoJoin,
        settingsForMeeting.recordVideo,
      ),
    }
  }

  return getMeetingToggleSettings(meeting, undefined)
}

/**
 * Resolve the visual style used by status chips.
 */
export function getStatusStyle(status) {
  return STATUS_STYLES[status] ?? STATUS_STYLES.Upcoming
}

/**
 * Get participant count from either an array or a number.
 */
export function getParticipantCount(participants) {
  return typeof participants === 'number'
    ? participants
    : participants?.length ?? 0
}

/**
 * Whether the meeting has participants.
 */
export function hasParticipants(participants) {
  return getParticipantCount(participants) > 0
}

/**
 * Whether MeetAI controls should be displayed.
 */
export function shouldShowMeetingToggles(status) {
  return (
    status === 'Live' ||
    status === 'Upcoming' ||
    status === 'Up next' ||
    status === 'Done'
  )
}

/**
 * Completed meetings display the controls but disable changes.
 */
export function areMeetingTogglesDisabled(status) {
  return status === 'Done'
}
