import { useEffect, useRef, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Grow from '@mui/material/Grow'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { keyframes } from '@mui/material/styles'

import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'

// Brand colours taken from the Avaada logo
const C = {
  navy: '#123A59',
  blue: '#1F6FB8',
  sky: '#2FA0D8',
  green: '#4FA83D',
  greenDark: '#3D8F2F',
  muted: '#6D8297',
  border: '#DCE6F0',
  canvas: '#F5F8FC',
  ink: '#1D3249',
}

const LOGO_SRC = '/images/avaada-logo.png'
const ROBOT_SRC = '/images/companion-robot.svg'

const SUGGESTIONS = [
  'Summarise my last meeting',
  'What are my pending action items?',
  'Show today’s meetings',
  'Draft a follow-up email',
]

const GREETING = {
  id: 'greeting',
  role: 'assistant',
  text: 'Hello, I’m your Companion. I can summarise meetings, find decisions in transcripts and track your action items.',
}

const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); opacity: .45; }
  40% { transform: translateY(-4px); opacity: 1; }
`

function TypingDots() {
  return (
    <Box
      aria-label="Companion is typing"
      role="status"
      sx={{
        display: 'inline-flex',
        gap: '4px',
        px: 1.5,
        py: 1.1,
        bgcolor: '#fff',
        border: `1px solid ${C.border}`,
        borderRadius: '4px 14px 14px 14px',
      }}
    >
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            bgcolor: C.blue,
            animation: `${bounce} 1.1s ease-in-out ${i * 0.15}s infinite`,
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          }}
        />
      ))}
    </Box>
  )
}

function Bubble({ role, text }) {
  const isUser = role === 'user'

  return (
    <Box sx={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <Typography
        component="div"
        sx={{
          maxWidth: '86%',
          px: 1.5,
          py: 1,
          fontSize: '0.8rem',
          lineHeight: 1.55,
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere',
          color: isUser ? '#fff' : C.ink,
          bgcolor: isUser ? C.navy : '#fff',
          border: isUser ? 'none' : `1px solid ${C.border}`,
          borderRadius: isUser ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
        }}
      >
        {text}
      </Typography>
    </Box>
  )
}

/**
 * Props
 * - open / onClose: control visibility
 * - onSend(text, history): optional async function that returns the reply text
 */
export default function CompanionChat({ open, onClose, onSend }) {
  const [messages, setMessages] = useState([GREETING])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)

  const inputRef = useRef(null)
  const endRef = useRef(null)

  // Focus the input when the panel opens
  useEffect(() => {
    if (!open) return undefined
    const t = setTimeout(() => inputRef.current?.focus(), 180)
    return () => clearTimeout(t)
  }, [open])

  // Keep the newest message in view
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, busy])

  const send = async (raw) => {
    const text = (raw ?? draft).trim()
    if (!text || busy) return

    const userMsg = { id: `u-${Date.now()}`, role: 'user', text }
    const history = [...messages, userMsg]

    setMessages(history)
    setDraft('')
    setBusy(true)

    try {
      const reply = onSend
        ? await onSend(text, history)
        : 'Companion is not connected to an assistant yet. Pass an onSend function to CompanionFab to enable replies.'

      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: 'assistant', text: String(reply ?? '') },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: 'assistant',
          text: 'I couldn’t get an answer just now. Please try again.',
        },
      ])
    } finally {
      setBusy(false)
    }
  }

  const reset = () => {
    setMessages([GREETING])
    setDraft('')
    setBusy(false)
    inputRef.current?.focus()
  }

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      onClose?.()
    }
  }

  const showSuggestions = messages.length === 1

  return (
    <Grow in={open} style={{ transformOrigin: 'bottom right' }} mountOnEnter unmountOnExit>
      <Paper
        id="companion-chat"
        role="dialog"
        aria-label="Companion chat"
        elevation={0}
        onKeyDown={onKeyDown}
        sx={{
          position: 'fixed',
          zIndex: (t) => t.zIndex.fab + 1,
          right: { xs: 0, sm: 16, md: 27 },
          bottom: { xs: 0, sm: 96, md: 108 },
          left: { xs: 0, sm: 'auto' },
          width: { xs: '100%', sm: 384 },
          height: { xs: '86dvh', sm: 'min(580px, calc(100dvh - 130px))' },
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          bgcolor: '#fff',
          border: `1px solid ${C.border}`,
          borderRadius: { xs: '18px 18px 0 0', sm: '18px' },
          boxShadow: '0 24px 60px rgba(18, 58, 89, 0.22), 0 4px 14px rgba(18, 58, 89, 0.08)',
        }}
      >
        {/* Header: logo on white, closed by the brand swoosh colours */}
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            height: 52,
          }}
        >
          <Box
            component="img"
            src={LOGO_SRC}
            alt="Avaada"
            sx={{ height: 28, width: 'auto', display: 'block' }}
          />

          <Box sx={{ display: 'flex', gap: 0.25 }}>
            <Tooltip title="New chat">
              <IconButton
                size="small"
                onClick={reset}
                aria-label="Start a new chat"
                sx={{ color: C.muted }}
              >
                <RestartAltRoundedIcon sx={{ fontSize: 19 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Close">
              <IconButton
                size="small"
                onClick={onClose}
                aria-label="Close Companion chat"
                sx={{ color: C.muted }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box
          aria-hidden="true"
          sx={{
            height: 3,
            flexShrink: 0,
            background: `linear-gradient(90deg, ${C.blue} 0%, ${C.sky} 50%, ${C.green} 100%)`,
          }}
        />

        {/* Identity */}
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            px: 2,
            py: 1.25,
            bgcolor: '#fff',
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <Avatar
            src={ROBOT_SRC}
            alt=""
            sx={{ width: 38, height: 38, border: `2px solid ${C.border}` }}
          />

          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ color: C.navy, fontSize: '0.88rem', fontWeight: 750, lineHeight: 1.25 }}>
              Companion
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
              <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: C.green }} />
              <Typography sx={{ color: C.muted, fontSize: '0.7rem', lineHeight: 1.4 }}>
                Your MeetAI assistant
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Conversation */}
        <Box
          role="log"
          aria-live="polite"
          aria-label="Conversation"
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.25,
            px: 2,
            py: 1.75,
            bgcolor: C.canvas,
          }}
        >
          {messages.map((m) => (
            <Bubble key={m.id} role={m.role} text={m.text} />
          ))}

          {showSuggestions && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, pt: 0.5 }}>
              {SUGGESTIONS.map((s) => (
                <ButtonBase
                  key={s}
                  onClick={() => send(s)}
                  sx={{
                    px: 1.25,
                    py: 0.6,
                    borderRadius: '999px',
                    border: `1px solid ${C.border}`,
                    bgcolor: '#fff',
                    color: C.blue,
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    lineHeight: 1.3,
                    textAlign: 'left',
                    transition: 'border-color 140ms ease, background-color 140ms ease',
                    '&:hover': { borderColor: C.blue, bgcolor: '#F0F6FC' },
                    '&:focus-visible': { outline: `2px solid ${C.blue}`, outlineOffset: 2 },
                  }}
                >
                  {s}
                </ButtonBase>
              ))}
            </Box>
          )}

          {busy && (
            <Box>
              <TypingDots />
            </Box>
          )}

          <div ref={endRef} />
        </Box>

        {/* Composer */}
        <Box sx={{ flexShrink: 0, px: 1.75, pt: 1.25, pb: 1, bgcolor: '#fff', borderTop: `1px solid ${C.border}` }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 1,
              pl: 1.5,
              pr: 0.75,
              py: 0.6,
              border: `1px solid ${C.border}`,
              borderRadius: '12px',
              bgcolor: '#fff',
              transition: 'border-color 140ms ease, box-shadow 140ms ease',
              '&:focus-within': {
                borderColor: C.blue,
                boxShadow: '0 0 0 3px rgba(31, 111, 184, 0.12)',
              },
            }}
          >
            <InputBase
              inputRef={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
              placeholder="Ask about meetings, minutes or tasks"
              multiline
              maxRows={4}
              fullWidth
              inputProps={{ 'aria-label': 'Message Companion' }}
              sx={{ py: 0.4, fontSize: '0.8rem', color: C.ink, lineHeight: 1.5 }}
            />

            <IconButton
              onClick={() => send()}
              disabled={!draft.trim() || busy}
              aria-label="Send message"
              sx={{
                width: 32,
                height: 32,
                flexShrink: 0,
                color: '#fff',
                bgcolor: C.green,
                '&:hover': { bgcolor: C.greenDark },
                '&.Mui-disabled': { bgcolor: '#C9D6E2', color: '#fff' },
              }}
            >
              <SendRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>

          <Typography sx={{ mt: 0.75, textAlign: 'center', color: C.muted, fontSize: '0.64rem', lineHeight: 1.4 }}>
            AI can make mistakes. Check important details before acting on them.
          </Typography>
        </Box>
      </Paper>
    </Grow>
  )
}