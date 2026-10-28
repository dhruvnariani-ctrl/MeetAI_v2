
import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import PageShell from '../components/PageShell'
import CalendarSidebar from '../components/calendar/CalendarSidebar'
import CalendarToolbar from '../components/calendar/CalendarToolbar'
import CalendarFilters, {
  getStatusCounts,
} from '../components/calendar/CalendarFilters'
import CalendarMeetingList from '../components/calendar/CalendarMeetingList'

import SlidingSegmented from '../components/SlidingSegmented'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'

import useCalendarState from '../hooks/useCalenderState'
import useCurrentUser from '../hooks/useCurrentUser'
import { FONT } from '../utils/dashboardFonts'
import { readJSON, writeJSON } from '../utils/storage'

const LAYOUT_KEY = 'calendar-meeting-layout'

const LAYOUT_OPTIONS = [
  { value: 'list', label: 'List', icon: <ViewListRoundedIcon /> },
  { value: 'grid', label: 'Grid', icon: <GridViewRoundedIcon /> },
]

function readSavedLayout() {
  const saved = readJSON(LAYOUT_KEY, null)

  if (saved === 'grid' || saved === 'list') {
    return saved
  }

  try {
    const legacy =
      typeof window !== 'undefined'
        ? window.localStorage.getItem(LAYOUT_KEY)
        : null

    if (legacy === 'grid' || legacy === 'list') {
      writeJSON(LAYOUT_KEY, legacy)
      return legacy
    }
  } catch {
    // Use list layout when storage is unavailable.
  }

  return 'list'
}

export default function CalendarPage() {
  const { openNewMeeting } = useOutletContext()
  const currentUser = useCurrentUser()
  const calendar = useCalendarState(currentUser)

  const [layout, setLayout] = useState(readSavedLayout)

  const count = calendar.visibleMeetings.length

  const statusCounts = useMemo(
    () =>
      getStatusCounts(
        calendar.periodMeetings ?? calendar.meetings ?? [],
        new Date(),
      ),
    [calendar.periodMeetings, calendar.meetings],
  )

  const handleLayoutChange = (nextLayout) => {
    if (nextLayout !== 'list' && nextLayout !== 'grid') {
      return
    }

    setLayout(nextLayout)
    writeJSON(LAYOUT_KEY, nextLayout)
  }

  return (
      <Stack spacing={2} sx={{ minWidth: 0 }}>
        {/* Calendar navigation and actions */}
        <Box data-tour="calendar-date-navigation">
          <CalendarToolbar
            view={calendar.view}
            onViewChange={calendar.setView}
            onPrevious={calendar.handlePrevious}
            onNext={calendar.handleNext}
            onToday={calendar.handleToday}
            onYesterday={calendar.handleYesterday}
            onTomorrow={calendar.handleTomorrow}
            onCurrentPeriod={calendar.handleCurrentPeriod}
            selectedDateLabel={calendar.selectedDateLabel}
            autoJoin={calendar.allVisibleAutoJoin}
            onAutoJoinChange={calendar.handleToolbarAutoJoin}
            onNewMeeting={() => openNewMeeting?.()}
          />
        </Box>

        {/* Calendar content */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              lg: '250px minmax(0, 1fr)',
            },
            gap: 2,
            alignItems: 'start',
            minWidth: 0,
          }}
        >
          {/* Left: date picker */}
          <Box sx={{ minWidth: 0 }}>
            <CalendarSidebar
              selectedDate={calendar.selectedDate}
              view={calendar.view}
              meetings={calendar.meetings}
              onSelectDate={calendar.selectDay}
            />
          </Box>

          {/* Right: filters and meetings */}
          <Stack spacing={1.5} sx={{ minWidth: 0, width: '100%' }}>
            {/* Meeting filters */}
            <Box
              data-tour="calendar-filters"
              sx={{
                p: { xs: 1.5, sm: 1.75 },
                border: '1px solid #DFE7EC',
                borderRadius: '12px',
                bgcolor: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(18,58,89,0.025)',
                minWidth: 0,
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={{ xs: 1, sm: 2 }}
              >
                <Box sx={{ flexShrink: 0 }}>
                  <Typography
                    sx={{
                      color: '#123A59',
                      fontSize: FONT.body,
                      fontWeight: 750,
                      lineHeight: 1.4,
                    }}
                  >
                    Meeting filters
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.25,
                      color: '#71818D',
                      fontSize: FONT.caption,
                      lineHeight: 1.4,
                    }}
                  >
                    Filter meetings by status
                  </Typography>
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    width: { xs: '100%', sm: 'auto' },
                  }}
                >
                  <CalendarFilters
                    value={calendar.filter}
                    onChange={calendar.setFilter}
                    counts={statusCounts}
                  />
                </Box>
              </Stack>
            </Box>

            {/* Date/count on the left; List/Grid on the right */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1.5,
                minWidth: 0,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  component="h2"
                  sx={{
                    m: 0,
                    color: '#123A59',
                    fontSize: FONT.meetingTitle,
                    lineHeight: 1.4,
                    fontWeight: 750,
                  }}
                >
                  {calendar.title}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.35,
                    color: '#71818D',
                    fontSize: FONT.small,
                  }}
                >
                  {count} {count === 1 ? 'meeting' : 'meetings'}
                </Typography>
              </Box>

              <Box sx={{ flexShrink: 0 }}>
                <SlidingSegmented
                  dataTour="calendar-layout-toggle"
                  ariaLabel="Meeting layout"
                  options={LAYOUT_OPTIONS}
                  value={layout}
                  onChange={handleLayoutChange}
                  sx={{ bgcolor: '#EDF4FA' }}
                />
              </Box>
            </Box>

            {/* Meeting cards; layout is controlled by this page */}
            <Box data-tour="calendar-meeting-list" sx={{ minWidth: 0 }}>
              <CalendarMeetingList
                meetings={calendar.visibleMeetings}
                view={calendar.view}
                layout={layout}
                settings={calendar.settings}
                onSettingsChange={calendar.onSettingsChange}
              />
            </Box>
          </Stack>
        </Box>
      </Stack>
  )
}