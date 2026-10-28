
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import VideoCallRoundedIcon from '@mui/icons-material/VideoCallRounded'

import MeetingToggles from '../MeetingToggles'
import { asDate, formatRange } from '../../utils/time'
import { FONT } from '../../utils/dashboardFonts'

const COLORS = {
  navy: '#163C5A',
  muted: '#647C91',
  blue: '#286AA5',
  blueHover: '#1D5487',
  green: '#247A43',
  greenHover: '#1F6337',
}

function getMeetingStatus(meeting, now) {
  const start = asDate(meeting?.start)
  const end = asDate(meeting?.end)

  if (!start || !end) return 'Upcoming'
  if (start <= now && now < end) return 'Live'
  if (now < start) return 'Upcoming'

  return 'Done'
}

function getMeetingTitle(meeting) {
  return meeting?.title || meeting?.name || meeting?.topic || 'Untitled meeting'
}

export default function UpNextCard({
  meeting,
  now,
  settings = {},
  onSettingsChange,
  status,
}) {
  const navigate = useNavigate()

  if (!meeting) return null

  const currentTime = asDate(now) ?? new Date()
  const meetingStatus = status || getMeetingStatus(meeting, currentTime)
  const isLive = meetingStatus === 'Live' || meetingStatus === 'In progress'
  const isDone = meetingStatus === 'Done'

  const colors = isLive
    ? {
        background: '#F3FAF5',
        border: '#D3E8D9',
        iconBackground: '#E2F2E6',
        icon: COLORS.green,
        chipBackground: '#E3F3E7',
        chipText: '#216B3B',
        button: COLORS.green,
        buttonHover: COLORS.greenHover,
      }
    : {
        background: '#F4F8FD',
        border: '#D6E4F3',
        iconBackground: '#E5EFFB',
        icon: COLORS.blue,
        chipBackground: '#E5EFFB',
        chipText: '#245F94',
        button: COLORS.blue,
        buttonHover: COLORS.blueHover,
      }

  const meetingSettings =
    settings && typeof settings === 'object' ? settings : {}

  const handleSettingsChange = (changes) => {
    if (meeting.id == null) return
    onSettingsChange?.(meeting.id, changes)
  }

  const openMeeting = () => {
    if (meeting.id == null) return
    navigate(`/meetings/${meeting.id}`)
  }

  const buttonSx = {
    minWidth: { xs: 0, sm: 160 },
    minHeight: 32,
    px: 1.5,
    borderRadius: '8px',
    fontSize: FONT.small,
    fontWeight: 700,
    lineHeight: 1.2,
    textTransform: 'none',
    whiteSpace: 'nowrap',
  }

  return (
    <Paper
      component="section"
      data-tour="dashboard-next-meeting"
      variant="outlined"
      sx={{
        width: '100%',
        minWidth: 0,
        p: { xs: 1.5, sm: 2 },
        borderRadius: '12px',
        borderColor: colors.border,
        bgcolor: colors.background,
        boxShadow: 'none',
        transition: 'border-color .15s ease, box-shadow .15s ease',
        '&:hover': {
          boxShadow: '0 4px 14px rgba(20,64,96,.06)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.25,
          minWidth: 0,
        }}
      >
        {/* Meeting icon */}
        <Box
          aria-hidden="true"
          sx={{
            width: 38,
            height: 38,
            flexShrink: 0,
            borderRadius: '10px',
            display: 'grid',
            placeItems: 'center',
            color: colors.icon,
            bgcolor: colors.iconBackground,
          }}
        >
          {isLive ? (
            <VideoCallRoundedIcon sx={{ fontSize: 22 }} />
          ) : (
            <CalendarMonthOutlinedIcon sx={{ fontSize: 21 }} />
          )}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Meeting title and status badge */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 0.75,
              minWidth: 0,
            }}
          >
            <Typography
              component="h3"
              sx={{
                color: COLORS.navy,
                fontSize: FONT.meetingTitle,
                lineHeight: 1.4,
                fontWeight: 750,
                overflowWrap: 'anywhere',
              }}
            >
              {getMeetingTitle(meeting)}
            </Typography>

            <Chip
              size="small"
              label={meetingStatus}
              sx={{
                height: 21,
                flexShrink: 0,
                borderRadius: '7px',
                bgcolor: colors.chipBackground,
                color: colors.chipText,
                border: `1px solid ${colors.border}`,
                fontSize: FONT.caption,
                fontWeight: 750,
                '& .MuiChip-label': { px: 0.9 },
              }}
            />
          </Box>

          {/* Time and platform on the left; MeetAI settings on the right */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              columnGap: 2,
              rowGap: 1,
              mt: 0.75,
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                columnGap: 1.5,
                rowGap: 0.5,
                flex: '1 1 auto',
                minWidth: 0,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                <AccessTimeRoundedIcon
                  sx={{ fontSize: 16, color: COLORS.muted }}
                />
                <Typography
                  sx={{
                    color: '#536F86',
                    fontSize: FONT.small,
                    lineHeight: 1.4,
                    fontWeight: 600,
                  }}
                >
                  {formatRange(meeting.start, meeting.end)}
                </Typography>
              </Box>

              {meeting.platform && (
                <Typography
                  sx={{
                    color: COLORS.muted,
                    fontSize: FONT.small,
                    lineHeight: 1.4,
                  }}
                >
                  {meeting.platform}
                </Typography>
              )}
            </Box>

            {!isDone && (
              <Box
                data-tour="dashboard-meeting-settings"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  flex: '0 0 auto',
                  minWidth: 0,
                  ml: { xs: 'auto', md: 0 },
                }}
              >
                <MeetingToggles
                  meeting={meeting}
                  settings={meetingSettings}
                  onChange={handleSettingsChange}
                />
              </Box>
            )}
          </Box>

          {/* Meeting actions */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
              gap: 1,
              mt: 1.25,
            }}
          >
            <Button
              variant="outlined"
              onClick={openMeeting}
              endIcon={<ChevronRightRoundedIcon />}
              sx={{
                ...buttonSx,
                borderColor: colors.button,
                color: colors.button,
                '&:hover': {
                  borderColor: colors.buttonHover,
                  color: colors.buttonHover,
                  bgcolor: colors.iconBackground,
                },
              }}
            >
              View meeting details
            </Button>

            {isLive && (
              <Button
                data-tour="dashboard-join-meeting"
                variant="contained"
                disableElevation
                onClick={openMeeting}
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  ...buttonSx,
                  bgcolor: colors.button,
                  color: '#fff',
                  '&:hover': { bgcolor: colors.buttonHover },
                }}
              >
                Join meeting
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}
