import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

const base =
  "relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-pill font-semibold whitespace-nowrap transition-[background-color,color,box-shadow,transform,opacity] duration-200 ease-out-expo hover:-translate-y-[1.5px] active:translate-y-0 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 disabled:hover:translate-y-0";

const sheen =
  "before:pointer-events-none before:absolute before:inset-0 before:-translate-y-full before:bg-gradient-to-b before:from-white/25 before:to-white/0 before:transition-transform before:duration-500 before:ease-out-expo hover:before:translate-y-0";

const variants: Record<Variant, string> = {
  primary: `${sheen} bg-dono-blue text-on-accent shadow-[0_12px_32px_-12px_color-mix(in_srgb,var(--color-dono-blue)_75%,transparent)] hover:bg-dono-blue-hover hover:shadow-[0_18px_40px_-14px_color-mix(in_srgb,var(--color-dono-blue)_85%,transparent)]`,
  secondary: "bg-white/10 text-ink outline-1 outline-offset-[-1px] outline-white/15 hover:bg-white/[0.16] hover:shadow-[0_14px_32px_-16px_rgba(4,8,32,0.9)] hover:outline-white/25",
  ghost: "text-ink hover:bg-white/[0.08]",
  dark: "bg-[#11131b] text-[#ffffff] hover:bg-black",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[15px]",
  lg: "h-14 px-8 text-base",
};

export const buttonClass = (variant: Variant = "primary", size: Size = "md", extra = "") =>
  `${base} ${variants[variant]} ${sizes[size]} ${extra}`;

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}
