import Link from "next/link";
import { site } from "@/site.config";

// Always-visible mobile CTA bar (KICKSTART 5.2.3). Nothing may ever cover it (z-50, highest layer).
export function MobileBar() {
  const item = "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[13px] font-semibold";
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-50 flex border-t border-black/10 bg-bg pb-[env(safe-area-inset-bottom)] text-ink shadow-[0_-6px_24px_rgba(0,0,0,0.08)] md:hidden"
    >
      <Link href="/estimate" className={`${item} bg-accent text-on-accent`}>
        <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M5 4h10l4 4v12H5z M14 4v5h5 M8 13h8 M8 17h5" />
        </svg>
        Estimate
      </Link>
      <a href={`tel:${site.phone.e164}`} className={item}>
        <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z" />
        </svg>
        Call
      </a>
      <Link href="/#reviews" className={item}>
        <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
        </svg>
        Reviews
      </Link>
    </nav>
  );
}
