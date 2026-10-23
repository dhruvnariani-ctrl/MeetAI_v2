import { useMemo, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

import PageShell, { EmptyPanel } from '../components/PageShell'
import RecordedFilters from '../components/recorded/RecordedFilters'
import RecordedMeetingCard from '../components/recorded/RecordedMeetingCard'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined'

import usePageTitle from '../hooks/usePageTitle'
import usePage from '../components/usePage'
import { getAllMeetings } from '../data/meetings'
import {
  getRecordedMeetings,
  RECORDED_GRID_COLUMNS,
  RECORDED_SORT_OPTIONS,
} from '../data/recorded'
import { DATE_FILTERS } from '../utils/dateFilters'
import { FONT } from '../utils/dashboardFonts'

const COLORS = {
  navy: '#123A59',
  blue: '#075A9C',
  muted: '#6E8397',
  border: '#DFE8F0',
}

function SummaryMetric({ icon, label, value, description, tone }) {
  return (
    <Paper
      elevation={0}
      sx={{
        minWidth: 0,
        minHeight: 88,
        p: 1.75,
        display: 'flex',
        alignItems: 'center',
        gap: 1.4,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '12px',
        bgcolor: '#FFFFFF',
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          width: 42,
          height: 42,
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          borderRadius: '10px',
          bgcolor: tone.bg,
          color: tone.fg,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            color: '#526A80',
            fontSize: FONT.caption,
            fontWeight: 650,
            lineHeight: 1.35,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            mt: 0.2,
            color: COLORS.navy,
            fontSize: FONT.statValue,
            lineHeight: 0.7,
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </Typography>

        <Typography
          sx={{
            mt: 0.25,
            color: COLORS.muted,
            fontSize: FONT.caption,
            lineHeight: 1.35,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Paper>
  )
}

export default function RecordedMeetings() {
  usePageTitle('Recorded Meetings')

  const navigate = useNavigate()
  const { query: search } = useOutletContext()

  const [dateFilter, setDateFilter] = useState('All')
  const [sortBy, setSortBy] = useState('Newest')

  const meetings = useMemo(() => getAllMeetings(), [])

  const recordedMeetings = useMemo(
    () =>
      getRecordedMeetings(
        meetings,
        search,
        dateFilter,
        sortBy,
      ),
    [meetings, search, dateFilter, sortBy],
  )

  const { rows, pager } = usePage(
    recordedMeetings,
    `${search}|${dateFilter}|${sortBy}`,
  )

  const recordingCount = meetings.filter(
    (meeting) => meeting.recording?.available,
  ).length

  const transcriptCount = meetings.filter(
    (meeting) => meeting.transcript?.available,
  ).length

  const notesCount = meetings.filter(
    (meeting) => meeting.meetingNotes?.available,
  ).length

  const hasActiveFilters =
    dateFilter !== 'All'

  const clearFilters = () => {
    setDateFilter('All')
    setSortBy('Newest')
  }

  return (
    <PageShell
      title="Recorded Meetings"
      subtitle="Your central archive for meeting recordings, transcripts and notes."
    >
      <Stack spacing={2}>
        {/* Summary metrics */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(3, minmax(0, 1fr))',
            },
            gap: 1.25,
            '& > :last-child': {
              gridColumn: { xs: '1 / -1', md: 'auto' },
            },
          }}
        >
          <SummaryMetric
            icon={<VideoLibraryOutlinedIcon />}
            label="Recordings"
            value={recordingCount}
            description="Available to watch"
            tone={{ bg: '#E8F2FC', fg: '#1769AA' }}
          />

          <SummaryMetric
            icon={<DescriptionOutlinedIcon />}
            label="Transcripts"
            value={transcriptCount}
            description="Ready to review"
            tone={{ bg: '#E8F5EF', fg: '#16805C' }}
          />

          <SummaryMetric
            icon={<NotesOutlinedIcon />}
            label="Meeting notes"
            value={notesCount}
            description="Available for reference"
            tone={{ bg: '#F0EDFC', fg: '#6A58B5' }}
          />
        </Box>

        {/* Archive heading */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
            flexWrap: 'wrap',
            pt: 0.25,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: COLORS.navy,
                fontSize: FONT.heading,
                fontWeight: 750,
              }}
            >
              Meeting archive
            </Typography>

            <Typography
              sx={{
                mt: 0.3,
                color: COLORS.muted,
                fontSize: FONT.small,
              }}
            >
              Search and open meeting content from one place.
            </Typography>
          </Box>

          {/* Filters + count, right aligned (search lives in the header) */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 0.75,
              ml: 'auto',
            }}
          >
          <RecordedFilters
            dateFilters={DATE_FILTERS}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            sortOptions={RECORDED_SORT_OPTIONS}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <Box
            component="span"
            aria-live="polite"
            sx={{
              px: 1.15,
              py: 0.65,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '8px',
              bgcolor: '#FFFFFF',
              color: '#526A80',
              fontSize: FONT.caption,
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            {recordedMeetings.length}{' '}
            {recordedMeetings.length === 1 ? 'meeting' : 'meetings'}
          </Box>
          </Box>
        </Box>

        {/* Meeting list */}
        <Box data-tour="recorded-meeting-list">
          {recordedMeetings.length === 0 ? (
            <EmptyPanel title="No recorded meetings">
              {hasActiveFilters
                ? 'No recorded meetings match your search or selected date filter.'
                : 'Meetings with available recording content will appear here.'}

              {hasActiveFilters && (
                <Box sx={{ mt: 1.25 }}>
                  <Typography
                    component="button"
                    onClick={clearFilters}
                    sx={{
                      border: 0,
                      bgcolor: 'transparent',
                      cursor: 'pointer',
                      color: '#2369A5',
                      fontWeight: 700,
                      fontSize: FONT.body,
                      fontFamily: 'inherit',
                      '&:focus-visible': {
                        outline: '2px solid #0a62c9',
                        outlineOffset: 3,
                      },
                    }}
                  >
                    Clear filters
                  </Typography>
                </Box>
              )}
            </EmptyPanel>
          ) : (
            <>
              <Paper
                elevation={0}
                sx={{
                  overflow: 'hidden',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '12px',
                  bgcolor: '#FFFFFF',
                }}
              >
                <Box
                  role="table"
                  aria-label="Recorded meetings archive"
                >
                  <Box
                    role="row"
                    sx={{
                      display: { xs: 'none', lg: 'grid' },
                      gridTemplateColumns: RECORDED_GRID_COLUMNS,
                      alignItems: 'center',
                      gap: 2,
                      px: 2,
                      py: 1.15,
                      bgcolor: '#F5F8FB',
                      borderBottom: `1px solid ${COLORS.border}`,
                    }}
                  >
                    {[
                      'Meeting',
                      'Participants',
                      'Content',
                      'Actions',
                    ].map((label) => (
                      <Typography
                        key={label}
                        role="columnheader"
                        sx={{
                          color: '#63798D',
                          fontSize: FONT.caption,
                          fontWeight: 750,
                          textTransform: 'uppercase',
                          letterSpacing: '.04em',
                        }}
                      >
                        {label}
                      </Typography>
                    ))}
                  </Box>

                  <Box role="rowgroup">
                    <Stack spacing={0}>
                      {rows.map((meeting) => (
                        <RecordedMeetingCard
                          key={meeting.id}
                          meeting={meeting}
                          onWatchRecording={() =>
                            navigate(
                              `/meetings/${meeting.id}?tab=recording`,
                            )
                          }
                          onViewTranscript={() =>
                            navigate(
                              `/meetings/${meeting.id}?tab=transcript`,
                            )
                          }
                          onViewNotes={() =>
                            navigate(`/meetings/${meeting.id}`)
                          }
                        />
                      ))}
                    </Stack>
                  </Box>
                </Box>
              </Paper>

              {pager}
            </>
          )}
        </Box>
      </Stack>
    </PageShell>
  )
}