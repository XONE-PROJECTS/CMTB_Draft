"use client";

import { createClient } from "@/supabase/browser";

export default function SignOutButton() {
  async function signOut() {
    await createClient().auth.signOut();
    window.location.assign("/login");
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:border-brand-red hover:text-brand-red"
    >
      Sign out
    </button>
  );
}
