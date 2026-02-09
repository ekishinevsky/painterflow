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
  const rollerRotation = scrollY * 0.5;
  const rollerY = 100 + scrollProgress * (viewportHeight - 250);

  return (
    <div
      className="fixed right-4 sm:right-8 lg:right-12 pointer-events-none z-40 hidden md:block"
      style={{
        top: `${rollerY}px`,
        transition: "top 0.1s ease-out",
      }}
    >
      <svg
        width="60"
        height="140"
        viewBox="0 0 60 140"
        fill="none"
        style={{
          filter: "drop-shadow(0 0 10px rgba(34, 197, 94, 0.3))",
        }}
      >
        {/* Handle */}
        <rect
          x="26"
          y="70"
          width="8"
          height="65"
          rx="4"
          stroke="#22c55e"
          strokeWidth="2"
          fill="none"
        />

        {/* Handle grip lines */}
        <line x1="28" y1="100" x2="32" y2="100" stroke="#22c55e" strokeWidth="1.5" opacity="0.6" />
        <line x1="28" y1="110" x2="32" y2="110" stroke="#22c55e" strokeWidth="1.5" opacity="0.6" />
        <line x1="28" y1="120" x2="32" y2="120" stroke="#22c55e" strokeWidth="1.5" opacity="0.6" />

        {/* Connector to roller */}
        <rect
          x="27"
          y="55"
          width="6"
          height="18"
          rx="2"
          stroke="#22c55e"
          strokeWidth="2"
          fill="none"
        />

        {/* Roller cylinder */}
        <g style={{ transform: `rotate(${rollerRotation}deg)`, transformOrigin: "30px 30px" }}>
          <ellipse
            cx="30"
            cy="30"
            rx="25"
            ry="25"
            stroke="#22c55e"
            strokeWidth="2"
            fill="none"
          />
          {/* Roller texture lines */}
          <ellipse
            cx="30"
            cy="30"
            rx="20"
            ry="20"
            stroke="#22c55e"
            strokeWidth="1"
            fill="none"
            opacity="0.4"
          />
          <ellipse
            cx="30"
            cy="30"
            rx="15"
            ry="15"
            stroke="#22c55e"
            strokeWidth="1"
            fill="none"
            opacity="0.3"
          />
          <ellipse
            cx="30"
            cy="30"
            rx="10"
            ry="10"
            stroke="#22c55e"
            strokeWidth="1"
            fill="none"
            opacity="0.2"
          />
          {/* Cross lines for rotation visibility */}
          <line x1="30" y1="5" x2="30" y2="55" stroke="#22c55e" strokeWidth="1" opacity="0.3" />
          <line x1="5" y1="30" x2="55" y2="30" stroke="#22c55e" strokeWidth="1" opacity="0.3" />
        </g>

        {/* Paint drip effect */}
        <circle cx="15" cy="55" r="3" fill="#22c55e" opacity="0.6" />
        <circle cx="45" cy="52" r="2" fill="#22c55e" opacity="0.4" />
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

// Typewriter effect component
function Typewriter({ text, delay = 1000, showCursor = true }: { text: string; delay?: number; showCursor?: boolean }) {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text, started]);

  return (
    <span>
      {displayedText || "\u00A0"}
      {showCursor && (
        <>
          <span
            className="inline-block w-[2px] h-[1.1em] bg-green-500 ml-1 align-middle"
            style={{
              animation: displayedText.length < text.length ? "none" : "blink 1s step-end infinite",
            }}
          />
          <style jsx>{`
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
          `}</style>
        </>
      )}
    </span>
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
            <a
              href="#features"
              className="text-sm text-neutral-400 hover:text-white hidden sm:block transition-colors"
            >
              Features
            </a>
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
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-black bg-green-500 rounded-lg hover:bg-green-400 transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 min-w-[140px]"
              >
                <Typewriter text="Start Free" delay={800} showCursor={false} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-transparent border border-neutral-700 rounded-lg hover:bg-neutral-800 transition-all hover:scale-105 min-w-[140px]"
              >
                <Typewriter text="Log In" delay={800} showCursor={false} />
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
      title: "Dashboard",
      description: "Get a complete overview of your business with real-time analytics, quick links, and growth tracking.",
      image: "/features/dashboard.jpg",
    },
    {
      title: "Customer Management",
      description: "Keep all your customer details organized—contact info, addresses, and notes in one place.",
      image: "/features/customers.jpg",
    },
    {
      title: "Estimates",
      description: "Create detailed estimates with line items, quantities, and rates. Calculate totals instantly.",
      image: "/features/estimates.jpg",
    },
    {
      title: "Professional Quotes",
      description: "Generate beautiful quotes from estimates with tax calculations, terms, and validity periods.",
      image: "/features/quote.jpg",
    },
    {
      title: "Calendar",
      description: "Schedule and track all your jobs with an intuitive calendar view. Never miss an appointment.",
      image: "/features/calendar.jpg",
    },
    {
      title: "Job Tracking",
      description: "Manage upcoming and past jobs with status tracking, notes, and customer details.",
      image: "/features/jobs.jpg",
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-neutral-800 relative scroll-mt-20">
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
        <div className="mt-16 space-y-24">
          {features.map((feature, index) => (
            <AnimatedSection key={feature.title} delay={index * 100}>
              <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12 items-center`}>
                {/* Text content */}
                <div className="flex-1 text-center lg:text-left">
                  <h3
                    className="text-2xl sm:text-3xl font-bold text-white"
                    style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
                  >
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-lg text-neutral-400">{feature.description}</p>
                </div>
                {/* Image */}
                <div className="flex-1 w-full">
                  <div
                    className="relative rounded-xl overflow-hidden border border-neutral-800 shadow-2xl"
                    style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(34, 197, 94, 0.1)" }}
                  >
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      width={800}
                      height={500}
                      className="w-full h-auto"
                    />
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>
                </div>
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
            <a
              href="#features"
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              Features
            </a>
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
