"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Scroll animation hook
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// Animated section wrapper
function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
      }}
    >
      {children}
    </div>
  );
}

// Paint roller that rolls down as you scroll
function ScrollingPaintRoller() {
  const [scrollY, setScrollY] = useState(0);
  const [maxScroll, setMaxScroll] = useState(1);
  const [viewportHeight, setViewportHeight] = useState(800);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);
      setMaxScroll(document.documentElement.scrollHeight - window.innerHeight);
      setViewportHeight(window.innerHeight);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  if (!mounted) return null;

  const scrollProgress = Math.min(scrollY / maxScroll, 1);
  const rollerRotation = scrollY * 0.5; // Rotate based on scroll
  const rollerY = 100 + scrollProgress * (viewportHeight - 250); // Move down the viewport

  return (
    <div
      className="fixed right-4 sm:right-8 lg:right-12 pointer-events-none z-40 hidden md:block"
      style={{
        top: `${rollerY}px`,
        transition: "top 0.1s ease-out",
      }}
    >
      <svg
        width="100"
        height="160"
        viewBox="0 0 100 160"
        fill="none"
        style={{
          filter: "drop-shadow(0 0 12px rgba(34, 197, 94, 0.4))",
        }}
      >
        {/* Roller cylinder - horizontal at top */}
        <g style={{ transform: `rotate(${rollerRotation}deg)`, transformOrigin: "50px 20px" }}>
          {/* Outer roller shape */}
          <rect
            x="10"
            y="8"
            width="80"
            height="24"
            rx="12"
            stroke="#22c55e"
            strokeWidth="2"
            fill="none"
          />
          {/* Inner roller texture lines */}
          <line x1="25" y1="10" x2="25" y2="30" stroke="#22c55e" strokeWidth="1" opacity="0.4" />
          <line x1="40" y1="10" x2="40" y2="30" stroke="#22c55e" strokeWidth="1" opacity="0.4" />
          <line x1="55" y1="10" x2="55" y2="30" stroke="#22c55e" strokeWidth="1" opacity="0.4" />
          <line x1="70" y1="10" x2="70" y2="30" stroke="#22c55e" strokeWidth="1" opacity="0.4" />
          {/* End caps */}
          <ellipse cx="10" cy="20" rx="4" ry="10" stroke="#22c55e" strokeWidth="2" fill="none" />
          <ellipse cx="90" cy="20" rx="4" ry="10" stroke="#22c55e" strokeWidth="2" fill="none" />
        </g>

        {/* Metal frame - wire cage */}
        <path
          d="M 14 20 L 14 35 Q 14 40 18 42 L 40 55"
          stroke="#22c55e"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M 86 20 L 86 35 Q 86 40 82 42 L 60 55"
          stroke="#22c55e"
          strokeWidth="2"
          fill="none"
        />

        {/* Frame connector bar */}
        <line x1="40" y1="55" x2="60" y2="55" stroke="#22c55e" strokeWidth="2" />

        {/* Handle stem - angled down */}
        <line x1="50" y1="55" x2="65" y2="100" stroke="#22c55e" strokeWidth="2" />

        {/* Handle grip */}
        <rect
          x="60"
          y="95"
          width="12"
          height="50"
          rx="6"
          stroke="#22c55e"
          strokeWidth="2"
          fill="none"
        />

        {/* Handle grip texture lines */}
        <line x1="62" y1="105" x2="70" y2="105" stroke="#22c55e" strokeWidth="1.5" opacity="0.5" />
        <line x1="62" y1="115" x2="70" y2="115" stroke="#22c55e" strokeWidth="1.5" opacity="0.5" />
        <line x1="62" y1="125" x2="70" y2="125" stroke="#22c55e" strokeWidth="1.5" opacity="0.5" />
        <line x1="62" y1="135" x2="70" y2="135" stroke="#22c55e" strokeWidth="1.5" opacity="0.5" />

        {/* Handle end cap */}
        <ellipse cx="66" cy="145" rx="6" ry="3" stroke="#22c55e" strokeWidth="2" fill="none" />

        {/* Small paint drips */}
        <circle cx="30" cy="35" r="2" fill="#22c55e" opacity="0.5" />
        <circle cx="70" cy="33" r="1.5" fill="#22c55e" opacity="0.4" />
      </svg>
    </div>
  );
}

