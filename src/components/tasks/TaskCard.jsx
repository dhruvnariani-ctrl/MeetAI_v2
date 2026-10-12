import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'

import TaskStatusBadge from './TaskStatusBadge'

function formatDueDate(value) {
  if (!value || value === '—') return 'No due date'

  const date =
    value instanceof Date
      ? value
      : new Date(`${String(value).slice(0, 10)}T00:00:00`)

  if (Number.isNaN(date.getTime())) return 'No due date'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function PriorityBadge({ priority }) {
  const styles = {
    High: { bg: '#FDEBED', color: '#C93D49' },
    Medium: { bg: '#FFF1DE', color: '#B96813' },
    Low: { bg: '#EDF2F7', color: '#52677B' },
  }

  const style = styles[priority] || styles.Medium

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 1.05,
        py: 0.4,
        borderRadius: '7px',
        bgcolor: style.bg,
        color: style.color,
        fontSize: '0.7rem',
        fontWeight: 750,
        whiteSpace: 'nowrap',
      }}
    >
      {priority || 'Medium'}
    </Box>
  )
}

function OwnerLabel({ owner }) {
  const name = owner || 'Unassigned'
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.8}
      sx={{ minWidth: 0 }}
    >
      <Box
        sx={{
          width: 27,
          height: 27,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          borderRadius: '50%',
          bgcolor: '#E8F0F7',
          color: '#245678',
          fontSize: '0.65rem',
          fontWeight: 750,
        }}
      >
        {initials || '?'}
      </Box>

      <Typography
        title={name}
        sx={{
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: '#526A80',
          fontSize: '0.73rem',
        }}
      >
        {name}
      </Typography>
    </Stack>
  )
}

export default function TaskCard({
  task,
  onMarkDone = () => {},
  showMarkDoneTour = false,
}) {
  const isDone = task?.status === 'Done'

  const description =
    task?.description ||
    task?.meetingTitle ||
    task?.meetingName ||
    ''

  return (
    <Box
      data-tour="task-details"
      sx={{
        display: 'grid',
        gridTemplateColumns: {
  xs: '30px minmax(0, 1fr) 30px',
  md: '30px minmax(180px, 2.6fr) minmax(75px, .8fr) minmax(95px, 1fr) minmax(115px, 1.1fr) minmax(85px, .9fr) 30px',
},
        alignItems: 'center',
        gap: { xs: 0.75, md: 1.25 },
        px: { xs: 1.25, md: 2 },
        py: { xs: 1.25, md: 1.1 },
        borderBottom: '1px solid #EDF1F5',
        bgcolor: '#FFFFFF',
        transition: 'background-color 140ms ease',
        '&:last-of-type': { borderBottom: 0 },
        '&:hover': { bgcolor: '#FAFCFE' },
      }}
    >
      {/* Completion checkbox and task description */}
      <Checkbox
        checked={isDone}
        disabled={isDone}
        onChange={() => {
          if (task?.id != null && !isDone) {
            onMarkDone(task.id)
          }
        }}
        inputProps={{
          'aria-label': `Mark ${task?.title || 'task'} as done`,
          ...(showMarkDoneTour
            ? { 'data-tour': 'mark-task-done' }
            : {}),
        }}
        size="small"
        sx={{
          p: 0.25,
          color: '#9CB6C9',
          '&.Mui-checked': { color: '#21865B' },
          '& .MuiSvgIcon-root': { fontSize: 20 },
        }}
      />

      <Box
        data-tour="task-details"
        sx={{
          minWidth: 0,
          gridColumn: { xs: '2 / 3', md: 'auto' },
          gridRow: { xs: '1 / 2', md: 'auto' },
        }}
      >
        <Typography
          sx={{
            color: isDone ? '#75869A' : '#173C59',
            fontSize: '0.79rem',
            fontWeight: 700,
            lineHeight: 1.4,
            textDecoration: isDone ? 'line-through' : 'none',
            overflowWrap: 'anywhere',
          }}
        >
          {task?.title || 'Untitled task'}
        </Typography>

        {description && description !== task?.title && (
          <Typography
            sx={{
              mt: 0.3,
              color: '#7B8FA2',
              fontSize: '0.7rem',
              lineHeight: 1.4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {description}
          </Typography>
        )}

        {/* Compact metadata on narrow screens */}
        <Stack
          direction="row"
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
          gap={1}
          sx={{ mt: 0.65, display: { xs: 'flex', md: 'none' } }}
        >
          <PriorityBadge priority={task?.priority} />

          <Typography sx={{ color: '#6E8397', fontSize: '0.69rem' }}>
            {formatDueDate(task?.due)}
          </Typography>

          <Typography sx={{ color: '#6E8397', fontSize: '0.69rem' }}>
            {task?.owner || 'Unassigned'}
          </Typography>

          <TaskStatusBadge status={task?.status || 'Pending'} />
        </Stack>
      </Box>

      {/* Desktop columns */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <PriorityBadge priority={task?.priority} />
      </Box>

      <Typography
        sx={{
          display: { xs: 'none', md: 'block' },
          color: '#526A80',
          fontSize: '0.73rem',
          whiteSpace: 'nowrap',
        }}
      >
        {formatDueDate(task?.due)}
      </Typography>

      <Box sx={{ display: { xs: 'none', md: 'block' }, minWidth: 0 }}>
        <OwnerLabel owner={task?.owner} />
      </Box>

      <Box
        data-tour="task-status"
        sx={{ display: { xs: 'none', md: 'block' }, minWidth: 0 }}
      >
        <TaskStatusBadge status={task?.status || 'Pending'} />
      </Box>

      <Tooltip title="Task actions">
        <IconButton
          size="small"
          aria-label={`Actions for ${task?.title || 'task'}`}
          onClick={() => {
            if (task?.id != null && !isDone) {
              onMarkDone(task.id)
            }
          }}
          sx={{
            width: 30,
            height: 30,
            color: '#71869A',
            justifySelf: 'end',
            '&:hover': {
              color: '#075A9C',
              bgcolor: '#EDF5FC',
            },
          }}
        >
          <MoreHorizRoundedIcon sx={{ fontSize: 19 }} />
        </IconButton>
      </Tooltip>
    </Box>
  )
}