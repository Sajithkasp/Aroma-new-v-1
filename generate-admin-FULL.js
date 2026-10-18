// generate-admin-FULL.js - 57 TABLES FIXED - 100% Working
const fs = require('fs');
const path = require('path');

const TABLES = {
  'products': ['name','slug','description','price','compare_price','stock','sku','image_url','is_active','is_featured'],
    'product_images': ['product_id','image_url','alt_text','sort_order','is_primary'],
      'product_variants': ['product_id','name','value','price','stock'],
        'product_types': ['name','slug','description'],
          'categories': ['name','slug','description','image_url','is_active'],
            'collections': ['name','slug','description','image_url'],
              'collection_products': ['collection_id','product_id'],
                'orders': ['customer_email','total','status','shipping_address'],
                  'order_items': ['order_id','product_id','quantity','price'],
                    'carts': ['customer_id','status'],
                      'cart_items': ['cart_id','product_id','quantity'],
                        'wishlists': ['customer_id','product_id'],
                          'coupons': ['code','discount_type','discount_value','is_active'],
                            'payment_methods': ['name','is_active'],
                              'delivery_settings': ['name','cost','is_active'],
                                'costs': ['name','amount'],
                                  'commissions': ['name','amount'],
                                    'customers': ['email','full_name','phone'],
                                      'customer_sessions': ['customer_id','session_token'],
                                        'reviews': ['product_id','customer_name','rating','comment','is_approved'],
                                          'testimonials': ['name','role','content','image_url','rating'],
                                            'hero_sections': ['title','subtitle','description','image_url','cta_text','cta_link','is_active','sort_order'],
                                              'announcement_bars': ['message','is_active','background_color'],
                                                'pages': ['title','slug','content','is_published'],
                                                  'page_sections': ['page_id','title','type','sort_order'],
                                                    'section_elements': ['section_id','type','content'],
                                                      'blogs': ['title','slug','excerpt','content','image_url','is_published'],
                                                        'faqs': ['question','answer','sort_order','is_active'],
                                                          'popups': ['title','content','is_active'],
                                                            'navigation_menus': ['name','slug'],
                                                              'navigation_items': ['menu_id','label','url','sort_order'],
                                                                'media': ['name','url','type'],
                                                                  'media_library': ['name','url','alt_text'],
                                                                    'global_components': ['name','content'],
                                                                      'reusable_components': ['name','content'],
                                                                        'custom_code': ['name','code','location'],
                                                                          'redirects': ['from_url','to_url','status_code'],
                                                                            'site_settings': ['key','value'],
                                                                              'theme_settings': ['key','value'],
                                                                                'seo_settings': ['page','title','description','keywords'],
                                                                                  'analytics_settings': ['provider','tracking_id','is_active'],
                                                                                    'feature_settings': ['name','is_enabled'],
                                                                                      'cms_settings': ['key','value'],
                                                                                        'maintenance_settings': ['is_enabled','message'],
                                                                                          'error_page_settings': ['code','message'],
                                                                                            'social_links': ['platform','url','is_active'],
                                                                                              'admins': ['email','role','is_active'],
                                                                                                'admin_sessions': ['admin_id','token'],
                                                                                                  'activity_feed': ['action','description'],
                                                                                                    'audit_logs': ['action','user_id','details'],
                                                                                                      'cms_audit': ['action','details'],
                                                                                                        'error_logs': ['message','stack'],
                                                                                                          'content_revisions': ['content_id','content'],
                                                                                                            'bot_conversations': ['customer_id','status'],
                                                                                                              'bot_knowledge': ['question','answer','category'],
                                                                                                                'bot_messages': ['conversation_id','message','is_bot'],
                                                                                                                  'bot_settings': ['key','value'],
                                                                                                                  };

                                                                                                                  const SLUG_MAP = {
                                                                                                                    'hero_sections':'hero','announcement_bars':'announcement','product_images':'product-images','product_variants':'variants','product_types':'product-types','collection_products':'collection-products','order_items':'order-items','cart_items':'cart-items','payment_methods':'payments','delivery_settings':'delivery','customer_sessions':'customer-sessions','page_sections':'page-sections','section_elements':'section-elements','navigation_menus':'navigation-menus','navigation_items':'navigation-items','media_library':'media-library','global_components':'global-components','reusable_components':'reusable','custom_code':'custom-code','site_settings':'site-settings','theme_settings':'theme','seo_settings':'seo','analytics_settings':'analytics','feature_settings':'feature-settings','cms_settings':'cms-settings','maintenance_settings':'maintenance','error_page_settings':'error-pages','social_links':'social','admin_sessions':'admin-sessions','activity_feed':'activity','audit_logs':'audit-logs','cms_audit':'cms-audit','error_logs':'error-logs','content_revisions':'revisions','bot_conversations':'bot-conversations','bot_knowledge':'bot-knowledge','bot_messages':'bot-messages','bot_settings':'bot-settings'
                                                                                                                    };

                                                                                                                    function makePage(table, fields) {
                                                                                                                      let inputs = fields.map(k => {
                                                                                                                          if(['description','content','answer','message','details','stack','excerpt'].includes(k)) {
                                                                                                                                return `        <textarea value={form.${k}||''} onChange={e=>setForm({...form, ${k}: e.target.value})} placeholder="${k}" rows={3} className="bg-black border border-gray-700 rounded-xl p-3 text-sm md:col-span-2" />`;
                                                                                                                                    }
                                                                                                                                        if(k.startsWith('is_')) {
                                                                                                                                              return `        <label className="flex items-center gap-2 bg-black border border-gray-700 rounded-xl p-3 text-sm"><input type="checkbox" checked={!!form.${k}} onChange={e=>setForm({...form, ${k}: e.target.checked})} /> ${k}</label>`;
                                                                                                                                                  }
                                                                                                                                                      if(['price','total','amount','quantity','stock','rating','sort_order','cost','discount_value','status_code'].includes(k)) {
                                                                                                                                                            return `        <input value={form.${k}||''} onChange={e=>setForm({...form, ${k}: e.target.value})} placeholder="${k}" type="number" className="bg-black border border-gray-700 rounded-xl p-3 text-sm" />`;
                                                                                                                                                                }
                                                                                                                                                                    return `        <input value={form.${k}||''} onChange={e=>setForm({...form, ${k}: e.target.value})} placeholder="${k}" className="bg-black border border-gray-700 rounded-xl p-3 text-sm" />`;
                                                                                                                                                                      }).join('\n');

                                                                                                                                                                        return `'use client'
                                                                                                                                                                        import { useEffect, useState } from 'react'
                                                                                                                                                                        import { supabase } from '@/lib/supabase'
                                                                                                                                                                        import Link from 'next/link'
                                                                                                                                                                        export default function Page(){
                                                                                                                                                                          const [rows,setRows]=useState([]);const [loading,setLoading]=useState(true);const [form,setForm]=useState({});const [editing,setEditing]=useState(null);
                                                                                                                                                                            useEffect(()=>{load()},[]);
                                                                                                                                                                              async function load(){setLoading(true);const {data}=await supabase.from('${table}').select('*').order('created_at',{ascending:false}).limit(100);setRows(data||[]);setLoading(false);}
                                                                                                                                                                                async function save(e){e.preventDefault();if(editing){await supabase.from('${table}').update(form).eq('id',editing);setEditing(null);}else{await supabase.from('${table}').insert([form]);}setForm({});load();}
                                                                                                                                                                                  async function del(id){if(!confirm('Delete?'))return;await supabase.from('${table}').delete().eq('id',id);load();}
                                                                                                                                                                                    if(loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading ${table}...</div>;
                                                                                                                                                                                      return (<div className="min-h-screen bg-[#050505] text-white p-4 md:p-8"><div className="max-w-6xl mx-auto">
                                                                                                                                                                                          <div className="flex justify-between items-center mb-6 bg-[#111] border border-gray-800 rounded-2xl p-6"><div><h1 className="text-2xl font-bold">${table}</h1><p className="text-xs text-gray-400">{rows.length} rows - Table: ${table}</p></div><div className="flex gap-2"><Link href="/admin/dashboard" className="px-4 py-2 bg-gray-800 rounded-full text-xs">Dashboard</Link><Link href="/" className="px-4 py-2 bg-white text-black rounded-full text-xs font-bold">Home</Link></div></div>
                                                                                                                                                                                              <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 mb-6"><h2 className="font-bold mb-4 text-sm">{editing?'Edit':'Add'} ${table}</h2><form onSubmit={save} className="grid md:grid-cols-2 gap-3">
                                                                                                                                                                                              ${inputs}
                                                                                                                                                                                                      <div className="md:col-span-2 flex gap-2"><button className="px-6 py-2.5 bg-green-600 rounded-full text-xs font-bold">{editing?'Update':'Add'}</button>{editing&&<button type="button" onClick={()=>{setEditing(null);setForm({})}} className="px-6 py-2.5 bg-gray-800 rounded-full text-xs">Cancel</button>}</div>
                                                                                                                                                                                                          </form></div>
                                                                                                                                                                                                              <div className="grid md:grid-cols-3 gap-3">{rows.map(r=><div key={r.id} className="bg-[#111] border border-gray-800 rounded-xl p-4"><p className="font-mono text-[11px] truncate">{r.name||r.title||r.email||r.code||Object.values(r)[1]||r.id}</p><p className="text-[10px] text-gray-500 mt-1 truncate">{JSON.stringify(r).slice(0,100)}</p><div className="flex gap-2 mt-3"><button onClick={()=>{setEditing(r.id);setForm(r);window.scrollTo(0,0)}} className="px-3 py-1 bg-white text-black rounded-full text-[10px]">Edit</button><button onClick={()=>del(r.id)} className="px-3 py-1 bg-red-900 rounded-full text-[10px]">Del</button></div></div>)}</div>
                                                                                                                                                                                                                </div></div>)
                                                                                                                                                                                                                }
                                                                                                                                                                                                                `;
                                                                                                                                                                                                                }

                                                                                                                                                                                                                const base = path.join(__dirname, 'aroma-shop','app','admin','dashboard');
                                                                                                                                                                                                                Object.keys(TABLES).forEach(table => {
                                                                                                                                                                                                                  const slug = SLUG_MAP[table] || table;
                                                                                                                                                                                                                    const dir = path.join(base, slug);
                                                                                                                                                                                                                      if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive:true});
                                                                                                                                                                                                                        fs.writeFileSync(path.join(dir,'page.js'), makePage(table, TABLES[table]));
                                                                                                                                                                                                                          console.log('✅ FULL', table, '->', slug);
                                                                                                                                                                                                                          });
                                                                                                                                                                                                                          console.log('🔥 57 TABLES FULL CUSTOMIZE DONE! 57ma hadala iwarai!');
                                                                                                                                                                                                                          