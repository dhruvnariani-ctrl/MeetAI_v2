
import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'

export default function usePage(items = [], resetKey = '', size = 5) {
  const [page, setPage] = useState(1)

  // Reset pagination when search, filters, sorting, or page size changes.
  useEffect(() => {
    setPage(1)
  }, [resetKey, size])

  const safeSize = Math.max(1, Number(size) || 10)
  const totalItems = items.length
  const count = Math.ceil(totalItems / safeSize)

  // Keep the current page within the available range.
  const currentPage = Math.min(Math.max(1, page), Math.max(1, count))

  const rows = useMemo(() => {
    const start = (currentPage - 1) * safeSize
    return items.slice(start, start + safeSize)
  }, [items, currentPage, safeSize])

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * safeSize + 1
  const endItem = Math.min(currentPage * safeSize, totalItems)

  const pager = count > 1 ? (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1.5,
        py: 1.5,
      }}
    >
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', fontSize: '0.8rem' }}
        aria-live="polite"
      >
        Showing {startItem}–{endItem} of {totalItems}
      </Typography>

      <Pagination
        count={count}
        page={currentPage}
        onChange={(_, nextPage) => setPage(nextPage)}
        shape="rounded"
        color="primary"
        size="small"
        showFirstButton
        showLastButton
        aria-label="Pagination"
      />
    </Box>
  ) : null

  return { rows, pager }
}