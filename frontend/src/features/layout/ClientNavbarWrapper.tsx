"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/features/shared/Navbar";

export default function ClientNavbarWrapper() {
  const pathname = usePathname();
  const showNavbar = !pathname.startsWith("/mockdraft");

  return showNavbar ? <Navbar /> : null;
}
