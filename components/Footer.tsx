import Image from 'next/image';

export function Footer() {
  return (
    <footer className="mt-10 border-t border-border/60 px-4 py-8 text-sm text-subtle">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <Image
            src="/logo-v2.png"
            alt="Solar Atap News"
            width={120}
            height={40}
            className="h-8 w-auto object-contain"
          />
        </div>
        <p>Focused coverage on Malaysia rooftop solar. Built for clarity and speed.</p>
        <div className="flex gap-3">
          <span className="rounded-full border border-border px-3 py-1">EN / 中文 / MY</span>
          <span className="rounded-full border border-border px-3 py-1">Railway-ready</span>
        </div>
      </div>
    </footer>
  );
}
