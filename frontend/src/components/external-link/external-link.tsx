import WailsRuntime from '@wailsapp/runtime'
import React from 'react'
import { AnchorHTMLAttributes } from 'react'

interface ExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string // make href prop required
}

export function ExternalLink(props: ExternalLinkProps) {
  return (
    // ignore warning about no content
    // eslint-disable-next-line
    <a
      {...props}
      target='_blank'
      onClick={() => WailsRuntime.Browser.OpenURL(props.href)}
    />
  )
}
