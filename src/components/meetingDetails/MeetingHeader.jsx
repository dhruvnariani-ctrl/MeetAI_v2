import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded'

import {
  getMeetingLink,
  getStatusChip,
  isMeetingEnded,
} from './designHelpers'

const NAVY = '#123A59'
const MUTED = '#6E8397'
const BORDER = '#DFE8F0'

export default function MeetingHeader({
  meeting,
  meetingState,
  meetAIInvited = false,
  timeText,
  durationMinutes,
}) {
  const status = getStatusChip(meetingState)
  const link = getMeetingLink(meeting)
  const ended = isMeetingEnded(meetingState)
  const participantCount = meeting.participants?.length ?? 0

  const metaItems = [
    timeText,
    meeting.platform,
    `${participantCount} ${participantCount === 1 ? 'participant' : 'participants'}`,
  ].filter(Boolean)

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          md: 'minmax(0, 1fr) 230px',
        },
        alignItems: 'center',
        gap: { xs: 1.75, md: 2.5 },
        p: { xs: 1.75, md: 2.25 },
        border: `1px solid ${BORDER}`,
        borderRadius: '16px',
        bgcolor: '#FFFFFF',
      }}
    >
      {/* Icon, title, meta and status */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.75,
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
            borderRadius: '50%',
            bgcolor: '#E5F3EA',
            color: '#1F7A45',
          }}
        >
          <CalendarMonthOutlinedIcon sx={{ fontSize: 28 }} />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            component="h1"
            sx={{
              color: NAVY,
              fontSize: { xs: '1.15rem', md: '1.3rem' },
              lineHeight: 1.3,
              fontWeight: 800,
              letterSpacing: '-0.01em',
              overflowWrap: 'anywhere',
            }}
          >
            {meeting.title || 'Untitled meeting'}
          </Typography>

          {/* Items separated by dots; wrapping never leaves a dangling dot */}
          <Box sx={{ mt: 0.5, overflow: 'hidden' }}>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                rowGap: 0.25,
                ml: '-14px',
              }}
            >
              {metaItems.map((item) => (
                <Typography
                  key={item}
                  component="span"
                  sx={{
                    position: 'relative',
                    pl: '14px',
                    color: MUTED,
                    fontSize: '0.8rem',
                    lineHeight: 1.5,
                    whiteSpace: 'nowrap',
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
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>

        <Chip
          label={status.label}
          sx={{
            flexShrink: 0,
            height: 32,
            px: 0.75,
            borderRadius: '999px',
            bgcolor: status.bgcolor,
            color: status.color,
            fontSize: '0.8rem',
            fontWeight: 750,
          }}
        />
      </Box>

      {/* MeetAI card */}
      <Box
        sx={{
          p: 1.25,
          border: `1px solid ${BORDER}`,
          borderRadius: '14px',
          bgcolor: '#F8FBFD',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.9,
            mb: 1.1,
          }}
        >
          <Box
            sx={{
              display: 'grid',
              placeItems: 'center',
              width: 26,
              height: 26,
              borderRadius: '8px',
              bgcolor: '#E5EFFB',
              color: '#1769AA',
            }}
          >
            <AutoAwesomeOutlinedIcon sx={{ fontSize: 16 }} />
          </Box>

          <Typography
            sx={{ color: NAVY, fontSize: '0.84rem', fontWeight: 800 }}
          >
            MeetAI
          </Typography>

          <Chip
            size="small"
            label={meetAIInvited ? 'Invited' : 'Not invited'}
            sx={{
              height: 22,
              ml: 'auto',
              borderRadius: '7px',
              bgcolor: meetAIInvited ? '#E3F3E7' : '#EEF2F6',
              color: meetAIInvited ? '#216B3B' : '#52657D',
              fontSize: '0.7rem',
              fontWeight: 750,
              '& .MuiChip-label': { px: 0.9 },
            }}
          />
        </Box>

        {/* The span lets the tooltip show even while the button is disabled */}
        <Tooltip
          title={ended ? 'This meeting has ended' : !link ? 'No meeting link available' : ''}
          placement="bottom"
          arrow
        >
          <Box component="span" sx={{ display: 'block' }}>
            <Button
              fullWidth
              variant="contained"
              disableElevation
              disabled={!link || ended}
              endIcon={<OpenInNewRoundedIcon sx={{ fontSize: 16 }} />}
              onClick={() => window.open(link, '_blank', 'noopener,noreferrer')}
              sx={{
                minHeight: 38,
                borderRadius: '10px',
                bgcolor: '#075A9C',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': { bgcolor: '#064A80' },
                '&.Mui-disabled': { bgcolor: '#EDF1F5', color: '#9AA9B7' },
              }}
            >
              Open Meeting
            </Button>
          </Box>
        </Tooltip>
      </Box>
    </Paper>
  )
}