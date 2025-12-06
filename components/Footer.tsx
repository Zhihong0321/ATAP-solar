import Image from 'next/image';
import { useState } from 'react';
import logo from '@/public/logo-v2.png';

export function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribed with email:', email);
    setEmail('');
  };

  return (
    <footer className="mt-10 border-t border-border/60 bg-white px-4 py-12 text-sm">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Image
                src={logo}
                alt="Malaysia Solar Atap News"
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Solar ATAP</h3>
            <p className="text-subtle leading-relaxed">
              Malaysia&apos;s first and authoritative information site dedicated to ATAP and renewable energy.
            </p>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Newsletter</h3>
            <p className="text-subtle leading-relaxed">
              Stay ahead with Malaysia&apos;s top renewable-energy news, insights, and expert analysis.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Useful Links Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Useful Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-subtle hover:text-foreground transition-colors">Home</a></li>
              <li><a href="/news" className="text-subtle hover:text-foreground transition-colors">Latest News</a></li>
              <li><a href="/insights" className="text-subtle hover:text-foreground transition-colors">ATAP Insights</a></li>
              <li><a href="/renewable-energy" className="text-subtle hover:text-foreground transition-colors">Renewable Energy in Malaysia</a></li>
              <li><a href="/policy" className="text-subtle hover:text-foreground transition-colors">Policy & Regulation Updates</a></li>
              <li><a href="/commentary" className="text-subtle hover:text-foreground transition-colors">Industry Commentary</a></li>
              <li><a href="/contact" className="text-subtle hover:text-foreground transition-colors">Contact</a></li>
            </ul>
            <ul className="space-y-2 mt-4">
              <li><a href="/settings" className="text-subtle hover:text-foreground transition-colors">Settings</a></li>
            </ul>
          </div>

          {/* Legal Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2">
              <li><a href="/privacy" className="text-subtle hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-subtle hover:text-foreground transition-colors">Terms & Conditions</a></li>
              <li><a href="/disclaimer" className="text-subtle hover:text-foreground transition-colors">Disclaimer</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-border/60 pt-8">
          <div className="space-y-4 text-subtle">
            <p className="text-sm leading-relaxed">
              Solar ATAP is an independent editorial platform dedicated to ATAP and renewable energy developments in Malaysia. We do not participate in, endorse, or receive compensation from any solar-related products, services, or installation activities. All news, features, and analyses are prepared under strict editorial standards and cross-checked with care; however, the content is provided for general information only and should not be regarded as commercial, technical, or investment advice.
            </p>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <p className="text-sm">
                © 2025 Solar ATAP. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
