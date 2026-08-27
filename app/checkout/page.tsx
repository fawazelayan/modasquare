"use client";

import Link from "next/link";
import { useState, useId } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle,
  CircleNotch,
  CreditCard,
  Lock,
  MapPin,
  Money,
  ShieldCheck,
  Sparkle,
  Tag,
  Truck,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/components/cart/cart-provider";
import { Frame } from "@/components/ui/frame";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

type PaymentMethod = "cod" | "pos" | "card" | "cliq" | "apple_pay";
type ShippingSpeed = "standard" | "express";

const JORDAN_GOVERNORATES = [
  "Amman",
  "Zarqa",
  "Irbid",
  "Aqaba",
  "As-Salt (Balqa)",
  "Madaba",
  "Jerash",
  "Ajloun",
  "Al-Karak",
  "Tafilah",
  "Ma'an",
  "Mafraq",
];

const VALID_COUPONS: Record<string, { percent?: number; amount?: number; label: string }> = {
  MODA10: { percent: 0.1, label: "10% Welcome Atelier Discount" },
  ATELIER15: { percent: 0.15, label: "15% Private Client Privilege" },
  AMMAN: { amount: 5, label: "5 JOD Flagship City Courtesy" },
};

export default function CheckoutPage() {
  const { lines, subtotal, isReady, clearCart } = useCart();

  // Step 1: Contact
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);

  // Step 2: Shipping
  const [fullName, setFullName] = useState("");
  const [governorate, setGovernorate] = useState("Amman");
  const [address, setAddress] = useState("");
  const [building, setBuilding] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [shippingSpeed, setShippingSpeed] = useState<ShippingSpeed>("standard");

  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Promo Code
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Order Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<{
    orderId: string;
    date: string;
    total: number;
    itemsCount: number;
    itemsSummary: string;
  } | null>(null);

  // Form Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculations
  const isFreeStandardShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const standardShippingCost = isFreeStandardShipping ? 0 : 3;
  const shippingFee = shippingSpeed === "express" ? 5 : standardShippingCost;

  let discountAmount = 0;
  if (appliedPromo && VALID_COUPONS[appliedPromo]) {
    const promo = VALID_COUPONS[appliedPromo];
    if (promo.percent) {
      discountAmount = Math.round(subtotal * promo.percent);
    } else if (promo.amount) {
      discountAmount = promo.amount;
    }
  }

  const finalTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (VALID_COUPONS[code]) {
      setAppliedPromo(code);
      setPromoInput("");
    } else {
      setPromoError("Invalid code. Try MODA10 or ATELIER15.");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoError(null);
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (email.trim() && !email.includes("@")) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 7) {
      nextErrors.phone = "Please enter a valid contact phone number.";
    }
    if (!fullName.trim()) {
      nextErrors.fullName = "Please enter your full name.";
    }
    if (!address.trim()) {
      nextErrors.address = "Please enter your street address or area.";
    }
    if (paymentMethod === "card") {
      if (!cardNumber.replace(/\s/g, "") || cardNumber.replace(/\s/g, "").length < 15) {
        nextErrors.cardNumber = "Please enter a valid 16-digit card number.";
      }
      if (!cardName.trim()) {
        nextErrors.cardName = "Please enter the name on the card.";
      }
      if (!cardExpiry.trim()) {
        nextErrors.cardExpiry = "Enter MM/YY.";
      }
      if (!cardCvv.trim() || cardCvv.length < 3) {
        nextErrors.cardCvv = "Enter CVV.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Scroll smoothly to first error
      window.scrollTo({ top: 100, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    const generatedId = `MS-${Math.floor(10000 + Math.random() * 90000)}`;
    const itemsCount = lines.reduce((acc, l) => acc + l.quantity, 0);
    const itemsSummary = lines
      .map((l) => `${l.quantity}x ${l.name} (${l.colour}, ${l.size})`)
      .join(", ");

    setTimeout(() => {
      setIsSubmitting(false);
      setOrderConfirmed({
        orderId: generatedId,
        date: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        total: finalTotal,
        itemsCount,
        itemsSummary,
      });
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 900);
  };

  // Wait for initial local storage hydration
  if (!isReady) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <CircleNotch size={32} className="animate-spin text-[var(--color-muted)]" />
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // ORDER CONFIRMATION VIEW (SUCCESS STATE)
  // --------------------------------------------------------------------------
  if (orderConfirmed) {
    const whatsappMessage = encodeURIComponent(
      `Hello Modasquare, I would like to track my order ${orderConfirmed.orderId}. Total: ${formatPrice(
        orderConfirmed.total
      )}. Name: ${fullName}.`
    );

    return (
      <div className="min-h-screen bg-[var(--color-canvas)] py-10 md:py-16">
        <div className="atelier-shell max-w-[46rem]">
          <div className="rounded-[2px] border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] p-6 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(34,197,94,0.12)] text-[rgb(21,128,61)]">
                <CheckCircle size={36} weight="fill" />
              </div>

              <span className="numeral mt-4 inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                Order Confirmed &bull; Preparing for Dispatch
              </span>

              <h1 className="font-display mt-2 text-[clamp(1.85rem,3.5vw,2.5rem)] leading-tight text-[var(--color-ink)]">
                Thank you for your order, {fullName.split(" ")[0] || "Valued Client"}
              </h1>

              <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-muted)]">
                Your bespoke pieces have been reserved at the atelier.
                {email.trim() ? (
                  <>
                    {" "}A confirmation has been sent to{" "}
                    <strong className="text-[var(--color-ink)]">{email}</strong>.
                  </>
                ) : (
                  <>
                    {" "}Dispatch notifications will be sent to{" "}
                    <strong className="text-[var(--color-ink)]">{phone}</strong>.
                  </>
                )}
              </p>
            </div>

            {/* Order Details Card */}
            <div className="mt-8 rounded-[2px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-5 sm:p-6">
              <div className="grid grid-cols-2 gap-4 border-b border-[var(--color-hairline)] pb-4 text-[13px] sm:grid-cols-4">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
                    Order Reference
                  </span>
                  <p className="numeral mt-1 font-semibold text-[var(--color-ink)]">
                    {orderConfirmed.orderId}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
                    Date
                  </span>
                  <p className="numeral mt-1 text-[var(--color-ink)]">{orderConfirmed.date}</p>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
                    Payment
                  </span>
                  <p className="mt-1 font-medium capitalize text-[var(--color-ink)]">
                    {paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : paymentMethod === "pos"
                      ? "Card on Delivery"
                      : paymentMethod === "cliq"
                      ? "CliQ Instant"
                      : paymentMethod === "apple_pay"
                      ? "Apple Pay"
                      : "Card"}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
                    Total Paid / Due
                  </span>
                  <p className="numeral mt-1 font-semibold text-[var(--color-ink)]">
                    {formatPrice(orderConfirmed.total)}
                  </p>
                </div>
              </div>

              <div className="pt-4 text-[13px]">
                <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
                  Delivery Destination
                </span>
                <p className="mt-1 font-medium text-[var(--color-ink)]">
                  {fullName} &bull; {phone}
                </p>
                <p className="mt-0.5 text-[var(--color-muted)]">
                  {address}
                  {building ? `, ${building}` : ""}, {governorate}, Jordan
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={`https://wa.me/962792290900?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-[2px] border border-[var(--color-ink)] bg-[var(--color-ink)] px-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-canvas)] shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-300 [transition-timing-function:var(--ease-spring)] hover:-translate-y-0.5 hover:bg-[var(--color-ink-tint)] hover:shadow-[0_8px_24px_rgba(18,18,20,0.2)] active:scale-[0.985]"
              >
                <WhatsappLogo size={18} weight="regular" />
                <span>Track on WhatsApp</span>
                <ArrowUpRight size={14} className="opacity-70" />
              </a>

              <Link
                href="/"
                className="inline-flex min-h-[50px] flex-1 items-center justify-center rounded-[2px] border border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] px-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)] transition-all duration-300 [transition-timing-function:var(--ease-spring)] hover:-translate-y-0.5 hover:border-[var(--color-ink)] hover:bg-[var(--color-surface)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] active:scale-[0.985]"
              >
                Return to Store
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // EMPTY BAG STATE
  // --------------------------------------------------------------------------
  if (lines.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[var(--color-canvas)] py-16">
        <div className="atelier-shell max-w-[36rem] text-center">
          <div className="mt-8 rounded-[2px] border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] p-8 sm:p-12">
            <h1 className="font-display text-[28px] text-[var(--color-ink)]">Your Bag is Empty</h1>
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-muted)]">
              You do not have any items in your shopping bag to check out. Select pieces from our
              seasonal collections to proceed.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                href="/"
                className="inline-flex min-h-[48px] items-center justify-center rounded-[2px] border border-[var(--color-ink)] bg-[var(--color-ink)] px-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-canvas)] shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-300 [transition-timing-function:var(--ease-spring)] hover:-translate-y-0.5 hover:bg-[var(--color-ink-tint)] hover:shadow-[0_8px_24px_rgba(18,18,20,0.2)] active:scale-[0.985]"
              >
                Browse Collections
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // MAIN CHECKOUT FORM & SUMMARY
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[var(--color-canvas)] pb-24 pt-4 md:pt-6">
      {/* Sub-header navigation & trust indicator */}
      <div className="border-b border-[var(--color-hairline)] bg-[var(--color-canvas)] pb-4 pt-1">
        <div className="atelier-shell flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            <span>Return to store</span>
          </Link>

          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
            <ShieldCheck size={16} weight="bold" className="text-[var(--color-accent)]" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>

      <div className="atelier-shell mt-8 md:mt-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.25fr_0.95fr] lg:gap-16">
          {/* ================================================================= Left Form */}
          <form onSubmit={handleSubmitOrder} noValidate className="space-y-10">
            {/* Step 1: Contact Information */}
            <section aria-labelledby="heading-contact" className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-[var(--color-hairline)] pb-3">
                <h2
                  id="heading-contact"
                  className="font-display text-[22px] leading-tight text-[var(--color-ink)]"
                >
                  1. Contact Information
                </h2>
                <span className="numeral text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
                  Step 1 of 3
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)]"
                  >
                    Mobile Phone Number <span className="text-[var(--color-accent)]">*</span>
                  </label>
                  <input
                    id="checkout-phone"
                    name="tel"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    placeholder="+962 7 9000 0000"
                    className={cn(
                      "mt-1.5 h-12 w-full rounded-[2px] border bg-[var(--color-surface)] px-4 text-[14px] text-[var(--color-ink)] outline-none transition-colors",
                      errors.phone
                        ? "border-red-500 focus:border-red-600"
                        : "border-[var(--color-hairline-strong)] focus:border-[var(--color-ink)]"
                    )}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-[11px] text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="checkout-email"
                    className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)]"
                  >
                    Email address{" "}
                    <span className="text-[11px] font-normal lowercase tracking-normal text-[var(--color-muted)]">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="checkout-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    spellCheck={false}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    placeholder="client@atelier.com"
                    className={cn(
                      "mt-1.5 h-12 w-full rounded-[2px] border bg-[var(--color-surface)] px-4 text-[14px] text-[var(--color-ink)] outline-none transition-colors",
                      errors.email
                        ? "border-red-500 focus:border-red-600"
                        : "border-[var(--color-hairline-strong)] focus:border-[var(--color-ink)]"
                    )}
                  />
                  {errors.email && (
                    <p className="mt-1 text-[11px] text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* WhatsApp Toggle */}
              <label className="flex cursor-pointer items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  checked={whatsappUpdates}
                  onChange={(e) => setWhatsappUpdates(e.target.checked)}
                  className="h-4 w-4 rounded-[2px] accent-[var(--color-ink)]"
                />
                <span className="text-[13px] text-[var(--color-muted)]">
                  Receive WhatsApp order confirmation & live dispatch tracking
                </span>
              </label>
            </section>

            {/* Step 2: Delivery Destination */}
            <section aria-labelledby="heading-delivery" className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-[var(--color-hairline)] pb-3">
                <h2
                  id="heading-delivery"
                  className="font-display text-[22px] leading-tight text-[var(--color-ink)]"
                >
                  2. Delivery Address
                </h2>
                <span className="numeral text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
                  Step 2 of 3
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="checkout-name"
                    className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)]"
                  >
                    Recipient Full Name <span className="text-[var(--color-accent)]">*</span>
                  </label>
                  <input
                    id="checkout-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
                    }}
                    placeholder="e.g. Layla Al-Husseini"
                    className={cn(
                      "mt-1.5 h-12 w-full rounded-[2px] border bg-[var(--color-surface)] px-4 text-[14px] text-[var(--color-ink)] outline-none transition-colors",
                      errors.fullName
                        ? "border-red-500 focus:border-red-600"
                        : "border-[var(--color-hairline-strong)] focus:border-[var(--color-ink)]"
                    )}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-[11px] text-red-600">{errors.fullName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="checkout-governorate"
                      className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)]"
                    >
                      Governorate / City <span className="text-[var(--color-accent)]">*</span>
                    </label>
                    <select
                      id="checkout-governorate"
                      name="region"
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      className="mt-1.5 h-12 w-full rounded-[2px] border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] px-4 text-[14px] text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-ink)]"
                    >
                      {JORDAN_GOVERNORATES.map((gov) => (
                        <option key={gov} value={gov}>
                          {gov}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-building"
                      className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)]"
                    >
                      Building / Apt / Villa No.
                    </label>
                    <input
                      id="checkout-building"
                      name="address-level2"
                      type="text"
                      value={building}
                      onChange={(e) => setBuilding(e.target.value)}
                      placeholder="e.g. Bldg 14, 2nd Floor, Apt 5"
                      className="mt-1.5 h-12 w-full rounded-[2px] border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] px-4 text-[14px] text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-ink)]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="checkout-address"
                    className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)]"
                  >
                    Street & Area Address <span className="text-[var(--color-accent)]">*</span>
                  </label>
                  <input
                    id="checkout-address"
                    name="street-address"
                    type="text"
                    autoComplete="street-address"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors((prev) => ({ ...prev, address: "" }));
                    }}
                    placeholder="e.g. Wasfi At-Tall St., Khalda / Abdoun 5th Circle"
                    className={cn(
                      "mt-1.5 h-12 w-full rounded-[2px] border bg-[var(--color-surface)] px-4 text-[14px] text-[var(--color-ink)] outline-none transition-colors",
                      errors.address
                        ? "border-red-500 focus:border-red-600"
                        : "border-[var(--color-hairline-strong)] focus:border-[var(--color-ink)]"
                    )}
                  />
                  {errors.address && (
                    <p className="mt-1 text-[11px] text-red-600">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="checkout-notes"
                    className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]"
                  >
                    Special Delivery Instructions (Optional)
                  </label>
                  <textarea
                    id="checkout-notes"
                    name="notes"
                    rows={2}
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. Please leave with concierge or call upon arrival"
                    className="mt-1.5 w-full rounded-[2px] border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] p-3 text-[14px] text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-ink)]"
                  />
                </div>
              </div>

              {/* Shipping Speed Options */}
              <div className="pt-2">
                <span className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)]">
                  Delivery Option
                </span>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label
                    className={cn(
                      "flex cursor-pointer items-start justify-between rounded-[2px] border p-4 transition-all duration-200",
                      shippingSpeed === "standard"
                        ? "border-[var(--color-ink)] bg-[var(--color-surface)] shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                        : "border-[var(--color-hairline-strong)] hover:border-[var(--color-ink)]"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="shippingSpeed"
                        value="standard"
                        checked={shippingSpeed === "standard"}
                        onChange={() => setShippingSpeed("standard")}
                        className="mt-1 accent-[var(--color-ink)]"
                      />
                      <div>
                        <p className="text-[13px] font-semibold text-[var(--color-ink)]">
                          Standard Atelier Delivery
                        </p>
                        <p className="mt-0.5 text-[11px] text-[var(--color-muted)]">
                          2–4 Business Days
                        </p>
                      </div>
                    </div>
                    <span className="numeral text-[13px] font-semibold text-[var(--color-ink)]">
                      {isFreeStandardShipping ? (
                        <span className="text-[rgb(21,128,61)]">Free</span>
                      ) : (
                        "3 JOD"
                      )}
                    </span>
                  </label>

                  <label
                    className={cn(
                      "flex cursor-pointer items-start justify-between rounded-[2px] border p-4 transition-all duration-200",
                      shippingSpeed === "express"
                        ? "border-[var(--color-ink)] bg-[var(--color-surface)] shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                        : "border-[var(--color-hairline-strong)] hover:border-[var(--color-ink)]"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="shippingSpeed"
                        value="express"
                        checked={shippingSpeed === "express"}
                        onChange={() => setShippingSpeed("express")}
                        className="mt-1 accent-[var(--color-ink)]"
                      />
                      <div>
                        <p className="text-[13px] font-semibold text-[var(--color-ink)]">
                          Express Priority Courier
                        </p>
                        <p className="mt-0.5 text-[11px] text-[var(--color-muted)]">
                          Same Day in Amman / 24h
                        </p>
                      </div>
                    </div>
                    <span className="numeral text-[13px] font-semibold text-[var(--color-ink)]">
                      5 JOD
                    </span>
                  </label>
                </div>
              </div>
            </section>

            {/* Step 3: Payment Method */}
            <section aria-labelledby="heading-payment" className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-[var(--color-hairline)] pb-3">
                <h2
                  id="heading-payment"
                  className="font-display text-[22px] leading-tight text-[var(--color-ink)]"
                >
                  3. Payment Method
                </h2>
                <span className="numeral text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
                  Step 3 of 3
                </span>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-[2px] border p-4 transition-all duration-200",
                    paymentMethod === "cod"
                      ? "border-[var(--color-ink)] bg-[var(--color-surface)]"
                      : "border-[var(--color-hairline-strong)] hover:border-[var(--color-ink)]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-[var(--color-ink)]"
                    />
                    <div>
                      <p className="text-[13px] font-semibold text-[var(--color-ink)]">
                        Cash on Delivery (COD)
                      </p>
                      <p className="text-[11px] text-[var(--color-muted)]">
                        Pay in cash upon doorstep delivery in Jordan
                      </p>
                    </div>
                  </div>
                  <Money size={20} className="text-[var(--color-muted)]" />
                </label>

                {/* Card on Delivery (POS) */}
                <label
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-[2px] border p-4 transition-all duration-200",
                    paymentMethod === "pos"
                      ? "border-[var(--color-ink)] bg-[var(--color-surface)]"
                      : "border-[var(--color-hairline-strong)] hover:border-[var(--color-ink)]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="pos"
                      checked={paymentMethod === "pos"}
                      onChange={() => setPaymentMethod("pos")}
                      className="accent-[var(--color-ink)]"
                    />
                    <div>
                      <p className="text-[13px] font-semibold text-[var(--color-ink)]">
                        Card on Delivery (POS Terminal)
                      </p>
                      <p className="text-[11px] text-[var(--color-muted)]">
                        Courier brings wireless card terminal to your door
                      </p>
                    </div>
                  </div>
                  <CreditCard size={20} className="text-[var(--color-muted)]" />
                </label>

                {/* CliQ Instant Transfer */}
                <label
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-[2px] border p-4 transition-all duration-200",
                    paymentMethod === "cliq"
                      ? "border-[var(--color-ink)] bg-[var(--color-surface)]"
                      : "border-[var(--color-hairline-strong)] hover:border-[var(--color-ink)]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cliq"
                      checked={paymentMethod === "cliq"}
                      onChange={() => setPaymentMethod("cliq")}
                      className="accent-[var(--color-ink)]"
                    />
                    <div>
                      <p className="text-[13px] font-semibold text-[var(--color-ink)]">
                        CliQ Instant Bank Transfer
                      </p>
                      <p className="text-[11px] text-[var(--color-muted)]">
                        Instant transfer via Jordan Mobile Payment Alias:{" "}
                        <strong className="font-mono text-[var(--color-ink)]">MODASQUARE</strong>
                      </p>
                    </div>
                  </div>
                  <span className="numeral text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-accent)]">
                    CliQ
                  </span>
                </label>

                {/* Online Credit / Debit Card */}
                <div
                  className={cn(
                    "rounded-[2px] border transition-all duration-200",
                    paymentMethod === "card"
                      ? "border-[var(--color-ink)] bg-[var(--color-surface)] p-4"
                      : "border-[var(--color-hairline-strong)] p-4 hover:border-[var(--color-ink)]"
                  )}
                >
                  <label className="flex cursor-pointer items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="accent-[var(--color-ink)]"
                      />
                      <div>
                        <p className="text-[13px] font-semibold text-[var(--color-ink)]">
                          Credit / Debit Card
                        </p>
                        <p className="text-[11px] text-[var(--color-muted)]">
                          Visa, Mastercard, American Express
                        </p>
                      </div>
                    </div>
                    <CreditCard size={20} className="text-[var(--color-muted)]" />
                  </label>

                  {paymentMethod === "card" && (
                    <div className="mt-4 space-y-3 border-t border-[var(--color-hairline)] pt-4">
                      <div>
                        <label
                          htmlFor="card-number"
                          className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)]"
                        >
                          Card Number
                        </label>
                        <input
                          id="card-number"
                          type="text"
                          autoComplete="cc-number"
                          inputMode="numeric"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4111 2222 3333 4444"
                          className="mt-1 h-11 w-full rounded-[2px] border border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] px-3 text-[14px] font-mono text-[var(--color-ink)] outline-none focus:border-[var(--color-ink)]"
                        />
                        {errors.cardNumber && (
                          <p className="mt-1 text-[11px] text-red-600">{errors.cardNumber}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="card-name"
                          className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)]"
                        >
                          Cardholder Name
                        </label>
                        <input
                          id="card-name"
                          type="text"
                          autoComplete="cc-name"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="Name on Card"
                          className="mt-1 h-11 w-full rounded-[2px] border border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] px-3 text-[14px] text-[var(--color-ink)] outline-none focus:border-[var(--color-ink)]"
                        />
                        {errors.cardName && (
                          <p className="mt-1 text-[11px] text-red-600">{errors.cardName}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label
                            htmlFor="card-exp"
                            className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)]"
                          >
                            Expiration
                          </label>
                          <input
                            id="card-exp"
                            type="text"
                            autoComplete="cc-exp"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM / YY"
                            className="mt-1 h-11 w-full rounded-[2px] border border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] px-3 text-[14px] font-mono text-[var(--color-ink)] outline-none focus:border-[var(--color-ink)]"
                          />
                          {errors.cardExpiry && (
                            <p className="mt-1 text-[11px] text-red-600">{errors.cardExpiry}</p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="card-cvv"
                            className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)]"
                          >
                            Security CVV
                          </label>
                          <input
                            id="card-cvv"
                            type="password"
                            maxLength={4}
                            autoComplete="cc-csc"
                            inputMode="numeric"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="123"
                            className="mt-1 h-11 w-full rounded-[2px] border border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] px-3 text-[14px] font-mono text-[var(--color-ink)] outline-none focus:border-[var(--color-ink)]"
                          />
                          {errors.cardCvv && (
                            <p className="mt-1 text-[11px] text-red-600">{errors.cardCvv}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex min-h-[54px] w-full items-center justify-center gap-2 rounded-[2px] border border-[var(--color-ink)] bg-[var(--color-ink)] px-8 text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--color-canvas)] shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-300 [transition-timing-function:var(--ease-spring)] hover:-translate-y-0.5 hover:bg-[var(--color-ink-tint)] hover:shadow-[0_12px_28px_rgba(18,18,20,0.25)] active:translate-y-0 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <CircleNotch size={18} className="animate-spin" />
                ) : (
                  <Lock size={16} weight="bold" />
                )}
                <span>
                  {isSubmitting
                    ? "Processing Order..."
                    : `Complete Order &bull; ${formatPrice(finalTotal)}`}
                </span>
              </button>
              <p className="mt-3 text-center text-[11px] text-[var(--color-muted)]">
                By placing your order, you agree to Modasquare's terms of service and atelier client
                care policies.
              </p>
            </div>
          </form>

          {/* ================================================================= Right Order Summary */}
          <aside aria-labelledby="heading-summary" className="space-y-6">
            <div className="sticky top-24 rounded-[2px] border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <h2
                id="heading-summary"
                className="font-display border-b border-[var(--color-hairline)] pb-4 text-[20px] text-[var(--color-ink)]"
              >
                Order Summary ({lines.reduce((a, b) => a + b.quantity, 0)}{" "}
                {lines.reduce((a, b) => a + b.quantity, 0) === 1 ? "item" : "items"})
              </h2>

              {/* Items List */}
              <div className="max-h-[22rem] divide-y divide-[var(--color-hairline)] overflow-y-auto pr-1">
                {lines.map((line) => (
                  <div key={line.id} className="flex gap-4 py-4">
                    <div className="w-16 shrink-0 overflow-hidden rounded-[2px]">
                      <Frame
                        ratio="3:4"
                        label={line.colour}
                        image={line.image}
                        alt={line.name}
                        pitch={14}
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="truncate text-[13px] font-semibold text-[var(--color-ink)]">
                            {line.name}
                          </h3>
                          <span className="numeral shrink-0 text-[13px] font-medium text-[var(--color-ink)]">
                            {formatPrice(line.price * line.quantity)}
                          </span>
                        </div>
                        <p className="numeral mt-0.5 text-[11px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
                          {line.colour} &bull; Size {line.size}
                        </p>
                      </div>
                      <p className="numeral text-[11px] text-[var(--color-muted)]">
                        Qty: {line.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="border-t border-[var(--color-hairline)] pt-4">
                {appliedPromo ? (
                  <div className="flex items-center justify-between rounded-[2px] bg-[rgba(158,125,78,0.08)] p-3 text-[12px]">
                    <div className="flex items-center gap-2 text-[var(--color-ink)]">
                      <Tag size={16} weight="fill" className="text-[var(--color-accent)]" />
                      <div>
                        <strong className="font-mono uppercase">{appliedPromo}</strong>
                        <p className="text-[11px] text-[var(--color-muted)]">
                          {VALID_COUPONS[appliedPromo]?.label}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-[11px] font-semibold uppercase text-[var(--color-muted)] hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Voucher code (e.g. MODA10)"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="h-10 w-full rounded-[2px] border border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] px-3 text-[12px] uppercase tracking-[0.1em] text-[var(--color-ink)] outline-none focus:border-[var(--color-ink)]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex h-10 items-center justify-center rounded-[2px] border border-[var(--color-ink)] bg-[var(--color-ink)] px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-canvas)] transition-transform duration-200 hover:scale-105 active:scale-95"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && <p className="mt-1 text-[11px] text-red-600">{promoError}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 border-t border-[var(--color-hairline)] pt-4 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">Subtotal</span>
                  <span className="numeral text-[var(--color-ink)]">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">Shipping</span>
                  <span className="numeral text-[var(--color-ink)]">
                    {shippingFee === 0 ? (
                      <span className="font-semibold text-[rgb(21,128,61)]">Complimentary</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[rgb(21,128,61)]">
                    <span>Discount ({appliedPromo})</span>
                    <span className="numeral">−{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[11px] text-[var(--color-muted)]">
                  <span>Customs & Taxes</span>
                  <span>Included</span>
                </div>

                <div className="flex items-baseline justify-between border-t border-[var(--color-hairline-strong)] pt-3 text-[15px]">
                  <span className="font-semibold uppercase tracking-[0.1em] text-[var(--color-ink)]">
                    Total
                  </span>
                  <span className="numeral text-[20px] font-bold text-[var(--color-ink)]">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Atelier Guarantees */}
              <div className="mt-6 space-y-2 rounded-[2px] bg-[var(--color-canvas)] p-4 text-[11px] text-[var(--color-muted)]">
                <div className="flex items-center gap-2">
                  <Sparkle size={14} className="text-[var(--color-accent)]" />
                  <span>Signature Modasquare luxury packaging included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-[var(--color-accent)]" />
                  <span>Free 30-day collection returns from your address</span>
                </div>
                <div className="flex items-center gap-2">
                  <WhatsappLogo size={14} className="text-[var(--color-accent)]" />
                  <span>Concierge support on +962 7 9229 0900</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
