'use client';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode, useState } from 'react';
import { createTheme } from '@mui/material';
import { Noto_Sans_JP } from "next/font/google";

const notoSansJP = Noto_Sans_JP({
  weight: ["700"],
  subsets: ["latin"],
  display: "swap",
});

export { notoSansJP };

const theme = createTheme({
  typography: {
    fontFamily: notoSansJP.style.fontFamily,
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.03em',
      fontSize: '3rem',
      marginBottom: '3rem',
      color: '#1a1a1a',
      textTransform: 'none'
    }
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    text: {
      primary: '#1a1a1a',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          padding: '8px 16px',
          minWidth: '144px',
          height: '40px',
          '& .MuiSvgIcon-root': {
            fontSize: '1.25rem',
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          minWidth: '144px',
          height: '40px',
          borderColor: '#1976d2',
          '&:hover': {
            borderColor: '#1976d2',
            backgroundColor: 'rgba(25, 118, 210, 0.08)'
          }
        },
        icon: {
          color: '#1976d2'
        }
      }
    }
  }
});

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({
      key: 'mui',
    });
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];
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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
