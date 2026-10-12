
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { getMeetingStatus } from '../meetings/meetingHelpers'

const FILTERS = [
  { value: 'Live', label: 'Live', color: '#E5484D' },
  { value: 'Upcoming', label: 'Upcoming', color: '#2876C8' },
  { value: 'Done', label: 'Done', color: '#20A46B' },
  { value: 'In progress', label: 'In progress', color: '#D99A27' },
]

// Preserve the existing named export for any other files that import it.
export { getMeetingStatus }

/**
 * Count meetings for each available calendar status.
 */
export function getStatusCounts(meetings = [], now = new Date()) {
  const counts = Object.fromEntries(
    FILTERS.map((filter) => [filter.value, 0]),
  )

  meetings.forEach((meeting) => {
    const status = getMeetingStatus(meeting, now)

    if (Object.prototype.hasOwnProperty.call(counts, status)) {
      counts[status] += 1
    }
  })

  return counts
}

export default function CalendarFilters({
  value = 'All',
  onChange,
  counts = {},
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
      }}
    >
      {FILTERS.map((filter) => {
        const selected = value === filter.value
        const count = counts[filter.value] ?? 0

        return (
          <Button
            key={filter.value}
            fullWidth
            onClick={() =>
              onChange?.(selected ? 'All' : filter.value)
            }
            aria-pressed={selected}
            aria-label={`${filter.label}, ${count} ${
              count === 1 ? 'meeting' : 'meetings'
            }`}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: 36,
              px: 1,
              py: 0.65,
              borderRadius: '8px',
              bgcolor: selected ? '#EDF5FC' : 'transparent',
              color: selected ? '#164F7D' : '#49647C',
              textTransform: 'none',
              '&:hover': {
                bgcolor: selected ? '#EDF5FC' : '#F5F8FB',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.1,
              }}
            >
              <Box
                sx={{
                  width: 9,
                  height: 9,
                  flexShrink: 0,
                  borderRadius: '50%',
                  bgcolor: filter.color,
                  boxShadow: `0 0 0 3px ${filter.color}18`,
                }}
              />

              <Typography
                sx={{
                  fontSize: '0.8rem',
                  lineHeight: 1.4,
                  fontWeight: selected ? 750 : 550,
                }}
              >
                {filter.label}
              </Typography>
            </Box>

            <Typography
              sx={{
                minWidth: 22,
                px: 0.75,
                borderRadius: '999px',
                bgcolor: selected ? '#DCEBF8' : '#F0F4F8',
                textAlign: 'center',
                color: selected ? '#164F7D' : '#6E8397',
                fontSize: '0.74rem',
                lineHeight: '20px',
                fontWeight: selected ? 750 : 650,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {count}
            </Typography>
          </Button>
        )
      })}
    </Box>
  )
}
