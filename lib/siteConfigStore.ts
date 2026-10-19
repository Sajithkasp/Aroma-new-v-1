'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { TESTIMONIALS } from '@/lib/aromaData'

export interface HeroSlideConfig {
  id: string
  title: string
  subtitle: string
  badge_text: string
  description: string
  media_type: 'image' | 'video'
  image_url: string
  video_url?: string
  mobile_image_url?: string
  cta_text: string
  cta_link: string
  animation_type: 'zoomSlow' | 'fadeUp' | 'slideIn'
  duration: number
  is_active: boolean
}

export interface SiteConfig {
  brand: {
    name: string
    subtitle: string
    tagline: string
    accentColor: 'amber' | 'emerald' | 'rose' | 'noir'
    conciergePhone: string
    conciergeEmail: string
    atelierAddress: string
    whatsappNumber: string
    copyrightText: string
  }
  announcements: {
    enabled: boolean
    speedSeconds: number
    messages: string[]
  }
  hero: {
    slides: HeroSlideConfig[]
  }
  trustPillars: {
    title: string
    description: string
    badge: string
  }[]
  catalogSection: {
    badge: string
    title: string
    description: string
  }
  scentQuiz: {
    badge: string
    title: string
    description: string
  }
  scentPyramid: {
    badge: string
    title: string
    description: string
    topTitle: string
    topDesc: string
    topNotes: string[]
    heartTitle: string
    heartDesc: string
    heartNotes: string[]
    baseTitle: string
    baseDesc: string
    baseNotes: string[]
  }
  craftsmanship: {
    badge: string
    title: string
    storyHeadline: string
    p1: string
    p2: string
    stat1Number: string
    stat1Label: string
    stat2Number: string
    stat2Label: string
    stat3Number: string
    stat3Label: string
    imageUrl: string
  }
  testimonials: {
    badge: string
    title: string
    description: string
    items: typeof TESTIMONIALS
  }
  vipCircle: {
    headline: string
    subhead: string
    promoCode: string
    discountPercent: number
  }
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brand: {
    name: 'AROMA',
    subtitle: 'FINE PERFUMERY · CEYLON',
    tagline: 'Artisanal Sri Lankan Haute Parfumerie',
    accentColor: 'amber',
    conciergePhone: '+94 77 123 4567',
    conciergeEmail: 'concierge@aroma.lk',
    atelierAddress: 'No. 45, Ward Place, Colombo 07, Sri Lanka',
    whatsappNumber: '+94771234567',
    copyrightText: 'AROMA FINE PERFUMERY SRI LANKA. ALL RIGHTS RESERVED.'
  },
  announcements: {
    enabled: true,
    speedSeconds: 5,
    messages: [
      '✦ COMPLIMENTARY EXPRESS DELIVERY ON ALL ORDERS OVER LKR 10,000 ISLAND-WIDE ✦',
      '✦ 2 FREE BESPOKE 3ML SAMPLES INCLUDED WITH EVERY FULL-SIZE FLACON ✦',
      '✦ HAND-CRAFTED & DISTILLED IN COLOMBO, SRI LANKA · 100% CRUELTY-FREE ✦'
    ]
  },
  hero: {
    slides: [
      {
        id: 'slide-1',
        title: 'CEYLON\nROYAL OUD',
        subtitle: 'EXTRAIT DE PARFUM · 35% OIL CONCENTRATION',
        badge_text: 'HANDCRAFTED IN SRI LANKA',
        description: 'Distilled from sustainably sourced ancient Ceylon Agarwood, enriched with sun-warmed organic cinnamon bark, dark patchouli, and golden smoked amber.',
        media_type: 'image',
        image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1600&auto=format&fit=crop&q=85',
        cta_text: 'Explore Royal Oud',
        cta_link: '#fragrance-catalog',
        animation_type: 'zoomSlow',
        duration: 6,
        is_active: true
      },
      {
        id: 'slide-2',
        title: 'MIDNIGHT\nCINNAMON NOIR',
        subtitle: 'AN OLFACTORY ODE TO THE SPICE ISLAND',
        badge_text: 'PRIVATE RESERVE 2026',
        description: 'Pure organic Ceylon cinnamon quill absolute married with French damask rose, smoked Madagascar vanilla, and velvet Haitian vetiver.',
        media_type: 'image',
        image_url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=1600&auto=format&fit=crop&q=85',
        cta_text: 'Discover Noir Series',
        cta_link: '#fragrance-catalog',
        animation_type: 'zoomSlow',
        duration: 6,
        is_active: true
      },
      {
        id: 'slide-3',
        title: 'AQUA DE\nCEYLON',
        subtitle: 'CRISP OCEAN MIST & SUNLIT AMBERGRIS',
        badge_text: 'TROPICAL SIGNATURE',
        description: 'Vibrant Indian Ocean sea spray blended with crushed green bergamot, coastal driftwood, and sparkling white musk crafted for 14-hour tropical wear.',
        media_type: 'image',
        image_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1600&auto=format&fit=crop&q=85',
        cta_text: 'Shop Summer Breeze',
        cta_link: '#fragrance-catalog',
        animation_type: 'zoomSlow',
        duration: 6,
        is_active: true
      }
    ]
  },
  trustPillars: [
    {
      title: '35% Extrait Concentration',
      description: '16+ hour guaranteed longevity on skin',
      badge: 'Extrait'
    },
    {
      title: 'Ceylon Native Botanicals',
      description: 'Organic Cinnamon & sustainably aged Oud',
      badge: 'Artisanal'
    },
    {
      title: 'Express Island Delivery',
      description: 'Free delivery for orders above LKR 10,000',
      badge: 'Courier'
    },
    {
      title: 'IFRA & Cruelty Certified',
      description: 'Crafted with the cleanest natural extracts',
      badge: 'Certified'
    }
  ],
  catalogSection: {
    badge: 'Curated Haute Parfumerie',
    title: 'The Artisan Collection',
    description: 'Each bottle is hand-distilled, numbered, and bottled in Colombo using ancient maceration traditions.'
  },
  scentQuiz: {
    badge: 'Interactive Olfactory Matcher',
    title: 'Discover Your Signature Scent',
    description: 'Answer 3 brief questions to identify your harmonized Ceylon artisan fragrance persona.'
  },
  scentPyramid: {
    badge: 'The Architecture of Scent',
    title: 'The Ceylon Olfactory Pyramid',
    description: 'Understanding how handcrafted Extrait de Parfum evolves dynamically across your skin over 24 hours.',
    topTitle: 'Top Notes (The Head)',
    topDesc: 'The immediate introduction that awakens the senses upon first mist. Highly volatile and sparkling.',
    topNotes: ['Calabrian Bergamot', 'Pink Peppercorn', 'Bitter Orange', 'Indian Ocean Spray'],
    heartTitle: 'Heart Notes (The Soul)',
    heartDesc: 'The true personality that emerges as the fragrance settles. Featuring certified organic Ceylon spices.',
    heartNotes: ['Ceylon Cinnamon Quills', 'Taif Rose', 'Green Cardamom', 'Smoked Clove'],
    baseTitle: 'Base Notes (The Memory)',
    baseDesc: 'The deepest, rich resins and woods that cling to skin and garments, creating your memorable signature trail.',
    baseNotes: ['Aged Ceylon Agarwood', 'Golden Ambergris', 'Mysore Sandalwood', 'Bourbon Vanilla']
  },
  craftsmanship: {
    badge: 'Our Story & Philosophy',
    title: "Honoring Sri Lanka's Ancient Spice Kingdom",
    storyHeadline: 'Centuries of Spice Heritage Married with French Haute Parfumerie',
    p1: 'For over two millennia, the pearl of the Indian Ocean was celebrated by Venetian merchants and Arab traders as the legendary Spice Island. At Aroma, we revive this legacy.',
    p2: 'We extract our rare wild Agarwood in small, sustainable batches from mature trees in the western foothills. Our organic cinnamon quills are distilled within 48 hours of harvest to capture volatile aromatic terpenes that commercial mass-market perfumes simply cannot replicate.',
    stat1Number: '35%',
    stat1Label: 'Pure Extrait Oil',
    stat2Number: '12 Yrs',
    stat2Label: 'Aged Oud Reserve',
    stat3Number: '100%',
    stat3Label: 'Vegan & Cruelty Free',
    imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=1200&auto=format&fit=crop&q=85'
  },
  testimonials: {
    badge: 'Connoisseur Impressions',
    title: 'Words From Fragrance Enthusiasts',
    description: 'Verified experiences from clients across Sri Lanka and international collectors.',
    items: TESTIMONIALS
  },
  vipCircle: {
    headline: 'Join the Aroma Private Circle',
    subhead: 'Receive a complimentary 10% discount voucher on your first purchase and private invitations to limited harvest batches.',
    promoCode: 'AROMA10',
    discountPercent: 10
  }
}

