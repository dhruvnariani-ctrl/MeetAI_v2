import { useId } from 'react'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

import { inputSx, labelSx } from '../instant/FormField'

const NAVY = '#123A59'
const BORDER = '#D7E3ED'

export default function SelectField({
  label,
  value,
  onChange,
  options = [],
  labelFontSize,
}) {
  const id = useId()
  const labelId = `${id}-label`

  return (
    <FormControl fullWidth>
      <FormLabel
        id={labelId}
        sx={{
          ...labelSx,
          mb: 0.7,
          color: NAVY,
          fontSize: labelFontSize || '0.78rem',
          fontWeight: 700,
        }}
      >
        {label}
      </FormLabel>

      <Select
        labelId={labelId}
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        size="small"
        sx={{
          ...inputSx,
          minHeight: 42,
          borderRadius: '9px',
          bgcolor: '#FFFFFF',
          color: NAVY,
          fontSize: '0.82rem',
          '& .MuiSelect-select': {
            py: '10px',
            px: 1.4,
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: BORDER,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#AFC6D9',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0967B2',
            borderWidth: '1px',
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              mt: 0.5,
              border: `1px solid ${BORDER}`,
              borderRadius: '10px',
              boxShadow: '0 10px 28px rgba(18,58,89,.12)',
              '& .MuiMenuItem-root': {
                minHeight: 38,
                color: NAVY,
                fontSize: '0.8rem',
              },
              '& .MuiMenuItem-root.Mui-selected': {
                bgcolor: '#EAF3FC',
                fontWeight: 700,
              },
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
