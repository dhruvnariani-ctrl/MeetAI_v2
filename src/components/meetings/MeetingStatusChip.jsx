
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'

import { getStatusStyle } from './meetingHelpers'
import { FONT } from '../../utils/dashboardFonts'

const stop = (event) => event.stopPropagation()

/* Status pill. Clicking it must never open the meeting. */
export default function MeetingStatusChip({ status }) {
  const statusStyle = getStatusStyle(status)

  return (
    <Box
      onClick={stop}
      onMouseDown={stop}
      onPointerDown={stop}
      sx={{
        gridColumn: '2 / 3',
        alignSelf: { xs: 'start', md: 'center' },
        justifySelf: 'end',
      }}
    >
      <Chip
        label={status}
        size="small"
        sx={{
          height: 26,
          minWidth: 0,
          borderRadius: '8px',
          backgroundColor: statusStyle.backgroundColor,
          color: statusStyle.color,
          fontSize: FONT.caption,
          fontWeight: 750,
          userSelect: 'none',
          '& .MuiChip-label': {
            px: 1,
          },
        }}
      />
    </Box>
  )
}