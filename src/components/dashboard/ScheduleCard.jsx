
import { useEffect, useId, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'

import { formatRange } from '../../utils/time'
import InviteSwitch from '../InviteSwitch'
import MeetingListItem from '../meetings/MeetingListItem'
import UpNextCard from './UpNextCard'
import useScheduleSwitch from '../../hooks/useScheduleSwitch'
import usePage from '../usePage'
import { FONT } from '../../utils/dashboardFonts'

function asDate(value) {
  if (!value) return null

  const date = value instanceof Date ? value : new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

function isLiveMeeting(meeting, now) {
  const start = asDate(meeting?.start)
  const end = asDate(meeting?.end)

  return Boolean(start && end && start <= now && now < end)
}

function getFeaturedMeeting(meetings, now) {
  // Prefer a meeting currently in progress.
  const liveMeeting = meetings.find((meeting) =>
    isLiveMeeting(meeting, now),
  )

  if (liveMeeting) return liveMeeting

  // Otherwise, select the nearest meeting that has not started.
  return (
    [...meetings]
      .filter((meeting) => {
        const start = asDate(meeting?.start)
        const end = asDate(meeting?.end)

        return start && end && start > now
      })
      .sort(
        (a, b) =>
          asDate(a.start).getTime() - asDate(b.start).getTime(),
      )[0] ?? null
  )
}

export default function ScheduleCard({
  meetings = [],
  now,
  nextId,
  settings = {},
  onSettingsChange,
  onCountsChange,
}) {
  const headingId = useId()
  const navigate = useNavigate()
  const currentTime = asDate(now) ?? new Date()

  const {
    meetingsWithStatus,
    checked,
    disabled,
    toggle,
  } = useScheduleSwitch({
    meetings,
    now: currentTime,
    nextId,
    settings,
    onSettingsChange,
  })

  const featuredMeeting = useMemo(
    () => getFeaturedMeeting(meetings, currentTime),
    [meetings, currentTime],
  )

  const featuredIsLive = featuredMeeting
    ? isLiveMeeting(featuredMeeting, currentTime)
    : false

  // Remove completed meetings and the featured meeting from the list.
  const remainingMeetings = useMemo(
    () =>
      meetingsWithStatus.filter(({ meeting, status }) => {
        if (status === 'Done') return false

        if (
          featuredMeeting &&
          String(meeting.id) === String(featuredMeeting.id)
        ) {
          return false
        }

        return true
      }),
    [meetingsWithStatus, featuredMeeting],
  )

  // Show at most five meetings per page.
  const paginationKey = remainingMeetings
    .map(({ meeting, status }) => `${meeting.id}-${status}`)
    .join('|')

  const {
    rows: pagedMeetings,
    pager,
  } = usePage(remainingMeetings, paginationKey, 5)

  // Counts for the Dashboard header.
  const activeCount = useMemo(
    () =>
      meetingsWithStatus.filter(
        ({ status }) => status !== 'Done',
      ).length,
    [meetingsWithStatus],
  )

  const liveCount = useMemo(
    () =>
      meetings.filter((meeting) =>
        isLiveMeeting(meeting, currentTime),
      ).length,
    [meetings, currentTime],
  )

  useEffect(() => {
    onCountsChange?.({ activeCount, liveCount })
  }, [activeCount, liveCount, onCountsChange])

  return (
    <Paper
      component="section"
      data-tour="dashboard-todays-meetings"
      aria-labelledby={headingId}
      variant="outlined"
      sx={{
        minWidth: 0,
        height: '100%',
        p: { xs: 1.75, sm: 2.5 },
        borderRadius: '16px',
        bgcolor: '#fff',
        borderColor: '#dfe8f0',
        boxShadow: '0 4px 16px rgba(16,58,92,.035)',
      }}
    >
      
{/* Schedule heading */}
<Box
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'stretch', sm: 'center' },
    justifyContent: 'space-between',
    gap: 1.5,
    mb: 2,
  }}
>
  <Stack
    direction="row"
    spacing={1.25}
    alignItems="center"
    sx={{ minWidth: 0, flex: '1 1 auto' }}
  >
    <Box
      sx={{
        width: 44,
        height: 44,
        borderRadius: '12px',
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
        color: '#2467a5',
        bgcolor: '#eaf3ff',
      }}
    >
      <CalendarMonthOutlinedIcon sx={{ fontSize: '1.15rem' }} />
    </Box>

    <Box sx={{ minWidth: 0 }}>
      <Typography
        id={headingId}
        component="h2"
        sx={{
          color: '#123a59',
          fontSize: FONT.scheduleHeading,
          lineHeight: 1.3,
          fontWeight: 800,
        }}
      >
        Today&apos;s schedule
      </Typography>

      <Typography
        sx={{
          mt: 0.35,
          color: '#718397',
          fontSize: FONT.small,
          lineHeight: 1.45,
        }}
      >
        Your meetings and upcoming conversations
      </Typography>
    </Box>
  </Stack>

  {/* Right-aligned controls on every screen size */}
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      alignSelf: { xs: 'stretch', sm: 'auto' },
      gap: { xs: 1, sm: 1.5 },
      flexShrink: 0,
      ml: { sm: 'auto' },
      width: { xs: '100%', sm: 'auto' },
      minWidth: 0,
    }}
  >
    <Box sx={{ flexShrink: 0 }}>
      <InviteSwitch
        checked={checked}
        onChange={toggle}
        disabled={disabled}
      />
    </Box>

    <Divider
      orientation="vertical"
      flexItem
      sx={{
        display: { xs: 'none', sm: 'block' },
        my: 0.75,
        borderColor: '#e3ebf2',
      }}
    />

    <Button
      data-tour="dashboard-calendar-link"
      onClick={() => navigate('/calendar')}
      endIcon={
        <ArrowForwardRoundedIcon
          sx={{ fontSize: '0.85rem !important' }}
        />
      }
      sx={{
        minHeight: 36,
        px: 1,
        color: '#2369a5',
        fontSize: FONT.small,
        fontWeight: 750,
        textTransform: 'none',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        '&:hover': { bgcolor: '#edf5fc' },
      }}
    >
      View calendar
    </Button>
  </Box>
