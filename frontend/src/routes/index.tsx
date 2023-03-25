import {useRoutes} from 'react-router-dom'

import {Chrome} from '../components/chrome'
import {Onboard, OnboardHome, OnboardSettings, OnboardWalletCreate, OnboardWalletImport} from '../components/onboard'
import {Splash} from '../components/splash'
import {useIsOnboard} from '../hooks/use-is-onboard'
import {Home} from './home'
import {Wallet} from './wallet'
import {WalletKeyPair} from './wallet/wallet-key-pair'
import {WalletList} from './wallet/wallet-list'
import {WalletCreate} from './wallet-create'
import {WalletImport} from './wallet-import'

// Root paths start with '/'
export enum Paths {
  Home = '/',
  Onboard = '/onboard',
  Wallet = '/wallet',
  WalletCreate = '/wallet-create',
  WalletImport = '/wallet-import'
}

// Nested paths DONT have '/'
export enum OnboardPaths {
  Settings = '/onboard/settings',
  WalletCreate = '/onboard/wallet-create',
  WalletImport = '/onboard/wallet-import',
}

export const AppRouter = () => {
  const isOnboard = useIsOnboard()

  const routes = useRoutes([
    {
      path: Paths.Onboard,
      element: <Onboard/>,
      children: [
        {
          index: true,
          element: <OnboardHome/>
        },
        {
          path: OnboardPaths.Settings,
          element: <OnboardSettings/>
        },
        {
          path: OnboardPaths.WalletCreate,
          element: <OnboardWalletCreate/>
        },
        {
          path: OnboardPaths.WalletImport,
          element: <OnboardWalletImport/>
        }
      ]
    },
    {
      path: Paths.WalletCreate,
      element: <WalletCreate/>
    },
    {
      path: Paths.WalletImport,
      element: <WalletImport/>
    },
    {
      path: Paths.Wallet,
      element: <Wallet/>,
      children: [
        {
          // default child route, Wallet only renders an Outlet
          index: true,
          element: <WalletList/>
        },
        {
          path: 'keypair/:pubkey',
          element: <WalletKeyPair/>
        }
      ]
    },
    {
      element: <Home/>,
      index: true
    }
  ])

  // Wrap onboard pages with splash page
  if (isOnboard) {
    return <Splash>{routes}</Splash>
  }

  // Rest of the pages get regular chrome with network
  return <Chrome>{routes}</Chrome>
}
