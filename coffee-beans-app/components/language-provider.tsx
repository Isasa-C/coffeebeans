"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type Language = "en" | "fr" | "ko";

const STORAGE_KEY = "coffee-beans-language";

const languageOptions: Array<{ code: Language; label: string }> = [
  { code: "en", label: "English" },
  { code: "fr", label: "Francais" },
  { code: "ko", label: "한국어" },
];

const translations = {
  en: {
    locale: "en-US",
    languageLabel: "Language",
    personalCoffeeLog: "Personal Coffee Log",
    heroTitle: "Every coffee tells a story, keep yours organized.",
    heroDescription:
      "Track your beans from purchase to taste, and know exactly which ones are worth buying again.",
    heroImageAlt: "Coffee beans preview",
    addBeanTitle: "Add a New Bean",
    addBeanDescription:
      "Save a coffee bean with its taste notes and buying details. Adding an image is optional.",
    imageHelp: "Optional image: JPG, PNG, or WEBP up to 4.5 MB.",
    saveBean: "Save bean",
    savingBean: "Saving bean...",
    beanSaved: "Coffee bean saved to your catalog.",
    networkSaveError: "Network error while saving the bean. Please try again.",
    genericSaveError: "Unable to save this bean.",
    catalog: "Catalog",
    savedBeans: "Saved beans",
    entriesShown: "entries shown",
    entryShown: "entry shown",
    filterByBrand: "Filter by brand",
    filterByBestFor: "Filter by best for",
    allBrands: "All brands",
    allTypes: "All types",
    noMatches: "No matches",
    noMatchesDescription: "Try a different brand or best-for filter to see more beans.",
    noBeansYet: "No beans yet",
    firstRoast: "Your first roast can go here.",
    emptyDescription:
      "Add your coffee details to start building a polished catalog. Images are optional.",
    brand: "Brand",
    brandPlaceholder: "Choose or type a brand",
    price: "Price (EUR)",
    quantity: "Qty",
    rating: "Rating",
    bestFor: "Best For",
    comments: "Comments",
    commentsPlaceholder: "Chocolate notes, citrus finish, excellent with espresso...",
    imageLabel: "Bean Image (optional)",
    editBean: "Edit bean",
    cancel: "Cancel",
    saveChanges: "Save changes",
    savingChanges: "Saving changes...",
    close: "Close",
    updateError: "Unable to update this bean.",
    updateNetworkError: "Network error while updating the bean. Please try again.",
    updatedMessage: "Coffee bean updated successfully.",
    deleteConfirm: "Are you sure you want to delete this coffee bean?",
    deleteError: "Unable to delete this bean.",
    deleteNetworkError: "Network error while deleting the bean. Please try again.",
    deletedMessage: "Coffee bean deleted successfully.",
    beanRemoved: "Bean removed",
    addedOn: "Added",
    priceLabel: "Price",
    quantityLabel: "Qty",
    bestForLabel: "Best for",
    noComments: "No tasting notes or comments added yet.",
    edit: "Edit",
    delete: "Delete",
    working: "Working...",
    bestForOptions: {
      Latte: "Latte",
      Espresso: "Espresso",
      Americano: "Americano",
    },
  },
  fr: {
    locale: "fr-FR",
    languageLabel: "Langue",
    personalCoffeeLog: "Journal de cafe personnel",
    heroTitle: "Chaque cafe raconte une histoire, gardez la votre bien organisee.",
    heroDescription:
      "Suivez vos grains de l'achat a la degustation et sachez exactement lesquels meritent d'etre rachetes.",
    heroImageAlt: "Apercu des grains de cafe",
    addBeanTitle: "Ajouter un nouveau cafe",
    addBeanDescription:
      "Enregistrez un cafe avec ses notes de gout et ses details d'achat. L'image est facultative.",
    imageHelp: "Image facultative : JPG, PNG ou WEBP jusqu'a 4,5 Mo.",
    saveBean: "Enregistrer",
    savingBean: "Enregistrement...",
    beanSaved: "Le cafe a ete ajoute a votre catalogue.",
    networkSaveError: "Erreur reseau pendant l'enregistrement. Veuillez reessayer.",
    genericSaveError: "Impossible d'enregistrer ce cafe.",
    catalog: "Catalogue",
    savedBeans: "Cafes enregistres",
    entriesShown: "elements affiches",
    entryShown: "element affiche",
    filterByBrand: "Filtrer par marque",
    filterByBestFor: "Filtrer par usage ideal",
    allBrands: "Toutes les marques",
    allTypes: "Tous les types",
    noMatches: "Aucun resultat",
    noMatchesDescription:
      "Essayez une autre marque ou un autre usage ideal pour voir plus de cafes.",
    noBeansYet: "Aucun cafe pour l'instant",
    firstRoast: "Votre premier cafe peut commencer ici.",
    emptyDescription:
      "Ajoutez les details de votre cafe pour commencer un catalogue elegant. Les images sont facultatives.",
    brand: "Marque",
    brandPlaceholder: "Choisissez ou saisissez une marque",
    price: "Prix (EUR)",
    quantity: "Qt",
    rating: "Note",
    bestFor: "Ideal pour",
    comments: "Commentaires",
    commentsPlaceholder: "Notes chocolat, finale agrumee, excellent pour l'espresso...",
    imageLabel: "Image du cafe (facultative)",
    editBean: "Modifier le cafe",
    cancel: "Annuler",
    saveChanges: "Enregistrer les modifications",
    savingChanges: "Enregistrement des modifications...",
    close: "Fermer",
    updateError: "Impossible de mettre a jour ce cafe.",
    updateNetworkError: "Erreur reseau pendant la mise a jour. Veuillez reessayer.",
    updatedMessage: "Le cafe a ete mis a jour avec succes.",
    deleteConfirm: "Voulez-vous vraiment supprimer ce cafe ?",
    deleteError: "Impossible de supprimer ce cafe.",
    deleteNetworkError: "Erreur reseau pendant la suppression. Veuillez reessayer.",
    deletedMessage: "Le cafe a ete supprime avec succes.",
    beanRemoved: "Cafe supprime",
    addedOn: "Ajoute le",
    priceLabel: "Prix",
    quantityLabel: "Qt",
    bestForLabel: "Ideal pour",
    noComments: "Aucune note de degustation ni commentaire pour le moment.",
    edit: "Modifier",
    delete: "Supprimer",
    working: "En cours...",
    bestForOptions: {
      Latte: "Latte",
      Espresso: "Espresso",
      Americano: "Americano",
    },
  },
  ko: {
    locale: "ko-KR",
    languageLabel: "언어",
    personalCoffeeLog: "개인 커피 로그",
    heroTitle: "모든 커피에는 이야기가 있습니다. 깔끔하게 정리해 보세요.",
    heroDescription:
      "구매부터 맛 기록까지 원두를 추적하고, 다시 사고 싶은 원두를 바로 확인하세요.",
    heroImageAlt: "커피 원두 미리보기",
    addBeanTitle: "새 원두 추가",
    addBeanDescription:
      "맛 노트와 구매 정보를 함께 저장하세요. 이미지는 선택 사항입니다.",
    imageHelp: "선택 이미지: JPG, PNG, WEBP, 최대 4.5MB.",
    saveBean: "원두 저장",
    savingBean: "저장 중...",
    beanSaved: "원두가 카탈로그에 저장되었습니다.",
    networkSaveError: "저장 중 네트워크 오류가 발생했습니다. 다시 시도해 주세요.",
    genericSaveError: "이 원두를 저장할 수 없습니다.",
    catalog: "카탈로그",
    savedBeans: "저장된 원두",
    entriesShown: "개 표시 중",
    entryShown: "개 표시 중",
    filterByBrand: "브랜드로 필터",
    filterByBestFor: "추천 용도로 필터",
    allBrands: "모든 브랜드",
    allTypes: "모든 종류",
    noMatches: "일치하는 항목 없음",
    noMatchesDescription: "다른 브랜드나 추천 용도를 선택해 더 많은 원두를 확인해 보세요.",
    noBeansYet: "아직 원두가 없습니다",
    firstRoast: "첫 번째 로스트를 여기에 기록할 수 있습니다.",
    emptyDescription:
      "커피 정보를 추가해 깔끔한 카탈로그를 시작하세요. 이미지는 선택 사항입니다.",
    brand: "브랜드",
    brandPlaceholder: "브랜드를 선택하거나 입력하세요",
    price: "가격 (EUR)",
    quantity: "수량",
    rating: "평점",
    bestFor: "추천 용도",
    comments: "코멘트",
    commentsPlaceholder: "초콜릿 노트, 시트러스 피니시, 에스프레소에 잘 어울림...",
    imageLabel: "원두 이미지 (선택)",
    editBean: "원두 수정",
    cancel: "취소",
    saveChanges: "변경 저장",
    savingChanges: "변경 저장 중...",
    close: "닫기",
    updateError: "이 원두를 수정할 수 없습니다.",
    updateNetworkError: "수정 중 네트워크 오류가 발생했습니다. 다시 시도해 주세요.",
    updatedMessage: "원두가 성공적으로 수정되었습니다.",
    deleteConfirm: "이 원두를 정말 삭제하시겠습니까?",
    deleteError: "이 원두를 삭제할 수 없습니다.",
    deleteNetworkError: "삭제 중 네트워크 오류가 발생했습니다. 다시 시도해 주세요.",
    deletedMessage: "원두가 성공적으로 삭제되었습니다.",
    beanRemoved: "원두 삭제됨",
    addedOn: "추가일",
    priceLabel: "가격",
    quantityLabel: "수량",
    bestForLabel: "추천 용도",
    noComments: "아직 시음 노트나 코멘트가 없습니다.",
    edit: "수정",
    delete: "삭제",
    working: "처리 중...",
    bestForOptions: {
      Latte: "라테",
      Espresso: "에스프레소",
      Americano: "아메리카노",
    },
  },
} satisfies Record<Language, Record<string, unknown>>;

type TranslationSet = (typeof translations)[Language];

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  messages: TranslationSet;
  languageOptions: typeof languageOptions;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") {
      return "en";
    }

    const storedLanguage = window.localStorage.getItem(STORAGE_KEY) as Language | null;

    if (storedLanguage && storedLanguage in translations) {
      return storedLanguage;
    }

    return "en";
  });

  function handleSetLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage);
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        messages: translations[language],
        languageOptions,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider.");
  }

  return context;
}
