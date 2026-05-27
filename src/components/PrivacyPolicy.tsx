import React from "react";
import { Link } from "react-router-dom";

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen md:ml-48">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-artistic-accent mb-4">
            Legal / Policy
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-none mb-4">
            Privacy Policy
          </h1>
          <p className="text-zinc-300 max-w-2xl">
            This privacy policy explains that Fix Me does not collect or store any personal or usage data from visitors.
          </p>
        </div>

        <div className="space-y-10 text-sm leading-7 text-zinc-200">
          <section className="border border-artistic-border bg-zinc-950/60 p-6">
            <h2 className="text-lg font-semibold mb-3">1. No Data Collection</h2>
            <p>
              Fix Me does not collect, store, or process any personal information or analytics data from visitors. We do not use cookies, tracking pixels, analytics services, or any third-party tracking tools on this site.
            </p>
          </section>

          <section className="border border-artistic-border bg-zinc-950/60 p-6">
            <h2 className="text-lg font-semibold mb-3">2. Advertising and Third Parties</h2>
            <p>
              This website does not include advertising networks or third-party services that collect user data. If any third-party service is added in the future, we will update this policy accordingly.
            </p>
          </section>

          <section className="border border-artistic-border bg-zinc-950/60 p-6">
            <h2 className="text-lg font-semibold mb-3">3. Data Security</h2>
            <p>
              Because we do not collect or store personal data, there is no personal information retained on our servers.
            </p>
          </section>

          <section className="border border-artistic-border bg-zinc-950/60 p-6">
            <h2 className="text-lg font-semibold mb-3">4. Contact</h2>
            <p>
              For questions about this policy, contact us at <span className="text-artistic-accent">privacy@fixme.example</span>.
            </p>
          </section>

          <section className="border border-artistic-border bg-zinc-950/60 p-6">
            <h2 className="text-lg font-semibold mb-3">8. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at <span className="text-artistic-accent">privacy@fixme.example</span>.
            </p>
          </section>

          <section className="border border-artistic-border bg-zinc-950/60 p-6">
            <h2 className="text-lg font-semibold mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Any material changes will be reflected on this page, and the effective date will be updated accordingly.
            </p>
          </section>
        </div>

        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-mono text-artistic-accent hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
