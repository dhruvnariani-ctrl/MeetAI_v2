import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import Box from '@mui/material/Box'

import DashboardHeader from '../components/dashboard/DashboardHeader'
import DashboardOverview from '../components/dashboard/DashboardOverview'
import ScheduleCard from '../components/dashboard/ScheduleCard'
import ActionItemsCard from '../components/dashboard/ActionItemsCard'

import {
  getAllMeetings,
  getTodaysMeetings,
} from '../data/meetings'

import {
  createMeetingSettings,
  saveMeetingSettings,
} from '../data/meetingSettings'

import useNow from '../hooks/Usenow'
import usePageTitle from '../hooks/usePageTitle'
import useCurrentUser from '../hooks/useCurrentUser'

import { filterUserMeetings } from '../utils/meetingAccess'

function asDate(value) {
  if (!value) return null

  const date = value instanceof Date ? value : new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

function isDueToday(value, now) {
  if (!value) return false

  const raw = String(value).trim()

  const due =
    value instanceof Date
      ? value
      : /^\d{4}-\d{2}-\d{2}$/.test(raw)
        ? new Date(`${raw}T00:00:00`)
        : new Date(value)

  if (Number.isNaN(due.getTime())) return false

  return (
    due.getFullYear() === now.getFullYear() &&
    due.getMonth() === now.getMonth() &&
    due.getDate() === now.getDate()
  )
}

function normalizeStatus(status) {
  const value = String(status ?? 'Pending')
    .trim()
    .toLowerCase()

  if (value.includes('blocked')) return 'blocked'

  if (
    value.includes('process') ||
    value.includes('progress')
  ) {
    return 'in progress'
  }

  if (
    ['done', 'completed', 'complete'].includes(value)
  ) {
    return 'done'
  }

  return value
}

function isOpenActionItem(item) {
  return (
    ['pending', 'in progress'].includes(
      normalizeStatus(item.status),
    ) &&
    item.completed !== true
  )
}

function isLive(meeting, now) {
  const start = asDate(meeting?.start)
  const end = asDate(meeting?.end)

  return Boolean(start && end && start <= now && now < end)
}

function isUpcoming(meeting, now) {
  const start = asDate(meeting?.start)

  return Boolean(start && start > now)
}

function getActionItemsFromMeetings(meetings) {
  return meetings.flatMap((meeting) => {
    const actionItems = Array.isArray(meeting.actionItems)
      ? meeting.actionItems
      : []

    return actionItems.map((item, index) => ({
      id: item.id ?? `${meeting.id}-task-${index}`,
      title:
        item.title ??
        item.task ??
        item.description ??
        'Untitled task',
      meeting:
        item.meeting ??
        item.meetingTitle ??
        meeting.title,
      due: item.due ?? item.dueDate ?? null,
      owner:
        item.owner ??
        item.assignee ??
        item.assignedTo ??
        null,
      priority: item.priority ?? 'Medium',
      status: item.status ?? 'Pending',
      completed: item.completed === true,
      meetingId: meeting.id,
    }))
  })
}

function normalizeIdentity(value) {
  if (value == null) return ''

  if (typeof value === 'object') {
    return normalizeIdentity(
      value.email ??
      value.id ??
      value.userId ??
      value.name,
    )
  }

  return String(value).trim().toLowerCase()
}

function getUserIdentityValues(user) {
  if (!user) return []

  return [
    user.id,
    user.userId,
    user.email,
    user.name,
  ]
    .map(normalizeIdentity)
    .filter(Boolean)
}

function isAssignedToCurrentUser(item, currentUser) {
  const identities = getUserIdentityValues(currentUser)

  if (identities.length === 0) return false

  const rawOwners =
    item.owner ??
    item.assignee ??
    item.assignedTo ??
    item.assignedToUser ??
    null

  if (!rawOwners) return false

  const owners = Array.isArray(rawOwners)
    ? rawOwners
    : [rawOwners]

  return owners.some((owner) => {
    const identity = normalizeIdentity(owner)

    return identity !== '' && identities.includes(identity)
  })
}

export default function Dashboard() {
  usePageTitle('Dashboard')

  const { openCreate, openInstant } = useOutletContext()
  const currentUser = useCurrentUser()
  const now = useNow()

  // Today's meetings, scoped to the logged-in user.
  const meetings = useMemo(
    () =>
      filterUserMeetings(
        getTodaysMeetings(now),
        currentUser,
      ),
    [currentUser, now],
  )

  // All meetings accessible to the logged-in user.
  // Tasks can be due today even if their meeting was earlier.
  const allUserMeetings = useMemo(
    () =>
      filterUserMeetings(
        getAllMeetings(now),
        currentUser,
      ),
    [currentUser, now],
  )

  const allActionItems = useMemo(
    () => getActionItemsFromMeetings(allUserMeetings),
    [allUserMeetings],
  )

  // ALL tasks for the current user that are due today.
  // This includes Pending, In progress, Blocked, and Done.
  const todaysUserAllActionItems = useMemo(
    () =>
      allActionItems.filter(
        (item) =>
          isAssignedToCurrentUser(item, currentUser) &&
          isDueToday(item.due, now),
      ),
    [allActionItems, currentUser, now],
  )

  // OPEN tasks only, for the Pending actions card.
  // Blocked, Done, Completed, and other statuses are excluded.
  const todaysUserOpenActionItems = useMemo(
    () =>
      todaysUserAllActionItems.filter(isOpenActionItem),
    [todaysUserAllActionItems],
  )

  // Prefer a live meeting; otherwise use the nearest upcoming one.
  const featuredMeeting = useMemo(() => {
    const live = meetings.find((meeting) =>
      isLive(meeting, now),
    )

    if (live) return live

    return (
      [...meetings]
        .filter((meeting) => isUpcoming(meeting, now))
        .sort(
          (a, b) =>
            asDate(a.start).getTime() -
            asDate(b.start).getTime(),
        )[0] ?? null
    )
  }, [meetings, now])

  const [meetingSettings, setMeetingSettings] = useState(
    () => createMeetingSettings(meetings),
  )

  const updateMeetingSettings = (meetingId, changes) => {
    setMeetingSettings(
      saveMeetingSettings(meetingId, changes),
    )
  }

  const liveMeeting = useMemo(
    () =>
      meetings.find((meeting) => isLive(meeting, now)) ??
      null,
    [meetings, now],
  )

  const participantCount = useMemo(() => {
    const people = new Set()

    meetings.forEach((meeting) => {
      ;(meeting.participants ?? []).forEach((person) => {
        const key = person.email ?? person.id ?? person.name

        if (key) people.add(key)
      })
    })

    return people.size
  }, [meetings])

  const firstName =
    currentUser?.name?.split(' ')[0] ?? 'there'

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        pb: 2,
      }}
    >
      <DashboardHeader
        now={now}
        firstName={firstName}
        onCreate={openCreate}
        onInstant={openInstant}
      />

      <DashboardOverview
        values={{
          meetings: meetings.length,
          people: participantCount,
          live: liveMeeting ? 1 : 0,

          // All statuses, for this user, due today.
          actions: todaysUserAllActionItems.length,
        }}
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            lg: 'minmax(0, 1.65fr) minmax(300px, .85fr)',
          },
          alignItems: 'start',
          gap: { xs: 2, lg: 2.5 },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <ScheduleCard
            meetings={meetings}
            now={now}
            nextId={featuredMeeting?.id}
            settings={meetingSettings}
            onSettingsChange={updateMeetingSettings}
            onJoin={openInstant}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            minWidth: 0,
            alignContent: 'start',
          }}
        >
          <ActionItemsCard
            items={todaysUserOpenActionItems}
            limit={3}
          />
        </Box>
      </Box>
    </Box>
  )
}