
import { forwardRef } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'

import TourHint from './TourHint'
import { getTourIcon } from './TourIcons'
import { FONT } from '../../utils/dashboardFonts'

const C = {
  navy: '#123A59',
  navyDark: '#0C2940',
  blue: '#0967B2',
  green: '#16815B',
  greenLight: '#EAF5EF',
  border: '#DFE7ED',
  text: '#203548',
  muted: '#687B8B',
  white: '#FFFFFF',
}

const TourCard = forwardRef(function TourCard(
  { step, index, total, position, onNext, onBack, onClose },
  ref,
) {
  const current = index + 1
  const Icon = getTourIcon(step.icon)
  const isLast = current === total

  return (
    <Fade in timeout={220}>
      <Paper
        ref={ref}
        elevation={0}
        sx={{
          position: 'fixed',
          zIndex: 1402,
          width: {
            xs: 'calc(100vw - 20px)',
            sm: 370,
          },
          maxWidth: 'calc(100vw - 20px)',
          // Keep the card compact on phones; never make the card itself scroll.
          top: { xs: position?.top ?? 10, sm: position?.top ?? -9999 },
          left: { xs: position?.left ?? 10, sm: position?.left ?? -9999 },
          right: { xs: 'auto', sm: 'auto' },
          bottom: 'auto',
          maxHeight: 'none',
          overflow: 'visible',
          borderRadius: { xs: '9px', sm: '12px' },
          bgcolor: C.white,
          border: `1px solid ${C.border}`,
          boxShadow: '0 16px 48px rgba(12, 41, 64, 0.22)',
          transition: 'top 180ms ease, left 180ms ease',
          '& *': { minWidth: 0 },
          '@media (max-width: 360px)': {
            '& .MuiButton-root': {
              fontSize: '0.75rem',
            },
          },
        }}
      >
        {/* Brand accent and progress */}
        <Box sx={{ height: 4, bgcolor: '#E9EFF3' }}>
          <LinearProgress
            variant="determinate"
            value={(current / total) * 100}
            sx={{
              height: 4,
              bgcolor: 'transparent',
              '& .MuiLinearProgress-bar': {
                bgcolor: C.green,
                borderRadius: 4,
                transition: 'transform 300ms ease',
              },
            }}
          />
        </Box>

        {/* Header */}
        <Box
          sx={{
            px: { xs: 1.1, sm: 2.25 },
            pt: { xs: 0.8, sm: 2 },
            pb: { xs: 0.7, sm: 1.75 },
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <Stack direction="row" alignItems="flex-start" spacing={{ xs: 1, sm: 1.25 }}>
            <Box
              sx={{
                width: { xs: 28, sm: 38 },
                height: { xs: 28, sm: 38 },
                flexShrink: 0,
                display: 'grid',
                placeItems: 'center',
                borderRadius: '10px',
                bgcolor: '#EDF4F9',
                color: C.navy,
                border: '1px solid #DCE8F0',
              }}
            >
              <Icon fontSize="small" />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: { xs: '0.62rem', sm: FONT.caption },
                  fontWeight: 700,
                  letterSpacing: '0.11em',
                  textTransform: 'uppercase',
                  color: C.green,
                }}
              >
                AVAADA · MEETAI GUIDE
              </Typography>

              <Typography
                component="h2"
                sx={{
                  mt: 0.25,
                  fontSize: { xs: '0.95rem', sm: FONT.heading },
                  fontWeight: 700,
                  lineHeight: 1.35,
                  color: C.navy,
                  overflowWrap: 'anywhere',
                }}
              >
                {step.title}
              </Typography>
            </Box>

            <IconButton
              size="small"
              aria-label="Close tour"
              onClick={onClose}
              sx={{
                mt: -0.5,
                mr: -0.75,
                color: C.muted,
                '&:hover': {
                  bgcolor: '#F1F5F7',
                  color: C.navy,
                },
              }}
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>

        {/* Step description */}
        <Box sx={{ px: { xs: 1.1, sm: 2.25 }, py: { xs: 0.75, sm: 2 } }}>
          <Typography
            sx={{
              fontSize: { xs: '0.8rem', sm: FONT.body },
              lineHeight: { xs: 1.35, sm: 1.75 },
              color: C.text,
              overflowWrap: 'anywhere',
              display: { xs: '-webkit-box', sm: 'block' },
              WebkitBoxOrient: { xs: 'vertical', sm: 'initial' },
              WebkitLineClamp: { xs: 2, sm: 'unset' },
              overflow: { xs: 'hidden', sm: 'visible' },
            }}
          >
            {step.body}
          </Typography>

          {step.action && (
            <Box sx={{ mt: 1.5, display: { xs: 'none', sm: 'block' } }}>
              <TourHint label="TRY THIS">{step.action}</TourHint>
            </Box>
          )}

          {step.tip && (
            <Box sx={{ mt: 1, display: { xs: 'none', sm: 'block' } }}>
              <TourHint label="HELPFUL TIP">{step.tip}</TourHint>
            </Box>
          )}

          {/* Step count */}
          <Box
            sx={{
              mt: { xs: 0.6, sm: 2 },
              display: 'flex',
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              rowGap: 0.75,
              columnGap: 1,
            }}
          >
            <Stack direction="row" spacing={0.6} alignItems="center">
              <Box
                sx={{
                  width: 29,
                  height: 29,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '50%',
                  bgcolor: C.greenLight,
                  color: C.green,
                  fontSize: FONT.small,
                  fontWeight: 800,
                }}
              >
                {current}
              </Box>

              <Typography
                sx={{
                  fontSize: FONT.small,
                  fontWeight: 600,
                  color: C.muted,
                }}
              >
                of {total} steps
              </Typography>
            </Stack>

            <Typography
              sx={{
                display: { xs: 'none', sm: 'block' },
                fontSize: FONT.caption,
                fontWeight: 600,
                color: C.muted,
              }}
            >
              {Math.round((current / total) * 100)}% complete
            </Typography>
          </Box>
        </Box>

        {/* Actions */}
        <Box
          sx={{
            px: { xs: 0.75, sm: 2.25 },
            py: { xs: 0.5, sm: 1.5 },
            bgcolor: '#F8FAFB',
            borderTop: `1px solid ${C.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 0.75,
            flexWrap: 'wrap',
          }}
        >
          <Button
            onClick={onClose}
            size="small"
            sx={{
              minWidth: 0,
              px: 0.75,
              color: C.muted,
              fontSize: FONT.small,
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { bgcolor: '#EDF2F5', color: C.navy },
            }}
          >
            Skip tour
          </Button>

          <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }} sx={{ flexShrink: 0 }}>
            {index > 0 && (
              <Button
                onClick={onBack}
                variant="outlined"
                startIcon={<ArrowBackRoundedIcon />}
                sx={{
                  minHeight: { xs: 32, sm: 38 },
                  px: { xs: 0.8, sm: 1.2 },
                  borderRadius: '8px',
                  borderColor: '#CAD7E0',
                  color: C.navy,
                  fontSize: FONT.small,
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: C.navy,
                    bgcolor: '#EDF4F9',
                  },
                }}
              >
                Back
              </Button>
            )}

            <Button
              onClick={onNext}
              variant="contained"
              endIcon={
                isLast ? (
                  <CheckCircleOutlineRoundedIcon />
                ) : (
                  <ArrowForwardRoundedIcon />
                )
              }
              sx={{
                minHeight: { xs: 32, sm: 38 },
                px: { xs: 0.9, sm: 1.75 },
                whiteSpace: 'nowrap',
                borderRadius: '8px',
                bgcolor: C.navy,
                color: C.white,
                fontSize: FONT.small,
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: C.blue,
                  boxShadow: 'none',
                },
                '&:focus-visible': {
                  outline: `2px solid ${C.green}`,
                  outlineOffset: 2,
                },
              }}
            >
              {isLast ? 'Finish tour' : 'Next step'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Fade>
  )
})

export default TourCard