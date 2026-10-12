
import {
  emailMatches,
  getUserEmailCandidates,
  getUserNameCandidates,
  nameMatches,
} from './userMatching'

/**
 * Returns true when the current user owns the meeting
 * or is one of its participants.
 */
export function isUserMeeting(meeting, currentUser) {
  if (!meeting || !currentUser) {
    return false
  }

  const userNames = getUserNameCandidates(currentUser)
  const userEmails = getUserEmailCandidates(currentUser)

  const matchesUser = (candidate) => {
    if (!candidate) {
      return false
    }

    if (typeof candidate === 'string') {
      return (
        emailMatches(candidate, userEmails) ||
        nameMatches(candidate, userNames)
      )
    }

    if (typeof candidate !== 'object') {
      return false
    }

    return (
      emailMatches(candidate.email, userEmails) ||
      nameMatches(candidate.name, userNames)
    )
  }

  const ownerCandidates = [
    meeting.owner,
    meeting.ownerName,
    meeting.organizer,
    meeting.organizerName,
    meeting.host,
    meeting.hostName,
    meeting.ownerEmail,
    meeting.organizerEmail,
    meeting.hostEmail,
  ]

  const participants = Array.isArray(meeting.participants)
    ? meeting.participants
    : []

  const candidates = [...ownerCandidates, ...participants]

  return candidates.some(matchesUser)
}

/**
 * Filters meetings to those belonging to the current user.
 */
export function filterUserMeetings(meetings = [], currentUser) {
  return meetings.filter((meeting) =>
    isUserMeeting(meeting, currentUser),
  )
}
