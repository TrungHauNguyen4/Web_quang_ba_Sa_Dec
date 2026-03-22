import { Plus } from "lucide-react";

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSize?: string;
}

export function FileUpload({ label = "Hình ảnh", accept = "PNG, JPG, WEBP", maxSize = "5MB" }: FileUploadProps) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-semibold text-stone-700">{label}</label>}
      <div className="border-2 border-dashed border-stone-200 rounded-xl p-8 text-center bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-green-600">
          <Plus size={24} />
        </div>
        <p className="text-sm font-medium text-stone-700 mb-1">Click để tải lên hoặc kéo thả vào đây</p>
        <p className="text-xs text-stone-500">{accept} (Tối đa {maxSize})</p>
      </div>
    </div>
  );
}
