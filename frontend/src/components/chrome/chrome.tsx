import './chrome.scss'
import React from 'react'
import { NetworkSwitcher } from './network-switcher'
import { Vega } from '../icons'
import { Link, useHistory } from 'react-router-dom'
import { useGlobal } from '../../contexts/global/global-context'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Copy } from '../icons/copy'
import { Kebab } from '../icons/kebab'
import { ChevronLeft } from '../icons/chevron-left'
import { Dropdown } from './dropdown'

export function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <div className='chrome'>
      <div className='chrome__topbar'>
        <Link to='/'>
          <Vega style={{ width: 30, height: 30 }} />
        </Link>
        <NetworkSwitcher />
      </div>
      <KeypairControls />
      <main className='chrome__main'>{children}</main>
    </div>
  )
}

function KeypairControls() {
  const { goBack } = useHistory()
  const { state, dispatch } = useGlobal()
  const [isOpen, setIsOpen] = React.useState(false)
  const buttonStyle: React.CSSProperties = {
    appearance: 'none',
    border: 0,
    background: 'transparent',
    padding: '0 10px'
  }

  if (!state.keypair) return null

  return (
    <div
      style={{
        display: 'flex',
        padding: '10px 0',
        borderBottom: '1px solid white'
      }}>
      <div>
        <button onClick={() => goBack()} style={buttonStyle}>
          <ChevronLeft style={{ width: 10, height: 10 }} />
        </button>
      </div>
      <div>
        <CopyToClipboard text={state.keypair.PublicKey}>
          <button style={buttonStyle}>
            {state.keypair?.Name}{' '}
            <span className='text-muted'>
              {state.keypair.PublicKeyShort}{' '}
              <Copy style={{ width: 10, height: 10 }} />
            </span>
          </button>
        </CopyToClipboard>
      </div>
      <div style={{ marginLeft: 'auto' }}>
        <Dropdown
          isOpen={isOpen}
          target={
            <button
              style={buttonStyle}
              onClick={() => setIsOpen(curr => !curr)}>
              <Kebab style={{ width: 15 }} />
            </button>
          }
          contents={
            <ul>
              {state.keypairs?.map(kp => (
                <li key={kp.PublicKey}>
                  <button
                    onClick={() => {
                      dispatch({ type: 'CHANGE_KEYPAIR', keypair: kp })
                    }}
                    style={buttonStyle}>
                    {kp.PublicKeyShort}
                  </button>
                </li>
              ))}
            </ul>
          }
        />
      </div>
    </div>
  )
}
