export function HeroSection() {
  return (
    <section className="relative flex min-h-[560px] items-end overflow-hidden bg-[#faf8f5] bg-[url('/hero-iced-latte.png')] bg-contain bg-center bg-no-repeat p-8 sm:h-[68vh] sm:p-16">
      <div className="absolute inset-0 bg-gradient-to-br from-[#faf8f5]/60 via-[#faf8f5]/10 to-transparent" />
      <div className="relative z-10 flex flex-col items-start">
        <h1 className="font-serif text-[56px] font-normal leading-[0.9] tracking-[-0.03em] text-foreground sm:text-[88px]">
          COFFEE
          <br />
          DAILY
        </h1>
        <span className="my-6 h-px w-12 bg-foreground" aria-hidden />
        <p className="max-w-[30ch] text-sm text-muted">
          Your personal coffee companion in Paris.
        </p>
      </div>
    </section>
  );
}
