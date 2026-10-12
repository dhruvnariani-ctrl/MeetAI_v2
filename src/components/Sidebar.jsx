import { Link as RouterLink, useLocation } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme, keyframes } from '@mui/material/styles'

import AddIcon from '@mui/icons-material/Add'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined'
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined'
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined'

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/', Icon: GridViewOutlinedIcon },
  { label: 'Calendar', to: '/calendar', Icon: CalendarTodayOutlinedIcon },
  { label: 'Recorded Meetings', to: '/recorded', Icon: DescriptionOutlinedIcon },
  { label: 'My Tasks', to: '/tasks', Icon: AssignmentTurnedInOutlinedIcon },
]

const ACTION_ITEMS = [
  { label: 'Refresh', Icon: SyncOutlinedIcon, action: 'refresh' },
  { label: 'How it works', Icon: HelpOutlineOutlinedIcon, to: '/how-it-works' },
]

const EXPANDED_WIDTH = 238
const COLLAPSED_WIDTH = 76
const TOOLTIP_BG = '#123A59'

const tooltipIn = keyframes`
  from { opacity: 0; transform: translateX(-8px) scale(0.96); }
  to   { opacity: 1; transform: translateX(0) scale(1); }
`

// Shows only when `show` is true (sidebar collapsed).
// An empty title means MUI renders no tooltip at all.
function SidebarTooltip({ title, show, children }) {
  return (
    <Tooltip
      title={show ? title : ''}
      placement="right"
      arrow
      enterDelay={80}
      enterNextDelay={80}
      slotProps={{
        popper: {
          modifiers: [{ name: 'offset', options: { offset: [0, 8] } }],
        },
        tooltip: {
          sx: {
            bgcolor: TOOLTIP_BG,
            color: '#fff',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.01em',
            px: 1.25,
            py: 0.6,
            borderRadius: '6px',
            boxShadow: '0 6px 18px rgba(8, 46, 78, 0.28)',
            animation: `${tooltipIn} 220ms cubic-bezier(0.22, 1, 0.36, 1)`,
          },
        },
        arrow: {
          sx: { color: TOOLTIP_BG },
        },
      }}
    >
      {children}
    </Tooltip>
  )
}

