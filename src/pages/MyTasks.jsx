import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import PageShell, { EmptyPanel } from '../components/PageShell'
import TaskFilters from '../components/tasks/TaskFilters'
import TaskCard from '../components/tasks/TaskCard'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import usePage from '../components/usePage'
import usePageTitle from '../hooks/usePageTitle'
import useCurrentUser from '../hooks/useCurrentUser'

import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'

import {
  TASK_SORT_OPTIONS,
  getTasksFromDashboard,
  TASK_GRID_COLUMNS,
  filterAndSortTasks,
  normalizeTaskPriority,
  normalizeTaskStatus,
  parseTaskDate,
} from '../data/tasks'

import { updateMeetingActionItemStatus } from '../data/meetings'
import { FONT } from '../utils/dashboardFonts'

const COLORS = {
  navy: '#123A59',
  blue: '#075A9C',
  muted: '#718398',
  border: '#E0E8F0',
}

function SummaryCard({ title, value, subtitle, icon, tone, onClick }) {
  return (
    <Paper
      component={onClick ? 'button' : 'div'}
      elevation={0}
      onClick={onClick}
      sx={{
        minWidth: 0,
        width: '100%',
        minHeight: 82,
        p: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 1.4,
        textAlign: 'left',
        font: 'inherit',
        border: `1px solid ${COLORS.border}`,
        borderRadius: '12px',
        bgcolor: '#FFFFFF',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 160ms ease, box-shadow 160ms ease',
        '&:hover': onClick
          ? {
              borderColor: '#B9D0E3',
              boxShadow: '0 3px 12px rgba(18,58,89,0.05)',
            }
          : {},
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          borderRadius: '10px',
          bgcolor: tone.bg,
          color: tone.fg,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          sx={{
            color: '#526A80',
            fontSize: FONT.caption,
            fontWeight: 650,
            lineHeight: 1.35,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 0.15,
            color: COLORS.navy,
            fontSize: FONT.statValue,
            lineHeight: 1.25,
            fontWeight: 800,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </Typography>

        {subtitle && (
          <Typography
            sx={{
              mt: 0.2,
              color: COLORS.muted,
              fontSize: FONT.caption,
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Paper>
  )
}

export default function MyTasks() {
  usePageTitle('My Tasks')

  const currentUser = useCurrentUser()
  const { query: search } = useOutletContext()

  const [tasks, setTasks] = useState(() =>
    getTasksFromDashboard(currentUser),
  )

  const [filter, setFilter] = useState('All')
  const [priority, setPriority] = useState('All')
  const [dueDate, setDueDate] = useState('default')
  const [sortBy, setSortBy] = useState('My Order')

  const isDone = (task) => normalizeTaskStatus(task.status) === 'Done'

  const completedCount = tasks.filter(isDone).length

  const highPriorityCount = tasks.filter(
    (task) =>
      normalizeTaskPriority(task.priority) === 'High' && !isDone(task),
  ).length

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dueSoonCount = tasks.filter((task) => {
    if (isDone(task)) return false

    const due = parseTaskDate(task.due)

    if (!due) return false

    const daysAway = Math.round(
      (due.getTime() - today.getTime()) / 86400000,
    )

    return daysAway >= 0 && daysAway <= 7
  }).length

  const filteredTasks = useMemo(
    () =>
      filterAndSortTasks(
        tasks,
        { filter, priority, dueDate, search },
        sortBy,
      ),
    [tasks, filter, priority, dueDate, search, sortBy],
  )

  const { rows, pager } = usePage(
    filteredTasks,
    [filter, priority, dueDate, search, sortBy].join('|'),
  )

  const hasActiveFilters =
    filter !== 'All' ||
    priority !== 'All' ||
    dueDate !== 'default'

  const clearFilters = () => {
    setFilter('All')
    setPriority('All')
    setDueDate('default')
  }

  const firstActionableIndex = rows.findIndex((task) => !isDone(task))

  const handleMarkDone = (taskId) => {
    const task = tasks.find((item) => item.id === taskId)

    if (!task || isDone(task)) return

    updateMeetingActionItemStatus(task.meetingId, task.id, 'Done')

    setTasks((current) =>
      current.map((item) =>
        item.id === taskId ? { ...item, status: 'Done' } : item,
      ),
    )
  }
  return (
      <Stack spacing={2}>
        {/* Page heading and filters on the same line */}
        <Box
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: { xs: 'stretch', md: 'center' },
    justifyContent: 'space-between',
    gap: { xs: 2, md: 3 },
    width: '100%',
    minWidth: 0,
  }}
>
  <Box
    sx={{
      flex: '1 1 auto',
      minWidth: 0,
    }}
  >
    <Typography
      sx={{
        color: COLORS.navy,
        fontSize: FONT.statValue,
        fontWeight: 800,
        lineHeight: 1.3,
      }}
    >
      My Tasks
    </Typography>

    <Typography
      sx={{
        mt: 0.25,
        color: COLORS.muted,
        fontSize: FONT.caption,
      }}
    >
      Stay on top of your action items and commitments.
    </Typography>
  </Box>

  <Box
    sx={{
      width: { xs: '100%', md: 'auto' },
      flex: { xs: '1 1 100%', md: '0 1 auto' },
      minWidth: 0,
      '& > *': {
        width: { xs: '100%', md: 'auto' },
        minWidth: 0,
      },
    }}
  >
    <TaskFilters
      filter={filter}
      onFilterChange={setFilter}
      priority={priority}
      onPriorityChange={setPriority}
      dueDate={dueDate}
      onDueDateChange={setDueDate}
      sortOptions={TASK_SORT_OPTIONS}
      sortBy={sortBy}
      onSortChange={setSortBy}
    />
  </Box>
</Box>
        {/* Task table */}
        <Paper
          role="table"
          aria-label="My tasks"
          elevation={0}
          sx={{
            minWidth: 0,
            overflow: 'hidden',
            border: filteredTasks.length
              ? `1px solid ${COLORS.border}`
              : 0,
            borderRadius: '12px',
            bgcolor: '#FFFFFF',
          }}
        >
          {filteredTasks.length === 0 ? (
            <EmptyPanel title="No tasks found">
              Try another status, priority, due date or search term.

              {hasActiveFilters && (
                <Box sx={{ mt: 1.25 }}>
                  <Button
                    onClick={clearFilters}
                    sx={{
                      color: '#2369A5',
                      fontSize: FONT.body,
                      fontWeight: 700,
                      textTransform: 'none',
                      minWidth: '20px',
                    }}
                  >
                    Clear filters
                  </Button>
                </Box>
              )}
            </EmptyPanel>
          ) : (
            <>
              <Box
                role="row"
                sx={{
                  display: { xs: 'none', lg: 'grid' },
                  gridTemplateColumns: TASK_GRID_COLUMNS,
                  alignItems: 'center',
                  gap: 1.25,
                  px: 2,
                  py: 1,
                  bgcolor: '#F6F9FC',
                  borderBottom: `1px solid ${COLORS.border}`,
                }}
              >
                {['', 'Task', 'Priority', 'Due date', 'Owner', 'Status'].map(
                  (label, index) => (
                    <Typography
                      key={`${label}-${index}`}
                      role="columnheader"
                      sx={{
                        color: '#60768A',
                        fontSize: FONT.caption,
                        fontWeight: 750,
                        textTransform: 'uppercase',
                        letterSpacing: '.035em',
                      }}
                    >
                      {label}
                    </Typography>
                  ),
                )}
              </Box>

              <Box data-tour="task-card">
                {rows.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onMarkDone={handleMarkDone}
                    showMarkDoneTour={index === firstActionableIndex}
                  />
                ))}
              </Box>

              <Box sx={{ m: '10px' }}>{pager}</Box>
            </>
          )}
        </Paper>
      </Stack>
   )
}