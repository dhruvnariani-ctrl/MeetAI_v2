import Box from '@mui/material/Box'

const OVERLAY = 'rgba(10, 29, 43, 0.55)'
const PAD = 7

export default function TourOverlay({ targetRect }) {
  if (!targetRect) return null

  const top = Math.max(targetRect.top - PAD, 0)
  const bottom = Math.min(
    targetRect.bottom + PAD,
    window.innerHeight,
  )
  const left = Math.max(targetRect.left - PAD, 0)
  const right = Math.min(
    targetRect.right + PAD,
    window.innerWidth,
  )

  const middleHeight = Math.max(bottom - top, 0)
  const spotlightWidth = Math.max(right - left, 0)
  const spotlightHeight = Math.max(bottom - top, 0)

  return (
    <>
      {/* Four panels keep the selected target visible */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 1400,
          pointerEvents: 'none',
        }}
      >
        {/* Top panel */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: top,
            bgcolor: OVERLAY,
          }}
        />

        {/* Bottom panel */}
        <Box
          sx={{
            position: 'absolute',
            top: bottom,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: OVERLAY,
          }}
        />

        {/* Left panel */}
        <Box
          sx={{
            position: 'absolute',
            top,
            left: 0,
            width: left,
            height: middleHeight,
            bgcolor: OVERLAY,
          }}
        />

        {/* Right panel */}
        <Box
          sx={{
            position: 'absolute',
            top,
            left: right,
            right: 0,
            height: middleHeight,
            bgcolor: OVERLAY,
          }}
        />
      </Box>

      {/* Executive green spotlight */}
      <Box
        sx={{
          position: 'fixed',
          zIndex: 1401,
          top,
          left,
          width: spotlightWidth,
          height: spotlightHeight,
          boxSizing: 'border-box',
          borderRadius: '10px',
          border: '2px solid #16815B',
          boxShadow:
            '0 0 0 3px rgba(22,129,91,0.12), 0 4px 16px rgba(12,41,64,0.12)',
          transition:
            'top 180ms ease, left 180ms ease, width 180ms ease, height 180ms ease',
          pointerEvents: 'none',
        }}
      />
    </>
  )
}