import { useId, useMemo } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined'

import { getAllMeetings } from '../../data/meetings'
import { FONT } from '../../utils/dashboardFonts'

const PRIORITY_STYLES = {
  high: {
    label: 'High',
    color: '#B93B43',
    bgcolor: '#FFF0F0',
  },
  medium: {
    label: 'Medium',
    color: '#925711',
    bgcolor: '#FFF4E5',
  },
  low: {
    label: 'Low',
    color: '#187B62',
    bgcolor: '#E8F7F0',
  },
}

const chipSx = (bgcolor, color) => ({
  height: 22,
  borderRadius: '8px',
  bgcolor,
  color,
  fontSize: FONT.caption,
  fontWeight: 700,
  '& .MuiChip-label': { px: 0.85 },
})

function normalizePriority(priority) {
  const value = String(priority ?? 'Medium').toLowerCase()

  if (value.includes('high')) return 'high'
  if (value.includes('low')) return 'low'

  return 'medium'
}

function normalizeStatus(status) {
  const value = String(status ?? 'Pending')
    .trim()
    .toLowerCase()

  if (
    value === 'done' ||
    value === 'completed' ||
    value === 'complete'
  ) {
    return 'done'
  }

  if (value.includes('blocked')) return 'blocked'

  if (
    value.includes('process') ||
    value.includes('progress')
  ) {
    return 'in progress'
  }

  if (value === 'pending') return 'pending'

  // Unknown statuses are not counted as open tasks.
  return value
}

const OPEN_STATUSES = new Set(['pending', 'in progress'])

function isOpenActionItem(item) {
  const status = normalizeStatus(item.status)

  return (
    OPEN_STATUSES.has(status) &&
    item.completed !== true
  )
}

function parseDue(value) {
  if (!value) return null

  const date =
    value instanceof Date
      ? value
      : /^\d{4}-\d{2}-\d{2}$/.test(String(value))
        ? new Date(`${value}T00:00:00`)
        : new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

function formatDueDate(value) {
  if (!value) return 'No due date'

  const date = parseDue(value)

  if (!date) return String(value)

  const isCurrentYear =
    date.getFullYear() === new Date().getFullYear()

  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: isCurrentYear ? undefined : 'numeric',
  }).format(date)
}

/**
 * Checks whether a task belongs to the selected user.
 * Supports a string, array of owners, or owner objects.
 */
function isAssignedTo(item, user) {
  const normalize = (value) =>
    String(value ?? '').trim().toLowerCase()

  const target = normalize(user)

  if (!target) return true

  const owners = Array.isArray(item.owner)
    ? item.owner
    : [item.owner]

  return owners.some((owner) => {
    const name = normalize(
      typeof owner === 'object' ? owner?.name : owner,
    )

    return (
      name &&
      (
        name === target ||
        name.split(/\s+/)[0] === target ||
        name.includes(target)
      )
    )
  })
}

function getTasksFromAllMeetings() {
  const meetings = getAllMeetings() ?? []

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
        'Unassigned',
      priority: item.priority ?? 'Medium',
      status: item.status ?? 'Pending',
      completed: item.completed === true,
      meetingId: meeting.id,
    }))
  })
}

function TaskRow({ item, last }) {
  const priority =
    PRIORITY_STYLES[normalizePriority(item.priority)]

  const status = normalizeStatus(item.status)
  const dueDate = formatDueDate(item.due)

  return (
    <>
      <Box
        component="li"
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.25,
          py: 1.25,
          listStyle: 'none',
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
            borderRadius: '10px',
            bgcolor: priority.bgcolor,
            color: priority.color,
          }}
        >
          <FlagOutlinedIcon sx={{ fontSize: 18 }} />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              color: '#173C59',
              fontSize: FONT.body,
              fontWeight: 700,
              lineHeight: 1.4,
              overflowWrap: 'anywhere',
            }}
          >
            {item.title}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              columnGap: 0.75,
              rowGap: 0.5,
              mt: 0.75,
            }}
          >
            <Chip
              size="small"
              label={priority.label}
              sx={chipSx(
                priority.bgcolor,
                priority.color,
              )}
            />

            {status === 'in progress' && (
              <Chip
                size="small"
                label="In progress"
                sx={chipSx('#E8F2FC', '#245F94')}
              />
            )}

            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.45,
                ml: 'auto',
                flexShrink: 0,
                color: '#718397',
              }}
            >
              <CalendarTodayOutlinedIcon
                sx={{ fontSize: 14, flexShrink: 0 }}
              />

              <Typography
                component="span"
                sx={{
                  fontSize: FONT.caption,
                  lineHeight: 1.4,
                  whiteSpace: 'nowrap',
                }}
              >
                {dueDate === 'No due date'
                  ? dueDate
                  : `Due ${dueDate}`}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {!last && (
        <Divider sx={{ borderColor: '#EDF1F5' }} />
      )}
    </>
  )
}

export function ActionItemList({ items = [] }) {
  console.log(items)
  return (
    <Box
      component="ul"
      role="list"
      sx={{
        m: 0,
        p: 0,
        listStyle: 'none',
      }}
    >
      {items.map((item, index) => (
        <TaskRow
          key={item.id ?? `${item.title}-${index}`}
          item={item}
          last={index === items.length - 1}
        />
      ))}
    </Box>
  )
}

