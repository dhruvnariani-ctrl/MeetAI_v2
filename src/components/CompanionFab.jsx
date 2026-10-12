import { useRef, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import Paper from '@mui/material/Paper'

import CompanionChat from './CompanionChat'

// Put companion-robot.svg in your project's public/images folder.
const DEFAULT_IMAGE = '/images/companion-robot.svg'

/**
 * Props
 * - imageSrc: robot image (defaults to /images/companion-robot.svg)
 * - onSend(text, history): optional async function returning the reply text
 * - onClick: optional extra callback when the button is pressed
 */
export default function CompanionFab({
  imageSrc = DEFAULT_IMAGE,
  onSend,
  onClick,
}) {
  const [open, setOpen] = useState(false)
  const fabRef = useRef(null)

  const handleToggle = () => {
    setOpen((prev) => !prev)
    onClick?.()
  }

  const handleClose = () => {
    setOpen(false)
    // Return keyboard focus to the button that opened the chat
    fabRef.current?.focus()
  }

  return (
    <>
      <CompanionChat open={open} onClose={handleClose} onSend={onSend} />

      <Box
        sx={{
          position: 'fixed',
          right: { xs: 16, md: 27 },
          bottom: { xs: 16, md: 27 },
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: (t) => t.zIndex.fab,
        }}
      >
        {/* Visual label only; the button below carries the same accessible name */}
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
              fontSize: '0.8rem',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(11,37,69,.08)',
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
            border: '3px solid #fff',
            background: 'radial-gradient(circle at 30% 25%, #fff, #cfe0f5)',
            boxShadow: '0 6px 20px rgba(11,37,69,.25)',
            '&:hover': { filter: 'brightness(.97)' },
          }}
        >
          <Avatar
            src={imageSrc}
            alt=""
            sx={{ width: '100%', height: '100%', bgcolor: 'transparent' }}
          />
        </Fab>
      </Box>
    </>
  )
}