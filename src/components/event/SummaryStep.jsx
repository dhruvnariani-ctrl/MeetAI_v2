import { Box, Divider, Typography } from '@mui/material'

import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined'

import { C } from './constants'
import { SectionCard, SectionHeading } from './ui'

function SummaryItem({ icon, label, children }) {
  return (
    <Box sx={{ minWidth: 0, display: 'flex', gap: 0.7, alignItems: 'flex-start' }}>
      <Box sx={{ color: C.blue, display: 'flex', mt: 0.1, '& svg': { fontSize: 16 } }}>
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: '0.62rem',
            color: C.muted,
            fontWeight: 750,
            letterSpacing: '0.035em',
            mb: 0.25,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            fontSize: '0.72rem',
            color: C.text,
            fontWeight: 650,
            overflowWrap: 'anywhere',
            lineHeight: 1.4,
          }}
        >
          {children}
        </Typography>
      </Box>
    </Box>
  )
}

const pillSx = {
  px: 1,
  py: 0.55,
  border: `1px solid ${C.border}`,
  borderRadius: '20px',
}

const sectionTitleSx = {
  fontSize: '0.76rem',
  fontWeight: 750,
  color: C.navy,
  mb: 0.8,
}

/* Step 4: read-only review of everything entered so far. */
export default function SummaryStep({ form }) {
  const {
    title,
    dateLabel,
    instant,
    duration,
    start,
    end,
    participants,
    selectedPlatforms,
    inviteMeetAI,
    recordVideo,
  } = form

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto', py: 0.5 }}>
      <SectionCard>
        <SectionHeading
          icon={<EventOutlinedIcon />}
          title="Review your event"
          subtitle="Check the details before creating your event."
        />

        {/* Four-column summary */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr 1fr',
              sm: 'repeat(4, minmax(0, 1fr))',
            },
            gap: { xs: 1.2, sm: 1 },
            '& > *:not(:first-of-type)': {
              borderLeft: { xs: 'none', sm: `1px solid ${C.border}` },
              pl: { xs: 0, sm: 1 },
            },
          }}
        >
          <SummaryItem icon={<EventOutlinedIcon />} label="EVENT">
            {title.trim() || 'Untitled event'}
          </SummaryItem>

          <SummaryItem icon={<ScheduleOutlinedIcon />} label="DATE & TIME">
            {dateLabel}
            {' · '}
            {instant ? `${duration} min · Instant join` : `${start}–${end}`}
          </SummaryItem>

          <SummaryItem icon={<GroupsOutlinedIcon />} label="PARTICIPANTS">
            {participants.length} {participants.length === 1 ? 'person' : 'people'}
          </SummaryItem>

          <SummaryItem icon={<VideoCallOutlinedIcon />} label="PLATFORM">
            {selectedPlatforms.map((p) => p.label).join(', ') ||
              'No platform selected'}
          </SummaryItem>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Typography sx={sectionTitleSx}>Participants</Typography>

        {participants.length > 0 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.65 }}>
            {participants.map((person, index) => {
              const name =
                person.name || person.fullName || person.email || 'Participant'

              return (
                <Box
                  key={person.email || `${name}-${index}`}
                  sx={{
                    ...pillSx,
                    bgcolor: C.paleBlue,
                    color: C.navy,
                    fontSize: '0.72rem',
                  }}
                >
                  {name}
                  {person.you ? ' (You)' : ''}
                </Box>
              )
            })}
          </Box>
        ) : (
          <Typography sx={{ fontSize: '0.72rem', color: C.muted }}>
            No participants added.
          </Typography>
        )}

        <Divider sx={{ my: 1.5 }} />

        <Typography sx={sectionTitleSx}>MeetAI settings</Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
          <Box
            sx={{
              ...pillSx,
              bgcolor: inviteMeetAI ? C.paleGreen : C.bg,
              fontSize: '0.7rem',
              color: C.text,
            }}
          >
            MeetAI: {inviteMeetAI ? 'Invited' : 'Not invited'}
          </Box>

          {inviteMeetAI && (
            <Box sx={{ ...pillSx, bgcolor: C.bg, fontSize: '0.7rem', color: C.text }}>
              Video recording: {recordVideo ? 'Enabled' : 'Disabled'}
            </Box>
          )}

          <Box sx={{ ...pillSx, bgcolor: C.bg, fontSize: '0.7rem', color: C.text }}>
            {instant ? 'Instant Join' : 'Scheduled meeting'}
          </Box>
        </Box>
      </SectionCard>
    </Box>
  )
}