import { useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'

import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'

// Values match your task data: Pending / In Process / Blocked / Done
const STATUS_OPTIONS = [
  { label: 'All Tasks', value: 'All' },
  { label: 'Open', value: 'Open' }, // everything not done
  { label: 'Pending', value: 'Pending' },
  { label: 'In Process', value: 'In Process' },
  { label: 'Blocked', value: 'Blocked' },
  { label: 'Completed', value: 'Done' },
]

const PRIORITY_OPTIONS = [
  { label: 'Priority', value: 'All' },
  { label: 'High Priority', value: 'High' },
  { label: 'Medium Priority', value: 'Medium' },
  { label: 'Low Priority', value: 'Low' },
]

const DUE_OPTIONS = [
  { label: 'Due Date', value: 'default' },
  { label: 'Due Today', value: 'today' },
  { label: 'Due in 7 Days', value: 'week' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'No Due Date', value: 'none' },
]

export default function TaskFilters({
  filter = 'All',
  onFilterChange = () => {},
  priority = 'All',
  onPriorityChange = () => {},
  dueDate = 'default',
  onDueDateChange = () => {},
  search = '',
  onSearchChange = () => {},
  // Optional sort dropdown (e.g. ['My Order', 'Due date', 'Priority'])
  sortOptions = [],
  sortBy = '',
  onSortChange = () => {},
  // Optional: pass your own reset. Otherwise the filters reset themselves.
  onClearFilters,
}) {
  const [menu, setMenu] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)

  const selectedStatus =
    STATUS_OPTIONS.find((item) => item.value === filter) ||
    STATUS_OPTIONS[0]

  const selectedPriority =
    PRIORITY_OPTIONS.find((item) => item.value === priority) ||
    PRIORITY_OPTIONS[0]

  const selectedDue =
    DUE_OPTIONS.find((item) => item.value === dueDate) ||
    DUE_OPTIONS[0]

  const hasSort = sortOptions.length > 0

  // Anything other than the defaults counts as an active filter
  const hasActiveFilters =
    filter !== 'All' ||
    priority !== 'All' ||
    dueDate !== 'default' ||
    search.trim() !== ''

  const clearFilters = () => {
    if (onClearFilters) {
      onClearFilters()
      return
    }

    onFilterChange('All')
    onPriorityChange('All')
    onDueDateChange('default')
    onSearchChange('')
  }

  const openMenu = (event, name) => {
    setAnchorEl(event.currentTarget)
    setMenu(name)
  }

  const closeMenu = () => {
    setAnchorEl(null)
    setMenu(null)
  }

  // Highlights a dropdown when it has an active (non-default) value
  const activeSx = (active) =>
    active
      ? {
          bgcolor: '#EAF3FB',
          borderColor: '#9CC4E8',
          color: '#075A9C',
        }
      : {}

  const dropdownSx = {
    minWidth: 0,
    minHeight: 38,
    px: 1.2,
    border: '1px solid #E7EEF5',
    borderRadius: '9px',
    bgcolor: '#FFFFFF',
    color: '#526B83',
    fontSize: '0.77rem',
    fontWeight: 650,
    textTransform: 'none',
    whiteSpace: 'nowrap',
    '&:hover': {
      bgcolor: '#F7FAFD',
      borderColor: '#C9D9E8',
    },
  }

  const menuProps = {
    slotProps: {
      paper: {
        sx: {
          minWidth: 150,
          border: '1px solid #E1EAF2',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(18,58,89,0.12)',
          '& .MuiMenuItem-root': {
            minHeight: 36,
            fontSize: '0.8rem',
            color: '#34536E',
          },
          '& .Mui-selected': {
            bgcolor: '#EAF3FB !important',
            color: '#075A9C',
            fontWeight: 700,
          },
        },
      },
    },
  }

  return (
    <Paper
      elevation={0}
      data-tour="tasks-filters"
      sx={{
        p: 0.75,
        border: '1px solid #E7EEF5',
        borderRadius: '12px',
        bgcolor: '#FFFFFF',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr) minmax(0, 1fr)',
            sm: `${
              hasSort ? 'auto auto auto auto' : 'auto auto auto'
            } minmax(160px, 1fr) auto`,
          },
          gap: 0.75,
          alignItems: 'center',
        }}
      >
        {/* Status */}
        <Button
          onClick={(event) => openMenu(event, 'status')}
          endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: 17 }} />}
          sx={{ ...dropdownSx, ...activeSx(filter !== 'All') }}
        >
          {selectedStatus.label}
        </Button>

        <Menu
          anchorEl={menu === 'status' ? anchorEl : null}
          open={menu === 'status'}
          onClose={closeMenu}
          {...menuProps}
        >
          {STATUS_OPTIONS.map((item) => (
            <MenuItem
              key={item.value}
              selected={filter === item.value}
              onClick={() => {
                onFilterChange(item.value)
                closeMenu()
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>

        {/* Priority */}
        <Button
          onClick={(event) => openMenu(event, 'priority')}
          endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: 17 }} />}
          sx={{ ...dropdownSx, ...activeSx(priority !== 'All') }}
        >
          {selectedPriority.label}
        </Button>

        <Menu
          anchorEl={menu === 'priority' ? anchorEl : null}
          open={menu === 'priority'}
          onClose={closeMenu}
          {...menuProps}
        >
          {PRIORITY_OPTIONS.map((item) => (
            <MenuItem
              key={item.value}
              selected={priority === item.value}
              onClick={() => {
                onPriorityChange(item.value)
                closeMenu()
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>

        {/* Due date */}
        <Button
          onClick={(event) => openMenu(event, 'due')}
          endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: 17 }} />}
          sx={{ ...dropdownSx, ...activeSx(dueDate !== 'default') }}
        >
          {selectedDue.label}
        </Button>

        <Menu
          anchorEl={menu === 'due' ? anchorEl : null}
          open={menu === 'due'}
          onClose={closeMenu}
          {...menuProps}
        >
          {DUE_OPTIONS.map((item) => (
            <MenuItem
              key={item.value}
              selected={dueDate === item.value}
              onClick={() => {
                onDueDateChange(item.value)
                closeMenu()
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>

        {/* Sort */}
        {hasSort && (
          <>
            <Button
              onClick={(event) => openMenu(event, 'sort')}
              endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: 17 }} />}
              sx={dropdownSx}
            >
              Sort: {sortBy}
            </Button>

            <Menu
              anchorEl={menu === 'sort' ? anchorEl : null}
              open={menu === 'sort'}
              onClose={closeMenu}
              {...menuProps}
            >
              {sortOptions.map((option) => (
                <MenuItem
                  key={option}
                  selected={sortBy === option}
                  onClick={() => {
                    onSortChange(option)
                    closeMenu()
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}

        {/* Search */}
        <TextField
          fullWidth
          size="small"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search tasks..."
          sx={{
            gridColumn: { xs: '1 / -1', sm: 'auto' },
            minWidth: 0,
            '& .MuiOutlinedInput-root': {
              height: 38,
              borderRadius: '10px',
              bgcolor: '#FFFFFF',
              color: '#23445F',
              fontSize: '0.78rem',
              '& fieldset': { borderColor: '#E7EEF5' },
              '&:hover fieldset': { borderColor: '#C9D9E8' },
              '&.Mui-focused fieldset': { borderColor: '#2680D9' },
            },
          }}
          slotProps={{
            htmlInput: { 'aria-label': 'Search tasks' },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon
                    sx={{ fontSize: 19, color: '#8197AB' }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Clear filters: always visible, enabled only when a filter is active */}
        <Button
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          startIcon={<FilterAltOffOutlinedIcon sx={{ fontSize: 17 }} />}
          sx={{
            gridColumn: { xs: '1 / -1', sm: 'auto' },
            justifySelf: { xs: 'end', sm: 'stretch' },
            minHeight: 38,
            px: 1.4,
            borderRadius: '9px',
            color: '#B93B43',
            bgcolor: '#FFF5F5',
            border: '1px solid #F6D5D7',
            fontSize: '0.77rem',
            fontWeight: 700,
            textTransform: 'none',
            whiteSpace: 'nowrap',
            '&:hover': { bgcolor: '#FFECEC', borderColor: '#EDB8BC' },
            '&.Mui-disabled': {
              color: '#9AAABA',
              bgcolor: '#F6F8FA',
              borderColor: '#E7EEF5',
            },
          }}
        >
          Clear filters
        </Button>
      </Box>
    </Paper>
  )
}