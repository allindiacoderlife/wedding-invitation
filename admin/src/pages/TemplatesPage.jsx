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
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-950 text-stone-600">
                      <span className="text-3xl">📱</span>
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
                  <CardDescription className="line-clamp-2 text-[11px] mt-1">
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
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingTemplate ? 'Edit Wedding Video Template' : 'Add New Wedding Video Template'}
          </DialogTitle>
          <DialogDescription>
            {editingTemplate
              ? 'Update vertical short video details, pricing, and video link.'
              : 'Enter vertical (9:16) short video details that couples can view and choose from.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmitTemplate} className="space-y-4">
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
              💡 Google Drive links (e.g. drive.google.com/file/d/.../view) are automatically converted into direct images. Make sure file sharing is set to "Anyone with the link".
            </span>
            {form.thumbnailUrl && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] font-semibold text-stone-500">Preview:</span>
                <img
                  src={getDirectImageUrl(form.thumbnailUrl)}
                  alt="Thumbnail Preview"
                  className="w-10 h-16 object-cover rounded-md border border-stone-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
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
            <label className="block text-xs font-semibold text-stone-700 mb-1">Description & Page Breakdown</label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="e.g. Page 1: Ganesh Vandana & Bride/Groom, Page 2: Haldi, Page 3: Wedding Muhurtham, Page 4: Reception."
            />
          </div>

          <DialogFooter>
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
