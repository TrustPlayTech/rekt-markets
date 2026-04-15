export const metadata = { title: 'DMCA Guidelines - Rekt Markets' }

export default function DmcaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-white mb-2">DMCA Guidelines</h1>
      <p className="text-sm text-rekt-muted mb-8">Last Updated: 23 March 2026</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-6">

        <p className="text-rekt-muted leading-relaxed">
          Rekt Markets respects intellectual property rights and complies with the Digital Millennium Copyright Act (&quot;DMCA&quot;). When we identify infringing content, we respond by removing or disabling access to the identified content, including tokens, user-generated Digital Assets, and associated materials on our Platform.
        </p>
        <p className="text-rekt-muted leading-relaxed">
          Rekt Markets does not adjudicate allegations of copyright infringement. The DMCA requires Rekt Markets to act as an intermediary. Any dispute is solely between the rightsholder and the relevant creator(s).
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">Reporting Copyright Infringement</h2>
        <p className="text-rekt-muted leading-relaxed">
          If you believe content on the Platform infringes your copyright, submit a written DMCA Notice to{' '}
          <a href="mailto:legal@markets.rektpalace.com" className="text-rekt-blue hover:underline">legal@markets.rektpalace.com</a> containing:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-rekt-muted">
          <li><strong className="text-white">Your contact information:</strong> name, physical address, telephone number, and email address.</li>
          <li><strong className="text-white">Identification of copyrighted work:</strong> a clear description or link to the copyrighted content you claim has been infringed.</li>
          <li><strong className="text-white">Identification of infringing content:</strong> information sufficient for our team to locate and identify the content (e.g., token name, wallet address, URL, username).</li>
          <li><strong className="text-white">Statement of good faith belief and accuracy:</strong> &quot;I, [NAME], wish to state that: I have a good faith belief that the use of the material complained of is not authorised by the copyright owner, its agent, or the law; this notification is accurate; and under penalty of perjury, I am the owner, or an agent authorised to act on behalf of the owner, of an exclusive right that is allegedly infringed.&quot;</li>
        </ul>
        <p className="text-rekt-muted leading-relaxed">
          Where possible and appropriate, Rekt Markets will notify the impacted creator of the claimed infringement.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">Response to Valid Notices</h2>
        <p className="text-rekt-muted leading-relaxed">
          When Rekt Markets receives a valid DMCA Notice, we will:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-rekt-muted">
          <li>Promptly review the content;</li>
          <li>Remove or disable access to the content insofar as we are able; and</li>
          <li>Notify the content creator about the removal.</li>
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">Counter-Notification</h2>
        <p className="text-rekt-muted leading-relaxed">
          If you are a creator and believe a DMCA Notice was sent in error or is based on misidentification, you may submit a counter-notice to{' '}
          <a href="mailto:legal@markets.rektpalace.com" className="text-rekt-blue hover:underline">legal@markets.rektpalace.com</a> containing:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-rekt-muted">
          <li><strong className="text-white">Your contact information:</strong> name, physical address, telephone number, and email address.</li>
          <li><strong className="text-white">Identification of content:</strong> information sufficient to locate the content, including the date and time.</li>
          <li><strong className="text-white">Identity of the claimant:</strong> the party that submitted the infringement notice.</li>
          <li><strong className="text-white">Explanation:</strong> why you believe there was a mistake or misidentification.</li>
          <li><strong className="text-white">Consent to jurisdiction:</strong> a statement that you consent to the jurisdiction of the federal district court for the judicial district in which your address is located (or, if you are outside the United States, the US District Court for the Southern District of New York), and that you will accept service of process from the person who provided the DMCA Notice or an agent of such person.</li>
          <li><strong className="text-white">Signature:</strong> your physical or electronic signature.</li>
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">Restoration of Content</h2>
        <p className="text-rekt-muted leading-relaxed">
          Upon receipt of a valid counter-notice, Rekt Markets will promptly forward a copy to the original claimant. If the claimant does not file a court action seeking to restrain the creator from engaging in the allegedly infringing activity within ten (10) to fourteen (14) business days of receiving the counter-notice, Rekt Markets will restore access to the removed content, unless the content was removed for reasons independent of the DMCA Notice.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">Repeat Infringers</h2>
        <p className="text-rekt-muted leading-relaxed">
          Rekt Markets will terminate a creator&apos;s access to the Platform if we determine that the creator is a repeat infringer. Receiving three (3) separate confirmed infringement findings (&quot;strikes&quot;) will constitute repeat infringement and result in permanent account termination.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">Designated Agent</h2>
        <p className="text-rekt-muted leading-relaxed">DMCA notices should be sent to:</p>
        <p className="text-rekt-muted leading-relaxed">
          <strong className="text-white">Email:</strong>{' '}
          <a href="mailto:legal@markets.rektpalace.com" className="text-rekt-blue hover:underline">legal@markets.rektpalace.com</a> (fastest response)
        </p>
        <p className="text-rekt-muted leading-relaxed">
          <strong className="text-white">Mail:</strong> Meta Bliss Group B.V., Korporaalweg 10, Willemstad, Curaçao
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-3">Policy Updates</h2>
        <p className="text-rekt-muted leading-relaxed">
          Rekt Markets reserves the right to update this policy at any time. Continued use constitutes acceptance.
        </p>

      </div>
    </div>
  )
}
