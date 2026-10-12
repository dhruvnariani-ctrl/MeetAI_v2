import { Box, IconButton, Typography } from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import EnergySavingsLeafOutlinedIcon from '@mui/icons-material/EnergySavingsLeafOutlined'

import { C } from './constants'

/* Banner at the top: title, short text and the close button. */
export default function DialogHeader({
  titleId,
  descId,
  onClose,
  compactHeight,
  title = 'Create an event',
  subtitle = 'A few simple steps to get your team together.',
}) {
  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: 88, sm: compactHeight ? 108 : 128 },
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      <Box
        component="img"
        src="/images/Pastel Blue Network Waves.png"
        alt="Wind turbines and solar panels in a green landscape"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 50%',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(255,255,255,.97) 0%, rgba(255,255,255,.87) 43%, rgba(255,255,255,.12) 100%)',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          px: { xs: 1.8, sm: 2.5 },
          pr: 6,
        }}
      >
        <Box sx={{ maxWidth: 470 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.4 }}>
            <EnergySavingsLeafOutlinedIcon sx={{ color: C.green, fontSize: 15 }} />

            <Typography
              sx={{
                fontSize: '0.62rem',
                color: C.green,
                fontWeight: 750,
                letterSpacing: '0.065em',
              }}
            >
              TEAM COLLABORATION
            </Typography>
          </Box>

          <Typography
            id={titleId}
            component="h2"
            sx={{
              color: C.navy,
              fontWeight: 800,
              fontSize: { xs: '1.15rem', sm: '1.38rem' },
              letterSpacing: '-0.025em',
              lineHeight: 1.25,
            }}
          >
            {title}
          </Typography>

          <Typography
            id={descId}
            sx={{ mt: 0.3, fontSize: '0.72rem', color: '#405C6D' }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Box>

      <IconButton
        aria-label="Close dialog"
        onClick={onClose}
        size="small"
        sx={{
          position: 'absolute',
          top: 9,
          right: 9,
          zIndex: 2,
          width: 29,
          height: 29,
          bgcolor: 'rgba(255,255,255,.95)',
          color: C.navy,
          '&:hover': { bgcolor: '#fff' },
        }}
      >
        <CloseIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  )
}