</Box>


      {/* Featured live or upcoming meeting */}
      {featuredMeeting && (
        <Box sx={{ mb: 1.75, minWidth: 0 }}>
          <UpNextCard
            data-tour="dashboard-next-meeting"
            meeting={featuredMeeting}
            now={currentTime}
            embedded
            settings={settings?.[featuredMeeting.id] ?? {}}
            onSettingsChange={onSettingsChange}
            status={featuredIsLive ? 'Live' : 'Upcoming'}
          />
        </Box>
      )}

      {/* Remaining meetings: five per page */}
      {remainingMeetings.length > 0 ? (
        <Stack spacing={1}>
          {pagedMeetings.map(({ meeting, status }) => (
            <MeetingListItem
              key={meeting.id}
              meeting={meeting}
              status={status}
              timeLabel={formatRange(meeting.start, meeting.end)}
              settings={settings}
              onSettingsChange={onSettingsChange}
            />
          ))}

          {/* Pager appears only when there are more than five */}
          {pager}
        </Stack>
      ) : (
        <Box sx={{ py: 2.5, px: 1, textAlign: 'center' }}>
          <Typography
            sx={{
              color: '#123a59',
              fontSize: FONT.body,
              fontWeight: 750,
            }}
          >
            {featuredMeeting
              ? 'No other active meetings'
              : 'No active meetings today'}
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              color: '#718397',
              fontSize: FONT.small,
              lineHeight: 1.5,
            }}
          >
            {featuredMeeting
              ? 'Your featured meeting is shown above. Completed meetings are hidden.'
              : 'Completed meetings are hidden from this schedule.'}
          </Typography>
        </Box>
      )}
    </Paper>
  )
}