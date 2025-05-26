export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last updated: December 2024</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing and using TrueEstate Rentals, you accept and agree to be bound by the terms and provision of
              this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
            <p className="text-gray-600 mb-4">
              Permission is granted to temporarily use TrueEstate Rentals for personal, non-commercial transitory
              viewing only.
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>This is the grant of a license, not a transfer of title</li>
              <li>You may not modify or copy the materials</li>
              <li>You may not use the materials for commercial purposes</li>
              <li>You may not reverse engineer any software</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
            <p className="text-gray-600 mb-4">
              When you create an account with us, you must provide accurate and complete information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Prohibited Uses</h2>
            <p className="text-gray-600 mb-4">
              You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Disclaimer</h2>
            <p className="text-gray-600 mb-4">
              The information on this platform is provided on an 'as is' basis. To the fullest extent permitted by law,
              we exclude all representations, warranties, and conditions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Limitations</h2>
            <p className="text-gray-600 mb-4">
              In no event shall TrueEstate Rentals or its suppliers be liable for any damages arising out of the use or
              inability to use the materials on our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Contact Information</h2>
            <p className="text-gray-600">
              If you have any questions about these Terms of Service, please contact us at legal@trueestate.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
