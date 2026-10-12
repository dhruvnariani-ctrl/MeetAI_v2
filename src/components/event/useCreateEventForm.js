
import { useRef, useState } from 'react'

import { PLATFORMS } from './constants'
import { defaultTimes, toDateInput } from './dateUtils'
import { normalizeMeetingLink } from './meetingLink'

export default function useCreateEventForm({
  currentUser,
  onCreate,
  onInstantJoin,
  initialMode = null,
}) {
  const [initial] = useState(defaultTimes)

  // Schedule flow
  const [step, setStep] = useState(0)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(() => toDateInput(new Date()))
  const [start, setStart] = useState(initial.start)
  const [end, setEnd] = useState(initial.end)
  const [instant, setInstant] = useState(false)
  const [duration, setDuration] = useState(30)

  const [platforms, setPlatforms] = useState({
    teams: false,
    zoom: false,
    meet: true,
  })

  const [participants, setParticipants] = useState(
    currentUser ? [{ ...currentUser, you: true }] : [],
  )

  const [inviteMeetAI, setInviteMeetAI] = useState(false)
  const [recordVideo, setRecordVideo] = useState(false)
  const [errors, setErrors] = useState({})

  // Mode selection
  const [mode, setMode] = useState(initialMode)

  // Independent three-step link flow
  const [linkStep, setLinkStep] = useState(0)
  const [link, setLink] = useState('')
  const [linkTitle, setLinkTitle] = useState('')
  const [linkError, setLinkError] = useState(false)
  const [linkRecordVideo, setLinkRecordVideo] = useState(false)
  const linkRef = useRef(null)

  const chooseMode = (next) => {
    setMode(next)
    setStep(0)
    setLinkStep(0)
    setErrors({})
    setLinkError(false)
  }
const submitLink = (event) => {
  event?.preventDefault?.()

  // Continue through the three-step flow first.
  if (linkStep < 2) {
    linkNext()
    return
  }

  const normalizedLink = normalizeMeetingLink(link)

  if (!normalizedLink) {
    setLinkError(true)
    setLinkStep(0)
    linkRef.current?.focus()
    return
  }

  onInstantJoin({
    link: normalizedLink,
    title: linkTitle.trim(),
    participants,
    recordVideo: linkRecordVideo,
  })
}

  const linkNext = () => {
    if (linkStep === 0) {
      const normalizedLink = normalizeMeetingLink(link)

      if (!normalizedLink) {
        setLinkError(true)
        linkRef.current?.focus()
        return
      }

      setLinkError(false)
    }

    if (linkStep < 2) {
      setLinkStep((current) => Math.min(current + 1, 2))
    }
  }

  const linkBack = () => {
    setLinkStep((current) => Math.max(current - 1, 0))
  }

  const handleLinkStepClick = (index) => {
    if (index < linkStep) {
      setLinkStep(index)
      return
    }

    if (index > linkStep) {
      // Validate each step by advancing one step at a time.
      linkNext()
    }
  }

  const refs = {
    titleRef: useRef(null),
    dateRef: useRef(null),
    startRef: useRef(null),
    endRef: useRef(null),
  }

  const clearError = (key) => {
    setErrors((current) =>
      current[key] ? { ...current, [key]: undefined } : current,
    )
  }

  const togglePlatform = (id) => {
    setPlatforms((current) => ({
      teams: id === 'teams' ? !current.teams : false,
      zoom: id === 'zoom' ? !current.zoom : false,
      meet: id === 'meet' ? !current.meet : false,
    }))

    clearError('platforms')
  }

  const validateStep = (currentStep) => {
    const nextErrors = {}

    if (currentStep === 0) {
      if (!title.trim()) nextErrors.title = 'Enter an event title.'
      if (!date) nextErrors.date = 'Choose a date.'

      if (!instant) {
        if (!start) nextErrors.start = 'Choose a start time.'

        if (!end) {
          nextErrors.end = 'Choose an end time.'
        } else if (start && end <= start) {
          nextErrors.end = 'End time must be after start time.'
        }
      }
    }

    if (currentStep === 2 && !Object.values(platforms).some(Boolean)) {
      nextErrors.platforms = 'Choose at least one meeting platform.'
    }

    return nextErrors
  }

  const focusFirstError = (nextErrors) => {
    const byKey = {
      title: refs.titleRef,
      date: refs.dateRef,
      start: refs.startRef,
      end: refs.endRef,
    }

    const firstInvalid = ['title', 'date', 'start', 'end'].find(
      (key) => nextErrors[key],
    )

    if (firstInvalid) byKey[firstInvalid]?.current?.focus()
  }

  const goNext = () => {
    const nextErrors = validateStep(step)
    setErrors((current) => ({ ...current, ...nextErrors }))

    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors)
      return
    }

    setStep((current) => Math.min(current + 1, 3))
  }

  const goBack = () => {
    setErrors({})
    setStep((current) => Math.max(current - 1, 0))
  }

  const handleStepClick = (index) => {
    if (index < step) {
      setErrors({})
      setStep(index)
      return
    }

    if (index > step) goNext()
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const whenErrors = validateStep(0)
    const platformErrors = validateStep(2)
    const allErrors = { ...whenErrors, ...platformErrors }

    setErrors(allErrors)

    if (Object.keys(allErrors).length > 0) {
      if (Object.keys(whenErrors).length > 0) {
        setStep(0)
        focusFirstError(whenErrors)
      } else {
        setStep(2)
      }

      return
    }

    onCreate({
      title: title.trim(),
      date,
      ...(instant
        ? { instant: true, durationMinutes: duration }
        : { instant: false, start, end }),
      platforms: PLATFORMS.filter((p) => platforms[p.id]).map((p) => p.id),
      participants,
      inviteMeetAI,
      recordVideo: inviteMeetAI && recordVideo,
    })
  }

  const selectedPlatforms = PLATFORMS.filter((p) => platforms[p.id])

  const dateLabel = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Choose a date'

  return {
    mode,
    chooseMode,
    canChangeMode: initialMode == null,

    // Link mode
    link,
    setLink,
    linkTitle,
    setLinkTitle,
    linkError,
    setLinkError,
    linkRecordVideo,
    setLinkRecordVideo,
    linkRef,
    submitLink,
    linkStep,
    linkNext,
    linkBack,
    handleLinkStepClick,

    // Schedule mode
    step,
    title,
    setTitle,
    date,
    setDate,
    start,
    setStart,
    end,
    setEnd,
    instant,
    setInstant,
    duration,
    setDuration,
    platforms,
    togglePlatform,
    participants,
    setParticipants,
    inviteMeetAI,
    setInviteMeetAI,
    recordVideo,
    setRecordVideo,
    errors,
    clearError,
    refs,
    selectedPlatforms,
    dateLabel,
    goNext,
    goBack,
    handleStepClick,
    handleSubmit,
  }
}
