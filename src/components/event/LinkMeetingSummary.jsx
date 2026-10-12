import { Box, Paper, Typography } from '@mui/material'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'

const C = {
  navy: '#123A59',
  blue: '#0967B2',
  muted: '#6D8297',
  border: '#D9E4ED',
  paleBlue: '#EEF5FB',
}

function SummaryItem({ label, value, icon: Icon, last = false }) {
  return (
    <Box
      sx={{
        py: 1,
        borderBottom: last ? 'none' : `1px solid ${C.border}`,
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          mb: 0.35,
          minWidth: 0,
        }}
      >
        {Icon && (
          <Icon
            aria-hidden="true"
            sx={{
              color: C.blue,
              fontSize: 16,
              flexShrink: 0,
            }}
          />
        )}

        <Typography
          component="div"
          sx={{
            color: C.muted,
            fontSize: '0.66rem',
            fontWeight: 700,
            letterSpacing: '.035em',
            lineHeight: 1.4,
            textTransform: 'uppercase',
            overflowWrap: 'anywhere',
          }}
        >
          {label}
        </Typography>
      </Box>

      <Typography
        component="div"
        sx={{
          color: C.navy,
          fontSize: '0.78rem',
          fontWeight: 500,
          lineHeight: 1.5,
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
          pl: Icon ? '22px' : 0,
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}

export default function LinkMeetingSummary({
  title,
  participants = [],
  meetingLink,
  recordVideo,
}) {
  const participantNames = participants
    .map((person) => {
      if (typeof person === 'string') return person

      return (
        person?.name ||
        person?.fullName ||
        person?.email ||
        person?.label ||
        ''
      )
    })
    .filter(Boolean)

  const participantText =
    participantNames.length > 0
      ? participantNames.join(', ')
      : 'No participants selected'

  const cleanLink =
    typeof meetingLink === 'string' ? meetingLink.trim() : ''

  return (
    <Paper
      variant="outlined"
      sx={{
        width: '100%',
        height: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        p: { xs: 1.5, sm: 1.75 },
        borderColor: C.border,
        borderRadius: '14px',
        boxShadow: 'none',
        bgcolor: '#fff',
      }}
    >
      {/* Compact heading */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 0.6,
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
            bgcolor: C.paleBlue,
            color: C.blue,
            borderRadius: '9px',
          }}
        >
          <CalendarMonthOutlinedIcon sx={{ fontSize: 18 }} />
        </Box>

        <Typography
          component="h2"
          sx={{
            color: C.navy,
            fontSize: '0.95rem',
            fontWeight: 750,
            lineHeight: 1.3,
          }}
        >
          Meeting summary
        </Typography>
      </Box>

      <SummaryItem
        label="Meeting title"
        value={title?.trim() || 'Untitled meeting'}
      />

      <SummaryItem
        label={`Participants (${participantNames.length})`}
        value={participantText}
        icon={GroupsOutlinedIcon}
      />

      <SummaryItem
        label="Meeting link"
        value={
          cleanLink ? (
            <Box
              component="a"
              href={cleanLink}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: C.blue,
                textDecoration: 'none',
                overflowWrap: 'anywhere',
                wordBreak: 'break-word',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {cleanLink}
            </Box>
          ) : (
            'Link not provided'
          )
        }
        icon={LinkOutlinedIcon}
      />

      <SummaryItem
        label="Video recording"
        value={recordVideo ? 'Enabled' : 'Disabled'}
        icon={VideocamOutlinedIcon}
        last
      />
    </Paper>
  )
}