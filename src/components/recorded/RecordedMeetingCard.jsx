
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined'
import VideoFileOutlinedIcon from '@mui/icons-material/VideoFileOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'

import AvailabilityBadge from './AvailabilityBadge'
import { formatTime } from '../../utils/time'
import { RECORDED_GRID_COLUMNS } from '../../data/recorded'
import { FONT } from '../../utils/dashboardFonts'

const COLORS = {
  navy: '#123A59',
  blue: '#075A9C',
  muted: '#71869A',
  border: '#E7EDF3',
  iconMuted: '#7B90A3',
  metadata: '#526E84',
  buttonText: '#365974',
}

const ICON_SIZE = {
  small: '0.85rem',
  body: '1rem',
  heading: '1.15rem',
}

const DOT_SPACE = 14

const secondaryButtonSx = {
  minWidth: 0,
  minHeight: 33,
  px: 1,
  borderRadius: '8px',
  borderColor: '#D7E2EC',
  color: COLORS.buttonText,
  fontSize: FONT.caption,
  fontWeight: 650,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    borderColor: '#AFC7DA',
    bgcolor: '#F5F9FC',
  },
  '&.Mui-disabled': {
    borderColor: '#E8EDF2',
    color: '#A4B1BE',
  },
}

const primaryButtonSx = {
  ...secondaryButtonSx,
  minHeight: 34,
  px: 1.25,
  border: 0,
  bgcolor: COLORS.blue,
  color: '#FFFFFF',
  boxShadow: 'none',
  fontWeight: 700,
  '&:hover': {
    bgcolor: '#064A80',
    boxShadow: 'none',
  },
  '&.Mui-disabled': {
    bgcolor: '#EDF1F5',
    color: '#9AA9B7',
  },
}

const metadataRowSx = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  rowGap: 0.4,
  ml: `-${DOT_SPACE}px`,
}

const compactBadgeRowSx = {
  display: { xs: 'flex', lg: 'none' },
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 0.75,
  mt: 1.1,
}

const contentBadgeSx = {
  '& svg': {
    fontSize: ICON_SIZE.body,
  },
}

const BADGE_CONFIG = [
  {
    key: 'recording',
    label: 'Recording',
    Icon: PlayArrowRoundedIcon,
    availabilityKey: 'recording',
  },
  {
    key: 'transcript',
    label: 'Transcript',
    Icon: DescriptionOutlinedIcon,
    availabilityKey: 'transcript',
  },
  {
    key: 'notes',
    label: 'Notes',
    Icon: NotesOutlinedIcon,
    availabilityKey: 'meetingNotes',
    compactLabel: 'Notes',
  },
]

