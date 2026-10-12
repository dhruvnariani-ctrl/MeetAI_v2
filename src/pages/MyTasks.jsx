import { useMemo, useState } from 'react'
import PageShell, { EmptyPanel } from '../components/PageShell'
import TaskFilters from '../components/tasks/TaskFilters'
import TaskCard from '../components/tasks/TaskCard'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'

import usePageTitle from '../hooks/usePageTitle'
import useCurrentUser from '../hooks/useCurrentUser'

import {
  TASK_SORT_OPTIONS,
  getTasksFromDashboard,
  filterAndSortTasks,
  normalizeTaskPriority,
  normalizeTaskStatus,
  parseTaskDate,
} from '../data/tasks'

import { updateMeetingActionItemStatus } from '../data/meetings'

const COLORS = {
  navy: '#123A59',
  blue: '#075A9C',
  muted: '#718398',
  border: '#E0E8F0',
  background: '#F4F8FC',
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
        borderRadius: '13px',
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
          borderRadius: '11px',
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
            fontSize: '0.76rem',
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
            fontSize: '1.35rem',
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
              fontSize: '0.68rem',
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

  const [tasks, setTasks] = useState(() =>
    getTasksFromDashboard(currentUser),
  )

  // Everything TaskFilters can change lives here
  const [filter, setFilter] = useState('All')
  const [priority, setPriority] = useState('All')
  const [dueDate, setDueDate] = useState('default')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('My Order')

  // Summary numbers use the normalized helpers, so "Completed", "done",
  // "high priority" etc. are all counted correctly.
  const isDone = (task) => normalizeTaskStatus(task.status) === 'Done'

  const completedCount = tasks.filter(isDone).length

  const highPriorityCount = tasks.filter(
    (task) => normalizeTaskPriority(task.priority) === 'High' && !isDone(task),
  ).length

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dueSoonCount = tasks.filter((task) => {
    if (isDone(task)) return false

    const due = parseTaskDate(task.due)

    if (!due) return false

    const daysAway = Math.round((due.getTime() - today.getTime()) / 86400000)

    return daysAway >= 0 && daysAway <= 7
  }).length

  // Status + priority + due date + search, then sorting: all in one place
  const filteredTasks = useMemo(
    () =>
      filterAndSortTasks(
        tasks,
        { filter, priority, dueDate, search },
        sortBy,
      ),
    [tasks, filter, priority, dueDate, search, sortBy],
  )

  const hasActiveFilters =
    filter !== 'All' ||
    priority !== 'All' ||
    dueDate !== 'default' ||
    search.trim() !== ''

  const clearFilters = () => {
    setFilter('All')
    setPriority('All')
    setDueDate('default')
    setSearch('')
  }

  const firstActionableIndex = filteredTasks.findIndex(
    (task) => !isDone(task),
  )

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
    <PageShell
      title="My Tasks"
      subtitle="Stay on top of your action items and commitments."
    >
      <Stack spacing={2}>
        {/* Executive summary (cards also work as quick filters) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(4, minmax(0, 1fr))',
            },
            gap: 1.25,
          }}
        >
          <SummaryCard
            title="Total tasks"
            value={tasks.length}
            subtitle="Assigned to you"
            icon={<AssignmentOutlinedIcon />}
            tone={{ bg: '#E7F5EF', fg: '#148363' }}
            onClick={clearFilters}
          />

          <SummaryCard
            title="High priority"
            value={highPriorityCount}
            subtitle="Needs attention"
            icon={<FlagOutlinedIcon />}
            tone={{ bg: '#FDEBED', fg: '#D23F4B' }}
            onClick={() => {
              setFilter('Open')
              setPriority('High')
              setDueDate('default')
            }}
          />

          <SummaryCard
            title="Due soon"
            value={dueSoonCount}
            subtitle="Within 7 days"
            icon={<EventOutlinedIcon />}
            tone={{ bg: '#FFF2E3', fg: '#D77A18' }}
            onClick={() => {
              setFilter('Open')
              setPriority('All')
              setDueDate('week')
            }}
          />

          <SummaryCard
            title="Completed"
            value={completedCount}
            subtitle="Marked as done"
            icon={<TaskAltOutlinedIcon />}
            tone={{ bg: '#E7F5EF', fg: '#16845A' }}
            onClick={() => {
              setFilter('Done')
              setPriority('All')
              setDueDate('default')
            }}
          />
        </Box>

        {/* Status, priority, due date, sort and search */}
        <TaskFilters
          filter={filter}
          onFilterChange={setFilter}
          priority={priority}
          onPriorityChange={setPriority}
          dueDate={dueDate}
          onDueDateChange={setDueDate}
          search={search}
          onSearchChange={setSearch}
          sortOptions={TASK_SORT_OPTIONS}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Task table */}
        <Paper
          elevation={0}
          sx={{
            minWidth: 0,
            overflow: 'hidden',
            border: `1px solid ${COLORS.border}`,
            borderRadius: '13px',
            bgcolor: '#FFFFFF',
          }}
        >
          {filteredTasks.length === 0 ? (
            <Box sx={{ p: 2 }}>
              <EmptyPanel title="No tasks found">
                Try another status, priority, due date or search term.
                {hasActiveFilters && (
                  <Box sx={{ mt: 1.25 }}>
                    <Button
                      onClick={clearFilters}
                      sx={{
                        color: '#2369A5',
                        fontWeight: 700,
                        textTransform: 'none',
                      }}
                    >
                      Clear filters
                    </Button>
                  </Box>
                )}
              </EmptyPanel>
            </Box>
          ) : (
            <>
              {/* Table column headers */}
              <Box
                sx={{
                  display: { xs: 'none', md: 'grid' },
                  gridTemplateColumns:
                    'minmax(220px, 2.6fr) minmax(90px, .8fr) minmax(105px, 1fr) minmax(125px, 1.1fr) minmax(95px, .9fr) 32px',
                  alignItems: 'center',
                  gap: 1.25,
                  px: 2,
                  py: 1,
                  bgcolor: '#F6F9FC',
                  borderBottom: `1px solid ${COLORS.border}`,
                }}
              >
                {['Task', 'Priority', 'Due date', 'Owner', 'Status', ''].map(
                  (label, index) => (
                    <Typography
                      key={`${label}-${index}`}
                      sx={{
                        color: '#60768A',
                        fontSize: '0.69rem',
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
                {filteredTasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onMarkDone={handleMarkDone}
                    showMarkDoneTour={index === firstActionableIndex}
                  />
                ))}
              </Box>
            </>
          )}
        </Paper>
      </Stack>
    </PageShell>
  )
}