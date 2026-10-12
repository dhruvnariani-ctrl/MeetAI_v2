
import { useState } from 'react'

import Box from '@mui/material/Box'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'

import MeetAISettingsDialog, { switchSx } from './MeetAISettingDialog'
import { isRecordingEnabled } from './meetings/meetingHelpers'

const toggleLabelSx = {
  fontSize: '0.7rem',
  fontWeight: 500,
  color: 'text.primary',
  transition: 'color 120ms ease',
}

const toggleButtonSx = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.5,
  cursor: 'pointer',
  userSelect: 'none',
  '&:focus-visible': {
    outline: '2px solid',
    outlineColor: 'primary.main',
    outlineOffset: 2,
    borderRadius: 1,
  },
  '&:hover .meeting-toggle-label': {
    color: 'primary.main',
  },
}

const stop = (event) => event.stopPropagation()

export default function MeetingToggles({
  meeting,
  settings = {},
  onChange,
  disabled = false,
}) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const autoJoin = settings.autoJoin === true
  const recordVideo = isRecordingEnabled(
    autoJoin,
    settings.recordVideo,
  )

  const openDialog = (event) => {
    event?.stopPropagation()

    if (!disabled) {
      setDialogOpen(true)
    }
  }

  const openOnKey = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openDialog(event)
    }
  }

  const handleSave = (changes) => {
    const nextAutoJoin = changes.autoJoin === true

    onChange?.({
      autoJoin: nextAutoJoin,
      recordVideo: isRecordingEnabled(
        nextAutoJoin,
        changes.recordVideo,
      ),
    })

    setDialogOpen(false)
  }

  const recordLocked = disabled || !autoJoin

  return (
    <>
      <Box
        data-tour="dashboard-meetai-status"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexWrap: 'wrap',
          opacity: disabled ? 0.7 : 1,
        }}
        onClick={stop}
        onMouseDown={stop}
        onPointerDown={stop}
      >
        <Box
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          aria-label={`Configure MeetAI for ${meeting.title}`}
          onClick={openDialog}
          onKeyDown={openOnKey}
          sx={{
            ...toggleButtonSx,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          <Typography
            className="meeting-toggle-label"
            sx={toggleLabelSx}
          >
            Invite MeetAI
          </Typography>

          <Switch
            size="small"
            checked={autoJoin}
            disabled={disabled}
            readOnly
            tabIndex={-1}
            inputProps={{ 'aria-hidden': true }}
            sx={{
              ...switchSx,
              pointerEvents: 'none',
            }}
          />
        </Box>

        <Box
          role="button"
          tabIndex={recordLocked ? -1 : 0}
          aria-disabled={recordLocked}
          aria-label={`Configure video recording for ${meeting.title}`}
          onClick={openDialog}
          onKeyDown={openOnKey}
          sx={{
            ...toggleButtonSx,
            cursor: recordLocked ? 'not-allowed' : 'pointer',
            opacity: autoJoin ? 1 : 0.65,
          }}
        >
          <Typography
            className="meeting-toggle-label"
            sx={toggleLabelSx}
          >
            Video rec
          </Typography>

          <Switch
            size="small"
            checked={recordVideo}
            disabled={disabled || !autoJoin}
            readOnly
            tabIndex={-1}
            inputProps={{ 'aria-hidden': true }}
            sx={{
              ...switchSx,
              pointerEvents: 'none',
            }}
          />
        </Box>
      </Box>

      <MeetAISettingsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        settings={{
          autoJoin,
          recordVideo,
        }}
        disabled={disabled}
      />
    </>
  )
}
