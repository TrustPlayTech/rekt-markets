import Link from 'next/link'

export const metadata = { title: 'Risk Disclosures and Disclaimers - Rekt Markets' }

export default function RisksPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-white mb-2">Risk Disclosures and Disclaimers</h1>
      <p className="text-sm text-rekt-muted mb-8">Last Updated: 23 March 2026</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-6">

        <p className="text-rekt-muted leading-relaxed">
          By using the Platform, you acknowledge you have read and accepted these disclosures. Read this in its entirety before using the Platform.
        </p>

        {/* Section 1 */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">1. General Risks</h2>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">1.1 No Investment Advice</h3>
        <p className="text-rekt-muted leading-relaxed">
          The Company is not a broker, intermediary, agent, advisor, or fiduciary. No communication from the Company or through the Platform constitutes financial, investment, legal, or tax advice. You are solely responsible for your financial decisions. You should consult qualified professionals before making any decisions related to digital assets, prediction markets, or tokens.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">1.2 Volatility and Loss</h3>
        <p className="text-rekt-muted leading-relaxed">
          Digital Asset values can fluctuate significantly over short periods of time. You may lose your entire investment. Past performance is not indicative of future results. No representation or guarantee is made regarding future value, returns, or price stability of any Digital Asset accessible through the Platform.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">1.3 Regulatory Uncertainty</h3>
        <p className="text-rekt-muted leading-relaxed">
          Digital assets, prediction markets, and token launch platforms operate in rapidly evolving regulatory environments. Regulatory changes could materially affect the Platform, Services, or Digital Asset values. New or amended laws, regulations, or enforcement actions in any jurisdiction could restrict or prohibit activities currently permitted on the Platform, require changes to Platform functionality, or affect the legal status of Digital Assets. You are solely responsible for determining compliance with Applicable Laws in your jurisdiction.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">1.4 Tax Liability</h3>
        <p className="text-rekt-muted leading-relaxed">
          You are solely responsible for all tax obligations arising from your use of the Platform, including but not limited to income tax, capital gains tax, value-added tax, and any other applicable taxes. The tax treatment of Digital Assets, prediction market positions, and token transactions varies by jurisdiction and is subject to change. The Company does not provide tax advice and does not withhold taxes on your behalf.
        </p>

        {/* Section 2 */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">2. Blockchain and Smart Contract Risks</h2>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">2.1 Smart Contract Vulnerabilities</h3>
        <p className="text-rekt-muted leading-relaxed">
          Smart contracts may contain bugs, vulnerabilities, or exploitable flaws that could result in loss of funds. Code is immutable once deployed. The Company engages in security audits but cannot guarantee the absence of vulnerabilities. Even audited smart contracts may contain undiscovered flaws. You interact with smart contracts entirely at your own risk.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">2.2 Transaction Irreversibility</h3>
        <p className="text-rekt-muted leading-relaxed">
          Blockchain transactions are irreversible once confirmed on the network. If you send Digital Assets to an incorrect address, interact with a malicious contract, or execute a transaction in error, the Company has no ability to reverse, cancel, or recover the transaction. Errors cannot be corrected by the Company. You are solely responsible for verifying all transaction details before confirming.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">2.3 Network Risks</h3>
        <p className="text-rekt-muted leading-relaxed">
          Blockchain networks may experience congestion, delays, forks, reorganisations, 51% attacks, or other disruptions that could affect your ability to transact or the finality of transactions. Gas fees fluctuate based on network demand and may be substantial relative to the value of your transaction. The Company does not control blockchain networks and is not responsible for any losses resulting from network disruptions or fee volatility.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">2.4 MEV and Front-Running</h3>
        <p className="text-rekt-muted leading-relaxed">
          Transactions submitted to public blockchain networks may be visible in the mempool prior to confirmation, exposing them to Maximal Extractable Value (MEV) attacks, front-running, and sandwich attacks. Sophisticated actors may exploit pending transactions for profit at your expense. The Protocol does not include built-in MEV protection at the smart contract level. Slippage tolerance parameters are optional and user-configured. The Company is not responsible for losses attributable to MEV extraction or front-running.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">2.5 Wallet Security</h3>
        <p className="text-rekt-muted leading-relaxed">
          You are solely responsible for Wallet security, including safeguarding your private keys, seed phrases, and access credentials. Loss of private keys means permanent loss of all assets in that Wallet. The Company does not have access to your Wallet credentials and cannot recover lost funds. You should implement appropriate security measures, including hardware wallets, strong passwords, and two-factor authentication where available.
        </p>

        {/* Section 3 */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">3. Prediction Market Risks</h2>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">3.1 Binary Outcome Risk</h3>
        <p className="text-rekt-muted leading-relaxed">
          Contract positions are binary. You lose your entire position if the outcome resolves against you. There are no partial payouts for losing positions. Each prediction market Contract resolves to one of two possible outcomes, and only holders of the winning outcome token receive a payout. You should only risk amounts you can afford to lose entirely.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">3.2 Resolution Risk</h3>
        <p className="text-rekt-muted leading-relaxed">
          Contracts are resolved by the Market Owner, a Company-controlled Gnosis Safe multi-signature address. There is no decentralised oracle system. Resolution depends on the Market Owner correctly and timely calling the resolve function on the smart contract. Delays or errors may occur. The Market Owner key is secured via a <strong className="text-white">Gnosis Safe multi-signature arrangement requiring 2 of 3 authorisations</strong>. While this multi-signature structure reduces single points of failure, it does not eliminate the risk of incorrect or delayed resolution.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">3.3 Emergency Refund</h3>
        <p className="text-rekt-muted leading-relaxed">
          If a market is not resolved within 30 days of expiration, the Emergency Refund mechanism is activated, allowing users to reclaim their collateral on a pro-rata basis. The Emergency Refund may not result in full recovery of your original investment, as the refund amount is calculated based on the proportion of outcome tokens held relative to total collateral in the Contract.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">3.4 AMM and Liquidity Risk</h3>
        <p className="text-rekt-muted leading-relaxed">
          The Constant Product Market Maker (CPMM) determines pricing algorithmically based on the ratio of outcome tokens in the liquidity pool. Low liquidity markets may have significant slippage, meaning the price you receive may differ materially from the displayed price. There is no guarantee of liquidity at any price level. Large trades relative to pool size will experience disproportionate price impact.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">3.5 Self-Dealing Risk</h3>
        <p className="text-rekt-muted leading-relaxed">
          The architecture of the prediction market smart contracts permits the same address to create a market, hold positions in that market, and resolve it. The Terms of Service prohibit this conduct, but the smart contracts do not technically prevent it on-chain. Exercise appropriate caution when participating in markets, and consider the identity and reputation of the Market Owner.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">3.6 Collateral Segregation</h3>
        <p className="text-rekt-muted leading-relaxed">
          Each prediction market Contract holds its own collateral in a separate smart contract. There is no commingling of collateral across markets. However, all markets use the same factory contract for deployment, meaning a vulnerability in the factory contract could theoretically affect multiple markets. The factory contract has been audited, but this does not eliminate the risk of undiscovered vulnerabilities.
        </p>

        {/* Section 4 */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">4. Token Launchpad and Bonding Curve Token Risks</h2>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">4.1 No Intrinsic Value</h3>
        <p className="text-rekt-muted leading-relaxed">
          Bonding Curve Tokens have no intrinsic value. They are not backed by any asset, revenue stream, or enterprise. Tokens do not represent equity, ownership, governance rights, dividends, or revenue entitlement in any entity. The price of a Bonding Curve Token is determined solely by the mathematical bonding curve function and market demand. There is no floor price, asset backing, or redemption guarantee.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">4.2 Asymmetric Fee Structure</h3>
        <p className="text-rekt-muted leading-relaxed">
          Sell-side transactions on the bonding curve incur a 1% Creator Fee, which is deducted from the sale proceeds and paid to the token creator. Breaking even on a round-trip trade (buying and then selling the same amount of tokens) requires the price to increase by at least the fee amount. This fee structure creates an inherent disadvantage for short-term trading.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">4.3 Graduation Risk</h3>
        <p className="text-rekt-muted leading-relaxed">
          When a Bonding Curve Token reaches the Graduation Threshold, it transitions from the bonding curve to a decentralised exchange (DEX) liquidity pool. Post-graduation pricing differs fundamentally from bonding curve dynamics and is determined by open market trading. You may experience sharp price declines, reduced liquidity, or inability to sell at expected prices following graduation. There is no guarantee that any token will reach graduation.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">4.4 Creator Risk</h3>
        <p className="text-rekt-muted leading-relaxed">
          Token creators may abandon projects, rug-pull, misrepresent token economics, or manipulate markets. The Company does not vet, endorse, or guarantee the legitimacy, quality, or intentions of any token or token creator. Anyone can create a token through the Token Launchpad. Conduct your own due diligence before purchasing any Bonding Curve Token.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">4.5 Market Manipulation</h3>
        <p className="text-rekt-muted leading-relaxed">
          Token markets may be subject to pump-and-dump schemes, wash trading, and coordinated manipulation. The smart contracts do not prevent manipulative trading on-chain. Small-cap tokens with limited liquidity are particularly vulnerable to price manipulation. The Company monitors for suspicious activity but cannot guarantee that markets are free from manipulation.
        </p>

        {/* Section 5 */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">5. Securities Law Notice</h2>

        <div className="rounded-lg border border-yellow-600/30 bg-yellow-900/10 p-4 mb-4">
          <p className="text-yellow-400 font-bold uppercase leading-relaxed">
            THIS SECTION CONTAINS IMPORTANT INFORMATION ABOUT THE REGULATORY STATUS OF BONDING CURVE TOKENS AND THE PLATFORM. READ IT CAREFULLY.
          </p>
        </div>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">5.1 Potential Securities Classification</h3>
        <p className="text-rekt-muted leading-relaxed">
          Bonding Curve Tokens created via the Token Launchpad may constitute securities or regulated financial instruments in certain jurisdictions. The legal classification of tokens depends on the specific facts and circumstances of each token, including its features, the manner of its distribution, and the expectations of purchasers. The Company makes no determination regarding the legal classification of any token created through the Token Launchpad. You are solely responsible for assessing whether the purchase, sale, or holding of any token complies with Applicable Laws in your jurisdiction.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">5.2 United States Law (Howey Test)</h3>
        <p className="text-rekt-muted leading-relaxed">
          Under United States federal securities law, a digital asset may be classified as a security if it satisfies the test established in <em>SEC v. W.J. Howey Co.</em>, 328 U.S. 293 (1946). The Howey Test evaluates whether a transaction involves: (i) an investment of money; (ii) in a common enterprise; (iii) with a reasonable expectation of profits; (iv) derived from the efforts of others. Bonding Curve Tokens created through the Token Launchpad may satisfy one or more prongs of the Howey Test. In particular, purchasers may invest money (cryptocurrency) into a common enterprise (the bonding curve pool), with an expectation of profits (token price appreciation), potentially derived from the efforts of others (the token creator or the Platform). The Platform has not registered with the United States Securities and Exchange Commission (SEC) as a securities exchange, broker-dealer, or alternative trading system. No tokens created through the Token Launchpad have been registered under the Securities Act of 1933. <strong className="text-white">The United States and its territories are Prohibited Jurisdictions. Users located in or subject to the jurisdiction of the United States must not use the Platform.</strong>
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">5.3 European Union Law (MiCA and Prospectus Regulation)</h3>
        <p className="text-rekt-muted leading-relaxed">
          The European Union&apos;s Markets in Crypto-Assets Regulation (MiCA), Regulation (EU) 2023/1114, establishes a comprehensive regulatory framework for crypto-asset service providers (CASPs). Under MiCA, entities offering crypto-assets to the public or seeking admission to trading must publish a crypto-asset white paper and comply with conduct, disclosure, and prudential requirements. The Company has not obtained authorisation as a CASP under MiCA. Additionally, if any Bonding Curve Token were classified as a transferable security within the meaning of the Prospectus Regulation (EU) 2017/1129, its public offering would require a prospectus approved by a competent authority. No such prospectus has been prepared or approved. The Digital Operational Resilience Act (DORA), Regulation (EU) 2022/2554, imposes additional ICT risk management and incident reporting requirements on financial entities and their critical third-party service providers. <strong className="text-white">Key EU Member States, including but not limited to France, Germany, Italy, Spain, and the Netherlands, are Prohibited Jurisdictions.</strong>
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">5.4 United Kingdom Law (FCA Framework)</h3>
        <p className="text-rekt-muted leading-relaxed">
          The United Kingdom Financial Conduct Authority (FCA) classifies cryptoassets into categories including security tokens, e-money tokens, and unregulated tokens. If a Bonding Curve Token exhibits characteristics of a security token (i.e., it provides rights or obligations similar to specified investments under the Financial Services and Markets Act 2000 (Regulated Activities) Order 2001), it would fall within the FCA&apos;s regulatory perimeter. The issuance, promotion, and trading of security tokens in the UK requires FCA authorisation. The Company has not obtained FCA authorisation. Additionally, the FCA&apos;s financial promotion rules restrict the communication of invitations or inducements to engage in investment activity to UK consumers. <strong className="text-white">The United Kingdom is a Prohibited Jurisdiction.</strong>
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">5.5 Curacao Law</h3>
        <p className="text-rekt-muted leading-relaxed">
          The Company is incorporated in Curacao. Under Curacao&apos;s National Ordinance on the Supervision of Securities Markets (<em>Landsverordening toezicht effectenverkeer</em>) and other applicable local securities legislation, the offering of securities to the public may require registration or authorisation from the Central Bank of Curacao and Sint Maarten (CBCS). The Company has assessed its activities under applicable Curacao law and operates the Platform as a technology provider. The Company does not issue, underwrite, or make markets in securities. However, the regulatory framework in Curacao for digital assets and token platforms continues to evolve, and future regulatory developments may affect the Platform&apos;s operations or require additional authorisations.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">5.6 No Offer or Solicitation</h3>
        <p className="text-rekt-muted leading-relaxed uppercase font-semibold">
          NOTHING ON THIS PLATFORM CONSTITUTES AN OFFER TO SELL, A SOLICITATION OF AN OFFER TO BUY, OR A RECOMMENDATION OF ANY SECURITY, FINANCIAL INSTRUMENT, OR INVESTMENT PRODUCT. THE PLATFORM DOES NOT FACILITATE SECURITIES OFFERINGS. THE COMPANY DOES NOT PROVIDE INVESTMENT ADVISORY, BROKERAGE, OR DEALING SERVICES. NO REGULATORY AUTHORITY HAS REVIEWED, APPROVED, OR ENDORSED THE PLATFORM, ANY TOKEN, OR ANY CONTENT ON THE PLATFORM. ANY REPRESENTATION TO THE CONTRARY IS A CRIMINAL OFFENCE.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">5.7 Platform vs. Issuer Liability</h3>
        <p className="text-rekt-muted leading-relaxed">
          The Company provides the technology infrastructure for the Token Launchpad. The Company does not issue, create, sponsor, or endorse any Bonding Curve Token. Each token is created by a third-party token creator who deploys the token through the Platform&apos;s smart contracts. The token creator, not the Company, is the issuer of the token for all legal and regulatory purposes. The Company bears no liability for the actions, omissions, representations, or obligations of any token creator.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">5.8 Secondary Market Activity</h3>
        <p className="text-rekt-muted leading-relaxed">
          Following graduation, Bonding Curve Tokens may trade on decentralised exchanges (DEXs) and other secondary market venues outside the Platform. The Company has no control over secondary market trading activity. Secondary market trading may be subject to additional regulatory requirements, including securities laws, market conduct rules, and anti-manipulation provisions, depending on the jurisdiction. You are solely responsible for ensuring that your secondary market activity complies with Applicable Laws.
        </p>

        {/* Section 6 */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">6. Custody Model Disclosure</h2>

        <div className="rounded-lg border border-rekt-border bg-rekt-card/50 p-4 mb-4">
          <p className="text-white font-semibold leading-relaxed">
            Classification: Smart-contract custodied assets with Company-controlled resolution authority.
          </p>
        </div>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">6.1 User Wallet Control</h3>
        <p className="text-rekt-muted leading-relaxed">
          Users maintain sole control of their Wallets and private keys at all times. The Company does not hold, custody, or have access to user funds or Wallet credentials. All interactions with the Platform are initiated by the user through their own Wallet. The Company cannot freeze, seize, or transfer user funds held in user Wallets.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">6.2 Smart Contract Collateral</h3>
        <p className="text-rekt-muted leading-relaxed">
          Collateral deposited into prediction market Contracts and bonding curve pools is held by the respective smart contracts, not by the Company. Smart contract-held collateral is governed by the immutable logic of the deployed code. The Company cannot unilaterally withdraw, redirect, or modify collateral held in smart contracts, except through the designated resolution or emergency refund functions.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">6.3 Market Owner Resolution Authority</h3>
        <p className="text-rekt-muted leading-relaxed">
          The Market Owner holds the authority to resolve prediction market Contracts by calling the resolve function on the smart contract. The Market Owner is a Company-controlled address secured via a <strong className="text-white">Gnosis Safe multi-signature arrangement requiring 2 of 3 authorisations</strong>. This means that no single individual can unilaterally resolve a market; at least two of three authorised signers must approve the resolution transaction. This multi-signature structure provides a degree of operational security and internal checks, but does not constitute an independent or decentralised resolution mechanism.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">6.4 Regulatory Classification</h3>
        <p className="text-rekt-muted leading-relaxed">
          The custody model described above may be subject to varying regulatory classifications depending on the jurisdiction. Under <strong className="text-white">MiCA</strong> (EU), the provision of custody and administration of crypto-assets on behalf of clients is a regulated crypto-asset service requiring CASP authorisation. The Company&apos;s model, where users maintain control of their own Wallets and smart contracts hold collateral, may not constitute custody under MiCA, but this interpretation has not been confirmed by regulatory authority. Under <strong className="text-white">FinCEN</strong> (US) guidance, persons who accept and transmit value in convertible virtual currency may be classified as money transmitters. Under the <strong className="text-white">FCA</strong> (UK) framework, the holding of cryptoassets on behalf of customers constitutes a regulated activity. The Company&apos;s custody model has been designed to minimise regulatory classification as a custodian, but regulatory authorities may reach different conclusions.
        </p>

        {/* Section 7 */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">7. Platform and Operational Risks</h2>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">7.1 Geographic Restrictions</h3>
        <p className="text-rekt-muted leading-relaxed">
          The Platform is not available in Prohibited Jurisdictions, including but not limited to the United States, United Kingdom, France, Germany, Italy, Spain, the Netherlands, and other jurisdictions specified in the Terms of Service. The Company implements geographic restrictions through VPN detection, IP geolocation, and other measures, but these measures are not infallible. You are solely responsible for ensuring that your access to and use of the Platform complies with the laws of your jurisdiction.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">7.2 Interface Risk</h3>
        <p className="text-rekt-muted leading-relaxed">
          The Company provides a web-based Interface to access the underlying Protocol. The Interface may contain errors, display inaccurate or delayed data, or experience downtime due to maintenance, technical issues, or external factors. Transactions may fail or produce unexpected results due to Interface errors. The Interface is not the Protocol; the Protocol continues to operate on the blockchain regardless of Interface availability. The Company is not liable for any losses resulting from Interface errors, downtime, or discrepancies between the Interface display and actual on-chain state.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">7.3 Third-Party Dependencies</h3>
        <p className="text-rekt-muted leading-relaxed">
          The Platform relies on third-party infrastructure and services, including blockchain networks, RPC providers, hosting services, domain registrars, and wallet providers. The failure, disruption, or compromise of any third-party service may adversely affect the availability, functionality, or security of the Platform. The Company is not responsible for the acts or omissions of third-party service providers.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">7.4 Hacking and Cyberattack Risk</h3>
        <p className="text-rekt-muted leading-relaxed">
          Despite the Company&apos;s security measures, the Platform, its smart contracts, and its infrastructure may be targeted by hackers, cybercriminals, or malicious actors. Attacks may include but are not limited to smart contract exploits, phishing attacks, DNS hijacking, social engineering, DDoS attacks, and supply chain attacks. The Company cannot guarantee the security of the Platform and is not responsible for any losses resulting from cyberattacks or security breaches.
        </p>

        {/* Section 8 */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">8. Third-Party and Cross-Platform Risks</h2>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">8.1 Casino and Gaming Services</h3>
        <p className="text-rekt-muted leading-relaxed">
          The Company or its affiliates may operate casino and gaming services under the Rekt brand or related brands. These casino and gaming services are separate and distinct from the Rekt Markets prediction market and token launchpad platform. Different terms of service, risk profiles, and regulatory frameworks apply. Your use of casino and gaming services is governed by the applicable terms for those services. The Company is not responsible for any losses incurred on casino and gaming platforms, and casino and gaming balances are not interchangeable with Rekt Markets positions.
        </p>

        <h3 className="text-lg font-semibold text-white mt-6 mb-2">8.2 Linked Third-Party Services</h3>
        <p className="text-rekt-muted leading-relaxed">
          The Platform may contain links to or integrations with third-party websites, applications, or services. These third-party services are not controlled by the Company, and the Company is not responsible for their content, accuracy, availability, or security. Your use of third-party services is at your own risk and subject to the terms and conditions of those services. The inclusion of a link or integration does not imply endorsement by the Company.
        </p>

        {/* Section 9 */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">9. Acknowledgment</h2>

        <div className="rounded-lg border border-rekt-border bg-rekt-card/50 p-4">
          <p className="text-rekt-muted leading-relaxed uppercase text-sm font-semibold">
            BY USING THE PLATFORM, YOU EXPRESSLY ACKNOWLEDGE AND AGREE THAT:
          </p>
          <ol className="list-decimal pl-5 space-y-2 mt-4 text-rekt-muted text-sm uppercase">
            <li>YOU HAVE READ, UNDERSTOOD, AND ACCEPTED THESE RISK DISCLOSURES IN THEIR ENTIRETY.</li>
            <li>YOU UNDERSTAND THAT DIGITAL ASSETS, PREDICTION MARKETS, AND BONDING CURVE TOKENS INVOLVE SUBSTANTIAL RISK OF LOSS, INCLUDING THE POTENTIAL LOSS OF YOUR ENTIRE INVESTMENT.</li>
            <li>YOU ARE SOLELY RESPONSIBLE FOR YOUR FINANCIAL DECISIONS AND HAVE NOT RELIED ON ANY ADVICE, RECOMMENDATION, OR REPRESENTATION FROM THE COMPANY.</li>
            <li>YOU UNDERSTAND THAT SMART CONTRACTS ARE EXPERIMENTAL TECHNOLOGY AND MAY CONTAIN VULNERABILITIES THAT COULD RESULT IN LOSS OF FUNDS.</li>
            <li>YOU UNDERSTAND THAT PREDICTION MARKET CONTRACTS ARE RESOLVED BY A COMPANY-CONTROLLED MULTI-SIGNATURE ADDRESS AND NOT BY A DECENTRALISED ORACLE.</li>
            <li>YOU UNDERSTAND THAT BONDING CURVE TOKENS HAVE NO INTRINSIC VALUE AND MAY CONSTITUTE SECURITIES IN CERTAIN JURISDICTIONS.</li>
            <li>YOU UNDERSTAND THAT THE COMPANY DOES NOT PROVIDE CUSTODY SERVICES AND THAT YOU ARE SOLELY RESPONSIBLE FOR YOUR WALLET SECURITY.</li>
            <li>YOU HAVE DETERMINED THAT YOUR USE OF THE PLATFORM COMPLIES WITH ALL APPLICABLE LAWS IN YOUR JURISDICTION.</li>
            <li>YOU ARE NOT LOCATED IN, INCORPORATED IN, OR A CITIZEN OR RESIDENT OF A PROHIBITED JURISDICTION.</li>
            <li>YOU ACCEPT FULL RESPONSIBILITY FOR ALL RISKS ASSOCIATED WITH YOUR USE OF THE PLATFORM AND AGREE THAT THE COMPANY SHALL NOT BE LIABLE FOR ANY LOSSES YOU MAY INCUR.</li>
          </ol>
          <p className="text-white font-bold uppercase mt-6 text-sm leading-relaxed">
            IF YOUR USE OF THE PLATFORM IS PROHIBITED OR RESTRICTED BY APPLICABLE LAW, YOU MUST NOT ACCESS OR USE THE PLATFORM.
          </p>
        </div>

      </div>

      <div className="mt-8 pt-6 border-t border-rekt-border">
        <Link href="/" className="text-sm text-rekt-blue hover:underline">&larr; Back to Home</Link>
      </div>
    </div>
  )
}
