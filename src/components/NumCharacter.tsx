// Num — kawaii rice bowl mascot, 8 poses

type Pose = 'greeting' | 'happy' | 'listening' | 'concerned' | 'promising' | 'grateful' | 'dreamy' | 'celebrating'

interface NumCharacterProps {
  pose: Pose
  size?: number
  className?: string
}

const C = {
  orange: '#E8622A',
  orangeDeep: '#C44E1F',
  brown: '#2C1A0E',
  blush: '#F2B8A0',
  rice: '#FFF8EC',
  amber: '#F5A623',
}

const BODY_TRANSFORMS: Record<Pose, string> = {
  greeting:   'rotate(5, 100, 130)',
  happy:      'rotate(-10, 100, 130)',
  listening:  '',
  concerned:  'translate(0, 4)',
  promising:  '',
  grateful:   '',
  dreamy:     'rotate(-6, 100, 130)',
  celebrating:'translate(0, -3)',
}

// 4-pointed sparkle star path (centred at origin, size s)
function starPath(s: number) {
  const i = s * 0.26
  return `M0,${-s} L${i},${-i} L${s},0 L${i},${i} L0,${s} L${-i},${i} L${-s},0 L${-i},${-i}Z`
}

export default function NumCharacter({ pose, size = 120, className }: NumCharacterProps) {
  const vw = 200, vh = 220

  // Helper: thick orange arm stroke + brown outline
  const arm = (d: string) => (
    <>
      <path d={d} stroke={C.orange} strokeWidth={11} strokeLinecap="round" fill="none" />
      <path d={d} stroke={C.brown}  strokeWidth={2.5} strokeLinecap="round" fill="none" />
    </>
  )

  return (
    <svg
      viewBox={`0 0 ${vw} ${vh}`}
      width={size}
      height={size * vh / vw}
      style={{ display: 'block' }}
      className={className}
    >
      <g transform={BODY_TRANSFORMS[pose]}>

        {/* ── BOWL BODY ── */}
        <path d="M32 96 q0 70 68 70 q68 0 68-70z"
          fill={C.orange} stroke={C.brown} strokeWidth={2.5} strokeLinejoin="round" />

        {/* ── RICE DOME ── */}
        <path d="M40 92 q8-32 60-32 q52 0 60 32 q-8 6-60 6 q-52 0-60-6z"
          fill={C.rice} stroke={C.brown} strokeWidth={2.5} strokeLinejoin="round" />

        {/* Rice grain dots */}
        <ellipse cx={68}  cy={78} rx={2.4} ry={1.4} fill={C.brown} opacity={0.5} transform="rotate(-20 68 78)" />
        <ellipse cx={90}  cy={72} rx={2.4} ry={1.4} fill={C.brown} opacity={0.5} transform="rotate(15 90 72)" />
        <ellipse cx={112} cy={76} rx={2.4} ry={1.4} fill={C.brown} opacity={0.5} transform="rotate(-10 112 76)" />
        <ellipse cx={132} cy={82} rx={2.4} ry={1.4} fill={C.brown} opacity={0.5} transform="rotate(30 132 82)" />
        <ellipse cx={80}  cy={86} rx={2.4} ry={1.4} fill={C.brown} opacity={0.5} transform="rotate(8 80 86)" />

        {/* Bowl accent lines */}
        <path d="M48 108 q52-8 104 0"  stroke={C.orangeDeep} strokeWidth={2}   fill="none" opacity={0.4} />
        <path d="M48 132 q52 12 104 0" stroke={C.rice}       strokeWidth={2.5} fill="none"
              strokeDasharray="2 5" strokeLinecap="round" opacity={0.75} />

        {/* ── ARMS ── */}

        {pose === 'greeting' && <>
          {arm("M40 118 Q62 112 72 130")}
          {arm("M160 118 Q138 112 128 130")}
          <ellipse cx={100} cy={133} rx={16} ry={10}
            fill={C.orange} stroke={C.brown} strokeWidth={2.5} />
          <line x1={100} y1={123} x2={100} y2={143}
            stroke={C.brown} strokeWidth={1.5} opacity={0.35} />
        </>}

        {pose === 'happy' && <>
          {arm("M40 118 Q28 90 36 70")}
          {arm("M160 118 Q172 90 164 70")}
          <circle cx={36}  cy={67} r={8} fill={C.orange} stroke={C.brown} strokeWidth={2.5} />
          <circle cx={164} cy={67} r={8} fill={C.orange} stroke={C.brown} strokeWidth={2.5} />
        </>}

        {pose === 'listening' && <>
          {arm("M40 122 Q58 116 80 122")}
          {arm("M160 116 Q142 108 118 144")}
          <circle cx={118} cy={146} r={7} fill={C.orange} stroke={C.brown} strokeWidth={2.5} />
        </>}

        {pose === 'concerned' && <>
          {arm("M162 116 Q132 110 90 122")}
          {arm("M38 122 Q68 116 110 126")}
        </>}

        {pose === 'promising' && <>
          {arm("M40 120 Q45 136 52 146")}
          {arm("M160 116 Q168 92 162 72")}
          <ellipse cx={160} cy={68} rx={10} ry={12}
            fill={C.orange} stroke={C.brown} strokeWidth={2.5} />
          {arm("M154 66 Q148 58 152 52")}
          <circle cx={152} cy={50} r={6} fill={C.orange} stroke={C.brown} strokeWidth={2.5} />
        </>}

        {pose === 'grateful' && <>
          {arm("M40 118 Q26 140 30 158")}
          {arm("M160 118 Q174 140 170 158")}
          <circle cx={30}  cy={160} r={8} fill={C.orange} stroke={C.brown} strokeWidth={2.5} />
          <circle cx={170} cy={160} r={8} fill={C.orange} stroke={C.brown} strokeWidth={2.5} />
        </>}

        {pose === 'dreamy' && <>
          {arm("M40 118 Q52 112 62 132")}
          {arm("M160 118 Q148 112 138 132")}
          <circle cx={62}  cy={136} r={9} fill={C.orange} stroke={C.brown} strokeWidth={2.5} />
          <circle cx={138} cy={136} r={9} fill={C.orange} stroke={C.brown} strokeWidth={2.5} />
        </>}

        {pose === 'celebrating' && <>
          {arm("M38 116 Q16 88 12 68")}
          {arm("M162 116 Q184 88 188 68")}
          <circle cx={12}  cy={65} r={8} fill={C.orange} stroke={C.brown} strokeWidth={2.5} />
          <circle cx={188} cy={65} r={8} fill={C.orange} stroke={C.brown} strokeWidth={2.5} />
        </>}

        {/* ── CHEEKS ── */}
        <ellipse cx={68}  cy={134} rx={8} ry={5} fill={C.blush} opacity={0.75} />
        <ellipse cx={132} cy={134} rx={8} ry={5} fill={C.blush} opacity={0.75} />

        {/* ── EYES ── */}

        {pose === 'greeting' && <>
          <path d="M76 118 q4 6 8 0"  stroke={C.brown} strokeWidth={3} strokeLinecap="round" fill="none" />
          <path d="M116 118 q4 6 8 0" stroke={C.brown} strokeWidth={3} strokeLinecap="round" fill="none" />
        </>}

        {(pose === 'happy' || pose === 'celebrating') && <>
          <path d="M76 122 q4-8 8 0"  stroke={C.brown} strokeWidth={3} strokeLinecap="round" fill="none" />
          <path d="M116 122 q4-8 8 0" stroke={C.brown} strokeWidth={3} strokeLinecap="round" fill="none" />
        </>}

        {pose === 'listening' && <>
          <circle cx={80}  cy={122} r={4}   fill={C.brown} />
          <circle cx={120} cy={122} r={4}   fill={C.brown} />
          <circle cx={78}  cy={120} r={1.5} fill="white" />
          <circle cx={118} cy={120} r={1.5} fill="white" />
        </>}

        {pose === 'concerned' && <>
          {/* Sad brows */}
          <path d="M74 110 q5-4 10 0"  stroke={C.brown} strokeWidth={2.5} strokeLinecap="round" fill="none" />
          <path d="M116 110 q5 4 10 0" stroke={C.brown} strokeWidth={2.5} strokeLinecap="round" fill="none" />
          {/* Droopy half-closed eyes */}
          <path d="M76 122 q4 3 8 0"  stroke={C.brown} strokeWidth={3} strokeLinecap="round" fill="none" />
          <path d="M116 122 q4 3 8 0" stroke={C.brown} strokeWidth={3} strokeLinecap="round" fill="none" />
        </>}

        {pose === 'promising' && <>
          {/* Left: normal happy */}
          <path d="M76 118 q4 6 8 0" stroke={C.brown} strokeWidth={3} strokeLinecap="round" fill="none" />
          {/* Right: wink */}
          <path d="M116 122 q4 2 8-2" stroke={C.brown} strokeWidth={3} strokeLinecap="round" fill="none" />
        </>}

        {pose === 'grateful' && <>
          <path d="M76 120 q4 4 8 0"  stroke={C.brown} strokeWidth={2.5} strokeLinecap="round" fill="none" />
          <path d="M116 120 q4 4 8 0" stroke={C.brown} strokeWidth={2.5} strokeLinecap="round" fill="none" />
        </>}

        {pose === 'dreamy' && <>
          {/* Gold star eyes */}
          <g transform="translate(80, 122)"><path d={starPath(8)} fill={C.amber} /></g>
          <g transform="translate(120, 122)"><path d={starPath(8)} fill={C.amber} /></g>
        </>}

        {/* ── MOUTH ── */}

        {pose === 'greeting' && (
          <path d="M88 140 q12 12 24 0" stroke={C.brown} strokeWidth={3} strokeLinecap="round" fill="none" />
        )}

        {pose === 'happy' && <>
          <path d="M86 138 q14 16 28 0 q-14 4-28 0z"
            fill="#3A1810" stroke={C.brown} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M86 138 q14 4 28 0" stroke="white" strokeWidth={1.5} strokeLinecap="round" fill="none" />
        </>}

        {pose === 'listening' && (
          <ellipse cx={100} cy={143} rx={4} ry={4.5} fill="#3A1810" stroke={C.brown} strokeWidth={1.5} />
        )}

        {pose === 'concerned' && (
          <path d="M88 144 q12 0 24 0" stroke={C.brown} strokeWidth={3} strokeLinecap="round" fill="none" />
        )}

        {pose === 'promising' && (
          <path d="M92 141 q10 6 18 2" stroke={C.brown} strokeWidth={3} strokeLinecap="round" fill="none" />
        )}

        {pose === 'grateful' && (
          <path d="M90 140 q10 8 20 0" stroke={C.brown} strokeWidth={2.5} strokeLinecap="round" fill="none" />
        )}

        {pose === 'dreamy' && (
          <ellipse cx={100} cy={143} rx={7} ry={8} fill="#3A1810" stroke={C.brown} strokeWidth={2} />
        )}

        {pose === 'celebrating' && <>
          <path d="M84 136 q16 20 32 0 q-16 6-32 0z"
            fill="#3A1810" stroke={C.brown} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M84 136 q16 6 32 0" stroke="white" strokeWidth={2} strokeLinecap="round" fill="none" />
        </>}

        {/* ── LEGS ── */}
        <path d="M78 166 q-2 8 0 14" stroke={C.brown} strokeWidth={5} strokeLinecap="round" fill="none" />
        <path d="M122 166 q2 8 0 14"  stroke={C.brown} strokeWidth={5} strokeLinecap="round" fill="none" />
        <ellipse cx={76}  cy={183} rx={9} ry={4} fill={C.brown} />
        <ellipse cx={124} cy={183} rx={9} ry={4} fill={C.brown} />

        {/* ── PROPS ── */}

        {pose === 'greeting' && <>
          {/* Two sparkle crosses above head */}
          <g transform="translate(78, 32)">
            <path d="M0,-7 L0,7 M-7,0 L7,0" stroke={C.amber} strokeWidth={2} strokeLinecap="round" />
            <path d="M-5,-5 L5,5 M-5,5 L5,-5" stroke={C.amber} strokeWidth={1} strokeLinecap="round" opacity={0.5} />
          </g>
          <g transform="translate(122, 32)">
            <path d="M0,-7 L0,7 M-7,0 L7,0" stroke={C.amber} strokeWidth={2} strokeLinecap="round" />
            <path d="M-5,-5 L5,5 M-5,5 L5,-5" stroke={C.amber} strokeWidth={1} strokeLinecap="round" opacity={0.5} />
          </g>
        </>}

        {pose === 'happy' && <>
          {/* 3 stars around body */}
          <g transform="translate(32, 78)"> <path d={starPath(7)}  fill={C.amber} /></g>
          <g transform="translate(168, 78)"><path d={starPath(7)}  fill={C.amber} /></g>
          <g transform="translate(100, 28)"><path d={starPath(9)}  fill={C.amber} /></g>
        </>}

        {pose === 'listening' && <>
          {/* "..." speech bubble top right */}
          <rect x={128} y={14} width={52} height={26} rx={10}
            fill="white" stroke={C.brown} strokeWidth={1.8} />
          <path d="M148 40 Q142 50 158 40"
            fill="white" stroke={C.brown} strokeWidth={1.5} strokeLinejoin="round" />
          <circle cx={142} cy={27} r={3} fill={C.brown} />
          <circle cx={154} cy={27} r={3} fill={C.brown} />
          <circle cx={166} cy={27} r={3} fill={C.brown} />
        </>}

        {pose === 'concerned' && <>
          {/* Sweat drop on right side of head */}
          <path d="M162 56 Q158 46 162 38 Q166 46 162 56Z"
            fill="#7BB7E0" stroke={C.brown} strokeWidth={1.5} strokeLinejoin="round" />
        </>}

        {pose === 'promising' && <>
          {/* 2 stars near thumb */}
          <g transform="translate(143, 50)"><path d={starPath(6)} fill={C.amber} /></g>
          <g transform="translate(153, 36)"><path d={starPath(5)} fill={C.amber} /></g>
        </>}

        {pose === 'grateful' && <>
          {/* 2 pink hearts floating on sides */}
          <g transform="translate(22, 95)">
            <path d="M0,-8 C-10,-14 -18,-4 0,8 C18,-4 10,-14 0,-8Z"
              fill={C.blush} stroke={C.brown} strokeWidth={1.5} />
          </g>
          <g transform="translate(178, 95)">
            <path d="M0,-8 C-10,-14 -18,-4 0,8 C18,-4 10,-14 0,-8Z"
              fill={C.blush} stroke={C.brown} strokeWidth={1.5} />
          </g>
        </>}

        {pose === 'dreamy' && <>
          {/* 3 sparkles around head */}
          <g transform="translate(64, 30)">
            <path d="M0,-7 L0,7 M-7,0 L7,0" stroke={C.amber} strokeWidth={2} strokeLinecap="round" />
            <path d="M-5,-5 L5,5 M-5,5 L5,-5" stroke={C.amber} strokeWidth={1} strokeLinecap="round" opacity={0.5} />
          </g>
          <g transform="translate(100, 16)">
            <path d="M0,-6 L0,6 M-6,0 L6,0" stroke={C.amber} strokeWidth={1.5} strokeLinecap="round" />
          </g>
          <g transform="translate(136, 30)">
            <path d="M0,-7 L0,7 M-7,0 L7,0" stroke={C.amber} strokeWidth={2} strokeLinecap="round" />
            <path d="M-5,-5 L5,5 M-5,5 L5,-5" stroke={C.amber} strokeWidth={1} strokeLinecap="round" opacity={0.5} />
          </g>
        </>}

        {pose === 'celebrating' && <>
          {/* 4 colorful confetti dots */}
          <circle cx={28}  cy={46} r={5}   fill={C.orange} />
          <circle cx={52}  cy={26} r={4}   fill={C.amber} />
          <circle cx={148} cy={26} r={4.5} fill="#22C55E" />
          <circle cx={172} cy={46} r={4}   fill="#7BB7E0" />
        </>}

      </g>
    </svg>
  )
}
