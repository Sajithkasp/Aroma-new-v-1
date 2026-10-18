// app/admin/dashboard/page.js - 57 TABLES FULL - CSV eken verify karala
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const ALL_TABLES = [
  // Group 1 - Store
    { name: 'Products', table: 'products', path: '/admin/products', icon: '🧴' },
      { name: 'Product Images', table: 'product_images', path: '/admin/product-images', icon: '🖼️' },
        { name: 'Variants', table: 'product_variants', path: '/admin/variants', icon: '📏' },
          { name: 'Product Types', table: 'product_types', path: '/admin/product-types', icon: '🏷️' },
            { name: 'Categories', table: 'categories', path: '/admin/categories', icon: '📁' },
              { name: 'Collections', table: 'collections', path: '/admin/collections', icon: '📦' },
                { name: 'Collection Products', table: 'collection_products', path: '/admin/collection-products', icon: '🔗' },
                  
                    // Group 2 - Sales
                      { name: 'Orders', table: 'orders', path: '/admin/orders', icon: '🛒' },
                        { name: 'Order Items', table: 'order_items', path: '/admin/order-items', icon: '🧾' },
                          { name: 'Carts', table: 'carts', path: '/admin/carts', icon: '🛍️' },
                            { name: 'Cart Items', table: 'cart_items', path: '/admin/cart-items', icon: '🛒' },
                              { name: 'Wishlists', table: 'wishlists', path: '/admin/wishlists', icon: '❤️' },
                                { name: 'Coupons', table: 'coupons', path: '/admin/coupons', icon: '🎟️' },
                                  { name: 'Payment Methods', table: 'payment_methods', path: '/admin/payments', icon: '💳' },
                                    { name: 'Delivery', table: 'delivery_settings', path: '/admin/delivery', icon: '🚚' },
                                      { name: 'Costs', table: 'costs', path: '/admin/costs', icon: '💵' },
                                        { name: 'Commissions', table: 'commissions', path: '/admin/commissions', icon: '💰' },
                                          
                                            // Group 3 - Customers
                                              { name: 'Customers', table: 'customers', path: '/admin/customers', icon: '👥' },
                                                { name: 'Customer Sessions', table: 'customer_sessions', path: '/admin/customer-sessions', icon: '👤' },
                                                  { name: 'Reviews', table: 'reviews', path: '/admin/reviews', icon: '⭐' },
                                                    { name: 'Testimonials', table: 'testimonials', path: '/admin/testimonials', icon: '💖' },
                                                      
                                                        // Group 4 - CMS Content
                                                          { name: 'Hero', table: 'hero_sections', path: '/admin/hero', icon: '🎨' },
                                                            { name: 'Announcement', table: 'announcement_bars', path: '/admin/announcement', icon: '📢' },
                                                              { name: 'Pages', table: 'pages', path: '/admin/pages', icon: '📄' },
                                                                { name: 'Page Sections', table: 'page_sections', path: '/admin/page-sections', icon: '🧱' },
                                                                  { name: 'Section Elements', table: 'section_elements', path: '/admin/section-elements', icon: '🧩' },
                                                                    { name: 'Blogs', table: 'blogs', path: '/admin/blogs', icon: '✍️' },
                                                                      { name: 'FAQs', table: 'faqs', path: '/admin/faqs', icon: '❓' },
                                                                        { name: 'Popups', table: 'popups', path: '/admin/popups', icon: '💬' },
                                                                          { name: 'Navigation Menus', table: 'navigation_menus', path: '/admin/navigation-menus', icon: '🧭' },
                                                                            { name: 'Nav Items', table: 'navigation_items', path: '/admin/navigation-items', icon: '🔗' },
                                                                              { name: 'Media', table: 'media', path: '/admin/media', icon: '📸' },
                                                                                { name: 'Media Library', table: 'media_library', path: '/admin/media-library', icon: '🖼️' },
                                                                                  { name: 'Global Components', table: 'global_components', path: '/admin/global-components', icon: '🌐' },
                                                                                    { name: 'Reusable Comp', table: 'reusable_components', path: '/admin/reusable', icon: '♻️' },
                                                                                      { name: 'Custom Code', table: 'custom_code', path: '/admin/custom-code', icon: '💻' },
                                                                                        { name: 'Redirects', table: 'redirects', path: '/admin/redirects', icon: '↪️' },
                                                                                          
                                                                                            // Group 5 - System & Settings
                                                                                              { name: 'Site Settings', table: 'site_settings', path: '/admin/site-settings', icon: '⚙️' },
                                                                                                { name: 'Theme', table: 'theme_settings', path: '/admin/theme', icon: '🎨' },
                                                                                                  { name: 'SEO', table: 'seo_settings', path: '/admin/seo', icon: '🔍' },
                                                                                                    { name: 'Analytics', table: 'analytics_settings', path: '/admin/analytics', icon: '📊' },
                                                                                                      { name: 'Feature Settings', table: 'feature_settings', path: '/admin/feature-settings', icon: '🚩' },
                                                                                                        { name: 'CMS Settings', table: 'cms_settings', path: '/admin/cms-settings', icon: '⚙️' },
                                                                                                          { name: 'Maintenance', table: 'maintenance_settings', path: '/admin/maintenance', icon: '🔧' },
                                                                                                            { name: 'Error Page', table: 'error_page_settings', path: '/admin/error-pages', icon: '⚠️' },
                                                                                                              { name: 'Social Links', table: 'social_links', path: '/admin/social', icon: '🔗' },
                                                                                                                
                                                                                                                  // Group 6 - Admin & Logs
                                                                                                                    { name: 'Admins', table: 'admins', path: '/admin/admins', icon: '👮' },
                                                                                                                      { name: 'Admin Sessions', table: 'admin_sessions', path: '/admin/admin-sessions', icon: '🔐' },
                                                                                                                        { name: 'Activity Feed', table: 'activity_feed', path: '/admin/activity', icon: '📡' },
                                                                                                                          { name: 'Audit Logs', table: 'audit_logs', path: '/admin/audit-logs', icon: '📝' },
                                                                                                                            { name: 'CMS Audit', table: 'cms_audit', path: '/admin/cms-audit', icon: '📋' },
                                                                                                                              { name: 'Error Logs', table: 'error_logs', path: '/admin/error-logs', icon: '❌' },
                                                                                                                                { name: 'Content Revisions', table: 'content_revisions', path: '/admin/revisions', icon: '📜' },
                                                                                                                                  
                                                                                                                                    // Group 7 - Bot
                                                                                                                                      { name: 'Bot Conversations', table: 'bot_conversations', path: '/admin/bot-conversations', icon: '🤖' },
                                                                                                                                        { name: 'Bot Knowledge', table: 'bot_knowledge', path: '/admin/bot-knowledge', icon: '🧠' },
                                                                                                                                          { name: 'Bot Messages', table: 'bot_messages', path: '/admin/bot-messages', icon: '💬' },
                                                                                                                                            { name: 'Bot Settings', table: 'bot_settings', path: '/admin/bot-settings', icon: '⚙️' },
                                                                                                                                            ]

                                                                                                                                            export default function AdminDashboard() {
                                                                                                                                              const [counts, setCounts] = useState({})
                                                                                                                                                const [loading, setLoading] = useState(true)

                                                                                                                                                  useEffect(() => {
                                                                                                                                                      async function load() {
                                                                                                                                                            const result = {}
                                                                                                                                                                  for (const item of ALL_TABLES) {
                                                                                                                                                                          try {
                                                                                                                                                                                    const { count } = await supabase.from(item.table).select('*', { count: 'exact', head: true })
                                                                                                                                                                                              result[item.table] = count || 0
                                                                                                                                                                                                      } catch { result[item.table] = 0 }
                                                                                                                                                                                                            }
                                                                                                                                                                                                                  setCounts(result)
                                                                                                                                                                                                                        setLoading(false)
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                load()
                                                                                                                                                                                                                                  }, [])

                                                                                                                                                                                                                                    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading 57 Tables...</div>

                                                                                                                                                                                                                                      return (
                                                                                                                                                                                                                                          <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8">
                                                                                                                                                                                                                                                <div className="max-w-[1800px] mx-auto">
                                                                                                                                                                                                                                                        <div className="flex justify-between gap-4 mb-8 bg-[#111] border border-gray-800 rounded-2xl p-6">
                                                                                                                                                                                                                                                                  <div>
                                                                                                                                                                                                                                                                              <h1 className="text-4xl font-black">AROMA <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">ADMIN</span> - 57 TABLES</h1>
                                                                                                                                                                                                                                                                                          <p className="text-gray-400 mt-1 text-sm">CSV eken verify karapu full project • {ALL_TABLES.length} tables</p>
                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                              <Link href="/" className="px-6 py-3 bg-white text-black rounded-full font-bold h-fit self-center">← Customer Home</Link>
                                                                                                                                                                                                                                                                                                                      </div>

                                                                                                                                                                                                                                                                                                                              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                                                                                                                                                                                                                                                                                                                                        {ALL_TABLES.map((item) => (
                                                                                                                                                                                                                                                                                                                                                    <Link key={item.table} href={item.path} className="bg-[#111] border border-gray-800 rounded-xl p-3 hover:border-green-500 transition">
                                                                                                                                                                                                                                                                                                                                                                  <div className="flex justify-between">
                                                                                                                                                                                                                                                                                                                                                                                  <span>{item.icon}</span>
                                                                                                                                                                                                                                                                                                                                                                                                  <span className="text-[9px] bg-black border border-gray-800 px-1.5 py-0.5 rounded-full text-green-400">{counts[item.table] ?? 0}</span>
                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                              <h3 className="font-semibold mt-2 text-[12px] leading-tight">{item.name}</h3>
                                                                                                                                                                                                                                                                                                                                                                                                                                            <p className="text-[8px] font-mono text-gray-600 truncate">{item.table}</p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                        </Link>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                  ))}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      )
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      