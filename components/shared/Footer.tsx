import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-base-200 text-base-content/60 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          &copy; 2026 Second Saturday. All rights reserved.
        </p>
        <nav className="flex gap-4">
          <Link href="/privacy" className="link link-hover text-sm">
            Privacy Policy
          </Link>
          <Link href="/terms" className="link link-hover text-sm">
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  );
}
