import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden bg-[#faf8f5] md:h-screen">
      <Image
        src="/images/hero-iced-latte.png"
        alt="Iced latte in soft morning light"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute bottom-8 left-8 md:bottom-16 md:left-16">
        <h1 className="font-serif text-[56px] font-medium leading-[0.9] tracking-[-0.03em] text-[#2f241c] md:text-[96px]">
          COFFEE
          <br />
          DAILY
        </h1>
        <span className="my-6 block h-0.5 w-12 bg-[#2f241c]" aria-hidden />
        <p className="max-w-[32ch] text-[15px] text-[#2f241c]">
          Your personal coffee companion in Paris.
        </p>
      </div>
    </section>
  );
}
