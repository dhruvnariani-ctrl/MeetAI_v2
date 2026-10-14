
import { useEffect, useId, useState } from 'react'
import Stack from '@mui/material/Stack'
import Autocomplete from '@mui/material/Autocomplete'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import FormLabel from '@mui/material/FormLabel'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

import { labelSx, inputSx } from './FormField'

const avatarSx = {
  width: 28,
  height: 28,
  bgcolor: '#D8EAF5',
  color: '#123A59',
  fontSize: '0.75rem',
  fontWeight: 700,
}

const DEFAULT_HINT =
  '(transcript & action items emailed to these people)'

const DEFAULT_NOTE =
  'After the meeting, each participant receives their personalized transcript and the action items assigned to them.'

export default function ParticipantPicker({
  participants,
  onAdd,
  onRemove,
  searchDirectory,
  labelFontSize,
  hint = DEFAULT_HINT,
  note = DEFAULT_NOTE,
}) {
  const labelId = useId()
  const helpId = useId()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return undefined
    }

    let cancelled = false

    const timer = setTimeout(async () => {
      try {
        const found = await searchDirectory(query.trim())

        if (!cancelled) {
          setResults(
            found.filter(
              (person) =>
                !participants.some(
                  (selected) => selected.email === person.email,
                ),
            ),
          )
        }
      } catch {
        if (!cancelled) setResults([])
      }
    }, 250)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query, searchDirectory, participants])

  return (
    <Box component="section" aria-labelledby={labelId}>
      <FormLabel
        id={labelId}
        component="h3"
        sx={{
          ...labelSx,
          m: 0,
          mb: 1,
          ...(labelFontSize && { fontSize: labelFontSize }),
        }}
      >
        Participants{' '}
        <Box
          component="span"
          sx={{ fontWeight: 400, color: 'text.secondary' }}
        >
          {hint}
        </Box>
      </FormLabel>

      
      {/* Search participants */}
      <Autocomplete
        size="small"
        value={null}
        inputValue={query}
        onInputChange={(_, value) => setQuery(value)}
        options={results}
        filterOptions={(options) => options}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(a, b) => a.email === b.email}
        forcePopupIcon={false}
        noOptionsText={
          query.trim().length < 2
            ? 'Type at least 2 characters'
            : 'No matching people'
        }
        onChange={(_, person) => {
          if (person) {
            onAdd(person)
            setQuery('')
            setResults([])
          }
        }}
        renderOption={({ key, ...props }, person) => (
          <Box
            component="li"
            key={key}
            {...props}
            sx={{ display: 'block !important' }}
          >
            <Typography
              sx={{ fontSize: '0.875rem', fontWeight: 600 }}
            >
              {person.name}
            </Typography>

            <Typography
              sx={{
                fontSize: '0.8125rem',
                color: 'text.secondary',
              }}
            >
              {person.email}
            </Typography>
          </Box>
        )}
        sx={{ mt: 0.5 }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search participants by name or email…"
            inputProps={{
              ...params.inputProps,
              'aria-label': 'Search participants by name or email',
              'aria-describedby': helpId,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                ...inputSx,
                py: '3px',
              },
            }}
          />
        )}
      />

      <Typography
        id={helpId}
        sx={{
          mt: 1,
          fontSize: '0.8125rem',
          color: 'text.secondary',
        }}
      >
        Search by name or email — results come from the Darwin employee
        directory.
      </Typography>

      {note && (
        <Typography
          sx={{
            mt: 1,
            fontSize: '0.8125rem',
            color: 'text.secondary',
            lineHeight: 1.6,
          }}
        >
          {note}
        </Typography>
      )}
    </Box>
  )
}