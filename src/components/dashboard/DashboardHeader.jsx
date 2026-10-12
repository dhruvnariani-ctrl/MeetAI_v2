import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import AddIcon from '@mui/icons-material/Add'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'

const BANNER_URL = '/images/avaada_banner_clean.png'
// Original banner is 3:1. A bigger first number makes the header shorter.
// Keep it at or below about 4.5 so the button doesn't touch the bottom edge.
const BANNER_RATIO = '4.2 / 1'

const dateFmt = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function getGreeting(hour) {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardHeader({
  now = new Date(),
  firstName = 'Dhruv',
  onCreate, // opens the one "New meeting" dialog
}) {
  const currentDate = now instanceof Date ? now : new Date(now)

  return (
    <Box
      data-tour="dashboard-welcome"
      sx={{
        // Container so text/button scale with the banner width (cqw units)
        containerType: 'inline-size',
        mb: 2.5,
        border: '1px solid #dce8f1',
        borderRadius: { xs: '18px', md: '22px' },
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(20,64,96,.07)',
        bgcolor: '#eaf4fb',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          isolation: 'isolate',
          width: '100%',
          // Desktop/tablet: fixed proportions, so the header height follows its width.
          aspectRatio: { xs: 'auto', md: BANNER_RATIO },
          // Mobile: no fixed ratio, so the content decides the height.
          minHeight: { xs: 240, md: 0 },
          display: 'flex',
          alignItems: { xs: 'center', md: 'flex-start' },
          pl: { xs: 2.5, sm: 3.5, md: '4.1cqw' },
          pr: { xs: 2.5, sm: 3.5, md: 0 },
          pt: { xs: 2.5, md: '7.2cqw' }, // sits below the banner's baked-in tagline
          pb: { xs: 2.5, md: 0 },
          backgroundImage: `url('${BANNER_URL}')`,
          backgroundRepeat: 'no-repeat',
          // Desktop: full width, crop only the bottom (grass). Mobile: cover.
          backgroundSize: { xs: 'cover', md: '100% auto' },
          backgroundPosition: { xs: 'right center', md: 'top center' },
          // Soft white fade on small screens only, so text stays readable.
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            zIndex: -1,
            display: { xs: 'block', md: 'none' },
            background:
              'linear-gradient(90deg, rgba(246,251,255,.94) 0%, rgba(246,251,255,.78) 55%, rgba(246,251,255,.15) 100%)',
          },
        }}
      >
        <Box sx={{ minWidth: 0, maxWidth: { xs: '100%', md: '48cqw' } }}>
          {/* Date */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(6px, .75cqw, 12px)',
              color: '#6882a8',
            }}
          >
            <CalendarMonthOutlinedIcon
              aria-hidden="true"
              sx={{ fontSize: 'clamp(18px, 1.6cqw, 30px)' }}
            />
            <Typography
              component="p"
              sx={{
                fontSize: 'clamp(.82rem, 1.15cqw, 1.2rem)',
                fontWeight: 500,
                color: 'inherit',
              }}
            >
              {dateFmt.format(currentDate)}
            </Typography>
          </Box>

          {/* Greeting */}
          <Typography
            component="h1"
            sx={{
              mt: 'clamp(4px, .8cqw, 14px)',
              fontSize: 'clamp(1.5rem, 3cqw, 3.2rem)',
              lineHeight: 1.1,
              letterSpacing: '-.02em',
              fontWeight: 800,
              color: '#0a2a66',
              overflowWrap: 'anywhere',
            }}
          >
            {getGreeting(currentDate.getHours())}, {firstName}
          </Typography>

          {/* Intro */}
          <Typography
            sx={{
              mt: 'clamp(4px, .8cqw, 14px)',
              fontSize: 'clamp(.85rem, 1.15cqw, 1.2rem)',
              lineHeight: 1.45,
              color: '#5d7596',
            }}
          >
            Your meetings, decisions and next steps — all in one place.
          </Typography>

          {/* Single action: opens the dialog that asks what to do */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 'clamp(10px, 1.5cqw, 26px)',
            }}
          >
            <Button
              data-tour="dashboard-new-meeting"
              variant="contained"
              disableElevation
              startIcon={<AddIcon />}
              onClick={onCreate}
              sx={{
                minHeight: 'clamp(38px, 3.3cqw, 56px)',
                px: 'clamp(18px, 2.4cqw, 38px)',
                borderRadius: 999,
                bgcolor: '#16824a',
                fontSize: 'clamp(.82rem, 1.05cqw, 1.05rem)',
                fontWeight: 700,
                textTransform: 'none',
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: '#116c3d' },
              }}
            >
              Schedule or Join with MeetAI
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}