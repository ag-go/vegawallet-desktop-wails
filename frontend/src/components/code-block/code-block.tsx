import React from 'react'
import { Colors } from '../../config/colors'

interface CodeBlockProps {
  children: React.ReactNode
}

export function CodeBlock({ children }: CodeBlockProps) {
  return (
    <code
      style={{
        display: 'block',
        fontFamily: '"Roboto Mono", monospace',
        padding: 15,
        background: Colors.DARK_GRAY_2
      }}>
      {children}
    </code>
  )
}
