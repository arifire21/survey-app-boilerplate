'use client';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import GlobalStyles from '@mui/joy/GlobalStyles';
import React from 'react';

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette:{
        //needs both to make custom one so
        blueAllianceColor: { //this is original 'primary' color
          // 50: "#EDF5FD",
          // 100: "#E3EFFB",
          200: "#C7DFF7",
          300: "#97C3F0",
          400: "#4393E4",
          500: "#0B6BCB",
          600: "#185EA5",
          700: "#12467B",
          800: "#0A2744",
          900: "#051423",
          solidBg: 'var(--joy-palette-blueAllianceColor-500)',
          solidHoverBg: 'var(--joy-palette-blueAllianceColor-600)',
          solidActiveBg: 'var(--joy-palette-blueAllianceColor-700)',
          outlinedBorder: 'var(--joy-palette-blueAllianceColor-700)',
          outlinedColor: 'var(--joy-palette-blueAllianceColor-200)',
          outlinedHoverBg: 'var(--joy-palette-blueAllianceColor-800)',
          outlinedActiveBg: 'var(--joy-palette-blueAllianceColor-700)',
          softColor: 'var(--joy-palette-blueAllianceColor-200)', //testing text color
          softBg: 'var(--joy-palette-blueAllianceColor-800)',
          softActiveBg: 'var(--joy-palette-blueAllianceColor-600)',
        }
      }
    },
    dark: {
      palette: {
        background: {
          body: '#202020'
        },
        primary: {
          50: "#dff5fa",
          100: "#b0e6f2",
          200: "#7dd6e9",
          300: "#49c5de",
          400: "#23bad6",
          500: "#01a0bb",
          600: "#019fbb",
          700: "#008ba1",
          800: "#007789",
          900: "#00555e"
        },
        blueAllianceColor: { //this is original 'primary' color
          // 50: "#EDF5FD",
          // 100: "#E3EFFB",
          200: "#C7DFF7",
          300: "#97C3F0",
          400: "#4393E4",
          500: "#0B6BCB",
          600: "#185EA5",
          700: "#12467B",
          800: "#0A2744",
          900: "#051423",
          solidBg: 'var(--joy-palette-blueAllianceColor-500)',
          solidHoverBg: 'var(--joy-palette-blueAllianceColor-600)',
          solidActiveBg: 'var(--joy-palette-blueAllianceColor-700)',
          outlinedBorder: 'var(--joy-palette-blueAllianceColor-700)',
          outlinedColor: 'var(--joy-palette-blueAllianceColor-200)',
          outlinedHoverBg: 'var(--joy-palette-blueAllianceColor-800)',
          outlinedActiveBg: 'var(--joy-palette-blueAllianceColor-700)',
          softColor: 'var(--joy-palette-blueAllianceColor-200)', //testing text color
          softBg: 'var(--joy-palette-blueAllianceColor-800)',
          softActiveBg: 'var(--joy-palette-blueAllianceColor-600)',
        }
      }
    }
  },
  components: {
    JoyButton: {
      styleOverrides: {
        root: {borderRadius: '10px'}
      }
    }, //end JoyButton
    JoyFormLabel: {
      styleOverrides: {
        root: {
          fontSize: '16px',
          flexWrap: 'nowrap'  //stop required stars from shifting to next line
        }
      }
    }, //end JoyFormLabel
    JoyModalDialog: {
      defaultProps: { layout: 'fullscreen-padded' },
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.layout === 'fullscreen-padded' && {
              width: '90vw',
              height: '50vh',
              padding: '1rem 0.55rem'
          }),
        }),
      }
    }, //end JoyModalDialog
    JoyAccordionDetails: {
      styleOverrides: {
        root: {color: '#ffffff'}
      }
    } //end JoyAccordionDetails
  }
})

// This implementation is from emotion-js
// https://github.com/emotion-js/emotion/issues/2928#issuecomment-1319747902
export default function ThemeRegistry(props) {
  const { options, children } = props;

  const [{ cache, flush }] = React.useState(() => {
    const cache = createCache(options);
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }
    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <CssVarsProvider theme={theme} defaultMode="dark">
        <CssBaseline />
        <GlobalStyles
          styles={{
            body: {
              padding: '1rem'
            }
          }}
          />
            {children}
      </CssVarsProvider>
    </CacheProvider>
  );
}