// Animated rectangle border that draws around content
function AnimatedBorder({ children }: { children: React.ReactNode }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative inline-block p-8 sm:p-12">
      {/* SVG border that draws itself */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glow layer */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="none"
          stroke="rgba(34, 197, 94, 0.3)"
          strokeWidth="4"
          rx="16"
          ry="16"
          filter="url(#glow)"
          style={{
            strokeDasharray: 2000,
            strokeDashoffset: animated ? 0 : 2000,
            transition: "stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* Main border */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="none"
          stroke="url(#borderGradient)"
          strokeWidth="2"
          rx="16"
          ry="16"
          style={{
            strokeDasharray: 2000,
            strokeDashoffset: animated ? 0 : 2000,
            transition: "stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </svg>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Painterflow"
              width={32}
              height={32}
              className="h-8 w-8 object-contain rounded-lg"
            />
            <span className="text-xl font-semibold text-white">Painterflow</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/features"
              className="text-sm text-neutral-400 hover:text-white hidden sm:block transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-neutral-400 hover:text-white hidden sm:block transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-green-500 hover:text-green-400 transition-colors"
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
    <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-4xl mx-auto flex justify-center relative z-10">
        <AnimatedBorder>
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight relative">
              <span
                className="relative inline-block"
                style={{
                  textShadow: "0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Quotes & Notes.
              </span>
              <br />
              <span
                className="text-green-500 relative inline-block"
                style={{
                  textShadow: "0 4px 20px rgba(34,197,94,0.4), 0 2px 8px rgba(34,197,94,0.3)",
                }}
              >
                Built for Painters.
              </span>
            </h1>
            <p
              className="mt-6 text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
            >
              Create professional estimates on-site, keep customer notes organized,
              and close more jobs—all from your phone.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-black bg-green-500 rounded-lg hover:bg-green-400 transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
              >
                Start Free
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-transparent border border-neutral-700 rounded-lg hover:bg-neutral-800 transition-all hover:scale-105"
              >
                Log In
              </Link>
            </div>
          </div>
        </AnimatedBorder>
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <AnimatedSection>
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-neutral-800">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-neutral-500 uppercase tracking-wide font-medium">
            Trusted by painting contractors across the country
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <span className="text-2xl font-bold text-white" style={{ textShadow: "0 2px 8px rgba(255,255,255,0.1)" }}>500+</span>
            <span className="text-sm text-neutral-400">Active Users</span>
            <span className="text-neutral-700">|</span>
            <span className="text-2xl font-bold text-white" style={{ textShadow: "0 2px 8px rgba(255,255,255,0.1)" }}>$2M+</span>
            <span className="text-sm text-neutral-400">Quotes Sent</span>
            <span className="text-neutral-700">|</span>
            <span className="text-2xl font-bold text-white" style={{ textShadow: "0 2px 8px rgba(255,255,255,0.1)" }}>4.9</span>
            <span className="text-sm text-neutral-400">App Rating</span>
          </div>
        </div>
      </section>
    </AnimatedSection>
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
        <AnimatedSection>
          <h2
            className="text-3xl sm:text-4xl font-bold text-center text-white"
            style={{ textShadow: "0 4px 12px rgba(0,0,0,0.5)" }}
          >
            How It Works
          </h2>
          <p className="mt-4 text-center text-neutral-400 max-w-2xl mx-auto">
            From walkthrough to signed contract in three simple steps.
          </p>
        </AnimatedSection>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, index) => (
            <AnimatedSection key={item.step} delay={index * 150}>
              <div className="text-center">
                <div
                  className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-green-500/20 text-green-500 font-bold text-xl border border-green-500/30"
                  style={{ boxShadow: "0 4px 20px rgba(34,197,94,0.2)" }}
                >
                  {item.step}
                </div>
                <h3
                  className="mt-6 text-xl font-semibold text-white"
                  style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
                >
                  {item.title}
                </h3>
                <p className="mt-3 text-neutral-400">{item.description}</p>
              </div>
            </AnimatedSection>
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
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-neutral-800 relative">
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="max-w-6xl mx-auto relative">
        <AnimatedSection>
          <h2
            className="text-3xl sm:text-4xl font-bold text-center text-white"
            style={{ textShadow: "0 4px 12px rgba(0,0,0,0.5)" }}
          >
            Everything You Need on the Job
          </h2>
          <p className="mt-4 text-center text-neutral-400 max-w-2xl mx-auto">
            Tools built specifically for painting contractors, not generic
            business software.
          </p>
        </AnimatedSection>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <AnimatedSection key={feature.title} delay={index * 100}>
              <div
                className="bg-neutral-900/80 p-6 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-all hover:scale-[1.02] hover:shadow-xl"
                style={{ backdropFilter: "blur(8px)" }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-500/20 border border-green-500/20"
                  style={{ boxShadow: "0 2px 12px rgba(34,197,94,0.15)" }}
                >
                  <svg
                    className="w-5 h-5 text-green-500"
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
                <h3
                  className="mt-4 text-lg font-semibold text-white"
                  style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
                >
                  {feature.title}
                </h3>
                <p className="mt-2 text-neutral-400 text-sm">{feature.description}</p>
              </div>
            </AnimatedSection>
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
        <AnimatedSection>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white"
            style={{ textShadow: "0 4px 12px rgba(0,0,0,0.5)" }}
          >
            Simple, Honest Pricing
          </h2>
          <p className="mt-4 text-neutral-400">
            One plan. Everything included. No surprises.
          </p>
        </AnimatedSection>
        <AnimatedSection delay={200}>
          <div
            className="mt-12 bg-neutral-900/80 border-2 border-green-500 rounded-2xl p-8 relative overflow-hidden"
            style={{
              boxShadow: "0 0 60px rgba(34,197,94,0.15), 0 4px 20px rgba(0,0,0,0.3)",
              backdropFilter: "blur(8px)",
            }}
          >
            {/* Subtle glow effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-green-500/10 rounded-full blur-3xl" />

            <div className="relative">
              <p className="text-sm font-medium text-green-500 uppercase tracking-wide">
                Pro Plan
              </p>
              <div className="mt-4 flex items-baseline justify-center gap-2">
                <span
                  className="text-5xl font-bold text-white"
                  style={{ textShadow: "0 4px 12px rgba(255,255,255,0.1)" }}
                >
                  $29
                </span>
                <span className="text-neutral-500">/month</span>
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
                  <li key={item} className="flex items-center gap-3 text-neutral-300">
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
                className="mt-8 inline-flex items-center justify-center w-full px-8 py-4 text-base font-semibold text-black bg-green-500 rounded-lg hover:bg-green-400 transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
              >
                Start Your Free Trial
              </Link>
              <p className="mt-4 text-sm text-neutral-500">
                14-day free trial. No credit card required.
              </p>
            </div>
          </div>
        </AnimatedSection>
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
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-neutral-800">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection>
          <h2
            className="text-3xl sm:text-4xl font-bold text-center text-white"
            style={{ textShadow: "0 4px 12px rgba(0,0,0,0.5)" }}
          >
            Questions? We&apos;ve Got Answers.
          </h2>
        </AnimatedSection>
        <div className="mt-12 space-y-6">
          {faqs.map((faq, index) => (
            <AnimatedSection key={faq.question} delay={index * 100}>
              <div className="bg-neutral-900/80 p-6 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-all">
                <h3
                  className="text-lg font-semibold text-white"
                  style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
                >
                  {faq.question}
                </h3>
                <p className="mt-3 text-neutral-400">{faq.answer}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <AnimatedSection>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-green-500 relative overflow-hidden">
        {/* Texture overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2
            className="text-3xl sm:text-4xl font-bold text-black"
            style={{ textShadow: "0 2px 8px rgba(255,255,255,0.2)" }}
          >
            Ready to Win More Jobs?
          </h2>
          <p className="mt-4 text-green-900 text-lg">
            Join hundreds of painting contractors who save time and close more
            deals with Painterflow.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-green-500 bg-black rounded-lg hover:bg-neutral-900 transition-all hover:scale-105"
            >
              Start Your Free Trial
            </Link>
          </div>
          <p className="mt-6 text-green-800 text-sm">
            No credit card required. Get started in 2 minutes.
          </p>
        </div>
      </section>
    </AnimatedSection>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-black border-t border-neutral-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Painterflow"
              width={24}
              height={24}
              className="h-6 w-6 object-contain rounded-md"
            />
            <span className="text-xl font-semibold text-white">Painterflow</span>
          </div>
          <div className="flex gap-6">
            <Link
              href="/features"
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-neutral-800 text-center">
          <p className="text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} Painterflow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <ScrollingPaintRoller />
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
