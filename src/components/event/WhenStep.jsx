
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'

import FormField from '../instant/FormField'
import SelectField from './SelectedField'

import { C, DURATIONS, LABEL_SIZE } from './constants'
import { toDateInput } from './dateUtils'
import { SectionCard, SectionHeading } from './ui'

export default function WhenStep({ form, compactHeight, fullScreen }) {
  const {
    title,
    setTitle,
    date,
    setDate,
    start,
    setStart,
    end,
    setEnd,
    instant,
    setInstant,
    duration,
    setDuration,
    errors,
    clearError,
    refs,
  } = form

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: 0 }}>
      <SectionCard>
        <SectionHeading
          icon={<ScheduleOutlinedIcon />}
          title="When is the event?"
          subtitle="Add a title and choose your date and time."
        />

        <Box sx={{ display: 'grid', gap: compactHeight ? 0.7 : 1 }}>
          <FormField
            label="Event title"
            required
            labelFontSize={LABEL_SIZE}
            ref={refs.titleRef}
            autoFocus={!fullScreen}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              clearError('title')
            }}
            placeholder="e.g. Weekly design review"
            error={!!errors.title}
            helper={errors.title}
          />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'minmax(0, 1fr)',
                sm: 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
              },
              gap: 1,
              alignItems: 'start',
            }}
          >
            <FormField
              label="Date"
              required
              labelFontSize={LABEL_SIZE}
              ref={refs.dateRef}
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value)
                clearError('date')
              }}
              inputAttrs={{ min: toDateInput(new Date()) }}
              error={!!errors.date}
              helper={errors.date}
            />

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  pb: 0.35,
                  fontSize: '0.68rem',
                  color: instant ? C.green : C.muted,
                  lineHeight: 1.3,
                }}
              >
                {instant
                  ? 'Start immediately and choose a duration.'
                  : 'Start a meeting now instead of scheduling a time.'}
              </Typography>

              <Box
                sx={{
                  minWidth: 0,
                  minHeight: 42,
                  boxSizing: 'border-box',
                  px: 1,
                  border: `1px solid ${instant ? '#B8DCC8' : C.border}`,
                  borderRadius: '10px',
                  bgcolor: instant ? C.paleGreen : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <FormControlLabel
                  sx={{
                    m: 0,
                    minWidth: 0,
                    '& .MuiCheckbox-root': { p: 0.7, mr: 0.35 },
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: C.navy,
                    },
                  }}
                  control={
                    <Checkbox
                      size="small"
                      checked={instant}
                      onChange={(e) => {
                        setInstant(e.target.checked)
                        clearError('start')
                        clearError('end')
                      }}
                      sx={{ '&.Mui-checked': { color: C.green } }}
                    />
                  }
                  label="Start now"
                />
              </Box>
            </Box>
          </Box>

          {instant ? (
            <SelectField
              label="Duration"
              labelFontSize={LABEL_SIZE}
              value={duration}
              onChange={setDuration}
              options={DURATIONS}
            />
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'minmax(0, 1fr)',
                  sm: '1fr 1fr',
                },
                gap: 1,
              }}
            >
              <FormField
                label="Start time"
                required
                labelFontSize={LABEL_SIZE}
                ref={refs.startRef}
                type="time"
                value={start}
                onChange={(e) => {
                  setStart(e.target.value)
                  clearError('start')
                  clearError('end')
                }}
                error={!!errors.start}
                helper={errors.start}
              />

              <FormField
                label="End time"
                required
                labelFontSize={LABEL_SIZE}
                ref={refs.endRef}
                type="time"
                value={end}
                onChange={(e) => {
                  setEnd(e.target.value)
                  clearError('end')
                }}
                error={!!errors.end}
                helper={errors.end}
              />
            </Box>
          )}
        </Box>
      </SectionCard>
    </Box>
  )
}
