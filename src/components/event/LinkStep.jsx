import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import VideoCameraBackOutlinedIcon from '@mui/icons-material/VideoCameraBackOutlined'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'

import FormField from '../instant/FormField'
import ParticipantPicker from '../instant/ParticipantPicker'

import { C } from './constants'

const titleSx = {
  fontSize: '0.875rem',
  fontWeight: 750,
  color: C.navy,
  lineHeight: 1.35,
}

function SectionCard({ children, sx = {} }) {
  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 1.75 },
        border: `1px solid ${C.border}`,
        borderRadius: '12px',
        bgcolor: '#fff',
        minWidth: 0,
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

function SectionIntro({ icon, title, subtitle, compact = false }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: compact ? 1 : 1.25,
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '10px',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          color: C.blue,
          bgcolor: C.paleBlue,
          '& svg': { fontSize: 20 },
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography sx={titleSx}>{title}</Typography>
        <Typography
          sx={{
            mt: 0.25,
            fontSize: '0.75rem',
            lineHeight: 1.45,
            color: C.muted,
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Box>
  )
}

function SummaryItem({ label, children }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          mb: 0.4,
          fontSize: '0.75rem',
          fontWeight: 750,
          letterSpacing: '0.045em',
          color: C.muted,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: '0.8125rem',
          lineHeight: 1.5,
          color: C.navy,
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
        }}
      >
        {children || 'Not provided'}
      </Typography>
    </Box>
  )
}

