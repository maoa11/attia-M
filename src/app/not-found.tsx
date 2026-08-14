import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid min-h-[100svh] place-items-center pad-x text-center">
      <div className="flex flex-col items-center gap-8">
        <p className="t-meta">404</p>
        <h1 className="t-section">Nothing here</h1>
        <Link href="/" className="link-underline t-display text-[0.72rem] text-white">
          Back to work
        </Link>
      </div>
    </section>
  );
}
