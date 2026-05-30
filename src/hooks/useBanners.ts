import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface Banner {
  id: string
  title: string
  subtitle: string | null
  link_url: string | null
  bg_color: string
  text_color: string
  emoji: string | null
  sort_order: number
}

export function useBanners(location: 'landing' | 'thanks') {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('cupid_banners')
      .select('id, title, subtitle, link_url, bg_color, text_color, emoji, sort_order')
      .eq('is_active', true)
      .contains('show_on', [location])
      .order('sort_order')
      .then(({ data }) => {
        if (data) setBanners(data as Banner[])
        setLoading(false)
      })
  }, [location])

  return { banners, loading }
}
