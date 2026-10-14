
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined'

import usePage from '../usePage'
import MeetingListItem from '../meetings/MeetingListItem'
import MeetingGridCard from '../meetings/MeetingGridCard'

import { FONT } from '../../utils/dashboardFonts'

function formatDateHeading(dateString) {
  if (!dateString) return ''

  const parts = String(dateString).split('-').map(Number)

  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return String(dateString)
  }

  const date = new Date(parts[0], parts[1] - 1, parts[2])

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
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
  layout = 'list',
  settings = {},
  onSettingsChange,
}) {
  const { rows, pager } = usePage(
    meetings,
    `/${meetings.length}-${meetings[0]?.id}`,
  )

  if (meetings.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          border: '1px solid #E0E8F0',
          borderRadius: '12px',
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
            fontSize: FONT.heading,
            fontWeight: 750,
          }}
        >
          No meetings found
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            color: '#74869A',
            fontSize: FONT.small,
          }}
        >
          Try selecting another date or changing the meeting filters.
        </Typography>
      </Paper>
    )
  }

  const groupedMeetings = groupByDate(rows)
  const dateGroups = Object.entries(groupedMeetings)

  const normalizedView = String(view).toLowerCase()
  const isDayView = normalizedView === 'day'

  // Keep date headings when multiple dates are shown.
  // A single-day result uses the heading already shown by CalendarPage.
  const showGroupHeadings =
    !isDayView && dateGroups.length > 1

  return (
    <Stack spacing={1.75} sx={{ minWidth: 0 }}>
      {dateGroups.map(([date, dateMeetings]) => (
        <Box key={date} sx={{ minWidth: 0 }}>
          {showGroupHeadings && (
            <Typography
              component="h3"
              sx={{
                color: '#123A59',
                fontSize: FONT.heading,
                lineHeight: 1.4,
                fontWeight: 800,
                mb: 1.1,
              }}
            >
              {formatDateHeading(date)}
            </Typography>
          )}

          {layout === 'grid' ? (
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
              {dateMeetings.map((meeting, index) => (
                <MeetingGridCard
                  key={meeting.id}
                  meeting={meeting}
                  status={meeting.type}
                  timeLabel={meeting.time}
                  settings={settings}
                  onSettingsChange={onSettingsChange}
                  tourTarget={index === 0}
                />
              ))}
            </Box>
          ) : (
            <Stack spacing={1}>
              {dateMeetings.map((meeting, index) => (
                <MeetingListItem
                  key={meeting.id}
                  meeting={meeting}
                  status={meeting.type}
                  timeLabel={meeting.time}
                  settings={settings}
                  onSettingsChange={onSettingsChange}
                  tourTarget={index === 0}
                />
              ))}
            </Stack>
          )}
        </Box>
      ))}

      {pager}
    </Stack>
  )
}