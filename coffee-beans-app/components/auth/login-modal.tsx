import { FormEvent, useEffect, useState } from "react";
import type { LocalUser } from "@/hooks/use-local-user";

interface LoginModalProps {
  isOpen: boolean;
  user: LocalUser | null;
  onClose: () => void;
  onLogin: (user: LocalUser) => void;
  onLogout: () => void;
}

export function LoginModal({
  isOpen,
  user,
  onClose,
  onLogin,
  onLogout,
}: LoginModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

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

  if (!isOpen) {
    return null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName || !cleanEmail) {
      return;
    }

    onLogin({
      name: cleanName,
      email: cleanEmail,
    });
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
              {user ? "Your profile" : "Sign in"}
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
            </div>
            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex-1 rounded-full border border-line bg-white px-4 py-3 text-sm font-medium text-foreground transition hover:bg-[#f5efe5]"
              >
                Sign out
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-full bg-accent px-4 py-3 text-sm font-medium text-white transition hover:bg-accent-strong"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div className="flex gap-2 pt-3">
              <button
                type="submit"
                className="flex-1 rounded-full bg-accent px-4 py-3 text-sm font-medium text-white transition hover:bg-accent-strong"
              >
                Sign in
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
