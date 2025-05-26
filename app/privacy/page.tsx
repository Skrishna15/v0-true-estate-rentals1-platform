export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: December 2024</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            <p className="text-gray-600 mb-4">
              We collect information you provide directly to us, such as when you create an account, use our services,
              or contact us for support.
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Personal information (name, email, phone number)</li>
              <li>Property search history and preferences</li>
              <li>Reviews and ratings you submit</li>
              <li>Communication with our support team</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">
              We use the information we collect to provide, maintain, and improve our services.
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Provide personalized property recommendations</li>
              <li>Verify user identity and prevent fraud</li>
              <li>Send important updates about our services</li>
              <li>Improve our platform based on usage patterns</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
            <p className="text-gray-600 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your
              consent, except as described in this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
            <p className="text-gray-600 mb-4">
              We implement appropriate security measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
            <p className="text-gray-600 mb-4">
              You have the right to access, update, or delete your personal information at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at privacy@trueestate.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
