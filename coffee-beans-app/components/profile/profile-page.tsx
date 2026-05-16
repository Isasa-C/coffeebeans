"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useLocalUser } from "@/hooks/use-local-user";

export default function ProfilePage() {
  const { user, favoriteBeans, removeFavoriteBean, updateProfile } = useLocalUser();
  const [name, setName] = useState(() => user?.name || "");
  const [bio, setBio] = useState(() => user?.bio || "");
  const [favoriteDrink, setFavoriteDrink] = useState(() => user?.favoriteDrink || "");
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const result = updateProfile({
      name,
      bio,
      favoriteDrink,
    });

    if (!result.ok) {
      setMessage(result.error || "Unable to save profile.");
      return;
    }

    setMessage("Profile saved.");
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f7f1e8] px-6 py-16 text-[#2b1b12]">
        <section className="mx-auto max-w-2xl rounded-2xl border border-line bg-white p-8">
          <h1 className="font-serif text-4xl">Personal page</h1>
          <p className="mt-3 text-sm text-[#735d4d]">
            Please sign in first from the account button in the top bar.
          </p>
          <Link href="/" className="mt-6 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-medium text-white">
            Back home
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-6 py-12 text-[#2b1b12]">
      <section className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-serif text-4xl">Personal page</h1>
          <Link href="/" className="text-sm font-medium text-accent">
            Back home
          </Link>
        </div>
        <p className="mt-2 text-sm text-[#735d4d]">{user.email}</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="profile-name" className="mb-2 block text-sm font-medium">Display name</label>
            <input
              id="profile-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-accent"
              required
            />
          </div>

          <div>
            <label htmlFor="profile-favorite-drink" className="mb-2 block text-sm font-medium">Favorite drink</label>
            <input
              id="profile-favorite-drink"
              value={favoriteDrink}
              onChange={(event) => setFavoriteDrink(event.target.value)}
              className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-accent"
              placeholder="Latte, V60, Cappuccino..."
            />
          </div>

          <div>
            <label htmlFor="profile-bio" className="mb-2 block text-sm font-medium">Bio</label>
            <textarea
              id="profile-bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              className="h-28 w-full rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-accent"
              placeholder="Tell us your coffee style..."
            />
          </div>

          {message ? <p className="text-sm text-[#735d4d]">{message}</p> : null}

          <button
            type="submit"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white"
          >
            Save profile
          </button>
        </form>

        <section className="mt-10 border-t border-line pt-8">
          <h2 className="font-serif text-2xl">Saved favorite beans</h2>
          {favoriteBeans.length === 0 ? (
            <p className="mt-3 text-sm text-[#735d4d]">
              No favorites yet. Browse beans and tap &quot;Save favorite&quot;.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {favoriteBeans.map((bean) => (
                <article
                  key={bean.id}
                  className="flex items-center justify-between rounded-xl border border-line bg-[#faf8f5] px-4 py-3"
                >
                  <div>
                    <h3 className="font-medium">{bean.brand}</h3>
                    <p className="text-sm text-[#735d4d]">
                      {bean.roast} · €{bean.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-xs font-medium text-[#9b2f2f] underline"
                    onClick={() => removeFavoriteBean(bean.id)}
                  >
                    Remove
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
