import Hero from "@/components/hero/hero";
import { FadeIn } from "@/components/utils/page-reveal";

export default function Home() {
  return (
    <FadeIn className="max-w-6xl py-25">
      <Hero />
    </FadeIn>
  );
}
