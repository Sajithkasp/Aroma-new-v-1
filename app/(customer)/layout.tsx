import Navbar from "../components/Navbar";
import { CartProvider } from "@/lib/cartContext";
import CartDrawer from "../components/CartDrawer";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-[#050505] text-white selection:bg-amber-400 selection:text-black">
        <Navbar />
        <main>{children}</main>
        <CartDrawer />
      </div>
    </CartProvider>
  );
}