export default function ActionItemsCard({
  items,
  user = 'Dhruv',
  limit = null,
  maxListHeight = 380,
}) {
  const headingId = useId()
  // Fallback: collect tasks from meetings for this user.
  const userTasks = useMemo(
    () =>
      getTasksFromAllMeetings().filter((task) =>
        isAssignedTo(task, user),
      ),
    [user],
  )

  // Use supplied items when provided, including an empty array.
  // Count only Pending and In progress tasks.
  const openItems = useMemo(() => {
    const source = Array.isArray(items)
      ? items
      : userTasks

    return source.filter(isOpenActionItem)
  }, [items, userTasks])

  // Sort by priority first, then earliest due date.
  const visibleItems = useMemo(() => {
    const priorityRank = {
      high: 0,
      medium: 1,
      low: 2,
    }

    const max =
      limit == null
        ? Infinity
        : Math.max(0, limit)

    return [...openItems]
      .sort((a, b) => {
        const priorityA =
          priorityRank[normalizePriority(a.priority)]
        const priorityB =
          priorityRank[normalizePriority(b.priority)]

        if (priorityA !== priorityB) {
          return priorityA - priorityB
        }

        const dateA = parseDue(a.due)?.getTime() ?? null
        const dateB = parseDue(b.due)?.getTime() ?? null

        if (dateA == null && dateB != null) return 1
        if (dateA != null && dateB == null) return -1

        if (
          dateA != null &&
          dateB != null &&
          dateA !== dateB
        ) {
          return dateA - dateB
        }

        return 0
      })
      .slice(0, max)
  }, [openItems, limit])

  // This count excludes Done, Completed, and Blocked tasks.
  const total = openItems.length

  const footerText =
    visibleItems.length === total
      ? `${total} open ${total === 1 ? 'task' : 'tasks'}`
      : `Showing ${visibleItems.length} of ${total} open tasks`

  return (
    <Paper
      data-tour="dashboard-action-items"
      component="section"
      aria-labelledby={headingId}
      variant="outlined"
      sx={{
        minWidth: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: { xs: 1.5, sm: 2 },
        borderRadius: '16px',
        bgcolor: '#FFFFFF',
        borderColor: '#E0E9F0',
        boxShadow: 'none',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          mb: 0.75,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              flexShrink: 0,
              display: 'grid',
              placeItems: 'center',
              borderRadius: '10px',
              bgcolor: '#E8F7F0',
              color: '#187B62',
            }}
          >
            <AssignmentTurnedInOutlinedIcon
              sx={{ fontSize: 21 }}
            />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              id={headingId}
              component="h2"
              sx={{
                color: '#123A59',
                fontSize: FONT.heading,
                fontWeight: 750,
                lineHeight: 1.35,
              }}
            >
              Pending actions
            </Typography>

            <Typography
              sx={{
                mt: 0.2,
                color: '#718397',
                fontSize: FONT.caption,
                lineHeight: 1.4,
              }}
            >
              Pending and in-progress tasks
            </Typography>
          </Box>
        </Box>

        <Chip
          label={`${total} open`}
          size="small"
          sx={{
            height: 24,
            flexShrink: 0,
            ml: 'auto',
            borderRadius: '8px',
            bgcolor: '#E8F7F0',
            color: '#187B62',
            fontSize: FONT.caption,
            fontWeight: 750,
            '& .MuiChip-label': { px: 0.9 },
          }}
        />
      </Box>

      {visibleItems.length === 0 ? (
        <Box sx={{ py: 2.5, textAlign: 'center' }}>
          <CheckCircleOutlineRoundedIcon
            sx={{
              fontSize: 28,
              color: '#187B62',
              mb: 0.5,
            }}
          />

          <Typography
            sx={{
              color: '#123A59',
              fontSize: FONT.body,
              fontWeight: 700,
            }}
          >
            You&apos;re all caught up
          </Typography>

          <Typography
            sx={{
              mt: 0.35,
              color: '#718397',
              fontSize: FONT.caption,
            }}
          >
            No pending or in-progress action items.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            maxHeight: maxListHeight,
            mb: 0.5,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            pr: 0.5,
            scrollbarWidth: 'thin',
          }}
        >
          <ActionItemList items={visibleItems} />
        </Box>
      )}

      <Divider sx={{ mt: 'auto', borderColor: '#EDF1F5' }} />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          pt: 1,
        }}
      >
        <Typography
          sx={{
            minWidth: 0,
            color: '#718397',
            fontSize: FONT.caption,
            lineHeight: 1.4,
          }}
        >
          {footerText}
        </Typography>

        <Button
          component={RouterLink}
          to="/tasks"
          data-tour="dashboard-view-all-tasks"
          endIcon={
            <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
          }
          sx={{
            minHeight: 32,
            px: 0.75,
            ml: 'auto',
            flexShrink: 0,
            color: '#2369A5',
            fontSize: FONT.caption,
            fontWeight: 700,
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#EDF5FC',
            },
          }}
        >
          View all
        </Button>
      </Box>
    </Paper>
  )
}