
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import PageShell from '../components/PageShell'
import usePageTitle from '../hooks/usePageTitle'
import { startAppTour } from '../components/TourRunner'
import { APP_TOUR_STEPS } from '../data/tours'

import HelpStrip from '../components/howItWorks/HelpStrip'
import HowItWorksHeader from '../components/howItWorks/HowItWorksHeader'
import LearningStep from '../components/howItWorks/LearningStep'
import PageShortcut from '../components/howItWorks/PageShortcut'

import {
  COLORS,
  LEARNING_STEPS,
  PAGE_LINKS,
} from '../components/howItWorks/constants'

import { PAGE_TOURS } from '../data/pageTours'

export default function HowItWorks() {
  usePageTitle('How it works')

  const navigate = useNavigate()

  const pages = useMemo(() => PAGE_LINKS, [])
  const [activeTour, setActiveTour] = useState(
    PAGE_LINKS[0]?.tour ?? 'dashboard',
  )

  const handleStartTour = (tourId) => {
    const page = pages.find((item) => item.tour === tourId)

    // Find the specific tour configuration.
    const selectedTour = PAGE_TOURS.find(
      (item) => item.id === tourId,
    )

    // Navigate to the page the user wants to learn.
    if (page?.path) {
      navigate(page.path)
    }

    // Start only the selected page's tour.
    if (
      selectedTour &&
      Array.isArray(selectedTour.steps) &&
      selectedTour.steps.length > 0
    ) {
      startAppTour(selectedTour.steps)
      return
    }

    // Fallback for an item that does not have an individual tour.
    if (Array.isArray(APP_TOUR_STEPS) && APP_TOUR_STEPS.length > 0) {
      startAppTour(APP_TOUR_STEPS)
    }
  }

  const handleFullTour = () => {
    if (Array.isArray(APP_TOUR_STEPS) && APP_TOUR_STEPS.length > 0) {
      startAppTour(APP_TOUR_STEPS)
    }
  }

  return (
    <PageShell title="" subtitle="">
      <Stack spacing={2.25}>
        <HowItWorksHeader />

        {/* Individual page tour shortcuts */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(4, minmax(0, 1fr))',
            },
            gap: 1.1,
          }}
        >
          {pages.map((item) => (
            <PageShortcut
              key={item.label}
              item={item}
              active={item.tour === activeTour}
              onTour={(tourId) => {
                setActiveTour(tourId)
                handleStartTour(tourId)
              }}
            />
          ))}
        </Box>

        {/* Simple numbered learning steps */}
        <Box>
          <Box sx={{ mb: 1.3 }}>
            <Typography
              component="h2"
              sx={{
                color: COLORS.navy,
                fontSize: '.98rem',
                fontWeight: 800,
              }}
            >
              Follow these simple steps
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                sm: 'repeat(3, minmax(0, 1fr))',
                lg: 'repeat(5, minmax(0, 1fr))',
              },
              gap: { xs: 1.1, lg: 2.2 },
            }}
          >
            {LEARNING_STEPS.map((step, index) => (
              <LearningStep
                key={step.title}
                step={step}
                number={index + 1}
                last={index === LEARNING_STEPS.length - 1}
                onStartTour={handleStartTour}
              />
            ))}
          </Box>
        </Box>

        {/* Full application tour */}
        <HelpStrip onStartTour={handleFullTour} />
      </Stack>
    </PageShell>
  )
}