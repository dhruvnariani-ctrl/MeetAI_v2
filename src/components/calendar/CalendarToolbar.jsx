import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

import SlidingSegmented from '../SlidingSegmented'

import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'

const VIEW_OPTIONS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
]

const CONTROL_HEIGHT = 38

export default function CalendarToolbar({
  view,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
  onYesterday,
  onTomorrow,
  onCurrentPeriod,
  selectedDateLabel = 'Today',
  monthLabel,
  autoJoin = false,
  onAutoJoinChange,
  onNewMeeting,
  // PageShell already renders the "Calendar" title and subtitle, so the
  // toolbar does not repeat them. Set to true only if you use it without PageShell.
  showHeading = false,
}) {
  const [anchorEl, setAnchorEl] = useState(null)

  const controlSx = {
    height: CONTROL_HEIGHT,
    minHeight: CONTROL_HEIGHT,
    borderRadius: '10px',
    border: '1px solid #DCE7F0',
    color: '#234C6A',
    fontSize: '0.8rem',
    fontWeight: 650,
    lineHeight: 1,
    textTransform: 'none',
    whiteSpace: 'nowrap',
    bgcolor: '#FFFFFF',
    boxShadow: 'none',
  }

  const iconButtonSx = {
    width: CONTROL_HEIGHT,
    height: CONTROL_HEIGHT,
    flexShrink: 0,
    border: '1px solid #DCE7F0',
    borderRadius: '10px',
    color: '#234C6A',
    bgcolor: '#FFFFFF',
    '&:hover': { bgcolor: '#F1F7FC', borderColor: '#AFC8DD' },
  }

  const currentMonthLabel = monthLabel || selectedDateLabel || 'Calendar'

  const quickActions = [
    { label: 'Today', action: onToday },
    { label: 'Yesterday', action: onYesterday },
    { label: 'Tomorrow', action: onTomorrow },
  ]

  return (
    <Box sx={{ minWidth: 0 }}>
      {showHeading && (
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              color: '#123A59',
              fontSize: '1.45rem',
              lineHeight: 1.25,
              fontWeight: 800,
              letterSpacing: '-0.025em',
            }}
          >
            Calendar
          </Typography>

          <Typography
            sx={{ mt: 0.35, color: '#72869A', fontSize: '0.82rem' }}
          >
            Manage your meetings and schedule
          </Typography>
        </Box>
      )}

      {/* One toolbar row: date navigation on the left, actions on the right */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          columnGap: 2,
          rowGap: 1.5,
        }}
      >
        {/* Left: previous / current label / next / Today */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minWidth: 0,
            flex: { xs: '1 1 100%', md: '0 1 auto' },
          }}
        >
          <IconButton
            aria-label={`Previous ${view}`}
            data-tour="calendar-previous"
            onClick={onPrevious}
            sx={iconButtonSx}
          >
            <ChevronLeftRoundedIcon />
          </IconButton>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: { xs: 0, sm: 190 },
              flex: { xs: 1, md: '0 0 auto' },
              height: CONTROL_HEIGHT,
              px: 1.5,
              border: '1px solid #E0E8F0',
              borderRadius: '10px',
              bgcolor: '#FFFFFF',
            }}
          >
            <Typography
              sx={{
                color: '#173F5D',
                fontSize: '0.92rem',
                fontWeight: 750,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {currentMonthLabel}
            </Typography>
          </Box>

          <IconButton
            aria-label={`Next ${view}`}
            data-tour="calendar-next"
            onClick={onNext}
            sx={iconButtonSx}
          >
            <ChevronRightRoundedIcon />
          </IconButton>
        </Box>

        {/* Right: date menu, view switch, New meeting */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: { xs: 'flex-start', md: 'flex-end' },
            gap: 1,
            minWidth: 0,
            flex: { xs: '1 1 100%', md: '0 1 auto' },
          }}
        >
          <Button
            data-tour="calendar-date-menu"
            onClick={(event) => setAnchorEl(event.currentTarget)}
            startIcon={<CalendarTodayOutlinedIcon sx={{ fontSize: 17 }} />}
            endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: 18 }} />}
            sx={{
              ...controlSx,
              px: 1.25,
              minWidth: 130,
              justifyContent: 'space-between',
            }}
          >
            {selectedDateLabel}
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            {quickActions.map((item) => (
              <MenuItem
                key={item.label}
                onClick={() => {
                  setAnchorEl(null)
                  item.action?.()
                }}
                sx={{ fontSize: '0.84rem' }}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>

          {/* View switch */}
          <SlidingSegmented
            dataTour="calendar-view"
            ariaLabel="Calendar view"
            options={VIEW_OPTIONS}
            value={view}
            onChange={onViewChange}
            sx={{ height: CONTROL_HEIGHT, bgcolor: '#EDF4FA' }}
          />

          <Button
            data-tour="new-meeting"
            onClick={onNewMeeting}
            startIcon={<AddRoundedIcon />}
            variant="contained"
            sx={{
              ...controlSx,
              px: 1.75,
              color: '#FFFFFF',
              bgcolor: '#16824a',
            }}
          >
            Schedule or Join with MeetAI
          </Button>
        </Box>
      </Box>
    </Box>
  )
}