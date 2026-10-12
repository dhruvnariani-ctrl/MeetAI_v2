import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined'

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

const AREAS = [
  {
    number: '01',
    title: 'Meet your workspace',
    text: 'Explore your dashboard and quick actions.',
  },
  {
    number: '02',
    title: 'Manage meetings',
    text: 'Find your calendar, recordings, and meeting details.',
  },
  {
    number: '03',
    title: 'Follow through',
    text: 'Review tasks, action items, and meeting outcomes.',
  },
]

export default function TourIntro({ onStart, onSkip }) {
  return (
    <Fade in timeout={220}>
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 1500,
          bgcolor: 'rgba(7, 25, 39, 0.62)',
          backdropFilter: 'blur(3px)',
          display: 'grid',
          placeItems: 'center',
          p: { xs: 1.5, sm: 2 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 510,
            maxHeight: 'min(680px, calc(100dvh - 32px))',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: { xs: '14px', sm: '18px' },
            border: `1px solid ${C.border}`,
            boxShadow: '0 24px 80px rgba(0,0,0,0.28)',
            overflow: 'hidden',
            bgcolor: C.white,
          }}
        >
          {/* Compact executive header */}
          <Box
            sx={{
              position: 'relative',
              flexShrink: 0,
              overflow: 'hidden',
              px: { xs: 2, sm: 2.5 },
              py: { xs: 2, sm: 2.25 },
              bgcolor: C.navyDark,
              color: C.white,
              borderBottom: `3px solid ${C.green}`,
            }}
          >
            {/* Subtle brand-inspired shapes */}
            <Box
              aria-hidden="true"
              sx={{
                position: 'absolute',
                width: 155,
                height: 155,
                right: -62,
                top: -96,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.13)',
              }}
            />

            <Box
              aria-hidden="true"
              sx={{
                position: 'absolute',
                width: 112,
                height: 112,
                right: -25,
                top: -67,
                borderRadius: '50%',
                bgcolor: 'rgba(22,129,91,0.15)',
              }}
            />

            <Stack
              direction="row"
              alignItems="flex-start"
              spacing={1.5}
              sx={{ position: 'relative' }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                  borderRadius: '11px',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: '#A6DCC0',
                }}
              >
                <BoltOutlinedIcon sx={{ fontSize: 23 }} />
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: '#A9C8DA',
                  }}
                >
                  AVAADA · MEETAI
                </Typography>

                <Typography
                  component="h1"
                  sx={{
                    mt: 0.45,
                    fontSize: { xs: '1.22rem', sm: '1.45rem' },
                    lineHeight: 1.28,
                    fontWeight: 700,
                    letterSpacing: '-0.025em',
                    color: C.white,
                  }}
                >
                  Your workspace, at a glance.
                </Typography>

                <Typography
                  sx={{
                    mt: 0.65,
                    maxWidth: 370,
                    fontSize: '0.82rem',
                    lineHeight: 1.55,
                    color: 'rgba(255,255,255,0.76)',
                  }}
                >
                  A guided introduction to the tools that keep your meetings
                  and follow-ups organised.
                </Typography>
              </Box>

              <Button
                onClick={onSkip}
                aria-label="Close tour introduction"
                sx={{
                  minWidth: 30,
                  width: 30,
                  height: 30,
                  p: 0,
                  mt: -0.5,
                  mr: -0.5,
                  color: 'rgba(255,255,255,0.8)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: C.white,
                  },
                }}
              >
                <CloseRoundedIcon fontSize="small" />
              </Button>
            </Stack>
          </Box>

          {/* Scrollable content */}
          <Box
            sx={{
              flex: '1 1 auto',
              minHeight: 0,
              overflowY: 'auto',
              overscrollBehavior: 'contain',
              px: { xs: 2, sm: 2.5 },
              py: { xs: 2, sm: 2.25 },
            }}
          >
            {/* Section heading */}
            <Stack spacing={0.6} sx={{ mb: 1.75 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <ExploreOutlinedIcon
                  sx={{ fontSize: 19, color: C.green }}
                />

                <Typography
                  sx={{
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    color: C.navy,
                  }}
                >
                  What we’ll cover
                </Typography>
              </Stack>

              <Typography
                sx={{
                  fontSize: '0.81rem',
                  lineHeight: 1.6,
                  color: C.muted,
                }}
              >
                Follow the highlighted areas on your screen to learn where
                everything is and how to use it.
              </Typography>
            </Stack>

            {/* Overview cards */}
            <Stack spacing={1}>
              {AREAS.map((area) => (
                <Box
                  key={area.number}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.25,
                    borderRadius: '11px',
                    border: `1px solid ${C.border}`,
                    bgcolor: '#FCFDFE',
                    transition:
                      'border-color 160ms ease, background-color 160ms ease',
                    '&:hover': {
                      borderColor: '#B9D6C6',
                      bgcolor: '#FBFDFC',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      flexShrink: 0,
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: '10px',
                      bgcolor: C.greenLight,
                      color: C.green,
                      fontSize: '0.82rem',
                      fontWeight: 800,
                    }}
                  >
                    {area.number}
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        lineHeight: 1.4,
                        color: C.navy,
                      }}
                    >
                      {area.title}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.3,
                        fontSize: '0.78rem',
                        lineHeight: 1.5,
                        color: C.muted,
                      }}
                    >
                      {area.text}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>

            {/* Short instruction, replacing the large information panel */}
            <Box
              sx={{
                mt: 1.5,
                px: 1.25,
                py: 1,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
                borderRadius: '9px',
                bgcolor: '#F2F6F9',
                border: `1px solid ${C.border}`,
              }}
            >
              <ExploreOutlinedIcon
                sx={{
                  mt: '2px',
                  fontSize: 17,
                  flexShrink: 0,
                  color: C.blue,
                }}
              />

              <Typography
                sx={{
                  fontSize: '0.75rem',
                  lineHeight: 1.55,
                  color: C.muted,
                }}
              >
                Use Next to continue, Back to revisit a step, or close the
                tour whenever you like.
              </Typography>
            </Box>
          </Box>

          {/* Fixed footer: always visible */}
          <Box
            sx={{
              flexShrink: 0,
              px: { xs: 2, sm: 2.5 },
              py: 1.5,
              bgcolor: '#FFFFFF',
              borderTop: `1px solid ${C.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1.5,
            }}
          >
            <Button
              onClick={onSkip}
              sx={{
                minHeight: 40,
                px: 1,
                borderRadius: '9px',
                color: C.muted,
                fontSize: '0.83rem',
                fontWeight: 600,
                textTransform: 'none',
                whiteSpace: 'nowrap',
                '&:hover': {
                  bgcolor: '#F1F5F7',
                  color: C.navy,
                },
              }}
            >
              Maybe later
            </Button>

            <Button
              onClick={onStart}
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                minHeight: 42,
                px: { xs: 1.75, sm: 2.25 },
                borderRadius: '9px',
                bgcolor: C.navy,
                color: C.white,
                fontSize: '0.84rem',
                fontWeight: 700,
                textTransform: 'none',
                whiteSpace: 'nowrap',
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
              Start guided tour
            </Button>
          </Box>
        </Paper>
      </Box>
    </Fade>
  )
}