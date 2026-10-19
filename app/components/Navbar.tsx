'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useCart } from '@/lib/cartContext'
import { ShoppingBag, Search, Sparkles, User, Shield, LogOut, X } from 'lucide-react'
import { ANNOUNCEMENT_MESSAGES, AROMA_FRAGRANCES, Fragrance } from '@/lib/aromaData'
import { useSiteConfig } from '@/lib/siteConfigStore'

export default function Navbar({ onSelectFragrance }: { onSelectFragrance?: (f: Fragrance) => void }) {
  const { config } = useSiteConfig()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [announcementIdx, setAnnouncementIdx] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { totalCount, openCart } = useCart()

  const announcements = config?.announcements?.messages && config.announcements.messages.length > 0
    ? config.announcements.messages
    : ANNOUNCEMENT_MESSAGES

  // Announcement rotator
  useEffect(() => {
    const speed = (config?.announcements?.speedSeconds || 5) * 1000
    const timer = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % announcements.length)
    }, speed)
    return () => clearInterval(timer)
  }, [announcements.length, config?.announcements?.speedSeconds])

  // Supabase Auth listener
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [])

  const handleGoogleLogin = async () => {
    try {
      const currentUrl = typeof window !== 'undefined' ? window.location.origin : ''
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: currentUrl }
      })
    } catch (e: any) {
      alert(`Login notice: ${e.message || 'Configure Google OAuth in Supabase dashboard'}`)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const filteredSearchFragrances = searchQuery.trim()
    ? AROMA_FRAGRANCES.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.fragrance_notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  return (
    <>
      {/* ANNOUNCEMENT BANNER */}
      {config?.announcements?.enabled !== false && announcements.length > 0 && (
        <div className="bg-[#0e0e0e] border-b border-neutral-800 text-[11px] font-mono tracking-widest text-neutral-300 py-2 px-4 text-center overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
            <span className="text-amber-400">✦</span>
            <p className="transition-opacity duration-500 animate-fade-in">
              {announcements[announcementIdx % announcements.length]}
            </p>
            <span className="text-amber-400">✦</span>
          </div>
        </div>
      )}

      {/* MAIN LUXURY NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b border-neutral-900 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* BRAND LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border border-amber-400/40 bg-gradient-to-br from-neutral-900 to-black flex items-center justify-center text-amber-300 font-serif font-black text-lg group-hover:border-amber-400 transition shadow-lg">
              {config?.brand?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <span className="text-2xl font-serif tracking-[0.2em] font-light text-white block group-hover:text-amber-300 transition">
                {config?.brand?.name || 'AROMA'}
              </span>
              <span className="text-[9px] font-mono tracking-[0.35em] text-neutral-400 uppercase block -mt-1">
                {config?.brand?.subtitle || 'FINE PERFUMERY · CEYLON'}
              </span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION LINKS */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-mono uppercase tracking-[0.2em] text-neutral-300">
            <a href="#fragrance-catalog" className="hover:text-amber-300 transition">
              Catalog
            </a>
            <a href="#fragrance-catalog" className="hover:text-amber-300 transition">
              Collections
            </a>
            <a href="#scent-finder" className="hover:text-amber-300 transition flex items-center gap-1.5 text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              Scent Matcher
            </a>
            <a href="#craftsmanship" className="hover:text-amber-300 transition">
              Craftsmanship
            </a>
            <a href="#testimonials" className="hover:text-amber-300 transition">
              Reviews
            </a>
          </nav>

          {/* ACTION BUTTONS & ADMIN TOGGLE */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition"
              aria-label="Search Fragrances"
              title="Search scents and notes"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-900 transition flex items-center gap-2 group"
              aria-label="Open Fragrance Bag"
            >
              <ShoppingBag className="w-4 h-4 group-hover:text-amber-300 transition" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-black font-mono font-bold text-[10px] flex items-center justify-center shadow-lg">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Admin Dashboard Access */}
            <Link
              href="/admin/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-neutral-900 border border-neutral-800 hover:border-amber-400/50 text-neutral-300 hover:text-white text-xs font-mono transition"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Panel (57 Tables)</span>
            </Link>

            {/* Auth / Account */}
            {loading ? (
              <span className="text-[11px] font-mono text-neutral-500">...</span>
            ) : user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
                <span className="text-xs font-mono text-neutral-400 hidden xl:inline max-w-[120px] truncate">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-neutral-400 hover:text-red-400 hover:bg-neutral-900 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black text-xs font-medium hover:bg-neutral-200 transition shadow"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* SEARCH MODAL */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-[#0c0c0c] border border-neutral-800 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setSearchOpen(false)
                setSearchQuery('')
              }}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
              <Search className="w-5 h-5 text-amber-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by scent note (e.g. oud, cinnamon, vanilla, ambergris)..."
                className="w-full bg-transparent text-white placeholder:text-neutral-500 text-sm focus:outline-none"
              />
            </div>

            {/* Search Results */}
            <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-3">
              {filteredSearchFragrances.length > 0 ? (
                filteredSearchFragrances.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => {
                      if (onSelectFragrance) onSelectFragrance(f)
                      setSearchOpen(false)
                    }}
                    className="flex gap-4 p-3 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-400/40 cursor-pointer transition"
                  >
                    <div className="w-14 h-18 rounded-xl overflow-hidden bg-neutral-800 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.image_url} alt={f.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{f.name}</h4>
                      <p className="text-xs text-neutral-400 font-mono mt-0.5">
                        {f.category} &bull; LKR {f.price.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">
                        {f.fragrance_notes}
                      </p>
                    </div>
                  </div>
                ))
              ) : searchQuery.trim() ? (
                <p className="text-xs text-neutral-400 py-6 text-center">
                  No fragrance found matching &quot;{searchQuery}&quot;. Try searching &apos;oud&apos;, &apos;spices&apos;, or &apos;vanilla&apos;.
                </p>
              ) : (
                <div className="py-6 text-xs text-neutral-400 space-y-2">
                  <p className="font-mono text-[11px] text-neutral-500 uppercase">Popular Olfactory Searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Ceylon Oud', 'Cinnamon Quills', 'Bourbon Vanilla', 'Ocean Driftwood', 'Extrait'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="px-3 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}