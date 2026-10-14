// Every text size on the Dashboard lives here. Edit a value and all cards follow.
// Save as src/utils/dashboardFonts.js

export const FONT = {
  // Cards (rem)
  caption: '0.7rem',         // chips, due dates, footers, helper text, stat labels
  small: '0.731rem',         // meeting platform, time, subtitles, secondary buttons
  body: '0.787rem',          // task titles, meeting count, empty-state titles
  heading: '0.9rem',         // "Pending actions", "In progress / Up next"
  meetingTitle: '0.945rem',  // featured meeting name
  scheduleHeading: '0.972rem', // "Today's schedule"

  // Stat tiles (responsive)
  statValue: { xs: '1.305rem', md: '1.485rem' },

  // Header (scales with the banner width, so it uses clamp + cqw)
  headerIcon: 'clamp(16px, 1.3cqw, 24px)',
  headerDate: 'clamp(.75rem, 1cqw, 1.05rem)',
  headerGreeting: 'clamp(1.35rem, 2.4cqw, 2.6rem)',
  headerIntro: 'clamp(.75rem, 1cqw, 1rem)',
  headerButton: 'clamp(.75rem, .95cqw, .95rem)',
}