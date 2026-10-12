import { useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'

import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'

const dropdownButtonSx = {
  minWidth: 125,
  minHeight: 38,
  px: 1.25,
  justifyContent: 'space-between',
  border: '1px solid #E5EDF5',
  borderRadius: '9px',
  bgcolor: '#FFFFFF',
  color: '#526B83',
  fontSize: '0.76rem',
  fontWeight: 650,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    borderColor: '#C9D9E8',
    bgcolor: '#F7FAFD',
  },
}

const menuPaperSx = {
  minWidth: 165,
  border: '1px solid #E1EAF2',
  borderRadius: '10px',
  boxShadow: '0 8px 24px rgba(18,58,89,0.12)',
  '& .MuiMenuItem-root': {
    minHeight: 37,
    fontSize: '0.8rem',
    color: '#34536E',
  },
  '& .Mui-selected': {
    bgcolor: '#EAF3FB !important',
    color: '#075A9C',
    fontWeight: 700,
  },
}

export default function RecordedFilters({
  search,
  onSearchChange,
  dateFilters,
  dateFilter,
  onDateFilterChange,
  sortOptions,
  sortBy,
  onSortChange,
}) {
  const [dateAnchorEl, setDateAnchorEl] = useState(null)
  const [sortAnchorEl, setSortAnchorEl] = useState(null)

  return (
    <Paper
      elevation={0}
      sx={{
        p: 0.75,
        border: '1px solid #E3EBF3',
        borderRadius: '12px',
        bgcolor: '#FFFFFF',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr) minmax(0, 1fr)',
            md: 'minmax(180px, 1fr) 140px 140px',
          },
          alignItems: 'center',
          gap: 0.75,
        }}
      >
        {/* Search */}
        <TextField
          data-tour="recorded-search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search meetings or people..."
          size="small"
          fullWidth
          inputProps={{ 'aria-label': 'Search recorded meetings' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon
                  sx={{ fontSize: 19, color: '#8197AB' }}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            minWidth: 0,
            gridColumn: { xs: '1 / -1', md: 'auto' },
            '& .MuiOutlinedInput-root': {
              height: 38,
              borderRadius: '9px',
              bgcolor: '#FFFFFF',
              color: '#23445F',
              fontSize: '0.78rem',
              '& fieldset': {
                borderColor: '#E5EDF5',
              },
              '&:hover fieldset': {
                borderColor: '#C9D9E8',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#2680D9',
              },
            },
          }}
        />

        {/* Date filter */}
        <Button
          data-tour="recorded-filters"
          size="small"
          variant="outlined"
          endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: 18 }} />}
          onClick={(event) => setDateAnchorEl(event.currentTarget)}
          sx={dropdownButtonSx}
        >
          {dateFilter}
        </Button>

        <Menu
          anchorEl={dateAnchorEl}
          open={Boolean(dateAnchorEl)}
          onClose={() => setDateAnchorEl(null)}
          slotProps={{ paper: { sx: menuPaperSx } }}
        >
          {dateFilters.map((item) => (
            <MenuItem
              key={item}
              selected={dateFilter === item}
              onClick={() => {
                onDateFilterChange(item)
                setDateAnchorEl(null)
              }}
            >
              {item}
            </MenuItem>
          ))}
        </Menu>

        {/* Sort */}
        <Button
          data-tour="recorded-sort"
          size="small"
          variant="outlined"
          endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: 18 }} />}
          onClick={(event) => setSortAnchorEl(event.currentTarget)}
          sx={dropdownButtonSx}
        >
          Sort: {sortBy}
        </Button>

        <Menu
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={() => setSortAnchorEl(null)}
          slotProps={{ paper: { sx: menuPaperSx } }}
        >
          {sortOptions.map((item) => (
            <MenuItem
              key={item}
              selected={sortBy === item}
              onClick={() => {
                onSortChange(item)
                setSortAnchorEl(null)
              }}
            >
              {item}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Paper>
  )
}