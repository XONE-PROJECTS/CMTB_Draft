// @ts-nocheck
"use client";

import NextLink from "next/link";
import {
  useParams as useNextParams,
  usePathname,
} from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

type LinkProps = Omit<React.ComponentProps<typeof NextLink>, "href"> & {
  to: string;
};

export function Link({ to, ...props }: LinkProps) {
  return <NextLink href={to} {...props} />;
}

type NavLinkProps = Omit<LinkProps, "className" | "children"> & {
  end?: boolean;
  className?: string | ((state: { isActive: boolean }) => string);
  children?: ReactNode | ((state: { isActive: boolean }) => ReactNode);
};

export function NavLink({ to, end = false, className, children, ...props }: NavLinkProps) {
  const pathname = usePathname() || "/";
  const isActive = end ? pathname === to : to === "/" ? pathname === "/" : pathname.startsWith(to);
  const resolvedClassName = typeof className === "function" ? className({ isActive }) : className;
  const resolvedChildren = typeof children === "function" ? children({ isActive }) : children;

  return (
    <NextLink href={to} className={resolvedClassName} {...props}>
      {resolvedChildren}
    </NextLink>
  );
}

export const useParams = useNextParams;

export function useLocation() {
  const pathname = usePathname() || "/";
  const [hash, setHash] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    const updateSearch = () => setSearch(window.location.search);
    updateHash();
    updateSearch();
    window.addEventListener("hashchange", updateHash);
    window.addEventListener("popstate", updateSearch);
    return () => {
      window.removeEventListener("hashchange", updateHash);
      window.removeEventListener("popstate", updateSearch);
    };
  }, [pathname]);

  return { pathname, search, hash };
}

export function useSearchParams() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}
