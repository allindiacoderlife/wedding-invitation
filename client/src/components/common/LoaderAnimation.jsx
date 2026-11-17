import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

const ScissorsIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="drop-shadow-md"
  >
    <circle cx="6" cy="6" r="3" />
    <path d="M8.12 8.12 12 21" />
    <path d="M20 4 8.12 15.88" />
    <circle cx="6" cy="18" r="3" />
    <path d="M14.8 14.8 20 20" />
  </svg>
);

export const LoaderAnimation = ({
  children,
  onComplete,
  title = "MARRIED.",
  subtitle = "DIGITAL WEDDING INVITATIONS",
  badgeText = "OPENING INVITATION",
  primaryColor = "#2B0D18", // Deep royal burgundy velvet
  accentColor = "#C5A059", // Warm Gold
  paperColor = "#FAF8F5", // Warm wedding paper
  onlyOncePerSession = false, // Set to true to show once per browser session
}) => {
  const containerRef = useRef(null);
  const topPanelRef = useRef(null);
  const bottomPanelRef = useRef(null);
  const titleContainerRef = useRef(null);
  const scissorRef = useRef(null);
  const counterRef = useRef(null);
  const dashedLineRef = useRef(null);
  const solidLineRef = useRef(null);
  const cutLineLayerRef = useRef(null);
  const timelineRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState(() => {
    if (onlyOncePerSession && typeof window !== "undefined") {
      return sessionStorage.getItem("invitation_loader_seen") === "true";
    }
    return false;
  });

  const handleFinish = () => {
    if (onlyOncePerSession && typeof window !== "undefined") {
      sessionStorage.setItem("invitation_loader_seen", "true");
    }
    setIsLoaded(true);
    onComplete?.();
  };

  const handleSkip = () => {
    if (timelineRef.current) {
      timelineRef.current.progress(1);
    }
    handleFinish();
  };

  useGSAP(
    () => {
      if (isLoaded) return;

      const dots = gsap.utils.toArray(".loader-dot");

      // Initial positions & properties
      gsap.set(scissorRef.current, {
        xPercent: -50,
        yPercent: -50,
        left: "4%",
      });
      gsap.set(solidLineRef.current, {
        width: "0%",
      });
      gsap.set(dashedLineRef.current, {
        clipPath: "inset(0 0 0 0%)",
      });
      gsap.set(dots, {
        scale: 0,
        x: (i) => (i - 2) * 120 - 300,
      });

      const tl = gsap.timeline({
        onComplete: handleFinish,
      });
      timelineRef.current = tl;

      // 1. Cut line & scissors progress (Clean % calculation, no layout thrashing)
      const cutProgress = { value: 4 };

      tl.to(
        cutProgress,
        {
          value: 104,
          duration: 2.2,
          ease: "power2.inOut",
          onUpdate: () => {
            const p = cutProgress.value;
            if (scissorRef.current) scissorRef.current.style.left = `${p}%`;
            if (solidLineRef.current) solidLineRef.current.style.width = `${p}%`;
            if (dashedLineRef.current)
              dashedLineRef.current.style.clipPath = `inset(0 0 0 ${p}%)`;
          },
        },
        0
      );

      // 2. Counter animation via JS object
      const counterObj = { count: 0 };
      tl.to(
        counterObj,
        {
          count: 100,
          duration: 2.2,
          ease: "power2.inOut",
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = Math.round(counterObj.count);
            }
          },
        },
        0
      );

      // 3. Staggered decorative dots
      tl.to(
        dots,
        {
          scale: 1,
          duration: 0.35,
          stagger: 0.1,
          ease: "back.out(2)",
        },
        0.1
      );

      tl.to(
        dots,
        {
          x: (i) => (i - 2) * 16,
          duration: 1.8,
          ease: "power2.inOut",
        },
        0.2
      );

      // 4. Split reveal: Curtains slide open smoothly
      tl.addLabel("split", "+=0.2");

      // Fade out cutting line guide
      tl.to(
        cutLineLayerRef.current,
        {
          opacity: 0,
          duration: 0.25,
          ease: "power2.out",
        },
        "split"
      );

      // Top panel slides UP
      tl.to(
        topPanelRef.current,
        {
          yPercent: -100,
          duration: 1.3,
          ease: "power3.inOut",
        },
        "split"
      );

      // Bottom panel slides DOWN
      tl.to(
        bottomPanelRef.current,
        {
          yPercent: 100,
          duration: 1.3,
          ease: "power3.inOut",
        },
        "split"
      );

      // Dots fade & glide away
      tl.to(
        dots,
        {
          opacity: 0,
          y: -24,
          duration: 0.4,
          ease: "power2.in",
        },
        "split"
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen"
      style={{ backgroundColor: paperColor }}
    >
      {/* Underlying Page Content */}
      {children}

      {/* Loading Curtain Overlay */}
      {!isLoaded && (
        <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden pointer-events-auto select-none">
          {/* Skip Button */}
          {/* <button
            onClick={handleSkip}
            className="absolute top-5 right-6 z-[120] text-xs font-mono tracking-widest uppercase text-white/80 hover:text-white bg-black/25 hover:bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 transition-all cursor-pointer"
          >
            Skip &rarr;
          </button> */}

          {/* Top Half Curtain */}
          <div
            ref={topPanelRef}
            className="absolute top-0 left-0 w-full h-1/2 z-20 flex flex-col justify-end items-center pb-8 px-6 shadow-2xl"
            style={{ backgroundColor: primaryColor }}
          >
            <div
              ref={titleContainerRef}
              className="flex flex-col items-center justify-center text-center max-w-2xl"
            >
              <span
                className="text-xs sm:text-sm tracking-[0.35em] uppercase font-semibold mb-2"
                style={{ color: accentColor }}
              >
                {subtitle}
              </span>
              <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl tracking-tight text-white font-bold leading-none">
                {title}
              </h1>
            </div>
          </div>

          {/* Bottom Half Curtain */}
          <div
            ref={bottomPanelRef}
            className="absolute bottom-0 left-0 w-full h-1/2 z-20 flex flex-col items-center justify-between pt-8 pb-6 px-6 shadow-2xl"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex-1" />
            <p className="text-white/40 font-mono text-[10px] tracking-widest uppercase">
              Crafting Your Unforgettable Moments
            </p>
          </div>

          {/* Golden Center Dots */}
          <div className="absolute inset-x-0 bottom-12 z-[35] h-2 pointer-events-none">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="loader-dot absolute left-1/2 top-0 w-2 h-2 -translate-x-1/2 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
            ))}
          </div>

          {/* Center Cutting Layer */}
          <div
            ref={cutLineLayerRef}
            className="absolute inset-0 z-30 pointer-events-none"
          >
            {/* Dashed Guideline */}
            <div
              ref={dashedLineRef}
              className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 z-10"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to right, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 8px, transparent 8px, transparent 16px)",
              }}
            />

            {/* Cut Golden Ribbon Line */}
            <div
              ref={solidLineRef}
              className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 z-10"
              style={{ backgroundColor: accentColor }}
            />

            {/* Percentage Counter */}
            <div
              className="absolute left-6 sm:left-10 top-1/2 -translate-y-full -mt-4 z-20 font-mono text-xs sm:text-sm tracking-wider"
              style={{ color: accentColor }}
            >
              <span ref={counterRef}>0</span>%
            </div>

            {/* Golden Scissors */}
            <div
              ref={scissorRef}
              className="absolute top-1/2 z-30 select-none"
              style={{ color: accentColor }}
            >
              <ScissorsIcon />
            </div>

            {/* Right Badge */}
            <div
              className="absolute right-6 sm:right-10 bottom-1/2 mb-4 z-20 font-mono text-[10px] sm:text-xs tracking-widest uppercase"
              style={{ color: accentColor }}
            >
              {badgeText} &gt;&gt;&gt;
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
