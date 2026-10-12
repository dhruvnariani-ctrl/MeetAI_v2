import { useId, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'

import { formatRange } from '../../utils/time'
import InviteSwitch from '../InviteSwitch'
import MeetingListItem from '../meetings/MeetingListItem'
import UpNextCard from './UpNextCard'
import useScheduleSwitch from '../../hooks/useScheduleSwitch'

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

  // Remove completed meetings and the featured meeting from the lower list.
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

  // Count live and upcoming meetings, excluding completed meetings.
  const activeCount = useMemo(
    () =>
      meetingsWithStatus.filter(({ status }) => status !== 'Done').length,
    [meetingsWithStatus],
  )

  const liveCount = useMemo(
    () =>
      meetings.filter((meeting) =>
        isLiveMeeting(meeting, currentTime),
      ).length,
    [meetings, currentTime],
  )

  return (
    <Paper
      component="section"
      data-tour="dashboard-todays-meetings"
      aria-labelledby={headingId}
      variant="outlined"
      sx={{
        minWidth: 0,
        p: { xs: 1.75, sm: 2.5 },
        borderRadius: '20px',
        bgcolor: '#fff',
        borderColor: '#dfe8f0',
        boxShadow: '0 4px 16px rgba(16,58,92,.035)',
      }}
    >
      {/* Schedule heading */}
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 1.5,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          mb: 2,
        }}
      >
        <Stack
          direction="row"
          spacing={1.25}
          alignItems="center"
          sx={{ minWidth: 0, flex: { sm: '1 1 auto' } }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '13px',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
              color: '#2467a5',
              bgcolor: '#eaf3ff',
            }}
          >
            <CalendarMonthOutlinedIcon sx={{ fontSize: 23 }} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              id={headingId}
              component="h2"
              sx={{
                color: '#123a59',
                fontSize: '1.08rem',
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
                fontSize: '.82rem',
                lineHeight: 1.45,
              }}
            >
              Your meetings and upcoming conversations
            </Typography>
          </Box>
        </Stack>

        {/* Overall Invite MeetAI toggle and calendar link */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 1.5 },
            flexShrink: 0,
            ml: { xs: 0, sm: 'auto' },
          }}
        >
          <InviteSwitch
            checked={checked}
            onChange={toggle}
            disabled={disabled}
          />

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
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              minHeight: 36,
              px: 1,
              color: '#2369a5',
              fontSize: '.84rem',
              fontWeight: 750,
              textTransform: 'none',
              whiteSpace: 'nowrap',
              '&:hover': { bgcolor: '#edf5fc' },
            }}
          >
            View calendar
          </Button>
        </Box>
      </Box>

      {/* Meeting count */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          flexWrap: 'wrap',
          mb: 2,
          px: 1.5,
          py: 1.25,
          borderRadius: '13px',
          bgcolor: '#f5f9fc',
          border: '1px solid #eaf0f5',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <EventAvailableOutlinedIcon
            sx={{ fontSize: 20, color: '#52758f' }}
          />

          <Typography
            sx={{
              color: '#38566f',
              fontSize: '.85rem',
              fontWeight: 750,
            }}
          >
            {activeCount === 0
              ? 'No meetings left today'
              : `${activeCount} ${
                  activeCount === 1 ? 'meeting' : 'meetings'
                } left today`}
          </Typography>
        </Stack>

        {liveCount > 0 && (
          <Chip
            size="small"
            label={liveCount === 1 ? '1 live now' : `${liveCount} live now`}
            sx={{
              height: 27,
              bgcolor: '#fff0ef',
              color: '#bf4148',
              fontSize: '.74rem',
              fontWeight: 800,
              borderRadius: '9px',
            }}
          />
        )}
      </Box>

      {/* Featured meeting */}
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

      {/* Remaining meetings */}
      {remainingMeetings.length > 0 ? (
        <Stack spacing={1}>
          {remainingMeetings.map(({ meeting, status }) => (
            <MeetingListItem
              key={meeting.id}
              meeting={meeting}
              status={status}
              timeLabel={formatRange(meeting.start, meeting.end)}
              settings={settings}
              onSettingsChange={onSettingsChange}
            />
          ))}
        </Stack>
      ) : (
        <Box sx={{ py: 2.5, px: 1, textAlign: 'center' }}>
          <Typography
            sx={{
              color: '#123a59',
              fontSize: '.88rem',
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
              fontSize: '.8rem',
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