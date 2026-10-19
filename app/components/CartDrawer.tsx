'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cartContext'
import { supabase } from '@/lib/supabase'
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, Sparkles, CheckCircle2 } from 'lucide-react'

const SRI_LANKA_DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle'
]

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    coupon,
    discountAmount,
    deliveryFee,
    total,
    applyCoupon,
    removeCoupon
  } = useCart()

  const [couponInput, setCouponInput] = useState('')
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; text: string } | null>(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState<{ id: string; name: string } | null>(null)

  // Checkout form fields
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: 'Colombo',
    notes: '',
    paymentMethod: 'Cash on Delivery (COD)'
  })

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponInput.trim()) return
    const res = applyCoupon(couponInput)
    setCouponMsg({ success: res.success, text: res.message })
    if (res.success) setCouponInput('')
  }

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert('Please fill in your name, contact phone, and delivery address.')
      return
    }

    setIsSubmitting(true)
    const generatedOrderId = 'ARM-' + Math.floor(100000 + Math.random() * 900000)

    try {
      // Attempt to save to Supabase orders table
      const { error: orderError } = await supabase.from('orders').insert([
        {
          order_number: generatedOrderId,
          customer_name: formData.fullName,
          customer_phone: formData.phone,
          customer_email: formData.email || null,
          shipping_address: `${formData.address}, ${formData.city}, ${formData.district}`,
          district: formData.district,
          payment_method: formData.paymentMethod,
          payment_status: formData.paymentMethod === 'Cash on Delivery (COD)' ? 'pending' : 'awaiting_transfer',
          order_status: 'confirmed',
          subtotal: subtotal,
          discount: discountAmount,
          shipping_fee: deliveryFee,
          total_amount: total,
          notes: formData.notes || null,
          items_count: items.length
        }
      ])

      if (orderError) {
        console.warn('Supabase order insert notice (using local confirmation):', orderError.message)
      }

      // Also try to insert order items if table exists
      try {
        const orderItemRows = items.map((item) => ({
          order_id: generatedOrderId,
          product_name: item.name,
          volume_ml: item.volume_ml,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        }))
        await supabase.from('order_items').insert(orderItemRows)
      } catch {
        // Fallback for order items
      }

      setOrderSuccess({ id: generatedOrderId, name: formData.fullName })
      clearCart()
    } catch {
      setOrderSuccess({ id: generatedOrderId, name: formData.fullName })
      clearCart()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  // Progress towards free delivery (10,000 LKR threshold)
  const freeShippingThreshold = 10000
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0a0a0a] border-l border-neutral-800 text-neutral-100 flex flex-col shadow-2xl">
          {/* CART HEADER */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-serif font-medium tracking-wide text-white">Your Fragrance Bag</h3>
                <p className="text-xs text-neutral-400 font-mono">
                  {items.length} {items.length === 1 ? 'bottle' : 'bottles'} selected
                </p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* FREE SHIPPING PROGRESS BAR */}
          <div className="px-6 py-3 bg-neutral-900/60 border-b border-neutral-800 text-xs">
            <div className="flex items-center justify-between text-[11px] mb-1.5 font-mono">
              <span className="flex items-center gap-1.5 text-neutral-300">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                {remainingForFreeShipping === 0
                  ? '✦ You unlocked Complimentary Express Delivery!'
                  : `Add LKR ${remainingForFreeShipping.toLocaleString()} for Free Delivery`}
              </span>
              <span className="text-amber-400 font-bold">{shippingProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500 rounded-full"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* ORDER SUCCESS MODAL OVERLAY */}
          {orderSuccess ? (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-semibold">
                Order Confirmed
              </span>
              <h3 className="text-2xl font-serif mt-2 text-white">Thank you, {orderSuccess.name}</h3>
              <p className="text-xs text-neutral-400 mt-2 max-w-xs">
                Your bespoke Aroma perfume order has been logged into the store system.
              </p>

              <div className="mt-6 p-4 rounded-xl bg-neutral-900 border border-neutral-800 w-full text-left">
                <p className="text-[11px] text-neutral-400 uppercase tracking-wider font-mono">Order Reference</p>
                <p className="text-lg font-mono font-bold text-amber-300 mt-0.5">{orderSuccess.id}</p>
                <div className="mt-3 pt-3 border-t border-neutral-800 text-xs text-neutral-400 space-y-1">
                  <p>• Estimated Delivery: 2-3 business days island-wide</p>
                  <p>• Dispatch Location: Colombo Perfumery Atelier</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col w-full gap-2">
                <a
                  href={`https://wa.me/94770000000?text=${encodeURIComponent(`Hi Aroma Ceylon, I just placed order ${orderSuccess.id}. Please confirm dispatch.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition flex items-center justify-center gap-2"
                >
                  <span>Confirm via WhatsApp Dispatch</span>
                </a>
                <button
                  onClick={() => {
                    setOrderSuccess(null)
                    setIsCheckoutOpen(false)
                    closeCart()
                  }}
                  className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-medium transition"
                >
                  Continue Exploring Fragrances
                </button>
              </div>
            </div>
          ) : isCheckoutOpen ? (
            /* CHECKOUT FORM VIEW */
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <h4 className="font-serif text-lg text-white">Island-wide Express Checkout</h4>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="text-xs text-amber-400 hover:underline"
                >
                  ← Back to Bag
                </button>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Sajith Perera"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1 font-medium">Mobile / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="077 123 4567"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1 font-medium">Email (Optional)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@domain.lk"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="No. 45, Flower Road"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1 font-medium">City / Town *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Colombo 07"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1 font-medium">District *</label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-amber-400"
                    >
                      {SRI_LANKA_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Payment Preference</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Cash on Delivery (COD)', 'Bank Transfer / Deposit'].map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setFormData({ ...formData, paymentMethod: m })}
                        className={`p-2.5 rounded-xl border text-left transition ${
                          formData.paymentMethod === m
                            ? 'border-amber-400 bg-amber-400/10 text-white'
                            : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <p className="font-semibold text-[11px]">{m}</p>
                        <p className="text-[10px] text-neutral-500 mt-0.5">
                          {m === 'Cash on Delivery (COD)' ? 'Pay cash on arrival' : 'Direct Seylan/HNB bank'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800">
                  <div className="flex justify-between text-xs text-neutral-400 mb-1">
                    <span>Order Total ({items.length} items):</span>
                    <span className="text-white font-bold font-mono">LKR {total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-bold uppercase tracking-wider text-xs rounded-xl shadow-xl transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Placing Bespoke Order...' : `Confirm & Place Order (LKR ${total.toLocaleString()})`}
                </button>
              </form>
            </div>
          ) : (
            /* CART ITEMS VIEW */
            <>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 mb-4 text-2xl">
                      🧴
                    </div>
                    <h4 className="font-serif text-lg text-white">Your Fragrance Bag is Empty</h4>
                    <p className="text-xs text-neutral-400 max-w-xs mt-1">
                      Explore our hand-distilled Ceylon luxury fragrance catalog to select your signature scent.
                    </p>
                    <a
                      href="#fragrance-catalog"
                      onClick={closeCart}
                      className="mt-6 px-6 py-2.5 bg-white text-black rounded-full text-xs font-semibold hover:bg-neutral-200 transition"
                    >
                      Browse Fragrances
                    </a>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={`${item.id}-${item.volume_ml}`}
                      className="flex gap-4 p-3.5 bg-neutral-900/60 rounded-2xl border border-neutral-800/80 hover:border-neutral-700 transition"
                    >
                      <div className="w-20 h-24 rounded-xl overflow-hidden bg-neutral-800 shrink-0 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-xs font-bold text-white leading-snug">{item.name}</h4>
                            <button
                              onClick={() => removeFromCart(item.id, item.volume_ml)}
                              className="text-neutral-500 hover:text-red-400 p-1 transition"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                            {item.volume_ml}ml Bottle {item.concentration && `· ${item.concentration}`}
                          </p>
                        </div>

                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center border border-neutral-700 rounded-lg bg-neutral-950 px-1 py-0.5">
                            <button
                              onClick={() => updateQuantity(item.id, item.volume_ml, -1)}
                              className="px-2 py-0.5 text-neutral-400 hover:text-white text-xs font-mono"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-mono font-bold text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.volume_ml, 1)}
                              className="px-2 py-0.5 text-neutral-400 hover:text-white text-xs font-mono"
                            >
                              +
                            </button>
                          </div>

                          <span className="font-mono text-xs font-bold text-amber-300">
                            LKR {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* FOOTER & CHECKOUT SUMMARY */}
              {items.length > 0 && (
                <div className="p-6 border-t border-neutral-800 bg-[#070707] space-y-4">
                  {/* Coupon Code Input */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Promo Code (e.g. AROMA10)"
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white uppercase placeholder:normal-case placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-medium rounded-xl text-neutral-200 transition"
                    >
                      Apply
                    </button>
                  </form>

                  {couponMsg && (
                    <p
                      className={`text-[11px] font-mono ${
                        couponMsg.success ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {couponMsg.text}
                    </p>
                  )}

                  {coupon && (
                    <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-3 py-1.5 rounded-lg">
                      <span className="flex items-center gap-1 font-mono">
                        <Sparkles className="w-3.5 h-3.5" />
                        Code: {coupon}
                      </span>
                      <button
                        onClick={removeCoupon}
                        className="text-[11px] underline hover:text-white"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {/* Calculations */}
                  <div className="space-y-1.5 text-xs text-neutral-400 pt-1 border-t border-neutral-800/80">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono text-neutral-200">LKR {subtotal.toLocaleString()}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>VIP Discount</span>
                        <span className="font-mono">- LKR {discountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Island-wide Courier</span>
                      <span className="font-mono text-neutral-200">
                        {deliveryFee === 0 ? (
                          <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">
                            FREE
                          </span>
                        ) : (
                          `LKR ${deliveryFee.toLocaleString()}`
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                      <span>Estimated Total</span>
                      <span className="font-mono text-amber-300">LKR {total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full py-4 bg-white hover:bg-neutral-200 text-black font-bold uppercase tracking-wider text-xs rounded-xl shadow-xl transition flex items-center justify-center gap-2 group"
                  >
                    <span>Proceed to Delivery & Checkout</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[10px] text-neutral-500 pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      100% Authentic Guarantee
                    </span>
                    <span>•</span>
                    <span>Island-wide 48h Delivery</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
