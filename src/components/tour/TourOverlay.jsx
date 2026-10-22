import Box from '@mui/material/Box'

const OVERLAY = 'rgba(10, 29, 43, 0.55)'
const PAD = 7

export default function TourOverlay({ targetRect, cardBottom = 0, clipTallTarget = false }) {
  if (!targetRect || typeof window === 'undefined') return null

  const viewportWidth = window.visualViewport?.width ?? window.innerWidth
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight

  const normalTop = Math.min(Math.max(targetRect.top - PAD, 0), viewportHeight)
  // For tall mobile targets, begin the visible spotlight below the card.
  // The target can continue below the viewport and be inspected by scrolling.
  const top = clipTallTarget
    ? Math.min(Math.max(normalTop, cardBottom + 12), viewportHeight)
    : normalTop
  const bottom = Math.min(Math.max(targetRect.bottom + PAD, top), viewportHeight)
  const left = Math.min(Math.max(targetRect.left - PAD, 0), viewportWidth)
  const right = Math.min(Math.max(targetRect.right + PAD, left), viewportWidth)
  const middleHeight = Math.max(bottom - top, 0)
  const spotlightWidth = Math.max(right - left, 0)

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 1400,
          pointerEvents: 'none',
        }}
      >
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: top, bgcolor: OVERLAY }} />
        <Box sx={{ position: 'absolute', top: bottom, left: 0, right: 0, bottom: 0, bgcolor: OVERLAY }} />
        <Box sx={{ position: 'absolute', top, left: 0, width: left, height: middleHeight, bgcolor: OVERLAY }} />
        <Box sx={{ position: 'absolute', top, left: right, right: 0, height: middleHeight, bgcolor: OVERLAY }} />
      </Box>

      <Box
        sx={{
          position: 'fixed',
          zIndex: 1401,
          top,
          left,
          width: spotlightWidth,
          height: middleHeight,
          boxSizing: 'border-box',
          borderRadius: { xs: '8px', sm: '10px' },
          border: '2px solid #16815B',
          boxShadow: '0 0 0 3px rgba(22,129,91,0.12), 0 4px 16px rgba(12,41,64,0.12)',
          transition: 'top 180ms ease, left 180ms ease, width 180ms ease, height 180ms ease',
          pointerEvents: 'none',
        }}
      />
    </>
  )
}
