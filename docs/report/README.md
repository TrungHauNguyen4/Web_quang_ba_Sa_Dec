# Báo cáo LaTeX (không gồm trang bìa)

- File chính: `report.tex`
- Thư mục ảnh: `figures/`

## Cách build PDF

### Cách 1: XeLaTeX (khuyến nghị)
Yêu cầu: cài TeX Live hoặc MiKTeX có `xelatex`.

Chạy trong thư mục `docs/report/`:

```bash
xelatex report.tex
xelatex report.tex
```

> Chạy 2 lần để cập nhật mục lục/ danh sách hình.

### Cách 2: VS Code LaTeX Workshop
- Mở `report.tex`.
- Chọn Recipe `XeLaTeX`.

## Chèn ảnh
- Copy ảnh vào `docs/report/figures/` theo đúng tên gợi ý trong phụ lục.
- Hoặc đổi tên file trong các `\ImagePlaceholder{...}{ten_anh.png}{...}`.

## Trang bìa
Theo yêu cầu, bạn tự làm trang bìa.
Nếu muốn, bạn có thể tạo `cover.tex` và mở dòng `\input{cover.tex}` ở đầu file `report.tex`.
