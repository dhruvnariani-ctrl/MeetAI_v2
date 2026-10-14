
import Box from '@mui/material/Box'
const STATUS_STYLES = {
  Pending: {
    bgcolor: '#EAF3FC',
    color: '#245F94',
  },
  Open: {
    bgcolor: '#EDF3F8',
    color: '#526B81',
  },
  'In Progress': {
    bgcolor: '#EAF3FC',
    color: '#245F94',
  },
  'In Process': {
    bgcolor: '#FFF2DE',
    color: '#9B6414',
  },
  Blocked: {
    bgcolor: '#FDEDEE',
    color: '#B8323C',
  },
  Done: {
    bgcolor: '#E8F6ED',
    color: '#20764A',
  },
}

export default function TaskStatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Pending

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 1,
        py: 0.45,
        borderRadius: '8px',
        bgcolor: style.bgcolor,
        color: style.color,
        fontSize: '0.75rem',
        lineHeight: 1.35,
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}
    >
      {status || 'Pending'}
    </Box>
  )
}