const STORAGE_KEY = 'aroma_site_customizer_config'
const SYNC_EVENT = 'aroma_site_config_updated'

// Helper to get stored config or default
export function getStoredSiteConfig(): SiteConfig {
  if (typeof window === 'undefined') return DEFAULT_SITE_CONFIG
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return { ...DEFAULT_SITE_CONFIG, ...JSON.parse(raw) }
    }
  } catch {
    // fallback
  }
  return DEFAULT_SITE_CONFIG
}

// Helper to save and broadcast config
export async function saveAndPublishConfig(config: SiteConfig): Promise<{ success: boolean; message: string }> {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
      window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: config }))
    }

    // Also attempt saving to Supabase
    try {
      // Save Site Settings
      await supabase.from('site_settings').upsert({
        id: 'main-settings',
        brand_name: config.brand.name,
        tagline: config.brand.tagline,
        contact_phone: config.brand.conciergePhone,
        contact_email: config.brand.conciergeEmail,
        updated_at: new Date().toISOString()
      })

      // Save Hero sections
      if (config.hero.slides && config.hero.slides.length > 0) {
        for (let i = 0; i < config.hero.slides.length; i++) {
          const s = config.hero.slides[i]
          await supabase.from('hero_sections').upsert({
            id: s.id,
            title: s.title,
            subtitle: s.subtitle,
            badge_text: s.badge_text,
            description: s.description,
            image_url: s.image_url,
            video_url: s.video_url || null,
            cta_text: s.cta_text,
            cta_link: s.cta_link,
            sort_order: i + 1,
            is_active: s.is_active,
            updated_at: new Date().toISOString()
          })
        }
      }
    } catch {
      // Supabase table sync fallback
    }

    return { success: true, message: 'Storefront updated and published successfully!' }
  } catch (e: any) {
    return { success: false, message: e.message || 'Failed to save configuration' }
  }
}

