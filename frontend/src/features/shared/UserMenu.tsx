"use client";

import { Menu } from "@headlessui/react";
import { User, LogOut, CreditCard } from "lucide-react";
import { loginWithGoogle } from "@/utils/firebase";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

function formatDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

export default function UserMenu() {
  const router = useRouter();
  const { user, isPaidUser, cancelScheduled, subscriptionEndsOn, logout } =
    useAuthContext();

  const subscribe = async () => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stripe/checkout`,
        { method: "POST" }
      );

      const data = await res.json();
      console.log("checkout resp", res.status, data);

      if (res.ok && data?.url) {
        // Start Stripe checkout
        window.location.assign(data.url);
        return;
      }

      if (res.status === 400 && data?.message === "User already subscribed") {
        // Already premium — just send them to the draft
        router.push("/mockdraft");
        return;
      }

      console.error("Checkout failed:", data);
    } catch (err) {
      console.error("Checkout failed:", err);
    }
  };

  const goToCancelConfirm = () => router.push("/confirm-cancel");

  // Decide label/behavior
  const showExpireNote = isPaidUser && cancelScheduled;
  const buttonDisabled = showExpireNote;

  let buttonLabel = "Subscribe";
  let onClick: (() => void) | undefined = subscribe;

  if (isPaidUser && !cancelScheduled) {
    buttonLabel = "Cancel Membership";
    onClick = goToCancelConfirm;
  } else if (showExpireNote) {
    buttonLabel = `Premium (ends ${formatDate(subscriptionEndsOn)})`;
    onClick = undefined; // disabled
  }

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        type="button"
        className="rounded-full overflow-hidden w-6 h-6"
      >
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-xs">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 w-56 bg-slate-800 text-white rounded-md shadow-lg overflow-hidden border border-white/10 z-50">
        {user ? (
          <>
            <div className="px-4 py-2 text-sm text-white/80 border-b border-white/10">
              {user.displayName || user.email}
            </div>

            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={onClick}
                  disabled={buttonDisabled}
                  className={`w-full px-4 py-2 text-left flex items-center gap-2 ${
                    active && !buttonDisabled ? "bg-slate-700" : ""
                  } ${buttonDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <CreditCard className="w-4 h-4" />
                  {showExpireNote
                    ? `Premium | ${formatDate(subscriptionEndsOn)}`
                    : buttonLabel}
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={logout}
                  className={`w-full px-4 py-2 text-left flex items-center gap-2 ${
                    active ? "bg-slate-700" : ""
                  }`}
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              )}
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  className={`w-full px-4 py-2 text-left flex items-center gap-2 ${
                    active ? "bg-slate-700" : ""
                  }`}
                >
                  <User className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={async () => {
                    await loginWithGoogle();
                    window.location.href = "/subscribe";
                  }}
                  className={`w-full px-4 py-2 text-left flex items-center gap-2 ${
                    active ? "bg-slate-700" : ""
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Subscribe
                </button>
              )}
            </Menu.Item>
          </>
        )}
      </Menu.Items>
    </Menu>
  );
}
