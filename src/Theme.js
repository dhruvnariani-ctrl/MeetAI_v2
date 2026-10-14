
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: { main: '#0a62c9' },
    text: {
      primary: '#0b2545',
      secondary: '#55657d',
    },
    background: {
      default: '#e9f1fb',
      paper: '#ffffff',
    },
    divider: '#d9e1ec',
  },

  shape: { borderRadius: 12 },

  typography: {
    fontFamily: "'DM Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
    h1: {
      fontSize: '1.625rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.8125rem' },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': {
            transitionDuration: '0.01ms !important',
            animationDuration: '0.01ms !important',
          },
        },
      },
    },

    // Consistent keyboard focus across interactive MUI components
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': {
            outline: '3px solid #0a62c9',
            outlineOffset: 2,
          },
        },
      },
    },

    // 1. Shared button defaults
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          minHeight: 36,
          padding: '8px 16px',
          fontSize: '0.8125rem',
          fontWeight: 600,
          lineHeight: 1.4,
          textTransform: 'none',
          boxShadow: 'none',
        },
        contained: {
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },

    // 2. Shared outlined input defaults
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#ffffff',
          fontSize: '0.8125rem',

          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d9e1ec',
          },

          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#9aabba',
          },

          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0a62c9',
            borderWidth: 1,
          },

          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d32f2f',
          },

          '&.Mui-disabled': {
            backgroundColor: '#f5f7fa',
          },
        },

        input: {
          padding: '10px 12px',
          '&::placeholder': {
            opacity: 1,
            color: '#718096',
          },
        },
      },
    },

    // 3. Shared paper defaults
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        outlined: {
          borderColor: '#d9e1ec',
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#fff',
          color: '#0b2545',
          border: '1px solid #d9e1ec',
          borderRadius: 12,
          boxShadow: '0 4px 14px rgba(11,37,69,.12)',
          fontSize: '0.8125rem',
          fontWeight: 400,
          padding: '10px 16px',
        },
      },
    },
  },
})

export default theme
