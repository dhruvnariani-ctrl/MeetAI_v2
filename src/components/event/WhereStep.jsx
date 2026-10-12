import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Paper,
  Typography,
} from '@mui/material'

import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import EnergySavingsLeafOutlinedIcon from '@mui/icons-material/EnergySavingsLeafOutlined'
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined'

import { labelSx } from '../instant/FormField'

import { C, LABEL_SIZE, PLATFORMS } from './constants'
import { SectionCard, SectionHeading } from './ui'

function PlatformOption({ platform, selected, onClick }) {
  return (
    <Paper
      component="button"
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      variant="outlined"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.8,
        p: 0.8,
        width: '100%',
        textAlign: 'left',
        font: 'inherit',
        cursor: 'pointer',
        borderRadius: '9px',
        borderColor: selected ? C.blue : C.border,
        bgcolor: selected ? C.paleBlue : '#fff',
        '&:hover': { borderColor: C.blue },
        '&:focus-visible': {
          outline: `2px solid ${C.blue}`,
          outlineOffset: 2,
        },
      }}
    >
      <Checkbox
        checked={selected}
        readOnly
        tabIndex={-1}
        disableRipple
        size="small"
        sx={{
          p: 0,
          pointerEvents: 'none',
          color: C.muted,
          '&.Mui-checked': { color: C.blue },
        }}
      />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: '0.76rem', fontWeight: 700, color: C.navy }}>
          {platform.label}
        </Typography>

        <Typography sx={{ fontSize: '0.67rem', color: C.muted }}>
          {platform.description}
        </Typography>
      </Box>

      {selected && <CheckCircleRoundedIcon sx={{ fontSize: 16, color: C.blue }} />}
    </Paper>
  )
}

/* Step 3: meeting platform and the MeetAI assistant options. */
export default function WhereStep({ form, compactHeight }) {
  const {
    platforms,
    togglePlatform,
    errors,
    inviteMeetAI,
    setInviteMeetAI,
    recordVideo,
    setRecordVideo,
  } = form

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'minmax(0, 1fr) minmax(0, 1fr)',
        },
        alignItems: 'start',
        gap: compactHeight ? 0.9 : 1.1,
        py: 0.5,
      }}
    >
      <SectionCard>
        <SectionHeading
          icon={<VideoCallOutlinedIcon />}
          title="Where will you meet?"
          subtitle="Choose at least one platform."
        />

        <FormControl
          component="fieldset"
          required
          error={!!errors.platforms}
          variant="standard"
          fullWidth
        >
          <FormLabel
            component="legend"
            sx={{ ...labelSx, fontSize: LABEL_SIZE, mb: 0.8 }}
          >
            Meeting platform
          </FormLabel>

          <FormGroup sx={{ gap: 0.7 }}>
            {PLATFORMS.map((platform) => (
              <PlatformOption
                key={platform.id}
                platform={platform}
                selected={!!platforms[platform.id]}
                onClick={() => togglePlatform(platform.id)}
              />
            ))}
          </FormGroup>

          {errors.platforms && (
            <FormHelperText role="alert" sx={{ mx: 0 }}>
              {errors.platforms}
            </FormHelperText>
          )}
        </FormControl>
      </SectionCard>

      <SectionCard sx={{ borderColor: '#D7E7DB' }}>
        <SectionHeading
          icon={<AutoAwesomeOutlinedIcon />}
          title="MeetAI assistant"
          subtitle="Let MeetAI help after your meeting."
        />

        <Box sx={{ p: 1, borderRadius: '9px', bgcolor: C.paleGreen }}>
          <FormControlLabel
            sx={{
              ml: -0.5,
              my: -0.25,
              '& .MuiFormControlLabel-label': {
                fontSize: '0.79rem',
                fontWeight: 750,
                color: C.navy,
              },
            }}
            control={
              <Checkbox
                size="small"
                checked={inviteMeetAI}
                onChange={(e) => {
                  setInviteMeetAI(e.target.checked)

                  if (!e.target.checked) {
                    setRecordVideo(false)
                  }
                }}
                sx={{ '&.Mui-checked': { color: C.green } }}
              />
            }
            label="Invite MeetAI"
          />

          <Typography
            sx={{
              ml: 3.5,
              fontSize: '0.71rem',
              lineHeight: 1.45,
              color: '#506B5A',
            }}
          >
            Capture the transcript and prepare meeting minutes (MoM) and action
            items.
          </Typography>

          {inviteMeetAI && (
            <>
              <Divider sx={{ my: 1, borderColor: '#D7E7DB' }} />

              <FormControlLabel
                sx={{
                  ml: -0.5,
                  my: -0.25,
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.75rem',
                    fontWeight: 650,
                    color: C.navy,
                  },
                }}
                control={
                  <Checkbox
                    size="small"
                    checked={recordVideo}
                    onChange={(e) => setRecordVideo(e.target.checked)}
                    sx={{ '&.Mui-checked': { color: C.green } }}
                  />
                }
                label="Enable video recording"
              />

              <Typography sx={{ ml: 3.5, fontSize: '0.68rem', color: '#506B5A' }}>
                Separate video file · 7-day retention
              </Typography>
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 0.65, mt: 1, alignItems: 'flex-start' }}>
          <EnergySavingsLeafOutlinedIcon
            sx={{ color: C.green, fontSize: 16, flexShrink: 0 }}
          />

          <Typography sx={{ fontSize: '0.69rem', color: C.muted, lineHeight: 1.45 }}>
            Spend less time writing notes and more time on your work.
          </Typography>
        </Box>
      </SectionCard>
    </Box>
  )
}