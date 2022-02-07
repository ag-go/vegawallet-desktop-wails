import { GetServiceState, StartService, StopService } from '../../api/service'
import { ProxyApp, ServiceDispatch } from './service-context'
import * as Sentry from '@sentry/react'

export function startServiceAction(network: string, port: number) {
  return async (dispatch: ServiceDispatch) => {
    Sentry.addBreadcrumb({
      type: 'StartService',
      level: Sentry.Severity.Log,
      message: 'StartService',
      timestamp: Date.now()
    })
    try {
      const status = await GetServiceState()

      if (status.Running) {
        await StopService()
      }

      dispatch({ type: 'START_SERVICE', port })
      await StartService({ network, withConsole: false, withTokenDApp: false })
    } catch (err) {
      Sentry.captureException(err)
      console.log(err)
    }
  }
}

export function stopServiceAction() {
  return async (dispatch: ServiceDispatch) => {
    Sentry.addBreadcrumb({
      type: 'StopService',
      level: Sentry.Severity.Log,
      message: 'StopService',
      timestamp: Date.now()
    })
    try {
      const status = await GetServiceState()
      if (status.Running) {
        await StopService()
        dispatch({ type: 'STOP_SERVICE' })
      }
    } catch (err) {
      Sentry.captureException(err)
      console.log(err)
    }
  }
}

export function startProxyAction(network: string, app: ProxyApp, port: number) {
  return async (dispatch: ServiceDispatch) => {
    Sentry.addBreadcrumb({
      type: 'StartProxy',
      level: Sentry.Severity.Log,
      message: 'StartProxy',
      data: {
        app,
        network
      },
      timestamp: Date.now()
    })
    try {
      const status = await GetServiceState()

      // Stop service so it can be restarted with dApp proxy
      if (status.Running) {
        await StopService()
      }

      dispatch({ type: 'START_PROXY', app, port })

      await StartService({
        network,
        withConsole: app === ProxyApp.Console,
        withTokenDApp: app === ProxyApp.TokenDApp
      })
    } catch (err) {
      Sentry.captureException(err)
      console.log(err)
    }
  }
}

export function stopProxyAction(network: string, port: number) {
  return async (dispatch: ServiceDispatch) => {
    try {
      const status = await GetServiceState()

      // This will stop proxies AND default service
      if (status.Running) {
        await StopService()
      }

      // Proxies already stopped but update service state to indicate so
      dispatch({ type: 'STOP_PROXY' })

      // Restart default service only
      dispatch({ type: 'START_SERVICE', port })
      await StartService({ network, withConsole: false, withTokenDApp: false })
    } catch (err) {
      Sentry.captureException(err)
      console.log(err)
    }
  }
}
