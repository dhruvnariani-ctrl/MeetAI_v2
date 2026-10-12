
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'

import MeetingToggles from '../MeetingToggles'
import MeetingInfo from './MeetingInfo'
import MeetingStatusChip from './MeetingStatusChip'

import {
  getMeetingCardSettings,
  getMeetingCardTheme,
  isDoneMeetingStatus,
  shouldShowMeetingToggles,
  areMeetingTogglesDisabled,
  stopEventPropagation,
  createOpenMeetingHandler,
  handleMeetingCardKeyDown,
} from './meetingHelpers'

export default function MeetingListItem({
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
  const isDone = isDoneMeetingStatus(status)

  const openMeeting = createOpenMeetingHandler(navigate, meeting)

  const onCardKeyDown = (event) => {
    handleMeetingCardKeyDown(event, openMeeting)
  }

  // The toggles column only exists when toggles are shown, so no empty gap.
  const desktopColumns = showToggles
    ? 'minmax(0, 1fr) auto auto 32px'
    : 'minmax(0, 1fr) auto 32px'

  return (
    <Tooltip
      title="Click to open meeting details"
      placement="top"
      arrow
      enterDelay={700}
      enterNextDelay={700}
    >
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
          width: '100%',
          minWidth: 0,
          border: `1px solid ${theme.border}`,
          borderRadius: '14px',
          bgcolor: theme.bg,
          overflow: 'hidden',
          cursor: 'pointer',
          transition:
            'border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease, transform 160ms ease',

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
            borderColor: theme.borderHover,
            bgcolor: theme.bgHover,
            boxShadow: theme.shadow,
            transform: 'translateY(-1px)',
            '& .meeting-list-item-arrow': {
              bgcolor: '#2467A5',
              color: '#FFFFFF',
              transform: 'translateX(2px)',
            },
          },
          '&:active': {
            transform: 'translateY(0)',
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
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr) auto',
              md: desktopColumns,
            },
            alignItems: 'center',
            columnGap: { xs: 1.25, md: 2 },
            rowGap: { xs: 1.25, md: 0 },
            pl: { xs: 2, sm: 2.25 },
            pr: { xs: 1.5, sm: 1.75 },
            py: { xs: 1.35, sm: 1.5 },
          }}
        >
          {/* Meeting title, time, platform and participants */}
          <Box
            sx={{
              gridColumn: 1,
              gridRow: 1,
              minWidth: 0,
              opacity: isDone ? 0.82 : 1,
            }}
          >
            <MeetingInfo meeting={meeting} timeLabel={timeLabel} />
          </Box>

          {/* Status chip */}
          <Box
            onClick={stopEventPropagation}
            onMouseDown={stopEventPropagation}
            onPointerDown={stopEventPropagation}
            sx={{
              gridColumn: 2,
              gridRow: 1,
              alignSelf: 'center',
              justifySelf: 'end',
            }}
          >
            <MeetingStatusChip status={status} />
          </Box>

          {/* MeetAI settings, shown as a soft pill */}
          {showToggles && (
            <Box
              onClick={stopEventPropagation}
              onMouseDown={stopEventPropagation}
              onPointerDown={stopEventPropagation}
              onKeyDown={stopEventPropagation}
              sx={{
                gridColumn: { xs: '1 / 3', md: 3 },
                gridRow: { xs: 2, md: 1 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                minWidth: 0,
              }}
            >
              <Tooltip
                title={togglesDisabled ? 'Meeting already completed' : ''}
                placement="top"
                arrow
              >
                <Box
                  data-tour="dashboard-next-meeting"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    minWidth: 0,
                    maxWidth: '100%',
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
              </Tooltip>
            </Box>
          )}

          {/* Open-details indicator */}
          <Box
            className="meeting-list-item-arrow"
            aria-hidden="true"
            sx={{
              gridColumn: showToggles ? 4 : 3,
              gridRow: 1,
              display: { xs: 'none', md: 'grid' },
              placeItems: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: '#EEF3F8',
              color: '#7D91A5',
              transition:
                'background-color 160ms ease, color 160ms ease, transform 160ms ease',
            }}
          >
            <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>
      </Paper>
    </Tooltip>
  )
}
