import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { GetNetworkConfig } from '../../api/service'
import { AppToaster } from '../../components/toaster'
import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'
import type { Network as NetworkModel } from '../../models/network'
import { NetworkDetails } from './network-details'
import { NetworkEdit } from './network-edit'

export enum NetworkPaths {
  Config = '/network',
  Edit = '/network/edit'
}

export const Network = () => {
  const { state } = useGlobal()
  const [config, setConfig] = React.useState<NetworkModel | null>(null)

  React.useEffect(() => {
    async function run() {
      if (!state.network) {
        return
      }

      try {
        const config = await GetNetworkConfig(state.network)
        setConfig(config)
      } catch (err) {
        AppToaster.show({ message: `Error: ${err}`, color: Colors.RED })
      }
    }

    run()
  }, [state.network])

  if (!state.network) {
    return <p>No network configuration found</p>
  }

  if (!config) {
    return null
  }

  return (
    <Switch>
      <Route path={NetworkPaths.Config} exact={true}>
        <NetworkDetails config={config} />
      </Route>
      <Route path={NetworkPaths.Edit}>
        <NetworkEdit config={config} setConfig={setConfig} />
      </Route>
    </Switch>
  )
}
