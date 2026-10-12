
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined'
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'

const METRICS = [
  {
    key: 'meetings',
    label: "Today's meetings",
    Icon: CalendarMonthOutlinedIcon,
    tone: '#2367ad',
    tint: '#eaf3ff',
  },
  {
    key: 'people',
    label: 'People involved',
    Icon: Groups2OutlinedIcon,
    tone: '#187b62',
    tint: '#e8f7f0',
  },
  {
    key: 'live',
    label: 'Live now',
    Icon: RadioButtonCheckedOutlinedIcon,
    tone: '#c0444a',
    tint: '#fff0ef',
  },
  {
    key: 'actions',
    label: "Today's action items",
    Icon: TaskAltOutlinedIcon,
    tone: '#a15b16',
    tint: '#fff4e6',
  },
]

export default function DashboardOverview({ values = {} }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(4, minmax(0, 1fr))',
        },
        gap: { xs: 1.25, md: 1.75 },
        mb: 2.5,
      }}
    >
      {METRICS.map(({ key, label, Icon, tone, tint }) => (
        <Paper
          key={key}
          variant="outlined"
          sx={{
            p: { xs: 1.6, sm: 2 },
            minWidth: 0,
            borderRadius: '16px',
            borderColor: '#e1e9ef',
            bgcolor: '#fff',
            boxShadow: '0 3px 12px rgba(16,58,92,.035)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            transition: 'transform 160ms ease, box-shadow 160ms ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 7px 18px rgba(16,58,92,.08)',
            },
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '13px',
              display: 'grid',
              placeItems: 'center',
              bgcolor: tint,
              color: tone,
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: 22 }} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: '.75rem',
                color: '#65798b',
                lineHeight: 1.35,
                fontWeight: 600,
              }}
            >
              {label}
            </Typography>

            <Typography
              sx={{
                mt: 0.25,
                fontSize: { xs: '1.45rem', md: '1.65rem' },
                lineHeight: 1.15,
                fontWeight: 800,
                letterSpacing: '-.04em',
                color: '#123a59',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {values[key] ?? 0}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  )
}
