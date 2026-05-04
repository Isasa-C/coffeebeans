import { useEffect, useState } from "react";

export type LocalUser = {
  name: string;
  email: string;
};

const STORAGE_KEY = "coffee-daily-user";

export function useLocalUser() {
  const [user, setUser] = useState<LocalUser | null>(null);

  useEffect(() => {
    try {
      const storedUser = window.localStorage.getItem(STORAGE_KEY);

      if (!storedUser) {
        return;
      }

      const parsedUser = JSON.parse(storedUser) as Partial<LocalUser>;

      if (parsedUser.name && parsedUser.email) {
        const storedName = parsedUser.name;
        const storedEmail = parsedUser.email;

        window.setTimeout(() => setUser({
          name: storedName,
          email: storedEmail,
        }), 0);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  function login(nextUser: LocalUser) {
    setUser(nextUser);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
  }

  function logout() {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return {
    user,
    login,
    logout,
  };
}
