
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

import AddIcon from '@mui/icons-material/Add'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'

import { FONT } from '../../utils/dashboardFonts'

const BANNER_URL = `${import.meta.env.BASE_URL}/images/avaada_banner_clean.png`

const BANNER_RATIO_MD = '4.2 / 1'
const BANNER_RATIO_LG = '3.8 / 1'

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
  onCreate,
  activeCount = 0,
  liveCount = 0,
}) {
  const currentDate = now instanceof Date ? now : new Date(now)

  return (
    <Box
      data-tour="dashboard-welcome"
      sx={{
        containerType: 'inline-size',
        height: '100%',
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
          aspectRatio: {
            xs: 'auto',
            md: BANNER_RATIO_MD,
            lg: BANNER_RATIO_LG,
          },
          minHeight: { xs: 280, md: 0 },
          display: 'flex',
          alignItems: { xs: 'center', md: 'flex-start' },
          pl: { xs: 2.5, sm: 3.5, md: '4.1cqw' },
          pr: { xs: 2.5, sm: 3.5, md: 2 },
          pt: { xs: 2.5, md: '5.2cqw' },
          pb: { xs: 2.5, md: 2 },
          backgroundImage: `url('${BANNER_URL}')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: { xs: 'cover', md: '100% auto' },
          backgroundPosition: { xs: 'right center', md: 'top center' },

          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            zIndex: -1,
            display: { xs: 'block', md: 'none' },
            background:
              'linear-gradient(90deg, rgba(246,251,255,.95) 0%, rgba(246,251,255,.82) 60%, rgba(246,251,255,.25) 100%)',
          },
        }}
      >
        <Box sx={{ width: '100%', minWidth: 0 }}>
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
              sx={{ fontSize: FONT.headerIcon }}
            />

            <Typography
              component="p"
              sx={{
                fontSize: FONT.headerDate,
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
              mt: 'clamp(3px, .5cqw, 8px)',
              fontSize: FONT.headerGreeting,
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
              mt: 'clamp(3px, .5cqw, 8px)',
              fontSize: FONT.headerIntro,
              lineHeight: 1.45,
              color: '#5d7596',
            }}
          >
            Your meetings, decisions and next steps — all in one place.
          </Typography>

          {/* Actions and meeting count on the same row */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1.25,
              mt: 'clamp(8px, 1cqw, 16px)',
            }}
          >
            <Button
              data-tour="dashboard-new-meeting"
              variant="contained"
              disableElevation
              startIcon={<AddIcon sx={{ fontSize: '1rem !important' }} />}
              onClick={onCreate}
              sx={{
                minHeight: 'clamp(34px, 2.7cqw, 46px)',
                px: 'clamp(12px, 1.5cqw, 24px)',
                borderRadius: 999,
                bgcolor: '#16824a',
                fontSize: FONT.headerButton,
                fontWeight: 700,
                textTransform: 'none',
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: '#116c3d' },
              }}
            >
              Schedule or Join with MeetAI
            </Button>

            {/* Translucent meeting count */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1,
                px: 1.5,
                py: 0.9,
                minHeight: 38,
                borderRadius: '12px',
                border: '1px solid rgba(18,58,89,.18)',
                bgcolor: 'rgba(255,255,255,.68)',
                backdropFilter: 'blur(6px)',
                boxShadow: '0 3px 10px rgba(18,58,89,.06)',
              }}
            >
              <EventAvailableOutlinedIcon
                sx={{
                  fontSize: '1rem',
                  color: '#2369a5',
                }}
              />

              <Typography
                sx={{
                  color: '#123a59',
                  fontSize: FONT.body,
                  fontWeight: 750,
                  whiteSpace: 'nowrap',
                }}
              >
                {activeCount === 0
                  ? 'No meetings left today'
                  : `${activeCount} ${
                      activeCount === 1 ? 'meeting' : 'meetings'
                    } left today`}
              </Typography>

              {liveCount > 0 && (
                <Chip
                  size="small"
                  label={liveCount === 1 ? '1 live now' : `${liveCount} live now`}
                  sx={{
                    height: 23,
                    bgcolor: 'rgba(255,240,239,.95)',
                    color: '#bf4148',
                    border: '1px solid rgba(191,65,72,.15)',
                    fontSize: FONT.caption,
                    fontWeight: 800,
                    borderRadius: '8px',
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
