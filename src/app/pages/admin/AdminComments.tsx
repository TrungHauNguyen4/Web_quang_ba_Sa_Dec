import { useEffect, useMemo, useState } from "react";
import { Search, CheckCircle, XCircle, ExternalLink, Trash2 } from "lucide-react";
import { commentService } from "../../services/comment.service";
import { PaginationControls } from "../../components/ui/PaginationControls";

type CommentItem = {
  id: string;
  targetType: string;
  targetId: string;
  targetSlug?: string | null;
  targetTitle?: string | null;
  userName: string;
  email: string;
  content: string;
  status: number | string;
  createdAt: string;
};

export function AdminComments() {
  const [items, setItems] = useState<CommentItem[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showAllMode, setShowAllMode] = useState(false);
  const [autoApproveEnabled, setAutoApproveEnabled] = useState(false);
  const [autoApproveLoading, setAutoApproveLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = statusFilter === "all"
        ? { page, pageSize: showAllMode ? 1000 : pageSize }
        : { page, pageSize: showAllMode ? 1000 : pageSize, status: statusFilter as "Pending" | "Approved" | "Rejected" };
      const response = await commentService.getForModeration(params);
      setItems(Array.isArray(response?.items) ? response.items : []);
      setTotal(Number(response?.total) || 0);
      setTotalPages(Number(response?.totalPages) || 0);
    } catch {
      setError("Không tải được danh sách bình luận.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [statusFilter, page, pageSize, showAllMode]);

  useEffect(() => {
    let active = true;

    const loadAutoApprove = async () => {
      try {
        const result = await commentService.getAutoApprove();
        if (!active) return;
        setAutoApproveEnabled(Boolean(result?.enabled));
      } catch {
        if (!active) return;
        setAutoApproveEnabled(false);
      }
    };

    void loadAutoApprove();

    return () => {
      active = false;
    };
  }, []);

  const normalizeStatus = (status: number | string): "Pending" | "Approved" | "Rejected" => {
    if (status === 0 || status === "0" || status === "Pending" || status === "pending") return "Pending";
    if (status === 1 || status === "1" || status === "Approved" || status === "approved") return "Approved";
    return "Rejected";
  };

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.trim().toLowerCase();
    return items.filter((x) => x.content.toLowerCase().includes(q) || x.email.toLowerCase().includes(q) || x.userName.toLowerCase().includes(q));
  }, [items, query]);

  const handleApprove = async (id: string) => {
    try {
      await commentService.approve(id);
      await loadData();
    } catch {
      setError("Duyệt bình luận thất bại.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await commentService.reject(id);
      await loadData();
    } catch {
      setError("Từ chối bình luận thất bại.");
    }
  };

  const handleDeleteOne = async (id: string) => {
    const ok = window.confirm("Bạn muốn xóa bình luận này?");
    if (!ok) return;

    try {
      await commentService.remove(id);
      await loadData();
    } catch {
      setError("Xóa bình luận thất bại.");
    }
  };

  const handleDeleteAll = async () => {
    const ok = window.confirm("Bạn muốn xóa hoàn toàn toàn bộ danh sách bình luận? Hành động này không thể hoàn tác.");
    if (!ok) return;

    try {
      await commentService.clearAll();
      await loadData();
    } catch {
      setError("Xóa toàn bộ bình luận thất bại.");
    }
  };

  const toggleAutoApprove = async () => {
    setAutoApproveLoading(true);
    setError(null);
    try {
      const result = await commentService.setAutoApprove(!autoApproveEnabled);
      setAutoApproveEnabled(Boolean(result?.enabled));
    } catch {
      setError("Không cập nhật được chế độ tự động duyệt.");
    } finally {
      setAutoApproveLoading(false);
    }
  };

  const toDate = (value: string) => {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("vi-VN");
  };

  const targetUrl = (item: CommentItem) => {
    const normalized = String(item.targetType || "").toLowerCase();
    if ((normalized === "news" || normalized === "tin-tuc" || normalized === "tintuc") && item.targetSlug) {
      return `/tin-tuc/${item.targetSlug}`;
    }
    if ((normalized === "destination" || normalized === "dia-danh" || normalized === "diadiem") && item.targetSlug) {
      return `/dia-danh/${item.targetSlug}`;
    }
    return "#";
  };

  const targetLabel = (item: CommentItem) => {
    if (item.targetTitle && item.targetTitle.trim()) return item.targetTitle;
    return `Mẫu tin ${item.targetId}`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Quản lý bình luận</h1>
        <p className="text-sm text-stone-500">Duyệt, phản hồi và quản lý bình luận từ người dùng.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-stone-800">Tự động duyệt bình luận mới</div>
          <div className="text-xs text-stone-500">Khi bật, bình luận người dùng gửi sẽ hiển thị ngay trên bài viết.</div>
        </div>
        <button
          onClick={() => void toggleAutoApprove()}
          disabled={autoApproveLoading}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${autoApproveEnabled ? "bg-green-600 text-white hover:bg-green-700" : "bg-stone-200 text-stone-800 hover:bg-stone-300"}`}
        >
          {autoApproveLoading ? "Đang cập nhật..." : autoApproveEnabled ? "Đang bật" : "Đang tắt"}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="text"
              placeholder="Tìm theo nội dung, email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 bg-white focus:outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Pending">Chờ duyệt</option>
              <option value="Approved">Đã duyệt</option>
              <option value="Rejected">Bị từ chối</option>
            </select>
            <button
              onClick={() => {
                setShowAllMode((prev) => !prev);
                setPage(1);
              }}
              className="px-3 py-2 border border-blue-200 text-blue-700 bg-blue-50 rounded-lg text-sm"
            >
              {showAllMode ? "Xem theo trang" : "Xem toàn bộ"}
            </button>
            <button
              onClick={() => void handleDeleteAll()}
              className="px-3 py-2 border border-red-300 text-red-800 bg-red-100 rounded-lg text-sm flex items-center gap-1"
            >
              <Trash2 size={14} /> Xóa toàn bộ danh sách
            </button>
          </div>
        </div>

        {error ? <div className="p-4 text-sm text-red-600">{error}</div> : null}
        {loading ? <div className="p-4 text-sm text-stone-500">Đang tải dữ liệu...</div> : null}

        {!loading ? (
          <div className="divide-y divide-stone-100">
            {Object.entries(
              filteredItems.reduce<Record<string, CommentItem[]>>((acc, item) => {
                const key = `${item.targetType}-${item.targetId}`;
                if (!acc[key]) {
                  acc[key] = [];
                }
                acc[key].push(item);
                return acc;
              }, {})
            ).map(([groupKey, comments]) => (
              <div key={groupKey} className="p-4 border-b border-stone-100">
                <div className="mb-3 text-sm font-semibold text-stone-700">
                  {targetLabel(comments[0])}
                </div>
                <div className="space-y-3">
                  {comments.map((comment) => {
                    const status = normalizeStatus(comment.status);
                    return (
                      <div key={comment.id} className={`p-4 flex flex-col lg:flex-row gap-4 rounded-xl border border-stone-100 ${status === "Pending" ? "bg-yellow-50/30" : "bg-white"}`}>
                        <div className="lg:w-1/4 shrink-0">
                          <div className="font-semibold text-stone-800">{comment.userName}</div>
                          <div className="text-xs text-stone-500">{comment.email}</div>
                          <div className="text-xs text-stone-400 mt-1">{toDate(comment.createdAt)}</div>
                        </div>

                        <div className="lg:w-2/4">
                          <p className="text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-100 mb-3">{comment.content}</p>
                          <a href={targetUrl(comment)} className="font-medium text-blue-600 hover:underline inline-flex items-center gap-1 text-xs" target="_blank" rel="noreferrer">
                            Xem nội dung liên quan <ExternalLink size={12} />
                          </a>
                        </div>

                        <div className="lg:w-1/4 flex items-start lg:justify-end gap-2 shrink-0 flex-wrap">
                          {status === "Pending" ? (
                            <>
                              <button onClick={() => void handleApprove(comment.id)} className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1.5">
                                <CheckCircle size={16} /> Duyệt
                              </button>
                              <button onClick={() => void handleReject(comment.id)} className="px-4 py-2 bg-orange-50 text-orange-700 hover:bg-orange-600 hover:text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1.5">
                                <XCircle size={16} /> Từ chối
                              </button>
                            </>
                          ) : status === "Approved" ? (
                            <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center gap-1.5">
                              <CheckCircle size={16} /> Đã duyệt
                            </span>
                          ) : (
                            <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium flex items-center gap-1.5">
                              <XCircle size={16} /> Đã từ chối
                            </span>
                          )}

                          <button onClick={() => void handleDeleteOne(comment.id)} className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1.5">
                            <Trash2 size={16} /> Xóa
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredItems.length === 0 ? <div className="p-6 text-sm text-stone-500">Không có bình luận nào.</div> : null}
          </div>
        ) : null}

        {!loading && !showAllMode ? (
          <PaginationControls
            page={page}
            pageSize={pageSize}
            total={total}
            totalPages={totalPages}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
            className="border-stone-100"
          />
        ) : null}
      </div>
    </div>
  );
}
