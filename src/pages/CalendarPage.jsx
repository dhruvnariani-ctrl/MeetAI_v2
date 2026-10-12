import { useMemo } from 'react'
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

import useCalendarState from '../hooks/useCalenderState'
import useCurrentUser from '../hooks/useCurrentUser'

export default function CalendarPage() {
  // Opens the one "New meeting" dialog (it asks what to do).
  const { openNewMeeting } = useOutletContext()
  const currentUser = useCurrentUser()
  const calendar = useCalendarState(currentUser)

  const count = calendar.visibleMeetings.length

  // Counts for each status filter.
  // Uses the meetings of the selected period BEFORE the status filter is
  // applied (so choosing "Live" does not turn the other counts into 0).
  // If your hook exposes `periodMeetings`, it is used; otherwise it falls
  // back to all meetings.
  const statusCounts = useMemo(
    () =>
      getStatusCounts(
        calendar.periodMeetings ?? calendar.meetings ?? [],
        new Date(),
      ),
    [calendar.periodMeetings, calendar.meetings],
  )

  return (
    <PageShell
      title="Calendar"
      subtitle="Manage your meetings and schedule"
    >
      <Stack spacing={2}>
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

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              lg: '250px minmax(0, 1fr)',
            },
            gap: { xs: 2, md: 2.5 },
            alignItems: 'start',
          }}
        >
          <Stack spacing={2}>
            <CalendarSidebar
              selectedDate={calendar.selectedDate}
              view={calendar.view}
              meetings={calendar.meetings}
              onSelectDate={calendar.selectDay}
            />

            <Box
              sx={{
                p: 2,
                border: '1px solid #E0E8F0',
                borderRadius: '14px',
                bgcolor: '#FFFFFF',
              }}
            >
              <Typography
                sx={{
                  mb: 1.5,
                  color: '#123A59',
                  fontSize: '0.9rem',
                  fontWeight: 750,
                }}
              >
                Meeting filters
              </Typography>

              <Box data-tour="calendar-filters">
                <CalendarFilters
                  value={calendar.filter}
                  onChange={calendar.setFilter}
                  counts={statusCounts}
                />
              </Box>
            </Box>
          </Stack>

          <Box sx={{ minWidth: 0 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1,
                mb: 1.5,
              }}
            >
              <Box>
                <Typography
                  component="h2"
                  sx={{
                    m: 0,
                    color: '#123A59',
                    fontSize: '1.08rem',
                    lineHeight: 1.4,
                    fontWeight: 750,
                  }}
                >
                  {calendar.title}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.35,
                    color: '#74869A',
                    fontSize: '0.78rem',
                  }}
                >
                  {count} {count === 1 ? 'meeting' : 'meetings'}
                </Typography>
              </Box>
            </Box>

            <Box data-tour="calendar-meeting-list">
              <CalendarMeetingList
                meetings={calendar.visibleMeetings}
                view={calendar.view}
                settings={calendar.settings}
                onSettingsChange={calendar.onSettingsChange}
              />
            </Box>
          </Box>
        </Box>
      </Stack>
    </PageShell>
  )
}