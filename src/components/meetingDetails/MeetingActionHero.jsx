import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import EnergySavingsLeafRoundedIcon from '@mui/icons-material/EnergySavingsLeafRounded'
import ForumRoundedIcon from '@mui/icons-material/ForumRounded'
import GpsFixedRoundedIcon from '@mui/icons-material/GpsFixedRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded'
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded'

// Put these two files in your project's public/images folder
const HERO_URL = `${import.meta.env.BASE_URL}/images/meeting-hero.jpg`
const LOGO_URL = `${import.meta.env.BASE_URL}/images/avaada-logo.png`

const NAVY = '#123A59'

/* ------------------------------------------------------------------ */
/* Hero banner: logo, headline and tagline over the scenery            */
/* ------------------------------------------------------------------ */
function Hero() {
  return (
    <Box
      sx={{
        position: 'relative',
        isolation: 'isolate',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        aspectRatio: '738 / 448',
        p: 'clamp(14px, 3.4cqw, 26px)',
        borderRadius: '16px',
        overflow: 'hidden',
        bgcolor: '#EEF6FD',
        backgroundImage: `url('${HERO_URL}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',

        // Fade from the bottom-left, where the text sits, so it never
        // competes with the solar panels. The top stays clear so the
        // leaf, sun, battery and globe icons remain visible.
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          background: [
            'linear-gradient(0deg, rgba(238,246,253,.96) 0%, rgba(238,246,253,.88) 22%, rgba(238,246,253,.55) 40%, rgba(238,246,253,0) 62%)',
            'linear-gradient(90deg, rgba(238,246,253,.85) 0%, rgba(238,246,253,.35) 30%, rgba(238,246,253,0) 55%)',
          ].join(', '),
        },
      }}
    >
      <Box
        component="img"
        src={LOGO_URL}
        alt="Avaada: Energy, Climate, A Better Tomorrow"
        sx={{
          display: 'block',
          width: 'clamp(100px, 24cqw, 160px)',
          height: 'auto',
        }}
      />

      <Box sx={{ maxWidth: '72%' }}>
        <Typography
          component="h2"
          sx={{
            color: NAVY,
            fontSize: 'clamp(1.05rem, 4.6cqw, 1.7rem)',
            lineHeight: 1.15,
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}
        >
          Together for a{' '}
          <Box
            component="span"
            sx={{
              display: 'block',
              background: 'linear-gradient(90deg, #0E7C86 0%, #1B5FA8 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
            }}
          >
            Sustainable Future
          </Box>
        </Typography>

        <Typography
          sx={{
            mt: 'clamp(4px, 1.2cqw, 10px)',
            color: '#3F5D78',
            fontWeight: 500,
            fontSize: 'clamp(0.62rem, 1.9cqw, 0.8rem)',
            lineHeight: 1.5,
          }}
        >
          Clean Energy &nbsp;|&nbsp; Green Planet &nbsp;|&nbsp; Lasting Impact
        </Typography>
      </Box>
    </Box>
  )
}
/* ------------------------------------------------------------------ */
/* One action tile                                                     */
/* ------------------------------------------------------------------ */
function ActionTile({
  title,
  subtitle,
  onClick,
  disabled = false,
  tone,
  icon,
  decor,
  filledIcon = false,
  tourId,
}) {
  return (
    <ButtonBase
      data-tour={tourId}
      onClick={onClick}
      disabled={disabled}
      focusRipple
      sx={{
        position: 'relative',
        display: 'block',
        width: '100%',
        minWidth: 0,
        minHeight: 'clamp(104px, 22cqw, 128px)',
        p: 'clamp(12px, 2.6cqw, 18px)',
        textAlign: 'left',
        overflow: 'hidden',
        borderRadius: '16px',
        border: '1px solid #DCE9F5',
        background: `linear-gradient(135deg, #FFFFFF 0%, ${tone.tint} 100%)`,
        transition:
          'border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
        '&:hover': {
          borderColor: tone.border,
          boxShadow: '0 6px 18px rgba(18, 58, 89, 0.08)',
          transform: 'translateY(-1px)',
          '& .tile-arrow': { transform: 'translateX(3px)', color: tone.fg },
        },
        '&:active': { transform: 'translateY(0)' },
        '&:focus-visible': {
          outline: '2px solid #2467A5',
          outlineOffset: '2px',
        },
        '&.Mui-disabled': { opacity: 0.55, cursor: 'not-allowed' },
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
          '&:hover': { transform: 'none' },
        },
      }}
    >
      {/* Soft decoration in the bottom-right corner */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          right: -18,
          bottom: -26,
          width: '62%',
          height: '62%',
          borderRadius: '50% 0 0 0',
          background: `radial-gradient(circle at 100% 100%, ${tone.blob} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          right: 'clamp(10px, 2.4cqw, 18px)',
          bottom: 'clamp(8px, 2cqw, 14px)',
          display: 'flex',
          color: tone.fg,
          opacity: 0.5,
          '& svg': { fontSize: 'clamp(30px, 7.5cqw, 46px)' },
          pointerEvents: 'none',
        }}
      >
        {decor}
      </Box>

      {/* Arrow */}
      <ArrowForwardRoundedIcon
        className="tile-arrow"
        sx={{
          position: 'absolute',
          top: 'clamp(10px, 2.2cqw, 16px)',
          right: 'clamp(10px, 2.2cqw, 16px)',
          fontSize: 20,
          color: '#6B87A3',
          transition: 'transform 160ms ease, color 160ms ease',
        }}
      />

      {/* Icon + text */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'clamp(8px, 2cqw, 14px)',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            placeItems: 'center',
            width: 'clamp(40px, 9.2cqw, 54px)',
            height: 'clamp(40px, 9.2cqw, 54px)',
            flexShrink: 0,
            borderRadius: '50%',
            bgcolor: tone.soft,
          }}
        >
          {filledIcon ? (
            <Box
              sx={{
                display: 'grid',
                placeItems: 'center',
                width: '64%',
                height: '64%',
                borderRadius: '50%',
                bgcolor: tone.fg,
                color: '#FFFFFF',
                '& svg': { fontSize: 'clamp(15px, 3.6cqw, 22px)' },
              }}
            >
              {icon}
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                color: tone.fg,
                '& svg': { fontSize: 'clamp(20px, 4.8cqw, 28px)' },
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        <Box sx={{ minWidth: 0, pr: 2.5 }}>
          <Typography
            sx={{
              color: NAVY,
              fontSize: 'clamp(0.84rem, 2.6cqw, 1.02rem)',
              lineHeight: 1.25,
              fontWeight: 800,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              maxWidth: 150,
              color: '#5F7790',
              fontSize: 'clamp(0.7rem, 2cqw, 0.82rem)',
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Box>
    </ButtonBase>
  )
}

/* ------------------------------------------------------------------ */
/* Panel: hero + 4 stacked tiles                                         */
/* ------------------------------------------------------------------ */
export default function MeetingActionsHero({
  ended = false,
  joinDisabled = false,
  onJoin,
  onRecording,
  onTranscript,
  onActions,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        // Lets every size inside scale with the panel's own width (cqw)
        containerType: 'inline-size',
        p: 1.5,
        border: '1px solid #DFE8F0',
        borderRadius: '16px',
        bgcolor: '#FFFFFF',
        boxShadow: '0 6px 22px rgba(18, 58, 89, 0.05)',
      }}
    >
      <Hero />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: 1.25,
          mt: 1.5,
        }}
      >
        <ActionTile
          title={ended ? 'Meeting ended' : 'Join Meeting'}
          subtitle={
            ended
              ? 'This meeting has finished'
              : 'Collaborate for a cleaner tomorrow'
          }
          onClick={onJoin}
          disabled={joinDisabled || ended}
          filledIcon
          icon={<VideocamRoundedIcon />}
          decor={<EnergySavingsLeafRoundedIcon />}
          tone={{
            fg: '#2E9B5A',
            soft: '#E1F3E7',
            tint: '#F2FAF5',
            blob: '#D6EEDD',
            border: '#B9DEC5',
          }}
        />

        <ActionTile
          tourId="meeting-view-recording"
          title="View Recording"
          subtitle="Revisit ideas, reignite progress"
          onClick={onRecording}
          filledIcon
          icon={<PlayArrowRoundedIcon />}
          decor={<VideocamRoundedIcon />}
          tone={{
            fg: '#2F86F0',
            soft: '#E3EFFD',
            tint: '#F2F8FE',
            blob: '#D5E7FB',
            border: '#B5D3F4',
          }}
        />

        <ActionTile
          tourId="meeting-view-transcript"
          title="View Transcript"
          subtitle="Turn conversations into action"
          onClick={onTranscript}
          icon={<DescriptionRoundedIcon />}
          decor={<ForumRoundedIcon />}
          tone={{
            fg: '#6C5CE7',
            soft: '#ECE9FB',
            tint: '#F6F4FD',
            blob: '#E4E0F9',
            border: '#CFC8F3',
          }}
        />

        <ActionTile
          tourId="meeting-view-actions"
          title="View Action Items"
          subtitle="Track progress, achieve goals"
          onClick={onActions}
          icon={<TaskAltRoundedIcon />}
          decor={<GpsFixedRoundedIcon />}
          tone={{
            fg: '#1B8A74',
            soft: '#E0F3EE',
            tint: '#F1FAF7',
            blob: '#D3EEE6',
            border: '#B4DDD1',
          }}
        />
      </Box>
    </Paper>
  )
}