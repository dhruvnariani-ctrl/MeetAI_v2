
import { useId } from 'react'
import {
  Box,
  Dialog,
  DialogContent,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

import LinkReviewSettings from './LinkReviewSetting'
import LinkMeetingSummary from './LinkMeetingSummary'
import DialogFooter from './DialogFooter'
import DialogHeader from './DialogHeader'
import LinkStep from './LinkStep'
import ModeStep from './ModeStep'
import StepTabs from './StepTabs'
import SummaryStep from './SummaryStep'
import useCreateEventForm from './useCreateEventForm'
import WhenStep from './WhenStep'
import WhereStep from './WhereStep'
import WhoStep from './WhoStep'
import { C } from './constants'

const HEADERS = {
  choose: {
    title: 'New meeting',
    subtitle: 'Choose how you want to start.',
  },
  link: {
    title: 'Join with a link',
    subtitle: 'Connect your meeting and let MeetAI take the notes.',
  },
  schedule: {
    title: 'Set up a new meeting',
    subtitle: 'A few simple steps to get your team together.',
  },
}

const LINK_STEP_COUNT = 3
const SCHEDULE_STEP_COUNT = 4

function NewMeetingContent({
  titleId,
  descId,
  fullScreen,
  compactHeight,
  onClose,
  onCreate,
  onInstantJoin,
  currentUser,
  searchDirectory,
  initialMode,
}) {
  const form = useCreateEventForm({
    currentUser,
    onCreate,
    onInstantJoin,
    initialMode,
  })

  const mode = form.mode
  const isLinkMode = mode === 'link'
  const isScheduleMode = mode === 'schedule'

  const header = HEADERS[mode ?? 'choose']

  const activeStep = isLinkMode
    ? form.linkStep
    : form.step

  const stepCount = isLinkMode
    ? LINK_STEP_COUNT
    : SCHEDULE_STEP_COUNT

  /*
   * Keep the summary connected to the link value exposed by the form.
   * The preferred property is form.meetingLink.
   *
   * If your hook uses a different property, replace this expression
   * with that exact property.
   */
  const meetingLink =
    form.meetingLink ??
    form.linkUrl ??
    form.meetingUrl ??
    form.link ??
    ''

  const handleBack = () => {
    if (isLinkMode) {
      if (form.linkStep === 0) {
        if (form.canChangeMode) {
          form.chooseMode(null)
        } else {
          onClose()
        }
        return
      }

      form.linkBack()
      return
    }

    if (isScheduleMode) {
      if (form.step === 0) {
        if (form.canChangeMode) {
          form.chooseMode(null)
        } else {
          onClose()
        }
        return
      }

      form.goBack()
    }
  }

  const handleNext = () => {
    if (isLinkMode) {
      form.linkNext()
      return
    }

    if (isScheduleMode) {
      form.goNext()
    }
  }

  const handleSubmit = (event) => {
    event?.preventDefault()

    if (isLinkMode) {
      form.submitLink(event)
      return
    }

    if (isScheduleMode) {
      form.handleSubmit(event)
    }
  }

  const handleStepClick = (nextStep) => {
    if (isLinkMode) {
      form.handleLinkStepClick(nextStep)
      return
    }

    if (isScheduleMode) {
      form.handleStepClick(nextStep)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minWidth: 0,
        minHeight: 0,
        height:
          mode === null
            ? 'auto'
            : fullScreen
              ? '100dvh'
              : 'min(660px, calc(100dvh - 32px))',
        maxHeight: fullScreen
          ? '100dvh'
          : 'calc(100dvh - 32px)',
        overflow: 'hidden',
      }}
    >
      <DialogHeader
        titleId={titleId}
        descId={descId}
        onClose={onClose}
        compactHeight={compactHeight}
        title={header.title}
        subtitle={header.subtitle}
      />

      {/* Link mode has exactly three steps. */}
      {isLinkMode && (
        <StepTabs
          mode="link"
          step={form.linkStep}
          onStepClick={handleStepClick}
          compactHeight={compactHeight}
        />
      )}

      {/* Schedule mode has exactly four steps. */}
      {isScheduleMode && (
        <StepTabs
          mode="schedule"
          step={form.step}
          onStepClick={handleStepClick}
          compactHeight={compactHeight}
        />
      )}

      <DialogContent
        sx={{
          flex: '1 1 auto',
          minHeight: 0,
          minWidth: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          overscrollBehavior: 'contain',
          px: { xs: 1.2, sm: 2.5 },
          pt:
            isScheduleMode || isLinkMode
              ? compactHeight
                ? 0.5
                : 0.8
              : 1.5,
          pb: compactHeight ? 1 : 1.5,
          bgcolor: C.bg,
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: '#C6D3DE',
            borderRadius: '8px',
          },
        }}
      >
        {/* Initial mode selection */}
        {mode === null && (
          <ModeStep onChoose={form.chooseMode} />
        )}

        {/* ==========================================
            LINK MODE: THREE STEPS
            0. Meeting link
            1. Participants
            2. MeetAI settings and summary
           ========================================== */}
        {isLinkMode && (
          <Box
            component="form"
            id="link-meeting-form"
            noValidate
            onSubmit={handleSubmit}
            sx={{
              minWidth: 0,
              width: '100%',
            }}
          >
            {/* Step 1: Enter or select a meeting link */}
            {form.linkStep === 0 && (
              <LinkStep
                form={form}
                searchDirectory={searchDirectory}
              />
            )}

            {/* Step 2: Select participants */}
            {form.linkStep === 1 && (
              <WhoStep
                form={form}
                searchDirectory={searchDirectory}
              />
            )}

            {/* Step 3: MeetAI settings + meeting summary */}
            {form.linkStep === 2 && (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'minmax(0, 1fr)',
                    md: 'minmax(0, 1fr) minmax(0, 1fr)',
                  },
                  gap: { xs: 1.5, md: 2 },
                  alignItems: 'stretch',
                  width: '100%',
                  '& > *': {
                    minWidth: 0,
                  },
                }}
              >
                {/* Left: MeetAI settings */}
                <Box
                  sx={{
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <LinkReviewSettings
                    recordVideo={form.linkRecordVideo}
                    setRecordVideo={form.setLinkRecordVideo}
                  />
                </Box>

                {/* Right: Summary of the entered meeting */}
                <Box
                  sx={{
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <LinkMeetingSummary
                    title={form.linkTitle}
                    participants={form.participants}
                    meetingLink={meetingLink}
                    recordVideo={form.linkRecordVideo}
                  />
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* ==========================================
            SCHEDULE MODE: FOUR STEPS
            0. When
            1. Who
            2. Where
            3. Summary
           ========================================== */}
        {isScheduleMode && (
          <Box
            component="form"
            id="create-event-form"
            noValidate
            onSubmit={handleSubmit}
            sx={{
              minWidth: 0,
              width: '100%',
            }}
          >
            {form.step === 0 && (
              <WhenStep
                form={form}
                compactHeight={compactHeight}
                fullScreen={fullScreen}
              />
            )}

            {form.step === 1 && (
              <WhoStep
                form={form}
                searchDirectory={searchDirectory}
              />
            )}

            {form.step === 2 && (
              <WhereStep
                form={form}
                compactHeight={compactHeight}
              />
            )}

            {form.step === 3 && (
              <SummaryStep form={form} />
            )}
          </Box>
        )}
      </DialogContent>

      {/* Footer uses the active mode's step count. */}
      {mode !== null && (
        <DialogFooter
          step={activeStep}
          stepCount={stepCount}
          instant={isLinkMode || form.instant}
          compactHeight={compactHeight}
          linkMode={isLinkMode}
          threeSteps={isLinkMode}
          firstLabel={form.canChangeMode ? 'Back' : 'Cancel'}
          onFirstBack={handleBack}
          onClose={onClose}
          onBack={handleBack}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />
      )}
    </Box>
  )
}

export default function NewMeetingDialog({
  open,
  onClose,
  onCreate,
  onInstantJoin,
  currentUser,
  searchDirectory,
  initialMode = null,
}) {
  const theme = useTheme()

  const fullScreen = useMediaQuery(
    theme.breakpoints.down('sm'),
  )

  const compactHeight = useMediaQuery(
    '(max-height: 740px)',
  )

  const titleId = useId()
  const descId = useId()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth={false}
      aria-labelledby={titleId}
      aria-describedby={descId}
      scroll="paper"
      sx={{
        '& .MuiDialog-container': {
          alignItems: 'center',
          py: fullScreen ? 0 : 1,
        },
        '& .MuiDialog-paper': {
          width: fullScreen
            ? '100%'
            : 'min(1000px, calc(100% - 32px))',
          maxWidth: 'none',
          height: fullScreen
            ? '100dvh'
            : 'min(760px, calc(100dvh - 32px))',
          maxHeight: fullScreen
            ? '100dvh'
            : 'calc(100dvh - 32px)',
          m: fullScreen ? 0 : 'auto',
          borderRadius: fullScreen ? 0 : '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#fff',
          backgroundImage: 'none',
        },
      }}
    >
      <NewMeetingContent
        titleId={titleId}
        descId={descId}
        fullScreen={fullScreen}
        compactHeight={compactHeight}
        onClose={onClose}
        onCreate={onCreate}
        onInstantJoin={onInstantJoin}
        currentUser={currentUser}
        searchDirectory={searchDirectory}
        initialMode={initialMode}
      />
    </Dialog>
  )
}