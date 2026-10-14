import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import { splitAttendees } from './designHelpers'

const NAVY = '#123A59'
const MUTED = '#6E8397'
const BORDER = '#DFE8F0'

function initials(name = '') {
  return (
    String(name)
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || '?'
  )
}

function PersonRow({ person, muted = false }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        minWidth: 0,
        opacity: muted ? 0.85 : 1,
      }}
    >
      <Avatar
        src={person.avatar || undefined}
        alt={person.name}
        sx={{
          width: 40,
          height: 40,
          flexShrink: 0,
          bgcolor: '#E3EEF8',
          color: '#245F94',
          fontSize: '0.8125rem',
          fontWeight: 700,
        }}
      >
        {initials(person.name)}
      </Avatar>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            color: NAVY,
            fontSize: '0.8125rem',
            fontWeight: 700,
            lineHeight: 1.35,
            overflowWrap: 'anywhere',
          }}
        >
          {person.name}
        </Typography>

        {person.role && (
          <Typography
            sx={{ color: MUTED, fontSize: '0.75rem', lineHeight: 1.35 }}
          >
            {person.role}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

function PeopleCard({ title, people, emptyText, muted }) {
  return (
    <Paper
      elevation={0}
      sx={{
        minWidth: 0,
        p: { xs: 1.75, md: 2 },
        border: `1px solid ${BORDER}`,
        borderRadius: '12px',
        bgcolor: '#FFFFFF',
      }}
    >
      <Typography
        component="h3"
        sx={{
          mb: 1.5,
          color: NAVY,
          fontSize: '0.875rem',
          fontWeight: 800,
        }}
      >
        {title} ({people.length})
      </Typography>

      {people.length === 0 ? (
        <Typography sx={{ color: MUTED, fontSize: '0.8125rem' }}>
          {emptyText}
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.6 }}>
          {people.map((person, index) => (
            <PersonRow
              key={`${person.name}-${index}`}
              person={person}
              muted={muted}
            />
          ))}
        </Box>
      )}
    </Paper>
  )
}

/**
 * Attendees on the left, "Not attending" on the right.
 * For a meeting that hasn't happened yet, shows a single "Invited" card.
 */
export default function AttendeesPanel({
  attendance,
  participants = [],
  upcoming = false,
  dataTour,
}) {
  const { attending, notAttending } = splitAttendees(attendance, participants)

  if (upcoming) {
    return (
      <Box data-tour={dataTour}>
        <PeopleCard
          title="Invited"
          people={[...attending, ...notAttending]}
          emptyText="No participants have been added."
        />
      </Box>
    )
  }

  return (
    <Box
      data-tour={dataTour}
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          sm: 'repeat(2, minmax(0, 1fr))',
        },
        gap: 1.5,
        alignItems: 'stretch',
      }}
    >
      <PeopleCard
        title="Attendees"
        people={attending}
        emptyText="No one attended this meeting."
      />

      <PeopleCard
        title="Not attending"
        people={notAttending}
        emptyText="Everyone attended."
        muted
      />
    </Box>
  )
}