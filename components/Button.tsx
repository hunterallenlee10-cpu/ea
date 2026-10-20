import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
  tone?: "light" | "dark";
  className?: string;
  size?: "md" | "lg";
};

// Primary = solid accent. Secondary = 1px outline. Same height and padding. Hover: shade only, no movement.
export function Button({ href, children, variant = "solid", tone = "light", className = "", size = "lg" }: Props) {
  const base = `inline-flex items-center justify-center gap-2 rounded-ui font-semibold transition-colors ${
    size === "lg" ? "min-h-14 px-7 text-[17px]" : "min-h-12 px-5 text-[15px]"
  }`;
  const look =
    variant === "solid"
      ? "bg-accent text-on-accent hover:bg-accent-hover"
      : tone === "dark"
        ? "border border-dark-ink/70 text-dark-ink hover:bg-dark-ink hover:text-dark"
        : "border border-ink/70 text-ink hover:bg-ink hover:text-bg";
  const cls = `${base} ${look} ${className}`;
  const external = href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("http");
  return external ? (
    <a href={href} className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
