import { Box, IconButton, Typography } from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'

import ParticipantPicker from '../instant/ParticipantPicker'

import { C, LABEL_SIZE } from './constants'
import { SectionCard, SectionHeading } from './ui'

/* Step 2: search people, add them, and see who is selected. */
export default function WhoStep({ form, searchDirectory }) {
  const { participants, setParticipants, inviteMeetAI } = form

  return (
    <Box sx={{ maxWidth: 650, mx: 'auto', py: 0.5 }}>
      <SectionCard>
        <SectionHeading
          icon={<GroupsOutlinedIcon />}
          title="Who should attend?"
          subtitle="Search for people and add them to the invitation."
        />

        <ParticipantPicker
          labelFontSize={LABEL_SIZE}
          hint="(invited to this event)"
          note={inviteMeetAI ? undefined : null}
          participants={participants}
          searchDirectory={searchDirectory}
          onAdd={(person) => {
            setParticipants((list) => {
              const email = person?.email?.toLowerCase()

              if (email && list.some((p) => p.email?.toLowerCase() === email)) {
                return list
              }

              return [...list, person]
            })
          }}
          onRemove={(email) =>
            setParticipants((list) =>
              list.filter((person) => person.email !== email),
            )
          }
        />

        {/* Compact participant badges */}
        <Box sx={{ mt: 1.5 }}>
          <Typography sx={{ fontSize: '0.69rem', color: C.muted, mb: 0.7 }}>
            {participants.length === 0
              ? 'No participants added yet'
              : `${participants.length} ${
                  participants.length === 1 ? 'person' : 'people'
                } selected`}
          </Typography>

          {participants.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.65 }}>
              {participants.map((person, index) => {
                const email = person.email || ''
                const displayName =
                  person.name || person.fullName || email || 'Participant'

                return (
                  <Box
                    key={email || `${displayName}-${index}`}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.55,
                      maxWidth: '100%',
                      px: 1,
                      py: 0.55,
                      border: `1px solid ${C.border}`,
                      borderRadius: '20px',
                      bgcolor: C.paleBlue,
                      color: C.navy,
                    }}
                  >
                    <Box
                      sx={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                        bgcolor: '#D9EAF5',
                        color: C.navy,
                        fontSize: '0.63rem',
                        fontWeight: 800,
                      }}
                    >
                      {displayName.charAt(0).toUpperCase()}
                    </Box>

                    <Typography
                      sx={{
                        fontSize: '0.72rem',
                        fontWeight: 650,
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {displayName}
                      {person.you ? ' (You)' : ''}
                    </Typography>

                    <IconButton
                      size="small"
                      aria-label={`Remove ${displayName}`}
                      onClick={() =>
                        setParticipants((list) =>
                          list.filter((p) =>
                            email
                              ? p.email?.toLowerCase() !== email.toLowerCase()
                              : p !== person,
                          ),
                        )
                      }
                      sx={{
                        width: 20,
                        height: 20,
                        ml: 0.1,
                        color: C.muted,
                        '&:hover': { bgcolor: '#DCE8EF', color: C.navy },
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 13 }} />
                    </IconButton>
                  </Box>
                )
              })}
            </Box>
          )}
        </Box>
      </SectionCard>
    </Box>
  )
}