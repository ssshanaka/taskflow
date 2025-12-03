import { ArrowLeft, CheckCircle2, HelpCircle, Star } from "lucide-react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const PricingPage = ({ isDarkMode, toggleDarkMode }) => {
  useEffect(() => {
    // Load PayPal SDK
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=ARJuNcjZ4ekcXMY0FsjMt8jLBFJ4f3FrRTqLQu1t8e9g4O8a4oIyS0uaFeboLpOGNxXRs_TmFxw8Z2DF&currency=USD";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const renderPayPalButton = (containerId, amount, planName) => {
    if (window.paypal) {
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: `TaskFlow Desktop - ${planName}`,
                  amount: {
                    value: amount,
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            alert(
              `Thank you for your purchase! Order ID: ${order.id}\n\nPlease save this order ID and contact support to activate your ${planName} plan.`
            );
          },
          onError: (err) => {
            console.error("PayPal Error:", err);
            alert("Payment failed. Please try again or contact support.");
          },
        })
        .render(`#${containerId}`);
    }
  };

  useEffect(() => {
    // Render PayPal buttons after SDK loads
    const checkPayPal = setInterval(() => {
      if (window.paypal) {
        clearInterval(checkPayPal);
        renderPayPalButton("paypal-button-pro", "4.99", "Pro");
        renderPayPalButton("paypal-button-team", "19.00", "Team");
      }
    }, 100);

    return () => clearInterval(checkPayPal);
  }, []);

  const pricingTiers = [
    {
      tier: "Personal",
      price: "$0",
      period: "/ forever",
      description: "Perfect for individual users",
      features: [
        "Unlimited Tasks",
        "Google Account Sync",
        "Subtasks & Notes",
        "Dark Mode",
        "Basic Support",
        "Offline Mode",
        "PWA Installation",
      ],
      cta: "Get Started Free",
      ctaLink: "/app",
      recommended: false,
      paypal: false,
    },
    {
      tier: "Pro",
      price: "$4.99",
      period: "/ month",
      description: "For power users who want more",
      features: [
        "Everything in Personal",
        "Multiple Google Accounts",
        "Custom Themes",
        "Priority Support",
        "Early Access Features",
        "Advanced Keyboard Shortcuts",
        "Export to CSV/JSON",
        "Recurring Task Templates",
      ],
      cta: "Buy with PayPal",
      recommended: true,
      paypal: true,
      paypalId: "paypal-button-pro",
    },
    {
      tier: "Team",
      price: "$19",
      period: "/ month",
      description: "For teams and organizations",
      features: [
        "Up to 5 Pro Accounts",
        "Centralized Billing",
        "Team Onboarding",
        "Priority Features",
        "Account Manager",
        "Custom Domain Support",
        "Advanced Analytics",
        "SLA Guarantee",
      ],
      cta: "Buy with PayPal",
      recommended: false,
      paypal: true,
      paypalId: "paypal-button-team",
    },
  ];

  const faqs = [
    {
      question: "Is there a free trial for paid plans?",
      answer:
        "Pro and Team plans include a 14-day money-back guarantee. Try the full feature set risk-free, and if you're not satisfied, we'll refund your payment.",
    },
    {
      question: "How do refunds work?",
      answer:
        "We offer full refunds within 14 days of purchase, no questions asked. After 14 days, refunds are handled on a case-by-case basis. Contact support@taskflow.app with your order ID.",
    },
    {
      question: "Can I cancel anytime?",
      answer:
        "Yes! You can cancel your subscription anytime. You'll retain access until the end of your current billing period, then your account will automatically revert to the free Personal plan.",
    },
    {
      question: "What happens if my payment fails?",
      answer:
        "If a payment fails, we'll send you an email notification. You'll have 7 days to update your payment method before your account is downgraded to the Personal plan. All your data remains safe.",
    },
    {
      question: "How do I upgrade or downgrade?",
      answer:
        "Currently, upgrades and downgrades are handled manually. Email support@taskflow.app with your order ID and preferred plan. We're working on automated plan management.",
    },
    {
      question: "Do you offer discounts for students or nonprofits?",
      answer:
        "Yes! We offer 50% off Pro plans for students and nonprofits. Contact support@taskflow.app with verification (e.g., .edu email or nonprofit registration) to receive your discount code.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <CheckCircle2 size={20} />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">
              TaskFlow
              <span className="text-blue-600 dark:text-blue-400">Desktop</span>
            </span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-3xl -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wide mb-6">
              <Star size={12} className="fill-current" />
              Simple, Transparent Pricing
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
              Choose Your Plan
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Start free, upgrade anytime. All plans include the core task
              management features you love.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {pricingTiers.map((plan, idx) => (
              <div
                key={idx}
                className={`relative rounded-2xl p-8 ${
                  plan.recommended
                    ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-500/40 scale-105"
                    : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-slate-900 text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-6">
                  <h3
                    className={`text-2xl font-bold mb-2 ${
                      plan.recommended
                        ? "text-white"
                        : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {plan.tier}
                  </h3>
                  <p
                    className={`text-sm ${
                      plan.recommended
                        ? "text-blue-100"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <span
                    className={`text-5xl font-extrabold ${
                      plan.recommended
                        ? "text-white"
                        : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-lg ${
                      plan.recommended
                        ? "text-blue-100"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2
                        size={20}
                        className={`flex-shrink-0 mt-0.5 ${
                          plan.recommended
                            ? "text-blue-200"
                            : "text-blue-600 dark:text-blue-400"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          plan.recommended
                            ? "text-white"
                            : "text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.paypal ? (
                  <div id={plan.paypalId} className="min-h-[45px]"></div>
                ) : (
                  <Link
                    to={plan.ctaLink}
                    className={`block w-full py-3 px-6 rounded-lg font-semibold text-center transition-all ${
                      plan.recommended
                        ? "bg-white text-blue-600 hover:bg-blue-50"
                        : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Everything you need to know about pricing and payments
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-950 rounded-xl p-6 border border-slate-200 dark:border-slate-800"
              >
                <div className="flex items-start gap-4">
                  <HelpCircle
                    size={24}
                    className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Still have questions?
            </p>
            <a
              href="mailto:support@taskflow.app"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-900 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-800 dark:bg-white rounded flex items-center justify-center text-white dark:text-slate-900">
              <CheckCircle2 size={14} />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">
              TaskFlow Desktop
            </span>
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-sm">
            © {new Date().getFullYear()} TaskFlow Open Source. Not affiliated
            with Google.
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <Link
              to="/privacy"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
