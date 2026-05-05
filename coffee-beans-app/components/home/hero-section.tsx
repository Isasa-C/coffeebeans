import Image from "next/image";

export function HeroSection() {
  return (
    <section className="overflow-hidden bg-[#faf8f5]">
      <div className="mx-auto grid w-full max-w-[1280px] overflow-hidden md:h-[56vh] md:min-h-[520px] md:grid-cols-[45%_55%]">
        <div className="flex flex-col justify-center px-8 py-12 md:px-16 md:py-16">
          <h1 className="font-serif text-[48px] font-normal leading-[0.9] tracking-[-0.03em] text-foreground md:text-[80px]">
            COFFEE
            <br />
            DAILY
          </h1>
          <span className="my-6 h-0.5 w-10 bg-accent" aria-hidden />
          <p className="max-w-[28ch] text-sm text-muted">
            Your personal coffee companion in Paris.
          </p>
        </div>

        <div className="relative h-[320px] overflow-hidden rounded-bl-[28px] md:h-full md:rounded-bl-[40px]">
          <Image
            src="/images/hero-iced-latte.png"
            alt="Iced latte in soft morning light"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
