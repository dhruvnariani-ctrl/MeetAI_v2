import { Box, Button, Divider, Typography } from '@mui/material'

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'

import { C, STEPS } from './constants'

const primaryButtonSx = {
  minHeight: 38,
  px: { xs: 1.1, sm: 1.75 },
  py: 0.7,
  borderRadius: '8px',
  bgcolor: C.navy,
  color: '#fff',
  fontSize: '0.77rem',
  fontWeight: 700,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  boxShadow: 'none',
  '&:hover': {
    bgcolor: '#1A4D70',
    boxShadow: 'none',
  },
  '&:focus-visible': {
    outline: '2px solid #0967B2',
    outlineOffset: 2,
  },
}

export default function DialogFooter({
  step = 0,
  instant = false,
  compactHeight = false,
  linkMode = false,
  threeSteps = false,
  firstLabel = 'Cancel',
  onFirstBack,
  onClose,
  onBack,
  onNext,
  onSubmit,
}) {
  // Link flow has three steps when threeSteps is enabled.
  const totalSteps = linkMode && threeSteps ? 3 : STEPS.length

  // Keep the step index within valid bounds for display.
  const currentStep = Math.min(
    Math.max(Number(step) || 0, 0),
    totalSteps - 1,
  )

  const atStart = currentStep === 0
  const atEnd = currentStep === totalSteps - 1

  const handleBack = atStart
    ? (onFirstBack ?? onClose)
    : onBack

  return (
    <>
      <Divider sx={{ borderColor: C.border, flexShrink: 0 }} />

      <Box
        component="footer"
        sx={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
          alignItems: 'center',
          gap: { xs: 0.5, sm: 1.5 },
          px: { xs: 1, sm: 2.5 },
          py: compactHeight ? 0.6 : 0.85,
          bgcolor: '#fff',
          flexShrink: 0,
          position: 'relative',
          zIndex: 1,
          minWidth: 0,
        }}
      >
        {/* Left: Back / Cancel */}
        <Box
          sx={{
            justifySelf: 'start',
            minWidth: 0,
          }}
        >
          <Button
            type="button"
            onClick={handleBack}
            startIcon={
              !atStart || firstLabel !== 'Cancel' ? (
                <ArrowBackRoundedIcon />
              ) : undefined
            }
            sx={{
              minWidth: 0,
              minHeight: 38,
              px: { xs: 0.75, sm: 1 },
              color: C.navy,
              fontSize: '0.77rem',
              fontWeight: 700,
              textTransform: 'none',
              whiteSpace: 'nowrap',
              '& .MuiButton-startIcon': {
                mr: 0.5,
              },
            }}
          >
            {atStart ? firstLabel : 'Back'}
          </Button>
        </Box>

        {/* Center: Step indicator */}
        <Typography
          component="p"
          aria-live="polite"
          sx={{
            justifySelf: 'center',
            color: C.muted,
            fontSize: '0.72rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            textAlign: 'center',
            m: 0,
          }}
        >
          Step {currentStep + 1} of {totalSteps}
        </Typography>

        {/* Right: Continue / final action */}
        <Box
          sx={{
            justifySelf: 'end',
            minWidth: 0,
          }}
        >
          {atEnd ? (
            <Button
              type="button"
              variant="contained"
              onClick={onSubmit}
              startIcon={
                linkMode || instant ? (
                  <BoltOutlinedIcon />
                ) : (
                  <EventOutlinedIcon />
                )
              }
              sx={primaryButtonSx}
            >
              {linkMode
                ? 'Start meeting'
                : instant
                  ? 'Create & start'
                  : 'Create event'}
            </Button>
          ) : (
            <Button
              type="button"
              variant="contained"
              onClick={onNext}
              endIcon={<ArrowForwardRoundedIcon />}
              sx={primaryButtonSx}
            >
              Continue
            </Button>
          )}
        </Box>
      </Box>
    </>
  )
}