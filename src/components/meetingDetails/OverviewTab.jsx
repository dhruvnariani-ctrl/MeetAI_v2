
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'

import AttendeesPanel from './AttendeesPanel'
import MeetingActionsHero from './MeetingActionHero'
import { getMeetingLink, isMeetingEnded } from './designHelpers'
import { NotReadyMessage } from './ui'

const NAVY = '#123A59'
const MUTED = '#6E8397'
const BORDER = '#DFE8F0'

function InfoItem({ icon, label, children }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.7,
          color: '#3776A9',
          '& svg': { fontSize: 17 },
        }}
      >
        {icon}
        <Typography
          component="span"
          sx={{ color: MUTED, fontSize: '0.75rem', fontWeight: 650 }}
        >
          {label}
        </Typography>
      </Box>

      <Box sx={{ mt: 0.6, pl: '24px', minWidth: 0 }}>{children}</Box>
    </Box>
  )
}

const valueSx = {
  color: NAVY,
  fontSize: '0.8125rem',
  fontWeight: 700,
  lineHeight: 1.5,
  overflowWrap: 'anywhere',
}

export default function OverviewTab({
  meeting,
  meetingState,
  attendance,
  durationMinutes,
  onSelectTab,
}) {
  const summary = meeting.meetingSummary
  const link = getMeetingLink(meeting)
  const isUpcoming = meetingState?.type === 'upcoming'
  const ended = isMeetingEnded(meetingState)

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          lg: 'minmax(0, 1fr) 340px',
          xl: 'minmax(0, 1fr) 380px',
        },
        gap: 2,
        alignItems: 'stretch',
      }}
    >
      {/* Left: summary + attendees */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          minWidth: 0,
        }}
      >
        <Paper
          data-tour="meeting-content"
          elevation={0}
          sx={{
            p: { xs: 1.75, md: 2.25 },
            border: `1px solid ${BORDER}`,
            borderRadius: '12px',
            bgcolor: '#FFFFFF',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 1.25,
            }}
          >
            <NotesOutlinedIcon sx={{ fontSize: 20, color: '#1769AA' }} />

            <Typography
              component="h2"
              sx={{ color: NAVY, fontSize: '1rem', fontWeight: 800 }}
            >
              Meeting Summary
            </Typography>
          </Box>

          {summary ? (
            <Typography
              sx={{
                color: '#425D74',
                fontSize: '0.8125rem',
                lineHeight: 1.75,
                whiteSpace: 'pre-line',
              }}
            >
              {summary}
            </Typography>
          ) : isUpcoming ? (
            <NotReadyMessage>
              The meeting summary will appear here after the meeting has taken place.
            </NotReadyMessage>
          ) : (
            <NotReadyMessage>
              No meeting summary is available for this meeting.
            </NotReadyMessage>
          )}

          {/* Duration, platform and link */}
          <Box
            sx={{
              mt: 2,
              pt: 1.75,
              borderTop: `1px solid ${BORDER}`,
              display: 'grid',
              gridTemplateColumns: {
                xs: 'minmax(0, 1fr)',
                sm: 'repeat(3, minmax(0, 1fr))',
              },
              gap: 2,
            }}
          >
            <InfoItem icon={<AccessTimeOutlinedIcon />} label="Duration">
              <Typography sx={valueSx}>{durationMinutes} minutes</Typography>
            </InfoItem>

            <InfoItem icon={<VideocamOutlinedIcon />} label="Platform">
              <Typography sx={valueSx}>
                {meeting.platform || 'Not specified'}
              </Typography>
            </InfoItem>

            <InfoItem icon={<LinkRoundedIcon />} label="Meeting Link">
              {link ? (
                <Link
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{
                    ...valueSx,
                    display: 'block',
                    color: '#1565C0',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                  }}
                >
                  {link}
                </Link>
              ) : (
                <Typography
                  sx={{ ...valueSx, color: MUTED, fontWeight: 500 }}
                >
                  Not available
                </Typography>
              )}
            </InfoItem>
          </Box>
        </Paper>

        <AttendeesPanel
          dataTour="meeting-participants"
          attendance={attendance}
          participants={meeting.participants || []}
          upcoming={isUpcoming}
        />
      </Box>

      {/* Right: match the combined height of the left panels */}
      <Box
        sx={{
          minWidth: 0,
          height: '100%',
        }}
      >
        <MeetingActionsHero
          ended={ended}
          joinDisabled={!link}
          onJoin={() => window.open(link, '_blank', 'noopener,noreferrer')}
          onRecording={() => onSelectTab?.('recording')}
          onTranscript={() => onSelectTab?.('transcript')}
          onActions={() => onSelectTab?.('actions')}
        />
      </Box>
    </Box>
  )
}