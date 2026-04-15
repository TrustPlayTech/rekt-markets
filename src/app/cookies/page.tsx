import Link from 'next/link'

export const metadata = { title: 'Cookie Policy - Rekt Markets' }

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-white mb-2">Cookie Policy</h1>
      <p className="text-sm text-rekt-muted mb-8">Last Updated: 23 March 2026</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-6">

        <p className="text-rekt-muted leading-relaxed">
          This Cookie Policy explains how Meta Bliss Group B.V. (&quot;Rekt Markets,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) uses cookies and similar tracking technologies when you visit or use the Rekt Markets Platform. This policy should be read alongside our <Link href="/privacy" className="text-rekt-blue hover:underline">Privacy Policy</Link>.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">1. What Are Cookies?</h2>
        <p className="text-rekt-muted leading-relaxed">
          Cookies are small text files placed on your device when you visit a website. They enable the website to recognise your device and store information about your preferences or actions. Similar technologies include pixel tags, web beacons, and local storage.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">2. Types of Cookies We Use</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-rekt-muted">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 pr-4 text-white font-bold">Category</th>
                <th className="text-left py-2 pr-4 text-white font-bold">Purpose</th>
                <th className="text-left py-2 pr-4 text-white font-bold">Examples</th>
                <th className="text-left py-2 text-white font-bold">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-4">Strictly Necessary</td>
                <td className="py-2 pr-4">Essential for Platform operation, security, and geographic restriction enforcement.</td>
                <td className="py-2 pr-4">Session cookies, security tokens, geo-check cookies</td>
                <td className="py-2">Session or up to 12 months</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-4">Functional</td>
                <td className="py-2 pr-4">Remember preferences, language, display settings.</td>
                <td className="py-2 pr-4">Preference cookies, UI state</td>
                <td className="py-2">Up to 12 months</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-4">Analytics</td>
                <td className="py-2 pr-4">Understand usage patterns and improve the Platform.</td>
                <td className="py-2 pr-4">Page views, session duration, feature usage</td>
                <td className="py-2">Up to 24 months</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-4">Marketing</td>
                <td className="py-2 pr-4">Track effectiveness of communications and referrals.</td>
                <td className="py-2 pr-4">Referral tracking, campaign attribution</td>
                <td className="py-2">Up to 12 months</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">3. Strictly Necessary Cookies</h2>
        <p className="text-rekt-muted leading-relaxed">
          These cookies are essential for the Platform to function and cannot be disabled. They include cookies used for geographic restriction enforcement (IP-based location checks), session management, security, and Wallet connection state. Because these cookies are strictly necessary, we do not require your consent to set them.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">4. Non-Essential Cookies and Consent</h2>
        <p className="text-rekt-muted leading-relaxed">
          For analytics and marketing cookies, we will request your consent before setting them, in compliance with the EU ePrivacy Directive (2002/58/EC as amended) and equivalent UK regulations. You may manage your cookie preferences at any time via cookie consent banner. Refusing non-essential cookies will not affect the core functionality of the Platform.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">5. Third-Party Cookies</h2>
        <p className="text-rekt-muted leading-relaxed">
          Some cookies may be set by third-party analytics or advertising services that we use. These third parties have their own privacy and cookie policies, which we do not control. Third-party services may include: infrastructure and hosting providers, blockchain RPC providers, wallet connection services, market data providers, and email delivery services.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">6. Managing Cookies</h2>
        <p className="text-rekt-muted leading-relaxed">You can control cookies through:</p>
        <ul className="list-disc pl-5 space-y-1 text-rekt-muted">
          <li><strong className="text-white">Cookie consent settings:</strong> Link to cookie settings page on the Platform.</li>
          <li><strong className="text-white">Browser settings:</strong> Most browsers allow you to block or delete cookies. Consult your browser&apos;s help documentation for instructions.</li>
          <li><strong className="text-white">Opt-out tools:</strong> For analytics cookies, you may use tools like the Google Analytics opt-out browser add-on (if applicable).</li>
        </ul>
        <p className="text-rekt-muted leading-relaxed">
          Note: Disabling strictly necessary cookies may prevent you from using the Platform.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">7. Do Not Track</h2>
        <p className="text-rekt-muted leading-relaxed">
          The Platform does not currently respond to &quot;Do Not Track&quot; (DNT) browser signals, as there is no industry standard for compliance with DNT signals.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">8. Changes to This Policy</h2>
        <p className="text-rekt-muted leading-relaxed">
          We may update this Cookie Policy. Changes will be posted with an updated date. Continued use constitutes acceptance.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">9. Contact</h2>
        <p className="text-rekt-muted leading-relaxed">
          <strong className="text-white">Email:</strong>{' '}
          <a href="mailto:privacy@markets.rektpalace.com" className="text-rekt-blue hover:underline">privacy@markets.rektpalace.com</a>
        </p>

      </div>
    </div>
  )
}
