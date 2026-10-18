'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Navbar() {
  const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

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
                                                                                                                            const currentUrl = 'https://bug-free-lamp-5ggqpg697qww2vwp4-3000.app.github.dev'; // <-- ඔයාගේ ලින්ක් එක
                                                                                                                                await supabase.auth.signInWithOAuth({
                                                                                                                                      provider: 'google',
                                                                                                                                            options: { redirectTo: currentUrl },
                                                                                                                                                })
                                                                                                                                                  }

                                                                                                                                                    const handleLogout = async () => {
                                                                                                                                                        await supabase.auth.signOut()
                                                                                                                                                            window.location.href = '/'
                                                                                                                                                              }

                                                                                                                                                                return (
                                                                                                                                                                    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md border-b border-gray-800">
                                                                                                                                                                          <Link href="/" className="text-xl font-bold text-green-500 tracking-wider">
                                                                                                                                                                                  AROMA
                                                                                                                                                                                        </Link>
                                                                                                                                                                                              
                                                                                                                                                                                                    <div className="flex gap-4 items-center">
                                                                                                                                                                                                            {loading ? (
                                                                                                                                                                                                                      <span className="text-sm text-gray-400">Checking...</span>
                                                                                                                                                                                                                              ) : user ? (
                                                                                                                                                                                                                                        <>
                                                                                                                                                                                                                                                    <span className="text-sm text-gray-300 hidden sm:block">{user.email}</span>
                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                            {user.email === 'sajith.kasp@gmail.com' && (
                                                                                                                                                                                                                                                                                          <Link href="/admin/dashboard" className="bg-blue-600 px-4 py-2 rounded text-sm hover:bg-blue-700 transition">
                                                                                                                                                                                                                                                                                                          Admin Panel
                                                                                                                                                                                                                                                                                                                        </Link>
                                                                                                                                                                                                                                                                                                                                    )}
                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                            <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded text-sm hover:bg-red-700 transition">
                                                                                                                                                                                                                                                                                                                                                                          Logout
                                                                                                                                                                                                                                                                                                                                                                                      </button>
                                                                                                                                                                                                                                                                                                                                                                                                </>
                                                                                                                                                                                                                                                                                                                                                                                                        ) : (
                                                                                                                                                                                                                                                                                                                                                                                                                  <button onClick={handleGoogleLogin} className="bg-white text-black px-4 py-2 rounded font-semibold text-sm hover:bg-gray-200 transition">
                                                                                                                                                                                                                                                                                                                                                                                                                              Sign in with Google
                                                                                                                                                                                                                                                                                                                                                                                                                                        </button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                          </nav>
                                                                                                                                                                                                                                                                                                                                                                                                                                                            )
                                                                                                                                                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                                                                                                                                                            