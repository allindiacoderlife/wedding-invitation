import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/Dialog';
import { VideoPlayer } from '../components/ui/VideoPlayer';
import { API_BASE_URL } from '../config/api';

export const getDirectImageUrl = (url) => {
  if (!url) return '';
  const gDriveMatch = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
  if (gDriveMatch && gDriveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${gDriveMatch[1]}`;
  }
  return url;
};

export const TEMPLATE_PRESETS = [
  {
    id: 'standard_3_page',
    name: '🌟 Standard 3-Page (Haldi, Muhurtham, Reception)',
    slides: [
      { pageNumber: 1, name: 'Haldi & Chooda Ceremony' },
      { pageNumber: 2, name: 'Shubh Vivah (Wedding Muhurtham)' },
      { pageNumber: 3, name: 'Grand Reception Dinner' },
    ],
    attributes: [
      { key: 'weddingHashtag', label: 'Wedding Hashtag', placeholder: 'e.g. #RohAnKiPooja' },
    ],
  },
  {
    id: 'royal_4_page',
    name: '👑 Royal 4-Page Heritage (Haldi, Sangeet, Muhurtham, Reception)',
    slides: [
      { pageNumber: 1, name: 'Ganesh Vandana & Haldi' },
      { pageNumber: 2, name: 'Mehendi & Musical Sangeet' },
      { pageNumber: 3, name: 'Auspicious Vivah Muhurtham' },
      { pageNumber: 4, name: 'Royal Reception Gala' },
    ],
    attributes: [
      { key: 'weddingHashtag', label: 'Wedding Hashtag', placeholder: 'e.g. #RohAnKiPooja' },
      { key: 'grandparentsBlessings', label: 'Family & Grandparents Blessings', placeholder: 'e.g. With blessings of Late Shri...' },
    ],
  },
  {
    id: 'modern_2_page',
    name: '🌸 Modern Minimalist 2-Page (Ceremony & Reception)',
    slides: [
      { pageNumber: 1, name: 'Wedding Ceremony' },
      { pageNumber: 2, name: 'Dinner & Celebration' },
    ],
    attributes: [
      { key: 'dressCode', label: 'Dress Code / Attire Theme', placeholder: 'e.g. Black Tie or Pastel Traditional' },
      { key: 'rsvpContact', label: 'RSVP Contact Phone / Email', placeholder: 'e.g. +91 98765 43210 (Sister)' },
    ],
  },
  {
    id: 'custom',
    name: '⚙️ Custom Dynamic Pages & Attributes',
    slides: [],
    attributes: [],
  },
];

const DEFAULT_FORM_SCHEMA = {
  preset: 'standard_3_page',
  slides: [
    { pageNumber: 1, name: 'Haldi & Chooda Ceremony' },
    { pageNumber: 2, name: 'Shubh Vivah (Wedding Muhurtham)' },
    { pageNumber: 3, name: 'Grand Reception Dinner' },
  ],
  attributes: [
    { key: 'weddingHashtag', label: 'Wedding Hashtag', placeholder: 'e.g. #RohAnKiPooja' },
  ],
};

export const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    category: 'Traditional',
    duration: '30s',
    price: '49',
    formSchema: DEFAULT_FORM_SCHEMA,
  });

  const [activePreviewVideo, setActivePreviewVideo] = useState(null);

  // Initial fetch
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/templates`);
      const data = await res.json();
      if (data.success && Array.isArray(data.templates)) {
        setTemplates(data.templates);
      } else {
        setTemplates([]);
      }
    } catch (err) {
      console.error('Failed to fetch templates:', err);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePresetChange = (presetId) => {
    const selected = TEMPLATE_PRESETS.find((p) => p.id === presetId);
    if (!selected) return;

    if (presetId === 'custom') {
      setForm((prev) => ({
        ...prev,
        formSchema: {
          preset: 'custom',
          slides: prev.formSchema?.slides?.length ? prev.formSchema.slides : [
            { pageNumber: 1, name: 'Function 1' },
            { pageNumber: 2, name: 'Function 2' },
          ],
          attributes: prev.formSchema?.attributes || [],
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        formSchema: {
          preset: selected.id,
          slides: [...selected.slides],
          attributes: [...selected.attributes],
        },
      }));
    }
  };

  const handleAddSlide = () => {
    const currentSlides = form.formSchema?.slides || [];
    const newSlide = {
      pageNumber: currentSlides.length + 1,
      name: `Slide ${currentSlides.length + 1}: Event`,
    };
    setForm((prev) => ({
      ...prev,
      formSchema: {
        ...prev.formSchema,
        slides: [...currentSlides, newSlide],
      },
    }));
  };

  const handleUpdateSlideName = (index, newName) => {
    const updated = [...(form.formSchema?.slides || [])];
    updated[index] = { ...updated[index], name: newName };
    setForm((prev) => ({
      ...prev,
      formSchema: {
        ...prev.formSchema,
        slides: updated,
      },
    }));
  };

  const handleRemoveSlide = (index) => {
    const updated = form.formSchema?.slides?.filter((_, i) => i !== index) || [];
    const renumbered = updated.map((s, idx) => ({ ...s, pageNumber: idx + 1 }));
    setForm((prev) => ({
      ...prev,
      formSchema: {
        ...prev.formSchema,
        slides: renumbered,
      },
    }));
  };

  const handleAddAttribute = () => {
    const currentAttrs = form.formSchema?.attributes || [];
    const newAttr = {
      key: `custom_${Date.now()}`,
      label: 'New Custom Attribute',
      placeholder: 'e.g. Value...',
    };
    setForm((prev) => ({
      ...prev,
      formSchema: {
        ...prev.formSchema,
        attributes: [...currentAttrs, newAttr],
      },
    }));
  };

  const handleUpdateAttribute = (index, field, value) => {
    const updated = [...(form.formSchema?.attributes || [])];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'label' && !updated[index].customKeySet) {
      updated[index].key = value.toLowerCase().replace(/[^a-z0-9]/g, '_');
    }
    setForm((prev) => ({
      ...prev,
      formSchema: {
        ...prev.formSchema,
        attributes: updated,
      },
    }));
  };

  const handleRemoveAttribute = (index) => {
    const updated = form.formSchema?.attributes?.filter((_, i) => i !== index) || [];
    setForm((prev) => ({
      ...prev,
      formSchema: {
        ...prev.formSchema,
        attributes: updated,
      },
    }));
  };

  const handleOpenCreate = () => {
    setEditingTemplate(null);
    setForm({
      title: '',
      description: '',
      videoUrl: '',
      thumbnailUrl: '',
      category: 'Traditional',
      duration: '30s',
      price: '49',
      formSchema: DEFAULT_FORM_SCHEMA,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tpl) => {
    setEditingTemplate(tpl);
    setForm({
      title: tpl.title || '',
      description: tpl.description || '',
      videoUrl: tpl.videoUrl || '',
      thumbnailUrl: tpl.thumbnailUrl || '',
      category: tpl.category || 'Traditional',
      duration: tpl.duration || '30s',
      price: tpl.price !== undefined ? String(tpl.price) : '49',
      formSchema: tpl.formSchema || DEFAULT_FORM_SCHEMA,
    });
    setIsModalOpen(true);
  };

  const handleSubmitTemplate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('wedding_admin_token');
      const isEdit = Boolean(editingTemplate);
      const url = isEdit
        ? `${API_BASE_URL}/api/templates/${editingTemplate.id}`
        : `${API_BASE_URL}/api/templates`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success && data.template) {
        if (isEdit) {
          setTemplates((prev) =>
            prev.map((t) => (t.id === editingTemplate.id ? data.template : t))
          );
        } else {
          setTemplates((prev) => [data.template, ...prev]);
        }
      } else {
        if (isEdit) {
          setTemplates((prev) =>
            prev.map((t) =>
              t.id === editingTemplate.id
                ? { ...t, ...form, price: parseFloat(form.price) || 0 }
                : t
            )
          );
        } else {
          const newTemplate = {
            id: `tpl-${Date.now()}`,
            ...form,
            price: parseFloat(form.price) || 0,
          };
          setTemplates((prev) => [newTemplate, ...prev]);
        }
      }

      setIsModalOpen(false);
      setEditingTemplate(null);
    } catch (err) {
      console.error('Error saving template:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video template?')) return;
    try {
      const token = localStorage.getItem('wedding_admin_token');
      await fetch(`${API_BASE_URL}/api/templates/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch {
      // ignore
    }
    setTemplates(templates.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Video Invitation Templates</h1>
          <p className="text-xs text-stone-500 mt-1">
            Upload, edit, and showcase vertical (9:16) short video samples that clients can choose from.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenCreate}>
          + Add New Video Template
        </Button>
      </div>

      {/* Templates Grid / Empty State */}
      {loading ? (
        <div className="py-20 text-center">
          <span className="text-2xl animate-spin inline-block">⏳</span>
          <p className="text-xs font-medium text-stone-500 mt-2">Loading templates...</p>
        </div>
      ) : templates.length === 0 ? (
        <Card className="p-16 text-center border-dashed border-2 border-stone-200 bg-stone-50/50">
          <div className="flex flex-col items-center justify-center space-y-3 max-w-sm mx-auto">
            <span className="text-4xl">🎬</span>
            <h3 className="font-bold text-stone-900 text-sm">No Video Templates Added Yet</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Upload your vertical short video preview links (Google Drive, MP4, or YouTube Shorts) so couples can preview and choose a style for their wedding invitation.
            </p>
            <Button variant="primary" size="sm" onClick={handleOpenCreate} className="mt-2">
              + Add First Video Template
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {templates.map((tpl) => (
            <Card key={tpl.id} className="overflow-hidden flex flex-col justify-between group hover:shadow-md transition">
              <div>
                {/* Vertical 9:16 Video Container */}
                <div className="relative aspect-[9/16] bg-stone-900 overflow-hidden">
                  {tpl.thumbnailUrl ? (
                    <img
                      src={getDirectImageUrl(tpl.thumbnailUrl)}
                      alt={tpl.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        const match = tpl.thumbnailUrl.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
                        if (match && match[1] && !e.currentTarget.dataset.triedFallback) {
                          e.currentTarget.dataset.triedFallback = 'true';
                          e.currentTarget.src = `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 text-stone-400 p-4 text-center">
                      <span className="text-4xl mb-2">🎬</span>
                      <span className="text-[11px] font-medium text-stone-300">Vertical Short Video</span>
                      <span className="text-[9px] text-stone-500 mt-1">Click Preview to Play</span>
                    </div>
                  )}

                  {/* Duration & Category Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <Badge variant="default" className="bg-black/70 backdrop-blur-xs text-[9px]">
                      {tpl.category}
                    </Badge>
                    <Badge variant="secondary" className="bg-white/90 text-stone-900 text-[9px]">
                      {tpl.duration}
                    </Badge>
                  </div>

                  {/* Play Button Overlay */}
                  <button
                    type="button"
                    onClick={() => setActivePreviewVideo(tpl.videoUrl)}
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/90 text-stone-900 flex items-center justify-center shadow-lg hover:scale-110 transition text-sm font-bold cursor-pointer"
                    title="Play Short Video"
                  >
                    ▶
                  </button>
                </div>

                {/* Template Info */}
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-sm font-bold truncate">{tpl.title}</CardTitle>
                    <span className="text-xs font-extrabold text-stone-900">${tpl.price}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-semibold">
                      📄 {tpl.formSchema?.slides?.length || 3} Slides
                    </span>
                    {tpl.formSchema?.attributes?.length > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-semibold">
                        ✨ {tpl.formSchema.attributes.length} Custom Fields
                      </span>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2 text-[11px] mt-1.5">
                    {tpl.description || 'Customizable page-by-page wedding invitation video.'}
                  </CardDescription>
                </CardHeader>
              </div>

              <CardFooter className="p-4 pt-2 flex items-center justify-between border-t border-stone-100 gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActivePreviewVideo(tpl.videoUrl)}
                  className="text-[11px] h-7 px-2.5 flex-1"
                >
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(tpl)}
                  className="text-[11px] h-7 px-2.5 flex-1 text-stone-800 hover:bg-stone-100"
                >
                  Edit ✏️
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(tpl.id)}
                  className="text-[11px] h-7 px-2 text-red-600 hover:bg-red-50"
                  title="Delete Template"
                >
                  🗑️
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Template Dialog (Shadcn style) */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingTemplate ? 'Edit Wedding Video Template' : 'Add New Wedding Video Template'}
          </DialogTitle>
          <DialogDescription>
            {editingTemplate
              ? 'Update vertical short video details, pricing, slide pages, and dynamic form attributes.'
              : 'Enter vertical (9:16) short video details, slide pages, and dynamic form attributes.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmitTemplate} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Template Title *</label>
            <Input
              required
              name="title"
              value={form.title}
              onChange={handleInputChange}
              placeholder="e.g. Royal Gold Floral Wedding Invitation"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Vertical Video Preview URL *</label>
            <Input
              required
              name="videoUrl"
              value={form.videoUrl}
              onChange={handleInputChange}
              placeholder="https://... Google Drive, MP4, or YouTube Shorts link"
            />
            <span className="text-[10px] text-stone-400 mt-0.5 block">
              Vertical (9:16) short video preview for WhatsApp and mobile viewing.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Cover Thumbnail Image URL (Vertical)</label>
            <Input
              name="thumbnailUrl"
              value={form.thumbnailUrl}
              onChange={handleInputChange}
              placeholder="https://... Google Drive image link or direct photo URL"
            />
            <span className="text-[10px] text-stone-400 mt-0.5 block">
              💡 Google Drive links (e.g. drive.google.com/file/d/.../view) are automatically converted into direct images.
            </span>
            {form.thumbnailUrl && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] font-semibold text-stone-500">Preview:</span>
                <img
                  src={getDirectImageUrl(form.thumbnailUrl)}
                  alt="Thumbnail Preview"
                  referrerPolicy="no-referrer"
                  className="w-10 h-16 object-cover rounded-md border border-stone-200"
                  onError={(e) => {
                    const match = form.thumbnailUrl.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
                    if (match && match[1] && !e.currentTarget.dataset.triedFallback) {
                      e.currentTarget.dataset.triedFallback = 'true';
                      e.currentTarget.src = `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
                    }
                  }}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Theme Style</label>
              <Select name="category" value={form.category} onChange={handleInputChange}>
                <option value="Traditional">Traditional</option>
                <option value="Royal">Royal Palace</option>
                <option value="Floral">Blush Floral</option>
                <option value="Minimalist">Minimalist</option>
                <option value="Animated">Animated / Cartoon</option>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Duration</label>
              <Input
                name="duration"
                value={form.duration}
                onChange={handleInputChange}
                placeholder="e.g. 30s, 60s"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Price ($)</label>
              <Input
                type="number"
                name="price"
                value={form.price}
                onChange={handleInputChange}
                placeholder="49"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Description & Notes</label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              rows={2}
              placeholder="e.g. Royal aesthetic short video invitation for luxury weddings."
            />
          </div>

          {/* Dynamic Form Structure & Slide Pages Builder */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <span>📐</span>
                <span>Dynamic Form & Slide Pages Builder</span>
              </h4>
              <p className="text-[11px] text-stone-500">
                Configure the exact function slides and extra attributes for this template.
              </p>
            </div>

            {/* Preset Selector */}
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                Apply Predefined Form Preset
              </label>
              <Select
                value={form.formSchema?.preset || 'standard_3_page'}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="bg-white text-xs"
              >
                {TEMPLATE_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Slide Pages Manager */}
            <div className="space-y-2 pt-2 border-t border-stone-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-800">
                  Function Slides ({form.formSchema?.slides?.length || 0})
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSlide}
                  className="h-6 text-[10px] px-2 bg-white"
                >
                  + Add Slide Page
                </Button>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {form.formSchema?.slides?.map((slide, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-stone-200 text-xs">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {slide.pageNumber}
                    </span>
                    <input
                      type="text"
                      value={slide.name}
                      onChange={(e) => handleUpdateSlideName(sIdx, e.target.value)}
                      placeholder="e.g. Haldi & Chooda"
                      className="flex-1 px-2.5 py-1 text-xs border border-stone-200 rounded-lg focus:outline-rose-600"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSlide(sIdx)}
                      className="text-stone-400 hover:text-red-600 p-1 text-sm font-bold"
                      title="Remove Slide"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Attributes Manager */}
            <div className="space-y-2 pt-2 border-t border-stone-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-800">
                  Custom Template Attributes ({form.formSchema?.attributes?.length || 0})
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddAttribute}
                  className="h-6 text-[10px] px-2 bg-white"
                >
                  + Add Custom Field
                </Button>
              </div>

              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {form.formSchema?.attributes?.length === 0 ? (
                  <p className="text-[10px] text-stone-400 italic">No custom attributes added (only standard couple names & music).</p>
                ) : (
                  form.formSchema?.attributes?.map((attr, aIdx) => (
                    <div key={aIdx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-stone-200 text-xs">
                      <input
                        type="text"
                        value={attr.label}
                        onChange={(e) => handleUpdateAttribute(aIdx, 'label', e.target.value)}
                        placeholder="Field Label (e.g. Hashtag)"
                        className="w-1/2 px-2.5 py-1 text-xs border border-stone-200 rounded-lg focus:outline-rose-600 font-semibold"
                      />
                      <input
                        type="text"
                        value={attr.placeholder || ''}
                        onChange={(e) => handleUpdateAttribute(aIdx, 'placeholder', e.target.value)}
                        placeholder="Placeholder helper"
                        className="flex-1 px-2.5 py-1 text-xs border border-stone-200 rounded-lg focus:outline-rose-600 text-stone-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAttribute(aIdx)}
                        className="text-stone-400 hover:text-red-600 p-1 text-sm font-bold"
                        title="Remove Attribute"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : editingTemplate ? 'Save Changes' : 'Add Template'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Video Player Modal Preview (Vertical 9:16 Short Video) */}
      <Dialog open={Boolean(activePreviewVideo)} onClose={() => setActivePreviewVideo(null)} maxWidth="max-w-sm">
        <DialogHeader>
          <DialogTitle>Vertical Short Video Preview</DialogTitle>
          <DialogDescription>9:16 portrait video preview as seen on mobile & WhatsApp.</DialogDescription>
        </DialogHeader>

        <div className="aspect-[9/16] bg-black rounded-2xl overflow-hidden flex items-center justify-center shadow-inner">
          {activePreviewVideo && (
            <VideoPlayer url={activePreviewVideo} />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setActivePreviewVideo(null)}>
            Close Player
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
