// Hand-drawn-feel SVG illustrations for Cupid / Best Part

export const ILLO = {
  orange: '#E8622A',
  orangeDeep: '#C44E1F',
  cream: '#FAF3E8',
  brown: '#2C1A0E',
  brownSoft: '#6B4A33',
  amber: '#F5A623',
  blush: '#F2B8A0',
  rice: '#FFF8EC',
}

// Rice bowl mascot — used on Landing and various screens
export function MascotBowl({ size = 200, mood = 'happy', wave = false }: { size?: number; mood?: string; wave?: boolean }) {
  return (
    <svg viewBox="0 0 200 220" width={size} height={size * 1.1} style={{ display: 'block' }}>
      <g stroke={ILLO.brownSoft} strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.55">
        <path d="M70 28 q -6 -10 0 -20 q 6 -10 0 -20" />
        <path d="M100 22 q -6 -10 0 -20 q 6 -10 0 -20" />
        <path d="M130 28 q -6 -10 0 -20 q 6 -10 0 -20" />
      </g>
      <path d="M40 92 q 8 -32 60 -32 q 52 0 60 32 q -8 6 -60 6 q -52 0 -60 -6 z"
        fill={ILLO.rice} stroke={ILLO.brown} strokeWidth="3" strokeLinejoin="round" />
      <g fill={ILLO.brown} opacity="0.5">
        <ellipse cx="68" cy="78" rx="2.4" ry="1.4" transform="rotate(-20 68 78)" />
        <ellipse cx="90" cy="72" rx="2.4" ry="1.4" transform="rotate(15 90 72)" />
        <ellipse cx="112" cy="76" rx="2.4" ry="1.4" transform="rotate(-10 112 76)" />
        <ellipse cx="132" cy="82" rx="2.4" ry="1.4" transform="rotate(30 132 82)" />
        <ellipse cx="80" cy="86" rx="2.4" ry="1.4" transform="rotate(8 80 86)" />
      </g>
      <path d="M32 96 q 0 70 68 70 q 68 0 68 -70 z"
        fill={ILLO.orange} stroke={ILLO.brown} strokeWidth="3" strokeLinejoin="round" />
      <path d="M44 104 q 18 -4 56 -4 q 38 0 56 4" stroke={ILLO.orangeDeep} strokeWidth="2" fill="none" opacity="0.4" />
      <path d="M48 132 q 52 12 104 0" stroke={ILLO.cream} strokeWidth="3" fill="none" strokeDasharray="2 5" strokeLinecap="round" opacity="0.85" />
      {mood === 'happy' && (
        <g fill={ILLO.brown}>
          <path d="M76 118 q 4 6 8 0" stroke={ILLO.brown} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M116 118 q 4 6 8 0" stroke={ILLO.brown} strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      )}
      {mood === 'bow' && (
        <g>
          <path d="M76 122 q 4 -3 8 0" stroke={ILLO.brown} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M116 122 q 4 -3 8 0" stroke={ILLO.brown} strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      )}
      <ellipse cx="68" cy="134" rx="6" ry="3.5" fill={ILLO.blush} opacity="0.7" />
      <ellipse cx="132" cy="134" rx="6" ry="3.5" fill={ILLO.blush} opacity="0.7" />
      {mood === 'happy' && <path d="M92 138 q 8 8 16 0" stroke={ILLO.brown} strokeWidth="3" strokeLinecap="round" fill="none" />}
      {mood === 'bow' && <path d="M94 140 q 6 4 12 0" stroke={ILLO.brown} strokeWidth="3" strokeLinecap="round" fill="none" />}
      {wave && (
        <g>
          <path d="M165 130 q 14 -10 22 -22" stroke={ILLO.orange} strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M165 130 q 14 -10 22 -22" stroke={ILLO.brown} strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <circle cx="187" cy="108" r="6" fill={ILLO.orange} stroke={ILLO.brown} strokeWidth="2.4" />
        </g>
      )}
      <g stroke={ILLO.brown} strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M78 166 q -2 8 0 14" />
        <path d="M122 166 q 2 8 0 14" />
      </g>
      <ellipse cx="78" cy="184" rx="9" ry="4" fill={ILLO.brown} />
      <ellipse cx="122" cy="184" rx="9" ry="4" fill={ILLO.brown} />
    </svg>
  )
}

export function MascotBow({ size = 200 }: { size?: number }) {
  return (
    <svg viewBox="0 0 220 200" width={size} height={size * 0.92} style={{ display: 'block' }}>
      <g stroke={ILLO.brownSoft} strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.45">
        <path d="M90 38 q -5 -8 0 -16" />
        <path d="M120 34 q -5 -8 0 -16" />
      </g>
      <g transform="rotate(-12 110 110)">
        <path d="M50 92 q 8 -30 60 -30 q 52 0 60 30 q -8 6 -60 6 q -52 0 -60 -6 z"
          fill={ILLO.rice} stroke={ILLO.brown} strokeWidth="3" strokeLinejoin="round" />
        <g fill={ILLO.brown} opacity="0.5">
          <ellipse cx="78" cy="78" rx="2.4" ry="1.4" transform="rotate(-20 78 78)" />
          <ellipse cx="100" cy="72" rx="2.4" ry="1.4" transform="rotate(15 100 72)" />
          <ellipse cx="122" cy="76" rx="2.4" ry="1.4" transform="rotate(-10 122 76)" />
        </g>
        <path d="M42 96 q 0 68 68 68 q 68 0 68 -68 z"
          fill={ILLO.orange} stroke={ILLO.brown} strokeWidth="3" strokeLinejoin="round" />
        <path d="M58 132 q 52 10 104 0" stroke={ILLO.cream} strokeWidth="3" fill="none" strokeDasharray="2 5" strokeLinecap="round" opacity="0.85" />
        <path d="M86 120 q 4 -4 8 0" stroke={ILLO.brown} strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M126 120 q 4 -4 8 0" stroke={ILLO.brown} strokeWidth="3" strokeLinecap="round" fill="none" />
        <ellipse cx="78" cy="132" rx="6" ry="3.5" fill={ILLO.blush} opacity="0.7" />
        <ellipse cx="142" cy="132" rx="6" ry="3.5" fill={ILLO.blush} opacity="0.7" />
        <path d="M102 142 q 8 4 16 0" stroke={ILLO.brown} strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
      <g>
        <path d="M148 142 q 14 -8 22 -6" stroke={ILLO.orange} strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M148 142 q 14 -8 22 -6" stroke={ILLO.brown} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <path d="M158 158 q 14 -4 20 -4" stroke={ILLO.orange} strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M158 158 q 14 -4 20 -4" stroke={ILLO.brown} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <circle cx="172" cy="148" r="8" fill={ILLO.orange} stroke={ILLO.brown} strokeWidth="2.4" />
      </g>
    </svg>
  )
}

export function MascotWai({ size = 220, glow = false }: { size?: number; glow?: boolean }) {
  return (
    <svg viewBox="0 0 220 240" width={size} height={size * 240 / 220} style={{ display: 'block' }}>
      {glow && (
        <defs>
          <radialGradient id="wai-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE0A8" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#F5A623" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
          </radialGradient>
        </defs>
      )}
      {glow && <circle cx="110" cy="120" r="110" fill="url(#wai-glow)" />}
      <g stroke={ILLO.brownSoft} strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.5">
        <path d="M80 38 q -6 -10 0 -20" />
        <path d="M110 32 q -6 -10 0 -20" />
        <path d="M140 38 q -6 -10 0 -20" />
      </g>
      <path d="M50 100 q 8 -32 60 -32 q 52 0 60 32 q -8 6 -60 6 q -52 0 -60 -6 z"
        fill={ILLO.rice} stroke={ILLO.brown} strokeWidth="3" strokeLinejoin="round" />
      <g fill={ILLO.brown} opacity="0.5">
        <ellipse cx="78" cy="86" rx="2.4" ry="1.4" transform="rotate(-20 78 86)" />
        <ellipse cx="100" cy="80" rx="2.4" ry="1.4" transform="rotate(15 100 80)" />
        <ellipse cx="122" cy="84" rx="2.4" ry="1.4" transform="rotate(-10 122 84)" />
        <ellipse cx="142" cy="90" rx="2.4" ry="1.4" transform="rotate(30 142 90)" />
      </g>
      <path d="M42 104 q 0 70 68 70 q 68 0 68 -70 z"
        fill={ILLO.orange} stroke={ILLO.brown} strokeWidth="3" strokeLinejoin="round" />
      <path d="M58 140 q 52 12 104 0" stroke={ILLO.cream} strokeWidth="3" fill="none" strokeDasharray="2 5" strokeLinecap="round" opacity="0.85" />
      <path d="M82 126 q 4 -3 8 0" stroke={ILLO.brown} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M130 126 q 4 -3 8 0" stroke={ILLO.brown} strokeWidth="3" strokeLinecap="round" fill="none" />
      <ellipse cx="74" cy="140" rx="6" ry="3.5" fill={ILLO.blush} opacity="0.7" />
      <ellipse cx="146" cy="140" rx="6" ry="3.5" fill={ILLO.blush} opacity="0.7" />
      <path d="M100 148 q 10 4 20 0" stroke={ILLO.brown} strokeWidth="3" strokeLinecap="round" fill="none" />
      <g>
        <path d="M70 156 q -2 -22 30 -28" stroke={ILLO.orange} strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M70 156 q -2 -22 30 -28" stroke={ILLO.brown} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <path d="M150 156 q 2 -22 -30 -28" stroke={ILLO.orange} strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M150 156 q 2 -22 -30 -28" stroke={ILLO.brown} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <ellipse cx="110" cy="124" rx="14" ry="11" fill={ILLO.orange} stroke={ILLO.brown} strokeWidth="2.4" />
        <path d="M110 116 v 16" stroke={ILLO.brown} strokeWidth="2" opacity="0.5" />
      </g>
    </svg>
  )
}

export function MascotWorried({ size = 170 }: { size?: number }) {
  return (
    <svg viewBox="0 0 200 220" width={size} height={size * 1.1} style={{ display: 'block' }}>
      <g stroke={ILLO.brownSoft} strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.35">
        <path d="M70 28 q -3 -8 0 -16" />
        <path d="M130 28 q 3 -8 0 -16" />
      </g>
      <path d="M40 92 q 8 -32 60 -32 q 52 0 60 32 q -8 6 -60 6 q -52 0 -60 -6 z"
        fill={ILLO.rice} stroke={ILLO.brown} strokeWidth="3" strokeLinejoin="round" />
      <path d="M32 96 q 0 70 68 70 q 68 0 68 -70 z"
        fill="#D9482A" stroke={ILLO.brown} strokeWidth="3" strokeLinejoin="round" />
      <path d="M48 132 q 52 12 104 0" stroke={ILLO.cream} strokeWidth="3" fill="none" strokeDasharray="2 5" strokeLinecap="round" opacity="0.85" />
      <path d="M70 112 q 8 -3 14 0" stroke={ILLO.brown} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M116 112 q 8 -3 14 0" stroke={ILLO.brown} strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="80" cy="124" r="3" fill={ILLO.brown} />
      <circle cx="124" cy="124" r="3" fill={ILLO.brown} />
      <ellipse cx="68" cy="138" rx="6" ry="3.5" fill={ILLO.blush} opacity="0.7" />
      <ellipse cx="132" cy="138" rx="6" ry="3.5" fill={ILLO.blush} opacity="0.7" />
      <ellipse cx="100" cy="146" rx="5" ry="6" fill="#3A1810" />
      <path d="M148 138 q 14 -4 18 -16" stroke="#D9482A" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M148 138 q 14 -4 18 -16" stroke={ILLO.brown} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <circle cx="166" cy="122" r="6" fill="#D9482A" stroke={ILLO.brown} strokeWidth="2.2" />
      <path d="M58 100 q -2 6 0 10 q 2 -4 0 -10 z" fill="#7BB7E0" stroke={ILLO.brown} strokeWidth="1.6" />
    </svg>
  )
}

export function MascotJump({ size = 180 }: { size?: number }) {
  return (
    <svg viewBox="0 0 220 240" width={size} height={size * 240 / 220} style={{ display: 'block' }}>
      <g>
        <path d="M60 130 q -16 -20 -10 -42" stroke={ILLO.orange} strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M60 130 q -16 -20 -10 -42" stroke={ILLO.brown} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <circle cx="50" cy="88" r="7" fill={ILLO.orange} stroke={ILLO.brown} strokeWidth="2.4" />
        <path d="M160 130 q 16 -20 10 -42" stroke={ILLO.orange} strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M160 130 q 16 -20 10 -42" stroke={ILLO.brown} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <circle cx="170" cy="88" r="7" fill={ILLO.orange} stroke={ILLO.brown} strokeWidth="2.4" />
      </g>
      <g fill={ILLO.amber}>
        <path d="M40 60 l 3 8 l 8 3 l -8 3 l -3 8 l -3 -8 l -8 -3 l 8 -3 z" />
        <path d="M180 60 l 2 5 l 5 2 l -5 2 l -2 5 l -2 -5 l -5 -2 l 5 -2 z" />
        <path d="M30 140 l 2 5 l 5 2 l -5 2 l -2 5 l -2 -5 l -5 -2 l 5 -2 z" />
        <path d="M195 150 l 3 7 l 7 3 l -7 3 l -3 7 l -3 -7 l -7 -3 l 7 -3 z" />
      </g>
      <path d="M55 110 q 8 -30 55 -30 q 47 0 55 30 q -8 6 -55 6 q -47 0 -55 -6 z"
        fill={ILLO.rice} stroke={ILLO.brown} strokeWidth="3" strokeLinejoin="round" />
      <path d="M48 116 q 0 66 62 66 q 62 0 62 -66 z"
        fill={ILLO.orange} stroke={ILLO.brown} strokeWidth="3" strokeLinejoin="round" />
      <path d="M62 150 q 48 10 96 0" stroke={ILLO.cream} strokeWidth="3" fill="none" strokeDasharray="2 5" strokeLinecap="round" opacity="0.85" />
      <path d="M82 134 q 4 6 8 0" stroke={ILLO.brown} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M130 134 q 4 6 8 0" stroke={ILLO.brown} strokeWidth="3" strokeLinecap="round" fill="none" />
      <ellipse cx="74" cy="150" rx="6" ry="3.5" fill={ILLO.blush} opacity="0.7" />
      <ellipse cx="146" cy="150" rx="6" ry="3.5" fill={ILLO.blush} opacity="0.7" />
      <path d="M94 154 q 16 14 32 0 q -16 6 -32 0 z" fill="#3A1810" stroke={ILLO.brown} strokeWidth="2.4" strokeLinejoin="round" />
      <g stroke={ILLO.brown} strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M82 182 q -6 8 -2 14" />
        <path d="M138 182 q 8 6 4 14" />
      </g>
      <ellipse cx="76" cy="200" rx="9" ry="4" fill={ILLO.brown} transform="rotate(-20 76 200)" />
      <ellipse cx="144" cy="200" rx="9" ry="4" fill={ILLO.brown} transform="rotate(20 144 200)" />
    </svg>
  )
}

export function FaceHappy({ size = 88 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block' }}>
      <circle cx="50" cy="50" r="40" fill={ILLO.orange} stroke={ILLO.brown} strokeWidth="3" />
      <path d="M50 26 q 18 -6 30 4" stroke={ILLO.orangeDeep} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M36 44 q 4 6 8 0" stroke={ILLO.brown} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M56 44 q 4 6 8 0" stroke={ILLO.brown} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <ellipse cx="30" cy="62" rx="5" ry="3" fill={ILLO.blush} opacity="0.8" />
      <ellipse cx="70" cy="62" rx="5" ry="3" fill={ILLO.blush} opacity="0.8" />
      <path d="M38 64 q 12 14 24 0" stroke={ILLO.brown} strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function FaceNeutral({ size = 88 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block' }}>
      <circle cx="50" cy="50" r="40" fill={ILLO.amber} stroke={ILLO.brown} strokeWidth="3" />
      <path d="M50 26 q 18 -6 30 4" stroke={ILLO.orangeDeep} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4" />
      <circle cx="38" cy="45" r="3.2" fill={ILLO.brown} />
      <circle cx="62" cy="45" r="3.2" fill={ILLO.brown} />
      <path d="M38 68 q 12 0 24 0" stroke={ILLO.brown} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <ellipse cx="28" cy="62" rx="4" ry="2.5" fill={ILLO.blush} opacity="0.7" />
      <ellipse cx="72" cy="62" rx="4" ry="2.5" fill={ILLO.blush} opacity="0.7" />
    </svg>
  )
}

export function FaceAlert({ size = 88 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block' }}>
      <circle cx="50" cy="50" r="40" fill="#D9482A" stroke={ILLO.brown} strokeWidth="3" />
      <path d="M50 26 q 18 -6 30 4" stroke={ILLO.orangeDeep} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4" />
      <path d="M30 36 q 8 -3 14 0" stroke={ILLO.brown} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M56 36 q 8 -3 14 0" stroke={ILLO.brown} strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="38" cy="48" r="3.2" fill={ILLO.brown} />
      <circle cx="62" cy="48" r="3.2" fill={ILLO.brown} />
      <path d="M38 72 q 12 -10 24 0" stroke={ILLO.brown} strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function BossAvatar({ size = 56 }: { size?: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} style={{ display: 'block' }}>
      <path d="M14 38 q 0 -28 26 -28 q 26 0 26 28 q -4 -8 -10 -10 q -16 -6 -32 0 q -6 2 -10 10 z" fill={ILLO.brown} />
      <ellipse cx="40" cy="44" rx="22" ry="24" fill="#F2D7B8" stroke={ILLO.brown} strokeWidth="2.5" />
      <path d="M14 38 q 0 -28 26 -28 q 26 0 26 28 q -4 -8 -10 -10 q -16 -6 -32 0 q -6 2 -10 10 z" fill={ILLO.brown} />
      <path d="M28 44 q 3 4 6 0" stroke={ILLO.brown} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M46 44 q 3 4 6 0" stroke={ILLO.brown} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M32 56 q 8 6 16 0" stroke={ILLO.brown} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <ellipse cx="24" cy="54" rx="3" ry="2" fill={ILLO.blush} opacity="0.7" />
      <ellipse cx="56" cy="54" rx="3" ry="2" fill={ILLO.blush} opacity="0.7" />
    </svg>
  )
}

export function HeartLogo({ size = 18, color = '#E8622A' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 22" width={size} height={size * 22 / 24} style={{ display: 'block' }}>
      <path d="M12 20 C 4 14, 1 9, 4 5 C 7 1, 11 3, 12 6 C 13 3, 17 1, 20 5 C 23 9, 20 14, 12 20 z"
        fill={color} stroke={ILLO.brown} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 7 q 1 1 2 0" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}

export function DishPhoto({ kind = 0, size = 96 }: { kind?: number; size?: number }) {
  const tints: [string, string][] = [
    ['#F4C8A0', '#D9591F'],
    ['#F2E3B8', '#9C7A2E'],
    ['#E4C8B8', '#6E3A1A'],
    ['#F6D2B0', '#C44E1F'],
    ['#E8D8C0', '#5C3B22'],
    ['#F2B07A', '#A03A12'],
  ]
  const [bg, fg] = tints[kind % tints.length]
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block' }}>
      <circle cx="50" cy="50" r="44" fill={ILLO.rice} stroke={ILLO.brown} strokeWidth="2" />
      <circle cx="50" cy="50" r="36" fill={bg} />
      <path d={`M ${30 + kind * 2} ${48 + kind} q 8 -10 20 -8 q 12 2 18 12 q -10 14 -22 12 q -12 -2 -16 -16 z`} fill={fg} opacity="0.85" />
      <ellipse cx={56 - kind * 2} cy={42 + kind} rx="6" ry="4" fill="#fff" opacity="0.5" />
      <circle cx={38 + kind} cy={58} r="2.5" fill={ILLO.brown} opacity="0.7" />
      <circle cx={62 - kind} cy={56} r="2" fill={ILLO.brown} opacity="0.6" />
      <path d={`M ${28 + kind} ${36} q 4 -4 8 -2`} stroke="#3B5A2E" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M 64 36 q 4 -2 6 1" stroke="#3B5A2E" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}

export function ConfettiBurst() {
  const pieces = Array.from({ length: 28 }, (_, i) => i)
  const colors = [ILLO.orange, ILLO.amber, ILLO.brown, '#D9482A', ILLO.cream]
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {pieces.map((i) => {
        const angle = (i / pieces.length) * Math.PI * 2
        const dist = 80 + (i % 4) * 30
        const dx = Math.cos(angle) * dist
        const dy = Math.sin(angle) * dist - 20
        const c = colors[i % colors.length]
        const delay = (i % 6) * 60
        const rot = (i * 47) % 360
        const shape = i % 3
        return (
          <div key={i} style={{
            position: 'absolute', left: '50%', top: 70,
            width: shape === 0 ? 10 : 8,
            height: shape === 1 ? 4 : 8,
            background: c,
            borderRadius: shape === 2 ? '50%' : 2,
            transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) rotate(${rot}deg)`,
            opacity: 0,
            animation: `confetti-pop 1.6s cubic-bezier(.2,.7,.3,1) ${delay}ms forwards`,
          }} />
        )
      })}
    </div>
  )
}

export function FounderPortrait({ size = 88, who = 'boss' }: { size?: number; who?: string }) {
  const skin = '#F2D7B8'
  if (who === 'partner') {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="52" r="36" fill={skin} stroke={ILLO.brown} strokeWidth="2.5" />
        <path d="M14 48 q 0 -32 36 -32 q 36 0 36 32 q 0 14 -6 22 q -8 -22 -30 -22 q -22 0 -30 22 q -6 -8 -6 -22 z" fill={ILLO.brown} />
        <path d="M18 56 q -4 18 4 30" stroke={ILLO.brown} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M82 56 q 4 18 -4 30" stroke={ILLO.brown} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M36 52 q 3 4 6 0" stroke={ILLO.brown} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <path d="M58 52 q 3 4 6 0" stroke={ILLO.brown} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <path d="M42 66 q 8 5 16 0" stroke={ILLO.brown} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <ellipse cx="32" cy="62" rx="3.5" ry="2.5" fill={ILLO.blush} opacity="0.8" />
        <ellipse cx="68" cy="62" rx="3.5" ry="2.5" fill={ILLO.blush} opacity="0.8" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <circle cx="50" cy="52" r="36" fill={skin} stroke={ILLO.brown} strokeWidth="2.5" />
      <path d="M16 44 q 0 -28 34 -28 q 34 0 34 28 q -4 -8 -10 -10 q -16 -6 -32 0 q -8 2 -16 18 q -2 -2 -10 -8 z" fill={ILLO.brown} />
      <circle cx="38" cy="52" r="6" fill="none" stroke={ILLO.brown} strokeWidth="2" />
      <circle cx="62" cy="52" r="6" fill="none" stroke={ILLO.brown} strokeWidth="2" />
      <path d="M44 52 h 12" stroke={ILLO.brown} strokeWidth="2" />
      <path d="M38 52 q 0 -2 2 0" stroke={ILLO.brown} strokeWidth="1.4" fill="none" />
      <path d="M62 52 q 0 -2 2 0" stroke={ILLO.brown} strokeWidth="1.4" fill="none" />
      <path d="M40 66 q 10 5 20 0" stroke={ILLO.brown} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <ellipse cx="30" cy="62" rx="3.5" ry="2.5" fill={ILLO.blush} opacity="0.8" />
      <ellipse cx="70" cy="62" rx="3.5" ry="2.5" fill={ILLO.blush} opacity="0.8" />
    </svg>
  )
}

export function HeroCar({ size = 200 }: { size?: number }) {
  return (
    <svg viewBox="0 0 240 140" width={size} height={size * 140 / 240}>
      <circle cx="200" cy="38" r="22" fill="#F5A623" opacity="0.5" />
      <path d="M30 100 q 0 -6 6 -6 l 28 0 q 4 -22 18 -22 l 60 0 q 14 0 18 22 l 28 0 q 6 0 6 6 l 0 16 q 0 4 -4 4 l -22 0 q -2 6 -8 6 q -6 0 -8 -6 l -80 0 q -2 6 -8 6 q -6 0 -8 -6 l -22 0 q -4 0 -4 -4 z"
        fill={ILLO.orange} stroke={ILLO.brown} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M68 94 q 4 -16 14 -16 l 24 0 l 0 16 z" fill={ILLO.cream} stroke={ILLO.brown} strokeWidth="2" />
      <path d="M114 78 l 24 0 q 10 0 14 16 l -38 0 z" fill={ILLO.cream} stroke={ILLO.brown} strokeWidth="2" />
      <ellipse cx="88" cy="86" rx="6" ry="4" fill="#8B5A2B" />
      <circle cx="86" cy="84" r="1.2" fill={ILLO.brown} />
      <path d="M82 84 q -2 -4 2 -4" stroke="#8B5A2B" strokeWidth="2" fill="#8B5A2B" />
      <rect x="148" y="58" width="22" height="22" rx="2" fill={ILLO.amber} stroke={ILLO.brown} strokeWidth="2" />
      <path d="M152 58 q 0 -4 4 -4 l 10 0 q 4 0 4 4" stroke={ILLO.brown} strokeWidth="2" fill="none" />
      <text x="159" y="74" fontFamily="DM Sans" fontSize="9" fontWeight="700" fill={ILLO.brown} textAnchor="middle">BP</text>
      <circle cx="70" cy="116" r="10" fill={ILLO.brown} />
      <circle cx="70" cy="116" r="4" fill={ILLO.cream} />
      <circle cx="160" cy="116" r="10" fill={ILLO.brown} />
      <circle cx="160" cy="116" r="4" fill={ILLO.cream} />
      <path d="M10 126 L 230 126" stroke={ILLO.brown} strokeWidth="2" strokeDasharray="4 6" opacity="0.4" />
    </svg>
  )
}

export function HeroStar({ size = 200 }: { size?: number }) {
  return (
    <svg viewBox="0 0 240 160" width={size} height={size * 160 / 240}>
      <path d="M120 24 l 16 38 l 42 4 l -32 28 l 10 42 l -36 -22 l -36 22 l 10 -42 l -32 -28 l 42 -4 z"
        fill={ILLO.amber} stroke={ILLO.brown} strokeWidth="2.5" strokeLinejoin="round" />
      <text x="120" y="100" fontFamily="DM Sans" fontSize="22" fontWeight="800" fill={ILLO.brown} textAnchor="middle">YOU</text>
      <path d="M50 50 l 3 8 l 8 3 l -8 3 l -3 8 l -3 -8 l -8 -3 l 8 -3 z" fill={ILLO.orange} />
      <path d="M198 60 l 2 6 l 6 2 l -6 2 l -2 6 l -2 -6 l -6 -2 l 6 -2 z" fill={ILLO.orange} />
      <path d="M40 120 l 3 7 l 7 3 l -7 3 l -3 7 l -3 -7 l -7 -3 l 7 -3 z" fill={ILLO.orangeDeep} />
      <path d="M208 130 l 2 5 l 5 2 l -5 2 l -2 5 l -2 -5 l -5 -2 l 5 -2 z" fill={ILLO.orangeDeep} />
    </svg>
  )
}

export function HeroPork({ size = 200 }: { size?: number }) {
  return (
    <svg viewBox="0 0 240 160" width={size} height={size * 160 / 240}>
      <ellipse cx="120" cy="120" rx="100" ry="22" fill={ILLO.rice} stroke={ILLO.brown} strokeWidth="2.5" />
      <ellipse cx="120" cy="116" rx="88" ry="18" fill="#F4D9B0" />
      <g fill="#C8801E" stroke={ILLO.brown} strokeWidth="2" strokeLinejoin="round">
        <path d="M64 110 q 4 -20 24 -22 q 20 -2 22 14 q 0 16 -18 18 q -22 2 -28 -10 z" />
        <path d="M104 106 q 6 -16 24 -16 q 22 0 24 14 q -2 16 -22 18 q -22 0 -26 -16 z" />
        <path d="M140 110 q 4 -14 22 -14 q 20 0 24 12 q -2 14 -22 16 q -22 0 -24 -14 z" />
      </g>
      <path d="M70 100 q 14 -8 26 -4" stroke="#FFE0A8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M114 96 q 12 -6 22 -2" stroke="#FFE0A8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M50 50 l 3 8 l 8 3 l -8 3 l -3 8 l -3 -8 l -8 -3 l 8 -3 z" fill={ILLO.amber} />
      <path d="M194 40 l 3 8 l 8 3 l -8 3 l -3 8 l -3 -8 l -8 -3 l 8 -3 z" fill={ILLO.amber} />
      <path d="M120 30 l 3 8 l 8 3 l -8 3 l -3 8 l -3 -8 l -8 -3 l 8 -3 z" fill={ILLO.amber} />
      <g stroke={ILLO.brownSoft} strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.5">
        <path d="M90 80 q -6 -10 0 -20" />
        <path d="M150 80 q -6 -10 0 -20" />
      </g>
    </svg>
  )
}
