import { motion } from "motion/react";
import { FileText, CheckCircle, Clock, Info, Shield, Search, Paperclip, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { serviceApplicationService, PublicServiceItem, ServiceApplicationItem, ServiceFormField } from "../services/service-application.service";

type ServiceTemplate = {
  title: string;
  hint: string;
  templateUrl?: string | null;
  requiredDocuments?: string | null;
  fields: ServiceFormField[];
};

type UploadedAttachment = {
  id: string;
  url: string;
  fileName: string;
  sizeBytes: number;
  contentType: string;
};

type SubmittedPrintData = {
  applicationId: string;
  submittedAt: string;
  dueAt: string;
  serviceName: string;
  templateTitle: string;
  receivingOffice: string;
  applicant: string;
  email: string;
  phone: string;
  address: string;
  note: string;
  requiredDocuments: string;
  dynamicEntries: Array<{ label: string; value: string }>;
  attachmentUrls: string[];
};

const DEFAULT_TEMPLATE: ServiceTemplate = {
  title: "Mẫu thông tin hồ sơ",
  hint: "Biểu mẫu tiêu chuẩn cho các thủ tục khác.",
  templateUrl: null,
  requiredDocuments: "Mang theo CCCD/Hộ chiếu còn hiệu lực và giấy tờ liên quan đến thủ tục đã đăng ký.",
  fields: [
    { key: "requestContent", label: "Nội dung yêu cầu", required: true, type: "textarea" },
    { key: "attachedInfo", label: "Thông tin giấy tờ đính kèm", required: false, type: "text" },
  ],
};

function normalizeVietnameseText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function isOrderedMatch(query: string, target: string): boolean {
  if (!query) return true;
  if (!target) return false;

  if (target.includes(query)) {
    return true;
  }

  let qIndex = 0;
  for (let tIndex = 0; tIndex < target.length && qIndex < query.length; tIndex += 1) {
    if (target[tIndex] === query[qIndex]) {
      qIndex += 1;
    }
  }

  return qIndex === query.length;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function allowPhoneControlKey(key: string): boolean {
  return ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"].includes(key);
}

function formatFileSize(sizeBytes: number): string {
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) return "0 B";
  if (sizeBytes < 1024) return `${sizeBytes} B`;
  if (sizeBytes < 1024 * 1024) return `${(sizeBytes / 1024).toFixed(1)} KB`;
  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getServiceTemplate(service: PublicServiceItem | null, serviceName: string): ServiceTemplate {
  const schema = service?.formSchema;
  if (!schema || !Array.isArray(schema.fields) || schema.fields.length === 0) {
    return DEFAULT_TEMPLATE;
  }

  return {
    title: schema.title?.trim() || `Biểu mẫu ${serviceName || service?.name || "dịch vụ công"}`,
    hint: schema.hint?.trim() || "Vui lòng điền đầy đủ thông tin theo biểu mẫu đã cấu hình.",
    templateUrl: schema.templateUrl?.trim() || null,
    requiredDocuments: schema.requiredDocuments?.trim() || DEFAULT_TEMPLATE.requiredDocuments,
    fields: schema.fields.map((field) => ({
      key: field.key,
      label: field.label,
      required: Boolean(field.required),
      type: field.type || "text",
      placeholder: field.placeholder || undefined,
    })),
  };
}

function handleTemplateDownload(serviceName: string, template: ServiceTemplate) {
  if (template.templateUrl) {
    window.open(template.templateUrl, "_blank", "noopener,noreferrer");
    return;
  }

  const printableHtml = `
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Biểu mẫu nộp hồ sơ</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
          .card { border: 1px solid #d1d5db; border-radius: 10px; padding: 14px; margin-bottom: 12px; }
          .label { font-weight: 700; margin-bottom: 6px; }
          .line { border-bottom: 1px solid #9ca3af; height: 24px; margin-bottom: 8px; }
          .title { font-size: 22px; font-weight: 800; margin-bottom: 6px; }
          .sub { color: #4b5563; margin-bottom: 18px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          .notice { background: #fff7ed; border: 1px solid #fdba74; border-radius: 10px; padding: 12px; }
          .fieldBlock { border: 1px solid #d1fae5; background: #ecfdf5; border-radius: 10px; padding: 12px; margin-top: 8px; }
          @media print { body { padding: 10px; } }
        </style>
      </head>
      <body>
        <div class="title">Nộp hồ sơ dịch vụ công</div>
        <div class="sub">${template.hint}</div>

        <div class="card">
          <div class="label">Thủ tục đã chọn</div>
          <div>${serviceName}</div>
        </div>

        <div class="grid">
          <div class="card"><div class="label">Họ tên / Tên tổ chức *</div><div class="line"></div></div>
          <div class="card"><div class="label">Email *</div><div class="line"></div></div>
          <div class="card"><div class="label">Số điện thoại *</div><div class="line"></div></div>
          <div class="card"><div class="label">Địa chỉ *</div><div class="line"></div></div>
        </div>

        <div class="fieldBlock">
          <div class="label">Biểu mẫu theo loại dịch vụ</div>
          ${template.fields
            .map(
              (field) => `<div class="card"><div class="label">${field.label}${field.required ? " *" : ""}</div><div class="line"></div><div class="line"></div></div>`
            )
            .join("")}
        </div>

        <div class="notice">
          <div class="label">Hồ sơ cần mang theo khi đến nộp trực tiếp</div>
          <div>${(template.requiredDocuments || "Mang theo giấy tờ tùy thân và hồ sơ liên quan theo hướng dẫn của bộ phận một cửa.").replace(/\n/g, "<br />")}</div>
        </div>
      </body>
    </html>`;

  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return;

  printWindow.document.open();
  printWindow.document.write(printableHtml);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function handleSubmittedApplicationPrint(data: SubmittedPrintData) {
  const printableHtml = `
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Phiếu hồ sơ dịch vụ công</title>
        <style>
          body { font-family: "Times New Roman", serif; padding: 24px; color: #111827; font-size: 14px; line-height: 1.45; }
          .header { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
          .headerCol { text-align: center; }
          .upper { text-transform: uppercase; font-weight: 700; }
          .underlined { border-bottom: 1px solid #111827; display: inline-block; padding-bottom: 2px; }
          .mainTitle { text-align: center; margin: 10px 0 14px; }
          .mainTitle h1 { margin: 0; font-size: 24px; text-transform: uppercase; }
          .mainTitle p { margin: 4px 0 0; font-style: italic; }
          .section { border: 1px solid #9ca3af; padding: 10px; margin-bottom: 10px; }
          .sectionTitle { font-weight: 700; text-transform: uppercase; margin-bottom: 6px; }
          .metaRow { margin: 3px 0; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .label { font-weight: 700; }
          .value { white-space: pre-wrap; word-break: break-word; }
          .table { width: 100%; border-collapse: collapse; margin-top: 6px; }
          .table th, .table td { border: 1px solid #9ca3af; padding: 6px; vertical-align: top; }
          .table th { text-align: left; }
          .attachments { margin: 6px 0 0 20px; }
          .noteBox { border: 1px dashed #6b7280; min-height: 70px; padding: 8px; }
          .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
          .signBox { text-align: center; min-height: 120px; }
          .signTitle { font-weight: 700; text-transform: uppercase; }
          .signHint { font-style: italic; margin-top: 2px; }
          .dateLine { text-align: right; margin-top: 12px; font-style: italic; }
          @media print { body { padding: 8px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="headerCol">
            <div class="upper">UBND PHƯỜNG/XÃ SA ĐÉC</div>
            <div class="underlined">BỘ PHẬN TIẾP NHẬN VÀ TRẢ KẾT QUẢ</div>
          </div>
          <div class="headerCol">
            <div class="upper">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div class="underlined">Độc lập - Tự do - Hạnh phúc</div>
          </div>
        </div>

        <div class="mainTitle">
          <h1>Phiếu biên nhận hồ sơ</h1>
          <p>(Dịch vụ công trực tuyến)</p>
        </div>

        <div class="section">
          <div class="sectionTitle">I. Thông tin tiếp nhận</div>
          <div class="metaRow"><span class="label">Mã hồ sơ:</span> ${escapeHtml(data.applicationId)}</div>
          <div class="metaRow"><span class="label">Thời điểm nộp:</span> ${escapeHtml(data.submittedAt)}</div>
          <div class="metaRow"><span class="label">Hạn giải quyết dự kiến:</span> ${escapeHtml(data.dueAt)}</div>
          <div class="metaRow"><span class="label">Nơi tiếp nhận:</span> ${escapeHtml(data.receivingOffice)}</div>
          <div class="metaRow"><span class="label">Thủ tục:</span> ${escapeHtml(data.serviceName)}</div>
          <div class="metaRow"><span class="label">Tên biểu mẫu:</span> ${escapeHtml(data.templateTitle)}</div>
        </div>

        <div class="section">
          <div class="sectionTitle">II. Thông tin người nộp</div>
          <div class="grid">
            <div><span class="label">Họ tên/Tên tổ chức:</span> <span class="value">${escapeHtml(data.applicant)}</span></div>
            <div><span class="label">Email:</span> <span class="value">${escapeHtml(data.email)}</span></div>
            <div><span class="label">Số điện thoại:</span> <span class="value">${escapeHtml(data.phone)}</span></div>
            <div><span class="label">Địa chỉ:</span> <span class="value">${escapeHtml(data.address)}</span></div>
          </div>
        </div>

        <div class="section">
          <div class="sectionTitle">III. Nội dung hồ sơ đã nộp</div>
          <table class="table">
            <thead>
              <tr>
                <th style="width: 40px;">STT</th>
                <th style="width: 30%;">Trường thông tin</th>
                <th>Nội dung</th>
              </tr>
            </thead>
            <tbody>
              ${data.dynamicEntries.length > 0
                ? data.dynamicEntries
                    .map(
                      (entry, index) => `<tr><td>${index + 1}</td><td>${escapeHtml(entry.label)}</td><td>${escapeHtml(entry.value)}</td></tr>`
                    )
                    .join("")
                : `<tr><td>1</td><td>Thông tin biểu mẫu</td><td>Không có nội dung bổ sung.</td></tr>`}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="sectionTitle">IV. Ghi chú người nộp</div>
          <div class="value">${escapeHtml(data.note || "Không có")}</div>
        </div>

        <div class="section">
          <div class="sectionTitle">V. Thành phần hồ sơ và tệp đính kèm</div>
          <div class="metaRow"><span class="label">Hồ sơ cần mang theo:</span> ${escapeHtml(data.requiredDocuments || "Mang theo giấy tờ tùy thân và hồ sơ liên quan theo hướng dẫn của bộ phận một cửa.")}</div>
          <div class="metaRow"><span class="label">Danh sách tệp đính kèm trực tuyến:</span></div>
          ${data.attachmentUrls.length > 0
            ? `<ul class="attachments">${data.attachmentUrls.map((url) => `<li>${escapeHtml(url)}</li>`).join("")}</ul>`
            : `<div class="value">Không có tệp đính kèm.</div>`}
        </div>

        <div class="section">
          <div class="sectionTitle">VI. Ghi chú cán bộ tiếp nhận</div>
          <div class="noteBox"></div>
        </div>

        <div class="dateLine">Ngày ..... tháng ..... năm ..........</div>
        <div class="signatures">
          <div class="signBox">
            <div class="signTitle">Người nộp hồ sơ</div>
            <div class="signHint">(Ký, ghi rõ họ tên)</div>
          </div>
          <div class="signBox">
            <div class="signTitle">Cán bộ tiếp nhận</div>
            <div class="signHint">(Ký, ghi rõ họ tên)</div>
          </div>
        </div>
      </body>
    </html>`;

  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return;

  printWindow.document.open();
  printWindow.document.write(printableHtml);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

export function Services() {
  const [activeTab, setActiveTab] = useState("dichvu");
  const [servicesList, setServicesList] = useState<PublicServiceItem[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [serviceQuery, setServiceQuery] = useState("");

  const [submitForm, setSubmitForm] = useState({
    serviceName: "",
    applicant: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });
  const [selectedService, setSelectedService] = useState<PublicServiceItem | null>(null);
  const [dynamicValues, setDynamicValues] = useState<Record<string, string>>({});
  const [uploadedAttachments, setUploadedAttachments] = useState<UploadedAttachment[]>([]);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastSubmittedPrintData, setLastSubmittedPrintData] = useState<SubmittedPrintData | null>(null);

  const [lookupId, setLookupId] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lookupResult, setLookupResult] = useState<ServiceApplicationItem | null>(null);

  const selectedTemplate = useMemo(
    () => getServiceTemplate(selectedService, submitForm.serviceName || selectedService?.name || ""),
    [selectedService, submitForm.serviceName]
  );

  useEffect(() => {
    const loadServices = async () => {
      setServicesLoading(true);
      setServicesError(null);
      try {
        const response = await serviceApplicationService.getPublicServices();
        setServicesList(Array.isArray(response) ? response : []);
      } catch {
        setServicesError("Không tải được danh sách thủ tục.");
      } finally {
        setServicesLoading(false);
      }
    };

    void loadServices();
  }, []);

  const filteredServices = useMemo(() => {
    if (!serviceQuery.trim()) return servicesList;
    const q = normalizeVietnameseText(serviceQuery);
    return servicesList.filter((item) => {
      const normalizedName = normalizeVietnameseText(item.name || "");
      const normalizedDescription = normalizeVietnameseText(item.description || "");
      return isOrderedMatch(q, normalizedName) || isOrderedMatch(q, normalizedDescription);
    });
  }, [servicesList, serviceQuery]);

  const handleSubmitApplication = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedService && !submitForm.serviceName.trim()) {
      setSubmitError("Vui lòng chọn thủ tục trong Danh sách dịch vụ trước khi nộp.");
      return;
    }

    if (!submitForm.applicant.trim() || !submitForm.email.trim() || !submitForm.phone.trim() || !submitForm.address.trim()) {
      setSubmitError("Vui lòng nhập đầy đủ Họ tên/Tổ chức, Email, Số điện thoại và Địa chỉ.");
      return;
    }

    const applicant = submitForm.applicant.trim();
    const email = submitForm.email.trim();
    const phone = submitForm.phone.trim();
    const address = submitForm.address.trim();
    const note = submitForm.note.trim();

    if (applicant.length < 2 || applicant.length > 250) {
      setSubmitError("Họ tên/Tên tổ chức phải từ 2 đến 250 ký tự.");
      return;
    }

    if (!isValidEmail(email)) {
      setSubmitError("Email không đúng định dạng.");
      return;
    }

    if (!/^\d{8,15}$/.test(phone)) {
      setSubmitError("Số điện thoại chỉ được chứa chữ số và có độ dài từ 8 đến 15 số.");
      return;
    }

    if (address.length > 500) {
      setSubmitError("Địa chỉ không được vượt quá 500 ký tự.");
      return;
    }

    if (note.length > 2000) {
      setSubmitError("Ghi chú không được vượt quá 2000 ký tự.");
      return;
    }

    const missingDynamic = selectedTemplate.fields.find((field) => field.required && !String(dynamicValues[field.key] || "").trim());
    if (missingDynamic) {
      setSubmitError(`Vui lòng nhập trường bắt buộc: ${missingDynamic.label}.`);
      return;
    }

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitMessage(null);
    try {
      const dynamicDetails = selectedTemplate.fields
        .map((field) => {
          const value = (dynamicValues[field.key] || "").trim();
          if (!value) return null;
          return `- ${field.label}: ${value}`;
        })
        .filter(Boolean)
        .join("\n");

      const finalNote = [
        note || null,
        dynamicDetails ? `Thông tin biểu mẫu:\n${dynamicDetails}` : null,
      ]
        .filter(Boolean)
        .join("\n\n");

      const dynamicEntries = selectedTemplate.fields
        .map((field) => ({
          label: field.label,
          value: (dynamicValues[field.key] || "").trim(),
        }))
        .filter((item) => Boolean(item.value));

      const attachmentUrls = uploadedAttachments.map((item) => item.url);

      const created = await serviceApplicationService.submit({
        serviceName: (selectedService?.name || submitForm.serviceName).trim(),
        applicant,
        phone: phone || undefined,
        email,
        address: address || undefined,
        note: finalNote || undefined,
        attachmentUrls,
      });

      setLastSubmittedPrintData({
        applicationId: created.id,
        submittedAt: formatDateTime(created.submittedAt),
        dueAt: formatDateTime(created.dueAt),
        serviceName: (selectedService?.name || submitForm.serviceName).trim(),
        templateTitle: selectedTemplate.title,
        receivingOffice: "Bộ phận Tiếp nhận và Trả kết quả UBND phường/xã Sa Đéc",
        applicant,
        email,
        phone,
        address,
        note,
        requiredDocuments: selectedTemplate.requiredDocuments || "",
        dynamicEntries,
        attachmentUrls,
      });

      setSubmitMessage(`Nộp hồ sơ thành công. Mã hồ sơ: ${created.id}. Hạn giải quyết dự kiến: ${formatDateTime(created.dueAt)}.`);
      setLookupId(created.id);
      setSubmitForm({ serviceName: "", applicant: "", phone: "", email: "", address: "", note: "" });
      setSelectedService(null);
      setDynamicValues({});
      setUploadedAttachments([]);
    } catch {
      setSubmitError("Nộp hồ sơ thất bại.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleUploadAttachmentFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setAttachmentError(null);
    setIsUploadingAttachment(true);
    try {
      const selectedFiles = Array.from(files);
      const uploadedItems = await Promise.all(selectedFiles.map((file) => serviceApplicationService.uploadAttachment(file)));
      setUploadedAttachments((prev) => {
        const next = [...prev];
        uploadedItems.forEach((item) => {
          if (!next.some((existing) => existing.url === item.url)) {
            next.push(item);
          }
        });
        return next;
      });
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message as string | undefined;
      setAttachmentError(serverMessage || "Tải tệp thất bại. Vui lòng thử lại.");
    } finally {
      setIsUploadingAttachment(false);
    }
  };

  const handleRemoveAttachment = (url: string) => {
    setUploadedAttachments((prev) => prev.filter((item) => item.url !== url));
  };

  const handleLookup = async () => {
    if (!lookupId.trim()) {
      setLookupError("Vui lòng nhập mã hồ sơ.");
      return;
    }

    setLookupLoading(true);
    setLookupError(null);
    setLookupResult(null);
    try {
      const item = await serviceApplicationService.getById(lookupId.trim());
      setLookupResult(item);
    } catch {
      setLookupError("Không tìm thấy hồ sơ.");
    } finally {
      setLookupLoading(false);
    }
  };

  const statusLabel = (status: string) => {
    if (status === "pending") return "Chờ tiếp nhận";
    if (status === "processing") return "Đang xử lý";
    if (status === "completed") return "Đã giải quyết thành công";
    if (status === "rejected") return "Từ chối";
    return status;
  };

  const formatDateTime = (value: string) => {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("vi-VN");
  };

  return (
    <div className="w-full bg-stone-50 min-h-screen pb-20">
      <div className="bg-emerald-900 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Dịch vụ công trực tuyến</h1>
        <p className="text-emerald-100 max-w-2xl mx-auto px-4">Cổng thông tin một cửa: nộp hồ sơ, tra cứu tiến độ, nhận thông báo từ UBND phường/xã.</p>
      </div>

      <div className="container mx-auto px-4 mt-8 max-w-5xl">
        <div className="flex bg-white rounded-2xl shadow-sm border border-stone-100 p-2 mb-8 w-fit mx-auto">
          <button 
            onClick={() => setActiveTab("dichvu")}
            className={`px-8 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "dichvu" 
                ? "bg-emerald-50 text-emerald-700 shadow-sm" 
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            Danh sách dịch vụ
          </button>
          <button 
            onClick={() => setActiveTab("tracuu")}
            className={`px-8 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "tracuu" 
                ? "bg-emerald-50 text-emerald-700 shadow-sm" 
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            Tra cứu hồ sơ
          </button>
        </div>

        {activeTab === "dichvu" ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-stone-800">Thủ tục hiện có</h2>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Tìm kiếm thủ tục..." 
                  value={serviceQuery}
                  onChange={(e) => setServiceQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-emerald-500 bg-white"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
              </div>
            </div>

            {servicesError ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{servicesError}</div> : null}
            {servicesLoading ? <div className="rounded-xl border border-stone-200 bg-white p-4 text-sm text-stone-600">Đang tải thủ tục...</div> : null}

            {!servicesLoading ? filteredServices.map((service, i) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:border-emerald-200 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-800 mb-2">{service.name}</h3>
                    <p className="text-sm text-stone-600 mb-2">{service.description || "Đang cập nhật mô tả."}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="flex items-center gap-1 text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                        <Shield size={14} /> {service.isActive ? "Đang hoạt động" : "Ngưng hoạt động"}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                        <Clock size={14} /> Cập nhật: {formatDateTime(service.updatedAt)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleTemplateDownload(service.name, getServiceTemplate(service, service.name))}
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 rounded-full"
                      >
                        In biểu mẫu (PDF)
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSubmitForm((prev) => ({ ...prev, serviceName: service.name }));
                    setSelectedService(service);
                    const nextTemplate = getServiceTemplate(service, service.name);
                    const nextDynamicValues: Record<string, string> = {};
                    nextTemplate.fields.forEach((field) => {
                      nextDynamicValues[field.key] = "";
                    });
                    setDynamicValues(nextDynamicValues);
                    setSubmitError(null);
                    setSubmitMessage(null);
                    setActiveTab("nophoso");
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors whitespace-nowrap self-start md:self-auto"
                >
                  Chọn mẫu và nộp
                </button>
              </motion.div>
            )) : null}

            {!servicesLoading && filteredServices.length === 0 ? (
              <div className="rounded-xl border border-stone-200 bg-white p-4 text-sm text-stone-600">
                Chưa có thủ tục nào được cấu hình. Vui lòng thêm thủ tục ở trang quản trị để người dân có thể chọn và nộp đúng biểu mẫu.
              </div>
            ) : null}
          </motion.div>
        ) : activeTab === "nophoso" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl shadow-lg border border-stone-100 p-8 md:p-10"
          >
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Nộp hồ sơ dịch vụ công</h2>
            <p className="text-stone-500 mb-8">Chọn đúng thủ tục để hệ thống hiển thị biểu mẫu phù hợp theo từng loại dịch vụ công.</p>

            <form onSubmit={handleSubmitApplication} className="space-y-4 max-w-3xl">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-700">Thủ tục đã chọn *</label>
                <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">
                  {selectedService?.name || submitForm.serviceName || "Chưa chọn thủ tục. Vui lòng quay lại tab Danh sách dịch vụ và bấm Chọn mẫu và nộp."}
                </div>
                {selectedService?.description ? (
                  <div className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-600">
                    <span className="font-semibold text-stone-700">Mô tả thủ tục:</span> {selectedService.description}
                  </div>
                ) : null}
                <div className="text-sm text-stone-600">
                  Mẫu đang áp dụng: <span className="font-bold text-emerald-700 text-base">{selectedTemplate.title}</span>
                </div>
                <div className="text-sm text-stone-500">{selectedTemplate.hint}</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleTemplateDownload(selectedService?.name || submitForm.serviceName || "dịch vụ", selectedTemplate)}
                    className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                  >
                    In biểu mẫu (PDF)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Họ tên / Tên tổ chức *</label>
                  <input
                    value={submitForm.applicant}
                    onChange={(e) => setSubmitForm((prev) => ({ ...prev, applicant: e.target.value }))}
                    maxLength={250}
                    placeholder="Nhập họ tên hoặc tên tổ chức"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Email *</label>
                  <input
                    type="email"
                    value={submitForm.email}
                    onChange={(e) => setSubmitForm((prev) => ({ ...prev, email: e.target.value }))}
                    maxLength={200}
                    placeholder="Nhập email nhận thông báo"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Số điện thoại *</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={submitForm.phone}
                    onKeyDown={(e) => {
                      if (allowPhoneControlKey(e.key) || /^\d$/.test(e.key)) {
                        return;
                      }
                      e.preventDefault();
                    }}
                    onChange={(e) => {
                      const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 15);
                      setSubmitForm((prev) => ({ ...prev, phone: onlyDigits }));
                    }}
                    placeholder="Nhập số điện thoại"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Địa chỉ *</label>
                  <input
                    value={submitForm.address}
                    onChange={(e) => setSubmitForm((prev) => ({ ...prev, address: e.target.value }))}
                    maxLength={500}
                    placeholder="Nhập địa chỉ liên hệ"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 space-y-3">
                <h3 className="font-semibold text-emerald-800">Biểu mẫu theo loại dịch vụ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTemplate.fields.map((field) => (
                    <div key={field.key} className={`space-y-2 ${field.type === "textarea" ? "md:col-span-2" : ""}`}>
                      <label className="text-sm font-semibold text-stone-700">{field.label}{field.required ? " *" : ""}</label>
                      {field.type === "textarea" ? (
                        <textarea
                          value={dynamicValues[field.key] || ""}
                          onChange={(e) => setDynamicValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                          placeholder={field.placeholder || `Nhập ${field.label.toLowerCase()}`}
                          rows={3}
                          maxLength={2000}
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 resize-none"
                        ></textarea>
                      ) : (
                        <input
                          type={field.type === "date" ? "date" : "text"}
                          value={dynamicValues[field.key] || ""}
                          onChange={(e) => setDynamicValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                          placeholder={field.placeholder || `Nhập ${field.label.toLowerCase()}`}
                          maxLength={500}
                          className="w-full px-4 py-3 rounded-xl border border-stone-200"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <span className="font-semibold">Hồ sơ cần mang theo khi đến nộp trực tiếp:</span>
                <p className="mt-1 whitespace-pre-line">{selectedTemplate.requiredDocuments || "Mang theo giấy tờ tùy thân và hồ sơ liên quan theo hướng dẫn của bộ phận một cửa."}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-700">Ghi chú</label>
                <textarea
                  value={submitForm.note}
                  onChange={(e) => setSubmitForm((prev) => ({ ...prev, note: e.target.value }))}
                  placeholder="Mô tả thêm tình trạng hồ sơ hoặc thông tin cần hỗ trợ"
                  rows={4}
                  maxLength={2000}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 resize-none"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-700">File đính kèm (không bắt buộc)</label>
                <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50">
                      <Paperclip size={16} />
                      Chọn file để tải lên
                      <input
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.webp,.gif,.pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => {
                          void handleUploadAttachmentFiles(e.target.files);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    <span className="text-xs text-stone-500">Hỗ trợ JPG, PNG, PDF, DOC, DOCX (tối đa 10MB/tệp)</span>
                  </div>

                  {isUploadingAttachment ? <div className="text-sm text-stone-600">Đang tải file...</div> : null}
                  {attachmentError ? <div className="text-sm text-red-700">{attachmentError}</div> : null}

                  {uploadedAttachments.length > 0 ? (
                    <ul className="space-y-2">
                      {uploadedAttachments.map((file) => (
                        <li key={file.url} className="flex items-center justify-between rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm">
                          <a href={file.url} target="_blank" rel="noreferrer" className="truncate text-emerald-700 hover:underline">
                            {file.fileName}
                          </a>
                          <div className="ml-3 flex items-center gap-2 text-stone-500">
                            <span>{formatFileSize(file.sizeBytes)}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveAttachment(file.url)}
                              className="rounded p-1 text-stone-500 hover:bg-stone-200 hover:text-stone-700"
                              aria-label="Xóa file đính kèm"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-sm text-stone-500">Chưa có file đính kèm.</div>
                  )}
                </div>
              </div>

              {submitError ? <div className="text-sm text-red-700">{submitError}</div> : null}
              {submitMessage ? <div className="text-sm text-emerald-700">{submitMessage}</div> : null}

              <div className="flex flex-wrap gap-3">
                <button disabled={submitLoading} className="bg-emerald-700 hover:bg-emerald-800 text-white px-7 py-3 rounded-xl font-semibold disabled:opacity-60">
                  {submitLoading ? "Đang nộp..." : "Nộp hồ sơ"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("dichvu")}
                  className="px-7 py-3 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50"
                >
                  Chọn lại thủ tục
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("tracuu")}
                  className="px-7 py-3 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50"
                >
                  Sang tra cứu hồ sơ
                </button>
                {lastSubmittedPrintData ? (
                  <button
                    type="button"
                    onClick={() => handleSubmittedApplicationPrint(lastSubmittedPrintData)}
                    className="px-7 py-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                  >
                    In phiếu hồ sơ đã nộp (PDF)
                  </button>
                ) : null}
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl shadow-lg border border-stone-100 p-8 md:p-12 text-center"
          >
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={40} />
              </div>
              <h2 className="text-2xl font-bold text-stone-800 mb-2">Tra cứu trạng thái hồ sơ</h2>
              <p className="text-stone-500 mb-8">Nhập mã hồ sơ đã được cấp để kiểm tra tiến độ xử lý.</p>
              
              <div className="space-y-3 text-left">
                <h3 className="font-semibold text-stone-700">Tra cứu trạng thái hồ sơ</h3>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input 
                    type="text"
                    value={lookupId}
                    onChange={(e) => setLookupId(e.target.value)}
                    placeholder="Nhập mã hồ sơ (VD: HS-20260402153000)" 
                    className="w-full px-6 py-4 rounded-xl border-2 border-stone-200 focus:outline-none focus:border-emerald-500 text-lg text-center font-medium tracking-wider"
                  />
                  <button
                    type="button"
                    disabled={lookupLoading}
                    onClick={() => void handleLookup()}
                    className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-md disabled:opacity-60"
                  >
                    {lookupLoading ? "Đang tra cứu..." : "Tra cứu"}
                  </button>
                </div>

                {lookupError ? <div className="text-sm text-red-700">{lookupError}</div> : null}
                {lookupResult ? (
                  <div className="rounded-xl border border-stone-200 bg-white p-4 text-sm text-stone-700 space-y-1">
                    <div><span className="font-semibold">Mã hồ sơ:</span> {lookupResult.id}</div>
                    <div><span className="font-semibold">Thủ tục:</span> {lookupResult.serviceName}</div>
                    <div><span className="font-semibold">Người nộp:</span> {lookupResult.applicant}</div>
                    <div><span className="font-semibold">Trạng thái:</span> {statusLabel(lookupResult.status)}</div>
                    <div><span className="font-semibold">Hạn giải quyết:</span> {formatDateTime(lookupResult.dueAt)}</div>
                    <div>
                      <span className="font-semibold">Tiến độ hạn:</span>{" "}
                      {lookupResult.isOverdue && lookupResult.status !== "completed" && lookupResult.status !== "rejected" ? (
                        <span className="text-red-700 font-semibold">Đã quá hạn</span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">Trong thời hạn</span>
                      )}
                    </div>
                    <div><span className="font-semibold">Cập nhật:</span> {formatDateTime(lookupResult.updatedAt)}</div>
                    {lookupResult.note ? <div><span className="font-semibold">Ghi chú:</span> {lookupResult.note}</div> : null}
                    {lookupResult.attachmentUrls?.length ? (
                      <div>
                        <span className="font-semibold">Tệp đính kèm:</span>
                        <ul className="mt-1 space-y-1">
                          {lookupResult.attachmentUrls.map((url) => (
                            <li key={url}>
                              <a href={url} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">{url}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="mt-12 text-left bg-stone-50 p-6 rounded-2xl">
                <h3 className="font-semibold text-stone-700 flex items-center gap-2 mb-4">
                  <Info size={18} className="text-emerald-600" /> Hướng dẫn
                </h3>
                <ul className="space-y-3 text-sm text-stone-600">
                  <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" /> Mã hồ sơ được cấp qua email/SMS sau khi nộp thành công.</li>
                  <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" /> Hệ thống cập nhật trạng thái theo thời gian thực.</li>
                  <li className="flex gap-2"><CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" /> Vui lòng mang theo CMND/CCCD/Hộ chiếu khi đến nhận kết quả trực tiếp.</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
