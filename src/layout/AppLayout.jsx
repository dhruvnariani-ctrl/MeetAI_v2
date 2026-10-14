
import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import CompanionFab from '../components/CompanionFab'
import NewMeetingDialog from '../components/event/NewMeetingDialog'

import { searchDirectory } from '../data/Directory'
import useCurrentUser from '../hooks/useCurrentUser'

export default function AppLayout() {
  const theme = useTheme()
  const desktop = useMediaQuery(theme.breakpoints.up('md'))

  const [navOpen, setNavOpen] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(min-width: 900px)').matches
      : false,
  )

  const [query, setQuery] = useState('')
  const [lastSynced, setLastSynced] = useState(() => new Date())

  const [meetingOpen, setMeetingOpen] = useState(false)
  const [meetingKey, setMeetingKey] = useState(0)
  const [meetingMode, setMeetingMode] = useState(null)

  const currentUser = useCurrentUser()
  const mainRef = useRef(null)
  const { pathname } = useLocation()
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    mainRef.current?.scrollTo({ top: 0, behavior: 'auto' })
    mainRef.current?.focus()
  }, [pathname])

  // Only set the initial navigation state when crossing desktop/mobile sizes.
  useEffect(() => {
    setNavOpen(desktop)
  }, [desktop])

  const toggleNavigation = () => {
    setNavOpen((open) => !open)
  }

  const openMeetingDialog = (mode = null) => {
    setMeetingMode(mode)
    setMeetingKey((key) => key + 1)
    setMeetingOpen(true)
  }

  const openNewMeeting = () => openMeetingDialog()

  const handleCreate = (event) => {
    console.log('Create event', event)
    setMeetingOpen(false)
  }

  const handleInstantJoin = (details) => {
    console.log('Start recording', details)
    setMeetingOpen(false)
  }

  const sidebarProps = {
    open: navOpen,
    onToggle: toggleNavigation,
    onNewMeeting: openNewMeeting,
    currentUser,
    lastSynced,
    onSync: () => setLastSynced(new Date()),
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100dvh',
        display: 'flex',
        overflow: 'hidden',
        bgcolor: '#F4F7FA',
      }}
    >
      <Box
        component="a"
        href="#main"
        sx={{
          position: 'fixed',
          left: 12,
          top: -60,
          zIndex: 3000,
          px: 2,
          py: 1.25,
          borderRadius: 2,
          bgcolor: '#123A59',
          color: '#fff',
          textDecoration: 'none',
          '&:focus': { top: 12 },
        }}
      >
        Skip to main content
      </Box>

      {/* Permanent sidebar occupies its own column on desktop */}
      {desktop && <Sidebar {...sidebarProps} />}

      {/* Header and page content fill the remaining width */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 0%',
          width: 0,
          minWidth: 0,
          height: '100dvh',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Header
          navOpen={navOpen}
          onToggleNav={toggleNavigation}
          query={query}
          onQueryChange={setQuery}
        />

        <Box
          component="main"
          id="main"
          ref={mainRef}
          tabIndex={-1}
          sx={{
            position: 'relative',
            flex: '1 1 0%',
            minHeight: 0,
            minWidth: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            outline: 'none',
            bgcolor: '#FFFFFF',
            m: { xs: 0, md: '2px 2px 0 2px' },
            borderRadius: { xs: 0, md: '16px 16px 0 0' },
            border: { md: '1px solid #DDE5EF' },
            px: { xs: 1.5, sm: 2, lg: 2.5 },
            pt: { xs: 1.5, md: 1 },
            pb: {xs:4, md:4},
          }}
        >
          <Outlet
            context={{
              openNewMeeting,
              openCreate: openNewMeeting,
              openInstant: openNewMeeting,
              currentUser,
              query,
            }}
          />
        </Box>
      </Box>

      {/* Temporary drawer only on mobile */}
      {!desktop && <Sidebar {...sidebarProps} />}

      <NewMeetingDialog
        key={`meeting-${meetingKey}`}
        open={meetingOpen}
        initialMode={meetingMode}
        onClose={() => setMeetingOpen(false)}
        onCreate={handleCreate}
        onInstantJoin={handleInstantJoin}
        currentUser={currentUser}
        searchDirectory={searchDirectory}
      />

      <CompanionFab
        onClick={() => console.log('open companion')}
      />
    </Box>
  )
}
