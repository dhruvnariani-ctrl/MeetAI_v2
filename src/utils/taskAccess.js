
import {
  emailMatches,
  getUserEmailCandidates,
  getUserNameCandidates,
  nameMatches,
} from './userMatching'

/**
 * A task belongs to the current user only
 * when the task owner or assignee matches the user.
 */
export function isUserTask(task, currentUser) {
  if (!task || !currentUser) {
    return false
  }

  const userNames = getUserNameCandidates(currentUser)
  const userEmails = getUserEmailCandidates(currentUser)

  const ownerCandidates = [
    task.owner,
    task.ownerName,
    task.assignee,
    task.assigneeName,
    task.assignedTo,
    task.assignedToName,
  ]

  for (const owner of ownerCandidates) {
    if (typeof owner === 'object' && owner !== null) {
      if (
        emailMatches(owner.email, userEmails) ||
        nameMatches(owner.name, userNames)
      ) {
        return true
      }
    } else if (
      emailMatches(owner, userEmails) ||
      nameMatches(owner, userNames)
    ) {
      return true
    }
  }

  const ownerEmailCandidates = [
    task.ownerEmail,
    task.assigneeEmail,
    task.assignedToEmail,
  ]

  return ownerEmailCandidates.some((email) =>
    emailMatches(email, userEmails),
  )
}

/**
 * Filters tasks so only tasks owned by
 * the current user remain.
 */
export function filterUserTasks(tasks = [], currentUser) {
  return tasks.filter((task) =>
    isUserTask(task, currentUser),
  )
}
