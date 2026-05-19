import { ReactNode } from 'react'

interface MobileFrameProps {
  children: ReactNode
}

export default function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div
      style={{
        maxWidth: '390px',
        minHeight: '100dvh',
        background: '#FAF3E8',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  )
}
