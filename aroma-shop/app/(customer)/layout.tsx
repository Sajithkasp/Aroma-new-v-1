import Navbar from "../components/Navbar";

export default function CustomerLayout({
  children,
  }: {
    children: React.ReactNode;
    }) {
      return (
          <div className="min-h-screen bg-black">
                <Navbar />
                      <main>{children}</main>
                          </div>
                            );
                            }
                            