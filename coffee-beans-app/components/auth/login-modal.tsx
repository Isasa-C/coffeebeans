import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { LocalUser } from "@/hooks/use-local-user";

interface LoginModalProps {
  isOpen: boolean;
  user: LocalUser | null;
  onClose: () => void;
  onSignIn: (payload: { email: string; password: string }) => { ok: boolean; error?: string };
  onSignUp: (payload: { name: string; email: string; password: string }) => { ok: boolean; error?: string };
  onLogout: () => void;
}

type AuthMode = "signin" | "signup";

export function LoginModal({
  isOpen,
  user,
  onClose,
  onSignIn,
  onSignUp,
  onLogout,
}: LoginModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  const title = useMemo(() => {
    if (user) {
      return "Your account";
    }

    return mode === "signup" ? "Sign up" : "Sign in";
  }, [mode, user]);

  if (!isOpen) {
    return null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (mode === "signup") {
      const result = onSignUp({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (!result.ok) {
        setErrorMessage(result.error || "Unable to sign up right now.");
        return;
      }

      onClose();
      return;
    }

    const result = onSignIn({
      email: email.trim(),
      password,
    });

    if (!result.ok) {
      setErrorMessage(result.error || "Unable to sign in right now.");
      return;
    }

    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(47,36,28,0.38)] px-4 py-8"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-[0_24px_80px_rgba(76,44,23,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9b7b62]">
              Account
            </div>
            <h2 id="login-modal-title" className="font-serif text-3xl font-normal">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close login"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition hover:text-foreground"
          >
            ×
          </button>
        </div>

        {user ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-line bg-[#faf8f5] p-5">
              <p className="font-serif text-2xl">{user.name}</p>
              <p className="mt-1 text-sm text-muted">{user.email}</p>
              {user.favoriteDrink ? (
                <p className="mt-2 text-sm text-[#735d4d]">Favorite: {user.favoriteDrink}</p>
              ) : null}
            </div>
            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push("/profile");
                }}
                className="flex-1 rounded-full border border-line bg-white px-4 py-3 text-sm font-medium text-foreground transition hover:bg-[#f5efe5]"
              >
                Personal page
              </button>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex-1 rounded-full bg-accent px-4 py-3 text-sm font-medium text-white transition hover:bg-accent-strong"
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-2 rounded-full bg-[#f5efe5] p-1">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`rounded-full px-3 py-2 text-sm font-medium ${
                  mode === "signin" ? "bg-white text-foreground shadow-sm" : "text-[#735d4d]"
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`rounded-full px-3 py-2 text-sm font-medium ${
                  mode === "signup" ? "bg-white text-foreground shadow-sm" : "text-[#735d4d]"
                }`}
              >
                Sign up
              </button>
            </div>

            {mode === "signup" ? (
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="loginName">
                  Name
                </label>
                <input
                  id="loginName"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </div>
            ) : null}

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="loginEmail">
                Email
              </label>
              <input
                id="loginEmail"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="loginPassword">
                Password
              </label>
              <input
                id="loginPassword"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
                placeholder="At least 6 characters"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                minLength={6}
                required
              />
            </div>

            {errorMessage ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            <div className="flex gap-2 pt-3">
              <button
                type="submit"
                className="flex-1 rounded-full bg-accent px-4 py-3 text-sm font-medium text-white transition hover:bg-accent-strong"
              >
                {mode === "signup" ? "Create account" : "Sign in"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
