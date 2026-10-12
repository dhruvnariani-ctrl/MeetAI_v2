import Box from '@mui/material/Box'

export default function HeroIllustration() {
  return (
    <Box
      aria-hidden="true"
      sx={{
        width: { xs: '100%', sm: 260, md: 300 },
        maxWidth: 320,
        flexShrink: 0,
      }}
    >
      <svg viewBox="0 0 300 170" width="100%" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="hiw-leaf-a" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#3E9F55" />
            <stop offset="1" stopColor="#69BE6E" />
          </linearGradient>
          <linearGradient id="hiw-leaf-b" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#37914F" />
            <stop offset="1" stopColor="#5CB561" />
          </linearGradient>
        </defs>

        {/* soft blue blob */}
        <path
          d="M30 95 C18 55 70 22 140 22 C215 20 282 40 284 92 C286 140 230 156 150 156 C70 158 40 140 30 95 Z"
          fill="#E4F1FA"
        />

        {/* pale leaves, left */}
        <path d="M52 128 C40 100 60 78 84 70 C92 92 84 118 52 128 Z" fill="#BDE3E7" />
        <path d="M66 130 C66 110 82 98 100 96 C100 112 90 126 66 130 Z" fill="#A5D8DD" />

        {/* laptop */}
        <rect x="72" y="30" width="150" height="92" rx="6" fill="#1E4C8A" />
        <rect x="77" y="35" width="140" height="82" rx="3" fill="#FFFFFF" />
        <line x1="147" y1="35" x2="147" y2="117" stroke="#E3EDF6" />

        <rect x="83" y="43" width="26" height="4" rx="2" fill="#C8D9E9" />
        <rect x="83" y="56" width="46" height="5" rx="2" fill="#DCE8F3" />
        <rect x="83" y="68" width="38" height="5" rx="2" fill="#DCE8F3" />
        <rect x="83" y="80" width="42" height="5" rx="2" fill="#DCE8F3" />
        <rect x="83" y="92" width="30" height="5" rx="2" fill="#DCE8F3" />
        <rect x="153" y="43" width="26" height="4" rx="2" fill="#C8D9E9" />
        <rect x="153" y="52" width="58" height="58" rx="5" fill="#F1F7FC" />

        {/* play button */}
        <circle cx="182" cy="81" r="21" fill="#123A7A" />
        <path d="M176 70 L194 81 L176 92 Z" fill="#FFFFFF" />

        {/* laptop base */}
        <path d="M60 122 H234 L228 131 Q226 134 222 134 H72 Q68 134 66 131 Z" fill="#1E4C8A" />
        <rect x="132" y="122" width="30" height="3" rx="1.5" fill="#5D86B8" />

        {/* green leaves, right */}
        <path d="M224 112 C214 74 234 38 270 20 C280 58 262 98 224 112 Z" fill="url(#hiw-leaf-a)" />
        <path d="M228 110 C240 82 252 54 266 28" stroke="#FFFFFF" strokeOpacity=".55" strokeWidth="1.2" fill="none" />
        <path d="M228 126 C232 96 256 74 288 70 C290 104 264 128 228 126 Z" fill="url(#hiw-leaf-b)" />
        <path d="M232 122 C250 104 266 90 282 78" stroke="#FFFFFF" strokeOpacity=".5" strokeWidth="1.1" fill="none" />
      </svg>
    </Box>
  )
}
