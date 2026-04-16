import { HomeContent } from "@/components/home-content";
import { prisma } from "@/lib/prisma";
import { formatBeanRecord } from "@/lib/utils";

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

  return <HomeContent catalog={catalog} />;
}
