import Link from "next/link";

function Navbar() {
  return (
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
  );
}

function Hero() {
  return (
    <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
          Quotes & Notes.
          <br />
          <span className="text-blue-600">Built for Painters.</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Create professional estimates on-site, keep customer notes organized,
          and close more jobs—all from your phone.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Free
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 border-y border-gray-100">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">
          Trusted by painting contractors across the country
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-gray-400">
          <span className="text-2xl font-bold text-gray-700">500+</span>
          <span className="text-sm">Active Users</span>
          <span className="text-gray-300">|</span>
          <span className="text-2xl font-bold text-gray-700">$2M+</span>
          <span className="text-sm">Quotes Sent</span>
          <span className="text-gray-300">|</span>
          <span className="text-2xl font-bold text-gray-700">4.9</span>
          <span className="text-sm">App Rating</span>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      step: "1",
      title: "Walk the Job",
      description:
        "Add rooms, measurements, and notes right from your phone while you're on-site.",
    },
    {
      step: "2",
      title: "Build Your Quote",
      description:
        "Pricing auto-calculates based on your rates. Adjust as needed and add line items.",
    },
    {
      step: "3",
      title: "Send & Win",
      description:
        "Email or text the quote to your customer. Get notified when they view it.",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900">
          How It Works
        </h2>
        <p className="mt-4 text-center text-gray-600 max-w-2xl mx-auto">
          From walkthrough to signed contract in three simple steps.
        </p>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-xl">
                {item.step}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="mt-3 text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      title: "Mobile-First Design",
      description:
        "Built for the job site. Works great on any phone, even with paint on your hands.",
      icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
    },
    {
      title: "Quick Estimates",
      description:
        "Create professional quotes in minutes with your custom pricing and templates.",
      icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
    },
    {
      title: "Customer Notes",
      description:
        "Keep paint colors, surface conditions, and special requests all in one place.",
      icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    },
    {
      title: "Photo Attachments",
      description:
        "Snap photos of the work area and attach them directly to quotes and notes.",
      icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z",
    },
    {
      title: "Job Tracking",
      description:
        "See all your jobs at a glance—pending quotes, scheduled work, and completed projects.",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    },
    {
      title: "Offline Mode",
      description:
        "No signal in the basement? No problem. Your data syncs when you're back online.",
      icon: "M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900">
          Everything You Need on the Job
        </h2>
        <p className="mt-4 text-center text-gray-600 max-w-2xl mx-auto">
          Tools built specifically for painting contractors, not generic
          business software.
        </p>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={feature.icon}
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Simple, Honest Pricing
        </h2>
        <p className="mt-4 text-gray-600">
          One plan. Everything included. No surprises.
        </p>
        <div className="mt-12 bg-white border-2 border-blue-600 rounded-2xl p-8 shadow-lg">
          <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">
            Pro Plan
          </p>
          <div className="mt-4 flex items-baseline justify-center gap-2">
            <span className="text-5xl font-bold text-gray-900">$29</span>
            <span className="text-gray-500">/month</span>
          </div>
          <ul className="mt-8 space-y-4 text-left max-w-xs mx-auto">
            {[
              "Unlimited quotes",
              "Unlimited customers",
              "Photo attachments",
              "Offline mode",
              "Email & text delivery",
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
  );
}

function FAQ() {
  const faqs = [
    {
      question: "Do I need an internet connection to use Painterflow?",
      answer:
        "Nope. Painterflow works offline so you can create quotes and take notes anywhere. Your data syncs automatically when you're back online.",
    },
    {
      question: "Can I customize my quote templates?",
      answer:
        "Yes! Add your logo, set your default pricing, create line item presets, and customize the look of your quotes to match your brand.",
    },
    {
      question: "How do customers receive their quotes?",
      answer:
        "You can send quotes via email or text message directly from the app. Customers get a professional PDF they can view, approve, or request changes.",
    },
    {
      question: "Is there a contract or can I cancel anytime?",
      answer:
        "No contracts. Cancel anytime with one click. We believe you should stay because you love the product, not because you're locked in.",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900">
          Questions? We&apos;ve Got Answers.
        </h2>
        <div className="mt-12 space-y-6">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {faq.question}
              </h3>
              <p className="mt-3 text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Ready to Win More Jobs?
        </h2>
        <p className="mt-4 text-blue-100 text-lg">
          Join hundreds of painting contractors who save time and close more
          deals with Painterflow.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-colors"
          >
            Start Your Free Trial
          </Link>
        </div>
        <p className="mt-6 text-blue-200 text-sm">
          No credit card required. Get started in 2 minutes.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xl font-bold text-white">Painterflow</p>
          <div className="flex gap-6">
            <Link
              href="/features"
              className="text-sm text-gray-400 hover:text-white"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-gray-400 hover:text-white"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-white"
            >
              Log In
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Painterflow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <HowItWorks />
        <Features />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
