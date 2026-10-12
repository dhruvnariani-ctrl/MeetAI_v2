import Box from '@mui/material/Box'

export default function AvailabilityBadge({ icon, label, available }) {
  const isAvailable = Boolean(available)

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.6,
        px: 0.85,
        py: 0.4,
        borderRadius: '6px',
        bgcolor: isAvailable ? '#EAF6EF' : '#F2F5F8',
        color: isAvailable ? '#23764B' : '#8493A2',
        fontSize: '0.67rem',
        fontWeight: 650,
        lineHeight: 1.3,
        whiteSpace: 'nowrap',
      }}
    >
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          '& svg': {
            fontSize: 14,
          },
        }}
      >
        {icon}
      </Box>

      {label}

      <Box
        component="span"
        sx={{
          ml: 0.15,
          fontSize: '0.62rem',
          fontWeight: 700,
        }}
      >
        {isAvailable ? 'Ready' : '—'}
      </Box>
    </Box>
  )
}