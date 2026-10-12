
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function TourHint({ label, children }) {
  return (
    <Box
      sx={{
        p: 1.25,
        borderRadius: '9px',
        bgcolor: '#F3F7F9',
        border: '1px solid #E0E8ED',
        borderLeft: '3px solid #16815B',
      }}
    >
      <Typography
        sx={{
          fontSize: '0.67rem',
          fontWeight: 800,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          color: '#16815B',
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          mt: 0.45,
          fontSize: '0.78rem',
          lineHeight: 1.6,
          color: '#536879',
          overflowWrap: 'anywhere',
        }}
      >
        {children}
      </Typography>
    </Box>
  )
}
