'use client'
//import { useMemo } from 'react';
import { SessionProvider } from 'next-auth/react'
import { TRPCReactProvider } from '~/components/TRPCReactProvider'
import type { ReactNode } from 'react'

// material-ui
import { createTheme, ThemeProvider } from '@mui/material/styles'

// project import
import { themeOptions } from './theme'
import componentsOverride from './theme/overrides'

export default function ProvidersWrapper({
  children,
}: {
  children: ReactNode
}) {
  const defaultTheme = createTheme(themeOptions)
  const components = componentsOverride(defaultTheme)
  themeOptions.components = components
  const myCustomTheme = createTheme(themeOptions)

  return (
    <TRPCReactProvider>
      <SessionProvider>
        <ThemeProvider theme={myCustomTheme}>{children}</ThemeProvider>
      </SessionProvider>
    </TRPCReactProvider>
  )
}
