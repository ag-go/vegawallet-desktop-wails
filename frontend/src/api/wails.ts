import type { Config } from '../models/config'
import type { GetConsoleStateResponse } from '../models/console-state'
import type { ListKeysResponse } from '../models/list-keys'
import type { ListWalletsResponse } from '../models/list-wallets'

interface Service {
  ListKeys(request: string): Promise<ListKeysResponse>

  ImportWallet(request: string): Promise<boolean>

  LoadWallets(request: string): Promise<boolean>

  IsAppInitialised(): Promise<boolean>

  ListWallets(): Promise<ListWalletsResponse>

  GetServiceConfig(): Promise<Config>

  SaveServiceConfig(jsonConfig: string): Promise<boolean>

  StartConsole(): Promise<boolean>

  GetConsoleState(): Promise<GetConsoleStateResponse>

  StopConsole(): Promise<boolean>
}

interface Backend {
  Service: Service
}

declare global {
  interface Window {
    backend: Backend
  }
}
