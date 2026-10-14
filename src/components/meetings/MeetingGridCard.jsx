
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'

import MeetingToggles from '../MeetingToggles'
import MeetingInfo from './MeetingInfo'
import MeetingStatusChip from './MeetingStatusChip'

import {
  getMeetingCardSettings,
  getMeetingCardTheme,
  shouldShowMeetingToggles,
  areMeetingTogglesDisabled,
  stopEventPropagation,
  createOpenMeetingHandler,
  handleMeetingCardKeyDown,
} from './meetingHelpers'

export default function MeetingGridCard({
  meeting,
  status,
  timeLabel,
  settings = {},
  onSettingsChange,
  tourTarget = false,
}) {
  const navigate = useNavigate()

  if (!meeting) return null

  const meetingSettings = getMeetingCardSettings(settings, meeting)

  const togglesDisabled = areMeetingTogglesDisabled(status)
  const showToggles = shouldShowMeetingToggles(status)
  const theme = getMeetingCardTheme(status)

  const openMeeting = createOpenMeetingHandler(navigate, meeting)

  const onCardKeyDown = (event) => {
    handleMeetingCardKeyDown(event, openMeeting)
  }

  return (
    <Paper
      data-tour={tourTarget ? 'calendar-meeting' : undefined}
      role="button"
      tabIndex={0}
      aria-label={`Open meeting details for ${meeting.title}`}
      elevation={0}
      onClick={openMeeting}
      onKeyDown={onCardKeyDown}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minWidth: 0,
        border: `1px solid ${theme.border}`,
        borderRadius: '12px',
        bgcolor: theme.bg,
        overflow: 'hidden',
        cursor: 'pointer',
        transition:
          'border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: 4,
          bgcolor: theme.accent,
        },
        '&:hover': {
          borderColor: '#B8D0E4',
          boxShadow: '0 4px 14px rgba(18, 58, 89, 0.08)',
          transform: 'translateY(-1px)',
          '& .meeting-grid-card-arrow': {
            bgcolor: '#2467A5',
            color: '#FFFFFF',
            transform: 'translateX(2px)',
          },
        },
        '&:focus-visible': {
          outline: '2px solid #2467A5',
          outlineOffset: '2px',
        },
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
          '&:hover': { transform: 'none' },
        },
      }}
    >
      {/* Top: meeting info on the left, status chip on the right */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 1.25,
          pl: 2.25,
          pr: 1.5,
          pt: 1.5,
          pb: 1.25,
          minWidth: 0,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <MeetingInfo meeting={meeting} timeLabel={timeLabel} />
        </Box>

        <Box
          onClick={stopEventPropagation}
          onMouseDown={stopEventPropagation}
          onPointerDown={stopEventPropagation}
          sx={{ flexShrink: 0 }}
        >
          <MeetingStatusChip status={status} />
        </Box>
      </Box>

      {/* Bottom: MeetAI settings on the left, arrow on the right */}
      <Box
        sx={{
          mt: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          pl: 2.25,
          pr: 1.5,
          py: 1,
          borderTop: '1px solid #EDF2F6',
          minHeight: 52,
        }}
      >
        {showToggles ? (
          <Box
            onClick={stopEventPropagation}
            onMouseDown={stopEventPropagation}
            onPointerDown={stopEventPropagation}
            onKeyDown={stopEventPropagation}
            data-tour="dashboard-next-meeting"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              minWidth: 0,
              px: 1.5,
              py: 0.25,
              borderRadius: '999px',
              border: '1px solid #E3ECF3',
              bgcolor: 'rgba(244, 248, 251, 0.9)',
              opacity: togglesDisabled ? 0.6 : 1,
              cursor: togglesDisabled ? 'not-allowed' : 'default',
            }}
          >
            <MeetingToggles
              meeting={meeting}
              settings={meetingSettings}
              onChange={(changes) =>
                onSettingsChange?.(meeting.id, changes)
              }
              disabled={togglesDisabled}
            />
          </Box>
        ) : (
          <Box />
        )}

        <Box
          className="meeting-grid-card-arrow"
          aria-hidden="true"
          sx={{
            display: 'grid',
            placeItems: 'center',
            width: 30,
            height: 30,
            flexShrink: 0,
            borderRadius: '50%',
            bgcolor: '#EEF3F8',
            color: '#7D91A5',
            transition:
              'background-color 160ms ease, color 160ms ease, transform 160ms ease',
          }}
        >
          <ArrowForwardRoundedIcon sx={{ fontSize: 17 }} />
        </Box>
      </Box>
    </Paper>
  )
}
