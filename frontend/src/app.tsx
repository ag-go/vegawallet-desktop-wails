import { ErrorBoundary } from '@sentry/react'
import { useEffect } from 'react'
// Wails recommends to use Hash routing.
// See https://wails.io/docs/guides/routing
import { HashRouter as Router } from 'react-router-dom'

import { AppFrame, AppLoader } from './app-loader'
import { Chrome } from './components/chrome'
import { InteractionManager } from './components/interaction-manager'
import { PassphraseModal } from './components/passphrase-modal'
import { Settings } from './components/settings'
import { GlobalProvider } from './contexts/global/global-provider'
import { createLogger, initLogger } from './lib/logging'
import { AppRouter } from './routes'
import { Service } from './service'
import { BrowserOpenURL } from './wailsjs/runtime'

const logger = createLogger('GlobalActions')

const getAnchor = (element: HTMLElement | null): HTMLAnchorElement | null => {
  if (element?.nodeName.toLocaleLowerCase() === 'a') {
    return element as HTMLAnchorElement
  }

  if (element?.parentNode?.nodeName.toLowerCase() === 'a') {
    return element.parentNode as HTMLAnchorElement
  }

  return null
}

/**
 * Renders all the providers
 */
function App() {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      var anchor = getAnchor(event.target as HTMLElement | null)
      var url = anchor?.getAttribute('href')

      if (url && anchor?.nodeName.toLocaleLowerCase() === 'a') {
        BrowserOpenURL(url)
      }
    }
    document.body.addEventListener('click', handler)

    return () => document.body.removeEventListener('click', handler)
  }, [])

  return (
    <ErrorBoundary>
      <GlobalProvider
        service={Service}
        logger={logger}
        enableTelemetry={initLogger}
      >
        <Router>
          <AppFrame>
            <Chrome>
              <AppLoader>
                <AppRouter />
                <PassphraseModal />
                <InteractionManager />
                <Settings />
              </AppLoader>
            </Chrome>
          </AppFrame>
        </Router>
      </GlobalProvider>
    </ErrorBoundary>
  )
}

export default App
