import { redirect } from 'next/navigation'

// Risk notice page is deprecated - replaced by ComplianceGate modal
// Redirect to home for any bookmarked links
export default function RiskNoticePage() {
  redirect('/')
}
