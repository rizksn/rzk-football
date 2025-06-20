'use client';

import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar";

export default function ClientNavbarWrapper() {
  const pathname = usePathname();
  const showNavbar = !pathname.startsWith("/mockdraft");

  return showNavbar ? <Navbar /> : null;
}