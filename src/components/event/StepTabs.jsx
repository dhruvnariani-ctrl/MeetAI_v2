
import { Box, Button } from '@mui/material'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'

import { C, STEPS } from './constants'

const LINK_STEPS = [
  { label: 'Meeting link' },
  { label: 'Participants' },
  { label: 'MeetAI & review' },
]

export default function StepTabs({
  step = 0,
  onStepClick,
  compactHeight = false,
  mode = 'schedule',
}) {
  const steps = mode === 'link' ? LINK_STEPS : STEPS

  return (
    <Box
      sx={{
        px: { xs: 1, sm: 2.5 },
        pt: compactHeight ? 0.45 : 0.65,
        pb: compactHeight ? 0.45 : 0.65,
        bgcolor: '#fff',
        flexShrink: 0,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <Box
        role="group"
        aria-label={
          mode === 'link'
            ? 'Meeting link steps'
            : 'Event creation steps'
        }
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
          gap: 0.4,
          p: 0.35,
          bgcolor: '#F0F4F7',
          borderRadius: '10px',
        }}
      >
        {steps.map((item, index) => {
          const active = step === index
          const complete = step > index

          return (
            <Button
              key={item.label}
              type="button"
              onClick={() => onStepClick?.(index)}
              aria-current={active ? 'step' : undefined}
              aria-label={`Step ${index + 1}: ${item.label}`}
              startIcon={
                complete ? (
                  <CheckCircleRoundedIcon />
                ) : (
                  <Box
                    component="span"
                    sx={{
                      display: 'grid',
                      placeItems: 'center',
                      width: { xs: 23, sm: 29 },
                      height: { xs: 23, sm: 29 },
                      minWidth: { xs: 23, sm: 29 },
                      borderRadius: '50%',
                      fontSize: { xs: '0.75rem', sm: '1rem' },
                      fontWeight: 800,
                      bgcolor: active ? C.navy : '#DCE5EB',
                      color: active ? '#fff' : C.muted,
                    }}
                  >
                    {index + 1}
                  </Box>
                )
              }
              sx={{
                minWidth: 0,
                minHeight: compactHeight ? 32 : 38,
                px: { xs: 0.2, sm: 0.8 },
                borderRadius: '8px',
                textTransform: 'none',
                justifyContent: 'center',
                whiteSpace: 'normal',
                overflow: 'hidden',
                color: active
                  ? C.navy
                  : complete
                    ? C.green
                    : C.muted,
                bgcolor: active ? '#fff' : 'transparent',
                boxShadow: active
                  ? '0 1px 4px rgba(18,58,89,.10)'
                  : 'none',
                fontWeight: active ? 750 : 600,
                fontSize: {
                  xs: '0.6rem',
                  sm: '0.76rem',
                },
                lineHeight: 1.2,
                '& .MuiButton-startIcon': {
                  mr: { xs: 0.25, sm: 0.65 },
                  ml: 0,
                  flexShrink: 0,
                },
                '& .MuiButton-startIcon svg': {
                  fontSize: 17,
                  color: C.green,
                },
                '&:hover': {
                  bgcolor: active ? '#fff' : '#E8EEF2',
                },
              }}
            >
              {item.label}
            </Button>
          )
        })}
      </Box>
    </Box>
  )
}