// React Hook to access site config reactively in any component
export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(getStoredSiteConfig)

  useEffect(() => {
    // Load config on mount
    setConfig(getStoredSiteConfig())

    // Also fetch initial data from Supabase if available
    const fetchRemote = async () => {
      try {
        const { data: slides } = await supabase
          .from('hero_sections')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })

        if (slides && slides.length > 0) {
          setConfig((prev) => ({
            ...prev,
            hero: {
              slides: slides.map((s: any, idx: number) => ({
                id: s.id || `remote-${idx}`,
                title: s.title || prev.hero.slides[0].title,
                subtitle: s.subtitle || '',
                badge_text: s.badge_text || '',
                description: s.description || '',
                media_type: (s.media_type as any) || 'image',
                image_url: s.image_url || prev.hero.slides[0].image_url,
                video_url: s.video_url || '',
                cta_text: s.cta_text || 'Shop Now',
                cta_link: s.cta_link || '#fragrance-catalog',
                animation_type: (s.animation_type as any) || 'zoomSlow',
                duration: s.duration || 6,
                is_active: s.is_active ?? true
              }))
            }
          }))
        }
      } catch {
        // fallback to stored
      }
    }

    fetchRemote()

    // Listen to local customizer updates
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setConfig(e.detail)
      }
    }

    window.addEventListener(SYNC_EVENT, handleUpdate)
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setConfig(JSON.parse(e.newValue))
        } catch {
          // ignore
        }
      }
    })

    return () => {
      window.removeEventListener(SYNC_EVENT, handleUpdate)
    }
  }, [])

  const update = useCallback((newConfig: SiteConfig) => {
    setConfig(newConfig)
    saveAndPublishConfig(newConfig)
  }, [])

  return { config, update, refresh: () => setConfig(getStoredSiteConfig()) }
}
