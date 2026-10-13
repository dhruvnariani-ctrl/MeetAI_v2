import { useRef } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'

import AccountMenu from './AccountMenu'
import HeaderSearch from './HeaderSearch'
import { startAppTour } from './TourRunner'
import { APP_TOUR_STEPS } from '../data/tours'

const LOGO_SRC = `${import.meta.env.BASE_URL}/images/Avaada Clean Energy Logo.png`

export default function Header({
  query,
  onQueryChange,
  navOpen,
  onToggleNav,
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // Timestamp of the last hover-open, used to ignore the click that follows it.
  const openedByHoverAt = useRef(0)

  const toggleNavigation = () => {
    onToggleNav?.()
  }

  const handleLogoHover = (event) => {
    // Only real mouse hover; touch and pen use the tap/click instead.
    if (event.pointerType && event.pointerType !== 'mouse') return
    if (!navOpen) {
      openedByHoverAt.current = Date.now()
      onToggleNav?.()
    }
  }

  const handleLogoClick = () => {
    // Ignore the click that follows a hover-open so it doesn't close the drawer.
    if (Date.now() - openedByHoverAt.current < 600) return
    toggleNavigation()
  }

  const handleLogoKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleNavigation()
    }
  }

  return (
    <AppBar
      component="header"
      position="static"
      elevation={0}
      sx={{
        flexShrink: 0,
        width: '100%',
        bgcolor: '#FFFFFF',
        color: '#163653',
        borderBottom: '1px solid #E2EAF3',
        boxSizing: 'border-box',
        backgroundImage: 'none',
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          minWidth: 0,
          minHeight: { xs: 64, md: 72 },
          height: { xs: 64, md: 72 },
          px: { xs: 1.25, sm: 2, md: 2.5 },
          gap: { xs: 1, sm: 1.5, md: 2 },
        }}
      >
        {/* AVAADA logo: shown in the header on smaller screens */}
        {isMobile && (
          <Tooltip
            title={navOpen ? '' : 'Open navigation'}
            disableInteractive
          >
            <Box
              component="button"
              type="button"
              onClick={handleLogoClick}
              onPointerEnter={handleLogoHover}
              onKeyDown={handleLogoKeyDown}
              aria-label={
                navOpen ? 'Close navigation menu' : 'Open navigation menu'
              }
              aria-expanded={Boolean(navOpen)}
              sx={{
                appearance: 'none',
                WebkitAppearance: 'none',
                flex: '0 0 112px',
                width: 112,
                height: 56,
                minWidth: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 0,
                m: 0,
                border: 0,
                borderRadius: 0,
                bgcolor: 'transparent',
                cursor: 'pointer',
                overflow: 'hidden',
                '&:focus-visible': {
                  outline: '2px solid #16815B',
                  outlineOffset: 3,
                  borderRadius: 1,
                },
              }}
            >
              <Box
                component="img"
                src={LOGO_SRC}
                alt="AVAADA"
                sx={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
          </Tooltip>
        )}

        {/* Search: compact on desktop and flexible on smaller screens */}
        <Box
          sx={{
            flex: {
              xs: '1 1 auto',
              md: '0 1 560px',
            },
            width: {
              xs: 'auto',
              md: 'min(560px, 45vw)',
            },
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            '& > *': {
              width: '100%',
              minWidth: 0,
            },
          }}
        >
          <HeaderSearch
            query={query}
            onQueryChange={onQueryChange}
          />
        </Box>

        {/* Flexible space keeps the header actions aligned to the right */}
        <Box sx={{ flex: '1 1 auto', minWidth: 0 }} />

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton
            aria-label="Notifications"
            sx={{
              flex: '0 0 40px',
              width: 40,
              height: 40,
              p: 0,
              color: '#31506C',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                bgcolor: '#EDF4FB',
              },
            }}
          >
            <NotificationsNoneOutlinedIcon sx={{ fontSize: 23 }} />
          </IconButton>
        </Tooltip>

        {/* Account profile and app tour */}
        <Box
          sx={{
            flex: '0 0 44px',
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& .MuiIconButton-root': {
              width: 44,
              height: 44,
              minWidth: 44,
              p: 0,
              bgcolor: '#287BA9',
              color: '#FFFFFF',
              '&:hover': {
                bgcolor: '#1C638D',
              },
            },
          }}
        >
          <AccountMenu
            onStartTour={() => startAppTour(APP_TOUR_STEPS)}
          />
        </Box>
      </Toolbar>
    </AppBar>
  )
}