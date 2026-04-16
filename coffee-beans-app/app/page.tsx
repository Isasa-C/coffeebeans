import { BeanCardGrid } from "@/components/bean-card-grid";
import { BeanForm } from "@/components/bean-form";
import { prisma } from "@/lib/prisma";
import { formatBeanRecord } from "@/lib/utils";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let catalog: ReturnType<typeof formatBeanRecord>[] = [];

  try {
    const beans = await prisma.coffeeBean.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    catalog = beans.map(formatBeanRecord);
  } catch (error) {
    console.error("Failed to load coffee beans on the home page", error);
  }

  return (
    <main className="grain min-h-screen py-8 sm:py-12">
      <div className="page-shell animate-rise space-y-8">
        <section className="card-surface relative overflow-hidden rounded-[2rem] px-6 py-8 sm:px-10 sm:py-10">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-[#d89a6e]/25 via-transparent to-[#8f5734]/15" />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="space-y-6 pt-4 sm:pt-6 lg:pt-10">
              <span className="inline-flex rounded-full border border-[rgba(97,68,44,0.16)] bg-white/65 px-4 py-1 text-sm font-semibold tracking-[0.2em] text-accent uppercase">
                Personal Coffee Log
              </span>
              <div className="space-y-5">
                <h1 className="display-font max-w-2xl text-4xl leading-tight font-semibold text-accent sm:text-5xl">
                  Every coffee tells a story, keep yours organized.
                </h1>
              </div>
              <p className="max-w-2xl text-base leading-8 text-muted">
                Track your beans from purchase to taste, and know exactly which ones are worth buying again.
              </p>
              <div className="card-surface relative overflow-hidden rounded-[1.75rem]">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#4c2c17]/18 via-transparent to-[#d89a6e]/18" />
                <div className="relative aspect-[16/10]">
                  <Image
                    src="/hero-coffee.png"
                    alt="Coffee beans preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
            </div>
            <BeanForm />
          </div>
        </section>

        <section className="space-y-4">
          <BeanCardGrid beans={catalog} />
        </section>
      </div>
    </main>
  );
}
