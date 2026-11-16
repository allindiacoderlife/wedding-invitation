import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { VideoPlayer } from '../../components/common/VideoPlayer';
import { API_BASE_URL } from '../../config/api';

export const getDirectImageUrl = (url) => {
  if (!url) return '';
  const gDriveMatch = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
  if (gDriveMatch && gDriveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${gDriveMatch[1]}`;
  }
  return url;
};

export const CreateInvitationPage = () => {
  const navigate = useNavigate();

  // Wizard Steps: 1: Select Template, 2: Couple Details, 3: Functions (Page by Page), 4: Music & Contact, 5: Review & Submit
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activePreviewVideo, setActivePreviewVideo] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    // Client Contact
    clientName: '',
    clientEmail: '',
    clientPhone: '',

    // Couple Details
    brideName: '',
    groomName: '',
    brideParents: '',
    groomParents: '',

    // Dynamic Custom Template Attributes
    customFields: {},

    // Functions Page-by-Page
    events: [
      {
        pageNumber: 1,
        name: 'Haldi & Chooda Ceremony',
        date: '',
        time: '',
        venue: '',
        address: '',
      },
      {
        pageNumber: 2,
        name: 'Shubh Vivah (Wedding Muhurtham)',
        date: '',
        time: '',
        venue: '',
        address: '',
      },
      {
        pageNumber: 3,
        name: 'Grand Reception Dinner',
        date: '',
        time: '',
        venue: '',
        address: '',
      },
    ],

    // Preferences
    musicPreference: '',
    customTextNotes: '',
  });

  const [orderResult, setOrderResult] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSelectTemplate = (tpl) => {
    setSelectedTemplate(tpl);

    // If template has defined slides in formSchema, initialize function slides to match
    if (tpl.formSchema?.slides?.length > 0) {
      const templateEvents = tpl.formSchema.slides.map((s, idx) => ({
        pageNumber: idx + 1,
        name: s.name || `Function ${idx + 1}`,
        date: '',
        time: '',
        venue: '',
        address: '',
      }));
      setFormData((prev) => ({
        ...prev,
        events: templateEvents,
      }));
    }
  };

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/templates`);
      const data = await res.json();
      if (data.success && Array.isArray(data.templates) && data.templates.length > 0) {
        setTemplates(data.templates);
        handleSelectTemplate(data.templates[0]);
      } else {
        setTemplates([]);
        setSelectedTemplate(null);
      }
    } catch (err) {
      console.error('Failed to load templates:', err);
      setTemplates([]);
      setSelectedTemplate(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCustomFieldChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      customFields: {
        ...(prev.customFields || {}),
        [key]: value,
      },
    }));
  };

  const handleEventChange = (index, field, value) => {
    const updated = [...formData.events];
    updated[index][field] = value;
    setFormData({ ...formData, events: updated });
  };

  const addEventPage = () => {
    setFormData({
      ...formData,
      events: [
        ...formData.events,
        {
          pageNumber: formData.events.length + 1,
          name: 'New Function',
          date: '',
          time: '',
          venue: '',
          address: '',
        },
      ],
    });
  };

  const removeEventPage = (index) => {
    if (formData.events.length <= 1) return;
    const updated = formData.events.filter((_, i) => i !== index);
    setFormData({ ...formData, events: updated });
  };

  const [submitError, setSubmitError] = useState('');

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setLoading(true);

    const payload = {
      ...formData,
      templateId: selectedTemplate?.id || null,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.order) {
        throw new Error(data.message || 'Failed to submit invitation order. Please try again.');
      }

      setOrderResult(data.order);
      setStep(5);
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError(err.message || 'Unable to connect to the studio server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-5 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-5 sm:space-y-10">
      {/* Step Progress Bar */}
      <div className="space-y-2.5">
        {/* Mobile Step Header */}
        <div className="sm:hidden flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 font-bold text-[11px] tracking-wider border border-rose-200/60 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-700 animate-pulse"></span>
            STEP {step} OF 4
          </span>
          <span className="text-xs font-bold text-stone-800">
            {step === 1 && '1. Choose Video'}
            {step === 2 && '2. Couple Names'}
            {step === 3 && '3. Function Pages'}
            {step === 4 && '4. Music & Details'}
          </span>
        </div>

        {/* Mobile Segmented Progress Bar */}
        <div className="sm:hidden grid grid-cols-4 gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step >= s ? 'bg-rose-800' : 'bg-stone-200'
              }`}
            />
          ))}
        </div>

        {/* Desktop Step Breadcrumbs */}
        <div className="hidden sm:block space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 uppercase tracking-wider">
            <span className={step >= 1 ? 'text-rose-800 font-bold' : ''}>1. Choose Video</span>
            <span className="text-stone-300">→</span>
            <span className={step >= 2 ? 'text-rose-800 font-bold' : ''}>2. Couple Names</span>
            <span className="text-stone-300">→</span>
            <span className={step >= 3 ? 'text-rose-800 font-bold' : ''}>3. Functions (Pages)</span>
            <span className="text-stone-300">→</span>
            <span className={step >= 4 ? 'text-rose-800 font-bold' : ''}>4. Music & Details</span>
          </div>
          <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-rose-800 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* =========================================================
          STEP 1: SELECT VIDEO INVITATION TEMPLATE
         ========================================================= */}
      {step === 1 && (
        <div className="space-y-5 sm:space-y-8 animate-fade-in">
          <div className="text-center max-w-2xl mx-auto space-y-1.5 sm:space-y-2">
            <span className="hidden sm:inline-block text-xs uppercase font-bold text-rose-800 tracking-widest">STEP 1 OF 4</span>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
              Select Your Wedding Video Invitation
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto leading-relaxed">
              Preview the animation style. Our video editors will replace all the placeholder names, functions, and music with your details!
            </p>
          </div>

          {templates.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-stone-200 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center max-w-md mx-auto space-y-3">
              <span className="text-4xl">🎬</span>
              <h3 className="font-bold text-stone-900 text-sm">No Video Templates Available Yet</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                The studio administrator has not published any wedding video templates yet. Please check back shortly or contact our team directly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`cursor-pointer rounded-xl sm:rounded-2xl overflow-hidden border transition bg-white shadow-2xs flex flex-col justify-between ${
                    selectedTemplate?.id === tpl.id
                      ? 'border-rose-700 ring-2 ring-rose-300 shadow-md scale-[1.01]'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div>
                    {/* Vertical 9:16 Short Video Container */}
                    <div className="relative aspect-[9/16] bg-stone-900 overflow-hidden">
                      {tpl.thumbnailUrl ? (
                        <img
                          src={getDirectImageUrl(tpl.thumbnailUrl)}
                          alt={tpl.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const match = tpl.thumbnailUrl.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
                            if (match && match[1] && !e.currentTarget.dataset.triedFallback) {
                              e.currentTarget.dataset.triedFallback = 'true';
                              e.currentTarget.src = `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 text-stone-400 p-2 text-center">
                          <span className="text-3xl mb-1">🎬</span>
                          <span className="text-[10px] font-medium text-stone-300">Vertical Short Video</span>
                        </div>
                      )}
                      <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-black/60 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded backdrop-blur-xs">
                        {tpl.category}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePreviewVideo(tpl.videoUrl);
                        }}
                        className="absolute inset-0 m-auto w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/90 text-stone-900 flex items-center justify-center font-bold shadow-md hover:scale-110 transition cursor-pointer text-xs sm:text-base"
                      >
                        ▶
                      </button>
                    </div>

                    <div className="p-2.5 sm:p-4 space-y-1 sm:space-y-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-bold text-stone-900 text-xs sm:text-sm truncate">{tpl.title}</h3>
                        <span className="text-[11px] sm:text-xs font-extrabold text-stone-900">${tpl.price}</span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-stone-500 line-clamp-1 sm:line-clamp-2 leading-relaxed">
                        {tpl.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 sm:p-4 pt-0">
                    <button
                      type="button"
                      className={`w-full py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition ${
                        selectedTemplate?.id === tpl.id
                          ? 'bg-rose-800 text-white shadow-xs'
                          : 'border border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {selectedTemplate?.id === tpl.id ? '✓ Selected' : 'Choose Style'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-2 sm:pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!selectedTemplate}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-rose-800 hover:bg-rose-900 text-white font-bold text-xs shadow-md transition disabled:opacity-50 text-center"
            >
              Continue to Couple Details →
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          STEP 2: COUPLE & PARENTS DETAILS
         ========================================================= */}
      {step === 2 && (
        <div className="space-y-5 sm:space-y-8 animate-fade-in max-w-2xl mx-auto">
          <div className="text-center space-y-1 sm:space-y-2">
            <span className="hidden sm:inline-block text-xs uppercase font-bold text-rose-800 tracking-widest">STEP 2 OF 4</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Bride & Groom Details
            </h2>
            <p className="text-[11px] sm:text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              These names will be prominently featured on the opening title pages of your video.
            </p>
          </div>

          <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-stone-200 shadow-sm space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Bride's Full Name *</label>
                <input
                  required
                  type="text"
                  name="brideName"
                  value={formData.brideName}
                  onChange={handleInputChange}
                  placeholder="e.g. Pooja Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Groom's Full Name *</label>
                <input
                  required
                  type="text"
                  name="groomName"
                  value={formData.groomName}
                  onChange={handleInputChange}
                  placeholder="e.g. Rohan Verma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-rose-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Bride's Parents (Optional)</label>
                <input
                  type="text"
                  name="brideParents"
                  value={formData.brideParents}
                  onChange={handleInputChange}
                  placeholder="e.g. Mr. Rajesh & Mrs. Sunita Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Groom's Parents (Optional)</label>
                <input
                  type="text"
                  name="groomParents"
                  value={formData.groomParents}
                  onChange={handleInputChange}
                  placeholder="e.g. Mr. Anil & Mrs. Meenakshi Verma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-rose-600"
                />
              </div>
            </div>

            {/* Dynamic Template-Specific Custom Attributes */}
            {selectedTemplate?.formSchema?.attributes && selectedTemplate.formSchema.attributes.length > 0 && (
              <div className="pt-3.5 border-t border-stone-100 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                    ✨ Template Custom Details
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium">For: {selectedTemplate.title}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {selectedTemplate.formSchema.attributes.map((attr, idx) => (
                    <div key={idx} className={selectedTemplate.formSchema.attributes.length === 1 ? 'sm:col-span-2' : ''}>
                      <label className="block text-xs font-bold text-stone-700 mb-1">{attr.label}</label>
                      <input
                        type="text"
                        value={formData.customFields?.[attr.key] || ''}
                        onChange={(e) => handleCustomFieldChange(attr.key, e.target.value)}
                        placeholder={attr.placeholder || `Enter ${attr.label.toLowerCase()}`}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-rose-600 bg-stone-50/50"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-2.5 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border border-stone-300 text-stone-700 font-semibold text-xs hover:bg-stone-50 shrink-0"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!formData.brideName || !formData.groomName) {
                    alert("Please fill both Bride's and Groom's names.");
                    return;
                  }
                  setStep(3);
                }}
                className="flex-1 sm:flex-initial px-5 sm:px-8 py-2.5 sm:py-3 rounded-full bg-rose-800 text-white font-bold text-xs hover:bg-rose-900 shadow-xs text-center"
              >
                Continue to Function Pages →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          STEP 3: PAGE-BY-PAGE FUNCTIONS & EVENTS
         ========================================================= */}
      {step === 3 && (
        <div className="space-y-5 sm:space-y-8 animate-fade-in max-w-3xl mx-auto">
          <div className="text-center space-y-1 sm:space-y-2">
            <span className="hidden sm:inline-block text-xs uppercase font-bold text-rose-800 tracking-widest">STEP 3 OF 4</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Function-by-Function Text
            </h2>
            <p className="text-[11px] sm:text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              Each function represents a slide/page in your customized video invitation. Add or remove ceremonies as needed!
            </p>
          </div>

          <div className="space-y-3.5 sm:space-y-4">
            {formData.events.map((ev, index) => (
              <div
                key={index}
                className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-200 shadow-sm space-y-3.5 relative"
              >
                <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 font-bold text-[11px] uppercase tracking-wider">
                    Video Page {index + 1}
                  </span>
                  {formData.events.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEventPage(index)}
                      className="text-xs text-red-600 hover:underline font-semibold"
                    >
                      ✕ Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-stone-700 mb-1">Ceremony / Function Name *</label>
                    <input
                      required
                      type="text"
                      value={ev.name}
                      onChange={(e) => handleEventChange(index, 'name', e.target.value)}
                      placeholder="e.g. Haldi, Sangeet, Wedding"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-rose-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:col-span-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Date *</label>
                      <input
                        type="text"
                        value={ev.date}
                        onChange={(e) => handleEventChange(index, 'date', e.target.value)}
                        placeholder="e.g. 21 Nov 2026"
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-rose-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Time *</label>
                      <input
                        type="text"
                        value={ev.time}
                        onChange={(e) => handleEventChange(index, 'time', e.target.value)}
                        placeholder="e.g. 10:00 AM onwards"
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-rose-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Venue Name *</label>
                    <input
                      type="text"
                      value={ev.venue}
                      onChange={(e) => handleEventChange(index, 'venue', e.target.value)}
                      placeholder="e.g. Grand Heritage Palace"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-rose-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Address / City</label>
                    <input
                      type="text"
                      value={ev.address}
                      onChange={(e) => handleEventChange(index, 'address', e.target.value)}
                      placeholder="e.g. Station Road, Jaipur"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-rose-600"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addEventPage}
              className="w-full py-3 rounded-xl sm:rounded-2xl border-2 border-dashed border-stone-300 hover:border-rose-700 text-stone-700 hover:text-rose-800 font-bold text-xs transition bg-white"
            >
              + Add Another Ceremony Page (e.g. Haldi / Cocktail)
            </button>
          </div>

          <div className="flex items-center justify-between gap-2.5 pt-3 sm:pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border border-stone-300 text-stone-700 font-semibold text-xs hover:bg-stone-50 shrink-0"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="flex-1 sm:flex-initial px-5 sm:px-8 py-2.5 sm:py-3 rounded-full bg-rose-800 text-white font-bold text-xs hover:bg-rose-900 shadow-xs text-center"
            >
              Continue to Music & Contact →
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          STEP 4: MUSIC & CONTACT DETAILS
         ========================================================= */}
      {step === 4 && (
        <div className="space-y-5 sm:space-y-8 animate-fade-in max-w-2xl mx-auto">
          <div className="text-center space-y-1 sm:space-y-2">
            <span className="hidden sm:inline-block text-xs uppercase font-bold text-rose-800 tracking-widest">STEP 4 OF 4</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Music Choice & Delivery Contact
            </h2>
            <p className="text-[11px] sm:text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              Provide your WhatsApp number so our video editor can share the finished invitation video directly with you.
            </p>
          </div>

          <form onSubmit={handleSubmitOrder} className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-stone-200 shadow-sm space-y-4 sm:space-y-6">
            {submitError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {submitError}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Background Music / Song Choice
              </label>
              <input
                type="text"
                name="musicPreference"
                value={formData.musicPreference}
                onChange={handleInputChange}
                placeholder="e.g. Kesariya (Instrumental), Canon in D, Kudmayi"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-rose-600"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                We will sync this track to your video's transitions.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Custom Hashtag or Special Instructions
              </label>
              <textarea
                name="customTextNotes"
                value={formData.customTextNotes}
                onChange={handleInputChange}
                rows={2}
                placeholder="e.g. Hashtag #RohAnKiPooja, please add dress code: Traditional Ethnic"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-rose-600"
              />
            </div>

            <hr className="border-stone-100" />

            <div className="space-y-3.5 sm:space-y-4">
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                Where should we send your finalized video?
              </h3>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Your Full Name *</label>
                <input
                  required
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  placeholder="e.g. Pooja Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-rose-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email Address *</label>
                  <input
                    required
                    type="email"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    placeholder="pooja@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-rose-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    required
                    type="tel"
                    name="clientPhone"
                    value={formData.clientPhone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-rose-600"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2.5 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border border-stone-300 text-stone-700 font-semibold text-xs hover:bg-stone-50 shrink-0"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-initial px-5 sm:px-9 py-2.5 sm:py-3.5 rounded-full bg-rose-800 text-white font-bold text-xs hover:bg-rose-900 shadow-md transition disabled:opacity-50 text-center"
              >
                {loading ? 'Submitting Details...' : 'Submit Invitation Order 🚀'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================
          STEP 5: ORDER SUCCESS CONFIRMATION & TRACKING
         ========================================================= */}
      {step === 5 && orderResult && (
        <div className="bg-white p-5 sm:p-12 rounded-2xl sm:rounded-3xl border border-rose-100 shadow-md max-w-2xl mx-auto text-center space-y-4 sm:space-y-6 animate-fade-in">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-2xl sm:text-3xl font-bold">
            ✓
          </div>

          <div className="space-y-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-600">
              ORDER RECEIVED SUCCESSFULLY
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              We are crafting your wedding invitation video!
            </h2>
            <p className="text-[11px] sm:text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              Our video team is editing your template with your exact text, functions, and music.
            </p>
          </div>

          {/* Tracking Number Box */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 max-w-sm mx-auto space-y-1">
            <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">
              Your Order Tracking Number
            </span>
            <p className="font-mono text-xl sm:text-2xl font-extrabold text-stone-900 tracking-wider">
              {orderResult.orderNumber}
            </p>
          </div>

          <div className="text-xs text-stone-600 text-left bg-rose-50/50 p-3.5 sm:p-4 rounded-xl border border-rose-100 space-y-1.5 sm:space-y-2">
            <p><strong>Couple:</strong> {orderResult.brideName} & {orderResult.groomName}</p>
            <p><strong>Functions:</strong> {orderResult.events?.length} Ceremonies registered</p>
            <p><strong>Delivery Contact:</strong> WhatsApp {orderResult.clientPhone}</p>
            <p className="text-[10px] sm:text-[11px] text-stone-500 pt-1 border-t border-rose-100/60">
              You will receive an update once the final video is rendered. You can also track your order status anytime!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-2">
            <Link
              to={`/track-order?orderNumber=${encodeURIComponent(orderResult.orderNumber)}`}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-stone-900 text-white font-bold text-xs hover:bg-black transition shadow-xs text-center"
            >
              Track Video Status 🔍
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 transition text-center"
            >
              Return to Home
            </Link>
          </div>
        </div>
      )}

      {/* Video Modal Preview (Vertical 9:16 Short Video) */}
      {activePreviewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs">
          <div className="bg-stone-950 p-3 sm:p-4 rounded-2xl sm:rounded-3xl max-w-xs sm:max-w-sm w-full space-y-3 shadow-2xl border border-stone-800">
            <div className="flex items-center justify-between text-white text-xs font-bold px-1">
              <span>Vertical Short Video Preview</span>
              <button
                type="button"
                onClick={() => setActivePreviewVideo(null)}
                className="w-6 h-6 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-inner">
              <VideoPlayer url={activePreviewVideo} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