export default function LinkStep({
  form,
  searchDirectory,
  step = 0,
}) {
  const {
    link,
    setLink,
    linkError,
    setLinkError,
    linkRef,
    linkTitle,
    setLinkTitle,
    participants,
    setParticipants,
    linkRecordVideo,
    setLinkRecordVideo,
  } = form

  const addParticipant = (person) => {
    setParticipants((current) => {
      const exists = current.some(
        (item) => item.email === person.email,
      )

      return exists ? current : [...current, person]
    })
  }

  const removeParticipant = (email) => {
    setParticipants((current) =>
      current.filter(
        (person) => person.email !== email || person.you,
      ),
    )
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1120,
        mx: 'auto',
        py: 0,
        minWidth: 0,
      }}
    >
      {/* STEP 1 — MEETING LINK */}
      {step === 0 && (
        <Box>
          <SectionIntro
            icon={<LinkOutlinedIcon />}
            title="Connect your meeting"
            subtitle="Paste the invitation link. MeetAI will identify the platform."
          />

          <SectionCard>
            <Box sx={{ display: 'grid', gap: 1.5 }}>
              <FormField
                label="Meeting link"
                required
                ref={linkRef}
                autoFocus
                type="url"
                value={link}
                onChange={(event) => {
                  setLink(event.target.value)
                  if (linkError) setLinkError(false)
                }}
                error={linkError}
                placeholder="Paste your Zoom, Google Meet, or Teams link"
                startIcon={<LinkOutlinedIcon sx={{ fontSize: 19 }} />}
                helper={
                  linkError
                    ? 'Enter a valid Zoom, Google Meet, or Microsoft Teams link.'
                    : 'Supported platforms: Zoom, Google Meet, and Microsoft Teams.'
                }
              />

              <FormField
                label="Meeting title"
                optional
                value={linkTitle}
                onChange={(event) => setLinkTitle(event.target.value)}
                placeholder="e.g. Weekly team review"
              />
            </Box>
          </SectionCard>

          <Box
            sx={{
              mt: 1.25,
              px: 1.25,
              py: 1,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 0.8,
              bgcolor: C.paleBlue,
              border: '1px solid #DCE8F1',
              borderRadius: '10px',
            }}
          >
            <InfoOutlinedIcon
              sx={{ fontSize: 18, color: C.blue, mt: '1px' }}
            />
            <Typography
              sx={{
                fontSize: '0.75rem',
                lineHeight: 1.5,
                color: C.text,
              }}
            >
              You can add participants and review MeetAI settings in the
              next steps.
            </Typography>
          </Box>
        </Box>
      )}

      {/* STEP 2 — PARTICIPANTS */}
      {step === 1 && (
        <Box>
          <SectionIntro
            icon={<PeopleAltOutlinedIcon />}
            title="Choose participants"
            subtitle="Add colleagues who should be included in this meeting."
          />

          <SectionCard>
            <ParticipantPicker
              participants={participants}
              searchDirectory={searchDirectory}
              onAdd={addParticipant}
              onRemove={removeParticipant}
            />

            <Typography
              sx={{
                mt: 1,
                fontSize: '0.75rem',
                lineHeight: 1.5,
                color: C.muted,
              }}
            >
              {participants.length}{' '}
              {participants.length === 1 ? 'person' : 'people'} selected.
              These colleagues can be included in the meeting follow-up.
            </Typography>
          </SectionCard>
        </Box>
      )}

      {/* STEP 3 — TWO-COLUMN REVIEW */}
      {step === 2 && (
        <Box sx={{ minWidth: 0 }}>
          <SectionIntro
            icon={<CheckCircleOutlineRoundedIcon />}
            title="MeetAI & review"
            subtitle="Check your meeting details and recording preferences before joining."
            compact
          />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'minmax(0, 1fr)',
                md: 'minmax(0, 1fr) minmax(0, 1fr)',
              },
              gap: 1.5,
              alignItems: 'stretch',
            }}
          >
            {/* LEFT COLUMN — MEETAI SETTINGS */}
            <SectionCard
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                height: '100%',
                boxSizing: 'border-box',
              }}
            >
              <Typography
                component="h3"
                sx={{
                  ...titleSx,
                  fontSize: '1rem',
                }}
              >
                MeetAI settings
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.25,
                }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    borderRadius: '10px',
                    bgcolor: C.paleGreen,
                    color: C.green,
                  }}
                >
                  <CheckCircleOutlineRoundedIcon sx={{ fontSize: 21 }} />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 750,
                      lineHeight: 1.4,
                      color: C.navy,
                    }}
                  >
                    MeetAI transcription is enabled
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,
                      fontSize: '0.8125rem',
                      lineHeight: 1.55,
                      color: C.muted,
                    }}
                  >
                    Your meeting transcript, minutes, and action items can
                    be prepared after the meeting.
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  height: '1px',
                  bgcolor: C.border,
                  flexShrink: 0,
                }}
              />

              <Box>
                <FormControlLabel
                  sx={{
                    m: 0,
                    alignItems: 'flex-start',
                    '& .MuiFormControlLabel-label': {
                      pt: '3px',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      lineHeight: 1.45,
                      color: C.navy,
                    },
                  }}
                  control={
                    <Checkbox
                      size="small"
                      checked={Boolean(linkRecordVideo)}
                      onChange={(event) =>
                        setLinkRecordVideo(event.target.checked)
                      }
                      sx={{
                        pt: 0.25,
                        color: C.muted,
                        '&.Mui-checked': { color: C.green },
                      }}
                    />
                  }
                  label={
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 0.75,
                      }}
                    >
                      <VideoCameraBackOutlinedIcon
                        sx={{
                          mt: '2px',
                          fontSize: 18,
                          color: C.green,
                          flexShrink: 0,
                        }}
                      />
                      <Box>
                        <Typography
                          component="span"
                          sx={{
                            fontSize: '0.8125rem',
                            fontWeight: 700,
                            color: C.navy,
                          }}
                        >
                          Also enable video recording
                        </Typography>
                      </Box>
                    </Box>
                  }
                />

                <Typography
                  sx={{
                    ml: 4.5,
                    mt: 0.35,
                    fontSize: '0.75rem',
                    lineHeight: 1.5,
                    color: C.muted,
                  }}
                >
                  Optional. Video recording remains off unless enabled.
                </Typography>
              </Box>

              <Box
                sx={{
                  mt: 'auto',
                  px: 1.25,
                  py: 1,
                  borderRadius: '10px',
                  bgcolor: linkRecordVideo ? C.paleGreen : C.paleBlue,
                  border: '1px solid',
                  borderColor: linkRecordVideo ? '#CDE8D8' : '#DCE8F1',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    lineHeight: 1.5,
                    fontWeight: 600,
                    color: C.navy,
                  }}
                >
                  {linkRecordVideo
                    ? 'Transcription and video recording are enabled.'
                    : 'Transcription is enabled. Video recording is off.'}
                </Typography>
              </Box>
            </SectionCard>

            {/* RIGHT COLUMN — MEETING SUMMARY */}
            <SectionCard
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.75,
                height: '100%',
                boxSizing: 'border-box',
              }}
            >
              <Typography
                component="h3"
                sx={{
                  ...titleSx,
                  fontSize: '1rem',
                }}
              >
                Meeting summary
              </Typography>

              <SummaryItem label="Meeting title">
                {linkTitle.trim() || 'Untitled meeting'}
              </SummaryItem>

              <Box sx={{ height: '1px', bgcolor: C.border }} />

              <SummaryItem label="Participants">
                {participants.length}{' '}
                {participants.length === 1 ? 'person' : 'people'} selected
              </SummaryItem>

              <Box sx={{ height: '1px', bgcolor: C.border }} />

              <SummaryItem label="Meeting link">
                {link.trim() || 'No meeting link entered'}
              </SummaryItem>

              <Box sx={{ height: '1px', bgcolor: C.border }} />

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'minmax(0, 1fr)',
                    sm: 'minmax(0, 1fr) minmax(0, 1fr)',
                  },
                  gap: 1.5,
                }}
              >
                <SummaryItem label="Video recording">
                  {linkRecordVideo ? 'Enabled' : 'Off'}
                </SummaryItem>

                <SummaryItem label="Meeting notes">
                  MeetAI transcription enabled
                </SummaryItem>
              </Box>
            </SectionCard>
          </Box>
        </Box>
      )}
    </Box>
  )
}