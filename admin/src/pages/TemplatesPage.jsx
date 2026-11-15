import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/Dialog';
import { VideoPlayer } from '../components/ui/VideoPlayer';

export const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    category: 'Traditional',
    duration: '60s',
    price: '49',
  });

  const [activePreviewVideo, setActivePreviewVideo] = useState(null);

  // Initial fetch with demo fallback
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/templates');
      const data = await res.json();
      if (data.success && data.templates?.length > 0) {
        setTemplates(data.templates);
        return;
      }
    } catch {
      // fallback
    }

    // Default starter video templates for instant demonstration
    setTemplates([
      {
        id: 'tpl-1',
        title: 'Royal Heritage & Gold Palace',
        description: 'Traditional royal palace architecture with golden mandap animations and sitar background music. 4 Pages included.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
        category: 'Royal',
        duration: '60s',
        price: 69,
      },
      {
        id: 'tpl-2',
        title: 'Blush Floral & Golden Arch',
        description: 'Pastel pink watercolor blossoms, elegant typography, and romantic violin melodies. Includes Haldi, Sangeet & Reception.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
        category: 'Floral',
        duration: '45s',
        price: 49,
      },
      {
        id: 'tpl-3',
        title: 'Modern Minimalist Typography',
        description: 'Clean luxury black-and-white editorial aesthetic with modern calligraphy. Perfect for contemporary city weddings.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
        category: 'Minimalist',
        duration: '50s',
        price: 39,
      },
    ]);
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('wedding_admin_token');
      const res = await fetch('http://localhost:8000/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success && data.template) {
        setTemplates([data.template, ...templates]);
      } else {
        // Local state addition
        const newTemplate = {
          id: `tpl-${Date.now()}`,
          ...form,
          price: parseFloat(form.price) || 0,
        };
        setTemplates([newTemplate, ...templates]);
      }

      setIsModalOpen(false);
      setForm({
        title: '',
        description: '',
        videoUrl: '',
        thumbnailUrl: '',
        category: 'Traditional',
        duration: '60s',
        price: '49',
      });
    } catch {
      const newTemplate = {
        id: `tpl-${Date.now()}`,
        ...form,
        price: parseFloat(form.price) || 0,
      };
      setTemplates([newTemplate, ...templates]);
      setIsModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video template?')) return;
    try {
      const token = localStorage.getItem('wedding_admin_token');
      await fetch(`http://localhost:8000/api/templates/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch {
      // ignore
    }
    setTemplates(templates.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Video Invitation Templates</h1>
          <p className="text-xs text-stone-500 mt-1">
            Upload and showcase wedding invitation video samples that clients can choose from.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
          + Add New Video Template
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <Card key={tpl.id} className="overflow-hidden flex flex-col justify-between group hover:shadow-md transition">
            <div>
              {/* Video Thumbnail or Live Video Container */}
              <div className="relative aspect-video bg-stone-900 overflow-hidden">
                {tpl.thumbnailUrl ? (
                  <img
                    src={tpl.thumbnailUrl}
                    alt={tpl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-stone-950 text-stone-600">
                    <span className="text-3xl">🎬</span>
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
                  className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-white/90 text-stone-900 flex items-center justify-center shadow-lg hover:scale-110 transition text-sm font-bold"
                  title="Play Sample Video"
                >
                  ▶
                </button>
              </div>

              {/* Template Info */}
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-sm font-bold">{tpl.title}</CardTitle>
                  <span className="text-xs font-extrabold text-stone-900">${tpl.price}</span>
                </div>
                <CardDescription className="line-clamp-2 text-[11px] mt-1">
                  {tpl.description || 'Customizable page-by-page wedding invitation video.'}
                </CardDescription>
              </CardHeader>
            </div>

            <CardFooter className="p-4 pt-2 flex items-center justify-between border-t border-stone-100">
              <span className="text-[10px] text-stone-400 font-mono">
                Source: {tpl.videoUrl ? 'Video linked' : 'No link'}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActivePreviewVideo(tpl.videoUrl)}
                  className="text-[11px] h-7 px-2.5"
                >
                  Preview
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(tpl.id)}
                  className="text-[11px] h-7 px-2.5 text-red-600 hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add New Template Dialog (Shadcn style) */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Wedding Video Template</DialogTitle>
          <DialogDescription>
            Enter short video invitation details that clients can view and select on the frontpage.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateTemplate} className="space-y-4">
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
            <label className="block text-xs font-semibold text-stone-700 mb-1">Video Preview URL *</label>
            <Input
              required
              name="videoUrl"
              value={form.videoUrl}
              onChange={handleInputChange}
              placeholder="https://... MP4 link, YouTube, or Google Drive embed"
            />
            <span className="text-[10px] text-stone-400 mt-0.5 block">
              Sample video showing animation, transitions, and timing.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Cover Thumbnail Image URL</label>
            <Input
              name="thumbnailUrl"
              value={form.thumbnailUrl}
              onChange={handleInputChange}
              placeholder="https://... cover photo / poster"
            />
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
                placeholder="e.g. 60s"
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
              {loading ? 'Saving...' : 'Add Template'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Video Player Modal Preview */}
      <Dialog open={Boolean(activePreviewVideo)} onClose={() => setActivePreviewVideo(null)} maxWidth="max-w-xl">
        <DialogHeader>
          <DialogTitle>Video Template Preview</DialogTitle>
          <DialogDescription>Sample preview as seen by prospective couples.</DialogDescription>
        </DialogHeader>

        <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
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
