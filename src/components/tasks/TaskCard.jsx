import { useState } from 'react'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'

import TaskStatusBadge from './TaskStatusBadge'
import { TASK_GRID_COLUMNS } from '../../data/tasks'
import { FONT } from '../../utils/dashboardFonts'

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
        borderRadius: '8px',
        bgcolor: style.bg,
        color: style.color,
        fontSize: FONT.caption,
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
          fontSize: FONT.caption,
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
          fontSize: FONT.caption,
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
  const [confirmOpen, setConfirmOpen] = useState(false)

  const isDone = task?.status === 'Done'

  const description =
    task?.description ||
    task?.meetingTitle ||
    task?.meetingName ||
    ''

  const taskTitle = task?.title || 'Untitled task'

  const handleCheckboxClick = () => {
    if (!isDone && task?.id != null) {
      setConfirmOpen(true)
    }
  }

  const handleConfirmDone = () => {
    if (task?.id != null && !isDone) {
      onMarkDone(task.id)
    }

    setConfirmOpen(false)
  }

  return (
    <>
      <Box
        role="row"
        data-tour="task-details"
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '30px minmax(0, 1fr) 30px',
            lg: TASK_GRID_COLUMNS,
          },
          alignItems: 'center',
          gap: { xs: 0.75, lg: 1.25 },
          px: { xs: 1.25, lg: 2 },
          py: { xs: 1.25, lg: 1.1 },
          borderBottom: '1px solid #EDF1F5',
          bgcolor: '#FFFFFF',
          transition: 'background-color 140ms ease',
          '&:last-of-type': { borderBottom: 0 },
          '&:hover': { bgcolor: '#FAFCFE' },
        }}
      >
        {/* Completion checkbox */}
        <Checkbox
          checked={isDone}
          disabled={isDone}
          onChange={handleCheckboxClick}
          inputProps={{
            'aria-label': `Mark ${taskTitle} as done`,
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

        {/* Task description */}
        <Box
          sx={{
            minWidth: 0,
            gridColumn: { xs: '2 / 3', lg: 'auto' },
            gridRow: { xs: '1 / 2', lg: 'auto' },
          }}
        >
          <Typography
            sx={{
              color: isDone ? '#75869A' : '#173C59',
              fontSize: FONT.body,
              fontWeight: 700,
              lineHeight: 1.4,
              textDecoration: isDone ? 'line-through' : 'none',
              overflowWrap: 'anywhere',
            }}
          >
            {taskTitle}
          </Typography>

          {description && description !== task?.title && (
            <Typography
              sx={{
                mt: 0.3,
                color: '#7B8FA2',
                fontSize: FONT.caption,
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
            sx={{
              mt: 0.65,
              columnGap: 1,
              rowGap: 0.75,
              display: { xs: 'flex', lg: 'none' },
            }}
          >
            <PriorityBadge priority={task?.priority} />

            <Typography
              sx={{ color: '#6E8397', fontSize: FONT.caption }}
            >
              {formatDueDate(task?.due)}
            </Typography>

            <Typography
              sx={{ color: '#6E8397', fontSize: FONT.caption }}
            >
              {task?.owner || 'Unassigned'}
            </Typography>

            <TaskStatusBadge status={task?.status || 'Pending'} />
          </Stack>
        </Box>

        {/* Desktop columns */}
        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
          <PriorityBadge priority={task?.priority} />
        </Box>

        <Typography
          sx={{
            display: { xs: 'none', lg: 'block' },
            color: '#526A80',
            fontSize: FONT.caption,
            whiteSpace: 'nowrap',
          }}
        >
          {formatDueDate(task?.due)}
        </Typography>

        <Box sx={{ display: { xs: 'none', lg: 'block' }, minWidth: 0 }}>
          <OwnerLabel owner={task?.owner} />
        </Box>

        <Box
          data-tour="task-status"
          sx={{ display: { xs: 'none', lg: 'block' }, minWidth: 0 }}
        >
          <TaskStatusBadge status={task?.status || 'Pending'} />
        </Box>

        {/* Task actions */}
        <Tooltip title="Task actions">
          <IconButton
            size="small"
            aria-label={`Actions for ${taskTitle}`}
            onClick={() => {
              if (task?.id != null && !isDone) {
                setConfirmOpen(true)
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

      {/* Mark task as done confirmation dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        fullWidth
        maxWidth="xs"
        aria-labelledby="confirm-task-done-title"
        aria-describedby="confirm-task-done-description"
        PaperProps={{
          sx: {
            borderRadius: '14px',
            p: 1,
            mx: 2,
          },
        }}
      >
        <DialogTitle
          id="confirm-task-done-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
            color: '#173C59',
            fontSize: FONT.sectionTitle,
            fontWeight: 750,
            pb: 1,
          }}
        >
          <Box
            sx={{
              display: 'grid',
              placeItems: 'center',
              width: 38,
              height: 38,
              flexShrink: 0,
              borderRadius: '10px',
              bgcolor: '#EAF6EF',
              color: '#21865B',
            }}
          >
            <CheckCircleOutlineRoundedIcon />
          </Box>

          Mark task as done?
        </DialogTitle>

        <DialogContent sx={{ pt: '8px !important' }}>
          <Typography
            sx={{
              color: '#526A80',
              fontSize: FONT.body,
              lineHeight: 1.7,
            }}
          >
            You are about to mark the following task as completed:
          </Typography>

          <Box
            sx={{
              mt: 1.5,
              p: 1.5,
              border: '1px solid #DFE7EC',
              borderRadius: '9px',
              bgcolor: '#F7F9FB',
            }}
          >
            <Typography
              sx={{
                color: '#173C59',
                fontSize: FONT.body,
                fontWeight: 700,
                overflowWrap: 'anywhere',
              }}
            >
              {taskTitle}
            </Typography>

            {description && description !== task?.title && (
              <Typography
                sx={{
                  mt: 0.5,
                  color: '#71818D',
                  fontSize: FONT.caption,
                  lineHeight: 1.5,
                }}
              >
                {description}
              </Typography>
            )}
          </Box>

          <Typography
            id="confirm-task-done-description"
            sx={{
              mt: 1.5,
              color: '#526A80',
              fontSize: FONT.body,
              lineHeight: 1.6,
            }}
          >
            Have you completed this task? Please confirm before changing
            its status to Done.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            px: 2,
            pb: 1.5,
            pt: 1,
            gap: 1,
          }}
        >
          <Button
            onClick={() => setConfirmOpen(false)}
            variant="outlined"
            sx={{
              textTransform: 'none',
              fontSize: FONT.body,
              fontWeight: 650,
              color: '#526A80',
              borderColor: '#CFDCE5',
              borderRadius: '8px',
              px: 2,
              '&:hover': {
                borderColor: '#9CB6C9',
                bgcolor: '#F7F9FB',
              },
            }}
          >
            No, Not Yet
          </Button>

          <Button
            onClick={handleConfirmDone}
            variant="contained"
            startIcon={<CheckCircleOutlineRoundedIcon />}
            sx={{
              textTransform: 'none',
              fontSize: FONT.body,
              fontWeight: 700,
              borderRadius: '8px',
              px: 2,
              bgcolor: '#16815B',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#116B4A',
                boxShadow: 'none',
              },
            }}
          >
            Yes, Mark as Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}