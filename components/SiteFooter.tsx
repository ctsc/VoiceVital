import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>VoiceVital is a research prototype, not a medical device or diagnostic tool.</p>
        <p>
          <Link href="/tech-stack">How it was built</Link>
        </p>
      </div>
    </footer>
  )
}
