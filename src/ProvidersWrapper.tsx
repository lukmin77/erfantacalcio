//import { useMemo } from 'react';
import { SessionProvider } from 'next-auth/react'

// material-ui
import { createTheme, ThemeProvider } from '@mui/material/styles'

// project import
import { themeOptions } from './theme'
import componentsOverride from './theme/overrides'

export default function ProvidersWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const defaultTheme = createTheme(themeOptions)
  const components = componentsOverride(defaultTheme)
  themeOptions.components = components
  const myCustomTheme = createTheme(themeOptions)

  return (
    <SessionProvider>
      <ThemeProvider theme={myCustomTheme}>
        {children}{' '}
        {/* {children} Our entire app. Allows to have our app to use NextAuth */}
      </ThemeProvider>
    </SessionProvider>
  )
}
