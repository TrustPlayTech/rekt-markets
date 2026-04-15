import Link from 'next/link'

export const metadata = { title: 'Terms of Use - Rekt Markets' }

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-white mb-2">Terms of Use</h1>
      <p className="text-sm text-rekt-muted mb-8">Last Updated: 23 March 2026</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-6">

        {/* Platform Operator */}
        <div className="rounded-lg border border-rekt-border bg-rekt-card p-4 space-y-1">
          <p className="text-rekt-muted leading-relaxed"><strong className="text-white">Platform Operator:</strong> Meta Bliss Group B.V.</p>
          <p className="text-rekt-muted leading-relaxed"><strong className="text-white">Registration No:</strong> 159718</p>
          <p className="text-rekt-muted leading-relaxed"><strong className="text-white">Registered Office:</strong> Korporaalweg 10, Willemstad, Curaçao</p>
          <p className="text-rekt-muted leading-relaxed">The Company is a subsidiary of 36 Group AB (NGM: 36GRP), a company listed on the Nordic Growth Market in Sweden.</p>
        </div>

        {/* Risk Warning */}
        <div className="rounded-lg border border-yellow-600/30 bg-yellow-900/10 p-4">
          <h2 className="text-xl font-bold text-yellow-400 mt-0 mb-3 uppercase">Risk Warning</h2>
          <p className="text-rekt-muted leading-relaxed">
            The Rekt Markets Platform and Services involve interacting with Digital Assets, prediction market Contracts, Bonding Curve Tokens, and related blockchain-based instruments. Neither the Company nor any affiliate is responsible for user-generated Digital Assets that you may, in your sole discretion, engage with on the Platform or via the Services.
          </p>
          <p className="text-rekt-muted leading-relaxed">
            The value of Digital Assets, including prediction market positions and Bonding Curve Tokens, can fluctuate significantly. There is a material risk of total economic loss when buying, selling, holding, or investing in any Digital Asset.
          </p>
          <p className="text-rekt-muted leading-relaxed">
            You acknowledge that we are not your broker, intermediary, agent, or advisor. We have no fiduciary relationship or obligation to you. No communication or information we provide is intended to be, or should be construed as, advice of any kind.
          </p>
          <p className="text-rekt-muted leading-relaxed">
            The Platform provides links to third-party gaming and casino services (including rektpalace.com). Your use of such services is governed by separate terms. These Terms do not govern your use of rektpalace.com or any affiliated casino platform.
          </p>
        </div>

        {/* Section 1 - Introduction */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">1. Introduction</h2>
        <p className="text-rekt-muted leading-relaxed">
          These Terms of Use (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;you&quot; or &quot;your&quot;) and Meta Bliss Group B.V., a company incorporated in Curaçao, registration number 159718 (&quot;the Company,&quot; &quot;Rekt Markets,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). The Terms govern your use of all Services made available on or through the Platform.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          By accessing the Platform and/or using the Services, you agree that you have read, understood, and accepted these Terms, together with all referenced documents and policies, including the <Link href="/privacy" className="text-rekt-blue hover:underline">Privacy Policy</Link>, <Link href="/cookies" className="text-rekt-blue hover:underline">Cookie Policy</Link>, <Link href="/aml" className="text-rekt-blue hover:underline">AML/KYC Policy</Link>, <Link href="/dmca" className="text-rekt-blue hover:underline">DMCA Guidelines</Link>, <Link href="/trademark" className="text-rekt-blue hover:underline">Trademark Guidelines</Link>, <Link href="/risks" className="text-rekt-blue hover:underline">Risk Disclosures</Link>, and the <Link href="/refund" className="text-rekt-blue hover:underline">Refund and Cancellation Policy</Link>. You acknowledge and agree that you will be bound by these Terms as updated from time to time.
        </p>
        <p className="text-rekt-muted leading-relaxed uppercase font-semibold text-white text-xs">
          BY ACCESSING THE PLATFORM AND USING THE SERVICES, YOU IRREVOCABLY WAIVE YOUR RIGHT TO PARTICIPATE IN A CLASS ACTION OR SIMILAR MASS ACTION IN ANY JURISDICTION AS STATED IN SECTION 16, SUBJECT TO APPLICABLE MANDATORY CONSUMER PROTECTION RIGHTS IN YOUR JURISDICTION. YOU EXPRESSLY AGREE THAT ANY CLAIMS AGAINST THE COMPANY OR ANY AFFILIATE WILL BE SUBJECT TO MANDATORY, BINDING ARBITRATION AS STATED IN SECTION 15, EXCEPT WHERE PROHIBITED BY MANDATORY LAW.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          If you do not understand and accept these Terms in their entirety, you should not use the Platform.
        </p>

        {/* Section 2 - Definitions and Interpretation */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">2. Definitions and Interpretation</h2>
        <p className="text-rekt-muted leading-relaxed">
          In these Terms, the following capitalised terms shall have the meanings set forth below:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-rekt-muted leading-relaxed">
          <li><strong className="text-white">&quot;Applicable Law&quot;</strong> means all relevant laws, regulations, rules, orders, and legal requirements in any jurisdiction applicable to the provision or use of the Platform or Services.</li>
          <li><strong className="text-white">&quot;Bonding Curve Token&quot;</strong> means a Digital Asset created and traded via the Token Launchpad using an automated bonding curve pricing mechanism, where the price is determined algorithmically based on supply.</li>
          <li><strong className="text-white">&quot;CPMM&quot; or &quot;Constant Product Market Maker&quot;</strong> means the automated market maker algorithm embedded in the Platform&apos;s smart contracts that algorithmically executes trades for prediction market Contracts.</li>
          <li><strong className="text-white">&quot;Contract&quot;</strong> means an event-based binary outcome contract available on the Platform&apos;s prediction market.</li>
          <li><strong className="text-white">&quot;Creator Fee&quot;</strong> means the fee (currently 1% of the transaction value on sell-side transactions) collected on Bonding Curve Token transactions and paid to the token creator&apos;s designated wallet address.</li>
          <li><strong className="text-white">&quot;Digital Asset&quot;</strong> means any digitally represented value stored and transferred via distributed ledger technologies, including cryptocurrencies, Bonding Curve Tokens, prediction market Contract positions, and tokenised derivatives.</li>
          <li><strong className="text-white">&quot;Emergency Refund&quot;</strong> means the smart contract mechanism allowing users to reclaim deposited collateral from an unresolved Contract after thirty (30) days from market expiration, as described in Section 6.4.</li>
          <li><strong className="text-white">&quot;Graduation&quot;</strong> means the process by which a Bonding Curve Token transitions from the bonding curve to a decentralised exchange liquidity pool upon meeting predefined thresholds.</li>
          <li><strong className="text-white">&quot;Interface&quot;</strong> means the web application, mobile application, or any other user interface through which you access the Platform, including markets.rektpalace.com.</li>
          <li><strong className="text-white">&quot;Market Owner&quot;</strong> means the blockchain address designated as the owner of a prediction market Contract, with sole authority to resolve the Contract outcome. For Company-created markets, this is a Company-controlled multi-signature (Gnosis Safe) address.</li>
          <li><strong className="text-white">&quot;Platform&quot;</strong> means the Rekt Markets digital platform, including the prediction market, Token Launchpad, and all associated smart contracts, interfaces, and infrastructure.</li>
          <li><strong className="text-white">&quot;Protocol&quot;</strong> means the set of blockchain-based smart contracts deployed on the applicable blockchain network that power the Platform&apos;s prediction markets, Bonding Curve Token creation and trading, and related functions.</li>
          <li><strong className="text-white">&quot;Acknowledgment Jurisdiction&quot;</strong> means any member state of the European Union, the European Economic Area, or the United Kingdom, as described in Section 4.3.</li>
          <li><strong className="text-white">&quot;Prohibited Jurisdiction&quot;</strong> means the United States of America (including all territories and dependencies), Curaçao, and any jurisdiction subject to comprehensive sanctions, including Iran, Syria, Cuba, North Korea, and the Crimea, Donetsk, and Luhansk regions of Ukraine, as described in Section 4.2.</li>
          <li><strong className="text-white">&quot;Prohibited Person&quot;</strong> means any person or entity who resides in, is located in, is incorporated in, has a registered office in, or has their principal place of business in a Prohibited Jurisdiction, or any person acting on behalf of or controlled by such a person.</li>
          <li><strong className="text-white">&quot;Services&quot;</strong> means all tools, features, and offerings provided through the Platform, including prediction market trading, the Token Launchpad, Bonding Curve Token creation and trading, and any related functionality.</li>
          <li><strong className="text-white">&quot;Token Launchpad&quot;</strong> means the Platform feature that allows users to create and launch Bonding Curve Tokens via the Protocol&apos;s token factory smart contracts.</li>
          <li><strong className="text-white">&quot;Wallet&quot;</strong> means the self-hosted cryptocurrency wallet you connect to the Platform to interact with the Services.</li>
        </ul>

        {/* Section 3 - The Platform and Services */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">3. The Platform and Services</h2>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">3.1 Description of the Platform</h3>
        <p className="text-rekt-muted leading-relaxed">
          The Platform provides multiple categories of Services:
        </p>
        <p className="text-rekt-muted leading-relaxed">
          <strong className="text-white">Prediction Markets.</strong> The Platform hosts event-based binary outcome Contracts. Users acquire positions through the embedded CPMM, which algorithmically executes trades on-chain. The Company deploys Contracts via a factory smart contract and designates a Market Owner address with authority to resolve outcomes.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          <strong className="text-white">Token Launchpad.</strong> The Platform provides tools for users to create, launch, and trade Bonding Curve Tokens. A Creator Fee of 1% is collected on sell-side transactions. Upon Graduation, tokens transition to a decentralised exchange liquidity pool.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          <strong className="text-white">Information and Content.</strong> The Platform provides news, data, and information for informational purposes only.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          <strong className="text-white">Third-Party Gaming Links.</strong> The Platform may link to affiliated gaming services (including rektpalace.com), governed by their own separate terms.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">3.2 Smart Contract Execution</h3>
        <p className="text-rekt-muted leading-relaxed">
          Trades executed through the prediction markets are processed by the CPMM smart contract, which algorithmically determines execution and pricing on-chain. Bonding Curve Token transactions are executed by the bonding curve smart contract. The Company is not a counterparty to your trades, does not provide order matching services, and does not hold or transmit orders. All transactions are executed by smart contracts on the applicable blockchain network.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">3.3 Custody Model</h3>
        <p className="text-rekt-muted leading-relaxed">
          <strong className="text-white">Smart-Contract Custodied Assets with Company-Controlled Resolution Authority.</strong> The Company does not take possession or custody of your Wallet or the private keys associated therewith. However, you acknowledge and understand the following:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-rekt-muted leading-relaxed">
          <li>When you deposit collateral into a prediction market Contract or purchase a Bonding Curve Token, the applicable smart contract holds your deposited assets until the Contract is resolved or you sell your position. Each market contract holds its own collateral; there is no commingling of collateral across markets.</li>
          <li>The Market Owner address has authority to resolve prediction market Contracts, which triggers the smart contract&apos;s distribution of collateral. For Company-created markets, the Market Owner key is secured via a Gnosis Safe multi-signature arrangement requiring 2 of 3 authorisations. No single individual can unilaterally resolve a market.</li>
          <li>The Market Owner&apos;s resolution authority constitutes a form of operational control over the timing and outcome-based distribution of deposited assets, even though the Company does not have direct access to or custody of your Wallet.</li>
          <li>Bonding Curve Token reserves are held in the bonding curve smart contract and are not under the Company&apos;s direct control. However, post-Graduation liquidity pool mechanics are governed by the applicable DEX protocol.</li>
        </ul>
        <p className="text-rekt-muted leading-relaxed">
          You are solely responsible for your Wallet and its security. We cannot access your private key, cannot reverse transactions, and cannot be responsible for how you use your Wallet.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">3.4 No Professional Advice; No Offer or Solicitation</h3>
        <p className="text-rekt-muted leading-relaxed">
          Nothing on this Platform constitutes an offer to sell or a solicitation of an offer to buy any security, financial instrument, or investment product in any jurisdiction. None of the information provided on the Platform or through the Services should be construed as professional, investment, legal, or tax advice. The Company is not acting as an investment adviser, broker, or fiduciary. The Terms do not create or impose any fiduciary duties. Before making any financial, legal, or other decisions involving the Services, seek independent professional advice.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">3.5 No Regulatory Approval</h3>
        <p className="text-rekt-muted leading-relaxed">
          No regulatory authority has examined or approved these Terms, any Digital Asset, or any token launched on the Platform. The Platform is not registered with, authorised by, or supervised by any securities regulator, including the US Securities and Exchange Commission (SEC), any EU National Competent Authority, the UK Financial Conduct Authority (FCA), or the Centrale Bank van Curaçao en Sint Maarten (CBCS) as a crypto-asset service provider. The Company is not authorised as a Crypto-Asset Service Provider (CASP) under the EU Markets in Crypto-Assets Regulation (MiCA). The Platform does not constitute a regulated market, multilateral trading facility (MTF), or alternative trading system (ATS).
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">3.6 Blockchain Risks</h3>
        <p className="text-rekt-muted leading-relaxed">
          You should familiarise yourself with risks including smart contract vulnerabilities, front-end vulnerabilities, hacks, phishing, social engineering, cryptoasset volatility, transaction irreversibility, MEV attacks, and network congestion. All network transaction fees are non-refundable and borne entirely by you.
        </p>

        {/* Section 4 - Eligibility */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">4. Eligibility, Jurisdictional Restrictions, and User Responsibility</h2>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">4.1 Eligibility Requirements</h3>
        <p className="text-rekt-muted leading-relaxed">
          To use the Platform and Services, you must:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-rekt-muted leading-relaxed">
          <li>Be at least 18 years of age (or the legal age of majority in your jurisdiction), or a legal entity with full power and authority to enter into these Terms;</li>
          <li>If acting on behalf of an entity, be duly authorised to bind such entity;</li>
          <li>Not be located in, a resident of, or a national of a Prohibited Jurisdiction (as defined below);</li>
          <li>Not be the subject of economic or trade sanctions administered by any governmental authority, including OFAC, the EU, the UN, or the UK;</li>
          <li>Not be included on any list of prohibited or restricted persons maintained by any sanctions authority;</li>
          <li>Not be in contravention of any applicable anti-money laundering or counter-terrorist financing laws.</li>
        </ul>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">4.2 Prohibited Jurisdictions</h3>
        <p className="text-rekt-muted leading-relaxed">
          You are prohibited from accessing, using, or trading on the Platform if you are residing in, a citizen of, organised in, or located in any of the following (collectively, the &quot;Prohibited Jurisdictions&quot;): the United States of America (including all territories and dependencies), Curaçao; or any jurisdiction or territory that is the subject of comprehensive country-wide, territory-wide, or regional sanctions, including but not limited to Iran, Syria, Cuba, North Korea, and the Crimea, Donetsk, and Luhansk regions of Ukraine.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          The Platform enforces geographic restrictions for Prohibited Jurisdictions at the Interface level. The underlying smart contracts do not contain geographic restrictions. Any person in a Prohibited Jurisdiction who interacts with the Protocol by any means, including directly via the smart contracts, is in violation of these Terms.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          You will not use VPN software or any other privacy or anonymisation tool to circumvent the Prohibited Jurisdiction restrictions. Violators may have access terminated and Wallets placed in close-only mode at the Company&apos;s sole discretion.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">4.3 Acknowledgment Jurisdictions</h3>
        <p className="text-rekt-muted leading-relaxed">
          If you access the Platform from a member state of the European Union, the European Economic Area, or the United Kingdom (collectively, &quot;Acknowledgment Jurisdictions&quot;), you will be required to confirm, via a one-time acknowledgment screen, that:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-rekt-muted leading-relaxed">
          <li>You understand that the Company is not authorised as a Crypto-Asset Service Provider (CASP) under the EU Markets in Crypto-Assets Regulation (MiCA) or registered with the UK Financial Conduct Authority (FCA);</li>
          <li>You understand that no regulatory authority has examined, approved, or endorsed the Platform, the Services, or any Digital Asset available on the Platform;</li>
          <li>You understand that Bonding Curve Tokens may constitute securities or regulated financial instruments in your jurisdiction;</li>
          <li>You have independently assessed the legal implications of using the Platform in your jurisdiction; and</li>
          <li>You accept sole responsibility for compliance with all Applicable Laws in your jurisdiction, including MiCA, the EU Prospectus Regulation, national securities laws, and any other relevant legislation.</li>
        </ul>
        <p className="text-rekt-muted leading-relaxed">
          Your acceptance of this acknowledgment is recorded and constitutes your informed consent to use the Platform notwithstanding the regulatory considerations described above. The Company reserves the right to add jurisdictions to the Acknowledgment Jurisdictions list or to reclassify any Acknowledgment Jurisdiction as a Prohibited Jurisdiction at any time.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">4.4 User Responsibility for Legal Compliance</h3>
        <p className="text-rekt-muted leading-relaxed">
          It is your sole responsibility to determine whether the Services available on the Platform are legal in the country of your residence and to comply with all Applicable Laws in your jurisdiction. The Company makes no representations that the Platform or the Services are appropriate, lawful, or available for use in any particular jurisdiction. You access and use the Platform at your own initiative and are solely responsible for compliance with local laws, including securities laws, tax laws, anti-money laundering laws, and consumer protection laws.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          The Company reserves the right to refuse access to users from any jurisdiction at its own discretion, including jurisdictions not listed as Prohibited Jurisdictions or Acknowledgment Jurisdictions.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">4.5 Sanctions Representations</h3>
        <p className="text-rekt-muted leading-relaxed">
          You represent and warrant that for the duration of your use of the Platform, you will not be the subject of economic or trade sanctions, included on any sanctions list, or domiciled in a sanctioned territory. If this ceases to be true, you must immediately cease using the Platform.
        </p>

        {/* Section 5 - Fees */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">5. Fees</h2>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">5.1 Platform Fees</h3>
        <p className="text-rekt-muted leading-relaxed">
          Fees are published on the Platform and may be updated. You agree to pay all applicable fees.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">5.2 Creator Fees</h3>
        <p className="text-rekt-muted leading-relaxed">
          Bonding Curve Tokens include a Creator Fee (currently 1% of sell-side transactions) paid to the token creator&apos;s wallet. The Company makes no guarantees regarding Creator Fee collection or distribution.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">5.3 Prediction Market Fees</h3>
        <p className="text-rekt-muted leading-relaxed">
          Contracts may include protocol fees on CPMM transactions. Fee rates are set at market creation and displayed before transaction confirmation. Actual fees are determined by the smart contract.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">5.4 Network Fees</h3>
        <p className="text-rekt-muted leading-relaxed">
          Blockchain gas fees are paid to network validators, not the Company. They are non-refundable.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">5.5 Fee Amendments</h3>
        <p className="text-rekt-muted leading-relaxed">
          We may adjust fees. Continued use constitutes acceptance. If you disagree, cease use.
        </p>

        {/* Section 6 - Prediction Markets */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">6. Prediction Markets</h2>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">6.1 Contract Creation and Trading</h3>
        <p className="text-rekt-muted leading-relaxed">
          Contracts are created via a factory smart contract deploying individual market contracts. Users trade positions through the embedded CPMM, which determines pricing algorithmically.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">6.2 Contract Resolution</h3>
        <p className="text-rekt-muted leading-relaxed">
          Prediction market Contracts are resolved by the Market Owner, not by a decentralised oracle system. For Company-created markets, the Market Owner is a Company-controlled Gnosis Safe multi-signature address requiring 2 of 3 authorisations. Resolution is initiated by the Market Owner calling the resolve function, which triggers collateral distribution. The Company endeavours to resolve markets accurately and promptly based on pre-defined resolution criteria, but delays or errors may occur. The Company is not liable for resolution disputes. You may contact <a href="mailto:legal@markets.rektpalace.com" className="text-rekt-blue hover:underline">legal@markets.rektpalace.com</a> if you disagree with a resolution, but the Company is under no obligation to reverse or modify it.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">6.3 Slippage and Trade Execution</h3>
        <p className="text-rekt-muted leading-relaxed">
          CPMM trades are subject to slippage. The Platform provides optional slippage tolerance parameters at your discretion. The Company is not responsible for losses from slippage, front-running, MEV extraction, or other on-chain dynamics. The Protocol does not include built-in MEV protection at the smart contract level.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">6.4 Emergency Refund</h3>
        <p className="text-rekt-muted leading-relaxed">
          If a Contract is not resolved within thirty (30) days of expiration, an Emergency Refund mechanism allows users to reclaim collateral pro-rata via the smart contract. This does not require Company action and may not result in full recovery of your original deposit.
        </p>

        {/* Section 7 - Token Launchpad */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">7. Token Launchpad and Bonding Curve Tokens</h2>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">7.1 Token Creation</h3>
        <p className="text-rekt-muted leading-relaxed">
          The Token Launchpad allows users to create Bonding Curve Tokens via the Protocol&apos;s factory smart contracts. The Company does not review, endorse, or vet tokens.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">7.2 Bonding Curve Pricing and Fee Disclosure</h3>
        <p className="text-rekt-muted leading-relaxed">
          Prices are determined algorithmically based on supply. Sell-side transactions incur a 1% Creator Fee, meaning effective sell price is lower than buy price at equivalent supply levels. Understand this before transacting.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">7.3 Graduation</h3>
        <p className="text-rekt-muted leading-relaxed">
          When a token meets predefined thresholds, it graduates to a DEX liquidity pool. Post-graduation pricing differs fundamentally from bonding curve dynamics. Significant price volatility may result.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">7.4 Securities Law Notice</h3>
        <p className="text-rekt-muted leading-relaxed uppercase font-semibold text-white text-xs">
          IMPORTANT: BONDING CURVE TOKENS MAY CONSTITUTE SECURITIES OR REGULATED FINANCIAL INSTRUMENTS IN CERTAIN JURISDICTIONS.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          The speculative nature of Bonding Curve Tokens, including the investment of money to acquire tokens, the pooling of capital on a bonding curve, the expectation of profit from price appreciation, and the reliance on protocol mechanics for graduation and liquidity, may satisfy the criteria for classification as an &quot;investment contract&quot; under the US Howey test, as a &quot;transferable security&quot; under EU law, or as a &quot;security token&quot; or &quot;specified investment&quot; under UK FCA guidance.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          The Platform has not registered with the SEC, any EU National Competent Authority, the FCA, the CBCS, or any other securities or financial services regulator. No regulatory authority has approved or endorsed any token launched on the Platform. Users in jurisdictions where token purchases may constitute securities transactions should not use the Platform.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          <strong className="text-white">Platform vs. Issuer Liability:</strong> The Company provides the technology platform. It is not an issuer, underwriter, distributor, or promoter of any Bonding Curve Token. Token creators bear sole and exclusive responsibility for compliance with securities laws, prospectus requirements, and investor protection obligations in their jurisdiction and in the jurisdictions of their token&apos;s purchasers.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          If a Bonding Curve Token graduates and subsequently trades on third-party decentralised exchanges, this constitutes secondary market activity that may trigger additional regulatory obligations. Neither the Company nor the Platform controls post-graduation secondary market trading.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">7.5 Token Launchpad Risks</h3>
        <p className="text-rekt-muted leading-relaxed">
          Specific risks include:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-rekt-muted leading-relaxed">
          <li>Total loss of the amount used to purchase tokens;</li>
          <li>Asymmetric fee structures creating sell-side disadvantages;</li>
          <li>Post-Graduation price volatility and liquidity loss;</li>
          <li>Token creators abandoning projects;</li>
          <li>Market manipulation by creators or coordinated groups;</li>
          <li>No intrinsic value; highly speculative;</li>
          <li>Smart contract vulnerabilities;</li>
          <li>Classification as securities in some jurisdictions (see Section 7.4);</li>
          <li>No regulatory approval or investor protection scheme applies.</li>
        </ul>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">7.6 Creator Responsibilities</h3>
        <p className="text-rekt-muted leading-relaxed">
          If you create a token, you represent and warrant that: (a) your token does not infringe third-party IP; (b) you will not use Creator Fees for money laundering, terrorist financing, or illegal activities; (c) you will not misrepresent token economics; (d) any public statements are accurate and not misleading; (e) you are solely responsible for determining compliance with Applicable Laws including securities laws; (f) you accept sole issuer-level liability for any token you create.
        </p>

        {/* Section 8 - Your Responsibilities */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">8. Your Responsibilities and Prohibited Conduct</h2>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">8.1 General</h3>
        <p className="text-rekt-muted leading-relaxed">
          You agree to use the Platform only in accordance with these Terms and all Applicable Laws.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">8.2 Prohibited Conduct</h3>
        <p className="text-rekt-muted leading-relaxed">
          You will not:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-rekt-muted leading-relaxed">
          <li>Violate any Applicable Laws;</li>
          <li>Engage in fraud, deception, or misrepresentation;</li>
          <li>Trade on material non-public information in breach of a duty of trust;</li>
          <li>Trade on Contracts where you can influence the underlying event&apos;s outcome;</li>
          <li>Engage in spoofing, front-running, fictitious transactions, cornering, wash trading, or other manipulative trading practices;</li>
          <li>Coordinate to manipulate Contract or token prices;</li>
          <li>Self-deal by creating a market, holding positions, and resolving in your own favour;</li>
          <li>Engage in pump-and-dump schemes or artificial price manipulation;</li>
          <li>Circumvent geographic restrictions, security measures, or access controls (including via VPN);</li>
          <li>Provide false or misleading information;</li>
          <li>Use the Platform for or on behalf of any Prohibited Person;</li>
          <li>Harvest data without authorisation;</li>
          <li>Overburden, damage, or impair the Platform;</li>
          <li>Post defamatory, obscene, harassing, or threatening content;</li>
          <li>Reverse engineer the Interface or Services;</li>
          <li>Use scraping tools, bots, or crawlers in unauthorised ways;</li>
          <li>Introduce malicious software;</li>
          <li>Attack the Platform via DoS/DDoS;</li>
          <li>Spoof IPs or use anonymising proxies to circumvent restrictions;</li>
          <li>Otherwise violate these Terms.</li>
        </ul>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">8.3 Enforcement</h3>
        <p className="text-rekt-muted leading-relaxed">
          We may (i) terminate your access, (ii) place Wallets in close-only mode, (iii) prohibit participation in incentive programs, and (iv) cooperate with law enforcement.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">8.4 Tax Responsibilities</h3>
        <p className="text-rekt-muted leading-relaxed">
          You are solely responsible for all tax obligations arising from your use of the Platform. The Company does not provide tax advice.
        </p>

        {/* Section 9 - Intellectual Property */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">9. Intellectual Property</h2>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">9.1 Company Ownership</h3>
        <p className="text-rekt-muted leading-relaxed">
          The Company or its licensors own all IP in the Platform, Interface, and Services. You receive a personal, limited, revocable, non-exclusive, non-sublicensable, non-transferable licence for personal, non-commercial use.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">9.2 User Content Licence</h3>
        <p className="text-rekt-muted leading-relaxed">
          By providing User Content, you grant a royalty-free, perpetual, irrevocable, non-exclusive, worldwide licence to use, copy, modify, display, publish, and distribute such content for business purposes.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">9.3 Feedback</h3>
        <p className="text-rekt-muted leading-relaxed">
          Feedback becomes the Company&apos;s property. We are not obligated to implement or compensate.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">9.4 DMCA, Trademark, and IP Policies</h3>
        <p className="text-rekt-muted leading-relaxed">
          Our <Link href="/dmca" className="text-rekt-blue hover:underline">DMCA Guidelines</Link> and <Link href="/trademark" className="text-rekt-blue hover:underline">Trademark Guidelines</Link>, published separately, govern copyright and trademark matters on the Platform. Creators must comply with these policies.
        </p>

        {/* Section 10 - Third-Party Services */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">10. Third-Party Services</h2>
        <p className="text-rekt-muted leading-relaxed">
          The Platform may link to or integrate with third-party services (wallet providers, blockchain networks, DEXs, gaming platforms). We have no control over Third-Party Services and accept no responsibility for them. Use is at your own risk.
        </p>

        {/* Section 11 - Modifications */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">11. Modifications</h2>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">11.1 To the Terms</h3>
        <p className="text-rekt-muted leading-relaxed">
          We may modify these Terms at any time. Modified Terms are effective upon posting. Continued use constitutes acceptance.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">11.2 To the Platform and Services</h3>
        <p className="text-rekt-muted leading-relaxed">
          We may modify, suspend, or discontinue any portion at any time without notice. We are not liable for resulting losses.
        </p>

        {/* Section 12 - Termination */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">12. Termination and Suspension</h2>
        <p className="text-rekt-muted leading-relaxed">
          We may at any time terminate, suspend, or restrict your access for any reason, including where you are ineligible, we suspect fraud, you breach these Terms, or Applicable Law requires it. Upon termination, open positions may be closed. Sections 2, 5, 7.4, 8-10, 13-17 survive termination.
        </p>

        {/* Section 13 - Refund */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">13. Refund and Cancellation Policy</h2>
        <p className="text-rekt-muted leading-relaxed">
          All transactions on the Platform are final and non-refundable. Blockchain transactions are irreversible once confirmed. The Company cannot reverse, cancel, or modify any transaction after broadcast. This includes prediction market Contract positions, Bonding Curve Token purchases, Creator Fees, and network fees.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          The Emergency Refund mechanism (Section 6.4) is the sole remedy for unresolved prediction market Contracts and operates automatically via smart contract.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          If you are a consumer in the European Union, you acknowledge that digital content and services supplied via the Platform are supplied immediately upon your initiation of a transaction, and you expressly consent to begin performance before the expiry of any applicable cancellation period. In accordance with Article 16(m) of the EU Consumer Rights Directive (2011/83/EU), you acknowledge that you lose your right of withdrawal once performance has begun. If mandatory consumer protection laws in your jurisdiction provide cancellation or refund rights that cannot be waived, those rights apply notwithstanding this section.
        </p>

        {/* Section 14 - Indemnification */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">14. Indemnification</h2>
        <p className="text-rekt-muted leading-relaxed">
          You agree to defend, indemnify, and hold harmless the Company Parties from all Losses arising from: (i) your use of the Platform; (ii) breach of these Terms; (iii) disputes with third parties; (iv) IP infringement; (v) User Content; (vi) tokens you create; (vii) Contracts you create. You irrevocably release the Company from claims arising from user-to-user disputes.
        </p>

        {/* Section 15 - Disclaimers */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">15. Disclaimers and Limitations of Liability</h2>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">15.1 No Warranties</h3>
        <p className="text-rekt-muted leading-relaxed uppercase font-semibold text-white text-xs">
          THE PLATFORM AND SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTY. THE COMPANY DISCLAIMS ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR PURPOSE, AND NON-INFRINGEMENT.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">15.2 Limitations of Liability</h3>
        <p className="text-rekt-muted leading-relaxed uppercase font-semibold text-white text-xs">
          TO THE EXTENT PERMITTED BY APPLICABLE LAW, THE COMPANY WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES. THE COMPANY&apos;S AGGREGATE LIABILITY UNDER THESE TERMS WILL NOT EXCEED THE GREATER OF (A) USD $100 OR (B) THE TOTAL FEES PAID BY YOU TO THE COMPANY IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          <strong className="text-white">Jurisdiction-specific override:</strong> Nothing in these Terms excludes or limits liability that cannot be excluded or limited under mandatory Applicable Law in your jurisdiction, including liability for death or personal injury caused by negligence, for fraud or fraudulent misrepresentation, or any other liability that cannot be lawfully excluded.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">15.3 Limitation Period</h3>
        <p className="text-rekt-muted leading-relaxed">
          Claims must be brought within one (1) year after the cause of action arose, except where mandatory Applicable Law provides a longer period.
        </p>

        {/* Section 16 - Governing Law */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">16. Governing Law and Dispute Resolution</h2>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">16.1 Governing Law</h3>
        <p className="text-rekt-muted leading-relaxed">
          These Terms are governed by the laws of Curaçao, without regard to conflict of laws provisions.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">16.2 Informal Resolution</h3>
        <p className="text-rekt-muted leading-relaxed">
          Before formal proceedings, you must notify the Company at <a href="mailto:legal@markets.rektpalace.com" className="text-rekt-blue hover:underline">legal@markets.rektpalace.com</a> with &quot;Complaint Resolution Process&quot; in the subject, including: wallet address, name, detailed explanation, dates, and remedy sought. After thirty (30) calendar days without resolution, either Party may proceed to arbitration.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">16.3 Binding Arbitration</h3>
        <p className="text-rekt-muted leading-relaxed">
          Disputes shall be determined by binding arbitration administered by the International Chamber of Commerce (ICC) under its 2021 Arbitration Rules (or then-current rules). Seat: Willemstad, Curaçao. Single arbitrator with blockchain/financial services experience. Language: English. Proceedings are confidential unless legally required otherwise.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">16.4 Arbitration Cost Allocation</h3>
        <p className="text-rekt-muted leading-relaxed">
          For individual claims where the amount in dispute is USD $10,000 or less, the Company will advance the ICC filing fees and arbitrator fees. The arbitrator may reallocate costs in the final award. For claims above $10,000, costs are allocated pursuant to the ICC Rules.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">16.5 Small Claims Court</h3>
        <p className="text-rekt-muted leading-relaxed">
          Either Party may bring an individual action in a small claims court of competent jurisdiction for claims within the court&apos;s jurisdictional limit, as an alternative to arbitration.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">16.6 Class Action Waiver</h3>
        <p className="text-rekt-muted leading-relaxed uppercase font-semibold text-white text-xs">
          ALL DISPUTES SHALL BE RESOLVED SOLELY ON AN INDIVIDUAL BASIS. YOU MAY NOT PROCEED AS A CLASS REPRESENTATIVE OR MEMBER OF ANY CLASS, COLLECTIVE, OR REPRESENTATIVE ACTION.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          <strong className="text-white">EU/UK Consumer Override:</strong> If you are a consumer in the European Union or United Kingdom, nothing in this Section overrides your mandatory rights under the EU Representative Actions Directive (2020/1828), the Unfair Contract Terms Directive (93/13/EEC), the UK Consumer Rights Act 2015, or any other mandatory consumer protection legislation in your jurisdiction. To the extent any provision of this Section is unenforceable under mandatory consumer protection law, that provision shall not apply to you.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">16.7 Opt-Out</h3>
        <p className="text-rekt-muted leading-relaxed">
          You may opt out of arbitration by written notice to <a href="mailto:legal@markets.rektpalace.com" className="text-rekt-blue hover:underline">legal@markets.rektpalace.com</a> within thirty (30) days, including your wallet address, full name, email, and opt-out statement.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">16.8 IP Disputes</h3>
        <p className="text-rekt-muted leading-relaxed">
          IP infringement claims are not subject to mandatory arbitration and may be brought in court with injunctive relief.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">16.9 Survival</h3>
        <p className="text-rekt-muted leading-relaxed">
          The arbitration provisions survive termination.
        </p>

        {/* Section 17 - Additional Information */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">17. Additional Information and Compliance</h2>
        <p className="text-rekt-muted leading-relaxed">
          The Company may request additional information to confirm your eligibility or comply with Applicable Laws. Non-compliance may result in access termination.
        </p>

        {/* Section 18 - Security */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">18. Security</h2>
        <p className="text-rekt-muted leading-relaxed">
          You are responsible for Wallet security, device security, access credentials, antivirus software, and monitoring for unauthorised activity. Notify us immediately of any suspected breach. We are not liable for losses from your security failures.
        </p>

        {/* Section 19 - Data Protection */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">19. Data Protection</h2>
        <p className="text-rekt-muted leading-relaxed">
          Our collection and use of personal data is governed by our <Link href="/privacy" className="text-rekt-blue hover:underline">Privacy Policy</Link> and <Link href="/cookies" className="text-rekt-blue hover:underline">Cookie Policy</Link>, published separately. By using the Platform, you consent to the processing of your personal data as described therein. You acknowledge that the Platform may process personal data in accordance with Applicable Law, including the General Data Protection Regulation (EU) 2016/679, the Curaçao data protection framework, and other applicable privacy legislation.
        </p>

        {/* Section 20 - General Terms */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">20. General Terms</h2>
        <p className="text-rekt-muted leading-relaxed">
          <strong className="text-white">Entire Agreement.</strong> These Terms and all referenced documents constitute the entire agreement.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          <strong className="text-white">No Relationship.</strong> No partnership, joint venture, employment, or agency relationship is created.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          <strong className="text-white">Assignment.</strong> You may not assign without consent. The Company may assign freely.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          <strong className="text-white">Waiver.</strong> Failure to enforce does not waive. Waivers must be in writing.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          <strong className="text-white">Severability.</strong> Invalid provisions are severed; remainder continues in force.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          <strong className="text-white">Remedies.</strong> Rights and remedies are cumulative.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          <strong className="text-white">Communications.</strong> We may contact you via email, Telegram, or social media.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          <strong className="text-white">Language.</strong> English prevails over translations.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          <strong className="text-white">Force Majeure.</strong> Not liable for causes beyond reasonable control.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          <strong className="text-white">Recording.</strong> We may record communications.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          <strong className="text-white">Third-Party Rights.</strong> These Terms do not create third-party beneficiary rights.
        </p>

        {/* Section 21 - Contact */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">21. Contact</h2>
        <p className="text-rekt-muted leading-relaxed">
          Email: <a href="mailto:legal@markets.rektpalace.com" className="text-rekt-blue hover:underline">legal@markets.rektpalace.com</a>
        </p>
        <p className="text-rekt-muted leading-relaxed">
          Support: <a href="mailto:support@markets.rektpalace.com" className="text-rekt-blue hover:underline">support@markets.rektpalace.com</a>
        </p>
        <p className="text-rekt-muted leading-relaxed">
          Registered Office: Korporaalweg 10, Willemstad, Curaçao
        </p>

      </div>
    </div>
  )
}
