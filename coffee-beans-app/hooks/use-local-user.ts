import { useState } from "react";

export type LocalUser = {
  name: string;
  email: string;
  bio?: string;
  favoriteDrink?: string;
};

export type FavoriteBean = {
  id: string;
  brand: string;
  roast: string;
  imageUrl?: string | null;
  price: number;
};

type LocalAccount = LocalUser & {
  password: string;
  favoriteBeans?: FavoriteBean[];
};

type AuthResult = {
  ok: boolean;
  error?: string;
};

const CURRENT_USER_KEY = "coffee-daily-current-user-email";
const ACCOUNTS_KEY = "coffee-daily-accounts";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function readAccounts() {
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) {
      return [] as LocalAccount[];
    }

    const parsed = JSON.parse(raw) as LocalAccount[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    window.localStorage.removeItem(ACCOUNTS_KEY);
    return [] as LocalAccount[];
  }
}

function writeAccounts(accounts: LocalAccount[]) {
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function useLocalUser() {
  const [user, setUser] = useState<LocalUser | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const currentEmail = window.localStorage.getItem(CURRENT_USER_KEY);
      if (!currentEmail) {
        return null;
      }

      const accounts = readAccounts();
      const existing = accounts.find((account) => account.email === normalizeEmail(currentEmail));
      if (!existing) {
        window.localStorage.removeItem(CURRENT_USER_KEY);
        return null;
      }

      return {
        name: existing.name,
        email: existing.email,
        bio: existing.bio || "",
        favoriteDrink: existing.favoriteDrink || "",
      };
    } catch {
      window.localStorage.removeItem(CURRENT_USER_KEY);
      return null;
    }
  });
  const [favoriteBeans, setFavoriteBeans] = useState<FavoriteBean[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const currentEmail = window.localStorage.getItem(CURRENT_USER_KEY);
    if (!currentEmail) {
      return [];
    }

    const accounts = readAccounts();
    const existing = accounts.find((account) => account.email === normalizeEmail(currentEmail));
    return existing?.favoriteBeans ?? [];
  });

  function signUp(payload: {
    name: string;
    email: string;
    password: string;
  }): AuthResult {
    const email = normalizeEmail(payload.email);
    const name = payload.name.trim();
    const password = payload.password;

    if (!name || !email || !password) {
      return { ok: false, error: "Please complete all fields." };
    }

    const accounts = readAccounts();
    if (accounts.some((account) => account.email === email)) {
      return { ok: false, error: "An account with this email already exists." };
    }

    const nextAccount: LocalAccount = {
      name,
      email,
      password,
      bio: "",
      favoriteDrink: "",
    };

    writeAccounts([...accounts, nextAccount]);
    window.localStorage.setItem(CURRENT_USER_KEY, email);
    setUser({
      name: nextAccount.name,
      email: nextAccount.email,
      bio: nextAccount.bio,
      favoriteDrink: nextAccount.favoriteDrink,
    });
    setFavoriteBeans(nextAccount.favoriteBeans ?? []);

    return { ok: true };
  }

  function signIn(payload: { email: string; password: string }): AuthResult {
    const email = normalizeEmail(payload.email);
    const password = payload.password;

    if (!email || !password) {
      return { ok: false, error: "Please enter your email and password." };
    }

    const accounts = readAccounts();
    const existing = accounts.find((account) => account.email === email);

    if (!existing || existing.password !== password) {
      return { ok: false, error: "Incorrect email or password." };
    }

    window.localStorage.setItem(CURRENT_USER_KEY, email);
    setUser({
      name: existing.name,
      email: existing.email,
      bio: existing.bio || "",
      favoriteDrink: existing.favoriteDrink || "",
    });
    setFavoriteBeans(existing.favoriteBeans ?? []);

    return { ok: true };
  }

  function updateProfile(patch: { name?: string; bio?: string; favoriteDrink?: string }): AuthResult {
    if (!user) {
      return { ok: false, error: "Please sign in first." };
    }

    const accounts = readAccounts();
    const accountIndex = accounts.findIndex((account) => account.email === user.email);
    if (accountIndex < 0) {
      return { ok: false, error: "Account not found." };
    }

    const nextName = patch.name?.trim() || accounts[accountIndex].name;
    const nextBio = (patch.bio ?? accounts[accountIndex].bio ?? "").trim();
    const nextFavoriteDrink = (patch.favoriteDrink ?? accounts[accountIndex].favoriteDrink ?? "").trim();

    const nextAccount: LocalAccount = {
      ...accounts[accountIndex],
      name: nextName,
      bio: nextBio,
      favoriteDrink: nextFavoriteDrink,
    };

    const nextAccounts = [...accounts];
    nextAccounts[accountIndex] = nextAccount;
    writeAccounts(nextAccounts);

    setUser({
      name: nextAccount.name,
      email: nextAccount.email,
      bio: nextAccount.bio,
      favoriteDrink: nextAccount.favoriteDrink,
    });

    return { ok: true };
  }

  function login(nextUser: LocalUser) {
    const existing = readAccounts().find((account) => account.email === normalizeEmail(nextUser.email));
    if (existing) {
      setUser({
        name: existing.name,
        email: existing.email,
        bio: existing.bio || "",
        favoriteDrink: existing.favoriteDrink || "",
      });
      window.localStorage.setItem(CURRENT_USER_KEY, existing.email);
      return;
    }

    signUp({
      name: nextUser.name,
      email: nextUser.email,
      password: "coffee-daily",
    });
  }

  function logout() {
    setUser(null);
    setFavoriteBeans([]);
    window.localStorage.removeItem(CURRENT_USER_KEY);
  }

  function saveFavoriteBean(bean: FavoriteBean): AuthResult {
    if (!user) {
      return { ok: false, error: "Please sign in first." };
    }

    const accounts = readAccounts();
    const accountIndex = accounts.findIndex((account) => account.email === user.email);
    if (accountIndex < 0) {
      return { ok: false, error: "Account not found." };
    }

    const currentFavorites = accounts[accountIndex].favoriteBeans ?? [];
    if (currentFavorites.some((item) => item.id === bean.id)) {
      return { ok: true };
    }

    const nextFavorites = [bean, ...currentFavorites];
    const nextAccounts = [...accounts];
    nextAccounts[accountIndex] = {
      ...nextAccounts[accountIndex],
      favoriteBeans: nextFavorites,
    };
    writeAccounts(nextAccounts);
    setFavoriteBeans(nextFavorites);
    return { ok: true };
  }

  function removeFavoriteBean(beanId: string): AuthResult {
    if (!user) {
      return { ok: false, error: "Please sign in first." };
    }

    const accounts = readAccounts();
    const accountIndex = accounts.findIndex((account) => account.email === user.email);
    if (accountIndex < 0) {
      return { ok: false, error: "Account not found." };
    }

    const nextFavorites = (accounts[accountIndex].favoriteBeans ?? []).filter((item) => item.id !== beanId);
    const nextAccounts = [...accounts];
    nextAccounts[accountIndex] = {
      ...nextAccounts[accountIndex],
      favoriteBeans: nextFavorites,
    };
    writeAccounts(nextAccounts);
    setFavoriteBeans(nextFavorites);
    return { ok: true };
  }

  return {
    user,
    login,
    signIn,
    signUp,
    updateProfile,
    favoriteBeans,
    saveFavoriteBean,
    removeFavoriteBean,
    logout,
  };
}
