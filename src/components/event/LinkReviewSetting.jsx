import { useState } from 'react'
import {
  Box,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
} from '@mui/material'

import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import EnergySavingsLeafOutlinedIcon from '@mui/icons-material/EnergySavingsLeafOutlined'

const C = {
  navy: '#123A59',
  green: '#16815B',
  blue: '#2F7DD1',
  muted: '#6D8297',
  body: '#55697C',
  paleGreen: '#EEF6F0',
  paleGreenLine: '#D3E4D8',
  paleBlue: '#EAF3FB',
}

function OptionRow({ checked, onChange, title, description, ariaLabel }) {
  return (
    <Box>
      <FormControlLabel
        sx={{
          m: 0,
          width: '100%',
          alignItems: 'center',
          '& .MuiCheckbox-root': {
            p: 0.4,
            mr: 0.75,
            color: C.body,
            '&.Mui-checked': { color: C.green },
          },
          '& .MuiSvgIcon-root': { fontSize: 20 },
          '& .MuiFormControlLabel-label': { minWidth: 0, flex: 1 },
        }}
        control={
          <Checkbox
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            inputProps={{ 'aria-label': ariaLabel }}
          />
        }
        label={
          <Typography
            sx={{
              color: C.navy,
              fontSize: '0.875rem',
              fontWeight: 700,
              lineHeight: 1.4,
            }}
          >
            {title}
          </Typography>
        }
      />

      <Typography
        sx={{
          mt: 0.5,
          ml: 0.4,
          color: C.body,
          fontSize: '0.75rem',
          lineHeight: 1.5,
        }}
      >
        {description}
      </Typography>
    </Box>
  )
}

export default function LinkReviewSettings({
  inviteMeetAI: inviteProp,
  setInviteMeetAI: setInviteProp,
  recordVideo,
  setRecordVideo,
}) {
  // Works controlled (if parent passes props) or standalone (own state)
  const [inviteLocal, setInviteLocal] = useState(true)
  const [videoLocal, setVideoLocal] = useState(false)

  const invite = inviteProp ?? inviteLocal
  const setInvite = setInviteProp ?? setInviteLocal
  const video = recordVideo ?? videoLocal
  const setVideo = setRecordVideo ?? setVideoLocal

  return (
    <Paper
      variant="outlined"
      sx={{
        width: '100%',
        height: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        p: { xs: 1.5, sm: 1.75 },
        border: 'none',
        borderRadius: '12px',
        boxShadow: 'none',
        bgcolor: '#fff',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center', mb: 1.5 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            flex: '0 0 38px',
            display: 'grid',
            placeItems: 'center',
            borderRadius: '10px',
            bgcolor: C.paleBlue,
            color: C.blue,
          }}
        >
          <AutoAwesomeRoundedIcon sx={{ fontSize: 19 }} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h2"
            sx={{
              color: C.navy,
              fontSize: '1rem',
              fontWeight: 750,
              lineHeight: 1.35,
            }}
          >
            MeetAI assistant
          </Typography>
          <Typography
            sx={{ color: C.muted, fontSize: '0.75rem', lineHeight: 1.45 }}
          >
            Let MeetAI help after your meeting.
          </Typography>
        </Box>
      </Box>

      {/* Options panel */}
      <Box
        sx={{
          bgcolor: C.paleGreen,
          borderRadius: '12px',
          px: 1.75,
          py: 1.5,
        }}
      >
        <OptionRow
          checked={Boolean(invite)}
          onChange={setInvite}
          ariaLabel="Invite MeetAI"
          title="Invite MeetAI"
          description="Capture the transcript and prepare meeting minutes (MoM) and action items."
        />

        <Box sx={{ my: 1.5, borderTop: `1px solid ${C.paleGreenLine}` }} />

        <OptionRow
          checked={Boolean(video)}
          onChange={setVideo}
          ariaLabel="Enable video recording"
          title="Enable video recording"
          description="Separate video file · 7-day retention"
        />
      </Box>

      {/* Footer note */}
      <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center', mt: 1.25 }}>
        <EnergySavingsLeafOutlinedIcon
          sx={{ color: C.green, fontSize: 17, flexShrink: 0 }}
        />
        <Typography
          sx={{ color: C.body, fontSize: '0.75rem', lineHeight: 1.45 }}
        >
          Spend less time writing notes and more time on your work.
        </Typography>
      </Box>
    </Paper>
  )
}