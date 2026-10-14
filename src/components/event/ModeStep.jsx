
import { Box, ButtonBase, Typography } from '@mui/material'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import EventOutlinedIcon from '@mui/icons-material/EventOutlined'
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined'

import { C } from './constants'

const OPTIONS = [
  {
    id: 'link',
    icon: <LinkOutlinedIcon />,
    title: 'I have a meeting link',
    text: 'Paste a Zoom, Google Meet or Teams link and MeetAI joins to take notes.',
    color: C.green,
    tint: C.paleGreen,
  },
  {
    id: 'schedule',
    icon: <EventOutlinedIcon />,
    title: 'Set up a new meeting',
    text: 'Choose a time (or start now), invite people and pick where to meet.',
    color: C.blue,
    tint: C.paleBlue,
  },
]

export default function ModeStep({ onChoose }) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1000,
        mx: 'auto',
        py: { xs: 0.5, sm: 0.75 },
      }}
    >
      <Typography
        component="h3"
        sx={{
          mb: { xs: 1, sm: 1.25 },
          fontSize: { xs: '0.9rem', sm: '0.98rem' },
          fontWeight: 750,
          color: C.navy,
        }}
      >
        What would you like to do?
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            sm: 'repeat(2, minmax(0, 1fr))',
          },
          gap: { xs: 1, sm: 1.5 },
        }}
      >
        {OPTIONS.map((option) => (
          <ButtonBase
            key={option.id}
            onClick={() => onChoose(option.id)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: { xs: 0.8, sm: 1 },
              minHeight: { xs: 175, sm: 190 },
              p: { xs: 1.5, sm: 1.75 },
              textAlign: 'left',
              borderRadius: '12px',
              border: `1px solid ${C.border}`,
              bgcolor: '#fff',
              transition: 'border-color 160ms ease, box-shadow 160ms ease',
              '&:hover': {
                borderColor: option.color,
                boxShadow: '0 6px 18px rgba(18, 58, 89, 0.08)',
                '& .mode-arrow': {
                  transform: 'translateX(3px)',
                },
              },
              '&:focus-visible': {
                outline: `2px solid ${C.blue}`,
                outlineOffset: 2,
              },
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                display: 'grid',
                placeItems: 'center',
                borderRadius: '12px',
                bgcolor: option.tint,
                color: option.color,
                '& svg': { fontSize: 23 },
              }}
            >
              {option.icon}
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: { xs: '0.9rem', sm: '0.95rem' },
                  fontWeight: 800,
                  color: C.navy,
                }}
              >
                {option.title}
              </Typography>

              <Typography
                sx={{
                  mt: 0.45,
                  fontSize: '0.8125rem',
                  lineHeight: 1.5,
                  color: C.muted,
                }}
              >
                {option.text}
              </Typography>
            </Box>

            <ArrowForwardRoundedIcon
              className="mode-arrow"
              sx={{
                alignSelf: 'flex-end',
                mt: 'auto',
                color: option.color,
                transition: 'transform 160ms ease',
              }}
            />
          </ButtonBase>
        ))}
      </Box>
    </Box>
  )
}
