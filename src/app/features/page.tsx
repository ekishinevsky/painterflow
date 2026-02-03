import Link from "next/link";

export default function FeaturesPage() {
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
                className="text-sm text-gray-900 font-medium hidden sm:block"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-gray-600 hover:text-gray-900 hidden sm:block"
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
            Features
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to quote faster, stay organized, and win more
            painting jobs.
          </p>
        </div>
      </section>

      {/* Feature List */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">
              Mobile-First Quoting
            </h2>
            <p className="mt-4 text-gray-600">
              Create professional estimates right from your phone while you walk
              the job. No more scribbling on paper and typing it up later.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">Customer Notes</h2>
            <p className="mt-4 text-gray-600">
              Keep paint colors, surface conditions, access codes, and customer
              preferences all in one searchable place.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">
              Photo Attachments
            </h2>
            <p className="mt-4 text-gray-600">
              Snap photos of problem areas, color samples, or the work scope and
              attach them directly to your quotes and job notes.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">Offline Mode</h2>
            <p className="mt-4 text-gray-600">
              Works without internet. Create quotes and notes anywhere—basement,
              rural areas, wherever. Data syncs when you reconnect.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Ready to try it out?
          </h2>
          <Link
            href="/signup"
            className="mt-6 inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Your Free Trial
          </Link>
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
