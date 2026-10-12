
import { useState } from 'react'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'

import SlidingSegmented from '../SlidingSegmented'
import MeetingListItem from '../meetings/MeetingListItem'
import MeetingGridCard from '../meetings/MeetingGridCard'
import { readJSON, writeJSON } from '../../utils/storage'

const LAYOUT_KEY = 'calendar-meeting-layout'

const LAYOUT_OPTIONS = [
  { value: 'list', label: 'List', icon: <ViewListRoundedIcon /> },
  { value: 'grid', label: 'Grid', icon: <GridViewRoundedIcon /> },
]

function readSavedLayout() {
  const saved = readJSON(LAYOUT_KEY, null)

  if (saved === 'grid' || saved === 'list') {
    return saved
  }

  // Migrate the older plain-string localStorage value.
  try {
    const legacy =
      typeof window !== 'undefined'
        ? window.localStorage.getItem(LAYOUT_KEY)
        : null

    if (legacy === 'grid' || legacy === 'list') {
      writeJSON(LAYOUT_KEY, legacy)
      return legacy
    }
  } catch {
    // Fall back to list layout if storage is unavailable.
  }

  return 'list'
}

function formatDateHeading(dateString) {
  if (!dateString) return ''

  const parts = String(dateString).split('-').map(Number)

  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return String(dateString)
  }

  const date = new Date(parts[0], parts[1] - 1, parts[2])

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function groupByDate(meetings) {
  return meetings.reduce((groups, meeting) => {
    const key = meeting.date || 'No date'

    if (!groups[key]) {
      groups[key] = []
    }

    groups[key].push(meeting)

    return groups
  }, {})
}

export default function CalendarMeetingList({
  meetings = [],
  view = 'week',
  settings = {},
  onSettingsChange,
}) {
  const [layout, setLayout] = useState(readSavedLayout)

  const handleLayoutChange = (nextLayout) => {
    if (nextLayout !== 'list' && nextLayout !== 'grid') {
      return
    }

    setLayout(nextLayout)
    writeJSON(LAYOUT_KEY, nextLayout)
  }

  if (meetings.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          border: '1px solid #E0E8F0',
          borderRadius: '14px',
          bgcolor: '#FFFFFF',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            mx: 'auto',
            mb: 1.25,
            display: 'grid',
            placeItems: 'center',
            borderRadius: '12px',
            bgcolor: '#EDF4FA',
            color: '#52758F',
          }}
        >
          <EventBusyOutlinedIcon />
        </Box>

        <Typography
          sx={{
            color: '#123A59',
            fontSize: '0.95rem',
            fontWeight: 750,
          }}
        >
          No meetings found
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            color: '#74869A',
            fontSize: '0.8rem',
          }}
        >
          Try selecting another date or changing the meeting filters.
        </Typography>
      </Paper>
    )
  }

  const groupedMeetings = groupByDate(meetings)

  return (
    <Stack spacing={1.75} sx={{ minWidth: 0 }}>
      {Object.entries(groupedMeetings).map(
        ([date, dateMeetings], groupIndex) => (
          <Box key={date} sx={{ minWidth: 0 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
                mb: 1.1,
                minHeight: 34,
              }}
            >
              <Typography
                component="h3"
                sx={{
                  color: '#123A59',
                  fontSize: '0.95rem',
                  lineHeight: 1.4,
                  fontWeight: 800,
                }}
              >
                {formatDateHeading(date)}
              </Typography>

              {groupIndex === 0 && (
                <SlidingSegmented
                  dataTour="calendar-layout-toggle"
                  ariaLabel="Meeting layout"
                  options={LAYOUT_OPTIONS}
                  value={layout}
                  onChange={handleLayoutChange}
                  sx={{ bgcolor: '#EDF4FA' }}
                />
              )}
            </Box>

            {layout === 'list' ? (
              <Stack spacing={1}>
                {dateMeetings.map((meeting) => (
                  <MeetingListItem
                    key={meeting.id}
                    meeting={meeting}
                    status={meeting.type}
                    timeLabel={meeting.time}
                    settings={settings}
                    onSettingsChange={onSettingsChange}
                    tourTarget={dateMeetings[0]?.id === meeting.id}
                  />
                ))}
              </Stack>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'minmax(0, 1fr)',
                    sm: 'repeat(2, minmax(0, 1fr))',
                  },
                  gap: 1.25,
                  alignItems: 'stretch',
                }}
              >
                {dateMeetings.map((meeting) => (
                  <MeetingGridCard
                    key={meeting.id}
                    meeting={meeting}
                    status={meeting.type}
                    timeLabel={meeting.time}
                    settings={settings}
                    onSettingsChange={onSettingsChange}
                    tourTarget={dateMeetings[0]?.id === meeting.id}
                  />
                ))}
              </Box>
            )}
          </Box>
        ),
      )}
    </Stack>
  )
}
