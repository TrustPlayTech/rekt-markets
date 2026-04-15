export const metadata = { title: 'AML/KYC Policy - Rekt Markets' }

export default function AmlPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-white mb-2">Anti-Money Laundering and Know Your Customer Policy</h1>
      <p className="text-sm text-rekt-muted mb-8">Last Updated: 23 March 2026</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-6">

        <p className="text-rekt-muted leading-relaxed">
          Meta Bliss Group B.V. (&quot;the Company,&quot; &quot;Rekt Markets,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to preventing money laundering, terrorist financing, and other financial crime. This AML/KYC Policy describes the measures we implement to detect, prevent, and report suspicious activity on the Rekt Markets Platform.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          This Policy applies to all users of the Platform and all Company personnel involved in the operation of the Platform and Services.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">1. Regulatory Framework</h2>
        <p className="text-rekt-muted leading-relaxed">
          The Company operates from Curaçao and is subject to Curaçao anti-money laundering legislation, including the Landsverordening melding ongebruikelijke transacties (National Ordinance on the Reporting of Unusual Transactions) and the Landsverordening identificatie bij dienstverlening (National Ordinance on Identification when Rendering Services). The Company also operates in accordance with:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-rekt-muted">
          <li>FATF Recommendations, including Recommendation 15 on virtual assets and VASPs;</li>
          <li>EU Anti-Money Laundering Directives (as applicable to users in relevant jurisdictions);</li>
          <li>International sanctions regimes (OFAC, EU, UN, UK);</li>
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">2. Risk-Based Approach</h2>
        <p className="text-rekt-muted leading-relaxed">
          The Company applies a risk-based approach to AML/KYC compliance, calibrating the intensity of due diligence measures to the assessed risk level of each user, transaction type, and jurisdiction. Higher-risk scenarios include:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-rekt-muted">
          <li>Users in or connected to jurisdictions with elevated AML risk;</li>
          <li>Transactions above specified value thresholds;</li>
          <li>Patterns of activity indicative of layering, structuring, or other laundering techniques;</li>
          <li>Wallet addresses associated with known illicit activity (identified via blockchain analytics);</li>
          <li>Token creation activity that may facilitate securities violations or fraud.</li>
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">3. Customer Identification and Verification</h2>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">3.1 Standard Due Diligence</h3>
        <p className="text-rekt-muted leading-relaxed">
          When the Company determines that identity verification is required (based on risk assessment, transaction thresholds, regulatory requirements, or at the Company&apos;s discretion), the following information may be collected:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-rekt-muted">
          <li><strong className="text-white">Individuals:</strong> full legal name, date of birth, nationality, residential address, government-issued identification document (passport, national ID card, or driver&apos;s licence), and proof of address.</li>
          <li><strong className="text-white">Legal entities:</strong> entity name, registration number, registered address, jurisdiction of incorporation, certificate of incorporation, articles of association, identification of beneficial owners (individuals owning or controlling 25% or more), and identification of authorised representatives.</li>
        </ul>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">3.2 Enhanced Due Diligence</h3>
        <p className="text-rekt-muted leading-relaxed">
          Enhanced due diligence (EDD) may be applied where the Company identifies elevated risk, including:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-rekt-muted">
          <li>Politically Exposed Persons (PEPs) and their associates;</li>
          <li>Users in jurisdictions under FATF scrutiny;</li>
          <li>Transactions above elevated value thresholds;</li>
          <li>Complex or unusual transaction patterns;</li>
          <li>Any other scenario that the Company&apos;s compliance function identifies as requiring enhanced scrutiny.</li>
        </ul>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">3.3 Wallet-Based Identification</h3>
        <p className="text-rekt-muted leading-relaxed">
          The Platform is primarily accessed via self-hosted Wallets. The Company uses blockchain analytics tools to assess wallet risk scores, identify connections to known illicit addresses, and screen against sanctions lists. Where wallet analytics indicate elevated risk, the Company may require identity verification before allowing continued access to the Platform.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">4. Sanctions Screening</h2>
        <p className="text-rekt-muted leading-relaxed">
          The Company screens all wallet addresses upon connection to the Platform against the OFAC Specially Designated Nationals (SDN) List. Any positive match results in immediate denial of access to the Platform.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          Sanctions screening is performed at onboarding (where applicable) and on an ongoing basis. Any positive match results in immediate suspension of access and reporting to the relevant authorities.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">5. Transaction Monitoring</h2>
        <p className="text-rekt-muted leading-relaxed">
          The Company monitors Platform activity for suspicious and potentially manipulative patterns. Monitoring capabilities are updated regularly. Suspicious activity identified through monitoring will be investigated and, where appropriate, result in suspension of access and reporting to the relevant authorities.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">6. Suspicious Activity Reporting</h2>
        <p className="text-rekt-muted leading-relaxed">
          Where the Company identifies activity that meets the criteria for reporting under Applicable Law, the Company will:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-rekt-muted">
          <li>File reports with the Financial Intelligence Unit (FIU) of Curaçao (Meldpunt Ongebruikelijke Transacties) as required under the Landsverordening melding ongebruikelijke transacties;</li>
          <li>File reports with other relevant authorities as required by Applicable Law;</li>
          <li>Cooperate fully with law enforcement and regulatory investigations;</li>
          <li>Preserve relevant records for the required retention period.</li>
        </ul>
        <p className="text-rekt-muted leading-relaxed">
          The Company will not disclose the existence of a suspicious activity report to the affected user (&quot;tipping off&quot; prohibition).
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">7. Record Keeping</h2>
        <p className="text-rekt-muted leading-relaxed">
          The Company retains AML/KYC records for a minimum of five (5) years after the end of the business relationship (or longer if required by Applicable Law), including:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-rekt-muted">
          <li>Identity verification documents and data;</li>
          <li>Transaction records;</li>
          <li>Risk assessments;</li>
          <li>Suspicious activity reports and related correspondence;</li>
          <li>Blockchain analytics reports.</li>
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">8. Training</h2>
        <p className="text-rekt-muted leading-relaxed">
          The Company ensures that all personnel with AML/KYC responsibilities receive appropriate training on anti-money laundering obligations, suspicious activity identification, and regulatory requirements. Training is conducted upon onboarding and refreshed periodically.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">9. User Obligations</h2>
        <p className="text-rekt-muted leading-relaxed">By using the Platform, you agree to:</p>
        <ul className="list-disc pl-5 space-y-1 text-rekt-muted">
          <li>Provide accurate and complete information when requested for identity verification;</li>
          <li>Notify the Company promptly of any changes to your identity or status information;</li>
          <li>Not use the Platform for money laundering, terrorist financing, or other illegal purposes;</li>
          <li>Cooperate with any investigation or information request from the Company relating to compliance.</li>
        </ul>
        <p className="text-rekt-muted leading-relaxed">
          Failure to comply with these obligations may result in immediate suspension or termination of access to the Platform, as described in the Terms of Use.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">10. Prohibited Jurisdictions</h2>
        <p className="text-rekt-muted leading-relaxed">
          The Company maintains a list of Prohibited Jurisdictions in the Terms of Use. Users from Prohibited Jurisdictions are prohibited from using the Platform&apos;s trading features. Geographic restrictions are enforced at the Interface level. The Company also screens for and blocks access from jurisdictions subject to comprehensive international sanctions.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">11. Policy Updates</h2>
        <p className="text-rekt-muted leading-relaxed">
          This Policy is reviewed and updated periodically to reflect changes in regulatory requirements, industry best practices, and the Company&apos;s risk assessment. Material changes will be reflected in the &quot;Last Updated&quot; date.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">12. Contact</h2>
        <p className="text-rekt-muted leading-relaxed">
          <strong className="text-white">Compliance Contact:</strong>{' '}
          <a href="mailto:compliance@markets.rektpalace.com" className="text-rekt-blue hover:underline">compliance@markets.rektpalace.com</a>
        </p>
        <p className="text-rekt-muted leading-relaxed">
          <strong className="text-white">Registered Office:</strong> Meta Bliss Group B.V., Korporaalweg 10, Willemstad, Curaçao
        </p>

      </div>
    </div>
  )
}
