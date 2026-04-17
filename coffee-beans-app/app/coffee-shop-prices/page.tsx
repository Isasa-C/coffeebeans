import { LanguageProvider } from "@/components/language-provider";
import { CoffeeShopPricesPage } from "@/components/coffee-shop-prices-page";

export default function CoffeeShopPricesRoute() {
  return (
    <LanguageProvider>
      <CoffeeShopPricesPage />
    </LanguageProvider>
  );
}
