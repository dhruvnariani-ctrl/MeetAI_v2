import { useRef, useState } from 'react'

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
  placement = 'floating',
}) {
  const [open, setOpen] = useState(false)
  const fabRef = useRef(null)

  const isHeader = placement === 'header'

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
          position: isHeader ? 'relative' : 'fixed',
          right: isHeader ? 'auto' : { xs: 16, md: 27 },
          bottom: isHeader ? 'auto' : { xs: 26, md: 27 },
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexShrink: 0,
          zIndex: isHeader ? 'auto' : (theme) => theme.zIndex.fab,
        }}
      >
        {!open && (
          <Paper
            aria-hidden="true"
            elevation={0}
            sx={{
              display: isHeader ? 'none' : { xs: 'none', sm: 'block' },
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
            width: isHeader ? 44 : 64,
            height: isHeader ? 44 : 64,
            minHeight: isHeader ? 44 : 64,
            p: 0,
            flexShrink: 0,
            border: '3px solid #fff',
            background:
              'radial-gradient(circle at 30% 25%, #fff, #cfe0f5)',
            boxShadow: '0 4px 12px rgba(11,37,69,.18)',
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