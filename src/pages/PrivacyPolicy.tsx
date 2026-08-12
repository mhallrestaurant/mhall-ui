import React from 'react'
import heroImage from '../assets/chief.jpg'

interface PrivacySection {
  title: string
  content: string[]
}

const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    title: 'Introduction',
    content: [
      'Moor Hall Restaurant ("we", "our", "us") is committed to protecting and respecting your privacy.',
      'This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.',
      'We comply with applicable data protection laws, including the General Data Protection Regulation (GDPR) and Rwandan data protection regulations.',
      'By using our website, you consent to the data practices described in this policy.',
    ],
  },
  {
    title: 'Information We Collect',
    content: [
      'Personal Information: Name, email address, phone number, and any other information you voluntarily provide when making reservations, placing orders, or contacting us.',
      'Usage Data: Information about how you access and use our website, including IP address, browser type, pages visited, and time spent on pages.',
      'Cookies and Tracking Technologies: We use cookies, web beacons, and similar technologies to enhance your experience and analyze website traffic.',
      'Payment Information: Payment details are processed securely by third-party payment processors and are not stored on our servers.',
    ],
  },
  {
    title: 'Google Tag Manager and Analytics',
    content: [
      'We use Google Tag Manager to deploy tracking codes and analytics tools on our website.',
      'Google Tag Manager may collect information such as your IP address, browser type, device information, and pages visited.',
      'This data is used to understand how visitors interact with our website and to improve our services.',
      'Google may use this data in accordance with its own Privacy Policy: https://www.google.com/policies/privacy/.',
      'You can opt out of Google Analytics tracking by installing the Google Analytics Opt-out Browser Add-on available at: https://tools.google.com/dlpage/gaoptout.',
      'We do not use Google Tag Manager to collect sensitive personal information.',
    ],
  },
  {
    title: 'How We Use Your Information',
    content: [
      'To process reservations, orders, and catering requests.',
      'To communicate with you about your bookings, orders, and account activities.',
      'To improve our website, services, and customer experience.',
      'To send promotional communications (with your consent) about special offers, events, and new menu items.',
      'To comply with legal obligations and protect our rights and interests.',
      'To analyze website usage and optimize our marketing efforts.',
    ],
  },
  {
    title: 'Data Sharing and Disclosure',
    content: [
      'We do not sell, trade, or rent your personal information to third parties.',
      'We may share your information with trusted service providers who assist us in operating our website, conducting business, or servicing you, subject to strict confidentiality agreements.',
      'We may disclose your information if required by law, regulation, or legal process.',
      'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business.',
    ],
  },
  {
    title: 'Cookies and Tracking Technologies',
    content: [
      'Cookies are small data files stored on your device that help us improve your browsing experience.',
      'We use essential cookies for website functionality, analytics cookies to understand usage patterns, and marketing cookies for personalized content.',
      'You can manage your cookie preferences through your browser settings or our cookie consent banner.',
      'Disabling certain cookies may affect the functionality of our website.',
      'Third-party cookies (such as Google Analytics) are used to collect aggregated usage statistics.',
    ],
  },
  {
    title: 'Data Security',
    content: [
      'We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.',
      'All payment transactions are encrypted using SSL technology.',
      'We regularly review our security practices to ensure the protection of your data.',
      'However, no method of transmission over the Internet or method of electronic storage is 100% secure.',
    ],
  },
  {
    title: 'Your Data Protection Rights',
    content: [
      'Right to Access: You have the right to request copies of your personal data.',
      'Right to Rectification: You have the right to request correction of inaccurate or incomplete data.',
      'Right to Erasure: You have the right to request deletion of your personal data under certain circumstances.',
      'Right to Restrict Processing: You have the right to request limitation of processing your personal data.',
      'Right to Data Portability: You have the right to request transfer of your data to another organization.',
      'Right to Object: You have the right to object to processing of your personal data.',
      'Right to Withdraw Consent: You have the right to withdraw consent at any time, where we rely on consent to process your data.',
    ],
  },
  {
    title: 'Data Retention',
    content: [
      'We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy.',
      'Reservation and order data is retained for a period of 5 years for legal and accounting purposes.',
      'Marketing data is retained until you withdraw consent or request deletion.',
      'Analytics data is retained in accordance with Google\'s data retention policies.',
    ],
  },
  {
    title: 'Third-Party Services',
    content: [
      'Our website may contain links to third-party websites or services that are not operated by us.',
      'We are not responsible for the privacy practices of third-party websites or services.',
      'We encourage you to review the privacy policies of any third-party sites you visit.',
      'Third-party services we may use include: Google Analytics, Google Tag Manager, payment processors, and communication platforms (e.g., WhatsApp).',
    ],
  },
  {
    title: 'Children\'s Privacy',
    content: [
      'Our website and services are not intended for individuals under the age of 13.',
      'We do not knowingly collect personal information from children under 13.',
      'If we become aware that we have collected personal information from a child under 13, we will take steps to delete that information.',
      'Parents or guardians who believe their child has provided us with personal information should contact us immediately.',
    ],
  },
  {
    title: 'Changes to This Privacy Policy',
    content: [
      'We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.',
      'We will notify you of any material changes by posting the updated policy on this page with a revised "Last updated" date.',
      'Your continued use of the website after any changes constitutes acceptance of the updated policy.',
      'We encourage you to review this Privacy Policy periodically.',
    ],
  },
]

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#fffdf8_0%,_#fff7e6_100%)] text-slate-800">
      <style>{`
        @keyframes premiumFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes premiumScaleIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes premiumGlow {
          0%, 100% { box-shadow: 0 0 0 rgba(255, 205, 70, 0); }
          50% { box-shadow: 0 0 35px rgba(255, 205, 70, 0.1); }
        }
      `}</style>

      <section className="relative overflow-hidden">
        <img src={heroImage} alt="Chef preparing premium dishes" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-[#BB0503]/90" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          <div className="max-w-3xl text-center mx-auto opacity-0" style={{ animation: 'premiumScaleIn 0.9s ease-out forwards', animationDelay: '0.15s' }}>
            <p className="text-sm uppercase tracking-[0.35em] text-[#C8981A]">Moor Hall Restaurant</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Privacy Policy</h1>
            <p className="mt-6 text-base leading-8 text-white/80 sm:text-lg">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information when you use our website and services.
            </p>
            <p className="mt-2 text-sm text-white/60">Last updated: August 2026</p>
          </div>
        </div>
      </section>

      <main className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PRIVACY_SECTIONS.map((section, index) => (
            <article
              key={section.title}
              className="rounded-[2rem] border border-[#BB0503]/10 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] opacity-0 transition hover:-translate-y-1 hover:border-[#C8981A]/40"
              style={{ animation: `premiumFadeUp 0.75s ease-out forwards`, animationDelay: `${0.1 + index * 0.08}s` }}
            >
              <h2 className="text-xl font-semibold text-[#BB0503]">{section.title}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                {section.content.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#BB0503]/10 text-xs font-semibold text-[#BB0503]">{i + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[2rem] border border-[#BB0503]/10 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] opacity-0" style={{ animation: 'premiumFadeUp 0.8s ease-out forwards', animationDelay: '0.3s' }}>
            <p className="text-sm uppercase tracking-[0.35em] text-[#C8981A]">Transparency & Control</p>
            <h2 className="mt-4 text-3xl font-extrabold text-[#192333]">Your data, your rights</h2>
            <p className="mt-6 text-sm leading-7 text-slate-600">
              We believe in complete transparency regarding your personal data. You have full control over your information, and we are committed to honoring your privacy preferences at every step.
            </p>
            <ul className="mt-8 space-y-4 text-slate-600">
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#BB0503]/10 text-[#BB0503]">1</span>
                <span>You can request access to or deletion of your personal data at any time by contacting us.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#BB0503]/10 text-[#BB0503]">2</span>
                <span>We do not sell your personal data to third parties without your explicit consent.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#BB0503]/10 text-[#BB0503]">3</span>
                <span>You can manage cookie preferences through your browser or our consent banner.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-[#BB0503]/10 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] opacity-0" style={{ animation: 'premiumFadeUp 0.8s ease-out forwards', animationDelay: '0.4s' }}>
            <p className="text-sm uppercase tracking-[0.35em] text-[#C8981A]">Contact Us</p>
            <h2 className="mt-4 text-3xl font-extrabold text-[#192333]">Privacy enquiries</h2>
            <p className="mt-6 text-sm leading-7 text-slate-600">
              For any questions about this Privacy Policy, data requests, or privacy concerns, please reach out to our data protection team.
            </p>
            <div className="mt-8 space-y-4 text-slate-600">
              <div className="rounded-3xl border border-[#BB0503]/10 bg-[#fff7e6] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#BB0503]">General enquiries</p>
                <p className="mt-2 text-sm">mhallrestaurant@gmail.com</p>
              </div>
              <div className="rounded-3xl border border-[#BB0503]/10 bg-[#fff7e6] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#BB0503]">Privacy & Data Protection</p>
                <p className="mt-2 text-sm">privacy@moorhall.com</p>
              </div>
              <div className="rounded-3xl border border-[#BB0503]/10 bg-[#fff7e6] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#BB0503]">Phone</p>
                <p className="mt-2 text-sm">+(250) 788 658 316</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default PrivacyPolicy