export default function Sidebar({
  open,
  onToggle,
  onNewMeeting, // opens the one "New meeting" dialog
  onSync,
  currentUser,
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), {
    noSsr: true,
  })
  const { pathname } = useLocation()

  const width = open ? EXPANDED_WIDTH : COLLAPSED_WIDTH
  const name = currentUser?.name || 'Dhruv Nariani'
  const email = currentUser?.email || 'avaada.com'

  const initials =
    currentUser?.initials ||
    name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()

  const isActive = (to) =>
    to === '/'
      ? pathname === '/'
      : pathname === to || pathname.startsWith(`${to}/`)

  // Shared row layout for all navigation and action controls.
  const rowSx = {
    boxSizing: 'border-box',
    display: 'flex',
    width: '100%',
    minWidth: 0,
    minHeight: 34,
    height: 34,
    px: 1,
    py: 0,
    borderRadius: '5px',
    justifyContent: open ? 'flex-start' : 'center',
    textAlign: 'left',
    color: '#d6e4f2',
    fontFamily: 'inherit',

    '& .MuiListItemIcon-root': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: open ? 23 : 0,
      width: open ? 23 : 'auto',
      mr: 0,
      color: 'inherit',
      flexShrink: 0,
    },

    '& .MuiListItemIcon-root .MuiSvgIcon-root': {
      fontSize: 16,
    },

    '& .MuiListItemText-root': {
      minWidth: 0,
      my: 0,
      ml: 0,
    },

    '& .MuiListItemText-primary': {
      display: 'block',
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: 1.2,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },

    '&.Mui-selected': {
      bgcolor: '#1b5b89',
      boxShadow: 'inset 3px 0 0 #8acbff',
      color: '#fff',
    },

    '&.Mui-selected:hover': {
      bgcolor: '#216795',
    },

    '&:hover': {
      bgcolor: 'rgba(255,255,255,0.08)',
    },

    '&:focus-visible': {
      outline: '2px solid #9fd4ff',
      outlineOffset: -2,
    },
  }

  const renderRow = ({ label, to, Icon, action }) => {
    const selected = to ? isActive(to) : false

    return (
      <SidebarTooltip key={label} title={label} show={!open}>
        <ListItemButton
          component={to ? RouterLink : 'button'}
          {...(to ? { to } : {})}
          onClick={action === 'refresh' ? onSync : undefined}
          selected={Boolean(selected)}
          aria-current={selected ? 'page' : undefined}
          aria-label={!open ? label : undefined}
          sx={rowSx}
        >
          <ListItemIcon>
            <Icon />
          </ListItemIcon>

          {open && <ListItemText primary={label} />}
        </ListItemButton>
      </SidebarTooltip>
    )
  }

  const sidebarContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
        color: '#f4f8ff',
        background: 'linear-gradient(180deg, #0b3b61 0%, #082e4e 100%)',
      }}
    >
      {/* Brand */}
      <Box
        component={RouterLink}
        to="/"
        aria-label="Avaada home"
        sx={{
          height: 76,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 1,
          borderBottom: '1px solid rgba(255,255,255,0.12)',
          textDecoration: 'none',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src="/images/Avaada Blue-Green Swoosh Logo.png"
          alt="Avaada — Always clean. Always on."
          sx={{
            display: 'block',
            width: open ? 190 : 48,
            height: open ? 56 : 44,
            maxWidth: '100%',
            objectFit: 'contain',
            transition: 'width 180ms ease, height 180ms ease',
          }}
        />
      </Box>

      {/* Main pages */}
      <Box
        component="nav"
        aria-label="Primary navigation"
        sx={{
          flexShrink: 0,
          px: 0.75,
          pt: 1.5,
          pb: 1.25,
        }}
      >
        <List
          data-tour="sidebar-navigation"
          disablePadding
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.35,
          }}
        >
          {NAV_ITEMS.map(renderRow)}
        </List>
      </Box>

      <Divider
        sx={{
          mx: 1,
          flexShrink: 0,
          borderColor: 'rgba(255,255,255,0.18)',
        }}
      />

      {/* New meeting and action controls */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          px: 0.75,
          pt: 1.25,
          pb: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.35,
        }}
      >
        <SidebarTooltip title="Schedule or Join with MeetAI" show={!open}>
          <Button
            // Keep this value: your product tour may select this button by it.
            data-tour="Add MeetAI to a Meeting"
            fullWidth
            onClick={onNewMeeting}
            startIcon={<AddIcon />}
            aria-label={!open ? 'Schedule or Join with MeetAI' : undefined}
            sx={{
              boxSizing: 'border-box',
              width: '100%',
              minWidth: 0,
              minHeight: 34,
              height: 34,
              flexShrink: 0,
              mb: 0.6,
              px: 1,
              borderRadius: '6px',
              color: '#fff',
              bgcolor: '#239b55',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'none',
              whiteSpace: 'nowrap',
              justifyContent: open ? 'flex-start' : 'center',

              '& .MuiButton-startIcon': {
                mr: open ? 0.6 : 0,
                ml: 0,
              },

              '& .MuiSvgIcon-root': {
                fontSize: 16,
              },

              '&:hover': {
                bgcolor: '#1b8849',
              },
            }}
          >
            {open ? 'Schedule or Join with MeetAI' : null}
          </Button>
        </SidebarTooltip>

        <List
          data-tour="sidebar-controls"
          disablePadding
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.35,
          }}
        >
          {ACTION_ITEMS.map(renderRow)}

          {!isMobile && (
            <SidebarTooltip title="Expand" show={!open}>
              <ListItemButton
                component="button"
                onClick={onToggle}
                aria-expanded={open}
                aria-controls="sidebar"
                aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
                sx={rowSx}
              >
                <ListItemIcon>
                  {open ? (
                    <ChevronLeftOutlinedIcon />
                  ) : (
                    <ChevronRightOutlinedIcon />
                  )}
                </ListItemIcon>

                {open && <ListItemText primary="Collapse" />}
              </ListItemButton>
            </SidebarTooltip>
          )}
        </List>
      </Box>

      <Divider
        sx={{
          flexShrink: 0,
          borderColor: 'rgba(255,255,255,0.18)',
        }}
      />

      {/* Profile at the bottom */}
      <Box
        sx={{
          minHeight: 54,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-start' : 'center',
          gap: 0.8,
          px: open ? 1 : 0.5,
          py: 0.8,
        }}
      >
        <Avatar
          sx={{
            width: 25,
            height: 25,
            flexShrink: 0,
            bgcolor: '#dceafa',
            color: '#15517c',
            fontSize: '0.62rem',
            fontWeight: 700,
          }}
        >
          {initials}
        </Avatar>

        {open && (
          <Box sx={{ minWidth: 0 }}>
            <Typography
              noWrap
              sx={{
                fontSize: '0.65rem',
                lineHeight: 1.35,
                fontWeight: 650,
                color: '#fff',
              }}
            >
              {name}
            </Typography>

            <Typography
              noWrap
              sx={{
                mt: 0.15,
                fontSize: '0.59rem',
                lineHeight: 1.3,
                color: '#b7cee2',
              }}
            >
              {email}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )

  if (isMobile) {
    return (
      <Drawer
        id="sidebar"
        data-tour="sidebar"
        variant="temporary"
        open={open}
        onClose={onToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: EXPANDED_WIDTH,
            height: '100dvh',
            maxHeight: '100dvh',
            boxSizing: 'border-box',
            border: 0,
            overflow: 'hidden',
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    )
  }

  return (
    <Drawer
      id="sidebar"
      data-tour="sidebar"
      variant="permanent"
      sx={{
        width,
        height: '100dvh',
        flexShrink: 0,
        transition: theme.transitions.create('width', {
          duration: 180,
        }),

        '& .MuiDrawer-paper': {
          position: 'relative',
          width,
          height: '100dvh',
          maxHeight: '100dvh',
          boxSizing: 'border-box',
          border: 0,
          overflow: 'hidden',
          transition: theme.transitions.create('width', {
            duration: 180,
          }),
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  )
}