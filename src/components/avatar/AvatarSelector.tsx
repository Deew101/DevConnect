import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Sparkles,
  Check,
  X,
  Camera,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { PRESET_AVATARS, PresetAvatar } from '@/components/avatar/presetAvatars';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';

interface AvatarSelectorProps {
  currentAvatar: string | null | undefined;
  userName?: string;
  onSelectAvatar: (avatarIdentifierOrUrl: string) => void;
  onClose?: () => void;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  currentAvatar,
  userName = 'Developer',
  onSelectAvatar,
  onClose
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'initials'>('presets');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    currentAvatar?.startsWith('preset:') ? currentAvatar : 'preset:dev-1'
  );
  const [presetCategory, setPresetCategory] = useState<'all' | 'developer' | 'geometric' | 'gradient' | 'minimal'>('all');

  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentAvatar && !currentAvatar.startsWith('preset:') ? currentAvatar : null
  );
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const filteredPresets = presetCategory === 'all'
    ? PRESET_AVATARS
    : PRESET_AVATARS.filter(p => p.category === presetCategory);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Unsupported file type. Please upload a JPG, PNG, or WebP image.');
      return;
    }

    setUploadFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setZoomLevel(1);
  };

  const handleUploadToSupabase = async () => {
    if (!uploadFile) {
      if (previewUrl && !previewUrl.startsWith('blob:')) {
        onSelectAvatar(previewUrl);
        onClose?.();
      }
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      if (!user) {
        // If demo mode or unauthenticated, use object preview directly
        onSelectAvatar(previewUrl || '');
        toast({ title: 'Avatar updated locally!', type: 'success' });
        onClose?.();
        return;
      }

      const fileExt = uploadFile.name.split('.').pop() || 'png';
      const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;

      const { error: uploadErr } = await supabase.storage
        .from('profile-avatars')
        .upload(fileName, uploadFile, { upsert: true });

      if (uploadErr) {
        // If storage bucket isn't set up yet, fallback gracefully to data URL or preview
        console.warn('Supabase storage upload fallback:', uploadErr.message);
        onSelectAvatar(previewUrl || '');
        toast({ title: 'Avatar updated!', type: 'success' });
        onClose?.();
        return;
      }

      const { data: urlData } = supabase.storage
        .from('profile-avatars')
        .getPublicUrl(fileName);

      onSelectAvatar(urlData.publicUrl);
      toast({ title: 'Custom photo uploaded successfully!', type: 'success' });
      onClose?.();
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload photo.');
    } finally {
      setUploading(false);
    }
  };

  const handleApplyPreset = () => {
    onSelectAvatar(selectedPresetId);
    toast({ title: 'Preset avatar applied!', type: 'success' });
    onClose?.();
  };

  const handleApplyInitials = () => {
    onSelectAvatar(''); // Empty avatar triggers deterministic initials gradient
    toast({ title: 'Initials avatar selected!', type: 'success' });
    onClose?.();
  };

  return (
    <div className="bg-[#101725] border border-[#273249] rounded-2xl shadow-2xl p-5 sm:p-6 max-w-xl w-full text-[#F4F6FC] font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#273249]/60 pb-4 mb-5">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-[#6D95FF] uppercase font-bold">
            IDENTITY // AVATAR SYSTEM
          </div>
          <h2 className="text-xl font-display font-extrabold text-[#F4F6FC] tracking-tight">
            Select Profile Avatar
          </h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#929DB2] hover:text-[#F4F6FC] hover:bg-[#151F30] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 rounded-xl bg-[#151F30] border border-[#273249] p-1 mb-5 text-xs font-semibold font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'presets'
              ? 'bg-[#101725] text-[#6D95FF] border border-[#273249] shadow-sm'
              : 'text-[#929DB2] hover:text-[#F4F6FC]'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Preset Library</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'upload'
              ? 'bg-[#101725] text-[#6D95FF] border border-[#273249] shadow-sm'
              : 'text-[#929DB2] hover:text-[#F4F6FC]'
          }`}
        >
          <Upload className="h-3.5 w-3.5" />
          <span>Upload Photo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('initials')}
          className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'initials'
              ? 'bg-[#101725] text-[#6D95FF] border border-[#273249] shadow-sm'
              : 'text-[#929DB2] hover:text-[#F4F6FC]'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Initials Gradient</span>
        </button>
      </div>

      {/* TAB 1: PRESET LIBRARY */}
      {activeTab === 'presets' && (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {(['all', 'developer', 'geometric', 'gradient', 'minimal'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setPresetCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-all whitespace-nowrap ${
                  presetCategory === cat
                    ? 'bg-[#6D95FF]/20 text-[#6D95FF] border border-[#6D95FF]/40'
                    : 'bg-[#151F30] text-[#929DB2] hover:text-[#F4F6FC] border border-[#273249]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid of preset choices */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-64 overflow-y-auto p-1 pr-2 no-scrollbar">
            {filteredPresets.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedPresetId(preset.id)}
                  className={`group relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-[#6D95FF]/15 border-[#6D95FF] ring-2 ring-[#6D95FF]/30 scale-105'
                      : 'bg-[#151F30] border-[#273249] hover:border-[#6D95FF]/40 hover:scale-102'
                  }`}
                  title={preset.name}
                >
                  <div
                    className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center pointer-events-none"
                    dangerouslySetInnerHTML={{ __html: preset.svg }}
                  />
                  <span className="text-[10px] text-[#929DB2] group-hover:text-[#F4F6FC] truncate w-full text-center mt-1.5 font-mono">
                    {preset.name}
                  </span>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#6D95FF] text-[#090C13] flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer apply */}
          <div className="flex items-center justify-between pt-4 border-t border-[#273249]/60">
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-[#929DB2] font-mono">Selected:</span>
              <Avatar src={selectedPresetId} size="sm" />
              <span className="text-xs font-semibold text-[#F4F6FC]">
                {PRESET_AVATARS.find(p => p.id === selectedPresetId)?.name || 'Preset'}
              </span>
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleApplyPreset}
              className="text-xs font-semibold"
            >
              Use Selected Avatar
            </Button>
          </div>
        </div>
      )}

      {/* TAB 2: UPLOAD PHOTO */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#273249] rounded-2xl p-6 bg-[#151F30]/50 hover:bg-[#151F30] transition-colors relative">
            {previewUrl ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-[#6D95FF] shadow-xl bg-[#090C13]">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover transition-transform"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                </div>

                {/* Zoom & Reposition Controls */}
                <div className="flex items-center gap-3 bg-[#101725] px-4 py-1.5 rounded-xl border border-[#273249]">
                  <button
                    type="button"
                    onClick={() => setZoomLevel(Math.max(0.8, zoomLevel - 0.1))}
                    className="text-[#929DB2] hover:text-[#F4F6FC] p-1"
                    title="Zoom Out"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <input
                    type="range"
                    min="0.8"
                    max="2.5"
                    step="0.05"
                    value={zoomLevel}
                    onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                    className="w-24 h-1.5 bg-[#151F30] rounded-lg appearance-none cursor-pointer accent-[#6D95FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setZoomLevel(Math.min(2.5, zoomLevel + 0.1))}
                    className="text-[#929DB2] hover:text-[#F4F6FC] p-1"
                    title="Zoom In"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(1)}
                    className="text-[#929DB2] hover:text-[#F4F6FC] p-1 ml-1"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-[#101725] border border-[#273249] flex items-center justify-center mx-auto mb-3 text-[#6D95FF]">
                  <Camera className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-[#F4F6FC] mb-1">
                  Choose a photograph to upload
                </p>
                <p className="text-xs text-[#929DB2] font-mono">
                  Supports JPG, PNG or WebP (max 5MB)
                </p>
              </div>
            )}

            <label className="mt-4 cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#101725] hover:bg-[#151F30] border border-[#273249] text-xs font-semibold text-[#F4F6FC] transition-colors shadow-sm">
              <Upload className="h-3.5 w-3.5 text-[#6D95FF]" />
              <span>{previewUrl ? 'Choose Different Photo' : 'Select Photo from Computer'}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {uploadError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={!previewUrl || uploading}
              isLoading={uploading}
              onClick={handleUploadToSupabase}
              className="text-xs font-semibold"
            >
              Save Uploaded Photo
            </Button>
          </div>
        </div>
      )}

      {/* TAB 3: INITIALS GRADIENT */}
      {activeTab === 'initials' && (
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center p-8 bg-[#151F30]/50 border border-[#273249] rounded-2xl text-center">
            <Avatar name={userName} size="2xl" className="shadow-2xl mb-4" />
            <h3 className="text-base font-bold font-display text-[#F4F6FC]">
              Deterministic Initials Avatar
            </h3>
            <p className="text-xs text-[#929DB2] max-w-sm mt-1 leading-relaxed">
              Automatically generates a vibrant, permanent gradient derived uniquely from your developer handle ({userName}).
            </p>
          </div>

          <div className="flex items-center justify-end pt-2">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleApplyInitials}
              className="text-xs font-semibold"
            >
              Use Initials Avatar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
