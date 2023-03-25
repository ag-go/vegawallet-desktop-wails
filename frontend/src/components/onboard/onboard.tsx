import React from 'react'
import {useForm} from 'react-hook-form'
import {Outlet, useNavigate} from 'react-router-dom'

import {Colors} from '../../config/colors'
import {Intent} from '../../config/intent'
import {completeOnboardAction} from '../../contexts/global/global-actions'
import {useGlobal} from '../../contexts/global/global-context'
import {useCreateWallet} from '../../hooks/use-create-wallet'
import {useImportWallet} from '../../hooks/use-import-wallet'
import {createLogger} from '../../lib/logging'
import {OnboardPaths, Paths} from '../../routes'
import {Service} from '../../service'
import {Button} from '../button'
import {ButtonGroup} from '../button-group'
import {ButtonUnstyled} from '../button-unstyled'
import {FormGroup} from '../form-group'
import {Header} from '../header'
import {Vega} from '../icons'
import {AppToaster} from '../toaster'
import {WalletCreateForm} from '../wallet-create-form'
import {WalletCreateFormSuccess} from '../wallet-create-form/wallet-create-form-success'
import {WalletImportForm} from '../wallet-import-form'

const logger = createLogger('Onbard')

export function Onboard() {
  return <Outlet/>
}

export function OnboardHome() {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState<
    'create' | 'import' | 'existing' | null
  >(null)
  const defaultVegaHome =
    'Cypress' in window
      ? // @ts-ignore only injected when running in cypress
      window.Cypress.env('vegaHome')
      : ''

  const {
    dispatch,
    state: {version, onboarding}
  } = useGlobal()

  const initialiseWithDefaultHome = async () => {
    try {
      await Service.InitialiseApp({vegaHome: defaultVegaHome})

      await setDefaultNetwork()

    } catch (err) {
      AppToaster.show({
        message: 'Could not initialise the application',
        intent: Intent.DANGER,
        timeout: 0
      })
      logger.error(err)
    }
  }

  const handleImportExistingWallet = async () => {
    try {
      setLoading('existing')

      await Service.InitialiseApp({vegaHome: defaultVegaHome})

      // Navigate to wallet create onboarding if no wallets are found
      if (onboarding.wallets.length) {
        // Add wallets and networks to state
        dispatch({type: 'ADD_WALLETS', wallets: onboarding.wallets})
      } else {
        navigate(OnboardPaths.WalletCreate)
        return
      }

      await setDefaultNetwork()

      // Found wallets and networks, go to the main app
      dispatch(completeOnboardAction(() => navigate(Paths.Home)))
    } catch (err) {
      AppToaster.show({
        message: 'Could not import existing wallet',
        intent: Intent.DANGER,
        timeout: 0
      })
      logger.error(err)
    }
  }

  const setDefaultNetwork = async () => {
    try {
      const defaultNetworkConfig = await Service.GetNetworkConfig("mainnet1")
      dispatch({
        type: 'ADD_NETWORKS',
        networks: ["mainnet1"],
        network: "mainnet1",
        networkConfig: defaultNetworkConfig
      })
    } catch (err) {
      AppToaster.show({
        message: 'Could not load mainnet1 configuration',
        intent: Intent.DANGER,
        timeout: 0
      })
      logger.error(err)
    }
  }

  const renderExistingMessage = () => {
    if (!onboarding.wallets.length) {
      return null
    }

    let message: string
    let buttonText: string

    if (onboarding.wallets.length) {
      message = 'Existing wallets found'
      buttonText = 'Use existing'
    } else {
      message = 'No wallet found'
      buttonText = 'Create wallet'
    }

    return (
      <>
        <p>{message}</p>
        <ButtonGroup>
          <Button
            loading={loading === 'existing'}
            onClick={handleImportExistingWallet}
          >
            {buttonText}
          </Button>
        </ButtonGroup>
        <p style={{margin: '20px 0'}}>OR</p>
      </>
    )
  }

  return (
    <div style={{textAlign: 'center'}}>
      <Header style={{margin: '0 0 30px 0', color: Colors.WHITE}}>
        <Vega/>
      </Header>
      {renderExistingMessage()}
      <ButtonGroup orientation='vertical' style={{marginBottom: 20}}>
        <Button
          loading={loading === 'create'}
          data-testid='create-new-wallet'
          onClick={async () => {
            setLoading('create')
            await initialiseWithDefaultHome()
            navigate(OnboardPaths.WalletCreate)
          }}
        >
          Create new wallet
        </Button>
        <Button
          data-testid='import-wallet'
          loading={loading === 'import'}
          onClick={async () => {
            setLoading('import')
            await initialiseWithDefaultHome()
            navigate(OnboardPaths.WalletImport)
          }}
        >
          Use recovery phrase
        </Button>
      </ButtonGroup>
      <p>
        <ButtonUnstyled
          data-testid='advanced-options'
          onClick={() => navigate(OnboardPaths.Settings)}
        >
          Advanced options
        </ButtonUnstyled>
      </p>
      {version && <p>version {version}</p>}
    </div>
  )
}

