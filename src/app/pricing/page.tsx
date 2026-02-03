import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Painterflow
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/features"
                className="text-sm text-gray-600 hover:text-gray-900 hidden sm:block"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-gray-900 font-medium hidden sm:block"
              >
                Pricing
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Pricing
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Simple pricing for painting pros. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white border-2 border-blue-600 rounded-2xl p-8 shadow-lg text-center">
            <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">
              Pro Plan
            </p>
            <div className="mt-4 flex items-baseline justify-center gap-2">
              <span className="text-5xl font-bold text-gray-900">$29</span>
              <span className="text-gray-500">/month</span>
            </div>
            <ul className="mt-8 space-y-4 text-left">
              {[
                "Unlimited quotes",
                "Unlimited customers",
                "Photo attachments",
                "Offline mode",
                "Email & text delivery",
                "Custom branding",
                "Priority support",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center justify-center w-full px-8 py-4 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Your Free Trial
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              14-day free trial. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Common Questions
          </h2>
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900">
                Is there a free trial?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes! Try Painterflow free for 14 days. No credit card needed to
                start.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Can I cancel anytime?
              </h3>
              <p className="mt-2 text-gray-600">
                Absolutely. No contracts, no cancellation fees. Cancel with one
                click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Painterflow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
