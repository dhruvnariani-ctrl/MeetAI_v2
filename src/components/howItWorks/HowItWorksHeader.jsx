
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import HeroIllustration from './HeroIllustration'
import { COLORS } from './constants'
import { FONT } from '../../utils/dashboardFonts'

/* Top card: label, title, intro text and the laptop illustration. */
export default function HowItWorksHeader() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.75, md: 2.25 },
        border: `1px solid ${COLORS.border}`,
        borderRadius: '12px',
        background:
          'linear-gradient(110deg, #FFFFFF 0%, #F5FAFE 64%, #EAF5FC 100%)',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              color: COLORS.blue,
              fontSize: FONT.headerGreeting,
              fontWeight: 800,
              letterSpacing: '.09em',
              textTransform: 'uppercase',
            }}
          >
            HOW IT WORKS
          </Typography>

          <Typography
            component="h2"
            sx={{
              mt: 0.65,
              color: COLORS.navy,
              fontSize: FONT.scheduleHeading,
              fontWeight: 800,
              lineHeight: 1.25,
              letterSpacing: '-.02em',
            }}
          >
            Get the most out of MeetAI
          </Typography>

          <Typography
            sx={{
              mt: 0.8,
              maxWidth: 470,
              color: COLORS.muted,
              fontSize: FONT.small,
              lineHeight: 1.65,
            }}
          >
            Simple steps to help you join meetings, stay informed and get
            things done — effortlessly.
          </Typography>
        </Box>

        <HeroIllustration />
      </Box>
    </Paper>
  )
}