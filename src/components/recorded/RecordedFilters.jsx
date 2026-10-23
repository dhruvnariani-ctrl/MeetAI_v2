import { useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'

import { FONT } from '../../utils/dashboardFonts'

const dropdownButtonSx = {
  minWidth: 125,
  minHeight: 38,
  px: 1.25,
  justifyContent: 'space-between',
  border: '1px solid #E5EDF5',
  borderRadius: '10px',
  bgcolor: '#FFFFFF',
  color: '#526B83',
  fontSize: FONT.caption,
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
    fontSize: FONT.body,
    color: '#34536E',
  },
  '& .Mui-selected': {
    bgcolor: '#EAF3FB !important',
    color: '#075A9C',
    fontWeight: 700,
  },
}

export default function RecordedFilters({
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
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 0.75,
      }}
    >
      {/* Date filter */}
      <Button
        data-tour="recorded-filters"
        size="small"
        variant="outlined"
        endIcon={<KeyboardArrowDownRoundedIcon />}
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
        endIcon={<KeyboardArrowDownRoundedIcon />}
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
  )
}