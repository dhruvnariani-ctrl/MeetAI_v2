import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined'
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import { FONT } from '../../utils/dashboardFonts'

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
          md: 'repeat(4, minmax(0, 1fr))',
          lg: 'repeat(2, minmax(0, 1fr))',
        },
        gridAutoRows: { lg: '1fr' },
        height: '100%',
        gap: 1.25,
      }}
    >
      {METRICS.map(({ key, label, Icon, tone, tint }) => (
        <Paper
          key={key}
          variant="outlined"
          sx={{
            p: { xs: 1.25, sm: 1.5 },
            minWidth: 0,
            borderRadius: '16px',
            borderColor: '#e1e9ef',
            bgcolor: '#fff',
            boxShadow: '0 3px 12px rgba(16,58,92,.035)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            transition: 'transform 160ms ease, box-shadow 160ms ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 7px 18px rgba(16,58,92,.08)',
            },
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '12px',
              display: 'grid',
              placeItems: 'center',
              bgcolor: tint,
              color: tone,
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: 20 }} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: FONT.caption,
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
                fontSize: FONT.statValue,
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