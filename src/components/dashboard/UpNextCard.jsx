
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import VideoCallRoundedIcon from '@mui/icons-material/VideoCallRounded'

import MeetingToggles from '../MeetingToggles'
import { asDate, formatRange } from '../../utils/time'
import { FONT } from '../../utils/dashboardFonts'

const ICON_SIZE = 40
const ICON_GAP = 12
const BTN_HEIGHT = 30
const BTN_MIN_WIDTH = 180

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
  embedded = false,
  settings = {},
  onSettingsChange,
  status,
}) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  /*
   * Let TourRunner expand this card automatically when the tour
   * reaches the Join meeting step.
   */
  useEffect(() => {
    const handleTourExpand = () => {
      setOpen(true)
    }

    window.addEventListener(
      'meetai-tour-expand-up-next',
      handleTourExpand,
    )

    return () => {
      window.removeEventListener(
        'meetai-tour-expand-up-next',
        handleTourExpand,
      )
    }
  }, [])

  if (!meeting) return null

  const currentTime = asDate(now) ?? new Date()
  const meetingStatus = status || getMeetingStatus(meeting, currentTime)
  const isLive =
    meetingStatus === 'Live' || meetingStatus === 'In progress'
  const isDone = meetingStatus === 'Done'

  const colors = isLive
    ? {
        background: '#F3FAF5',
        border: '#D3E8D9',
        borderHover: '#B9DAC3',
        iconBackground: '#E2F2E6',
        icon: '#247A43',
        title: '#183F29',
        subtitle: '#647D6B',
        chipBackground: '#E3F3E7',
        chipText: '#216B3B',
        button: '#287A45',
        buttonHover: '#1F6337',
      }
    : {
        background: '#F4F8FD',
        border: '#D6E4F3',
        borderHover: '#BCD3EA',
        iconBackground: '#E5EFFB',
        icon: '#286AA5',
        title: '#163C5A',
        subtitle: '#647C91',
        chipBackground: '#E5EFFB',
        chipText: '#245F94',
        button: '#286AA5',
        buttonHover: '#1D5487',
      }

  const meetingSettings =
    settings && typeof settings === 'object' ? settings : {}

  // Sends the selected meeting ID and updated settings to the Dashboard.
  const handleSettingsChange = (changes) => {
    if (meeting.id == null) return
    onSettingsChange?.(meeting.id, changes)
  }

  const openMeeting = () => {
    if (meeting.id == null) return
    navigate(`/meetings/${meeting.id}`)
  }

  const stopDouble = (event) => {
    event.stopPropagation()
  }

  const buttonBase = {
    minHeight: BTN_HEIGHT,
    height: BTN_HEIGHT,
    minWidth: { xs: 0, sm: BTN_MIN_WIDTH },
    flex: { xs: 1, sm: '0 0 auto' },
    px: 3,
    py: 0,
    borderRadius: '8px',
    fontSize: FONT.small,
    fontWeight: 700,
    lineHeight: 1,
    textTransform: 'none',
    whiteSpace: 'nowrap',
    boxShadow: 'none',
  }

  return (
    <Paper
      component="section"
      data-tour="dashboard-next-meeting"
      variant="outlined"
      onDoubleClick={openMeeting}
      title="Double-click to open meeting details"
      sx={{
        width: '100%',
        minWidth: 0,
        p: { xs: 1.75, sm: 2.25 },
        borderRadius: '12px',
        borderColor: colors.border,
        bgcolor: colors.background,
        boxShadow: 'none',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'border-color .15s ease, box-shadow .15s ease',
        '&:hover': {
          borderColor: colors.borderHover,
          boxShadow: '0 4px 14px rgba(20,64,96,.06)',
        },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: `${ICON_SIZE}px minmax(0, 1fr)`,
            sm: `${ICON_SIZE}px minmax(0, 1fr) auto`,
          },
          columnGap: `${ICON_GAP}px`,
          rowGap: 1.25,
          alignItems: 'start',
        }}
      >
        {/* Meeting icon */}
        <Box
          sx={{
            gridColumn: 1,
            gridRow: 1,
            width: ICON_SIZE,
            height: ICON_SIZE,
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

        {/* Status and subtitle */}
        <Box
          sx={{
            gridColumn: { xs: 2, sm: '2 / -1' },
            gridRow: 1,
            minWidth: 0,
            minHeight: ICON_SIZE,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            <Typography
              sx={{
                color: colors.title,
                fontSize: FONT.heading,
                lineHeight: 1.3,
                fontWeight: 750,
              }}
            >
              {isLive ? 'In progress' : isDone ? 'Completed' : 'Up next'}
            </Typography>

            <Chip
              size="small"
              label={meetingStatus}
              sx={{
                height: 22,
                borderRadius: '8px',
                bgcolor: colors.chipBackground,
                color: colors.chipText,
                border: `1px solid ${colors.border}`,
                fontSize: FONT.caption,
                fontWeight: 750,
                '& .MuiChip-label': { px: 0.9 },
              }}
            />

            <IconButton
              size="small"
              onClick={(event) => {
                event.stopPropagation()
                setOpen((value) => !value)
              }}
              onDoubleClick={stopDouble}
              aria-expanded={open}
              aria-label={open ? 'Collapse meeting' : 'Expand meeting'}
              sx={{ ml: 'auto', color: colors.icon }}
            >
              <ExpandMoreRoundedIcon
                sx={{
                  transform: open ? 'rotate(180deg)' : 'none',
                  transition: 'transform .2s',
                }}
              />
            </IconButton>
          </Box>

          <Typography
            sx={{
              mt: 0.2,
              color: colors.subtitle,
              fontSize: FONT.small,
              lineHeight: 1.35,
            }}
          >
            {isLive
              ? 'Your meeting is happening now'
              : isDone
                ? 'This meeting has ended'
                : 'Your next scheduled meeting'}
          </Typography>
        </Box>

        {open && (
          <>
            {/* Meeting title, time and platform */}
            <Box
              sx={{
                gridColumn: 2,
                gridRow: 2,
                minWidth: 0,
              }}
            >
              <Typography
                component="h3"
                sx={{
                  color: '#163C5A',
                  fontSize: FONT.meetingTitle,
                  lineHeight: '28px',
                  fontWeight: 750,
                  overflowWrap: 'anywhere',
                }}
              >
                {getMeetingTitle(meeting)}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  mt: 0.5,
                  color: '#536F86',
                }}
              >
                <AccessTimeRoundedIcon sx={{ fontSize: 17 }} />

                <Typography
                  sx={{
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
                    mt: 0.4,
                    color: '#687F92',
                    fontSize: FONT.small,
                    lineHeight: 1.4,
                  }}
                >
                  {meeting.platform}
                </Typography>
              )}
            </Box>

            {/* MeetAI toggles */}
            {!isDone && (
              <Box
                onDoubleClick={stopDouble}
                sx={{
                  gridColumn: { xs: 2, sm: 3 },
                  gridRow: { xs: 3, sm: 2 },
                  justifySelf: { xs: 'start', sm: 'end' },
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: 28,
                  minWidth: 0,
                }}
              >
                <MeetingToggles
                  meeting={meeting}
                  settings={meetingSettings}
                  onChange={handleSettingsChange}
                />
              </Box>
            )}

            {/* Meeting actions */}
            <Box
              sx={{
                gridColumn: '1 / -1',
                gridRow: { xs: 4, sm: 3 },
                minWidth: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'stretch', sm: 'flex-end' },
                gap: 1,
              }}
            >
              <Button
                variant="outlined"
                onClick={openMeeting}
                onDoubleClick={stopDouble}
                endIcon={
                  <ChevronRightRoundedIcon
                    sx={{ fontSize: '18px !important' }}
                  />
                }
                sx={{
                  ...buttonBase,
                  ml: { xs: 0, sm: 'auto' },
                  borderColor: colors.button,
                  color: colors.button,
                  bgcolor: 'rgba(255,255,255,.6)',
                  '&:hover': {
                    borderColor: colors.buttonHover,
                    color: colors.buttonHover,
                    bgcolor: colors.iconBackground,
                    boxShadow: 'none',
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
                  onDoubleClick={stopDouble}
                  endIcon={
                    <ArrowForwardRoundedIcon
                      sx={{ fontSize: '17px !important' }}
                    />
                  }
                  sx={{
                    ...buttonBase,
                    bgcolor: colors.button,
                    color: '#fff',
                    '&:hover': {
                      bgcolor: colors.buttonHover,
                      boxShadow: 'none',
                    },
                  }}
                >
                  Join meeting
                </Button>
              )}
            </Box>
          </>
        )}
      </Box>
    </Paper>
  )
}
