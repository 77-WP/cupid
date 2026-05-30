import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Banner } from '../hooks/useBanners'
import { C } from './SharedUI'

interface BannerSliderProps {
  banners: Banner[]
  loading: boolean
}

function isExternal(url: string) {
  return url.startsWith('http://') || url.startsWith('https://')
}

function arrowBg(textColor: string) {
  const isWhite = textColor.toUpperCase() === '#FFFFFF' || textColor.toLowerCase() === 'white'
  return isWhite ? 'rgba(255,255,255,0.2)' : 'rgba(44,26,14,0.15)'
}

function labelColor(textColor: string) {
  const isWhite = textColor.toUpperCase() === '#FFFFFF' || textColor.toLowerCase() === 'white'
  return isWhite ? 'rgba(255,255,255,0.45)' : 'rgba(44,26,14,0.3)'
}

export default function BannerSlider({ banners, loading }: BannerSliderProps) {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const go = (i: number) => {
    setIndex(i)
    if (autoScrollRef.current) clearInterval(autoScrollRef.current)
    if (banners.length > 1) {
      autoScrollRef.current = setInterval(() => setIndex(p => (p + 1) % banners.length), 4000)
    }
  }

  useEffect(() => {
    setIndex(0)
    if (banners.length > 1) {
      autoScrollRef.current = setInterval(() => setIndex(p => (p + 1) % banners.length), 4000)
    }
    return () => { if (autoScrollRef.current) clearInterval(autoScrollRef.current) }
  }, [banners.length])

  const handleTap = (banner: Banner) => {
    if (!banner.link_url) return
    if (isExternal(banner.link_url)) window.open(banner.link_url, '_blank')
    else navigate(banner.link_url)
  }

  if (loading) {
    return (
      <div style={{
        height: 72, borderRadius: 16,
        background: 'rgba(44,26,14,0.07)',
        animation: 'pulse 1.5s ease-in-out infinite',
      }} />
    )
  }

  if (banners.length === 0) return null

  const banner = banners[Math.min(index, banners.length - 1)]

  return (
    <>
      <style>{`
        @keyframes bannerFade {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <div
        key={index}
        onClick={() => handleTap(banner)}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return
          const diff = touchStartX.current - e.changedTouches[0].clientX
          if (diff > 40) go((index + 1) % banners.length)
          else if (diff < -40) go((index - 1 + banners.length) % banners.length)
          touchStartX.current = null
        }}
        style={{
          height: 72, borderRadius: 16,
          background: banner.bg_color,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', cursor: banner.link_url ? 'pointer' : 'default',
          overflow: 'hidden', boxSizing: 'border-box',
          animation: 'bannerFade 0.3s ease-out',
        }}
      >
        <div>
          <span style={{
            fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 9,
            color: labelColor(banner.text_color), letterSpacing: '0.15em', display: 'block',
          }}>
            BEST PART
          </span>
          <div style={{
            fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15,
            color: banner.text_color, marginTop: 2,
          }}>
            {banner.emoji ? `${banner.title} ${banner.emoji}` : banner.title}
          </div>
        </div>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: arrowBg(banner.text_color),
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 16, color: banner.text_color }}>→</span>
        </div>
      </div>

      {banners.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 8 }}>
          {banners.map((_, i) => (
            <div
              key={i}
              onClick={() => go(i)}
              style={{
                height: 6, borderRadius: 3,
                width: i === index ? 18 : 6,
                background: i === index ? C.orange : 'rgba(44,26,14,0.18)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      )}
    </>
  )
}
