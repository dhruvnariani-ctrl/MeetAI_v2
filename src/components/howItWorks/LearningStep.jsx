import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'

import { COLORS } from './constants'
import { FONT } from '../../utils/dashboardFonts'

export default function LearningStep({ step, number, last, onStartTour }) {
  const Icon = step.icon

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={() => onStartTour(step.tour)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onStartTour(step.tour)
        }
      }}
      sx={{
        position: 'relative',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        cursor: 'pointer',
        px: 1.15,
        py: 1.6,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '10px',
        bgcolor: '#FFFFFF',
        transition: 'border-color 160ms ease, transform 160ms ease',
        '&:hover': {
          borderColor: '#BBD2E6',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 9,
          left: 9,
          width: 21,
          height: 21,
          display: 'grid',
          placeItems: 'center',
          borderRadius: '50%',
          bgcolor: COLORS.blue,
          color: '#FFFFFF',
          fontSize: FONT.caption,
          fontWeight: 800,
        }}
      >
        {number}
      </Box>

      <Box
        sx={{
          width: 52,
          height: 52,
          mt: 0.6,
          mb: 1.2,
          display: 'grid',
          placeItems: 'center',
          borderRadius: '50%',
          bgcolor: step.bg,
          color: step.color,
        }}
      >
        <Icon sx={{ fontSize: 25 }} />
      </Box>

      <Typography
        sx={{
          color: COLORS.navy,
          fontSize: FONT.caption,
          fontWeight: 750,
          lineHeight: 1.45,
          minHeight: 33,
        }}
      >
        {step.title}
      </Typography>

      <Typography
        sx={{
          mt: 0.55,
          color: COLORS.muted,
          fontSize: FONT.caption,
          lineHeight: 1.55,
          flex: 1,
        }}
      >
        {step.description}
      </Typography>

      {/* Arrow pointing at the next step (desktop only) */}
      {!last && (
        <ArrowForwardRoundedIcon
          aria-hidden="true"
          sx={{
            display: { xs: 'none', lg: 'block' },
            position: 'absolute',
            top: '50%',
            right: -16,
            transform: 'translateY(-50%)',
            fontSize: 14,
            color: '#9DB4C8',
          }}
        />
      )}
    </Box>
  )
}