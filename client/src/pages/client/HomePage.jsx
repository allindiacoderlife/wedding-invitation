import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

export const HomePage = () => {
  const heroRef = useRef(null);
  const phoneRef = useRef(null);
  const badge1Ref = useRef(null);
  const badge2Ref = useRef(null);
  const badge3Ref = useRef(null);

  // Active Screen in Interactive Phone Mockup Demo
  const [activeScreen, setActiveScreen] = useState('rsvp');

  // Live RSVP Test Widget State
  const [demoAttending, setDemoAttending] = useState(true);
  const [demoCount, setDemoCount] = useState(2);
  const [demoMeal, setDemoMeal] = useState('Vegetarian');
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  // Active FAQ accordion state
  const [openFaq, setOpenFaq] = useState(0);

  // Active Template Preview
  const [selectedTheme, setSelectedTheme] = useState('classic');

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero elements entrance
      gsap.from('.hero-fade-in', {
        opacity: 0,
        y: 30,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
      });

      // Phone 3D tilt entrance
      if (phoneRef.current) {
        gsap.from(phoneRef.current, {
          opacity: 0,
          scale: 0.92,
          y: 40,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.2,
        });
      }

      // Continuous Floating sinusoidal wave for Badges
      if (badge1Ref.current) {
        gsap.to(badge1Ref.current, {
          y: -12,
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      if (badge2Ref.current) {
        gsap.to(badge2Ref.current, {
          y: 10,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.5,
        });
      }

      if (badge3Ref.current) {
        gsap.to(badge3Ref.current, {
          y: -8,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1,
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleDemoRsvpSubmit = (e) => {
    e.preventDefault();
    setDemoSubmitted(true);
  };

  const themes = [
    {
      id: 'classic',
      name: 'Classic Romance',
      desc: 'Blush pink & ivory elegance with timeless serif fonts',
      bg: 'from-rose-100 to-amber-50',
      badge: 'Most Popular',
      color: '#E8C5C8',
    },
    {
      id: 'aegean',
      name: 'Aegean Breeze',
      desc: 'Greek island white & Mediterranean deep sea sapphire',
      bg: 'from-sky-100 to-blue-50',
      badge: 'Destination Favorite',
      color: '#7AA2E3',
    },
    {
      id: 'botanical',
      name: 'Botanical Garden',
      desc: 'Sage olive foliage, eucalyptus greens & gold foil details',
      bg: 'from-emerald-100 to-stone-50',
      badge: 'Natural & Modern',
      color: '#88AB8E',
    },
    {
      id: 'noir',
      name: 'Midnight Glamour',
      desc: 'Sophisticated onyx black with warm champagne gold typography',
      bg: 'from-stone-800 to-stone-900',
      badge: 'Black Tie Luxury',
      color: '#D4AF37',
    },
  ];

  const faqs = [
    {
      q: 'How do wedding guests receive and open their invitation?',
      a: 'You receive a personalized link and high-resolution QR code. You can send it directly through WhatsApp, iMessage, SMS, or email with an elegant rich preview card. Guests tap the link and your wedding invitation opens instantly on any smartphone, tablet, or desktop with no app installation needed.',
    },
    {
      q: 'Can guests RSVP directly on their phone?',
      a: 'Yes! Guests select whether they will attend, choose the number of guests/children, specify dietary preferences (vegetarian, vegan, gluten-free, allergies), and write a congratulatory message. Every RSVP is recorded in real time on your dashboard.',
    },
    {
      q: 'Can we include Google Maps directions so guests don’t get lost?',
      a: 'Absolutely. The invitation features 1-click navigation buttons for both the wedding ceremony and the reception venue that open directly in Google Maps, Apple Maps, or Waze.',
    },
    {
      q: 'Can we add a wedding gift registry or bank account / IBAN?',
      a: 'Yes, the Digital Envelope feature allows you to display bank accounts, IBANs, PayPal, or Revolut links with a one-tap "Copy to Clipboard" button so guests can send gifts effortlessly.',
    },
    {
      q: 'Can guests upload photos during the wedding?',
      a: 'Yes! The live guest photo gallery allows all your attendees to scan a dedicated QR code at their table and upload their candid photos and videos straight to your shared album.',
    },
  ];

  return (
    <div ref={heroRef} className="space-y-28 overflow-hidden">
      {/* =========================================================================
          1. HERO SECTION
         ========================================================================= */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Subtle Decorative Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Eyebrow Badge */}
            <div className="hero-fade-in inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-800 text-xs font-semibold tracking-wide">
              <span>✨</span>
              <span>THE MODERN DIGITAL WEDDING INVITATION PLATFORM</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="hero-fade-in font-serif text-4xl sm:text-6xl xl:text-7xl font-normal tracking-tight text-stone-900 leading-[1.08]">
              The modern, elegant way to invite your <span className="italic text-rose-800">wedding guests</span>.
            </h1>

            {/* Subtitle */}
            <p className="hero-fade-in text-base sm:text-lg text-stone-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Create a breathtaking interactive digital invitation website in minutes. Collect instant RSVPs with dietary preferences, share 1-click Google Maps directions, and delight your guests with an unforgettable mobile experience.
            </p>

            {/* Dual CTAs */}
            <div className="hero-fade-in flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/create-invitation"
                className="px-8 py-4 rounded-full bg-rose-800 hover:bg-rose-900 text-white font-semibold text-sm tracking-wide shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
              >
                Create Your Invitation Free
              </Link>
              <Link
                to="/track-order"
                className="px-8 py-4 rounded-full bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-sm tracking-wide shadow-2xs transition"
              >
                Track Video Order 🔍
              </Link>
            </div>

            {/* Trust Proof Points */}
            <div className="hero-fade-in pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="text-amber-500 font-bold">★ 4.9/5</span> from 15,000+ couples
              </span>
              <span className="hidden sm:inline text-stone-300">•</span>
              <span className="flex items-center gap-1.5">
                <span>🌿</span> Zero paper waste
              </span>
              <span className="hidden sm:inline text-stone-300">•</span>
              <span className="flex items-center gap-1.5">
                <span>⚡</span> Instant WhatsApp & SMS sharing
              </span>
            </div>
          </div>

          {/* Right Hero Visual: 3D Smartphone Mockup with Floating Interactive Badges */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Floating Badge 1: RSVP Confirmation */}
            <div
              ref={badge1Ref}
              className="absolute -top-6 -left-4 sm:-left-8 z-20 bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl p-3.5 shadow-lg max-w-[210px] hidden sm:flex items-center gap-3 pointer-events-none"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg shrink-0">
                💌
              </div>
              <div>
                <p className="text-[11px] font-bold text-stone-900">RSVP Confirmed</p>
                <p className="text-[10px] text-stone-500">Sarah & Mark (2 Guests)</p>
                <span className="text-[9px] text-emerald-600 font-semibold">Vegetarian menu</span>
              </div>
            </div>

            {/* Floating Badge 2: Google Maps Direction */}
            <div
              ref={badge2Ref}
              className="absolute bottom-20 -right-4 sm:-right-8 z-20 bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl p-3.5 shadow-lg max-w-[220px] hidden sm:flex items-center gap-3 pointer-events-none"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg shrink-0">
                📍
              </div>
              <div>
                <p className="text-[11px] font-bold text-stone-900">1-Click Directions</p>
                <p className="text-[10px] text-stone-500">Seaside Grand Pavilion</p>
                <span className="text-[9px] text-blue-600 font-semibold">Opens in Google Maps</span>
              </div>
            </div>

            {/* Floating Badge 3: Countdown */}
            <div
              ref={badge3Ref}
              className="absolute bottom-4 -left-6 z-20 bg-white/95 backdrop-blur-md border border-rose-200/80 rounded-2xl px-4 py-2.5 shadow-lg hidden sm:flex items-center gap-2.5 pointer-events-none"
            >
              <span className="text-rose-700 text-base">⏳</span>
              <div>
                <p className="text-[10px] uppercase font-bold text-rose-800 tracking-wider">Countdown</p>
                <p className="text-xs font-serif font-bold text-stone-800">42 Days to Celebrate</p>
              </div>
            </div>

            {/* The Smartphone Frame Container */}
            <div
              ref={phoneRef}
              className="w-[290px] sm:w-[310px] h-[590px] sm:h-[620px] bg-stone-900 rounded-[44px] p-3 shadow-2xl border-4 border-stone-800 relative z-10"
            >
              {/* Phone Inner Bezel & Screen */}
              <div className="w-full h-full bg-[#FCFBF9] rounded-[36px] overflow-hidden flex flex-col relative border border-stone-200">
                {/* Dynamic Island / Speaker Notch */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-stone-900 rounded-full z-30 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-stone-800 rounded-full ml-auto mr-2" />
                </div>

                {/* Status Bar */}
                <div className="h-9 px-6 flex items-center justify-between text-[11px] font-semibold text-stone-700 shrink-0 pt-2 z-20">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <span>5G</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Mobile Invitation Screen Content */}
                <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4 text-center">
                  {/* Invitation Header Monogram */}
                  <div className="pt-2">
                    <span className="font-serif text-xs tracking-widest text-rose-700 uppercase font-semibold">
                      Together Forever
                    </span>
                    <h3 className="font-serif text-3xl font-medium text-stone-900 mt-1">
                      Sophia <br />
                      <span className="italic text-rose-800">&</span> Alexander
                    </h3>
                    <p className="text-[11px] text-stone-500 font-light mt-1">
                      Request the pleasure of your company
                    </p>
                  </div>

                  {/* Date & Venue Pill */}
                  <div className="bg-rose-50/80 border border-rose-200/60 rounded-xl py-2.5 px-3 space-y-1">
                    <p className="text-xs font-semibold text-rose-900">Saturday, October 24, 2026</p>
                    <p className="text-[10px] text-stone-600">Grand Botanical Pavilion • Santorini</p>
                  </div>

                  {/* Live Countdown in Phone */}
                  <div className="grid grid-cols-4 gap-1.5 py-1">
                    <div className="bg-stone-100 rounded-lg py-1.5">
                      <div className="text-sm font-bold text-stone-800">42</div>
                      <div className="text-[8px] text-stone-400 uppercase">Days</div>
                    </div>
                    <div className="bg-stone-100 rounded-lg py-1.5">
                      <div className="text-sm font-bold text-stone-800">14</div>
                      <div className="text-[8px] text-stone-400 uppercase">Hours</div>
                    </div>
                    <div className="bg-stone-100 rounded-lg py-1.5">
                      <div className="text-sm font-bold text-stone-800">38</div>
                      <div className="text-[8px] text-stone-400 uppercase">Mins</div>
                    </div>
                    <div className="bg-stone-100 rounded-lg py-1.5">
                      <div className="text-sm font-bold text-stone-800">19</div>
                      <div className="text-[8px] text-stone-400 uppercase">Secs</div>
                    </div>
                  </div>

                  {/* Romantic Music Bar Preview */}
                  <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200 flex items-center justify-between text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🎵</span>
                      <div>
                        <p className="text-[10px] font-semibold text-stone-800">Canon in D Major</p>
                        <p className="text-[8px] text-stone-400">Wedding Ceremony Soundtrack</p>
                      </div>
                    </div>
                    <span className="text-xs text-rose-700 font-bold">Playing</span>
                  </div>

                  {/* Call to Action Button inside phone */}
                  <div className="pt-2">
                    <button
                      type="button"
                      className="w-full py-2.5 rounded-xl bg-rose-800 text-white font-semibold text-xs shadow-xs"
                    >
                      Click to Confirm Attendance (RSVP)
                    </button>
                    <p className="text-[9px] text-stone-400 mt-2">Kindly respond by September 15, 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. SOCIAL PROOF & STATS BAR
         ========================================================================= */}
      <section className="border-y border-stone-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-rose-800">15,000+</div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Couples Married</p>
            </div>
            <div className="space-y-1">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-rose-800">650,000+</div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">RSVP Responses</p>
            </div>
            <div className="space-y-1">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-rose-800">100%</div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Paperless & Eco</p>
            </div>
            <div className="space-y-1">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-rose-800">4.9 / 5</div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Couple Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. KEY FEATURES BENTO GRID ("Everything You & Your Guests Need")
         ========================================================================= */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-800">
            COMPREHENSIVE DIGITAL FEATURES
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-medium text-stone-900">
            Everything your guests need in one beautiful link.
          </h2>
          <p className="text-sm sm:text-base text-stone-600">
            No lost paper invitations, no endless phone follow-ups. Everything is automated, elegant, and instantly accessible on mobile.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center text-2xl">
              💌
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900">Instant Online RSVP</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Guests confirm attendance in seconds. Capture total headcount, plus-ones, children, and specific dietary needs with automatic database tracking.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-2xl">
              📍
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900">1-Click Google Maps</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              No confused guests or late arrivals. A single click opens exact GPS navigation coordinates directly in Google Maps, Apple Maps, or Waze.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-2xl">
              ⏰
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900">Interactive Schedule</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Organize your day with a step-by-step visual timeline: Welcome drinks, ceremony, cocktail hour, dinner banquet, and cake cutting.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl">
              💳
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900">Digital Envelope & IBAN</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Make gifting effortless. Include bank account IBANs, Revolut, or PayPal details with a convenient one-tap "Copy to Clipboard" button.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center text-2xl">
              📸
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900">Live Guest Photo Upload</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Guests scan a dedicated table QR code at the reception to upload candid photos and videos straight into your shared wedding gallery.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-700 flex items-center justify-center text-2xl">
              🎵
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900">Romantic Soundtrack</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Welcome your guests with your special song playing gently in the background as they browse the invitation details.
            </p>
          </div>

          {/* Card 7 */}
          <div className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center text-2xl">
              📱
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900">Instant WhatsApp Sharing</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Send personalized invitation links via WhatsApp, SMS, or Messenger with an automatic rich social preview card and custom couple photo.
            </p>
          </div>

          {/* Card 8 */}
          <div className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center text-2xl">
              🌍
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900">Multi-Language Ready</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Hosting international family or a destination wedding? Offer one-click switching between English, Greek, Spanish, French, and German.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. INTERACTIVE PHONE FEATURE DEMO (CLICKABLE TABS)
         ========================================================================= */}
      <section id="interactive-demo" className="bg-stone-900 text-white py-24 rounded-3xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Interactive Feature Selector */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
                LIVE INTERACTIVE PREVIEW
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight">
                Experience your invitation just like your guests will.
              </h2>
              <p className="text-sm text-stone-400">
                Click any feature below to test the live mobile screen in the smartphone preview on the right.
              </p>
            </div>

            {/* Feature Clickable Buttons */}
            <div className="space-y-3">
              {[
                { id: 'rsvp', title: '1. Online RSVP Form', desc: 'Guests submit headcount, plus-ones & dinner preferences.' },
                { id: 'schedule', title: '2. Day Itinerary & Timeline', desc: 'Detailed hourly breakdown of ceremony & banquet events.' },
                { id: 'maps', title: '3. Google Maps Navigation', desc: 'Turn-by-turn directions to the church and reception venue.' },
                { id: 'envelope', title: '4. Digital Envelope & IBAN', desc: 'Direct bank accounts with one-touch copy buttons.' },
                { id: 'gallery', title: '5. Guest Photo Album', desc: 'Interactive photo grid of the couple & engagement shoot.' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveScreen(tab.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition ${
                    activeScreen === tab.id
                      ? 'bg-rose-950/60 border-rose-600/80 shadow-md translate-x-2'
                      : 'bg-stone-800/40 border-stone-800 hover:bg-stone-800/70'
                  }`}
                >
                  <p className={`text-sm font-bold ${activeScreen === tab.id ? 'text-rose-300' : 'text-stone-200'}`}>
                    {tab.title}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">{tab.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Dynamic Mobile Phone Screen Container */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-[300px] sm:w-[320px] h-[610px] bg-stone-950 rounded-[44px] p-3 shadow-2xl border-4 border-stone-700 relative">
              {/* Dynamic Island */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-stone-900 rounded-full z-30" />

              {/* Screen Body */}
              <div className="w-full h-full bg-[#FAF8F5] text-stone-900 rounded-[36px] overflow-hidden flex flex-col relative pt-7">
                {/* Header in Phone */}
                <div className="px-5 py-2 border-b border-stone-200 flex items-center justify-between text-[11px] font-semibold text-stone-600 bg-white/70">
                  <span>Sophia & Alexander</span>
                  <span className="text-rose-700 font-bold uppercase text-[9px]">Oct 24</span>
                </div>

                {/* Active Screen Rendering */}
                <div className="flex-1 overflow-y-auto p-5 text-left">
                  {/* SCREEN 1: RSVP Form */}
                  {activeScreen === 'rsvp' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="text-center">
                        <span className="text-2xl">💌</span>
                        <h4 className="font-serif text-lg font-bold text-stone-900 mt-1">Confirm Attendance</h4>
                        <p className="text-[10px] text-stone-500">Please RSVP by September 15</p>
                      </div>

                      <div className="space-y-2 text-xs">
                        <label className="font-semibold text-stone-700 block text-[11px]">Will you attend?</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button className="py-2 bg-rose-800 text-white rounded-lg font-medium text-[11px] shadow-xs">
                            Yes, I'll be there!
                          </button>
                          <button className="py-2 bg-stone-200 text-stone-700 rounded-lg font-medium text-[11px]">
                            Regretfully Decline
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="font-semibold text-stone-700 block text-[11px]">Total Guests in Party</label>
                        <select className="w-full p-2 rounded-lg border border-stone-300 bg-white text-xs">
                          <option>2 Guests</option>
                          <option>1 Guest</option>
                          <option>3 Guests</option>
                        </select>
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="font-semibold text-stone-700 block text-[11px]">Meal Preference</label>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-semibold text-[10px]">
                            Vegetarian
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 text-[10px]">
                            Gluten-Free
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 text-[10px]">
                            Standard
                          </span>
                        </div>
                      </div>

                      <button className="w-full py-2.5 bg-rose-800 text-white rounded-xl font-bold text-xs shadow-xs mt-2">
                        Submit My RSVP
                      </button>
                    </div>
                  )}

                  {/* SCREEN 2: Timeline */}
                  {activeScreen === 'schedule' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="text-center">
                        <span className="text-2xl">⏰</span>
                        <h4 className="font-serif text-lg font-bold text-stone-900 mt-1">Wedding Itinerary</h4>
                        <p className="text-[10px] text-stone-500">Saturday, October 24</p>
                      </div>

                      <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-rose-200 pl-7 text-xs">
                        <div className="relative">
                          <span className="absolute -left-7 top-1 w-3 h-3 rounded-full bg-rose-600 ring-4 ring-rose-100" />
                          <p className="font-bold text-stone-900 text-[11px]">16:30 — Church Ceremony</p>
                          <p className="text-[10px] text-stone-500">Holy Chapel of St. Sophia</p>
                        </div>
                        <div className="relative">
                          <span className="absolute -left-7 top-1 w-3 h-3 rounded-full bg-rose-600 ring-4 ring-rose-100" />
                          <p className="font-bold text-stone-900 text-[11px]">18:00 — Welcome Cocktails</p>
                          <p className="text-[10px] text-stone-500">Seaside Pavilion Terrace</p>
                        </div>
                        <div className="relative">
                          <span className="absolute -left-7 top-1 w-3 h-3 rounded-full bg-rose-600 ring-4 ring-rose-100" />
                          <p className="font-bold text-stone-900 text-[11px]">19:30 — Dinner Banquet</p>
                          <p className="text-[10px] text-stone-500">Main Grand Dining Hall</p>
                        </div>
                        <div className="relative">
                          <span className="absolute -left-7 top-1 w-3 h-3 rounded-full bg-rose-600 ring-4 ring-rose-100" />
                          <p className="font-bold text-stone-900 text-[11px]">22:00 — Party & Dancing</p>
                          <p className="text-[10px] text-stone-500">Open bar and DJ live set</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SCREEN 3: Maps */}
                  {activeScreen === 'maps' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="text-center">
                        <span className="text-2xl">📍</span>
                        <h4 className="font-serif text-lg font-bold text-stone-900 mt-1">Wedding Locations</h4>
                        <p className="text-[10px] text-stone-500">1-Tap GPS Navigation</p>
                      </div>

                      <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-stone-900 text-xs">Ceremony Chapel</p>
                          <span className="text-[9px] bg-rose-50 text-rose-800 font-semibold px-2 py-0.5 rounded-full">16:30</span>
                        </div>
                        <p className="text-[10px] text-stone-500">St. Sophia Cliffside Church, Santorini</p>
                        <button className="w-full py-1.5 bg-blue-600 text-white rounded-lg font-semibold text-[10px] flex items-center justify-center gap-1.5">
                          <span>🧭</span> Navigate in Google Maps
                        </button>
                      </div>

                      <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-stone-900 text-xs">Reception & Party</p>
                          <span className="text-[9px] bg-rose-50 text-rose-800 font-semibold px-2 py-0.5 rounded-full">18:00</span>
                        </div>
                        <p className="text-[10px] text-stone-500">The Grand Botanical Pavilion</p>
                        <button className="w-full py-1.5 bg-blue-600 text-white rounded-lg font-semibold text-[10px] flex items-center justify-center gap-1.5">
                          <span>🧭</span> Navigate in Google Maps
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SCREEN 4: Digital Envelope */}
                  {activeScreen === 'envelope' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="text-center">
                        <span className="text-2xl">💳</span>
                        <h4 className="font-serif text-lg font-bold text-stone-900 mt-1">Digital Envelope</h4>
                        <p className="text-[10px] text-stone-500">Wedding Gift Registry & IBAN</p>
                      </div>

                      <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-900 text-[11px]">National Bank / IBAN</span>
                          <span className="text-[9px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Verified</span>
                        </div>
                        <div className="p-2 bg-stone-50 rounded-lg font-mono text-[10px] text-stone-700 break-all select-all">
                          GR12 0110 1250 0000 1234 5678 901
                        </div>
                        <button className="w-full py-1.5 border border-stone-300 bg-stone-100 hover:bg-stone-200 rounded-lg text-[10px] font-bold text-stone-800 transition">
                          📋 Tap to Copy IBAN
                        </button>
                      </div>

                      <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs space-y-1.5 text-xs">
                        <p className="font-bold text-stone-900 text-[11px]">Honeymoon Travel Fund</p>
                        <p className="text-[10px] text-stone-500">PayPal / Revolut: @alex-sophia-vows</p>
                      </div>
                    </div>
                  )}

                  {/* SCREEN 5: Gallery */}
                  {activeScreen === 'gallery' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="text-center">
                        <span className="text-2xl">📸</span>
                        <h4 className="font-serif text-lg font-bold text-stone-900 mt-1">Our Moments</h4>
                        <p className="text-[10px] text-stone-500">Engagement & Wedding Story</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-24 bg-gradient-to-tr from-rose-200 to-amber-100 rounded-xl flex items-center justify-center text-xs font-serif italic text-stone-600">
                          Proposal in Paris
                        </div>
                        <div className="h-24 bg-gradient-to-tr from-sky-200 to-blue-100 rounded-xl flex items-center justify-center text-xs font-serif italic text-stone-600">
                          Santorini Sunset
                        </div>
                        <div className="col-span-2 h-24 bg-gradient-to-tr from-rose-100 to-emerald-100 rounded-xl flex items-center justify-center text-xs font-serif italic text-stone-600">
                          Together in Athens
                        </div>
                      </div>

                      <div className="text-center">
                        <span className="text-[10px] bg-rose-50 text-rose-700 px-3 py-1 rounded-full font-semibold">
                          Guests can upload photos on the big day!
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. INTERACTIVE LIVE RSVP WIDGET ON THE LANDING PAGE
         ========================================================================= */}
      <section id="rsvp-demo" className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-800">
            TRY THE LIVE RSVP EXPERIENCE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-stone-900">
            See how effortless RSVPing is for your guests.
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Submit a test response below to see the immediate guest confirmation feedback.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-rose-100 shadow-md">
          {demoSubmitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
                ✓
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                {demoAttending ? "We Can't Wait to Celebrate with You!" : 'Thank You for Letting Us Know!'}
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                {demoAttending
                  ? `Your confirmation for ${demoCount} guest(s) with ${demoMeal} meal preference has been successfully recorded in the couple's real-time dashboard.`
                  : 'Your response has been recorded. The couple has been notified with your warm wishes.'}
              </p>
              <button
                onClick={() => setDemoSubmitted(false)}
                className="text-xs px-5 py-2.5 rounded-full bg-stone-900 text-white font-semibold hover:bg-stone-800 transition"
              >
                Reset & Try Again
              </button>
            </div>
          ) : (
            <form onSubmit={handleDemoRsvpSubmit} className="space-y-6">
              {/* Attending Toggle */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  1. Will you be attending the wedding?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDemoAttending(true)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                      demoAttending
                        ? 'bg-rose-800 text-white border-rose-800 shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>💍</span> Yes, with great joy!
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoAttending(false)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                      !demoAttending
                        ? 'bg-stone-800 text-white border-stone-800 shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>🕊️</span> Regretfully decline
                  </button>
                </div>
              </div>

              {demoAttending && (
                <>
                  {/* Guest Count Counter */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                      2. Total Number of Guests in Party
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setDemoCount(Math.max(1, demoCount - 1))}
                        className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-lg flex items-center justify-center transition"
                      >
                        -
                      </button>
                      <span className="text-xl font-bold font-serif text-stone-900 w-8 text-center">
                        {demoCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setDemoCount(Math.min(6, demoCount + 1))}
                        className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-lg flex items-center justify-center transition"
                      >
                        +
                      </button>
                      <span className="text-xs text-stone-500">
                        ({demoCount === 1 ? 'Just yourself' : `${demoCount} seats reserved`})
                      </span>
                    </div>
                  </div>

                  {/* Dietary Preferences */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                      3. Dietary Preference
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Standard Banquet', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal / Kosher'].map((diet) => (
                        <button
                          key={diet}
                          type="button"
                          onClick={() => setDemoMeal(diet)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition border ${
                            demoMeal === diet
                              ? 'bg-rose-100 border-rose-300 text-rose-900'
                              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          {diet}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Submit Demo Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-rose-800 text-white font-bold text-sm hover:bg-rose-900 shadow-md transition"
              >
                Submit Demo RSVP & View Confirmation
              </button>
            </form>
          )}
        </div>
      </section>

      {/* =========================================================================
          6. THEMES & DESIGN SHOWCASE
         ========================================================================= */}
      <section id="templates" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-800">
            TIMELESS CURATED DESIGNS
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-medium text-stone-900">
            Find the aesthetic that reflects your story.
          </h2>
          <p className="text-sm text-stone-600">
            Every theme is completely customizable. Adjust colors, fonts, floral banners, and photo layouts with zero design skills needed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {themes.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTheme(t.id)}
              className={`cursor-pointer rounded-3xl p-6 border transition-all ${
                selectedTheme === t.id
                  ? 'border-rose-700 ring-2 ring-rose-200 shadow-lg scale-[1.02]'
                  : 'border-stone-200 bg-white hover:border-stone-300 shadow-2xs'
              }`}
            >
              <div className={`h-40 rounded-2xl bg-gradient-to-br ${t.bg} p-4 flex flex-col justify-between mb-4 border border-stone-200/50`}>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/80 backdrop-blur-xs text-stone-800 px-2.5 py-1 rounded-full self-start">
                  {t.badge}
                </span>
                <div className="text-center">
                  <p className="font-serif text-lg font-bold text-stone-800 leading-tight">
                    Elena & Lucas
                  </p>
                  <p className="text-[9px] uppercase tracking-widest text-stone-500 mt-0.5">
                    Save the Date
                  </p>
                </div>
              </div>

              <h4 className="font-serif text-lg font-bold text-stone-900">{t.name}</h4>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          7. COUPLES' ADMIN RSVP DASHBOARD PREVIEW
         ========================================================================= */}
      <section id="dashboard-preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-14 border border-stone-800 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
                ORGANIZER CONTROL CENTER
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight">
                Live RSVP tracking for effortless wedding planning.
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Log into your couple’s dashboard at any time. Monitor headcount in real-time, filter dietary restrictions for the caterer, and export to Excel with one click.
              </p>
            </div>
            <Link
              to="/admin"
              className="self-start md:self-auto px-6 py-3 rounded-full bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs transition shadow-xs"
            >
              Open Admin Demo Dashboard →
            </Link>
          </div>

          {/* Realistic Dashboard Mockup Window */}
          <div className="bg-stone-950 rounded-2xl p-6 border border-stone-800 space-y-6">
            {/* Top Stats Cards in Mockup */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-stone-900/80 p-4 rounded-xl border border-stone-800">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Total Invited</span>
                <span className="text-2xl font-bold text-white mt-1 block">185</span>
                <span className="text-[10px] text-emerald-400">92 Invitations Sent</span>
              </div>
              <div className="bg-stone-900/80 p-4 rounded-xl border border-stone-800">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Confirmed (Yes)</span>
                <span className="text-2xl font-bold text-emerald-400 mt-1 block">138</span>
                <span className="text-[10px] text-stone-400">74% of Guests</span>
              </div>
              <div className="bg-stone-900/80 p-4 rounded-xl border border-stone-800">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Dietary Needs</span>
                <span className="text-2xl font-bold text-amber-400 mt-1 block">24</span>
                <span className="text-[10px] text-stone-400">14 Vegan, 10 Gluten-Free</span>
              </div>
              <div className="bg-stone-900/80 p-4 rounded-xl border border-stone-800">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Awaiting Reply</span>
                <span className="text-2xl font-bold text-rose-400 mt-1 block">35</span>
                <span className="text-[10px] text-stone-400">Reminders queued</span>
              </div>
            </div>

            {/* Live Table Preview */}
            <div className="bg-stone-900/40 rounded-xl overflow-hidden border border-stone-800 text-xs">
              <table className="w-full text-left">
                <thead className="bg-stone-900 text-stone-400 text-[10px] uppercase tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="py-2.5 px-4">Guest</th>
                    <th className="py-2.5 px-4">Party Size</th>
                    <th className="py-2.5 px-4">Meal Preference</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 text-stone-300 text-[11px]">
                  <tr>
                    <td className="py-3 px-4 font-medium text-white">David & Emily Miller</td>
                    <td className="py-3 px-4">2 Guests</td>
                    <td className="py-3 px-4">1 Standard, 1 Vegetarian</td>
                    <td className="py-3 px-4"><span className="text-emerald-400 font-bold">Confirmed</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-white">Sarah Jenkins</td>
                    <td className="py-3 px-4">2 Guests</td>
                    <td className="py-3 px-4">Gluten-Free Banquet</td>
                    <td className="py-3 px-4"><span className="text-emerald-400 font-bold">Confirmed</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-white">Robert Chen</td>
                    <td className="py-3 px-4">1 Guest</td>
                    <td className="py-3 px-4">-</td>
                    <td className="py-3 px-4"><span className="text-stone-500 font-medium">Declined</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. PRICING & PACKAGES
         ========================================================================= */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-800">
            SIMPLE, TRANSPARENT PRICING
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-medium text-stone-900">
            Pay once, cherish forever.
          </h2>
          <p className="text-sm text-stone-600">
            No subscriptions or hidden fees. Choose the tier that matches your wedding size.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Tier 1: Starter */}
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-2xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Essential</span>
              <h3 className="font-serif text-3xl font-bold text-stone-900">$49</h3>
              <p className="text-xs text-stone-500">Perfect for intimate or micro-weddings.</p>
              <hr className="border-stone-100" />
              <ul className="space-y-2.5 text-xs text-stone-600">
                <li className="flex items-center gap-2"><span>✓</span> Custom Digital Invitation Link</li>
                <li className="flex items-center gap-2"><span>✓</span> RSVP Tracking up to 75 Guests</li>
                <li className="flex items-center gap-2"><span>✓</span> 1-Click Google Maps Directions</li>
                <li className="flex items-center gap-2"><span>✓</span> Active for 6 Months</li>
              </ul>
            </div>
            <Link
              to="/register"
              className="w-full text-center py-3 rounded-full border border-stone-300 text-stone-800 font-semibold text-xs hover:bg-stone-50 transition"
            >
              Choose Essential
            </Link>
          </div>

          {/* Tier 2: Deluxe (Most Popular) */}
          <div className="bg-rose-950 text-white rounded-3xl p-8 border-2 border-rose-600 shadow-xl flex flex-col justify-between space-y-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              Most Popular Choice
            </div>
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-300">Deluxe Package</span>
              <h3 className="font-serif text-4xl font-bold text-white">$89</h3>
              <p className="text-xs text-rose-200">The complete interactive celebration experience.</p>
              <hr className="border-rose-900" />
              <ul className="space-y-2.5 text-xs text-rose-100">
                <li className="flex items-center gap-2"><span>✓</span> <strong>Unlimited Guests & RSVPs</strong></li>
                <li className="flex items-center gap-2"><span>✓</span> Background Music Player</li>
                <li className="flex items-center gap-2"><span>✓</span> Live Guest Photo Uploading & Gallery</li>
                <li className="flex items-center gap-2"><span>✓</span> Digital Envelope & Gift IBAN</li>
                <li className="flex items-center gap-2"><span>✓</span> Real-Time Dietary Excel Export</li>
                <li className="flex items-center gap-2"><span>✓</span> Active for 1 Full Year</li>
              </ul>
            </div>
            <Link
              to="/register"
              className="w-full text-center py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
            >
              Get Started with Deluxe
            </Link>
          </div>

          {/* Tier 3: VIP Destination */}
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-2xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Destination VIP</span>
              <h3 className="font-serif text-3xl font-bold text-stone-900">$149</h3>
              <p className="text-xs text-stone-500">Multi-day events & international guests.</p>
              <hr className="border-stone-100" />
              <ul className="space-y-2.5 text-xs text-stone-600">
                <li className="flex items-center gap-2"><span>✓</span> Everything in Deluxe</li>
                <li className="flex items-center gap-2"><span>✓</span> Multi-Day Wedding Itinerary (3+ days)</li>
                <li className="flex items-center gap-2"><span>✓</span> Bilingual / Multi-Language Switching</li>
                <li className="flex items-center gap-2"><span>✓</span> Hotel & Accommodation Recommendations</li>
                <li className="flex items-center gap-2"><span>✓</span> Dedicated Concierge Design Support</li>
              </ul>
            </div>
            <Link
              to="/register"
              className="w-full text-center py-3 rounded-full border border-stone-300 text-stone-800 font-semibold text-xs hover:bg-stone-50 transition"
            >
              Choose Destination VIP
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. FREQUENTLY ASKED QUESTIONS (ACCORDION)
         ========================================================================= */}
      <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-800">GOT QUESTIONS?</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-stone-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-full text-left p-5 flex items-center justify-between text-stone-900 font-semibold text-sm hover:bg-stone-50 transition"
              >
                <span>{faq.q}</span>
                <span className="text-rose-700 font-bold ml-4">
                  {openFaq === idx ? '−' : '+'}
                </span>
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          10. FINAL BOTTOM CALL TO ACTION
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 rounded-3xl p-10 sm:p-16 text-center text-white space-y-6 shadow-xl relative overflow-hidden">
          <span className="text-xs uppercase tracking-widest font-semibold text-rose-200">
            START YOUR WEDDING JOURNEY
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-medium max-w-2xl mx-auto leading-tight">
            Create an invitation your guests will remember forever.
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 max-w-xl mx-auto leading-relaxed">
            Join thousands of couples creating elegant, paperless wedding experiences. Design your custom invitation in just 5 minutes.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-block px-9 py-4 rounded-full bg-white text-rose-900 font-bold text-sm hover:bg-stone-100 shadow-md transition transform hover:scale-105"
            >
              Create Your Free Invitation Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
