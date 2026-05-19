import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { supabase } from '../lib/supabase'

export default function LandingScreen() {
  const navigate = useNavigate()
  const [feedbackCount, setFeedbackCount] = useState<number | null>(null)
  const [activeTile, setActiveTile] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('cupid_feedback')
      .select('*', { count: 'exact', head: true })
      .then(({ count, error }) => {
        if (!error && count !== null) {
          setFeedbackCount(count)
        } else {
          setFeedbackCount(0)
        }
      })
  }, [])

  const handleTileTap = (tile: string, path: string) => {
    setActiveTile(tile)
    setTimeout(() => navigate(path), 200)
  }

  return (
    <MobileFrame>
      <style>{`
        @keyframes landingWobble {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes heartPulse {
          0%, 100% { transform: scale(1.0); }
          50% { transform: scale(1.15); }
        }
        @keyframes sunSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes boltFlicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .landing-mascot { animation: landingWobble 3s ease-in-out infinite; }
        .heart-pulse { animation: heartPulse 2s ease-in-out infinite; display: inline-block; }
        .sun-spin { animation: sunSpin 12s linear infinite; display: inline-block; }
        .bolt-flicker { animation: boltFlicker 1.5s ease-in-out infinite; display: inline-block; }
        .bottom-heart { animation: heartBeat 2s ease-in-out infinite; display: inline-block; }
        .mood-tile {
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .mood-tile:active {
          transform: scale(0.97) !important;
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>

        {/* ── TOP ZONE ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 16 }}>

          {/* Top bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#E8622A', fontSize: 14, lineHeight: 1 }}>♥</span>
              <span style={{
                fontFamily: 'Sarabun, sans-serif',
                fontSize: 12,
                fontWeight: 700,
                color: '#E8622A',
                letterSpacing: '1px',
              }}>
                BEST PART
              </span>
            </div>
            <span style={{
              fontFamily: 'Sarabun, sans-serif',
              fontSize: 11,
              color: 'rgba(44,26,14,0.35)',
              letterSpacing: '1px',
            }}>
              CUPID · V1
            </span>
          </div>

          {/* Mascot (60px, wobble) */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16, marginBottom: 12 }}>
            <div className="landing-mascot">
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                border: '2.5px solid #E8622A',
                background: '#FAF3E8',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 14px rgba(232,98,42,0.15)',
              }}>
                <div style={{
                  position: 'absolute',
                  top: 6,
                  left: 4,
                  right: 4,
                  height: 26,
                  background: '#2C1A0E',
                  borderRadius: '50% 50% 35% 35%',
                  opacity: 0.88,
                }} />
                <div style={{ position: 'absolute', top: 10, left: 13, width: 5, height: 3, borderRadius: 99, background: 'rgba(250,243,232,0.6)' }} />
                <div style={{ position: 'absolute', top: 15, left: 23, width: 4, height: 3, borderRadius: 99, background: 'rgba(250,243,232,0.5)' }} />
                <div style={{ position: 'absolute', top: 9, left: 34, width: 5, height: 3, borderRadius: 99, background: 'rgba(250,243,232,0.6)' }} />
              </div>
            </div>
          </div>

          {/* Question */}
          <div style={{ textAlign: 'center', marginBottom: 16, padding: '0 16px' }}>
            <div style={{
              fontFamily: 'Sarabun, sans-serif',
              fontSize: 22,
              fontWeight: 700,
              color: '#2C1A0E',
              marginBottom: 4,
            }}>
              วันนี้เป็นยังไงบ้างครับ?
            </div>
            <div style={{
              fontFamily: 'Sarabun, sans-serif',
              fontSize: 12,
              color: 'rgba(232,98,42,0.65)',
            }}>
              ใช้เวลา 30 วินาที
            </div>
          </div>

          {/* Mood tiles */}
          <div style={{ display: 'flex', gap: 10, padding: '0 16px' }}>

            {/* LOVE */}
            <div
              className="mood-tile"
              onClick={() => handleTileTap('love', '/happy')}
              style={{
                flex: 1,
                background: 'rgba(232,98,42,0.10)',
                border: '1.5px solid rgba(232,98,42,0.35)',
                borderRadius: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px 12px',
                cursor: 'pointer',
                gap: 8,
                transform: activeTile === 'love' ? 'scale(1.08)' : 'scale(1)',
              }}
            >
              <div className="heart-pulse" style={{ fontSize: 32, lineHeight: 1 }}>❤️</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 13, fontWeight: 700, color: '#2C1A0E' }}>ชอบมาก</div>
                <div style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 11, color: 'rgba(44,26,14,0.45)' }}>บอกต่อ</div>
              </div>
            </div>

            {/* OK */}
            <div
              className="mood-tile"
              onClick={() => handleTileTap('ok', '/neutral')}
              style={{
                flex: 1,
                background: 'rgba(245,166,35,0.10)',
                border: '1.5px solid rgba(245,166,35,0.35)',
                borderRadius: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px 12px',
                cursor: 'pointer',
                gap: 8,
                transform: activeTile === 'ok' ? 'scale(1.08)' : 'scale(1)',
              }}
            >
              <div className="sun-spin" style={{ fontSize: 32, lineHeight: 1 }}>☀️</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 13, fontWeight: 700, color: '#2C1A0E' }}>โอเค</div>
                <div style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 11, color: 'rgba(44,26,14,0.45)' }}>แสดงความคิด</div>
              </div>
            </div>

            {/* PROBLEM */}
            <div
              className="mood-tile"
              onClick={() => handleTileTap('problem', '/problem')}
              style={{
                flex: 1,
                background: 'rgba(220,80,60,0.08)',
                border: '1.5px solid rgba(220,80,60,0.3)',
                borderRadius: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px 12px',
                cursor: 'pointer',
                gap: 8,
                transform: activeTile === 'problem' ? 'scale(1.08)' : 'scale(1)',
              }}
            >
              <div className="bolt-flicker" style={{ fontSize: 32, lineHeight: 1 }}>⚡</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 13, fontWeight: 700, color: '#2C1A0E' }}>มีปัญหา</div>
                <div style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 11, color: 'rgba(44,26,14,0.45)' }}>แจ้งด่วน</div>
              </div>
            </div>

          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E8622A' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', border: '1.5px solid rgba(232,98,42,0.4)', background: 'transparent' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', border: '1.5px solid rgba(232,98,42,0.4)', background: 'transparent' }} />
          </div>

        </div>

        {/* ── BOTTOM STRIP ── */}
        <div style={{
          height: 65,
          flexShrink: 0,
          background: 'rgba(232,98,42,0.06)',
          borderTop: '1px solid rgba(232,98,42,0.15)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: 12,
        }}>
          {/* Avatar dot stack */}
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: '#E8622A',
              border: '2px solid white',
              position: 'relative', zIndex: 3,
            }} />
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: '#F5A623',
              border: '2px solid white',
              marginLeft: -8, position: 'relative', zIndex: 2,
            }} />
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: '#FAF3E8',
              border: '2px solid rgba(232,98,42,0.3)',
              marginLeft: -8, position: 'relative', zIndex: 1,
            }} />
          </div>

          {/* Count text */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'Sarabun, sans-serif',
              fontSize: 13,
              color: '#2C1A0E',
              lineHeight: 1.4,
            }}>
              {feedbackCount === null
                ? '...'
                : `${feedbackCount} คนให้กำลังใจทีมงานเราเดือนนี้ ❤️`
              }
            </div>
          </div>

          {/* Heart pulse icon */}
          <div className="bottom-heart" style={{ color: '#E8622A', fontSize: 18, flexShrink: 0 }}>
            ♥
          </div>
        </div>

      </div>
    </MobileFrame>
  )
}
