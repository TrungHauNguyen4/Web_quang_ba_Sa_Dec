import { useEffect, useState } from "react";
import { Plus, Search, Shield, User, X } from "lucide-react";
import { userService } from "../../services/user.service";
import { PaginationControls } from "../../components/ui/PaginationControls";

type UserItem = {
  id: string;
  displayName: string;
  email: string;
  userName: string;
  role: string;
  createdAt: string;
};

export function AdminUsers() {
  const [items, setItems] = useState<UserItem[]>([]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    displayName: "",
    email: "",
    userName: "",
    password: "",
    role: "Editor",
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getAll({
        page,
        pageSize,
        q: query || undefined,
        role: roleFilter === "all" ? undefined : roleFilter,
      });
      setItems(Array.isArray(response?.items) ? response.items : []);
      setTotal(Number(response?.total) || 0);
      setTotalPages(Number(response?.totalPages) || 0);
    } catch {
      setError("Không tải được danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [roleFilter, page, pageSize]);

  const getRoleBadge = (role: string) => {
    if (role === "Admin") {
      return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold flex items-center w-fit gap-1.5"><Shield size={12} /> Quản trị</span>;
    }
    if (role === "Editor") {
      return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold flex items-center w-fit gap-1.5"><User size={12} /> Biên tập</span>;
    }
    return <span className="px-2.5 py-1 bg-stone-100 text-stone-700 rounded-md text-xs font-bold flex items-center w-fit gap-1.5"><User size={12} /> Chưa gán</span>;
  };

  const handleCreate = async () => {
    if (!form.displayName || !form.email || !form.userName || !form.password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      await userService.create(form);
      setIsModalOpen(false);
      setForm({ displayName: "", email: "", userName: "", password: "", role: "Editor" });
      await loadData();
    } catch {
      setError("Tạo tài khoản thất bại.");
    }
  };

  const handleDelete = async (user: UserItem) => {
    if (user.role === "Admin") {
      setError("Không được xóa tài khoản Admin.");
      return;
    }
    const ok = window.confirm(`Xóa tài khoản ${user.displayName}?`);
    if (!ok) return;

    try {
      await userService.remove(user.id);
      await loadData();
    } catch {
      setError("Xóa tài khoản thất bại.");
    }
  };

  const handleRoleChange = async (user: UserItem, role: string) => {
    try {
      await userService.updateRole(user.id, role);
      await loadData();
    } catch {
      setError("Cập nhật vai trò thất bại.");
    }
  };

  const toDate = (value: string) => {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("vi-VN");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Người dùng và phân quyền</h1>
          <p className="text-sm text-stone-500">Quản lý tài khoản theo vai trò Quản trị/Biên tập</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-stone-800 hover:bg-stone-900 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2">
          <Plus size={18} /> Thêm người dùng
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm tài khoản..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setPage(1);
                  void loadData();
                }
              }}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 bg-white focus:outline-none w-full sm:w-auto"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="Admin">Quản trị</option>
              <option value="Editor">Biên tập</option>
            </select>
            <button
              onClick={() => {
                setPage(1);
                void loadData();
              }}
              className="px-3 py-2 border border-stone-200 rounded-lg text-sm"
            >
              Tải lại
            </button>
          </div>
        </div>

        {error ? <div className="p-4 text-sm text-red-600">{error}</div> : null}
        {loading ? <div className="p-4 text-sm text-stone-500">Đang tải dữ liệu...</div> : null}

        {!loading ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/50 text-stone-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Tài khoản</th>
                  <th className="p-4 font-semibold">Vai trò</th>
                  <th className="p-4 font-semibold">Ngày tạo</th>
                  <th className="p-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {items.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-50/30 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-stone-800">{user.displayName}</div>
                      <div className="text-xs text-stone-500">{user.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getRoleBadge(user.role)}
                        <select
                          value={user.role}
                          onChange={(e) => void handleRoleChange(user, e.target.value)}
                          className="border border-stone-200 rounded px-2 py-1 text-xs"
                        >
                          {user.role !== "Admin" && user.role !== "Editor" ? <option value={user.role}>Chưa gán</option> : null}
                          <option value="Admin">Quản trị</option>
                          <option value="Editor">Biên tập</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-4 text-stone-500">{toDate(user.createdAt)}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => void handleDelete(user)} className="px-3 py-1.5 bg-red-50 text-red-700 rounded text-xs">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {!loading ? (
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

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/40" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-stone-800">Thêm người dùng mới</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-stone-400 hover:bg-stone-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} placeholder="Họ và tên" className="w-full px-4 py-2.5 rounded-lg border border-stone-200" />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full px-4 py-2.5 rounded-lg border border-stone-200" />
              <input value={form.userName} onChange={(e) => setForm({ ...form, userName: e.target.value })} placeholder="UserName" className="w-full px-4 py-2.5 rounded-lg border border-stone-200" />
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Mật khẩu" className="w-full px-4 py-2.5 rounded-lg border border-stone-200" />
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-stone-200">
                <option value="Editor">Biên tập</option>
                <option value="Admin">Quản trị</option>
              </select>
            </div>
            <div className="p-6 border-t border-stone-100 flex justify-end gap-3 bg-stone-50 rounded-b-2xl">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-lg font-medium text-stone-600 hover:bg-stone-200">Hủy</button>
              <button onClick={() => void handleCreate()} className="px-6 py-2.5 rounded-lg font-medium bg-stone-800 text-white hover:bg-stone-900">Tạo tài khoản</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
