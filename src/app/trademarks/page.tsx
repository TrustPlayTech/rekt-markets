export const metadata = { title: 'Trademark Guidelines - Rekt Markets' }

export default function TrademarksPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-white mb-2">Trademark Guidelines</h1>
      <p className="text-sm text-rekt-muted mb-8">Last Updated: 23 March 2026</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-6">

        <p className="text-rekt-muted leading-relaxed">
          Rekt Markets respects trademarks and takes steps to ensure that others&apos; trademark rights are respected by creators using the Platform.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          A trademark is a word, slogan, symbol, or design used to distinguish one person&apos;s or company&apos;s products or services from another&apos;s. The owner of a trademark may stop others from using the mark or confusingly similar marks.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          These guidelines are intended to avoid confusion about who provides, is affiliated with, or endorses a creator&apos;s token, content, or any other material. These guidelines apply to the Rekt Markets web and mobile interfaces. They do not apply to information stored on a blockchain or any website we do not control. (See also Terms of Use Section 7.6 on Creator Responsibilities.)
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">Guidelines</h2>
        <ul className="list-disc pl-5 space-y-1 text-rekt-muted">
          <li>Do not use trademarks that do not belong to you without explicit permission.</li>
          <li>Do not use someone else&apos;s trademark in a way that may cause legitimate confusion about ownership.</li>
          <li>Obtain explicit permission before suggesting that a trademark owner is an affiliate, sponsor, partner, or endorser.</li>
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">Token Names and Symbols</h2>
        <p className="text-rekt-muted leading-relaxed">
          Special attention for Token Launchpad creators: When creating a Bonding Curve Token, you must not use a third party&apos;s trademark as the token name, symbol, or visual branding unless you have explicit written permission from the trademark owner. Tokens named after third-party brands (e.g., &quot;NikeCoin,&quot; &quot;AppleToken&quot;) without authorisation will be subject to removal from the Interface upon a valid trademark infringement report.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          The Platform does not screen token names or symbols for trademark conflicts prior to launch. You are solely responsible for ensuring your token does not infringe third-party trademarks. The Company reserves the right to remove tokens from the Interface at any time if a valid trademark complaint is received.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">Permitted Uses</h2>
        <p className="text-rekt-muted leading-relaxed">You may:</p>
        <ul className="list-disc pl-5 space-y-1 text-rekt-muted">
          <li>Reference someone else&apos;s trademark in passing (e.g., &quot;I love [trademark]&quot;).</li>
          <li>Create parodies, commentary, or fan content, provided that you (1) clearly indicate the content is not affiliated with the trademark owner, and (2) include a distinguishing marker in the title (e.g., &quot;[trademark] fan,&quot; &quot;[trademark] parody&quot;).</li>
        </ul>
        <p className="text-rekt-muted leading-relaxed">
          <strong className="text-white">Enjoy referencing others&apos; brands, but do not pretend you are them in a way that would confuse an ordinary person.</strong>
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">Reporting Trademark Infringement</h2>
        <p className="text-rekt-muted leading-relaxed">
          If you believe a creator is violating your trademark, email{' '}
          <a href="mailto:legal@markets.rektpalace.com" className="text-rekt-blue hover:underline">legal@markets.rektpalace.com</a> with:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-rekt-muted">
          <li>Your contact information and a statement that you are the trademark owner or authorised agent.</li>
          <li>Identification of the trademark, including registration/application number, registration jurisdiction, and associated goods/services.</li>
          <li>Identification of the creator (token name, username, wallet address, URL).</li>
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">Response to Reports</h2>
        <p className="text-rekt-muted leading-relaxed">
          We will: (1) assess the report; (2) evaluate against these guidelines; (3) remove content if we determine, in our sole discretion, that it violates trademark rights; (4) notify the creator where possible; (5) allow the creator to respond to{' '}
          <a href="mailto:legal@markets.rektpalace.com" className="text-rekt-blue hover:underline">legal@markets.rektpalace.com</a>.
          The trademark owner may seek to resolve violations directly with the creator.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">Creator Response</h2>
        <p className="text-rekt-muted leading-relaxed">
          If alerted to a violation you dispute, submit to{' '}
          <a href="mailto:legal@markets.rektpalace.com" className="text-rekt-blue hover:underline">legal@markets.rektpalace.com</a>:
          your contact information, and either evidence of permission or clear demonstration that the use was parody, commentary, or fan-related.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">Repeat Violations</h2>
        <p className="text-rekt-muted leading-relaxed">
          Rekt Markets may terminate a creator&apos;s access if we determine the creator is a repeat trademark violator. Receiving three (3) separate confirmed trademark violation findings will result in permanent access termination. This threshold is aligned with the DMCA Guidelines repeat infringement policy.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">Policy Updates</h2>
        <p className="text-rekt-muted leading-relaxed">
          Rekt Markets may update these guidelines at any time. Continued use constitutes acceptance.
        </p>

      </div>
    </div>
  )
}
