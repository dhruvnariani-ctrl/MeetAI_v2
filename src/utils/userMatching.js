
/**
 * Normalize names and email addresses for consistent matching.
 */
export function normalize(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

/**
 * Build normalized, unique name candidates for a user.
 */
export function getUserNameCandidates(user) {
  const names = [
    user?.name,
    user?.displayName,
    user?.fullName,
  ]
    .filter(Boolean)
    .map(normalize)

  return [...new Set(names)]
}

/**
 * Build normalized, unique email candidates for a user.
 */
export function getUserEmailCandidates(user) {
  const emails = [
    user?.email,
    user?.mail,
    user?.userEmail,
  ]
    .filter(Boolean)
    .map(normalize)

  return [...new Set(emails)]
}

/**
 * Match full names and names with additional name components.
 */
export function nameMatches(candidate, userNames = []) {
  const normalizedCandidate = normalize(candidate)

  if (!normalizedCandidate) {
    return false
  }

  return userNames.some(
    (userName) =>
      normalizedCandidate === userName ||
      normalizedCandidate.startsWith(`${userName} `) ||
      userName.startsWith(`${normalizedCandidate} `),
  )
}

/**
 * Match an email address against the user's email candidates.
 */
export function emailMatches(candidate, userEmails = []) {
  const normalizedCandidate = normalize(candidate)

  return (
    Boolean(normalizedCandidate) &&
    userEmails.includes(normalizedCandidate)
  )
}
