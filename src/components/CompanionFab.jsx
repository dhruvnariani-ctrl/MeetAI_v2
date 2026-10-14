
import { useEffect, useRef, useState } from 'react'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import Paper from '@mui/material/Paper'

import CompanionChat from './CompanionChat'

const DEFAULT_IMAGE = `${import.meta.env.BASE_URL}/images/companion-robot.svg`

export default function CompanionFab({
  imageSrc = DEFAULT_IMAGE,
  onSend,
  onClick,
}) {
  const [open, setOpen] = useState(false)
  const [atPageBottom, setAtPageBottom] = useState(false)

  const fabRef = useRef(null)
  const bottomRef = useRef(false)

  useEffect(() => {
    let activeScrollContainer = null

    const updatePosition = (value) => {
      if (bottomRef.current !== value) {
        bottomRef.current = value
        setAtPageBottom(value)
      }
    }

    const checkWindowBottom = () => {
      const doc = document.documentElement
      const scrollTop =
        window.scrollY ||
        document.scrollingElement?.scrollTop ||
        doc.scrollTop ||
        0

      const viewportHeight = window.innerHeight
      const pageHeight = Math.max(
        doc.scrollHeight,
        document.body?.scrollHeight || 0,
      )

      updatePosition(
        scrollTop + viewportHeight >= pageHeight - 12,
      )
    }

    const handleScroll = (event) => {
      const target = event.target

      // Normal browser-window scrolling.
      if (
        target === document ||
        target === document.documentElement ||
        target === document.body
      ) {
        activeScrollContainer = null
        checkWindowBottom()
        return
      }

      // Support pages whose main content scrolls inside a container.
      if (target instanceof Element) {
        const style = window.getComputedStyle(target)
        const overflowY = style.overflowY

        const isScrollable =
          /(auto|scroll|overlay)/.test(overflowY) &&
          target.scrollHeight > target.clientHeight

        if (isScrollable) {
          activeScrollContainer = target

          const distanceFromBottom =
            target.scrollHeight -
            target.clientHeight -
            target.scrollTop

          updatePosition(distanceFromBottom <= 12)
        }
      }
    }

    const handleResize = () => {
      if (activeScrollContainer?.isConnected) {
        const element = activeScrollContainer

        updatePosition(
          element.scrollHeight -
            element.clientHeight -
            element.scrollTop <=
            12,
        )
      } else {
        checkWindowBottom()
      }
    }

    // Capture scroll events from nested containers too.
    document.addEventListener('scroll', handleScroll, {
      capture: true,
      passive: true,
    })

    window.addEventListener('scroll', checkWindowBottom, {
      passive: true,
    })

    window.addEventListener('resize', handleResize)

    // Recheck when the page content grows or shrinks.
    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(handleResize)
        : null

    observer?.observe(document.documentElement)

    if (document.body) {
      observer?.observe(document.body)
    }

    checkWindowBottom()

    return () => {
      document.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('scroll', checkWindowBottom)
      window.removeEventListener('resize', handleResize)
      observer?.disconnect()
    }
  }, [])

  const handleToggle = () => {
    setOpen((prev) => !prev)
    onClick?.()
  }

  const handleClose = () => {
    setOpen(false)
    fabRef.current?.focus()
  }

  return (
    <>
      <CompanionChat
        open={open}
        onClose={handleClose}
        onSend={onSend}
      />

      <Box
        sx={{
          position: 'fixed',
          right: { xs: 16, md: 27 },

          // Normal position everywhere; lift slightly at the bottom.
          bottom: atPageBottom
            ? { xs: 100, md: 90 }
            : { xs: 26, md: 27 },

          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: (theme) => theme.zIndex.fab,
          transition: 'bottom 220ms ease',
        }}
      >
        {!open && (
          <Paper
            aria-hidden="true"
            elevation={0}
            sx={{
              display: { xs: 'none', sm: 'block' },
              px: 2,
              height: 32,
              lineHeight: '32px',
              borderRadius: '16px',
              border: '1px solid',
              borderColor: 'divider',
              color: '#123A59',
              fontSize: '0.8125rem',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(11,37,69,.08)',
              whiteSpace: 'nowrap',
            }}
          >
            Ask your Companion
          </Paper>
        )}

        <Fab
          ref={fabRef}
          aria-label="Ask your Companion"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="companion-chat"
          onClick={handleToggle}
          sx={{
            width: 64,
            height: 64,
            p: 0,
            flexShrink: 0,
            border: '3px solid #fff',
            background:
              'radial-gradient(circle at 30% 25%, #fff, #cfe0f5)',
            boxShadow: '0 6px 20px rgba(11,37,69,.25)',
            '&:hover': {
              filter: 'brightness(.97)',
            },
          }}
        >
          <Avatar
            src={imageSrc}
            alt=""
            sx={{
              width: '100%',
              height: '100%',
              bgcolor: 'transparent',
            }}
          />
        </Fab>
      </Box>
    </>
  )
}
