import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Collective } from "@/components/sections/Collective";
import { Services } from "@/components/sections/Services";
import { Lab } from "@/components/sections/Lab";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <About />
      <Collective />
      <Services />
      <Lab />
      <Contact />
    </main>
  );
}
