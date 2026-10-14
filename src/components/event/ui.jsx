import { Box, Paper, Typography } from '@mui/material'

import { C } from './constants'

export function SectionHeading({ icon, title, subtitle }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.2 }}>
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: '8px',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          bgcolor: C.paleBlue,
          color: C.blue,
          '& svg': { fontSize: 18 },
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 750, color: C.navy }}>
          {title}
        </Typography>

        {subtitle && (
          <Typography sx={{ fontSize: '0.75rem', color: C.muted, mt: 0.15 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export function SectionCard({ children, sx = {} }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 1.25, sm: 1.6 },
        borderRadius: '10px',
        borderColor: C.border,
        boxShadow: 'none',
        bgcolor: '#fff',
        minWidth: 0,
        ...sx,
      }}
    >
      {children}
    </Paper>
  )
}