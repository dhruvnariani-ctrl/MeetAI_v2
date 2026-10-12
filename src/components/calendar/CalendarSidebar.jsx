
import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined'

import {
  dateKey,
  startOfWeek,
} from '../../utils/calenderDates'

function isInSelectedWeek(date, selectedDate) {
  const start = startOfWeek(selectedDate)
  const end = new Date(start)

  end.setDate(end.getDate() + 6)
  end.setHours(23, 59, 59, 999)

  return date >= start && date <= end
}

export default function CalendarSidebar({
  selectedDate,
  view,
  meetings = [],
  onSelectDate,
}) {
  const [displayMonth, setDisplayMonth] = useState(
    () =>
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1,
      ),
  )

  useEffect(() => {
    setDisplayMonth(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1,
      ),
    )
  }, [selectedDate])

  const year = displayMonth.getFullYear()
  const month = displayMonth.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from(
      { length: daysInMonth },
      (_, index) => index + 1,
    ),
  ]

  const todayKey = dateKey(new Date())
  const selectedKey = dateKey(selectedDate)

  const meetingDates = new Set(
    meetings.map((meeting) => meeting.date),
  )

  const changeMonth = (amount) => {
    setDisplayMonth(
      new Date(year, month + amount, 1),
    )
  }

  const goToday = () => {
    const today = new Date()

    setDisplayMonth(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      ),
    )

    onSelectDate(today)
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.75,
        border: '1px solid #E0E8F0',
        borderRadius: '14px',
        bgcolor: '#FFFFFF',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '32px minmax(0, 1fr) 32px',
          alignItems: 'center',
          gap: 0.5,
          mb: 1.25,
        }}
      >
        <IconButton
          size="small"
          aria-label="Previous month"
          onClick={() => changeMonth(-1)}
          sx={{
            width: 32,
            height: 32,
            justifySelf: 'start',
            color: '#456982',
            borderRadius: '8px',
            '&:hover': {
              bgcolor: '#EDF5FC',
            },
          }}
        >
          <ChevronLeftRoundedIcon fontSize="small" />
        </IconButton>

        <Typography
          sx={{
            color: '#123A59',
            fontSize: '0.88rem',
            fontWeight: 750,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            lineHeight: 1.4,
          }}
        >
          {new Intl.DateTimeFormat('en', {
            month: 'long',
            year: 'numeric',
          }).format(displayMonth)}
        </Typography>

        <IconButton
          size="small"
          aria-label="Next month"
          onClick={() => changeMonth(1)}
          sx={{
            width: 32,
            height: 32,
            justifySelf: 'end',
            color: '#456982',
            borderRadius: '8px',
            '&:hover': {
              bgcolor: '#EDF5FC',
            },
          }}
        >
          <ChevronRightRoundedIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          gap: 0.35,
          textAlign: 'center',
        }}
      >
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(
          (day, index) => (
            <Typography
              key={`${day}-${index}`}
              sx={{
                py: 0.6,
                color: '#8292A3',
                fontSize: '0.66rem',
                fontWeight: 700,
              }}
            >
              {day}
            </Typography>
          ),
        )}

        {cells.map((day, index) => {
          if (day === null) {
            return (
              <Box
                key={`empty-${index}`}
                sx={{ height: 32 }}
              />
            )
          }

          const date = new Date(year, month, day)
          const key = dateKey(date)
          const selected = key === selectedKey
          const today = key === todayKey

          const selectedWeek =
            view === 'week' &&
            isInSelectedWeek(date, selectedDate)

          const hasMeeting = meetingDates.has(key)

          return (
            <Button
              key={key}
              onClick={() => onSelectDate(date)}
              aria-label={`${date.toLocaleDateString()}, select date`}
              aria-pressed={selected}
              sx={{
                position: 'relative',
                minWidth: 0,
                width: '100%',
                height: 32,
                p: 0,
                borderRadius: '9px',
                color: selected ? '#FFFFFF' : '#294A65',
                bgcolor: selected
                  ? '#075A9C'
                  : selectedWeek
                    ? '#EAF3FC'
                    : 'transparent',
                fontSize: '0.72rem',
                fontWeight: selected || today ? 750 : 500,
                outline:
                  today && !selected
                    ? '1px solid #9BBBD6'
                    : 'none',
                outlineOffset: '-2px',
                '&:hover': {
                  bgcolor: selected
                    ? '#064879'
                    : '#EDF5FC',
                },
              }}
            >
              {day}

              {hasMeeting && !selected && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 3,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    bgcolor: '#21865B',
                  }}
                />
              )}
            </Button>
          )
        })}
      </Box>

      <Button
        fullWidth
        size="small"
        variant="outlined"
        startIcon={<TodayOutlinedIcon sx={{ fontSize: 16 }} />}
        onClick={goToday}
        sx={{
          mt: 1.5,
          minHeight: 34,
          borderColor: '#D7E4EF',
          borderRadius: '9px',
          color: '#245F94',
          fontSize: '0.76rem',
          fontWeight: 650,
          textTransform: 'none',
          '&:hover': {
            bgcolor: '#F2F7FC',
            borderColor: '#AFC9E0',
          },
        }}
      >
        Go to today
      </Button>
    </Paper>
  )
}
