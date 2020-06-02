import React, { useEffect } from 'react'
import 'normalize.css'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import theme from '@src/theme/default'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Component
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...pageProps}
        />
      </ThemeProvider>
    </>
  )
}

export default MyApp

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  *:focus {
    outline: 0;
  }
  
  body {
    font-family: sans-serif;
  }
  
  html {
    background-color: ${theme.layout.backgroundColor};
    color: ${theme.layout.color};
    font-size: 10px;
  }
`
