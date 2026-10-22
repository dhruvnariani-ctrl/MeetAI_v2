
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import TourIntro from './tour/TourIntro'
import TourOverlay from './tour/TourOverlay'
import TourCard from './tour/TourCard'
import {
  readTour,
  saveTour,
  startAppTour,
  stopAppTour,
  TOUR_STORAGE_KEY,
} from './tour/TourStorage'
import { findTarget, positionCard, rectOf } from './tour/TourUtils'

/*
 * Other files import startAppTour from this file (Header, HowItWorks),
 * so it is re-exported here.
 */
export { startAppTour, stopAppTour, TOUR_STORAGE_KEY }

export default function TourRunner() {
  const location = useLocation()
  const navigate = useNavigate()

  const [tour, setTour] = useState(null)
  const [targetRect, setTargetRect] = useState(null)
  const [targetFound, setTargetFound] = useState(false)
  const [cardPosition, setCardPosition] = useState(null)

  const cardRef = useRef(null)

  const step = useMemo(
    () => tour?.steps?.[tour.index] || null,
    [tour],
  )

  const resetTarget = () => {
    setTargetRect(null)
    setTargetFound(false)
    setCardPosition(null)
  }

  /*
   * Start/stop listeners + restore an active tour after refresh.
   */
  useEffect(() => {
    const onStart = () => {
      const next = readTour()
      if (!next) return

      setTour(next)
      resetTarget()
    }

    const onStop = () => {
      setTour(null)
      resetTarget()
    }

    window.addEventListener('meetai-tour-start', onStart)
    window.addEventListener('meetai-tour-stop', onStop)

    const existing = readTour()
    if (existing) setTour(existing)

    return () => {
      window.removeEventListener('meetai-tour-start', onStart)
      window.removeEventListener('meetai-tour-stop', onStop)
    }
  }, [])

  /*
   * Navigate to the step's page, then find the target element.
   * If the target never shows up, skip the step instead of freezing the tour.
   *
   * Special case:
   * Before locating the Join meeting button, ask UpNextCard to expand itself.
   * The locator below retries while React renders the expanded card.
   */
  useEffect(() => {
    if (!tour || !step || tour.phase === 'intro') {
      return undefined
    }

    if (step.path && step.path !== location.pathname) {
      resetTarget()
      navigate(step.path)
      return undefined
    }

    let cancelled = false
    let timer = null
    const started = Date.now()

    resetTarget()

    // Expand UpNextCard before searching for its Join button.
    const targetSelector = String(step.target || '')
    const isJoinStep = targetSelector.includes(
      'dashboard-join-meeting',
    )

    if (isJoinStep) {
      window.dispatchEvent(
        new Event('meetai-tour-expand-up-next'),
      )
    }

    const locate = () => {
      if (cancelled) return

      const target = findTarget(step.target)

      if (!target) {
        // Give the page and expanded card up to 5 seconds to render.
        if (Date.now() - started < 5000) {
          timer = window.setTimeout(locate, 100)
          return
        }

        // Still missing: move on so one bad selector cannot freeze the tour.
        if (tour.index >= tour.steps.length - 1) {
          stopAppTour()
          return
        }

        const skipped = {
          ...tour,
          index: tour.index + 1,
        }

        saveTour(skipped)
        setTour(skipped)
        return
      }

      const mobile = window.matchMedia('(max-width: 599px)').matches

      // First bring the target into view. Mobile placement is finalized after
      // the card has rendered and its real height can be measured.
      target.scrollIntoView({
        behavior: 'auto',
        block: mobile ? 'start' : (step.scrollBlock || 'center'),
        inline: 'nearest',
      })

      timer = window.setTimeout(() => {
        if (cancelled) return

        const rect = rectOf(target)
        if (!rect) return

        setTargetRect(rect)
        setTargetFound(true)
      }, mobile ? 80 : 350)
    }

    locate()

    return () => {
      cancelled = true
      if (timer) window.clearTimeout(timer)
    }
  }, [tour, step, location.pathname, navigate])

  /*
   * Mobile: position the card wholly above or below the target. If neither
   * side has enough room, scroll the page until the target has room below it.
   */
  useEffect(() => {
    if (!tour || !step || !targetFound || !targetRect || !cardRef.current) {
      return undefined
    }

    const viewportWidth = window.visualViewport?.width ?? window.innerWidth
    if (viewportWidth >= 600) return undefined

    const target = findTarget(step.target)
    if (!target) return undefined

    let cancelled = false
    let scrollTimer = null
    let finishTimer = null
    const edge = 8
    const gap = 12
    const pad = 7

    const placeCard = () => {
      if (cancelled || !cardRef.current) return

      const cardRect = cardRef.current.getBoundingClientRect()
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight
      const targetBox = target.getBoundingClientRect()
      const cardHeight = cardRect.height
      const needed = cardHeight + gap + pad
      const spaceAbove = targetBox.top
      const spaceBelow = viewportHeight - targetBox.bottom
      const isTallTarget = targetBox.height > viewportHeight

      // Tall mobile targets are handled specially: keep the card at the top
      // and let the spotlight begin immediately after the card, showing as
      // much of the tall target as fits in the remaining viewport.
      if (isTallTarget) {
        setCardPosition({
          top: edge,
          left: Math.max(edge, (viewportWidth - cardRect.width) / 2),
        })
        setTargetRect(rectOf(target) || targetBox)
        return
      }

      // Prefer the side with enough room. If both fit, use the side with more
      // room so the target and card remain fully separated.
      if (spaceAbove >= needed || spaceBelow >= needed) {
        const useAbove = spaceAbove >= needed && (spaceBelow < needed || spaceAbove >= spaceBelow)
        const top = useAbove
          ? Math.max(edge, targetBox.top - pad - gap - cardHeight)
          : Math.min(viewportHeight - cardHeight - edge, targetBox.bottom + pad + gap)

        setCardPosition({
          top,
          left: Math.max(edge, (viewportWidth - cardRect.width) / 2),
        })
        setTargetRect(rectOf(target) || targetBox)
        return
      }

      // Neither side can fit the card. Scroll the target down so the card can
      // sit above it. scrollIntoView also supports nested scrolling containers.
      target.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' })
      scrollTimer = window.setTimeout(() => {
        if (cancelled || !cardRef.current) return
        const cardNow = cardRef.current.getBoundingClientRect()
        const targetNow = target.getBoundingClientRect()
        const desiredTargetTop = edge + cardNow.height + gap + pad
        const delta = targetNow.top - desiredTargetTop

        if (Math.abs(delta) > 2) {
          // Scroll the nearest scrollable ancestors via scrollIntoView first;
          // then adjust the document viewport for the final pixel alignment.
          window.scrollBy({ top: delta, left: 0, behavior: 'auto' })
        }

        finishTimer = window.setTimeout(() => {
          if (cancelled || !cardRef.current) return
          const finalCard = cardRef.current.getBoundingClientRect()
          const finalTarget = rectOf(target)
          if (!finalTarget) return
          setCardPosition({
            top: edge,
            left: Math.max(edge, (viewportWidth - finalCard.width) / 2),
          })
          setTargetRect(finalTarget)
        }, 80)
      }, 50)
    }

    // Ensure the card has completed its first layout before measuring it.
    const measureTimer = window.setTimeout(placeCard, 40)

    return () => {
      cancelled = true
      window.clearTimeout(measureTimer)
      if (scrollTimer) window.clearTimeout(scrollTimer)
      if (finishTimer) window.clearTimeout(finishTimer)
    }
  }, [tour?.index, targetFound, step])

  /*
   * Keep highlight + card positioned on scroll / resize.
   */
  useEffect(() => {
    if (!tour || !step || !targetFound) {
      return undefined
    }

    const update = () => {
      const rect = rectOf(findTarget(step.target))

      if (!rect) {
        setTargetFound(false)
        setTargetRect(null)
        return
      }

      setTargetRect(rect)

      const cardBox = cardRef.current?.getBoundingClientRect()
      const viewportWidth = window.visualViewport?.width ?? window.innerWidth
      const cardWidth = Math.min(cardBox?.width || 360, viewportWidth - 20)

      if (viewportWidth < 600) {
        const edge = 8
        const gap = 12
        const pad = 7
        const viewportHeight = window.visualViewport?.height ?? window.innerHeight
        const cardHeight = cardBox?.height || 260
        const needed = cardHeight + gap + pad
        const spaceAbove = rect.top
        const spaceBelow = viewportHeight - rect.bottom
        if (rect.height > viewportHeight) {
          setCardPosition({ top: edge, left: Math.max(edge, (viewportWidth - cardWidth) / 2) })
          return
        }
        const useAbove = spaceAbove >= needed && (spaceBelow < needed || spaceAbove >= spaceBelow)
        const top = useAbove
          ? Math.max(edge, rect.top - pad - gap - cardHeight)
          : spaceBelow >= needed
            ? Math.min(viewportHeight - cardHeight - edge, rect.bottom + pad + gap)
            : edge
        setCardPosition({ top, left: Math.max(edge, (viewportWidth - cardWidth) / 2) })
      } else {
        setCardPosition(
          positionCard(rect, cardBox?.width || 360, cardBox?.height || 300),
        )
      }
    }

    update()

    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)

    const visualViewport = window.visualViewport
    visualViewport?.addEventListener('resize', update)
    visualViewport?.addEventListener('scroll', update)

    const observerTarget = findTarget(step.target)
    const observer =
      observerTarget && typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(update)
        : null

    if (observerTarget) observer?.observe(observerTarget)

    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
      visualViewport?.removeEventListener('resize', update)
      visualViewport?.removeEventListener('scroll', update)
      observer?.disconnect()
    }
  }, [tour, step, targetFound])

  /*
   * Re-position when the card itself changes size.
   */
  useEffect(() => {
    if (!tour || !step || !targetFound || !cardRef.current) {
      return undefined
    }

    const updateCard = () => {
      if (!targetRect || !cardRef.current) return

      const cardRect = cardRef.current.getBoundingClientRect()
      const viewportWidth = window.visualViewport?.width ?? window.innerWidth

      if (viewportWidth < 600) {
        const edge = 8
        const gap = 12
        const pad = 7
        const viewportHeight = window.visualViewport?.height ?? window.innerHeight
        const needed = cardRect.height + gap + pad
        const spaceAbove = targetRect.top
        const spaceBelow = viewportHeight - targetRect.bottom
        if (targetRect.height > viewportHeight) {
          setCardPosition({ top: edge, left: Math.max(edge, (viewportWidth - cardRect.width) / 2) })
          return
        }
        const useAbove = spaceAbove >= needed && (spaceBelow < needed || spaceAbove >= spaceBelow)
        const top = useAbove
          ? Math.max(edge, targetRect.top - pad - gap - cardRect.height)
          : spaceBelow >= needed
            ? Math.min(viewportHeight - cardRect.height - edge, targetRect.bottom + pad + gap)
            : edge
        setCardPosition({ top, left: Math.max(edge, (viewportWidth - cardRect.width) / 2) })
      } else {
        setCardPosition(positionCard(targetRect, cardRect.width, cardRect.height))
      }
    }

    updateCard()

    if (typeof ResizeObserver === 'undefined') return undefined

    const observer = new ResizeObserver(updateCard)
    observer.observe(cardRef.current)

    return () => observer.disconnect()
  }, [tour, step, targetFound, targetRect])

  /* Mobile targets are scrolled below the card on every step. The card stays
   * directly above the spotlight and is not internally scrollable.
   */

  if (!tour || !step) return null

  /* ---- Intro screen ---- */
  if (tour.phase === 'intro') {
    return (
      <TourIntro
        onSkip={stopAppTour}
        onStart={() => {
          const startedTour = {
            ...tour,
            phase: 'tour',
          }

          saveTour(startedTour)
          setTour(startedTour)
          resetTarget()
        }}
      />
    )
  }

  if (!targetFound || !targetRect) return null

  /* ---- Step navigation ---- */
  const total = tour.steps.length

  const goTo = (index) => {
    const nextStep = tour.steps[index]
    const nextTour = {
      ...tour,
      index,
    }

    saveTour(nextTour)
    setTour(nextTour)
    resetTarget()

    if (nextStep.path && nextStep.path !== location.pathname) {
      navigate(nextStep.path)
    }
  }

  const next = () => {
    if (tour.index >= total - 1) {
      stopAppTour()
      return
    }

    goTo(tour.index + 1)
  }

  const back = () => {
    if (tour.index <= 0) return
    goTo(tour.index - 1)
  }

  return (
    <>
      <TourOverlay
        targetRect={targetRect}
        cardBottom={(cardPosition?.top ?? 8) + (cardRef.current?.getBoundingClientRect().height ?? 0)}
        clipTallTarget={(window.visualViewport?.width ?? window.innerWidth) < 600 && targetRect.height > (window.visualViewport?.height ?? window.innerHeight)}
      />

      <TourCard
        ref={cardRef}
        step={step}
        index={tour.index}
        total={total}
        position={cardPosition}
        onNext={next}
        onBack={back}
        onClose={stopAppTour}
      />
    </>
  )
}
