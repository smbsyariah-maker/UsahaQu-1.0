import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Check, RefreshCw, Sparkles, AlertCircle, X } from 'lucide-react';
import { compressAndResizeImage, CompressionResult } from '../../utils/imageCompressor';

interface CameraAutoCompressorProps {
  onImageCaptured: (result: CompressionResult) => void;
  currentImage?: string;
  label?: string;
  placeholder?: string;
  buttonClassName?: string;
}

export const CameraAutoCompressor: React.FC<CameraAutoCompressorProps> = ({
  onImageCaptured,
  currentImage,
  label = 'Foto Produk (Auto-Compress 600x600)',
  placeholder = 'Ambil foto kamera atau pilih file',
  buttonClassName
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<CompressionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      // Auto compress & resize to max 600x600px, target 100-200KB
      const result = await compressAndResizeImage(file, file.name);
      setLastResult(result);
      onImageCaptured(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memproses kompresi foto');
    } finally {
      setIsProcessing(false);
      // Reset input value so same photo can be re-selected if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleTriggerCapture = () => {
    fileInputRef.current?.click();
  };

  const displayImage = lastResult?.dataUrl || currentImage;

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-[#008952]" />
            <span>{label}</span>
          </span>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
            Max 600×600 • ~150KB
          </span>
        </div>
      )}

      {/* Hidden native input with camera capture support */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Preview or Capture Button */}
      {displayImage ? (
        <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-slate-200 overflow-hidden shrink-0 border border-slate-300 relative shadow-xs">
              <img
                src={displayImage}
                alt="Preview Produk"
                className="w-full h-full object-cover"
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-white animate-spin" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Sparkles className="w-3.5 h-3.5 text-[#008952]" />
                <span className="truncate">Foto Siap Disimpan</span>
              </div>

              {lastResult ? (
                <div className="text-[11px] text-slate-500 mt-0.5 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="line-through text-slate-400">{lastResult.originalSizeKb} KB</span>
                    <span className="font-bold text-[#008952]">→ {lastResult.compressedSizeKb} KB</span>
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-1 rounded">
                      -{lastResult.compressionRatio}%
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Dimensi: {lastResult.width} × {lastResult.height} px
                  </div>
                </div>
              ) : (
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Foto tersimpan dalam memori lokal
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-slate-200/80">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleTriggerCapture}
              className="flex-1 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold py-1.5 px-3 rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Ambil / Ganti Foto</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={isProcessing}
          onClick={handleTriggerCapture}
          className={`w-full py-4 px-4 rounded-2xl border-2 border-dashed border-emerald-300 hover:border-[#008952] bg-emerald-50/40 hover:bg-emerald-50 text-[#008952] transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 active:scale-98 ${
            buttonClassName || ''
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2 text-xs font-bold">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Mengompresi ke 600×600px (~150KB)...</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-2xl bg-white shadow-xs border border-emerald-200 flex items-center justify-center text-[#008952]">
                <Camera className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xs font-extrabold text-slate-800">
                {placeholder}
              </span>
              <span className="text-[10px] text-slate-500">
                Otomatis di-resize max 600×600px & dikompresi 100KB-200KB
              </span>
            </>
          )}
        </button>
      )}

      {errorMsg && (
        <div className="text-[11px] text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-2 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
