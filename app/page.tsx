import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Keunggulan } from "@/components/landing/keunggulan";
import { Armada } from "@/components/landing/armada";
import { Pembayaran } from "@/components/landing/pembayaran";
import { Kontak } from "@/components/landing/kontak";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Keunggulan />
      <Armada />
      <Pembayaran />
      <Kontak />
      <Footer />
    </main>
  );
};