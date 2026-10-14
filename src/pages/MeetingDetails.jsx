import { useEffect, useState } from 'react'

import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import PageShell from '../components/PageShell'

import MeetingHeader from '../components/meetingDetails/MeetingHeader'
import OverviewTab from '../components/meetingDetails/OverviewTab'
import AttendeesPanel from '../components/meetingDetails/AttendeesPanel'
import RecordingTab from '../components/meetingDetails/RecordingTab'
import TranscriptTab from '../components/meetingDetails/TranscriptTab'
import ActionItemsTab from '../components/meetingDetails/ActionItemsTab'

import {
  getMeetingState,
  getAttendance,
  getDurationMinutes,
  formatTimeRange,
} from '../components/meetingDetails/utils'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'

import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'

import usePageTitle from '../hooks/usePageTitle'

import { getMeetingById } from '../data/meetings'
import { getMeetingSettings } from '../data/meetingSettings'

const VALID_TABS = [
  'overview',
  'participants',
  'recording',
  'transcript',
  'actions',
]

const TAB_LABELS = {
  overview: 'Overview',
  participants: 'Participants',
  recording: 'Recording',
  transcript: 'Transcript',
  actions: 'Action Items',
}

function getTabFromSearchParams(searchParams) {
  const requestedTab = searchParams.get('tab')

  return VALID_TABS.includes(requestedTab) ? requestedTab : 'overview'
}

export default function MeetingDetails() {
  usePageTitle('Meeting Details')

  const navigate = useNavigate()
  const { meetingId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const [now, setNow] = useState(() => new Date())

  const [activeTab, setActiveTab] = useState(() =>
    getTabFromSearchParams(searchParams),
  )

  /*
   * The URL is the single source of truth:
   * /meetings/:meetingId
   */
  const resolvedMeeting = getMeetingById(meetingId)

  useEffect(() => {
    setActiveTab(getTabFromSearchParams(searchParams))
  }, [searchParams])

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000)

    return () => clearInterval(timer)
  }, [])

  if (!resolvedMeeting) {
    return (
      <PageShell
        title="Meeting not found"
        subtitle="We couldn't find the meeting you're looking for."
      >
        <Paper
          elevation={0}
          sx={{ border: '1px solid #dce3eb', borderRadius: '12px', p: 3 }}
        >
          <Typography
            sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 2 }}
          >
            The meeting may have been removed or is no longer available.
          </Typography>

          <Button
            variant="outlined"
            startIcon={<ArrowBackOutlinedIcon />}
            onClick={() => navigate(-1)}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Go back
          </Button>
        </Paper>
      </PageShell>
    )
  }

  const meetingState = getMeetingState(resolvedMeeting, now)

  /*
   * MeetAI setting: a saved localStorage value (even `false`) wins over the
   * original meeting.meetAI.invited value.
   */
  const savedSettings = getMeetingSettings()
  const savedMeetingSettings = savedSettings?.[resolvedMeeting.id]

  const meetAIInvited =
    savedMeetingSettings?.autoJoin !== undefined
      ? savedMeetingSettings.autoJoin === true
      : resolvedMeeting?.meetAI?.invited === true

  const participants = resolvedMeeting.participants || []
  const attendance = getAttendance(resolvedMeeting, participants)
  const durationMinutes = getDurationMinutes(resolvedMeeting)
  const timeText = formatTimeRange(resolvedMeeting.start, resolvedMeeting.end)

  const selectTab = (value) => {
    if (!VALID_TABS.includes(value)) return

    setActiveTab(value)

    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams)

        nextParams.set('tab', value)

        return nextParams
      },
      { replace: true },
    )
  }

  return (
    <PageShell title="" subtitle="">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap:2 }}>
        {/* Back */}
        <Button
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={() => navigate(-1)}
          sx={{
            alignSelf: 'flex-start',
            textTransform: 'none',
            fontSize: '0.8125rem',
            color: '#52657d',
            px: 0,
            '&:hover': { bgcolor: 'transparent', color: 'primary.main' },
          }}
        >
          Back to meetings
        </Button>

        {/* Header */}
        <Box data-tour="meeting-header">
          <MeetingHeader
            meeting={resolvedMeeting}
            meetingState={meetingState}
            meetAIInvited={meetAIInvited}
            timeText={timeText}
            durationMinutes={durationMinutes}
          />
        </Box>

        {/* Tabs: plain labels with an underline, as in the design */}
        <Box sx={{ borderBottom: '1px solid #DFE8F0' }}>
          <Tabs
            value={activeTab}
            onChange={(_, value) => selectTab(value)}
            variant="scrollable"
            scrollButtons={false}
            sx={{
              minHeight: 46,
              '& .MuiTab-root': {
                minHeight: 46,
                minWidth: 0,
                mr: { xs: 1, sm: 2.5 },
                px: 0.5,
                textTransform: 'none',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#66778d',
              },
              '& .Mui-selected': { color: 'primary.main', fontWeight: 750 },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            {VALID_TABS.map((tab) => (
              <Tab key={tab} value={tab} label={TAB_LABELS[tab]} />
            ))}
          </Tabs>
        </Box>

        {/* Tab content */}
        {activeTab === 'overview' && (
          <Box>
            <OverviewTab
              meeting={resolvedMeeting}
              meetingState={meetingState}
              attendance={attendance}
              durationMinutes={durationMinutes}
              onSelectTab={selectTab}
            />
          </Box>
        )}

        {activeTab === 'participants' && (
          <AttendeesPanel
            dataTour="meeting-participants"
            attendance={attendance}
            participants={participants}
            upcoming={meetingState?.type === 'upcoming'}
          />
        )}

        {activeTab === 'recording' && (
          <RecordingTab
            meeting={resolvedMeeting}
            meetingState={meetingState}
          />
        )}

        {activeTab === 'transcript' && (
          <TranscriptTab
            meeting={resolvedMeeting}
            meetingState={meetingState}
          />
        )}

        {activeTab === 'actions' && (
          <ActionItemsTab
            meeting={resolvedMeeting}
            meetingState={meetingState}
          />
        )}
      </Box>
    </PageShell>
  )
}