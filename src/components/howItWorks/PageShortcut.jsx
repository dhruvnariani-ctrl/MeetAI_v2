import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import { COLORS } from './constants'
import { FONT } from '../../utils/dashboardFonts'

export default function PageShortcut({ item, active, onTour }) {
  const Icon = item.icon

  return (
    <Paper
      elevation={0}
      sx={{
        minWidth: 0,
        border: `1px solid ${active ? COLORS.blue : COLORS.border}`,
        borderRadius: '10px',
        bgcolor: active ? COLORS.blue : '#FFFFFF',
        overflow: 'hidden',
        transition: 'border-color 160ms ease, box-shadow 160ms ease',
        '&:hover': {
          borderColor: active ? COLORS.blueDark : '#BBD2E6',
          boxShadow: '0 5px 16px rgba(18,58,89,.06)',
        },
      }}
    >
      <Button
        onClick={() => onTour(item.tour)}
        fullWidth
        sx={{
          minHeight: 72,
          p: 1.15,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 1.1,
          textAlign: 'left',
          textTransform: 'none',
          color: active ? '#FFFFFF' : COLORS.navy,
          borderRadius: 0,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
            borderRadius: '10px',
            bgcolor: active ? 'rgba(255,255,255,.18)' : item.bg,
            color: active ? '#FFFFFF' : item.color,
          }}
        >
          <Icon sx={{ fontSize: 19 }} />
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              fontSize: FONT.caption,
              lineHeight: 1.35,
              fontWeight: 750,
              color: active ? '#FFFFFF' : COLORS.navy,
            }}
          >
            {item.label}
          </Typography>

          <Typography
            sx={{
              mt: 0.35,
              fontSize: FONT.caption,
              lineHeight: 1.4,
              color: active ? 'rgba(255,255,255,.82)' : COLORS.muted,
            }}
          >
            {item.description}
          </Typography>
        </Box>
      </Button>
    </Paper>
  )
}