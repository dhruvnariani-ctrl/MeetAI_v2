
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { FONT } from '../../utils/dashboardFonts'
import { getMeetingStatus } from '../meetings/meetingHelpers'

// Keep the existing status colors and order.
const FILTERS = [
  { value: 'Live', label: 'Live', color: '#E5484D' },
  { value: 'Upcoming', label: 'Upcoming', color: '#2876C8' },
  { value: 'Done', label: 'Done', color: '#20A46B' },
  { value: 'In progress', label: 'In progress', color: '#D99A27' },
]

// Preserve the existing named export.
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
      role="group"
      aria-label="Filter meetings by status"
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: { xs: 0.75, sm: 1 },
        width: '100%',
        minWidth: 0,
      }}
    >
      {FILTERS.map((filter) => {
        const selected = value === filter.value
        const count = counts[filter.value] ?? 0

        return (
          <Button
            key={filter.value}
            onClick={() =>
              onChange?.(selected ? 'All' : filter.value)
            }
            aria-pressed={selected}
            aria-label={`${filter.label}, ${count} ${
              count === 1 ? 'meeting' : 'meetings'
            }`}
            sx={{
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
              flex: { xs: '1 1 calc(50% - 6px)', sm: '0 1 auto' },
              minWidth: { xs: 0, sm: 'auto' },
              minHeight: 36,
              px: { xs: 1, sm: 1.25 },
              py: 0.65,
              border: '1px solid',
              borderColor: selected ? '#B9D5EB' : '#DFE7EC',
              borderRadius: '9px',
              bgcolor: selected ? '#EDF5FC' : '#FFFFFF',
              color: selected ? '#164F7D' : '#49647C',
              textTransform: 'none',
              whiteSpace: 'nowrap',
              transition:
                'background-color 150ms ease, border-color 150ms ease',
              '&:hover': {
                bgcolor: selected ? '#E5F0FA' : '#F5F8FB',
                borderColor: selected ? '#A7CBE7' : '#C9D7E2',
              },
              '&:focus-visible': {
                outline: '2px solid #2876C8',
                outlineOffset: 2,
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                minWidth: 0,
              }}
            >
              <Box
                aria-hidden="true"
                sx={{
                  width: 8,
                  height: 8,
                  flexShrink: 0,
                  borderRadius: '50%',
                  bgcolor: filter.color,
                  boxShadow: `0 0 0 3px ${filter.color}18`,
                }}
              />

              <Typography
                component="span"
                sx={{
                  fontSize: FONT.body,
                  lineHeight: 1.4,
                  fontWeight: selected ? 750 : 550,
                }}
              >
                {filter.label}
              </Typography>
            </Box>

            <Typography
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 22,
                height: 21,
                px: 0.65,
                borderRadius: '999px',
                bgcolor: selected ? '#DCEBF8' : '#F0F4F8',
                textAlign: 'center',
                color: selected ? '#164F7D' : '#6E8397',
                fontSize: FONT.caption,
                lineHeight: 1,
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