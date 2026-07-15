import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import { getDesignTokens } from './themePrimitives';

interface AppThemeProps {
  children: React.ReactNode;
  disableCustomTheme?: boolean;
}

export default function AppTheme({ children, disableCustomTheme }: AppThemeProps) {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');

  const theme = React.useMemo(() => {
    if (disableCustomTheme) {
      return createTheme();
    }
    return createTheme(getDesignTokens(mode) as ThemeOptions);
  }, [mode, disableCustomTheme]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}