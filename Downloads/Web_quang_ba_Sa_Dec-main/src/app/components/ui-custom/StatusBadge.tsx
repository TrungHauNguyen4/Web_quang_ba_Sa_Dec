import { ReactNode } from "react";

interface StatusBadgeProps {
  status: "published" | "draft" | "pending" | "processing" | "completed" | "rejected" | "approved";
  icon?: ReactNode;
}

export function StatusBadge({ status, icon }: StatusBadgeProps) {
  const styles = {
    published: "bg-green-100 text-green-700",
    completed: "bg-green-100 text-green-700",
    approved: "bg-green-100 text-green-700",
    draft: "bg-orange-100 text-orange-700",
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    rejected: "bg-red-100 text-red-700",
  };

  const labels = {
    published: "Đã xuất bản",
    completed: "Hoàn thành",
    approved: "Đã duyệt",
    draft: "Bản nháp",
    pending: "Chờ tiếp nhận",
    processing: "Đang xử lý",
    rejected: "Từ chối",
  };

  return (
    <span className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center w-fit gap-1.5 ${styles[status]}`}>
      {icon ? icon : (
        <span className={`w-1.5 h-1.5 rounded-full ${
          status === 'published' || status === 'completed' || status === 'approved' ? 'bg-green-500' :
          status === 'draft' ? 'bg-orange-500' :
          status === 'pending' ? 'bg-yellow-500' :
          status === 'processing' ? 'bg-blue-500' : 'bg-red-500'
        }`}></span>
      )}
      {labels[status]}
    </span>
  );
}
