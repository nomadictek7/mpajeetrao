"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <form action={action} className="w-full max-w-sm space-y-4 rounded-2xl border border-line bg-surface p-8">
        <h1 className="font-display text-2xl font-bold">Admin access</h1>
        <label className="block">
          <span className="mb-1 block text-sm text-muted">Access code</span>
          <input
            name="code"
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            required
            autoFocus
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 outline-none focus:border-saffron"
          />
        </label>
        {state?.error && (
          <p role="alert" className="text-sm text-red-600">
            {state.error}
          </p>
        )}
        <button
          disabled={pending}
          className="w-full rounded-xl bg-saffron py-3 font-semibold text-on-brand hover:bg-saffron-deep disabled:opacity-60"
        >
          {pending ? "Checking…" : "Enter"}
        </button>
      </form>
    </main>
  );
}
