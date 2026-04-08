import Link from "next/link";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-base-100 min-h-screen flex flex-col">
      {/* Top nav */}
      <nav className="p-4 md:p-8">
        <Link
          href="/"
          className="link link-primary inline-flex items-center gap-1 text-sm"
        >
          &larr; Back to home
        </Link>
      </nav>

      {/* Content */}
      <main className="flex-1 px-4 md:px-8 pb-12 md:pb-16">
        <article className="mx-auto max-w-3xl">
          {children}
        </article>
      </main>
    </div>
  );
}
