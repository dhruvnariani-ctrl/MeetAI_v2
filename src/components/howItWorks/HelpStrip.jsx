import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded'

import { COLORS } from './constants'

/* Bottom strip: "Need help?" text and the Start App Tour button. */
export default function HelpStrip({ onStartTour }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.4, md: 1.7 },
        border: '1px solid #D9EAF7',
        borderRadius: '12px',
        bgcolor: '#EAF5FC',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 1.25,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.1, minWidth: 0 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              display: 'grid',
              placeItems: 'center',
              borderRadius: '9px',
              bgcolor: '#FFFFFF',
              color: COLORS.blue,
              flexShrink: 0,
            }}
          >
            <LightbulbOutlinedIcon sx={{ fontSize: 21 }} />
          </Box>

          <Typography
            sx={{
              color: '#4F6F88',
              fontSize: '.73rem',
              lineHeight: 1.55,
            }}
          >
            <Box
              component="span"
              sx={{ color: COLORS.navy, fontWeight: 750 }}
            >
              Need help?
            </Box>{' '}
            You can also use the sidebar buttons for quick access to all features.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<PlayCircleOutlineRoundedIcon />}
          onClick={onStartTour}
          sx={{
            minHeight: 38,
            px: 1.7,
            borderRadius: '9px',
            bgcolor: COLORS.blue,
            boxShadow: 'none',
            color: '#FFFFFF',
            fontSize: '.75rem',
            fontWeight: 750,
            textTransform: 'none',
            whiteSpace: 'nowrap',
            '&:hover': {
              bgcolor: COLORS.blueDark,
              boxShadow: 'none',
            },
          }}
        >
          Start App Tour
        </Button>
      </Box>
    </Paper>
  )
}