interface Fields {
  vegaHome: string
}

export function OnboardSettings() {
  const navigate = useNavigate()
  const {register, handleSubmit} = useForm<Fields>({
    defaultValues: {
      vegaHome:
        'Cypress' in window
          ? // @ts-ignore only injected when running in cypress
          window.Cypress.env('vegaHome')
          : ''
    }
  })
  const [loading, setLoading] = React.useState(false)

  const submit = React.useCallback(
    async (values: Fields) => {
      logger.info('InitAppFromOnboard')
      try {
        setLoading(true)
        await Service.InitialiseApp({
          vegaHome: values.vegaHome
        })
        AppToaster.show({message: 'App initialised', intent: Intent.SUCCESS})
        navigate(Paths.Onboard)
      } catch (err) {
        setLoading(false)
        logger.error(err)
      }
    },
    [navigate]
  )

  return (
    <OnboardPanel title='Advanced settings' back={Paths.Onboard}>
      <form onSubmit={handleSubmit(submit)}>
        <FormGroup
          label='Vega home'
          labelFor='vegaHome'
          helperText='Leave blank to use default'
        >
          <input type='text' {...register('vegaHome')} />
        </FormGroup>
        <ButtonGroup>
          <Button type='submit' loading={loading}>
            Initialise
          </Button>
          <Button onClick={() => navigate(-1)}>Cancel</Button>
        </ButtonGroup>
      </form>
    </OnboardPanel>
  )
}

export function OnboardWalletCreate() {
  const {
    state: {onboarding},
    dispatch
  } = useGlobal()
  const navigate = useNavigate()
  const {submit, response} = useCreateWallet()

  return (
    <OnboardPanel title='Create wallet' back={Paths.Onboard}>
      {response ? (
        <WalletCreateFormSuccess
          response={response}
          callToAction={
            <Button
              onClick={() => {
                dispatch(completeOnboardAction(() => navigate(Paths.Home)))
              }}
              data-testid='onboard-import-network-button'
            >
              Continue
            </Button>
          }
        />
      ) : (
        <WalletCreateForm submit={submit} cancel={() => navigate(-1)}/>
      )}
    </OnboardPanel>
  )
}

export function OnboardWalletImport() {
  const {
    state: {onboarding},
    dispatch
  } = useGlobal()
  const navigate = useNavigate()
  const {submit, response} = useImportWallet()

  React.useEffect(() => {
    if (response) {
      dispatch(completeOnboardAction(() => navigate(Paths.Home)))
    }
  }, [response, navigate, dispatch, onboarding])

  return (
    <OnboardPanel title='Import a wallet' back={Paths.Onboard}>
      <WalletImportForm submit={submit} cancel={() => navigate(-1)}/>
    </OnboardPanel>
  )
}

interface OnboardPanelProps {
  children: React.ReactNode
  title: React.ReactNode
  back: string
}

export function OnboardPanel({children, title, back}: OnboardPanelProps) {
  const navigate = useNavigate()
  return (
    <div
      style={{
        width: '90vw',
        minWidth: 352,
        maxWidth: 520,
        background: Colors.BLACK,
        border: `1px solid ${Colors.LIGHT_GRAY_3}`
      }}
    >
      <div
        style={{
          display: 'flex',
          padding: '10px 25px',
          borderBottom: `1px solid ${Colors.WHITE}`
        }}
      >
        <span style={{flex: 1}}>
          <ButtonUnstyled data-testid='back' onClick={() => navigate(back)}>
            Back
          </ButtonUnstyled>
        </span>
        <span>{title}</span>
        <span style={{flex: 1}}/>
      </div>
      <div style={{padding: '30px 25px'}}>{children}</div>
    </div>
  )
}
