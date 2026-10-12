/* Small helpers used by the redesigned Meeting Details screen. */

const firstArray = (object, keys) =>
  keys.map((key) => object?.[key]).find(Array.isArray)

/** Meeting link, whichever field your data uses. */
export function getMeetingLink(meeting) {
  return (
    meeting?.link ??
    meeting?.meetingLink ??
    meeting?.joinUrl ??
    meeting?.joinLink ??
    meeting?.url ??
    meeting?.meetingUrl ??
    ''
  )
}

/** True once the meeting is over (not upcoming and not live). */
export function isMeetingEnded(meetingState) {
  const type = String(meetingState?.type ?? '').toLowerCase()

  const live =
    type === 'live' || type.includes('progress') || type === 'ongoing'

  return type !== 'upcoming' && !live
}

/** Label and colors for the status chip in the header. */
export function getStatusChip(meetingState) {
  const type = String(meetingState?.type ?? '').toLowerCase()

  if (type === 'live' || type.includes('progress') || type === 'ongoing') {
    return { label: 'Live', color: '#BF4148', bgcolor: '#FFF0EF' }
  }

  if (type === 'upcoming') {
    return { label: 'Upcoming', color: '#245F94', bgcolor: '#E5EFFB' }
  }

  return { label: 'Done', color: '#216B3B', bgcolor: '#E3F3E7' }
}

/** Accepts a string or an object and returns { name, role, avatar }. */
export function toPerson(value) {
  if (typeof value === 'string') {
    return { name: value, role: '', avatar: '' }
  }

  return {
    name: value?.name ?? value?.fullName ?? value?.email ?? 'Unknown',
    role: value?.role ?? value?.title ?? value?.jobTitle ?? '',
    avatar: value?.avatar ?? value?.photo ?? value?.image ?? value?.picture ?? '',
  }
}

/**
 * Splits people into attending / not attending.
 * Reads the result of getAttendance() when it has lists; otherwise falls
 * back to flags on each participant.
 */
export function splitAttendees(attendance, participants = []) {
  const attending = firstArray(attendance, [
    'attending',
    'attended',
    'present',
    'joined',
    'attendees',
  ])

  const notAttending = firstArray(attendance, [
    'notAttending',
    'absent',
    'missed',
    'declined',
    'notAttended',
  ])

  if (attending || notAttending) {
    return {
      attending: (attending ?? []).map(toPerson),
      notAttending: (notAttending ?? []).map(toPerson),
    }
  }

  const isAbsent = (person) =>
    person?.attended === false ||
    person?.attending === false ||
    /absent|declin|not attend|not join|missed/i.test(
      String(person?.attendance ?? person?.status ?? ''),
    )

  return {
    attending: participants.filter((person) => !isAbsent(person)).map(toPerson),
    notAttending: participants.filter(isAbsent).map(toPerson),
  }
}