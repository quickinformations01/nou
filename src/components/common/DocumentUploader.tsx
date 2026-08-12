import React, { useRef, useState } from 'react';
import { Upload, Camera, CheckCircle2, FileText, X, Eye, AlertCircle } from 'lucide-react';
import { DocumentItem } from '../../types';

interface DocumentUploaderProps {
  type: 'cnicFront' | 'cnicBack' | 'drivingLicense' | 'vehicleRegistration' | 'profilePhoto' | 'vehiclePhoto';
  title: string;
  description: string;
  required?: boolean;
  value?: DocumentItem;
  onChange: (doc: DocumentItem | undefined) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  type,
  title,
  description,
  required = false,
  value,
  onChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const docItem: DocumentItem = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type,
        title,
        fileName: file.name,
        fileType: file.type || 'image/jpeg',
        fileSize: file.size,
        dataUrl,
        uploadedAt: new Date().toISOString()
      };
      onChange(docItem);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      setError(null);
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      setError('Could not access camera. Please select a file from your device instead.');
      setIsCameraActive(false);
    }
  };

  const captureCameraPhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

      // Stop camera tracks
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
      setIsCameraActive(false);

      const docItem: DocumentItem = {
        id: `doc-cam-${Date.now()}`,
        type,
        title,
        fileName: `${type}_capture_${Date.now()}.jpg`,
        fileType: 'image/jpeg',
        fileSize: Math.round((dataUrl.length * 3) / 4),
        dataUrl,
        uploadedAt: new Date().toISOString()
      };
      onChange(docItem);
    }
  };

  const stopCamera = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
    }
    setIsCameraActive(false);
  };

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900 shadow-sm transition-all hover:border-sky-300 dark:hover:border-sky-700">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              {title}
            </h4>
            {required && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 font-medium">
                Required
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
        </div>

        {value && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Uploaded
          </span>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-3 p-2 bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Camera modal view */}
      {isCameraActive && (
        <div className="mt-3 p-3 bg-slate-950 rounded-xl flex flex-col items-center">
          <video ref={videoRef} autoPlay playsInline className="w-full max-h-56 rounded-lg object-cover" />
          <div className="flex gap-3 mt-3">
            <button
              type="button"
              onClick={captureCameraPhoto}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4" /> Take Photo
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Document Upload Box or Uploaded Preview */}
      {!isCameraActive && (
        <div className="mt-3">
          {value ? (
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center gap-3 overflow-hidden">
                {value.fileType.startsWith('image/') || value.dataUrl.startsWith('data:image') ? (
                  <img
                    src={value.dataUrl}
                    alt={value.title}
                    className="w-12 h-12 object-cover rounded-lg border border-slate-300 dark:border-slate-600 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-300 shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                )}
                <div className="truncate">
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{value.fileName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {(value.fileSize / 1024).toFixed(1)} KB • Saved in Cloudflare D1
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="p-1.5 text-slate-600 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                  title="View Document"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onChange(undefined)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-md transition-colors"
                  title="Remove Document"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2.5 px-3 border border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-500 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-sky-50/50 dark:hover:bg-sky-950/30 flex items-center justify-center gap-2 transition-all"
              >
                <Upload className="w-4 h-4 text-sky-500" />
                <span>Upload File (JPG, PNG, PDF)</span>
              </button>

              <button
                type="button"
                onClick={startCamera}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all shrink-0"
              >
                <Camera className="w-4 h-4 text-emerald-500" />
                <span>Capture Camera</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal image preview */}
      {previewOpen && value && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="relative max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-slate-100">{value.title}</h3>
              <button
                onClick={() => setPreviewOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 flex justify-center bg-slate-950 rounded-xl mt-3 overflow-auto max-h-[70vh]">
              {value.dataUrl.startsWith('data:image') || value.dataUrl.startsWith('data:application/pdf') ? (
                <img src={value.dataUrl} alt={value.title} className="max-h-[60vh] object-contain rounded-lg" />
              ) : (
                  <div className="text-slate-400 text-xs p-8 text-center">
                    Document Preview Available (File Type: {value.fileType})
                  </div>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>{value.fileName} ({(value.fileSize / 1024).toFixed(1)} KB)</span>
              <span className="text-sky-400 font-mono">D1 Record: {value.id}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