function formatMeetingDate(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Date unavailable'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function MetaItem({ Icon, children, sx }) {
  return (
    <Box
      sx={[
        {
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          pl: `${DOT_SPACE}px`,
          minWidth: 0,
          whiteSpace: 'nowrap',
          color: COLORS.muted,
          '& svg': {
            fontSize: ICON_SIZE.small,
            flexShrink: 0,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 5,
            top: '50%',
            width: 3,
            height: 3,
            borderRadius: '50%',
            bgcolor: '#9BACBA',
            transform: 'translateY(-50%)',
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {Icon && <Icon aria-hidden="true" />}

      <Typography
        component="span"
        sx={{
          color: 'inherit',
          fontSize: FONT.caption,
          lineHeight: 1.4,
        }}
      >
        {children}
      </Typography>
    </Box>
  )
}

function MeetingAvailability({ meeting, compact = false }) {
  return (
    <>
      {BADGE_CONFIG.map(({ key, label, Icon, availabilityKey, compactLabel }) => {
        const available = Boolean(meeting[availabilityKey]?.available)

        return (
          <AvailabilityBadge
            key={key}
            icon={<Icon sx={{ fontSize: ICON_SIZE.body }} />}
            label={compact ? compactLabel || label : key === 'notes' ? 'Meeting notes' : label}
            available={available}
            {...(compact && key === 'recording'
              ? { fontSize: ICON_SIZE.small }
              : {})}
          />
        )
      })}
    </>
  )
}

export default function RecordedMeetingCard({
  meeting,
  onWatchRecording,
  onViewTranscript,
  onViewSummary,
}) {
  const start = new Date(meeting.start)
  const end = new Date(meeting.end)

  const dateText = formatMeetingDate(meeting.start)

  const timeText =
    !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())
      ? `${formatTime(start)} – ${formatTime(end)}`
      : 'Time unavailable'

  const participantCount = meeting.participants?.length || 0
  const participantLabel =
    participantCount === 1 ? 'participant' : 'participants'

  const recordingAvailable = Boolean(meeting.recording?.available)
  const transcriptAvailable = Boolean(meeting.transcript?.available)
  const notesAvailable = Boolean(meeting.meetingSummary)

  const actions = [
    {
      label: 'Watch recording',
      Icon: PlayArrowRoundedIcon,
      available: recordingAvailable,
      onClick: onWatchRecording,
      primary: true,
    },
    {
      label: 'Transcript',
      Icon: DescriptionOutlinedIcon,
      available: transcriptAvailable,
      onClick: onViewTranscript,
    },
    {
      label: 'Summary',
      Icon: NotesOutlinedIcon,
      available: notesAvailable,
      onClick: onViewSummary,
    },
  ]

  return (
    <Box
      role="row"
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          lg: RECORDED_GRID_COLUMNS,
        },
        alignItems: 'center',
        columnGap: 2,
        rowGap: 1.5,
        px: { xs: 1.5, md: 2 },
        py: { xs: 1.75, md: 1.5 },
        borderBottom: `1px solid ${COLORS.border}`,
        transition: 'background-color 140ms ease',
        '&:last-child': { borderBottom: 0 },
        '&:hover': { bgcolor: '#FAFCFE' },
      }}
    >
      {/* Meeting details */}
      <Box
        role="cell"
        aria-label={`Meeting: ${meeting.title || 'Untitled meeting'}`}
        sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, minWidth: 0 }}
      >
        <Box
          aria-hidden="true"
          sx={{
            width: 39,
            height: 39,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
            border: '1px solid #DCEAF7',
            borderRadius: '10px',
            bgcolor: '#EDF5FC',
            color: COLORS.blue,
          }}
        >
          <VideoFileOutlinedIcon sx={{ fontSize: ICON_SIZE.heading }} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              color: COLORS.navy,
              fontSize: FONT.meetingTitle,
              lineHeight: 1.4,
              fontWeight: 750,
              overflowWrap: 'anywhere',
            }}
          >
            {meeting.title || 'Untitled meeting'}
          </Typography>

          <Box sx={{ mt: 0.5, overflow: 'hidden' }}>
            <Box sx={metadataRowSx}>
              <MetaItem sx={{ color: COLORS.metadata, '& span': { fontWeight: 600 } }}>
                {meeting.platform || 'Meeting platform'}
              </MetaItem>

              <MetaItem Icon={CalendarTodayOutlinedIcon}>
                {dateText}
              </MetaItem>

              <MetaItem Icon={ScheduleOutlinedIcon}>
                {timeText}
              </MetaItem>

              <MetaItem
                Icon={GroupsOutlinedIcon}
                sx={{ display: { xs: 'inline-flex', lg: 'none' } }}
              >
                {participantCount} {participantLabel}
              </MetaItem>
            </Box>
          </Box>

          <Box sx={compactBadgeRowSx}>
            <MeetingAvailability meeting={meeting} compact />
          </Box>
        </Box>
      </Box>

      {/* Participant count */}
      <Box
        role="cell"
        aria-label={`${participantCount} ${participantLabel}`}
        sx={{
          display: { xs: 'none', lg: 'flex' },
          alignItems: 'center',
          gap: 0.9,
        }}
      >
        <GroupsOutlinedIcon aria-hidden="true" sx={{ color: COLORS.iconMuted }} />

        <Box>
          <Typography
            sx={{
              color: '#34536E',
              fontSize: FONT.body,
              fontWeight: 750,
              lineHeight: 1.25,
            }}
          >
            {participantCount}
          </Typography>

          <Typography
            sx={{
              color: COLORS.muted,
              fontSize: FONT.caption,
              lineHeight: 1.3,
            }}
          >
            {participantLabel}
          </Typography>
        </Box>
      </Box>

      {/* Meeting content actions */}
      <Box
        role="cell"
        aria-label="Meeting actions"
        data-tour="recorded-content-actions"
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(3, minmax(0, auto))',
            sm: 'repeat(3, auto)',
            lg: 'repeat(2, minmax(0, 1fr))',
          },
          justifyContent: { xs: 'stretch', sm: 'start', lg: 'stretch' },
          gap: 0.75,
          minWidth: 0,
        }}
      >
        {actions.map(({ label, Icon, available, onClick, primary }) => (
          <Button
            key={label}
            size="small"
            variant={primary ? 'contained' : 'outlined'}
            startIcon={<Icon />}
            disabled={!available}
            onClick={onClick}
            sx={{
              ...(primary ? primaryButtonSx : secondaryButtonSx),
              ...(primary ? { gridColumn: { lg: '1 / -1' } } : {}),
              '& .MuiButton-startIcon': {
                mr: 0.5,
                ml: 0,
              },
            }}
          >
            {label}
          </Button>
        ))}
      </Box>
    </Box>
  )
}
